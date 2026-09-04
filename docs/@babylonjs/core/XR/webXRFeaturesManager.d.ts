import { type Observable } from "../Misc/observable.js";
import { type IDisposable } from "../scene.js";
import { type IWebXRAnchorSystemOptions, type WebXRAnchorSystem } from "./features/WebXRAnchorSystem.js";
import { type IWebXRBackgroundRemoverOptions, type WebXRBackgroundRemover } from "./features/WebXRBackgroundRemover.js";
import { type IWebXRBodyTrackingOptions, type WebXRBodyTracking } from "./features/WebXRBodyTracking.js";
import { type IWebXRControllerMovementOptions, type WebXRControllerMovement } from "./features/WebXRControllerMovement.js";
import { type IWebXRControllerPhysicsOptions, type WebXRControllerPhysics } from "./features/WebXRControllerPhysics.js";
import { type IWebXRControllerPointerSelectionOptions, type WebXRControllerPointerSelection } from "./features/WebXRControllerPointerSelection.js";
import { type IWebXRTeleportationOptions, type WebXRMotionControllerTeleportation } from "./features/WebXRControllerTeleportation.js";
import { type IWebXRDepthSensingOptions, type WebXRDepthSensing } from "./features/WebXRDepthSensing.js";
import { type IWebXRDomOverlayOptions, type WebXRDomOverlay } from "./features/WebXRDOMOverlay.js";
import { type WebXREyeTracking } from "./features/WebXREyeTracking.js";
import { type WebXRFeaturePointSystem } from "./features/WebXRFeaturePointSystem.js";
import { type IWebXRHandTrackingOptions, type WebXRHandTracking } from "./features/WebXRHandTracking.js";
import { type IWebXRHitTestOptions, type WebXRHitTest } from "./features/WebXRHitTest.js";
import { type IWebXRImageTrackingOptions, type WebXRImageTracking } from "./features/WebXRImageTracking.js";
import { type IWebXRLayersOptions, type WebXRLayers } from "./features/WebXRLayers.js";
import { type IWebXRLightEstimationOptions, type WebXRLightEstimation } from "./features/WebXRLightEstimation.js";
import { type IWebXRMeshDetectorOptions, type WebXRMeshDetector } from "./features/WebXRMeshDetector.js";
import { type IWebXRNearInteractionOptions, type WebXRNearInteraction } from "./features/WebXRNearInteraction.js";
import { type IWebXRPlaneDetectorOptions, type WebXRPlaneDetector } from "./features/WebXRPlaneDetector.js";
import { type IWebXRRawCameraAccessOptions, type WebXRRawCameraAccess } from "./features/WebXRRawCameraAccess.js";
import { type WebXRSpaceWarp } from "./features/WebXRSpaceWarp.js";
import { type WebXRTrackedSources } from "./features/WebXRTrackedSources.js";
import { type IWebXRWalkingLocomotionOptions, type WebXRWalkingLocomotion } from "./features/WebXRWalkingLocomotion.js";
import { type WebXRSessionManager } from "./webXRSessionManager.js";
/**
 * Defining the interface required for a (webxr) feature
 */
export interface IWebXRFeature extends IDisposable {
    /**
     * Is this feature attached
     */
    attached: boolean;
    /**
     * Should auto-attach be disabled?
     */
    disableAutoAttach: boolean;
    /**
     * The auto-attach policy in effect before the features manager starts a manual attachment.
     * @internal
     */
    _autoAttachPolicyBeforeAttach?: boolean;
    /**
     * Attach the feature to the session
     * Will usually be called by the features manager
     *
     * @param force should attachment be forced (even when already attached)
     * @returns true if successful.
     */
    attach(force?: boolean): boolean;
    /**
     * Detach the feature from the session
     * Will usually be called by the features manager
     *
     * @returns true if successful.
     */
    detach(): boolean;
    /**
     * This function will be executed during before enabling the feature and can be used to not-allow enabling it.
     * Note that at this point the session has NOT started, so this is purely checking if the browser supports it
     *
     * @returns whether or not the feature is compatible in this environment
     */
    isCompatible(): boolean;
    /**
     * Was this feature disposed;
     */
    isDisposed: boolean;
    /**
     * The name of the native xr feature name, if applicable (like anchor, hit-test, or hand-tracking)
     */
    xrNativeFeatureName?: string;
    /**
     * A list of (Babylon WebXR) features this feature depends on
     */
    dependsOn?: string[];
    /**
     * If this feature requires to extend the XRSessionInit object, this function will return the partial XR session init object
     */
    getXRSessionInitExtension?: () => Promise<Partial<XRSessionInit>>;
    /**
     * Triggered when the feature is attached
     */
    onFeatureAttachObservable: Observable<IWebXRFeature>;
    /**
     * Triggered when the feature is detached
     */
    onFeatureDetachObservable: Observable<IWebXRFeature>;
}
/**
 * A list of the currently available features without referencing them
 */
