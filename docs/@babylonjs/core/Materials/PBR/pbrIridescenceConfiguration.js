import { __classPrivateFieldGet, __classPrivateFieldSet, __esDecorate, __runInitializers } from "../../tslib.es6.js";
import { serialize, serializeAsTexture, expandToProperty } from "../../Misc/decorators.js";
import { MaterialFlags } from "../materialFlags.js";

import { MaterialPluginBase } from "../materialPluginBase.pure.js";
import { MaterialDefines } from "../materialDefines.js";
import { BindTextureMatrix, PrepareDefinesForMergedUV } from "../materialHelper.functions.js";
/**
 * @internal
 */
export class MaterialIridescenceDefines extends MaterialDefines {
    constructor() {
        super(...arguments);
        this.IRIDESCENCE = false;
        this.IRIDESCENCE_TEXTURE = false;
        this.IRIDESCENCE_TEXTUREDIRECTUV = 0;
        this.IRIDESCENCE_THICKNESS_TEXTURE = false;
        this.IRIDESCENCE_THICKNESS_TEXTUREDIRECTUV = 0;
    }
}
/**
 * Plugin that implements the iridescence (thin film) component of the PBR material
 */
let PBRIridescenceConfiguration = (() => {
    var _a, _PBRIridescenceConfiguration_isEnabled_accessor_storage, _PBRIridescenceConfiguration_texture_accessor_storage, _PBRIridescenceConfiguration_thicknessTexture_accessor_storage;
    let _classSuper = MaterialPluginBase;
    let _isEnabled_decorators;
    let _isEnabled_initializers = [];
    let _isEnabled_extraInitializers = [];
    let _intensity_decorators;
    let _intensity_initializers = [];
    let _intensity_extraInitializers = [];
    let _minimumThickness_decorators;
    let _minimumThickness_initializers = [];
    let _minimumThickness_extraInitializers = [];
    let _maximumThickness_decorators;
    let _maximumThickness_initializers = [];
    let _maximumThickness_extraInitializers = [];
    let _indexOfRefraction_decorators;
    let _indexOfRefraction_initializers = [];
    let _indexOfRefraction_extraInitializers = [];
    let _texture_decorators;
    let _texture_initializers = [];
    let _texture_extraInitializers = [];
    let _thicknessTexture_decorators;
    let _thicknessTexture_initializers = [];
    let _thicknessTexture_extraInitializers = [];
    return _a = class PBRIridescenceConfiguration extends _classSuper {
            /**
             * Defines if the iridescence is enabled in the material.
             */
            get isEnabled() { return __classPrivateFieldGet(this, _PBRIridescenceConfiguration_isEnabled_accessor_storage, "f"); }
            set isEnabled(value) { __classPrivateFieldSet(this, _PBRIridescenceConfiguration_isEnabled_accessor_storage, value, "f"); }
            /**
             * Stores the iridescence intensity in a texture (red channel)
             */
            get texture() { return __classPrivateFieldGet(this, _PBRIridescenceConfiguration_texture_accessor_storage, "f"); }
            set texture(value) { __classPrivateFieldSet(this, _PBRIridescenceConfiguration_texture_accessor_storage, value, "f"); }
            /**
             * Stores the iridescence thickness in a texture (green channel)
             */
            get thicknessTexture() { return __classPrivateFieldGet(this, _PBRIridescenceConfiguration_thicknessTexture_accessor_storage, "f"); }
            set thicknessTexture(value) { __classPrivateFieldSet(this, _PBRIridescenceConfiguration_thicknessTexture_accessor_storage, value, "f"); }
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
                super(material, "PBRIridescence", 110, new MaterialIridescenceDefines(), addToPluginList);
                this._isEnabled = false;
                _PBRIridescenceConfiguration_isEnabled_accessor_storage.set(this, __runInitializers(this, _isEnabled_initializers, false));
                /**
                 * Defines the iridescence layer strength (between 0 and 1) it defaults to 1.
                 */
                this.intensity = (__runInitializers(this, _isEnabled_extraInitializers), __runInitializers(this, _intensity_initializers, 1));
                /**
                 * Defines the minimum thickness of the thin-film layer given in nanometers (nm).
                 */
                this.minimumThickness = (__runInitializers(this, _intensity_extraInitializers), __runInitializers(this, _minimumThickness_initializers, _a._DefaultMinimumThickness));
                /**
                 * Defines the maximum thickness of the thin-film layer given in nanometers (nm). This will be the thickness used if not thickness texture has been set.
                 */
                this.maximumThickness = (__runInitializers(this, _minimumThickness_extraInitializers), __runInitializers(this, _maximumThickness_initializers, _a._DefaultMaximumThickness));
                /**
                 * Defines the maximum thickness of the thin-film layer given in nanometers (nm).
                 */
                this.indexOfRefraction = (__runInitializers(this, _maximumThickness_extraInitializers), __runInitializers(this, _indexOfRefraction_initializers, _a._DefaultIndexOfRefraction));
                this._texture = (__runInitializers(this, _indexOfRefraction_extraInitializers), null);
                _PBRIridescenceConfiguration_texture_accessor_storage.set(this, __runInitializers(this, _texture_initializers, null));
                this._thicknessTexture = (__runInitializers(this, _texture_extraInitializers), null);
                _PBRIridescenceConfiguration_thicknessTexture_accessor_storage.set(this, __runInitializers(this, _thicknessTexture_initializers, null));
                /** @internal */
                this._internalMarkAllSubMeshesAsTexturesDirty = __runInitializers(this, _thicknessTexture_extraInitializers);
                this._internalMarkAllSubMeshesAsTexturesDirty = material._dirtyCallbacks[1];
            }
            /**
             * Checks whether the iridescence textures are ready for the sub mesh.
             * @param defines defines the material defines to inspect
             * @param scene defines the scene to use for readiness checks
             * @returns true if iridescence is ready
             */
            isReadyForSubMesh(defines, scene) {
                if (!this._isEnabled) {
                    return true;
                }
                if (defines._areTexturesDirty) {
                    if (scene.texturesEnabled) {
                        if (this._texture && MaterialFlags.IridescenceTextureEnabled) {
                            if (!this._texture.isReadyOrNotBlocking()) {
                                return false;
                            }
                        }
                        if (this._thicknessTexture && MaterialFlags.IridescenceTextureEnabled) {
                            if (!this._thicknessTexture.isReadyOrNotBlocking()) {
                                return false;
                            }
                        }
                    }
                }
                return true;
            }
            /**
             * Updates shader defines for iridescence before attributes are processed.
             * @param defines defines the material defines to update
             * @param scene defines the scene to use for texture checks
             */
            prepareDefinesBeforeAttributes(defines, scene) {
                if (this._isEnabled) {
                    defines.IRIDESCENCE = true;
                    if (defines._areTexturesDirty) {
                        if (scene.texturesEnabled) {
                            if (this._texture && MaterialFlags.IridescenceTextureEnabled) {
                                PrepareDefinesForMergedUV(this._texture, defines, "IRIDESCENCE_TEXTURE");
                            }
                            else {
                                defines.IRIDESCENCE_TEXTURE = false;
                            }
                            if (this._thicknessTexture && MaterialFlags.IridescenceTextureEnabled) {
                                PrepareDefinesForMergedUV(this._thicknessTexture, defines, "IRIDESCENCE_THICKNESS_TEXTURE");
                            }
                            else {
                                defines.IRIDESCENCE_THICKNESS_TEXTURE = false;
                            }
                        }
                    }
                }
                else {
                    defines.IRIDESCENCE = false;
                    defines.IRIDESCENCE_TEXTURE = false;
                    defines.IRIDESCENCE_THICKNESS_TEXTURE = false;
                    defines.IRIDESCENCE_TEXTUREDIRECTUV = 0;
                    defines.IRIDESCENCE_THICKNESS_TEXTUREDIRECTUV = 0;
                }
            }
            /**
             * Binds iridescence data for a sub mesh.
             * @param uniformBuffer defines the uniform buffer to update
             * @param scene defines the scene to use for texture binding
             */
            bindForSubMesh(uniformBuffer, scene) {
                if (!this._isEnabled) {
                    return;
                }
                const isFrozen = this._material.isFrozen;
                if (!uniformBuffer.useUbo || !isFrozen || !uniformBuffer.isSync) {
                    if ((this._texture || this._thicknessTexture) && MaterialFlags.IridescenceTextureEnabled) {
                        uniformBuffer.updateFloat4("vIridescenceInfos", this._texture?.coordinatesIndex ?? 0, this._texture?.level ?? 0, this._thicknessTexture?.coordinatesIndex ?? 0, this._thicknessTexture?.level ?? 0);
                        if (this._texture) {
                            BindTextureMatrix(this._texture, uniformBuffer, "iridescence");
                        }
                        if (this._thicknessTexture) {
                            BindTextureMatrix(this._thicknessTexture, uniformBuffer, "iridescenceThickness");
                        }
                    }
                    // Clear Coat General params
                    uniformBuffer.updateFloat4("vIridescenceParams", this.intensity, this.indexOfRefraction, this.minimumThickness, this.maximumThickness);
                }
                // Textures
                if (scene.texturesEnabled) {
                    if (this._texture && MaterialFlags.IridescenceTextureEnabled) {
                        uniformBuffer.setTexture("iridescenceSampler", this._texture);
                    }
                    if (this._thicknessTexture && MaterialFlags.IridescenceTextureEnabled) {
                        uniformBuffer.setTexture("iridescenceThicknessSampler", this._thicknessTexture);
                    }
                }
            }
            /**
             * Checks whether iridescence uses a texture.
             * @param texture defines the texture to check
             * @returns true if the texture is used by iridescence
             */
            hasTexture(texture) {
                if (this._texture === texture) {
                    return true;
                }
                if (this._thicknessTexture === texture) {
                    return true;
                }
                return false;
            }
            /**
             * Adds the active iridescence textures.
             * @param activeTextures defines the list of active textures to update
             */
            getActiveTextures(activeTextures) {
                if (this._texture) {
                    activeTextures.push(this._texture);
                }
                if (this._thicknessTexture) {
                    activeTextures.push(this._thicknessTexture);
                }
            }
            /**
             * Adds the animatable iridescence textures.
             * @param animatables defines the list of animatables to update
             */
            getAnimatables(animatables) {
                if (this._texture && this._texture.animations && this._texture.animations.length > 0) {
                    animatables.push(this._texture);
                }
                if (this._thicknessTexture && this._thicknessTexture.animations && this._thicknessTexture.animations.length > 0) {
                    animatables.push(this._thicknessTexture);
                }
            }
            /**
             * Disposes the iridescence textures.
             * @param forceDisposeTextures defines whether to dispose the textures
             */
            dispose(forceDisposeTextures) {
                if (forceDisposeTextures) {
                    this._texture?.dispose();
                    this._thicknessTexture?.dispose();
                }
            }
            getClassName() {
                return "PBRIridescenceConfiguration";
            }
            addFallbacks(defines, fallbacks, currentRank) {
                if (defines.IRIDESCENCE) {
                    fallbacks.addFallback(currentRank++, "IRIDESCENCE");
                }
                return currentRank;
            }
            /**
             * Adds the iridescence sampler names.
             * @param samplers defines the list of sampler names to update
             */
            getSamplers(samplers) {
                samplers.push("iridescenceSampler", "iridescenceThicknessSampler");
            }
            getUniforms() {
                return {
                    ubo: [
                        { name: "vIridescenceParams", size: 4, type: "vec4" },
                        { name: "vIridescenceInfos", size: 4, type: "vec4" },
                        { name: "iridescenceMatrix", size: 16, type: "mat4" },
                        { name: "iridescenceThicknessMatrix", size: 16, type: "mat4" },
                    ],
                };
            }
        },
        _PBRIridescenceConfiguration_isEnabled_accessor_storage = new WeakMap(),
        _PBRIridescenceConfiguration_texture_accessor_storage = new WeakMap(),
        _PBRIridescenceConfiguration_thicknessTexture_accessor_storage = new WeakMap(),
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _isEnabled_decorators = [serialize(), expandToProperty("_markAllSubMeshesAsTexturesDirty")];
            _intensity_decorators = [serialize()];
            _minimumThickness_decorators = [serialize()];
            _maximumThickness_decorators = [serialize()];
            _indexOfRefraction_decorators = [serialize()];
            _texture_decorators = [serializeAsTexture(), expandToProperty("_markAllSubMeshesAsTexturesDirty")];
            _thicknessTexture_decorators = [serializeAsTexture(), expandToProperty("_markAllSubMeshesAsTexturesDirty")];
            __esDecorate(_a, null, _isEnabled_decorators, { kind: "accessor", name: "isEnabled", static: false, private: false, access: { has: obj => "isEnabled" in obj, get: obj => obj.isEnabled, set: (obj, value) => { obj.isEnabled = value; } }, metadata: _metadata }, _isEnabled_initializers, _isEnabled_extraInitializers);
            __esDecorate(_a, null, _texture_decorators, { kind: "accessor", name: "texture", static: false, private: false, access: { has: obj => "texture" in obj, get: obj => obj.texture, set: (obj, value) => { obj.texture = value; } }, metadata: _metadata }, _texture_initializers, _texture_extraInitializers);
            __esDecorate(_a, null, _thicknessTexture_decorators, { kind: "accessor", name: "thicknessTexture", static: false, private: false, access: { has: obj => "thicknessTexture" in obj, get: obj => obj.thicknessTexture, set: (obj, value) => { obj.thicknessTexture = value; } }, metadata: _metadata }, _thicknessTexture_initializers, _thicknessTexture_extraInitializers);
            __esDecorate(null, null, _intensity_decorators, { kind: "field", name: "intensity", static: false, private: false, access: { has: obj => "intensity" in obj, get: obj => obj.intensity, set: (obj, value) => { obj.intensity = value; } }, metadata: _metadata }, _intensity_initializers, _intensity_extraInitializers);
            __esDecorate(null, null, _minimumThickness_decorators, { kind: "field", name: "minimumThickness", static: false, private: false, access: { has: obj => "minimumThickness" in obj, get: obj => obj.minimumThickness, set: (obj, value) => { obj.minimumThickness = value; } }, metadata: _metadata }, _minimumThickness_initializers, _minimumThickness_extraInitializers);
            __esDecorate(null, null, _maximumThickness_decorators, { kind: "field", name: "maximumThickness", static: false, private: false, access: { has: obj => "maximumThickness" in obj, get: obj => obj.maximumThickness, set: (obj, value) => { obj.maximumThickness = value; } }, metadata: _metadata }, _maximumThickness_initializers, _maximumThickness_extraInitializers);
            __esDecorate(null, null, _indexOfRefraction_decorators, { kind: "field", name: "indexOfRefraction", static: false, private: false, access: { has: obj => "indexOfRefraction" in obj, get: obj => obj.indexOfRefraction, set: (obj, value) => { obj.indexOfRefraction = value; } }, metadata: _metadata }, _indexOfRefraction_initializers, _indexOfRefraction_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        /**
         * The default minimum thickness of the thin-film layer given in nanometers (nm).
         * Defaults to 100 nm.
         * @internal
         */
        _a._DefaultMinimumThickness = 100,
        /**
         * The default maximum thickness of the thin-film layer given in nanometers (nm).
         * Defaults to 400 nm.
         * @internal
         */
        _a._DefaultMaximumThickness = 400,
        /**
         * The default index of refraction of the thin-film layer.
         * Defaults to 1.3
         * @internal
         */
        _a._DefaultIndexOfRefraction = 1.3,
        _a;
})();
export { PBRIridescenceConfiguration };
//# sourceMappingURL=pbrIridescenceConfiguration.js.map