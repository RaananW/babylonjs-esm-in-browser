/* eslint-disable @typescript-eslint/naming-convention, jsdoc/require-param, jsdoc/require-returns */
import { cleanFBXName, getPropertyValue } from "../types/fbxTypes.js";
const HELPER_NODE_NAMES = new Set(["Character", "CharacterPose", "ControlSet", "ControlSetPlug", "SelectionSet", "CollectionExclusive"]);
export function extractSceneDiagnostics(objectMap) {
    const diagnostics = objectMap.diagnostics.map((diagnostic) => ({
        type: "connection-graph",
        message: diagnostic.message,
        objectId: diagnostic.childId,
        subType: diagnostic.reason,
        parentCount: diagnostic.childId === undefined ? undefined : objectMap.connections.filter((connection) => connection.childId === diagnostic.childId).length,
    }));
    for (const [id, node] of Array.from(objectMap.objects)) {
        const subType = getPropertyValue(node, 2) ?? "";
        if (node.name === "Constraint") {
            diagnostics.push(createObjectDiagnostic(objectMap, id, node, "unsupported-constraint", `Constraint '${subType || cleanFBXName(getPropertyValue(node, 1) ?? "")}' is preserved as diagnostic data but not evaluated at runtime.`));
            continue;
        }
        if (HELPER_NODE_NAMES.has(node.name)) {
            diagnostics.push(createObjectDiagnostic(objectMap, id, node, "unsupported-helper", `${node.name} helper data is preserved as diagnostic data but not evaluated at runtime.`));
            continue;
        }
        if (node.name === "LayeredTexture") {
            diagnostics.push(createObjectDiagnostic(objectMap, id, node, "unsupported-layered-texture", "LayeredTexture is preserved as diagnostic data; runtime texture layer blending is not implemented."));
            continue;
        }
        if (node.name === "Pose" && subType !== "BindPose") {
            diagnostics.push(createObjectDiagnostic(objectMap, id, node, "unsupported-pose", `Pose subtype '${subType}' is preserved as diagnostic data but not evaluated at runtime.`));
            continue;
        }
        if (node.name === "Deformer" && !isSupportedDeformer(subType)) {
            diagnostics.push(createObjectDiagnostic(objectMap, id, node, "unsupported-deformer", `Deformer subtype '${subType}' is preserved as diagnostic data but not evaluated at runtime.`));
            continue;
        }
        if (node.name === "NodeAttribute" && subType && subType !== "Camera" && subType !== "Light") {
            diagnostics.push(createObjectDiagnostic(objectMap, id, node, "unsupported-node-attribute", `NodeAttribute subtype '${subType}' is preserved as diagnostic data but not converted to a Babylon object.`));
        }
    }
    return diagnostics;
}
function isSupportedDeformer(subType) {
    return subType === "Skin" || subType === "Cluster" || subType === "BlendShape" || subType === "BlendShapeChannel";
}
function createObjectDiagnostic(objectMap, id, node, type, message) {
    return {
        type,
        message,
        objectId: id,
        objectName: cleanFBXName(getPropertyValue(node, 1) ?? node.name),
        nodeName: node.name,
        subType: getPropertyValue(node, 2) ?? "",
        parentCount: objectMap.connections.filter((connection) => connection.childId === id).length,
        childCount: objectMap.childrenOf.get(id)?.length ?? 0,
    };
}
//# sourceMappingURL=sceneDiagnostics.js.map