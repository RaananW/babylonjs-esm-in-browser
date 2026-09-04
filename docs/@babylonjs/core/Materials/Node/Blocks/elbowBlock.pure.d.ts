/** This file must only contain pure code and pure imports */
import { NodeMaterialBlock } from "../nodeMaterialBlock.js";
import { type NodeMaterialBuildState } from "../nodeMaterialBuildState.js";
import { type NodeMaterialConnectionPoint } from "../nodeMaterialBlockConnectionPoint.js";
import { NodeMaterialBlockTargets } from "../Enums/nodeMaterialBlockTargets.js";
/**
 * Block used as a pass through
 */
export declare class ElbowBlock extends NodeMaterialBlock {
    /**
     * Creates a new ElbowBlock
     * @param name defines the block name
     */
    constructor(name: string);
    /**
     * Gets the current class name
     * @returns the class name
     */
    getClassName(): string;
    /**
     * Gets the input component
     */
    get input(): NodeMaterialConnectionPoint;
    /**
     * Gets the output component
     */
    get output(): NodeMaterialConnectionPoint;
    /**
     * Gets or sets the target of the block
     */
    get target(): NodeMaterialBlockTargets;
    set target(value: NodeMaterialBlockTargets);
    protected _buildBlock(state: NodeMaterialBuildState): this;
}
/**
 * Register side effects for materialsNodeBlocksElbowBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterMaterialsNodeBlocksElbowBlock(): void;
