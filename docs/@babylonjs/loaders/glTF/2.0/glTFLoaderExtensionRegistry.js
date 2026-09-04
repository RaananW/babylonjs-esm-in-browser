import { Logger } from "@babylonjs/core/Misc/logger.js";
const RegisteredGLTFExtensions = new Map();
/**
 * All currently registered glTF 2.0 loader extensions.
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export const registeredGLTFExtensions = RegisteredGLTFExtensions;
/**
 * Registers a loader extension.
 * @param name The name of the loader extension.
 * @param isGLTFExtension If the loader extension is a glTF extension, then it will only be used for glTF files that use the corresponding glTF extension. Otherwise, it will be used for all loaded glTF files.
 * @param factory The factory function that creates the loader extension.
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export function registerGLTFExtension(name, isGLTFExtension, factory) {
    if (unregisterGLTFExtension(name)) {
        Logger.Warn(`Extension with the name '${name}' already exists`);
    }
    RegisteredGLTFExtensions.set(name, {
        isGLTFExtension,
        factory,
    });
}
/**
 * Unregisters a loader extension.
 * @param name The name of the loader extension.
 * @returns A boolean indicating whether the extension has been unregistered
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export function unregisterGLTFExtension(name) {
    return RegisteredGLTFExtensions.delete(name);
}
//# sourceMappingURL=glTFLoaderExtensionRegistry.js.map