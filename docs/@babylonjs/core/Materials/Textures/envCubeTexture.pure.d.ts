/** This file must only contain pure code and pure imports */
import { type Nullable } from "../../types.js";
import { type Scene } from "../../scene.pure.js";
import { Matrix, Vector3 } from "../../Maths/math.vector.pure.js";
import { BaseTexture } from "../../Materials/Textures/baseTexture.pure.js";
import { Observable } from "../../Misc/observable.pure.js";
import { type AbstractEngine } from "../../Engines/abstractEngine.pure.js";
import { type CubeMapInfo } from "../../Misc/HighDynamicRange/panoramaToCubemap.js";
/**
 * This represents an environment base texture which could for instance be from HDR or EXR files.
 */
export declare abstract class EnvCubeTexture extends BaseTexture {
    private static _FacesMapping;
    protected _generateHarmonics: boolean;
    protected _noMipmap: boolean;
    protected _size: number;
    private _prefilterOnLoad;
    private _prefilterIrradianceOnLoad;
    private _prefilterUsingCdf;
    private _textureMatrix;
    private _supersample;
    private _onLoad;
    private _onError;
    /**
     * The texture URL.
     */
    url: string;
    protected _isBlocking: boolean;
    /**
     * Sets whether or not the texture is blocking during loading.
     */
    set isBlocking(value: boolean);
    /**
     * Gets whether or not the texture is blocking during loading.
     */
    get isBlocking(): boolean;
    protected _rotationY: number;
    /**
     * Sets texture matrix rotation angle around Y axis in radians.
     */
    set rotationY(value: number);
    /**
     * Gets texture matrix rotation angle around Y axis radians.
     */
    get rotationY(): number;
    /**
     * Gets or sets the center of the bounding box associated with the cube texture
     * It must define where the camera used to render the texture was set
     */
    boundingBoxPosition: Vector3;
    private _boundingBoxSize;
    /**
     * Gets or sets the size of the bounding box associated with the cube texture
     * When defined, the cubemap will switch to local mode
     * @see https://community.arm.com/graphics/b/blog/posts/reflections-based-on-local-cubemaps-in-unity
     * @example https://www.babylonjs-playground.com/#RNASML
     */
    set boundingBoxSize(value: Vector3);
    get boundingBoxSize(): Vector3;
    /**
     * Observable triggered once the texture has been loaded.
     */
    onLoadObservable: Observable<EnvCubeTexture>;
    /**
     * Instantiates an EnvCubeTexture from the following parameters.
     *
     * @param url The location of the raw data (Panorama stored in RGBE format)
     * @param sceneOrEngine The scene or engine the texture will be used in
     * @param size The cubemap desired size (the more it increases the longer the generation will be)
     * @param noMipmap Forces to not generate the mipmap if true
     * @param generateHarmonics Specifies whether you want to extract the polynomial harmonics during the generation process
     * @param gammaSpace Specifies if the texture will be use in gamma or linear space (the PBR material requires those texture in linear space, but the standard material would require them in Gamma space)
     * @param prefilterOnLoad Prefilters texture to allow use of this texture as a PBR reflection texture.
     * @param onLoad on success callback function
     * @param onError on error callback function
     * @param supersample Defines if texture must be supersampled (default: false)
     * @param prefilterIrradianceOnLoad Prefilters texture to allow use of this texture for irradiance lighting.
     * @param prefilterUsingCdf Defines if the prefiltering should be done using a CDF instead of the default approach.
     * @param sphericalPolynomialTargetSize Target face size for spherical polynomial computation. 0 = full resolution (default).
     */
    constructor(url: string, sceneOrEngine: Scene | AbstractEngine, size: number, noMipmap?: boolean, generateHarmonics?: boolean, gammaSpace?: boolean, prefilterOnLoad?: boolean, onLoad?: Nullable<() => void>, onError?: Nullable<(message?: string, exception?: any) => void>, supersample?: boolean, prefilterIrradianceOnLoad?: boolean, prefilterUsingCdf?: boolean, sphericalPolynomialTargetSize?: number);
    /**
     * Get the current class name of the texture useful for serialization or dynamic coding.
     * @returns "EnvCubeTexture"
     */
    getClassName(): string;
    /**
     * Convert the raw data from the server into cubemap faces
     * @param buffer The buffer containing the texture data
     * @param size The cubemap face size
     * @param supersample Defines if texture must be supersampled
     * @returns The cube map data
     */
    protected abstract _getCubeMapTextureDataAsync(buffer: ArrayBuffer, size: number, supersample: boolean): Promise<CubeMapInfo>;
    /**
     * Occurs when the file has been loaded.
     */
    private _loadTexture;
    delayLoad(): void;
    /**
     * Get the texture reflection matrix used to rotate/transform the reflection.
     * @returns the reflection matrix
     */
    getReflectionTextureMatrix(): Matrix;
    /**
     * Set the texture reflection matrix used to rotate/transform the reflection.
     * @param value Define the reflection matrix to set
     */
    setReflectionTextureMatrix(value: Matrix): void;
    /**
     * Dispose the texture and release its associated resources.
     */
    dispose(): void;
    /**
     * Serializes the texture to a JSON representation.
     * @returns the JSON representation
     */
    serialize(): any;
    protected abstract _instantiateClone(): this;
    /**
     * Clones the current texture.
     * @returns the cloned texture
     */
    clone(): this;
    protected static _Parse(parsedTexture: any, texture: EnvCubeTexture): void;
}
