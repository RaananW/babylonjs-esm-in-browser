/** This file must only contain pure code and pure imports */
import { NodeMaterialBlock } from "../nodeMaterialBlock.js";
import { type NodeMaterialBuildState } from "../nodeMaterialBuildState.js";
import { type NodeMaterialConnectionPoint } from "../nodeMaterialBlockConnectionPoint.js";
/**
 * block used to Generate a Voronoi Noise Pattern
 */
export declare class VoronoiNoiseBlock extends NodeMaterialBlock {
    /**
     * Creates a new VoronoiNoiseBlock
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
     * Gets the offset input component
     */
    get offset(): NodeMaterialConnectionPoint;
    /**
     * Gets the density input component
     */
    get density(): NodeMaterialConnectionPoint;
    /**
     * Gets the output component
     */
    get output(): NodeMaterialConnectionPoint;
    /**
     * Gets the output component
     */
    get cells(): NodeMaterialConnectionPoint;
    protected _buildBlock(state: NodeMaterialBuildState): this | undefined;
}
/**
 * Register side effects for voronoiNoiseBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterVoronoiNoiseBlock(): void;
