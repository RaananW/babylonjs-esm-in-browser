import { __classPrivateFieldGet, __classPrivateFieldSet, __esDecorate, __runInitializers } from "../../tslib.es6.js";
import { serialize, serializeAsColor3, expandToProperty, serializeAsTexture } from "../../Misc/decorators.js";
import { Color3 } from "../../Maths/math.color.pure.js";
import { PBRBaseMaterial } from "./pbrBaseMaterial.pure.js";
/**
 * The Physically based simple base material of BJS.
 *
 * This enables better naming and convention enforcements on top of the pbrMaterial.
 * It is used as the base class for both the specGloss and metalRough conventions.
 */
let PBRBaseSimpleMaterial = (() => {
    var _a, _PBRBaseSimpleMaterial_maxSimultaneousLights_accessor_storage, _PBRBaseSimpleMaterial_disableLighting_accessor_storage, _PBRBaseSimpleMaterial_environmentTexture_accessor_storage, _PBRBaseSimpleMaterial_invertNormalMapX_accessor_storage, _PBRBaseSimpleMaterial_invertNormalMapY_accessor_storage, _PBRBaseSimpleMaterial_normalTexture_accessor_storage, _PBRBaseSimpleMaterial_emissiveColor_accessor_storage, _PBRBaseSimpleMaterial_emissiveTexture_accessor_storage, _PBRBaseSimpleMaterial_occlusionStrength_accessor_storage, _PBRBaseSimpleMaterial_occlusionTexture_accessor_storage, _PBRBaseSimpleMaterial_alphaCutOff_accessor_storage, _PBRBaseSimpleMaterial_lightmapTexture_accessor_storage, _PBRBaseSimpleMaterial_useLightmapAsShadowmap_accessor_storage;
    let _classSuper = PBRBaseMaterial;
    let _instanceExtraInitializers = [];
    let _maxSimultaneousLights_decorators;
    let _maxSimultaneousLights_initializers = [];
    let _maxSimultaneousLights_extraInitializers = [];
    let _disableLighting_decorators;
    let _disableLighting_initializers = [];
    let _disableLighting_extraInitializers = [];
    let _environmentTexture_decorators;
    let _environmentTexture_initializers = [];
    let _environmentTexture_extraInitializers = [];
    let _invertNormalMapX_decorators;
    let _invertNormalMapX_initializers = [];
    let _invertNormalMapX_extraInitializers = [];
    let _invertNormalMapY_decorators;
    let _invertNormalMapY_initializers = [];
    let _invertNormalMapY_extraInitializers = [];
    let _normalTexture_decorators;
    let _normalTexture_initializers = [];
    let _normalTexture_extraInitializers = [];
    let _emissiveColor_decorators;
    let _emissiveColor_initializers = [];
    let _emissiveColor_extraInitializers = [];
    let _emissiveTexture_decorators;
    let _emissiveTexture_initializers = [];
    let _emissiveTexture_extraInitializers = [];
    let _occlusionStrength_decorators;
    let _occlusionStrength_initializers = [];
    let _occlusionStrength_extraInitializers = [];
    let _occlusionTexture_decorators;
    let _occlusionTexture_initializers = [];
    let _occlusionTexture_extraInitializers = [];
    let _alphaCutOff_decorators;
    let _alphaCutOff_initializers = [];
    let _alphaCutOff_extraInitializers = [];
    let _get_doubleSided_decorators;
    let _lightmapTexture_decorators;
    let _lightmapTexture_initializers = [];
    let _lightmapTexture_extraInitializers = [];
    let _useLightmapAsShadowmap_decorators;
    let _useLightmapAsShadowmap_initializers = [];
    let _useLightmapAsShadowmap_extraInitializers = [];
    return _a = class PBRBaseSimpleMaterial extends _classSuper {
            /**
             * Number of Simultaneous lights allowed on the material.
             */
            get maxSimultaneousLights() { return __classPrivateFieldGet(this, _PBRBaseSimpleMaterial_maxSimultaneousLights_accessor_storage, "f"); }
            set maxSimultaneousLights(value) { __classPrivateFieldSet(this, _PBRBaseSimpleMaterial_maxSimultaneousLights_accessor_storage, value, "f"); }
            /**
             * If sets to true, disables all the lights affecting the material.
             */
            get disableLighting() { return __classPrivateFieldGet(this, _PBRBaseSimpleMaterial_disableLighting_accessor_storage, "f"); }
            set disableLighting(value) { __classPrivateFieldSet(this, _PBRBaseSimpleMaterial_disableLighting_accessor_storage, value, "f"); }
            /**
             * Environment Texture used in the material (this is use for both reflection and environment lighting).
             */
            get environmentTexture() { return __classPrivateFieldGet(this, _PBRBaseSimpleMaterial_environmentTexture_accessor_storage, "f"); }
            set environmentTexture(value) { __classPrivateFieldSet(this, _PBRBaseSimpleMaterial_environmentTexture_accessor_storage, value, "f"); }
            /**
             * If sets to true, x component of normal map value will invert (x = 1.0 - x).
             */
            get invertNormalMapX() { return __classPrivateFieldGet(this, _PBRBaseSimpleMaterial_invertNormalMapX_accessor_storage, "f"); }
            set invertNormalMapX(value) { __classPrivateFieldSet(this, _PBRBaseSimpleMaterial_invertNormalMapX_accessor_storage, value, "f"); }
            /**
             * If sets to true, y component of normal map value will invert (y = 1.0 - y).
             */
            get invertNormalMapY() { return __classPrivateFieldGet(this, _PBRBaseSimpleMaterial_invertNormalMapY_accessor_storage, "f"); }
            set invertNormalMapY(value) { __classPrivateFieldSet(this, _PBRBaseSimpleMaterial_invertNormalMapY_accessor_storage, value, "f"); }
            /**
             * Normal map used in the model.
             */
            get normalTexture() { return __classPrivateFieldGet(this, _PBRBaseSimpleMaterial_normalTexture_accessor_storage, "f"); }
            set normalTexture(value) { __classPrivateFieldSet(this, _PBRBaseSimpleMaterial_normalTexture_accessor_storage, value, "f"); }
            /**
             * Emissivie color used to self-illuminate the model.
             */
            get emissiveColor() { return __classPrivateFieldGet(this, _PBRBaseSimpleMaterial_emissiveColor_accessor_storage, "f"); }
            set emissiveColor(value) { __classPrivateFieldSet(this, _PBRBaseSimpleMaterial_emissiveColor_accessor_storage, value, "f"); }
            /**
             * Emissivie texture used to self-illuminate the model.
             */
            get emissiveTexture() { return __classPrivateFieldGet(this, _PBRBaseSimpleMaterial_emissiveTexture_accessor_storage, "f"); }
            set emissiveTexture(value) { __classPrivateFieldSet(this, _PBRBaseSimpleMaterial_emissiveTexture_accessor_storage, value, "f"); }
            /**
             * Occlusion Channel Strength.
             */
            get occlusionStrength() { return __classPrivateFieldGet(this, _PBRBaseSimpleMaterial_occlusionStrength_accessor_storage, "f"); }
            set occlusionStrength(value) { __classPrivateFieldSet(this, _PBRBaseSimpleMaterial_occlusionStrength_accessor_storage, value, "f"); }
            /**
             * Occlusion Texture of the material (adding extra occlusion effects).
             */
            get occlusionTexture() { return __classPrivateFieldGet(this, _PBRBaseSimpleMaterial_occlusionTexture_accessor_storage, "f"); }
            set occlusionTexture(value) { __classPrivateFieldSet(this, _PBRBaseSimpleMaterial_occlusionTexture_accessor_storage, value, "f"); }
            /**
             * Defines the alpha limits in alpha test mode.
             */
            get alphaCutOff() { return __classPrivateFieldGet(this, _PBRBaseSimpleMaterial_alphaCutOff_accessor_storage, "f"); }
            set alphaCutOff(value) { __classPrivateFieldSet(this, _PBRBaseSimpleMaterial_alphaCutOff_accessor_storage, value, "f"); }
            /**
             * Gets the current double sided mode.
             */
            get doubleSided() {
                return this._twoSidedLighting;
            }
            /**
             * If sets to true and backfaceCulling is false, normals will be flipped on the backside.
             */
            set doubleSided(value) {
                if (this._twoSidedLighting === value) {
                    return;
                }
                this._twoSidedLighting = value;
                this.backFaceCulling = !value;
                this._markAllSubMeshesAsTexturesDirty();
            }
            /**
             * Stores the pre-calculated light information of a mesh in a texture.
             */
            get lightmapTexture() { return __classPrivateFieldGet(this, _PBRBaseSimpleMaterial_lightmapTexture_accessor_storage, "f"); }
            set lightmapTexture(value) { __classPrivateFieldSet(this, _PBRBaseSimpleMaterial_lightmapTexture_accessor_storage, value, "f"); }
            /**
             * If true, the light map contains occlusion information instead of lighting info.
             */
            get useLightmapAsShadowmap() { return __classPrivateFieldGet(this, _PBRBaseSimpleMaterial_useLightmapAsShadowmap_accessor_storage, "f"); }
            set useLightmapAsShadowmap(value) { __classPrivateFieldSet(this, _PBRBaseSimpleMaterial_useLightmapAsShadowmap_accessor_storage, value, "f"); }
            /**
             * Instantiates a new PBRMaterial instance.
             *
             * @param name The material name
             * @param scene The scene the material will be use in.
             */
            constructor(name, scene) {
                super(name, scene);
                _PBRBaseSimpleMaterial_maxSimultaneousLights_accessor_storage.set(this, (__runInitializers(this, _instanceExtraInitializers), __runInitializers(this, _maxSimultaneousLights_initializers, 4)));
                _PBRBaseSimpleMaterial_disableLighting_accessor_storage.set(this, (__runInitializers(this, _maxSimultaneousLights_extraInitializers), __runInitializers(this, _disableLighting_initializers, false)));
                _PBRBaseSimpleMaterial_environmentTexture_accessor_storage.set(this, (__runInitializers(this, _disableLighting_extraInitializers), __runInitializers(this, _environmentTexture_initializers, void 0)));
                _PBRBaseSimpleMaterial_invertNormalMapX_accessor_storage.set(this, (__runInitializers(this, _environmentTexture_extraInitializers), __runInitializers(this, _invertNormalMapX_initializers, false)));
                _PBRBaseSimpleMaterial_invertNormalMapY_accessor_storage.set(this, (__runInitializers(this, _invertNormalMapX_extraInitializers), __runInitializers(this, _invertNormalMapY_initializers, false)));
                _PBRBaseSimpleMaterial_normalTexture_accessor_storage.set(this, (__runInitializers(this, _invertNormalMapY_extraInitializers), __runInitializers(this, _normalTexture_initializers, void 0)));
                _PBRBaseSimpleMaterial_emissiveColor_accessor_storage.set(this, (__runInitializers(this, _normalTexture_extraInitializers), __runInitializers(this, _emissiveColor_initializers, new Color3(0, 0, 0))));
                _PBRBaseSimpleMaterial_emissiveTexture_accessor_storage.set(this, (__runInitializers(this, _emissiveColor_extraInitializers), __runInitializers(this, _emissiveTexture_initializers, void 0)));
                _PBRBaseSimpleMaterial_occlusionStrength_accessor_storage.set(this, (__runInitializers(this, _emissiveTexture_extraInitializers), __runInitializers(this, _occlusionStrength_initializers, 1.0)));
                _PBRBaseSimpleMaterial_occlusionTexture_accessor_storage.set(this, (__runInitializers(this, _occlusionStrength_extraInitializers), __runInitializers(this, _occlusionTexture_initializers, void 0)));
                _PBRBaseSimpleMaterial_alphaCutOff_accessor_storage.set(this, (__runInitializers(this, _occlusionTexture_extraInitializers), __runInitializers(this, _alphaCutOff_initializers, void 0)));
                _PBRBaseSimpleMaterial_lightmapTexture_accessor_storage.set(this, (__runInitializers(this, _alphaCutOff_extraInitializers), __runInitializers(this, _lightmapTexture_initializers, void 0)));
                _PBRBaseSimpleMaterial_useLightmapAsShadowmap_accessor_storage.set(this, (__runInitializers(this, _lightmapTexture_extraInitializers), __runInitializers(this, _useLightmapAsShadowmap_initializers, false)));
                __runInitializers(this, _useLightmapAsShadowmap_extraInitializers);
                this._useAlphaFromAlbedoTexture = true;
                this._useAmbientInGrayScale = true;
            }
            getClassName() {
                return "PBRBaseSimpleMaterial";
            }
        },
        _PBRBaseSimpleMaterial_maxSimultaneousLights_accessor_storage = new WeakMap(),
        _PBRBaseSimpleMaterial_disableLighting_accessor_storage = new WeakMap(),
        _PBRBaseSimpleMaterial_environmentTexture_accessor_storage = new WeakMap(),
        _PBRBaseSimpleMaterial_invertNormalMapX_accessor_storage = new WeakMap(),
        _PBRBaseSimpleMaterial_invertNormalMapY_accessor_storage = new WeakMap(),
        _PBRBaseSimpleMaterial_normalTexture_accessor_storage = new WeakMap(),
        _PBRBaseSimpleMaterial_emissiveColor_accessor_storage = new WeakMap(),
        _PBRBaseSimpleMaterial_emissiveTexture_accessor_storage = new WeakMap(),
        _PBRBaseSimpleMaterial_occlusionStrength_accessor_storage = new WeakMap(),
        _PBRBaseSimpleMaterial_occlusionTexture_accessor_storage = new WeakMap(),
        _PBRBaseSimpleMaterial_alphaCutOff_accessor_storage = new WeakMap(),
        _PBRBaseSimpleMaterial_lightmapTexture_accessor_storage = new WeakMap(),
        _PBRBaseSimpleMaterial_useLightmapAsShadowmap_accessor_storage = new WeakMap(),
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _maxSimultaneousLights_decorators = [serialize(), expandToProperty("_markAllSubMeshesAsLightsDirty")];
            _disableLighting_decorators = [serialize(), expandToProperty("_markAllSubMeshesAsLightsDirty")];
            _environmentTexture_decorators = [serializeAsTexture(), expandToProperty("_markAllSubMeshesAsTexturesDirty", "_reflectionTexture")];
            _invertNormalMapX_decorators = [serialize(), expandToProperty("_markAllSubMeshesAsTexturesDirty")];
            _invertNormalMapY_decorators = [serialize(), expandToProperty("_markAllSubMeshesAsTexturesDirty")];
            _normalTexture_decorators = [serializeAsTexture(), expandToProperty("_markAllSubMeshesAsTexturesDirty", "_bumpTexture")];
            _emissiveColor_decorators = [serializeAsColor3("emissive"), expandToProperty("_markAllSubMeshesAsTexturesDirty")];
            _emissiveTexture_decorators = [serializeAsTexture(), expandToProperty("_markAllSubMeshesAsTexturesDirty")];
            _occlusionStrength_decorators = [serialize(), expandToProperty("_markAllSubMeshesAsTexturesDirty", "_ambientTextureStrength")];
            _occlusionTexture_decorators = [serializeAsTexture(), expandToProperty("_markAllSubMeshesAsTexturesDirty", "_ambientTexture")];
            _alphaCutOff_decorators = [serialize(), expandToProperty("_markAllSubMeshesAsTexturesDirty", "_alphaCutOff")];
            _get_doubleSided_decorators = [serialize()];
            _lightmapTexture_decorators = [serializeAsTexture(), expandToProperty("_markAllSubMeshesAsTexturesDirty", null)];
            _useLightmapAsShadowmap_decorators = [serialize(), expandToProperty("_markAllSubMeshesAsTexturesDirty")];
            __esDecorate(_a, null, _maxSimultaneousLights_decorators, { kind: "accessor", name: "maxSimultaneousLights", static: false, private: false, access: { has: obj => "maxSimultaneousLights" in obj, get: obj => obj.maxSimultaneousLights, set: (obj, value) => { obj.maxSimultaneousLights = value; } }, metadata: _metadata }, _maxSimultaneousLights_initializers, _maxSimultaneousLights_extraInitializers);
            __esDecorate(_a, null, _disableLighting_decorators, { kind: "accessor", name: "disableLighting", static: false, private: false, access: { has: obj => "disableLighting" in obj, get: obj => obj.disableLighting, set: (obj, value) => { obj.disableLighting = value; } }, metadata: _metadata }, _disableLighting_initializers, _disableLighting_extraInitializers);
            __esDecorate(_a, null, _environmentTexture_decorators, { kind: "accessor", name: "environmentTexture", static: false, private: false, access: { has: obj => "environmentTexture" in obj, get: obj => obj.environmentTexture, set: (obj, value) => { obj.environmentTexture = value; } }, metadata: _metadata }, _environmentTexture_initializers, _environmentTexture_extraInitializers);
            __esDecorate(_a, null, _invertNormalMapX_decorators, { kind: "accessor", name: "invertNormalMapX", static: false, private: false, access: { has: obj => "invertNormalMapX" in obj, get: obj => obj.invertNormalMapX, set: (obj, value) => { obj.invertNormalMapX = value; } }, metadata: _metadata }, _invertNormalMapX_initializers, _invertNormalMapX_extraInitializers);
            __esDecorate(_a, null, _invertNormalMapY_decorators, { kind: "accessor", name: "invertNormalMapY", static: false, private: false, access: { has: obj => "invertNormalMapY" in obj, get: obj => obj.invertNormalMapY, set: (obj, value) => { obj.invertNormalMapY = value; } }, metadata: _metadata }, _invertNormalMapY_initializers, _invertNormalMapY_extraInitializers);
            __esDecorate(_a, null, _normalTexture_decorators, { kind: "accessor", name: "normalTexture", static: false, private: false, access: { has: obj => "normalTexture" in obj, get: obj => obj.normalTexture, set: (obj, value) => { obj.normalTexture = value; } }, metadata: _metadata }, _normalTexture_initializers, _normalTexture_extraInitializers);
            __esDecorate(_a, null, _emissiveColor_decorators, { kind: "accessor", name: "emissiveColor", static: false, private: false, access: { has: obj => "emissiveColor" in obj, get: obj => obj.emissiveColor, set: (obj, value) => { obj.emissiveColor = value; } }, metadata: _metadata }, _emissiveColor_initializers, _emissiveColor_extraInitializers);
            __esDecorate(_a, null, _emissiveTexture_decorators, { kind: "accessor", name: "emissiveTexture", static: false, private: false, access: { has: obj => "emissiveTexture" in obj, get: obj => obj.emissiveTexture, set: (obj, value) => { obj.emissiveTexture = value; } }, metadata: _metadata }, _emissiveTexture_initializers, _emissiveTexture_extraInitializers);
            __esDecorate(_a, null, _occlusionStrength_decorators, { kind: "accessor", name: "occlusionStrength", static: false, private: false, access: { has: obj => "occlusionStrength" in obj, get: obj => obj.occlusionStrength, set: (obj, value) => { obj.occlusionStrength = value; } }, metadata: _metadata }, _occlusionStrength_initializers, _occlusionStrength_extraInitializers);
            __esDecorate(_a, null, _occlusionTexture_decorators, { kind: "accessor", name: "occlusionTexture", static: false, private: false, access: { has: obj => "occlusionTexture" in obj, get: obj => obj.occlusionTexture, set: (obj, value) => { obj.occlusionTexture = value; } }, metadata: _metadata }, _occlusionTexture_initializers, _occlusionTexture_extraInitializers);
            __esDecorate(_a, null, _alphaCutOff_decorators, { kind: "accessor", name: "alphaCutOff", static: false, private: false, access: { has: obj => "alphaCutOff" in obj, get: obj => obj.alphaCutOff, set: (obj, value) => { obj.alphaCutOff = value; } }, metadata: _metadata }, _alphaCutOff_initializers, _alphaCutOff_extraInitializers);
            __esDecorate(_a, null, _get_doubleSided_decorators, { kind: "getter", name: "doubleSided", static: false, private: false, access: { has: obj => "doubleSided" in obj, get: obj => obj.doubleSided }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _lightmapTexture_decorators, { kind: "accessor", name: "lightmapTexture", static: false, private: false, access: { has: obj => "lightmapTexture" in obj, get: obj => obj.lightmapTexture, set: (obj, value) => { obj.lightmapTexture = value; } }, metadata: _metadata }, _lightmapTexture_initializers, _lightmapTexture_extraInitializers);
            __esDecorate(_a, null, _useLightmapAsShadowmap_decorators, { kind: "accessor", name: "useLightmapAsShadowmap", static: false, private: false, access: { has: obj => "useLightmapAsShadowmap" in obj, get: obj => obj.useLightmapAsShadowmap, set: (obj, value) => { obj.useLightmapAsShadowmap = value; } }, metadata: _metadata }, _useLightmapAsShadowmap_initializers, _useLightmapAsShadowmap_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
export { PBRBaseSimpleMaterial };
//# sourceMappingURL=pbrBaseSimpleMaterial.js.map