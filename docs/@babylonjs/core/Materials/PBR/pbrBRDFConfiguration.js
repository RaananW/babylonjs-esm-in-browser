import { __classPrivateFieldGet, __classPrivateFieldSet, __esDecorate, __runInitializers } from "../../tslib.es6.js";
/* eslint-disable @typescript-eslint/naming-convention */

import { serialize, expandToProperty } from "../../Misc/decorators.js";
import { MaterialDefines } from "../materialDefines.js";
import { MaterialPluginBase } from "../materialPluginBase.pure.js";
/**
 * @internal
 */
export class MaterialBRDFDefines extends MaterialDefines {
    constructor() {
        super(...arguments);
        this.BRDF_V_HEIGHT_CORRELATED = false;
        this.MS_BRDF_ENERGY_CONSERVATION = false;
        this.SPHERICAL_HARMONICS = false;
        this.SPECULAR_GLOSSINESS_ENERGY_CONSERVATION = false;
        this.MIX_IBL_RADIANCE_WITH_IRRADIANCE = true;
        this.LEGACY_SPECULAR_ENERGY_CONSERVATION = false;
        this.BASE_DIFFUSE_MODEL = 0;
        this.DIELECTRIC_SPECULAR_MODEL = 0;
        this.CONDUCTOR_SPECULAR_MODEL = 0;
    }
}
/**
 * Plugin that implements the BRDF component of the PBR material
 */
