/** This file must only contain pure code and pure imports */
import { NodeMaterialBlock } from "../nodeMaterialBlock.js";
import { type NodeMaterialBuildState } from "../nodeMaterialBuildState.js";
import { type NodeMaterialConnectionPoint } from "../nodeMaterialBlockConnectionPoint.js";
/**
 * Block used to get the reflected vector from a direction and a normal
 */
export declare class ReflectBlock extends NodeMaterialBlock {
    /**
     * Creates a new ReflectBlock
     * @param name defines the block name
     */
    constructor(name: string);
    /**
     * Gets the current class name
     * @returns the class name
     */
    getClassName(): string;
    /**
     * Gets the incident component
     */
    get incident(): NodeMaterialConnectionPoint;
    /**
     * Gets the normal component
     */
    get normal(): NodeMaterialConnectionPoint;
    /**
     * Gets the output component
     */
    get output(): NodeMaterialConnectionPoint;
    protected _buildBlock(state: NodeMaterialBuildState): this;
}
/**
 * Register side effects for reflectBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterReflectBlock(): void;
