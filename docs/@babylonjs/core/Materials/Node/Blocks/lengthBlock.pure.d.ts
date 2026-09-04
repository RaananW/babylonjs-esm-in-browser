/** This file must only contain pure code and pure imports */
import { NodeMaterialBlock } from "../nodeMaterialBlock.js";
import { type NodeMaterialBuildState } from "../nodeMaterialBuildState.js";
import { type NodeMaterialConnectionPoint } from "../nodeMaterialBlockConnectionPoint.js";
/**
 * Block used to get the length of a vector
 */
export declare class LengthBlock extends NodeMaterialBlock {
    /**
     * Creates a new LengthBlock
     * @param name defines the block name
     */
    constructor(name: string);
    /**
     * Gets the current class name
     * @returns the class name
     */
    getClassName(): string;
    /**
     * Gets the value input component
     */
    get value(): NodeMaterialConnectionPoint;
    /**
     * Gets the output component
     */
    get output(): NodeMaterialConnectionPoint;
    protected _buildBlock(state: NodeMaterialBuildState): this;
}
/**
 * Register side effects for lengthBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterLengthBlock(): void;
