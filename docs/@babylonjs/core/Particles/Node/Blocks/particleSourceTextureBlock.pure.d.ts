/** This file must only contain pure code and pure imports */
import { type NodeParticleConnectionPoint } from "../nodeParticleBlockConnectionPoint.js";
import { type NodeParticleBuildState } from "../nodeParticleBuildState.js";
import { type Nullable } from "../../../types.js";
import { type BaseTexture } from "../../../Materials/Textures/baseTexture.pure.js";
import { NodeParticleBlock } from "../nodeParticleBlock.js";
/**
 * Interface used to define texture data
 */
export interface INodeParticleTextureData {
    /** Width of the texture in pixels */
    width: number;
    /** Height of the texture in pixels */
    height: number;
    /** RGBA pixel data */
    data: Uint8ClampedArray;
}
/**
 * Block used to provide a texture for particles in a particle system
 */
export declare class ParticleTextureSourceBlock extends NodeParticleBlock {
    private _url;
    private _textureDataUrl;
    private _sourceTexture;
    private _cachedData;
    private _clonedTextures;
    /**
     * Gets or sets the strenght of the flow map effect
     */
    invertY: boolean;
    /**
     * Indicates if the texture data should be serialized as a base64 string.
     */
    serializedCachedData: boolean;
    /**
     * Gets or sets the URL of the texture to be used by this block.
     */
    get url(): string;
    set url(value: string);
    /**
     * Gets or sets the data URL of the texture to be used by this block.
     * This is a base64 encoded string representing the texture data.
     */
    get textureDataUrl(): string;
    set textureDataUrl(value: string);
    /**
     * Gets the texture directly set on this block.
     * This value will not be serialized.
     */
    get sourceTexture(): Nullable<BaseTexture>;
    /**
     * Directly sets the texture to be used by this block.
     * This value will not be serialized.
     */
    set sourceTexture(value: Nullable<BaseTexture>);
    /**
     * Gets the texture set on this block.
     * This value will not be serialized.
     */
    get texture(): Nullable<BaseTexture>;
    /**
     * Sets the texture to be used by this block.
     * This value will not be serialized.
     */
    set texture(value: Nullable<BaseTexture>);
    /**
     * Create a new ParticleTextureSourceBlock
     * @param name defines the block name
     */
    constructor(name: string);
    /**
     * Gets the current class name
     * @returns the class name
     */
    getClassName(): string;
    /**
     * Gets the texture output component
     */
    get textureOutput(): NodeParticleConnectionPoint;
    /**
     * Gets the texture content as a promise
     * @returns a promise that resolves to the texture content, including width, height, and pixel data
     */
    extractTextureContentAsync(): Promise<INodeParticleTextureData | null>;
    /**
     * Builds the block
     * @param state defines the current build state
     */
    _build(state: NodeParticleBuildState): void;
    /**
     * Serializes this block
     * @returns the serialization object
     */
    serialize(): any;
    /**
     * Deserializes this block from a serialization object
     * @param serializationObject the serialization object
     */
    _deserialize(serializationObject: any): void;
    /**
     * Disposes the block and its associated resources
     */
    dispose(): void;
    /**
     * Copies texture properties from source to target texture
     * @param source - The source texture to copy properties from
     * @param target - The target texture to copy properties to
     */
    private _copyTextureProperties;
}
/**
 * Register side effects for particleSourceTextureBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterParticleSourceTextureBlock(): void;
