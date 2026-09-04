/** This file must only contain pure code and pure imports */
import { NodeMaterialBlock } from "../nodeMaterialBlock.js";
import { type NodeMaterialBuildState } from "../nodeMaterialBuildState.js";
import { type NodeMaterialConnectionPoint } from "../nodeMaterialBlockConnectionPoint.js";
/**
 * Block used to blend normals
 */
export declare class NormalBlendBlock extends NodeMaterialBlock {
    /**
     * Creates a new NormalBlendBlock
     * @param name defines the block name
     */
    constructor(name: string);
    /**
     * Gets the current class name
     * @returns the class name
     */
    getClassName(): string;
    /**
     * Gets the first input component
     */
    get normalMap0(): NodeMaterialConnectionPoint;
    /**
     * Gets the second input component
     */
    get normalMap1(): NodeMaterialConnectionPoint;
    /**
     * Gets the output component
     */
    get output(): NodeMaterialConnectionPoint;
    protected _buildBlock(state: NodeMaterialBuildState): this;
}
/**
 * Register side effects for normalBlendBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterNormalBlendBlock(): void;
