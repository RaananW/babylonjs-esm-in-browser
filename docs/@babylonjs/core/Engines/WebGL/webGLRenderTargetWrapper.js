import { RenderTargetWrapper } from "../renderTargetWrapper.js";
/** @internal */
export class WebGLRenderTargetWrapper extends RenderTargetWrapper {
    constructor(isMulti, isCube, size, engine, context) {
        super(isMulti, isCube, size, engine);
        this._framebuffer = null;
        this._depthStencilBuffer = null;
        // eslint-disable-next-line @typescript-eslint/naming-convention
        this._MSAAFramebuffer = null;
        // Multiview
        this._colorTextureArray = null;
        this._depthStencilTextureArray = null;
        this._context = context;
    }
    _cloneRenderTargetWrapper() {
        let rtw = null;
        if (this._colorTextureArray && this._depthStencilTextureArray) {
            rtw = this._engine.createMultiviewRenderTargetTexture(this.width, this.height);
            rtw.texture.isReady = true;
        }
        else {
            rtw = super._cloneRenderTargetWrapper();
        }
        return rtw;
    }
    _swapRenderTargetWrapper(target) {
        super._swapRenderTargetWrapper(target);
        target._framebuffer = this._framebuffer;
        target._depthStencilBuffer = this._depthStencilBuffer;
        target._MSAAFramebuffer = this._MSAAFramebuffer;
        target._colorTextureArray = this._colorTextureArray;
        target._depthStencilTextureArray = this._depthStencilTextureArray;
        this._framebuffer = this._depthStencilBuffer = this._MSAAFramebuffer = this._colorTextureArray = this._depthStencilTextureArray = null;
    }
    /**
     * Shares the depth buffer of this render target with another render target.
     * @internal
     * @param renderTarget Destination renderTarget
     */
    _shareDepth(renderTarget) {
        super._shareDepth(renderTarget);
        const gl = this._context;
        const depthbuffer = this._depthStencilBuffer;
        const framebuffer = renderTarget._MSAAFramebuffer || renderTarget._framebuffer;
        if (renderTarget._depthStencilBuffer) {
            gl.deleteRenderbuffer(renderTarget._depthStencilBuffer);
        }
        renderTarget._depthStencilBuffer = this._depthStencilBuffer;
        this._engine._bindUnboundFramebuffer(framebuffer);
        gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, depthbuffer);
        this._engine._bindUnboundFramebuffer(null);
    }
    /**
     * Binds a texture to this render target on a specific attachment
     * @param texture The texture to bind to the framebuffer
     * @param attachmentIndex Index of the attachment
     * @param faceIndex The face of the texture to render to in case of cube texture
     * @param lodLevel defines the lod level to bind to the frame buffer
     */
    _bindTextureRenderTarget(texture, attachmentIndex = 0, faceIndex = -1, lodLevel = 0) {
        if (!texture._hardwareTexture) {
            return;
        }
        const gl = this._context;
        const framebuffer = this._framebuffer;
        const currentFB = this._engine._currentFramebuffer;
        this._engine._bindUnboundFramebuffer(framebuffer);
        const attachment = gl[this._engine.webGLVersion > 1 ? "COLOR_ATTACHMENT" + attachmentIndex : "COLOR_ATTACHMENT" + attachmentIndex + "_WEBGL"];
        const target = faceIndex !== -1 ? gl.TEXTURE_CUBE_MAP_POSITIVE_X + faceIndex : gl.TEXTURE_2D;
        gl.framebufferTexture2D(gl.FRAMEBUFFER, attachment, target, texture._hardwareTexture.underlyingResource, lodLevel);
        this._engine._bindUnboundFramebuffer(currentFB);
    }
    /**
     * Set a texture in the textures array
     * @param texture the texture to set
     * @param index the index in the textures array to set
     * @param disposePrevious If this function should dispose the previous texture
     */
    setTexture(texture, index = 0, disposePrevious = true) {
        super.setTexture(texture, index, disposePrevious);
        this._bindTextureRenderTarget(texture, index);
    }
    dispose(disposeOnlyFramebuffers = false) {
        const gl = this._context;
        if (!disposeOnlyFramebuffers) {
            if (this._colorTextureArray) {
                this._context.deleteTexture(this._colorTextureArray);
                this._colorTextureArray = null;
            }
            if (this._depthStencilTextureArray) {
                this._context.deleteTexture(this._depthStencilTextureArray);
                this._depthStencilTextureArray = null;
            }
        }
        if (this._framebuffer) {
            gl.deleteFramebuffer(this._framebuffer);
            this._framebuffer = null;
        }
        if (this._depthStencilBuffer) {
            gl.deleteRenderbuffer(this._depthStencilBuffer);
            this._depthStencilBuffer = null;
        }
        if (this._MSAAFramebuffer) {
            gl.deleteFramebuffer(this._MSAAFramebuffer);
            this._MSAAFramebuffer = null;
        }
        super.dispose(disposeOnlyFramebuffers);
    }
}
//# sourceMappingURL=webGLRenderTargetWrapper.js.map