/** This file must only contain pure code and pure imports */
import { NodeMaterialBlock } from "../../nodeMaterialBlock.js";
import { type NodeMaterialBuildState } from "../../nodeMaterialBuildState.js";
import { type NodeMaterialConnectionPoint } from "../../nodeMaterialBlockConnectionPoint.js";
import { type AbstractMesh } from "../../../../Meshes/abstractMesh.pure.js";
import { type NodeMaterial, type NodeMaterialDefines } from "../../nodeMaterial.pure.js";
import { type Effect } from "../../../effect.pure.js";
import { type Mesh } from "../../../../Meshes/mesh.pure.js";
import { type Light } from "../../../../Lights/light.js";
import { type Nullable } from "../../../../types.js";
import { type Scene } from "../../../../scene.pure.js";
/**
 * Block used to add light in the fragment shader
 */
export declare class LightBlock extends NodeMaterialBlock {
    private _lightId;
    /**
     * Gets or sets the light associated with this block
     */
    light: Nullable<Light>;
    /** Indicates that no code should be generated in the vertex shader. Can be useful in some specific circumstances (like when doing ray marching for eg) */
    generateOnlyFragmentCode: boolean;
    private static _OnGenerateOnlyFragmentCodeChanged;
    private _setTarget;
    /**
     * Create a new LightBlock
     * @param name defines the block name
     */
    constructor(name: string);
    /**
     * Gets the current class name
     * @returns the class name
     */
    getClassName(): string;
    /**
     * Gets the world position input component
     */
    get worldPosition(): NodeMaterialConnectionPoint;
    /**
     * Gets the world normal input component
     */
    get worldNormal(): NodeMaterialConnectionPoint;
    /**
     * Gets the camera (or eye) position component
     */
    get cameraPosition(): NodeMaterialConnectionPoint;
    /**
     * Gets the glossiness component
     */
    get glossiness(): NodeMaterialConnectionPoint;
    /**
     * Gets the glossiness power component
     */
    get glossPower(): NodeMaterialConnectionPoint;
    /**
     * Gets the diffuse color component
     */
    get diffuseColor(): NodeMaterialConnectionPoint;
    /**
     * Gets the specular color component
     */
    get specularColor(): NodeMaterialConnectionPoint;
    /**
     * Gets the view matrix component
     */
    get view(): NodeMaterialConnectionPoint;
    /**
     * Gets the diffuse output component
     */
    get diffuseOutput(): NodeMaterialConnectionPoint;
    /**
     * Gets the specular output component
     */
    get specularOutput(): NodeMaterialConnectionPoint;
    /**
     * Gets the shadow output component
     */
    get shadow(): NodeMaterialConnectionPoint;
    /**
     * Initialize the block
     * @param state - the build state
     */
    initialize(state: NodeMaterialBuildState): void;
    private _initShaderSourceAsync;
    /**
     * Auto configure the block based on the material
     * @param material - the node material
     * @param additionalFilteringInfo - optional filtering info
     */
    autoConfigure(material: NodeMaterial, additionalFilteringInfo?: (node: NodeMaterialBlock) => boolean): void;
    /**
     * Prepare the list of defines
     * @param defines - the material defines
     * @param nodeMaterial - the node material
     * @param mesh - the mesh to prepare for
     */
    prepareDefines(defines: NodeMaterialDefines, nodeMaterial: NodeMaterial, mesh?: AbstractMesh): void;
    /**
     * Checks if the block is ready
     * @param mesh - the mesh to check
     * @param nodeMaterial - the node material
     * @param defines - the list of defines
     * @returns true if ready
     */
    isReady(mesh: AbstractMesh, nodeMaterial: NodeMaterial, defines: NodeMaterialDefines): boolean;
    /**
     * Update the uniforms and samples
     * @param state - the build state
     * @param nodeMaterial - the node material
     * @param defines - the material defines
     * @param uniformBuffers - the uniform buffers
     */
    updateUniformsAndSamples(state: NodeMaterialBuildState, nodeMaterial: NodeMaterial, defines: NodeMaterialDefines, uniformBuffers: string[]): void;
    /**
     * Bind data to effect
     * @param effect - the effect to bind to
     * @param nodeMaterial - the node material
     * @param mesh - the mesh to bind for
     */
    bind(effect: Effect, nodeMaterial: NodeMaterial, mesh?: Mesh): void;
    private _injectVertexCode;
    private _injectUBODeclaration;
    protected _buildBlock(state: NodeMaterialBuildState): this | undefined;
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
 * Register side effects for lightBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterLightBlock(): void;
