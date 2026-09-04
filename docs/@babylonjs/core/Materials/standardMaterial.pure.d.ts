/** This file must only contain pure code and pure imports */
import { SmartArray } from "../Misc/smartArray.js";
import { type IAnimatable } from "../Animations/animatable.interface.js";
import { type Nullable } from "../types.js";
import { Scene } from "../scene.pure.js";
import { type Matrix } from "../Maths/math.vector.pure.js";
import { Color3 } from "../Maths/math.color.pure.js";
import { type SubMesh } from "../Meshes/subMesh.pure.js";
import { type AbstractMesh } from "../Meshes/abstractMesh.pure.js";
import { type Mesh } from "../Meshes/mesh.pure.js";
import { PrePassConfiguration } from "./prePassConfiguration.js";
import { ImageProcessingConfiguration } from "./imageProcessingConfiguration.pure.js";
import { type FresnelParameters } from "./fresnelParameters.pure.js";
import { MaterialDefines } from "../Materials/materialDefines.js";
import { PushMaterial } from "./pushMaterial.js";
import { type BaseTexture } from "../Materials/Textures/baseTexture.pure.js";
import { type RenderTargetTexture } from "../Materials/Textures/renderTargetTexture.pure.js";
import { DetailMapConfiguration } from "./material.detailMapConfiguration.js";
declare const StandardMaterialDefinesBase_base: {
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
declare class StandardMaterialDefinesBase extends StandardMaterialDefinesBase_base {
}
declare const StandardMaterialDefines_base: {
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
} & typeof StandardMaterialDefinesBase;
/** @internal */
export declare class StandardMaterialDefines extends StandardMaterialDefines_base {
    DIFFUSE: boolean;
    DIFFUSEDIRECTUV: number;
    BAKED_VERTEX_ANIMATION_TEXTURE: boolean;
    AMBIENT: boolean;
    AMBIENTDIRECTUV: number;
    OPACITY: boolean;
    OPACITYDIRECTUV: number;
    OPACITYRGB: boolean;
    REFLECTION: boolean;
    EMISSIVE: boolean;
    EMISSIVEDIRECTUV: number;
    SPECULAR: boolean;
    SPECULARDIRECTUV: number;
    BUMP: boolean;
    BUMPDIRECTUV: number;
    PARALLAX: boolean;
    PARALLAX_RHS: boolean;
    PARALLAXOCCLUSION: boolean;
    SPECULAROVERALPHA: boolean;
    CLIPPLANE: boolean;
    CLIPPLANE2: boolean;
    CLIPPLANE3: boolean;
    CLIPPLANE4: boolean;
    CLIPPLANE5: boolean;
    CLIPPLANE6: boolean;
    ALPHATEST: boolean;
    DEPTHPREPASS: boolean;
    ALPHAFROMDIFFUSE: boolean;
    POINTSIZE: boolean;
    FOG: boolean;
    SPECULARTERM: boolean;
    DIFFUSEFRESNEL: boolean;
    OPACITYFRESNEL: boolean;
    REFLECTIONFRESNEL: boolean;
    REFRACTIONFRESNEL: boolean;
    EMISSIVEFRESNEL: boolean;
    FRESNEL: boolean;
    NORMAL: boolean;
    TANGENT: boolean;
    VERTEXCOLOR: boolean;
    VERTEXALPHA: boolean;
    NUM_BONE_INFLUENCERS: number;
    BonesPerMesh: number;
    BONETEXTURE: boolean;
    BONES_VELOCITY_ENABLED: boolean;
    INSTANCES: boolean;
    THIN_INSTANCES: boolean;
    INSTANCESCOLOR: boolean;
    GLOSSINESS: boolean;
    ROUGHNESS: boolean;
    EMISSIVEASILLUMINATION: boolean;
    LINKEMISSIVEWITHDIFFUSE: boolean;
    REFLECTIONFRESNELFROMSPECULAR: boolean;
    LIGHTMAP: boolean;
    LIGHTMAPDIRECTUV: number;
    OBJECTSPACE_NORMALMAP: boolean;
    USELIGHTMAPASSHADOWMAP: boolean;
    REFLECTIONMAP_3D: boolean;
    REFLECTIONMAP_SPHERICAL: boolean;
    REFLECTIONMAP_PLANAR: boolean;
    REFLECTIONMAP_CUBIC: boolean;
    USE_LOCAL_REFLECTIONMAP_CUBIC: boolean;
    USE_LOCAL_REFRACTIONMAP_CUBIC: boolean;
    REFLECTIONMAP_PROJECTION: boolean;
    REFLECTIONMAP_SKYBOX: boolean;
    REFLECTIONMAP_EXPLICIT: boolean;
    REFLECTIONMAP_EQUIRECTANGULAR: boolean;
    REFLECTIONMAP_EQUIRECTANGULAR_FIXED: boolean;
    REFLECTIONMAP_MIRROREDEQUIRECTANGULAR_FIXED: boolean;
    REFLECTIONMAP_OPPOSITEZ: boolean;
    INVERTCUBICMAP: boolean;
    LOGARITHMICDEPTH: boolean;
    REFRACTION: boolean;
    REFRACTIONMAP_3D: boolean;
    REFLECTIONOVERALPHA: boolean;
    TWOSIDEDLIGHTING: boolean;
    SHADOWFLOAT: boolean;
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
    NONUNIFORMSCALING: boolean;
    PREMULTIPLYALPHA: boolean;
    ALPHATEST_AFTERALLALPHACOMPUTATIONS: boolean;
    ALPHABLEND: boolean;
    RGBDLIGHTMAP: boolean;
    RGBDREFLECTION: boolean;
    RGBDREFRACTION: boolean;
    MULTIVIEW: boolean;
    ORDER_INDEPENDENT_TRANSPARENCY: boolean;
    ORDER_INDEPENDENT_TRANSPARENCY_16BITS: boolean;
    CAMERA_ORTHOGRAPHIC: boolean;
    CAMERA_PERSPECTIVE: boolean;
    AREALIGHTSUPPORTED: boolean;
    USE_VERTEX_PULLING: boolean;
    VERTEX_PULLING_USE_INDEX_BUFFER: boolean;
    VERTEX_PULLING_INDEX_BUFFER_32BITS: boolean;
    RIGHT_HANDED: boolean;
    CLUSTLIGHT_SLICES: number;
    CLUSTLIGHT_BATCH: number;
    /**
     * If the reflection texture on this material is in linear color space
     * @internal
     */
    IS_REFLECTION_LINEAR: boolean;
    /**
     * If the refraction texture on this material is in linear color space
     * @internal
     */
    IS_REFRACTION_LINEAR: boolean;
    DECAL_AFTER_DETAIL: boolean;
    TEXTURE_REPETITION_MODE: number;
    /**
     * Initializes the Standard Material defines.
     * @param externalProperties The external properties
     */
    constructor(externalProperties?: {
        [name: string]: {
            type: string;
            default: any;
        };
    });
}
declare const StandardMaterialBase_base: {
    new (...args: any[]): {
        _imageProcessingConfiguration: ImageProcessingConfiguration;
        get imageProcessingConfiguration(): ImageProcessingConfiguration;
        set imageProcessingConfiguration(value: ImageProcessingConfiguration);
        _imageProcessingObserver: Nullable<import("../index.js").Observer<ImageProcessingConfiguration>>;
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
        get cameraColorCurves(): Nullable<import("./colorCurves.pure.js").ColorCurves>;
        set cameraColorCurves(value: Nullable<import("./colorCurves.pure.js").ColorCurves>);
    };
} & typeof PushMaterial;
declare class StandardMaterialBase extends StandardMaterialBase_base {
}
/**
 * This is the default material used in Babylon. It is the best trade off between quality
 * and performances.
 * @see https://doc.babylonjs.com/features/featuresDeepDive/materials/using/materials_introduction
 */
export declare class StandardMaterial extends StandardMaterialBase {
    /**
     * Force all the standard materials to compile to glsl even on WebGPU engines.
     * False by default. This is mostly meant for backward compatibility.
     */
    static ForceGLSL: boolean;
    private _diffuseTexture;
    /**
     * The basic texture of the material as viewed under a light.
     */
    accessor diffuseTexture: Nullable<BaseTexture>;
    private _ambientTexture;
    /**
     * AKA Occlusion Texture in other nomenclature, it helps adding baked shadows into your material.
     */
    accessor ambientTexture: Nullable<BaseTexture>;
    private _opacityTexture;
    /**
     * Define the transparency of the material from a texture.
     * The final alpha value can be read either from the red channel (if texture.getAlphaFromRGB is false)
     * or from the luminance or the current texel (if texture.getAlphaFromRGB is true)
     */
    accessor opacityTexture: Nullable<BaseTexture>;
    private _reflectionTexture;
    /**
     * Define the texture used to display the reflection.
     * @see https://doc.babylonjs.com/features/featuresDeepDive/materials/using/reflectionTexture#how-to-obtain-reflections-and-refractions
     */
    accessor reflectionTexture: Nullable<BaseTexture>;
    private _emissiveTexture;
    /**
     * Define texture of the material as if self lit.
     * This will be mixed in the final result even in the absence of light.
     */
    accessor emissiveTexture: Nullable<BaseTexture>;
    private _specularTexture;
    /**
     * Define how the color and intensity of the highlight given by the light in the material.
     */
    accessor specularTexture: Nullable<BaseTexture>;
    private _bumpTexture;
    /**
     * Bump mapping is a technique to simulate bump and dents on a rendered surface.
     * These are made by creating a normal map from an image. The means to do this can be found on the web, a search for 'normal map generator' will bring up free and paid for methods of doing this.
     * @see https://doc.babylonjs.com/features/featuresDeepDive/materials/using/moreMaterials#bump-map
     */
    accessor bumpTexture: Nullable<BaseTexture>;
    private _lightmapTexture;
    /**
     * Complex lighting can be computationally expensive to compute at runtime.
     * To save on computation, lightmaps may be used to store calculated lighting in a texture which will be applied to a given mesh.
     * @see https://doc.babylonjs.com/features/featuresDeepDive/lights/lights_introduction#lightmaps
     */
    accessor lightmapTexture: Nullable<BaseTexture>;
    private _refractionTexture;
    /**
     * Define the texture used to display the refraction.
     * @see https://doc.babylonjs.com/features/featuresDeepDive/materials/using/reflectionTexture#how-to-obtain-reflections-and-refractions
     */
    accessor refractionTexture: Nullable<BaseTexture>;
    /**
     * The color of the material lit by the environmental background lighting.
     * @see https://doc.babylonjs.com/features/featuresDeepDive/materials/using/materials_introduction#ambient-color-example
     */
    ambientColor: Color3;
    /**
     * The basic color of the material as viewed under a light.
     */
    diffuseColor: Color3;
    /**
     * Define how the color and intensity of the highlight given by the light in the material.
     */
    specularColor: Color3;
    /**
     * Define the color of the material as if self lit.
     * This will be mixed in the final result even in the absence of light.
     */
    emissiveColor: Color3;
    /**
     * Defines how sharp are the highlights in the material.
     * The bigger the value the sharper giving a more glossy feeling to the result.
     * Reversely, the smaller the value the blurrier giving a more rough feeling to the result.
     */
    specularPower: number;
    private _useAlphaFromDiffuseTexture;
    /**
     * Does the transparency come from the diffuse texture alpha channel.
     */
    accessor useAlphaFromDiffuseTexture: boolean;
    private _useEmissiveAsIllumination;
    /**
     * If true, the emissive value is added into the end result, otherwise it is multiplied in.
     */
    accessor useEmissiveAsIllumination: boolean;
    private _linkEmissiveWithDiffuse;
    /**
     * If true, some kind of energy conservation will prevent the end result to be more than 1 by reducing
     * the emissive level when the final color is close to one.
     */
    accessor linkEmissiveWithDiffuse: boolean;
    private _useSpecularOverAlpha;
    /**
     * Specifies that the material will keep the specular highlights over a transparent surface (only the most luminous ones).
     * A car glass is a good exemple of that. When sun reflects on it you can not see what is behind.
     */
    accessor useSpecularOverAlpha: boolean;
    private _useReflectionOverAlpha;
    /**
     * Specifies that the material will keeps the reflection highlights over a transparent surface (only the most luminous ones).
     * A car glass is a good exemple of that. When the street lights reflects on it you can not see what is behind.
     */
    accessor useReflectionOverAlpha: boolean;
    private _disableLighting;
    /**
     * Does lights from the scene impacts this material.
     * It can be a nice trick for performance to disable lighting on a fully emissive material.
     */
    accessor disableLighting: boolean;
    private _useObjectSpaceNormalMap;
    /**
     * Allows using an object space normal map (instead of tangent space).
     */
    accessor useObjectSpaceNormalMap: boolean;
    private _useParallax;
    /**
     * Is parallax enabled or not.
     * @see https://doc.babylonjs.com/features/featuresDeepDive/materials/using/parallaxMapping
     */
    accessor useParallax: boolean;
    private _useParallaxOcclusion;
    /**
     * Is parallax occlusion enabled or not.
     * If true, the outcome is way more realistic than traditional Parallax but you can expect a performance hit that worthes consideration.
     * @see https://doc.babylonjs.com/features/featuresDeepDive/materials/using/parallaxMapping
     */
    accessor useParallaxOcclusion: boolean;
    /**
     * Apply a scaling factor that determine which "depth" the height map should reprensent. A value between 0.05 and 0.1 is reasonnable in Parallax, you can reach 0.2 using Parallax Occlusion.
     */
    parallaxScaleBias: number;
    private _roughness;
    /**
     * Helps to define how blurry the reflections should appears in the material.
     */
    accessor roughness: number;
    /**
     * In case of refraction, define the value of the index of refraction.
     * @see https://doc.babylonjs.com/features/featuresDeepDive/materials/using/reflectionTexture#how-to-obtain-reflections-and-refractions
     */
    indexOfRefraction: number;
    /**
     * Invert the refraction texture alongside the y axis.
     * It can be useful with procedural textures or probe for instance.
     * @see https://doc.babylonjs.com/features/featuresDeepDive/materials/using/reflectionTexture#how-to-obtain-reflections-and-refractions
     */
    invertRefractionY: boolean;
    /**
     * Defines the alpha limits in alpha test mode.
     */
    alphaCutOff: number;
    private _useLightmapAsShadowmap;
    /**
     * In case of light mapping, define whether the map contains light or shadow informations.
     */
    accessor useLightmapAsShadowmap: boolean;
    private _diffuseFresnelParameters;
    /**
     * Define the diffuse fresnel parameters of the material.
     * @see https://doc.babylonjs.com/features/featuresDeepDive/materials/using/fresnelParameters
     */
    accessor diffuseFresnelParameters: FresnelParameters;
    private _opacityFresnelParameters;
    /**
     * Define the opacity fresnel parameters of the material.
     * @see https://doc.babylonjs.com/features/featuresDeepDive/materials/using/fresnelParameters
     */
    accessor opacityFresnelParameters: FresnelParameters;
    private _reflectionFresnelParameters;
    /**
     * Define the reflection fresnel parameters of the material.
     * @see https://doc.babylonjs.com/features/featuresDeepDive/materials/using/fresnelParameters
     */
    accessor reflectionFresnelParameters: FresnelParameters;
    private _refractionFresnelParameters;
    /**
     * Define the refraction fresnel parameters of the material.
     * @see https://doc.babylonjs.com/features/featuresDeepDive/materials/using/fresnelParameters
     */
    accessor refractionFresnelParameters: FresnelParameters;
    private _emissiveFresnelParameters;
    /**
     * Define the emissive fresnel parameters of the material.
     * @see https://doc.babylonjs.com/features/featuresDeepDive/materials/using/fresnelParameters
     */
    accessor emissiveFresnelParameters: FresnelParameters;
    private _useReflectionFresnelFromSpecular;
    /**
     * If true automatically deducts the fresnels values from the material specularity.
     * @see https://doc.babylonjs.com/features/featuresDeepDive/materials/using/fresnelParameters
     */
    accessor useReflectionFresnelFromSpecular: boolean;
    private _useGlossinessFromSpecularMapAlpha;
    /**
     * Defines if the glossiness/roughness of the material should be read from the specular map alpha channel
     */
    accessor useGlossinessFromSpecularMapAlpha: boolean;
    private _maxSimultaneousLights;
    /**
     * Defines the maximum number of lights that can be used in the material
     */
    accessor maxSimultaneousLights: number;
    private _invertNormalMapX;
    /**
     * If sets to true, x component of normal map value will invert (x = 1.0 - x).
     */
    accessor invertNormalMapX: boolean;
    private _invertNormalMapY;
    /**
     * If sets to true, y component of normal map value will invert (y = 1.0 - y).
     */
    accessor invertNormalMapY: boolean;
    private _twoSidedLighting;
    /**
     * If sets to true and backfaceCulling is false, normals will be flipped on the backside.
     */
    accessor twoSidedLighting: boolean;
    private _applyDecalMapAfterDetailMap;
    /**
     * If sets to true, the decal map will be applied after the detail map. Else, it is applied before (default: false)
     */
    accessor applyDecalMapAfterDetailMap: boolean;
    private static readonly _ShaderLoader;
    private _vertexPullingMetadata;
    /**
     * Defines additional PrePass parameters for the material.
     */
    readonly prePassConfiguration: PrePassConfiguration;
    /**
     * Can this material render to prepass
     */
    get isPrePassCapable(): boolean;
    /**
     * Can this material render to several textures at once
     */
    get canRenderToMRT(): boolean;
    /**
     * Defines the detail map parameters for the material.
     */
    readonly detailMap: DetailMapConfiguration;
    protected _renderTargets: SmartArray<RenderTargetTexture>;
    protected _globalAmbientColor: Color3;
    protected _cacheHasRenderTargetTextures: boolean;
    /**
     * Instantiates a new standard material.
     * This is the default material used in Babylon. It is the best trade off between quality
     * and performances.
     * @see https://doc.babylonjs.com/features/featuresDeepDive/materials/using/materials_introduction
     * @param name Define the name of the material in the scene
     * @param scene Define the scene the material belong to
     * @param forceGLSL Use the GLSL code generation for the shader (even on WebGPU). Default is false
     */
    constructor(name: string, scene?: Scene, forceGLSL?: boolean);
    /**
     * Gets a boolean indicating that current material needs to register RTT
     */
    get hasRenderTargetTextures(): boolean;
    /**
     * Gets the current class name of the material e.g. "StandardMaterial"
     * Mainly use in serialization.
     * @returns the class name
     */
    getClassName(): string;
    /**
     * Specifies if the material will require alpha blending
     * @returns a boolean specifying if alpha blending is needed
     */
    needAlphaBlending(): boolean;
    /**
     * Specifies if this material should be rendered in alpha test mode
     * @returns a boolean specifying if an alpha test is needed.
     */
    needAlphaTesting(): boolean;
    /**
     * @returns whether or not the alpha value of the diffuse texture should be used for alpha blending.
     */
    protected _shouldUseAlphaFromDiffuseTexture(): boolean;
    /**
     * @returns whether or not there is a usable alpha channel for transparency.
     */
    protected _hasAlphaChannel(): boolean;
    /**
     * Get the texture used for alpha test purpose.
     * @returns the diffuse texture in case of the standard material.
     */
    getAlphaTestTexture(): Nullable<BaseTexture>;
    /**
     * Get if the submesh is ready to be used and all its information available.
     * Child classes can use it to update shaders
     * @param mesh defines the mesh to check
     * @param subMesh defines which submesh to check
     * @param useInstances specifies that instances should be used
     * @returns a boolean indicating that the submesh is ready or not
     */
    isReadyForSubMesh(mesh: AbstractMesh, subMesh: SubMesh, useInstances?: boolean): boolean;
    /**
     * Builds the material UBO layouts.
     * Used internally during the effect preparation.
     */
    buildUniformLayout(): void;
    /**
     * Binds the submesh to this material by preparing the effect and shader to draw
     * @param world defines the world transformation matrix
     * @param mesh defines the mesh containing the submesh
     * @param subMesh defines the submesh to bind the material to
     */
    bindForSubMesh(world: Matrix, mesh: Mesh, subMesh: SubMesh): void;
    /**
     * Get the list of animatables in the material.
     * @returns the list of animatables object used in the material
     */
    getAnimatables(): IAnimatable[];
    /**
     * Gets the active textures from the material
     * @returns an array of textures
     */
    getActiveTextures(): BaseTexture[];
    /**
     * Specifies if the material uses a texture
     * @param texture defines the texture to check against the material
     * @returns a boolean specifying if the material uses the texture
     */
    hasTexture(texture: BaseTexture): boolean;
    /**
     * Disposes the material
     * @param forceDisposeEffect specifies if effects should be forcefully disposed
     * @param forceDisposeTextures specifies if textures should be forcefully disposed
     */
    dispose(forceDisposeEffect?: boolean, forceDisposeTextures?: boolean): void;
    /**
     * Makes a duplicate of the material, and gives it a new name
     * @param name defines the new name for the duplicated material
     * @param cloneTexturesOnlyOnce - if a texture is used in more than one channel (e.g diffuse and opacity), only clone it once and reuse it on the other channels. Default false.
     * @param rootUrl defines the root URL to use to load textures
     * @returns the cloned material
     */
    clone(name: string, cloneTexturesOnlyOnce?: boolean, rootUrl?: string): StandardMaterial;
    /**
     * Creates a standard material from parsed material data
     * @param source defines the JSON representation of the material
     * @param scene defines the hosting scene
     * @param rootUrl defines the root URL to use to load textures and relative dependencies
     * @returns a new standard material
     */
    static Parse(source: any, scene: Scene, rootUrl: string): StandardMaterial;
    /**
     * Are diffuse textures enabled in the application.
     */
    static get DiffuseTextureEnabled(): boolean;
    static set DiffuseTextureEnabled(value: boolean);
    /**
     * Are detail textures enabled in the application.
     */
    static get DetailTextureEnabled(): boolean;
    static set DetailTextureEnabled(value: boolean);
    /**
     * Are ambient textures enabled in the application.
     */
    static get AmbientTextureEnabled(): boolean;
    static set AmbientTextureEnabled(value: boolean);
    /**
     * Are opacity textures enabled in the application.
     */
    static get OpacityTextureEnabled(): boolean;
    static set OpacityTextureEnabled(value: boolean);
    /**
     * Are reflection textures enabled in the application.
     */
    static get ReflectionTextureEnabled(): boolean;
    static set ReflectionTextureEnabled(value: boolean);
    /**
     * Are emissive textures enabled in the application.
     */
    static get EmissiveTextureEnabled(): boolean;
    static set EmissiveTextureEnabled(value: boolean);
    /**
     * Are specular textures enabled in the application.
     */
    static get SpecularTextureEnabled(): boolean;
    static set SpecularTextureEnabled(value: boolean);
    /**
     * Are bump textures enabled in the application.
     */
    static get BumpTextureEnabled(): boolean;
    static set BumpTextureEnabled(value: boolean);
    /**
     * Are lightmap textures enabled in the application.
     */
    static get LightmapTextureEnabled(): boolean;
    static set LightmapTextureEnabled(value: boolean);
    /**
     * Are refraction textures enabled in the application.
     */
    static get RefractionTextureEnabled(): boolean;
    static set RefractionTextureEnabled(value: boolean);
    /**
     * Are color grading textures enabled in the application.
     */
    static get ColorGradingTextureEnabled(): boolean;
    static set ColorGradingTextureEnabled(value: boolean);
    /**
     * Are fresnels enabled in the application.
     */
    static get FresnelEnabled(): boolean;
    static set FresnelEnabled(value: boolean);
}
/**
 * Register side effects for standardMaterial.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterStandardMaterial(): void;
export {};