export declare class WebXRFeatureName {
    /**
     * The name of the anchor system feature
     */
    static readonly ANCHOR_SYSTEM: "xr-anchor-system";
    /**
     * The name of the background remover feature
     */
    static readonly BACKGROUND_REMOVER: "xr-background-remover";
    /**
     * The name of the hit test feature
     */
    static readonly HIT_TEST: "xr-hit-test";
    /**
     * The name of the mesh detection feature
     */
    static readonly MESH_DETECTION: "xr-mesh-detection";
    /**
     * physics impostors for xr controllers feature
     */
    static readonly PHYSICS_CONTROLLERS: "xr-physics-controller";
    /**
     * The name of the plane detection feature
     */
    static readonly PLANE_DETECTION: "xr-plane-detection";
    /**
     * The name of the pointer selection feature
     */
    static readonly POINTER_SELECTION: "xr-controller-pointer-selection";
    /**
     * The name of the teleportation feature
     */
    static readonly TELEPORTATION: "xr-controller-teleportation";
    /**
     * The name of the feature points feature.
     */
    static readonly FEATURE_POINTS: "xr-feature-points";
    /**
     * The name of the hand tracking feature.
     */
    static readonly HAND_TRACKING: "xr-hand-tracking";
    /**
     * The name of the image tracking feature
     */
    static readonly IMAGE_TRACKING: "xr-image-tracking";
    /**
     * The name of the near interaction feature
     */
    static readonly NEAR_INTERACTION: "xr-near-interaction";
    /**
     * The name of the DOM overlay feature
     */
    static readonly DOM_OVERLAY: "xr-dom-overlay";
    /**
     * The name of the movement feature
     */
    static readonly MOVEMENT: "xr-controller-movement";
    /**
     * The name of the light estimation feature
     */
    static readonly LIGHT_ESTIMATION: "xr-light-estimation";
    /**
     * The name of the eye tracking feature
     */
    static readonly EYE_TRACKING: "xr-eye-tracking";
    /**
     * The name of the walking locomotion feature
     */
    static readonly WALKING_LOCOMOTION: "xr-walking-locomotion";
    /**
     * The name of the composition layers feature
     */
    static readonly LAYERS: "xr-layers";
    /**
     * The name of the depth sensing feature
     */
    static readonly DEPTH_SENSING: "xr-depth-sensing";
    /**
     * The name of the WebXR Space Warp feature
     */
    static readonly SPACE_WARP: "xr-space-warp";
    /**
     * The name of the WebXR Raw Camera Access feature
     */
    static readonly RAW_CAMERA_ACCESS: "xr-raw-camera-access";
    /**
     * The name of the body tracking feature
     */
    static readonly BODY_TRACKING: "xr-body-tracking";
    /**
     * The name of the tracked sources feature
     */
    static readonly TRACKED_SOURCES: "xr-tracked-sources";
}
export type WebXRFeatureNameType = (typeof WebXRFeatureName)[Exclude<keyof typeof WebXRFeatureName, "prototype">];
/**
 * Maps feature names to their corresponding feature implementation classes.
 */
