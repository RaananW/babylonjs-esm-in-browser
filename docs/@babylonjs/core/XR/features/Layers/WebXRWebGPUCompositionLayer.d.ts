import { type RenderTargetTexture } from "../../../Materials/Textures/renderTargetTexture.js";
import { type Viewport } from "../../../Maths/math.viewport.js";
import { Observable } from "../../../Misc/observable.js";
import { type WebXRLayerRenderTargetTexture } from "../../webXRLayerRenderTargetTexture.js";
import { type WebXRLayerType, type WebXRSupportedLayerType } from "../../webXRLayerWrapper.js";
import { type WebXRLayerRenderTargetTextureProvider } from "../../webXRRenderTargetTextureProvider.js";
import { WebXRWebGPURenderTargetTextureProvider } from "../../webXRWebGPURenderTargetTextureProvider.js";
import { type WebXRSessionManager } from "../../webXRSessionManager.js";
import { type Nullable } from "../../../types.js";
import { WebXRCompositionLayerWrapper } from "./WebXRCompositionLayer.js";
/**
 * Wraps xr composition layers for the WebGPU (XRGPUBinding) backend.
 * Mirrors {@link WebXRCompositionLayerWrapper} for WebGPU.
 * @internal
 */
export declare class WebXRWebGPUCompositionLayerWrapper extends WebXRCompositionLayerWrapper {
    constructor(getWidth: () => number, getHeight: () => number, layer: XRCompositionLayer, layerType: WebXRLayerType, isMultiview: boolean, createRTTProvider: (xrSessionManager: WebXRSessionManager) => WebXRLayerRenderTargetTextureProvider);
}
/**
 * Provides render target textures and other important rendering information for a given XRCompositionLayer
 * on the WebGPU backend. Mirrors {@link WebXRCompositionLayerRenderTargetTextureProvider}, but wraps
 * {@link XRGPUSubImage} GPUTextures instead of WebGL textures.
 * @internal
 */
export declare class WebXRWebGPUCompositionLayerRenderTargetTextureProvider<LayerTypeT extends WebXRSupportedLayerType = WebXRLayerType> extends WebXRWebGPURenderTargetTextureProvider<LayerTypeT> {
    protected readonly _xrGPUBinding: XRGPUBinding;
    readonly layerWrapper: WebXRCompositionLayerWrapper<XRCompositionLayer, LayerTypeT>;
    protected readonly _depthStencilFormat?: GPUTextureFormat | undefined;
    protected _lastSubImages: Map<XREye, XRGPUSubImage>;
    /**
     * Per-eye render targets, indexed by eye (0 = left/none, 1 = right). Kept separate from the base
     * `_renderTargetTextures` registry: that array is an append-only owned list (each entry is disposed once
     * on provider dispose), whereas this map is a mutable per-eye slot. Reusing `_renderTargetTextures` as
     * both would let a rebuilt eye target both stay in the registry (leaking / double-disposing the old one)
     * and grow the registry unboundedly on repeated size changes.
     */
    protected _renderTargetTexturesByEye: WebXRLayerRenderTargetTexture[];
    private _compositionLayer;
    /**
     * Fires every time a new render target texture is created (either for eye, for view, or for the entire frame)
     */
    onRenderTargetTextureCreatedObservable: Observable<{
        texture: RenderTargetTexture;
        eye?: XREye;
    }>;
    constructor(_xrSessionManager: WebXRSessionManager, _xrGPUBinding: XRGPUBinding, layerWrapper: WebXRCompositionLayerWrapper<XRCompositionLayer, LayerTypeT>, _depthStencilFormat?: GPUTextureFormat | undefined);
    protected _getRenderTargetForSubImage(subImage: XRGPUSubImage, eye?: XREye): WebXRLayerRenderTargetTexture;
    private _getSubImageForEye;
    getRenderTargetTextureForEye(eye?: XREye): Nullable<RenderTargetTexture>;
    getRenderTargetTextureForView(view?: XRView): Nullable<RenderTargetTexture>;
    protected _setViewportForSubImage(viewport: Viewport, subImage: XRGPUSubImage): void;
    trySetViewportForView(viewport: Viewport, view: XRView): boolean;
}
