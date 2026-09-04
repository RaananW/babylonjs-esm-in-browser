/** This file must only contain pure code and pure imports */
import { NodeMaterialBlock } from "../nodeMaterialBlock.js";
import { type NodeMaterialBuildState } from "../nodeMaterialBuildState.js";
import { type NodeMaterialConnectionPoint } from "../nodeMaterialBlockConnectionPoint.js";
/**
 * block used to Generate a Simplex Perlin 3d Noise Pattern
 */
export declare class SimplexPerlin3DBlock extends NodeMaterialBlock {
    /**
     * Creates a new SimplexPerlin3DBlock
     * @param name defines the block name
     */
    constructor(name: string);
    /**
     * Gets the current class name
     * @returns the class name
     */
    getClassName(): string;
    /**
     * Gets the seed operand input component
     */
    get seed(): NodeMaterialConnectionPoint;
    /**
     * Gets the output component
     */
    get output(): NodeMaterialConnectionPoint;
    protected _buildBlock(state: NodeMaterialBuildState): this | undefined;
}
/**
 * Register side effects for simplexPerlin3DBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterSimplexPerlin3DBlock(): void;
