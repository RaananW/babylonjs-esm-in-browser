/** This file must only contain pure code and pure imports */
import { NodeMaterialBlock } from "../../nodeMaterialBlock.js";
import { type NodeMaterialBuildState } from "../../nodeMaterialBuildState.js";
import { type NodeMaterialConnectionPoint } from "../../nodeMaterialBlockConnectionPoint.js";
import { type AbstractMesh } from "../../../../Meshes/abstractMesh.pure.js";
import { type NodeMaterial, type NodeMaterialDefines } from "../../nodeMaterial.pure.js";
import { type Effect } from "../../../effect.pure.js";
import { type Mesh } from "../../../../Meshes/mesh.pure.js";
import { type Scene } from "../../../../scene.pure.js";
/**
 * Block used to add image processing support to fragment shader
 */
export declare class ImageProcessingBlock extends NodeMaterialBlock {
    /**
     * Create a new ImageProcessingBlock
     * @param name defines the block name
     */
    constructor(name: string);
    /**
     * Defines if the input should be converted to linear space (default: true)
     */
    convertInputToLinearSpace: boolean;
    /**
     * Gets the current class name
     * @returns the class name
     */
    getClassName(): string;
    /**
     * Gets the color input component
     */
    get color(): NodeMaterialConnectionPoint;
    /**
     * Gets the output component
     */
    get output(): NodeMaterialConnectionPoint;
    /**
     * Gets the rgb component
     */
    get rgb(): NodeMaterialConnectionPoint;
    /**
     * Initialize the block and prepare the context for build
     * @param state defines the state that will be used for the build
     */
    initialize(state: NodeMaterialBuildState): void;
    private _initShaderSourceAsync;
    /**
     * Checks if the block is ready
     * @param mesh - the mesh to check
     * @param nodeMaterial - the node material
     * @param defines - the material defines
     * @returns true if ready
     */
    isReady(mesh: AbstractMesh, nodeMaterial: NodeMaterial, defines: NodeMaterialDefines): boolean;
    /**
     * Prepare the list of defines
     * @param defines - the material defines
     * @param nodeMaterial - the node material
     */
    prepareDefines(defines: NodeMaterialDefines, nodeMaterial: NodeMaterial): void;
    /**
     * Bind data to effect
     * @param effect - the effect to bind to
     * @param nodeMaterial - the node material
     * @param mesh - the mesh to bind for
     */
    bind(effect: Effect, nodeMaterial: NodeMaterial, mesh?: Mesh): void;
    protected _buildBlock(state: NodeMaterialBuildState): this;
    protected _dumpPropertiesCode(): string;
    /**
     * Serializes the block
     * @returns the serialized object
     */
    serialize(): any;
    /**
     * Deserializes the block
     * @param serializationObject - the serialization object
     * @param scene - the scene
     * @param rootUrl - the root url
     */
    _deserialize(serializationObject: any, scene: Scene, rootUrl: string): void;
}
/**
 * Register side effects for imageProcessingBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterImageProcessingBlock(): void;
