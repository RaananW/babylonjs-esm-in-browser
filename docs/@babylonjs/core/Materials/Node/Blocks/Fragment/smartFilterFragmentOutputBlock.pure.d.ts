/** This file must only contain pure code and pure imports */
import { FragmentOutputBlock } from "./fragmentOutputBlock.pure.js";
import { type NodeMaterialBuildState } from "../../nodeMaterialBuildState.js";
/** @internal */
export declare const SfeModeDefine = "USE_SFE_FRAMEWORK";
/**
 * Block used to output the final color with Smart Filters structural support.
 */
export declare class SmartFilterFragmentOutputBlock extends FragmentOutputBlock {
    /**
     * Create a new SmartFilterFragmentOutputBlock
     * @param name defines the block name
     */
    constructor(name: string);
    /**
     * Gets the current class name
     * @returns the class name
     */
    getClassName(): string;
    /**
     * Initialize the block and prepare the context for build
     * @param state defines the state that will be used for the build
     */
    initialize(state: NodeMaterialBuildState): void;
    private _generateInputBlockAnnotation;
    private _generateScreenSizeBlockAnnotation;
    private _getMainUvName;
    protected _getOutputString(): string;
    protected _buildBlock(state: NodeMaterialBuildState): this;
}
/**
 * Register side effects for smartFilterFragmentOutputBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterSmartFilterFragmentOutputBlock(): void;
