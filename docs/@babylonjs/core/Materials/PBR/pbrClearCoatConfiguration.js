import { __classPrivateFieldGet, __classPrivateFieldSet, __esDecorate, __runInitializers } from "../../tslib.es6.js";
import { serialize, serializeAsTexture, expandToProperty, serializeAsColor3 } from "../../Misc/decorators.js";
import { Color3 } from "../../Maths/math.color.pure.js";
import { MaterialFlags } from "../materialFlags.js";

import { MaterialPluginBase } from "../materialPluginBase.pure.js";
import { MaterialDefines } from "../materialDefines.js";
import { BindTextureMatrix, PrepareDefinesForMergedUV } from "../materialHelper.functions.js";
/**
 * @internal
 */
export class MaterialClearCoatDefines extends MaterialDefines {
    constructor() {
        super(...arguments);
        this.CLEARCOAT = false;
        this.CLEARCOAT_DEFAULTIOR = false;
        this.CLEARCOAT_TEXTURE = false;
        this.CLEARCOAT_TEXTURE_ROUGHNESS = false;
        this.CLEARCOAT_TEXTUREDIRECTUV = 0;
        this.CLEARCOAT_TEXTURE_ROUGHNESSDIRECTUV = 0;
        this.CLEARCOAT_BUMP = false;
        this.CLEARCOAT_BUMPDIRECTUV = 0;
        this.CLEARCOAT_USE_ROUGHNESS_FROM_MAINTEXTURE = false;
        this.CLEARCOAT_REMAP_F0 = false;
        this.CLEARCOAT_TINT = false;
        this.CLEARCOAT_TINT_TEXTURE = false;
        this.CLEARCOAT_TINT_TEXTUREDIRECTUV = 0;
        this.CLEARCOAT_TINT_GAMMATEXTURE = false;
    }
}
/**
 * Plugin that implements the clear coat component of the PBR material
 */
