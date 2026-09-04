import { type InternalTexture } from "../../../Materials/Textures/internalTexture.js";
import { type RenderTargetTexture } from "../../../Materials/Textures/renderTargetTexture.js";
import { type Viewport } from "../../../Maths/math.viewport.js";
import { Observable } from "../../../Misc/observable.js";
import { type WebXRLayerType, WebXRLayerWrapper, type WebXRSpatialLayerType, type WebXRSupportedLayerType } from "../../webXRLayerWrapper.js";
import { WebXRLayerRenderTargetTextureProvider } from "../../webXRRenderTargetTextureProvider.js";
import { WebXRWebGLRenderTargetTextureProvider } from "../../webXRWebGLRenderTargetTextureProvider.js";
import { type WebXRSessionManager } from "../../webXRSessionManager.js";
import { type Nullable } from "../../../types.js";
import { type TransformNode } from "../../../Meshes/transformNode.pure.js";
/**
 * The non-projection composition layers that can be positioned in an XR space.
 */
export type WebXRSpatialLayer = XRQuadLayer | XRCylinderLayer | XREquirectLayer | XRCubeLayer;
export type { WebXRSpatialLayerType } from "../../webXRLayerWrapper.js";
/**
 * Wraps an XR composition layer and creates its Babylon render target provider.
 * @typeParam LayerT the concrete WebXR composition layer type
 * @see https://playground.babylonjs.com/#TODARD#0
 */
export declare class WebXRCompositionLayerWrapper<LayerT extends XRCompositionLayer = XRCompositionLayer, LayerTypeT extends WebXRSupportedLayerType = WebXRLayerType> extends WebXRLayerWrapper<LayerTypeT> {
    getWidth: () => number;
    getHeight: () => number;
    readonly layer: LayerT;
    readonly layerType: LayerTypeT;
    /**
     * Whether the layer renders both views into a texture array.
     */
    readonly isMultiview: boolean;
    createRTTProvider: (xrSessionManager: WebXRSessionManager) => WebXRLayerRenderTargetTextureProvider<LayerTypeT>;
    _originalInternalTexture: Nullable<InternalTexture>;
    private readonly _destroyLayerOnDispose;
    /**
     * Whether the layer can only be rendered when its native `needsRedraw` flag is set.
     */
    readonly isStatic: boolean;
    /**
     * Whether this layer receives its content directly from an HTML media element.
     */
    readonly isMediaLayer: boolean;
    /**
     * Whether Babylon should acquire subimages and expose render target textures for this layer.
     */
    readonly usesRenderTargetProvider: boolean;
    /**
     * Whether the native layer exposes compositor opacity control.
     */
    get isOpacitySupported(): boolean;
    /**
     * Gets the compositor opacity applied to this layer.
     * @returns The native opacity in the range 0 to 1.
     * @throws If opacity is not supported by the active XR runtime.
     */
    get opacity(): number;
    /**
     * Sets the compositor opacity applied to this layer.
     * The native runtime clamps the value to the range 0 to 1.
     * @param value The desired opacity.
     * @throws If opacity is not supported by the active XR runtime.
     */
    set opacity(value: number);
    /**
     * Whether the native layer exposes compositor quality hints.
     */
    get isQualitySupported(): boolean;
    /**
     * Gets the compositor quality hint applied to this layer.
     * @returns The current native layer quality hint.
     * @throws If quality hints are not supported by the active XR runtime.
     */
    get quality(): XRLayerQuality;
    /**
     * Sets the compositor quality hint applied to this layer.
     * @param value The desired quality hint.
     * @throws If quality hints are not supported by the active XR runtime, or the native runtime rejects the value.
     */
    set quality(value: XRLayerQuality);
    /**
     * Whether the native layer exposes mono-presentation control.
     */
    get isForceMonoPresentationSupported(): boolean;
    /**
     * Gets whether the compositor presents the left-eye layer configuration to both eyes.
     * @returns Whether mono presentation is forced.
     * @throws If mono presentation control is not supported by the active XR runtime.
     */
    get forceMonoPresentation(): boolean;
    /**
     * Sets whether the compositor presents the left-eye layer configuration to both eyes.
     * Applications should continue rendering both eyes when this is enabled.
     * @param value Whether to force mono presentation.
     * @throws If mono presentation control is not supported by the active XR runtime.
     */
    set forceMonoPresentation(value: boolean);
    constructor(getWidth: () => number, getHeight: () => number, layer: LayerT, layerType: LayerTypeT, 
    /**
     * Whether the layer renders both views into a texture array.
     */
    isMultiview: boolean, createRTTProvider: (xrSessionManager: WebXRSessionManager) => WebXRLayerRenderTargetTextureProvider<LayerTypeT>, _originalInternalTexture?: Nullable<InternalTexture>, _destroyLayerOnDispose?: boolean, 
    /**
     * Whether the layer can only be rendered when its native `needsRedraw` flag is set.
     */
    isStatic?: boolean);
    private _assertControlSupported;
    /**
     * Disposes the Babylon render-target resources and destroys the native layer when this wrapper owns it.
     */
    dispose(): void;
}
/**
 * Wraps a positionable XR composition layer and synchronizes it with a Babylon transform node.
 * The node's scaling does not affect the physical dimensions of the layer.
 * @typeParam LayerT the concrete positionable WebXR layer type
 */
