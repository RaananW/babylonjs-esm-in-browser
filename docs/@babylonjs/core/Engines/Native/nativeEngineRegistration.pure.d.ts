/**
 * Registers the minimum set of engine extensions required for basic rendering with NativeEngine.
 * Includes: DOM binding, render passes, GPU states, stencil, and the native engine mixins.
 */
export declare function RegisterCoreNativeEngineExtensions(): void;
/**
 * Registers the standard set of engine extensions needed by most NativeEngine scenes.
 * Includes everything in {@link RegisterCoreNativeEngineExtensions} plus
 * textures and file loading.
 */
export declare function RegisterStandardNativeEngineExtensions(): void;
/**
 * Registers all available engine extensions for the NativeEngine.
 * Includes everything in {@link RegisterStandardNativeEngineExtensions} plus
 * cube textures, queries, views, loading screen, and native-specific extensions.
 */
export declare function RegisterFullNativeEngineExtensions(): void;