let PBRBRDFConfiguration = (() => {
    var _a, _PBRBRDFConfiguration_useEnergyConservation_accessor_storage, _PBRBRDFConfiguration_useSmithVisibilityHeightCorrelated_accessor_storage, _PBRBRDFConfiguration_useSphericalHarmonics_accessor_storage, _PBRBRDFConfiguration_useSpecularGlossinessInputEnergyConservation_accessor_storage, _PBRBRDFConfiguration_mixIblRadianceWithIrradiance_accessor_storage, _PBRBRDFConfiguration_useLegacySpecularEnergyConservation_accessor_storage, _PBRBRDFConfiguration_baseDiffuseModel_accessor_storage, _PBRBRDFConfiguration_dielectricSpecularModel_accessor_storage, _PBRBRDFConfiguration_conductorSpecularModel_accessor_storage;
    let _classSuper = MaterialPluginBase;
    let _useEnergyConservation_decorators;
    let _useEnergyConservation_initializers = [];
    let _useEnergyConservation_extraInitializers = [];
    let _useSmithVisibilityHeightCorrelated_decorators;
    let _useSmithVisibilityHeightCorrelated_initializers = [];
    let _useSmithVisibilityHeightCorrelated_extraInitializers = [];
    let _useSphericalHarmonics_decorators;
    let _useSphericalHarmonics_initializers = [];
    let _useSphericalHarmonics_extraInitializers = [];
    let _useSpecularGlossinessInputEnergyConservation_decorators;
    let _useSpecularGlossinessInputEnergyConservation_initializers = [];
    let _useSpecularGlossinessInputEnergyConservation_extraInitializers = [];
    let _mixIblRadianceWithIrradiance_decorators;
    let _mixIblRadianceWithIrradiance_initializers = [];
    let _mixIblRadianceWithIrradiance_extraInitializers = [];
    let _useLegacySpecularEnergyConservation_decorators;
    let _useLegacySpecularEnergyConservation_initializers = [];
    let _useLegacySpecularEnergyConservation_extraInitializers = [];
    let _baseDiffuseModel_decorators;
    let _baseDiffuseModel_initializers = [];
    let _baseDiffuseModel_extraInitializers = [];
    let _dielectricSpecularModel_decorators;
    let _dielectricSpecularModel_initializers = [];
    let _dielectricSpecularModel_extraInitializers = [];
    let _conductorSpecularModel_decorators;
    let _conductorSpecularModel_initializers = [];
    let _conductorSpecularModel_extraInitializers = [];
    return _a = class PBRBRDFConfiguration extends _classSuper {
            /**
             * Defines if the material uses energy conservation.
             */
            get useEnergyConservation() { return __classPrivateFieldGet(this, _PBRBRDFConfiguration_useEnergyConservation_accessor_storage, "f"); }
            set useEnergyConservation(value) { __classPrivateFieldSet(this, _PBRBRDFConfiguration_useEnergyConservation_accessor_storage, value, "f"); }
            /**
             * LEGACY Mode set to false
             * Defines if the material uses height smith correlated visibility term.
             * If you intent to not use our default BRDF, you need to load a separate BRDF Texture for the PBR
             * You can either load https://assets.babylonjs.com/environments/uncorrelatedBRDF.png
             * or https://assets.babylonjs.com/environments/uncorrelatedBRDF.dds to have more precision
             * Not relying on height correlated will also disable energy conservation.
             */
            get useSmithVisibilityHeightCorrelated() { return __classPrivateFieldGet(this, _PBRBRDFConfiguration_useSmithVisibilityHeightCorrelated_accessor_storage, "f"); }
            set useSmithVisibilityHeightCorrelated(value) { __classPrivateFieldSet(this, _PBRBRDFConfiguration_useSmithVisibilityHeightCorrelated_accessor_storage, value, "f"); }
            /**
             * LEGACY Mode set to false
             * Defines if the material uses spherical harmonics vs spherical polynomials for the
             * diffuse part of the IBL.
             * The harmonics despite a tiny bigger cost has been proven to provide closer results
             * to the ground truth.
             */
            get useSphericalHarmonics() { return __classPrivateFieldGet(this, _PBRBRDFConfiguration_useSphericalHarmonics_accessor_storage, "f"); }
            set useSphericalHarmonics(value) { __classPrivateFieldSet(this, _PBRBRDFConfiguration_useSphericalHarmonics_accessor_storage, value, "f"); }
            /**
             * Defines if the material uses energy conservation, when the specular workflow is active.
             * If activated, the albedo color is multiplied with (1. - maxChannel(specular color)).
             * If deactivated, a material is only physically plausible, when (albedo color + specular color) < 1.
             * In the deactivated case, the material author has to ensure energy conservation, for a physically plausible rendering.
             */
            get useSpecularGlossinessInputEnergyConservation() { return __classPrivateFieldGet(this, _PBRBRDFConfiguration_useSpecularGlossinessInputEnergyConservation_accessor_storage, "f"); }
            set useSpecularGlossinessInputEnergyConservation(value) { __classPrivateFieldSet(this, _PBRBRDFConfiguration_useSpecularGlossinessInputEnergyConservation_accessor_storage, value, "f"); }
            /**
             * Defines if IBL irradiance is used to augment rough radiance.
             * If activated, irradiance is blended into the radiance contribution when the material is rough.
             * This better approximates raytracing results for rough surfaces.
             */
            get mixIblRadianceWithIrradiance() { return __classPrivateFieldGet(this, _PBRBRDFConfiguration_mixIblRadianceWithIrradiance_accessor_storage, "f"); }
            set mixIblRadianceWithIrradiance(value) { __classPrivateFieldSet(this, _PBRBRDFConfiguration_mixIblRadianceWithIrradiance_accessor_storage, value, "f"); }
            /**
             * Defines if the legacy specular energy conservation is used.
             * If activated, the specular color is multiplied with (1. - maxChannel(albedo color)).
             */
            get useLegacySpecularEnergyConservation() { return __classPrivateFieldGet(this, _PBRBRDFConfiguration_useLegacySpecularEnergyConservation_accessor_storage, "f"); }
            set useLegacySpecularEnergyConservation(value) { __classPrivateFieldSet(this, _PBRBRDFConfiguration_useLegacySpecularEnergyConservation_accessor_storage, value, "f"); }
            /**
             * Defines the base diffuse roughness model of the material.
             */
            get baseDiffuseModel() { return __classPrivateFieldGet(this, _PBRBRDFConfiguration_baseDiffuseModel_accessor_storage, "f"); }
            set baseDiffuseModel(value) { __classPrivateFieldSet(this, _PBRBRDFConfiguration_baseDiffuseModel_accessor_storage, value, "f"); }
            /**
             * The material model to use for specular lighting of dielectric materials.
             */
            get dielectricSpecularModel() { return __classPrivateFieldGet(this, _PBRBRDFConfiguration_dielectricSpecularModel_accessor_storage, "f"); }
            set dielectricSpecularModel(value) { __classPrivateFieldSet(this, _PBRBRDFConfiguration_dielectricSpecularModel_accessor_storage, value, "f"); }
            /**
             * The material model to use for specular lighting.
             */
            get conductorSpecularModel() { return __classPrivateFieldGet(this, _PBRBRDFConfiguration_conductorSpecularModel_accessor_storage, "f"); }
            set conductorSpecularModel(value) { __classPrivateFieldSet(this, _PBRBRDFConfiguration_conductorSpecularModel_accessor_storage, value, "f"); }
            /** @internal */
            _markAllSubMeshesAsMiscDirty() {
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
                super(material, "PBRBRDF", 90, new MaterialBRDFDefines(), addToPluginList);
                this._useEnergyConservation = _a.DEFAULT_USE_ENERGY_CONSERVATION;
                _PBRBRDFConfiguration_useEnergyConservation_accessor_storage.set(this, __runInitializers(this, _useEnergyConservation_initializers, _a.DEFAULT_USE_ENERGY_CONSERVATION));
                this._useSmithVisibilityHeightCorrelated = (__runInitializers(this, _useEnergyConservation_extraInitializers), _a.DEFAULT_USE_SMITH_VISIBILITY_HEIGHT_CORRELATED);
                _PBRBRDFConfiguration_useSmithVisibilityHeightCorrelated_accessor_storage.set(this, __runInitializers(this, _useSmithVisibilityHeightCorrelated_initializers, _a.DEFAULT_USE_SMITH_VISIBILITY_HEIGHT_CORRELATED));
                this._useSphericalHarmonics = (__runInitializers(this, _useSmithVisibilityHeightCorrelated_extraInitializers), _a.DEFAULT_USE_SPHERICAL_HARMONICS);
                _PBRBRDFConfiguration_useSphericalHarmonics_accessor_storage.set(this, __runInitializers(this, _useSphericalHarmonics_initializers, _a.DEFAULT_USE_SPHERICAL_HARMONICS));
                this._useSpecularGlossinessInputEnergyConservation = (__runInitializers(this, _useSphericalHarmonics_extraInitializers), _a.DEFAULT_USE_SPECULAR_GLOSSINESS_INPUT_ENERGY_CONSERVATION);
                _PBRBRDFConfiguration_useSpecularGlossinessInputEnergyConservation_accessor_storage.set(this, __runInitializers(this, _useSpecularGlossinessInputEnergyConservation_initializers, _a.DEFAULT_USE_SPECULAR_GLOSSINESS_INPUT_ENERGY_CONSERVATION));
                this._mixIblRadianceWithIrradiance = (__runInitializers(this, _useSpecularGlossinessInputEnergyConservation_extraInitializers), _a.DEFAULT_MIX_IBL_RADIANCE_WITH_IRRADIANCE);
                _PBRBRDFConfiguration_mixIblRadianceWithIrradiance_accessor_storage.set(this, __runInitializers(this, _mixIblRadianceWithIrradiance_initializers, _a.DEFAULT_MIX_IBL_RADIANCE_WITH_IRRADIANCE));
                this._useLegacySpecularEnergyConservation = (__runInitializers(this, _mixIblRadianceWithIrradiance_extraInitializers), _a.DEFAULT_USE_LEGACY_SPECULAR_ENERGY_CONSERVATION);
                _PBRBRDFConfiguration_useLegacySpecularEnergyConservation_accessor_storage.set(this, __runInitializers(this, _useLegacySpecularEnergyConservation_initializers, _a.DEFAULT_USE_LEGACY_SPECULAR_ENERGY_CONSERVATION));
                this._baseDiffuseModel = (__runInitializers(this, _useLegacySpecularEnergyConservation_extraInitializers), _a.DEFAULT_DIFFUSE_MODEL);
                _PBRBRDFConfiguration_baseDiffuseModel_accessor_storage.set(this, __runInitializers(this, _baseDiffuseModel_initializers, _a.DEFAULT_DIFFUSE_MODEL));
                this._dielectricSpecularModel = (__runInitializers(this, _baseDiffuseModel_extraInitializers), _a.DEFAULT_DIELECTRIC_SPECULAR_MODEL);
                _PBRBRDFConfiguration_dielectricSpecularModel_accessor_storage.set(this, __runInitializers(this, _dielectricSpecularModel_initializers, _a.DEFAULT_DIELECTRIC_SPECULAR_MODEL));
                this._conductorSpecularModel = (__runInitializers(this, _dielectricSpecularModel_extraInitializers), _a.DEFAULT_CONDUCTOR_SPECULAR_MODEL);
                _PBRBRDFConfiguration_conductorSpecularModel_accessor_storage.set(this, __runInitializers(this, _conductorSpecularModel_initializers, _a.DEFAULT_CONDUCTOR_SPECULAR_MODEL));
                /** @internal */
                this._internalMarkAllSubMeshesAsMiscDirty = __runInitializers(this, _conductorSpecularModel_extraInitializers);
                this._internalMarkAllSubMeshesAsMiscDirty = material._dirtyCallbacks[16];
                this._enable(true);
            }
            /**
             * Updates the material defines for BRDF settings.
             * @param defines defines the material defines to update
             */
            prepareDefines(defines) {
                defines.BRDF_V_HEIGHT_CORRELATED = this._useSmithVisibilityHeightCorrelated;
                defines.MS_BRDF_ENERGY_CONSERVATION = this._useEnergyConservation && this._useSmithVisibilityHeightCorrelated;
                defines.SPHERICAL_HARMONICS = this._useSphericalHarmonics;
                defines.SPECULAR_GLOSSINESS_ENERGY_CONSERVATION = this._useSpecularGlossinessInputEnergyConservation;
                defines.MIX_IBL_RADIANCE_WITH_IRRADIANCE = this._mixIblRadianceWithIrradiance && !this._material._disableLighting;
                defines.LEGACY_SPECULAR_ENERGY_CONSERVATION = this._useLegacySpecularEnergyConservation;
                defines.BASE_DIFFUSE_MODEL = this._baseDiffuseModel;
                defines.DIELECTRIC_SPECULAR_MODEL = this._dielectricSpecularModel;
                defines.CONDUCTOR_SPECULAR_MODEL = this._conductorSpecularModel;
            }
            getClassName() {
                return "PBRBRDFConfiguration";
            }
        },
        _PBRBRDFConfiguration_useEnergyConservation_accessor_storage = new WeakMap(),
        _PBRBRDFConfiguration_useSmithVisibilityHeightCorrelated_accessor_storage = new WeakMap(),
        _PBRBRDFConfiguration_useSphericalHarmonics_accessor_storage = new WeakMap(),
        _PBRBRDFConfiguration_useSpecularGlossinessInputEnergyConservation_accessor_storage = new WeakMap(),
        _PBRBRDFConfiguration_mixIblRadianceWithIrradiance_accessor_storage = new WeakMap(),
        _PBRBRDFConfiguration_useLegacySpecularEnergyConservation_accessor_storage = new WeakMap(),
        _PBRBRDFConfiguration_baseDiffuseModel_accessor_storage = new WeakMap(),
        _PBRBRDFConfiguration_dielectricSpecularModel_accessor_storage = new WeakMap(),
        _PBRBRDFConfiguration_conductorSpecularModel_accessor_storage = new WeakMap(),
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _useEnergyConservation_decorators = [serialize(), expandToProperty("_markAllSubMeshesAsMiscDirty")];
            _useSmithVisibilityHeightCorrelated_decorators = [serialize(), expandToProperty("_markAllSubMeshesAsMiscDirty")];
            _useSphericalHarmonics_decorators = [serialize(), expandToProperty("_markAllSubMeshesAsMiscDirty")];
            _useSpecularGlossinessInputEnergyConservation_decorators = [serialize(), expandToProperty("_markAllSubMeshesAsMiscDirty")];
            _mixIblRadianceWithIrradiance_decorators = [serialize(), expandToProperty("_markAllSubMeshesAsMiscDirty")];
            _useLegacySpecularEnergyConservation_decorators = [serialize(), expandToProperty("_markAllSubMeshesAsMiscDirty")];
            _baseDiffuseModel_decorators = [serialize("baseDiffuseModel"), expandToProperty("_markAllSubMeshesAsMiscDirty")];
            _dielectricSpecularModel_decorators = [serialize("dielectricSpecularModel"), expandToProperty("_markAllSubMeshesAsMiscDirty")];
            _conductorSpecularModel_decorators = [serialize("conductorSpecularModel"), expandToProperty("_markAllSubMeshesAsMiscDirty")];
            __esDecorate(_a, null, _useEnergyConservation_decorators, { kind: "accessor", name: "useEnergyConservation", static: false, private: false, access: { has: obj => "useEnergyConservation" in obj, get: obj => obj.useEnergyConservation, set: (obj, value) => { obj.useEnergyConservation = value; } }, metadata: _metadata }, _useEnergyConservation_initializers, _useEnergyConservation_extraInitializers);
            __esDecorate(_a, null, _useSmithVisibilityHeightCorrelated_decorators, { kind: "accessor", name: "useSmithVisibilityHeightCorrelated", static: false, private: false, access: { has: obj => "useSmithVisibilityHeightCorrelated" in obj, get: obj => obj.useSmithVisibilityHeightCorrelated, set: (obj, value) => { obj.useSmithVisibilityHeightCorrelated = value; } }, metadata: _metadata }, _useSmithVisibilityHeightCorrelated_initializers, _useSmithVisibilityHeightCorrelated_extraInitializers);
            __esDecorate(_a, null, _useSphericalHarmonics_decorators, { kind: "accessor", name: "useSphericalHarmonics", static: false, private: false, access: { has: obj => "useSphericalHarmonics" in obj, get: obj => obj.useSphericalHarmonics, set: (obj, value) => { obj.useSphericalHarmonics = value; } }, metadata: _metadata }, _useSphericalHarmonics_initializers, _useSphericalHarmonics_extraInitializers);
            __esDecorate(_a, null, _useSpecularGlossinessInputEnergyConservation_decorators, { kind: "accessor", name: "useSpecularGlossinessInputEnergyConservation", static: false, private: false, access: { has: obj => "useSpecularGlossinessInputEnergyConservation" in obj, get: obj => obj.useSpecularGlossinessInputEnergyConservation, set: (obj, value) => { obj.useSpecularGlossinessInputEnergyConservation = value; } }, metadata: _metadata }, _useSpecularGlossinessInputEnergyConservation_initializers, _useSpecularGlossinessInputEnergyConservation_extraInitializers);
            __esDecorate(_a, null, _mixIblRadianceWithIrradiance_decorators, { kind: "accessor", name: "mixIblRadianceWithIrradiance", static: false, private: false, access: { has: obj => "mixIblRadianceWithIrradiance" in obj, get: obj => obj.mixIblRadianceWithIrradiance, set: (obj, value) => { obj.mixIblRadianceWithIrradiance = value; } }, metadata: _metadata }, _mixIblRadianceWithIrradiance_initializers, _mixIblRadianceWithIrradiance_extraInitializers);
            __esDecorate(_a, null, _useLegacySpecularEnergyConservation_decorators, { kind: "accessor", name: "useLegacySpecularEnergyConservation", static: false, private: false, access: { has: obj => "useLegacySpecularEnergyConservation" in obj, get: obj => obj.useLegacySpecularEnergyConservation, set: (obj, value) => { obj.useLegacySpecularEnergyConservation = value; } }, metadata: _metadata }, _useLegacySpecularEnergyConservation_initializers, _useLegacySpecularEnergyConservation_extraInitializers);
            __esDecorate(_a, null, _baseDiffuseModel_decorators, { kind: "accessor", name: "baseDiffuseModel", static: false, private: false, access: { has: obj => "baseDiffuseModel" in obj, get: obj => obj.baseDiffuseModel, set: (obj, value) => { obj.baseDiffuseModel = value; } }, metadata: _metadata }, _baseDiffuseModel_initializers, _baseDiffuseModel_extraInitializers);
            __esDecorate(_a, null, _dielectricSpecularModel_decorators, { kind: "accessor", name: "dielectricSpecularModel", static: false, private: false, access: { has: obj => "dielectricSpecularModel" in obj, get: obj => obj.dielectricSpecularModel, set: (obj, value) => { obj.dielectricSpecularModel = value; } }, metadata: _metadata }, _dielectricSpecularModel_initializers, _dielectricSpecularModel_extraInitializers);
            __esDecorate(_a, null, _conductorSpecularModel_decorators, { kind: "accessor", name: "conductorSpecularModel", static: false, private: false, access: { has: obj => "conductorSpecularModel" in obj, get: obj => obj.conductorSpecularModel, set: (obj, value) => { obj.conductorSpecularModel = value; } }, metadata: _metadata }, _conductorSpecularModel_initializers, _conductorSpecularModel_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        /**
         * Default value used for the energy conservation.
         * This should only be changed to adapt to the type of texture in scene.environmentBRDFTexture.
         */
        _a.DEFAULT_USE_ENERGY_CONSERVATION = true,
        /**
         * Default value used for the Smith Visibility Height Correlated mode.
         * This should only be changed to adapt to the type of texture in scene.environmentBRDFTexture.
         */
        _a.DEFAULT_USE_SMITH_VISIBILITY_HEIGHT_CORRELATED = true,
        /**
         * Default value used for the IBL diffuse part.
         * This can help switching back to the polynomials mode globally which is a tiny bit
         * less GPU intensive at the drawback of a lower quality.
         */
        _a.DEFAULT_USE_SPHERICAL_HARMONICS = true,
        /**
         * Default value used for activating energy conservation for the specular workflow.
         * If activated, the albedo color is multiplied with (1. - maxChannel(specular color)).
         * If deactivated, a material is only physically plausible, when (albedo color + specular color) < 1.
         */
        _a.DEFAULT_USE_SPECULAR_GLOSSINESS_INPUT_ENERGY_CONSERVATION = true,
        /**
         * Default value for whether IBL irradiance is used to augment rough radiance.
         * If activated, irradiance is blended into the radiance contribution when the material is rough.
         * This better approximates raytracing results for rough surfaces.
         */
        _a.DEFAULT_MIX_IBL_RADIANCE_WITH_IRRADIANCE = true,
        /**
         * Default value for whether the legacy specular energy conservation is used.
         */
        _a.DEFAULT_USE_LEGACY_SPECULAR_ENERGY_CONSERVATION = true,
        /**
         * Defines the default diffuse model used by the material.
         */
        _a.DEFAULT_DIFFUSE_MODEL = 0,
        /**
         * Defines the default dielectric specular model used by the material.
         */
        _a.DEFAULT_DIELECTRIC_SPECULAR_MODEL = 0,
        /**
         * Defines the default conductor specular model used by the material.
         */
        _a.DEFAULT_CONDUCTOR_SPECULAR_MODEL = 0,
        _a;
})();
export { PBRBRDFConfiguration };
//# sourceMappingURL=pbrBRDFConfiguration.js.map