export interface IWebXRFeatureNameTypeMap {
    /** Anchor system feature implementation. */
    [WebXRFeatureName.ANCHOR_SYSTEM]: WebXRAnchorSystem;
    /** Background remover feature implementation. */
    [WebXRFeatureName.BACKGROUND_REMOVER]: WebXRBackgroundRemover;
    /** Depth sensing feature implementation. */
    [WebXRFeatureName.DEPTH_SENSING]: WebXRDepthSensing;
    /** DOM overlay feature implementation. */
    [WebXRFeatureName.DOM_OVERLAY]: WebXRDomOverlay;
    /** Eye tracking feature implementation. */
    [WebXRFeatureName.EYE_TRACKING]: WebXREyeTracking;
    /** Feature points feature implementation. */
    [WebXRFeatureName.FEATURE_POINTS]: WebXRFeaturePointSystem;
    /** Hand tracking feature implementation. */
    [WebXRFeatureName.HAND_TRACKING]: WebXRHandTracking;
    /** Hit test feature implementation. */
    [WebXRFeatureName.HIT_TEST]: WebXRHitTest;
    /** Image tracking feature implementation. */
    [WebXRFeatureName.IMAGE_TRACKING]: WebXRImageTracking;
    /** Layers feature implementation. */
    [WebXRFeatureName.LAYERS]: WebXRLayers;
    /** Light estimation feature implementation. */
    [WebXRFeatureName.LIGHT_ESTIMATION]: WebXRLightEstimation;
    /** Mesh detection feature implementation. */
    [WebXRFeatureName.MESH_DETECTION]: WebXRMeshDetector;
    /** Controller movement feature implementation. */
    [WebXRFeatureName.MOVEMENT]: WebXRControllerMovement;
    /** Near interaction feature implementation. */
    [WebXRFeatureName.NEAR_INTERACTION]: WebXRNearInteraction;
    /** Physics controllers feature implementation. */
    [WebXRFeatureName.PHYSICS_CONTROLLERS]: WebXRControllerPhysics;
    /** Plane detection feature implementation. */
    [WebXRFeatureName.PLANE_DETECTION]: WebXRPlaneDetector;
    /** Controller pointer selection feature implementation. */
    [WebXRFeatureName.POINTER_SELECTION]: WebXRControllerPointerSelection;
    /** Raw camera access feature implementation. */
    [WebXRFeatureName.RAW_CAMERA_ACCESS]: WebXRRawCameraAccess;
    /** Space warp feature implementation. */
    [WebXRFeatureName.SPACE_WARP]: WebXRSpaceWarp;
    /** Teleportation feature implementation. */
    [WebXRFeatureName.TELEPORTATION]: WebXRMotionControllerTeleportation;
    /** Walking locomotion feature implementation. */
    [WebXRFeatureName.WALKING_LOCOMOTION]: WebXRWalkingLocomotion;
    /** Body tracking feature implementation. */
    [WebXRFeatureName.BODY_TRACKING]: WebXRBodyTracking;
    /** Tracked sources feature implementation. */
    [WebXRFeatureName.TRACKED_SOURCES]: WebXRTrackedSources;
}
/**
 * Maps feature names to their corresponding options interfaces.
 */
