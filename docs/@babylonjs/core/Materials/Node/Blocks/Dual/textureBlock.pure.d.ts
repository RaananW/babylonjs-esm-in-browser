/** This file must only contain pure code and pure imports */
import { NodeMaterialBlock } from "../../nodeMaterialBlock.js";
import { type NodeMaterialBuildState } from "../../nodeMaterialBuildState.js";
import { NodeMaterialBlockTargets } from "../../Enums/nodeMaterialBlockTargets.js";
import { type NodeMaterialConnectionPoint } from "../../nodeMaterialBlockConnectionPoint.js";
import { NodeMaterial } from "../../nodeMaterial.pure.js";
import { type NodeMaterialDefines } from "../../nodeMaterial.js";
import { type Effect } from "../../../effect.pure.js";
import { type Nullable } from "../../../../types.js";
import { Texture } from "../../../Textures/texture.pure.js";
import { type Scene } from "../../../../scene.pure.js";
/**
 * Block used to read a texture from a sampler
 */
export declare class TextureBlock extends NodeMaterialBlock {
    private static _DefaultTextureByEngine;
    private _defineName;
    private _linearDefineName;
    private _gammaDefineName;
    private _tempTextureRead;
    private _samplerName;
    private _transformedUVName;
    private _textureTransformName;
    private _textureInfoName;
    private _mainUVName;
    private _mainUVDefineName;
    private _fragmentOnly;
    private _imageSource;
    protected _texture: Nullable<Texture>;
    /**
     * Gets or sets a boolean indicating if the block is used in fragment shader only
     * If false the system will allow optimizations to use it in vertex shader when possible for the uv computation
     */
    get fragmentOnly(): boolean;
    set fragmentOnly(value: boolean);
    /**
     * Gets or sets the texture associated with the node
     */
    get texture(): Nullable<Texture>;
    set texture(texture: Nullable<Texture>);
    private static _IsPrePassTextureBlock;
    private static _GetDefaultTexture;
    private get _isSourcePrePass();
    /**
     * Gets the sampler name associated with this texture
     */
    get samplerName(): string;
    /**
     * Gets a boolean indicating that this block is linked to an ImageSourceBlock
     */
    get hasImageSource(): boolean;
    private _convertToGammaSpace;
    /**
     * Gets or sets a boolean indicating if content needs to be converted to gamma space
     */
    set convertToGammaSpace(value: boolean);
    get convertToGammaSpace(): boolean;
    private _convertToLinearSpace;
    /**
     * Gets or sets a boolean indicating if content needs to be converted to linear space
     */
    set convertToLinearSpace(value: boolean);
    get convertToLinearSpace(): boolean;
    /**
     * Gets or sets a boolean indicating if multiplication of texture with level should be disabled
     */
    disableLevelMultiplication: boolean;
    /**
     * Create a new TextureBlock
     * @param name defines the block name
     * @param fragmentOnly
     */
    constructor(name: string, fragmentOnly?: boolean);
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
     * Gets the source input component
     */
    get source(): NodeMaterialConnectionPoint;
    /**
     * Gets the layer input component
     */
    get layer(): NodeMaterialConnectionPoint;
    /**
     * Gets the LOD input component
     */
    get lod(): NodeMaterialConnectionPoint;
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
     * Gets the level output component
     */
    get level(): NodeMaterialConnectionPoint;
    private _isTiedToFragment;
    private _getEffectiveTarget;
    /** {@inheritDoc} */
    get target(): NodeMaterialBlockTargets;
    /** {@inheritDoc} */
    set target(value: NodeMaterialBlockTargets);
    /**
     * Initialize the block and prepare the context for build
     * @param state defines the state that will be used for the build
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
     * Initialize the list of defines
     * @param defines - the material defines
     */
    initializeDefines(defines: NodeMaterialDefines): void;
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
    /**
     * Bind data to effect
     * @param effect - the effect to bind to
     */
    bind(effect: Effect): void;
    private get _isMixed();
    private _injectVertexCode;
    private _getUVW;
    private _samplerFunc;
    private get _samplerLodSuffix();
    private _generateTextureSample;
    private _generateTextureLookup;
    private _writeTextureRead;
    private _generateConversionCode;
    private _writeOutput;
    protected _buildBlock(state: NodeMaterialBuildState): this | undefined;
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
     * @param urlRewriter - optional url rewriter
     */
    _deserialize(serializationObject: any, scene: Scene, rootUrl: string, urlRewriter?: (url: string) => string): void;
}
/**
 * Register side effects for textureBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterTextureBlock(): void;
