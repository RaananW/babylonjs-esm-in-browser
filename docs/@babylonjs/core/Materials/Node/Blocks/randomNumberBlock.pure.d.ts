/** This file must only contain pure code and pure imports */
import { NodeMaterialBlock } from "../nodeMaterialBlock.js";
import { type NodeMaterialBuildState } from "../nodeMaterialBuildState.js";
import { type NodeMaterialConnectionPoint } from "../nodeMaterialBlockConnectionPoint.js";
/**
 * Block used to get a random number
 */
export declare class RandomNumberBlock extends NodeMaterialBlock {
    /**
     * Creates a new RandomNumberBlock
     * @param name defines the block name
     */
    constructor(name: string);
    /**
     * Gets the current class name
     * @returns the class name
     */
    getClassName(): string;
    /**
     * Gets the seed input component
     */
    get seed(): NodeMaterialConnectionPoint;
    /**
     * Gets the output component
     */
    get output(): NodeMaterialConnectionPoint;
    /**
     * Initialize the block and prepare the context for build
     * @param state defines the state that will be used for the build
     */
    initialize(state: NodeMaterialBuildState): void;
    private _initShaderSourceAsync;
    protected _buildBlock(state: NodeMaterialBuildState): this;
}
/**
 * Register side effects for randomNumberBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterRandomNumberBlock(): void;
