/**
 * Intermediate representation for parsed FBX data.
 * Both binary and ASCII parsers produce this same structure.
 */
/** Individual property value within an FBX node */
export type FBXPropertyValue = boolean | number | string | Float32Array | Float64Array | Int32Array | Uint8Array;
/** Parsed FBX property type identifier. */
export type FBXPropertyType = "boolean" | "int16" | "int32" | "int64" | "float32" | "float64" | "string" | "raw" | "float32[]" | "float64[]" | "int32[]" | "int64[]" | "boolean[]";
/** Individual property within an FBX node. */
export interface FBXProperty {
    /** Parsed property type. */
    type: FBXPropertyType;
    /** Parsed property value. */
    value: FBXPropertyValue;
}
/** A node in the FBX document tree */
export interface FBXNode {
    /** Node name. */
    name: string;
    /** Node properties. */
    properties: FBXProperty[];
    /** Child nodes. */
    children: FBXNode[];
}
/** Top-level parsed FBX document */
export interface FBXDocument {
    /** FBX file version. */
    version: number;
    /** Top-level document nodes. */
    nodes: FBXNode[];
}
/** Helper to find a child node by name */
export declare function findChildByName(node: FBXNode, name: string): FBXNode | undefined;
/** Helper to find all children with a given name */
export declare function findChildrenByName(node: FBXNode, name: string): FBXNode[];
/** Helper to find a top-level node in a document */
export declare function findDocumentNode(doc: FBXDocument, name: string): FBXNode | undefined;
/** Extract a property value by index, with type narrowing */
export declare function getPropertyValue<T extends FBXPropertyValue>(node: FBXNode, index: number): T | undefined;
/**
 * Converts an FBX object ID value to a safe JavaScript number.
 * @param value - Parsed FBX object ID value
 * @returns The object ID, or undefined when the value is not numeric
 */
export declare function getSafeFBXObjectId(value: unknown): number | undefined;
/** Get the numeric ID from a node (first property is typically the int64 UID) */
export declare function getNodeId(node: FBXNode): number | undefined;
/**
 * Clean FBX object names.
 * FBX names may contain:
 *   - A "Class::" prefix (e.g. "Model::valkyrie_mesh") — strip it
 *   - A binary null/control-character class suffix — strip it
 */
export declare function cleanFBXName(fbxName: string): string;
