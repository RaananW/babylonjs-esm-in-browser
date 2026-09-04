/** This file must only contain pure code and pure imports */
import { NodeMaterialBlock } from "../nodeMaterialBlock.js";
import { type NodeMaterialBuildState } from "../nodeMaterialBuildState.js";
import { type NodeMaterialConnectionPoint } from "../nodeMaterialBlockConnectionPoint.js";
/**
 * Block used to rotate a 2d vector by a given angle
 */
export declare class Rotate2dBlock extends NodeMaterialBlock {
    /**
     * Creates a new Rotate2dBlock
     * @param name defines the block name
     */
    constructor(name: string);
    /**
     * Gets the current class name
     * @returns the class name
     */
    getClassName(): string;
    /**
     * Gets the input vector
     */
    get input(): NodeMaterialConnectionPoint;
    /**
     * Gets the input angle
     */
    get angle(): NodeMaterialConnectionPoint;
    /**
     * Gets the output component
     */
    get output(): NodeMaterialConnectionPoint;
    /** Auto configure the block based on the material */
    autoConfigure(): void;
    protected _buildBlock(state: NodeMaterialBuildState): this;
}
/**
 * Register side effects for rotate2dBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterRotate2dBlock(): void;