let PBRClearCoatConfiguration = (() => {
    var _a, _PBRClearCoatConfiguration_isEnabled_accessor_storage, _PBRClearCoatConfiguration_indexOfRefraction_accessor_storage, _PBRClearCoatConfiguration_texture_accessor_storage, _PBRClearCoatConfiguration_useRoughnessFromMainTexture_accessor_storage, _PBRClearCoatConfiguration_textureRoughness_accessor_storage, _PBRClearCoatConfiguration_remapF0OnInterfaceChange_accessor_storage, _PBRClearCoatConfiguration_bumpTexture_accessor_storage, _PBRClearCoatConfiguration_isTintEnabled_accessor_storage, _PBRClearCoatConfiguration_tintTexture_accessor_storage;
    let _classSuper = MaterialPluginBase;
    let _isEnabled_decorators;
    let _isEnabled_initializers = [];
    let _isEnabled_extraInitializers = [];
    let _intensity_decorators;
    let _intensity_initializers = [];
    let _intensity_extraInitializers = [];
    let _roughness_decorators;
    let _roughness_initializers = [];
    let _roughness_extraInitializers = [];
    let _indexOfRefraction_decorators;
    let _indexOfRefraction_initializers = [];
    let _indexOfRefraction_extraInitializers = [];
    let _texture_decorators;
    let _texture_initializers = [];
    let _texture_extraInitializers = [];
    let _useRoughnessFromMainTexture_decorators;
    let _useRoughnessFromMainTexture_initializers = [];
    let _useRoughnessFromMainTexture_extraInitializers = [];
    let _textureRoughness_decorators;
    let _textureRoughness_initializers = [];
    let _textureRoughness_extraInitializers = [];
    let _remapF0OnInterfaceChange_decorators;
    let _remapF0OnInterfaceChange_initializers = [];
    let _remapF0OnInterfaceChange_extraInitializers = [];
    let _bumpTexture_decorators;
    let _bumpTexture_initializers = [];
    let _bumpTexture_extraInitializers = [];
    let _isTintEnabled_decorators;
    let _isTintEnabled_initializers = [];
    let _isTintEnabled_extraInitializers = [];
    let _tintColor_decorators;
    let _tintColor_initializers = [];
    let _tintColor_extraInitializers = [];
    let _tintColorAtDistance_decorators;
    let _tintColorAtDistance_initializers = [];
    let _tintColorAtDistance_extraInitializers = [];
    let _tintThickness_decorators;
    let _tintThickness_initializers = [];
    let _tintThickness_extraInitializers = [];
    let _tintTexture_decorators;
    let _tintTexture_initializers = [];
    let _tintTexture_extraInitializers = [];
    return _a = class PBRClearCoatConfiguration extends _classSuper {
            /**
             * Defines if the clear coat is enabled in the material.
             */
            get isEnabled() { return __classPrivateFieldGet(this, _PBRClearCoatConfiguration_isEnabled_accessor_storage, "f"); }
            set isEnabled(value) { __classPrivateFieldSet(this, _PBRClearCoatConfiguration_isEnabled_accessor_storage, value, "f"); }
            /**
             * Defines the index of refraction of the clear coat.
             * This defaults to 1.5 corresponding to a 0.04 f0 or a 4% reflectance at normal incidence
             * The default fits with a polyurethane material.
             * Changing the default value is more performance intensive.
             */
            get indexOfRefraction() { return __classPrivateFieldGet(this, _PBRClearCoatConfiguration_indexOfRefraction_accessor_storage, "f"); }
            set indexOfRefraction(value) { __classPrivateFieldSet(this, _PBRClearCoatConfiguration_indexOfRefraction_accessor_storage, value, "f"); }
            /**
             * Stores the clear coat values in a texture (red channel is intensity and green channel is roughness)
             * If useRoughnessFromMainTexture is false, the green channel of texture is not used and the green channel of textureRoughness is used instead
             * if textureRoughness is not empty, else no texture roughness is used
             */
            get texture() { return __classPrivateFieldGet(this, _PBRClearCoatConfiguration_texture_accessor_storage, "f"); }
            set texture(value) { __classPrivateFieldSet(this, _PBRClearCoatConfiguration_texture_accessor_storage, value, "f"); }
            /**
             * Indicates that the green channel of the texture property will be used for roughness (default: true)
             * If false, the green channel from textureRoughness is used for roughness
             */
            get useRoughnessFromMainTexture() { return __classPrivateFieldGet(this, _PBRClearCoatConfiguration_useRoughnessFromMainTexture_accessor_storage, "f"); }
            set useRoughnessFromMainTexture(value) { __classPrivateFieldSet(this, _PBRClearCoatConfiguration_useRoughnessFromMainTexture_accessor_storage, value, "f"); }
            /**
             * Stores the clear coat roughness in a texture (green channel)
             * Not used if useRoughnessFromMainTexture is true
             */
            get textureRoughness() { return __classPrivateFieldGet(this, _PBRClearCoatConfiguration_textureRoughness_accessor_storage, "f"); }
            set textureRoughness(value) { __classPrivateFieldSet(this, _PBRClearCoatConfiguration_textureRoughness_accessor_storage, value, "f"); }
            /**
             * Defines if the F0 value should be remapped to account for the interface change in the material.
             */
            get remapF0OnInterfaceChange() { return __classPrivateFieldGet(this, _PBRClearCoatConfiguration_remapF0OnInterfaceChange_accessor_storage, "f"); }
            set remapF0OnInterfaceChange(value) { __classPrivateFieldSet(this, _PBRClearCoatConfiguration_remapF0OnInterfaceChange_accessor_storage, value, "f"); }
            /**
             * Define the clear coat specific bump texture.
             */
            get bumpTexture() { return __classPrivateFieldGet(this, _PBRClearCoatConfiguration_bumpTexture_accessor_storage, "f"); }
            set bumpTexture(value) { __classPrivateFieldSet(this, _PBRClearCoatConfiguration_bumpTexture_accessor_storage, value, "f"); }
            /**
             * Defines if the clear coat tint is enabled in the material.
             */
            get isTintEnabled() { return __classPrivateFieldGet(this, _PBRClearCoatConfiguration_isTintEnabled_accessor_storage, "f"); }
            set isTintEnabled(value) { __classPrivateFieldSet(this, _PBRClearCoatConfiguration_isTintEnabled_accessor_storage, value, "f"); }
            /**
             * Stores the clear tint values in a texture.
             * rgb is tint
             * a is a thickness factor
             */
            get tintTexture() { return __classPrivateFieldGet(this, _PBRClearCoatConfiguration_tintTexture_accessor_storage, "f"); }
            set tintTexture(value) { __classPrivateFieldSet(this, _PBRClearCoatConfiguration_tintTexture_accessor_storage, value, "f"); }
            /** @internal */
            _markAllSubMeshesAsTexturesDirty() {
                this._enable(this._isEnabled);
                this._internalMarkAllSubMeshesAsTexturesDirty();
            }
            /**
             * Gets a boolean indicating that the plugin is compatible with a given shader language.
             * @returns true if the plugin is compatible with the shader language
             */
            isCompatible() {
                return true;
            }
            constructor(material, addToPluginList = true) {
                super(material, "PBRClearCoat", 100, new MaterialClearCoatDefines(), addToPluginList);
                this._isEnabled = false;
                _PBRClearCoatConfiguration_isEnabled_accessor_storage.set(this, __runInitializers(this, _isEnabled_initializers, false));
                /**
                 * Defines the clear coat layer strength (between 0 and 1) it defaults to 1.
                 */
                this.intensity = (__runInitializers(this, _isEnabled_extraInitializers), __runInitializers(this, _intensity_initializers, 1));
                /**
                 * Defines the clear coat layer roughness.
                 */
                this.roughness = (__runInitializers(this, _intensity_extraInitializers), __runInitializers(this, _roughness_initializers, 0));
                this._indexOfRefraction = (__runInitializers(this, _roughness_extraInitializers), _a._DefaultIndexOfRefraction);
                _PBRClearCoatConfiguration_indexOfRefraction_accessor_storage.set(this, __runInitializers(this, _indexOfRefraction_initializers, _a._DefaultIndexOfRefraction));
                this._texture = (__runInitializers(this, _indexOfRefraction_extraInitializers), null);
                _PBRClearCoatConfiguration_texture_accessor_storage.set(this, __runInitializers(this, _texture_initializers, null));
                this._useRoughnessFromMainTexture = (__runInitializers(this, _texture_extraInitializers), true);
                _PBRClearCoatConfiguration_useRoughnessFromMainTexture_accessor_storage.set(this, __runInitializers(this, _useRoughnessFromMainTexture_initializers, true));
                this._textureRoughness = (__runInitializers(this, _useRoughnessFromMainTexture_extraInitializers), null);
                _PBRClearCoatConfiguration_textureRoughness_accessor_storage.set(this, __runInitializers(this, _textureRoughness_initializers, null));
                this._remapF0OnInterfaceChange = (__runInitializers(this, _textureRoughness_extraInitializers), true);
                _PBRClearCoatConfiguration_remapF0OnInterfaceChange_accessor_storage.set(this, __runInitializers(this, _remapF0OnInterfaceChange_initializers, true));
                this._bumpTexture = (__runInitializers(this, _remapF0OnInterfaceChange_extraInitializers), null);
                _PBRClearCoatConfiguration_bumpTexture_accessor_storage.set(this, __runInitializers(this, _bumpTexture_initializers, null));
                this._isTintEnabled = (__runInitializers(this, _bumpTexture_extraInitializers), false);
                _PBRClearCoatConfiguration_isTintEnabled_accessor_storage.set(this, __runInitializers(this, _isTintEnabled_initializers, false));
                /**
                 * Defines the clear coat tint of the material.
                 * This is only use if tint is enabled
                 */
                this.tintColor = (__runInitializers(this, _isTintEnabled_extraInitializers), __runInitializers(this, _tintColor_initializers, Color3.White()));
                /**
                 * Defines the distance at which the tint color should be found in the
                 * clear coat media.
                 * This is only use if tint is enabled
                 */
                this.tintColorAtDistance = (__runInitializers(this, _tintColor_extraInitializers), __runInitializers(this, _tintColorAtDistance_initializers, 1));
                /**
                 * Defines the clear coat layer thickness.
                 * This is only use if tint is enabled
                 */
                this.tintThickness = (__runInitializers(this, _tintColorAtDistance_extraInitializers), __runInitializers(this, _tintThickness_initializers, 1));
                this._tintTexture = (__runInitializers(this, _tintThickness_extraInitializers), null);
                _PBRClearCoatConfiguration_tintTexture_accessor_storage.set(this, __runInitializers(this, _tintTexture_initializers, null));
                /** @internal */
                this._internalMarkAllSubMeshesAsTexturesDirty = __runInitializers(this, _tintTexture_extraInitializers);
                this._internalMarkAllSubMeshesAsTexturesDirty = material._dirtyCallbacks[1];
            }
            /**
             * Checks whether the clear coat textures are ready for the sub mesh.
             * @param defines defines the material defines to inspect
             * @param scene defines the scene to use for readiness checks
             * @param engine defines the engine to use for readiness checks
             * @returns true if clear coat is ready
             */
            isReadyForSubMesh(defines, scene, engine) {
                if (!this._isEnabled) {
                    return true;
                }
                const disableBumpMap = this._material._disableBumpMap;
                if (defines._areTexturesDirty) {
                    if (scene.texturesEnabled) {
                        if (this._texture && MaterialFlags.ClearCoatTextureEnabled) {
                            if (!this._texture.isReadyOrNotBlocking()) {
                                return false;
                            }
                        }
                        if (this._textureRoughness && MaterialFlags.ClearCoatTextureEnabled) {
                            if (!this._textureRoughness.isReadyOrNotBlocking()) {
                                return false;
                            }
                        }
                        if (engine.getCaps().standardDerivatives && this._bumpTexture && MaterialFlags.ClearCoatBumpTextureEnabled && !disableBumpMap) {
                            // Bump texture cannot be not blocking.
                            if (!this._bumpTexture.isReady()) {
                                return false;
                            }
                        }
                        if (this._isTintEnabled && this._tintTexture && MaterialFlags.ClearCoatTintTextureEnabled) {
                            if (!this._tintTexture.isReadyOrNotBlocking()) {
                                return false;
                            }
                        }
                    }
                }
                return true;
            }
            /**
             * Updates shader defines for clear coat before attributes are processed.
             * @param defines defines the material defines to update
             * @param scene defines the scene to use for texture checks
             */
            prepareDefinesBeforeAttributes(defines, scene) {
                if (this._isEnabled) {
                    defines.CLEARCOAT = true;
                    defines.CLEARCOAT_USE_ROUGHNESS_FROM_MAINTEXTURE = this._useRoughnessFromMainTexture;
                    defines.CLEARCOAT_REMAP_F0 = this._remapF0OnInterfaceChange;
                    if (defines._areTexturesDirty) {
                        if (scene.texturesEnabled) {
                            if (this._texture && MaterialFlags.ClearCoatTextureEnabled) {
                                PrepareDefinesForMergedUV(this._texture, defines, "CLEARCOAT_TEXTURE");
                            }
                            else {
                                defines.CLEARCOAT_TEXTURE = false;
                            }
                            if (this._textureRoughness && MaterialFlags.ClearCoatTextureEnabled) {
                                PrepareDefinesForMergedUV(this._textureRoughness, defines, "CLEARCOAT_TEXTURE_ROUGHNESS");
                            }
                            else {
                                defines.CLEARCOAT_TEXTURE_ROUGHNESS = false;
                            }
                            if (this._bumpTexture && MaterialFlags.ClearCoatBumpTextureEnabled) {
                                PrepareDefinesForMergedUV(this._bumpTexture, defines, "CLEARCOAT_BUMP");
                            }
                            else {
                                defines.CLEARCOAT_BUMP = false;
                            }
                            defines.CLEARCOAT_DEFAULTIOR = this._indexOfRefraction === _a._DefaultIndexOfRefraction;
                            if (this._isTintEnabled) {
                                defines.CLEARCOAT_TINT = true;
                                if (this._tintTexture && MaterialFlags.ClearCoatTintTextureEnabled) {
                                    PrepareDefinesForMergedUV(this._tintTexture, defines, "CLEARCOAT_TINT_TEXTURE");
                                    defines.CLEARCOAT_TINT_GAMMATEXTURE = this._tintTexture.gammaSpace;
                                }
                                else {
                                    defines.CLEARCOAT_TINT_TEXTURE = false;
                                }
                            }
                            else {
                                defines.CLEARCOAT_TINT = false;
                                defines.CLEARCOAT_TINT_TEXTURE = false;
                            }
                        }
                    }
                }
                else {
                    defines.CLEARCOAT = false;
                    defines.CLEARCOAT_TEXTURE = false;
                    defines.CLEARCOAT_TEXTURE_ROUGHNESS = false;
                    defines.CLEARCOAT_BUMP = false;
                    defines.CLEARCOAT_TINT = false;
                    defines.CLEARCOAT_TINT_TEXTURE = false;
                    defines.CLEARCOAT_USE_ROUGHNESS_FROM_MAINTEXTURE = false;
                    defines.CLEARCOAT_DEFAULTIOR = false;
                    defines.CLEARCOAT_TEXTUREDIRECTUV = 0;
                    defines.CLEARCOAT_TEXTURE_ROUGHNESSDIRECTUV = 0;
                    defines.CLEARCOAT_BUMPDIRECTUV = 0;
                    defines.CLEARCOAT_REMAP_F0 = false;
                    defines.CLEARCOAT_TINT_TEXTUREDIRECTUV = 0;
                    defines.CLEARCOAT_TINT_GAMMATEXTURE = false;
                }
            }
            /**
             * Binds clear coat data for a sub mesh.
             * @param uniformBuffer defines the uniform buffer to update
             * @param scene defines the scene to use for texture binding
             * @param engine defines the engine to use for capability checks
             * @param subMesh defines the sub mesh being rendered
             */
            bindForSubMesh(uniformBuffer, scene, engine, subMesh) {
                if (!this._isEnabled) {
                    return;
                }
                const defines = subMesh.materialDefines;
                const isFrozen = this._material.isFrozen;
                const disableBumpMap = this._material._disableBumpMap;
                const invertNormalMapX = this._material._invertNormalMapX;
                const invertNormalMapY = this._material._invertNormalMapY;
                if (!uniformBuffer.useUbo || !isFrozen || !uniformBuffer.isSync) {
                    if ((this._texture || this._textureRoughness) && MaterialFlags.ClearCoatTextureEnabled) {
                        uniformBuffer.updateFloat4("vClearCoatInfos", this._texture?.coordinatesIndex ?? 0, this._texture?.level ?? 0, this._textureRoughness?.coordinatesIndex ?? 0, this._textureRoughness?.level ?? 0);
                        if (this._texture) {
                            BindTextureMatrix(this._texture, uniformBuffer, "clearCoat");
                        }
                        if (this._textureRoughness && !defines.CLEARCOAT_USE_ROUGHNESS_FROM_MAINTEXTURE) {
                            BindTextureMatrix(this._textureRoughness, uniformBuffer, "clearCoatRoughness");
                        }
                    }
                    if (this._bumpTexture && engine.getCaps().standardDerivatives && MaterialFlags.ClearCoatTextureEnabled && !disableBumpMap) {
                        uniformBuffer.updateFloat2("vClearCoatBumpInfos", this._bumpTexture.coordinatesIndex, this._bumpTexture.level);
                        BindTextureMatrix(this._bumpTexture, uniformBuffer, "clearCoatBump");
                        if (scene._mirroredCameraPosition) {
                            uniformBuffer.updateFloat2("vClearCoatTangentSpaceParams", invertNormalMapX ? 1.0 : -1.0, invertNormalMapY ? 1.0 : -1.0);
                        }
                        else {
                            uniformBuffer.updateFloat2("vClearCoatTangentSpaceParams", invertNormalMapX ? -1.0 : 1.0, invertNormalMapY ? -1.0 : 1.0);
                        }
                    }
                    if (this._tintTexture && MaterialFlags.ClearCoatTintTextureEnabled) {
                        uniformBuffer.updateFloat2("vClearCoatTintInfos", this._tintTexture.coordinatesIndex, this._tintTexture.level);
                        BindTextureMatrix(this._tintTexture, uniformBuffer, "clearCoatTint");
                    }
                    // Clear Coat General params
                    uniformBuffer.updateFloat2("vClearCoatParams", this.intensity, this.roughness);
                    // Clear Coat Refraction params
                    const a = 1 - this._indexOfRefraction;
                    const b = 1 + this._indexOfRefraction;
                    const f0 = Math.pow(-a / b, 2); // Schlicks approx: (ior1 - ior2) / (ior1 + ior2) where ior2 for air is close to vacuum = 1.
                    const eta = 1 / this._indexOfRefraction;
                    uniformBuffer.updateFloat4("vClearCoatRefractionParams", f0, eta, a, b);
                    if (this._isTintEnabled) {
                        uniformBuffer.updateFloat4("vClearCoatTintParams", this.tintColor.r, this.tintColor.g, this.tintColor.b, Math.max(0.00001, this.tintThickness));
                        uniformBuffer.updateFloat("clearCoatColorAtDistance", Math.max(0.00001, this.tintColorAtDistance));
                    }
                }
                // Textures
                if (scene.texturesEnabled) {
                    if (this._texture && MaterialFlags.ClearCoatTextureEnabled) {
                        uniformBuffer.setTexture("clearCoatSampler", this._texture);
                    }
                    if (this._textureRoughness && !defines.CLEARCOAT_USE_ROUGHNESS_FROM_MAINTEXTURE && MaterialFlags.ClearCoatTextureEnabled) {
                        uniformBuffer.setTexture("clearCoatRoughnessSampler", this._textureRoughness);
                    }
                    if (this._bumpTexture && engine.getCaps().standardDerivatives && MaterialFlags.ClearCoatBumpTextureEnabled && !disableBumpMap) {
                        uniformBuffer.setTexture("clearCoatBumpSampler", this._bumpTexture);
                    }
                    if (this._isTintEnabled && this._tintTexture && MaterialFlags.ClearCoatTintTextureEnabled) {
                        uniformBuffer.setTexture("clearCoatTintSampler", this._tintTexture);
                    }
                }
            }
            /**
             * Checks whether clear coat uses a texture.
             * @param texture defines the texture to check
             * @returns true if the texture is used by clear coat
             */
            hasTexture(texture) {
                if (this._texture === texture) {
                    return true;
                }
                if (this._textureRoughness === texture) {
                    return true;
                }
                if (this._bumpTexture === texture) {
                    return true;
                }
                if (this._tintTexture === texture) {
                    return true;
                }
                return false;
            }
            /**
             * Adds the active clear coat textures.
             * @param activeTextures defines the list of active textures to update
             */
            getActiveTextures(activeTextures) {
                if (this._texture) {
                    activeTextures.push(this._texture);
                }
                if (this._textureRoughness) {
                    activeTextures.push(this._textureRoughness);
                }
                if (this._bumpTexture) {
                    activeTextures.push(this._bumpTexture);
                }
                if (this._tintTexture) {
                    activeTextures.push(this._tintTexture);
                }
            }
            /**
             * Adds the animatable clear coat textures.
             * @param animatables defines the list of animatables to update
             */
            getAnimatables(animatables) {
                if (this._texture && this._texture.animations && this._texture.animations.length > 0) {
                    animatables.push(this._texture);
                }
                if (this._textureRoughness && this._textureRoughness.animations && this._textureRoughness.animations.length > 0) {
                    animatables.push(this._textureRoughness);
                }
                if (this._bumpTexture && this._bumpTexture.animations && this._bumpTexture.animations.length > 0) {
                    animatables.push(this._bumpTexture);
                }
                if (this._tintTexture && this._tintTexture.animations && this._tintTexture.animations.length > 0) {
                    animatables.push(this._tintTexture);
                }
            }
            /**
             * Disposes the clear coat textures.
             * @param forceDisposeTextures defines whether to dispose the textures
             */
            dispose(forceDisposeTextures) {
                if (forceDisposeTextures) {
                    this._texture?.dispose();
                    this._textureRoughness?.dispose();
                    this._bumpTexture?.dispose();
                    this._tintTexture?.dispose();
                }
            }
            getClassName() {
                return "PBRClearCoatConfiguration";
            }
            addFallbacks(defines, fallbacks, currentRank) {
                if (defines.CLEARCOAT_BUMP) {
                    fallbacks.addFallback(currentRank++, "CLEARCOAT_BUMP");
                }
                if (defines.CLEARCOAT_TINT) {
                    fallbacks.addFallback(currentRank++, "CLEARCOAT_TINT");
                }
                if (defines.CLEARCOAT) {
                    fallbacks.addFallback(currentRank++, "CLEARCOAT");
                }
                return currentRank;
            }
            /**
             * Adds the clear coat sampler names.
             * @param samplers defines the list of sampler names to update
             */
            getSamplers(samplers) {
                samplers.push("clearCoatSampler", "clearCoatRoughnessSampler", "clearCoatBumpSampler", "clearCoatTintSampler");
            }
            getUniforms() {
                return {
                    ubo: [
                        { name: "vClearCoatParams", size: 2, type: "vec2" },
                        { name: "vClearCoatRefractionParams", size: 4, type: "vec4" },
                        { name: "vClearCoatInfos", size: 4, type: "vec4" },
                        { name: "clearCoatMatrix", size: 16, type: "mat4" },
                        { name: "clearCoatRoughnessMatrix", size: 16, type: "mat4" },
                        { name: "vClearCoatBumpInfos", size: 2, type: "vec2" },
                        { name: "vClearCoatTangentSpaceParams", size: 2, type: "vec2" },
                        { name: "clearCoatBumpMatrix", size: 16, type: "mat4" },
                        { name: "vClearCoatTintParams", size: 4, type: "vec4" },
                        { name: "clearCoatColorAtDistance", size: 1, type: "float" },
                        { name: "vClearCoatTintInfos", size: 2, type: "vec2" },
                        { name: "clearCoatTintMatrix", size: 16, type: "mat4" },
                    ],
                };
            }
        },
        _PBRClearCoatConfiguration_isEnabled_accessor_storage = new WeakMap(),
        _PBRClearCoatConfiguration_indexOfRefraction_accessor_storage = new WeakMap(),
        _PBRClearCoatConfiguration_texture_accessor_storage = new WeakMap(),
        _PBRClearCoatConfiguration_useRoughnessFromMainTexture_accessor_storage = new WeakMap(),
        _PBRClearCoatConfiguration_textureRoughness_accessor_storage = new WeakMap(),
        _PBRClearCoatConfiguration_remapF0OnInterfaceChange_accessor_storage = new WeakMap(),
        _PBRClearCoatConfiguration_bumpTexture_accessor_storage = new WeakMap(),
        _PBRClearCoatConfiguration_isTintEnabled_accessor_storage = new WeakMap(),
        _PBRClearCoatConfiguration_tintTexture_accessor_storage = new WeakMap(),
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _isEnabled_decorators = [serialize(), expandToProperty("_markAllSubMeshesAsTexturesDirty")];
            _intensity_decorators = [serialize()];
            _roughness_decorators = [serialize()];
            _indexOfRefraction_decorators = [serialize(), expandToProperty("_markAllSubMeshesAsTexturesDirty")];
            _texture_decorators = [serializeAsTexture(), expandToProperty("_markAllSubMeshesAsTexturesDirty")];
            _useRoughnessFromMainTexture_decorators = [serialize(), expandToProperty("_markAllSubMeshesAsTexturesDirty")];
            _textureRoughness_decorators = [serializeAsTexture(), expandToProperty("_markAllSubMeshesAsTexturesDirty")];
            _remapF0OnInterfaceChange_decorators = [serialize(), expandToProperty("_markAllSubMeshesAsTexturesDirty")];
            _bumpTexture_decorators = [serializeAsTexture(), expandToProperty("_markAllSubMeshesAsTexturesDirty")];
            _isTintEnabled_decorators = [serialize(), expandToProperty("_markAllSubMeshesAsTexturesDirty")];
            _tintColor_decorators = [serializeAsColor3()];
            _tintColorAtDistance_decorators = [serialize()];
            _tintThickness_decorators = [serialize()];
            _tintTexture_decorators = [serializeAsTexture(), expandToProperty("_markAllSubMeshesAsTexturesDirty")];
            __esDecorate(_a, null, _isEnabled_decorators, { kind: "accessor", name: "isEnabled", static: false, private: false, access: { has: obj => "isEnabled" in obj, get: obj => obj.isEnabled, set: (obj, value) => { obj.isEnabled = value; } }, metadata: _metadata }, _isEnabled_initializers, _isEnabled_extraInitializers);
            __esDecorate(_a, null, _indexOfRefraction_decorators, { kind: "accessor", name: "indexOfRefraction", static: false, private: false, access: { has: obj => "indexOfRefraction" in obj, get: obj => obj.indexOfRefraction, set: (obj, value) => { obj.indexOfRefraction = value; } }, metadata: _metadata }, _indexOfRefraction_initializers, _indexOfRefraction_extraInitializers);
            __esDecorate(_a, null, _texture_decorators, { kind: "accessor", name: "texture", static: false, private: false, access: { has: obj => "texture" in obj, get: obj => obj.texture, set: (obj, value) => { obj.texture = value; } }, metadata: _metadata }, _texture_initializers, _texture_extraInitializers);
            __esDecorate(_a, null, _useRoughnessFromMainTexture_decorators, { kind: "accessor", name: "useRoughnessFromMainTexture", static: false, private: false, access: { has: obj => "useRoughnessFromMainTexture" in obj, get: obj => obj.useRoughnessFromMainTexture, set: (obj, value) => { obj.useRoughnessFromMainTexture = value; } }, metadata: _metadata }, _useRoughnessFromMainTexture_initializers, _useRoughnessFromMainTexture_extraInitializers);
            __esDecorate(_a, null, _textureRoughness_decorators, { kind: "accessor", name: "textureRoughness", static: false, private: false, access: { has: obj => "textureRoughness" in obj, get: obj => obj.textureRoughness, set: (obj, value) => { obj.textureRoughness = value; } }, metadata: _metadata }, _textureRoughness_initializers, _textureRoughness_extraInitializers);
            __esDecorate(_a, null, _remapF0OnInterfaceChange_decorators, { kind: "accessor", name: "remapF0OnInterfaceChange", static: false, private: false, access: { has: obj => "remapF0OnInterfaceChange" in obj, get: obj => obj.remapF0OnInterfaceChange, set: (obj, value) => { obj.remapF0OnInterfaceChange = value; } }, metadata: _metadata }, _remapF0OnInterfaceChange_initializers, _remapF0OnInterfaceChange_extraInitializers);
            __esDecorate(_a, null, _bumpTexture_decorators, { kind: "accessor", name: "bumpTexture", static: false, private: false, access: { has: obj => "bumpTexture" in obj, get: obj => obj.bumpTexture, set: (obj, value) => { obj.bumpTexture = value; } }, metadata: _metadata }, _bumpTexture_initializers, _bumpTexture_extraInitializers);
            __esDecorate(_a, null, _isTintEnabled_decorators, { kind: "accessor", name: "isTintEnabled", static: false, private: false, access: { has: obj => "isTintEnabled" in obj, get: obj => obj.isTintEnabled, set: (obj, value) => { obj.isTintEnabled = value; } }, metadata: _metadata }, _isTintEnabled_initializers, _isTintEnabled_extraInitializers);
            __esDecorate(_a, null, _tintTexture_decorators, { kind: "accessor", name: "tintTexture", static: false, private: false, access: { has: obj => "tintTexture" in obj, get: obj => obj.tintTexture, set: (obj, value) => { obj.tintTexture = value; } }, metadata: _metadata }, _tintTexture_initializers, _tintTexture_extraInitializers);
            __esDecorate(null, null, _intensity_decorators, { kind: "field", name: "intensity", static: false, private: false, access: { has: obj => "intensity" in obj, get: obj => obj.intensity, set: (obj, value) => { obj.intensity = value; } }, metadata: _metadata }, _intensity_initializers, _intensity_extraInitializers);
            __esDecorate(null, null, _roughness_decorators, { kind: "field", name: "roughness", static: false, private: false, access: { has: obj => "roughness" in obj, get: obj => obj.roughness, set: (obj, value) => { obj.roughness = value; } }, metadata: _metadata }, _roughness_initializers, _roughness_extraInitializers);
            __esDecorate(null, null, _tintColor_decorators, { kind: "field", name: "tintColor", static: false, private: false, access: { has: obj => "tintColor" in obj, get: obj => obj.tintColor, set: (obj, value) => { obj.tintColor = value; } }, metadata: _metadata }, _tintColor_initializers, _tintColor_extraInitializers);
            __esDecorate(null, null, _tintColorAtDistance_decorators, { kind: "field", name: "tintColorAtDistance", static: false, private: false, access: { has: obj => "tintColorAtDistance" in obj, get: obj => obj.tintColorAtDistance, set: (obj, value) => { obj.tintColorAtDistance = value; } }, metadata: _metadata }, _tintColorAtDistance_initializers, _tintColorAtDistance_extraInitializers);
            __esDecorate(null, null, _tintThickness_decorators, { kind: "field", name: "tintThickness", static: false, private: false, access: { has: obj => "tintThickness" in obj, get: obj => obj.tintThickness, set: (obj, value) => { obj.tintThickness = value; } }, metadata: _metadata }, _tintThickness_initializers, _tintThickness_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        /**
         * This defaults to 1.5 corresponding to a 0.04 f0 or a 4% reflectance at normal incidence
         * The default fits with a polyurethane material.
         * @internal
         */
        _a._DefaultIndexOfRefraction = 1.5,
        _a;
})();
export { PBRClearCoatConfiguration };
//# sourceMappingURL=pbrClearCoatConfiguration.js.map