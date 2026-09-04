/** This file must only contain pure code and pure imports */
import { type NodeMaterialBuildState } from "../../nodeMaterialBuildState.js";
import { CurrentScreenBlock } from "./currentScreenBlock.pure.js";
import { type NodeMaterialBlock } from "../../nodeMaterialBlock.js";
import { type NodeMaterial } from "../../nodeMaterial.pure.js";
import { type Scene } from "../../../../scene.pure.js";
import { type Nullable } from "../../../../types.js";
import { type BaseTexture } from "../../../Textures/baseTexture.pure.js";
import { type NodeMaterialConnectionPoint } from "../../nodeMaterialBlockConnectionPoint.js";
/**
 * Base block used for creating Smart Filter shader blocks for the SFE framework.
 * This block extends the functionality of CurrentScreenBlock, as both are used
 * to represent arbitrary 2D textures to compose, and work similarly.
 */
export declare class SmartFilterTextureBlock extends CurrentScreenBlock {
    private _firstInit;
    /**
     * A boolean indicating whether this block should be the main input for the SFE pipeline.
     * If true, it can be used in SFE for auto-disabling.
     */
    isMainInput: boolean;
    /**
     * Gets the sampler name associated with this texture
     */
    get samplerName(): string;
    /**
     * Gets or sets the texture associated with this block
     */
    get texture(): Nullable<BaseTexture>;
    set texture(value: Nullable<BaseTexture>);
    /**
     * Create a new SmartFilterTextureBlock
     * @param name defines the block name
     */
    constructor(name: string);
    /**
     * Gets the source input component
     */
    get source(): NodeMaterialConnectionPoint;
    /**
     * Gets a boolean indicating that this block is linked to an ImageSourceBlock
     */
    get hasImageSource(): boolean;
    /**
     * Gets the current class name
     * @returns the class name
     */
    getClassName(): string;
    /**
     * Initialize the block and prepare the context for build
     * @param state defines the state that will be used for the build
     */
    initialize(state: NodeMaterialBuildState): void;
    protected _getMainUvName(state: NodeMaterialBuildState): string;
    protected _emitUvAndSampler(state: NodeMaterialBuildState): void;
    /**
     * Auto configure the block based on the material
     * @param material - the node material
     * @param additionalFilteringInfo - optional filtering info
     */
    autoConfigure(material: NodeMaterial, additionalFilteringInfo?: (node: NodeMaterialBlock) => boolean): void;
    /** {@inheritDoc} */
    _postBuildBlock(): void;
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
 * Register side effects for smartFilterTextureBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterSmartFilterTextureBlock(): void;
