import { RegisterCoreEngineExtensions, RegisterStandardEngineExtensions, RegisterFullEngineExtensions } from "./engineRegistration.pure.js";
/**
 * Registers the minimum set of engine extensions required for basic rendering with NullEngine.
 * NullEngine extends Engine, so this delegates to {@link RegisterCoreEngineExtensions}.
 */
export function RegisterCoreNullEngineExtensions() {
    RegisterCoreEngineExtensions();
}
/**
 * Registers the standard set of engine extensions needed by most NullEngine scenes.
 * Delegates to {@link RegisterStandardEngineExtensions}.
 */
export function RegisterStandardNullEngineExtensions() {
    RegisterStandardEngineExtensions();
}
/**
 * Registers all available engine extensions for the NullEngine.
 * Delegates to {@link RegisterFullEngineExtensions}.
 */
export function RegisterFullNullEngineExtensions() {
    RegisterFullEngineExtensions();
}
//# sourceMappingURL=nullEngineRegistration.pure.js.map