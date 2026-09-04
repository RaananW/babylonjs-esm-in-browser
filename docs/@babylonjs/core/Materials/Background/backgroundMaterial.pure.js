/** This file must only contain pure code and pure imports */
import { __classPrivateFieldGet, __classPrivateFieldSet, __esDecorate, __runInitializers } from "../../tslib.es6.js";
/* eslint-disable @typescript-eslint/naming-convention */
import { serialize, serializeAsColor3, expandToProperty, serializeAsTexture, serializeAsVector3 } from "../../Misc/decorators.js";
import { SmartArray } from "../../Misc/smartArray.js";
import { Logger } from "../../Misc/logger.js";
import { TmpVectors, Vector3, Vector4 } from "../../Maths/math.vector.pure.js";
import { VertexBuffer } from "../../Buffers/buffer.pure.js";
import { MaterialDefines } from "../../Materials/materialDefines.js";
import { PushMaterial } from "../../Materials/pushMaterial.js";
import { ImageProcessingDefinesMixin } from "../../Materials/imageProcessingConfiguration.defines.js";
import { ImageProcessingConfiguration, RegisterImageProcessingConfiguration } from "../../Materials/imageProcessingConfiguration.pure.js";

import { MaterialFlags } from "../materialFlags.js";
import { Color3 } from "../../Maths/math.color.pure.js";
import { EffectFallbacks } from "../effectFallbacks.js";
import { AddClipPlaneUniforms, BindClipPlane } from "../clipPlaneMaterialHelper.js";
import { BindBonesParameters, BindFogParameters, BindLights, BindLogDepth, BindTextureMatrix, BindIBLParameters, BindIBLSamplers, HandleFallbacksForShadows, PrepareAttributesForBones, PrepareAttributesForInstances, PrepareDefinesForAttributes, PrepareDefinesForFrameBoundValues, PrepareDefinesForLights, PrepareDefinesForIBL, PrepareDefinesForMergedUV, PrepareDefinesForMisc, PrepareDefinesForMultiview, PrepareUniformsAndSamplersList, PrepareUniformsAndSamplersForIBL, PrepareUniformLayoutForIBL, AreLightsTexturesReady, } from "../materialHelper.functions.js";
import { SerializationHelper } from "../../Misc/decorators.serialization.js";
import { _ShaderImportLoader } from "../../Misc/shaderImportLoader.js";
import { ImageProcessingMixin } from "../imageProcessing.js";
import { RegisterClass } from "../../Misc/typeStore.js";
class BackgroundMaterialDefinesBase extends MaterialDefines {
}
/**
 * Background material defines definition.
 * @internal Mainly internal Use
 */
class BackgroundMaterialDefines extends ImageProcessingDefinesMixin(BackgroundMaterialDefinesBase) {
    /**
     * Constructor of the defines.
     */
    constructor() {
        super();
        /**
         * True if the diffuse texture is in use.
         */
        this.DIFFUSE = false;
        /**
         * The direct UV channel to use.
         */
        this.DIFFUSEDIRECTUV = 0;
        /**
         * True if the diffuse texture is in gamma space.
         */
        this.GAMMADIFFUSE = false;
        /**
         * True if the diffuse texture has opacity in the alpha channel.
         */
        this.DIFFUSEHASALPHA = false;
        /**
         * True if you want the material to fade to transparent at grazing angle.
         */
        this.OPACITYFRESNEL = false;
        /**
         * True if an extra blur needs to be added in the reflection.
         */
        this.REFLECTIONBLUR = false;
        /**
         * True if you want the material to fade to reflection at grazing angle.
         */
        this.REFLECTIONFRESNEL = false;
        /**
         * True if you want the material to falloff as far as you move away from the scene center.
         */
        this.REFLECTIONFALLOFF = false;
        /**
         * False if the current Webgl implementation does not support the texture lod extension.
         */
        this.TEXTURELODSUPPORT = false;
        /**
         * True to ensure the data are premultiplied.
         */
        this.PREMULTIPLYALPHA = false;
        /**
         * True if the texture contains cooked RGB values and not gray scaled multipliers.
         */
        this.USERGBCOLOR = false;
        /**
         * True if highlight and shadow levels have been specified. It can help ensuring the main perceived color
         * stays aligned with the desired configuration.
         */
        this.USEHIGHLIGHTANDSHADOWCOLORS = false;
        /**
         * True if only shadows must be rendered
         */
        this.BACKMAT_SHADOWONLY = false;
        /**
         * True to add noise in order to reduce the banding effect.
         */
        this.NOISE = false;
        /**
         * is the reflection texture in BGR color scheme?
         * Mainly used to solve a bug in ios10 video tag
         */
        this.REFLECTIONBGR = false;
        /**
         * True if ground projection has been enabled.
         */
        this.PROJECTED_GROUND = false;
        /** Defines whether reflection is enabled */
        this.REFLECTION = false;
        /** Defines whether the reflection map is 3D */
        this.REFLECTIONMAP_3D = false;
        /** Defines whether the reflection map is spherical */
        this.REFLECTIONMAP_SPHERICAL = false;
        /** Defines whether the reflection map is planar */
        this.REFLECTIONMAP_PLANAR = false;
        /** Defines whether the reflection map is cubic */
        this.REFLECTIONMAP_CUBIC = false;
        /** Defines whether the reflection map is in projection mode */
        this.REFLECTIONMAP_PROJECTION = false;
        /** Defines whether the reflection map is a skybox */
        this.REFLECTIONMAP_SKYBOX = false;
        /** Defines whether the reflection map is explicit */
        this.REFLECTIONMAP_EXPLICIT = false;
        /** Defines whether the reflection map is equirectangular */
        this.REFLECTIONMAP_EQUIRECTANGULAR = false;
        /** Defines whether the reflection map is fixed equirectangular */
        this.REFLECTIONMAP_EQUIRECTANGULAR_FIXED = false;
        /** Defines whether the reflection map is mirrored fixed equirectangular */
        this.REFLECTIONMAP_MIRROREDEQUIRECTANGULAR_FIXED = false;
        /** Defines whether the cubic map should be inverted */
        this.INVERTCUBICMAP = false;
        /** Defines whether the reflection map uses opposite Z */
        this.REFLECTIONMAP_OPPOSITEZ = false;
        /** Defines whether LOD is stored in the reflection alpha channel */
        this.LODINREFLECTIONALPHA = false;
        /** Defines whether the reflection uses gamma space */
        this.GAMMAREFLECTION = false;
        /** Defines whether the reflection is in RGBD format */
        this.RGBDREFLECTION = false;
        /** Defines whether the equirectangular reflection uses a custom field of view */
        this.EQUIRECTANGULAR_RELFECTION_FOV = false;
        /** Defines whether main UV1 channel is used */
        this.MAINUV1 = false;
        /** Defines whether main UV2 channel is used */
        this.MAINUV2 = false;
        /** Defines whether UV1 is used */
        this.UV1 = false;
        /** Defines whether UV2 is used */
        this.UV2 = false;
        /** Defines whether clip plane 1 is enabled */
        this.CLIPPLANE = false;
        /** Defines whether clip plane 2 is enabled */
        this.CLIPPLANE2 = false;
        /** Defines whether clip plane 3 is enabled */
        this.CLIPPLANE3 = false;
        /** Defines whether clip plane 4 is enabled */
        this.CLIPPLANE4 = false;
        /** Defines whether clip plane 5 is enabled */
        this.CLIPPLANE5 = false;
        /** Defines whether clip plane 6 is enabled */
        this.CLIPPLANE6 = false;
        /** Defines whether point size is used */
        this.POINTSIZE = false;
        /** Defines whether fog is enabled */
        this.FOG = false;
        /** Defines whether normals are available */
        this.NORMAL = false;
        /** Defines the number of bone influencers */
        this.NUM_BONE_INFLUENCERS = 0;
        /** Defines the number of bones per mesh */
        this.BonesPerMesh = 0;
        /** Defines whether instances are used */
        this.INSTANCES = false;
        /** Defines whether shadow uses float textures */
        this.SHADOWFLOAT = false;
        /** Defines whether logarithmic depth is enabled */
        this.LOGARITHMICDEPTH = false;
        /** Defines whether non-uniform scaling is applied */
        this.NONUNIFORMSCALING = false;
        /** Defines whether alpha testing is enabled */
        this.ALPHATEST = false;
        this.rebuild();
    }
}
class BackgroundMaterialBase extends ImageProcessingMixin(PushMaterial) {
}
/**
 * Background material used to create an efficient environment around your scene.
 * #157MGZ: simple test
 */
