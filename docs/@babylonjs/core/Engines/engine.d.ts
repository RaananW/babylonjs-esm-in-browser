
export * from "./engine.pure.js";
import "./Extensions/engine.alpha.js";
import "./Extensions/engine.alphaToCoverage.js";
import "./Extensions/engine.rawTexture.js";
import "./Extensions/engine.readTexture.js";
import "./Extensions/engine.dynamicBuffer.js";
import "./Extensions/engine.cubeTexture.js";
import "./Extensions/engine.renderTarget.js";
import "./Extensions/engine.renderTargetTexture.js";
import "./Extensions/engine.renderTargetCube.js";
import "./Extensions/engine.prefilteredCubeTexture.js";
import "./Extensions/engine.uniformBuffer.js";
import "./AbstractEngine/abstractEngine.loadingScreen.js";
import "./AbstractEngine/abstractEngine.dom.js";
import "./AbstractEngine/abstractEngine.states.js";
import "./AbstractEngine/abstractEngine.stencil.js";
import "./AbstractEngine/abstractEngine.renderPass.js";
import "./AbstractEngine/abstractEngine.texture.js";
import "./AbstractEngine/abstractEngine.loadFile.js";
import "./AbstractEngine/abstractEngine.textureLoaders.js";
import "./thinEngine.scissor.js";

