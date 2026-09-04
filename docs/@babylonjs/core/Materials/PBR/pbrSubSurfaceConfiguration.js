import { __classPrivateFieldGet, __classPrivateFieldSet, __esDecorate, __runInitializers } from "../../tslib.es6.js";
import { serialize, serializeAsTexture, expandToProperty, serializeAsColor3 } from "../../Misc/decorators.js";
import { Color3 } from "../../Maths/math.color.pure.js";
import { MaterialFlags } from "../materialFlags.js";
import { TmpVectors } from "../../Maths/math.vector.pure.js";
import { MaterialPluginBase } from "../materialPluginBase.pure.js";

import { MaterialDefines } from "../materialDefines.js";
import { BindTextureMatrix, PrepareDefinesForMergedUV } from "../materialHelper.functions.js";
/**
 * @internal
 */
export class MaterialSubSurfaceDefines extends MaterialDefines {
    constructor() {
        super(...arguments);
        this.SUBSURFACE = false;
        this.SS_REFRACTION = false;
        this.SS_REFRACTION_USE_INTENSITY_FROM_THICKNESS = false;
        this.SS_TRANSLUCENCY = false;
        this.SS_TRANSLUCENCY_USE_INTENSITY_FROM_THICKNESS = false;
        this.SS_SCATTERING = false;
        this.SS_DISPERSION = false;
        this.SS_THICKNESSANDMASK_TEXTURE = false;
        this.SS_THICKNESSANDMASK_TEXTUREDIRECTUV = 0;
        this.SS_HAS_THICKNESS = false;
        this.SS_REFRACTIONINTENSITY_TEXTURE = false;
        this.SS_REFRACTIONINTENSITY_TEXTUREDIRECTUV = 0;
        this.SS_TRANSLUCENCYINTENSITY_TEXTURE = false;
        this.SS_TRANSLUCENCYINTENSITY_TEXTUREDIRECTUV = 0;
        this.SS_TRANSLUCENCYCOLOR_TEXTURE = false;
        this.SS_TRANSLUCENCYCOLOR_TEXTUREDIRECTUV = 0;
        this.SS_TRANSLUCENCYCOLOR_TEXTURE_GAMMA = false;
        this.SS_REFRACTIONMAP_3D = false;
        this.SS_REFRACTIONMAP_OPPOSITEZ = false;
        this.SS_LODINREFRACTIONALPHA = false;
        this.SS_GAMMAREFRACTION = false;
        this.SS_RGBDREFRACTION = false;
        this.SS_LINEARSPECULARREFRACTION = false;
        this.SS_LINKREFRACTIONTOTRANSPARENCY = false;
        this.SS_ALBEDOFORREFRACTIONTINT = false;
        this.SS_ALBEDOFORTRANSLUCENCYTINT = false;
        this.SS_USE_LOCAL_REFRACTIONMAP_CUBIC = false;
        this.SS_USE_THICKNESS_AS_DEPTH = false;
        this.SS_USE_GLTF_TEXTURES = false;
        this.SS_APPLY_ALBEDO_AFTER_SUBSURFACE = false;
        this.SS_TRANSLUCENCY_LEGACY = false;
    }
}
/**
 * Plugin that implements the sub surface component of the PBR material
 */
