import { WebXRWebGPUCompositionLayerRenderTargetTextureProvider, WebXRWebGPUCompositionLayerWrapper } from "./WebXRWebGPUCompositionLayer.js";
/**
 * Wraps xr projection layers for the WebGPU (XRGPUBinding) backend.
 * Mirrors {@link WebXRProjectionLayerWrapper} for WebGPU.
 * @internal
 */
export class WebXRWebGPUProjectionLayerWrapper extends WebXRWebGPUCompositionLayerWrapper {
    constructor(layer, isMultiview, xrGPUBinding, depthStencilFormat) {
        super(() => layer.textureWidth, () => layer.textureHeight, layer, "XRProjectionLayer", isMultiview, (sessionManager) => new WebXRWebGPUProjectionLayerRenderTargetTextureProvider(sessionManager, xrGPUBinding, this, depthStencilFormat));
        this.layer = layer;
    }
}
/**
 * Provides render target textures and other important rendering information for a given XRProjectionLayer
 * on the WebGPU backend.
 * @internal
 */
class WebXRWebGPUProjectionLayerRenderTargetTextureProvider extends WebXRWebGPUCompositionLayerRenderTargetTextureProvider {
    constructor(_xrSessionManager, _xrGPUBinding, layerWrapper, depthStencilFormat) {
        super(_xrSessionManager, _xrGPUBinding, layerWrapper, depthStencilFormat);
        this.layerWrapper = layerWrapper;
        this._projectionLayer = layerWrapper.layer;
    }
    _getSubImageForView(view) {
        return this._xrGPUBinding.getViewSubImage(this._projectionLayer, view);
    }
    getRenderTargetTextureForView(view) {
        return this._getRenderTargetForSubImage(this._getSubImageForView(view), view.eye);
    }
    getRenderTargetTextureForEye(eye) {
        const lastSubImage = this._lastSubImages.get(eye);
        if (lastSubImage) {
            return this._getRenderTargetForSubImage(lastSubImage, eye);
        }
        return null;
    }
    trySetViewportForView(viewport, view) {
        const subImage = this._lastSubImages.get(view.eye) || this._getSubImageForView(view);
        if (subImage) {
            this._setViewportForSubImage(viewport, subImage);
            return true;
        }
        return false;
    }
}
/**
 * The default depth/stencil format used for a WebGPU projection layer.
 * Mirrors the WebGL default (DEPTH24_STENCIL8).
 * @internal
 */
export const DefaultXRGPUProjectionLayerDepthStencilFormat = "depth24plus-stencil8";
/**
 * Builds the default XRGPUProjectionLayerInit for a WebGPU projection layer.
 * The color format must be the binding's preferred color format, so it is provided by the caller.
 * @param colorFormat the preferred color format reported by the XRGPUBinding
 * @param depthStencilFormat the depth/stencil format to request (defaults to depth24plus-stencil8)
 * @returns the projection layer init to pass to XRGPUBinding.createProjectionLayer
 * @internal
 */
export function CreateDefaultXRGPUProjectionLayerInit(colorFormat, depthStencilFormat = DefaultXRGPUProjectionLayerDepthStencilFormat) {
    return {
        colorFormat,
        depthStencilFormat,
        // GPUTextureUsage.RENDER_ATTACHMENT (0x10) — the spec default, stated explicitly here.
        textureUsage: 0x10,
        scaleFactor: 1.0,
    };
}
//# sourceMappingURL=WebXRWebGPUProjectionLayer.js.map