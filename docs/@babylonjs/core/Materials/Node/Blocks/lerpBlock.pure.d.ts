/** This file must only contain pure code and pure imports */
import { NodeMaterialBlock } from "../nodeMaterialBlock.js";
import { type NodeMaterialBuildState } from "../nodeMaterialBuildState.js";
import { type NodeMaterialConnectionPoint } from "../nodeMaterialBlockConnectionPoint.js";
/**
 * Block used to lerp between 2 values
 */
export declare class LerpBlock extends NodeMaterialBlock {
    /**
     * Creates a new LerpBlock
     * @param name defines the block name
     */
    constructor(name: string);
    /**
     * Gets the current class name
     * @returns the class name
     */
    getClassName(): string;
    /**
     * Gets the left operand input component
     */
    get left(): NodeMaterialConnectionPoint;
    /**
     * Gets the right operand input component
     */
    get right(): NodeMaterialConnectionPoint;
    /**
     * Gets the gradient operand input component
     */
    get gradient(): NodeMaterialConnectionPoint;
    /**
     * Gets the output component
     */
    get output(): NodeMaterialConnectionPoint;
    protected _buildBlock(state: NodeMaterialBuildState): this;
}
/**
 * Register side effects for lerpBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterLerpBlock(): void;
