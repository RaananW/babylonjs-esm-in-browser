/** This file must only contain pure code and pure imports */
import { type NodeMaterial, type NodeMaterialDefines } from "../../nodeMaterial.pure.js";
import { NodeMaterialBlock } from "../../nodeMaterialBlock.js";
import { type NodeMaterialConnectionPoint } from "../../nodeMaterialBlockConnectionPoint.js";
import { type Mesh } from "../../../../Meshes/mesh.pure.js";
import { type Effect } from "../../../effect.pure.js";
import { type NodeMaterialBuildState } from "../../nodeMaterialBuildState.js";
/**
 * Block used to implement the anisotropy module of the PBR material
 */
export declare class AnisotropyBlock extends NodeMaterialBlock {
    private _tangentCorrectionFactorName;
    /**
     * The two properties below are set by the main PBR block prior to calling methods of this class.
     * This is to avoid having to add them as inputs here whereas they are already inputs of the main block, so already known.
     * It's less burden on the user side in the editor part.
     */
    /** @internal */
    worldPositionConnectionPoint: NodeMaterialConnectionPoint;
    /** @internal */
    worldNormalConnectionPoint: NodeMaterialConnectionPoint;
    /**
     * Create a new AnisotropyBlock
     * @param name defines the block name
     */
    constructor(name: string);
    /**
     * Initialize the block and prepare the context for build
     * @param state defines the state that will be used for the build
     */
    initialize(state: NodeMaterialBuildState): void;
    private _initShaderSourceAsync;
    /**
     * Gets the current class name
     * @returns the class name
     */
    getClassName(): string;
    /**
     * Gets the intensity input component
     */
    get intensity(): NodeMaterialConnectionPoint;
    /**
     * Gets the direction input component
     */
    get direction(): NodeMaterialConnectionPoint;
    /**
     * Gets the uv input component
     */
    get uv(): NodeMaterialConnectionPoint;
    /**
     * Gets the worldTangent input component
     */
    get worldTangent(): NodeMaterialConnectionPoint;
    /**
     * Gets the TBN input component
     */
    get TBN(): NodeMaterialConnectionPoint;
    /**
     * Gets the roughness input component
     */
    get roughness(): NodeMaterialConnectionPoint;
    /**
     * Gets the anisotropy object output component
     */
    get anisotropy(): NodeMaterialConnectionPoint;
    private _generateTBNSpace;
    /**
     * Gets the main code of the block (fragment side)
     * @param state current state of the node material building
     * @param generateTBNSpace if true, the code needed to create the TBN coordinate space is generated
     * @returns the shader code
     */
    getCode(state: NodeMaterialBuildState, generateTBNSpace?: boolean): string;
    /**
     * Prepare the list of defines
     * @param defines - the list of defines to update
     */
    prepareDefines(defines: NodeMaterialDefines): void;
    /**
     * Bind data to effect
     * @param effect - the effect to bind data to
     * @param nodeMaterial - the node material
     * @param mesh - the mesh to bind data for
     */
    bind(effect: Effect, nodeMaterial: NodeMaterial, mesh?: Mesh): void;
    protected _buildBlock(state: NodeMaterialBuildState): this;
}
/**
 * Register side effects for anisotropyBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterAnisotropyBlock(): void;