export interface IWebXRFeatureNameOptionsMap {
    /** Anchor system feature options. */
    [WebXRFeatureName.ANCHOR_SYSTEM]: IWebXRAnchorSystemOptions;
    /** Background remover feature options. */
    [WebXRFeatureName.BACKGROUND_REMOVER]: IWebXRBackgroundRemoverOptions;
    /** Depth sensing feature options. */
    [WebXRFeatureName.DEPTH_SENSING]: IWebXRDepthSensingOptions;
    /** DOM overlay feature options. */
    [WebXRFeatureName.DOM_OVERLAY]: IWebXRDomOverlayOptions;
    /** Eye tracking feature options. */
    [WebXRFeatureName.EYE_TRACKING]: undefined;
    /** Feature points feature options. */
    [WebXRFeatureName.FEATURE_POINTS]: undefined;
    /** Hand tracking feature options. */
    [WebXRFeatureName.HAND_TRACKING]: IWebXRHandTrackingOptions;
    /** Hit test feature options. */
    [WebXRFeatureName.HIT_TEST]: IWebXRHitTestOptions;
    /** Image tracking feature options. */
    [WebXRFeatureName.IMAGE_TRACKING]: IWebXRImageTrackingOptions;
    /** Layers feature options. */
    [WebXRFeatureName.LAYERS]: IWebXRLayersOptions;
    /** Light estimation feature options. */
    [WebXRFeatureName.LIGHT_ESTIMATION]: IWebXRLightEstimationOptions;
    /** Mesh detection feature options. */
    [WebXRFeatureName.MESH_DETECTION]: IWebXRMeshDetectorOptions;
    /** Controller movement feature options. */
    [WebXRFeatureName.MOVEMENT]: IWebXRControllerMovementOptions;
    /** Near interaction feature options. */
    [WebXRFeatureName.NEAR_INTERACTION]: IWebXRNearInteractionOptions;
    /** Physics controllers feature options. */
    [WebXRFeatureName.PHYSICS_CONTROLLERS]: IWebXRControllerPhysicsOptions;
    /** Plane detection feature options. */
    [WebXRFeatureName.PLANE_DETECTION]: IWebXRPlaneDetectorOptions;
    /** Controller pointer selection feature options. */
    [WebXRFeatureName.POINTER_SELECTION]: IWebXRControllerPointerSelectionOptions;
    /** Raw camera access feature options. */
    [WebXRFeatureName.RAW_CAMERA_ACCESS]: IWebXRRawCameraAccessOptions;
    /** Space warp feature options. */
    [WebXRFeatureName.SPACE_WARP]: undefined;
    /** Teleportation feature options. */
    [WebXRFeatureName.TELEPORTATION]: IWebXRTeleportationOptions;
    /** Walking locomotion feature options. */
    [WebXRFeatureName.WALKING_LOCOMOTION]: IWebXRWalkingLocomotionOptions;
    /** Body tracking feature options. */
    [WebXRFeatureName.BODY_TRACKING]: IWebXRBodyTrackingOptions;
    /** Tracked sources feature options. */
    [WebXRFeatureName.TRACKED_SOURCES]: undefined;
}
/**
 * Helper type that expands/flattens a type to show its properties inline in IntelliSense
 */
type Expand<T> = T extends infer O ? {
    [K in keyof O]: O[K];
} : never;
/**
 * Helper type to resolve the specific feature type based on the feature name,
 * or fallback to IWebXRFeature if the feature name is not in the type map.
 */
export type ResolveWebXRFeature<T extends WebXRFeatureNameType> = T extends keyof IWebXRFeatureNameTypeMap ? IWebXRFeatureNameTypeMap[T] : IWebXRFeature;
/**
 * Helper type to resolve the options type for a specific feature based on the feature name,
 * or fallback to any if the feature name is not in the type map.
 * The Expand utility type flattens the interface to show properties inline in IntelliSense.
 */
export type ResolveWebXRFeatureOptions<T extends WebXRFeatureNameType> = T extends keyof IWebXRFeatureNameOptionsMap ? IWebXRFeatureNameOptionsMap[T] extends undefined ? undefined : Expand<IWebXRFeatureNameOptionsMap[T]> : any;
/**
 * Defining the constructor of a feature. Used to register the modules.
 */
export type WebXRFeatureConstructor = (xrSessionManager: WebXRSessionManager, options?: any) => () => IWebXRFeature;
/**
 * The WebXR features manager is responsible of enabling or disabling features required for the current XR session.
 * It is mainly used in AR sessions.
 *
 * A feature can have a version that is defined by Babylon (and does not correspond with the webxr version).
 */
