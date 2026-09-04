import { type RenderTargetTexture } from "../../Materials/Textures/renderTargetTexture.js";
import { type Viewport } from "../../Maths/math.viewport.js";
import { type Nullable } from "../../types.js";
import { WebXRLayerWrapper } from "../webXRLayerWrapper.js";
import { WebXRWebGLRenderTargetTextureProvider } from "../webXRWebGLRenderTargetTextureProvider.js";
import { type WebXRSessionManager } from "../webXRSessionManager.js";
import { type WebXRRenderTarget } from "../webXRTypes.js";
/**
 * Wraps XRWebGLLayer's created by Babylon Native.
 * @internal
 */
export declare class NativeXRLayerWrapper extends WebXRLayerWrapper {
    readonly layer: XRWebGLLayer;
    constructor(layer: XRWebGLLayer);
}
/**
 * Provides render target textures for layers created by Babylon Native.
 * @internal
 */
export declare class NativeXRLayerRenderTargetTextureProvider extends WebXRWebGLRenderTargetTextureProvider {
    readonly layerWrapper: NativeXRLayerWrapper;
    private _nativeRTTProvider;
    private _nativeLayer;
    constructor(sessionManager: WebXRSessionManager, layerWrapper: NativeXRLayerWrapper);
    trySetViewportForView(viewport: Viewport): boolean;
    getRenderTargetTextureForEye(eye: XREye): Nullable<RenderTargetTexture>;
    getRenderTargetTextureForView(view: XRView): Nullable<RenderTargetTexture>;
    getFramebufferDimensions(): Nullable<{
        framebufferWidth: number;
        framebufferHeight: number;
    }>;
}
/**
 * Creates the xr layer that will be used as the xr session's base layer.
 * @internal
 */
export declare class NativeXRRenderTarget implements WebXRRenderTarget {
    canvasContext: WebGLRenderingContext;
    xrLayer: Nullable<XRWebGLLayer>;
    private _nativeRenderTarget;
    constructor(_xrSessionManager: WebXRSessionManager);
    initializeXRLayerAsync(xrSession: XRSession): Promise<XRWebGLLayer>;
    dispose(): void;
}
