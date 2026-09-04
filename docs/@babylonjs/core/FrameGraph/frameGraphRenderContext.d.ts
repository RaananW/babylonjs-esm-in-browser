import { type Nullable, type AbstractEngine, type DrawWrapper, type IColor4Like, type Layer, type FrameGraphTextureHandle, type Effect, type FrameGraphTextureManager, type ObjectRenderer, type Scene, type FrameGraphRenderTarget, type UtilityLayerRenderer, type IStencilState, type IStencilStateProperties } from "../index.js";
import { FrameGraphContext } from "./frameGraphContext.js";
/**
 * Frame graph context used render passes.
 */
export declare class FrameGraphRenderContext extends FrameGraphContext {
    private readonly _effectRenderer;
    private readonly _effectRendererBack;
    private _currentRenderTarget;
    private _renderTargetIsBound;
    private readonly _copyTexture;
    private readonly _copyDepthTexture;
    private static _IsObjectRenderer;
    /** @internal */
    constructor(engine: AbstractEngine, textureManager: FrameGraphTextureManager, scene: Scene);
    /**
     * Checks whether a texture handle points to the backbuffer's color or depth texture
     * @param handle The handle to check
     * @returns True if the handle points to the backbuffer's color or depth texture, otherwise false
     */
    isBackbuffer(handle: FrameGraphTextureHandle): boolean;
    /**
     * Checks whether a texture handle points to the backbuffer's color texture
     * @param handle The handle to check
     * @returns True if the handle points to the backbuffer's color texture, otherwise false
     */
    isBackbufferColor(handle: FrameGraphTextureHandle): boolean;
    /**
     * Checks whether a texture handle points to the backbuffer's depth texture
     * @param handle The handle to check
     * @returns True if the handle points to the backbuffer's depth texture, otherwise false
     */
    isBackbufferDepthStencil(handle: FrameGraphTextureHandle): boolean;
    /**
     * Creates a (frame graph) render target wrapper
     * Note that renderTargets or renderTargetDepth can be undefined, but not both at the same time!
     * @param name Name of the render target wrapper
     * @param renderTargets Render target handles (textures) to use
     * @param renderTargetDepth Render target depth handle (texture) to use
     * @param depthReadOnly If true, the depth buffer will be read-only
     * @param stencilReadOnly If true, the stencil buffer will be read-only
     * @returns The created render target wrapper
     */
    createRenderTarget(name: string, renderTargets?: FrameGraphTextureHandle | FrameGraphTextureHandle[], renderTargetDepth?: FrameGraphTextureHandle, depthReadOnly?: boolean, stencilReadOnly?: boolean): FrameGraphRenderTarget;
    /**
     * Clears the current render buffer or the current render target (if any is set up)
     * @param color Defines the color to use
     * @param backBuffer Defines if the back buffer must be cleared
     * @param depth Defines if the depth buffer must be cleared
     * @param stencil Defines if the stencil buffer must be cleared
     * @param stencilClearValue Defines the value to use to clear the stencil buffer (default is 0)
     */
    clear(color: Nullable<IColor4Like>, backBuffer: boolean, depth: boolean, stencil?: boolean, stencilClearValue?: number): void;
    /**
     * Clears the color attachments of the current render target
     * @param color Defines the color to use
     * @param attachments The attachments to clear
     */
    clearColorAttachments(color: Nullable<IColor4Like>, attachments: number[]): void;
    /**
     * Clears all attachments (color(s) + depth/stencil) of the current render target
     * @param color Defines the color to use
     * @param attachments The attachments to clear
     * @param backBuffer Defines if the back buffer must be cleared
     * @param depth Defines if the depth buffer must be cleared
     * @param stencil Defines if the stencil buffer must be cleared
     * @param stencilClearValue Defines the value to use to clear the stencil buffer (default is 0)
     */
    clearAttachments(color: Nullable<IColor4Like>, attachments: number[], backBuffer: boolean, depth: boolean, stencil?: boolean, stencilClearValue?: number): void;
    /**
     * Binds the attachments to the current render target
     * @param attachments The attachments to bind
     */
    bindAttachments(attachments: number[]): void;
    /**
     * Generates mipmaps for the current render target
     * @param handle Optional handle of the texture to generate mipmaps for (if not provided, will generate mipmaps for all textures in the current render target)
     */
    generateMipMaps(handle?: FrameGraphTextureHandle): void;
    /**
     * Sets the texture sampling mode for a given texture handle
     * @param handle Handle of the texture to set the sampling mode for
     * @param samplingMode Sampling mode to set
     */
    setTextureSamplingMode(handle: FrameGraphTextureHandle, samplingMode: number): void;
    /**
     * Binds a texture handle to a given effect (resolves the handle to a texture and binds it to the effect)
     * @param effect The effect to bind the texture to
     * @param name The name of the texture in the effect
     * @param handle The handle of the texture to bind
     */
    bindTextureHandle(effect: Effect, name: string, handle: FrameGraphTextureHandle): void;
    /**
     * Applies a full-screen effect to the current render target
     * @param drawWrapper The draw wrapper containing the effect to apply
     * @param customBindings The custom bindings to use when applying the effect (optional)
     * @param stencilState The stencil state to use when applying the effect (optional)
     * @param disableColorWrite If true, color write will be disabled when applying the effect (optional)
     * @param drawBackFace If true, the fullscreen quad will be drawn as a back face (in CW - optional)
     * @param depthTest If true, depth testing will be enabled when applying the effect (default is false)
     * @param noViewport If true, the current viewport will be left unchanged (optional). If false or undefined, the viewport will be set to the full render target size.
     * @param alphaMode The alpha mode to use when applying the effect (default is ALPHA_DISABLE)
     * @returns True if the effect was applied, otherwise false (effect not ready)
     */
    applyFullScreenEffect(drawWrapper: DrawWrapper, customBindings?: () => void, stencilState?: IStencilState | IStencilStateProperties, disableColorWrite?: boolean, drawBackFace?: boolean, depthTest?: boolean, noViewport?: boolean, alphaMode?: number): boolean;
    /**
     * Copies a texture to the current render target
     * @param sourceTexture The source texture to copy from
     * @param forceCopyToBackbuffer If true, the copy will be done to the back buffer regardless of the current render target
     * @param noViewport If true, the current viewport will be left unchanged (optional). If false or undefined, the viewport will be set to the full render target size.
     * @param lodLevel The LOD level to use when copying the texture (default: 0).
     */
    copyTexture(sourceTexture: FrameGraphTextureHandle, forceCopyToBackbuffer?: boolean, noViewport?: boolean, lodLevel?: number): void;
    /**
     * Renders a RenderTargetTexture or a layer
     * @param object The RenderTargetTexture/Layer to render
     * @param viewportWidth The width of the viewport (optional for Layer, but mandatory for ObjectRenderer)
     * @param viewportHeight The height of the viewport (optional for Layer, but mandatory for ObjectRenderer)
     * @param restoreDefaultFramebuffer If true, the default framebuffer will be restored after rendering (default: false)
     */
    render(object: Layer | ObjectRenderer | UtilityLayerRenderer, viewportWidth?: number, viewportHeight?: number, restoreDefaultFramebuffer?: boolean): void;
    /**
     * Binds a render target texture so that upcoming draw calls will render to it
     * Note: it is a lazy operation, so the render target will only be bound when needed. This way, it is possible to call
     *   this method several times with different render targets without incurring the cost of binding if no draw calls are made
     * @param renderTarget The handle of the render target texture to bind (default: undefined, meaning "back buffer"). Pass an array for MRT rendering.
     * @param applyImmediately If true, the render target will be applied immediately (otherwise it will be applied at first use). Default is false (delayed application).
     */
    bindRenderTarget(renderTarget?: FrameGraphRenderTarget, applyImmediately?: boolean): void;
    /**
     * Restores the default framebuffer (back buffer) as the current render target
     */
    restoreDefaultFramebuffer(): void;
    /** @internal */
    _applyRenderTarget(): void;
    /** @internal */
    _isReady(): boolean;
    /** @internal */
    _dispose(): void;
}
