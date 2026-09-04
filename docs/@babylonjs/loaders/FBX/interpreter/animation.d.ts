import { type FBXObjectMap } from "./connections.js";
export type FBXInterpolationType = "constant" | "linear" | "cubic";
/** A single keyframe */
export interface FBXKeyframe {
    /** Time in seconds */
    time: number;
    /** Value at this keyframe */
    value: number;
    /** Interpolation used from this key to the next key */
    interpolation: FBXInterpolationType;
    /** Constant interpolation variant */
    constantMode?: "standard" | "next";
    /** Cubic outgoing slope in value units per second */
    rightSlope?: number;
    /** Cubic incoming slope for the next key, in value units per second */
    nextLeftSlope?: number;
}
/** An animation curve (one axis of one property) */
export interface FBXCurveData {
    /** Channel: "d|X", "d|Y", "d|Z" */
    channel: string;
    /** Keyframes */
    keys: FBXKeyframe[];
    /** True for baked sample curves that should be connected as linear samples */
    isSampled?: boolean;
}
/** An animation curve node (T/R/S for one bone) */
export interface FBXCurveNodeData {
    /** Property type: "T" (translation), "R" (rotation), "S" (scale) */
    type: string;
    /** Target model (bone) ID */
    targetModelId: number;
    /** Curves for each axis */
    curves: FBXCurveData[];
}
/** Unsupported animation curve node preserved for diagnostics and future support. */
export interface FBXUnsupportedCurveNodeData {
    /** Raw AnimationCurveNode property type/name */
    type: string;
    /** CurveNode object ID */
    id: number;
    /** Target object ID if the curve node is connected to an object/property */
    targetId: number | null;
    /** OP connection property name on the target, e.g. Visibility */
    propertyName?: string;
    /** Number of connected animation curves that were ignored */
    curveCount: number;
    /** Connected curves preserved for diagnostics and future runtime support */
    curves: FBXCurveData[];
    /** Local default values stored on the unsupported curve node */
    defaultValues: Record<string, number>;
}
/** Recoverable animation import issue. */
export interface FBXAnimationDiagnostic {
    /** Diagnostic category. */
    type: "multiple-animation-layers" | "unsupported-layer-blend-mode" | "partial-layer-weight" | "unsupported-curve-node";
    /** Human-readable diagnostic message. */
    message: string;
    /** Animation layer name associated with the diagnostic, if applicable. */
    layerName?: string;
    /** AnimationCurveNode object ID associated with the diagnostic, if applicable. */
    curveNodeId?: number;
    /** AnimationCurveNode type/name associated with the diagnostic, if applicable. */
    curveNodeType?: string;
    /** Target object ID associated with the diagnostic, if applicable. */
    targetId?: number | null;
    /** Target property name associated with the diagnostic, if applicable. */
    propertyName?: string;
}
/** Animation layer with blend mode info */
export interface FBXAnimationLayerData {
    /** Layer name */
    name: string;
    /** Layer weight (0-100, default 100) */
    weight: number;
    /** Layer weight normalized to 0-1 */
    normalizedWeight: number;
    /** Blend mode: 0=Additive, 1=Override, 2=OverridePassthrough */
    blendMode: number;
    /** Curve nodes in this layer */
    curveNodes: FBXCurveNodeData[];
    /** Unsupported/non-TRS curve nodes preserved for diagnostics */
    unsupportedCurveNodes: FBXUnsupportedCurveNodeData[];
    /** Recoverable layer diagnostics */
    diagnostics: FBXAnimationDiagnostic[];
}
/** One animation clip (AnimationStack) */
export interface FBXAnimationStackData {
    /** Animation name */
    name: string;
    /** Clip start in seconds after any keyframe rebasing */
    startTime: number;
    /** Clip stop in seconds after any keyframe rebasing */
    stopTime: number;
    /** Duration in seconds */
    duration: number;
    /** Per-bone curve nodes (flattened from all layers for backward compat) */
    curveNodes: FBXCurveNodeData[];
    /** Animation layers (preserves blend mode info) */
    layers: FBXAnimationLayerData[];
    /** Unsupported/non-TRS curve nodes preserved for diagnostics */
    unsupportedCurveNodes: FBXUnsupportedCurveNodeData[];
    /** Recoverable animation diagnostics */
    diagnostics: FBXAnimationDiagnostic[];
}
/**
 * Extract all animation stacks from the FBX scene.
 */
export declare function extractAnimations(objectMap: FBXObjectMap): FBXAnimationStackData[];
/**
 * Determines whether a key sequence appears to be a uniformly frame-baked sampled curve.
 * @param keys - Keyframes to inspect
 * @returns true if the keys look like sampled frame data rather than authored interpolation
 */
export declare function isFrameBakedSampledCurve(keys: readonly FBXKeyframe[]): boolean;
/**
 * Samples an FBX animation curve at a specific time.
 * @param curveData - Curve data to sample
 * @param time - Time in seconds
 * @returns The sampled value, or null when the curve has no keys
 */
export declare function sampleFBXCurveAtTime(curveData: FBXCurveData | undefined, time: number): number | null;
