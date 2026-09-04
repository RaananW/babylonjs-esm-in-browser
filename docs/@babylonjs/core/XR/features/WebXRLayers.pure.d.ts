/** This file must only contain pure code and pure imports */
import { type WebXRSessionManager } from "../webXRSessionManager.js";
import { WebXRAbstractFeature } from "./WebXRAbstractFeature.js";
import { type WebXRLayerWrapper, type WebXRSupportedLayerType } from "../webXRLayerWrapper.js";
import { WebXRWebGLLayerWrapper } from "../webXRWebGLLayer.js";
import { WebXRProjectionLayerWrapper } from "./Layers/WebXRProjectionLayer.js";
import { WebXRCompositionLayerWrapper, WebXRCubeLayerWrapper, WebXRSpatialLayerWrapper, type WebXRSpatialLayer, type WebXRSpatialLayerType } from "./Layers/WebXRCompositionLayer.js";
import { type DynamicTexture } from "../../Materials/Textures/dynamicTexture.pure.js";
import { type LensFlareSystem } from "../../LensFlares/lensFlareSystem.js";
import { type Nullable } from "../../types.js";
import { TransformNode } from "../../Meshes/transformNode.pure.js";
import { type BaseTexture } from "../../Materials/Textures/baseTexture.js";
import { type WebXRFallbackLayerWrapper, type IWebXRFallbackLayerDimensions } from "./Layers/WebXRFallbackLayer.js";
export { WebXRCompositionLayerWrapper, WebXRCubeLayerWrapper, WebXRMediaLayerWrapper, WebXRSpatialLayerWrapper } from "./Layers/WebXRCompositionLayer.js";
export type { WebXRSpatialLayer, WebXRSpatialLayerType } from "./Layers/WebXRCompositionLayer.js";
export type { IWebXRFallbackLayerDimensions, WebXRFallbackLayerWrapper } from "./Layers/WebXRFallbackLayer.js";
/**
 * Configuration options of the layers feature
 */
export interface IWebXRLayersOptions {
    /**
     * Whether to try initializing the base projection layer as a multiview render target, if multiview is supported.
     * Defaults to false.
     */
    preferMultiviewOnInit?: boolean;
    /**
     * Optional configuration for the base projection layer.
     */
    projectionLayerInit?: Partial<XRProjectionLayerInit>;
}
/**
 * Common options for creating a graphics-backed WebXR composition layer.
 * @typeParam TWebGLInit the WebGL layer initialization dictionary
 * @typeParam TWebGPUInit the WebGPU layer initialization dictionary
 */
export interface IWebXRCompositionLayerCreationOptions<TWebGLInit, TWebGPUInit> {
    /**
     * Initialization values shared with the WebGL Layers API.
     * Babylon supplies the current reference space and projection-layer pixel dimensions when omitted.
     */
    layerInit?: Partial<TWebGLInit>;
    /**
     * WebGPU-specific initialization overrides.
     * Shared spatial and layout values are copied from `layerInit` before these overrides are applied.
     */
    gpuLayerInit?: Partial<TWebGPUInit>;
    /**
     * A Babylon node whose world position and rotation will be synchronized with the layer.
     * Babylon creates and owns a node when this is omitted.
     */
    transformNode?: TransformNode;
    /**
     * Uses a Babylon mesh when the requested native layer factory is unavailable.
     * Import `@babylonjs/core/XR/features/WebXRLayersFallback` to enable this optional fallback.
     * Fallback is disabled by default.
     */
    fallbackMode?: "none" | "mesh";
    /**
     * A texture to display on the fallback mesh.
     * Required when `fallbackMode` is `"mesh"`.
     */
    fallbackTexture?: BaseTexture;
}
/**
 * Common options for creating an XRMediaBinding layer.
 * @typeParam InitT the media layer initialization dictionary
 */
