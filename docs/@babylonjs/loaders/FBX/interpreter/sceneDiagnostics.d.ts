import { type FBXObjectMap } from "./connections.js";
export type FBXSceneDiagnosticType = "unsupported-constraint" | "unsupported-helper" | "unsupported-deformer" | "unsupported-node-attribute" | "unsupported-pose" | "unsupported-layered-texture" | "connection-graph";
export interface FBXSceneDiagnostic {
    type: FBXSceneDiagnosticType;
    message: string;
    objectId?: number;
    objectName?: string;
    nodeName?: string;
    subType?: string;
    /** Number of accepted parent graph edges for objectId, when objectId is known. */
    parentCount?: number;
    childCount?: number;
}
export declare function extractSceneDiagnostics(objectMap: FBXObjectMap): FBXSceneDiagnostic[];
