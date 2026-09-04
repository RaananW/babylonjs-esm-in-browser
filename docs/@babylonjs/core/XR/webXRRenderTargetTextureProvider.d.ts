import { type AbstractEngine } from "../Engines/abstractEngine.js";
import { type InternalTexture } from "../Materials/Textures/internalTexture.js";
import { RenderTargetTexture } from "../Materials/Textures/renderTargetTexture.pure.js";
import { type Viewport } from "../Maths/math.viewport.js";
import { type IDisposable, type Scene } from "../scene.js";
import { type Nullable } from "../types.js";
import { type WebXRLayerType, type WebXRLayerWrapper, type WebXRSupportedLayerType } from "./webXRLayerWrapper.js";
/**
 * An interface for objects that provide render target textures for XR rendering.
 */
export interface IWebXRRenderTargetTextureProvider extends IDisposable {
    /**
     * Attempts to set the framebuffer-size-normalized viewport to be rendered this frame for this view.
     * In the event of a failure, the supplied viewport is not updated.
     * @param viewport the viewport to which the view will be rendered
     * @param view the view for which to set the viewport
     * @returns whether the operation was successful
     */
    trySetViewportForView(viewport: Viewport, view: XRView): boolean;
    /**
     * Gets the correct render target texture to be rendered this frame for this eye
     * @param eye the eye for which to get the render target
     * @returns the render target for the specified eye or null if not available
     */
    getRenderTargetTextureForEye(eye: XREye): Nullable<RenderTargetTexture>;
    /**
     * Gets the correct render target texture to be rendered this frame for this view
     * @param view the view for which to get the render target
     * @returns the render target for the specified view or null if not available
     */
    getRenderTargetTextureForView(view: XRView): Nullable<RenderTargetTexture>;
}
/**
 * Provides render target textures and other important rendering information for a given XRLayer.
 * @internal
 */
export declare abstract class WebXRLayerRenderTargetTextureProvider<LayerTypeT extends WebXRSupportedLayerType = WebXRLayerType> implements IWebXRRenderTargetTextureProvider {
    protected readonly _scene: Scene;
    readonly layerWrapper: WebXRLayerWrapper<LayerTypeT>;
    abstract trySetViewportForView(viewport: Viewport, view: XRView): boolean;
    abstract getRenderTargetTextureForEye(eye: XREye): Nullable<RenderTargetTexture>;
    abstract getRenderTargetTextureForView(view: XRView): Nullable<RenderTargetTexture>;
    protected _renderTargetTextures: RenderTargetTexture[];
    protected _framebufferDimensions: Nullable<{
        framebufferWidth: number;
        framebufferHeight: number;
    }>;
    protected _engine: AbstractEngine;
    constructor(_scene: Scene, layerWrapper: WebXRLayerWrapper<LayerTypeT>);
    /**
     * Creates the render target texture "shell" (with the correct multiview type and MSAA sample count)
     * without attaching any graphics-API-specific resource. Subclasses attach their own textures.
     * @param width the width of the render target
     * @param height the height of the render target
     * @param multiview whether the render target should be a multiview render target
     * @returns the created (but not yet registered) render target texture
     */
    protected _createRenderTargetTextureShell(width: number, height: number, multiview: boolean): RenderTargetTexture;
    /**
     * Builds a render target texture from already-wrapped internal textures, without referencing any
     * graphics-API-specific type. A GPU-based backend (e.g. WebGPU / XRGPUBinding) wraps its native
     * textures with the engine and calls this hook; the WebGL backend has its own typed entry point.
     * @param width the width of the render target
     * @param height the height of the render target
     * @param colorTexture the internal texture to use as the color attachment, if any
     * @param depthStencilTexture the internal texture to use as the depth/stencil attachment, if any
     * @param multiview whether the render target should be a multiview render target
     * @returns the created render target texture
     */
    protected _createRenderTargetTextureInternal(width: number, height: number, colorTexture: Nullable<InternalTexture>, depthStencilTexture: Nullable<InternalTexture>, multiview: boolean): RenderTargetTexture;
    protected _destroyRenderTargetTexture(renderTargetTexture: RenderTargetTexture): void;
    getFramebufferDimensions(): Nullable<{
        framebufferWidth: number;
        framebufferHeight: number;
    }>;
    dispose(): void;
}