// Mixins
declare global{
/* eslint-disable babylonjs/available */
/* eslint-disable @typescript-eslint/naming-convention */
// Ambient declarations for the WebXR/WebGPU binding module.
// The community-maintained webxr.d.ts does not yet include XRGPUBinding and its associated
// types, so they are declared here as a companion (mirroring webxr.nativeextensions.d.ts).
//
// Shapes are grounded in the immersive-web/WebXR-WebGPU-Binding explainer + proposed IDL:
// https://github.com/immersive-web/WebXR-WebGPU-Binding/blob/main/explainer.md
//
// The base XR layer/sub-image types (XRSubImage, XRProjectionLayer, XRQuadLayer, XRCylinderLayer,
// XREquirectLayer, XRCubeLayer, XRCompositionLayer, XRLayerLayout, XRFrame, XRView, XREye,
// XRSpace, XRRigidTransform) come from webxr.d.ts. The WebGPU adapter opt-in
// (GPURequestAdapterOptions.xrCompatible) is declared in webgpu.d.ts and intentionally not
// duplicated here.

// XRGPUSubImage : XRSubImage
interface XRGPUSubImage extends XRSubImage {
    readonly colorTexture: GPUTexture;
    readonly depthStencilTexture?: GPUTexture;
    readonly motionVectorTexture?: GPUTexture;
    getViewDescriptor(): GPUTextureViewDescriptor;
}

abstract class XRGPUSubImage implements XRGPUSubImage {}

// dictionary XRGPUProjectionLayerInit
interface XRGPUProjectionLayerInit {
    colorFormat: GPUTextureFormat;
    depthStencilFormat?: GPUTextureFormat;
    // GPUTextureUsage.RENDER_ATTACHMENT (0x10) per spec default.
    textureUsage?: GPUTextureUsageFlags;
    scaleFactor?: number;
}

// dictionary XRGPULayerInit
interface XRGPULayerInit {
    colorFormat: GPUTextureFormat;
    depthStencilFormat?: GPUTextureFormat;
    // GPUTextureUsage.RENDER_ATTACHMENT (0x10) per spec default.
    textureUsage?: GPUTextureUsageFlags;
    space: XRSpace;
    mipLevels?: number;
    viewPixelWidth: number;
    viewPixelHeight: number;
    layout?: XRLayerLayout;
    isStatic?: boolean;
}

// dictionary XRGPUQuadLayerInit : XRGPULayerInit
interface XRGPUQuadLayerInit extends XRGPULayerInit {
    transform?: XRRigidTransform;
    width?: number;
    height?: number;
}

// dictionary XRGPUCylinderLayerInit : XRGPULayerInit
interface XRGPUCylinderLayerInit extends XRGPULayerInit {
    transform?: XRRigidTransform;
    radius?: number;
    centralAngle?: number;
    aspectRatio?: number;
}

// dictionary XRGPUEquirectLayerInit : XRGPULayerInit
interface XRGPUEquirectLayerInit extends XRGPULayerInit {
    transform?: XRRigidTransform;
    radius?: number;
    centralHorizontalAngle?: number;
    upperVerticalAngle?: number;
    lowerVerticalAngle?: number;
}

// dictionary XRGPUCubeLayerInit : XRGPULayerInit
interface XRGPUCubeLayerInit extends XRGPULayerInit {
    orientation?: DOMPointReadOnly;
}

// [Exposed=Window] interface XRGPUBinding
class XRGPUBinding {
    constructor(session: XRSession, device: GPUDevice);

    readonly nativeProjectionScaleFactor: number;

    createProjectionLayer(init?: XRGPUProjectionLayerInit): XRProjectionLayer;
    createQuadLayer(init?: XRGPUQuadLayerInit): XRQuadLayer;
    createCylinderLayer(init?: XRGPUCylinderLayerInit): XRCylinderLayer;
    createEquirectLayer(init?: XRGPUEquirectLayerInit): XREquirectLayer;
    createCubeLayer(init?: XRGPUCubeLayerInit): XRCubeLayer;

    getSubImage(layer: XRCompositionLayer, frame: XRFrame, eye?: XREye): XRGPUSubImage;
    getViewSubImage(layer: XRProjectionLayer, view: XRView): XRGPUSubImage;

    getPreferredColorFormat(): GPUTextureFormat;
}

/* eslint-disable @typescript-eslint/naming-convention */
// This file contains native only extensions for WebXR. These APIs are not supported in the browser yet.
// They are intended for use with either Babylon Native https://github.com/BabylonJS/BabylonNative or
// Babylon React Native: https://github.com/BabylonJS/BabylonReactNative

type XRSceneObjectType = "unknown" | "background" | "wall" | "floor" | "ceiling" | "platform" | "inferred" | "world";

interface XRSceneObject {
    type: XRSceneObjectType;
}

interface XRFieldOfView {
    angleLeft: number;
    angleRight: number;
    angleUp: number;
    angleDown: number;
}

interface XRFrustum {
    position: DOMPointReadOnly;
    orientation: DOMPointReadOnly;
    fieldOfView: XRFieldOfView;
    farDistance: number;
}

interface XRPlane {
    parentSceneObject?: XRSceneObject;
}

// extending the webxr XRMesh with babylon native properties
interface XRMesh {
    normals?: Float32Array;
    parentSceneObject?: XRSceneObject;
    positions: Float32Array; // Babylon native!
}

interface XRFrustumDetectionBoundary {
    type: "frustum";
    frustum: XRFrustum;
}

interface XRSphereDetectionBoundary {
    type: "sphere";
    radius: number;
}

interface XRBoxDetectionBoundary {
    type: "box";
    extent: DOMPointReadOnly;
}

type XRDetectionBoundary = XRFrustumDetectionBoundary | XRSphereDetectionBoundary | XRBoxDetectionBoundary;

interface XRGeometryDetectorOptions {
    detectionBoundary?: XRDetectionBoundary;
    updateInterval?: number;
}

interface XRSession {
    trySetFeaturePointCloudEnabled(enabled: boolean): boolean;
    trySetPreferredPlaneDetectorOptions(preferredOptions: XRGeometryDetectorOptions): boolean;
    trySetMeshDetectorEnabled(enabled: boolean): boolean;
    trySetPreferredMeshDetectorOptions(preferredOptions: XRGeometryDetectorOptions): boolean;
}

interface XRFrame {
    featurePointCloud?: Array<number> | undefined;
}

interface XRWorldInformation {
    detectedMeshes?: XRMeshSet;
}

/* eslint-disable @typescript-eslint/naming-convention */
// Type definitions for non-npm package webxr 0.5
// Project: https://www.w3.org/TR/webxr/
// Definitions by: Rob Rohan <https://github.com/robrohan>
//                 Raanan Weber <https://github.com/RaananW>
//                 Sean T. McBeth <https://github.com/capnmidnight>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
// Minimum TypeScript Version: 3.7

// Most of this was hand written and... more or less copied from the following
// sites:
//  https://www.w3.org/TR/webxr/
//  https://developer.mozilla.org/en-US/docs/Web/API/WebXR_Device_API
//  https://www.w3.org/immersive-web/
//  https://github.com/immersive-web
//

/**
 * ref: https://immersive-web.github.io/webxr/#navigator-xr-attribute
 */
interface Navigator {
    /**
     * An XRSystem object is the entry point to the API, used to query for XR features
     * available to the user agent and initiate communication with XR hardware via the
     * creation of XRSessions.
     */
    xr?: XRSystem | undefined;
}

/**
 * WebGL Context Compatability
 *
 * ref: https://immersive-web.github.io/webxr/#contextcompatibility
 */
interface WebGLContextAttributes {
    xrCompatible?: boolean | undefined;
}

interface WebGLRenderingContextBase {
    makeXRCompatible(): Promise<void>;
}

/**
 * Available session modes
 *
 * ref: https://immersive-web.github.io/webxr/#xrsessionmode-enum
 */
type XRSessionMode = "inline" | "immersive-vr" | "immersive-ar";

/**
 * Reference space types
 */
type XRReferenceSpaceType = "viewer" | "local" | "local-floor" | "bounded-floor" | "unbounded";

type XREnvironmentBlendMode = "opaque" | "additive" | "alpha-blend";

/**
 * ref: https://immersive-web.github.io/webxr/#xrsession-interface
 */
type XRVisibilityState = "visible" | "visible-blurred" | "hidden";

/**
 * Handedness types
 */
type XRHandedness = "none" | "left" | "right";

/**
 * InputSource target ray modes
 */
type XRTargetRayMode = "gaze" | "tracked-pointer" | "screen" | "transient-pointer";

/**
 * Eye types
 */
type XREye = "none" | "left" | "right";

type XRFrameRequestCallback = (time: DOMHighResTimeStamp, frame: XRFrame) => void;

interface XRSystemDeviceChangeEvent extends Event {
    type: "devicechange";
}

interface XRSystemDeviceChangeEventHandler {
    (event: XRSystemDeviceChangeEvent): any;
}

interface XRSystemEventMap {
    devicechange: XRSystemDeviceChangeEvent;
}

/**
 * An XRSystem object is the entry point to the API, used to query for XR features available
 * to the user agent and initiate communication with XR hardware via the creation of
 * XRSessions.
 *
 * ref: https://immersive-web.github.io/webxr/#xrsystem-interface
 */
interface XRSystem extends EventTarget {
    /**
     * Attempts to initialize an XRSession for the given mode if possible, entering immersive
     * mode if necessary.
     * @param mode
     * @param options
     */
    requestSession(mode: XRSessionMode, options?: XRSessionInit): Promise<XRSession>;

    /**
     * Queries if a given mode may be supported by the user agent and device capabilities.
     * @param mode
     */
    isSessionSupported(mode: XRSessionMode): Promise<boolean>;

    ondevicechange: XRSystemDeviceChangeEventHandler | null;

    addEventListener<K extends keyof XRSystemEventMap>(type: K, listener: (this: XRSystem, ev: XRSystemEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void;
    removeEventListener<K extends keyof XRSystemEventMap>(type: K, listener: (this: XRSystem, ev: XRSystemEventMap[K]) => any, options?: boolean | EventListenerOptions): void;
    removeEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions): void;
}

abstract class XRSystem implements XRSystem {}

/**
 * Describes a viewport, or rectangular region, of a graphics surface.
 *
 * ref: https://immersive-web.github.io/webxr/#xrviewport-interface
 */
interface XRViewport {
    readonly x: number;
    readonly y: number;
    readonly width: number;
    readonly height: number;
}

abstract class XRViewport implements XRViewport {}

/**
 * Represents a virtual coordinate system with an origin that corresponds to a physical location.
 * Spatial data that is requested from the API or given to the API is always expressed in relation
 * to a specific XRSpace at the time of a specific XRFrame. Numeric values such as pose positions
 * are coordinates in that space relative to its origin. The interface is intentionally opaque.
 *
 * ref: https://immersive-web.github.io/webxr/#xrspace-interface
 */
// tslint:disable-next-line no-empty-interface
interface XRSpace extends EventTarget {}

abstract class XRSpace implements XRSpace {}

interface XRRenderStateInit {
    baseLayer?: XRWebGLLayer | undefined;
    depthFar?: number | undefined;
    depthNear?: number | undefined;
    inlineVerticalFieldOfView?: number | undefined;
}

interface XRRenderState {
    readonly baseLayer?: XRWebGLLayer | undefined;
    readonly depthFar: number;
    readonly depthNear: number;
    readonly inlineVerticalFieldOfView?: number | undefined;
}

abstract class XRRenderState implements XRRenderState {}

interface XRReferenceSpaceEventInit extends EventInit {
    referenceSpace?: XRReferenceSpace | undefined;
    transform?: XRRigidTransform | undefined;
}

/**
 * XRReferenceSpaceEvents are fired to indicate changes to the state of an XRReferenceSpace.
 *
 * ref: https://immersive-web.github.io/webxr/#xrreferencespaceevent-interface
 */
interface XRReferenceSpaceEvent extends Event {
    readonly type: "reset";
    readonly referenceSpace: XRReferenceSpace;
    readonly transform?: XRRigidTransform | undefined;
}

// tslint:disable-next-line no-unnecessary-class
class XRReferenceSpaceEvent implements XRReferenceSpaceEvent {
    constructor(type: "reset", eventInitDict?: XRReferenceSpaceEventInit);
}

interface XRReferenceSpaceEventHandler {
    (event: XRReferenceSpaceEvent): any;
}

interface XRReferenceSpaceEventMap {
    reset: XRReferenceSpaceEvent;
}

/**
 * One of several common XRSpaces that applications can use to establish a spatial relationship
 * with the user's physical environment.
 *
 * ref: https://immersive-web.github.io/webxr/#xrreferencespace-interface
 */
interface XRReferenceSpace extends XRSpace {
    getOffsetReferenceSpace(originOffset: XRRigidTransform): XRReferenceSpace;
    onreset: XRReferenceSpaceEventHandler;

    addEventListener<K extends keyof XRReferenceSpaceEventMap>(
        type: K,
        listener: (this: XRReferenceSpace, ev: XRReferenceSpaceEventMap[K]) => any,
        options?: boolean | AddEventListenerOptions
    ): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void;
    removeEventListener<K extends keyof XRReferenceSpaceEventMap>(
        type: K,
        listener: (this: XRReferenceSpace, ev: XRReferenceSpaceEventMap[K]) => any,
        options?: boolean | EventListenerOptions
    ): void;
    removeEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions): void;
}

abstract class XRReferenceSpace implements XRReferenceSpace {}

/**
 * Extends XRReferenceSpace to include boundsGeometry, indicating the pre-configured boundaries
 * of the user's space.
 *
 * ref: https://immersive-web.github.io/webxr/#xrboundedreferencespace-interface
 */
interface XRBoundedReferenceSpace extends XRReferenceSpace {
    readonly boundsGeometry: DOMPointReadOnly[];
}

abstract class XRBoundedReferenceSpace implements XRBoundedReferenceSpace {}

/**
 * Represents an XR input source, which is any input mechanism which allows the user to perform
 * targeted actions in the same virtual space as the viewer. Example XR input sources include,
 * but are not limited to, handheld controllers, optically tracked hands, and gaze-based input
 * methods that operate on the viewer's pose. Input mechanisms which are not explicitly associated
 * with the XR device, such as traditional gamepads, mice, or keyboards SHOULD NOT be considered
 * XR input sources.
 * ref: https://immersive-web.github.io/webxr/#xrinputsource-interface
 */
interface XRInputSource {
    readonly handedness: XRHandedness;
    readonly targetRayMode: XRTargetRayMode;
    readonly targetRaySpace: XRSpace;
    readonly gripSpace?: XRSpace | undefined;
    readonly gamepad?: Gamepad | undefined;
    readonly profiles: string[];
    readonly hand?: XRHand;
    /** Indicates that the user agent recommends omitting the application's input source representation. */
    readonly skipRendering?: boolean;
}

abstract class XRInputSource implements XRInputSource {}

/**
 * Represents a list of XRInputSources. It is used in favor of a frozen array type when the contents
 * of the list are expected to change over time, such as with the XRSession inputSources attribute.
 * ref: https://immersive-web.github.io/webxr/#xrinputsourcearray-interface
 */
interface XRInputSourceArray {
    [Symbol.iterator](): IterableIterator<XRInputSource>;
    [n: number]: XRInputSource;

    length: number;

    entries(): IterableIterator<[number, XRInputSource]>;
    keys(): IterableIterator<number>;
    values(): IterableIterator<XRInputSource>;

    forEach(callbackfn: (value: XRInputSource, index: number, array: XRInputSource[]) => void, thisArg?: any): void;
}

abstract class XRInputSourceArray implements XRInputSourceArray {}

/**
 * Describes a position and orientation in space relative to an XRSpace.
 *
 * ref: https://immersive-web.github.io/webxr/#xrpose-interface
 */
interface XRPose {
    readonly transform: XRRigidTransform;
    readonly emulatedPosition: boolean;
}

abstract class XRPose implements XRPose {}

/**
 * Represents a snapshot of the state of all of the tracked objects for an XRSession. Applications
 * can acquire an XRFrame by calling requestAnimationFrame() on an XRSession with an
 * XRFrameRequestCallback. When the callback is called it will be passed an XRFrame.
 * Events which need to communicate tracking state, such as the select event, will also provide an
 * XRFrame.
 *
 * ref: https://immersive-web.github.io/webxr/#xrframe-interface
 */
interface XRFrame {
    readonly session: XRSession;
    // BABYLON CHANGE - switched to optional
    readonly predictedDisplayTime?: DOMHighResTimeStamp;

    /**
     * Provides the pose of space relative to baseSpace as an XRPose, at the time represented by
     * the XRFrame.
     *
     * @param space
     * @param baseSpace
     */
    getPose(space: XRSpace, baseSpace: XRSpace): XRPose | undefined;

    /**
     * Provides the pose of the viewer relative to referenceSpace as an XRViewerPose, at the
     * XRFrame's time.
     *
     * @param referenceSpace
     */
    getViewerPose(referenceSpace: XRReferenceSpace): XRViewerPose | undefined;

    /**
     * The tracked body for this frame, when the body tracking feature is enabled.
     * ref: https://immersive-web.github.io/body-tracking/#xrframe-interface
     */
    body?: XRBody;
}

abstract class XRFrame implements XRFrame {}

/**
 * Represents the XRBodySpace native interface as defined by the spec.
 * An XRBodySpace is an XRSpace that additionally exposes a jointName.
 * ref: https://immersive-web.github.io/body-tracking/#xrjointspace-interface
 */
interface XRBodySpace extends XRSpace {
    readonly jointName: string;
}

/**
 * Represents the native XRBody interface as defined by the spec.
 * An XRBody is an iterable map of XRBodyJoint to XRBodySpace.
 * ref: https://immersive-web.github.io/body-tracking/#xrbody-interface
 */
interface XRBody {
    readonly size: number;
    get(key: string): XRBodySpace | undefined;
    forEach(callbackfn: (value: XRBodySpace, key: string, map: XRBody) => void): void;
    [Symbol.iterator](): IterableIterator<[string, XRBodySpace]>;
    entries(): IterableIterator<[string, XRBodySpace]>;
    keys(): IterableIterator<string>;
    values(): IterableIterator<XRBodySpace>;
}

/**
 * Type of XR events available
 */
type XRInputSourceEventType = "select" | "selectend" | "selectstart" | "squeeze" | "squeezeend" | "squeezestart";

interface XRInputSourceEventInit extends EventInit {
    frame?: XRFrame | undefined;
    inputSource?: XRInputSource | undefined;
}

/**
 * XRInputSourceEvents are fired to indicate changes to the state of an XRInputSource.
 * ref: https://immersive-web.github.io/webxr/#xrinputsourceevent-interface
 */
class XRInputSourceEvent extends Event {
    readonly type: XRInputSourceEventType;
    readonly frame: XRFrame;
    readonly inputSource: XRInputSource;

    constructor(type: XRInputSourceEventType, eventInitDict?: XRInputSourceEventInit);
}

interface XRInputSourceEventHandler {
    (evt: XRInputSourceEvent): any;
}

type XRSessionEventType = "end" | "visibilitychange" | "frameratechange";

interface XRSessionEventInit extends EventInit {
    session: XRSession;
}

/**
 * XRSessionEvents are fired to indicate changes to the state of an XRSession.
 * ref: https://immersive-web.github.io/webxr/#xrsessionevent-interface
 */
class XRSessionEvent extends Event {
    readonly session: XRSession;
    constructor(type: XRSessionEventType, eventInitDict?: XRSessionEventInit);
}

interface XRSessionEventHandler {
    (evt: XRSessionEvent): any;
}

/**
 * ref: https://immersive-web.github.io/webxr/#feature-dependencies
 */
interface XRSessionInit {
    optionalFeatures?: string[] | undefined;
    requiredFeatures?: string[] | undefined;
}

interface XRSessionEventMap {
    inputsourceschange: XRInputSourceChangeEvent;
    end: XRSessionEvent;
    visibilitychange: XRSessionEvent;
    frameratechange: XRSessionEvent;
    select: XRInputSourceEvent;
    selectstart: XRInputSourceEvent;
    selectend: XRInputSourceEvent;
    squeeze: XRInputSourceEvent;
    squeezestart: XRInputSourceEvent;
    squeezeend: XRInputSourceEvent;
    eyetrackingstart: XREyeTrackingSourceEvent;
    eyetrackingend: XREyeTrackingSourceEvent;
}

/**
 * Any interaction with XR hardware is done via an XRSession object, which can only be
 * retrieved by calling requestSession() on the XRSystem object. Once a session has been
 * successfully acquired, it can be used to poll the viewer pose, query information about
 * the user's environment, and present imagery to the user.
 *
 * ref: https://immersive-web.github.io/webxr/#xrsession-interface
 */
interface XRSession extends EventTarget {
    /**
     * Returns a list of this session's XRInputSources, each representing an input device
     * used to control the camera and/or scene.
     */
    readonly inputSources: XRInputSourceArray;
    /**
     * object which contains options affecting how the imagery is rendered.
     * This includes things such as the near and far clipping planes
     */
    readonly renderState: XRRenderState;
    readonly environmentBlendMode: XREnvironmentBlendMode;
    readonly visibilityState: XRVisibilityState;
    readonly frameRate?: number | undefined;
    readonly supportedFrameRates?: Float32Array | undefined;
    readonly maxRenderLayers?: number | undefined;

    /**
     * Removes a callback from the animation frame painting callback from
     * XRSession's set of animation frame rendering callbacks, given the
     * identifying handle returned by a previous call to requestAnimationFrame().
     */
    cancelAnimationFrame(id: number): void;

    /**
     * Ends the WebXR session. Returns a promise which resolves when the
     * session has been shut down.
     */
    end(): Promise<void>;

    /**
     * Schedules the specified method to be called the next time the user agent
     * is working on rendering an animation frame for the WebXR device. Returns an
     * integer value which can be used to identify the request for the purposes of
     * canceling the callback using cancelAnimationFrame(). This method is comparable
     * to the Window.requestAnimationFrame() method.
     */
    requestAnimationFrame(callback: XRFrameRequestCallback): number;

    /**
     * Requests that a new XRReferenceSpace of the specified type be created.
     * Returns a promise which resolves with the XRReferenceSpace or
     * XRBoundedReferenceSpace which was requested, or throws a NotSupportedError if
     * the requested space type isn't supported by the device.
     */
    requestReferenceSpace(type: XRReferenceSpaceType): Promise<XRReferenceSpace | XRBoundedReferenceSpace>;

    updateRenderState(renderStateInit?: XRRenderStateInit): Promise<void>;

    updateTargetFrameRate(rate: number): Promise<void>;

    onend: XRSessionEventHandler;
    oninputsourceschange: XRInputSourceChangeEventHandler;
    onselect: XRInputSourceEventHandler;
    onselectstart: XRInputSourceEventHandler;
    onselectend: XRInputSourceEventHandler;
    onsqueeze: XRInputSourceEventHandler;
    onsqueezestart: XRInputSourceEventHandler;
    onsqueezeend: XRInputSourceEventHandler;
    onvisibilitychange: XRSessionEventHandler;
    onframeratechange: XRSessionEventHandler;

    addEventListener<K extends keyof XRSessionEventMap>(type: K, listener: (this: XRSession, ev: XRSessionEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void;
    removeEventListener<K extends keyof XRSessionEventMap>(type: K, listener: (this: XRSession, ev: XRSessionEventMap[K]) => any, options?: boolean | EventListenerOptions): void;
    removeEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions): void;
}

abstract class XRSession implements XRSession {}

/**
 * An XRPose describing the state of a viewer of the XR scene as tracked by the XR
 * device. A viewer may represent a tracked piece of hardware, the observed position
 * of a user's head relative to the hardware, or some other means of computing a series
 * of viewpoints into the XR scene. XRViewerPoses can only be queried relative to an
 * XRReferenceSpace. It provides, in addition to the XRPose values, an array of views
 * which include rigid transforms to indicate the viewpoint and projection matrices.
 * These values should be used by the application when rendering a frame of an XR scene.
 *
 * ref: https://immersive-web.github.io/webxr/#xrviewerpose-interface
 */
interface XRViewerPose extends XRPose {
    readonly views: ReadonlyArray<XRView>;
}

abstract class XRViewerPose implements XRViewerPose {}

/**
 * A transform described by a position and orientation. When interpreting an
 * XRRigidTransform the orientation is always applied prior to the position.
 *
 * ref: https://immersive-web.github.io/webxr/#xrrigidtransform-interface
 */
class XRRigidTransform {
    readonly position: DOMPointReadOnly;
    readonly orientation: DOMPointReadOnly;
    readonly matrix: Float32Array;
    readonly inverse: XRRigidTransform;

    constructor(position?: DOMPointInit, direction?: DOMPointInit);
}

/**
 * Describes a single view into an XR scene for a given frame.
 *
 * ref: https://immersive-web.github.io/webxr/#xrview-interface
 */
interface XRView {
    readonly eye: XREye;
    readonly projectionMatrix: Float32Array;
    readonly transform: XRRigidTransform;
    readonly recommendedViewportScale?: number | null | undefined;
    requestViewportScale(scale: number | null): void;
}

abstract class XRView implements XRView {}

/**
 * XRInputSourcesChangeEvents are fired to indicate changes to the XRInputSources that are
 * available to an XRSession.
 * ref: https://immersive-web.github.io/webxr/#xrinputsourceschangeevent-interface
 */
interface XRInputSourceChangeEvent extends XRSessionEvent {
    readonly removed: ReadonlyArray<XRInputSource>;
    readonly added: ReadonlyArray<XRInputSource>;
}

interface XRInputSourceChangeEventHandler {
    (evt: XRInputSourceChangeEvent): any;
}

// Experimental/Draft features

// Anchors
type XRAnchorSet = Set<XRAnchor>;

interface XRAnchor {
    anchorSpace: XRSpace;
    requestPersistentHandle?: () => Promise<string>;
    delete(): void;
}

abstract class XRAnchor implements XRAnchor {}

interface XRSession {
    readonly persistentAnchors?: ReadonlyArray<string>;
    restorePersistentAnchor?: (uuid: string) => Promise<XRAnchor>;
    deletePersistentAnchor?: (uuid: string) => Promise<void>;
}

interface XRFrame {
    trackedAnchors?: XRAnchorSet | undefined;
    createAnchor?: (pose: XRRigidTransform, space: XRSpace) => Promise<XRAnchor>;
}

// AR Hit testing
class XRRay {
    readonly origin: DOMPointReadOnly;
    readonly direction: DOMPointReadOnly;
    readonly matrix: Float32Array;

    constructor(transformOrOrigin?: XRRigidTransform | DOMPointInit, direction?: DOMPointInit);
}

type XRHitTestTrackableType = "point" | "plane" | "mesh";

interface XRTransientInputHitTestResult {
    readonly inputSource: XRInputSource;
    readonly results: ReadonlyArray<XRHitTestResult>;
}

class XRTransientInputHitTestResult {
    prototype: XRTransientInputHitTestResult;
}

interface XRHitTestResult {
    getPose(baseSpace: XRSpace): XRPose | undefined;
    // When anchor system is enabled
    createAnchor?: (pose: XRRigidTransform) => Promise<XRAnchor> | undefined;
}

abstract class XRHitTestResult implements XRHitTestResult {}

interface XRHitTestSource {
    cancel(): void;
}

abstract class XRHitTestSource implements XRHitTestSource {}

interface XRTransientInputHitTestSource {
    cancel(): void;
}

abstract class XRTransientInputHitTestSource implements XRTransientInputHitTestSource {}

interface XRHitTestOptionsInit {
    space: XRSpace;
    entityTypes?: XRHitTestTrackableType[] | undefined;
    offsetRay?: XRRay | undefined;
}

interface XRTransientInputHitTestOptionsInit {
    profile: string;
    entityTypes?: XRHitTestTrackableType[] | undefined;
    offsetRay?: XRRay | undefined;
}

interface XRSession {
    requestHitTestSource?: (options: XRHitTestOptionsInit) => Promise<XRHitTestSource>;
    requestHitTestSourceForTransientInput?: (options: XRTransientInputHitTestOptionsInit) => Promise<XRTransientInputHitTestSource>;

    // Legacy
    requestHitTest?: (ray: XRRay, referenceSpace: XRReferenceSpace) => Promise<XRHitResult[]>;
}

interface XRFrame {
    getHitTestResults(hitTestSource: XRHitTestSource): XRHitTestResult[];
    getHitTestResultsForTransientInput(hitTestSource: XRTransientInputHitTestSource): XRTransientInputHitTestResult[];
}

// Legacy
interface XRHitResult {
    hitMatrix: Float32Array;
}

// Plane detection
type XRPlaneSet = Set<XRPlane>;

type XRPlaneOrientation = "horizontal" | "vertical";

interface XRPlane {
    orientation: XRPlaneOrientation;
    planeSpace: XRSpace;
    polygon: DOMPointReadOnly[];
    lastChangedTime: number;
    semanticLabel?: string | null;
}

abstract class XRPlane implements XRPlane {}

interface XRSession {
    // Legacy
    updateWorldTrackingState?: (options: { planeDetectionState?: { enabled: boolean } | undefined }) => void | undefined;
}

// interface XRFrame {
//     worldInformation?:
//         | {
//               detectedPlanes?: XRPlaneSet | undefined;
//           }
//         | undefined;
// }

// Hand Tracking
type XRHandJoint =
    | "wrist"
    | "thumb-metacarpal"
    | "thumb-phalanx-proximal"
    | "thumb-phalanx-distal"
    | "thumb-tip"
    | "index-finger-metacarpal"
    | "index-finger-phalanx-proximal"
    | "index-finger-phalanx-intermediate"
    | "index-finger-phalanx-distal"
    | "index-finger-tip"
    | "middle-finger-metacarpal"
    | "middle-finger-phalanx-proximal"
    | "middle-finger-phalanx-intermediate"
    | "middle-finger-phalanx-distal"
    | "middle-finger-tip"
    | "ring-finger-metacarpal"
    | "ring-finger-phalanx-proximal"
    | "ring-finger-phalanx-intermediate"
    | "ring-finger-phalanx-distal"
    | "ring-finger-tip"
    | "pinky-finger-metacarpal"
    | "pinky-finger-phalanx-proximal"
    | "pinky-finger-phalanx-intermediate"
    | "pinky-finger-phalanx-distal"
    | "pinky-finger-tip";

interface XRJointSpace extends XRSpace {
    readonly jointName: XRHandJoint;
}

abstract class XRJointSpace implements XRJointSpace {}

interface XRJointPose extends XRPose {
    readonly radius: number | undefined;
}

abstract class XRJointPose implements XRJointPose {}

interface XRHand extends Map<XRHandJoint, XRJointSpace> {
    readonly WRIST: number;

    readonly THUMB_METACARPAL: number;
    readonly THUMB_PHALANX_PROXIMAL: number;
    readonly THUMB_PHALANX_DISTAL: number;
    readonly THUMB_PHALANX_TIP: number;

    readonly INDEX_METACARPAL: number;
    readonly INDEX_PHALANX_PROXIMAL: number;
    readonly INDEX_PHALANX_INTERMEDIATE: number;
    readonly INDEX_PHALANX_DISTAL: number;
    readonly INDEX_PHALANX_TIP: number;

    readonly MIDDLE_METACARPAL: number;
    readonly MIDDLE_PHALANX_PROXIMAL: number;
    readonly MIDDLE_PHALANX_INTERMEDIATE: number;
    readonly MIDDLE_PHALANX_DISTAL: number;
    readonly MIDDLE_PHALANX_TIP: number;

    readonly RING_METACARPAL: number;
    readonly RING_PHALANX_PROXIMAL: number;
    readonly RING_PHALANX_INTERMEDIATE: number;
    readonly RING_PHALANX_DISTAL: number;
    readonly RING_PHALANX_TIP: number;

    readonly LITTLE_METACARPAL: number;
    readonly LITTLE_PHALANX_PROXIMAL: number;
    readonly LITTLE_PHALANX_INTERMEDIATE: number;
    readonly LITTLE_PHALANX_DISTAL: number;
    readonly LITTLE_PHALANX_TIP: number;
}

abstract class XRHand extends Map<XRHandJoint, XRJointSpace> implements XRHand {}

// WebXR Layers

/**
 * The base class for XRWebGLLayer and other layer types introduced by future extensions.
 * ref: https://immersive-web.github.io/webxr/#xrlayer-interface
 */
// tslint:disable-next-line no-empty-interface
interface XRLayer extends EventTarget {}

abstract class XRLayer implements XRLayer {}

interface XRWebGLLayerInit {
    antialias?: boolean | undefined;
    depth?: boolean | undefined;
    stencil?: boolean | undefined;
    alpha?: boolean | undefined;
    ignoreDepthValues?: boolean | undefined;
    framebufferScaleFactor?: number | undefined;
}

/**
 * A layer which provides a WebGL framebuffer to render into, enabling hardware accelerated
 * rendering of 3D graphics to be presented on the XR device. *
 * ref: https://immersive-web.github.io/webxr/#xrwebgllayer-interface
 */
class XRWebGLLayer extends XRLayer {
    static getNativeFramebufferScaleFactor(session: XRSession): number;

    constructor(session: XRSession, context: WebGLRenderingContext | WebGL2RenderingContext, layerInit?: XRWebGLLayerInit);

    readonly antialias: boolean;
    readonly ignoreDepthValues: boolean;
    fixedFoveation?: number | undefined;

    readonly framebuffer: WebGLFramebuffer;
    readonly framebufferWidth: number;
    readonly framebufferHeight: number;

    getViewport(view: XRView): XRViewport | undefined;
}

interface XRRenderStateInit {
    layers?: XRLayer[] | undefined;
}

interface XRRenderState {
    readonly layers?: XRLayer[] | undefined;
}

type XRLayerEventType = "redraw";

interface XRLayerEvent extends Event {
    readonly type: XRLayerEventType;
    readonly layer: XRLayer;
}

interface XRCompositionLayerEventMap {
    redraw: XRLayerEvent;
}

interface XRCompositionLayer extends XRLayer {
    readonly layout: XRLayerLayout;
    blendTextureSourceAlpha: boolean;
    chromaticAberrationCorrection?: boolean | undefined;
    forceMonoPresentation?: boolean | undefined;
    opacity?: number | undefined;
    readonly mipLevels: number;
    readonly needsRedraw: boolean;
    quality?: XRLayerQuality | undefined;
    destroy(): void;

    space: XRSpace;

    // Events
    onredraw: (evt: XRCompositionLayerEventMap["redraw"]) => any;

    addEventListener<K extends keyof XRCompositionLayerEventMap>(
        this: XRCompositionLayer,
        type: K,
        callback: (evt: XRCompositionLayerEventMap[K]) => any,
        options?: boolean | AddEventListenerOptions
    ): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void;

    removeEventListener<K extends keyof XRCompositionLayerEventMap>(this: XRCompositionLayer, type: K, callback: (evt: XRCompositionLayerEventMap[K]) => any): void;
    removeEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions): void;
}

abstract class XRCompositionLayer implements XRCompositionLayer {}

type XRTextureType = "texture" | "texture-array";

type XRLayerLayout = "default" | "mono" | "stereo" | "stereo-left-right" | "stereo-top-bottom";

type XRLayerQuality = "default" | "text-optimized" | "graphics-optimized";

interface XRProjectionLayerInit {
    scaleFactor?: number | undefined;
    textureType?: XRTextureType | undefined;
    colorFormat?: GLenum | undefined;
    depthFormat?: GLenum | undefined;
    clearOnAccess?: boolean | undefined;
}

interface XRProjectionLayer extends XRCompositionLayer {
    readonly textureWidth: number;
    readonly textureHeight: number;
    readonly textureArrayLength: number;
    readonly ignoreDepthValues: number;
    fixedFoveation?: number | null | undefined;
}

abstract class XRProjectionLayer implements XRProjectionLayer {}

interface XRLayerInit {
    mipLevels?: number | undefined;
    viewPixelWidth: number;
    viewPixelHeight: number;
    isStatic?: boolean | undefined;
    colorFormat?: GLenum | undefined;
    depthFormat?: GLenum | undefined;
    space: XRSpace;
    layout?: XRLayerLayout | undefined;
    clearOnAccess?: boolean | undefined;
}

interface XRMediaLayerInit {
    invertStereo?: boolean | undefined;
    space: XRSpace;
    layout?: XRLayerLayout | undefined;
}

interface XRCylinderLayerInit extends XRLayerInit {
    textureType?: XRTextureType | undefined;
    transform?: XRRigidTransform | undefined;
    radius?: number | undefined;
    centralAngle?: number | undefined;
    aspectRatio?: number | undefined;
}

interface XRMediaCylinderLayerInit extends XRMediaLayerInit {
    transform?: XRRigidTransform | undefined;
    radius?: number | undefined;
    centralAngle?: number | undefined;
    aspectRatio?: number | undefined;
}

interface XRCylinderLayer extends XRCompositionLayer {
    transform: XRRigidTransform;
    radius: number;
    centralAngle: number;
    aspectRatio: number;
}

abstract class XRCylinderLayer implements XRCylinderLayer {}

interface XRQuadLayerInit extends XRLayerInit {
    textureType?: XRTextureType | undefined;
    transform?: XRRigidTransform | undefined;
    width?: number | undefined;
    height?: number | undefined;
}

interface XRMediaQuadLayerInit extends XRMediaLayerInit {
    transform?: XRRigidTransform | undefined;
    width?: number | undefined;
    height?: number | undefined;
}

interface XRQuadLayer extends XRCompositionLayer {
    transform: XRRigidTransform;
    width: number;
    height: number;
}

abstract class XRQuadLayer implements XRQuadLayer {}

interface XREquirectLayerInit extends XRLayerInit {
    textureType?: XRTextureType | undefined;
    transform?: XRRigidTransform | undefined;
    radius?: number | undefined;
    centralHorizontalAngle?: number | undefined;
    upperVerticalAngle?: number | undefined;
    lowerVerticalAngle?: number | undefined;
}

interface XRMediaEquirectLayerInit extends XRMediaLayerInit {
    transform?: XRRigidTransform | undefined;
    radius?: number | undefined;
    centralHorizontalAngle?: number | undefined;
    upperVerticalAngle?: number | undefined;
    lowerVerticalAngle?: number | undefined;
}

interface XREquirectLayer extends XRCompositionLayer {
    transform: XRRigidTransform;
    radius: number;
    centralHorizontalAngle: number;
    upperVerticalAngle: number;
    lowerVerticalAngle: number;
}

abstract class XREquirectLayer implements XREquirectLayer {}

interface XRCubeLayerInit extends XRLayerInit {
    orientation?: DOMPointReadOnly | undefined;
}

interface XRCubeLayer extends XRCompositionLayer {
    orientation: DOMPointReadOnly;
}

abstract class XRCubeLayer implements XRCubeLayer {}

interface XRSubImage {
    readonly viewport: XRViewport;
}

abstract class XRSubImage implements XRSubImage {}

interface XRWebGLSubImage extends XRSubImage {
    readonly colorTexture: WebGLTexture;
    readonly depthStencilTexture?: WebGLTexture;
    readonly motionVectorTexture?: WebGLTexture;
    readonly imageIndex: number;
    readonly textureWidth: number;
    readonly textureHeight: number;
    readonly colorTextureWidth?: number;
    readonly colorTextureHeight?: number;
    readonly depthStencilTextureWidth?: number;
    readonly depthStencilTextureHeight?: number;
    readonly motionVectorTextureWidth?: number;
    readonly motionVectorTextureHeight?: number;
}

abstract class XRWebGLSubImage implements XRWebGLSubImage {}

class XRWebGLBinding {
    readonly nativeProjectionScaleFactor: number;

    constructor(session: XRSession, context: WebGLRenderingContext);

    createProjectionLayer(init?: XRProjectionLayerInit): XRProjectionLayer;
    createQuadLayer(init?: XRQuadLayerInit): XRQuadLayer;
    createCylinderLayer(init?: XRCylinderLayerInit): XRCylinderLayer;
    createEquirectLayer(init?: XREquirectLayerInit): XREquirectLayer;
    createCubeLayer(init?: XRCubeLayerInit): XRCubeLayer;

    getSubImage(layer: XRCompositionLayer, frame: XRFrame, eye?: XREye): XRWebGLSubImage;
    getViewSubImage(layer: XRProjectionLayer, view: XRView): XRWebGLSubImage;

    // BABYLON addition
    getReflectionCubeMap: (lightProbe: XRLightProbe) => WebGLTexture;
}

class XRMediaBinding {
    constructor(sesion: XRSession);

    createQuadLayer(video: HTMLVideoElement, init?: XRMediaQuadLayerInit): XRQuadLayer;
    createCylinderLayer(video: HTMLVideoElement, init?: XRMediaCylinderLayerInit): XRCylinderLayer;
    createEquirectLayer(video: HTMLVideoElement, init?: XRMediaEquirectLayerInit): XREquirectLayer;
}

// WebGL extensions
interface WebGLRenderingContextBase {
    getExtension(extensionName: "OCULUS_multiview"): OCULUS_multiview | null;
}

enum XOVR_multiview2 {
    FRAMEBUFFER_ATTACHMENT_TEXTURE_NUM_VIEWS_OVR = 0x9630,
    FRAMEBUFFER_ATTACHMENT_TEXTURE_BASE_VIEW_INDEX_OVR = 0x9632,
    MAX_VIEWS_OVR = 0x9631,
    FRAMEBUFFER_INCOMPLETE_VIEW_TARGETS_OVR = 0x9633,
}

// Oculus extensions
interface XRSessionGrant {
    mode: XRSessionMode;
}

interface XRSystemSessionGrantedEvent extends Event {
    type: "sessiongranted";
    session: XRSessionGrant;
}

interface XRSystemSessionGrantedEventHandler {
    (event: XRSystemSessionGrantedEvent): any;
}

interface XRSystemEventMap {
    // Session Grant events are an Meta Oculus Browser extension
    sessiongranted: XRSystemSessionGrantedEvent;
}

interface XRSystem {
    onsessiongranted: XRSystemSessionGrantedEventHandler | null;
}

interface OCULUS_multiview extends OVR_multiview2 {
    framebufferTextureMultisampleMultiviewOVR(
        target: GLenum,
        attachment: GLenum,
        texture: WebGLTexture | null,
        level: GLint,
        samples: GLsizei,
        baseViewIndex: GLint,
        numViews: GLsizei
    ): void;
}

abstract class OCULUS_multiview implements OCULUS_multiview {}

/**
 * BEGIN: WebXR DOM Overlays Module
 * https://immersive-web.github.io/dom-overlays/
 */

interface GlobalEventHandlersEventMap {
    beforexrselect: XRSessionEvent;
}

interface GlobalEventHandlers {
    /**
     * An XRSessionEvent of type beforexrselect is dispatched on the DOM overlay
     * element before generating a WebXR selectstart input event if the -Z axis
     * of the input source's targetRaySpace intersects the DOM overlay element
     * at the time the input device's primary action is triggered.
     */
    onbeforexrselect: ((this: GlobalEventHandlers, ev: XRSessionEvent) => any) | null;
}

interface XRDOMOverlayInit {
    root: Element;
}

interface XRSessionInit {
    domOverlay?: XRDOMOverlayInit | undefined;
}

type XRDOMOverlayType = "screen" | "floating" | "head-locked";

interface XRDOMOverlayState {
    type: XRDOMOverlayType;
}

interface XRSession {
    readonly domOverlayState?: XRDOMOverlayState | undefined;
}

/// BABYLON EDITS
interface XREyeTrackingSourceEvent extends XRSessionEvent {
    readonly gazeSpace: XRSpace;
}

interface XRFrame {
    fillPoses?(spaces: XRSpace[], baseSpace: XRSpace, transforms: Float32Array): boolean;
    // Anchors
    trackedAnchors?: XRAnchorSet;
    // World geometries. DEPRECATED
    worldInformation?: XRWorldInformation | undefined;
    detectedPlanes?: XRPlaneSet | undefined;
    // Hand tracking
    getJointPose?(joint: XRJointSpace, baseSpace: XRSpace): XRJointPose;
    fillJointRadii?(jointSpaces: XRJointSpace[], radii: Float32Array): boolean;
    // Image tracking
    getImageTrackingResults?(): Array<XRImageTrackingResult>;
    getLightEstimate(xrLightProbe: XRLightProbe): XRLightEstimate;
}

// Plane detection
interface XRSession {
    initiateRoomCapture?(): Promise<void>;
}

type XREventType = keyof XRSessionEventMap;

type XRImageTrackingState = "tracked" | "emulated";
type XRImageTrackingScore = "untrackable" | "trackable";

interface XRTrackedImageInit {
    image: ImageBitmap;
    widthInMeters: number;
}

interface XRImageTrackingResult {
    readonly imageSpace: XRSpace;
    readonly index: number;
    readonly trackingState: XRImageTrackingState;
    readonly measuredWidthInMeters: number;
}

interface XRPose {
    readonly linearVelocity?: DOMPointReadOnly;
    readonly angularVelocity?: DOMPointReadOnly;
}

type XRLightProbeInit = {
    reflectionFormat: XRReflectionFormat;
};

type XRReflectionFormat = "srgba8" | "rgba16f";

interface XRSession {
    readonly preferredReflectionFormat?: XRReflectionFormat;
    /**
     * The XRSession interface is extended with the ability to create new XRLightProbe instances.
     * XRLightProbe instances have a session object, which is the XRSession that created this XRLightProbe.
     *
     * Can reject with with a "NotSupportedError" DOMException
     */
    requestLightProbe(options?: XRLightProbeInit): Promise<XRLightProbe>;

    getTrackedImageScores?(): Promise<XRImageTrackingScore[]>;
}

interface XRWorldInformation {
    detectedPlanes?: XRPlaneSet;
}

interface XRSessionInit {
    trackedImages?: XRTrackedImageInit[];
}

interface XRLightEstimate {
    readonly sphericalHarmonicsCoefficients: Float32Array;
    readonly primaryLightDirection: DOMPointReadOnly;
    readonly primaryLightIntensity: DOMPointReadOnly;
}

interface XREventHandler {
    (evt: Event): any;
}

interface XRLightProbe extends EventTarget {
    readonly probeSpace: XRSpace;
    onreflectionchange: XREventHandler;
}

/**
 * END: WebXR DOM Overlays Module
 * https://immersive-web.github.io/dom-overlays/
 */

/**
 * BEGIN: WebXR Depth Sensing Moudle
 * https://www.w3.org/TR/webxr-depth-sensing-1/
 */

type XRDepthUsage = "cpu-optimized" | "gpu-optimized";
type XRDepthDataFormat = "luminance-alpha" | "float32" | "unsigned-short";

type XRDepthStateInit = {
    readonly usagePreference: XRDepthUsage[];
    readonly dataFormatPreference: XRDepthDataFormat[];
};

interface XRSessionInit {
    depthSensing?: XRDepthStateInit;
}

interface XRSession {
    readonly depthUsage: XRDepthUsage;
    readonly depthDataFormat: XRDepthDataFormat;
}

interface XRDepthInformation {
    readonly width: number;
    readonly height: number;

    readonly normDepthBufferFromNormView: XRRigidTransform;
    readonly rawValueToMeters: number;
}

interface XRCPUDepthInformation extends XRDepthInformation {
    readonly data: ArrayBuffer;

    getDepthInMeters(x: number, y: number): number;
}

interface XRFrame {
    getDepthInformation(view: XRView): XRCPUDepthInformation | undefined;
}

interface XRWebGLDepthInformation extends XRDepthInformation {
    readonly texture: WebGLTexture;

    readonly textureType: XRTextureType;
    readonly imageIndex?: number | undefined;
}

interface XRWebGLBinding {
    getDepthInformation(view: XRView): XRWebGLDepthInformation | undefined;
}

// enabledFeatures
interface XRSession {
    enabledFeatures: string[];
}

// Raw camera access

interface XRView {
    readonly camera: XRCamera | undefined;
}

interface XRCamera {
    readonly width: number;
    readonly height: number;
}

interface XRWebGLBinding {
    getCameraImage(camera: XRCamera): WebGLTexture | undefined;
}

// Mesh Detection

interface XRMesh {
    meshSpace: XRSpace;
    vertices: Float32Array;
    indices: Uint32Array;
    lastChangedTime: DOMHighResTimeStamp;
    semanticLabel?: string | null;
}

type XRMeshSet = Set<XRMesh>;

interface XRFrame {
    detectedMeshes?: XRMeshSet;
}

/* eslint-disable babylonjs/available */
/* eslint-disable @typescript-eslint/naming-convention */

// WebGPU type augmentations for APIs not yet in TypeScript's lib.dom.d.ts.
// Do NOT re-types, interfaces, or classes already in lib.dom.d.ts,
// as duplicate declarations cause errors with TypeScript 6.0+ which natively
// includes WebGPU types.

// String indexer and extra supported limits not yet in lib.dom.d.ts
interface GPUSupportedLimits {
    [name: string]: number;
    readonly maxStorageBuffersInVertexStage: number;
    readonly maxStorageBuffersInFragmentStage: number;
    readonly maxStorageTexturesInVertexStage: number;
    readonly maxStorageTexturesInFragmentStage: number;
}

// Extra adapter request options not yet in lib.dom.d.ts
interface GPURequestAdapterOptions {
    featureLevel?: string;
    xrCompatible?: boolean;
}

// Extra texture properties not yet in lib.dom.d.ts
interface GPUTexture {
    readonly textureBindingViewDimension: GPUTextureViewDimension | undefined;
}

interface GPUTextureDescriptor {
    textureBindingViewDimension?: GPUTextureViewDimension;
}

// Extra view descriptor property not yet in lib.dom.d.ts
interface GPUTextureViewDescriptor {
    swizzle?: string;
}

// Shader compilation hints not yet in lib.dom.d.ts
interface GPUShaderModuleDescriptor {
    compilationHints?: GPUShaderModuleCompilationHint[];
}

interface GPUShaderModuleCompilationHint {
    entryPoint: string;
    layout?: GPUPipelineLayout | GPUAutoLayoutMode;
}

// Empty mixin not in lib.dom.d.ts, used for type compatibility
interface GPUCommandsMixin {}

/* eslint-disable no-var */
/* eslint-disable @typescript-eslint/naming-convention */
// Type definitions for WebGL 2 extended with Babylon specific types

interface WebGL2RenderingContext extends WebGL2RenderingContextBase {
    HALF_FLOAT_OES: number;
    RGBA16F: typeof WebGL2RenderingContext.RGBA16F;
    RGBA32F: typeof WebGL2RenderingContext.RGBA32F;
    DEPTH24_STENCIL8: typeof WebGL2RenderingContext.DEPTH24_STENCIL8;
    COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR: number;
    COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR: number;
    COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR: number;
    COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR: number;
    COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR: number;
    COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR: number;
    COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR: number;
    COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR: number;
    COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR: number;
    COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR: number;
    COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR: number;
    COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR: number;
    COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR: number;
    COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR: number;
    COMPRESSED_SRGB_S3TC_DXT1_EXT: number;
    COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT: number;
    COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT: number;
    COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT: number;
    COMPRESSED_SRGB8_ETC2: number;
    COMPRESSED_SRGB8_ALPHA8_ETC2_EAC: number;
    DRAW_FRAMEBUFFER: typeof WebGL2RenderingContext.DRAW_FRAMEBUFFER;
    UNSIGNED_INT_24_8: typeof WebGL2RenderingContext.UNSIGNED_INT_24_8;
    MIN: typeof WebGL2RenderingContext.MIN;
    MAX: typeof WebGL2RenderingContext.MAX;
    R16_EXT: number;
    RG16_EXT: number;
    RGB16_EXT: number;
    RGBA16_EXT: number;
    R16_SNORM_EXT: number;
    RG16_SNORM_EXT: number;
    RGB16_SNORM_EXT: number;
    RGBA16_SNORM_EXT: number;

    // OES_draw_buffers_indexed extension methods
    blendEquationSeparateIndexed(buf: GLuint, modeRGB: GLenum, modeAlpha: GLenum): void;
    blendEquationIndexed(buf: GLuint, mode: GLenum): void;
    blendFuncSeparateIndexed(buf: GLuint, srcRGB: GLenum, dstRGB: GLenum, srcAlpha: GLenum, dstAlpha: GLenum): void;
    blendFuncIndexed(buf: GLuint, src: GLenum, dst: GLenum): void;
    colorMaskIndexed(buf: GLuint, r: GLboolean, g: GLboolean, b: GLboolean, a: GLboolean): void;
    disableIndexed(target: GLenum, index: GLuint): void;
    enableIndexed(target: GLenum, index: GLuint): void;
}

interface EXT_disjoint_timer_query {
    QUERY_COUNTER_BITS_EXT: number;
    TIME_ELAPSED_EXT: number;
    TIMESTAMP_EXT: number;
    GPU_DISJOINT_EXT: number;
    QUERY_RESULT_EXT: number;
    QUERY_RESULT_AVAILABLE_EXT: number;
    queryCounterEXT(query: WebGLQuery, target: number): void;
    createQueryEXT(): WebGLQuery;
    beginQueryEXT(target: number, query: WebGLQuery): void;
    endQueryEXT(target: number): void;
    getQueryObjectEXT(query: WebGLQuery, target: number): any;
    deleteQueryEXT(query: WebGLQuery): void;
}

interface WebGLProgram {
    __SPECTOR_rebuildProgram?:
        ((vertexSourceCode: string, fragmentSourceCode: string, onCompiled: (program: WebGLProgram) => void, onError: (message: string) => void) => void) | null;
}

interface WebGLUniformLocation {
    _currentState: any;
}

/**
 * TODO: remove this file when we upgrade to TypeScript 5.0
 */

/* eslint-disable no-var */
/* eslint-disable @typescript-eslint/naming-convention */
interface OffscreenCanvasEventMap {
    contextlost: Event;
    contextrestored: Event;
}

interface ImageEncodeOptions {
    quality?: number;
    type?: string;
}

// These types are only needed for older versions of typescript.
// The BJS addition is only needed because otherwise it is a type duplicate definition
type OffscreenRenderingContextIdBJS = "2d" | "bitmaprenderer" | "webgl" | "webgl2" | "webgpu";
type OffscreenRenderingContextBJS = OffscreenCanvasRenderingContext2D | ImageBitmapRenderingContext | WebGLRenderingContext | WebGL2RenderingContext;

interface OffscreenCanvas extends EventTarget {
    /**
     * These attributes return the dimensions of the OffscreenCanvas object's bitmap.
     *
     * They can be set, to replace the bitmap with a new, transparent black bitmap of the specified dimensions (effectively resizing it).
     */
    height: number;
    oncontextlost: ((this: OffscreenCanvas, ev: Event) => any) | null;
    oncontextrestored: ((this: OffscreenCanvas, ev: Event) => any) | null;
    /**
     * These attributes return the dimensions of the OffscreenCanvas object's bitmap.
     *
     * They can be set, to replace the bitmap with a new, transparent black bitmap of the specified dimensions (effectively resizing it).
     */
    width: number;
    /**
     * Returns a promise that will fulfill with a new Blob object representing a file containing the image in the OffscreenCanvas object.
     *
     * The argument, if provided, is a dictionary that controls the encoding options of the image file to be created. The type field specifies the file format and has a default value of "image/png"; that type is also used if the requested type isn't supported. If the image format supports variable quality (such as "image/jpeg"), then the quality field is a number in the range 0.0 to 1.0 inclusive indicating the desired quality level for the resulting image.
     */
    convertToBlob(options?: ImageEncodeOptions): Promise<Blob>;
    /**
     * Returns an object that exposes an API for drawing on the OffscreenCanvas object. contextId specifies the desired API: "2d", "bitmaprenderer", "webgl", or "webgl2". options is handled by that API.
     *
     * This specification defines the "2d" context below, which is similar but distinct from the "2d" context that is created from a canvas element. The WebGL specifications define the "webgl" and "webgl2" contexts. [WEBGL]
     *
     * Returns null if the canvas has already been initialized with another context type (e.g., trying to get a "2d" context after getting a "webgl" context).
     */
    getContext(contextId: "2d", options?: any): OffscreenCanvasRenderingContext2D | null;
    getContext(contextId: "bitmaprenderer", options?: any): ImageBitmapRenderingContext | null;
    getContext(contextId: "webgl", options?: any): WebGLRenderingContext | null;
    getContext(contextId: "webgl2", options?: any): WebGL2RenderingContext | null;
    getContext(contextId: OffscreenRenderingContextIdBJS, options?: any): OffscreenRenderingContextBJS | null;
    /** Returns a newly created ImageBitmap object with the image in the OffscreenCanvas object. The image in the OffscreenCanvas object is replaced with a new blank image. */
    transferToImageBitmap(): ImageBitmap;
    addEventListener<K extends keyof OffscreenCanvasEventMap>(
        type: K,
        listener: (this: OffscreenCanvas, ev: OffscreenCanvasEventMap[K]) => any,
        options?: boolean | AddEventListenerOptions
    ): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void;
    removeEventListener<K extends keyof OffscreenCanvasEventMap>(
        type: K,
        listener: (this: OffscreenCanvas, ev: OffscreenCanvasEventMap[K]) => any,
        options?: boolean | EventListenerOptions
    ): void;
    removeEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions): void;
}

