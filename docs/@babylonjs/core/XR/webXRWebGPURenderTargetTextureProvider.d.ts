import { type RenderTargetTexture } from "../Materials/Textures/renderTargetTexture.pure.js";
import { type Nullable } from "../types.js";
import { WebXRLayerRenderTargetTexture } from "./webXRLayerRenderTargetTexture.js";
import { type WebXRLayerType, type WebXRLayerWrapper, type WebXRSupportedLayerType } from "./webXRLayerWrapper.js";
import { WebXRLayerRenderTargetTextureProvider } from "./webXRRenderTargetTextureProvider.js";
import { type WebXRSessionManager } from "./webXRSessionManager.js";
/**
 * Provides render target textures for WebGPU-backed XR layers. Owns all WebGPU-specific texture wrapping
 * (via {@link WebGPUEngine.wrapWebGPUTexture} / {@link WebGPUEngine.updateWrappedWebGPUTexture}) so the base
 * provider can stay graphics-API-agnostic. Mirrors {@link WebXRWebGLRenderTargetTextureProvider} for the
 * WebGPU (XRGPUBinding) backend.
 * @internal
 */
export declare abstract class WebXRWebGPURenderTargetTextureProvider<LayerTypeT extends WebXRSupportedLayerType = WebXRLayerType> extends WebXRLayerRenderTargetTextureProvider<LayerTypeT> {
    protected readonly _xrSessionManager: WebXRSessionManager;
    private readonly _transparentClearColor;
    constructor(_xrSessionManager: WebXRSessionManager, layerWrapper: WebXRLayerWrapper<LayerTypeT>);
    private get _webgpuEngine();
    private _wrapColorTexture;
    private _wrapDepthTexture;
    /**
     * Builds the render target shell as a {@link WebXRLayerRenderTargetTexture} for the single-view path so
     * each eye can bind its own array layer of a layered projection-layer texture. Multiview is not yet
     * supported on this WebGPU path and is delegated to the base implementation.
     * @param width the width of the render target
     * @param height the height of the render target
     * @param multiview whether the render target should be a multiview render target
     * @returns the created (but not yet registered) render target texture
     */
    protected _createRenderTargetTextureShell(width: number, height: number, multiview: boolean): RenderTargetTexture;
    /**
     * Wraps the sub-image's color (and optional depth/stencil) GPUTextures and builds a new render target
     * texture around them. Use this on first creation and whenever the sub-image texture size changes.
     * @param width the width of the render target
     * @param height the height of the render target
     * @param colorTexture the sub-image color GPUTexture
     * @param depthStencilTexture the sub-image depth/stencil GPUTexture, if any
     * @param depthStencilFormat the WebGPU depth/stencil format the layer was created with, if depth is provided
     * @param multiview whether the render target should be a multiview render target
     * @returns the created render target texture
     */
    protected _createRenderTargetTextureFromGPUTextures(width: number, height: number, colorTexture: GPUTexture, depthStencilTexture: Nullable<GPUTexture>, depthStencilFormat: GPUTextureFormat | undefined, multiview: boolean): WebXRLayerRenderTargetTexture;
    /**
     * Ensures this render target is cleared every frame, including for the right eye.
     *
     * `Scene._clearFrameBuffer` skips clearing the right rig camera's framebuffer (`!camera.isRightCamera`).
     * That is a valid optimization for WebGL2 stereo, where both eyes render into a single side-by-side
     * texture and the left eye's full clear already covers the whole texture. WebGPU projection layers give
     * each eye its OWN render target (a distinct array layer rendered in a separate render pass), so the
     * right eye's color and — critically — depth would never be cleared, leaving its depth test to reject
     * every fragment (a black right eye). The scene notifies `onClearObservable` regardless of
     * `camera.isRightCamera`, so this observer clears both eyes' targets. WebGL providers never attach it,
     * so the WebGL path is unchanged.
     *
     * Color is cleared at most once per ENGINE FRAME, not once per `Scene.render`. The distinction matters:
     * more than one scene can render the same XR camera within a single XR frame. `UtilityLayerRenderer`
     * (used by controller pointer selection and near interaction) renders a second scene through the same
     * rig cameras, and every `Scene.render` resets `RenderTargetTexture._cleared` for those cameras' targets
     * (`Scene._checkCameraRenderTarget`), so a `_cleared`-based guard is defeated and each eye is re-cleared
     * after it was drawn — presenting a clear-colored frame with the geometry gone. `AbstractEngine.frameId`
     * only advances in `endFrame`, once per XR frame, so unlike `_cleared` it cannot be reset by another
     * scene rendering the same camera.
     *
     * In immersive AR, color is cleared to transparent when `WebXRExperienceHelper` disables
     * `Scene.autoClear`. WebGL XR framebuffers are cleared to transparent by the user agent, but WebGPU render
     * passes require the application to request that clear explicitly. Skipping it leaves pixels from prior
     * frames in passthrough regions, producing trails behind moving objects.
     *
     * Depth and stencil are still cleared on every notification, matching the previous behavior and the
     * expectations of overlay scenes that draw on top of the main scene.
     * @param renderTargetTexture the per-eye render target to clear each frame
     */
    private _attachPerEyeClearObserver;
    /**
     * Repoints the wrapped color/depth textures of an existing render target at the current frame's
     * GPUTextures, preserving the RenderTargetTexture / InternalTexture identity held by the XR camera's
     * `outputRenderTarget`. The sub-image textures are only valid for the current frame and may rotate from
     * a compositor pool, so this must run every frame. The new GPUTextures must have the same dimensions as
     * the wrapped ones (guaranteed by the caller's size-change branch, which rebuilds instead).
     * @param renderTargetTexture the render target whose wrapped textures should be repointed
     * @param colorTexture the current frame's color GPUTexture
     * @param depthStencilTexture the current frame's depth/stencil GPUTexture, if any
     */
    protected _updateRenderTargetTextureFromGPUTextures(renderTargetTexture: RenderTargetTexture, colorTexture: GPUTexture, depthStencilTexture: Nullable<GPUTexture>): void;
}
