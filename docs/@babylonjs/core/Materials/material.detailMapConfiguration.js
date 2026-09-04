import { __classPrivateFieldGet, __classPrivateFieldSet, __esDecorate, __runInitializers } from "../tslib.es6.js";
import { Material } from "./material.js";
import { serialize, expandToProperty, serializeAsTexture } from "../Misc/decorators.js";
import { MaterialFlags } from "./materialFlags.js";
import { MaterialDefines } from "./materialDefines.js";
import { MaterialPluginBase } from "./materialPluginBase.pure.js";

import { BindTextureMatrix, PrepareDefinesForMergedUV } from "./materialHelper.functions.js";
/**
 * @internal
 */
export class MaterialDetailMapDefines extends MaterialDefines {
    constructor() {
        super(...arguments);
        this.DETAIL = false;
        this.DETAILDIRECTUV = 0;
        this.DETAIL_NORMALBLENDMETHOD = 0;
    }
}
/**
 * Plugin that implements the detail map component of a material
 *
 * Inspired from:
 *   Unity: https://docs.unity3d.com/Packages/com.unity.render-pipelines.high-definition@9.0/manual/Mask-Map-and-Detail-Map.html and https://docs.unity3d.com/Manual/StandardShaderMaterialParameterDetail.html
 *   Unreal: https://docs.unrealengine.com/en-US/Engine/Rendering/Materials/HowTo/DetailTexturing/index.html
 *   Cryengine: https://docs.cryengine.com/display/SDKDOC2/Detail+Maps
 */
