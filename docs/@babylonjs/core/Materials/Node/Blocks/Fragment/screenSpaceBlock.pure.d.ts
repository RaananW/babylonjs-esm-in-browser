/** This file must only contain pure code and pure imports */
import { NodeMaterialBlock } from "../../nodeMaterialBlock.js";
import { type NodeMaterialBuildState } from "../../nodeMaterialBuildState.js";
import { type NodeMaterialConnectionPoint } from "../../nodeMaterialBlockConnectionPoint.js";
import { type NodeMaterial } from "../../nodeMaterial.pure.js";
/**
 * Block used to transform a vector3 or a vector4 into screen space
 */
export declare class ScreenSpaceBlock extends NodeMaterialBlock {
    /**
     * Creates a new ScreenSpaceBlock
     * @param name defines the block name
     */
    constructor(name: string);
    /**
     * Gets the current class name
     * @returns the class name
     */
    getClassName(): string;
    /**
     * Gets the vector input
     */
    get vector(): NodeMaterialConnectionPoint;
    /**
     * Gets the worldViewProjection transform input
     */
    get worldViewProjection(): NodeMaterialConnectionPoint;
    /**
     * Gets the output component
     */
    get output(): NodeMaterialConnectionPoint;
    /**
     * Gets the x output component
     */
    get x(): NodeMaterialConnectionPoint;
    /**
     * Gets the y output component
     */
    get y(): NodeMaterialConnectionPoint;
    /**
     * Auto configure the block based on the material
     * @param material - defines the hosting NodeMaterial
     * @param additionalFilteringInfo - defines additional filtering info
     */
    autoConfigure(material: NodeMaterial, additionalFilteringInfo?: (node: NodeMaterialBlock) => boolean): void;
    protected _buildBlock(state: NodeMaterialBuildState): this | undefined;
}
/**
 * Register side effects for screenSpaceBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterScreenSpaceBlock(): void;