export declare class WebXRSpatialLayerWrapper<LayerT extends WebXRSpatialLayer = WebXRSpatialLayer, LayerTypeT extends WebXRSpatialLayerType = WebXRSpatialLayerType> extends WebXRCompositionLayerWrapper<LayerT, LayerTypeT> {
    /**
     * Whether the layer should follow changes to the session manager's reference space.
     */
    readonly usesSessionReferenceSpace: boolean;
    /**
     * The Babylon node whose world position and rotation are applied to the native layer.
     */
    readonly transformNode: TransformNode;
    private readonly _ownsTransformNode;
    private readonly _currentPosition;
    private readonly _currentRotation;
    private readonly _lastPosition;
    private readonly _lastRotation;
    constructor(getWidth: () => number, getHeight: () => number, layer: LayerT, layerType: LayerTypeT, isMultiview: boolean, isStatic: boolean, 
    /**
     * Whether the layer should follow changes to the session manager's reference space.
     */
    usesSessionReferenceSpace: boolean, createRTTProvider: (xrSessionManager: WebXRSessionManager) => WebXRLayerRenderTargetTextureProvider<LayerTypeT>, 
    /**
     * The Babylon node whose world position and rotation are applied to the native layer.
     */
    transformNode: TransformNode, _ownsTransformNode: boolean);
    /**
     * Synchronizes the native layer with the current world transform of the Babylon node.
     * @param useRightHandedSystem whether the Babylon scene uses right-handed coordinates
     * @param worldScalingFactor the number of Babylon scene units represented by one meter
     */
    updateFromTransformNode(useRightHandedSystem: boolean, worldScalingFactor: number): void;
    /**
     * Disposes the native layer wrapper and its Babylon transform node when the node was created by Babylon.
     */
    dispose(): void;
}
/**
 * Wraps an XRMediaBinding layer.
 * @typeParam LayerT the concrete media layer type
 */
export declare class WebXRMediaLayerWrapper<LayerT extends Exclude<WebXRSpatialLayer, XRCubeLayer> = Exclude<WebXRSpatialLayer, XRCubeLayer>, LayerTypeT extends Exclude<WebXRSpatialLayerType, "XRCubeLayer"> = Exclude<WebXRSpatialLayerType, "XRCubeLayer">> extends WebXRSpatialLayerWrapper<LayerT, LayerTypeT> {
    /**
     * Media layers receive their contents directly from the user agent.
     */
    readonly isMediaLayer: boolean;
    /**
     * Media layers are populated directly by the user agent.
     */
    readonly usesRenderTargetProvider: boolean;
    /**
     * Creates a wrapper for a media-backed spatial layer.
     * @param getWidth returns the current video width
     * @param getHeight returns the current video height
     * @param layer the native media composition layer
     * @param layerType the concrete spatial layer type
     * @param transformNode the Babylon transform synchronized with the native layer
     * @param ownsTransformNode whether the wrapper should dispose the transform node
     * @param usesSessionReferenceSpace whether the layer should follow session reference-space changes
     */
    constructor(getWidth: () => number, getHeight: () => number, layer: LayerT, layerType: LayerTypeT, transformNode: TransformNode, ownsTransformNode: boolean, usesSessionReferenceSpace: boolean);
}
/**
 * Wraps a native cube layer and exposes its raw subimage.
 * Cube layers require six face uploads or render passes and therefore do not use Babylon's 2D composition-layer render target provider.
 */
export declare class WebXRCubeLayerWrapper extends WebXRSpatialLayerWrapper<XRCubeLayer, "XRCubeLayer"> {
    private readonly _binding;
    /**
     * Cube layers are populated through raw cubemap or array-layer access.
     */
    readonly usesRenderTargetProvider: boolean;
    constructor(getWidth: () => number, getHeight: () => number, layer: XRCubeLayer, isStatic: boolean, usesSessionReferenceSpace: boolean, _binding: XRWebGLBinding | XRGPUBinding, transformNode: TransformNode, ownsTransformNode: boolean);
    /**
     * Gets the compositor-owned cube subimage for the current frame.
     * WebGL callers must populate all six cubemap faces. WebGPU callers must render to six consecutive array layers beginning at the descriptor's base array layer.
     * @param frame the current XR frame
     * @param eye the eye to retrieve for stereo cube layers
     * @returns the raw WebGL or WebGPU cube subimage
     */
    getSubImage(frame: XRFrame, eye?: XREye): XRWebGLSubImage | XRGPUSubImage;
}
/**
 * Provides render target textures and other important rendering information for a given XRCompositionLayer.
 * @internal
 */
export declare class WebXRCompositionLayerRenderTargetTextureProvider<LayerTypeT extends WebXRSupportedLayerType = WebXRLayerType> extends WebXRWebGLRenderTargetTextureProvider<LayerTypeT> {
    protected readonly _xrSessionManager: WebXRSessionManager;
    protected readonly _xrWebGLBinding: XRWebGLBinding;
    readonly layerWrapper: WebXRCompositionLayerWrapper<XRCompositionLayer, LayerTypeT>;
    protected _lastSubImages: Map<XREye, XRWebGLSubImage>;
    private _compositionLayer;
    /**
     * Fires every time a new render target texture is created (either for eye, for view, or for the entire frame)
     */
    onRenderTargetTextureCreatedObservable: Observable<{
        texture: RenderTargetTexture;
        eye?: XREye;
    }>;
    constructor(_xrSessionManager: WebXRSessionManager, _xrWebGLBinding: XRWebGLBinding, layerWrapper: WebXRCompositionLayerWrapper<XRCompositionLayer, LayerTypeT>);
    protected _getRenderTargetForSubImage(subImage: XRWebGLSubImage, eye?: XREye): RenderTargetTexture;
    private _getSubImageForEye;
    getRenderTargetTextureForEye(eye?: XREye): Nullable<RenderTargetTexture>;
    getRenderTargetTextureForView(view?: XRView): Nullable<RenderTargetTexture>;
    protected _setViewportForSubImage(viewport: Viewport, subImage: XRWebGLSubImage): void;
    trySetViewportForView(viewport: Viewport, view: XRView): boolean;
}
