/** This file must only contain pure code and pure imports */
import { __esDecorate, __runInitializers } from "../../tslib.es6.js";
import { serialize } from "../../Misc/decorators.js";
import { Observable } from "../../Misc/observable.pure.js";
import { Matrix, TmpVectors, Vector3 } from "../../Maths/math.vector.pure.js";
import { BaseTexture } from "../../Materials/Textures/baseTexture.pure.js";

import { GetClass, RegisterClass } from "../../Misc/typeStore.js";
import { _WarnImport } from "../../Misc/devTools.js";
import { TimingTools } from "../../Misc/timingTools.js";
import { InstantiationTools } from "../../Misc/instantiationTools.js";
import { Plane } from "../../Maths/math.plane.js";
import { EncodeArrayBufferToBase64 } from "../../Misc/stringTools.js";
import { GenerateBase64StringFromTexture, GenerateBase64StringFromTextureAsync } from "../../Misc/copyTools.js";
import { useOpenGLOrientationForUV } from "../../Compat/compatibilityOptions.js";
import { SerializationHelper } from "../../Misc/decorators.serialization.js";
/**
 * This represents a texture in babylon. It can be easily loaded from a network, base64 or html input.
 * @see https://doc.babylonjs.com/features/featuresDeepDive/materials/using/materials_introduction#texture
 */
