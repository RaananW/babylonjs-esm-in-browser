/** This file must only contain pure code and pure imports */
import { NodeMaterialBlock } from "../../nodeMaterialBlock.js";
import { type NodeMaterialBuildState } from "../../nodeMaterialBuildState.js";
import { type NodeMaterialConnectionPoint } from "../../nodeMaterialBlockConnectionPoint.js";
import { type Nullable } from "../../../../types.js";
import { Texture } from "../../../Textures/texture.pure.js";
import { type Effect } from "../../../effect.pure.js";
import { NodeMaterial } from "../../nodeMaterial.pure.js";
import { type Scene } from "../../../../scene.pure.js";
/**
 * Block used to provide an image for a TextureBlock
 */
export declare class ImageSourceBlock extends NodeMaterialBlock {
    private static _DefaultTextureByEngine;
    private _samplerName;
    protected _texture: Nullable<Texture>;
    private static _GetDefaultTexture;
    /**
     * Gets or sets the texture associated with the node
     */
    get texture(): Nullable<Texture>;
    set texture(texture: Nullable<Texture>);
    /**
     * Gets the sampler name associated with this image source
     */
    get samplerName(): string;
    /**
     * Creates a new ImageSourceBlock
     * @param name defines the block name
     */
    constructor(name: string);
    /**
     * Bind data to effect
     * @param effect - the effect to bind to
     * @param _nodeMaterial - the node material
     */
    bind(effect: Effect, _nodeMaterial: NodeMaterial): void;
    /**
     * Checks if the block is ready
     * @returns true if ready
     */
    isReady(): boolean;
    /**
     * Gets the current class name
     * @returns the class name
     */
    getClassName(): string;
    /**
     * Gets the output component
     */
    get source(): NodeMaterialConnectionPoint;
    /**
     * Gets the dimension component
     */
    get dimensions(): NodeMaterialConnectionPoint;
    protected _buildBlock(state: NodeMaterialBuildState): this;
    protected _dumpPropertiesCode(ignoreTexture?: boolean): string;
    /**
     * Serializes the block
     * @param ignoreTexture - whether to skip texture serialization
     * @returns the serialized object
     */
    serialize(ignoreTexture?: boolean): any;
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
 * Register side effects for imageSourceBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterImageSourceBlock(): void;
