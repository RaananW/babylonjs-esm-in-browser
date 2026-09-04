import { RenderTargetWrapper } from "../renderTargetWrapper.js";
export class NativeRenderTargetWrapper extends RenderTargetWrapper {
    get _framebuffer() {
        return this.__framebuffer;
    }
    set _framebuffer(framebuffer) {
        if (this.__framebuffer) {
            this._engine._releaseFramebufferObjects(this.__framebuffer);
        }
        this.__framebuffer = framebuffer;
    }
    get _framebuffers() {
        return this.__framebuffers;
    }
    set _framebuffers(framebuffers) {
        if (this.__framebuffers) {
            for (const framebuffer of this.__framebuffers) {
                this._engine._releaseFramebufferObjects(framebuffer);
            }
        }
        this.__framebuffers = framebuffers;
        // Keep _framebuffer pointing at face 0 so single-target code paths still work.
        this.__framebuffer = framebuffers ? framebuffers[0] : null;
    }
    get _framebufferDepthStencil() {
        return this.__framebufferDepthStencil;
    }
    set _framebufferDepthStencil(framebufferDepthStencil) {
        if (this.__framebufferDepthStencil) {
            this._engine._releaseFramebufferObjects(this.__framebufferDepthStencil);
        }
        this.__framebufferDepthStencil = framebufferDepthStencil;
    }
    constructor(isMulti, isCube, size, engine) {
        super(isMulti, isCube, size, engine);
        // eslint-disable-next-line @typescript-eslint/naming-convention
        this.__framebuffer = null;
        // eslint-disable-next-line @typescript-eslint/naming-convention
        this.__framebufferDepthStencil = null;
        // Per-face framebuffers for cube render targets (index = cube face 0..5).
        // eslint-disable-next-line @typescript-eslint/naming-convention
        this.__framebuffers = null;
        this._engine = engine;
    }
    setTexture(texture, index = 0, disposePrevious = true) {
        const previous = this.textures?.[index];
        super.setTexture(texture, index, disposePrevious);
        // bgfx binds a fixed attachment set when a framebuffer is created and cannot re-point an individual
        // attachment the way GL's framebufferTexture2D can. When a multi render target attachment is swapped
        // after creation (e.g. the OIT depth-peeling renderer replaces every attachment via
        // MultiRenderTarget.setInternalTexture), recreate the whole framebuffer from the new attachment set.
        if (this.isMulti && this.textures?.[index] !== previous) {
            this._engine._createMultiRenderTargetFramebuffer(this);
        }
    }
    dispose(disposeOnlyFramebuffers = false) {
        if (this.__framebuffers) {
            // Releases all six per-face framebuffers (face 0 is aliased by __framebuffer, so
            // clear that alias here without releasing it again).
            this._framebuffers = null;
        }
        else {
            this._framebuffer = null;
        }
        this._framebufferDepthStencil = null;
        super.dispose(disposeOnlyFramebuffers);
    }
}
//# sourceMappingURL=nativeRenderTargetWrapper.js.map