var OffscreenCanvas: {
    prototype: OffscreenCanvas;
    new (width: number, height: number): OffscreenCanvas;
};

interface OffscreenCanvasRenderingContext2D
    extends
        CanvasCompositing,
        CanvasDrawImage,
        CanvasDrawPath,
        CanvasFillStrokeStyles,
        CanvasFilters,
        CanvasImageData,
        CanvasImageSmoothing,
        CanvasPath,
        CanvasPathDrawingStyles,
        CanvasRect,
        CanvasShadowStyles,
        CanvasState,
        CanvasText,
        CanvasTextDrawingStyles,
        CanvasTransform {
    readonly canvas: OffscreenCanvas;
    commit(): void;
}

var OffscreenCanvasRenderingContext2D: {
    prototype: OffscreenCanvasRenderingContext2D;
    new (): OffscreenCanvasRenderingContext2D;
};

/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-var */
// Type definitions for the WICG HTML-in-Canvas proposal (https://github.com/WICG/html-in-canvas).
// These augment the standard DOM, WebGL and WebGPU types so Babylon can consume the API - whether
// provided natively (behind chrome://flags/#canvas-draw-element) or by the three-html-render polyfill -
// without TypeScript errors. The proposal is experimental; signatures track the explainer IDL and
// may change.

