import { type RenderTargetTexture } from "../Materials/Textures/renderTargetTexture.js";
import { type Viewport } from "../Maths/math.viewport.js";
import { type Scene } from "../scene.js";
import { type Nullable } from "../types.js";
import { WebXRLayerWrapper } from "./webXRLayerWrapper.js";
import { WebXRWebGLRenderTargetTextureProvider } from "./webXRWebGLRenderTargetTextureProvider.js";
/**
 * Wraps xr webgl layers.
 * @internal
 */
export declare class WebXRWebGLLayerWrapper extends WebXRLayerWrapper {
    readonly layer: XRWebGLLayer;
    /**
     * @param layer is the layer to be wrapped.
     * @returns a new WebXRLayerWrapper wrapping the provided XRWebGLLayer.
     */
    constructor(layer: XRWebGLLayer);
}
/**
 * Provides render target textures and other important rendering information for a given XRWebGLLayer.
 * @internal
 */
export declare class WebXRWebGLLayerRenderTargetTextureProvider extends WebXRWebGLRenderTargetTextureProvider {
    readonly layerWrapper: WebXRWebGLLayerWrapper;
    protected _framebufferDimensions: {
        framebufferWidth: number;
        framebufferHeight: number;
    };
    private _rtt;
    private _framebuffer;
    private _layer;
    constructor(scene: Scene, layerWrapper: WebXRWebGLLayerWrapper);
    trySetViewportForView(viewport: Viewport, view: XRView): boolean;
    getRenderTargetTextureForEye(eye: XREye): Nullable<RenderTargetTexture>;
    getRenderTargetTextureForView(view: XRView): Nullable<RenderTargetTexture>;
}
