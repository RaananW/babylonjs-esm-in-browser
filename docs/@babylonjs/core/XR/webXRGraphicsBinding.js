/**
 * The error shown when the active WebGPU engine cannot start an XR session.
 * @internal
 */
export const WebGPUXRNotSupportedErrorMessage = "WebGPU XR is unavailable in this browser or device. This experimental path requires XRGPUBinding with projection-layer support. To fall back, create a WebGL engine before creating the scene; Babylon.js cannot switch an existing scene's rendering backend.";
/**
 * The error shown when a WebGPU XR session request is rejected as unsupported.
 * @internal
 */
export const WebGPUXRSessionNotSupportedErrorMessage = "The WebGPU XR session request was rejected as unsupported. The session mode, WebGPU or Layers requirements, or another required feature may be unavailable. If WebGPU XR is unavailable, create a WebGL engine before creating the scene.";
/**
 * The error shown when the active WebGPU engine was not created with XR compatibility enabled.
 * @internal
 */
export const WebGPUXREngineNotCompatibleErrorMessage = "WebGPU XR requires a WebGPUEngine created with { xrCompatible: true }. Select an XR-capable WebGPU engine or WebGL before creating scene resources.";
/**
 * Checks whether the runtime exposes the XRGPUBinding projection path required by Babylon.js.
 * This is an advisory shape check; session negotiation can still reject for the active device.
 * @returns whether the required WebGPU-XR binding APIs are exposed
 * @internal
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export function IsWebGPUXRSupported() {
    return (typeof XRGPUBinding === "function" &&
        typeof XRGPUBinding.prototype.createProjectionLayer === "function" &&
        typeof XRGPUBinding.prototype.getViewSubImage === "function" &&
        typeof XRGPUBinding.prototype.getPreferredColorFormat === "function" &&
        typeof XRGPUSubImage === "function" &&
        typeof XRGPUSubImage.prototype.getViewDescriptor === "function");
}
/**
 * Checks whether an engine was initialized with the adapter option required for WebGPU XR.
 * @param engine the engine to test
 * @returns true for non-WebGPU engines or WebGPU engines created with xrCompatible enabled
 * @internal
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export function IsWebGPUXREngineCompatible(engine) {
    return !engine.isWebGPU || engine._options?.xrCompatible === true;
}
/**
 * The kind of underlying native binding an {@link IWebXRGraphicsBinding} wraps.
 * @internal
 */
export var WebXRGraphicsBindingType;
(function (WebXRGraphicsBindingType) {
    /**
     * Backed by an XRWebGLBinding (WebGL / WebGL2).
     */
    WebXRGraphicsBindingType[WebXRGraphicsBindingType["WebGL"] = 0] = "WebGL";
    /**
     * Backed by an XRGPUBinding (WebGPU).
     */
    WebXRGraphicsBindingType[WebXRGraphicsBindingType["WebGPU"] = 1] = "WebGPU";
})(WebXRGraphicsBindingType || (WebXRGraphicsBindingType = {}));
/**
 * WebGL implementation of {@link IWebXRGraphicsBinding}, wrapping an `XRWebGLBinding`.
 * @internal
 */
export class WebXRWebGLGraphicsBinding {
    /**
     * Creates a new WebGL graphics binding.
     * @param session the XR session the binding is created for
     * @param context the WebGL rendering context to bind to
     */
    constructor(session, 
    /**
     * The WebGL rendering context used by the native binding.
     */
    context) {
        this.context = context;
        /**
         * The kind of native binding that is wrapped.
         */
        this.bindingType = 0 /* WebXRGraphicsBindingType.WebGL */;
        this.binding = new XRWebGLBinding(session, context);
    }
    /**
     * Creates a new WebGL graphics binding from an engine, extracting its WebGL context.
     * The WebGL-specific context access is localized here so callers can stay graphics-API-agnostic.
     * @param session the XR session the binding is created for
     * @param engine the engine whose WebGL context should be bound
     * @returns the created WebGL graphics binding
     */
    static CreateFromEngine(session, engine) {
        const gl = engine._gl;
        if (!gl) {
            throw new Error("WebXRWebGLGraphicsBinding requires a WebGL-capable engine.");
        }
        return new WebXRWebGLGraphicsBinding(session, gl);
    }
}
/**
 * WebGPU implementation of {@link IWebXRGraphicsBinding}, wrapping an `XRGPUBinding`.
 *
 * The `XRGPUBinding` requires a WebGPU-compatible XR session (created with the `webgpu` feature
 * descriptor) and a `GPUDevice` obtained from an `xrCompatible` adapter, otherwise its constructor throws.
 * @internal
 */
export class WebXRWebGPUGraphicsBinding {
    /**
     * Creates a new WebGPU graphics binding.
     * @param session the XR session the binding is created for
     * @param device the WebGPU device to bind to
     */
    constructor(session, device) {
        /**
         * The kind of native binding that is wrapped.
         */
        this.bindingType = 1 /* WebXRGraphicsBindingType.WebGPU */;
        this.binding = new XRGPUBinding(session, device);
    }
    /**
     * Creates a new WebGPU graphics binding from an engine, extracting its `GPUDevice`.
     * The WebGPU-specific device access is localized here so callers can stay graphics-API-agnostic.
     * @param session the XR session the binding is created for
     * @param engine the engine whose WebGPU device should be bound
     * @returns the created WebGPU graphics binding
     */
    static CreateFromEngine(session, engine) {
        const device = engine._device;
        if (!device) {
            throw new Error("WebXRWebGPUGraphicsBinding requires a WebGPU-capable engine.");
        }
        return new WebXRWebGPUGraphicsBinding(session, device);
    }
}
//# sourceMappingURL=webXRGraphicsBinding.js.map