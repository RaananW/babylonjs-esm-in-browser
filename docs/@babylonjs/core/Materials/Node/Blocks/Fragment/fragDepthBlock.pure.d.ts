/** This file must only contain pure code and pure imports */
import { NodeMaterialBlock } from "../../nodeMaterialBlock.js";
import { type NodeMaterialBuildState } from "../../nodeMaterialBuildState.js";
import { type NodeMaterialConnectionPoint } from "../../nodeMaterialBlockConnectionPoint.js";
/**
 * Block used to write the fragment depth
 */
export declare class FragDepthBlock extends NodeMaterialBlock {
    /**
     * Create a new FragDepthBlock
     * @param name defines the block name
     */
    constructor(name: string);
    /**
     * Gets the current class name
     * @returns the class name
     */
    getClassName(): string;
    /**
     * Gets the depth input component
     */
    get depth(): NodeMaterialConnectionPoint;
    /**
     * Gets the worldPos input component
     */
    get worldPos(): NodeMaterialConnectionPoint;
    /**
     * Gets the viewProjection input component
     */
    get viewProjection(): NodeMaterialConnectionPoint;
    protected _buildBlock(state: NodeMaterialBuildState): this;
}
/**
 * Register side effects for fragDepthBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterFragDepthBlock(): void;
