/** This file must only contain pure code and pure imports */
import { type Nullable } from "../../types.js";
import { type Scene } from "../../scene.pure.js";
import { Color3 } from "../../Maths/math.color.pure.js";
import { ImageProcessingConfiguration } from "../imageProcessingConfiguration.pure.js";
import { type BaseTexture } from "../../Materials/Textures/baseTexture.pure.js";
import { type ThinTexture } from "../../Materials/Textures/thinTexture.js";
import { Material } from "../material.pure.js";
import { type Engine } from "../../Engines/engine.pure.js";
import { type AbstractMesh } from "../../Meshes/abstractMesh.pure.js";
import { MaterialDefines } from "../materialDefines.js";
import { PrePassConfiguration } from "../prePassConfiguration.js";
import { type IMaterialCompilationOptions } from "../../Materials/material.pure.js";
import { type SubMesh } from "../../Meshes/subMesh.pure.js";
import { Vector2, type Matrix } from "../../Maths/math.vector.pure.js";
import { type Mesh } from "../../Meshes/mesh.pure.js";
import { PushMaterial } from "../pushMaterial.js";
import { type IAnimatable } from "../../Animations/animatable.interface.js";
import { type UniformBuffer } from "../../Materials/uniformBuffer.js";
declare const OpenPBRMaterialDefinesBase_base: {
    new (...args: any[]): {
        PREPASS: boolean;
        PREPASS_COLOR: boolean;
        PREPASS_COLOR_INDEX: number;
        PREPASS_IRRADIANCE_LEGACY: boolean;
        PREPASS_IRRADIANCE_LEGACY_INDEX: number;
        PREPASS_IRRADIANCE: boolean;
        PREPASS_IRRADIANCE_INDEX: number;
        PREPASS_ALBEDO: boolean;
        PREPASS_ALBEDO_INDEX: number;
        PREPASS_ALBEDO_SQRT: boolean;
        PREPASS_ALBEDO_SQRT_INDEX: number;
        PREPASS_DEPTH: boolean;
        PREPASS_DEPTH_INDEX: number;
        PREPASS_SCREENSPACE_DEPTH: boolean;
        PREPASS_SCREENSPACE_DEPTH_INDEX: number;
        PREPASS_NORMALIZED_VIEW_DEPTH: boolean;
        PREPASS_NORMALIZED_VIEW_DEPTH_INDEX: number;
        PREPASS_NORMAL: boolean;
        PREPASS_NORMAL_INDEX: number;
        PREPASS_NORMAL_WORLDSPACE: boolean;
        PREPASS_WORLD_NORMAL: boolean;
        PREPASS_WORLD_NORMAL_INDEX: number;
        PREPASS_POSITION: boolean;
        PREPASS_POSITION_INDEX: number;
        PREPASS_LOCAL_POSITION: boolean;
        PREPASS_LOCAL_POSITION_INDEX: number;
        PREPASS_VELOCITY: boolean;
        PREPASS_VELOCITY_INDEX: number;
        PREPASS_VELOCITY_LINEAR: boolean;
        PREPASS_VELOCITY_LINEAR_INDEX: number;
        PREPASS_REFLECTIVITY: boolean;
        PREPASS_REFLECTIVITY_INDEX: number;
        SCENE_MRT_COUNT: number;
    };
} & {
    new (...args: any[]): {
        MAINUV1: boolean;
        MAINUV2: boolean;
        MAINUV3: boolean;
        MAINUV4: boolean;
        MAINUV5: boolean;
        MAINUV6: boolean;
        UV1: boolean;
        UV2: boolean;
        UV3: boolean;
        UV4: boolean;
        UV5: boolean;
        UV6: boolean;
    };
} & typeof MaterialDefines;
declare class OpenPBRMaterialDefinesBase extends OpenPBRMaterialDefinesBase_base {
}
declare const OpenPBRMaterialDefinesWithEnvLighting_base: {
    new (...args: any[]): {
        REFLECTION: boolean;
        REFLECTIONMAP_3D: boolean;
        REFLECTIONMAP_SPHERICAL: boolean;
        REFLECTIONMAP_PLANAR: boolean;
        REFLECTIONMAP_CUBIC: boolean;
        USE_LOCAL_REFLECTIONMAP_CUBIC: boolean;
        REFLECTIONMAP_PROJECTION: boolean;
        REFLECTIONMAP_SKYBOX: boolean;
        REFLECTIONMAP_EXPLICIT: boolean;
        REFLECTIONMAP_EQUIRECTANGULAR: boolean;
        REFLECTIONMAP_EQUIRECTANGULAR_FIXED: boolean;
        REFLECTIONMAP_MIRROREDEQUIRECTANGULAR_FIXED: boolean;
        INVERTCUBICMAP: boolean;
        USESPHERICALFROMREFLECTIONMAP: boolean;
        USEIRRADIANCEMAP: boolean;
        USE_IRRADIANCE_DOMINANT_DIRECTION: boolean;
        USESPHERICALINVERTEX: boolean;
        REFLECTIONMAP_OPPOSITEZ: boolean;
        LODINREFLECTIONALPHA: boolean;
        GAMMAREFLECTION: boolean;
        RGBDREFLECTION: boolean;
    };
} & typeof OpenPBRMaterialDefinesBase;
declare class OpenPBRMaterialDefinesWithEnvLighting extends OpenPBRMaterialDefinesWithEnvLighting_base {
}
declare const OpenPBRMaterialDefines_base: {
    new (...args: any[]): {
        IMAGEPROCESSING: boolean;
        WHITEBALANCE: boolean;
        VIGNETTE: boolean;
        VIGNETTEBLENDMODEMULTIPLY: boolean;
        VIGNETTEBLENDMODEOPAQUE: boolean;
        TONEMAPPING: number;
        CONTRAST: boolean;
        COLORCURVES: boolean;
        COLORGRADING: boolean;
        COLORGRADING3D: boolean;
        SAMPLER3DGREENDEPTH: boolean;
        SAMPLER3DBGRMAP: boolean;
        DITHER: boolean;
        IMAGEPROCESSINGPOSTPROCESS: boolean;
        SKIPFINALCOLORCLAMP: boolean;
        EXPOSURE: boolean;
    };
} & typeof OpenPBRMaterialDefinesWithEnvLighting;
/**
 * Manages the defines for the PBR Material.
 * @internal
 */
