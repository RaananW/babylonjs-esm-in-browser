/** This file must only contain pure code and pure imports */
import { NodeMaterialBlock } from "../nodeMaterialBlock.js";
import { type NodeMaterialBuildState } from "../nodeMaterialBuildState.js";
import { type NodeMaterialConnectionPoint } from "../nodeMaterialBlockConnectionPoint.js";
/**
 * Block used to desaturate a color
 */
export declare class DesaturateBlock extends NodeMaterialBlock {
    /**
     * Creates a new DesaturateBlock
     * @param name defines the block name
     */
    constructor(name: string);
    /**
     * Gets the current class name
     * @returns the class name
     */
    getClassName(): string;
    /**
     * Gets the color operand input component
     */
    get color(): NodeMaterialConnectionPoint;
    /**
     * Gets the level operand input component
     */
    get level(): NodeMaterialConnectionPoint;
    /**
     * Gets the output component
     */
    get output(): NodeMaterialConnectionPoint;
    protected _buildBlock(state: NodeMaterialBuildState): this;
}
/**
 * Register side effects for desaturateBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterDesaturateBlock(): void;
