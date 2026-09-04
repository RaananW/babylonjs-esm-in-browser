import { type AbstractEngine } from "../Engines/abstractEngine.js";
/**
 * The error shown when the active WebGPU engine cannot start an XR session.
 * @internal
 */
export declare const WebGPUXRNotSupportedErrorMessage = "WebGPU XR is unavailable in this browser or device. This experimental path requires XRGPUBinding with projection-layer support. To fall back, create a WebGL engine before creating the scene; Babylon.js cannot switch an existing scene's rendering backend.";
/**
 * The error shown when a WebGPU XR session request is rejected as unsupported.
 * @internal
 */
export declare const WebGPUXRSessionNotSupportedErrorMessage = "The WebGPU XR session request was rejected as unsupported. The session mode, WebGPU or Layers requirements, or another required feature may be unavailable. If WebGPU XR is unavailable, create a WebGL engine before creating the scene.";
/**
 * The error shown when the active WebGPU engine was not created with XR compatibility enabled.
 * @internal
 */
export declare const WebGPUXREngineNotCompatibleErrorMessage = "WebGPU XR requires a WebGPUEngine created with { xrCompatible: true }. Select an XR-capable WebGPU engine or WebGL before creating scene resources.";
/**
 * Checks whether the runtime exposes the XRGPUBinding projection path required by Babylon.js.
 * This is an advisory shape check; session negotiation can still reject for the active device.
 * @returns whether the required WebGPU-XR binding APIs are exposed
 * @internal
 */
export declare function IsWebGPUXRSupported(): boolean;
/**
 * Checks whether an engine was initialized with the adapter option required for WebGPU XR.
 * @param engine the engine to test
 * @returns true for non-WebGPU engines or WebGPU engines created with xrCompatible enabled
 * @internal
 */
export declare function IsWebGPUXREngineCompatible(engine: AbstractEngine): boolean;
/**
 * The kind of underlying native binding an {@link IWebXRGraphicsBinding} wraps.
 * @internal
 */
export declare enum WebXRGraphicsBindingType {
    /**
     * Backed by an XRWebGLBinding (WebGL / WebGL2).
     */
    WebGL = 0,
    /**
     * Backed by an XRGPUBinding (WebGPU).
     */
    WebGPU = 1
}
/**
 * Abstraction over the native WebXR graphics binding used to interact with the XR compositor.
 * @internal
 */
export interface IWebXRGraphicsBinding {
    /**
     * The kind of native binding that is wrapped.
     */
    readonly bindingType: WebXRGraphicsBindingType;
}
/**
 * WebGL implementation of {@link IWebXRGraphicsBinding}, wrapping an `XRWebGLBinding`.
 * @internal
 */
export declare class WebXRWebGLGraphicsBinding implements IWebXRGraphicsBinding {
    /**
     * The WebGL rendering context used by the native binding.
     */
    readonly context: WebGLRenderingContext | WebGL2RenderingContext;
    /**
     * The kind of native binding that is wrapped.
     */
    readonly bindingType = WebXRGraphicsBindingType.WebGL;
    /**
     * The wrapped native `XRWebGLBinding`.
     */
    readonly binding: XRWebGLBinding;
    /**
     * Creates a new WebGL graphics binding.
     * @param session the XR session the binding is created for
     * @param context the WebGL rendering context to bind to
     */
    constructor(session: XRSession, 
    /**
     * The WebGL rendering context used by the native binding.
     */
    context: WebGLRenderingContext | WebGL2RenderingContext);
    /**
     * Creates a new WebGL graphics binding from an engine, extracting its WebGL context.
     * The WebGL-specific context access is localized here so callers can stay graphics-API-agnostic.
     * @param session the XR session the binding is created for
     * @param engine the engine whose WebGL context should be bound
     * @returns the created WebGL graphics binding
     */
    static CreateFromEngine(session: XRSession, engine: AbstractEngine): WebXRWebGLGraphicsBinding;
}
/**
 * WebGPU implementation of {@link IWebXRGraphicsBinding}, wrapping an `XRGPUBinding`.
 *
 * The `XRGPUBinding` requires a WebGPU-compatible XR session (created with the `webgpu` feature
 * descriptor) and a `GPUDevice` obtained from an `xrCompatible` adapter, otherwise its constructor throws.
 * @internal
 */
export declare class WebXRWebGPUGraphicsBinding implements IWebXRGraphicsBinding {
    /**
     * The kind of native binding that is wrapped.
     */
    readonly bindingType = WebXRGraphicsBindingType.WebGPU;
    /**
     * The wrapped native `XRGPUBinding`.
     */
    readonly binding: XRGPUBinding;
    /**
     * Creates a new WebGPU graphics binding.
     * @param session the XR session the binding is created for
     * @param device the WebGPU device to bind to
     */
    constructor(session: XRSession, device: GPUDevice);
    /**
     * Creates a new WebGPU graphics binding from an engine, extracting its `GPUDevice`.
     * The WebGPU-specific device access is localized here so callers can stay graphics-API-agnostic.
     * @param session the XR session the binding is created for
     * @param engine the engine whose WebGPU device should be bound
     * @returns the created WebGPU graphics binding
     */
    static CreateFromEngine(session: XRSession, engine: AbstractEngine): WebXRWebGPUGraphicsBinding;
}
/**
 * The graphics bindings supported by the WebXR session manager.
 * @internal
 */
export type WebXRGraphicsBinding = WebXRWebGLGraphicsBinding | WebXRWebGPUGraphicsBinding;
