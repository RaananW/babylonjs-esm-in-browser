import { type FBXNode } from "../types/fbxTypes.js";
import { type FBXObjectMap } from "./connections.js";
export type FBXClusterMode = "Normalize" | "Additive" | "TotalOne" | "Unknown";
export interface FBXSkinDiagnostic {
    type: "cluster-mode-runtime-unsupported" | "missing-cluster-transform" | "missing-cluster-transform-link" | "missing-bind-pose-matrix" | "associate-model-present";
    message: string;
    boneModelId?: number;
    boneName?: string;
    clusterMode?: FBXClusterMode;
}
/** Represents a single bone (cluster) in the FBX skeleton */
export interface FBXBoneData {
    /** The Model node ID for this bone */
    modelId: number;
    /** Bone name (from the Model node) */
    name: string;
    /** Index of this bone in the skeleton */
    index: number;
    /** Index of the parent bone (-1 for root) */
    parentIndex: number;
    /** Whether this bone corresponds to an FBX Cluster with vertex weights */
    isCluster: boolean;
    /** Local translation from parent (Lcl Translation) */
    translation: [number, number, number];
    /** Local rotation in degrees (Lcl Rotation) */
    rotation: [number, number, number];
    /** Pre-rotation in degrees (applied before Lcl Rotation) */
    preRotation: [number, number, number];
    /** Post-rotation in degrees (applied after Lcl Rotation, inverted) */
    postRotation: [number, number, number];
    /** Rotation pivot point */
    rotationPivot: [number, number, number];
    /** Scaling pivot point */
    scalingPivot: [number, number, number];
    /** Rotation offset */
    rotationOffset: [number, number, number];
    /** Scaling offset */
    scalingOffset: [number, number, number];
    /** Local scale (Lcl Scaling) */
    scale: [number, number, number];
    /** Rotation order: 0=XYZ, 1=XZY, 2=YZX, 3=YXZ, 4=ZXY, 5=ZYX */
    rotationOrder: number;
    /** FBX transform inheritance mode. 0=RrSs, 1=RSrs, 2=Rrs */
    inheritType: number;
    /** Cluster skinning mode */
    clusterMode: FBXClusterMode;
    /** Bind pose transform matrix (cluster Transform, 4x4) */
    bindPoseMatrix: Float64Array | null;
    /** Bone's world transform at bind time (cluster TransformLink, 4x4) */
    transformLinkMatrix: Float64Array | null;
    /** Associate model world transform at bind time (cluster TransformAssociateModel, 4x4) */
    transformAssociateModelMatrix: Float64Array | null;
    /** Model's absolute matrix from the FBX BindPose, when present */
    modelBindPoseMatrix: Float64Array | null;
    /** Recoverable bind/skinning diagnostics for this bone */
    diagnostics: FBXSkinDiagnostic[];
}
/** Represents a skin deformer with its clusters */
export interface FBXSkinData {
    /** Skin deformer ID */
    id: number;
    /** Geometry ID this skin is attached to */
    geometryId: number;
    /** Mesh model world matrix from the FBX BindPose, when present */
    meshBindPoseMatrix: Float64Array | null;
    /** Bones in this skeleton */
    bones: FBXBoneData[];
    /** Per-vertex bone indices, sorted by descending weight and capped for Babylon skinning */
    boneIndices: number[][];
    /** Per-vertex bone weights, matching boneIndices */
    boneWeights: number[][];
    /** Recoverable skinning/bind diagnostics */
    diagnostics: FBXSkinDiagnostic[];
}
/**
 * Extract all skin deformers from the FBX scene.
 * Returns skin data including bone hierarchy and vertex weights.
 */
export declare function extractSkins(objectMap: FBXObjectMap): FBXSkinData[];
export declare function isSkeletonModel(modelNode: FBXNode): boolean;
export declare function extractBoneTransform(modelNode: FBXNode): {
    translation: [number, number, number];
    rotation: [number, number, number];
    preRotation: [number, number, number];
    postRotation: [number, number, number];
    rotationPivot: [number, number, number];
    scalingPivot: [number, number, number];
    rotationOffset: [number, number, number];
    scalingOffset: [number, number, number];
    scale: [number, number, number];
    rotationOrder: number;
    inheritType: number;
};
