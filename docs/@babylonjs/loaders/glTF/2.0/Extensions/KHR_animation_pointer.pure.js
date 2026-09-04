import { Logger } from "@babylonjs/core/Misc/logger.js";
import { registerGLTFExtension, unregisterGLTFExtension } from "../glTFLoaderExtensionRegistry.js";
import { GetPathToObjectConverter } from "./objectModelMapping.js";
const NAME = "KHR_animation_pointer";
/**
 * [Specification PR](https://github.com/KhronosGroup/glTF/pull/2147)
 * !!! Experimental Extension Subject to Changes !!!
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export class KHR_animation_pointer {
    /**
     * @internal
     */
    constructor(loader) {
        /**
         * The name of this extension.
         */
        this.name = NAME;
        this._loader = loader;
        this._pathToObjectConverter = GetPathToObjectConverter(this._loader.gltf);
    }
    /**
     * Defines whether this extension is enabled.
     */
    get enabled() {
        return this._loader.isExtensionUsed(NAME);
    }
    /** @internal */
    dispose() {
        this._loader = null;
        delete this._pathToObjectConverter; // GC
    }
    /**
     * Loads a glTF animation channel.
     * @param context The context when loading the asset
     * @param animationContext The context of the animation when loading the asset
     * @param animation The glTF animation property
     * @param channel The glTF animation channel property
     * @param onLoad Called for each animation loaded
     * @returns A void promise that resolves when the load is complete or null if not handled
     */
    // eslint-disable-next-line no-restricted-syntax
    _loadAnimationChannelAsync(context, animationContext, animation, channel, onLoad) {
        const extension = channel.target.extensions?.KHR_animation_pointer;
        if (!extension || !this._pathToObjectConverter) {
            return null;
        }
        if (channel.target.path !== "pointer" /* AnimationChannelTargetPath.POINTER */) {
            Logger.Warn(`${context}/target/path: Value (${channel.target.path}) must be (${"pointer" /* AnimationChannelTargetPath.POINTER */}) when using the ${this.name} extension`);
        }
        if (channel.target.node != undefined) {
            Logger.Warn(`${context}/target/node: Value (${channel.target.node}) must not be present when using the ${this.name} extension`);
        }
        const extensionContext = `${context}/extensions/${this.name}`;
        const pointer = extension.pointer;
        if (!pointer) {
            throw new Error(`${extensionContext}: Pointer is missing`);
        }
        try {
            const obj = this._pathToObjectConverter.convert(pointer);
            if (!obj.info.interpolation) {
                throw new Error(`${extensionContext}/pointer: Interpolation is missing`);
            }
            return this._loader._loadAnimationChannelFromTargetInfoAsync(context, animationContext, animation, channel, {
                object: obj.object,
                info: obj.info.interpolation,
            }, onLoad);
        }
        catch (e) {
            Logger.Warn(`${extensionContext}/pointer: Invalid pointer (${pointer}) skipped`);
            return null;
        }
    }
}
let _Registered = false;
/**
 * Registers the KHR_animation_pointer glTF loader extension.
 * Safe to call multiple times; only the first call has an effect.
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export function RegisterKHR_animation_pointer() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    unregisterGLTFExtension(NAME);
    registerGLTFExtension(NAME, true, (loader) => new KHR_animation_pointer(loader));
}
//# sourceMappingURL=KHR_animation_pointer.pure.js.map