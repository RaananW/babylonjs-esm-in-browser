import { __classPrivateFieldGet, __classPrivateFieldSet, __esDecorate, __runInitializers } from "../../tslib.es6.js";
/* eslint-disable @typescript-eslint/naming-convention */
import { serialize, expandToProperty, serializeAsVector2, serializeAsTexture } from "../../Misc/decorators.js";
import { VertexBuffer } from "../../Buffers/buffer.pure.js";
import { Vector2 } from "../../Maths/math.vector.pure.js";
import { MaterialFlags } from "../../Materials/materialFlags.js";
import { MaterialPluginBase } from "../materialPluginBase.pure.js";

import { MaterialDefines } from "../materialDefines.js";
import { BindTextureMatrix, PrepareDefinesForMergedUV } from "../materialHelper.functions.js";
/**
 * @internal
 */
export class MaterialAnisotropicDefines extends MaterialDefines {
    constructor() {
        super(...arguments);
        this.ANISOTROPIC = false;
        this.ANISOTROPIC_TEXTURE = false;
        this.ANISOTROPIC_TEXTUREDIRECTUV = 0;
        this.ANISOTROPIC_LEGACY = false;
        this.MAINUV1 = false;
    }
}
/**
 * Plugin that implements the anisotropic component of the PBR material
 */
