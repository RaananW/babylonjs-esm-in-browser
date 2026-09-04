import { type RenderTargetTexture } from "../Materials/Textures/renderTargetTexture.pure.js";
import { type Nullable } from "../types.js";
import { WebXRLayerRenderTargetTextureProvider } from "./webXRRenderTargetTextureProvider.js";
import { type WebXRLayerType, type WebXRSupportedLayerType } from "./webXRLayerWrapper.js";
/**
 * Provides render target textures for WebGL-backed XR layers. Owns all WebGL-specific
 * framebuffer/texture wiring so the base provider can stay graphics-API-agnostic.
 * @internal
 */
export declare abstract class WebXRWebGLRenderTargetTextureProvider<LayerTypeT extends WebXRSupportedLayerType = WebXRLayerType> extends WebXRLayerRenderTargetTextureProvider<LayerTypeT> {
    private _createInternalTexture;
    protected _createRenderTargetTexture(width: number, height: number, framebuffer: Nullable<WebGLFramebuffer>, colorTexture?: WebGLTexture, depthStencilTexture?: WebGLTexture, multiview?: boolean): RenderTargetTexture;
}
