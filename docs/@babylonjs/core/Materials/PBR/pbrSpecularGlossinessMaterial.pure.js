/** This file must only contain pure code and pure imports */
import { __classPrivateFieldGet, __classPrivateFieldSet, __esDecorate, __runInitializers } from "../../tslib.es6.js";
import { serialize, serializeAsColor3, expandToProperty, serializeAsTexture } from "../../Misc/decorators.js";
import { PBRBaseSimpleMaterial } from "./pbrBaseSimpleMaterial.js";
import { RegisterImageProcessingConfiguration } from "../imageProcessingConfiguration.pure.js";
import { SerializationHelper } from "../../Misc/decorators.serialization.js";
import { RegisterClass } from "../../Misc/typeStore.js";
/**
 * The PBR material of BJS following the specular glossiness convention.
 *
 * This fits to the PBR convention in the GLTF definition:
 * https://github.com/KhronosGroup/glTF/tree/2.0/extensions/Khronos/KHR_materials_pbrSpecularGlossiness
 */
let PBRSpecularGlossinessMaterial = (() => {
    var _a, _PBRSpecularGlossinessMaterial_diffuseColor_accessor_storage, _PBRSpecularGlossinessMaterial_diffuseTexture_accessor_storage, _PBRSpecularGlossinessMaterial_specularColor_accessor_storage, _PBRSpecularGlossinessMaterial_glossiness_accessor_storage, _PBRSpecularGlossinessMaterial_specularGlossinessTexture_accessor_storage;
    let _classSuper = PBRBaseSimpleMaterial;
    let _diffuseColor_decorators;
    let _diffuseColor_initializers = [];
    let _diffuseColor_extraInitializers = [];
    let _diffuseTexture_decorators;
    let _diffuseTexture_initializers = [];
    let _diffuseTexture_extraInitializers = [];
    let _specularColor_decorators;
    let _specularColor_initializers = [];
    let _specularColor_extraInitializers = [];
    let _glossiness_decorators;
    let _glossiness_initializers = [];
    let _glossiness_extraInitializers = [];
    let _specularGlossinessTexture_decorators;
    let _specularGlossinessTexture_initializers = [];
    let _specularGlossinessTexture_extraInitializers = [];
    return _a = class PBRSpecularGlossinessMaterial extends _classSuper {
            /**
             * Specifies the diffuse color of the material.
             */
            get diffuseColor() { return __classPrivateFieldGet(this, _PBRSpecularGlossinessMaterial_diffuseColor_accessor_storage, "f"); }
            set diffuseColor(value) { __classPrivateFieldSet(this, _PBRSpecularGlossinessMaterial_diffuseColor_accessor_storage, value, "f"); }
            /**
             * Specifies the diffuse texture of the material. This can also contains the opacity value in its alpha
             * channel.
             */
            get diffuseTexture() { return __classPrivateFieldGet(this, _PBRSpecularGlossinessMaterial_diffuseTexture_accessor_storage, "f"); }
            set diffuseTexture(value) { __classPrivateFieldSet(this, _PBRSpecularGlossinessMaterial_diffuseTexture_accessor_storage, value, "f"); }
            /**
             * Specifies the specular color of the material. This indicates how reflective is the material (none to mirror).
             */
            get specularColor() { return __classPrivateFieldGet(this, _PBRSpecularGlossinessMaterial_specularColor_accessor_storage, "f"); }
            set specularColor(value) { __classPrivateFieldSet(this, _PBRSpecularGlossinessMaterial_specularColor_accessor_storage, value, "f"); }
            /**
             * Specifies the glossiness of the material. This indicates "how sharp is the reflection".
             */
            get glossiness() { return __classPrivateFieldGet(this, _PBRSpecularGlossinessMaterial_glossiness_accessor_storage, "f"); }
            set glossiness(value) { __classPrivateFieldSet(this, _PBRSpecularGlossinessMaterial_glossiness_accessor_storage, value, "f"); }
            /**
             * Specifies both the specular color RGB and the glossiness A of the material per pixels.
             */
            get specularGlossinessTexture() { return __classPrivateFieldGet(this, _PBRSpecularGlossinessMaterial_specularGlossinessTexture_accessor_storage, "f"); }
            set specularGlossinessTexture(value) { __classPrivateFieldSet(this, _PBRSpecularGlossinessMaterial_specularGlossinessTexture_accessor_storage, value, "f"); }
            /**
             * Specifies if the reflectivity texture contains the glossiness information in its alpha channel.
             */
            get useMicroSurfaceFromReflectivityMapAlpha() {
                return this._useMicroSurfaceFromReflectivityMapAlpha;
            }
            /**
             * Instantiates a new PBRSpecularGlossinessMaterial instance.
             *
             * @param name The material name
             * @param scene The scene the material will be use in.
             */
            constructor(name, scene) {
                super(name, scene);
                _PBRSpecularGlossinessMaterial_diffuseColor_accessor_storage.set(this, __runInitializers(this, _diffuseColor_initializers, void 0));
                _PBRSpecularGlossinessMaterial_diffuseTexture_accessor_storage.set(this, (__runInitializers(this, _diffuseColor_extraInitializers), __runInitializers(this, _diffuseTexture_initializers, void 0)));
                _PBRSpecularGlossinessMaterial_specularColor_accessor_storage.set(this, (__runInitializers(this, _diffuseTexture_extraInitializers), __runInitializers(this, _specularColor_initializers, void 0)));
                _PBRSpecularGlossinessMaterial_glossiness_accessor_storage.set(this, (__runInitializers(this, _specularColor_extraInitializers), __runInitializers(this, _glossiness_initializers, void 0)));
                _PBRSpecularGlossinessMaterial_specularGlossinessTexture_accessor_storage.set(this, (__runInitializers(this, _glossiness_extraInitializers), __runInitializers(this, _specularGlossinessTexture_initializers, void 0)));
                __runInitializers(this, _specularGlossinessTexture_extraInitializers);
                this._useMicroSurfaceFromReflectivityMapAlpha = true;
            }
            /**
             * @returns the current class name of the material.
             */
            getClassName() {
                return "PBRSpecularGlossinessMaterial";
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
                serializationObject.customType = "BABYLON.PBRSpecularGlossinessMaterial";
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
             * @param scene - the scene to parse to.
             * @param rootUrl - root url of the assets.
             * @returns a new PBRSpecularGlossinessMaterial.
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
        _PBRSpecularGlossinessMaterial_diffuseColor_accessor_storage = new WeakMap(),
        _PBRSpecularGlossinessMaterial_diffuseTexture_accessor_storage = new WeakMap(),
        _PBRSpecularGlossinessMaterial_specularColor_accessor_storage = new WeakMap(),
        _PBRSpecularGlossinessMaterial_glossiness_accessor_storage = new WeakMap(),
        _PBRSpecularGlossinessMaterial_specularGlossinessTexture_accessor_storage = new WeakMap(),
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _diffuseColor_decorators = [serializeAsColor3("diffuse"), expandToProperty("_markAllSubMeshesAsTexturesDirty", "_albedoColor")];
            _diffuseTexture_decorators = [serializeAsTexture(), expandToProperty("_markAllSubMeshesAsTexturesDirty", "_albedoTexture")];
            _specularColor_decorators = [serializeAsColor3("specular"), expandToProperty("_markAllSubMeshesAsTexturesDirty", "_reflectivityColor")];
            _glossiness_decorators = [serialize(), expandToProperty("_markAllSubMeshesAsTexturesDirty", "_microSurface")];
            _specularGlossinessTexture_decorators = [serializeAsTexture(), expandToProperty("_markAllSubMeshesAsTexturesDirty", "_reflectivityTexture")];
            __esDecorate(_a, null, _diffuseColor_decorators, { kind: "accessor", name: "diffuseColor", static: false, private: false, access: { has: obj => "diffuseColor" in obj, get: obj => obj.diffuseColor, set: (obj, value) => { obj.diffuseColor = value; } }, metadata: _metadata }, _diffuseColor_initializers, _diffuseColor_extraInitializers);
            __esDecorate(_a, null, _diffuseTexture_decorators, { kind: "accessor", name: "diffuseTexture", static: false, private: false, access: { has: obj => "diffuseTexture" in obj, get: obj => obj.diffuseTexture, set: (obj, value) => { obj.diffuseTexture = value; } }, metadata: _metadata }, _diffuseTexture_initializers, _diffuseTexture_extraInitializers);
            __esDecorate(_a, null, _specularColor_decorators, { kind: "accessor", name: "specularColor", static: false, private: false, access: { has: obj => "specularColor" in obj, get: obj => obj.specularColor, set: (obj, value) => { obj.specularColor = value; } }, metadata: _metadata }, _specularColor_initializers, _specularColor_extraInitializers);
            __esDecorate(_a, null, _glossiness_decorators, { kind: "accessor", name: "glossiness", static: false, private: false, access: { has: obj => "glossiness" in obj, get: obj => obj.glossiness, set: (obj, value) => { obj.glossiness = value; } }, metadata: _metadata }, _glossiness_initializers, _glossiness_extraInitializers);
            __esDecorate(_a, null, _specularGlossinessTexture_decorators, { kind: "accessor", name: "specularGlossinessTexture", static: false, private: false, access: { has: obj => "specularGlossinessTexture" in obj, get: obj => obj.specularGlossinessTexture, set: (obj, value) => { obj.specularGlossinessTexture = value; } }, metadata: _metadata }, _specularGlossinessTexture_initializers, _specularGlossinessTexture_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
export { PBRSpecularGlossinessMaterial };
let _Registered = false;
/**
 * Register side effects for pbrSpecularGlossinessMaterial.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterPbrSpecularGlossinessMaterial() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    // PBRSpecularGlossinessMaterial serializes its image processing configuration, so the parser must be registered for clone/parse to work.
    RegisterImageProcessingConfiguration();
    RegisterClass("BABYLON.PBRSpecularGlossinessMaterial", PBRSpecularGlossinessMaterial);
}
//# sourceMappingURL=pbrSpecularGlossinessMaterial.pure.js.map