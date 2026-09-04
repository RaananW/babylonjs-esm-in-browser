/** This file must only contain pure code and pure imports */
import { NodeMaterialBlock } from "../nodeMaterialBlock.js";
import { type NodeMaterialBuildState } from "../nodeMaterialBuildState.js";
import { type NodeMaterialConnectionPoint } from "../nodeMaterialBlockConnectionPoint.js";
import { type NodeMaterial } from "../nodeMaterial.pure.js";
/**
 * Block used to pan UV coordinates over time (similar to Unreal's Panner node).
 * This block takes UV coordinates, speed values for X and Y axes, and a time input,
 * then outputs animated UV coordinates that scroll based on the speed and time.
 */
export declare class PannerBlock extends NodeMaterialBlock {
    /**
     * Creates a new PannerBlock
     * @param name defines the block name
     */
    constructor(name: string);
    /**
     * Gets the current class name
     * @returns the class name
     */
    getClassName(): string;
    /**
     * Gets the uv input component
     */
    get uv(): NodeMaterialConnectionPoint;
    /**
     * Gets the speed input component
     */
    get speed(): NodeMaterialConnectionPoint;
    /**
     * Gets the time input component
     */
    get time(): NodeMaterialConnectionPoint;
    /**
     * Gets the output component
     */
    get output(): NodeMaterialConnectionPoint;
    /**
     * Auto configure the block based on the material
     * @param material - the node material
     * @param additionalFilteringInfo - additional filtering info
     */
    autoConfigure(material: NodeMaterial, additionalFilteringInfo?: (node: NodeMaterialBlock) => boolean): void;
    protected _buildBlock(state: NodeMaterialBuildState): this;
}
/**
 * Register side effects for pannerBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterPannerBlock(): void;