let DetailMapConfiguration = (() => {
    var _a, _DetailMapConfiguration_texture_accessor_storage, _DetailMapConfiguration_normalBlendMethod_accessor_storage, _DetailMapConfiguration_isEnabled_accessor_storage;
    let _classSuper = MaterialPluginBase;
    let _texture_decorators;
    let _texture_initializers = [];
    let _texture_extraInitializers = [];
    let _diffuseBlendLevel_decorators;
    let _diffuseBlendLevel_initializers = [];
    let _diffuseBlendLevel_extraInitializers = [];
    let _roughnessBlendLevel_decorators;
    let _roughnessBlendLevel_initializers = [];
    let _roughnessBlendLevel_extraInitializers = [];
    let _bumpLevel_decorators;
    let _bumpLevel_initializers = [];
    let _bumpLevel_extraInitializers = [];
    let _normalBlendMethod_decorators;
    let _normalBlendMethod_initializers = [];
    let _normalBlendMethod_extraInitializers = [];
    let _isEnabled_decorators;
    let _isEnabled_initializers = [];
    let _isEnabled_extraInitializers = [];
    return _a = class DetailMapConfiguration extends _classSuper {
            /**
             * The detail texture of the material.
             */
            get texture() { return __classPrivateFieldGet(this, _DetailMapConfiguration_texture_accessor_storage, "f"); }
            set texture(value) { __classPrivateFieldSet(this, _DetailMapConfiguration_texture_accessor_storage, value, "f"); }
            /**
             * The method used to blend the bump and detail normals together
             */
            get normalBlendMethod() { return __classPrivateFieldGet(this, _DetailMapConfiguration_normalBlendMethod_accessor_storage, "f"); }
            set normalBlendMethod(value) { __classPrivateFieldSet(this, _DetailMapConfiguration_normalBlendMethod_accessor_storage, value, "f"); }
            /**
             * Enable or disable the detail map on this material
             */
            get isEnabled() { return __classPrivateFieldGet(this, _DetailMapConfiguration_isEnabled_accessor_storage, "f"); }
            set isEnabled(value) { __classPrivateFieldSet(this, _DetailMapConfiguration_isEnabled_accessor_storage, value, "f"); }
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
                super(material, "DetailMap", 140, new MaterialDetailMapDefines(), addToPluginList);
                this._texture = null;
                _DetailMapConfiguration_texture_accessor_storage.set(this, __runInitializers(this, _texture_initializers, void 0));
                /**
                 * Defines how strongly the detail diffuse/albedo channel is blended with the regular diffuse/albedo texture
                 * Bigger values mean stronger blending
                 */
                this.diffuseBlendLevel = (__runInitializers(this, _texture_extraInitializers), __runInitializers(this, _diffuseBlendLevel_initializers, 1));
                /**
                 * Defines how strongly the detail roughness channel is blended with the regular roughness value
                 * Bigger values mean stronger blending. Only used with PBR materials
                 */
                this.roughnessBlendLevel = (__runInitializers(this, _diffuseBlendLevel_extraInitializers), __runInitializers(this, _roughnessBlendLevel_initializers, 1));
                /**
                 * Defines how strong the bump effect from the detail map is
                 * Bigger values mean stronger effect
                 */
                this.bumpLevel = (__runInitializers(this, _roughnessBlendLevel_extraInitializers), __runInitializers(this, _bumpLevel_initializers, 1));
                this._normalBlendMethod = (__runInitializers(this, _bumpLevel_extraInitializers), Material.MATERIAL_NORMALBLENDMETHOD_WHITEOUT);
                _DetailMapConfiguration_normalBlendMethod_accessor_storage.set(this, __runInitializers(this, _normalBlendMethod_initializers, void 0));
                this._isEnabled = (__runInitializers(this, _normalBlendMethod_extraInitializers), false);
                _DetailMapConfiguration_isEnabled_accessor_storage.set(this, __runInitializers(this, _isEnabled_initializers, false));
                /** @internal */
                this._internalMarkAllSubMeshesAsTexturesDirty = __runInitializers(this, _isEnabled_extraInitializers);
                this._internalMarkAllSubMeshesAsTexturesDirty = material._dirtyCallbacks[1];
            }
            /**
             * Checks whether the detail map textures are ready for the sub mesh.
             * @param defines defines the material defines to inspect
             * @param scene defines the scene to use for readiness checks
             * @param engine defines the engine to use for readiness checks
             * @returns true if the detail map is ready
             */
            isReadyForSubMesh(defines, scene, engine) {
                if (!this._isEnabled) {
                    return true;
                }
                if (defines._areTexturesDirty && scene.texturesEnabled) {
                    if (engine.getCaps().standardDerivatives && this._texture && MaterialFlags.DetailTextureEnabled) {
                        // Detail texture cannot be not blocking.
                        if (!this._texture.isReady()) {
                            return false;
                        }
                    }
                }
                return true;
            }
            /**
             * Updates the material defines for the detail map.
             * @param defines defines the material defines to update
             * @param scene defines the scene to use for texture checks
             */
            prepareDefines(defines, scene) {
                if (this._isEnabled) {
                    defines.DETAIL_NORMALBLENDMETHOD = this._normalBlendMethod;
                    const engine = scene.getEngine();
                    if (defines._areTexturesDirty) {
                        if (engine.getCaps().standardDerivatives && this._texture && MaterialFlags.DetailTextureEnabled && this._isEnabled) {
                            PrepareDefinesForMergedUV(this._texture, defines, "DETAIL");
                            defines.DETAIL_NORMALBLENDMETHOD = this._normalBlendMethod;
                        }
                        else {
                            defines.DETAIL = false;
                        }
                    }
                }
                else {
                    defines.DETAIL = false;
                }
            }
            /**
             * Binds the detail map data for a sub mesh.
             * @param uniformBuffer defines the uniform buffer to update
             * @param scene defines the scene to use for texture binding
             */
            bindForSubMesh(uniformBuffer, scene) {
                if (!this._isEnabled) {
                    return;
                }
                const isFrozen = this._material.isFrozen;
                if (!uniformBuffer.useUbo || !isFrozen || !uniformBuffer.isSync) {
                    if (this._texture && MaterialFlags.DetailTextureEnabled) {
                        uniformBuffer.updateFloat4("vDetailInfos", this._texture.coordinatesIndex, this.diffuseBlendLevel, this.bumpLevel, this.roughnessBlendLevel);
                        BindTextureMatrix(this._texture, uniformBuffer, "detail");
                    }
                }
                // Textures
                if (scene.texturesEnabled) {
                    if (this._texture && MaterialFlags.DetailTextureEnabled) {
                        uniformBuffer.setTexture("detailSampler", this._texture);
                    }
                }
            }
            /**
             * Checks whether the detail map uses a texture.
             * @param texture defines the texture to check
             * @returns true if the texture is used by the detail map
             */
            hasTexture(texture) {
                if (this._texture === texture) {
                    return true;
                }
                return false;
            }
            /**
             * Adds the active detail map textures.
             * @param activeTextures defines the list of active textures to update
             */
            getActiveTextures(activeTextures) {
                if (this._texture) {
                    activeTextures.push(this._texture);
                }
            }
            /**
             * Adds the animatable detail map textures.
             * @param animatables defines the list of animatables to update
             */
            getAnimatables(animatables) {
                if (this._texture && this._texture.animations && this._texture.animations.length > 0) {
                    animatables.push(this._texture);
                }
            }
            /**
             * Disposes the detail map textures.
             * @param forceDisposeTextures defines whether to dispose the textures
             */
            dispose(forceDisposeTextures) {
                if (forceDisposeTextures) {
                    this._texture?.dispose();
                }
            }
            getClassName() {
                return "DetailMapConfiguration";
            }
            /**
             * Adds the detail map sampler names.
             * @param samplers defines the list of sampler names to update
             */
            getSamplers(samplers) {
                samplers.push("detailSampler");
            }
            getUniforms() {
                return {
                    ubo: [
                        { name: "vDetailInfos", size: 4, type: "vec4" },
                        { name: "detailMatrix", size: 16, type: "mat4" },
                    ],
                };
            }
        },
        _DetailMapConfiguration_texture_accessor_storage = new WeakMap(),
        _DetailMapConfiguration_normalBlendMethod_accessor_storage = new WeakMap(),
        _DetailMapConfiguration_isEnabled_accessor_storage = new WeakMap(),
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _texture_decorators = [serializeAsTexture("detailTexture"), expandToProperty("_markAllSubMeshesAsTexturesDirty")];
            _diffuseBlendLevel_decorators = [serialize()];
            _roughnessBlendLevel_decorators = [serialize()];
            _bumpLevel_decorators = [serialize()];
            _normalBlendMethod_decorators = [serialize(), expandToProperty("_markAllSubMeshesAsTexturesDirty")];
            _isEnabled_decorators = [serialize(), expandToProperty("_markAllSubMeshesAsTexturesDirty")];
            __esDecorate(_a, null, _texture_decorators, { kind: "accessor", name: "texture", static: false, private: false, access: { has: obj => "texture" in obj, get: obj => obj.texture, set: (obj, value) => { obj.texture = value; } }, metadata: _metadata }, _texture_initializers, _texture_extraInitializers);
            __esDecorate(_a, null, _normalBlendMethod_decorators, { kind: "accessor", name: "normalBlendMethod", static: false, private: false, access: { has: obj => "normalBlendMethod" in obj, get: obj => obj.normalBlendMethod, set: (obj, value) => { obj.normalBlendMethod = value; } }, metadata: _metadata }, _normalBlendMethod_initializers, _normalBlendMethod_extraInitializers);
            __esDecorate(_a, null, _isEnabled_decorators, { kind: "accessor", name: "isEnabled", static: false, private: false, access: { has: obj => "isEnabled" in obj, get: obj => obj.isEnabled, set: (obj, value) => { obj.isEnabled = value; } }, metadata: _metadata }, _isEnabled_initializers, _isEnabled_extraInitializers);
            __esDecorate(null, null, _diffuseBlendLevel_decorators, { kind: "field", name: "diffuseBlendLevel", static: false, private: false, access: { has: obj => "diffuseBlendLevel" in obj, get: obj => obj.diffuseBlendLevel, set: (obj, value) => { obj.diffuseBlendLevel = value; } }, metadata: _metadata }, _diffuseBlendLevel_initializers, _diffuseBlendLevel_extraInitializers);
            __esDecorate(null, null, _roughnessBlendLevel_decorators, { kind: "field", name: "roughnessBlendLevel", static: false, private: false, access: { has: obj => "roughnessBlendLevel" in obj, get: obj => obj.roughnessBlendLevel, set: (obj, value) => { obj.roughnessBlendLevel = value; } }, metadata: _metadata }, _roughnessBlendLevel_initializers, _roughnessBlendLevel_extraInitializers);
            __esDecorate(null, null, _bumpLevel_decorators, { kind: "field", name: "bumpLevel", static: false, private: false, access: { has: obj => "bumpLevel" in obj, get: obj => obj.bumpLevel, set: (obj, value) => { obj.bumpLevel = value; } }, metadata: _metadata }, _bumpLevel_initializers, _bumpLevel_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
export { DetailMapConfiguration };
//# sourceMappingURL=material.detailMapConfiguration.js.map