export declare class OpenPBRMaterialDefines extends OpenPBRMaterialDefines_base {
    NUM_SAMPLES: string;
    REALTIME_FILTERING: boolean;
    IBL_CDF_FILTERING: boolean;
    LIGHTCOUNT: number;
    VERTEXCOLOR: boolean;
    BAKED_VERTEX_ANIMATION_TEXTURE: boolean;
    VERTEXALPHA: boolean;
    ALPHATEST: boolean;
    DEPTHPREPASS: boolean;
    ALPHABLEND: boolean;
    ALPHA_FROM_BASE_COLOR_TEXTURE: boolean;
    ALPHATESTVALUE: string;
    PREMULTIPLYALPHA: boolean;
    REFLECTIVITY_GAMMA: boolean;
    REFLECTIVITYDIRECTUV: number;
    SPECULARTERM: boolean;
    LODBASEDMICROSFURACE: boolean;
    SPECULAR_ROUGHNESS_FROM_METALNESS_TEXTURE_GREEN: boolean;
    BASE_METALNESS_FROM_METALNESS_TEXTURE_BLUE: boolean;
    AOSTOREINMETALMAPRED: boolean;
    SPECULAR_WEIGHT_IN_ALPHA: boolean;
    SPECULAR_WEIGHT_FROM_SPECULAR_COLOR_TEXTURE: boolean;
    SPECULAR_ROUGHNESS_ANISOTROPY_FROM_TANGENT_TEXTURE: boolean;
    COAT_ROUGHNESS_FROM_GREEN_CHANNEL: boolean;
    COAT_ROUGHNESS_ANISOTROPY_FROM_TANGENT_TEXTURE: boolean;
    USE_GLTF_STYLE_ANISOTROPY: boolean;
    THIN_FILM_THICKNESS_FROM_THIN_FILM_TEXTURE: boolean;
    FUZZ_ROUGHNESS_FROM_TEXTURE_ALPHA: boolean;
    SUBSURFACE_WEIGHT_FROM_TEXTURE_ALPHA: boolean;
    GEOMETRY_THICKNESS_FROM_GREEN_CHANNEL: boolean;
    ENVIRONMENTBRDF: boolean;
    ENVIRONMENTBRDF_RGBD: boolean;
    FUZZENVIRONMENTBRDF: boolean;
    NORMAL: boolean;
    TANGENT: boolean;
    OBJECTSPACE_NORMALMAP: boolean;
    PARALLAX: boolean;
    PARALLAX_RHS: boolean;
    PARALLAXOCCLUSION: boolean;
    NORMALXYSCALE: boolean;
    /**
     * Enables anisotropic logic. Still needed because it's used in pbrHelperFunctions
     */
    ANISOTROPIC: boolean;
    /**
     * Tells the shader to use OpenPBR's anisotropic roughness remapping
     */
    ANISOTROPIC_OPENPBR: boolean;
    /**
     * Tells the shader to apply anisotropy to the base layer
     */
    ANISOTROPIC_BASE: boolean;
    /**
     * Tells the shader to apply anisotropy to the coat layer
     */
    ANISOTROPIC_COAT: boolean;
    /**
     * Number of samples to use for the fuzz IBL lighting calculations
     */
    FUZZ_IBL_SAMPLES: number;
    /**
     * Enables the 4-tap rotated-grid kernel for refractive background blur.
     * When false, a single dithered sample is used instead.
     */
    REFRACTION_HIGH_QUALITY_BLUR: boolean;
    /**
     * Tells the shader to enable the fuzz layer
     */
    FUZZ: boolean;
    /**
     * Tells the shader to enable the thin film layer
     */
    THIN_FILM: boolean;
    /**
     * Tells the shader to enable the legacy iridescence code
     * Iridescence is the name of thin film interference in the PBR material.
     */
    IRIDESCENCE: boolean;
    /**
     * Tells the shader to enable dispersion in refraction
     */
    DISPERSION: boolean;
    /**
     * Enables subsurface scattering
     */
    SCATTERING: boolean;
    /**
     * Enables the use of screen-space irradiance texture for scattering
     */
    USE_IRRADIANCE_TEXTURE_FOR_SCATTERING: boolean;
    /**
     * Number of samples used by the screen-space SSS convolution kernel.
     */
    SSS_SAMPLE_COUNT: number;
    /**
     * Indicates that the irradiance texture is from the legacy GeometryBufferRenderer.
     * We use this to handle direct lights which don't render in the legacy GBuffer irradiance.
     */
    USE_IRRADIANCE_TEXTURE_FOR_SCATTERING_GBUFFER: boolean;
    /**
     * Enables transmission slab
     */
    TRANSMISSION_SLAB: boolean;
    /**
     * Enables transmission slab with volume
     */
    TRANSMISSION_SLAB_VOLUME: boolean;
    /**
     * Enables subsurface slab
     */
    SUBSURFACE_SLAB: boolean;
    /**
     * Enables thin-walled geometry
     */
    GEOMETRY_THIN_WALLED: boolean;
    /**
     * Refraction of the 2D background texture. Might include the rest of the scene or just the background.
     */
    REFRACTED_BACKGROUND: boolean;
    /**
     * Refraction of direct lights.
     */
    REFRACTED_LIGHTS: boolean;
    /**
     * Refraction of the environment texture (IBL).
     */
    REFRACTED_ENVIRONMENT: boolean;
    REFRACTED_ENVIRONMENT_OPPOSITEZ: boolean;
    REFRACTED_ENVIRONMENT_LOCAL_CUBE: boolean;
    RADIANCEOCCLUSION: boolean;
    HORIZONOCCLUSION: boolean;
    INSTANCES: boolean;
    THIN_INSTANCES: boolean;
    INSTANCESCOLOR: boolean;
    NUM_BONE_INFLUENCERS: number;
    BonesPerMesh: number;
    BONETEXTURE: boolean;
    BONES_VELOCITY_ENABLED: boolean;
    NONUNIFORMSCALING: boolean;
    MORPHTARGETS: boolean;
    MORPHTARGETS_POSITION: boolean;
    MORPHTARGETS_NORMAL: boolean;
    MORPHTARGETS_TANGENT: boolean;
    MORPHTARGETS_UV: boolean;
    MORPHTARGETS_UV2: boolean;
    MORPHTARGETS_COLOR: boolean;
    MORPHTARGETTEXTURE_HASPOSITIONS: boolean;
    MORPHTARGETTEXTURE_HASNORMALS: boolean;
    MORPHTARGETTEXTURE_HASTANGENTS: boolean;
    MORPHTARGETTEXTURE_HASUVS: boolean;
    MORPHTARGETTEXTURE_HASUV2S: boolean;
    MORPHTARGETTEXTURE_HASCOLORS: boolean;
    NUM_MORPH_INFLUENCERS: number;
    MORPHTARGETS_TEXTURE: boolean;
    USEPHYSICALLIGHTFALLOFF: boolean;
    USEGLTFLIGHTFALLOFF: boolean;
    TWOSIDEDLIGHTING: boolean;
    MIRRORED: boolean;
    SHADOWFLOAT: boolean;
    CLIPPLANE: boolean;
    CLIPPLANE2: boolean;
    CLIPPLANE3: boolean;
    CLIPPLANE4: boolean;
    CLIPPLANE5: boolean;
    CLIPPLANE6: boolean;
    POINTSIZE: boolean;
    FOG: boolean;
    LOGARITHMICDEPTH: boolean;
    CAMERA_ORTHOGRAPHIC: boolean;
    CAMERA_PERSPECTIVE: boolean;
    AREALIGHTSUPPORTED: boolean;
    FORCENORMALFORWARD: boolean;
    SPECULARAA: boolean;
    UNLIT: boolean;
    DECAL_AFTER_DETAIL: boolean;
    TEXTURE_REPETITION_MODE: number;
    DEBUGMODE: number;
    USE_VERTEX_PULLING: boolean;
    VERTEX_PULLING_USE_INDEX_BUFFER: boolean;
    VERTEX_PULLING_INDEX_BUFFER_32BITS: boolean;
    RIGHT_HANDED: boolean;
    CLUSTLIGHT_SLICES: number;
    CLUSTLIGHT_BATCH: number;
    BRDF_V_HEIGHT_CORRELATED: boolean;
    MS_BRDF_ENERGY_CONSERVATION: boolean;
    SPHERICAL_HARMONICS: boolean;
    SPECULAR_GLOSSINESS_ENERGY_CONSERVATION: boolean;
    MIX_IBL_RADIANCE_WITH_IRRADIANCE: boolean;
    LEGACY_SPECULAR_ENERGY_CONSERVATION: boolean;
    BASE_DIFFUSE_MODEL: number;
    DIELECTRIC_SPECULAR_MODEL: number;
    CONDUCTOR_SPECULAR_MODEL: number;
    /**
     * Initializes the PBR Material defines.
     * @param externalProperties The external properties
     */
    constructor(externalProperties?: {
        [name: string]: {
            type: string;
            default: any;
        };
    });
    /**
     * Resets the PBR Material defines.
     */
    reset(): void;
}
declare const OpenPBRMaterialBase_base: {
    new (...args: any[]): {
        _imageProcessingConfiguration: ImageProcessingConfiguration;
        get imageProcessingConfiguration(): ImageProcessingConfiguration;
        set imageProcessingConfiguration(value: ImageProcessingConfiguration);
        _imageProcessingObserver: Nullable<import("../../index.js").Observer<ImageProcessingConfiguration>>;
        _attachImageProcessingConfiguration(configuration: Nullable<ImageProcessingConfiguration>): void;
        get cameraColorCurvesEnabled(): boolean;
        set cameraColorCurvesEnabled(value: boolean);
        get cameraColorGradingEnabled(): boolean;
        set cameraColorGradingEnabled(value: boolean);
        get cameraToneMappingEnabled(): boolean;
        set cameraToneMappingEnabled(value: boolean);
        get cameraExposure(): number;
        set cameraExposure(value: number);
        get cameraContrast(): number;
        set cameraContrast(value: number);
        get cameraColorGradingTexture(): Nullable<BaseTexture>;
        set cameraColorGradingTexture(value: Nullable<BaseTexture>);
        get cameraColorCurves(): Nullable<import("../index.js").ColorCurves>;
        set cameraColorCurves(value: Nullable<import("../index.js").ColorCurves>);
    };
} & typeof PushMaterial;
declare class OpenPBRMaterialBase extends OpenPBRMaterialBase_base {
}
/**
 * A Physically based material that follows the specification of OpenPBR.
 *
 * For more information, please refer to the documentation :
 * https://academysoftwarefoundation.github.io/OpenPBR/index.html
 */
