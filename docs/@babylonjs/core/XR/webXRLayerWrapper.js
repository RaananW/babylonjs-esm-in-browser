/**
 * Wrapper over subclasses of XRLayer.
 * @internal
 */
export class WebXRLayerWrapper {
    /**
     * The render target provider created for this layer, or `null` until one is created.
     */
    get renderTargetTextureProvider() {
        return this._rttWrapper;
    }
    /**
     * Check if fixed foveation is supported by the wrapped XRWebGLLayer or XRProjectionLayer.
     */
    get isFixedFoveationSupported() {
        const isFoveationLayer = this.layerType === "XRWebGLLayer" || this.layerType === "XRProjectionLayer";
        return isFoveationLayer && typeof this.layer.fixedFoveation === "number";
    }
    /**
     * Gets the fixed foveation currently set, as specified by the WebXR specs.
     * @returns The fixed foveation level, or `null` when fixed foveation is not supported.
     */
    get fixedFoveation() {
        if (this.isFixedFoveationSupported) {
            return this.layer.fixedFoveation ?? null;
        }
        return null;
    }
    /**
     * Sets the fixed foveation level, as specified by the WebXR specs.
     * The value is normalized between 0 and 1, where 1 is maximum foveation and 0 is no foveation.
     * Unsupported native layers ignore the assignment, matching the WebXR fixed-foveation contract.
     * @param value The fixed foveation level, or `null` to use no foveation.
     */
    set fixedFoveation(value) {
        if (this.isFixedFoveationSupported) {
            const val = Math.max(0, Math.min(1, value || 0));
            this.layer.fixedFoveation = val;
        }
    }
    /**
     * Create a render target provider for the wrapped layer.
     * @param xrSessionManager The XR Session Manager
     * @returns A new render target texture provider for the wrapped layer.
     */
    createRenderTargetTextureProvider(xrSessionManager) {
        this._rttWrapper = this._createRenderTargetTextureProvider(xrSessionManager);
        return this._rttWrapper;
    }
    /**
     * Disposes the render target provider created for this layer.
     */
    dispose() {
        if (this._rttWrapper) {
            this._rttWrapper.dispose();
            this._rttWrapper = null;
        }
    }
    constructor(
    /** The width of the layer's framebuffer. */
    getWidth, 
    /** The height of the layer's framebuffer. */
    getHeight, 
    /** The XR layer that this WebXRLayerWrapper wraps. */
    layer, 
    /** The type of XR layer that is being wrapped. */
    layerType, 
    /** Create a render target provider for the wrapped layer. */
    _createRenderTargetTextureProvider) {
        this.getWidth = getWidth;
        this.getHeight = getHeight;
        this.layer = layer;
        this.layerType = layerType;
        this._createRenderTargetTextureProvider = _createRenderTargetTextureProvider;
        this._rttWrapper = null;
    }
}
//# sourceMappingURL=webXRLayerWrapper.js.map