import { WebXRWebGPUCompositionLayerWrapper } from "./WebXRWebGPUCompositionLayer.js";
/**
 * Wraps xr projection layers for the WebGPU (XRGPUBinding) backend.
 * Mirrors {@link WebXRProjectionLayerWrapper} for WebGPU.
 * @internal
 */
export declare class WebXRWebGPUProjectionLayerWrapper extends WebXRWebGPUCompositionLayerWrapper {
    readonly layer: XRProjectionLayer;
    constructor(layer: XRProjectionLayer, isMultiview: boolean, xrGPUBinding: XRGPUBinding, depthStencilFormat?: GPUTextureFormat);
}
/**
 * The default depth/stencil format used for a WebGPU projection layer.
 * Mirrors the WebGL default (DEPTH24_STENCIL8).
 * @internal
 */
export declare const DefaultXRGPUProjectionLayerDepthStencilFormat: GPUTextureFormat;
/**
 * Builds the default XRGPUProjectionLayerInit for a WebGPU projection layer.
 * The color format must be the binding's preferred color format, so it is provided by the caller.
 * @param colorFormat the preferred color format reported by the XRGPUBinding
 * @param depthStencilFormat the depth/stencil format to request (defaults to depth24plus-stencil8)
 * @returns the projection layer init to pass to XRGPUBinding.createProjectionLayer
 * @internal
 */
export declare function CreateDefaultXRGPUProjectionLayerInit(colorFormat: GPUTextureFormat, depthStencilFormat?: GPUTextureFormat): XRGPUProjectionLayerInit;