/**
 * A transferable snapshot of a rendered element, produced by `HTMLCanvasElement.captureElementImage`.
 */
interface ElementImage {
    readonly width: number;
    readonly height: number;
    close(): void;
}

var ElementImage: {
    prototype: ElementImage;
    new (): ElementImage;
};

/**
 * Source rectangle and sizing configuration for `WebGLRenderingContext.texElementImage2D`.
 */
interface WebGLCopyElementImageConfig {
    sx?: number;
    sy?: number;
    swidth?: number;
    sheight?: number;
    width?: number;
    height?: number;
}

/**
 * Event dispatched on a `<canvas layoutsubtree>` when the rendering of one of its children changes.
 */
interface PaintEvent extends Event {
    readonly changedElements: ReadonlyArray<Element>;
}

interface HTMLCanvasElementEventMap {
    paint: PaintEvent;
}

interface HTMLCanvasElement {
    /** Opts canvas descendants into layout and hit testing so they can be drawn into the canvas. */
    layoutSubtree: boolean;
    /** Fired when the rendering of any canvas child has changed. */
    onpaint: ((this: HTMLCanvasElement, ev: PaintEvent) => any) | null;
    /** Requests a single `paint` event on the next rendering update, even if nothing changed. */
    requestPaint(): void;
    /** Captures a transferable snapshot of the given element. */
    captureElementImage(element: Element): ElementImage;
    /** Returns the CSS transform that keeps the element's DOM location in sync with its drawn location. */
    getElementTransform(element: Element | ElementImage, drawTransform: DOMMatrix): DOMMatrix;
}

