/** This file must only contain pure code and pure imports */
import { NodeMaterialBlock } from "../../nodeMaterialBlock.js";
import { type NodeMaterialBuildState } from "../../nodeMaterialBuildState.js";
import { type NodeMaterialConnectionPoint } from "../../nodeMaterialBlockConnectionPoint.js";
/**
 * Block used for the Gaussian Splatting Fragment part
 */
export declare class GaussianBlock extends NodeMaterialBlock {
    /**
     * Create a new GaussianBlock
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
    get splatColor(): NodeMaterialConnectionPoint;
    /**
     * Gets the rgba output component
     */
    get rgba(): NodeMaterialConnectionPoint;
    /**
     * Gets the rgb output component
     */
    get rgb(): NodeMaterialConnectionPoint;
    /**
     * Gets the alpha output component
     */
    get alpha(): NodeMaterialConnectionPoint;
    /**
     * Initialize the block and prepare the context for build
     * @param state defines the state that will be used for the build
     */
    initialize(state: NodeMaterialBuildState): void;
    private _initShaderSourceAsync;
    protected _buildBlock(state: NodeMaterialBuildState): this | undefined;
}
/**
 * Register side effects for gaussianBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterGaussianBlock(): void;
