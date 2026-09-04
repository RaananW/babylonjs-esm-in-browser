import { type Nullable } from "@babylonjs/core/types.js";
import { type IScene } from "../glTFLoaderInterfaces.js";
import { type IGLTFLoaderExtension } from "../glTFLoaderExtension.js";
import { GLTFLoader } from "../glTFLoader.pure.js";
/**
 * [Specification](https://github.com/KhronosGroup/glTF/blob/main/extensions/2.0/Vendor/EXT_lights_image_based/README.md)
 */
export declare class EXT_lights_image_based implements IGLTFLoaderExtension {
    /**
     * The name of this extension.
     */
    readonly name = "EXT_lights_image_based";
    /**
     * Defines whether this extension is enabled.
     */
    enabled: boolean;
    private _loader;
    private _lights?;
    /**
     * @internal
     */
    constructor(loader: GLTFLoader);
    /** @internal */
    dispose(): void;
    /** @internal */
    onLoading(): void;
    /**
     * @internal
     */
    loadSceneAsync(context: string, scene: IScene): Nullable<Promise<void>>;
    private _loadLightAsync;
}
/**
 * Registers the EXT_lights_image_based glTF loader extension.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterEXT_lights_image_based(): void;