interface CanvasRenderingContext2D {
    drawElementImage(element: Element | ElementImage, dx: number, dy: number): DOMMatrix;
    drawElementImage(element: Element | ElementImage, dx: number, dy: number, dwidth: number, dheight: number): DOMMatrix;
    drawElementImage(
        element: Element | ElementImage,
        sx: number,
        sy: number,
        swidth: number,
        sheight: number,
        dx: number,
        dy: number,
        dwidth?: number,
        dheight?: number
    ): DOMMatrix;
}

interface WebGLRenderingContext {
    /** Uploads a rendered element (or snapshot) into the currently bound 2D texture (current WICG signature). */
    texElementImage2D(target: number, internalformat: number, element: Element | ElementImage, config?: WebGLCopyElementImageConfig): void;
    /** Legacy texImage2D-shaped overload still shipped by some Chrome Canary builds. */
    texElementImage2D(target: number, level: number, internalformat: number, format: number, type: number, element: Element | ElementImage): void;
}

interface WebGL2RenderingContext {
    /** Uploads a rendered element (or snapshot) into the currently bound 2D texture (current WICG signature). */
    texElementImage2D(target: number, internalformat: number, element: Element | ElementImage, config?: WebGLCopyElementImageConfig): void;
    /** Legacy texImage2D-shaped overload still shipped by some Chrome Canary builds. */
    texElementImage2D(target: number, level: number, internalformat: number, format: number, type: number, element: Element | ElementImage): void;
}

