import { type GLTFLoader } from "../glTFLoader.pure.js";
import { type IGLTFLoaderExtension } from "../glTFLoaderExtension.js";
import { type Scene } from "@babylonjs/core/scene.js";
/**
 * Loader extension for KHR_interactivity
 */
export declare class KHR_interactivity implements IGLTFLoaderExtension {
    private _loader;
    /**
     * The name of this extension.
     */
    readonly name = "KHR_interactivity";
    /**
     * Defines whether this extension is enabled.
     */
    enabled: boolean;
    private _gltfPathConverter?;
    private _pathConverter?;
    /**
     * @internal
     * @param _loader
     */
    constructor(_loader: GLTFLoader);
    dispose(): void;
    onReady(): Promise<void>;
}
/**
 * @internal
 * populates the object model with the interactivity extension
 */
export declare function _AddInteractivityObjectModel(scene: Scene): void;
/**
 * @internal
 * Registers KHR_interactivity runtime dependencies without changing the extension registry.
 */
export declare function _RegisterKHRInteractivityRuntime(): void;
/**
 * Registers the KHR_interactivity glTF loader extension.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterKHR_interactivity(): void;