export interface IWebXRMediaLayerCreationOptions<InitT> {
    /**
     * Initialization values for the media layer.
     * Babylon supplies the current reference space when omitted.
     */
    layerInit?: Partial<InitT>;
    /**
     * A Babylon node whose world position and rotation will be synchronized with the layer.
     * Babylon creates and owns a node when this is omitted.
     */
    transformNode?: TransformNode;
    /**
     * Uses a Babylon mesh and VideoTexture when XRMediaBinding is unavailable.
     * Import `@babylonjs/core/XR/features/WebXRLayersFallback` to enable this optional fallback.
     * Fallback is disabled by default.
     */
    fallbackMode?: "none" | "mesh";
}
/**
 * Selects whether a layer is created from a graphics binding or directly from a media element.
 */
export type WebXRLayerSource = "graphics" | "media";
/**
 * The result of creating a spatial WebXR layer.
 * Native wrappers expose an XR composition layer, while fallback wrappers expose a Babylon mesh.
 * @typeParam LayerT the native layer type
 */
export type WebXRLayerCreationResult<LayerT extends WebXRSpatialLayer, LayerTypeT extends WebXRSpatialLayerType = WebXRSpatialLayerType> = WebXRSpatialLayerWrapper<LayerT, LayerTypeT> | WebXRFallbackLayerWrapper;
/**
 * Data supplied to an optional WebXR mesh-fallback implementation.
 * @internal
 */
export interface IWebXRFallbackLayerCreationContext {
    scene: WebXRSessionManager["scene"];
    isWebGPU: boolean;
    layerType: WebXRSpatialLayerType;
    transformNode: TransformNode;
    ownsTransformNode: boolean;
    dimensions: IWebXRFallbackLayerDimensions;
    worldScalingFactor: number;
    texture?: BaseTexture;
    video?: HTMLVideoElement;
}
/**
 * Registers the optional mesh-fallback implementation without making its rendering dependencies part of projection-only bundles.
 * @param factory creates a fallback wrapper
 * @internal
 */
export declare function _RegisterWebXRFallbackLayerFactory(factory: (context: IWebXRFallbackLayerCreationContext) => Nullable<WebXRFallbackLayerWrapper>): void;
/**
 * Exposes the WebXR Layers API.
 */
