/** This file must only contain pure code and pure imports */
import { NodeMaterialBlock } from "../../nodeMaterialBlock.js";
import { type NodeMaterialBuildState } from "../../nodeMaterialBuildState.js";
import { type NodeMaterialConnectionPoint } from "../../nodeMaterialBlockConnectionPoint.js";
/**
 * Block used to discard a pixel if a value is smaller than a cutoff
 */
export declare class DiscardBlock extends NodeMaterialBlock {
    /**
     * Create a new DiscardBlock
     * @param name defines the block name
     */
    constructor(name: string);
    /**
     * Gets the current class name
     * @returns the class name
     */
    getClassName(): string;
    /**
     * Gets the color input component
     */
    get value(): NodeMaterialConnectionPoint;
    /**
     * Gets the cutoff input component
     */
    get cutoff(): NodeMaterialConnectionPoint;
    protected _buildBlock(state: NodeMaterialBuildState): this | undefined;
}
/**
 * Register side effects for discardBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterDiscardBlock(): void;
