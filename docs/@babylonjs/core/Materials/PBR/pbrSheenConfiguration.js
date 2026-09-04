import { __classPrivateFieldGet, __classPrivateFieldSet, __esDecorate, __runInitializers } from "../../tslib.es6.js";
/* eslint-disable @typescript-eslint/naming-convention */
import { serialize, expandToProperty, serializeAsColor3, serializeAsTexture } from "../../Misc/decorators.js";
import { Color3 } from "../../Maths/math.color.pure.js";
import { MaterialFlags } from "../../Materials/materialFlags.js";

import { MaterialPluginBase } from "../materialPluginBase.pure.js";
import { MaterialDefines } from "../materialDefines.js";
import { BindTextureMatrix, PrepareDefinesForMergedUV } from "../materialHelper.functions.js";
/**
 * @internal
 */
export class MaterialSheenDefines extends MaterialDefines {
    constructor() {
        super(...arguments);
        this.SHEEN = false;
        this.SHEEN_TEXTURE = false;
        this.SHEEN_GAMMATEXTURE = false;
        this.SHEEN_TEXTURE_ROUGHNESS = false;
        this.SHEEN_TEXTUREDIRECTUV = 0;
        this.SHEEN_TEXTURE_ROUGHNESSDIRECTUV = 0;
        this.SHEEN_LINKWITHALBEDO = false;
        this.SHEEN_ROUGHNESS = false;
        this.SHEEN_ALBEDOSCALING = false;
        this.SHEEN_USE_ROUGHNESS_FROM_MAINTEXTURE = false;
    }
}
/**
 * Plugin that implements the sheen component of the PBR material.
 */
