/** This file must only contain pure code and pure imports */
/** @internal */
interface INativeXRFrame extends XRFrame {
    getPoseData: (space: XRSpace, baseSpace: XRReferenceSpace, vectorBuffer: ArrayBufferLike, matrixBuffer: ArrayBufferLike) => XRPose;
    _imageTrackingResults?: XRImageTrackingResult[];
}
/** @internal */
export declare class NativeXRFrame implements XRFrame {
    private _nativeImpl;
    private readonly _xrTransform;
    private readonly _xrPose;
    private readonly _xrPoseVectorData;
    get session(): XRSession;
    constructor(_nativeImpl: INativeXRFrame);
    getPose(space: XRSpace, baseSpace: XRReferenceSpace): XRPose | undefined;
    readonly fillPoses: (spaces: XRSpace[], baseSpace: XRSpace, transforms: Float32Array) => boolean;
    readonly getViewerPose: (referenceSpace: XRReferenceSpace) => XRViewerPose | undefined;
    readonly getHitTestResults: (hitTestSource: XRHitTestSource) => XRHitTestResult[];
    readonly getHitTestResultsForTransientInput: () => never;
    get trackedAnchors(): XRAnchorSet | undefined;
    readonly createAnchor: (pose: XRRigidTransform, space: XRSpace) => Promise<XRAnchor>;
    get worldInformation(): XRWorldInformation | undefined;
    get detectedPlanes(): XRPlaneSet | undefined;
    readonly getJointPose: (joint: XRJointSpace, baseSpace: XRSpace) => XRJointPose;
    readonly fillJointRadii: (jointSpaces: XRJointSpace[], radii: Float32Array) => boolean;
    readonly getLightEstimate: () => never;
    get featurePointCloud(): number[] | undefined;
    readonly getImageTrackingResults: () => XRImageTrackingResult[];
    getDepthInformation(view: XRView): XRCPUDepthInformation | undefined;
}
/**
 * Register side effects for nativeXRFrame.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterNativeXRFrame(): void;
export {};
