/** This file must only contain pure code and pure imports */
import { type TransformNode } from "../../Meshes/transformNode.pure.js";
import { type WebXRSessionManager } from "../webXRSessionManager.js";
import { Observable } from "../../Misc/observable.pure.js";
import { Vector3, Matrix } from "../../Maths/math.vector.pure.js";
import { WebXRAbstractFeature } from "./WebXRAbstractFeature.js";
/**
 * Options used in the plane detector module
 */
export interface IWebXRPlaneDetectorOptions {
    /**
     * The node to use to transform the local results to world coordinates
     */
    worldParentNode?: TransformNode;
    /**
     * If set to true a reference of the created planes will be kept until the next session starts
     * If not defined, planes will be removed from the array when the feature is detached or the session ended.
     */
    doNotRemovePlanesOnSessionEnded?: boolean;
    /**
     * Preferred detector configuration, not all preferred options will be supported by all platforms.
     */
    preferredDetectorOptions?: XRGeometryDetectorOptions;
}
/**
 * A babylon interface for a WebXR plane.
 * A Plane is actually a polygon, built from N points in space
 *
 * Supported in chrome 79, not supported in canary 81 ATM
 */
export interface IWebXRPlane {
    /**
     * a babylon-assigned ID for this polygon
     */
    id: number;
    /**
     * an array of vector3 points in babylon space. right/left hand system is taken into account.
     */
    polygonDefinition: Array<Vector3>;
    /**
     * A transformation matrix to apply on the mesh that will be built using the polygonDefinition
     * Local vs. World are decided if worldParentNode was provided or not in the options when constructing the module
     */
    transformationMatrix: Matrix;
    /**
     * the native xr-plane object
     */
    xrPlane: XRPlane;
    /**
     * The semantic classification supplied by the XR runtime.
     * This is undefined when the runtime does not expose semantic labels and null when the plane has no known classification.
     */
    semanticLabel?: string | null;
}
/**
 * The plane detector is used to detect planes in the real world when in AR
 * For more information see https://github.com/immersive-web/real-world-geometry/
 */
export declare class WebXRPlaneDetector extends WebXRAbstractFeature {
    private _options;
    private _detectedPlanes;
    private _enabled;
    private _lastFrameDetected;
    /**
     * The module's name
     */
    static readonly Name: "xr-plane-detection";
    /**
     * The (Babylon) version of this module.
     * This is an integer representing the implementation version.
     * This number does not correspond to the WebXR specs version
     */
    static readonly Version = 1;
    /**
     * Observers registered here will be executed when a new plane was added to the session
     */
    onPlaneAddedObservable: Observable<IWebXRPlane>;
    /**
     * Observers registered here will be executed when a plane is no longer detected in the session
     */
    onPlaneRemovedObservable: Observable<IWebXRPlane>;
    /**
     * Observers registered here will be executed when an existing plane updates (for example - expanded)
     * This can execute N times every frame
     */
    onPlaneUpdatedObservable: Observable<IWebXRPlane>;
    /**
     * construct a new Plane Detector
     * @param _xrSessionManager an instance of xr Session manager
     * @param _options configuration to use when constructing this feature
     */
    constructor(_xrSessionManager: WebXRSessionManager, _options?: IWebXRPlaneDetectorOptions);
    /**
     * detach this feature.
     * Will usually be called by the features manager
     *
     * @returns true if successful.
     */
    detach(): boolean;
    /**
     * Dispose this feature and all of the resources attached
     */
    dispose(): void;
    /**
     * Check if the needed objects are defined.
     * This does not mean that the feature is enabled, but that the objects needed are well defined.
     * @returns true if the initial compatibility test passed
     */
    isCompatible(): boolean;
    /**
     * Requests that the active XR session capture or refresh the current room layout.
     * Detected room planes are reported through the existing plane observables.
     * @see https://immersive-web.github.io/plane-detection/#dom-xrsession-initiateroomcapture
     * @returns A promise that resolves when the native room capture request completes.
     */
    initiateRoomCapture(): Promise<void>;
    protected _onXRFrame(frame: XRFrame): void;
    private _init;
    private _updatePlaneWithXRPlane;
    /**
     * avoiding using Array.find for global support.
     * @param xrPlane the plane to find in the array
     * @returns the index of the plane in the array or -1 if not found
     */
    private _findIndexInPlaneArray;
}
/**
 * Register side effects for webXRPlaneDetector.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterWebXRPlaneDetector(): void;
