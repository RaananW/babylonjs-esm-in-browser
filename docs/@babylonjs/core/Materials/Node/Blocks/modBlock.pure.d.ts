/** This file must only contain pure code and pure imports */
import { NodeMaterialBlock } from "../nodeMaterialBlock.js";
import { type NodeMaterialBuildState } from "../nodeMaterialBuildState.js";
import { type NodeMaterialConnectionPoint } from "../nodeMaterialBlockConnectionPoint.js";
/**
 * Block used to compute value of one parameter modulo another
 */
export declare class ModBlock extends NodeMaterialBlock {
    /**
     * Creates a new ModBlock
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
 * Register side effects for modBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterModBlock(): void;
