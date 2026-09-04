import { type FBXDocument, type FBXNode } from "../types/fbxTypes.js";
/** Connection type: OO = object-to-object, OP = object-to-property */
export type ConnectionType = "OO" | "OP";
/** A resolved FBX object connection. */
export interface FBXConnection {
    /** Connection type. */
    type: ConnectionType;
    /** Child object ID. */
    childId: number;
    /** Parent object ID. */
    parentId: number;
    /** For OP connections, the property name on the parent (e.g. "DiffuseColor") */
    propertyName?: string;
}
/** Object table entry used by the FBX connection graph. */
export interface FBXObjectEntry {
    /** Object ID. */
    id: number;
    /** Object node. */
    node: FBXNode;
    /** Source of the object entry. */
    source: "Objects" | "legacySyntheticGeometry";
    /** Legacy string object name, when applicable. */
    legacyName?: string;
    /** True if the object was synthesized for legacy compatibility. */
    synthetic: boolean;
}
/** Raw connection-table entry and import status. */
export interface FBXConnectionEntry {
    /** Source node name. */
    source: "C" | "Connect";
    /** Raw connection type. */
    rawType?: string;
    /** Child object ID, when resolved. */
    childId?: number;
    /** Parent object ID, when resolved. */
    parentId?: number;
    /** OP connection property name, when present. */
    propertyName?: string;
    /** True if the connection was accepted into the resolved graph. */
    accepted: boolean;
}
/** Reason a connection produced a diagnostic. */
export type FBXConnectionDiagnosticReason = "unsupported-connection-type" | "missing-connection-endpoint" | "unresolved-legacy-endpoint" | "unresolved-object-reference" | "duplicate-parent" | "self-loop";
/** Recoverable connection graph issue. */
export interface FBXConnectionDiagnostic {
    /** Diagnostic reason. */
    reason: FBXConnectionDiagnosticReason;
    /** Human-readable diagnostic message. */
    message: string;
    /** Connection-table index associated with the diagnostic, if applicable. */
    connectionIndex?: number;
    /** Connection type associated with the diagnostic, if applicable. */
    type?: string;
    /** Child object ID associated with the diagnostic, if applicable. */
    childId?: number;
    /** Parent object ID associated with the diagnostic, if applicable. */
    parentId?: number;
    /** OP connection property name associated with the diagnostic, if applicable. */
    propertyName?: string;
}
/** Resolved FBX object and connection graph. */
export interface FBXObjectMap {
    /** All objects by their unique ID */
    objects: Map<number, FBXNode>;
    /** Object table entries, including synthetic compatibility objects */
    objectEntries: FBXObjectEntry[];
    /** Children of each object ID */
    childrenOf: Map<number, {
        id: number;
        propertyName?: string;
    }[]>;
    /** Parent of each object ID */
    parentOf: Map<number, {
        id: number;
        propertyName?: string;
    }>;
    /** Raw connection list */
    connections: FBXConnection[];
    /** Raw connection-table entries and whether they were accepted into the graph */
    connectionEntries: FBXConnectionEntry[];
    /** Unsupported or suspicious connection shapes encountered while preserving graph behavior */
    diagnostics: FBXConnectionDiagnostic[];
}
/**
 * Build a connection graph from a parsed FBX document.
 * Maps object IDs to their FBXNode and resolves parent-child relationships.
 */
export declare function resolveConnections(doc: FBXDocument): FBXObjectMap;
/** Get all child objects of a given parent ID, optionally filtered by node name */
export declare function getChildren(map: FBXObjectMap, parentId: number, nodeName?: string): {
    id: number;
    node: FBXNode;
    propertyName?: string;
}[];
