
import { Color4 } from "../Maths/math.color.pure.js";
import { WebXRLayerRenderTargetTexture } from "./webXRLayerRenderTargetTexture.js";
import { WebXRLayerRenderTargetTextureProvider } from "./webXRRenderTargetTextureProvider.js";
/**
 * Maps a WebGPU depth/stencil {@link GPUTextureFormat} to the matching Babylon `TEXTUREFORMAT_*` constant.
 *
 * The engine reads `InternalTexture.format` (a Babylon constant) when it builds the render pass depth
 * attachment for a render target, so a depth texture wrapped from an external `GPUTexture` must carry the
 * correct Babylon format or the depth attachment pipeline format will not match the sub-image's texture.
 * @param format the WebGPU depth/stencil format requested when the layer was created
 * @returns the matching Babylon texture format constant
 */
function GetBabylonDepthFormat(format) {
    switch (format) {
        case "depth16unorm":
            return 15;
        case "depth24plus":
            return 16;
        case "depth24plus-stencil8":
            return 13;
        case "depth32float":
            return 14;
        case "depth32float-stencil8":
            return 18;
        case "stencil8":
            return 19;
        default:
            // Fall back to a combined depth/stencil format, which is the projection layer default.
            return 13;
    }
}
/**
 * Provides render target textures for WebGPU-backed XR layers. Owns all WebGPU-specific texture wrapping
 * (via {@link WebGPUEngine.wrapWebGPUTexture} / {@link WebGPUEngine.updateWrappedWebGPUTexture}) so the base
 * provider can stay graphics-API-agnostic. Mirrors {@link WebXRWebGLRenderTargetTextureProvider} for the
 * WebGPU (XRGPUBinding) backend.
 * @internal
 */
export class WebXRWebGPURenderTargetTextureProvider extends WebXRLayerRenderTargetTextureProvider {
    constructor(_xrSessionManager, layerWrapper) {
        super(_xrSessionManager.scene, layerWrapper);
        this._xrSessionManager = _xrSessionManager;
        this._transparentClearColor = new Color4(0, 0, 0, 0);
    }
    get _webgpuEngine() {
        return this._engine;
    }
    _wrapColorTexture(texture) {
        return this._webgpuEngine.wrapWebGPUTexture(texture);
    }
    _wrapDepthTexture(texture, depthStencilFormat) {
        const internalTexture = this._webgpuEngine.wrapWebGPUTexture(texture);
        // The engine derives the color attachment format automatically from the wrapped hardware texture,
        // but the depth attachment format is read from the Babylon InternalTexture.format, which
        // wrapWebGPUTexture does not set. Assign it here from the format the layer was created with.
        internalTexture.format = GetBabylonDepthFormat(depthStencilFormat);
        return internalTexture;
    }
    /**
     * Builds the render target shell as a {@link WebXRLayerRenderTargetTexture} for the single-view path so
     * each eye can bind its own array layer of a layered projection-layer texture. Multiview is not yet
     * supported on this WebGPU path and is delegated to the base implementation.
     * @param width the width of the render target
     * @param height the height of the render target
     * @param multiview whether the render target should be a multiview render target
     * @returns the created (but not yet registered) render target texture
     */
    _createRenderTargetTextureShell(width, height, multiview) {
        if (multiview) {
            return super._createRenderTargetTextureShell(width, height, multiview);
        }
        const renderTargetTexture = new WebXRLayerRenderTargetTexture("XR renderTargetTexture", { width, height }, this._scene);
        renderTargetTexture.renderTarget._samples = renderTargetTexture.samples;
        // The projection-layer texture is presented directly by the XR compositor (top-left origin, never
        // re-sampled by Babylon), so opt this target out of the engine's render-target Y-flip / winding
        // compensation and render it upright, matching the WebXR/WebGPU spec's plain render pass.
        renderTargetTexture.renderTarget._disableEngineYFlip = true;
        return renderTargetTexture;
    }
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
    _createRenderTargetTextureFromGPUTextures(width, height, colorTexture, depthStencilTexture, depthStencilFormat, multiview) {
        const color = this._wrapColorTexture(colorTexture);
        const depth = depthStencilTexture && depthStencilFormat ? this._wrapDepthTexture(depthStencilTexture, depthStencilFormat) : null;
        // Single-view (the only path here) always builds a WebXRLayerRenderTargetTexture via the shell override above.
        const renderTargetTexture = this._createRenderTargetTextureInternal(width, height, color, depth, multiview);
        this._attachPerEyeClearObserver(renderTargetTexture);
        return renderTargetTexture;
    }
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
    _attachPerEyeClearObserver(renderTargetTexture) {
        let lastColorClearedFrameId = -1;
        renderTargetTexture.onClearObservable.add((engine) => {
            // Honor skipInitialClear so this observer preserves the default clear semantics it replaces.
            if (renderTargetTexture.skipInitialClear) {
                return;
            }
            const scene = renderTargetTexture.getScene();
            const isImmersiveAR = this._xrSessionManager.sessionMode === "immersive-ar";
            // When autoClear is disabled the scene does not clear render targets; match that so this observer
            // does not force a clear the user opted out of. Immersive AR is the exception: the experience
            // helper disables autoClear because WebGL XR is cleared by the user agent, while WebGPU is not.
            if (scene && !scene.autoClear && !isImmersiveAR) {
                return;
            }
            const clearColor = engine.frameId !== lastColorClearedFrameId;
            const color = isImmersiveAR && scene && !scene.autoClear ? this._transparentClearColor : (renderTargetTexture.clearColor ?? scene?.clearColor ?? null);
            engine.clear(color, clearColor, true, true);
            if (clearColor) {
                lastColorClearedFrameId = engine.frameId;
            }
            // Kept in sync so anything else reading the flag still sees this target as cleared this frame.
            renderTargetTexture._cleared = true;
        });
    }
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
    _updateRenderTargetTextureFromGPUTextures(renderTargetTexture, colorTexture, depthStencilTexture) {
        const color = renderTargetTexture._texture;
        if (color) {
            this._webgpuEngine.updateWrappedWebGPUTexture(color, colorTexture);
        }
        const depth = renderTargetTexture.renderTarget?._depthStencilTexture;
        if (depth && depthStencilTexture) {
            this._webgpuEngine.updateWrappedWebGPUTexture(depth, depthStencilTexture);
        }
    }
}
//# sourceMappingURL=webXRWebGPURenderTargetTextureProvider.js.map