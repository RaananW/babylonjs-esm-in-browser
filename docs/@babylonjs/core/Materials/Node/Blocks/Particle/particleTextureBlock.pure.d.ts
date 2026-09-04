/** This file must only contain pure code and pure imports */
import { NodeMaterialBlock } from "../../nodeMaterialBlock.js";
import { type NodeMaterialBuildState } from "../../nodeMaterialBuildState.js";
import { type NodeMaterialConnectionPoint } from "../../nodeMaterialBlockConnectionPoint.js";
import { type NodeMaterialDefines, type NodeMaterial } from "../../nodeMaterial.pure.js";
import { type BaseTexture } from "../../../Textures/baseTexture.pure.js";
import { type Nullable } from "../../../../types.js";
import { type Scene } from "../../../../scene.pure.js";
/**
 * Base block used for the particle texture
 */
export declare class ParticleTextureBlock extends NodeMaterialBlock {
    private _samplerName;
    private _linearDefineName;
    private _gammaDefineName;
    private _tempTextureRead;
    /**
     * Gets or sets the texture associated with the node
     */
    texture: Nullable<BaseTexture>;
    /**
     * Gets or sets a boolean indicating if content needs to be converted to gamma space
     */
    convertToGammaSpace: boolean;
    /**
     * Gets or sets a boolean indicating if content needs to be converted to linear space
     */
    convertToLinearSpace: boolean;
    /**
     * Create a new ParticleTextureBlock
     * @param name defines the block name
     */
    constructor(name: string);
    /**
     * Gets the current class name
     * @returns the class name
     */
    getClassName(): string;
    /**
     * Gets the uv input component
     */
    get uv(): NodeMaterialConnectionPoint;
    /**
     * Gets the rgba output component
     */
    get rgba(): NodeMaterialConnectionPoint;
    /**
     * Gets the rgb output component
     */
    get rgb(): NodeMaterialConnectionPoint;
    /**
     * Gets the r output component
     */
    get r(): NodeMaterialConnectionPoint;
    /**
     * Gets the g output component
     */
    get g(): NodeMaterialConnectionPoint;
    /**
     * Gets the b output component
     */
    get b(): NodeMaterialConnectionPoint;
    /**
     * Gets the a output component
     */
    get a(): NodeMaterialConnectionPoint;
    /**
     * Initialize the block and prepare the context for build
     * @param state defines the state that will be used for the build
     */
    initialize(state: NodeMaterialBuildState): void;
    private _initShaderSourceAsync;
    /**
     * Auto configure the block based on the material
     * @param material - defines the node material
     * @param additionalFilteringInfo - defines additional filtering info
     */
    autoConfigure(material: NodeMaterial, additionalFilteringInfo?: (node: NodeMaterialBlock) => boolean): void;
    /**
     * Prepare the list of defines
     * @param defines - defines the list of defines
     */
    prepareDefines(defines: NodeMaterialDefines): void;
    /**
     * Checks if the block is ready
     * @returns true if ready
     */
    isReady(): boolean;
    private _writeOutput;
    protected _buildBlock(state: NodeMaterialBuildState): this | undefined;
    /**
     * Serializes the block
     * @returns the serialized object
     */
    serialize(): any;
    /**
     * Deserializes the block
     * @param serializationObject - defines the serialized object
     * @param scene - defines the scene
     * @param rootUrl - defines the root URL
     */
    _deserialize(serializationObject: any, scene: Scene, rootUrl: string): void;
}
/**
 * Register side effects for particleTextureBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterParticleTextureBlock(): void;
