/* eslint-disable @typescript-eslint/naming-convention, jsdoc/require-param, jsdoc/require-returns */
import { cleanFBXName, findDocumentNode, getPropertyValue, getSafeFBXObjectId } from "../types/fbxTypes.js";
/**
 * Build a connection graph from a parsed FBX document.
 * Maps object IDs to their FBXNode and resolves parent-child relationships.
 */
export function resolveConnections(doc) {
    const objects = new Map();
    const objectEntries = [];
    const childrenOf = new Map();
    const parentOf = new Map();
    const connections = [];
    const connectionEntries = [];
    const diagnostics = [];
    const legacyIds = new Map();
    const syntheticLegacyIds = new Map();
    let nextLegacyId = -1;
    const getLegacyId = (name) => {
        let id = legacyIds.get(name);
        if (id === undefined) {
            id = nextLegacyId--;
            legacyIds.set(name, id);
        }
        return id;
    };
    const getSyntheticLegacyId = (role, name) => {
        let idsByName = syntheticLegacyIds.get(role);
        if (!idsByName) {
            idsByName = new Map();
            syntheticLegacyIds.set(role, idsByName);
        }
        let id = idsByName.get(name);
        if (id === undefined) {
            id = nextLegacyId--;
            idsByName.set(name, id);
        }
        return id;
    };
    // Build object map from Objects section
    const objectsNode = findDocumentNode(doc, "Objects");
    if (objectsNode) {
        for (const obj of objectsNode.children) {
            const idProp = obj.properties[0];
            if (idProp) {
                const id = toObjectNumber(idProp.value);
                if (id !== undefined) {
                    objects.set(id, obj);
                    objectEntries.push({ id, node: obj, source: "Objects", synthetic: false });
                }
                else if (typeof idProp.value === "string") {
                    const legacyName = cleanFBXName(idProp.value);
                    const id = getLegacyId(legacyName);
                    const normalized = normalizeLegacyObject(obj, id);
                    objects.set(id, normalized);
                    objectEntries.push({ id, node: normalized, source: "Objects", legacyName, synthetic: false });
                    if (obj.name === "Model" && getPropertyValue(obj, 1) === "Mesh") {
                        const geometryId = getSyntheticLegacyId("Geometry", legacyName);
                        const geometry = createLegacyGeometry(obj, geometryId);
                        objects.set(geometryId, geometry);
                        objectEntries.push({ id: geometryId, node: geometry, source: "legacySyntheticGeometry", legacyName, synthetic: true });
                        addConnection(connections, childrenOf, parentOf, diagnostics, "OO", geometryId, id);
                    }
                }
            }
        }
    }
    // Parse connections
    const connectionsNode = findDocumentNode(doc, "Connections");
    if (connectionsNode) {
        for (const c of connectionsNode.children) {
            if (c.name !== "C" && c.name !== "Connect") {
                continue;
            }
            const connectionIndex = connectionEntries.length;
            const type = getPropertyValue(c, 0);
            const childIdRaw = c.properties[1]?.value;
            const parentIdRaw = c.properties[2]?.value;
            const entry = {
                source: c.name,
                rawType: type,
                accepted: false,
            };
            connectionEntries.push(entry);
            if (type !== "OO" && type !== "OP") {
                const childId = childIdRaw === undefined ? undefined : toObjectId(childIdRaw, legacyIds);
                const parentId = parentIdRaw === undefined ? undefined : toObjectId(parentIdRaw, legacyIds);
                diagnostics.push({
                    reason: "unsupported-connection-type",
                    message: `Unsupported FBX connection type '${type ?? ""}' was not added to the graph.`,
                    connectionIndex,
                    type,
                    childId,
                    parentId,
                });
                continue;
            }
            if (childIdRaw === undefined || parentIdRaw === undefined) {
                diagnostics.push({
                    reason: "missing-connection-endpoint",
                    message: "FBX connection is missing a child or parent endpoint.",
                    connectionIndex,
                    type,
                });
                continue;
            }
            const childId = toObjectId(childIdRaw, legacyIds);
            const parentId = toObjectId(parentIdRaw, legacyIds);
            if (childId === undefined || parentId === undefined) {
                diagnostics.push({
                    reason: "unresolved-legacy-endpoint",
                    message: "FBX connection references a legacy string endpoint that is not present in the object table.",
                    connectionIndex,
                    type,
                });
                continue;
            }
            const propertyName = type === "OP" && c.properties.length > 3 ? getPropertyValue(c, 3) : undefined;
            entry.childId = childId;
            entry.parentId = parentId;
            entry.propertyName = propertyName;
            if (childId === parentId) {
                diagnostics.push({
                    reason: "self-loop",
                    message: "FBX connection references the same object as child and parent.",
                    connectionIndex,
                    type,
                    childId,
                    parentId,
                    propertyName,
                });
            }
            if (!objects.has(childId)) {
                diagnostics.push({
                    reason: "unresolved-object-reference",
                    message: "FBX connection child ID is not present in the object table.",
                    connectionIndex,
                    type,
                    childId,
                    parentId,
                    propertyName,
                });
            }
            if (parentId !== 0 && !objects.has(parentId)) {
                diagnostics.push({
                    reason: "unresolved-object-reference",
                    message: "FBX connection parent ID is not present in the object table.",
                    connectionIndex,
                    type,
                    childId,
                    parentId,
                    propertyName,
                });
            }
            addConnection(connections, childrenOf, parentOf, diagnostics, type, childId, parentId, propertyName, connectionIndex);
            entry.accepted = true;
        }
    }
    return { objects, objectEntries, childrenOf, parentOf, connections, connectionEntries, diagnostics };
}
/** Get all child objects of a given parent ID, optionally filtered by node name */
export function getChildren(map, parentId, nodeName) {
    const children = map.childrenOf.get(parentId) ?? [];
    const result = [];
    for (const child of children) {
        const node = map.objects.get(child.id);
        if (node && (!nodeName || node.name === nodeName)) {
            result.push({ id: child.id, node, propertyName: child.propertyName });
        }
    }
    return result;
}
function toObjectNumber(value) {
    return getSafeFBXObjectId(value);
}
function toObjectId(value, legacyIds) {
    const numericId = toObjectNumber(value);
    if (numericId !== undefined) {
        return numericId;
    }
    if (typeof value !== "string") {
        return undefined;
    }
    const legacyName = cleanFBXName(value);
    if (legacyName === "Scene") {
        return 0;
    }
    return legacyIds.get(legacyName);
}
function addConnection(connections, childrenOf, parentOf, diagnostics, type, childId, parentId, propertyName, connectionIndex) {
    connections.push({ type, childId, parentId, propertyName });
    if (!childrenOf.has(parentId)) {
        childrenOf.set(parentId, []);
    }
    childrenOf.get(parentId).push({ id: childId, propertyName });
    const existingParent = parentOf.get(childId);
    if (existingParent) {
        diagnostics.push({
            reason: "duplicate-parent",
            message: "FBX object has multiple parents; preserving the existing last-parent behavior.",
            connectionIndex,
            type,
            childId,
            parentId,
            propertyName,
        });
    }
    parentOf.set(childId, { id: parentId, propertyName });
}
function normalizeLegacyObject(node, id) {
    const name = cleanFBXName(getPropertyValue(node, 0) ?? node.name);
    const subType = getPropertyValue(node, 1) ?? "";
    return {
        ...node,
        properties: [
            { type: "int64", value: id },
            { type: "string", value: name },
            { type: "string", value: subType },
        ],
    };
}
function createLegacyGeometry(modelNode, geometryId) {
    const name = cleanFBXName(getPropertyValue(modelNode, 0) ?? "Geometry");
    return {
        name: "Geometry",
        properties: [
            { type: "int64", value: geometryId },
            { type: "string", value: name },
            { type: "string", value: "Mesh" },
        ],
        children: modelNode.children,
    };
}
//# sourceMappingURL=connections.js.map