import { type Nullable } from "../types.js";
import { type WebXRLayerRenderTargetTextureProvider } from "./webXRRenderTargetTextureProvider.js";
import { type WebXRSessionManager } from "./webXRSessionManager.js";
/** Covers all supported subclasses of WebXR's XRCompositionLayer */
export type WebXRCompositionLayerType = "XRProjectionLayer";
/**
 * The quad-layer type name.
 */
export type WebXRQuadLayerType = "XRQuadLayer";
/** Covers all supported subclasses of WebXR's XRLayer */
export type WebXRLayerType = "XRWebGLLayer" | WebXRCompositionLayerType | WebXRQuadLayerType;
/** Covers the spatial composition-layer types supported by WebXRLayers. */
export type WebXRSpatialLayerType = WebXRQuadLayerType | "XRCylinderLayer" | "XREquirectLayer" | "XRCubeLayer";
/** Covers every native layer type supported by Babylon.js. */
export type WebXRSupportedLayerType = WebXRLayerType | WebXRSpatialLayerType;
/**
 * Wrapper over subclasses of XRLayer.
 * @internal
 */
export declare class WebXRLayerWrapper<LayerTypeT extends WebXRSupportedLayerType = WebXRLayerType> {
    /** The width of the layer's framebuffer. */
    getWidth: () => number;
    /** The height of the layer's framebuffer. */
    getHeight: () => number;
    /** The XR layer that this WebXRLayerWrapper wraps. */
    readonly layer: XRLayer;
    /** The type of XR layer that is being wrapped. */
    readonly layerType: LayerTypeT;
    /** Create a render target provider for the wrapped layer. */
    private _createRenderTargetTextureProvider;
    private _rttWrapper;
    /**
     * The render target provider created for this layer, or `null` until one is created.
     */
    get renderTargetTextureProvider(): Nullable<WebXRLayerRenderTargetTextureProvider<LayerTypeT>>;
    /**
     * Check if fixed foveation is supported by the wrapped XRWebGLLayer or XRProjectionLayer.
     */
    get isFixedFoveationSupported(): boolean;
    /**
     * Gets the fixed foveation currently set, as specified by the WebXR specs.
     * @returns The fixed foveation level, or `null` when fixed foveation is not supported.
     */
    get fixedFoveation(): Nullable<number>;
    /**
     * Sets the fixed foveation level, as specified by the WebXR specs.
     * The value is normalized between 0 and 1, where 1 is maximum foveation and 0 is no foveation.
     * Unsupported native layers ignore the assignment, matching the WebXR fixed-foveation contract.
     * @param value The fixed foveation level, or `null` to use no foveation.
     */
    set fixedFoveation(value: Nullable<number>);
    /**
     * Create a render target provider for the wrapped layer.
     * @param xrSessionManager The XR Session Manager
     * @returns A new render target texture provider for the wrapped layer.
     */
    createRenderTargetTextureProvider(xrSessionManager: WebXRSessionManager): WebXRLayerRenderTargetTextureProvider<LayerTypeT>;
    /**
     * Disposes the render target provider created for this layer.
     */
    dispose(): void;
    protected constructor(
    /** The width of the layer's framebuffer. */
    getWidth: () => number, 
    /** The height of the layer's framebuffer. */
    getHeight: () => number, 
    /** The XR layer that this WebXRLayerWrapper wraps. */
    layer: XRLayer, 
    /** The type of XR layer that is being wrapped. */
    layerType: LayerTypeT, 
    /** Create a render target provider for the wrapped layer. */
    _createRenderTargetTextureProvider: (xrSessionManager: WebXRSessionManager) => WebXRLayerRenderTargetTextureProvider<LayerTypeT>);
}
