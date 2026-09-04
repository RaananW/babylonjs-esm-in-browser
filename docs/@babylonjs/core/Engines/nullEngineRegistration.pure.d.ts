/**
 * Registers the minimum set of engine extensions required for basic rendering with NullEngine.
 * NullEngine extends Engine, so this delegates to {@link RegisterCoreEngineExtensions}.
 */
export declare function RegisterCoreNullEngineExtensions(): void;
/**
 * Registers the standard set of engine extensions needed by most NullEngine scenes.
 * Delegates to {@link RegisterStandardEngineExtensions}.
 */
export declare function RegisterStandardNullEngineExtensions(): void;
/**
 * Registers all available engine extensions for the NullEngine.
 * Delegates to {@link RegisterFullEngineExtensions}.
 */
export declare function RegisterFullNullEngineExtensions(): void;