let PBRAnisotropicConfiguration = (() => {
    var _a, _PBRAnisotropicConfiguration_isEnabled_accessor_storage, _PBRAnisotropicConfiguration_texture_accessor_storage, _PBRAnisotropicConfiguration_legacy_accessor_storage;
    let _classSuper = MaterialPluginBase;
    let _isEnabled_decorators;
    let _isEnabled_initializers = [];
    let _isEnabled_extraInitializers = [];
    let _intensity_decorators;
    let _intensity_initializers = [];
    let _intensity_extraInitializers = [];
    let _direction_decorators;
    let _direction_initializers = [];
    let _direction_extraInitializers = [];
    let _texture_decorators;
    let _texture_initializers = [];
    let _texture_extraInitializers = [];
    let _legacy_decorators;
    let _legacy_initializers = [];
    let _legacy_extraInitializers = [];
    return _a = class PBRAnisotropicConfiguration extends _classSuper {
            /**
             * Defines if the anisotropy is enabled in the material.
             */
            get isEnabled() { return __classPrivateFieldGet(this, _PBRAnisotropicConfiguration_isEnabled_accessor_storage, "f"); }
            set isEnabled(value) { __classPrivateFieldSet(this, _PBRAnisotropicConfiguration_isEnabled_accessor_storage, value, "f"); }
            /**
             * Sets the anisotropy direction as an angle.
             */
            set angle(value) {
                this.direction.x = Math.cos(value);
                this.direction.y = Math.sin(value);
            }
            /**
             * Gets the anisotropy angle value in radians.
             * @returns the anisotropy angle value in radians.
             */
            get angle() {
                return Math.atan2(this.direction.y, this.direction.x);
            }
            /**
             * Stores the anisotropy values in a texture.
             * rg is direction (like normal from -1 to 1)
             * b is a intensity
             */
            get texture() { return __classPrivateFieldGet(this, _PBRAnisotropicConfiguration_texture_accessor_storage, "f"); }
            set texture(value) { __classPrivateFieldSet(this, _PBRAnisotropicConfiguration_texture_accessor_storage, value, "f"); }
            /**
             * Defines if the anisotropy is in legacy mode for backwards compatibility before 6.4.0.
             */
            get legacy() { return __classPrivateFieldGet(this, _PBRAnisotropicConfiguration_legacy_accessor_storage, "f"); }
            set legacy(value) { __classPrivateFieldSet(this, _PBRAnisotropicConfiguration_legacy_accessor_storage, value, "f"); }
            /** @internal */
            _markAllSubMeshesAsTexturesDirty() {
                this._enable(this._isEnabled);
                this._internalMarkAllSubMeshesAsTexturesDirty();
            }
            /** @internal */
            _markAllSubMeshesAsMiscDirty() {
                this._enable(this._isEnabled);
                this._internalMarkAllSubMeshesAsMiscDirty();
            }
            /**
             * Gets a boolean indicating that the plugin is compatible with a given shader language.
             * @returns true if the plugin is compatible with the shader language
             */
            isCompatible() {
                return true;
            }
            constructor(material, addToPluginList = true) {
                super(material, "PBRAnisotropic", 110, new MaterialAnisotropicDefines(), addToPluginList);
                this._isEnabled = false;
                _PBRAnisotropicConfiguration_isEnabled_accessor_storage.set(this, __runInitializers(this, _isEnabled_initializers, false));
                /**
                 * Defines the anisotropy strength (between 0 and 1) it defaults to 1.
                 */
                this.intensity = (__runInitializers(this, _isEnabled_extraInitializers), __runInitializers(this, _intensity_initializers, 1));
                /**
                 * Defines if the effect is along the tangents, bitangents or in between.
                 * By default, the effect is "stretching" the highlights along the tangents.
                 */
                this.direction = (__runInitializers(this, _intensity_extraInitializers), __runInitializers(this, _direction_initializers, new Vector2(1, 0)));
                this._texture = (__runInitializers(this, _direction_extraInitializers), null);
                _PBRAnisotropicConfiguration_texture_accessor_storage.set(this, __runInitializers(this, _texture_initializers, null));
                this._legacy = (__runInitializers(this, _texture_extraInitializers), false);
                _PBRAnisotropicConfiguration_legacy_accessor_storage.set(this, __runInitializers(this, _legacy_initializers, false));
                /** @internal */
                this._internalMarkAllSubMeshesAsTexturesDirty = __runInitializers(this, _legacy_extraInitializers);
                this._internalMarkAllSubMeshesAsTexturesDirty = material._dirtyCallbacks[1];
                this._internalMarkAllSubMeshesAsMiscDirty = material._dirtyCallbacks[16];
            }
            /**
             * Checks whether the anisotropy textures are ready for the sub mesh.
             * @param defines defines the material defines to inspect
             * @param scene defines the scene to use for readiness checks
             * @returns true if anisotropy is ready
             */
            isReadyForSubMesh(defines, scene) {
                if (!this._isEnabled) {
                    return true;
                }
                if (defines._areTexturesDirty) {
                    if (scene.texturesEnabled) {
                        if (this._texture && MaterialFlags.AnisotropicTextureEnabled) {
                            if (!this._texture.isReadyOrNotBlocking()) {
                                return false;
                            }
                        }
                    }
                }
                return true;
            }
            /**
             * Updates shader defines for anisotropy before attributes are processed.
             * @param defines defines the material defines to update
             * @param scene defines the scene to use for texture checks
             * @param mesh defines the mesh to inspect for tangent data
             */
            prepareDefinesBeforeAttributes(defines, scene, mesh) {
                if (this._isEnabled) {
                    defines.ANISOTROPIC = this._isEnabled;
                    if (this._isEnabled && !mesh.isVerticesDataPresent(VertexBuffer.TangentKind)) {
                        defines._needUVs = true;
                        defines.MAINUV1 = true;
                    }
                    if (defines._areTexturesDirty) {
                        if (scene.texturesEnabled) {
                            if (this._texture && MaterialFlags.AnisotropicTextureEnabled) {
                                PrepareDefinesForMergedUV(this._texture, defines, "ANISOTROPIC_TEXTURE");
                            }
                            else {
                                defines.ANISOTROPIC_TEXTURE = false;
                            }
                        }
                    }
                    if (defines._areMiscDirty) {
                        defines.ANISOTROPIC_LEGACY = this._legacy;
                    }
                }
                else {
                    defines.ANISOTROPIC = false;
                    defines.ANISOTROPIC_TEXTURE = false;
                    defines.ANISOTROPIC_TEXTUREDIRECTUV = 0;
                    defines.ANISOTROPIC_LEGACY = false;
                }
            }
            /**
             * Binds anisotropy data for a sub mesh.
             * @param uniformBuffer defines the uniform buffer to update
             * @param scene defines the scene to use for texture binding
             */
            bindForSubMesh(uniformBuffer, scene) {
                if (!this._isEnabled) {
                    return;
                }
                const isFrozen = this._material.isFrozen;
                if (!uniformBuffer.useUbo || !isFrozen || !uniformBuffer.isSync) {
                    if (this._texture && MaterialFlags.AnisotropicTextureEnabled) {
                        uniformBuffer.updateFloat2("vAnisotropyInfos", this._texture.coordinatesIndex, this._texture.level);
                        BindTextureMatrix(this._texture, uniformBuffer, "anisotropy");
                    }
                    // Anisotropy
                    uniformBuffer.updateFloat3("vAnisotropy", this.direction.x, this.direction.y, this.intensity);
                }
                // Textures
                if (scene.texturesEnabled) {
                    if (this._texture && MaterialFlags.AnisotropicTextureEnabled) {
                        uniformBuffer.setTexture("anisotropySampler", this._texture);
                    }
                }
            }
            /**
             * Checks whether anisotropy uses a texture.
             * @param texture defines the texture to check
             * @returns true if the texture is used by anisotropy
             */
            hasTexture(texture) {
                if (this._texture === texture) {
                    return true;
                }
                return false;
            }
            /**
             * Adds the active anisotropy textures.
             * @param activeTextures defines the list of active textures to update
             */
            getActiveTextures(activeTextures) {
                if (this._texture) {
                    activeTextures.push(this._texture);
                }
            }
            /**
             * Adds the animatable anisotropy textures.
             * @param animatables defines the list of animatables to update
             */
            getAnimatables(animatables) {
                if (this._texture && this._texture.animations && this._texture.animations.length > 0) {
                    animatables.push(this._texture);
                }
            }
            /**
             * Disposes the anisotropy textures.
             * @param forceDisposeTextures defines whether to dispose the textures
             */
            dispose(forceDisposeTextures) {
                if (forceDisposeTextures) {
                    if (this._texture) {
                        this._texture.dispose();
                    }
                }
            }
            getClassName() {
                return "PBRAnisotropicConfiguration";
            }
            addFallbacks(defines, fallbacks, currentRank) {
                if (defines.ANISOTROPIC) {
                    fallbacks.addFallback(currentRank++, "ANISOTROPIC");
                }
                return currentRank;
            }
            /**
             * Adds the anisotropy sampler names.
             * @param samplers defines the list of sampler names to update
             */
            getSamplers(samplers) {
                samplers.push("anisotropySampler");
            }
            getUniforms() {
                return {
                    ubo: [
                        { name: "vAnisotropy", size: 3, type: "vec3" },
                        { name: "vAnisotropyInfos", size: 2, type: "vec2" },
                        { name: "anisotropyMatrix", size: 16, type: "mat4" },
                    ],
                };
            }
            /**
             * Parses a anisotropy Configuration from a serialized object.
             * @param source - Serialized object.
             * @param scene Defines the scene we are parsing for
             * @param rootUrl Defines the rootUrl to load from
             */
            parse(source, scene, rootUrl) {
                super.parse(source, scene, rootUrl);
                // Backward compatibility
                if (source.legacy === undefined) {
                    this.legacy = true;
                }
            }
        },
        _PBRAnisotropicConfiguration_isEnabled_accessor_storage = new WeakMap(),
        _PBRAnisotropicConfiguration_texture_accessor_storage = new WeakMap(),
        _PBRAnisotropicConfiguration_legacy_accessor_storage = new WeakMap(),
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _isEnabled_decorators = [serialize(), expandToProperty("_markAllSubMeshesAsTexturesDirty")];
            _intensity_decorators = [serialize()];
            _direction_decorators = [serializeAsVector2()];
            _texture_decorators = [serializeAsTexture(), expandToProperty("_markAllSubMeshesAsTexturesDirty")];
            _legacy_decorators = [serialize(), expandToProperty("_markAllSubMeshesAsMiscDirty")];
            __esDecorate(_a, null, _isEnabled_decorators, { kind: "accessor", name: "isEnabled", static: false, private: false, access: { has: obj => "isEnabled" in obj, get: obj => obj.isEnabled, set: (obj, value) => { obj.isEnabled = value; } }, metadata: _metadata }, _isEnabled_initializers, _isEnabled_extraInitializers);
            __esDecorate(_a, null, _texture_decorators, { kind: "accessor", name: "texture", static: false, private: false, access: { has: obj => "texture" in obj, get: obj => obj.texture, set: (obj, value) => { obj.texture = value; } }, metadata: _metadata }, _texture_initializers, _texture_extraInitializers);
            __esDecorate(_a, null, _legacy_decorators, { kind: "accessor", name: "legacy", static: false, private: false, access: { has: obj => "legacy" in obj, get: obj => obj.legacy, set: (obj, value) => { obj.legacy = value; } }, metadata: _metadata }, _legacy_initializers, _legacy_extraInitializers);
            __esDecorate(null, null, _intensity_decorators, { kind: "field", name: "intensity", static: false, private: false, access: { has: obj => "intensity" in obj, get: obj => obj.intensity, set: (obj, value) => { obj.intensity = value; } }, metadata: _metadata }, _intensity_initializers, _intensity_extraInitializers);
            __esDecorate(null, null, _direction_decorators, { kind: "field", name: "direction", static: false, private: false, access: { has: obj => "direction" in obj, get: obj => obj.direction, set: (obj, value) => { obj.direction = value; } }, metadata: _metadata }, _direction_initializers, _direction_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
export { PBRAnisotropicConfiguration };
//# sourceMappingURL=pbrAnisotropicConfiguration.js.map