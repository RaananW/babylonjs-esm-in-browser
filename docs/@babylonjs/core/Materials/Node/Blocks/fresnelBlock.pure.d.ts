/** This file must only contain pure code and pure imports */
import { NodeMaterialBlock } from "../nodeMaterialBlock.js";
import { type NodeMaterialBuildState } from "../nodeMaterialBuildState.js";
import { type NodeMaterialConnectionPoint } from "../nodeMaterialBlockConnectionPoint.js";
import { type NodeMaterial } from "../nodeMaterial.pure.js";
/**
 * Block used to compute fresnel value
 */
export declare class FresnelBlock extends NodeMaterialBlock {
    /**
     * Create a new FresnelBlock
     * @param name defines the block name
     */
    constructor(name: string);
    /**
     * Gets the current class name
     * @returns the class name
     */
    getClassName(): string;
    /**
     * Gets the world normal input component
     */
    get worldNormal(): NodeMaterialConnectionPoint;
    /**
     * Gets the view direction input component
     */
    get viewDirection(): NodeMaterialConnectionPoint;
    /**
     * Gets the bias input component
     */
    get bias(): NodeMaterialConnectionPoint;
    /**
     * Gets the camera (or eye) position component
     */
    get power(): NodeMaterialConnectionPoint;
    /**
     * Gets the fresnel output component
     */
    get fresnel(): NodeMaterialConnectionPoint;
    /**
     * Initialize the block and prepare the context for build
     * @param state defines the state that will be used for the build
     */
    initialize(state: NodeMaterialBuildState): void;
    private _initShaderSourceAsync;
    /**
     * Auto configure the block based on the material
     * @param material - the node material
     */
    autoConfigure(material: NodeMaterial): void;
    protected _buildBlock(state: NodeMaterialBuildState): this;
}
/**
 * Register side effects for fresnelBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterFresnelBlock(): void;
