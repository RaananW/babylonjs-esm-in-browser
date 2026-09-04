/** This file must only contain pure code and pure imports */
import { __classPrivateFieldGet, __classPrivateFieldSet, __esDecorate, __runInitializers } from "../../tslib.es6.js";
import { serialize, serializeAsColor3, expandToProperty, serializeAsTexture } from "../../Misc/decorators.js";
import { SerializationHelper } from "../../Misc/decorators.serialization.js";
import { PBRBaseSimpleMaterial } from "./pbrBaseSimpleMaterial.js";
import { RegisterImageProcessingConfiguration } from "../imageProcessingConfiguration.pure.js";
import { RegisterClass } from "../../Misc/typeStore.js";
/**
 * The PBR material of BJS following the metal roughness convention.
 *
 * This fits to the PBR convention in the GLTF definition:
 * https://github.com/KhronosGroup/glTF/blob/main/extensions/2.0/Archived/KHR_materials_pbrSpecularGlossiness/README.md
 */
let PBRMetallicRoughnessMaterial = (() => {
    var _a, _PBRMetallicRoughnessMaterial_baseColor_accessor_storage, _PBRMetallicRoughnessMaterial_baseTexture_accessor_storage, _PBRMetallicRoughnessMaterial_metallic_accessor_storage, _PBRMetallicRoughnessMaterial_roughness_accessor_storage, _PBRMetallicRoughnessMaterial_metallicRoughnessTexture_accessor_storage;
    let _classSuper = PBRBaseSimpleMaterial;
    let _baseColor_decorators;
    let _baseColor_initializers = [];
    let _baseColor_extraInitializers = [];
    let _baseTexture_decorators;
    let _baseTexture_initializers = [];
    let _baseTexture_extraInitializers = [];
    let _metallic_decorators;
    let _metallic_initializers = [];
    let _metallic_extraInitializers = [];
    let _roughness_decorators;
    let _roughness_initializers = [];
    let _roughness_extraInitializers = [];
    let _metallicRoughnessTexture_decorators;
    let _metallicRoughnessTexture_initializers = [];
    let _metallicRoughnessTexture_extraInitializers = [];
    return _a = class PBRMetallicRoughnessMaterial extends _classSuper {
            /**
             * The base color has two different interpretations depending on the value of metalness.
             * When the material is a metal, the base color is the specific measured reflectance value
             * at normal incidence (F0). For a non-metal the base color represents the reflected diffuse color
             * of the material.
             */
            get baseColor() { return __classPrivateFieldGet(this, _PBRMetallicRoughnessMaterial_baseColor_accessor_storage, "f"); }
            set baseColor(value) { __classPrivateFieldSet(this, _PBRMetallicRoughnessMaterial_baseColor_accessor_storage, value, "f"); }
            /**
             * Base texture of the metallic workflow. It contains both the baseColor information in RGB as
             * well as opacity information in the alpha channel.
             */
            get baseTexture() { return __classPrivateFieldGet(this, _PBRMetallicRoughnessMaterial_baseTexture_accessor_storage, "f"); }
            set baseTexture(value) { __classPrivateFieldSet(this, _PBRMetallicRoughnessMaterial_baseTexture_accessor_storage, value, "f"); }
            /**
             * Specifies the metallic scalar value of the material.
             * Can also be used to scale the metalness values of the metallic texture.
             */
            get metallic() { return __classPrivateFieldGet(this, _PBRMetallicRoughnessMaterial_metallic_accessor_storage, "f"); }
            set metallic(value) { __classPrivateFieldSet(this, _PBRMetallicRoughnessMaterial_metallic_accessor_storage, value, "f"); }
            /**
             * Specifies the roughness scalar value of the material.
             * Can also be used to scale the roughness values of the metallic texture.
             */
            get roughness() { return __classPrivateFieldGet(this, _PBRMetallicRoughnessMaterial_roughness_accessor_storage, "f"); }
            set roughness(value) { __classPrivateFieldSet(this, _PBRMetallicRoughnessMaterial_roughness_accessor_storage, value, "f"); }
            /**
             * Texture containing both the metallic value in the B channel and the
             * roughness value in the G channel to keep better precision.
             */
            get metallicRoughnessTexture() { return __classPrivateFieldGet(this, _PBRMetallicRoughnessMaterial_metallicRoughnessTexture_accessor_storage, "f"); }
            set metallicRoughnessTexture(value) { __classPrivateFieldSet(this, _PBRMetallicRoughnessMaterial_metallicRoughnessTexture_accessor_storage, value, "f"); }
            /**
             * Instantiates a new PBRMetalRoughnessMaterial instance.
             *
             * @param name The material name
             * @param scene The scene the material will be use in.
             */
            constructor(name, scene) {
                super(name, scene);
                _PBRMetallicRoughnessMaterial_baseColor_accessor_storage.set(this, __runInitializers(this, _baseColor_initializers, void 0));
                _PBRMetallicRoughnessMaterial_baseTexture_accessor_storage.set(this, (__runInitializers(this, _baseColor_extraInitializers), __runInitializers(this, _baseTexture_initializers, void 0)));
                _PBRMetallicRoughnessMaterial_metallic_accessor_storage.set(this, (__runInitializers(this, _baseTexture_extraInitializers), __runInitializers(this, _metallic_initializers, void 0)));
                _PBRMetallicRoughnessMaterial_roughness_accessor_storage.set(this, (__runInitializers(this, _metallic_extraInitializers), __runInitializers(this, _roughness_initializers, void 0)));
                _PBRMetallicRoughnessMaterial_metallicRoughnessTexture_accessor_storage.set(this, (__runInitializers(this, _roughness_extraInitializers), __runInitializers(this, _metallicRoughnessTexture_initializers, void 0)));
                __runInitializers(this, _metallicRoughnessTexture_extraInitializers);
                this._useRoughnessFromMetallicTextureAlpha = false;
                this._useRoughnessFromMetallicTextureGreen = true;
                this._useMetallnessFromMetallicTextureBlue = true;
                this.metallic = 1.0;
                this.roughness = 1.0;
            }
            /**
             * @returns the current class name of the material.
             */
            getClassName() {
                return "PBRMetallicRoughnessMaterial";
            }
            /**
             * Makes a duplicate of the current material.
             * @param name - name to use for the new material.
             * @returns cloned material instance
             */
            clone(name) {
                const clone = SerializationHelper.Clone(() => new _a(name, this.getScene()), this);
                clone.id = name;
                clone.name = name;
                this.clearCoat.copyTo(clone.clearCoat);
                this.anisotropy.copyTo(clone.anisotropy);
                this.brdf.copyTo(clone.brdf);
                this.sheen.copyTo(clone.sheen);
                this.subSurface.copyTo(clone.subSurface);
                return clone;
            }
            /**
             * Serialize the material to a parsable JSON object.
             * @returns the JSON object
             */
            serialize() {
                const serializationObject = SerializationHelper.Serialize(this);
                serializationObject.customType = "BABYLON.PBRMetallicRoughnessMaterial";
                if (!this.clearCoat.doNotSerialize) {
                    serializationObject.clearCoat = this.clearCoat.serialize();
                }
                if (!this.anisotropy.doNotSerialize) {
                    serializationObject.anisotropy = this.anisotropy.serialize();
                }
                if (!this.brdf.doNotSerialize) {
                    serializationObject.brdf = this.brdf.serialize();
                }
                if (!this.sheen.doNotSerialize) {
                    serializationObject.sheen = this.sheen.serialize();
                }
                if (!this.subSurface.doNotSerialize) {
                    serializationObject.subSurface = this.subSurface.serialize();
                }
                if (!this.iridescence.doNotSerialize) {
                    serializationObject.iridescence = this.iridescence.serialize();
                }
                return serializationObject;
            }
            /**
             * Parses a JSON object corresponding to the serialize function.
             * @param source - JSON source object.
             * @param scene - Defines the scene we are parsing for
             * @param rootUrl - Defines the rootUrl of this parsed object
             * @returns a new PBRMetalRoughnessMaterial
             */
            static Parse(source, scene, rootUrl) {
                const material = SerializationHelper.Parse(() => new _a(source.name, scene), source, scene, rootUrl);
                if (source.clearCoat) {
                    material.clearCoat.parse(source.clearCoat, scene, rootUrl);
                }
                if (source.anisotropy) {
                    material.anisotropy.parse(source.anisotropy, scene, rootUrl);
                }
                if (source.brdf) {
                    material.brdf.parse(source.brdf, scene, rootUrl);
                }
                if (source.sheen) {
                    material.sheen.parse(source.sheen, scene, rootUrl);
                }
                if (source.subSurface) {
                    material.subSurface.parse(source.subSurface, scene, rootUrl);
                }
                if (source.iridescence) {
                    material.iridescence.parse(source.iridescence, scene, rootUrl);
                }
                return material;
            }
        },
        _PBRMetallicRoughnessMaterial_baseColor_accessor_storage = new WeakMap(),
        _PBRMetallicRoughnessMaterial_baseTexture_accessor_storage = new WeakMap(),
        _PBRMetallicRoughnessMaterial_metallic_accessor_storage = new WeakMap(),
        _PBRMetallicRoughnessMaterial_roughness_accessor_storage = new WeakMap(),
        _PBRMetallicRoughnessMaterial_metallicRoughnessTexture_accessor_storage = new WeakMap(),
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _baseColor_decorators = [serializeAsColor3(), expandToProperty("_markAllSubMeshesAsTexturesDirty", "_albedoColor")];
            _baseTexture_decorators = [serializeAsTexture(), expandToProperty("_markAllSubMeshesAsTexturesDirty", "_albedoTexture")];
            _metallic_decorators = [serialize(), expandToProperty("_markAllSubMeshesAsTexturesDirty")];
            _roughness_decorators = [serialize(), expandToProperty("_markAllSubMeshesAsTexturesDirty")];
            _metallicRoughnessTexture_decorators = [serializeAsTexture(), expandToProperty("_markAllSubMeshesAsTexturesDirty", "_metallicTexture")];
            __esDecorate(_a, null, _baseColor_decorators, { kind: "accessor", name: "baseColor", static: false, private: false, access: { has: obj => "baseColor" in obj, get: obj => obj.baseColor, set: (obj, value) => { obj.baseColor = value; } }, metadata: _metadata }, _baseColor_initializers, _baseColor_extraInitializers);
            __esDecorate(_a, null, _baseTexture_decorators, { kind: "accessor", name: "baseTexture", static: false, private: false, access: { has: obj => "baseTexture" in obj, get: obj => obj.baseTexture, set: (obj, value) => { obj.baseTexture = value; } }, metadata: _metadata }, _baseTexture_initializers, _baseTexture_extraInitializers);
            __esDecorate(_a, null, _metallic_decorators, { kind: "accessor", name: "metallic", static: false, private: false, access: { has: obj => "metallic" in obj, get: obj => obj.metallic, set: (obj, value) => { obj.metallic = value; } }, metadata: _metadata }, _metallic_initializers, _metallic_extraInitializers);
            __esDecorate(_a, null, _roughness_decorators, { kind: "accessor", name: "roughness", static: false, private: false, access: { has: obj => "roughness" in obj, get: obj => obj.roughness, set: (obj, value) => { obj.roughness = value; } }, metadata: _metadata }, _roughness_initializers, _roughness_extraInitializers);
            __esDecorate(_a, null, _metallicRoughnessTexture_decorators, { kind: "accessor", name: "metallicRoughnessTexture", static: false, private: false, access: { has: obj => "metallicRoughnessTexture" in obj, get: obj => obj.metallicRoughnessTexture, set: (obj, value) => { obj.metallicRoughnessTexture = value; } }, metadata: _metadata }, _metallicRoughnessTexture_initializers, _metallicRoughnessTexture_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
export { PBRMetallicRoughnessMaterial };
let _Registered = false;
/**
 * Register side effects for pbrMetallicRoughnessMaterial.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterPbrMetallicRoughnessMaterial() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    // PBRMetallicRoughnessMaterial serializes its image processing configuration, so the parser must be registered for clone/parse to work.
    RegisterImageProcessingConfiguration();
    RegisterClass("BABYLON.PBRMetallicRoughnessMaterial", PBRMetallicRoughnessMaterial);
}
//# sourceMappingURL=pbrMetallicRoughnessMaterial.pure.js.map