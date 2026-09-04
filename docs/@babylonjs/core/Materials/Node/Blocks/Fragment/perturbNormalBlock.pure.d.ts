/** This file must only contain pure code and pure imports */
import { NodeMaterialBlock } from "../../nodeMaterialBlock.js";
import { type NodeMaterialBuildState } from "../../nodeMaterialBuildState.js";
import { type NodeMaterialConnectionPoint } from "../../nodeMaterialBlockConnectionPoint.js";
import { type NodeMaterial, type NodeMaterialDefines } from "../../nodeMaterial.pure.js";
import { type Mesh } from "../../../../Meshes/mesh.pure.js";
import { type Effect } from "../../../effect.pure.js";
import { type Scene } from "../../../../scene.pure.js";
/**
 * Block used to perturb normals based on a normal map
 */
export declare class PerturbNormalBlock extends NodeMaterialBlock {
    private _tangentSpaceParameterName;
    private _tangentCorrectionFactorName;
    private _worldMatrixName;
    /** Gets or sets a boolean indicating that normal should be inverted on X axis */
    invertX: boolean;
    /** Gets or sets a boolean indicating that normal should be inverted on Y axis */
    invertY: boolean;
    /** Gets or sets a boolean indicating that parallax occlusion should be enabled */
    useParallaxOcclusion: boolean;
    /** Gets or sets a boolean indicating that sampling mode is in Object space */
    useObjectSpaceNormalMap: boolean;
    /**
     * Create a new PerturbNormalBlock
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
     * Gets the world tangent input component
     */
    get worldTangent(): NodeMaterialConnectionPoint;
    /**
     * Gets the uv input component
     */
    get uv(): NodeMaterialConnectionPoint;
    /**
     * Gets the normal map color input component
     */
    get normalMapColor(): NodeMaterialConnectionPoint;
    /**
     * Gets the strength input component
     */
    get strength(): NodeMaterialConnectionPoint;
    /**
     * Gets the view direction input component
     */
    get viewDirection(): NodeMaterialConnectionPoint;
    /**
     * Gets the parallax scale input component
     */
    get parallaxScale(): NodeMaterialConnectionPoint;
    /**
     * Gets the parallax height input component
     */
    get parallaxHeight(): NodeMaterialConnectionPoint;
    /**
     * Gets the TBN input component
     */
    get TBN(): NodeMaterialConnectionPoint;
    /**
     * Gets the World input component
     */
    get world(): NodeMaterialConnectionPoint;
    /**
     * Gets the output component
     */
    get output(): NodeMaterialConnectionPoint;
    /**
     * Gets the uv offset output component
     */
    get uvOffset(): NodeMaterialConnectionPoint;
    /**
     * Initialize the block
     * @param state - defines the state that will be used for the build
     */
    initialize(state: NodeMaterialBuildState): void;
    private _initShaderSourceAsync;
    /**
     * Prepare the list of defines
     * @param defines - defines the list of defines to update
     * @param nodeMaterial - defines the node material requesting the update
     */
    prepareDefines(defines: NodeMaterialDefines, nodeMaterial: NodeMaterial): void;
    /**
     * Bind data to effect
     * @param effect - defines the effect to bind data to
     * @param nodeMaterial - defines the node material
     * @param mesh - defines the mesh to bind data for
     */
    bind(effect: Effect, nodeMaterial: NodeMaterial, mesh?: Mesh): void;
    /**
     * Auto configure the block based on the material
     * @param material - defines the hosting NodeMaterial
     * @param additionalFilteringInfo - defines additional filtering info
     */
    autoConfigure(material: NodeMaterial, additionalFilteringInfo?: (node: NodeMaterialBlock) => boolean): void;
    protected _buildBlock(state: NodeMaterialBuildState): this;
    protected _dumpPropertiesCode(): string;
    /**
     * Serializes the block
     * @returns the serialized object
     */
    serialize(): any;
    /**
     * Deserializes the block
     * @param serializationObject - defines the serialized object
     * @param scene - defines the hosting scene
     * @param rootUrl - defines the root URL to use for loading
     */
    _deserialize(serializationObject: any, scene: Scene, rootUrl: string): void;
}
/**
 * Register side effects for perturbNormalBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterPerturbNormalBlock(): void;
