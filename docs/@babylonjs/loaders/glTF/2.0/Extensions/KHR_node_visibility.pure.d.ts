import { type GLTFLoader } from "../glTFLoader.pure.js";
import { type IGLTFLoaderExtension } from "../glTFLoaderExtension.js";
/**
 * Loader extension for KHR_node_visibility
 */
export declare class KHR_node_visibility implements IGLTFLoaderExtension {
    /**
     * The name of this extension.
     */
    readonly name = "KHR_node_visibility";
    /**
     * Defines whether this extension is enabled.
     */
    enabled: boolean;
    private _loader?;
    /**
     * @internal
     */
    constructor(loader: GLTFLoader);
    onReady(): void;
    dispose(): void;
}
/**
 * @internal
 * Registers KHR_node_visibility runtime dependencies without changing the extension registry.
 */
export declare function _RegisterKHRNodeVisibilityRuntime(): void;
/**
 * Registers the KHR_node_visibility glTF loader extension.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterKHR_node_visibility(): void;