let Texture = (() => {
    var _a;
    let _classSuper = BaseTexture;
    let _instanceExtraInitializers = [];
    let _url_decorators;
    let _url_initializers = [];
    let _url_extraInitializers = [];
    let _uOffset_decorators;
    let _uOffset_initializers = [];
    let _uOffset_extraInitializers = [];
    let _vOffset_decorators;
    let _vOffset_initializers = [];
    let _vOffset_extraInitializers = [];
    let _uScale_decorators;
    let _uScale_initializers = [];
    let _uScale_extraInitializers = [];
    let _vScale_decorators;
    let _vScale_initializers = [];
    let _vScale_extraInitializers = [];
    let _uAng_decorators;
    let _uAng_initializers = [];
    let _uAng_extraInitializers = [];
    let _vAng_decorators;
    let _vAng_initializers = [];
    let _vAng_extraInitializers = [];
    let _wAng_decorators;
    let _wAng_initializers = [];
    let _wAng_extraInitializers = [];
    let _uRotationCenter_decorators;
    let _uRotationCenter_initializers = [];
    let _uRotationCenter_extraInitializers = [];
    let _vRotationCenter_decorators;
    let _vRotationCenter_initializers = [];
    let _vRotationCenter_extraInitializers = [];
    let _wRotationCenter_decorators;
    let _wRotationCenter_initializers = [];
    let _wRotationCenter_extraInitializers = [];
    let _homogeneousRotationInUVTransform_decorators;
    let _homogeneousRotationInUVTransform_initializers = [];
    let _homogeneousRotationInUVTransform_extraInitializers = [];
    let _get_isBlocking_decorators;
    return _a = class Texture extends _classSuper {
            /**
             * @internal
             */
            static _CreateVideoTexture(name, src, scene, generateMipMaps = false, invertY = false, samplingMode = _a.TRILINEAR_SAMPLINGMODE, settings = {}, onError, format = 5) {
                throw _WarnImport("VideoTexture");
            }
            /**
             * Are mip maps generated for this texture or not.
             */
            get noMipmap() {
                return this._noMipmap;
            }
            /** Returns the texture mime type if it was defined by a loader (undefined else) */
            get mimeType() {
                return this._mimeType;
            }
            /**
             * Is the texture preventing material to render while loading.
             * If false, a default texture will be used instead of the loading one during the preparation step.
             */
            set isBlocking(value) {
                this._isBlocking = value;
            }
            get isBlocking() {
                return this._isBlocking;
            }
            /**
             * Gets a boolean indicating if the texture needs to be inverted on the y axis during loading
             */
            get invertY() {
                return this._invertY;
            }
            /**
             * Instantiates a new texture.
             * This represents a texture in babylon. It can be easily loaded from a network, base64 or html input.
             * @see https://doc.babylonjs.com/features/featuresDeepDive/materials/using/materials_introduction#texture
             * @param url defines the url of the picture to load as a texture
             * @param sceneOrEngine defines the scene or engine the texture will belong to
             * @param noMipmapOrOptions defines if the texture will require mip maps or not or set of all options to create the texture
             * @param invertY defines if the texture needs to be inverted on the y axis during loading
             * @param samplingMode defines the sampling mode we want for the texture while fetching from it (Texture.NEAREST_SAMPLINGMODE...)
             * @param onLoad defines a callback triggered when the texture has been loaded
             * @param onError defines a callback triggered when an error occurred during the loading session
             * @param buffer defines the buffer to load the texture from in case the texture is loaded from a buffer representation
             * @param deleteBuffer defines if the buffer we are loading the texture from should be deleted after load
             * @param format defines the format of the texture we are trying to load (Engine.TEXTUREFORMAT_RGBA...)
             * @param mimeType defines an optional mime type information
             * @param loaderOptions options to be passed to the loader
             * @param creationFlags specific flags to use when creating the texture (1 for storage textures, for eg)
             * @param forcedExtension defines the extension to use to pick the right loader
             */
            constructor(url, sceneOrEngine, noMipmapOrOptions, invertY, samplingMode = _a.TRILINEAR_SAMPLINGMODE, onLoad = null, onError = null, buffer = null, deleteBuffer = false, format, mimeType, loaderOptions, creationFlags, forcedExtension) {
                super(sceneOrEngine);
                /**
                 * Define the url of the texture.
                 */
                this.url = (__runInitializers(this, _instanceExtraInitializers), __runInitializers(this, _url_initializers, null));
                /**
                 * Define an offset on the texture to offset the u coordinates of the UVs
                 * @see https://doc.babylonjs.com/features/featuresDeepDive/materials/using/moreMaterials#offsetting
                 */
                this.uOffset = (__runInitializers(this, _url_extraInitializers), __runInitializers(this, _uOffset_initializers, 0));
                /**
                 * Define an offset on the texture to offset the v coordinates of the UVs
                 * @see https://doc.babylonjs.com/features/featuresDeepDive/materials/using/moreMaterials#offsetting
                 */
                this.vOffset = (__runInitializers(this, _uOffset_extraInitializers), __runInitializers(this, _vOffset_initializers, 0));
                /**
                 * Define an offset on the texture to scale the u coordinates of the UVs
                 * @see https://doc.babylonjs.com/features/featuresDeepDive/materials/using/moreMaterials#tiling
                 */
                this.uScale = (__runInitializers(this, _vOffset_extraInitializers), __runInitializers(this, _uScale_initializers, 1.0));
                /**
                 * Define an offset on the texture to scale the v coordinates of the UVs
                 * @see https://doc.babylonjs.com/features/featuresDeepDive/materials/using/moreMaterials#tiling
                 */
                this.vScale = (__runInitializers(this, _uScale_extraInitializers), __runInitializers(this, _vScale_initializers, 1.0));
                /**
                 * Define an offset on the texture to rotate around the u coordinates of the UVs
                 * The angle is defined in radians.
                 * @see https://doc.babylonjs.com/features/featuresDeepDive/materials/using/moreMaterials
                 */
                this.uAng = (__runInitializers(this, _vScale_extraInitializers), __runInitializers(this, _uAng_initializers, 0));
                /**
                 * Define an offset on the texture to rotate around the v coordinates of the UVs
                 * The angle is defined in radians.
                 * @see https://doc.babylonjs.com/features/featuresDeepDive/materials/using/moreMaterials
                 */
                this.vAng = (__runInitializers(this, _uAng_extraInitializers), __runInitializers(this, _vAng_initializers, 0));
                /**
                 * Define an offset on the texture to rotate around the w coordinates of the UVs (in case of 3d texture)
                 * The angle is defined in radians.
                 * @see https://doc.babylonjs.com/features/featuresDeepDive/materials/using/moreMaterials
                 */
                this.wAng = (__runInitializers(this, _vAng_extraInitializers), __runInitializers(this, _wAng_initializers, 0));
                /**
                 * Defines the center of rotation (U)
                 */
                this.uRotationCenter = (__runInitializers(this, _wAng_extraInitializers), __runInitializers(this, _uRotationCenter_initializers, 0.5));
                /**
                 * Defines the center of rotation (V)
                 */
                this.vRotationCenter = (__runInitializers(this, _uRotationCenter_extraInitializers), __runInitializers(this, _vRotationCenter_initializers, 0.5));
                /**
                 * Defines the center of rotation (W)
                 */
                this.wRotationCenter = (__runInitializers(this, _vRotationCenter_extraInitializers), __runInitializers(this, _wRotationCenter_initializers, 0.5));
                /**
                 * Sets this property to true to avoid deformations when rotating the texture with non-uniform scaling
                 */
                this.homogeneousRotationInUVTransform = (__runInitializers(this, _wRotationCenter_extraInitializers), __runInitializers(this, _homogeneousRotationInUVTransform_initializers, false));
                /**
                 * List of inspectable custom properties (used by the Inspector)
                 * @see https://doc.babylonjs.com/toolsAndResources/inspector#extensibility
                 */
                this.inspectableCustomProperties = (__runInitializers(this, _homogeneousRotationInUVTransform_extraInitializers), null);
                /** @internal */
                this._noMipmap = false;
                /** @internal */
                this._invertY = false;
                this._rowGenerationMatrix = null;
                this._cachedTextureMatrix = null;
                this._projectionModeMatrix = null;
                this._t0 = null;
                this._t1 = null;
                this._t2 = null;
                this._cachedUOffset = -1;
                this._cachedVOffset = -1;
                this._cachedUScale = 0;
                this._cachedVScale = 0;
                this._cachedUAng = -1;
                this._cachedVAng = -1;
                this._cachedWAng = -1;
                this._cachedReflectionProjectionMatrixId = -1;
                this._cachedURotationCenter = -1;
                this._cachedVRotationCenter = -1;
                this._cachedWRotationCenter = -1;
                this._cachedHomogeneousRotationInUVTransform = false;
                this._cachedIdentity3x2 = true;
                this._cachedReflectionTextureMatrix = null;
                this._cachedReflectionUOffset = -1;
                this._cachedReflectionVOffset = -1;
                this._cachedReflectionUScale = 0;
                this._cachedReflectionVScale = 0;
                this._cachedReflectionCoordinatesMode = -1;
                /** @internal */
                this._buffer = null;
                this._deleteBuffer = false;
                this._format = null;
                this._delayedOnLoad = null;
                this._delayedOnError = null;
                /**
                 * Observable triggered once the texture has been loaded.
                 */
                this.onLoadObservable = new Observable();
                this._isBlocking = true;
                this.name = url || "";
                this.url = url;
                let noMipmap;
                let useSRGBBuffer = false;
                let internalTexture = null;
                let gammaSpace = true;
                if (typeof noMipmapOrOptions === "object" && noMipmapOrOptions !== null) {
                    noMipmap = noMipmapOrOptions.noMipmap ?? false;
                    invertY = noMipmapOrOptions.invertY ?? !useOpenGLOrientationForUV;
                    samplingMode = noMipmapOrOptions.samplingMode ?? _a.TRILINEAR_SAMPLINGMODE;
                    onLoad = noMipmapOrOptions.onLoad ?? null;
                    onError = noMipmapOrOptions.onError ?? null;
                    buffer = noMipmapOrOptions.buffer ?? null;
                    deleteBuffer = noMipmapOrOptions.deleteBuffer ?? false;
                    format = noMipmapOrOptions.format;
                    mimeType = noMipmapOrOptions.mimeType;
                    loaderOptions = noMipmapOrOptions.loaderOptions;
                    creationFlags = noMipmapOrOptions.creationFlags;
                    useSRGBBuffer = noMipmapOrOptions.useSRGBBuffer ?? false;
                    internalTexture = noMipmapOrOptions.internalTexture ?? null;
                    gammaSpace = noMipmapOrOptions.gammaSpace ?? gammaSpace;
                    forcedExtension = noMipmapOrOptions.forcedExtension ?? forcedExtension;
                }
                else {
                    noMipmap = !!noMipmapOrOptions;
                }
                this._gammaSpace = gammaSpace;
                this._noMipmap = noMipmap;
                this._invertY = invertY === undefined ? !useOpenGLOrientationForUV : invertY;
                this._initialSamplingMode = samplingMode;
                this._buffer = buffer;
                this._deleteBuffer = deleteBuffer;
                this._mimeType = mimeType;
                this._loaderOptions = loaderOptions;
                this._creationFlags = creationFlags;
                this._useSRGBBuffer = useSRGBBuffer;
                this._forcedExtension = forcedExtension;
                if (format !== undefined) {
                    this._format = format;
                }
                const scene = this.getScene();
                const engine = this._getEngine();
                if (!engine) {
                    return;
                }
                engine.onBeforeTextureInitObservable.notifyObservers(this);
                const load = () => {
                    if (this._texture) {
                        if (this._texture._invertVScale) {
                            this.vScale *= -1;
                            this.vOffset += 1;
                        }
                        // Update texture to match internal texture's wrapping
                        if (this._texture._cachedWrapU !== null) {
                            this.wrapU = this._texture._cachedWrapU;
                            this._texture._cachedWrapU = null;
                        }
                        if (this._texture._cachedWrapV !== null) {
                            this.wrapV = this._texture._cachedWrapV;
                            this._texture._cachedWrapV = null;
                        }
                        if (this._texture._cachedWrapR !== null) {
                            this.wrapR = this._texture._cachedWrapR;
                            this._texture._cachedWrapR = null;
                        }
                    }
                    if (this.onLoadObservable.hasObservers()) {
                        this.onLoadObservable.notifyObservers(this);
                    }
                    if (onLoad) {
                        onLoad();
                    }
                    if (!this.isBlocking && scene) {
                        scene.resetCachedMaterial();
                    }
                };
                const errorHandler = (message, exception) => {
                    this._loadingError = true;
                    this._errorObject = { message, exception };
                    if (onError) {
                        onError(message, exception);
                    }
                    _a.OnTextureLoadErrorObservable.notifyObservers(this);
                };
                if (!this.url && !internalTexture) {
                    this._delayedOnLoad = load;
                    this._delayedOnError = errorHandler;
                    return;
                }
                this._texture = internalTexture ?? this._getFromCache(this.url, noMipmap, samplingMode, this._invertY, useSRGBBuffer, this.isCube);
                if (!this._texture) {
                    if (!scene || !scene.useDelayedTextureLoading) {
                        try {
                            this._texture = engine.createTexture(this.url, noMipmap, this._invertY, scene, samplingMode, load, errorHandler, this._buffer, undefined, this._format, this._forcedExtension, mimeType, loaderOptions, creationFlags, useSRGBBuffer);
                        }
                        catch (e) {
                            errorHandler("error loading", e);
                            throw e;
                        }
                        if (deleteBuffer) {
                            this._buffer = null;
                        }
                    }
                    else {
                        this.delayLoadState = 4;
                        this._delayedOnLoad = load;
                        this._delayedOnError = errorHandler;
                    }
                }
                else {
                    if (this._texture.isReady) {
                        TimingTools.SetImmediate(() => load());
                    }
                    else {
                        const loadObserver = this._texture.onLoadedObservable.add(load);
                        this._texture.onErrorObservable.add((e) => {
                            errorHandler(e.message, e.exception);
                            this._texture?.onLoadedObservable.remove(loadObserver);
                        });
                    }
                }
            }
            /**
             * Update the url (and optional buffer) of this texture if url was null during construction.
             * @param url the url of the texture
             * @param buffer the buffer of the texture (defaults to null)
             * @param onLoad callback called when the texture is loaded  (defaults to null)
             * @param forcedExtension defines the extension to use to pick the right loader
             */
            updateURL(url, buffer = null, onLoad, forcedExtension) {
                if (this.url) {
                    this.releaseInternalTexture();
                    this.getScene().markAllMaterialsAsDirty(1, (mat) => {
                        return mat.hasTexture(this);
                    });
                }
                if (!this.name || this.name.startsWith("data:")) {
                    this.name = url;
                }
                this.url = url;
                this._buffer = buffer;
                this._forcedExtension = forcedExtension;
                this.delayLoadState = 4;
                const existingOnLoad = this._delayedOnLoad;
                const load = () => {
                    if (existingOnLoad) {
                        existingOnLoad();
                    }
                    else if (this.onLoadObservable.hasObservers()) {
                        this.onLoadObservable.notifyObservers(this);
                    }
                    if (onLoad) {
                        onLoad();
                    }
                };
                this._delayedOnLoad = load;
                this.delayLoad();
            }
            /**
             * Finish the loading sequence of a texture flagged as delayed load.
             * @internal
             */
            delayLoad() {
                if (this.delayLoadState !== 4) {
                    return;
                }
                const scene = this.getScene();
                if (!scene) {
                    return;
                }
                let url = this.url;
                if (!url && (this.name.indexOf("://") > 0 || this.name.startsWith("data:"))) {
                    // Some textures are serialized with an empty url and use name instead for storing the url.
                    // When created without delayed load, the url is set properly because it is passed to the constructor and the texture is created right away.
                    // But when created with delayed load, the url property is overwritten to "" (because it is the value in the serialized data) when the properties are parsed (see SerializationHelper.Parse).
                    url = this.name;
                }
                this.delayLoadState = 1;
                this._texture = this._getFromCache(url, this._noMipmap, this.samplingMode, this._invertY, this._useSRGBBuffer, this.isCube);
                if (!this._texture) {
                    this._texture = scene
                        .getEngine()
                        .createTexture(url, this._noMipmap, this._invertY, scene, this.samplingMode, this._delayedOnLoad, this._delayedOnError, this._buffer, null, this._format, this._forcedExtension, this._mimeType, this._loaderOptions, this._creationFlags, this._useSRGBBuffer);
                    if (this._deleteBuffer) {
                        this._buffer = null;
                    }
                }
                else {
                    if (this._delayedOnLoad) {
                        if (this._texture.isReady) {
                            TimingTools.SetImmediate(this._delayedOnLoad);
                        }
                        else {
                            this._texture.onLoadedObservable.add(this._delayedOnLoad);
                        }
                    }
                }
                this._delayedOnLoad = null;
                this._delayedOnError = null;
            }
            _prepareRowForTextureGeneration(x, y, z, t) {
                x *= this._cachedUScale;
                y *= this._cachedVScale;
                x -= this.uRotationCenter * this._cachedUScale;
                y -= this.vRotationCenter * this._cachedVScale;
                z -= this.wRotationCenter;
                Vector3.TransformCoordinatesFromFloatsToRef(x, y, z, this._rowGenerationMatrix, t);
                t.x += this.uRotationCenter * this._cachedUScale + this._cachedUOffset;
                t.y += this.vRotationCenter * this._cachedVScale + this._cachedVOffset;
                t.z += this.wRotationCenter;
            }
            /**
             * Get the current texture matrix which includes the requested offsetting, tiling and rotation components.
             * @param uBase The horizontal base offset multiplier (1 by default)
             * @returns the transform matrix of the texture.
             */
            getTextureMatrix(uBase = 1) {
                if (this.uOffset === this._cachedUOffset &&
                    this.vOffset === this._cachedVOffset &&
                    this.uScale * uBase === this._cachedUScale &&
                    this.vScale === this._cachedVScale &&
                    this.uAng === this._cachedUAng &&
                    this.vAng === this._cachedVAng &&
                    this.wAng === this._cachedWAng &&
                    this.uRotationCenter === this._cachedURotationCenter &&
                    this.vRotationCenter === this._cachedVRotationCenter &&
                    this.wRotationCenter === this._cachedWRotationCenter &&
                    this.homogeneousRotationInUVTransform === this._cachedHomogeneousRotationInUVTransform) {
                    return this._cachedTextureMatrix;
                }
                this._cachedUOffset = this.uOffset;
                this._cachedVOffset = this.vOffset;
                this._cachedUScale = this.uScale * uBase;
                this._cachedVScale = this.vScale;
                this._cachedUAng = this.uAng;
                this._cachedVAng = this.vAng;
                this._cachedWAng = this.wAng;
                this._cachedURotationCenter = this.uRotationCenter;
                this._cachedVRotationCenter = this.vRotationCenter;
                this._cachedWRotationCenter = this.wRotationCenter;
                this._cachedHomogeneousRotationInUVTransform = this.homogeneousRotationInUVTransform;
                if (!this._cachedTextureMatrix || !this._rowGenerationMatrix) {
                    this._cachedTextureMatrix = Matrix.Zero();
                    this._rowGenerationMatrix = new Matrix();
                    this._t0 = Vector3.Zero();
                    this._t1 = Vector3.Zero();
                    this._t2 = Vector3.Zero();
                }
                Matrix.RotationYawPitchRollToRef(this.vAng, this.uAng, this.wAng, this._rowGenerationMatrix);
                if (this.homogeneousRotationInUVTransform) {
                    Matrix.TranslationToRef(-this._cachedURotationCenter, -this._cachedVRotationCenter, -this._cachedWRotationCenter, TmpVectors.Matrix[0]);
                    Matrix.TranslationToRef(this._cachedURotationCenter, this._cachedVRotationCenter, this._cachedWRotationCenter, TmpVectors.Matrix[1]);
                    Matrix.ScalingToRef(this._cachedUScale, this._cachedVScale, 0, TmpVectors.Matrix[2]);
                    Matrix.TranslationToRef(this._cachedUOffset, this._cachedVOffset, 0, TmpVectors.Matrix[3]);
                    TmpVectors.Matrix[0].multiplyToRef(this._rowGenerationMatrix, this._cachedTextureMatrix);
                    this._cachedTextureMatrix.multiplyToRef(TmpVectors.Matrix[1], this._cachedTextureMatrix);
                    this._cachedTextureMatrix.multiplyToRef(TmpVectors.Matrix[2], this._cachedTextureMatrix);
                    this._cachedTextureMatrix.multiplyToRef(TmpVectors.Matrix[3], this._cachedTextureMatrix);
                    // copy the translation row to the 3rd row of the matrix so that we don't need to update the shaders (which expects the translation to be on the 3rd row)
                    this._cachedTextureMatrix.setRowFromFloats(2, this._cachedTextureMatrix.m[12], this._cachedTextureMatrix.m[13], this._cachedTextureMatrix.m[14], 1);
                }
                else {
                    this._prepareRowForTextureGeneration(0, 0, 0, this._t0);
                    this._prepareRowForTextureGeneration(1.0, 0, 0, this._t1);
                    this._prepareRowForTextureGeneration(0, 1.0, 0, this._t2);
                    this._t1.subtractInPlace(this._t0);
                    this._t2.subtractInPlace(this._t0);
                    Matrix.FromValuesToRef(this._t1.x, this._t1.y, this._t1.z, 0.0, this._t2.x, this._t2.y, this._t2.z, 0.0, this._t0.x, this._t0.y, this._t0.z, 0.0, 0.0, 0.0, 0.0, 1.0, this._cachedTextureMatrix);
                }
                const scene = this.getScene();
                if (!scene) {
                    return this._cachedTextureMatrix;
                }
                const previousIdentity3x2 = this._cachedIdentity3x2;
                this._cachedIdentity3x2 = this._cachedTextureMatrix.isIdentityAs3x2();
                if (this.optimizeUVAllocation && previousIdentity3x2 !== this._cachedIdentity3x2) {
                    // We flag the materials that are using this texture as "texture dirty" because depending on the fact that the matrix is the identity or not, some defines
                    // will get different values (see PrepareDefinesForMergedUV), meaning we should regenerate the effect accordingly
                    scene.markAllMaterialsAsDirty(1, (mat) => {
                        return mat.hasTexture(this);
                    });
                }
                return this._cachedTextureMatrix;
            }
            /**
             * Get the current matrix used to apply reflection. This is useful to rotate an environment texture for instance.
             * @returns The reflection texture transform
             */
            getReflectionTextureMatrix() {
                const scene = this.getScene();
                if (!scene) {
                    return this._cachedReflectionTextureMatrix;
                }
                if (this.uOffset === this._cachedReflectionUOffset &&
                    this.vOffset === this._cachedReflectionVOffset &&
                    this.uScale === this._cachedReflectionUScale &&
                    this.vScale === this._cachedReflectionVScale &&
                    this.coordinatesMode === this._cachedReflectionCoordinatesMode) {
                    if (this.coordinatesMode === _a.PROJECTION_MODE) {
                        if (this._cachedReflectionProjectionMatrixId === scene.getProjectionMatrix().updateFlag) {
                            return this._cachedReflectionTextureMatrix;
                        }
                    }
                    else {
                        return this._cachedReflectionTextureMatrix;
                    }
                }
                if (!this._cachedReflectionTextureMatrix) {
                    this._cachedReflectionTextureMatrix = Matrix.Zero();
                }
                if (!this._projectionModeMatrix) {
                    this._projectionModeMatrix = Matrix.Zero();
                }
                const flagMaterialsAsTextureDirty = this._cachedReflectionCoordinatesMode !== this.coordinatesMode;
                this._cachedReflectionUOffset = this.uOffset;
                this._cachedReflectionVOffset = this.vOffset;
                this._cachedReflectionUScale = this.uScale;
                this._cachedReflectionVScale = this.vScale;
                this._cachedReflectionCoordinatesMode = this.coordinatesMode;
                switch (this.coordinatesMode) {
                    case _a.PLANAR_MODE: {
                        Matrix.IdentityToRef(this._cachedReflectionTextureMatrix);
                        this._cachedReflectionTextureMatrix[0] = this.uScale;
                        this._cachedReflectionTextureMatrix[5] = this.vScale;
                        this._cachedReflectionTextureMatrix[12] = this.uOffset;
                        this._cachedReflectionTextureMatrix[13] = this.vOffset;
                        break;
                    }
                    case _a.PROJECTION_MODE: {
                        Matrix.FromValuesToRef(0.5, 0.0, 0.0, 0.0, 0.0, -0.5, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.5, 0.5, 1.0, 1.0, this._projectionModeMatrix);
                        const projectionMatrix = scene.getProjectionMatrix();
                        this._cachedReflectionProjectionMatrixId = projectionMatrix.updateFlag;
                        projectionMatrix.multiplyToRef(this._projectionModeMatrix, this._cachedReflectionTextureMatrix);
                        break;
                    }
                    default:
                        Matrix.IdentityToRef(this._cachedReflectionTextureMatrix);
                        break;
                }
                if (flagMaterialsAsTextureDirty) {
                    // We flag the materials that are using this texture as "texture dirty" if the coordinatesMode has changed.
                    // Indeed, this property is used to set the value of some defines used to generate the effect (in material.isReadyForSubMesh), so we must make sure this code will be re-executed and the effect recreated if necessary
                    scene.markAllMaterialsAsDirty(1, (mat) => {
                        return mat.hasTexture(this);
                    });
                }
                return this._cachedReflectionTextureMatrix;
            }
            /**
             * Clones the texture.
             * @returns the cloned texture
             */
            clone() {
                const options = {
                    noMipmap: this._noMipmap,
                    invertY: this._invertY,
                    samplingMode: this.samplingMode,
                    onLoad: undefined,
                    onError: undefined,
                    buffer: this._texture ? this._texture._buffer : undefined,
                    deleteBuffer: this._deleteBuffer,
                    format: this.textureFormat,
                    mimeType: this.mimeType,
                    loaderOptions: this._loaderOptions,
                    creationFlags: this._creationFlags,
                    useSRGBBuffer: this._useSRGBBuffer,
                };
                return SerializationHelper.Clone(() => {
                    return new _a(this._texture ? this._texture.url : null, this.getScene(), options);
                }, this);
            }
            /**
             * Serialize the texture to a JSON representation we can easily use in the respective Parse function.
             * @returns The JSON representation of the texture
             */
            serialize() {
                const savedName = this.name;
                if (!_a.SerializeBuffers) {
                    if (this.name.startsWith("data:")) {
                        this.name = "";
                    }
                }
                if (this.name.startsWith("data:") && this.url === this.name) {
                    this.url = "";
                }
                const serializationObject = super.serialize(_a._SerializeInternalTextureUniqueId);
                if (!serializationObject) {
                    return null;
                }
                if (_a.SerializeBuffers || _a.ForceSerializeBuffers) {
                    if (typeof this._buffer === "string" && this._buffer.startsWith("data:")) {
                        serializationObject.base64String = this._buffer;
                        serializationObject.name = serializationObject.name.replace("data:", "");
                    }
                    else if (this.url && this.url.startsWith("data:") && this._buffer instanceof Uint8Array) {
                        const mimeType = this.mimeType || "image/png";
                        serializationObject.base64String = `data:${mimeType};base64,${EncodeArrayBufferToBase64(this._buffer)}`;
                    }
                    else if (_a.ForceSerializeBuffers || (this.url && this.url.startsWith("blob:")) || this._forceSerialize) {
                        serializationObject.base64String =
                            !this._engine || this._engine._features.supportSyncTextureRead ? GenerateBase64StringFromTexture(this) : GenerateBase64StringFromTextureAsync(this);
                    }
                }
                serializationObject.invertY = this._invertY;
                serializationObject.samplingMode = this.samplingMode;
                serializationObject._creationFlags = this._creationFlags;
                serializationObject._useSRGBBuffer = this._useSRGBBuffer;
                if (_a._SerializeInternalTextureUniqueId) {
                    serializationObject.internalTextureUniqueId = this._texture?.uniqueId;
                }
                serializationObject.internalTextureLabel = this._texture?.label;
                serializationObject.noMipmap = this._noMipmap;
                this.name = savedName;
                return serializationObject;
            }
            /**
             * Get the current class name of the texture useful for serialization or dynamic coding.
             * @returns "Texture"
             */
            getClassName() {
                return "Texture";
            }
            /**
             * Dispose the texture and release its associated resources.
             */
            dispose() {
                super.dispose();
                this.onLoadObservable.clear();
                this._delayedOnLoad = null;
                this._delayedOnError = null;
                this._buffer = null;
            }
            /**
             * Parse the JSON representation of a texture in order to recreate the texture in the given scene.
             * @param parsedTexture Define the JSON representation of the texture
             * @param scene Define the scene the parsed texture should be instantiated in
             * @param rootUrl Define the root url of the parsing sequence in the case of relative dependencies
             * @returns The parsed texture if successful
             */
            static Parse(parsedTexture, scene, rootUrl) {
                if (parsedTexture.customType) {
                    const customTexture = InstantiationTools.Instantiate(parsedTexture.customType);
                    // Update Sampling Mode
                    const parsedCustomTexture = customTexture.Parse(parsedTexture, scene, rootUrl);
                    if (parsedTexture.samplingMode && parsedCustomTexture.updateSamplingMode && parsedCustomTexture._samplingMode) {
                        if (parsedCustomTexture._samplingMode !== parsedTexture.samplingMode) {
                            parsedCustomTexture.updateSamplingMode(parsedTexture.samplingMode);
                        }
                    }
                    return parsedCustomTexture;
                }
                if (parsedTexture.isCube && !parsedTexture.isRenderTarget) {
                    return _a._CubeTextureParser(parsedTexture, scene, rootUrl);
                }
                const hasInternalTextureUniqueId = parsedTexture.internalTextureUniqueId !== undefined;
                if (!parsedTexture.name && !parsedTexture.isRenderTarget && !hasInternalTextureUniqueId) {
                    return null;
                }
                let internalTexture;
                if (hasInternalTextureUniqueId) {
                    const cache = scene.getEngine().getLoadedTexturesCache();
                    for (const texture of cache) {
                        if (texture.uniqueId === parsedTexture.internalTextureUniqueId) {
                            internalTexture = texture;
                            break;
                        }
                    }
                }
                const onLoaded = (texture) => {
                    // Clear cache
                    if (texture && texture._texture) {
                        texture._texture._cachedWrapU = null;
                        texture._texture._cachedWrapV = null;
                        texture._texture._cachedWrapR = null;
                    }
                    // Update Sampling Mode
                    if (parsedTexture.samplingMode) {
                        const sampling = parsedTexture.samplingMode;
                        if (texture && texture.samplingMode !== sampling) {
                            texture.updateSamplingMode(sampling);
                        }
                    }
                    // Animations
                    if (texture && parsedTexture.animations) {
                        for (let animationIndex = 0; animationIndex < parsedTexture.animations.length; animationIndex++) {
                            const parsedAnimation = parsedTexture.animations[animationIndex];
                            const internalClass = GetClass("BABYLON.Animation");
                            if (internalClass) {
                                texture.animations.push(internalClass.Parse(parsedAnimation));
                            }
                        }
                    }
                    if (texture && texture._texture) {
                        if (hasInternalTextureUniqueId && !internalTexture) {
                            texture._texture._setUniqueId(parsedTexture.internalTextureUniqueId);
                        }
                        texture._texture.label = parsedTexture.internalTextureLabel;
                    }
                };
                const texture = SerializationHelper.Parse(() => {
                    let generateMipMaps = true;
                    if (parsedTexture.noMipmap) {
                        generateMipMaps = false;
                    }
                    if (parsedTexture.mirrorPlane) {
                        const mirrorTexture = _a._CreateMirror(parsedTexture.name, parsedTexture.renderTargetSize, scene, generateMipMaps);
                        mirrorTexture._waitingRenderList = parsedTexture.renderList;
                        mirrorTexture.mirrorPlane = Plane.FromArray(parsedTexture.mirrorPlane);
                        onLoaded(mirrorTexture);
                        return mirrorTexture;
                    }
                    else if (parsedTexture.isRenderTarget && !parsedTexture.base64String) {
                        // if base64string is set it means the original RTT was baked
                        let renderTargetTexture = null;
                        if (parsedTexture.isCube) {
                            // Search for an existing reflection probe (which contains a cube render target texture)
                            if (scene.reflectionProbes) {
                                for (let index = 0; index < scene.reflectionProbes.length; index++) {
                                    const probe = scene.reflectionProbes[index];
                                    if (probe.name === parsedTexture.name) {
                                        return probe.cubeTexture;
                                    }
                                }
                            }
                        }
                        else {
                            renderTargetTexture = _a._CreateRenderTargetTexture(parsedTexture.name, parsedTexture.renderTargetSize, scene, generateMipMaps, parsedTexture._creationFlags ?? 0);
                            renderTargetTexture._waitingRenderList = parsedTexture.renderList;
                        }
                        onLoaded(renderTargetTexture);
                        return renderTargetTexture;
                    }
                    else if (parsedTexture.isVideo) {
                        const texture = _a._CreateVideoTexture(rootUrl + (parsedTexture.url || parsedTexture.name), rootUrl + (parsedTexture.src || parsedTexture.url), scene, generateMipMaps, parsedTexture.invertY, parsedTexture.samplingMode, parsedTexture.settings || {});
                        onLoaded(texture);
                        return texture;
                    }
                    else {
                        let texture;
                        if (typeof parsedTexture.base64String === "string" && parsedTexture.base64String && !internalTexture) {
                            const options = {
                                buffer: parsedTexture.base64String,
                                noMipmap: !generateMipMaps,
                                invertY: parsedTexture.invertY,
                                samplingMode: parsedTexture.samplingMode,
                                useSRGBBuffer: parsedTexture._useSRGBBuffer ?? false,
                                creationFlags: parsedTexture._creationFlags ?? 0,
                                onLoad: () => {
                                    onLoaded(texture);
                                },
                            };
                            // use the base64 string as the texture name for caching; the actual payload comes from options.buffer
                            const base64String = parsedTexture.base64String;
                            const noPrefixBase64String = base64String.startsWith("data:") ? base64String.substring(5) : base64String;
                            texture = _a.CreateFromBase64String("", noPrefixBase64String, scene, options);
                            // prettier name to fit with the loaded data
                            texture.name = parsedTexture.name;
                        }
                        else {
                            let url;
                            if (parsedTexture.name && (parsedTexture.name.indexOf("://") > 0 || parsedTexture.name.startsWith("data:"))) {
                                url = parsedTexture.name;
                            }
                            else {
                                url = rootUrl + parsedTexture.name;
                            }
                            if (parsedTexture.url && (parsedTexture.url.startsWith("data:") || _a.UseSerializedUrlIfAny)) {
                                url = parsedTexture.url;
                            }
                            const options = {
                                noMipmap: !generateMipMaps,
                                invertY: parsedTexture.invertY,
                                samplingMode: parsedTexture.samplingMode,
                                useSRGBBuffer: parsedTexture._useSRGBBuffer ?? false,
                                creationFlags: parsedTexture._creationFlags ?? 0,
                                onLoad: () => {
                                    onLoaded(texture);
                                },
                                internalTexture,
                            };
                            texture = new _a(url, scene, options);
                        }
                        return texture;
                    }
                }, parsedTexture, scene);
                return texture;
            }
            /**
             * Creates a texture from its base 64 representation.
             * @param data Define the base64 payload without the data: prefix
             * @param name Define the name of the texture in the scene useful fo caching purpose for instance
             * @param scene Define the scene the texture should belong to
             * @param noMipmapOrOptions defines if the texture will require mip maps or not or set of all options to create the texture
             * @param invertY define if the texture needs to be inverted on the y axis during loading
             * @param samplingMode define the sampling mode we want for the texture while fetching from it (Texture.NEAREST_SAMPLINGMODE...)
             * @param onLoad define a callback triggered when the texture has been loaded
             * @param onError define a callback triggered when an error occurred during the loading session
             * @param format define the format of the texture we are trying to load (Engine.TEXTUREFORMAT_RGBA...)
             * @param creationFlags specific flags to use when creating the texture (1 for storage textures, for eg)
             * @param forcedExtension defines the extension to use to pick the right loader
             * @returns the created texture
             */
            static CreateFromBase64String(data, name, scene, noMipmapOrOptions, invertY, samplingMode = _a.TRILINEAR_SAMPLINGMODE, onLoad = null, onError = null, format = 5, creationFlags, forcedExtension) {
                return new _a("data:" + name, scene, noMipmapOrOptions, invertY, samplingMode, onLoad, onError, data, false, format, undefined, undefined, creationFlags, forcedExtension);
            }
            /**
             * Creates a texture from its data: representation. (data: will be added in case only the payload has been passed in)
             * @param name Define the name of the texture in the scene useful fo caching purpose for instance
             * @param buffer define the buffer to load the texture from in case the texture is loaded from a buffer representation
             * @param scene Define the scene the texture should belong to
             * @param deleteBuffer define if the buffer we are loading the texture from should be deleted after load
             * @param noMipmapOrOptions defines if the texture will require mip maps or not or set of all options to create the texture
             * @param invertY define if the texture needs to be inverted on the y axis during loading
             * @param samplingMode define the sampling mode we want for the texture while fetching from it (Texture.NEAREST_SAMPLINGMODE...)
             * @param onLoad define a callback triggered when the texture has been loaded
             * @param onError define a callback triggered when an error occurred during the loading session
             * @param format define the format of the texture we are trying to load (Engine.TEXTUREFORMAT_RGBA...)
             * @param creationFlags specific flags to use when creating the texture (1 for storage textures, for eg)
             * @param forcedExtension defines the extension to use to pick the right loader
             * @returns the created texture
             */
            static LoadFromDataString(name, buffer, scene, deleteBuffer = false, noMipmapOrOptions, invertY = true, samplingMode = _a.TRILINEAR_SAMPLINGMODE, onLoad = null, onError = null, format = 5, creationFlags, forcedExtension) {
                if (name.substring(0, 5) !== "data:") {
                    name = "data:" + name;
                }
                return new _a(name, scene, noMipmapOrOptions, invertY, samplingMode, onLoad, onError, buffer, deleteBuffer, format, undefined, undefined, creationFlags, forcedExtension);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _url_decorators = [serialize()];
            _uOffset_decorators = [serialize()];
            _vOffset_decorators = [serialize()];
            _uScale_decorators = [serialize()];
            _vScale_decorators = [serialize()];
            _uAng_decorators = [serialize()];
            _vAng_decorators = [serialize()];
            _wAng_decorators = [serialize()];
            _uRotationCenter_decorators = [serialize()];
            _vRotationCenter_decorators = [serialize()];
            _wRotationCenter_decorators = [serialize()];
            _homogeneousRotationInUVTransform_decorators = [serialize()];
            _get_isBlocking_decorators = [serialize()];
            __esDecorate(_a, null, _get_isBlocking_decorators, { kind: "getter", name: "isBlocking", static: false, private: false, access: { has: obj => "isBlocking" in obj, get: obj => obj.isBlocking }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(null, null, _url_decorators, { kind: "field", name: "url", static: false, private: false, access: { has: obj => "url" in obj, get: obj => obj.url, set: (obj, value) => { obj.url = value; } }, metadata: _metadata }, _url_initializers, _url_extraInitializers);
            __esDecorate(null, null, _uOffset_decorators, { kind: "field", name: "uOffset", static: false, private: false, access: { has: obj => "uOffset" in obj, get: obj => obj.uOffset, set: (obj, value) => { obj.uOffset = value; } }, metadata: _metadata }, _uOffset_initializers, _uOffset_extraInitializers);
            __esDecorate(null, null, _vOffset_decorators, { kind: "field", name: "vOffset", static: false, private: false, access: { has: obj => "vOffset" in obj, get: obj => obj.vOffset, set: (obj, value) => { obj.vOffset = value; } }, metadata: _metadata }, _vOffset_initializers, _vOffset_extraInitializers);
            __esDecorate(null, null, _uScale_decorators, { kind: "field", name: "uScale", static: false, private: false, access: { has: obj => "uScale" in obj, get: obj => obj.uScale, set: (obj, value) => { obj.uScale = value; } }, metadata: _metadata }, _uScale_initializers, _uScale_extraInitializers);
            __esDecorate(null, null, _vScale_decorators, { kind: "field", name: "vScale", static: false, private: false, access: { has: obj => "vScale" in obj, get: obj => obj.vScale, set: (obj, value) => { obj.vScale = value; } }, metadata: _metadata }, _vScale_initializers, _vScale_extraInitializers);
            __esDecorate(null, null, _uAng_decorators, { kind: "field", name: "uAng", static: false, private: false, access: { has: obj => "uAng" in obj, get: obj => obj.uAng, set: (obj, value) => { obj.uAng = value; } }, metadata: _metadata }, _uAng_initializers, _uAng_extraInitializers);
            __esDecorate(null, null, _vAng_decorators, { kind: "field", name: "vAng", static: false, private: false, access: { has: obj => "vAng" in obj, get: obj => obj.vAng, set: (obj, value) => { obj.vAng = value; } }, metadata: _metadata }, _vAng_initializers, _vAng_extraInitializers);
            __esDecorate(null, null, _wAng_decorators, { kind: "field", name: "wAng", static: false, private: false, access: { has: obj => "wAng" in obj, get: obj => obj.wAng, set: (obj, value) => { obj.wAng = value; } }, metadata: _metadata }, _wAng_initializers, _wAng_extraInitializers);
            __esDecorate(null, null, _uRotationCenter_decorators, { kind: "field", name: "uRotationCenter", static: false, private: false, access: { has: obj => "uRotationCenter" in obj, get: obj => obj.uRotationCenter, set: (obj, value) => { obj.uRotationCenter = value; } }, metadata: _metadata }, _uRotationCenter_initializers, _uRotationCenter_extraInitializers);
            __esDecorate(null, null, _vRotationCenter_decorators, { kind: "field", name: "vRotationCenter", static: false, private: false, access: { has: obj => "vRotationCenter" in obj, get: obj => obj.vRotationCenter, set: (obj, value) => { obj.vRotationCenter = value; } }, metadata: _metadata }, _vRotationCenter_initializers, _vRotationCenter_extraInitializers);
            __esDecorate(null, null, _wRotationCenter_decorators, { kind: "field", name: "wRotationCenter", static: false, private: false, access: { has: obj => "wRotationCenter" in obj, get: obj => obj.wRotationCenter, set: (obj, value) => { obj.wRotationCenter = value; } }, metadata: _metadata }, _wRotationCenter_initializers, _wRotationCenter_extraInitializers);
            __esDecorate(null, null, _homogeneousRotationInUVTransform_decorators, { kind: "field", name: "homogeneousRotationInUVTransform", static: false, private: false, access: { has: obj => "homogeneousRotationInUVTransform" in obj, get: obj => obj.homogeneousRotationInUVTransform, set: (obj, value) => { obj.homogeneousRotationInUVTransform = value; } }, metadata: _metadata }, _homogeneousRotationInUVTransform_initializers, _homogeneousRotationInUVTransform_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        /**
         * Gets or sets a general boolean used to indicate that textures containing direct data (buffers) must be saved as part of the serialization process
         */
        _a.SerializeBuffers = true,
        /**
         * Gets or sets a general boolean used to indicate that texture buffers must be saved as part of the serialization process.
         * If no buffer exists, one will be created as base64 string from the internal webgl data.
         */
        _a.ForceSerializeBuffers = false,
        /**
         * This observable will notify when any texture had a loading error
         */
        _a.OnTextureLoadErrorObservable = new Observable(),
        /** @internal */
        _a._SerializeInternalTextureUniqueId = false,
        /**
         * @internal
         */
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        _a._CubeTextureParser = (jsonTexture, scene, rootUrl) => {
            throw _WarnImport("CubeTexture");
        },
        /**
         * @internal
         */
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        _a._CreateMirror = (name, renderTargetSize, scene, generateMipMaps) => {
            throw _WarnImport("MirrorTexture");
        },
        /**
         * @internal
         */
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        _a._CreateRenderTargetTexture = (name, renderTargetSize, scene, generateMipMaps, creationFlags) => {
            throw _WarnImport("RenderTargetTexture");
        },
        /** nearest is mag = nearest and min = nearest and no mip */
        _a.NEAREST_SAMPLINGMODE = 1,
        /** nearest is mag = nearest and min = nearest and mip = linear */
        _a.NEAREST_NEAREST_MIPLINEAR = 8 // nearest is mag = nearest and min = nearest and mip = linear
    ,
        /** Bilinear is mag = linear and min = linear and no mip */
        _a.BILINEAR_SAMPLINGMODE = 2,
        /** Bilinear is mag = linear and min = linear and mip = nearest */
        _a.LINEAR_LINEAR_MIPNEAREST = 11 // Bilinear is mag = linear and min = linear and mip = nearest
    ,
        /** Trilinear is mag = linear and min = linear and mip = linear */
        _a.TRILINEAR_SAMPLINGMODE = 3,
        /** Trilinear is mag = linear and min = linear and mip = linear */
        _a.LINEAR_LINEAR_MIPLINEAR = 3 // Trilinear is mag = linear and min = linear and mip = linear
    ,
        /** mag = nearest and min = nearest and mip = nearest */
        _a.NEAREST_NEAREST_MIPNEAREST = 4,
        /** mag = nearest and min = linear and mip = nearest */
        _a.NEAREST_LINEAR_MIPNEAREST = 5,
        /** mag = nearest and min = linear and mip = linear */
        _a.NEAREST_LINEAR_MIPLINEAR = 6,
        /** mag = nearest and min = linear and mip = none */
        _a.NEAREST_LINEAR = 7,
        /** mag = nearest and min = nearest and mip = none */
        _a.NEAREST_NEAREST = 1,
        /** mag = linear and min = nearest and mip = nearest */
        _a.LINEAR_NEAREST_MIPNEAREST = 9,
        /** mag = linear and min = nearest and mip = linear */
        _a.LINEAR_NEAREST_MIPLINEAR = 10,
        /** mag = linear and min = linear and mip = none */
        _a.LINEAR_LINEAR = 2,
        /** mag = linear and min = nearest and mip = none */
        _a.LINEAR_NEAREST = 12,
        /** Explicit coordinates mode */
        _a.EXPLICIT_MODE = 0,
        /** Spherical coordinates mode */
        _a.SPHERICAL_MODE = 1,
        /** Planar coordinates mode */
        _a.PLANAR_MODE = 2,
        /** Cubic coordinates mode */
        _a.CUBIC_MODE = 3,
        /** Projection coordinates mode */
        _a.PROJECTION_MODE = 4,
        /** Inverse Cubic coordinates mode */
        _a.SKYBOX_MODE = 5,
        /** Inverse Cubic coordinates mode */
        _a.INVCUBIC_MODE = 6,
        /** Equirectangular coordinates mode */
        _a.EQUIRECTANGULAR_MODE = 7,
        /** Equirectangular Fixed coordinates mode */
        _a.FIXED_EQUIRECTANGULAR_MODE = 8,
        /** Equirectangular Fixed Mirrored coordinates mode */
        _a.FIXED_EQUIRECTANGULAR_MIRRORED_MODE = 9,
        /** Texture is not repeating outside of 0..1 UVs */
        _a.CLAMP_ADDRESSMODE = 0,
        /** Texture is repeating outside of 0..1 UVs */
        _a.WRAP_ADDRESSMODE = 1,
        /** Texture is repeating and mirrored */
        _a.MIRROR_ADDRESSMODE = 2,
        /**
         * Gets or sets a boolean which defines if the texture url must be build from the serialized URL instead of just using the name and loading them side by side with the scene file
         */
        _a.UseSerializedUrlIfAny = false,
        _a;
})();
export { Texture };
let _Registered = false;
/**
 * Register side effects for texture.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterTexture() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    // References the dependencies.
    RegisterClass("BABYLON.Texture", Texture);
    SerializationHelper._TextureParser = Texture.Parse;
}
//# sourceMappingURL=texture.pure.js.map