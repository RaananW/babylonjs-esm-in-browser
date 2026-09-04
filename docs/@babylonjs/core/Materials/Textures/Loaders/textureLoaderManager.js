import { Logger } from "../../../Misc/logger.js";
const RegisteredTextureLoaders = new Map();
/**
 * Registers a texture loader.
 * If a loader for the extension exists in the registry, it will be replaced.
 * @param extension The name of the loader extension.
 * @param loaderFactory The factory function that creates the loader extension.
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export function registerTextureLoader(extension, loaderFactory) {
    if (unregisterTextureLoader(extension)) {
        Logger.Warn(`Extension with the name '${extension}' already exists`);
    }
    RegisteredTextureLoaders.set(extension, loaderFactory);
}
/**
 * Unregisters a texture loader.
 * @param extension The name of the loader extension.
 * @returns A boolean indicating whether the extension has been unregistered
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export function unregisterTextureLoader(extension) {
    return RegisteredTextureLoaders.delete(extension);
}
/**
 * Function used to get the correct texture loader for a specific extension.
 * @param extension defines the file extension of the file being loaded
 * @param mimeType defines the optional mime type of the file being loaded
 * @returns the IInternalTextureLoader or null if it wasn't found
 */
export function _GetCompatibleTextureLoader(extension, mimeType) {
    if (mimeType === "image/ktx" || mimeType === "image/ktx2") {
        extension = ".ktx";
    }
    if (!RegisteredTextureLoaders.has(extension)) {
        if (extension.endsWith(".ies")) {
            registerTextureLoader(".ies", async () => await import("./iesTextureLoader.js").then((module) => new module._IESTextureLoader()));
        }
        if (extension.endsWith(".dds")) {
            registerTextureLoader(".dds", async () => await import("./ddsTextureLoader.js").then((module) => new module._DDSTextureLoader()));
        }
        if (extension.endsWith(".basis")) {
            registerTextureLoader(".basis", async () => await import("./basisTextureLoader.js").then((module) => new module._BasisTextureLoader()));
        }
        if (extension.endsWith(".env")) {
            registerTextureLoader(".env", async () => await import("./envTextureLoader.js").then((module) => new module._ENVTextureLoader()));
        }
        if (extension.endsWith(".hdr")) {
            registerTextureLoader(".hdr", async () => await import("./hdrTextureLoader.js").then((module) => new module._HDRTextureLoader()));
        }
        // The ".ktx2" file extension is still up for debate: https://github.com/KhronosGroup/KTX-Specification/issues/18
        if (extension.endsWith(".ktx") || extension.endsWith(".ktx2")) {
            registerTextureLoader(".ktx", async () => await import("./ktxTextureLoader.js").then((module) => new module._KTXTextureLoader()));
            registerTextureLoader(".ktx2", async () => await import("./ktxTextureLoader.js").then((module) => new module._KTXTextureLoader()));
        }
        if (extension.endsWith(".tga")) {
            registerTextureLoader(".tga", async () => await import("./tgaTextureLoader.js").then((module) => new module._TGATextureLoader()));
        }
        if (extension.endsWith(".exr")) {
            registerTextureLoader(".exr", async () => await import("./exrTextureLoader.js").then((module) => new module._ExrTextureLoader()));
        }
    }
    const registered = RegisteredTextureLoaders.get(extension);
    return registered ? Promise.resolve(registered(mimeType)) : null;
}
//# sourceMappingURL=textureLoaderManager.js.map