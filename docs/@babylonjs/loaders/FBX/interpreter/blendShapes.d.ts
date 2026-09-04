import { type FBXObjectMap } from "./connections.js";
/** A single morph target (shape) within a blend shape channel */
export interface FBXShapeData {
    /** Sparse vertex indices affected by this shape */
    indices: Uint32Array;
    /** Absolute vertex positions for affected vertices [x,y,z,...] */
    vertices: Float64Array;
    /** Normals for affected vertices [x,y,z,...] (optional) */
    normals: Float64Array | null;
}
export interface FBXBlendShapeDiagnostic {
    type: "full-weights-mismatch" | "missing-full-weights";
    message: string;
    channelId: number;
    channelName: string;
}
/** A blend shape channel (one animatable morph target) */
export interface FBXBlendShapeChannelData {
    /** Channel name */
    name: string;
    /** Channel node ID */
    id: number;
    /** Default weight (0-100 in FBX) */
    deformPercent: number;
    /** Shape geometry (typically one per channel, but FBX supports in-between shapes) */
    shapes: FBXShapeData[];
    /** In-between full weights in FBX DeformPercent units (0-100), one per shape when present */
    fullWeights: number[] | null;
    /** Recoverable blend-shape diagnostics */
    diagnostics: FBXBlendShapeDiagnostic[];
}
/** A blend shape deformer attached to a geometry */
export interface FBXBlendShapeData {
    /** Deformer ID */
    id: number;
    /** Geometry ID this blend shape is attached to */
    geometryId: number;
    /** Channels (each is an animatable morph target) */
    channels: FBXBlendShapeChannelData[];
}
/**
 * Extract all blend shape deformers from the FBX scene.
 */
export declare function extractBlendShapes(objectMap: FBXObjectMap): FBXBlendShapeData[];