export declare class OpenPBRMaterial extends OpenPBRMaterialBase {
    /**
     * Base Weight is a multiplier on the diffuse and metal lobes.
     * See OpenPBR's specs for base_weight
     */
    accessor baseWeight: number;
    private _baseWeight;
    /**
     * Base Weight is a multiplier on the diffuse and metal lobes.
     * See OpenPBR's specs for base_weight
     */
    accessor baseWeightTexture: Nullable<BaseTexture>;
    private _baseWeightTexture;
    /**
     * Color of the base diffuse lobe.
     * See OpenPBR's specs for base_color
     */
    accessor baseColor: Color3;
    private _baseColor;
    /**
     * Base Color Texture property.
     * See OpenPBR's specs for base_color
     */
    accessor baseColorTexture: Nullable<BaseTexture>;
    private _baseColorTexture;
    /**
     * Roughness of the diffuse lobe.
     * See OpenPBR's specs for base_diffuse_roughness
     */
    accessor baseDiffuseRoughness: number;
    private _baseDiffuseRoughness;
    /**
     * Roughness texture of the diffuse lobe.
     * See OpenPBR's specs for base_diffuse_roughness
     */
    accessor baseDiffuseRoughnessTexture: Nullable<BaseTexture>;
    private _baseDiffuseRoughnessTexture;
    /**
     * Metalness of the base lobe.
     * See OpenPBR's specs for base_metalness
     */
    accessor baseMetalness: number;
    private _baseMetalness;
    /**
     * Metalness texture.
     * See OpenPBR's specs for base_metalness
     */
    accessor baseMetalnessTexture: Nullable<BaseTexture>;
    private _baseMetalnessTexture;
    /**
     * Weight of the specular lobe.
     * See OpenPBR's specs for specular_weight
     */
    accessor specularWeight: number;
    private _specularWeight;
    /**
     * Weight texture of the specular lobe.
     * See OpenPBR's specs for specular_weight
     */
    accessor specularWeightTexture: Nullable<BaseTexture>;
    private _specularWeightTexture;
    /**
     * Color of the specular lobe.
     * See OpenPBR's specs for specular_color
     */
    accessor specularColor: Color3;
    private _specularColor;
    /**
     * Specular Color Texture property.
     * See OpenPBR's specs for specular_color
     */
    accessor specularColorTexture: Nullable<BaseTexture>;
    private _specularColorTexture;
    /**
     * Roughness of the specular lobe.
     * See OpenPBR's specs for specular_roughness
     */
    accessor specularRoughness: number;
    private _specularRoughness;
    /**
     * Roughness texture of the specular lobe.
     * See OpenPBR's specs for specular_roughness
     */
    accessor specularRoughnessTexture: Nullable<BaseTexture>;
    private _specularRoughnessTexture;
    /**
     * Anisotropic roughness of the specular lobe.
     * See OpenPBR's specs for specular_roughness_anisotropy
     */
    accessor specularRoughnessAnisotropy: number;
    private _specularRoughnessAnisotropy;
    /**
     * Anisotropic Roughness texture.
     * See OpenPBR's specs for specular_roughness
     */
    accessor specularRoughnessAnisotropyTexture: Nullable<BaseTexture>;
    private _specularRoughnessAnisotropyTexture;
    /**
     * IOR of the specular lobe.
     * See OpenPBR's specs for specular_ior
     */
    accessor specularIor: number;
    private _specularIor;
    /**
     * Transmission weight of the surface.
     * See OpenPBR's specs for transmission_weight
     */
    accessor transmissionWeight: number;
    private _transmissionWeight;
    /**
     * Transmission weight texture.
     * See OpenPBR's specs for transmission_weight
     */
    accessor transmissionWeightTexture: Nullable<BaseTexture>;
    private _transmissionWeightTexture;
    /**
     * Transmission color of the surface.
     * See OpenPBR's specs for transmission_color
     */
    accessor transmissionColor: Color3;
    private _transmissionColor;
    /**
     * Transmission color texture.
     * See OpenPBR's specs for transmission_color
     */
    accessor transmissionColorTexture: Nullable<BaseTexture>;
    private _transmissionColorTexture;
    /**
     * Transmission depth of the volume
     * See OpenPBR's specs for transmission_depth
     */
    accessor transmissionDepth: number;
    private _transmissionDepth;
    /**
     * Transmission depth texture.
     * See OpenPBR's specs for transmission_depth
     */
    accessor transmissionDepthTexture: Nullable<BaseTexture>;
    private _transmissionDepthTexture;
    /**
     * Transmission scatter of the surface.
     * See OpenPBR's specs for transmission_scatter
     */
    accessor transmissionScatter: Color3;
    private _transmissionScatter;
    /**
     * Transmission scatter texture.
     * See OpenPBR's specs for transmission_scatter
     */
    accessor transmissionScatterTexture: Nullable<BaseTexture>;
    private _transmissionScatterTexture;
    /**
     * Transmission scatter anisotropy
     * See OpenPBR's specs for transmission_scatter_anisotropy
     */
    accessor transmissionScatterAnisotropy: number;
    private _transmissionScatterAnisotropy;
    /**
     * Transmission Dispersion Scale factor.
     * See OpenPBR's specs for transmission_dispersion_scale
     */
    accessor transmissionDispersionScale: number;
    private _transmissionDispersionScale;
    /**
     * Transmission Dispersion Scale texture.
     * See OpenPBR's specs for transmission_dispersion_scale
     */
    accessor transmissionDispersionScaleTexture: Nullable<BaseTexture>;
    private _transmissionDispersionScaleTexture;
    /**
     * Transmission Dispersion Abbe number.
     * See OpenPBR's specs for transmission_dispersion_abbe_number
     */
    accessor transmissionDispersionAbbeNumber: number;
    private _transmissionDispersionAbbeNumber;
    /**
     * Defines the amount of subsurface scattering on the surface.
     * See OpenPBR's specs for subsurface_weight
     */
    accessor subsurfaceWeight: number;
    private _subsurfaceWeight;
    /**
     * Subsurface weight texture.
     * See OpenPBR's specs for subsurface_weight
     */
    accessor subsurfaceWeightTexture: Nullable<BaseTexture>;
    private _subsurfaceWeightTexture;
    /**
     * Defines the color of the subsurface scattering in the volume.
     * See OpenPBR's specs for subsurface_color
     */
    accessor subsurfaceColor: Color3;
    private _subsurfaceColor;
    /**
     * Subsurface color texture.
     * See OpenPBR's specs for subsurface_color
     */
    accessor subsurfaceColorTexture: Nullable<BaseTexture>;
    private _subsurfaceColorTexture;
    /**
     * Defines the radius of the subsurface scattering in the volume.
     * See OpenPBR's specs for subsurface_radius
     */
    accessor subsurfaceRadius: number;
    private _subsurfaceRadius;
    /**
     * Defines the scale factor applied to the subsurface radius.
     * See OpenPBR's specs for subsurface_radius_scale
     */
    accessor subsurfaceRadiusScale: Color3;
    private _subsurfaceRadiusScale;
    /**
     * Subsurface radius scale texture.
     * See OpenPBR's specs for subsurface_radius_scale
     */
    accessor subsurfaceRadiusScaleTexture: Nullable<BaseTexture>;
    private _subsurfaceRadiusScaleTexture;
    /**
     * Defines the anisotropy of the subsurface scattering in the volume.
     * See OpenPBR's specs for subsurface_scatter_anisotropy
     */
    accessor subsurfaceScatterAnisotropy: number;
    private _subsurfaceScatterAnisotropy;
    /**
     * Defines the amount of clear coat on the surface.
     * See OpenPBR's specs for coat_weight
     */
    accessor coatWeight: number;
    private _coatWeight;
    /**
     * Coat weight texture.
     * See OpenPBR's specs for coat_weight
     */
    accessor coatWeightTexture: Nullable<BaseTexture>;
    private _coatWeightTexture;
    /**
     * Defines the color of the clear coat on the surface.
     * See OpenPBR's specs for coat_color
     */
    accessor coatColor: Color3;
    private _coatColor;
    /**
     * Color texture of the clear coat.
     * See OpenPBR's specs for coat_color
     */
    accessor coatColorTexture: Nullable<BaseTexture>;
    private _coatColorTexture;
    /**
     * Defines the roughness of the clear coat on the surface.
     * See OpenPBR's specs for coat_roughness
     */
    accessor coatRoughness: number;
    private _coatRoughness;
    /**
     * Roughness texture of the clear coat.
     * See OpenPBR's specs for coat_roughness
     */
    accessor coatRoughnessTexture: Nullable<BaseTexture>;
    private _coatRoughnessTexture;
    /**
     * Defines the anisotropy of the clear coat on the surface.
     * See OpenPBR's specs for coat_roughness_anisotropy
     */
    accessor coatRoughnessAnisotropy: number;
    private _coatRoughnessAnisotropy;
    /**
     * Anisotropic Roughness texture of the clear coat.
     * See OpenPBR's specs for coat_roughness_anisotropy
     */
    accessor coatRoughnessAnisotropyTexture: Nullable<BaseTexture>;
    private _coatRoughnessAnisotropyTexture;
    /**
     * Defines the IOR of the clear coat on the surface.
     * See OpenPBR's specs for coat_ior
     */
    accessor coatIor: number;
    private _coatIor;
    /**
     * Defines the amount that interreflections within the coat allow the underlying surface
     * to be darkened. A value of 1.0 means that the physically correct amount of darkening
     * is applied, while a value of 0.0 means that no darkening is applied.
     * See OpenPBR's specs for coat_darkening
     */
    accessor coatDarkening: number;
    private _coatDarkening;
    /**
     * Defines the amount that interreflections within the coat allow the underlying surface
     * to be darkened. A value of 1.0 means that the physically correct amount of darkening
     * is applied, while a value of 0.0 means that no darkening is applied.
     * See OpenPBR's specs for coat_darkening
     */
    accessor coatDarkeningTexture: Nullable<BaseTexture>;
    private _coatDarkeningTexture;
    /**
     * Specifies whether the coat roughness is taken from the
     * same texture as the coat_weight.
     */
    useCoatRoughnessFromWeightTexture: boolean;
    /**
     * Defines the weight of the fuzz layer on the surface.
     * See OpenPBR's specs for fuzz_weight
     */
    accessor fuzzWeight: number;
    private _fuzzWeight;
    /**
     * Weight texture of the fuzz layer.
     * See OpenPBR's specs for fuzz_weight
     */
    accessor fuzzWeightTexture: Nullable<BaseTexture>;
    private _fuzzWeightTexture;
    /**
     * Defines the color of the fuzz layer on the surface.
     * See OpenPBR's specs for fuzz_color
     */
    accessor fuzzColor: Color3;
    private _fuzzColor;
    /**
     * Color texture of the fuzz layer.
     * See OpenPBR's specs for fuzz_color
     */
    accessor fuzzColorTexture: Nullable<BaseTexture>;
    private _fuzzColorTexture;
    /**
     * Defines the roughness of the fuzz layer on the surface.
     * See OpenPBR's specs for fuzz_roughness
     */
    accessor fuzzRoughness: number;
    private _fuzzRoughness;
    /**
     * Roughness texture of the fuzz layer.
     * See OpenPBR's specs for fuzz_roughness
     */
    accessor fuzzRoughnessTexture: Nullable<BaseTexture>;
    private _fuzzRoughnessTexture;
    /**
     * Defines whether the geometry is thin-walled (like a sheet of paper) or not.
     * See OpenPBR's specs for geometry_thin_walled
     */
    accessor geometryThinWalled: number;
    private _geometryThinWalled;
    /**
     * Defines the normal of the material's geometry.
     * See OpenPBR's specs for geometry_normal
     */
    accessor geometryNormalTexture: Nullable<BaseTexture>;
    private _geometryNormalTexture;
    /**
     * Defines the tangent of the material's geometry. Used only for anisotropic reflections.
     * See OpenPBR's specs for geometry_tangent
     */
    accessor geometryTangent: Vector2;
    private _geometryTangent;
    /**
     * Defines the angle of the tangent of the material's geometry. Used only for anisotropic reflections.
     * See OpenPBR's specs for geometry_tangent
     */
    get geometryTangentAngle(): number;
    set geometryTangentAngle(value: number);
    /**
     * Defines the tangent of the material's geometry. Used only for anisotropic reflections.
     * See OpenPBR's specs for geometry_tangent
     */
    accessor geometryTangentTexture: Nullable<BaseTexture>;
    private _geometryTangentTexture;
    /**
     * Defines the normal of the material's coat layer.
     * See OpenPBR's specs for geometry_coat_normal
     */
    accessor geometryCoatNormalTexture: Nullable<BaseTexture>;
    private _geometryCoatNormalTexture;
    /**
     * Defines the tangent of the material's coat layer. Used only for anisotropic reflections.
     * See OpenPBR's specs for geometry_coat_tangent
     */
    accessor geometryCoatTangent: Vector2;
    private _geometryCoatTangent;
    /**
     * Defines the angle of the tangent of the material's coat layer.
     */
    get geometryCoatTangentAngle(): number;
    /**
     * Defines the angle of the tangent of the material's coat layer.
     */
    set geometryCoatTangentAngle(value: number);
    /**
     * Defines the tangent of the material's coat layer. Used only for anisotropic reflections.
     * See OpenPBR's specs for geometry_coat_tangent
     */
    accessor geometryCoatTangentTexture: Nullable<BaseTexture>;
    private _geometryCoatTangentTexture;
    /**
     * Defines the opacity of the material's geometry.
     * See OpenPBR's specs for geometry_opacity
     */
    accessor geometryOpacity: number;
    private _geometryOpacity;
    /**
     * Defines the opacity texture of the material's geometry.
     * See OpenPBR's specs for geometry_opacity
     */
    accessor geometryOpacityTexture: Nullable<BaseTexture>;
    private _geometryOpacityTexture;
    /**
     * Defines the thickness of the material's geometry.
     * Not part of OpenPBR's specs but useful for rasterization approximations of volume.
     */
    accessor geometryThickness: number;
    private _geometryThickness;
    /**
     * Defines the thickness of the material's geometry.
     * Not part of OpenPBR's specs but useful for rasterization approximations of volume.
     */
    accessor geometryThicknessTexture: Nullable<BaseTexture>;
    private _geometryThicknessTexture;
    /**
     * Defines the luminance of the material's emission.
     * See OpenPBR's specs for emission_luminance
     */
    accessor emissionLuminance: number;
    private _emissionLuminance;
    /**
     * Defines the color of the material's emission.
     * See OpenPBR's specs for emission_color
     */
    accessor emissionColor: Color3;
    private _emissionColor;
    /**
     * Defines the texture of the material's emission color.
     * See OpenPBR's specs for emission_color
     */
    accessor emissionColorTexture: Nullable<BaseTexture>;
    private _emissionColorTexture;
    /**
     * Defines the weight of the thin film layer on top of the base layer for iridescent effects.
     */
    accessor thinFilmWeight: number;
    private _thinFilmWeight;
    /**
     * Thin film weight texture.
     */
    accessor thinFilmWeightTexture: Nullable<BaseTexture>;
    private _thinFilmWeightTexture;
    /**
     * Defines the thickness of the thin film layer in μm. If a texture is provided for thinFilmWeightTexture,
     * this value will act as a multiplier to the texture values.
     * See OpenPBR's specs for thin_film_thickness
     */
    accessor thinFilmThickness: number;
    private _thinFilmThickness;
    /**
     * Defines the minimum thickness of the thin film layer in μm.
     */
    accessor thinFilmThicknessMin: number;
    private _thinFilmThicknessMin;
    /**
     * Defines the maximum thickness of the thin film layer in μm.
     */
    accessor thinFilmThicknessTexture: Nullable<BaseTexture>;
    private _thinFilmThicknessTexture;
    /**
     * Defines the index of refraction of the thin film layer.
     */
    accessor thinFilmIor: number;
    private _thinFilmIor;
    /**
     * Defines the ambient occlusion texture.
     */
    accessor ambientOcclusionTexture: Nullable<BaseTexture>;
    private _ambientOcclusionTexture;
    /** SSS convolution uses 8 samples. */
    static readonly SSS_QUALITY_LOW = 0;
    /** SSS convolution uses 16 samples (default). */
    static readonly SSS_QUALITY_MEDIUM = 1;
    /** SSS convolution uses 32 samples. */
    static readonly SSS_QUALITY_HIGH = 2;
    private _sssQuality;
    /**
     * Controls the sample count of the screen-space SSS convolution kernel.
     * Use the SSS_QUALITY_LOW / MEDIUM / HIGH constants (8 / 16 / 32 samples).
     * Higher quality reduces noise at the cost of GPU time. Default: MEDIUM.
     */
    get sssQuality(): number;
    set sssQuality(value: number);
    private _sssIrradianceTexture;
    /**
     * Defines the irradiance texture used for subsurface scattering.
     * If it's not provided, the irradiance will be looked for in the scene.geometryBufferRenderer.
     * Accepts a {@link ThinTexture} so that an {@link InternalTexture} obtained from a frame graph
     * handle can be wrapped with `new ThinTexture(internalTexture)` and assigned directly.
     * Setting this property marks all sub-meshes as textures-dirty so the shader recompiles.
     */
    get sssIrradianceTexture(): Nullable<ThinTexture>;
    set sssIrradianceTexture(value: Nullable<ThinTexture>);
    private _sssDepthTexture;
    /**
     * Defines the depth texture used for subsurface scattering. This is the depth defined
     * in screen space. If it's not provided, the depth will be looked for in the scene.geometryBufferRenderer.
     * Accepts a {@link ThinTexture} so that an {@link InternalTexture} obtained from a frame graph
     * handle can be wrapped with `new ThinTexture(internalTexture)` and assigned directly.
     * Setting this property marks all sub-meshes as textures-dirty so the shader recompiles.
     */
    get sssDepthTexture(): Nullable<ThinTexture>;
    set sssDepthTexture(value: Nullable<ThinTexture>);
    private _propertyList;
    private _uniformsList;
    /**
     * Flat array view of `_uniformsList`, populated once at construction. Used
     * by the per-frame bind loop to avoid `Object.values()` allocation and
     * closure creation on every submesh binding.
     */
    private _uniformsArray;
    private _samplersList;
    private _samplerDefines;
    private static _noiseTextures;
    /**
     * Intensity of the direct lights e.g. the four lights available in your scene.
     * This impacts both the direct diffuse and specular highlights.
     */
    accessor directIntensity: number;
    /**
     * Intensity of the environment e.g. how much the environment will light the object
     * either through harmonics for rough material or through the reflection for shiny ones.
     */
    accessor environmentIntensity: number;
    /**
     * Specifies that the specular weight is stored in the alpha channel of the specular weight texture.
     */
    accessor useSpecularWeightFromTextureAlpha: boolean;
    /**
     * Enforces alpha test in opaque or blend mode in order to improve the performances of some situations.
     */
    accessor forceAlphaTest: boolean;
    /**
     * Defines the alpha limits in alpha test mode.
     */
    accessor alphaCutOff: number;
    /**
     * Specifies if the metallic texture contains the ambient occlusion information in its red channel.
     */
    accessor useAmbientOcclusionFromMetallicTextureRed: boolean;
    /**
     * Specifies if the ambient texture contains the ambient occlusion information in its red channel only.
     */
    accessor useAmbientInGrayScale: boolean;
    /**
     * Specifies if we can see through the surface of the material due to subsurface scattering or transmission.
     */
    get hasTransparency(): boolean;
    /** Specifies if the material has scattering properties such as subsurface scattering or transmission scattering. */
    get hasScattering(): boolean;
    /**
     * BJS is using an hardcoded light falloff based on a manually sets up range.
     * In PBR, one way to represents the falloff is to use the inverse squared root algorithm.
     * This parameter can help you switch back to the BJS mode in order to create scenes using both materials.
     */
    get usePhysicalLightFalloff(): boolean;
    /**
     * BJS is using an hardcoded light falloff based on a manually sets up range.
     * In PBR, one way to represents the falloff is to use the inverse squared root algorithm.
     * This parameter can help you switch back to the BJS mode in order to create scenes using both materials.
     */
    set usePhysicalLightFalloff(value: boolean);
    /**
     * In order to support the falloff compatibility with gltf, a special mode has been added
     * to reproduce the gltf light falloff.
     */
    get useGLTFLightFalloff(): boolean;
    /**
     * In order to support the falloff compatibility with gltf, a special mode has been added
     * to reproduce the gltf light falloff.
     */
    set useGLTFLightFalloff(value: boolean);
    /**
     * Allows using an object space normal map (instead of tangent space).
     */
    accessor useObjectSpaceNormalMap: boolean;
    /**
     * Allows using the normal map in parallax mode.
     */
    accessor useParallax: boolean;
    /**
     * Allows using the normal map in parallax occlusion mode.
     */
    accessor useParallaxOcclusion: boolean;
    /**
     * Controls the scale bias of the parallax mode.
     */
    accessor parallaxScaleBias: number;
    /**
     * If sets to true, disables all the lights affecting the material.
     */
    accessor disableLighting: boolean;
    /**
     * Force the shader to compute irradiance in the fragment shader in order to take normal mapping into account.
     */
    accessor forceIrradianceInFragment: boolean;
    /**
     * Number of Simultaneous lights allowed on the material.
     */
    accessor maxSimultaneousLights: number;
    /**
     * If sets to true, x component of normal map value will invert (x = 1.0 - x).
     */
    accessor invertNormalMapX: boolean;
    /**
     * If sets to true, y component of normal map value will invert (y = 1.0 - y).
     */
    accessor invertNormalMapY: boolean;
    /**
     * If sets to true and backfaceCulling is false, normals will be flipped on the backside.
     */
    accessor twoSidedLighting: boolean;
    /**
     * A fresnel is applied to the alpha of the model to ensure grazing angles edges are not alpha tested.
     * And/Or occlude the blended part. (alpha is converted to gamma to compute the fresnel)
     */
    accessor useAlphaFresnel: boolean;
    /**
     * A fresnel is applied to the alpha of the model to ensure grazing angles edges are not alpha tested.
     * And/Or occlude the blended part. (alpha stays linear to compute the fresnel)
     */
    accessor useLinearAlphaFresnel: boolean;
    /**
     * Let user defines the brdf lookup texture used for IBL.
     * A default 8bit version is embedded but you could point at :
     * * Default texture: https://assets.babylonjs.com/environments/correlatedMSBRDF_RGBD.png
     * * Default 16bit pixel depth texture: https://assets.babylonjs.com/environments/correlatedMSBRDF.dds
     * * LEGACY Default None correlated https://assets.babylonjs.com/environments/uncorrelatedBRDF_RGBD.png
     * * LEGACY Default None correlated 16bit pixel depth https://assets.babylonjs.com/environments/uncorrelatedBRDF.dds
     */
    accessor environmentBRDFTexture: Nullable<BaseTexture>;
    /**
     * Force normal to face away from face.
     */
    accessor forceNormalForward: boolean;
    /**
     * Enables specular anti aliasing in the PBR shader.
     * It will both interacts on the Geometry for analytical and IBL lighting.
     * It also prefilter the roughness map based on the normalmap values.
     */
    accessor enableSpecularAntiAliasing: boolean;
    /**
     * This parameters will enable/disable Horizon occlusion to prevent normal maps to look shiny when the normal
     * makes the reflect vector face the model (under horizon).
     */
    accessor useHorizonOcclusion: boolean;
    /**
     * This parameters will enable/disable radiance occlusion by preventing the radiance to lit
     * too much the area relying on ambient texture to define their ambient occlusion.
     */
    accessor useRadianceOcclusion: boolean;
    /**
     * If set to true, no lighting calculations will be applied.
     */
    accessor unlit: boolean;
    /**
     * If sets to true, the decal map will be applied after the detail map. Else, it is applied before (default: false)
     */
    accessor applyDecalMapAfterDetailMap: boolean;
    /**
     * Force all the PBR materials to compile to glsl even on WebGPU engines.
     * False by default. This is mostly meant for backward compatibility.
     */
    static ForceGLSL: boolean;
    /**
     * This stores the direct, emissive, environment, and specular light intensities into a Vector4.
     */
    private _lightingInfos;
    /**
     * Stores the radiance (and, possibly, irradiance) values in a texture.
     * @internal
     */
    _radianceTexture: Nullable<BaseTexture>;
    /**
     * Specifies that the specular weight will be read from the alpha channel.
     * This is for compatibility with glTF's KHR_materials_specular extension.
     * @internal
     */
    _useSpecularWeightFromAlpha: boolean;
    /**
     * Specifies that the specular weight will be read from the alpha channel of the specular color texture.
     * This is for compatibility with glTF's KHR_materials_specular extension.
     * @internal
     */
    _useSpecularWeightFromSpecularColorTexture: boolean;
    /**
     * Specifies if the material uses anisotropy weight read from the geometry tangent texture's blue channel.
     * This is for compatibility with glTF's anisotropy extension.
     * @internal
     */
    _useSpecularRoughnessAnisotropyFromTangentTexture: boolean;
    /**
     * Specifies if the material uses coat anisotropy weight read from the coat's geometry tangent texture's blue channel.
     * This is for compatibility with glTF's clearcoat_anisotropy extension.
     * @internal
     */
    _useCoatRoughnessAnisotropyFromTangentTexture: boolean;
    /**
     * Specifies whether the coat roughness is taken from the green channel of the coat texture.
     * This is for compatibility with glTF's KHR_materials_clearcoat and KHR_materials_coat extensions.
     * @internal
     */
    _useCoatRoughnessFromGreenChannel: boolean;
    /**
     * Assume the anisotropy data is stored in the format specified by
     * KHR_materials_anisotropy.
     * @internal
     */
    _useGltfStyleAnisotropy: boolean;
    /**
     * Specifies that the fuzz roughness is stored in the alpha channel of the texture.
     * This is for compatibility with glTF where the fuzz roughness is often stored in
     * the alpha channel of the fuzz color texture.
     */
    _useFuzzRoughnessFromTextureAlpha: boolean;
    /**
     * Specifies that the subsurface weight is stored in the alpha channel of the texture.
     * This is for compatibility with glTF where the subsurface weight is stored in
     * the alpha channel of the diffuseTransmissionTexture.
     */
    _useSubsurfaceWeightFromTextureAlpha: boolean;
    /**
     * This parameters will enable/disable Horizon occlusion to prevent normal maps to look shiny when the normal
     * makes the reflect vector face the model (under horizon).
     * @internal
     */
    _useHorizonOcclusion: boolean;
    /**
     * This parameters will enable/disable radiance occlusion by preventing the radiance to lit
     * too much the area relying on ambient texture to define their ambient occlusion.
     * @internal
     */
    _useRadianceOcclusion: boolean;
    /**
     * Specifies that the alpha is coming from the base color texture's alpha channel.
     * This is for compatibility with glTF.
     * @internal
     */
    _useAlphaFromBaseColorTexture: boolean;
    /**
     * Specifies if the metallic texture contains the ambient occlusion information in its red channel.
     * This is for compatibility with glTF.
     * @internal
     */
    _useAmbientOcclusionFromMetallicTextureRed: boolean;
    /**
     * Specifies if the metallic texture contains the roughness information in its green channel.
     * This is for compatibility with glTF.
     * @internal
     */
    _useRoughnessFromMetallicTextureGreen: boolean;
    /**
     * Specifies if the metallic texture contains the metallic information in its blue channel.
     * This is for compatibility with glTF.
     * @internal
     */
    _useMetallicFromMetallicTextureBlue: boolean;
    /**
     * Specifies if the thin film thickness is stored in the green channel of the thin film thickness texture.
     * This is for compatibility with glTF.
     * @internal
     */
    _useThinFilmThicknessFromTextureGreen: boolean;
    /**
     * Specifies if the geometry thickness is stored in the green channel of the geometry thickness texture.
     * This is for compatibility with glTF.
     * @internal
     */
    _useGeometryThicknessFromGreenChannel: boolean;
    /**
     * Defines the  falloff type used in this material.
     * It by default is Physical.
     * @internal
     */
    _lightFalloff: number;
    /**
     * Allows using an object space normal map (instead of tangent space).
     * @internal
     */
    _useObjectSpaceNormalMap: boolean;
    /**
     * Allows using the normal map in parallax mode.
     * @internal
     */
    _useParallax: boolean;
    /**
     * Allows using the normal map in parallax occlusion mode.
     * @internal
     */
    _useParallaxOcclusion: boolean;
    /**
     * Controls the scale bias of the parallax mode.
     * @internal
     */
    _parallaxScaleBias: number;
    /**
     * If sets to true, disables all the lights affecting the material.
     * @internal
     */
    _disableLighting: boolean;
    /**
     * Number of Simultaneous lights allowed on the material.
     * @internal
     */
    _maxSimultaneousLights: number;
    /**
     * If sets to true, x component of normal map value will be inverted (x = 1.0 - x).
     * @internal
     */
    _invertNormalMapX: boolean;
    /**
     * If sets to true, y component of normal map value will be inverted (y = 1.0 - y).
     * @internal
     */
    _invertNormalMapY: boolean;
    /**
     * If sets to true and backfaceCulling is false, normals will be flipped on the backside.
     * @internal
     */
    _twoSidedLighting: boolean;
    /**
     * Defines the alpha limits in alpha test mode.
     * @internal
     */
    _alphaCutOff: number;
    /**
     * A fresnel is applied to the alpha of the model to ensure grazing angles edges are not alpha tested.
     * And/Or occlude the blended part. (alpha is converted to gamma to compute the fresnel)
     * @internal
     */
    _useAlphaFresnel: boolean;
    /**
     * A fresnel is applied to the alpha of the model to ensure grazing angles edges are not alpha tested.
     * And/Or occlude the blended part. (alpha stays linear to compute the fresnel)
     * @internal
     */
    _useLinearAlphaFresnel: boolean;
    /**
     * Specifies the environment BRDF texture used to compute the scale and offset roughness values
     * from cos theta and roughness:
     * http://blog.selfshadow.com/publications/s2013-shading-course/karis/s2013_pbs_epic_notes_v2.pdf
     * @internal
     */
    _environmentBRDFTexture: Nullable<BaseTexture>;
    /**
     * Specifies the environment BRDF texture used to compute the scale and offset roughness values
     * from cos theta and roughness for the fuzz layer:
     * https://github.com/tizian/ltc-sheen?tab=readme-ov-file
     * @internal
     */
    _environmentFuzzBRDFTexture: Nullable<BaseTexture>;
    private _backgroundRefractionTexture;
    /**
     * Set the texture used for refraction of the background of transparent materials
     * @internal
     */
    get backgroundRefractionTexture(): Nullable<BaseTexture>;
    set backgroundRefractionTexture(texture: Nullable<BaseTexture>);
    private _refractionHighQualityBlur;
    /**
     * When true, uses a 4-tap rotated-grid kernel for refractive background blur,
     * eliminating bilinear block artifacts at the cost of 3 extra texture samples.
     * When false, a single dithered sample is used. Default: true.
     */
    get refractionHighQualityBlur(): boolean;
    set refractionHighQualityBlur(value: boolean);
    /**
     * Force the shader to compute irradiance in the fragment shader in order to take normal mapping into account.
     * @internal
     */
    _forceIrradianceInFragment: boolean;
    private _realTimeFiltering;
    /**
     * Enables realtime filtering on the texture.
     */
    get realTimeFiltering(): boolean;
    set realTimeFiltering(b: boolean);
    private _realTimeFilteringQuality;
    /**
     * Quality switch for realtime filtering
     */
    get realTimeFilteringQuality(): number;
    set realTimeFilteringQuality(n: number);
    private _fuzzSampleNumber;
    /**
     * The number of samples used to compute the fuzz IBL lighting.
     */
    get fuzzSampleNumber(): number;
    set fuzzSampleNumber(n: number);
    /**
     * Can this material render to several textures at once
     */
    get canRenderToMRT(): boolean;
    /**
     * Force normal to face away from face.
     * @internal
     */
    _forceNormalForward: boolean;
    /**
     * Enables specular anti aliasing in the PBR shader.
     * It will both interacts on the Geometry for analytical and IBL lighting.
     * It also prefilter the roughness map based on the normalmap values.
     * @internal
     */
    _enableSpecularAntiAliasing: boolean;
    /**
     * Stores the available render targets.
     */
    private _renderTargets;
    /**
     * If set to true, no lighting calculations will be applied.
     */
    private _unlit;
    /**
     * If sets to true, the decal map will be applied after the detail map. Else, it is applied before (default: false)
     */
    private _applyDecalMapAfterDetailMap;
    private _debugMode;
    private static readonly _ShaderLoader;
    private _breakShaderLoadedCheck;
    private _vertexPullingMetadata;
    /**
     * @internal
     * This is reserved for the inspector.
     * Defines the material debug mode.
     * It helps seeing only some components of the material while troubleshooting.
     */
    accessor debugMode: number;
    /**
     * @internal
     * This is reserved for the inspector.
     * Specify from where on screen the debug mode should start.
     * The value goes from -1 (full screen) to 1 (not visible)
     * It helps with side by side comparison against the final render
     * This defaults to -1
     */
    debugLimit: number;
    /**
     * @internal
     * This is reserved for the inspector.
     * As the default viewing range might not be enough (if the ambient is really small for instance)
     * You can use the factor to better multiply the final value.
     */
    debugFactor: number;
    /**
     * Defines additional PrePass parameters for the material.
     */
    readonly prePassConfiguration: PrePassConfiguration;
    protected _cacheHasRenderTargetTextures: boolean;
    /**
     * Instantiates a new OpenPBRMaterial instance.
     *
     * @param name The material name
     * @param scene The scene the material will be use in.
     * @param forceGLSL Use the GLSL code generation for the shader (even on WebGPU). Default is false
     */
    constructor(name: string, scene?: Scene, forceGLSL?: boolean);
    /**
     * Gets a boolean indicating that current material needs to register RTT
     */
    get hasRenderTargetTextures(): boolean;
    /**
     * Can this material render to prepass
     */
    get isPrePassCapable(): boolean;
    /**
     * @returns the name of the material class.
     */
    getClassName(): string;
    protected _transparencyMode: number;
    get transparencyMode(): number;
    set transparencyMode(value: number);
    /**
     * @returns whether or not the alpha value of the albedo texture should be used for alpha blending.
     */
    protected _shouldUseAlphaFromBaseColorTexture(): boolean;
    /**
     * @returns whether or not there is a usable alpha channel for transparency.
     */
    protected _hasAlphaChannel(): boolean;
    /**
     * @returns true when the material needs alpha blending — i.e. when geometry_opacity < 1
     * or a geometry opacity texture is present.
     */
    needAlphaBlending(): boolean;
    /**
     * Specifies if the mesh will require alpha blending.
     * Overridden to check geometry_opacity before the _hasTransparencyMode short-circuit in the
     * base class, which would otherwise always return false when _transparencyMode is MATERIAL_OPAQUE.
     * @param mesh The mesh to check
     * @returns true if alpha blending is needed for the mesh
     */
    needAlphaBlendingForMesh(mesh: AbstractMesh): boolean;
    /**
     * Makes a duplicate of the current material.
     * @param name - name to use for the new material.
     * @param cloneTexturesOnlyOnce - if a texture is used in more than one channel (e.g baseColor and opacity), only clone it once and reuse it on the other channels. Default false.
     * @param rootUrl defines the root URL to use to load textures
     * @returns cloned material instance
     */
    clone(name: string, cloneTexturesOnlyOnce?: boolean, rootUrl?: string): OpenPBRMaterial;
    /**
     * Serializes this PBR Material.
     * @returns - An object with the serialized material.
     */
    serialize(): any;
    /**
     * Parses a PBR Material from a serialized object.
     * @param source - Serialized object.
     * @param scene - BJS scene instance.
     * @param rootUrl - url for the scene object
     * @returns - OpenPBRMaterial
     */
    static Parse(source: any, scene: Scene, rootUrl: string): OpenPBRMaterial;
    /**
     * Force shader compilation
     * @param mesh - Define the mesh we want to force the compilation for
     * @param onCompiled - Define a callback triggered when the compilation completes
     * @param options - Define the options used to create the compilation
     */
    forceCompilation(mesh: AbstractMesh, onCompiled?: (material: Material) => void, options?: Partial<IMaterialCompilationOptions>): void;
    /**
     * Specifies that the submesh is ready to be used.
     * @param mesh - BJS mesh.
     * @param subMesh - A submesh of the BJS mesh.  Used to check if it is ready.
     * @param useInstances - Specifies that instances should be used.
     * @returns - boolean indicating that the submesh is ready or not.
     */
    isReadyForSubMesh(mesh: AbstractMesh, subMesh: SubMesh, useInstances?: boolean): boolean;
    /**
     * Initializes the uniform buffer layout for the shader.
     */
    buildUniformLayout(): void;
    /**
     * Binds the material data (this function is called even if mustRebind() returns false)
     * @param uniformBuffer defines the Uniform buffer to fill in.
     * @param scene defines the scene the material belongs to.
     * @param engine defines the engine the material belongs to.
     * @param subMesh the submesh to bind data for
     */
    bindPropertiesForSubMesh(uniformBuffer: UniformBuffer, scene: Scene, engine: Engine, subMesh: SubMesh): void;
    /**
     * Binds the submesh data.
     * @param world - The world matrix.
     * @param mesh - The BJS mesh.
     * @param subMesh - A submesh of the BJS mesh.
     */
    bindForSubMesh(world: Matrix, mesh: Mesh, subMesh: SubMesh): void;
    /**
     * Returns the animatable textures.
     * If material have animatable metallic texture, then reflectivity texture will not be returned, even if it has animations.
     * @returns - Array of animatable textures.
     */
    getAnimatables(): IAnimatable[];
    /**
     * Returns an array of the actively used textures.
     * @returns - Array of BaseTextures
     */
    getActiveTextures(): BaseTexture[];
    /**
     * Checks to see if a texture is used in the material.
     * @param texture - Base texture to use.
     * @returns - Boolean specifying if a texture is used in the material.
     */
    hasTexture(texture: BaseTexture): boolean;
    /**
     * Sets the required values to the prepass renderer.
     * It can't be sets when subsurface scattering of this material is disabled.
     * When scene have ability to enable subsurface prepass effect, it will enable.
     * @returns - If prepass is enabled or not.
     */
    setPrePassRenderer(): boolean;
    /**
     * Disposes the resources of the material.
     * @param forceDisposeEffect - Forces the disposal of effects.
     * @param forceDisposeTextures - Forces the disposal of all textures.
     */
    dispose(forceDisposeEffect?: boolean, forceDisposeTextures?: boolean): void;
    /**
     * Returns the texture used for reflections.
     * @returns - Reflection texture if present.  Otherwise, returns the environment texture.
     */
    private _getRadianceTexture;
    private _prepareEffect;
    private _prepareDefines;
}
/**
 * Register side effects for openpbrMaterial.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterOpenpbrMaterial(): void;
export {};
