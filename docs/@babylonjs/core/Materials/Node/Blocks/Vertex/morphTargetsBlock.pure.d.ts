/** This file must only contain pure code and pure imports */
import { NodeMaterialBlock } from "../../nodeMaterialBlock.js";
import { type NodeMaterialBuildState } from "../../nodeMaterialBuildState.js";
import { type NodeMaterialConnectionPoint } from "../../nodeMaterialBlockConnectionPoint.js";
import { type AbstractMesh } from "../../../../Meshes/abstractMesh.pure.js";
import { type NodeMaterial, type NodeMaterialDefines } from "../../nodeMaterial.pure.js";
import { type Effect } from "../../../effect.pure.js";
import { type Mesh } from "../../../../Meshes/mesh.pure.js";
/**
 * Block used to add morph targets support to vertex shader
 */
export declare class MorphTargetsBlock extends NodeMaterialBlock {
    private _repeatableContentAnchor;
    /**
     * Create a new MorphTargetsBlock
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
    get position(): NodeMaterialConnectionPoint;
    /**
     * Gets the normal input component
     */
    get normal(): NodeMaterialConnectionPoint;
    /**
     * Gets the tangent input component
     */
    get tangent(): NodeMaterialConnectionPoint;
    /**
     * Gets the uv input component
     */
    get uv(): NodeMaterialConnectionPoint;
    /**
     * Gets the uv2 input component
     */
    get uv2(): NodeMaterialConnectionPoint;
    /**
     * Gets the color input component
     */
    get color(): NodeMaterialConnectionPoint;
    /**
     * Gets the position output component
     */
    get positionOutput(): NodeMaterialConnectionPoint;
    /**
     * Gets the normal output component
     */
    get normalOutput(): NodeMaterialConnectionPoint;
    /**
     * Gets the tangent output component
     */
    get tangentOutput(): NodeMaterialConnectionPoint;
    /**
     * Gets the uv output component
     */
    get uvOutput(): NodeMaterialConnectionPoint;
    /**
     * Gets the uv2 output component
     */
    get uv2Output(): NodeMaterialConnectionPoint;
    /**
     * Gets the color output component
     */
    get colorOutput(): NodeMaterialConnectionPoint;
    /**
     * Initialize the block
     * @param state - the build state
     */
    initialize(state: NodeMaterialBuildState): void;
    private _initShaderSourceAsync;
    /**
     * Auto configure the block based on the material
     * @param material - the node material
     * @param additionalFilteringInfo - additional filtering info
     */
    autoConfigure(material: NodeMaterial, additionalFilteringInfo?: (node: NodeMaterialBlock) => boolean): void;
    /**
     * Prepare the list of defines
     * @param defines - the list of defines
     * @param nodeMaterial - the node material
     * @param mesh - the mesh
     */
    prepareDefines(defines: NodeMaterialDefines, nodeMaterial: NodeMaterial, mesh?: AbstractMesh): void;
    /**
     * Bind data to effect
     * @param effect - the effect to bind to
     * @param nodeMaterial - the node material
     * @param mesh - the mesh
     */
    bind(effect: Effect, nodeMaterial: NodeMaterial, mesh?: Mesh): void;
    /**
     * Replace repeatable content
     * @param vertexShaderState - the vertex shader build state
     * @param defines - the list of defines
     * @param mesh - the mesh
     */
    replaceRepeatableContent(vertexShaderState: NodeMaterialBuildState, defines: NodeMaterialDefines, mesh?: AbstractMesh): void;
    protected _buildBlock(state: NodeMaterialBuildState): this;
}
/**
 * Register side effects for morphTargetsBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterMorphTargetsBlock(): void;