export declare class WebXRFeaturesManager implements IDisposable {
    private _xrSessionManager;
    private static readonly _AvailableFeatures;
    private _features;
    /**
     * The key is the feature to check and the value is the feature that conflicts.
     */
    private static readonly _ConflictingFeatures;
    /**
     * constructs a new features manages.
     *
     * @param _xrSessionManager an instance of WebXRSessionManager
     */
    constructor(_xrSessionManager: WebXRSessionManager);
    /**
     * Used to register a module. After calling this function a developer can use this feature in the scene.
     * Mainly used internally.
     *
     * @param featureName the name of the feature to register
     * @param constructorFunction the function used to construct the module
     * @param version the (babylon) version of the module
     * @param stable is that a stable version of this module
     */
    static AddWebXRFeature(featureName: string, constructorFunction: WebXRFeatureConstructor, version?: number, stable?: boolean): void;
    /**
     * Returns a constructor of a specific feature.
     *
     * @param featureName the name of the feature to construct
     * @param version the version of the feature to load
     * @param xrSessionManager the xrSessionManager. Used to construct the module
     * @param options optional options provided to the module.
     * @returns a function that, when called, will return a new instance of this feature
     */
    static ConstructFeature(featureName: string, version: number | undefined, xrSessionManager: WebXRSessionManager, options?: any): () => IWebXRFeature;
    /**
     * Can be used to return the list of features currently registered
     *
     * @returns an Array of available features
     */
    static GetAvailableFeatures(): string[];
    /**
     * Gets the versions available for a specific feature
     * @param featureName the name of the feature
     * @returns an array with the available versions
     */
    static GetAvailableVersions(featureName: string): string[];
    /**
     * Return the latest unstable version of this feature
     * @param featureName the name of the feature to search
     * @returns the version number. if not found will return -1
     */
    static GetLatestVersionOfFeature(featureName: string): number;
    /**
     * Return the latest stable version of this feature
     * @param featureName the name of the feature to search
     * @returns the version number. if not found will return -1
     */
    static GetStableVersionOfFeature(featureName: string): number;
    /**
     * Attach a feature to the current session. Mainly used when session started to start the feature effect.
     * Can be used during a session to start a feature
     * @param featureName the name of feature to attach
     */
    attachFeature(featureName: string): void;
    /**
     * Can be used inside a session or when the session ends to detach a specific feature
     * @param featureName the name of the feature to detach
     */
    detachFeature(featureName: string): void;
    /**
     * Used to disable an already-enabled feature
     * The feature will be disposed and will be recreated once enabled.
     * @param featureName the feature to disable
     * @returns true if disable was successful
     */
    disableFeature(featureName: string | {
        Name: string;
    }): boolean;
    /**
     * dispose this features manager
     */
    dispose(): void;
    /**
     * Enable a feature using its name and a version. This will enable it in the scene, and will be responsible to attach it when the session starts.
     * If used twice, the old version will be disposed and a new one will be constructed. This way you can re-enable with different configuration.
     *
     * @param featureName the name of the feature to load or the class of the feature
     * @param version optional version to load. if not provided the latest version will be enabled
     * @param moduleOptions options provided to the module. Ses the module documentation / constructor
     * @param attachIfPossible if set to true (default) the feature will be automatically attached, if it is currently possible
     * @param required is this feature required to the app. If set to true the session init will fail if the feature is not available.
     * @returns a new constructed feature or throws an error if feature not found or conflicts with another enabled feature.
     */
    enableFeature<T extends WebXRFeatureNameType>(featureName: T | {
        Name: T;
    }, version?: number | string, moduleOptions?: ResolveWebXRFeatureOptions<T>, attachIfPossible?: boolean, required?: boolean): ResolveWebXRFeature<T>;
    /**
     * get the implementation of an enabled feature.
     * @param featureName the name of the feature to load
     * @returns the feature class, if found
     */
    getEnabledFeature<T extends WebXRFeatureNameType>(featureName: T): ResolveWebXRFeature<T>;
    /**
     * Get the list of enabled features
     * @returns an array of enabled features
     */
    getEnabledFeatures(): string[];
    /**
     * This function will extend the session creation configuration object with enabled features.
     * If, for example, the anchors feature is enabled, it will be automatically added to the optional or required features list,
     * according to the defined "required" variable, provided during enableFeature call
     * @param xrSessionInit the xr Session init object to extend
     *
     * @returns an extended XRSessionInit object
     */
    _extendXRSessionInitObject(xrSessionInit: XRSessionInit): Promise<XRSessionInit>;
}
export {};
