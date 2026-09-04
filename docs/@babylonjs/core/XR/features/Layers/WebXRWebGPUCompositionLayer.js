import { Observable } from "../../../Misc/observable.js";
import { WebXRWebGPURenderTargetTextureProvider } from "../../webXRWebGPURenderTargetTextureProvider.js";
import { WebXRCompositionLayerWrapper } from "./WebXRCompositionLayer.js";
/**
 * Wraps xr composition layers for the WebGPU (XRGPUBinding) backend.
 * Mirrors {@link WebXRCompositionLayerWrapper} for WebGPU.
 * @internal
 */
export class WebXRWebGPUCompositionLayerWrapper extends WebXRCompositionLayerWrapper {
    constructor(getWidth, getHeight, layer, layerType, isMultiview, createRTTProvider) {
        super(getWidth, getHeight, layer, layerType, isMultiview, createRTTProvider);
    }
}
/**
 * Provides render target textures and other important rendering information for a given XRCompositionLayer
 * on the WebGPU backend. Mirrors {@link WebXRCompositionLayerRenderTargetTextureProvider}, but wraps
 * {@link XRGPUSubImage} GPUTextures instead of WebGL textures.
 * @internal
 */
export class WebXRWebGPUCompositionLayerRenderTargetTextureProvider extends WebXRWebGPURenderTargetTextureProvider {
    constructor(_xrSessionManager, _xrGPUBinding, layerWrapper, _depthStencilFormat) {
        super(_xrSessionManager, layerWrapper);
        this._xrGPUBinding = _xrGPUBinding;
        this.layerWrapper = layerWrapper;
        this._depthStencilFormat = _depthStencilFormat;
        this._lastSubImages = new Map();
        /**
         * Per-eye render targets, indexed by eye (0 = left/none, 1 = right). Kept separate from the base
         * `_renderTargetTextures` registry: that array is an append-only owned list (each entry is disposed once
         * on provider dispose), whereas this map is a mutable per-eye slot. Reusing `_renderTargetTextures` as
         * both would let a rebuilt eye target both stay in the registry (leaking / double-disposing the old one)
         * and grow the registry unboundedly on repeated size changes.
         */
        this._renderTargetTexturesByEye = [];
        /**
         * Fires every time a new render target texture is created (either for eye, for view, or for the entire frame)
         */
        this.onRenderTargetTextureCreatedObservable = new Observable();
        this._compositionLayer = layerWrapper.layer;
    }
    _getRenderTargetForSubImage(subImage, eye = "none") {
        const lastSubImage = this._lastSubImages.get(eye);
        const eyeIndex = eye == "right" ? 1 : 0;
        const colorTexture = subImage.colorTexture;
        const colorTextureWidth = colorTexture.width;
        const colorTextureHeight = colorTexture.height;
        const depthStencilTexture = subImage.depthStencilTexture ?? null;
        const existingRenderTarget = this._renderTargetTexturesByEye[eyeIndex];
        const sizeChanged = !existingRenderTarget || lastSubImage?.colorTexture.width !== colorTextureWidth || lastSubImage?.colorTexture.height !== colorTextureHeight;
        if (sizeChanged) {
            if (existingRenderTarget) {
                // A previous target for this eye exists (the sub-image size changed, e.g. a scale-factor or
                // display-config change). Dispose it and remove it from the owned registry before creating the
                // replacement so the registry does not accumulate stale entries or double-dispose on teardown.
                this._destroyRenderTargetTexture(existingRenderTarget);
            }
            this._renderTargetTexturesByEye[eyeIndex] = this._createRenderTargetTextureFromGPUTextures(colorTextureWidth, colorTextureHeight, colorTexture, depthStencilTexture, this._depthStencilFormat, this.layerWrapper.isMultiview);
            this._framebufferDimensions = {
                framebufferWidth: colorTextureWidth,
                framebufferHeight: colorTextureHeight,
            };
            this.onRenderTargetTextureCreatedObservable.notifyObservers({ texture: this._renderTargetTexturesByEye[eyeIndex], eye });
        }
        else {
            // Same size: repoint the wrapped textures at this frame's GPUTextures, preserving the
            // RenderTargetTexture / InternalTexture identity held by the XR camera's outputRenderTarget.
            this._updateRenderTargetTextureFromGPUTextures(existingRenderTarget, colorTexture, depthStencilTexture);
        }
        this._lastSubImages.set(eye, subImage);
        // The projection-layer color/depth textures may be a texture ARRAY with one layer per eye
        // (depthOrArrayLayers > 1). The sub-image's view descriptor carries the authoritative array-layer
        // index for this eye, so route it into the render target's bind so each eye renders into its own
        // layer. For non-layered textures this is 0 (unchanged behavior).
        const renderTargetTexture = this._renderTargetTexturesByEye[eyeIndex];
        renderTargetTexture.layerIndex = subImage.getViewDescriptor().baseArrayLayer ?? 0;
        return renderTargetTexture;
    }
    _getSubImageForEye(eye) {
        const currentFrame = this._xrSessionManager.currentFrame;
        if (currentFrame) {
            return this._xrGPUBinding.getSubImage(this._compositionLayer, currentFrame, eye);
        }
        return null;
    }
    getRenderTargetTextureForEye(eye) {
        const subImage = this._getSubImageForEye(eye);
        if (subImage) {
            return this._getRenderTargetForSubImage(subImage, eye);
        }
        return null;
    }
    getRenderTargetTextureForView(view) {
        return this.getRenderTargetTextureForEye(view?.eye);
    }
    _setViewportForSubImage(viewport, subImage) {
        const textureWidth = subImage.colorTexture.width;
        const textureHeight = subImage.colorTexture.height;
        const xrViewport = subImage.viewport;
        viewport.x = xrViewport.x / textureWidth;
        viewport.y = xrViewport.y / textureHeight;
        viewport.width = xrViewport.width / textureWidth;
        viewport.height = xrViewport.height / textureHeight;
    }
    trySetViewportForView(viewport, view) {
        const subImage = this._lastSubImages.get(view.eye) || this._getSubImageForEye(view.eye);
        if (subImage) {
            this._setViewportForSubImage(viewport, subImage);
            return true;
        }
        return false;
    }
}
//# sourceMappingURL=WebXRWebGPUCompositionLayer.js.map