let PBRSubSurfaceConfiguration = (() => {
    var _a, _PBRSubSurfaceConfiguration_isRefractionEnabled_accessor_storage, _PBRSubSurfaceConfiguration_isTranslucencyEnabled_accessor_storage, _PBRSubSurfaceConfiguration_isDispersionEnabled_accessor_storage, _PBRSubSurfaceConfiguration_isScatteringEnabled_accessor_storage, _PBRSubSurfaceConfiguration_useAlbedoToTintRefraction_accessor_storage, _PBRSubSurfaceConfiguration_useAlbedoToTintTranslucency_accessor_storage, _PBRSubSurfaceConfiguration_thicknessTexture_accessor_storage, _PBRSubSurfaceConfiguration_refractionTexture_accessor_storage, _PBRSubSurfaceConfiguration_indexOfRefraction_accessor_storage, _PBRSubSurfaceConfiguration_invertRefractionY_accessor_storage, _PBRSubSurfaceConfiguration_linkRefractionWithTransparency_accessor_storage, _PBRSubSurfaceConfiguration_useMaskFromThicknessTexture_accessor_storage, _PBRSubSurfaceConfiguration_refractionIntensityTexture_accessor_storage, _PBRSubSurfaceConfiguration_translucencyIntensityTexture_accessor_storage, _PBRSubSurfaceConfiguration_translucencyColorTexture_accessor_storage, _PBRSubSurfaceConfiguration_useGltfStyleTextures_accessor_storage;
    let _classSuper = MaterialPluginBase;
    let _isRefractionEnabled_decorators;
    let _isRefractionEnabled_initializers = [];
    let _isRefractionEnabled_extraInitializers = [];
    let _isTranslucencyEnabled_decorators;
    let _isTranslucencyEnabled_initializers = [];
    let _isTranslucencyEnabled_extraInitializers = [];
    let _isDispersionEnabled_decorators;
    let _isDispersionEnabled_initializers = [];
    let _isDispersionEnabled_extraInitializers = [];
    let _isScatteringEnabled_decorators;
    let _isScatteringEnabled_initializers = [];
    let _isScatteringEnabled_extraInitializers = [];
    let __scatteringDiffusionProfileIndex_decorators;
    let __scatteringDiffusionProfileIndex_initializers = [];
    let __scatteringDiffusionProfileIndex_extraInitializers = [];
    let _refractionIntensity_decorators;
    let _refractionIntensity_initializers = [];
    let _refractionIntensity_extraInitializers = [];
    let _translucencyIntensity_decorators;
    let _translucencyIntensity_initializers = [];
    let _translucencyIntensity_extraInitializers = [];
    let _useAlbedoToTintRefraction_decorators;
    let _useAlbedoToTintRefraction_initializers = [];
    let _useAlbedoToTintRefraction_extraInitializers = [];
    let _useAlbedoToTintTranslucency_decorators;
    let _useAlbedoToTintTranslucency_initializers = [];
    let _useAlbedoToTintTranslucency_extraInitializers = [];
    let _thicknessTexture_decorators;
    let _thicknessTexture_initializers = [];
    let _thicknessTexture_extraInitializers = [];
    let _refractionTexture_decorators;
    let _refractionTexture_initializers = [];
    let _refractionTexture_extraInitializers = [];
    let _indexOfRefraction_decorators;
    let _indexOfRefraction_initializers = [];
    let _indexOfRefraction_extraInitializers = [];
    let __volumeIndexOfRefraction_decorators;
    let __volumeIndexOfRefraction_initializers = [];
    let __volumeIndexOfRefraction_extraInitializers = [];
    let _invertRefractionY_decorators;
    let _invertRefractionY_initializers = [];
    let _invertRefractionY_extraInitializers = [];
    let _linkRefractionWithTransparency_decorators;
    let _linkRefractionWithTransparency_initializers = [];
    let _linkRefractionWithTransparency_extraInitializers = [];
    let _minimumThickness_decorators;
    let _minimumThickness_initializers = [];
    let _minimumThickness_extraInitializers = [];
    let _maximumThickness_decorators;
    let _maximumThickness_initializers = [];
    let _maximumThickness_extraInitializers = [];
    let _useThicknessAsDepth_decorators;
    let _useThicknessAsDepth_initializers = [];
    let _useThicknessAsDepth_extraInitializers = [];
    let _tintColor_decorators;
    let _tintColor_initializers = [];
    let _tintColor_extraInitializers = [];
    let _tintColorAtDistance_decorators;
    let _tintColorAtDistance_initializers = [];
    let _tintColorAtDistance_extraInitializers = [];
    let _dispersion_decorators;
    let _dispersion_initializers = [];
    let _dispersion_extraInitializers = [];
    let _diffusionDistance_decorators;
    let _diffusionDistance_initializers = [];
    let _diffusionDistance_extraInitializers = [];
    let _useMaskFromThicknessTexture_decorators;
    let _useMaskFromThicknessTexture_initializers = [];
    let _useMaskFromThicknessTexture_extraInitializers = [];
    let _refractionIntensityTexture_decorators;
    let _refractionIntensityTexture_initializers = [];
    let _refractionIntensityTexture_extraInitializers = [];
    let _translucencyIntensityTexture_decorators;
    let _translucencyIntensityTexture_initializers = [];
    let _translucencyIntensityTexture_extraInitializers = [];
    let _translucencyColor_decorators;
    let _translucencyColor_initializers = [];
    let _translucencyColor_extraInitializers = [];
    let _translucencyColorTexture_decorators;
    let _translucencyColorTexture_initializers = [];
    let _translucencyColorTexture_extraInitializers = [];
    let _useGltfStyleTextures_decorators;
    let _useGltfStyleTextures_initializers = [];
    let _useGltfStyleTextures_extraInitializers = [];
    let _applyAlbedoAfterSubSurface_decorators;
    let _applyAlbedoAfterSubSurface_initializers = [];
    let _applyAlbedoAfterSubSurface_extraInitializers = [];
    let _legacyTranslucency_decorators;
    let _legacyTranslucency_initializers = [];
    let _legacyTranslucency_extraInitializers = [];
    return _a = class PBRSubSurfaceConfiguration extends _classSuper {
            /**
             * Defines if the refraction is enabled in the material.
             */
            get isRefractionEnabled() { return __classPrivateFieldGet(this, _PBRSubSurfaceConfiguration_isRefractionEnabled_accessor_storage, "f"); }
            set isRefractionEnabled(value) { __classPrivateFieldSet(this, _PBRSubSurfaceConfiguration_isRefractionEnabled_accessor_storage, value, "f"); }
            /**
             * Defines if the translucency is enabled in the material.
             */
            get isTranslucencyEnabled() { return __classPrivateFieldGet(this, _PBRSubSurfaceConfiguration_isTranslucencyEnabled_accessor_storage, "f"); }
            set isTranslucencyEnabled(value) { __classPrivateFieldSet(this, _PBRSubSurfaceConfiguration_isTranslucencyEnabled_accessor_storage, value, "f"); }
            /**
             * Defines if dispersion is enabled in the material.
             */
            get isDispersionEnabled() { return __classPrivateFieldGet(this, _PBRSubSurfaceConfiguration_isDispersionEnabled_accessor_storage, "f"); }
            set isDispersionEnabled(value) { __classPrivateFieldSet(this, _PBRSubSurfaceConfiguration_isDispersionEnabled_accessor_storage, value, "f"); }
            /**
             * Defines if the sub surface scattering is enabled in the material.
             */
            get isScatteringEnabled() { return __classPrivateFieldGet(this, _PBRSubSurfaceConfiguration_isScatteringEnabled_accessor_storage, "f"); }
            set isScatteringEnabled(value) { __classPrivateFieldSet(this, _PBRSubSurfaceConfiguration_isScatteringEnabled_accessor_storage, value, "f"); }
            /**
             * Diffusion profile for subsurface scattering.
             * Useful for better scattering in the skins or foliages.
             */
            get scatteringDiffusionProfile() {
                if (!this._scene.subSurfaceConfiguration) {
                    return null;
                }
                return this._scene.subSurfaceConfiguration.ssDiffusionProfileColors[this._scatteringDiffusionProfileIndex];
            }
            set scatteringDiffusionProfile(c) {
                if (!this._scene.enableSubSurfaceForPrePass()) {
                    // Not supported
                    return;
                }
                // addDiffusionProfile automatically checks for doubles
                if (c) {
                    this._scatteringDiffusionProfileIndex = this._scene.subSurfaceConfiguration.addDiffusionProfile(c);
                }
            }
            /**
             * When enabled, transparent surfaces will be tinted with the albedo colour (independent of thickness)
             */
            get useAlbedoToTintRefraction() { return __classPrivateFieldGet(this, _PBRSubSurfaceConfiguration_useAlbedoToTintRefraction_accessor_storage, "f"); }
            set useAlbedoToTintRefraction(value) { __classPrivateFieldSet(this, _PBRSubSurfaceConfiguration_useAlbedoToTintRefraction_accessor_storage, value, "f"); }
            /**
             * When enabled, translucent surfaces will be tinted with the albedo colour (independent of thickness)
             */
            get useAlbedoToTintTranslucency() { return __classPrivateFieldGet(this, _PBRSubSurfaceConfiguration_useAlbedoToTintTranslucency_accessor_storage, "f"); }
            set useAlbedoToTintTranslucency(value) { __classPrivateFieldSet(this, _PBRSubSurfaceConfiguration_useAlbedoToTintTranslucency_accessor_storage, value, "f"); }
            /**
             * Stores the average thickness of a mesh in a texture (The texture is holding the values linearly).
             * The red (or green if useGltfStyleTextures=true) channel of the texture should contain the thickness remapped between 0 and 1.
             * 0 would mean minimumThickness
             * 1 would mean maximumThickness
             * The other channels might be use as a mask to vary the different effects intensity.
             */
            get thicknessTexture() { return __classPrivateFieldGet(this, _PBRSubSurfaceConfiguration_thicknessTexture_accessor_storage, "f"); }
            set thicknessTexture(value) { __classPrivateFieldSet(this, _PBRSubSurfaceConfiguration_thicknessTexture_accessor_storage, value, "f"); }
            /**
             * Defines the texture to use for refraction.
             */
            get refractionTexture() { return __classPrivateFieldGet(this, _PBRSubSurfaceConfiguration_refractionTexture_accessor_storage, "f"); }
            set refractionTexture(value) { __classPrivateFieldSet(this, _PBRSubSurfaceConfiguration_refractionTexture_accessor_storage, value, "f"); }
            /**
             * Index of refraction of the material base layer.
             * https://en.wikipedia.org/wiki/List_of_refractive_indices
             *
             * This does not only impact refraction but also the Base F0 of Dielectric Materials.
             *
             * From dielectric fresnel rules: F0 = square((iorT - iorI) / (iorT + iorI))
             */
            get indexOfRefraction() { return __classPrivateFieldGet(this, _PBRSubSurfaceConfiguration_indexOfRefraction_accessor_storage, "f"); }
            set indexOfRefraction(value) { __classPrivateFieldSet(this, _PBRSubSurfaceConfiguration_indexOfRefraction_accessor_storage, value, "f"); }
            /**
             * Index of refraction of the material's volume.
             * https://en.wikipedia.org/wiki/List_of_refractive_indices
             *
             * This ONLY impacts refraction. If not provided or given a non-valid value,
             * the volume will use the same IOR as the surface.
             */
            get volumeIndexOfRefraction() {
                if (this._volumeIndexOfRefraction >= 1.0) {
                    return this._volumeIndexOfRefraction;
                }
                return this._indexOfRefraction;
            }
            set volumeIndexOfRefraction(value) {
                const volumeIndexOfRefraction = value >= 1.0 ? value : -1.0;
                if (this._volumeIndexOfRefraction === volumeIndexOfRefraction) {
                    return;
                }
                this._volumeIndexOfRefraction = volumeIndexOfRefraction;
                this._markAllSubMeshesAsTexturesDirty();
            }
            /**
             * Controls if refraction needs to be inverted on Y. This could be useful for procedural texture.
             */
            get invertRefractionY() { return __classPrivateFieldGet(this, _PBRSubSurfaceConfiguration_invertRefractionY_accessor_storage, "f"); }
            set invertRefractionY(value) { __classPrivateFieldSet(this, _PBRSubSurfaceConfiguration_invertRefractionY_accessor_storage, value, "f"); }
            /**
             * This parameters will make the material used its opacity to control how much it is refracting against not.
             * Materials half opaque for instance using refraction could benefit from this control.
             */
            get linkRefractionWithTransparency() { return __classPrivateFieldGet(this, _PBRSubSurfaceConfiguration_linkRefractionWithTransparency_accessor_storage, "f"); }
            set linkRefractionWithTransparency(value) { __classPrivateFieldSet(this, _PBRSubSurfaceConfiguration_linkRefractionWithTransparency_accessor_storage, value, "f"); }
            /**
             * Stores the intensity of the different subsurface effects in the thickness texture.
             * Note that if refractionIntensityTexture and/or translucencyIntensityTexture is provided it takes precedence over thicknessTexture + useMaskFromThicknessTexture
             * * the green (red if useGltfStyleTextures = true) channel is the refraction intensity.
             * * the blue (alpha if useGltfStyleTextures = true) channel is the translucency intensity.
             */
            get useMaskFromThicknessTexture() { return __classPrivateFieldGet(this, _PBRSubSurfaceConfiguration_useMaskFromThicknessTexture_accessor_storage, "f"); }
            set useMaskFromThicknessTexture(value) { __classPrivateFieldSet(this, _PBRSubSurfaceConfiguration_useMaskFromThicknessTexture_accessor_storage, value, "f"); }
            /**
             * Stores the intensity of the refraction. If provided, it takes precedence over thicknessTexture + useMaskFromThicknessTexture
             * * the green (red if useGltfStyleTextures = true) channel is the refraction intensity.
             */
            get refractionIntensityTexture() { return __classPrivateFieldGet(this, _PBRSubSurfaceConfiguration_refractionIntensityTexture_accessor_storage, "f"); }
            set refractionIntensityTexture(value) { __classPrivateFieldSet(this, _PBRSubSurfaceConfiguration_refractionIntensityTexture_accessor_storage, value, "f"); }
            /**
             * Stores the intensity of the translucency. If provided, it takes precedence over thicknessTexture + useMaskFromThicknessTexture
             * * the blue (alpha if useGltfStyleTextures = true) channel is the translucency intensity.
             */
            get translucencyIntensityTexture() { return __classPrivateFieldGet(this, _PBRSubSurfaceConfiguration_translucencyIntensityTexture_accessor_storage, "f"); }
            set translucencyIntensityTexture(value) { __classPrivateFieldSet(this, _PBRSubSurfaceConfiguration_translucencyIntensityTexture_accessor_storage, value, "f"); }
            /**
             * Defines the translucency tint color of the material as a texture.
             * This is multiplied against the translucency color to add variety and realism to the material.
             * If translucencyColor is not set, the tint color will be used instead.
             */
            get translucencyColorTexture() { return __classPrivateFieldGet(this, _PBRSubSurfaceConfiguration_translucencyColorTexture_accessor_storage, "f"); }
            set translucencyColorTexture(value) { __classPrivateFieldSet(this, _PBRSubSurfaceConfiguration_translucencyColorTexture_accessor_storage, value, "f"); }
            /**
             * Use channels layout used by glTF:
             * * thicknessTexture: the green (instead of red) channel is the thickness
             * * thicknessTexture/refractionIntensityTexture: the red (instead of green) channel is the refraction intensity
             * * thicknessTexture/translucencyIntensityTexture: the alpha (instead of blue) channel is the translucency intensity
             */
            get useGltfStyleTextures() { return __classPrivateFieldGet(this, _PBRSubSurfaceConfiguration_useGltfStyleTextures_accessor_storage, "f"); }
            set useGltfStyleTextures(value) { __classPrivateFieldSet(this, _PBRSubSurfaceConfiguration_useGltfStyleTextures_accessor_storage, value, "f"); }
            /**
             * Keeping for backward compatibility... Should not be used anymore. It has been replaced by
             * the property with the correct spelling.
             * @see legacyTranslucency
             */
            get legacyTransluceny() {
                return this.legacyTranslucency;
            }
            set legacyTransluceny(value) {
                this.legacyTranslucency = value;
            }
            /** @internal */
            _markAllSubMeshesAsTexturesDirty() {
                this._enable(this._isRefractionEnabled || this._isTranslucencyEnabled || this._isScatteringEnabled);
                this._internalMarkAllSubMeshesAsTexturesDirty();
            }
            /** @internal */
            _markScenePrePassDirty() {
                this._enable(this._isRefractionEnabled || this._isTranslucencyEnabled || this._isScatteringEnabled);
                this._internalMarkAllSubMeshesAsTexturesDirty();
                this._internalMarkScenePrePassDirty();
            }
            /**
             * Gets a boolean indicating that the plugin is compatible with a given shader language.
             * @returns true if the plugin is compatible with the shader language
             */
            isCompatible() {
                return true;
            }
            constructor(material, addToPluginList = true) {
                super(material, "PBRSubSurface", 130, new MaterialSubSurfaceDefines(), addToPluginList);
                this._isRefractionEnabled = false;
                _PBRSubSurfaceConfiguration_isRefractionEnabled_accessor_storage.set(this, __runInitializers(this, _isRefractionEnabled_initializers, false));
                this._isTranslucencyEnabled = (__runInitializers(this, _isRefractionEnabled_extraInitializers), false);
                _PBRSubSurfaceConfiguration_isTranslucencyEnabled_accessor_storage.set(this, __runInitializers(this, _isTranslucencyEnabled_initializers, false));
                this._isDispersionEnabled = (__runInitializers(this, _isTranslucencyEnabled_extraInitializers), false);
                _PBRSubSurfaceConfiguration_isDispersionEnabled_accessor_storage.set(this, __runInitializers(this, _isDispersionEnabled_initializers, false));
                this._isScatteringEnabled = (__runInitializers(this, _isDispersionEnabled_extraInitializers), false);
                _PBRSubSurfaceConfiguration_isScatteringEnabled_accessor_storage.set(this, __runInitializers(this, _isScatteringEnabled_initializers, false));
                this._scatteringDiffusionProfileIndex = (__runInitializers(this, _isScatteringEnabled_extraInitializers), __runInitializers(this, __scatteringDiffusionProfileIndex_initializers, 0));
                /**
                 * Defines the refraction intensity of the material.
                 * The refraction when enabled replaces the Diffuse part of the material.
                 * The intensity helps transitioning between diffuse and refraction.
                 */
                this.refractionIntensity = (__runInitializers(this, __scatteringDiffusionProfileIndex_extraInitializers), __runInitializers(this, _refractionIntensity_initializers, 1));
                /**
                 * Defines the translucency intensity of the material.
                 * When translucency has been enabled, this defines how much of the "translucency"
                 * is added to the diffuse part of the material.
                 */
                this.translucencyIntensity = (__runInitializers(this, _refractionIntensity_extraInitializers), __runInitializers(this, _translucencyIntensity_initializers, 1));
                this._useAlbedoToTintRefraction = (__runInitializers(this, _translucencyIntensity_extraInitializers), false);
                _PBRSubSurfaceConfiguration_useAlbedoToTintRefraction_accessor_storage.set(this, __runInitializers(this, _useAlbedoToTintRefraction_initializers, false));
                this._useAlbedoToTintTranslucency = (__runInitializers(this, _useAlbedoToTintRefraction_extraInitializers), false);
                _PBRSubSurfaceConfiguration_useAlbedoToTintTranslucency_accessor_storage.set(this, __runInitializers(this, _useAlbedoToTintTranslucency_initializers, false));
                this._thicknessTexture = (__runInitializers(this, _useAlbedoToTintTranslucency_extraInitializers), null);
                _PBRSubSurfaceConfiguration_thicknessTexture_accessor_storage.set(this, __runInitializers(this, _thicknessTexture_initializers, null));
                this._refractionTexture = (__runInitializers(this, _thicknessTexture_extraInitializers), null);
                _PBRSubSurfaceConfiguration_refractionTexture_accessor_storage.set(this, __runInitializers(this, _refractionTexture_initializers, null));
                /** @internal */
                this._indexOfRefraction = (__runInitializers(this, _refractionTexture_extraInitializers), 1.5);
                _PBRSubSurfaceConfiguration_indexOfRefraction_accessor_storage.set(this, __runInitializers(this, _indexOfRefraction_initializers, 1.5));
                this._volumeIndexOfRefraction = (__runInitializers(this, _indexOfRefraction_extraInitializers), __runInitializers(this, __volumeIndexOfRefraction_initializers, -1.0));
                this._invertRefractionY = (__runInitializers(this, __volumeIndexOfRefraction_extraInitializers), false);
                _PBRSubSurfaceConfiguration_invertRefractionY_accessor_storage.set(this, __runInitializers(this, _invertRefractionY_initializers, false));
                /** @internal */
                this._linkRefractionWithTransparency = (__runInitializers(this, _invertRefractionY_extraInitializers), false);
                _PBRSubSurfaceConfiguration_linkRefractionWithTransparency_accessor_storage.set(this, __runInitializers(this, _linkRefractionWithTransparency_initializers, false));
                /**
                 * Defines the minimum thickness stored in the thickness map.
                 * If no thickness map is defined, this value will be used to simulate thickness.
                 */
                this.minimumThickness = (__runInitializers(this, _linkRefractionWithTransparency_extraInitializers), __runInitializers(this, _minimumThickness_initializers, 0));
                /**
                 * Defines the maximum thickness stored in the thickness map.
                 */
                this.maximumThickness = (__runInitializers(this, _minimumThickness_extraInitializers), __runInitializers(this, _maximumThickness_initializers, 1));
                /**
                 * Defines that the thickness should be used as a measure of the depth volume.
                 */
                this.useThicknessAsDepth = (__runInitializers(this, _maximumThickness_extraInitializers), __runInitializers(this, _useThicknessAsDepth_initializers, false));
                /**
                 * Defines the volume tint of the material.
                 * This is used for both translucency and scattering.
                 */
                this.tintColor = (__runInitializers(this, _useThicknessAsDepth_extraInitializers), __runInitializers(this, _tintColor_initializers, Color3.White()));
                /**
                 * Defines the distance at which the tint color should be found in the media.
                 * This is used for refraction only.
                 */
                this.tintColorAtDistance = (__runInitializers(this, _tintColor_extraInitializers), __runInitializers(this, _tintColorAtDistance_initializers, 1));
                /**
                 * Defines the Abbe number for the volume.
                 */
                this.dispersion = (__runInitializers(this, _tintColorAtDistance_extraInitializers), __runInitializers(this, _dispersion_initializers, 0));
                /**
                 * Defines how far each channel transmit through the media.
                 * It is defined as a color to simplify it selection.
                 */
                this.diffusionDistance = (__runInitializers(this, _dispersion_extraInitializers), __runInitializers(this, _diffusionDistance_initializers, Color3.White()));
                this._useMaskFromThicknessTexture = (__runInitializers(this, _diffusionDistance_extraInitializers), false);
                _PBRSubSurfaceConfiguration_useMaskFromThicknessTexture_accessor_storage.set(this, __runInitializers(this, _useMaskFromThicknessTexture_initializers, false));
                this._refractionIntensityTexture = (__runInitializers(this, _useMaskFromThicknessTexture_extraInitializers), null);
                _PBRSubSurfaceConfiguration_refractionIntensityTexture_accessor_storage.set(this, __runInitializers(this, _refractionIntensityTexture_initializers, null));
                this._translucencyIntensityTexture = (__runInitializers(this, _refractionIntensityTexture_extraInitializers), null);
                _PBRSubSurfaceConfiguration_translucencyIntensityTexture_accessor_storage.set(this, __runInitializers(this, _translucencyIntensityTexture_initializers, null));
                /**
                 * Defines the translucency tint of the material.
                 * If not set, the tint color will be used instead.
                 */
                this.translucencyColor = (__runInitializers(this, _translucencyIntensityTexture_extraInitializers), __runInitializers(this, _translucencyColor_initializers, null));
                this._translucencyColorTexture = (__runInitializers(this, _translucencyColor_extraInitializers), null);
                _PBRSubSurfaceConfiguration_translucencyColorTexture_accessor_storage.set(this, __runInitializers(this, _translucencyColorTexture_initializers, null));
                this._useGltfStyleTextures = (__runInitializers(this, _translucencyColorTexture_extraInitializers), true);
                _PBRSubSurfaceConfiguration_useGltfStyleTextures_accessor_storage.set(this, __runInitializers(this, _useGltfStyleTextures_initializers, true));
                /**
                 * This property only exists for backward compatibility reasons.
                 * Set it to true if your rendering in 8.0+ is different from that in 7 when you use sub-surface properties (transmission, refraction, etc.). Default is false.
                 * Note however that the PBR calculation is wrong when this property is set to true, so only use it if you want to mimic the 7.0 behavior.
                 */
                this.applyAlbedoAfterSubSurface = (__runInitializers(this, _useGltfStyleTextures_extraInitializers), __runInitializers(this, _applyAlbedoAfterSubSurface_initializers, _a.DEFAULT_APPLY_ALBEDO_AFTERSUBSURFACE));
                /**
                 * This property only exists for backward compatibility reasons.
                 * Set it to true if your rendering in 8.0+ is different from that in 7 when you use sub-surface translucency. Default is false.
                 */
                this.legacyTranslucency = (__runInitializers(this, _applyAlbedoAfterSubSurface_extraInitializers), __runInitializers(this, _legacyTranslucency_initializers, _a.DEFAULT_LEGACY_TRANSLUCENCY));
                this._scene = __runInitializers(this, _legacyTranslucency_extraInitializers);
                this._scene = material.getScene();
                this.registerForExtraEvents = true;
                this._internalMarkAllSubMeshesAsTexturesDirty = material._dirtyCallbacks[1];
                this._internalMarkScenePrePassDirty = material._dirtyCallbacks[32];
            }
            /**
             * Checks whether the subsurface textures are ready for the sub mesh.
             * @param defines defines the material defines to inspect
             * @param scene defines the scene to use for readiness checks
             * @returns true if subsurface is ready
             */
            isReadyForSubMesh(defines, scene) {
                if (!this._isRefractionEnabled && !this._isTranslucencyEnabled && !this._isScatteringEnabled) {
                    return true;
                }
                if (defines._areTexturesDirty) {
                    if (scene.texturesEnabled) {
                        if (this._thicknessTexture && MaterialFlags.ThicknessTextureEnabled) {
                            if (!this._thicknessTexture.isReadyOrNotBlocking()) {
                                return false;
                            }
                        }
                        if (this._refractionIntensityTexture && MaterialFlags.RefractionIntensityTextureEnabled) {
                            if (!this._refractionIntensityTexture.isReadyOrNotBlocking()) {
                                return false;
                            }
                        }
                        if (this._translucencyColorTexture && MaterialFlags.TranslucencyColorTextureEnabled) {
                            if (!this._translucencyColorTexture.isReadyOrNotBlocking()) {
                                return false;
                            }
                        }
                        if (this._translucencyIntensityTexture && MaterialFlags.TranslucencyIntensityTextureEnabled) {
                            if (!this._translucencyIntensityTexture.isReadyOrNotBlocking()) {
                                return false;
                            }
                        }
                        const refractionTexture = this._getRefractionTexture(scene);
                        if (refractionTexture && MaterialFlags.RefractionTextureEnabled) {
                            if (!refractionTexture.isReadyOrNotBlocking()) {
                                return false;
                            }
                        }
                    }
                }
                return true;
            }
            /**
             * Updates shader defines for subsurface rendering before attributes are processed.
             * @param defines defines the material defines to update
             * @param scene defines the scene to use for texture checks
             */
            prepareDefinesBeforeAttributes(defines, scene) {
                if (!this._isRefractionEnabled && !this._isTranslucencyEnabled && !this._isScatteringEnabled) {
                    defines.SUBSURFACE = false;
                    defines.SS_DISPERSION = false;
                    defines.SS_TRANSLUCENCY = false;
                    defines.SS_SCATTERING = false;
                    defines.SS_REFRACTION = false;
                    defines.SS_REFRACTION_USE_INTENSITY_FROM_THICKNESS = false;
                    defines.SS_TRANSLUCENCY_USE_INTENSITY_FROM_THICKNESS = false;
                    defines.SS_THICKNESSANDMASK_TEXTURE = false;
                    defines.SS_THICKNESSANDMASK_TEXTUREDIRECTUV = 0;
                    defines.SS_HAS_THICKNESS = false;
                    defines.SS_REFRACTIONINTENSITY_TEXTURE = false;
                    defines.SS_REFRACTIONINTENSITY_TEXTUREDIRECTUV = 0;
                    defines.SS_TRANSLUCENCYINTENSITY_TEXTURE = false;
                    defines.SS_TRANSLUCENCYINTENSITY_TEXTUREDIRECTUV = 0;
                    defines.SS_REFRACTIONMAP_3D = false;
                    defines.SS_REFRACTIONMAP_OPPOSITEZ = false;
                    defines.SS_LODINREFRACTIONALPHA = false;
                    defines.SS_GAMMAREFRACTION = false;
                    defines.SS_RGBDREFRACTION = false;
                    defines.SS_LINEARSPECULARREFRACTION = false;
                    defines.SS_LINKREFRACTIONTOTRANSPARENCY = false;
                    defines.SS_ALBEDOFORREFRACTIONTINT = false;
                    defines.SS_ALBEDOFORTRANSLUCENCYTINT = false;
                    defines.SS_USE_LOCAL_REFRACTIONMAP_CUBIC = false;
                    defines.SS_USE_THICKNESS_AS_DEPTH = false;
                    defines.SS_USE_GLTF_TEXTURES = false;
                    defines.SS_TRANSLUCENCYCOLOR_TEXTURE = false;
                    defines.SS_TRANSLUCENCYCOLOR_TEXTUREDIRECTUV = 0;
                    defines.SS_TRANSLUCENCYCOLOR_TEXTURE_GAMMA = false;
                    defines.SS_APPLY_ALBEDO_AFTER_SUBSURFACE = false;
                    return;
                }
                if (defines._areTexturesDirty) {
                    defines.SUBSURFACE = true;
                    defines.SS_DISPERSION = this._isDispersionEnabled;
                    defines.SS_TRANSLUCENCY = this._isTranslucencyEnabled;
                    defines.SS_TRANSLUCENCY_USE_INTENSITY_FROM_THICKNESS = false;
                    defines.SS_TRANSLUCENCY_LEGACY = this.legacyTranslucency;
                    defines.SS_SCATTERING = this._isScatteringEnabled;
                    defines.SS_THICKNESSANDMASK_TEXTURE = false;
                    defines.SS_REFRACTIONINTENSITY_TEXTURE = false;
                    defines.SS_TRANSLUCENCYINTENSITY_TEXTURE = false;
                    defines.SS_HAS_THICKNESS = false;
                    defines.SS_USE_GLTF_TEXTURES = false;
                    defines.SS_REFRACTION = false;
                    defines.SS_REFRACTION_USE_INTENSITY_FROM_THICKNESS = false;
                    defines.SS_REFRACTIONMAP_3D = false;
                    defines.SS_GAMMAREFRACTION = false;
                    defines.SS_RGBDREFRACTION = false;
                    defines.SS_LINEARSPECULARREFRACTION = false;
                    defines.SS_REFRACTIONMAP_OPPOSITEZ = false;
                    defines.SS_LODINREFRACTIONALPHA = false;
                    defines.SS_LINKREFRACTIONTOTRANSPARENCY = false;
                    defines.SS_ALBEDOFORREFRACTIONTINT = false;
                    defines.SS_ALBEDOFORTRANSLUCENCYTINT = false;
                    defines.SS_USE_LOCAL_REFRACTIONMAP_CUBIC = false;
                    defines.SS_USE_THICKNESS_AS_DEPTH = false;
                    defines.SS_TRANSLUCENCYCOLOR_TEXTURE = false;
                    defines.SS_APPLY_ALBEDO_AFTER_SUBSURFACE = this.applyAlbedoAfterSubSurface;
                    if (defines._areTexturesDirty) {
                        if (scene.texturesEnabled) {
                            if (this._thicknessTexture && MaterialFlags.ThicknessTextureEnabled) {
                                PrepareDefinesForMergedUV(this._thicknessTexture, defines, "SS_THICKNESSANDMASK_TEXTURE");
                            }
                            if (this._refractionIntensityTexture && MaterialFlags.RefractionIntensityTextureEnabled) {
                                PrepareDefinesForMergedUV(this._refractionIntensityTexture, defines, "SS_REFRACTIONINTENSITY_TEXTURE");
                            }
                            if (this._translucencyIntensityTexture && MaterialFlags.TranslucencyIntensityTextureEnabled) {
                                PrepareDefinesForMergedUV(this._translucencyIntensityTexture, defines, "SS_TRANSLUCENCYINTENSITY_TEXTURE");
                            }
                            if (this._translucencyColorTexture && MaterialFlags.TranslucencyColorTextureEnabled) {
                                PrepareDefinesForMergedUV(this._translucencyColorTexture, defines, "SS_TRANSLUCENCYCOLOR_TEXTURE");
                                defines.SS_TRANSLUCENCYCOLOR_TEXTURE_GAMMA = this._translucencyColorTexture.gammaSpace;
                            }
                        }
                    }
                    defines.SS_HAS_THICKNESS = this.maximumThickness - this.minimumThickness !== 0.0;
                    defines.SS_USE_GLTF_TEXTURES = this._useGltfStyleTextures;
                    defines.SS_REFRACTION_USE_INTENSITY_FROM_THICKNESS = this._useMaskFromThicknessTexture && !this._refractionIntensityTexture;
                    defines.SS_TRANSLUCENCY_USE_INTENSITY_FROM_THICKNESS = this._useMaskFromThicknessTexture && !this._translucencyIntensityTexture;
                    if (this._isRefractionEnabled) {
                        if (scene.texturesEnabled) {
                            const refractionTexture = this._getRefractionTexture(scene);
                            if (refractionTexture && MaterialFlags.RefractionTextureEnabled) {
                                defines.SS_REFRACTION = true;
                                defines.SS_REFRACTIONMAP_3D = refractionTexture.isCube;
                                defines.SS_GAMMAREFRACTION = refractionTexture.gammaSpace;
                                defines.SS_RGBDREFRACTION = refractionTexture.isRGBD;
                                defines.SS_LINEARSPECULARREFRACTION = refractionTexture.linearSpecularLOD;
                                defines.SS_REFRACTIONMAP_OPPOSITEZ = this._scene.useRightHandedSystem && refractionTexture.isCube ? !refractionTexture.invertZ : refractionTexture.invertZ;
                                defines.SS_LODINREFRACTIONALPHA = refractionTexture.lodLevelInAlpha;
                                defines.SS_LINKREFRACTIONTOTRANSPARENCY = this._linkRefractionWithTransparency;
                                defines.SS_ALBEDOFORREFRACTIONTINT = this._useAlbedoToTintRefraction;
                                defines.SS_USE_LOCAL_REFRACTIONMAP_CUBIC = refractionTexture.isCube && refractionTexture.boundingBoxSize;
                                defines.SS_USE_THICKNESS_AS_DEPTH = this.useThicknessAsDepth;
                            }
                        }
                    }
                    if (this._isTranslucencyEnabled) {
                        defines.SS_ALBEDOFORTRANSLUCENCYTINT = this._useAlbedoToTintTranslucency;
                    }
                }
            }
            /**
             * Binds the material data (this function is called even if mustRebind() returns false)
             * @param uniformBuffer defines the Uniform buffer to fill in.
             * @param scene defines the scene the material belongs to.
             * @param engine defines the engine the material belongs to.
             * @param subMesh the submesh to bind data for
             */
            hardBindForSubMesh(uniformBuffer, scene, engine, subMesh) {
                if (!this._isRefractionEnabled && !this._isTranslucencyEnabled && !this._isScatteringEnabled) {
                    return;
                }
                // If min/max thickness is 0, avoid decompising to determine the scaled thickness (it's always zero).
                if (this.maximumThickness === 0.0 && this.minimumThickness === 0.0) {
                    uniformBuffer.updateFloat2("vThicknessParam", 0, 0);
                }
                else {
                    subMesh.getRenderingMesh().getWorldMatrix().decompose(TmpVectors.Vector3[0]);
                    const thicknessScale = Math.max(Math.abs(TmpVectors.Vector3[0].x), Math.abs(TmpVectors.Vector3[0].y), Math.abs(TmpVectors.Vector3[0].z));
                    uniformBuffer.updateFloat2("vThicknessParam", this.minimumThickness * thicknessScale, (this.maximumThickness - this.minimumThickness) * thicknessScale);
                }
            }
            /**
             * Binds subsurface data for a sub mesh.
             * @param uniformBuffer defines the uniform buffer to update
             * @param scene defines the scene to use for texture binding
             * @param engine defines the engine used for binding
             * @param subMesh defines the sub mesh being rendered
             */
            bindForSubMesh(uniformBuffer, scene, engine, subMesh) {
                if (!this._isRefractionEnabled && !this._isTranslucencyEnabled && !this._isScatteringEnabled) {
                    return;
                }
                const defines = subMesh.materialDefines;
                const isFrozen = this._material.isFrozen;
                const realTimeFiltering = this._material.realTimeFiltering;
                const lodBasedMicrosurface = defines.LODBASEDMICROSFURACE;
                const refractionTexture = this._getRefractionTexture(scene);
                if (!uniformBuffer.useUbo || !isFrozen || !uniformBuffer.isSync) {
                    if (this._thicknessTexture && MaterialFlags.ThicknessTextureEnabled) {
                        uniformBuffer.updateFloat2("vThicknessInfos", this._thicknessTexture.coordinatesIndex, this._thicknessTexture.level);
                        BindTextureMatrix(this._thicknessTexture, uniformBuffer, "thickness");
                    }
                    if (this._refractionIntensityTexture && MaterialFlags.RefractionIntensityTextureEnabled && defines.SS_REFRACTIONINTENSITY_TEXTURE) {
                        uniformBuffer.updateFloat2("vRefractionIntensityInfos", this._refractionIntensityTexture.coordinatesIndex, this._refractionIntensityTexture.level);
                        BindTextureMatrix(this._refractionIntensityTexture, uniformBuffer, "refractionIntensity");
                    }
                    if (this._translucencyColorTexture && MaterialFlags.TranslucencyColorTextureEnabled && defines.SS_TRANSLUCENCYCOLOR_TEXTURE) {
                        uniformBuffer.updateFloat2("vTranslucencyColorInfos", this._translucencyColorTexture.coordinatesIndex, this._translucencyColorTexture.level);
                        BindTextureMatrix(this._translucencyColorTexture, uniformBuffer, "translucencyColor");
                    }
                    if (this._translucencyIntensityTexture && MaterialFlags.TranslucencyIntensityTextureEnabled && defines.SS_TRANSLUCENCYINTENSITY_TEXTURE) {
                        uniformBuffer.updateFloat2("vTranslucencyIntensityInfos", this._translucencyIntensityTexture.coordinatesIndex, this._translucencyIntensityTexture.level);
                        BindTextureMatrix(this._translucencyIntensityTexture, uniformBuffer, "translucencyIntensity");
                    }
                    if (refractionTexture && MaterialFlags.RefractionTextureEnabled) {
                        uniformBuffer.updateMatrix("refractionMatrix", refractionTexture.getRefractionTextureMatrix());
                        let depth = 1.0;
                        if (!refractionTexture.isCube) {
                            if (refractionTexture.depth) {
                                depth = refractionTexture.depth;
                            }
                        }
                        const width = refractionTexture.getSize().width;
                        const refractionIor = this.volumeIndexOfRefraction;
                        uniformBuffer.updateFloat4("vRefractionInfos", refractionTexture.level, 1 / refractionIor, depth, this._invertRefractionY ? -1 : 1);
                        uniformBuffer.updateFloat4("vRefractionMicrosurfaceInfos", width, refractionTexture.lodGenerationScale, refractionTexture.lodGenerationOffset, 1.0 / this.indexOfRefraction);
                        if (realTimeFiltering) {
                            uniformBuffer.updateFloat2("vRefractionFilteringInfo", width, Math.log2(width));
                        }
                        if (refractionTexture.boundingBoxSize) {
                            const cubeTexture = refractionTexture;
                            uniformBuffer.updateVector3("vRefractionPosition", cubeTexture.boundingBoxPosition);
                            uniformBuffer.updateVector3("vRefractionSize", cubeTexture.boundingBoxSize);
                        }
                    }
                    if (this._isScatteringEnabled) {
                        uniformBuffer.updateFloat("scatteringDiffusionProfile", this._scatteringDiffusionProfileIndex);
                    }
                    uniformBuffer.updateColor3("vDiffusionDistance", this.diffusionDistance);
                    uniformBuffer.updateFloat4("vTintColor", this.tintColor.r, this.tintColor.g, this.tintColor.b, Math.max(0.00001, this.tintColorAtDistance));
                    uniformBuffer.updateColor4("vTranslucencyColor", this.translucencyColor ?? this.tintColor, 0);
                    uniformBuffer.updateFloat3("vSubSurfaceIntensity", this.refractionIntensity, this.translucencyIntensity, 0);
                    uniformBuffer.updateFloat("dispersion", this.dispersion);
                }
                // Textures
                if (scene.texturesEnabled) {
                    if (this._thicknessTexture && MaterialFlags.ThicknessTextureEnabled) {
                        uniformBuffer.setTexture("thicknessSampler", this._thicknessTexture);
                    }
                    if (this._refractionIntensityTexture && MaterialFlags.RefractionIntensityTextureEnabled && defines.SS_REFRACTIONINTENSITY_TEXTURE) {
                        uniformBuffer.setTexture("refractionIntensitySampler", this._refractionIntensityTexture);
                    }
                    if (this._translucencyIntensityTexture && MaterialFlags.TranslucencyIntensityTextureEnabled && defines.SS_TRANSLUCENCYINTENSITY_TEXTURE) {
                        uniformBuffer.setTexture("translucencyIntensitySampler", this._translucencyIntensityTexture);
                    }
                    if (this._translucencyColorTexture && MaterialFlags.TranslucencyColorTextureEnabled && defines.SS_TRANSLUCENCYCOLOR_TEXTURE) {
                        uniformBuffer.setTexture("translucencyColorSampler", this._translucencyColorTexture);
                    }
                    if (refractionTexture && MaterialFlags.RefractionTextureEnabled) {
                        if (lodBasedMicrosurface) {
                            uniformBuffer.setTexture("refractionSampler", refractionTexture);
                        }
                        else {
                            uniformBuffer.setTexture("refractionSampler", refractionTexture._lodTextureMid || refractionTexture);
                            uniformBuffer.setTexture("refractionSamplerLow", refractionTexture._lodTextureLow || refractionTexture);
                            uniformBuffer.setTexture("refractionSamplerHigh", refractionTexture._lodTextureHigh || refractionTexture);
                        }
                    }
                }
            }
            /**
             * Returns the texture used for refraction or null if none is used.
             * @param scene defines the scene the material belongs to.
             * @returns - Refraction texture if present.  If no refraction texture and refraction
             * is linked with transparency, returns environment texture.  Otherwise, returns null.
             */
            _getRefractionTexture(scene) {
                if (this._refractionTexture) {
                    return this._refractionTexture;
                }
                if (this._isRefractionEnabled) {
                    return scene.environmentTexture;
                }
                return null;
            }
            /**
             * Returns true if alpha blending should be disabled.
             */
            get disableAlphaBlending() {
                return this._isRefractionEnabled && this._linkRefractionWithTransparency;
            }
            /**
             * Fills the list of render target textures.
             * @param renderTargets the list of render targets to update
             */
            fillRenderTargetTextures(renderTargets) {
                if (MaterialFlags.RefractionTextureEnabled && this._refractionTexture && this._refractionTexture.isRenderTarget) {
                    renderTargets.push(this._refractionTexture);
                }
            }
            /**
             * Checks whether subsurface rendering uses a texture.
             * @param texture defines the texture to check
             * @returns true if the texture is used by subsurface rendering
             */
            hasTexture(texture) {
                if (this._thicknessTexture === texture) {
                    return true;
                }
                if (this._refractionTexture === texture) {
                    return true;
                }
                if (this._refractionIntensityTexture === texture) {
                    return true;
                }
                if (this._translucencyIntensityTexture === texture) {
                    return true;
                }
                if (this._translucencyColorTexture === texture) {
                    return true;
                }
                return false;
            }
            hasRenderTargetTextures() {
                if (MaterialFlags.RefractionTextureEnabled && this._refractionTexture && this._refractionTexture.isRenderTarget) {
                    return true;
                }
                return false;
            }
            /**
             * Adds the active subsurface textures.
             * @param activeTextures defines the list of active textures to update
             */
            getActiveTextures(activeTextures) {
                if (this._thicknessTexture) {
                    activeTextures.push(this._thicknessTexture);
                }
                if (this._refractionTexture) {
                    activeTextures.push(this._refractionTexture);
                }
                if (this._refractionIntensityTexture) {
                    activeTextures.push(this._refractionIntensityTexture);
                }
                if (this._translucencyColorTexture) {
                    activeTextures.push(this._translucencyColorTexture);
                }
                if (this._translucencyIntensityTexture) {
                    activeTextures.push(this._translucencyIntensityTexture);
                }
            }
            /**
             * Adds the animatable subsurface textures.
             * @param animatables defines the list of animatables to update
             */
            getAnimatables(animatables) {
                if (this._thicknessTexture && this._thicknessTexture.animations && this._thicknessTexture.animations.length > 0) {
                    animatables.push(this._thicknessTexture);
                }
                if (this._refractionTexture && this._refractionTexture.animations && this._refractionTexture.animations.length > 0) {
                    animatables.push(this._refractionTexture);
                }
                if (this._refractionIntensityTexture && this._refractionIntensityTexture.animations && this._refractionIntensityTexture.animations.length > 0) {
                    animatables.push(this._refractionIntensityTexture);
                }
                if (this._translucencyColorTexture && this._translucencyColorTexture.animations && this._translucencyColorTexture.animations.length > 0) {
                    animatables.push(this._translucencyColorTexture);
                }
                if (this._translucencyIntensityTexture && this._translucencyIntensityTexture.animations && this._translucencyIntensityTexture.animations.length > 0) {
                    animatables.push(this._translucencyIntensityTexture);
                }
            }
            /**
             * Disposes the subsurface textures.
             * @param forceDisposeTextures defines whether to dispose the textures
             */
            dispose(forceDisposeTextures) {
                if (forceDisposeTextures) {
                    if (this._thicknessTexture) {
                        this._thicknessTexture.dispose();
                    }
                    if (this._refractionTexture) {
                        this._refractionTexture.dispose();
                    }
                    if (this._refractionIntensityTexture) {
                        this._refractionIntensityTexture.dispose();
                    }
                    if (this._translucencyColorTexture) {
                        this._translucencyColorTexture.dispose();
                    }
                    if (this._translucencyIntensityTexture) {
                        this._translucencyIntensityTexture.dispose();
                    }
                }
            }
            getClassName() {
                return "PBRSubSurfaceConfiguration";
            }
            addFallbacks(defines, fallbacks, currentRank) {
                if (defines.SS_SCATTERING) {
                    fallbacks.addFallback(currentRank++, "SS_SCATTERING");
                }
                if (defines.SS_TRANSLUCENCY) {
                    fallbacks.addFallback(currentRank++, "SS_TRANSLUCENCY");
                }
                return currentRank;
            }
            /**
             * Adds the subsurface sampler names.
             * @param samplers defines the list of sampler names to update
             */
            getSamplers(samplers) {
                samplers.push("thicknessSampler", "refractionIntensitySampler", "translucencyIntensitySampler", "refractionSampler", "refractionSamplerLow", "refractionSamplerHigh", "translucencyColorSampler");
            }
            getUniforms() {
                return {
                    ubo: [
                        { name: "vRefractionMicrosurfaceInfos", size: 4, type: "vec4" },
                        { name: "vRefractionFilteringInfo", size: 2, type: "vec2" },
                        { name: "vTranslucencyIntensityInfos", size: 2, type: "vec2" },
                        { name: "vRefractionInfos", size: 4, type: "vec4" },
                        { name: "refractionMatrix", size: 16, type: "mat4" },
                        { name: "vThicknessInfos", size: 2, type: "vec2" },
                        { name: "vRefractionIntensityInfos", size: 2, type: "vec2" },
                        { name: "thicknessMatrix", size: 16, type: "mat4" },
                        { name: "refractionIntensityMatrix", size: 16, type: "mat4" },
                        { name: "translucencyIntensityMatrix", size: 16, type: "mat4" },
                        { name: "vThicknessParam", size: 2, type: "vec2" },
                        { name: "vDiffusionDistance", size: 3, type: "vec3" },
                        { name: "vTintColor", size: 4, type: "vec4" },
                        { name: "vSubSurfaceIntensity", size: 3, type: "vec3" },
                        { name: "vRefractionPosition", size: 3, type: "vec3" },
                        { name: "vRefractionSize", size: 3, type: "vec3" },
                        { name: "scatteringDiffusionProfile", size: 1, type: "float" },
                        { name: "dispersion", size: 1, type: "float" },
                        { name: "vTranslucencyColor", size: 4, type: "vec4" },
                        { name: "vTranslucencyColorInfos", size: 2, type: "vec2" },
                        { name: "translucencyColorMatrix", size: 16, type: "mat4" },
                    ],
                };
            }
        },
        _PBRSubSurfaceConfiguration_isRefractionEnabled_accessor_storage = new WeakMap(),
        _PBRSubSurfaceConfiguration_isTranslucencyEnabled_accessor_storage = new WeakMap(),
        _PBRSubSurfaceConfiguration_isDispersionEnabled_accessor_storage = new WeakMap(),
        _PBRSubSurfaceConfiguration_isScatteringEnabled_accessor_storage = new WeakMap(),
        _PBRSubSurfaceConfiguration_useAlbedoToTintRefraction_accessor_storage = new WeakMap(),
        _PBRSubSurfaceConfiguration_useAlbedoToTintTranslucency_accessor_storage = new WeakMap(),
        _PBRSubSurfaceConfiguration_thicknessTexture_accessor_storage = new WeakMap(),
        _PBRSubSurfaceConfiguration_refractionTexture_accessor_storage = new WeakMap(),
        _PBRSubSurfaceConfiguration_indexOfRefraction_accessor_storage = new WeakMap(),
        _PBRSubSurfaceConfiguration_invertRefractionY_accessor_storage = new WeakMap(),
        _PBRSubSurfaceConfiguration_linkRefractionWithTransparency_accessor_storage = new WeakMap(),
        _PBRSubSurfaceConfiguration_useMaskFromThicknessTexture_accessor_storage = new WeakMap(),
        _PBRSubSurfaceConfiguration_refractionIntensityTexture_accessor_storage = new WeakMap(),
        _PBRSubSurfaceConfiguration_translucencyIntensityTexture_accessor_storage = new WeakMap(),
        _PBRSubSurfaceConfiguration_translucencyColorTexture_accessor_storage = new WeakMap(),
        _PBRSubSurfaceConfiguration_useGltfStyleTextures_accessor_storage = new WeakMap(),
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _isRefractionEnabled_decorators = [serialize(), expandToProperty("_markAllSubMeshesAsTexturesDirty")];
            _isTranslucencyEnabled_decorators = [serialize(), expandToProperty("_markAllSubMeshesAsTexturesDirty")];
            _isDispersionEnabled_decorators = [serialize(), expandToProperty("_markAllSubMeshesAsTexturesDirty")];
            _isScatteringEnabled_decorators = [serialize(), expandToProperty("_markScenePrePassDirty")];
            __scatteringDiffusionProfileIndex_decorators = [serialize()];
            _refractionIntensity_decorators = [serialize()];
            _translucencyIntensity_decorators = [serialize()];
            _useAlbedoToTintRefraction_decorators = [serialize(), expandToProperty("_markAllSubMeshesAsTexturesDirty")];
            _useAlbedoToTintTranslucency_decorators = [serialize(), expandToProperty("_markAllSubMeshesAsTexturesDirty")];
            _thicknessTexture_decorators = [serializeAsTexture(), expandToProperty("_markAllSubMeshesAsTexturesDirty")];
            _refractionTexture_decorators = [serializeAsTexture(), expandToProperty("_markAllSubMeshesAsTexturesDirty")];
            _indexOfRefraction_decorators = [serialize(), expandToProperty("_markAllSubMeshesAsTexturesDirty")];
            __volumeIndexOfRefraction_decorators = [serialize()];
            _invertRefractionY_decorators = [serialize(), expandToProperty("_markAllSubMeshesAsTexturesDirty")];
            _linkRefractionWithTransparency_decorators = [serialize(), expandToProperty("_markAllSubMeshesAsTexturesDirty")];
            _minimumThickness_decorators = [serialize()];
            _maximumThickness_decorators = [serialize()];
            _useThicknessAsDepth_decorators = [serialize()];
            _tintColor_decorators = [serializeAsColor3()];
            _tintColorAtDistance_decorators = [serialize()];
            _dispersion_decorators = [serialize()];
            _diffusionDistance_decorators = [serializeAsColor3()];
            _useMaskFromThicknessTexture_decorators = [serialize(), expandToProperty("_markAllSubMeshesAsTexturesDirty")];
            _refractionIntensityTexture_decorators = [serializeAsTexture(), expandToProperty("_markAllSubMeshesAsTexturesDirty")];
            _translucencyIntensityTexture_decorators = [serializeAsTexture(), expandToProperty("_markAllSubMeshesAsTexturesDirty")];
            _translucencyColor_decorators = [serializeAsColor3()];
            _translucencyColorTexture_decorators = [serializeAsTexture(), expandToProperty("_markAllSubMeshesAsTexturesDirty")];
            _useGltfStyleTextures_decorators = [serialize(), expandToProperty("_markAllSubMeshesAsTexturesDirty")];
            _applyAlbedoAfterSubSurface_decorators = [serialize()];
            _legacyTranslucency_decorators = [serialize()];
            __esDecorate(_a, null, _isRefractionEnabled_decorators, { kind: "accessor", name: "isRefractionEnabled", static: false, private: false, access: { has: obj => "isRefractionEnabled" in obj, get: obj => obj.isRefractionEnabled, set: (obj, value) => { obj.isRefractionEnabled = value; } }, metadata: _metadata }, _isRefractionEnabled_initializers, _isRefractionEnabled_extraInitializers);
            __esDecorate(_a, null, _isTranslucencyEnabled_decorators, { kind: "accessor", name: "isTranslucencyEnabled", static: false, private: false, access: { has: obj => "isTranslucencyEnabled" in obj, get: obj => obj.isTranslucencyEnabled, set: (obj, value) => { obj.isTranslucencyEnabled = value; } }, metadata: _metadata }, _isTranslucencyEnabled_initializers, _isTranslucencyEnabled_extraInitializers);
            __esDecorate(_a, null, _isDispersionEnabled_decorators, { kind: "accessor", name: "isDispersionEnabled", static: false, private: false, access: { has: obj => "isDispersionEnabled" in obj, get: obj => obj.isDispersionEnabled, set: (obj, value) => { obj.isDispersionEnabled = value; } }, metadata: _metadata }, _isDispersionEnabled_initializers, _isDispersionEnabled_extraInitializers);
            __esDecorate(_a, null, _isScatteringEnabled_decorators, { kind: "accessor", name: "isScatteringEnabled", static: false, private: false, access: { has: obj => "isScatteringEnabled" in obj, get: obj => obj.isScatteringEnabled, set: (obj, value) => { obj.isScatteringEnabled = value; } }, metadata: _metadata }, _isScatteringEnabled_initializers, _isScatteringEnabled_extraInitializers);
            __esDecorate(_a, null, _useAlbedoToTintRefraction_decorators, { kind: "accessor", name: "useAlbedoToTintRefraction", static: false, private: false, access: { has: obj => "useAlbedoToTintRefraction" in obj, get: obj => obj.useAlbedoToTintRefraction, set: (obj, value) => { obj.useAlbedoToTintRefraction = value; } }, metadata: _metadata }, _useAlbedoToTintRefraction_initializers, _useAlbedoToTintRefraction_extraInitializers);
            __esDecorate(_a, null, _useAlbedoToTintTranslucency_decorators, { kind: "accessor", name: "useAlbedoToTintTranslucency", static: false, private: false, access: { has: obj => "useAlbedoToTintTranslucency" in obj, get: obj => obj.useAlbedoToTintTranslucency, set: (obj, value) => { obj.useAlbedoToTintTranslucency = value; } }, metadata: _metadata }, _useAlbedoToTintTranslucency_initializers, _useAlbedoToTintTranslucency_extraInitializers);
            __esDecorate(_a, null, _thicknessTexture_decorators, { kind: "accessor", name: "thicknessTexture", static: false, private: false, access: { has: obj => "thicknessTexture" in obj, get: obj => obj.thicknessTexture, set: (obj, value) => { obj.thicknessTexture = value; } }, metadata: _metadata }, _thicknessTexture_initializers, _thicknessTexture_extraInitializers);
            __esDecorate(_a, null, _refractionTexture_decorators, { kind: "accessor", name: "refractionTexture", static: false, private: false, access: { has: obj => "refractionTexture" in obj, get: obj => obj.refractionTexture, set: (obj, value) => { obj.refractionTexture = value; } }, metadata: _metadata }, _refractionTexture_initializers, _refractionTexture_extraInitializers);
            __esDecorate(_a, null, _indexOfRefraction_decorators, { kind: "accessor", name: "indexOfRefraction", static: false, private: false, access: { has: obj => "indexOfRefraction" in obj, get: obj => obj.indexOfRefraction, set: (obj, value) => { obj.indexOfRefraction = value; } }, metadata: _metadata }, _indexOfRefraction_initializers, _indexOfRefraction_extraInitializers);
            __esDecorate(_a, null, _invertRefractionY_decorators, { kind: "accessor", name: "invertRefractionY", static: false, private: false, access: { has: obj => "invertRefractionY" in obj, get: obj => obj.invertRefractionY, set: (obj, value) => { obj.invertRefractionY = value; } }, metadata: _metadata }, _invertRefractionY_initializers, _invertRefractionY_extraInitializers);
            __esDecorate(_a, null, _linkRefractionWithTransparency_decorators, { kind: "accessor", name: "linkRefractionWithTransparency", static: false, private: false, access: { has: obj => "linkRefractionWithTransparency" in obj, get: obj => obj.linkRefractionWithTransparency, set: (obj, value) => { obj.linkRefractionWithTransparency = value; } }, metadata: _metadata }, _linkRefractionWithTransparency_initializers, _linkRefractionWithTransparency_extraInitializers);
            __esDecorate(_a, null, _useMaskFromThicknessTexture_decorators, { kind: "accessor", name: "useMaskFromThicknessTexture", static: false, private: false, access: { has: obj => "useMaskFromThicknessTexture" in obj, get: obj => obj.useMaskFromThicknessTexture, set: (obj, value) => { obj.useMaskFromThicknessTexture = value; } }, metadata: _metadata }, _useMaskFromThicknessTexture_initializers, _useMaskFromThicknessTexture_extraInitializers);
            __esDecorate(_a, null, _refractionIntensityTexture_decorators, { kind: "accessor", name: "refractionIntensityTexture", static: false, private: false, access: { has: obj => "refractionIntensityTexture" in obj, get: obj => obj.refractionIntensityTexture, set: (obj, value) => { obj.refractionIntensityTexture = value; } }, metadata: _metadata }, _refractionIntensityTexture_initializers, _refractionIntensityTexture_extraInitializers);
            __esDecorate(_a, null, _translucencyIntensityTexture_decorators, { kind: "accessor", name: "translucencyIntensityTexture", static: false, private: false, access: { has: obj => "translucencyIntensityTexture" in obj, get: obj => obj.translucencyIntensityTexture, set: (obj, value) => { obj.translucencyIntensityTexture = value; } }, metadata: _metadata }, _translucencyIntensityTexture_initializers, _translucencyIntensityTexture_extraInitializers);
            __esDecorate(_a, null, _translucencyColorTexture_decorators, { kind: "accessor", name: "translucencyColorTexture", static: false, private: false, access: { has: obj => "translucencyColorTexture" in obj, get: obj => obj.translucencyColorTexture, set: (obj, value) => { obj.translucencyColorTexture = value; } }, metadata: _metadata }, _translucencyColorTexture_initializers, _translucencyColorTexture_extraInitializers);
            __esDecorate(_a, null, _useGltfStyleTextures_decorators, { kind: "accessor", name: "useGltfStyleTextures", static: false, private: false, access: { has: obj => "useGltfStyleTextures" in obj, get: obj => obj.useGltfStyleTextures, set: (obj, value) => { obj.useGltfStyleTextures = value; } }, metadata: _metadata }, _useGltfStyleTextures_initializers, _useGltfStyleTextures_extraInitializers);
            __esDecorate(null, null, __scatteringDiffusionProfileIndex_decorators, { kind: "field", name: "_scatteringDiffusionProfileIndex", static: false, private: false, access: { has: obj => "_scatteringDiffusionProfileIndex" in obj, get: obj => obj._scatteringDiffusionProfileIndex, set: (obj, value) => { obj._scatteringDiffusionProfileIndex = value; } }, metadata: _metadata }, __scatteringDiffusionProfileIndex_initializers, __scatteringDiffusionProfileIndex_extraInitializers);
            __esDecorate(null, null, _refractionIntensity_decorators, { kind: "field", name: "refractionIntensity", static: false, private: false, access: { has: obj => "refractionIntensity" in obj, get: obj => obj.refractionIntensity, set: (obj, value) => { obj.refractionIntensity = value; } }, metadata: _metadata }, _refractionIntensity_initializers, _refractionIntensity_extraInitializers);
            __esDecorate(null, null, _translucencyIntensity_decorators, { kind: "field", name: "translucencyIntensity", static: false, private: false, access: { has: obj => "translucencyIntensity" in obj, get: obj => obj.translucencyIntensity, set: (obj, value) => { obj.translucencyIntensity = value; } }, metadata: _metadata }, _translucencyIntensity_initializers, _translucencyIntensity_extraInitializers);
            __esDecorate(null, null, __volumeIndexOfRefraction_decorators, { kind: "field", name: "_volumeIndexOfRefraction", static: false, private: false, access: { has: obj => "_volumeIndexOfRefraction" in obj, get: obj => obj._volumeIndexOfRefraction, set: (obj, value) => { obj._volumeIndexOfRefraction = value; } }, metadata: _metadata }, __volumeIndexOfRefraction_initializers, __volumeIndexOfRefraction_extraInitializers);
            __esDecorate(null, null, _minimumThickness_decorators, { kind: "field", name: "minimumThickness", static: false, private: false, access: { has: obj => "minimumThickness" in obj, get: obj => obj.minimumThickness, set: (obj, value) => { obj.minimumThickness = value; } }, metadata: _metadata }, _minimumThickness_initializers, _minimumThickness_extraInitializers);
            __esDecorate(null, null, _maximumThickness_decorators, { kind: "field", name: "maximumThickness", static: false, private: false, access: { has: obj => "maximumThickness" in obj, get: obj => obj.maximumThickness, set: (obj, value) => { obj.maximumThickness = value; } }, metadata: _metadata }, _maximumThickness_initializers, _maximumThickness_extraInitializers);
            __esDecorate(null, null, _useThicknessAsDepth_decorators, { kind: "field", name: "useThicknessAsDepth", static: false, private: false, access: { has: obj => "useThicknessAsDepth" in obj, get: obj => obj.useThicknessAsDepth, set: (obj, value) => { obj.useThicknessAsDepth = value; } }, metadata: _metadata }, _useThicknessAsDepth_initializers, _useThicknessAsDepth_extraInitializers);
            __esDecorate(null, null, _tintColor_decorators, { kind: "field", name: "tintColor", static: false, private: false, access: { has: obj => "tintColor" in obj, get: obj => obj.tintColor, set: (obj, value) => { obj.tintColor = value; } }, metadata: _metadata }, _tintColor_initializers, _tintColor_extraInitializers);
            __esDecorate(null, null, _tintColorAtDistance_decorators, { kind: "field", name: "tintColorAtDistance", static: false, private: false, access: { has: obj => "tintColorAtDistance" in obj, get: obj => obj.tintColorAtDistance, set: (obj, value) => { obj.tintColorAtDistance = value; } }, metadata: _metadata }, _tintColorAtDistance_initializers, _tintColorAtDistance_extraInitializers);
            __esDecorate(null, null, _dispersion_decorators, { kind: "field", name: "dispersion", static: false, private: false, access: { has: obj => "dispersion" in obj, get: obj => obj.dispersion, set: (obj, value) => { obj.dispersion = value; } }, metadata: _metadata }, _dispersion_initializers, _dispersion_extraInitializers);
            __esDecorate(null, null, _diffusionDistance_decorators, { kind: "field", name: "diffusionDistance", static: false, private: false, access: { has: obj => "diffusionDistance" in obj, get: obj => obj.diffusionDistance, set: (obj, value) => { obj.diffusionDistance = value; } }, metadata: _metadata }, _diffusionDistance_initializers, _diffusionDistance_extraInitializers);
            __esDecorate(null, null, _translucencyColor_decorators, { kind: "field", name: "translucencyColor", static: false, private: false, access: { has: obj => "translucencyColor" in obj, get: obj => obj.translucencyColor, set: (obj, value) => { obj.translucencyColor = value; } }, metadata: _metadata }, _translucencyColor_initializers, _translucencyColor_extraInitializers);
            __esDecorate(null, null, _applyAlbedoAfterSubSurface_decorators, { kind: "field", name: "applyAlbedoAfterSubSurface", static: false, private: false, access: { has: obj => "applyAlbedoAfterSubSurface" in obj, get: obj => obj.applyAlbedoAfterSubSurface, set: (obj, value) => { obj.applyAlbedoAfterSubSurface = value; } }, metadata: _metadata }, _applyAlbedoAfterSubSurface_initializers, _applyAlbedoAfterSubSurface_extraInitializers);
            __esDecorate(null, null, _legacyTranslucency_decorators, { kind: "field", name: "legacyTranslucency", static: false, private: false, access: { has: obj => "legacyTranslucency" in obj, get: obj => obj.legacyTranslucency, set: (obj, value) => { obj.legacyTranslucency = value; } }, metadata: _metadata }, _legacyTranslucency_initializers, _legacyTranslucency_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        /**
         * Default value used for applyAlbedoAfterSubSurface.
         *
         * This property only exists for backward compatibility reasons.
         * Set it to true if your rendering in 8.0+ is different from that in 7 when you use sub-surface properties (transmission, refraction, etc.). Default is false.
         * Note however that the PBR calculation is wrong when this property is set to true, so only use it if you want to mimic the 7.0 behavior.
         */
        _a.DEFAULT_APPLY_ALBEDO_AFTERSUBSURFACE = false,
        /**
         * Default value used for legacyTranslucency.
         *
         * This property only exists for backward compatibility reasons.
         * Set it to true if your rendering in 8.0+ is different from that in 7 when you use sub-surface translucency. Default is false.
         */
        _a.DEFAULT_LEGACY_TRANSLUCENCY = false,
        _a;
})();
export { PBRSubSurfaceConfiguration };
//# sourceMappingURL=pbrSubSurfaceConfiguration.js.map