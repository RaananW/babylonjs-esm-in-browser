/** This file must only contain pure code and pure imports */
import { NodeMaterialBlock } from "../../nodeMaterialBlock.js";
import { type NodeMaterialBuildState } from "../../nodeMaterialBuildState.js";
import { NodeMaterialBlockTargets } from "../../Enums/nodeMaterialBlockTargets.js";
import { type NodeMaterialConnectionPoint } from "../../nodeMaterialBlockConnectionPoint.js";
import { type NodeMaterialDefines } from "../../nodeMaterial.pure.js";
import { type BaseTexture } from "../../../Textures/baseTexture.pure.js";
import { type Nullable } from "../../../../types.js";
import { type Scene } from "../../../../scene.pure.js";
/**
 * Base block used as input for post process
 */
export declare class CurrentScreenBlock extends NodeMaterialBlock {
    protected _samplerName: string;
    protected _linearDefineName: string;
    protected _gammaDefineName: string;
    protected _mainUVName: string;
    protected _tempTextureRead: string;
    protected _texture: Nullable<BaseTexture>;
    /**
     * The name of the sampler to read the screen texture from.
     */
    get samplerName(): string;
    /**
     * Gets or sets the texture associated with the node
     */
    get texture(): Nullable<BaseTexture>;
    set texture(value: Nullable<BaseTexture>);
    /**
     * Gets or sets a boolean indicating if content needs to be converted to gamma space
     */
    convertToGammaSpace: boolean;
    /**
     * Gets or sets a boolean indicating if content needs to be converted to linear space
     */
    convertToLinearSpace: boolean;
    /**
     * Create a new CurrentScreenBlock
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
    /** {@inheritDoc} */
    get target(): NodeMaterialBlockTargets.Fragment | NodeMaterialBlockTargets.VertexAndFragment;
    /**
     * Prepare the list of defines
     * @param defines - the material defines
     */
    prepareDefines(defines: NodeMaterialDefines): void;
    /**
     * Checks if the block is ready
     * @returns true if ready
     */
    isReady(): boolean;
    protected _getMainUvName(_state: NodeMaterialBuildState): string;
    protected _injectVertexCode(state: NodeMaterialBuildState): void;
    protected _writeTextureRead(state: NodeMaterialBuildState, vertexMode?: boolean): void;
    protected _writeOutput(state: NodeMaterialBuildState, output: NodeMaterialConnectionPoint, swizzle: string, vertexMode?: boolean): void;
    protected _emitUvAndSampler(state: NodeMaterialBuildState): void;
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
 * Register side effects for currentScreenBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterCurrentScreenBlock(): void;
