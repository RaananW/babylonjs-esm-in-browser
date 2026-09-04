import { type GLTFLoader } from "../glTFLoader.pure.js";
import { type IGLTFLoaderExtension } from "../glTFLoaderExtension.js";
/**
 * Loader extension for KHR_selectability
 */
export declare class KHR_node_selectability implements IGLTFLoaderExtension {
    /**
     * The name of this extension.
     */
    readonly name = "KHR_node_selectability";
    /**
     * Defines whether this extension is enabled.
     */
    enabled: boolean;
    private _loader;
    /**
     * @internal
     */
    constructor(loader: GLTFLoader);
    onReady(): Promise<void>;
    dispose(): void;
}
/**
 * @internal
 * Registers KHR_node_selectability runtime dependencies without changing the extension registry.
 */
export declare function _RegisterKHRNodeSelectabilityRuntime(): void;
/**
 * Registers the KHR_node_selectability glTF loader extension.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterKHR_node_selectability(): void;
