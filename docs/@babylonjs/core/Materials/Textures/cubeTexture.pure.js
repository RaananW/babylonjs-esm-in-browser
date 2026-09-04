/** This file must only contain pure code and pure imports */
import { __esDecorate, __runInitializers } from "../../tslib.es6.js";
import { serialize, serializeAsMatrix, serializeAsVector3 } from "../../Misc/decorators.js";
import { TimingTools } from "../../Misc/timingTools.js";
import { Matrix, TmpVectors, Vector3 } from "../../Maths/math.vector.pure.js";
import { BaseTexture } from "../../Materials/Textures/baseTexture.pure.js";
import { Texture } from "../../Materials/Textures/texture.pure.js";

import { GetClass, RegisterClass } from "../../Misc/typeStore.js";
import { Observable } from "../../Misc/observable.pure.js";
import { SerializationHelper } from "../../Misc/decorators.serialization.js";
import { RegisterAbstractEngineCubeTexture } from "../../Engines/AbstractEngine/abstractEngine.cubeTexture.pure.js";
// The default scale applied to environment texture. This manages the range of LOD level used for IBL according to the roughness
const DefaultLodScale = 0.8;
/**
 * Class for creating a cube texture
 */
let CubeTexture = (() => {
    var _a;
    let _classSuper = BaseTexture;
    let _instanceExtraInitializers = [];
    let _url_decorators;
    let _url_initializers = [];
    let _url_extraInitializers = [];
    let _boundingBoxPosition_decorators;
    let _boundingBoxPosition_initializers = [];
    let _boundingBoxPosition_extraInitializers = [];
    let _get_boundingBoxSize_decorators;
    let _set_rotationY_decorators;
    let __files_decorators;
    let __files_initializers = [];
    let __files_extraInitializers = [];
    let __forcedExtension_decorators;
    let __forcedExtension_initializers = [];
    let __forcedExtension_extraInitializers = [];
    let __extensions_decorators;
    let __extensions_initializers = [];
    let __extensions_extraInitializers = [];
    let __textureMatrix_decorators;
    let __textureMatrix_initializers = [];
    let __textureMatrix_extraInitializers = [];
    let __textureMatrixRefraction_decorators;
    let __textureMatrixRefraction_initializers = [];
    let __textureMatrixRefraction_extraInitializers = [];
    return _a = class CubeTexture extends _classSuper {
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
            /**
             * Returns the bounding box size
             * @see https://doc.babylonjs.com/features/featuresDeepDive/materials/using/reflectionTexture#using-local-cubemap-mode
             */
            get boundingBoxSize() {
                return this._boundingBoxSize;
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
             * Are mip maps generated for this texture or not.
             */
            get noMipmap() {
                return this._noMipmap;
            }
            /**
             * Gets the forced extension (if any)
             */
            get forcedExtension() {
                return this._forcedExtension;
            }
            /**
             * Creates a cube texture to use with reflection for instance. It can be based upon dds or six images as well
             * as prefiltered data.
             * @param rootUrl defines the url of the texture or the root name of the six images
             * @param sceneOrEngine defines the scene or engine the texture is attached to
             * @param extensionsOrOptions defines the suffixes add to the picture name in case six images are in use like _px.jpg or set of all options to create the cube texture
             * @param noMipmap defines if mipmaps should be created or not
             * @param files defines the six files to load for the different faces in that order: px, py, pz, nx, ny, nz
             * @param onLoad defines a callback triggered at the end of the file load if no errors occurred
             * @param onError defines a callback triggered in case of error during load
             * @param format defines the internal format to use for the texture once loaded
             * @param prefiltered defines whether or not the texture is created from prefiltered data
             * @param forcedExtension defines the extensions to use (force a special type of file to load) in case it is different from the file name
             * @param createPolynomials defines whether or not to create polynomial harmonics from the texture data if necessary
             * @param lodScale defines the scale applied to environment texture. This manages the range of LOD level used for IBL according to the roughness
             * @param lodOffset defines the offset applied to environment texture. This manages first LOD level used for IBL according to the roughness
             * @param loaderOptions options to be passed to the loader
             * @param useSRGBBuffer Defines if the texture must be loaded in a sRGB GPU buffer (if supported by the GPU) (default: false)
             * @returns the cube texture
             */
            constructor(rootUrl, sceneOrEngine, extensionsOrOptions = null, noMipmap = false, files = null, onLoad = null, onError = null, format = 5, prefiltered = false, forcedExtension = null, createPolynomials = false, lodScale = DefaultLodScale, lodOffset = 0, loaderOptions, useSRGBBuffer) {
                super(sceneOrEngine);
                this._delayedOnLoad = __runInitializers(this, _instanceExtraInitializers);
                /**
                 * Observable triggered once the texture has been loaded.
                 */
                this.onLoadObservable = new Observable();
                /**
                 * The url of the texture
                 */
                this.url = __runInitializers(this, _url_initializers, void 0);
                /**
                 * Gets or sets the center of the bounding box associated with the cube texture.
                 * It must define where the camera used to render the texture was set
                 * @see https://doc.babylonjs.com/features/featuresDeepDive/materials/using/reflectionTexture#using-local-cubemap-mode
                 */
                this.boundingBoxPosition = (__runInitializers(this, _url_extraInitializers), __runInitializers(this, _boundingBoxPosition_initializers, Vector3.Zero()));
                this._boundingBoxSize = __runInitializers(this, _boundingBoxPosition_extraInitializers);
                this._rotationY = 0;
                /** @internal */
                this._files = __runInitializers(this, __files_initializers, null);
                this._forcedExtension = (__runInitializers(this, __files_extraInitializers), __runInitializers(this, __forcedExtension_initializers, null));
                this._extensions = (__runInitializers(this, __forcedExtension_extraInitializers), __runInitializers(this, __extensions_initializers, null));
                this._textureMatrix = (__runInitializers(this, __extensions_extraInitializers), __runInitializers(this, __textureMatrix_initializers, void 0));
                this._textureMatrixRefraction = (__runInitializers(this, __textureMatrix_extraInitializers), __runInitializers(this, __textureMatrixRefraction_initializers, new Matrix()));
                this._format = __runInitializers(this, __textureMatrixRefraction_extraInitializers);
                this._buffer = null;
                RegisterAbstractEngineCubeTexture();
                this.name = rootUrl;
                this.url = rootUrl;
                this._noMipmap = noMipmap;
                this.hasAlpha = false;
                this.isCube = true;
                this._textureMatrix = Matrix.Identity();
                this.coordinatesMode = Texture.CUBIC_MODE;
                let extensions;
                let buffer = null;
                if (extensionsOrOptions !== null && !Array.isArray(extensionsOrOptions)) {
                    extensions = extensionsOrOptions.extensions ?? null;
                    this._noMipmap = extensionsOrOptions.noMipmap ?? false;
                    files = extensionsOrOptions.files ?? null;
                    buffer = extensionsOrOptions.buffer ?? null;
                    this._format = extensionsOrOptions.format ?? 5;
                    prefiltered = extensionsOrOptions.prefiltered ?? false;
                    forcedExtension = extensionsOrOptions.forcedExtension ?? null;
                    this._createPolynomials = extensionsOrOptions.createPolynomials ?? false;
                    this._lodScale = extensionsOrOptions.lodScale ?? DefaultLodScale;
                    this._lodOffset = extensionsOrOptions.lodOffset ?? 0;
                    this._loaderOptions = extensionsOrOptions.loaderOptions;
                    this._useSRGBBuffer = extensionsOrOptions.useSRGBBuffer;
                    this._sphericalPolynomialTargetSize = extensionsOrOptions.sphericalPolynomialTargetSize ?? 0;
                    onLoad = extensionsOrOptions.onLoad ?? null;
                    onError = extensionsOrOptions.onError ?? null;
                }
                else {
                    this._noMipmap = noMipmap;
                    this._format = format;
                    this._createPolynomials = createPolynomials;
                    extensions = extensionsOrOptions;
                    this._loaderOptions = loaderOptions;
                    this._useSRGBBuffer = useSRGBBuffer;
                    this._lodScale = lodScale;
                    this._lodOffset = lodOffset;
                }
                if (!rootUrl && !files) {
                    return;
                }
                this.updateURL(rootUrl, forcedExtension, onLoad, prefiltered, onError, extensions, this.getScene()?.useDelayedTextureLoading, files, buffer);
            }
            /**
             * Get the current class name of the texture useful for serialization or dynamic coding.
             * @returns "CubeTexture"
             */
            getClassName() {
                return "CubeTexture";
            }
            /**
             * Update the url (and optional buffer) of this texture if url was null during construction.
             * @param url the url of the texture
             * @param forcedExtension defines the extension to use
             * @param onLoad callback called when the texture is loaded  (defaults to null)
             * @param prefiltered Defines whether the updated texture is prefiltered or not
             * @param onError callback called if there was an error during the loading process (defaults to null)
             * @param extensions defines the suffixes add to the picture name in case six images are in use like _px.jpg...
             * @param delayLoad defines if the texture should be loaded now (false by default)
             * @param files defines the six files to load for the different faces in that order: px, py, pz, nx, ny, nz
             * @param buffer the buffer to use instead of loading from the url
             */
            updateURL(url, forcedExtension = null, onLoad = null, prefiltered = false, onError = null, extensions = null, delayLoad = false, files = null, buffer = null) {
                if (!this.name || this.name.startsWith("data:")) {
                    this.name = url;
                }
                this.url = url;
                if (forcedExtension) {
                    this._forcedExtension = forcedExtension;
                }
                const lastDot = url.lastIndexOf(".");
                const extension = forcedExtension ? forcedExtension : lastDot > -1 ? url.substring(lastDot).toLowerCase() : "";
                const isDDS = extension.indexOf(".dds") === 0;
                const isEnv = extension.indexOf(".env") === 0;
                const isBasis = extension.indexOf(".basis") === 0;
                if (isEnv) {
                    this.gammaSpace = false;
                    this._prefiltered = false;
                    this.anisotropicFilteringLevel = 1;
                }
                else {
                    this._prefiltered = prefiltered;
                    if (prefiltered) {
                        this.gammaSpace = false;
                        this.anisotropicFilteringLevel = 1;
                    }
                }
                if (files) {
                    this._files = files;
                }
                else {
                    if (!isBasis && !isEnv && !isDDS && !extensions) {
                        extensions = ["_px.jpg", "_py.jpg", "_pz.jpg", "_nx.jpg", "_ny.jpg", "_nz.jpg"];
                    }
                    this._files = this._files || [];
                    this._files.length = 0;
                    if (extensions) {
                        for (let index = 0; index < extensions.length; index++) {
                            this._files.push(url + extensions[index]);
                        }
                        this._extensions = extensions;
                    }
                }
                this._buffer = buffer;
                if (delayLoad) {
                    this.delayLoadState = 4;
                    this._delayedOnLoad = onLoad;
                    this._delayedOnError = onError;
                }
                else {
                    this._loadTexture(onLoad, onError);
                }
            }
            /**
             * Delays loading of the cube texture
             * @param forcedExtension defines the extension to use
             */
            delayLoad(forcedExtension) {
                if (this.delayLoadState !== 4) {
                    return;
                }
                if (forcedExtension) {
                    this._forcedExtension = forcedExtension;
                }
                this.delayLoadState = 1;
                this._loadTexture(this._delayedOnLoad, this._delayedOnError);
            }
            /**
             * Returns the reflection texture matrix
             * @returns the reflection texture matrix
             */
            getReflectionTextureMatrix() {
                return this._textureMatrix;
            }
            /**
             * Sets the reflection texture matrix
             * @param value Reflection texture matrix
             */
            setReflectionTextureMatrix(value) {
                if (value.updateFlag === this._textureMatrix.updateFlag) {
                    return;
                }
                if (value.isIdentity() !== this._textureMatrix.isIdentity()) {
                    this.getScene()?.markAllMaterialsAsDirty(1, (mat) => mat.getActiveTextures().indexOf(this) !== -1);
                }
                this._textureMatrix = value;
                if (!this.getScene()?.useRightHandedSystem) {
                    return;
                }
                const scale = TmpVectors.Vector3[0];
                const quat = TmpVectors.Quaternion[0];
                const trans = TmpVectors.Vector3[1];
                this._textureMatrix.decompose(scale, quat, trans);
                quat.z *= -1; // these two operations correspond to negating the x and y euler angles
                quat.w *= -1;
                Matrix.ComposeToRef(scale, quat, trans, this._textureMatrixRefraction);
            }
            /**
             * Gets a suitable rotate/transform matrix when the texture is used for refraction.
             * There's a separate function from getReflectionTextureMatrix because refraction requires a special configuration of the matrix in right-handed mode.
             * @returns The refraction matrix
             */
            getRefractionTextureMatrix() {
                return this.getScene()?.useRightHandedSystem ? this._textureMatrixRefraction : this._textureMatrix;
            }
            _loadTexture(onLoad = null, onError = null) {
                const scene = this.getScene();
                const oldTexture = this._texture;
                this._texture = this._getFromCache(this.url, this._noMipmap, undefined, undefined, this._useSRGBBuffer, this.isCube);
                const onLoadProcessing = () => {
                    this.onLoadObservable.notifyObservers(this);
                    if (oldTexture) {
                        oldTexture.dispose();
                        this.getScene()?.markAllMaterialsAsDirty(1);
                    }
                    if (onLoad) {
                        onLoad();
                    }
                };
                const errorHandler = (message, exception) => {
                    this._loadingError = true;
                    this._errorObject = { message, exception };
                    if (onError) {
                        onError(message, exception);
                    }
                    Texture.OnTextureLoadErrorObservable.notifyObservers(this);
                };
                if (!this._texture) {
                    if (this._prefiltered) {
                        this._texture = this._getEngine().createPrefilteredCubeTexture(this.url, scene, this._lodScale, this._lodOffset, onLoad, errorHandler, this._format, this._forcedExtension, this._createPolynomials);
                    }
                    else {
                        this._texture = this._getEngine().createCubeTexture(this.url, scene, this._files, this._noMipmap, onLoad, errorHandler, this._format, this._forcedExtension, false, this._lodScale, this._lodOffset, null, this._loaderOptions, !!this._useSRGBBuffer, this._buffer);
                    }
                    this._texture?.onLoadedObservable.add(() => this.onLoadObservable.notifyObservers(this));
                }
                else {
                    if (this._texture.isReady) {
                        TimingTools.SetImmediate(() => onLoadProcessing());
                    }
                    else {
                        this._texture.onLoadedObservable.add(() => onLoadProcessing());
                    }
                }
            }
            /**
             * Makes a clone, or deep copy, of the cube texture
             * @returns a new cube texture
             */
            clone() {
                let uniqueId = 0;
                // Save the irradianceTexture before cloning. The irradianceTexture is
                // stored on the InternalTexture (_texture._irradianceTexture), which may
                // be shared between the source and clone when loaded from cache.
                // BaseTexture.clone() returns null, so CopySource sets the shared
                // irradianceTexture to null, losing it on both the original and the clone.
                const savedIrradianceTexture = this.irradianceTexture;
                const newCubeTexture = SerializationHelper.Clone(() => {
                    const cubeTexture = new _a(this.url, this.getScene() || this._getEngine(), this._extensions, this._noMipmap, this._files);
                    uniqueId = cubeTexture.uniqueId;
                    return cubeTexture;
                }, this);
                newCubeTexture.uniqueId = uniqueId;
                // Restore the irradianceTexture if it was cleared during cloning.
                if (savedIrradianceTexture && !this.irradianceTexture) {
                    this.irradianceTexture = savedIrradianceTexture;
                }
                return newCubeTexture;
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _url_decorators = [serialize()];
            _boundingBoxPosition_decorators = [serializeAsVector3()];
            _get_boundingBoxSize_decorators = [serializeAsVector3()];
            _set_rotationY_decorators = [serialize("rotationY")];
            __files_decorators = [serialize("files")];
            __forcedExtension_decorators = [serialize("forcedExtension")];
            __extensions_decorators = [serialize("extensions")];
            __textureMatrix_decorators = [serializeAsMatrix("textureMatrix")];
            __textureMatrixRefraction_decorators = [serializeAsMatrix("textureMatrixRefraction")];
            __esDecorate(_a, null, _get_boundingBoxSize_decorators, { kind: "getter", name: "boundingBoxSize", static: false, private: false, access: { has: obj => "boundingBoxSize" in obj, get: obj => obj.boundingBoxSize }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _set_rotationY_decorators, { kind: "setter", name: "rotationY", static: false, private: false, access: { has: obj => "rotationY" in obj, set: (obj, value) => { obj.rotationY = value; } }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(null, null, _url_decorators, { kind: "field", name: "url", static: false, private: false, access: { has: obj => "url" in obj, get: obj => obj.url, set: (obj, value) => { obj.url = value; } }, metadata: _metadata }, _url_initializers, _url_extraInitializers);
            __esDecorate(null, null, _boundingBoxPosition_decorators, { kind: "field", name: "boundingBoxPosition", static: false, private: false, access: { has: obj => "boundingBoxPosition" in obj, get: obj => obj.boundingBoxPosition, set: (obj, value) => { obj.boundingBoxPosition = value; } }, metadata: _metadata }, _boundingBoxPosition_initializers, _boundingBoxPosition_extraInitializers);
            __esDecorate(null, null, __files_decorators, { kind: "field", name: "_files", static: false, private: false, access: { has: obj => "_files" in obj, get: obj => obj._files, set: (obj, value) => { obj._files = value; } }, metadata: _metadata }, __files_initializers, __files_extraInitializers);
            __esDecorate(null, null, __forcedExtension_decorators, { kind: "field", name: "_forcedExtension", static: false, private: false, access: { has: obj => "_forcedExtension" in obj, get: obj => obj._forcedExtension, set: (obj, value) => { obj._forcedExtension = value; } }, metadata: _metadata }, __forcedExtension_initializers, __forcedExtension_extraInitializers);
            __esDecorate(null, null, __extensions_decorators, { kind: "field", name: "_extensions", static: false, private: false, access: { has: obj => "_extensions" in obj, get: obj => obj._extensions, set: (obj, value) => { obj._extensions = value; } }, metadata: _metadata }, __extensions_initializers, __extensions_extraInitializers);
            __esDecorate(null, null, __textureMatrix_decorators, { kind: "field", name: "_textureMatrix", static: false, private: false, access: { has: obj => "_textureMatrix" in obj, get: obj => obj._textureMatrix, set: (obj, value) => { obj._textureMatrix = value; } }, metadata: _metadata }, __textureMatrix_initializers, __textureMatrix_extraInitializers);
            __esDecorate(null, null, __textureMatrixRefraction_decorators, { kind: "field", name: "_textureMatrixRefraction", static: false, private: false, access: { has: obj => "_textureMatrixRefraction" in obj, get: obj => obj._textureMatrixRefraction, set: (obj, value) => { obj._textureMatrixRefraction = value; } }, metadata: _metadata }, __textureMatrixRefraction_initializers, __textureMatrixRefraction_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
export { CubeTexture };
let _Registered = false;
/**
 * Creates a cube texture from an array of image urls
 * @param files defines an array of image urls
 * @param scene defines the hosting scene
 * @param noMipmap specifies if mip maps are not used
 * @returns a cube texture
 */
export function CubeTextureCreateFromImages(files, scene, noMipmap) {
    let rootUrlKey = "";
    for (const url of files) {
        rootUrlKey += url;
    }
    return new CubeTexture(rootUrlKey, scene, null, noMipmap, files);
}
/**
 * Creates and return a texture created from prefilterd data by tools like IBL Baker or Lys.
 * @param url defines the url of the prefiltered texture
 * @param scene defines the scene the texture is attached to
 * @param forcedExtension defines the extension of the file if different from the url
 * @param createPolynomials defines whether or not to create polynomial harmonics from the texture data if necessary
 * @returns the prefiltered texture
 */
export function CubeTextureCreateFromPrefilteredData(url, scene, forcedExtension = null, createPolynomials = true) {
    const oldValue = scene.useDelayedTextureLoading;
    scene.useDelayedTextureLoading = false;
    const result = new CubeTexture(url, scene, null, false, null, null, null, undefined, true, forcedExtension, createPolynomials);
    scene.useDelayedTextureLoading = oldValue;
    return result;
}
/**
 * Parses text to create a cube texture
 * @param parsedTexture define the serialized text to read from
 * @param scene defines the hosting scene
 * @param rootUrl defines the root url of the cube texture
 * @returns a cube texture
 */
export function CubeTextureParse(parsedTexture, scene, rootUrl) {
    const texture = SerializationHelper.Parse(() => {
        let prefiltered = false;
        if (parsedTexture.prefiltered) {
            prefiltered = parsedTexture.prefiltered;
        }
        return new CubeTexture(rootUrl + (parsedTexture.url ?? parsedTexture.name), scene, parsedTexture.extensions, false, parsedTexture.files || null, null, null, undefined, prefiltered, parsedTexture.forcedExtension);
    }, parsedTexture, scene);
    // Local Cubemaps
    if (parsedTexture.boundingBoxPosition) {
        texture.boundingBoxPosition = Vector3.FromArray(parsedTexture.boundingBoxPosition);
    }
    if (parsedTexture.boundingBoxSize) {
        texture.boundingBoxSize = Vector3.FromArray(parsedTexture.boundingBoxSize);
    }
    // Animations
    if (parsedTexture.animations) {
        for (let animationIndex = 0; animationIndex < parsedTexture.animations.length; animationIndex++) {
            const parsedAnimation = parsedTexture.animations[animationIndex];
            const internalClass = GetClass("BABYLON.Animation");
            if (internalClass) {
                texture.animations.push(internalClass.Parse(parsedAnimation));
            }
        }
    }
    return texture;
}
/**
 * Register side effects for cubeTexture.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterCubeTexture() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    CubeTexture.CreateFromImages = CubeTextureCreateFromImages;
    CubeTexture.CreateFromPrefilteredData = CubeTextureCreateFromPrefilteredData;
    CubeTexture.Parse = CubeTextureParse;
    Texture._CubeTextureParser = CubeTextureParse;
    // Some exporters relies on Tools.Instantiate
    RegisterClass("BABYLON.CubeTexture", CubeTexture);
}
//# sourceMappingURL=cubeTexture.pure.js.map