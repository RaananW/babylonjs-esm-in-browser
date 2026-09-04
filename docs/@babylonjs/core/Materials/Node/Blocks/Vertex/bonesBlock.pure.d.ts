/** This file must only contain pure code and pure imports */
import { NodeMaterialBlock } from "../../nodeMaterialBlock.js";
import { type NodeMaterialBuildState } from "../../nodeMaterialBuildState.js";
import { type AbstractMesh } from "../../../../Meshes/abstractMesh.pure.js";
import { type Mesh } from "../../../../Meshes/mesh.pure.js";
import { type Effect } from "../../../effect.pure.js";
import { type NodeMaterialConnectionPoint } from "../../nodeMaterialBlockConnectionPoint.js";
import { type NodeMaterial, type NodeMaterialDefines } from "../../nodeMaterial.pure.js";
import { type EffectFallbacks } from "../../../effectFallbacks.js";
/**
 * Block used to add support for vertex skinning (bones)
 */
export declare class BonesBlock extends NodeMaterialBlock {
    /**
     * Creates a new BonesBlock
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
     * Gets the matrix indices input component
     */
    get matricesIndices(): NodeMaterialConnectionPoint;
    /**
     * Gets the matrix weights input component
     */
    get matricesWeights(): NodeMaterialConnectionPoint;
    /**
     * Gets the extra matrix indices input component
     */
    get matricesIndicesExtra(): NodeMaterialConnectionPoint;
    /**
     * Gets the extra matrix weights input component
     */
    get matricesWeightsExtra(): NodeMaterialConnectionPoint;
    /**
     * Gets the world input component
     */
    get world(): NodeMaterialConnectionPoint;
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
    /**
     * Provides the fallbacks
     * @param fallbacks - the effect fallbacks
     * @param mesh - the mesh
     */
    provideFallbacks(fallbacks: EffectFallbacks, mesh?: AbstractMesh): void;
    /**
     * Bind data to effect
     * @param effect - the effect to bind to
     * @param nodeMaterial - the node material
     * @param mesh - the mesh
     */
    bind(effect: Effect, nodeMaterial: NodeMaterial, mesh?: Mesh): void;
    /**
     * Prepare the list of defines
     * @param defines - the list of defines
     * @param nodeMaterial - the node material
     * @param mesh - the mesh
     */
    prepareDefines(defines: NodeMaterialDefines, nodeMaterial: NodeMaterial, mesh?: AbstractMesh): void;
    protected _buildBlock(state: NodeMaterialBuildState): this;
}
/**
 * Register side effects for bonesBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterBonesBlock(): void;
