/** This file must only contain pure code and pure imports */
import { NodeMaterialBlock } from "../nodeMaterialBlock.js";
import { type NodeMaterialBuildState } from "../nodeMaterialBuildState.js";
import { type NodeMaterialConnectionPoint } from "../nodeMaterialBlockConnectionPoint.js";
/**
 * Block used to apply a cross product between 2 vectors
 */
export declare class CrossBlock extends NodeMaterialBlock {
    /**
     * Creates a new CrossBlock
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
     * Gets the output component
     */
    get output(): NodeMaterialConnectionPoint;
    protected _buildBlock(state: NodeMaterialBuildState): this;
}
/**
 * Register side effects for crossBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterCrossBlock(): void;