/**
 * Source descriptor for `GPUQueue.copyElementImageToTexture`.
 */
interface GPUCopyElementImageSource {
    source: Element | ElementImage;
    sx?: number;
    sy?: number;
    swidth?: number;
    sheight?: number;
}

/**
 * Destination descriptor for `GPUQueue.copyElementImageToTexture`.
 */
interface GPUCopyElementImageDestination {
    destination: GPUCopyExternalImageDestInfo;
    width?: number;
    height?: number;
}

interface GPUQueue {
    /** Uploads a rendered element (or snapshot) into a destination GPU texture. */
    copyElementImageToTexture(source: GPUCopyElementImageSource, destination: GPUCopyElementImageDestination): void;
}

/* eslint-disable no-var */
/* eslint-disable @typescript-eslint/naming-convention */
// Mixins
interface Window {
    CANNON: any;
    DracoDecoderModule: any;
}

interface Uint8Array<TArrayBuffer extends ArrayBufferLike = ArrayBufferLike> {
    /**
     * Converts the `Uint8Array` to a base64-encoded string.
     * @param options If provided, sets the alphabet and padding behavior used.
     * @returns A base64-encoded string.
     */
    toBase64(options?: { alphabet?: "base64" | "base64url" | undefined; omitPadding?: boolean | undefined }): string;
}