let BackgroundMaterial = (() => {
    var _a, _BackgroundMaterial_primaryColor_accessor_storage, _BackgroundMaterial_reflectionTexture_accessor_storage, _BackgroundMaterial_reflectionBlur_accessor_storage, _BackgroundMaterial_diffuseTexture_accessor_storage, _BackgroundMaterial_shadowLights_accessor_storage, _BackgroundMaterial_shadowLevel_accessor_storage, _BackgroundMaterial_sceneCenter_accessor_storage, _BackgroundMaterial_opacityFresnel_accessor_storage, _BackgroundMaterial_reflectionFresnel_accessor_storage, _BackgroundMaterial_reflectionFalloffDistance_accessor_storage, _BackgroundMaterial_reflectionAmount_accessor_storage, _BackgroundMaterial_reflectionReflectance0_accessor_storage, _BackgroundMaterial_reflectionReflectance90_accessor_storage, _BackgroundMaterial_useRGBColor_accessor_storage, _BackgroundMaterial_enableNoise_accessor_storage, _BackgroundMaterial_maxSimultaneousLights_accessor_storage, _BackgroundMaterial_shadowOnly_accessor_storage, _BackgroundMaterial_enableGroundProjection_accessor_storage;
    let _classSuper = BackgroundMaterialBase;
    let __primaryColor_decorators;
    let __primaryColor_initializers = [];
    let __primaryColor_extraInitializers = [];
    let _primaryColor_decorators;
    let _primaryColor_initializers = [];
    let _primaryColor_extraInitializers = [];
    let ___perceptualColor_decorators;
    let ___perceptualColor_initializers = [];
    let ___perceptualColor_extraInitializers = [];
    let __primaryColorShadowLevel_decorators;
    let __primaryColorShadowLevel_initializers = [];
    let __primaryColorShadowLevel_extraInitializers = [];
    let __primaryColorHighlightLevel_decorators;
    let __primaryColorHighlightLevel_initializers = [];
    let __primaryColorHighlightLevel_extraInitializers = [];
    let __reflectionTexture_decorators;
    let __reflectionTexture_initializers = [];
    let __reflectionTexture_extraInitializers = [];
    let _reflectionTexture_decorators;
    let _reflectionTexture_initializers = [];
    let _reflectionTexture_extraInitializers = [];
    let __reflectionBlur_decorators;
    let __reflectionBlur_initializers = [];
    let __reflectionBlur_extraInitializers = [];
    let _reflectionBlur_decorators;
    let _reflectionBlur_initializers = [];
    let _reflectionBlur_extraInitializers = [];
    let __diffuseTexture_decorators;
    let __diffuseTexture_initializers = [];
    let __diffuseTexture_extraInitializers = [];
    let _diffuseTexture_decorators;
    let _diffuseTexture_initializers = [];
    let _diffuseTexture_extraInitializers = [];
    let _shadowLights_decorators;
    let _shadowLights_initializers = [];
    let _shadowLights_extraInitializers = [];
    let __shadowLevel_decorators;
    let __shadowLevel_initializers = [];
    let __shadowLevel_extraInitializers = [];
    let _shadowLevel_decorators;
    let _shadowLevel_initializers = [];
    let _shadowLevel_extraInitializers = [];
    let __sceneCenter_decorators;
    let __sceneCenter_initializers = [];
    let __sceneCenter_extraInitializers = [];
    let _sceneCenter_decorators;
    let _sceneCenter_initializers = [];
    let _sceneCenter_extraInitializers = [];
    let __opacityFresnel_decorators;
    let __opacityFresnel_initializers = [];
    let __opacityFresnel_extraInitializers = [];
    let _opacityFresnel_decorators;
    let _opacityFresnel_initializers = [];
    let _opacityFresnel_extraInitializers = [];
    let __reflectionFresnel_decorators;
    let __reflectionFresnel_initializers = [];
    let __reflectionFresnel_extraInitializers = [];
    let _reflectionFresnel_decorators;
    let _reflectionFresnel_initializers = [];
    let _reflectionFresnel_extraInitializers = [];
    let __reflectionFalloffDistance_decorators;
    let __reflectionFalloffDistance_initializers = [];
    let __reflectionFalloffDistance_extraInitializers = [];
    let _reflectionFalloffDistance_decorators;
    let _reflectionFalloffDistance_initializers = [];
    let _reflectionFalloffDistance_extraInitializers = [];
    let __reflectionAmount_decorators;
    let __reflectionAmount_initializers = [];
    let __reflectionAmount_extraInitializers = [];
    let _reflectionAmount_decorators;
    let _reflectionAmount_initializers = [];
    let _reflectionAmount_extraInitializers = [];
    let __reflectionReflectance0_decorators;
    let __reflectionReflectance0_initializers = [];
    let __reflectionReflectance0_extraInitializers = [];
    let _reflectionReflectance0_decorators;
    let _reflectionReflectance0_initializers = [];
    let _reflectionReflectance0_extraInitializers = [];
    let __reflectionReflectance90_decorators;
    let __reflectionReflectance90_initializers = [];
    let __reflectionReflectance90_extraInitializers = [];
    let _reflectionReflectance90_decorators;
    let _reflectionReflectance90_initializers = [];
    let _reflectionReflectance90_extraInitializers = [];
    let __useRGBColor_decorators;
    let __useRGBColor_initializers = [];
    let __useRGBColor_extraInitializers = [];
    let _useRGBColor_decorators;
    let _useRGBColor_initializers = [];
    let _useRGBColor_extraInitializers = [];
    let __enableNoise_decorators;
    let __enableNoise_initializers = [];
    let __enableNoise_extraInitializers = [];
    let _enableNoise_decorators;
    let _enableNoise_initializers = [];
    let _enableNoise_extraInitializers = [];
    let __maxSimultaneousLights_decorators;
    let __maxSimultaneousLights_initializers = [];
    let __maxSimultaneousLights_extraInitializers = [];
    let _maxSimultaneousLights_decorators;
    let _maxSimultaneousLights_initializers = [];
    let _maxSimultaneousLights_extraInitializers = [];
    let __shadowOnly_decorators;
    let __shadowOnly_initializers = [];
    let __shadowOnly_extraInitializers = [];
    let _shadowOnly_decorators;
    let _shadowOnly_initializers = [];
    let _shadowOnly_extraInitializers = [];
    let _enableGroundProjection_decorators;
    let _enableGroundProjection_initializers = [];
    let _enableGroundProjection_extraInitializers = [];
    let _projectedGroundRadius_decorators;
    let _projectedGroundRadius_initializers = [];
    let _projectedGroundRadius_extraInitializers = [];
    let _projectedGroundHeight_decorators;
    let _projectedGroundHeight_initializers = [];
    let _projectedGroundHeight_extraInitializers = [];
    return _a = class BackgroundMaterial extends _classSuper {
            /**
             * Key light Color (multiply against the environment texture)
             */
            get primaryColor() { return __classPrivateFieldGet(this, _BackgroundMaterial_primaryColor_accessor_storage, "f"); }
            set primaryColor(value) { __classPrivateFieldSet(this, _BackgroundMaterial_primaryColor_accessor_storage, value, "f"); }
            /**
             * Experimental Internal Use Only.
             *
             * Key light Color in "perceptual value" meaning the color you would like to see on screen.
             * This acts as a helper to set the primary color to a more "human friendly" value.
             * Conversion to linear space as well as exposure and tone mapping correction will be applied to keep the
             * output color as close as possible from the chosen value.
             * (This does not account for contrast color grading and color curves as they are considered post effect and not directly
             * part of lighting setup.)
             */
            get _perceptualColor() {
                return this.__perceptualColor;
            }
            set _perceptualColor(value) {
                this.__perceptualColor = value;
                this._computePrimaryColorFromPerceptualColor();
                this._markAllSubMeshesAsLightsDirty();
            }
            /**
             * Defines the level of the shadows (dark area of the reflection map) in order to help scaling the colors.
             * The color opposite to the primary color is used at the level chosen to define what the black area would look.
             */
            get primaryColorShadowLevel() {
                return this._primaryColorShadowLevel;
            }
            set primaryColorShadowLevel(value) {
                this._primaryColorShadowLevel = value;
                this._computePrimaryColors();
                this._markAllSubMeshesAsLightsDirty();
            }
            /**
             * Defines the level of the highlights (highlight area of the reflection map) in order to help scaling the colors.
             * The primary color is used at the level chosen to define what the white area would look.
             */
            get primaryColorHighlightLevel() {
                return this._primaryColorHighlightLevel;
            }
            set primaryColorHighlightLevel(value) {
                this._primaryColorHighlightLevel = value;
                this._computePrimaryColors();
                this._markAllSubMeshesAsLightsDirty();
            }
            /**
             * Reflection Texture used in the material.
             * Should be author in a specific way for the best result (refer to the documentation).
             */
            get reflectionTexture() { return __classPrivateFieldGet(this, _BackgroundMaterial_reflectionTexture_accessor_storage, "f"); }
            set reflectionTexture(value) { __classPrivateFieldSet(this, _BackgroundMaterial_reflectionTexture_accessor_storage, value, "f"); }
            /**
             * Reflection Texture level of blur.
             *
             * Can be use to reuse an existing HDR Texture and target a specific LOD to prevent authoring the
             * texture twice.
             */
            get reflectionBlur() { return __classPrivateFieldGet(this, _BackgroundMaterial_reflectionBlur_accessor_storage, "f"); }
            set reflectionBlur(value) { __classPrivateFieldSet(this, _BackgroundMaterial_reflectionBlur_accessor_storage, value, "f"); }
            /**
             * Diffuse Texture used in the material.
             * Should be author in a specific way for the best result (refer to the documentation).
             */
            get diffuseTexture() { return __classPrivateFieldGet(this, _BackgroundMaterial_diffuseTexture_accessor_storage, "f"); }
            set diffuseTexture(value) { __classPrivateFieldSet(this, _BackgroundMaterial_diffuseTexture_accessor_storage, value, "f"); }
            /**
             * Specify the list of lights casting shadow on the material.
             * All scene shadow lights will be included if null.
             */
            get shadowLights() { return __classPrivateFieldGet(this, _BackgroundMaterial_shadowLights_accessor_storage, "f"); }
            set shadowLights(value) { __classPrivateFieldSet(this, _BackgroundMaterial_shadowLights_accessor_storage, value, "f"); }
            /**
             * Helps adjusting the shadow to a softer level if required.
             * 0 means black shadows and 1 means no shadows.
             */
            get shadowLevel() { return __classPrivateFieldGet(this, _BackgroundMaterial_shadowLevel_accessor_storage, "f"); }
            set shadowLevel(value) { __classPrivateFieldSet(this, _BackgroundMaterial_shadowLevel_accessor_storage, value, "f"); }
            /**
             * In case of opacity Fresnel or reflection falloff, this is use as a scene center.
             * It is usually zero but might be interesting to modify according to your setup.
             */
            get sceneCenter() { return __classPrivateFieldGet(this, _BackgroundMaterial_sceneCenter_accessor_storage, "f"); }
            set sceneCenter(value) { __classPrivateFieldSet(this, _BackgroundMaterial_sceneCenter_accessor_storage, value, "f"); }
            /**
             * This helps specifying that the material is falling off to the sky box at grazing angle.
             * This helps ensuring a nice transition when the camera goes under the ground.
             */
            get opacityFresnel() { return __classPrivateFieldGet(this, _BackgroundMaterial_opacityFresnel_accessor_storage, "f"); }
            set opacityFresnel(value) { __classPrivateFieldSet(this, _BackgroundMaterial_opacityFresnel_accessor_storage, value, "f"); }
            /**
             * This helps specifying that the material is falling off from diffuse to the reflection texture at grazing angle.
             * This helps adding a mirror texture on the ground.
             */
            get reflectionFresnel() { return __classPrivateFieldGet(this, _BackgroundMaterial_reflectionFresnel_accessor_storage, "f"); }
            set reflectionFresnel(value) { __classPrivateFieldSet(this, _BackgroundMaterial_reflectionFresnel_accessor_storage, value, "f"); }
            /**
             * This helps specifying the falloff radius off the reflection texture from the sceneCenter.
             * This helps adding a nice falloff effect to the reflection if used as a mirror for instance.
             */
            get reflectionFalloffDistance() { return __classPrivateFieldGet(this, _BackgroundMaterial_reflectionFalloffDistance_accessor_storage, "f"); }
            set reflectionFalloffDistance(value) { __classPrivateFieldSet(this, _BackgroundMaterial_reflectionFalloffDistance_accessor_storage, value, "f"); }
            /**
             * This specifies the weight of the reflection against the background in case of reflection Fresnel.
             */
            get reflectionAmount() { return __classPrivateFieldGet(this, _BackgroundMaterial_reflectionAmount_accessor_storage, "f"); }
            set reflectionAmount(value) { __classPrivateFieldSet(this, _BackgroundMaterial_reflectionAmount_accessor_storage, value, "f"); }
            /**
             * This specifies the weight of the reflection at grazing angle.
             */
            get reflectionReflectance0() { return __classPrivateFieldGet(this, _BackgroundMaterial_reflectionReflectance0_accessor_storage, "f"); }
            set reflectionReflectance0(value) { __classPrivateFieldSet(this, _BackgroundMaterial_reflectionReflectance0_accessor_storage, value, "f"); }
            /**
             * This specifies the weight of the reflection at a perpendicular point of view.
             */
            get reflectionReflectance90() { return __classPrivateFieldGet(this, _BackgroundMaterial_reflectionReflectance90_accessor_storage, "f"); }
            set reflectionReflectance90(value) { __classPrivateFieldSet(this, _BackgroundMaterial_reflectionReflectance90_accessor_storage, value, "f"); }
            /**
             * Sets the reflection reflectance fresnel values according to the default standard
             * empirically know to work well :-)
             */
            set reflectionStandardFresnelWeight(value) {
                let reflectionWeight = value;
                if (reflectionWeight < 0.5) {
                    reflectionWeight = reflectionWeight * 2.0;
                    this.reflectionReflectance0 = _a.StandardReflectance0 * reflectionWeight;
                    this.reflectionReflectance90 = _a.StandardReflectance90 * reflectionWeight;
                }
                else {
                    reflectionWeight = reflectionWeight * 2.0 - 1.0;
                    this.reflectionReflectance0 = _a.StandardReflectance0 + (1.0 - _a.StandardReflectance0) * reflectionWeight;
                    this.reflectionReflectance90 = _a.StandardReflectance90 + (1.0 - _a.StandardReflectance90) * reflectionWeight;
                }
            }
            /**
             * Helps to directly use the maps channels instead of their level.
             */
            get useRGBColor() { return __classPrivateFieldGet(this, _BackgroundMaterial_useRGBColor_accessor_storage, "f"); }
            set useRGBColor(value) { __classPrivateFieldSet(this, _BackgroundMaterial_useRGBColor_accessor_storage, value, "f"); }
            /**
             * This helps reducing the banding effect that could occur on the background.
             */
            get enableNoise() { return __classPrivateFieldGet(this, _BackgroundMaterial_enableNoise_accessor_storage, "f"); }
            set enableNoise(value) { __classPrivateFieldSet(this, _BackgroundMaterial_enableNoise_accessor_storage, value, "f"); }
            /**
             * The current fov(field of view) multiplier, 0.0 - 2.0. Defaults to 1.0. Lower values "zoom in" and higher values "zoom out".
             * Best used when trying to implement visual zoom effects like fish-eye or binoculars while not adjusting camera fov.
             * Recommended to be keep at 1.0 except for special cases.
             */
            get fovMultiplier() {
                return this._fovMultiplier;
            }
            set fovMultiplier(value) {
                if (isNaN(value)) {
                    value = 1.0;
                }
                this._fovMultiplier = Math.max(0.0, Math.min(2.0, value));
            }
            /**
             * Number of Simultaneous lights allowed on the material.
             */
            get maxSimultaneousLights() { return __classPrivateFieldGet(this, _BackgroundMaterial_maxSimultaneousLights_accessor_storage, "f"); }
            set maxSimultaneousLights(value) { __classPrivateFieldSet(this, _BackgroundMaterial_maxSimultaneousLights_accessor_storage, value, "f"); }
            /**
             * Make the material only render shadows
             */
            get shadowOnly() { return __classPrivateFieldGet(this, _BackgroundMaterial_shadowOnly_accessor_storage, "f"); }
            set shadowOnly(value) { __classPrivateFieldSet(this, _BackgroundMaterial_shadowOnly_accessor_storage, value, "f"); }
            /**
             * Enables the ground projection mode on the material.
             * @see https://doc.babylonjs.com/features/featuresDeepDive/environment/skybox#ground-projection
             */
            get enableGroundProjection() { return __classPrivateFieldGet(this, _BackgroundMaterial_enableGroundProjection_accessor_storage, "f"); }
            set enableGroundProjection(value) { __classPrivateFieldSet(this, _BackgroundMaterial_enableGroundProjection_accessor_storage, value, "f"); }
            /**
             * Instantiates a Background Material in the given scene
             * @param name The friendly name of the material
             * @param scene The scene to add the material to
             * @param forceGLSL Use the GLSL code generation for the shader (even on WebGPU). Default is false
             */
            constructor(name, scene, forceGLSL = false) {
                super(name, scene, undefined, forceGLSL);
                this._primaryColor = __runInitializers(this, __primaryColor_initializers, void 0);
                _BackgroundMaterial_primaryColor_accessor_storage.set(this, (__runInitializers(this, __primaryColor_extraInitializers), __runInitializers(this, _primaryColor_initializers, Color3.White())));
                this.__perceptualColor = (__runInitializers(this, _primaryColor_extraInitializers), __runInitializers(this, ___perceptualColor_initializers, void 0));
                this._primaryColorShadowLevel = (__runInitializers(this, ___perceptualColor_extraInitializers), __runInitializers(this, __primaryColorShadowLevel_initializers, 0));
                this._primaryColorHighlightLevel = (__runInitializers(this, __primaryColorShadowLevel_extraInitializers), __runInitializers(this, __primaryColorHighlightLevel_initializers, 0));
                this._reflectionTexture = (__runInitializers(this, __primaryColorHighlightLevel_extraInitializers), __runInitializers(this, __reflectionTexture_initializers, void 0));
                _BackgroundMaterial_reflectionTexture_accessor_storage.set(this, (__runInitializers(this, __reflectionTexture_extraInitializers), __runInitializers(this, _reflectionTexture_initializers, null)));
                this._reflectionBlur = (__runInitializers(this, _reflectionTexture_extraInitializers), __runInitializers(this, __reflectionBlur_initializers, void 0));
                _BackgroundMaterial_reflectionBlur_accessor_storage.set(this, (__runInitializers(this, __reflectionBlur_extraInitializers), __runInitializers(this, _reflectionBlur_initializers, 0)));
                this._diffuseTexture = (__runInitializers(this, _reflectionBlur_extraInitializers), __runInitializers(this, __diffuseTexture_initializers, void 0));
                _BackgroundMaterial_diffuseTexture_accessor_storage.set(this, (__runInitializers(this, __diffuseTexture_extraInitializers), __runInitializers(this, _diffuseTexture_initializers, null)));
                this._shadowLights = (__runInitializers(this, _diffuseTexture_extraInitializers), null);
                _BackgroundMaterial_shadowLights_accessor_storage.set(this, __runInitializers(this, _shadowLights_initializers, null));
                this._shadowLevel = (__runInitializers(this, _shadowLights_extraInitializers), __runInitializers(this, __shadowLevel_initializers, void 0));
                _BackgroundMaterial_shadowLevel_accessor_storage.set(this, (__runInitializers(this, __shadowLevel_extraInitializers), __runInitializers(this, _shadowLevel_initializers, 0)));
                this._sceneCenter = (__runInitializers(this, _shadowLevel_extraInitializers), __runInitializers(this, __sceneCenter_initializers, void 0));
                _BackgroundMaterial_sceneCenter_accessor_storage.set(this, (__runInitializers(this, __sceneCenter_extraInitializers), __runInitializers(this, _sceneCenter_initializers, Vector3.Zero())));
                this._opacityFresnel = (__runInitializers(this, _sceneCenter_extraInitializers), __runInitializers(this, __opacityFresnel_initializers, void 0));
                _BackgroundMaterial_opacityFresnel_accessor_storage.set(this, (__runInitializers(this, __opacityFresnel_extraInitializers), __runInitializers(this, _opacityFresnel_initializers, true)));
                this._reflectionFresnel = (__runInitializers(this, _opacityFresnel_extraInitializers), __runInitializers(this, __reflectionFresnel_initializers, void 0));
                _BackgroundMaterial_reflectionFresnel_accessor_storage.set(this, (__runInitializers(this, __reflectionFresnel_extraInitializers), __runInitializers(this, _reflectionFresnel_initializers, false)));
                this._reflectionFalloffDistance = (__runInitializers(this, _reflectionFresnel_extraInitializers), __runInitializers(this, __reflectionFalloffDistance_initializers, void 0));
                _BackgroundMaterial_reflectionFalloffDistance_accessor_storage.set(this, (__runInitializers(this, __reflectionFalloffDistance_extraInitializers), __runInitializers(this, _reflectionFalloffDistance_initializers, 0.0)));
                this._reflectionAmount = (__runInitializers(this, _reflectionFalloffDistance_extraInitializers), __runInitializers(this, __reflectionAmount_initializers, void 0));
                _BackgroundMaterial_reflectionAmount_accessor_storage.set(this, (__runInitializers(this, __reflectionAmount_extraInitializers), __runInitializers(this, _reflectionAmount_initializers, 1.0)));
                this._reflectionReflectance0 = (__runInitializers(this, _reflectionAmount_extraInitializers), __runInitializers(this, __reflectionReflectance0_initializers, void 0));
                _BackgroundMaterial_reflectionReflectance0_accessor_storage.set(this, (__runInitializers(this, __reflectionReflectance0_extraInitializers), __runInitializers(this, _reflectionReflectance0_initializers, 0.05)));
                this._reflectionReflectance90 = (__runInitializers(this, _reflectionReflectance0_extraInitializers), __runInitializers(this, __reflectionReflectance90_initializers, void 0));
                _BackgroundMaterial_reflectionReflectance90_accessor_storage.set(this, (__runInitializers(this, __reflectionReflectance90_extraInitializers), __runInitializers(this, _reflectionReflectance90_initializers, 0.5)));
                this._useRGBColor = (__runInitializers(this, _reflectionReflectance90_extraInitializers), __runInitializers(this, __useRGBColor_initializers, void 0));
                _BackgroundMaterial_useRGBColor_accessor_storage.set(this, (__runInitializers(this, __useRGBColor_extraInitializers), __runInitializers(this, _useRGBColor_initializers, true)));
                this._enableNoise = (__runInitializers(this, _useRGBColor_extraInitializers), __runInitializers(this, __enableNoise_initializers, void 0));
                _BackgroundMaterial_enableNoise_accessor_storage.set(this, (__runInitializers(this, __enableNoise_extraInitializers), __runInitializers(this, _enableNoise_initializers, false)));
                this._fovMultiplier = (__runInitializers(this, _enableNoise_extraInitializers), 1.0);
                /**
                 * Enable the FOV adjustment feature controlled by fovMultiplier.
                 */
                this.useEquirectangularFOV = false;
                this._maxSimultaneousLights = __runInitializers(this, __maxSimultaneousLights_initializers, 4);
                _BackgroundMaterial_maxSimultaneousLights_accessor_storage.set(this, (__runInitializers(this, __maxSimultaneousLights_extraInitializers), __runInitializers(this, _maxSimultaneousLights_initializers, 4)));
                this._shadowOnly = (__runInitializers(this, _maxSimultaneousLights_extraInitializers), __runInitializers(this, __shadowOnly_initializers, false));
                _BackgroundMaterial_shadowOnly_accessor_storage.set(this, (__runInitializers(this, __shadowOnly_extraInitializers), __runInitializers(this, _shadowOnly_initializers, false)));
                /**
                 * Due to a bug in iOS10, video tags (which are using the background material) are in BGR and not RGB.
                 * Setting this flag to true (not done automatically!) will convert it back to RGB.
                 */
                this.switchToBGR = (__runInitializers(this, _shadowOnly_extraInitializers), false);
                this._enableGroundProjection = false;
                _BackgroundMaterial_enableGroundProjection_accessor_storage.set(this, __runInitializers(this, _enableGroundProjection_initializers, false));
                /**
                 * Defines the radius of the projected ground if enableGroundProjection is true.
                 * @see https://doc.babylonjs.com/features/featuresDeepDive/environment/skybox#ground-projection
                 */
                this.projectedGroundRadius = (__runInitializers(this, _enableGroundProjection_extraInitializers), __runInitializers(this, _projectedGroundRadius_initializers, 1000));
                /**
                 * Defines the height of the projected ground if enableGroundProjection is true.
                 * @see https://doc.babylonjs.com/features/featuresDeepDive/environment/skybox#ground-projection
                 */
                this.projectedGroundHeight = (__runInitializers(this, _projectedGroundRadius_extraInitializers), __runInitializers(this, _projectedGroundHeight_initializers, 10));
                // Temp values kept as cache in the material.
                this._renderTargets = (__runInitializers(this, _projectedGroundHeight_extraInitializers), new SmartArray(16));
                this._reflectionControls = Vector4.Zero();
                this._white = Color3.White();
                this._primaryShadowColor = Color3.Black();
                this._primaryHighlightColor = Color3.Black();
                // Setup the default processing configuration to the scene.
                this._attachImageProcessingConfiguration(null);
                this.getRenderTargetTextures = () => {
                    this._renderTargets.reset();
                    if (this._diffuseTexture && this._diffuseTexture.isRenderTarget) {
                        this._renderTargets.push(this._diffuseTexture);
                    }
                    if (this._reflectionTexture && this._reflectionTexture.isRenderTarget) {
                        this._renderTargets.push(this._reflectionTexture);
                    }
                    return this._renderTargets;
                };
            }
            /**
             * Gets a boolean indicating that current material needs to register RTT
             */
            get hasRenderTargetTextures() {
                if (this._diffuseTexture && this._diffuseTexture.isRenderTarget) {
                    return true;
                }
                if (this._reflectionTexture && this._reflectionTexture.isRenderTarget) {
                    return true;
                }
                return false;
            }
            /**
             * The entire material has been created in order to prevent overdraw.
             * @returns false
             */
            needAlphaTesting() {
                return true;
            }
            /**
             * The entire material has been created in order to prevent overdraw.
             * @returns true if blending is enable
             */
            needAlphaBlending() {
                return this.alpha < 1 || (this._diffuseTexture != null && this._diffuseTexture.hasAlpha) || this._shadowOnly;
            }
            /**
             * Checks whether the material is ready to be rendered for a given mesh.
             * @param mesh The mesh to render
             * @param subMesh The submesh to check against
             * @param useInstances Specify wether or not the material is used with instances
             * @returns true if all the dependencies are ready (Textures, Effects...)
             */
            isReadyForSubMesh(mesh, subMesh, useInstances = false) {
                const drawWrapper = subMesh._drawWrapper;
                if (drawWrapper.effect && this.isFrozen) {
                    if (drawWrapper._wasPreviouslyReady && drawWrapper._wasPreviouslyUsingInstances === useInstances) {
                        return true;
                    }
                }
                if (!subMesh.materialDefines) {
                    subMesh.materialDefines = new BackgroundMaterialDefines();
                }
                const scene = this.getScene();
                const defines = subMesh.materialDefines;
                if (this._isReadyForSubMesh(subMesh)) {
                    return true;
                }
                const engine = scene.getEngine();
                // Lights
                PrepareDefinesForLights(scene, mesh, defines, false, this._maxSimultaneousLights);
                defines._needNormals = true;
                if (!AreLightsTexturesReady(scene, mesh, this._maxSimultaneousLights)) {
                    return false;
                }
                // Multiview
                PrepareDefinesForMultiview(scene, defines);
                // Textures
                if (defines._areTexturesDirty) {
                    defines._needUVs = false;
                    if (scene.texturesEnabled) {
                        if (scene.getEngine().getCaps().textureLOD) {
                            defines.TEXTURELODSUPPORT = true;
                        }
                        if (this._diffuseTexture && MaterialFlags.DiffuseTextureEnabled) {
                            if (!this._diffuseTexture.isReadyOrNotBlocking()) {
                                return false;
                            }
                            PrepareDefinesForMergedUV(this._diffuseTexture, defines, "DIFFUSE");
                            defines.DIFFUSEHASALPHA = this._diffuseTexture.hasAlpha;
                            defines.GAMMADIFFUSE = this._diffuseTexture.gammaSpace;
                            defines.OPACITYFRESNEL = this._opacityFresnel;
                        }
                        else {
                            defines.DIFFUSE = false;
                            defines.DIFFUSEDIRECTUV = 0;
                            defines.DIFFUSEHASALPHA = false;
                            defines.GAMMADIFFUSE = false;
                            defines.OPACITYFRESNEL = false;
                        }
                        const reflectionTexture = this._reflectionTexture;
                        PrepareDefinesForIBL(scene, reflectionTexture, defines);
                        if (reflectionTexture && MaterialFlags.ReflectionTextureEnabled) {
                            if (!reflectionTexture.isReadyOrNotBlocking()) {
                                return false;
                            }
                            defines.EQUIRECTANGULAR_RELFECTION_FOV = this.useEquirectangularFOV;
                            defines.REFLECTIONBGR = this.switchToBGR;
                            defines.REFLECTIONBLUR = this._reflectionBlur > 0;
                            if (this.reflectionFresnel) {
                                defines.REFLECTIONFRESNEL = true;
                                defines.REFLECTIONFALLOFF = this.reflectionFalloffDistance > 0;
                                this._reflectionControls.x = this.reflectionAmount;
                                this._reflectionControls.y = this.reflectionReflectance0;
                                this._reflectionControls.z = this.reflectionReflectance90;
                                this._reflectionControls.w = 1 / this.reflectionFalloffDistance;
                            }
                            else {
                                defines.REFLECTIONFRESNEL = false;
                                defines.REFLECTIONFALLOFF = false;
                            }
                        }
                        else {
                            defines.REFLECTIONFRESNEL = false;
                            defines.REFLECTIONFALLOFF = false;
                            defines.REFLECTIONBLUR = false;
                        }
                    }
                    defines.PREMULTIPLYALPHA = this.alphaMode === 7 || this.alphaMode === 8;
                    defines.USERGBCOLOR = this._useRGBColor;
                    defines.NOISE = this._enableNoise;
                }
                if (defines._areLightsDirty) {
                    defines.USEHIGHLIGHTANDSHADOWCOLORS = !this._useRGBColor && (this._primaryColorShadowLevel !== 0 || this._primaryColorHighlightLevel !== 0);
                    defines.BACKMAT_SHADOWONLY = this._shadowOnly;
                }
                if (defines._areImageProcessingDirty && this._imageProcessingConfiguration) {
                    if (!this._imageProcessingConfiguration.isReady()) {
                        return false;
                    }
                    this._imageProcessingConfiguration.prepareDefines(defines);
                }
                if (defines._areMiscDirty) {
                    if (defines.REFLECTIONMAP_3D && this._enableGroundProjection) {
                        defines.PROJECTED_GROUND = true;
                        defines.REFLECTIONMAP_SKYBOX = true;
                    }
                    else {
                        defines.PROJECTED_GROUND = false;
                    }
                }
                // Misc.
                PrepareDefinesForMisc(mesh, scene, this._useLogarithmicDepth, this.pointsCloud, this.fogEnabled, this.needAlphaTestingForMesh(mesh), defines, undefined, undefined, undefined, this._isVertexOutputInvariant);
                // Values that need to be evaluated on every frame
                PrepareDefinesForFrameBoundValues(scene, engine, this, defines, useInstances, null, subMesh.getRenderingMesh().hasThinInstances);
                // Attribs
                if (PrepareDefinesForAttributes(mesh, defines, false, true, false)) {
                    if (mesh) {
                        if (!scene.getEngine().getCaps().standardDerivatives && !mesh.isVerticesDataPresent(VertexBuffer.NormalKind)) {
                            mesh.createNormals(true);
                            Logger.Warn("BackgroundMaterial: Normals have been created for the mesh: " + mesh.name);
                        }
                    }
                }
                // Get correct effect
                if (defines.isDirty) {
                    defines.markAsProcessed();
                    scene.resetCachedMaterial();
                    // Fallbacks
                    const fallbacks = new EffectFallbacks();
                    if (defines.FOG) {
                        fallbacks.addFallback(0, "FOG");
                    }
                    if (defines.POINTSIZE) {
                        fallbacks.addFallback(1, "POINTSIZE");
                    }
                    if (defines.MULTIVIEW) {
                        fallbacks.addFallback(0, "MULTIVIEW");
                    }
                    HandleFallbacksForShadows(defines, fallbacks, this._maxSimultaneousLights);
                    //Attributes
                    const attribs = [VertexBuffer.PositionKind];
                    if (defines.NORMAL) {
                        attribs.push(VertexBuffer.NormalKind);
                    }
                    if (defines.UV1) {
                        attribs.push(VertexBuffer.UVKind);
                    }
                    if (defines.UV2) {
                        attribs.push(VertexBuffer.UV2Kind);
                    }
                    PrepareAttributesForBones(attribs, mesh, defines, fallbacks);
                    PrepareAttributesForInstances(attribs, defines);
                    const uniforms = [
                        "world",
                        "view",
                        "viewProjection",
                        "vEyePosition",
                        "vLightsType",
                        "vFogInfos",
                        "vFogColor",
                        "pointSize",
                        "mBones",
                        "vPrimaryColor",
                        "vPrimaryColorShadow",
                        "fFovMultiplier",
                        "shadowLevel",
                        "alpha",
                        "vBackgroundCenter",
                        "vReflectionControl",
                        "vDiffuseInfos",
                        "diffuseMatrix",
                        "projectedGroundInfos",
                        "logarithmicDepthConstant",
                    ];
                    AddClipPlaneUniforms(uniforms);
                    const samplers = ["diffuseSampler"];
                    PrepareUniformsAndSamplersForIBL(uniforms, samplers, false);
                    const uniformBuffers = ["Material", "Scene"];
                    if (ImageProcessingConfiguration) {
                        ImageProcessingConfiguration.PrepareUniforms(uniforms, defines);
                        ImageProcessingConfiguration.PrepareSamplers(samplers, defines);
                    }
                    PrepareUniformsAndSamplersList({
                        uniformsNames: uniforms,
                        uniformBuffersNames: uniformBuffers,
                        samplers: samplers,
                        defines: defines,
                        maxSimultaneousLights: this._maxSimultaneousLights,
                        shaderLanguage: this._shaderLanguage,
                    });
                    const join = defines.toString();
                    const effect = scene.getEngine().createEffect("background", {
                        attributes: attribs,
                        uniformsNames: uniforms,
                        uniformBuffersNames: uniformBuffers,
                        samplers: samplers,
                        defines: join,
                        fallbacks: fallbacks,
                        onCompiled: this.onCompiled,
                        onError: this.onError,
                        indexParameters: { maxSimultaneousLights: this._maxSimultaneousLights },
                        shaderLanguage: this._shaderLanguage,
                        extraInitializationsAsync: _a._ShaderLoader.getLoadCallback(this._shaderLanguage),
                    }, engine);
                    subMesh.setEffect(effect, defines, this._materialContext);
                    this.buildUniformLayout();
                }
                if (!subMesh.effect || !subMesh.effect.isReady()) {
                    return false;
                }
                defines._renderId = scene.getRenderId();
                drawWrapper._wasPreviouslyReady = true;
                drawWrapper._wasPreviouslyUsingInstances = useInstances;
                this._checkScenePerformancePriority();
                return true;
            }
            /**
             * Compute the primary color according to the chosen perceptual color.
             */
            _computePrimaryColorFromPerceptualColor() {
                if (!this.__perceptualColor) {
                    return;
                }
                this._primaryColor.copyFrom(this.__perceptualColor);
                // Revert gamma space.
                this._primaryColor.toLinearSpaceToRef(this._primaryColor, this.getScene().getEngine().useExactSrgbConversions);
                // Revert image processing configuration.
                if (this._imageProcessingConfiguration) {
                    // Revert Exposure.
                    this._primaryColor.scaleToRef(1 / this._imageProcessingConfiguration.exposure, this._primaryColor);
                }
                this._computePrimaryColors();
            }
            /**
             * Compute the highlights and shadow colors according to their chosen levels.
             */
            _computePrimaryColors() {
                if (this._primaryColorShadowLevel === 0 && this._primaryColorHighlightLevel === 0) {
                    return;
                }
                // Find the highlight color based on the configuration.
                this._primaryColor.scaleToRef(this._primaryColorShadowLevel, this._primaryShadowColor);
                this._primaryColor.subtractToRef(this._primaryShadowColor, this._primaryShadowColor);
                // Find the shadow color based on the configuration.
                this._white.subtractToRef(this._primaryColor, this._primaryHighlightColor);
                this._primaryHighlightColor.scaleToRef(this._primaryColorHighlightLevel, this._primaryHighlightColor);
                this._primaryColor.addToRef(this._primaryHighlightColor, this._primaryHighlightColor);
            }
            /**
             * Build the uniform buffer used in the material.
             */
            buildUniformLayout() {
                // Order is important !
                this._uniformBuffer.addUniform("vPrimaryColor", 4);
                this._uniformBuffer.addUniform("vPrimaryColorShadow", 4);
                this._uniformBuffer.addUniform("vDiffuseInfos", 2);
                this._uniformBuffer.addUniform("diffuseMatrix", 16);
                this._uniformBuffer.addUniform("fFovMultiplier", 1);
                this._uniformBuffer.addUniform("pointSize", 1);
                this._uniformBuffer.addUniform("shadowLevel", 1);
                this._uniformBuffer.addUniform("alpha", 1);
                this._uniformBuffer.addUniform("vBackgroundCenter", 3);
                this._uniformBuffer.addUniform("vReflectionControl", 4);
                this._uniformBuffer.addUniform("projectedGroundInfos", 2);
                PrepareUniformLayoutForIBL(this._uniformBuffer, true, false, false);
                this._uniformBuffer.create();
            }
            /**
             * Unbind the material.
             */
            unbind() {
                if (this._diffuseTexture && this._diffuseTexture.isRenderTarget) {
                    this._uniformBuffer.setTexture("diffuseSampler", null);
                }
                if (this._reflectionTexture && this._reflectionTexture.isRenderTarget) {
                    this._uniformBuffer.setTexture("reflectionSampler", null);
                }
                super.unbind();
            }
            /**
             * Bind only the world matrix to the material.
             * @param world The world matrix to bind.
             */
            bindOnlyWorldMatrix(world) {
                this._activeEffect.setMatrix("world", world);
            }
            /**
             * Bind the material for a dedicated submesh (every used meshes will be considered opaque).
             * @param world The world matrix to bind.
             * @param mesh the mesh to bind for.
             * @param subMesh The submesh to bind for.
             */
            bindForSubMesh(world, mesh, subMesh) {
                const scene = this.getScene();
                const defines = subMesh.materialDefines;
                if (!defines) {
                    return;
                }
                const effect = subMesh.effect;
                if (!effect) {
                    return;
                }
                this._activeEffect = effect;
                // Matrices
                this.bindOnlyWorldMatrix(world);
                // Bones
                BindBonesParameters(mesh, this._activeEffect);
                const mustRebind = this._mustRebind(scene, effect, subMesh, mesh.visibility);
                const needToAlwaysBindUniformBuffers = scene.getEngine()._features.needToAlwaysBindUniformBuffers;
                if (mustRebind) {
                    this._uniformBuffer.bindToEffect(effect, "Material");
                    this.bindViewProjection(effect);
                    const reflectionTexture = this._reflectionTexture;
                    if (!this._uniformBuffer.useUbo || !this.isFrozen || !this._uniformBuffer.isSync || subMesh._drawWrapper._forceRebindOnNextCall) {
                        // Texture uniforms
                        if (scene.texturesEnabled) {
                            if (this._diffuseTexture && MaterialFlags.DiffuseTextureEnabled) {
                                this._uniformBuffer.updateFloat2("vDiffuseInfos", this._diffuseTexture.coordinatesIndex, this._diffuseTexture.level);
                                BindTextureMatrix(this._diffuseTexture, this._uniformBuffer, "diffuse");
                            }
                            BindIBLParameters(scene, defines, this._uniformBuffer, Color3.White(), reflectionTexture, false, true, false, false, false, false, this._reflectionBlur);
                        }
                        if (this.shadowLevel > 0) {
                            this._uniformBuffer.updateFloat("shadowLevel", this.shadowLevel);
                        }
                        this._uniformBuffer.updateFloat("alpha", this.alpha);
                        // Point size
                        if (this.pointsCloud) {
                            this._uniformBuffer.updateFloat("pointSize", this.pointSize);
                        }
                        if (defines.USEHIGHLIGHTANDSHADOWCOLORS) {
                            this._uniformBuffer.updateColor4("vPrimaryColor", this._primaryHighlightColor, 1.0);
                            this._uniformBuffer.updateColor4("vPrimaryColorShadow", this._primaryShadowColor, 1.0);
                        }
                        else {
                            this._uniformBuffer.updateColor4("vPrimaryColor", this._primaryColor, 1.0);
                        }
                    }
                    this._uniformBuffer.updateFloat("fFovMultiplier", this._fovMultiplier);
                    // Fresnel
                    if (defines.REFLECTIONFRESNEL) {
                        this._uniformBuffer.updateFloat4("vReflectionControl", this._reflectionControls.x, this._reflectionControls.y, this._reflectionControls.z, this._reflectionControls.w);
                    }
                    if ((defines.REFLECTIONFRESNEL && defines.REFLECTIONFALLOFF) || defines.OPACITYFRESNEL) {
                        const center = TmpVectors.Vector3[0].copyFrom(this.sceneCenter).subtractInPlace(scene.floatingOriginOffset);
                        this._uniformBuffer.updateFloat3("vBackgroundCenter", center.x, center.y, center.z);
                    }
                    // Textures
                    if (scene.texturesEnabled) {
                        if (this._diffuseTexture && MaterialFlags.DiffuseTextureEnabled) {
                            this._uniformBuffer.setTexture("diffuseSampler", this._diffuseTexture);
                        }
                        if (reflectionTexture && MaterialFlags.ReflectionTextureEnabled) {
                            BindIBLSamplers(scene, defines, this._uniformBuffer, reflectionTexture);
                        }
                        if (defines.PROJECTED_GROUND) {
                            this._uniformBuffer.updateFloat2("projectedGroundInfos", this.projectedGroundRadius, this.projectedGroundHeight);
                        }
                    }
                    // Clip plane
                    BindClipPlane(this._activeEffect, this, scene);
                    scene.bindEyePosition(effect);
                }
                else if (needToAlwaysBindUniformBuffers) {
                    this._uniformBuffer.bindToEffect(effect, "Material");
                    this._needToBindSceneUbo = true;
                }
                if ((mustRebind || !this.isFrozen || needToAlwaysBindUniformBuffers) && scene.lightsEnabled) {
                    BindLights(scene, mesh, this._activeEffect, defines, this._maxSimultaneousLights);
                }
                if (mustRebind || !this.isFrozen) {
                    // View
                    this.bindView(effect);
                    // Fog
                    BindFogParameters(scene, mesh, this._activeEffect, true);
                    // Log. depth
                    if (this._useLogarithmicDepth) {
                        BindLogDepth(defines, effect, scene);
                    }
                    // image processing
                    if (this._imageProcessingConfiguration) {
                        this._imageProcessingConfiguration.bind(this._activeEffect);
                    }
                }
                this._afterBind(mesh, this._activeEffect, subMesh);
                this._uniformBuffer.update();
            }
            /**
             * Checks to see if a texture is used in the material.
             * @param texture - Base texture to use.
             * @returns - Boolean specifying if a texture is used in the material.
             */
            hasTexture(texture) {
                if (super.hasTexture(texture)) {
                    return true;
                }
                if (this._reflectionTexture === texture) {
                    return true;
                }
                if (this._diffuseTexture === texture) {
                    return true;
                }
                return false;
            }
            /**
             * Dispose the material.
             * @param forceDisposeEffect Force disposal of the associated effect.
             * @param forceDisposeTextures Force disposal of the associated textures.
             */
            dispose(forceDisposeEffect = false, forceDisposeTextures = false) {
                if (forceDisposeTextures) {
                    if (this.diffuseTexture) {
                        this.diffuseTexture.dispose();
                    }
                    if (this.reflectionTexture) {
                        this.reflectionTexture.dispose();
                    }
                }
                this._renderTargets.dispose();
                if (this._imageProcessingConfiguration && this._imageProcessingObserver) {
                    this._imageProcessingConfiguration.onUpdateParameters.remove(this._imageProcessingObserver);
                }
                super.dispose(forceDisposeEffect);
            }
            /**
             * Clones the material.
             * @param name The cloned name.
             * @returns The cloned material.
             */
            clone(name) {
                return SerializationHelper.Clone(() => new _a(name, this.getScene()), this);
            }
            /**
             * Serializes the current material to its JSON representation.
             * @returns The JSON representation.
             */
            serialize() {
                const serializationObject = super.serialize();
                serializationObject.customType = "BABYLON.BackgroundMaterial";
                return serializationObject;
            }
            /**
             * Gets the class name of the material
             * @returns "BackgroundMaterial"
             */
            getClassName() {
                return "BackgroundMaterial";
            }
            /**
             * Parse a JSON input to create back a background material.
             * @param source The JSON data to parse
             * @param scene The scene to create the parsed material in
             * @param rootUrl The root url of the assets the material depends upon
             * @returns the instantiated BackgroundMaterial.
             */
            static Parse(source, scene, rootUrl) {
                return SerializationHelper.Parse(() => new _a(source.name, scene), source, scene, rootUrl);
            }
        },
        _BackgroundMaterial_primaryColor_accessor_storage = new WeakMap(),
        _BackgroundMaterial_reflectionTexture_accessor_storage = new WeakMap(),
        _BackgroundMaterial_reflectionBlur_accessor_storage = new WeakMap(),
        _BackgroundMaterial_diffuseTexture_accessor_storage = new WeakMap(),
        _BackgroundMaterial_shadowLights_accessor_storage = new WeakMap(),
        _BackgroundMaterial_shadowLevel_accessor_storage = new WeakMap(),
        _BackgroundMaterial_sceneCenter_accessor_storage = new WeakMap(),
        _BackgroundMaterial_opacityFresnel_accessor_storage = new WeakMap(),
        _BackgroundMaterial_reflectionFresnel_accessor_storage = new WeakMap(),
        _BackgroundMaterial_reflectionFalloffDistance_accessor_storage = new WeakMap(),
        _BackgroundMaterial_reflectionAmount_accessor_storage = new WeakMap(),
        _BackgroundMaterial_reflectionReflectance0_accessor_storage = new WeakMap(),
        _BackgroundMaterial_reflectionReflectance90_accessor_storage = new WeakMap(),
        _BackgroundMaterial_useRGBColor_accessor_storage = new WeakMap(),
        _BackgroundMaterial_enableNoise_accessor_storage = new WeakMap(),
        _BackgroundMaterial_maxSimultaneousLights_accessor_storage = new WeakMap(),
        _BackgroundMaterial_shadowOnly_accessor_storage = new WeakMap(),
        _BackgroundMaterial_enableGroundProjection_accessor_storage = new WeakMap(),
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            __primaryColor_decorators = [serializeAsColor3()];
            _primaryColor_decorators = [expandToProperty("_markAllSubMeshesAsLightsDirty")];
            ___perceptualColor_decorators = [serializeAsColor3()];
            __primaryColorShadowLevel_decorators = [serialize()];
            __primaryColorHighlightLevel_decorators = [serialize()];
            __reflectionTexture_decorators = [serializeAsTexture()];
            _reflectionTexture_decorators = [expandToProperty("_markAllSubMeshesAsTexturesDirty")];
            __reflectionBlur_decorators = [serialize()];
            _reflectionBlur_decorators = [expandToProperty("_markAllSubMeshesAsTexturesDirty")];
            __diffuseTexture_decorators = [serializeAsTexture()];
            _diffuseTexture_decorators = [expandToProperty("_markAllSubMeshesAsTexturesDirty")];
            _shadowLights_decorators = [expandToProperty("_markAllSubMeshesAsTexturesDirty")];
            __shadowLevel_decorators = [serialize()];
            _shadowLevel_decorators = [expandToProperty("_markAllSubMeshesAsTexturesDirty")];
            __sceneCenter_decorators = [serializeAsVector3()];
            _sceneCenter_decorators = [expandToProperty("_markAllSubMeshesAsTexturesDirty")];
            __opacityFresnel_decorators = [serialize()];
            _opacityFresnel_decorators = [expandToProperty("_markAllSubMeshesAsTexturesDirty")];
            __reflectionFresnel_decorators = [serialize()];
            _reflectionFresnel_decorators = [expandToProperty("_markAllSubMeshesAsTexturesDirty")];
            __reflectionFalloffDistance_decorators = [serialize()];
            _reflectionFalloffDistance_decorators = [expandToProperty("_markAllSubMeshesAsTexturesDirty")];
            __reflectionAmount_decorators = [serialize()];
            _reflectionAmount_decorators = [expandToProperty("_markAllSubMeshesAsTexturesDirty")];
            __reflectionReflectance0_decorators = [serialize()];
            _reflectionReflectance0_decorators = [expandToProperty("_markAllSubMeshesAsTexturesDirty")];
            __reflectionReflectance90_decorators = [serialize()];
            _reflectionReflectance90_decorators = [expandToProperty("_markAllSubMeshesAsTexturesDirty")];
            __useRGBColor_decorators = [serialize()];
            _useRGBColor_decorators = [expandToProperty("_markAllSubMeshesAsTexturesDirty")];
            __enableNoise_decorators = [serialize()];
            _enableNoise_decorators = [expandToProperty("_markAllSubMeshesAsTexturesDirty")];
            __maxSimultaneousLights_decorators = [serialize()];
            _maxSimultaneousLights_decorators = [expandToProperty("_markAllSubMeshesAsTexturesDirty")];
            __shadowOnly_decorators = [serialize()];
            _shadowOnly_decorators = [expandToProperty("_markAllSubMeshesAsLightsDirty")];
            _enableGroundProjection_decorators = [serialize(), expandToProperty("_markAllSubMeshesAsMiscDirty")];
            _projectedGroundRadius_decorators = [serialize()];
            _projectedGroundHeight_decorators = [serialize()];
            __esDecorate(_a, null, _primaryColor_decorators, { kind: "accessor", name: "primaryColor", static: false, private: false, access: { has: obj => "primaryColor" in obj, get: obj => obj.primaryColor, set: (obj, value) => { obj.primaryColor = value; } }, metadata: _metadata }, _primaryColor_initializers, _primaryColor_extraInitializers);
            __esDecorate(_a, null, _reflectionTexture_decorators, { kind: "accessor", name: "reflectionTexture", static: false, private: false, access: { has: obj => "reflectionTexture" in obj, get: obj => obj.reflectionTexture, set: (obj, value) => { obj.reflectionTexture = value; } }, metadata: _metadata }, _reflectionTexture_initializers, _reflectionTexture_extraInitializers);
            __esDecorate(_a, null, _reflectionBlur_decorators, { kind: "accessor", name: "reflectionBlur", static: false, private: false, access: { has: obj => "reflectionBlur" in obj, get: obj => obj.reflectionBlur, set: (obj, value) => { obj.reflectionBlur = value; } }, metadata: _metadata }, _reflectionBlur_initializers, _reflectionBlur_extraInitializers);
            __esDecorate(_a, null, _diffuseTexture_decorators, { kind: "accessor", name: "diffuseTexture", static: false, private: false, access: { has: obj => "diffuseTexture" in obj, get: obj => obj.diffuseTexture, set: (obj, value) => { obj.diffuseTexture = value; } }, metadata: _metadata }, _diffuseTexture_initializers, _diffuseTexture_extraInitializers);
            __esDecorate(_a, null, _shadowLights_decorators, { kind: "accessor", name: "shadowLights", static: false, private: false, access: { has: obj => "shadowLights" in obj, get: obj => obj.shadowLights, set: (obj, value) => { obj.shadowLights = value; } }, metadata: _metadata }, _shadowLights_initializers, _shadowLights_extraInitializers);
            __esDecorate(_a, null, _shadowLevel_decorators, { kind: "accessor", name: "shadowLevel", static: false, private: false, access: { has: obj => "shadowLevel" in obj, get: obj => obj.shadowLevel, set: (obj, value) => { obj.shadowLevel = value; } }, metadata: _metadata }, _shadowLevel_initializers, _shadowLevel_extraInitializers);
            __esDecorate(_a, null, _sceneCenter_decorators, { kind: "accessor", name: "sceneCenter", static: false, private: false, access: { has: obj => "sceneCenter" in obj, get: obj => obj.sceneCenter, set: (obj, value) => { obj.sceneCenter = value; } }, metadata: _metadata }, _sceneCenter_initializers, _sceneCenter_extraInitializers);
            __esDecorate(_a, null, _opacityFresnel_decorators, { kind: "accessor", name: "opacityFresnel", static: false, private: false, access: { has: obj => "opacityFresnel" in obj, get: obj => obj.opacityFresnel, set: (obj, value) => { obj.opacityFresnel = value; } }, metadata: _metadata }, _opacityFresnel_initializers, _opacityFresnel_extraInitializers);
            __esDecorate(_a, null, _reflectionFresnel_decorators, { kind: "accessor", name: "reflectionFresnel", static: false, private: false, access: { has: obj => "reflectionFresnel" in obj, get: obj => obj.reflectionFresnel, set: (obj, value) => { obj.reflectionFresnel = value; } }, metadata: _metadata }, _reflectionFresnel_initializers, _reflectionFresnel_extraInitializers);
            __esDecorate(_a, null, _reflectionFalloffDistance_decorators, { kind: "accessor", name: "reflectionFalloffDistance", static: false, private: false, access: { has: obj => "reflectionFalloffDistance" in obj, get: obj => obj.reflectionFalloffDistance, set: (obj, value) => { obj.reflectionFalloffDistance = value; } }, metadata: _metadata }, _reflectionFalloffDistance_initializers, _reflectionFalloffDistance_extraInitializers);
            __esDecorate(_a, null, _reflectionAmount_decorators, { kind: "accessor", name: "reflectionAmount", static: false, private: false, access: { has: obj => "reflectionAmount" in obj, get: obj => obj.reflectionAmount, set: (obj, value) => { obj.reflectionAmount = value; } }, metadata: _metadata }, _reflectionAmount_initializers, _reflectionAmount_extraInitializers);
            __esDecorate(_a, null, _reflectionReflectance0_decorators, { kind: "accessor", name: "reflectionReflectance0", static: false, private: false, access: { has: obj => "reflectionReflectance0" in obj, get: obj => obj.reflectionReflectance0, set: (obj, value) => { obj.reflectionReflectance0 = value; } }, metadata: _metadata }, _reflectionReflectance0_initializers, _reflectionReflectance0_extraInitializers);
            __esDecorate(_a, null, _reflectionReflectance90_decorators, { kind: "accessor", name: "reflectionReflectance90", static: false, private: false, access: { has: obj => "reflectionReflectance90" in obj, get: obj => obj.reflectionReflectance90, set: (obj, value) => { obj.reflectionReflectance90 = value; } }, metadata: _metadata }, _reflectionReflectance90_initializers, _reflectionReflectance90_extraInitializers);
            __esDecorate(_a, null, _useRGBColor_decorators, { kind: "accessor", name: "useRGBColor", static: false, private: false, access: { has: obj => "useRGBColor" in obj, get: obj => obj.useRGBColor, set: (obj, value) => { obj.useRGBColor = value; } }, metadata: _metadata }, _useRGBColor_initializers, _useRGBColor_extraInitializers);
            __esDecorate(_a, null, _enableNoise_decorators, { kind: "accessor", name: "enableNoise", static: false, private: false, access: { has: obj => "enableNoise" in obj, get: obj => obj.enableNoise, set: (obj, value) => { obj.enableNoise = value; } }, metadata: _metadata }, _enableNoise_initializers, _enableNoise_extraInitializers);
            __esDecorate(_a, null, _maxSimultaneousLights_decorators, { kind: "accessor", name: "maxSimultaneousLights", static: false, private: false, access: { has: obj => "maxSimultaneousLights" in obj, get: obj => obj.maxSimultaneousLights, set: (obj, value) => { obj.maxSimultaneousLights = value; } }, metadata: _metadata }, _maxSimultaneousLights_initializers, _maxSimultaneousLights_extraInitializers);
            __esDecorate(_a, null, _shadowOnly_decorators, { kind: "accessor", name: "shadowOnly", static: false, private: false, access: { has: obj => "shadowOnly" in obj, get: obj => obj.shadowOnly, set: (obj, value) => { obj.shadowOnly = value; } }, metadata: _metadata }, _shadowOnly_initializers, _shadowOnly_extraInitializers);
            __esDecorate(_a, null, _enableGroundProjection_decorators, { kind: "accessor", name: "enableGroundProjection", static: false, private: false, access: { has: obj => "enableGroundProjection" in obj, get: obj => obj.enableGroundProjection, set: (obj, value) => { obj.enableGroundProjection = value; } }, metadata: _metadata }, _enableGroundProjection_initializers, _enableGroundProjection_extraInitializers);
            __esDecorate(null, null, __primaryColor_decorators, { kind: "field", name: "_primaryColor", static: false, private: false, access: { has: obj => "_primaryColor" in obj, get: obj => obj._primaryColor, set: (obj, value) => { obj._primaryColor = value; } }, metadata: _metadata }, __primaryColor_initializers, __primaryColor_extraInitializers);
            __esDecorate(null, null, ___perceptualColor_decorators, { kind: "field", name: "__perceptualColor", static: false, private: false, access: { has: obj => "__perceptualColor" in obj, get: obj => obj.__perceptualColor, set: (obj, value) => { obj.__perceptualColor = value; } }, metadata: _metadata }, ___perceptualColor_initializers, ___perceptualColor_extraInitializers);
            __esDecorate(null, null, __primaryColorShadowLevel_decorators, { kind: "field", name: "_primaryColorShadowLevel", static: false, private: false, access: { has: obj => "_primaryColorShadowLevel" in obj, get: obj => obj._primaryColorShadowLevel, set: (obj, value) => { obj._primaryColorShadowLevel = value; } }, metadata: _metadata }, __primaryColorShadowLevel_initializers, __primaryColorShadowLevel_extraInitializers);
            __esDecorate(null, null, __primaryColorHighlightLevel_decorators, { kind: "field", name: "_primaryColorHighlightLevel", static: false, private: false, access: { has: obj => "_primaryColorHighlightLevel" in obj, get: obj => obj._primaryColorHighlightLevel, set: (obj, value) => { obj._primaryColorHighlightLevel = value; } }, metadata: _metadata }, __primaryColorHighlightLevel_initializers, __primaryColorHighlightLevel_extraInitializers);
            __esDecorate(null, null, __reflectionTexture_decorators, { kind: "field", name: "_reflectionTexture", static: false, private: false, access: { has: obj => "_reflectionTexture" in obj, get: obj => obj._reflectionTexture, set: (obj, value) => { obj._reflectionTexture = value; } }, metadata: _metadata }, __reflectionTexture_initializers, __reflectionTexture_extraInitializers);
            __esDecorate(null, null, __reflectionBlur_decorators, { kind: "field", name: "_reflectionBlur", static: false, private: false, access: { has: obj => "_reflectionBlur" in obj, get: obj => obj._reflectionBlur, set: (obj, value) => { obj._reflectionBlur = value; } }, metadata: _metadata }, __reflectionBlur_initializers, __reflectionBlur_extraInitializers);
            __esDecorate(null, null, __diffuseTexture_decorators, { kind: "field", name: "_diffuseTexture", static: false, private: false, access: { has: obj => "_diffuseTexture" in obj, get: obj => obj._diffuseTexture, set: (obj, value) => { obj._diffuseTexture = value; } }, metadata: _metadata }, __diffuseTexture_initializers, __diffuseTexture_extraInitializers);
            __esDecorate(null, null, __shadowLevel_decorators, { kind: "field", name: "_shadowLevel", static: false, private: false, access: { has: obj => "_shadowLevel" in obj, get: obj => obj._shadowLevel, set: (obj, value) => { obj._shadowLevel = value; } }, metadata: _metadata }, __shadowLevel_initializers, __shadowLevel_extraInitializers);
            __esDecorate(null, null, __sceneCenter_decorators, { kind: "field", name: "_sceneCenter", static: false, private: false, access: { has: obj => "_sceneCenter" in obj, get: obj => obj._sceneCenter, set: (obj, value) => { obj._sceneCenter = value; } }, metadata: _metadata }, __sceneCenter_initializers, __sceneCenter_extraInitializers);
            __esDecorate(null, null, __opacityFresnel_decorators, { kind: "field", name: "_opacityFresnel", static: false, private: false, access: { has: obj => "_opacityFresnel" in obj, get: obj => obj._opacityFresnel, set: (obj, value) => { obj._opacityFresnel = value; } }, metadata: _metadata }, __opacityFresnel_initializers, __opacityFresnel_extraInitializers);
            __esDecorate(null, null, __reflectionFresnel_decorators, { kind: "field", name: "_reflectionFresnel", static: false, private: false, access: { has: obj => "_reflectionFresnel" in obj, get: obj => obj._reflectionFresnel, set: (obj, value) => { obj._reflectionFresnel = value; } }, metadata: _metadata }, __reflectionFresnel_initializers, __reflectionFresnel_extraInitializers);
            __esDecorate(null, null, __reflectionFalloffDistance_decorators, { kind: "field", name: "_reflectionFalloffDistance", static: false, private: false, access: { has: obj => "_reflectionFalloffDistance" in obj, get: obj => obj._reflectionFalloffDistance, set: (obj, value) => { obj._reflectionFalloffDistance = value; } }, metadata: _metadata }, __reflectionFalloffDistance_initializers, __reflectionFalloffDistance_extraInitializers);
            __esDecorate(null, null, __reflectionAmount_decorators, { kind: "field", name: "_reflectionAmount", static: false, private: false, access: { has: obj => "_reflectionAmount" in obj, get: obj => obj._reflectionAmount, set: (obj, value) => { obj._reflectionAmount = value; } }, metadata: _metadata }, __reflectionAmount_initializers, __reflectionAmount_extraInitializers);
            __esDecorate(null, null, __reflectionReflectance0_decorators, { kind: "field", name: "_reflectionReflectance0", static: false, private: false, access: { has: obj => "_reflectionReflectance0" in obj, get: obj => obj._reflectionReflectance0, set: (obj, value) => { obj._reflectionReflectance0 = value; } }, metadata: _metadata }, __reflectionReflectance0_initializers, __reflectionReflectance0_extraInitializers);
            __esDecorate(null, null, __reflectionReflectance90_decorators, { kind: "field", name: "_reflectionReflectance90", static: false, private: false, access: { has: obj => "_reflectionReflectance90" in obj, get: obj => obj._reflectionReflectance90, set: (obj, value) => { obj._reflectionReflectance90 = value; } }, metadata: _metadata }, __reflectionReflectance90_initializers, __reflectionReflectance90_extraInitializers);
            __esDecorate(null, null, __useRGBColor_decorators, { kind: "field", name: "_useRGBColor", static: false, private: false, access: { has: obj => "_useRGBColor" in obj, get: obj => obj._useRGBColor, set: (obj, value) => { obj._useRGBColor = value; } }, metadata: _metadata }, __useRGBColor_initializers, __useRGBColor_extraInitializers);
            __esDecorate(null, null, __enableNoise_decorators, { kind: "field", name: "_enableNoise", static: false, private: false, access: { has: obj => "_enableNoise" in obj, get: obj => obj._enableNoise, set: (obj, value) => { obj._enableNoise = value; } }, metadata: _metadata }, __enableNoise_initializers, __enableNoise_extraInitializers);
            __esDecorate(null, null, __maxSimultaneousLights_decorators, { kind: "field", name: "_maxSimultaneousLights", static: false, private: false, access: { has: obj => "_maxSimultaneousLights" in obj, get: obj => obj._maxSimultaneousLights, set: (obj, value) => { obj._maxSimultaneousLights = value; } }, metadata: _metadata }, __maxSimultaneousLights_initializers, __maxSimultaneousLights_extraInitializers);
            __esDecorate(null, null, __shadowOnly_decorators, { kind: "field", name: "_shadowOnly", static: false, private: false, access: { has: obj => "_shadowOnly" in obj, get: obj => obj._shadowOnly, set: (obj, value) => { obj._shadowOnly = value; } }, metadata: _metadata }, __shadowOnly_initializers, __shadowOnly_extraInitializers);
            __esDecorate(null, null, _projectedGroundRadius_decorators, { kind: "field", name: "projectedGroundRadius", static: false, private: false, access: { has: obj => "projectedGroundRadius" in obj, get: obj => obj.projectedGroundRadius, set: (obj, value) => { obj.projectedGroundRadius = value; } }, metadata: _metadata }, _projectedGroundRadius_initializers, _projectedGroundRadius_extraInitializers);
            __esDecorate(null, null, _projectedGroundHeight_decorators, { kind: "field", name: "projectedGroundHeight", static: false, private: false, access: { has: obj => "projectedGroundHeight" in obj, get: obj => obj.projectedGroundHeight, set: (obj, value) => { obj.projectedGroundHeight = value; } }, metadata: _metadata }, _projectedGroundHeight_initializers, _projectedGroundHeight_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        /**
         * Standard reflectance value at parallel view angle.
         */
        _a.StandardReflectance0 = 0.05,
        /**
         * Standard reflectance value at grazing angle.
         */
        _a.StandardReflectance90 = 0.5,
        _a._ShaderLoader = new _ShaderImportLoader(() => [import("../../Shaders/background.vertex.js"), import("../../Shaders/background.fragment.js")], () => [import("../../ShadersWGSL/background.vertex.js"), import("../../ShadersWGSL/background.fragment.js")]),
        _a;
})();
export { BackgroundMaterial };
let _Registered = false;
/**
 * Register side effects for backgroundMaterial.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterBackgroundMaterial() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    // BackgroundMaterial serializes its image processing configuration, so the parser must be registered for clone/parse to work.
    RegisterImageProcessingConfiguration();
    RegisterClass("BABYLON.BackgroundMaterial", BackgroundMaterial);
}
//# sourceMappingURL=backgroundMaterial.pure.js.map