import { type Scene } from "../../scene.js";
import { ProceduralTexture } from "./Procedurals/proceduralTexture.pure.js";
import { type BaseTexture } from "./baseTexture.js";
import { type TextureSize } from "./textureCreationOptions.js";
/**
 * Configuration for a texture input source
 */
export interface ITextureChannelInput {
    /** The texture to use as input */
    texture: BaseTexture;
    /** Source channel to read from (0=R, 1=G, 2=B, 3=A) */
    sourceChannel: number;
}
/**
 * Configuration for a constant value input source
 */
export interface IConstantChannelInput {
    /** Constant value between 0.0 and 1.0 */
    value: number;
}
/**
 * Union type for channel input sources
 */
export type ChannelInput = ITextureChannelInput | IConstantChannelInput;
/**
 * Configuration for texture merging operation
 */
export interface ITextureMergeConfiguration {
    /** Configuration for red output channel */
    red: ChannelInput;
    /** Configuration for green output channel (optional, defaults to 0) */
    green?: ChannelInput;
    /** Configuration for blue output channel (optional, defaults to 0) */
    blue?: ChannelInput;
    /** Configuration for alpha output channel (optional, defaults to 1) */
    alpha?: ChannelInput;
    /** Output texture size. If not specified, uses the largest input texture size */
    outputSize?: TextureSize;
    /** Whether to generate mipmaps for the output texture */
    generateMipMaps?: boolean;
}
/**
 * @internal
 * Merge multiple texture channels into a single texture
 * @param name Name for the resulting texture
 * @param config Merge configuration
 * @param scene Scene to create the texture in
 * @returns The merged texture
 */
export declare function MergeTexturesAsync(name: string, config: ITextureMergeConfiguration, scene: Scene): Promise<ProceduralTexture>;
/**
 * @internal
 * Create a texture input configuration
 * @param texture The texture to read from
 * @param sourceChannel The channel to read (0=R, 1=G, 2=B, 3=A)
 * @returns Texture channel input configuration
 */
export declare function CreateTextureInput(texture: BaseTexture, sourceChannel: number): ITextureChannelInput;
/**
 * @internal
 * Create a constant value input configuration
 * @param value The constant value (0.0-1.0)
 * @returns Constant channel input configuration
 */
export declare function CreateConstantInput(value: number): IConstantChannelInput;
/**
 * @internal
 * Create a simple RGBA channel packing configuration
 * @param red Input for red channel
 * @param green Input for green channel (optional, defaults to 0)
 * @param blue Input for blue channel (optional, defaults to 0)
 * @param alpha Input for alpha channel (optional, defaults to 1)
 * @returns Texture merge configuration
 */
export declare function CreateRGBAConfiguration(red: ChannelInput, green?: ChannelInput, blue?: ChannelInput, alpha?: ChannelInput): ITextureMergeConfiguration;