interface Int8ArrayConstructor {
    new (data: number | ArrayLike<number> | ArrayBufferLike): Int8Array<ArrayBuffer>;
}

interface Uint8ArrayConstructor {
    new (data: number | ArrayLike<number> | ArrayBufferLike): Uint8Array<ArrayBuffer>;

    /**
     * Creates a new `Uint8Array` from a base64-encoded string.
     * @param string The base64-encoded string.
     * @param options If provided, specifies the alphabet and handling of the last chunk.
     * @returns A new `Uint8Array` instance.
     * @throws {SyntaxError} If the input string contains characters outside the specified alphabet, or if the last
     * chunk is inconsistent with the `lastChunkHandling` option.
     */
    fromBase64(
        string: string,
        options?: {
            alphabet?: "base64" | "base64url" | undefined;
            lastChunkHandling?: "loose" | "strict" | "stop-before-partial" | undefined;
        }
    ): Uint8Array<ArrayBuffer>;
}

interface Float32ArrayConstructor {
    new (data: number | ArrayLike<number> | ArrayBufferLike): Float32Array<ArrayBuffer>;
}

interface WorkerGlobalScope {
    importScripts: (...args: string[]) => void;
}

type WorkerSelf = WindowOrWorkerGlobalScope & WorkerGlobalScope;

// Babylon Extension to enable UIEvents to work with our IUIEvents
interface UIEvent {
    inputIndex: number;
}

// Experimental Pressure API https://wicg.github.io/compute-pressure/
type PressureSource = "cpu";

type PressureState = "nominal" | "fair" | "serious" | "critical";

type PressureFactor = "thermal" | "power-supply";

// Not available in Firefox, Safari, Not baseline.
interface PressureRecord {
    source: PressureSource;
    state: PressureState;
    factors: ReadonlyArray<PressureFactor>;
    time: number;
}

// Not available in Firefox, Safari
interface PressureObserver {
    observe(source: PressureSource): Promise<void>;
    unobserve(source: PressureSource): void;
    disconnect(): void;
    takeRecords(): Array<PressureRecord>;
}

interface PressureObserverOptions {
    sampleRate?: number;
}

type PressureUpdateCallback = (changes: Array<PressureRecord>, observer: PressureObserver) => void;

const PressureObserver: {
    prototype: PressureObserver;
    new (callback: PressureUpdateCallback, options?: PressureObserverOptions): PressureObserver;

    knownSources: ReadonlyArray<PressureSource>;
};

}