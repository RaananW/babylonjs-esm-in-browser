/**
 * Registers the minimum set of engine extensions required for basic rendering with WebGPU.
 * Includes: DOM binding, render passes, GPU states, and stencil.
 */
export declare function RegisterCoreWebGPUEngineExtensions(): void;
/**
 * Registers the standard set of engine extensions needed by most WebGPU scenes.
 * Includes everything in {@link RegisterCoreWebGPUEngineExtensions} plus
 * file loading, alpha blending, render targets, and render target textures.
 */
export declare function RegisterStandardWebGPUEngineExtensions(): void;
/**
 * Registers all available engine extensions for the WebGPU engine.
 * Includes everything in {@link RegisterStandardWebGPUEngineExtensions} plus
 * cube textures, raw textures, dynamic textures, multi-render, queries,
 * compute shaders, video textures, debugging, and more.
 */
export declare function RegisterFullWebGPUEngineExtensions(): void;
