/* eslint-disable @typescript-eslint/naming-convention, jsdoc/require-param, jsdoc/require-returns */
/**
 * Intermediate representation for parsed FBX data.
 * Both binary and ASCII parsers produce this same structure.
 */
/** Helper to find a child node by name */
export function findChildByName(node, name) {
    return node.children.find((c) => c.name === name);
}
/** Helper to find all children with a given name */
export function findChildrenByName(node, name) {
    return node.children.filter((c) => c.name === name);
}
/** Helper to find a top-level node in a document */
export function findDocumentNode(doc, name) {
    return doc.nodes.find((n) => n.name === name);
}
/** Extract a property value by index, with type narrowing */
export function getPropertyValue(node, index) {
    if (index < node.properties.length) {
        return node.properties[index].value;
    }
    return undefined;
}
/**
 * Converts an FBX object ID value to a safe JavaScript number.
 * @param value - Parsed FBX object ID value
 * @returns The object ID, or undefined when the value is not numeric
 */
export function getSafeFBXObjectId(value) {
    if (typeof value !== "number") {
        return undefined;
    }
    if (!Number.isSafeInteger(value)) {
        throw new Error(`Unsafe FBX object ID ${value.toString()}: object IDs must be safe integers.`);
    }
    return value;
}
/** Get the numeric ID from a node (first property is typically the int64 UID) */
export function getNodeId(node) {
    const prop = node.properties[0];
    if (prop && (prop.type === "int64" || prop.type === "int32")) {
        return getSafeFBXObjectId(prop.value);
    }
    return undefined;
}
/**
 * Clean FBX object names.
 * FBX names may contain:
 *   - A "Class::" prefix (e.g. "Model::valkyrie_mesh") — strip it
 *   - A binary null/control-character class suffix — strip it
 */
export function cleanFBXName(fbxName) {
    // Strip \x00\x01 suffix (binary FBX name/class separator)
    const nullIdx = fbxName.indexOf("\0");
    if (nullIdx >= 0) {
        fbxName = fbxName.substring(0, nullIdx);
    }
    // Strip "ClassName::" prefix (ASCII FBX)
    const colonIdx = fbxName.indexOf("::");
    if (colonIdx >= 0) {
        fbxName = fbxName.substring(colonIdx + 2);
    }
    return fbxName;
}
//# sourceMappingURL=fbxTypes.js.map