let PBRSheenConfiguration = (() => {
    var _a, _PBRSheenConfiguration_isEnabled_accessor_storage, _PBRSheenConfiguration_linkSheenWithAlbedo_accessor_storage, _PBRSheenConfiguration_texture_accessor_storage, _PBRSheenConfiguration_useRoughnessFromMainTexture_accessor_storage, _PBRSheenConfiguration_roughness_accessor_storage, _PBRSheenConfiguration_textureRoughness_accessor_storage, _PBRSheenConfiguration_albedoScaling_accessor_storage;
    let _classSuper = MaterialPluginBase;
    let _isEnabled_decorators;
    let _isEnabled_initializers = [];
    let _isEnabled_extraInitializers = [];
    let _linkSheenWithAlbedo_decorators;
    let _linkSheenWithAlbedo_initializers = [];
    let _linkSheenWithAlbedo_extraInitializers = [];
    let _intensity_decorators;
    let _intensity_initializers = [];
    let _intensity_extraInitializers = [];
    let _color_decorators;
    let _color_initializers = [];
    let _color_extraInitializers = [];
    let _texture_decorators;
    let _texture_initializers = [];
    let _texture_extraInitializers = [];
    let _useRoughnessFromMainTexture_decorators;
    let _useRoughnessFromMainTexture_initializers = [];
    let _useRoughnessFromMainTexture_extraInitializers = [];
    let _roughness_decorators;
    let _roughness_initializers = [];
    let _roughness_extraInitializers = [];
    let _textureRoughness_decorators;
    let _textureRoughness_initializers = [];
    let _textureRoughness_extraInitializers = [];
    let _albedoScaling_decorators;
    let _albedoScaling_initializers = [];
    let _albedoScaling_extraInitializers = [];
    return _a = class PBRSheenConfiguration extends _classSuper {
            /**
             * Defines if the material uses sheen.
             */
            get isEnabled() { return __classPrivateFieldGet(this, _PBRSheenConfiguration_isEnabled_accessor_storage, "f"); }
            set isEnabled(value) { __classPrivateFieldSet(this, _PBRSheenConfiguration_isEnabled_accessor_storage, value, "f"); }
            /**
             * Defines if the sheen is linked to the sheen color.
             */
            get linkSheenWithAlbedo() { return __classPrivateFieldGet(this, _PBRSheenConfiguration_linkSheenWithAlbedo_accessor_storage, "f"); }
            set linkSheenWithAlbedo(value) { __classPrivateFieldSet(this, _PBRSheenConfiguration_linkSheenWithAlbedo_accessor_storage, value, "f"); }
            /**
             * Stores the sheen tint values in a texture.
             * rgb is tint
             * a is a intensity or roughness if the roughness property has been defined and useRoughnessFromTexture is true (in that case, textureRoughness won't be used)
             * If the roughness property has been defined and useRoughnessFromTexture is false then the alpha channel is not used to modulate roughness
             */
            get texture() { return __classPrivateFieldGet(this, _PBRSheenConfiguration_texture_accessor_storage, "f"); }
            set texture(value) { __classPrivateFieldSet(this, _PBRSheenConfiguration_texture_accessor_storage, value, "f"); }
            /**
             * Indicates that the alpha channel of the texture property will be used for roughness.
             * Has no effect if the roughness (and texture!) property is not defined
             */
            get useRoughnessFromMainTexture() { return __classPrivateFieldGet(this, _PBRSheenConfiguration_useRoughnessFromMainTexture_accessor_storage, "f"); }
            set useRoughnessFromMainTexture(value) { __classPrivateFieldSet(this, _PBRSheenConfiguration_useRoughnessFromMainTexture_accessor_storage, value, "f"); }
            /**
             * Defines the sheen roughness.
             * It is not taken into account if linkSheenWithAlbedo is true.
             * To stay backward compatible, material roughness is used instead if sheen roughness = null
             */
            get roughness() { return __classPrivateFieldGet(this, _PBRSheenConfiguration_roughness_accessor_storage, "f"); }
            set roughness(value) { __classPrivateFieldSet(this, _PBRSheenConfiguration_roughness_accessor_storage, value, "f"); }
            /**
             * Stores the sheen roughness in a texture.
             * alpha channel is the roughness. This texture won't be used if the texture property is not empty and useRoughnessFromTexture is true
             */
            get textureRoughness() { return __classPrivateFieldGet(this, _PBRSheenConfiguration_textureRoughness_accessor_storage, "f"); }
            set textureRoughness(value) { __classPrivateFieldSet(this, _PBRSheenConfiguration_textureRoughness_accessor_storage, value, "f"); }
            /**
             * If true, the sheen effect is layered above the base BRDF with the albedo-scaling technique.
             * It allows the strength of the sheen effect to not depend on the base color of the material,
             * making it easier to setup and tweak the effect
             */
            get albedoScaling() { return __classPrivateFieldGet(this, _PBRSheenConfiguration_albedoScaling_accessor_storage, "f"); }
            set albedoScaling(value) { __classPrivateFieldSet(this, _PBRSheenConfiguration_albedoScaling_accessor_storage, value, "f"); }
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
                super(material, "Sheen", 120, new MaterialSheenDefines(), addToPluginList);
                this._isEnabled = false;
                _PBRSheenConfiguration_isEnabled_accessor_storage.set(this, __runInitializers(this, _isEnabled_initializers, false));
                this._linkSheenWithAlbedo = (__runInitializers(this, _isEnabled_extraInitializers), false);
                _PBRSheenConfiguration_linkSheenWithAlbedo_accessor_storage.set(this, __runInitializers(this, _linkSheenWithAlbedo_initializers, false));
                /**
                 * Defines the sheen intensity.
                 */
                this.intensity = (__runInitializers(this, _linkSheenWithAlbedo_extraInitializers), __runInitializers(this, _intensity_initializers, 1));
                /**
                 * Defines the sheen color.
                 */
                this.color = (__runInitializers(this, _intensity_extraInitializers), __runInitializers(this, _color_initializers, Color3.White()));
                this._texture = (__runInitializers(this, _color_extraInitializers), null);
                _PBRSheenConfiguration_texture_accessor_storage.set(this, __runInitializers(this, _texture_initializers, null));
                this._useRoughnessFromMainTexture = (__runInitializers(this, _texture_extraInitializers), true);
                _PBRSheenConfiguration_useRoughnessFromMainTexture_accessor_storage.set(this, __runInitializers(this, _useRoughnessFromMainTexture_initializers, true));
                this._roughness = (__runInitializers(this, _useRoughnessFromMainTexture_extraInitializers), null);
                _PBRSheenConfiguration_roughness_accessor_storage.set(this, __runInitializers(this, _roughness_initializers, null));
                this._textureRoughness = (__runInitializers(this, _roughness_extraInitializers), null);
                _PBRSheenConfiguration_textureRoughness_accessor_storage.set(this, __runInitializers(this, _textureRoughness_initializers, null));
                this._albedoScaling = (__runInitializers(this, _textureRoughness_extraInitializers), false);
                _PBRSheenConfiguration_albedoScaling_accessor_storage.set(this, __runInitializers(this, _albedoScaling_initializers, false));
                /** @internal */
                this._internalMarkAllSubMeshesAsTexturesDirty = __runInitializers(this, _albedoScaling_extraInitializers);
                this._internalMarkAllSubMeshesAsTexturesDirty = material._dirtyCallbacks[1];
            }
            /**
             * Checks whether the sheen textures are ready for the sub mesh.
             * @param defines defines the material defines to inspect
             * @param scene defines the scene to use for readiness checks
             * @returns true if sheen is ready
             */
            isReadyForSubMesh(defines, scene) {
                if (!this._isEnabled) {
                    return true;
                }
                if (defines._areTexturesDirty) {
                    if (scene.texturesEnabled) {
                        if (this._texture && MaterialFlags.SheenTextureEnabled) {
                            if (!this._texture.isReadyOrNotBlocking()) {
                                return false;
                            }
                        }
                        if (this._textureRoughness && MaterialFlags.SheenTextureEnabled) {
                            if (!this._textureRoughness.isReadyOrNotBlocking()) {
                                return false;
                            }
                        }
                    }
                }
                return true;
            }
            /**
             * Updates shader defines for sheen before attributes are processed.
             * @param defines defines the material defines to update
             * @param scene defines the scene to use for texture checks
             */
            prepareDefinesBeforeAttributes(defines, scene) {
                if (this._isEnabled) {
                    defines.SHEEN = true;
                    defines.SHEEN_LINKWITHALBEDO = this._linkSheenWithAlbedo;
                    defines.SHEEN_ROUGHNESS = this._roughness !== null;
                    defines.SHEEN_ALBEDOSCALING = this._albedoScaling;
                    defines.SHEEN_USE_ROUGHNESS_FROM_MAINTEXTURE = this._useRoughnessFromMainTexture;
                    if (defines._areTexturesDirty) {
                        if (scene.texturesEnabled) {
                            if (this._texture && MaterialFlags.SheenTextureEnabled) {
                                PrepareDefinesForMergedUV(this._texture, defines, "SHEEN_TEXTURE");
                                defines.SHEEN_GAMMATEXTURE = this._texture.gammaSpace;
                            }
                            else {
                                defines.SHEEN_TEXTURE = false;
                            }
                            if (this._textureRoughness && MaterialFlags.SheenTextureEnabled) {
                                PrepareDefinesForMergedUV(this._textureRoughness, defines, "SHEEN_TEXTURE_ROUGHNESS");
                            }
                            else {
                                defines.SHEEN_TEXTURE_ROUGHNESS = false;
                            }
                        }
                    }
                }
                else {
                    defines.SHEEN = false;
                    defines.SHEEN_TEXTURE = false;
                    defines.SHEEN_TEXTURE_ROUGHNESS = false;
                    defines.SHEEN_LINKWITHALBEDO = false;
                    defines.SHEEN_ROUGHNESS = false;
                    defines.SHEEN_ALBEDOSCALING = false;
                    defines.SHEEN_USE_ROUGHNESS_FROM_MAINTEXTURE = false;
                    defines.SHEEN_GAMMATEXTURE = false;
                    defines.SHEEN_TEXTUREDIRECTUV = 0;
                    defines.SHEEN_TEXTURE_ROUGHNESSDIRECTUV = 0;
                }
            }
            /**
             * Binds sheen data for a sub mesh.
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
                if (!uniformBuffer.useUbo || !isFrozen || !uniformBuffer.isSync) {
                    if ((this._texture || this._textureRoughness) && MaterialFlags.SheenTextureEnabled) {
                        uniformBuffer.updateFloat4("vSheenInfos", this._texture?.coordinatesIndex ?? 0, this._texture?.level ?? 0, this._textureRoughness?.coordinatesIndex ?? 0, this._textureRoughness?.level ?? 0);
                        if (this._texture) {
                            BindTextureMatrix(this._texture, uniformBuffer, "sheen");
                        }
                        if (this._textureRoughness && !defines.SHEEN_USE_ROUGHNESS_FROM_MAINTEXTURE) {
                            BindTextureMatrix(this._textureRoughness, uniformBuffer, "sheenRoughness");
                        }
                    }
                    // Sheen
                    uniformBuffer.updateFloat4("vSheenColor", this.color.r, this.color.g, this.color.b, this.intensity);
                    if (this._roughness !== null) {
                        uniformBuffer.updateFloat("vSheenRoughness", this._roughness);
                    }
                }
                // Textures
                if (scene.texturesEnabled) {
                    if (this._texture && MaterialFlags.SheenTextureEnabled) {
                        uniformBuffer.setTexture("sheenSampler", this._texture);
                    }
                    if (this._textureRoughness && !defines.SHEEN_USE_ROUGHNESS_FROM_MAINTEXTURE && MaterialFlags.SheenTextureEnabled) {
                        uniformBuffer.setTexture("sheenRoughnessSampler", this._textureRoughness);
                    }
                }
            }
            /**
             * Checks whether sheen uses a texture.
             * @param texture defines the texture to check
             * @returns true if the texture is used by sheen
             */
            hasTexture(texture) {
                if (this._texture === texture) {
                    return true;
                }
                if (this._textureRoughness === texture) {
                    return true;
                }
                return false;
            }
            /**
             * Adds the active sheen textures.
             * @param activeTextures defines the list of active textures to update
             */
            getActiveTextures(activeTextures) {
                if (this._texture) {
                    activeTextures.push(this._texture);
                }
                if (this._textureRoughness) {
                    activeTextures.push(this._textureRoughness);
                }
            }
            /**
             * Adds the animatable sheen textures.
             * @param animatables defines the list of animatables to update
             */
            getAnimatables(animatables) {
                if (this._texture && this._texture.animations && this._texture.animations.length > 0) {
                    animatables.push(this._texture);
                }
                if (this._textureRoughness && this._textureRoughness.animations && this._textureRoughness.animations.length > 0) {
                    animatables.push(this._textureRoughness);
                }
            }
            /**
             * Disposes the sheen textures.
             * @param forceDisposeTextures defines whether to dispose the textures
             */
            dispose(forceDisposeTextures) {
                if (forceDisposeTextures) {
                    this._texture?.dispose();
                    this._textureRoughness?.dispose();
                }
            }
            getClassName() {
                return "PBRSheenConfiguration";
            }
            addFallbacks(defines, fallbacks, currentRank) {
                if (defines.SHEEN) {
                    fallbacks.addFallback(currentRank++, "SHEEN");
                }
                return currentRank;
            }
            /**
             * Adds the sheen sampler names.
             * @param samplers defines the list of sampler names to update
             */
            getSamplers(samplers) {
                samplers.push("sheenSampler", "sheenRoughnessSampler");
            }
            getUniforms() {
                return {
                    ubo: [
                        { name: "vSheenColor", size: 4, type: "vec4" },
                        { name: "vSheenRoughness", size: 1, type: "float" },
                        { name: "vSheenInfos", size: 4, type: "vec4" },
                        { name: "sheenMatrix", size: 16, type: "mat4" },
                        { name: "sheenRoughnessMatrix", size: 16, type: "mat4" },
                    ],
                };
            }
        },
        _PBRSheenConfiguration_isEnabled_accessor_storage = new WeakMap(),
        _PBRSheenConfiguration_linkSheenWithAlbedo_accessor_storage = new WeakMap(),
        _PBRSheenConfiguration_texture_accessor_storage = new WeakMap(),
        _PBRSheenConfiguration_useRoughnessFromMainTexture_accessor_storage = new WeakMap(),
        _PBRSheenConfiguration_roughness_accessor_storage = new WeakMap(),
        _PBRSheenConfiguration_textureRoughness_accessor_storage = new WeakMap(),
        _PBRSheenConfiguration_albedoScaling_accessor_storage = new WeakMap(),
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _isEnabled_decorators = [serialize(), expandToProperty("_markAllSubMeshesAsTexturesDirty")];
            _linkSheenWithAlbedo_decorators = [serialize(), expandToProperty("_markAllSubMeshesAsTexturesDirty")];
            _intensity_decorators = [serialize()];
            _color_decorators = [serializeAsColor3()];
            _texture_decorators = [serializeAsTexture(), expandToProperty("_markAllSubMeshesAsTexturesDirty")];
            _useRoughnessFromMainTexture_decorators = [serialize(), expandToProperty("_markAllSubMeshesAsTexturesDirty")];
            _roughness_decorators = [serialize(), expandToProperty("_markAllSubMeshesAsTexturesDirty")];
            _textureRoughness_decorators = [serializeAsTexture(), expandToProperty("_markAllSubMeshesAsTexturesDirty")];
            _albedoScaling_decorators = [serialize(), expandToProperty("_markAllSubMeshesAsTexturesDirty")];
            __esDecorate(_a, null, _isEnabled_decorators, { kind: "accessor", name: "isEnabled", static: false, private: false, access: { has: obj => "isEnabled" in obj, get: obj => obj.isEnabled, set: (obj, value) => { obj.isEnabled = value; } }, metadata: _metadata }, _isEnabled_initializers, _isEnabled_extraInitializers);
            __esDecorate(_a, null, _linkSheenWithAlbedo_decorators, { kind: "accessor", name: "linkSheenWithAlbedo", static: false, private: false, access: { has: obj => "linkSheenWithAlbedo" in obj, get: obj => obj.linkSheenWithAlbedo, set: (obj, value) => { obj.linkSheenWithAlbedo = value; } }, metadata: _metadata }, _linkSheenWithAlbedo_initializers, _linkSheenWithAlbedo_extraInitializers);
            __esDecorate(_a, null, _texture_decorators, { kind: "accessor", name: "texture", static: false, private: false, access: { has: obj => "texture" in obj, get: obj => obj.texture, set: (obj, value) => { obj.texture = value; } }, metadata: _metadata }, _texture_initializers, _texture_extraInitializers);
            __esDecorate(_a, null, _useRoughnessFromMainTexture_decorators, { kind: "accessor", name: "useRoughnessFromMainTexture", static: false, private: false, access: { has: obj => "useRoughnessFromMainTexture" in obj, get: obj => obj.useRoughnessFromMainTexture, set: (obj, value) => { obj.useRoughnessFromMainTexture = value; } }, metadata: _metadata }, _useRoughnessFromMainTexture_initializers, _useRoughnessFromMainTexture_extraInitializers);
            __esDecorate(_a, null, _roughness_decorators, { kind: "accessor", name: "roughness", static: false, private: false, access: { has: obj => "roughness" in obj, get: obj => obj.roughness, set: (obj, value) => { obj.roughness = value; } }, metadata: _metadata }, _roughness_initializers, _roughness_extraInitializers);
            __esDecorate(_a, null, _textureRoughness_decorators, { kind: "accessor", name: "textureRoughness", static: false, private: false, access: { has: obj => "textureRoughness" in obj, get: obj => obj.textureRoughness, set: (obj, value) => { obj.textureRoughness = value; } }, metadata: _metadata }, _textureRoughness_initializers, _textureRoughness_extraInitializers);
            __esDecorate(_a, null, _albedoScaling_decorators, { kind: "accessor", name: "albedoScaling", static: false, private: false, access: { has: obj => "albedoScaling" in obj, get: obj => obj.albedoScaling, set: (obj, value) => { obj.albedoScaling = value; } }, metadata: _metadata }, _albedoScaling_initializers, _albedoScaling_extraInitializers);
            __esDecorate(null, null, _intensity_decorators, { kind: "field", name: "intensity", static: false, private: false, access: { has: obj => "intensity" in obj, get: obj => obj.intensity, set: (obj, value) => { obj.intensity = value; } }, metadata: _metadata }, _intensity_initializers, _intensity_extraInitializers);
            __esDecorate(null, null, _color_decorators, { kind: "field", name: "color", static: false, private: false, access: { has: obj => "color" in obj, get: obj => obj.color, set: (obj, value) => { obj.color = value; } }, metadata: _metadata }, _color_initializers, _color_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
export { PBRSheenConfiguration };
//# sourceMappingURL=pbrSheenConfiguration.js.map