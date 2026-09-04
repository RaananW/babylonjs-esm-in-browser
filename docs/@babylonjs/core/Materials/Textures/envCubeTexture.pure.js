/** This file must only contain pure code and pure imports */
import { Matrix, Vector3 } from "../../Maths/math.vector.pure.js";
import { BaseTexture } from "../../Materials/Textures/baseTexture.pure.js";
import { Texture } from "../../Materials/Textures/texture.pure.js";

import { CubeMapToSphericalPolynomialTools } from "../../Misc/HighDynamicRange/cubemapToSphericalPolynomial.js";
import { Observable } from "../../Misc/observable.pure.js";
import { TimingTools } from "../../Misc/timingTools.js";
import { ToGammaSpace } from "../../Maths/math.constants.js";
import { HDRFiltering } from "../../Materials/Textures/Filtering/hdrFiltering.js";
import { HDRIrradianceFiltering } from "../../Materials/Textures/Filtering/hdrIrradianceFiltering.js";
import { ToHalfFloat } from "../../Misc/textureTools.js";
import { SphericalPolynomial } from "../../Maths/sphericalPolynomial.pure.js";
/**
 * This represents an environment base texture which could for instance be from HDR or EXR files.
 */
export class EnvCubeTexture extends BaseTexture {
    /**
     * Sets whether or not the texture is blocking during loading.
     */
    set isBlocking(value) {
        this._isBlocking = value;
    }
    /**
     * Gets whether or not the texture is blocking during loading.
     */
    get isBlocking() {
        return this._isBlocking;
    }
    /**
     * Sets texture matrix rotation angle around Y axis in radians.
     */
    set rotationY(value) {
        this._rotationY = value;
        this.setReflectionTextureMatrix(Matrix.RotationY(this._rotationY));
    }
    /**
     * Gets texture matrix rotation angle around Y axis radians.
     */
    get rotationY() {
        return this._rotationY;
    }
    /**
     * Gets or sets the size of the bounding box associated with the cube texture
     * When defined, the cubemap will switch to local mode
     * @see https://community.arm.com/graphics/b/blog/posts/reflections-based-on-local-cubemaps-in-unity
     * @example https://www.babylonjs-playground.com/#RNASML
     */
    set boundingBoxSize(value) {
        if (this._boundingBoxSize && this._boundingBoxSize.equals(value)) {
            return;
        }
        this._boundingBoxSize = value;
        const scene = this.getScene();
        if (scene) {
            scene.markAllMaterialsAsDirty(1);
        }
    }
    get boundingBoxSize() {
        return this._boundingBoxSize;
    }
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
    constructor(url, sceneOrEngine, size, noMipmap = false, generateHarmonics = true, gammaSpace = false, prefilterOnLoad = false, onLoad = null, onError = null, supersample = false, prefilterIrradianceOnLoad = false, prefilterUsingCdf = false, sphericalPolynomialTargetSize = 0) {
        super(sceneOrEngine);
        this._generateHarmonics = true;
        this._onError = null;
        this._isBlocking = true;
        this._rotationY = 0;
        /**
         * Gets or sets the center of the bounding box associated with the cube texture
         * It must define where the camera used to render the texture was set
         */
        this.boundingBoxPosition = Vector3.Zero();
        /**
         * Observable triggered once the texture has been loaded.
         */
        this.onLoadObservable = new Observable();
        if (!url) {
            return;
        }
        this._coordinatesMode = Texture.CUBIC_MODE;
        this.name = url;
        this.url = url;
        this.hasAlpha = false;
        this.isCube = true;
        this._textureMatrix = Matrix.Identity();
        this._prefilterOnLoad = prefilterOnLoad;
        this._prefilterIrradianceOnLoad = prefilterIrradianceOnLoad;
        this._prefilterUsingCdf = prefilterUsingCdf;
        this._onLoad = () => {
            this.onLoadObservable.notifyObservers(this);
            if (onLoad) {
                onLoad();
            }
        };
        this._onError = onError;
        this.gammaSpace = gammaSpace;
        this._noMipmap = noMipmap;
        this._size = size;
        // CDF is very sensitive to lost precision due to downsampling. This can result in
        // noticeable brightness differences with different resolutions. Enabling supersampling
        // mitigates this.
        this._supersample = supersample || prefilterUsingCdf;
        this._generateHarmonics = generateHarmonics;
        this._sphericalPolynomialTargetSize = sphericalPolynomialTargetSize;
        this._texture = this._getFromCache(url, this._noMipmap, undefined, undefined, undefined, this.isCube);
        if (!this._texture) {
            if (!this.getScene()?.useDelayedTextureLoading) {
                this._loadTexture();
            }
            else {
                this.delayLoadState = 4;
            }
        }
        else {
            if (this._texture.isReady) {
                TimingTools.SetImmediate(() => this._onLoad());
            }
            else {
                this._texture.onLoadedObservable.add(this._onLoad);
            }
        }
    }
    /**
     * Get the current class name of the texture useful for serialization or dynamic coding.
     * @returns "EnvCubeTexture"
     */
    getClassName() {
        return "EnvCubeTexture";
    }
    /**
     * Occurs when the file has been loaded.
     */
    _loadTexture() {
        const engine = this._getEngine();
        const caps = engine.getCaps();
        let textureType = 0;
        if (caps.textureFloat && caps.textureFloatLinearFiltering) {
            textureType = 1;
        }
        else if (caps.textureHalfFloat && caps.textureHalfFloatLinearFiltering) {
            textureType = 2;
        }
        // eslint-disable-next-line no-restricted-syntax
        const callback = async (buffer) => {
            this.lodGenerationOffset = 0.0;
            this.lodGenerationScale = 0.8;
            // Extract the raw linear data.
            const data = await this._getCubeMapTextureDataAsync(buffer, this._size, this._supersample);
            // Generate harmonics if needed. When prefiltering was requested but the engine cannot
            // prefilter textures (e.g. Babylon Native or WebGL1), neither a prefiltered irradiance
            // map nor a prefiltered radiance cube is produced. In that case fall back to
            // CPU-computed spherical harmonics so diffuse IBL still has a source; without this the
            // reflection texture keeps an empty spherical polynomial and diffuse IBL renders black.
            const prefilterUnavailable = (this._prefilterOnLoad || this._prefilterIrradianceOnLoad) && !engine._features.allowTexturePrefiltering;
            if (this._generateHarmonics || prefilterUnavailable) {
                const sphericalPolynomial = CubeMapToSphericalPolynomialTools.ConvertCubeMapToSphericalPolynomial(data, this._sphericalPolynomialTargetSize);
                this.sphericalPolynomial = sphericalPolynomial;
            }
            const results = [];
            let byteArray = null;
            let shortArray = null;
            // Push each faces.
            for (let j = 0; j < 6; j++) {
                // Create fallback array
                if (textureType === 2) {
                    shortArray = new Uint16Array(this._size * this._size * 3);
                }
                else if (textureType === 0) {
                    // 3 channels of 1 bytes per pixel in bytes.
                    byteArray = new Uint8Array(this._size * this._size * 3);
                }
                const dataFace = data[EnvCubeTexture._FacesMapping[j]];
                // If special cases.
                if (this.gammaSpace || shortArray || byteArray) {
                    for (let i = 0; i < this._size * this._size; i++) {
                        // Put in gamma space if requested.
                        if (this.gammaSpace) {
                            dataFace[i * 3 + 0] = Math.pow(dataFace[i * 3 + 0], ToGammaSpace);
                            dataFace[i * 3 + 1] = Math.pow(dataFace[i * 3 + 1], ToGammaSpace);
                            dataFace[i * 3 + 2] = Math.pow(dataFace[i * 3 + 2], ToGammaSpace);
                        }
                        // Convert to half float texture for fallback.
                        if (shortArray) {
                            shortArray[i * 3 + 0] = ToHalfFloat(dataFace[i * 3 + 0]);
                            shortArray[i * 3 + 1] = ToHalfFloat(dataFace[i * 3 + 1]);
                            shortArray[i * 3 + 2] = ToHalfFloat(dataFace[i * 3 + 2]);
                        }
                        // Convert to int texture for fallback.
                        if (byteArray) {
                            let r = Math.max(dataFace[i * 3 + 0] * 255, 0);
                            let g = Math.max(dataFace[i * 3 + 1] * 255, 0);
                            let b = Math.max(dataFace[i * 3 + 2] * 255, 0);
                            // May use luminance instead if the result is not accurate.
                            const max = Math.max(Math.max(r, g), b);
                            if (max > 255) {
                                const scale = 255 / max;
                                r *= scale;
                                g *= scale;
                                b *= scale;
                            }
                            byteArray[i * 3 + 0] = r;
                            byteArray[i * 3 + 1] = g;
                            byteArray[i * 3 + 2] = b;
                        }
                    }
                }
                if (shortArray) {
                    results.push(shortArray);
                }
                else if (byteArray) {
                    results.push(byteArray);
                }
                else {
                    results.push(dataFace);
                }
            }
            return results;
        };
        if (engine._features.allowTexturePrefiltering && (this._prefilterOnLoad || this._prefilterIrradianceOnLoad)) {
            const previousOnLoad = this._onLoad;
            const previousOnError = this._onError;
            const hdrFiltering = new HDRFiltering(engine);
            const prefilterPendingToken = {};
            const scene = this.getScene();
            scene?.addPendingData(prefilterPendingToken);
            this._onError = () => {
                // If the texture load itself fails, _onLoad never runs so the try/finally below
                // never fires. Make sure the pending-data token is still cleared so the scene
                // doesn't stay stuck in isLoading / executeWhenReady.
                scene?.removePendingData(prefilterPendingToken);
                if (previousOnError) {
                    previousOnError();
                }
            };
            this._onLoad = () => {
                void (async () => {
                    try {
                        let irradianceTexture = null;
                        if (this._prefilterIrradianceOnLoad) {
                            const hdrIrradianceFiltering = new HDRIrradianceFiltering(engine, { useCdf: this._prefilterUsingCdf });
                            irradianceTexture = await hdrIrradianceFiltering.prefilter(this);
                        }
                        // Run irradiance prefiltering first because it samples the current source texture.
                        // Radiance prefiltering mutates/swaps the source internal texture, so running both
                        // concurrently can lead to stale/destroyed texture references on WebGPU.
                        if (this._prefilterIrradianceOnLoad && irradianceTexture) {
                            this.irradianceTexture = irradianceTexture;
                            const innerScene = this.getScene();
                            if (innerScene) {
                                innerScene.markAllMaterialsAsDirty(1);
                            }
                        }
                        if (this._prefilterOnLoad) {
                            await hdrFiltering.prefilter(this);
                        }
                    }
                    finally {
                        scene?.removePendingData(prefilterPendingToken);
                    }
                    if (previousOnLoad) {
                        previousOnLoad();
                    }
                })();
            };
        }
        this._texture = engine.createRawCubeTextureFromUrl(this.url, this.getScene(), this._size, 4, textureType, this._noMipmap, callback, null, this._onLoad, this._onError);
        if (!this._generateHarmonics && !this._texture._sphericalPolynomial) {
            this._texture._sphericalPolynomial = new SphericalPolynomial();
        }
    }
    // Methods
    delayLoad() {
        if (this.delayLoadState !== 4) {
            return;
        }
        this.delayLoadState = 1;
        this._texture = this._getFromCache(this.url, this._noMipmap);
        if (!this._texture) {
            this._loadTexture();
        }
    }
    /**
     * Get the texture reflection matrix used to rotate/transform the reflection.
     * @returns the reflection matrix
     */
    getReflectionTextureMatrix() {
        return this._textureMatrix;
    }
    /**
     * Set the texture reflection matrix used to rotate/transform the reflection.
     * @param value Define the reflection matrix to set
     */
    setReflectionTextureMatrix(value) {
        this._textureMatrix = value;
        if (value.updateFlag === this._textureMatrix.updateFlag) {
            return;
        }
        if (value.isIdentity() !== this._textureMatrix.isIdentity()) {
            this.getScene()?.markAllMaterialsAsDirty(1, (mat) => mat.getActiveTextures().indexOf(this) !== -1);
        }
    }
    /**
     * Dispose the texture and release its associated resources.
     */
    dispose() {
        this.onLoadObservable.clear();
        super.dispose();
    }
    /**
     * Serializes the texture to a JSON representation.
     * @returns the JSON representation
     */
    serialize() {
        if (!this.name) {
            return null;
        }
        const serializationObject = {};
        serializationObject.name = this.name;
        serializationObject.hasAlpha = this.hasAlpha;
        serializationObject.isCube = true;
        serializationObject.level = this.level;
        serializationObject.size = this._size;
        serializationObject.coordinatesMode = this.coordinatesMode;
        serializationObject.useInGammaSpace = this.gammaSpace;
        serializationObject.generateHarmonics = this._generateHarmonics;
        serializationObject.noMipmap = this._noMipmap;
        serializationObject.isBlocking = this._isBlocking;
        serializationObject.rotationY = this._rotationY;
        return serializationObject;
    }
    /**
     * Clones the current texture.
     * @returns the cloned texture
     */
    clone() {
        const newTexture = this._instantiateClone();
        // Base Texture
        newTexture.level = this.level;
        newTexture.wrapU = this.wrapU;
        newTexture.wrapV = this.wrapV;
        newTexture.coordinatesIndex = this.coordinatesIndex;
        newTexture.coordinatesMode = this.coordinatesMode;
        return newTexture;
    }
    static _Parse(parsedTexture, texture) {
        texture.name = parsedTexture.name;
        texture.hasAlpha = parsedTexture.hasAlpha;
        texture.level = parsedTexture.level;
        texture.coordinatesMode = parsedTexture.coordinatesMode;
        texture.isBlocking = parsedTexture.isBlocking;
        if (parsedTexture.boundingBoxPosition) {
            texture.boundingBoxPosition = Vector3.FromArray(parsedTexture.boundingBoxPosition);
        }
        if (parsedTexture.boundingBoxSize) {
            texture.boundingBoxSize = Vector3.FromArray(parsedTexture.boundingBoxSize);
        }
        if (parsedTexture.rotationY) {
            texture.rotationY = parsedTexture.rotationY;
        }
    }
}
EnvCubeTexture._FacesMapping = ["right", "left", "up", "down", "front", "back"];
//# sourceMappingURL=envCubeTexture.pure.js.map