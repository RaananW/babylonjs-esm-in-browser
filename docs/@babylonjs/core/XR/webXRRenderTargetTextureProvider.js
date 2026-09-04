import { MultiviewRenderTarget } from "../Materials/Textures/MultiviewRenderTarget.js";
import { RenderTargetTexture } from "../Materials/Textures/renderTargetTexture.pure.js";
/**
 * Provides render target textures and other important rendering information for a given XRLayer.
 * @internal
 */
export class WebXRLayerRenderTargetTextureProvider {
    constructor(_scene, layerWrapper) {
        this._scene = _scene;
        this.layerWrapper = layerWrapper;
        this._renderTargetTextures = new Array();
        this._engine = _scene.getEngine();
    }
    /**
     * Creates the render target texture "shell" (with the correct multiview type and MSAA sample count)
     * without attaching any graphics-API-specific resource. Subclasses attach their own textures.
     * @param width the width of the render target
     * @param height the height of the render target
     * @param multiview whether the render target should be a multiview render target
     * @returns the created (but not yet registered) render target texture
     */
    _createRenderTargetTextureShell(width, height, multiview) {
        const textureSize = { width, height };
        const renderTargetTexture = multiview ? new MultiviewRenderTarget(this._scene, textureSize) : new RenderTargetTexture("XR renderTargetTexture", textureSize, this._scene);
        renderTargetTexture.renderTarget._samples = renderTargetTexture.samples;
        return renderTargetTexture;
    }
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
    _createRenderTargetTextureInternal(width, height, colorTexture, depthStencilTexture, multiview) {
        if (multiview) {
            // The multiview color/depth array wiring is not implemented on this API-agnostic hook yet.
            // The WebGL provider still owns the array path via its own _createRenderTargetTexture.
            throw new Error("Multiview render targets are not yet supported by the API-agnostic render target creation path.");
        }
        const renderTargetTexture = this._createRenderTargetTextureShell(width, height, multiview);
        const renderTargetWrapper = renderTargetTexture.renderTarget;
        if (colorTexture) {
            renderTargetWrapper.setTexture(colorTexture, 0);
            renderTargetTexture._texture = colorTexture;
        }
        if (depthStencilTexture) {
            renderTargetWrapper._depthStencilTexture = depthStencilTexture;
        }
        renderTargetTexture.disableRescaling();
        this._renderTargetTextures.push(renderTargetTexture);
        return renderTargetTexture;
    }
    _destroyRenderTargetTexture(renderTargetTexture) {
        this._renderTargetTextures.splice(this._renderTargetTextures.indexOf(renderTargetTexture), 1);
        renderTargetTexture.dispose();
    }
    getFramebufferDimensions() {
        return this._framebufferDimensions;
    }
    dispose() {
        for (const rtt of this._renderTargetTextures) {
            rtt.dispose();
        }
        this._renderTargetTextures.length = 0;
    }
}
//# sourceMappingURL=webXRRenderTargetTextureProvider.js.map