import { type GLTFLoader } from "../glTFLoader.pure.js";
import { type IGLTFLoaderExtension } from "../glTFLoaderExtension.js";
/**
 * Loader extension for KHR_node_hoverability
 * @see https://github.com/KhronosGroup/glTF/pull/2426
 */
export declare class KHR_node_hoverability implements IGLTFLoaderExtension {
    /**
     * The name of this extension.
     */
    readonly name = "KHR_node_hoverability";
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
 * Registers KHR_node_hoverability runtime dependencies without changing the extension registry.
 */
export declare function _RegisterKHRNodeHoverabilityRuntime(): void;
/**
 * Registers the KHR_node_hoverability glTF loader extension.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterKHR_node_hoverability(): void;
