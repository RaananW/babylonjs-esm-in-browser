/** This file must only contain pure code and pure imports */
import { NodeMaterialBlock } from "../../nodeMaterialBlock.js";
import { type NodeMaterialBuildState } from "../../nodeMaterialBuildState.js";
import { type NodeMaterialConnectionPoint } from "../../nodeMaterialBlockConnectionPoint.js";
import { type AbstractMesh } from "../../../../Meshes/abstractMesh.pure.js";
import { type NodeMaterial, type NodeMaterialDefines } from "../../nodeMaterial.pure.js";
/**
 * Block used for the Gaussian Splatting
 */
export declare class GaussianSplattingBlock extends NodeMaterialBlock {
    /**
     * Create a new GaussianSplattingBlock
     * @param name defines the block name
     */
    constructor(name: string);
    /**
     * Gets the current class name
     * @returns the class name
     */
    getClassName(): string;
    /**
     * Gets the position input component
     */
    get splatPosition(): NodeMaterialConnectionPoint;
    /**
     * Gets the scale input component
     */
    get splatScale(): NodeMaterialConnectionPoint;
    /**
     * Gets the View matrix input component
     */
    get world(): NodeMaterialConnectionPoint;
    /**
     * Gets the View matrix input component
     */
    get view(): NodeMaterialConnectionPoint;
    /**
     * Gets the projection matrix input component
     */
    get projection(): NodeMaterialConnectionPoint;
    /**
     * Gets the splatVertex output component
     */
    get splatVertex(): NodeMaterialConnectionPoint;
    /**
     * Gets the SH output contribution
     */
    get SH(): NodeMaterialConnectionPoint;
    /**
     * Initialize the block and prepare the context for build
     * @param state defines the state that will be used for the build
     */
    initialize(state: NodeMaterialBuildState): void;
    private _initShaderSourceAsync;
    /**
     * Update defines for shader compilation
     * @param defines defines the material defines to update
     * @param nodeMaterial defines the node material requesting the update
     * @param mesh defines the mesh to be rendered
     */
    prepareDefines(defines: NodeMaterialDefines, nodeMaterial: NodeMaterial, mesh?: AbstractMesh): void;
    protected _buildBlock(state: NodeMaterialBuildState): this | undefined;
}
/**
 * Register side effects for gaussianSplattingBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterGaussianSplattingBlock(): void;
