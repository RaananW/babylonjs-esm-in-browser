/** This file must only contain pure code and pure imports */
import { type Nullable } from "../../types.js";
import { type Scene } from "../../scene.pure.js";
import { EnvCubeTexture } from "./envCubeTexture.pure.js";
import { type AbstractEngine } from "../../Engines/abstractEngine.pure.js";
import { type CubeMapInfo } from "../../Misc/HighDynamicRange/panoramaToCubemap.js";
/**
 * This represents a texture coming from an HDR input.
 *
 * The supported format is currently panorama picture stored in RGBE format.
 * Example of such files can be found on Poly Haven: https://polyhaven.com/hdris
 */
export declare class HDRCubeTexture extends EnvCubeTexture {
    /**
     * Instantiates an HDRTexture from the following parameters.
     *
     * @param url The location of the HDR raw data (Panorama stored in RGBE format)
     * @param sceneOrEngine The scene or engine the texture will be used in
     * @param size The cubemap desired size (the more it increases the longer the generation will be)
     * @param noMipmap Forces to not generate the mipmap if true
     * @param generateHarmonics Specifies whether you want to extract the polynomial harmonics during the generation process
     * @param gammaSpace Specifies if the texture will be use in gamma or linear space (the PBR material requires those texture in linear space, but the standard material would require them in Gamma space)
     * @param prefilterOnLoad Prefilters HDR texture to allow use of this texture as a PBR reflection texture.
     * @param onLoad on success callback function
     * @param onError on error callback function
     * @param supersample Defines if texture must be supersampled (default: false)
     * @param prefilterIrradianceOnLoad Prefilters HDR texture to allow use of this texture for irradiance lighting.
     * @param prefilterUsingCdf Defines if the prefiltering should be done using a CDF instead of the default approach.
     * @param sphericalPolynomialTargetSize Target face size for spherical polynomial computation. 0 = full resolution (default).
     */
    constructor(url: string, sceneOrEngine: Scene | AbstractEngine, size: number, noMipmap?: boolean, generateHarmonics?: boolean, gammaSpace?: boolean, prefilterOnLoad?: boolean, onLoad?: Nullable<() => void>, onError?: Nullable<(message?: string, exception?: any) => void>, supersample?: boolean, prefilterIrradianceOnLoad?: boolean, prefilterUsingCdf?: boolean, sphericalPolynomialTargetSize?: number);
    /**
     * Get the current class name of the texture useful for serialization or dynamic coding.
     * @returns "HDRCubeTexture"
     */
    getClassName(): string;
    /**
     * Convert the raw data from the server into cubemap faces
     * @param buffer The buffer containing the texture data
     * @param size The cubemap face size
     * @param supersample Defines if texture must be supersampled
     * @returns The cube map data
     */
    protected _getCubeMapTextureDataAsync(buffer: ArrayBuffer, size: number, supersample: boolean): Promise<CubeMapInfo>;
    protected _instantiateClone(): this;
    /**
     * Serialize the texture to a JSON representation.
     * @returns The JSON representation of the texture
     */
    serialize(): any;
    /**
     * Parses a JSON representation of an HDR Texture in order to create the texture
     * @param parsedTexture Define the JSON representation
     * @param scene Define the scene the texture should be created in
     * @param rootUrl Define the root url in case we need to load relative dependencies
     * @returns the newly created texture after parsing
     */
    static Parse(parsedTexture: any, scene: Scene, rootUrl: string): Nullable<HDRCubeTexture>;
}
/**
 * Register side effects for hdrCubeTexture.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterHdrCubeTexture(): void;