export declare class WebXRLayers extends WebXRAbstractFeature {
    private readonly _options;
    /**
     * The module's name
     */
    static readonly Name: "xr-layers";
    /**
     * The (Babylon) version of this module.
     * This is an integer representing the implementation version.
     * This number does not correspond to the WebXR specs version
     */
    static readonly Version = 1;
    /**
     * Already-created layers
     */
    private _existingLayers;
    private _fallbackLayers;
    private _glContext;
    private _xrWebGLBinding;
    private _isWebGPU;
    private _xrGPUBinding?;
    private _xrMediaBinding?;
    private _isMultiviewEnabled;
    private _projectionLayerInitialized;
    private _compositionLayerTextureMapping;
    private _layerToRTTProviderMapping;
    private _layerCleanupFunctions;
    constructor(_xrSessionManager: WebXRSessionManager, _options?: IWebXRLayersOptions);
    /**
     * Whether the active XR session exposes its compositor layer limit.
     */
    get isMaxRenderLayersSupported(): boolean;
    /**
     * Gets the maximum number of native layers accepted in the active session's render-state `layers` array.
     * The projection layer counts toward this limit. Fallback mesh layers do not.
     * @returns The native layer limit, or `null` when the runtime does not expose it.
     * @see https://playground.babylonjs.com/#TODARD#0
     */
    get maxRenderLayers(): Nullable<number>;
    /**
     * Attach this feature.
     * Will usually be called by the features manager.
     *
     * @returns true if successful.
     */
    attach(): boolean;
    detach(): boolean;
    /**
     * Creates a new XRWebGLLayer.
     * @param params an object providing configuration options for the new XRWebGLLayer
     * @returns the XRWebGLLayer
     */
    createXRWebGLLayer(params?: XRWebGLLayerInit): WebXRWebGLLayerWrapper;
    private _validateLayerInit;
    private _extendXRLayerInit;
    private _getProjectionLayerDimensions;
    private _createTransformNode;
    private _createFallbackLayer;
    private _createGraphicsLayer;
    private _createMediaLayer;
    /**
     * Creates a new XRProjectionLayer.
     * @param params an object providing configuration options for the new XRProjectionLayer.
     * @param multiview whether the projection layer should render with multiview. Will be tru automatically if the extension initialized with multiview.
     * @returns the projection layer
     */
    createProjectionLayer(params?: XRProjectionLayerInit, multiview?: boolean): WebXRProjectionLayerWrapper;
    /**
     * Creates the base projection layer for the WebGPU (XRGPUBinding) backend.
     * Single-view only for now (multiview is deferred); the color format is the binding's preferred format.
     * @returns the WebGPU projection layer wrapper
     */
    private _createWebGPUProjectionLayer;
    /**
     * Creates a graphics-backed quad layer and adds it to the current XR session.
     * @param options initialization and transform-node options for the layer
     * @returns the created layer wrapper, or `null` when the active graphics binding does not support quad layers
     */
    createQuadLayer(options?: IWebXRCompositionLayerCreationOptions<XRQuadLayerInit, XRGPUQuadLayerInit>): Nullable<WebXRLayerCreationResult<XRQuadLayer, "XRQuadLayer">>;
    /**
     * Creates a graphics-backed cylinder layer and adds it to the current XR session.
     * @param options initialization and transform-node options for the layer
     * @returns the created layer wrapper, or `null` when the active graphics binding does not support cylinder layers
     */
    createCylinderLayer(options?: IWebXRCompositionLayerCreationOptions<XRCylinderLayerInit, XRGPUCylinderLayerInit>): Nullable<WebXRLayerCreationResult<XRCylinderLayer, "XRCylinderLayer">>;
    /**
     * Creates a graphics-backed equirectangular layer and adds it to the current XR session.
     * @param options initialization and transform-node options for the layer
     * @returns the created layer wrapper, or `null` when the active graphics binding does not support equirectangular layers
     */
    createEquirectLayer(options?: IWebXRCompositionLayerCreationOptions<XREquirectLayerInit, XRGPUEquirectLayerInit>): Nullable<WebXRLayerCreationResult<XREquirectLayer, "XREquirectLayer">>;
    /**
     * Creates a graphics-backed cube layer and adds it to the current XR session.
     * Cube layers synchronize only the rotation of their transform node because the WebXR API does not support cube-layer translation.
     * @param options initialization and transform-node options for the layer
     * @returns the created layer wrapper, or `null` when the active graphics binding does not support cube layers
     */
    createCubeLayer(options?: IWebXRCompositionLayerCreationOptions<XRCubeLayerInit, XRGPUCubeLayerInit>): Nullable<WebXRCubeLayerWrapper | WebXRFallbackLayerWrapper>;
    /**
     * Creates a video-backed quad layer and adds it to the current XR session.
     * @see https://playground.babylonjs.com/#D35HOL#0
     * @param video the video element presented by the XR compositor
     * @param options initialization and transform-node options for the layer
     * @returns the created media layer wrapper, or `null` when XRMediaBinding is unavailable
     */
    createMediaQuadLayer(video: HTMLVideoElement, options?: IWebXRMediaLayerCreationOptions<XRMediaQuadLayerInit>): Nullable<WebXRLayerCreationResult<XRQuadLayer, "XRQuadLayer">>;
    /**
     * Creates a video-backed cylinder layer and adds it to the current XR session.
     * @param video the video element presented by the XR compositor
     * @param options initialization and transform-node options for the layer
     * @returns the created media layer wrapper, or `null` when XRMediaBinding is unavailable
     */
    createMediaCylinderLayer(video: HTMLVideoElement, options?: IWebXRMediaLayerCreationOptions<XRMediaCylinderLayerInit>): Nullable<WebXRLayerCreationResult<XRCylinderLayer, "XRCylinderLayer">>;
    /**
     * Creates a video-backed equirectangular layer and adds it to the current XR session.
     * @param video the video element presented by the XR compositor
     * @param options initialization and transform-node options for the layer
     * @returns the created media layer wrapper, or `null` when XRMediaBinding is unavailable
     */
    createMediaEquirectLayer(video: HTMLVideoElement, options?: IWebXRMediaLayerCreationOptions<XRMediaEquirectLayerInit>): Nullable<WebXRLayerCreationResult<XREquirectLayer, "XREquirectLayer">>;
    private _createQuadLayer;
    /**
     * @experimental
     * This will support full screen ADT when used with WebXR Layers. This API might change in the future.
     * Note that no interaction will be available with the ADT when using this method
     * @param texture the texture to display in the layer
     * @param options optional parameters for the layer
     * @returns a composition layer containing the texture, or null when WebGPU quad layers are unavailable
     */
    addFullscreenAdvancedDynamicTexture(texture: DynamicTexture, options?: {
        distanceFromHeadset: number;
    }): Nullable<WebXRCompositionLayerWrapper>;
    /**
     * @experimental
     * This functions allows you to add a lens flare system to the XR scene.
     * Note - this will remove the lens flare system from the scene and add it to the XR scene.
     * This feature is experimental and might change in the future.
     * @param flareSystem the flare system to add
     * @returns a composition layer containing the flare system, or null when WebGPU quad layers are unavailable
     */
    protected _addLensFlareSystem(flareSystem: LensFlareSystem): Nullable<WebXRCompositionLayerWrapper>;
    /**
     * Add a new layer to the already-existing list of layers
     * @param wrappedLayer the new layer to add to the existing ones
     */
    addXRSessionLayer(wrappedLayer: WebXRLayerWrapper<WebXRSupportedLayerType>): void;
    /**
     * Removes a non-projection layer from the current XR session.
     * @param wrappedLayer the layer wrapper to remove
     * @param dispose whether to dispose the wrapper and destroy its native composition layer
     * @returns whether the layer was present and removed
     */
    removeXRSessionLayer(wrappedLayer: WebXRLayerWrapper<WebXRSupportedLayerType>, dispose?: boolean): boolean;
    /**
     * Removes either a native spatial layer or a fallback layer created by this feature.
     * @param wrappedLayer the native or fallback layer wrapper to remove
     * @param dispose whether to dispose resources owned by the wrapper
     * @returns whether the wrapper was present and removed
     */
    removeLayer(wrappedLayer: WebXRLayerCreationResult<WebXRSpatialLayer>, dispose?: boolean): boolean;
    /**
     * Sets the layers to be used by the XR session.
     * Note that you must call this function with any layers you wish to render to
     * since it adds them to the XR session's render state
     * (replacing any layers that were added in a previous call to setXRSessionLayers or updateRenderState).
     * This method also sets up the session manager's render target texture provider
     * as the first layer in the array, which feeds the WebXR camera(s) attached to the session.
     * @param wrappedLayers An array of WebXRLayerWrapper, usually returned from the WebXRLayers createLayer functions.
     */
    setXRSessionLayers(wrappedLayers?: Array<WebXRLayerWrapper<WebXRSupportedLayerType>>): void;
    private _validateLayerCount;
    /**
     * Checks whether the active runtime exposes the factory needed for a layer type.
     * This is a capability check only; creation can still fail when an initialization dictionary is invalid.
     * @param layerType the concrete WebXR layer type
     * @param source whether to check a graphics-backed or media-backed layer
     * @returns whether the requested factory is available
     */
    isLayerTypeSupported(layerType: WebXRSpatialLayerType | "XRProjectionLayer", source?: WebXRLayerSource): boolean;
    isCompatible(): boolean;
    /**
     * Dispose this feature and all of the resources attached.
     */
    dispose(): void;
    protected _onXRFrame(_xrFrame: XRFrame): void;
}
/**
 * Register side effects for webXRLayers.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterWebXRLayers(): void;
