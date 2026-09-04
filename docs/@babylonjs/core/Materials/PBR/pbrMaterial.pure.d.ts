/** This file must only contain pure code and pure imports */
import { type Nullable } from "../../types.js";
import { type Scene } from "../../scene.pure.js";
import { Color3 } from "../../Maths/math.color.pure.js";
import { type BaseTexture } from "../../Materials/Textures/baseTexture.pure.js";
import { PBRBaseMaterial } from "./pbrBaseMaterial.pure.js";
/**
 * The Physically based material of BJS.
 *
 * This offers the main features of a standard PBR material.
 * For more information, please refer to the documentation :
 * https://doc.babylonjs.com/features/featuresDeepDive/materials/using/introToPBR
 */
export declare class PBRMaterial extends PBRBaseMaterial {
    /**
     * PBRMaterialTransparencyMode: No transparency mode, Alpha channel is not use.
     */
    static readonly PBRMATERIAL_OPAQUE = 0;
    /**
     * PBRMaterialTransparencyMode: Alpha Test mode, pixel are discarded below a certain threshold defined by the alpha cutoff value.
     */
    static readonly PBRMATERIAL_ALPHATEST = 1;
    /**
     * PBRMaterialTransparencyMode: Pixels are blended (according to the alpha mode) with the already drawn pixels in the current frame buffer.
     */
    static readonly PBRMATERIAL_ALPHABLEND = 2;
    /**
     * PBRMaterialTransparencyMode: Pixels are blended (according to the alpha mode) with the already drawn pixels in the current frame buffer.
     * They are also discarded below the alpha cutoff threshold to improve performances.
     */
    static readonly PBRMATERIAL_ALPHATESTANDBLEND = 3;
    /**
     * Defines the default value of how much AO map is occluding the analytical lights
     * (point spot...).
     */
    static DEFAULT_AO_ON_ANALYTICAL_LIGHTS: number;
    /**
     * Intensity of the direct lights e.g. the four lights available in your scene.
     * This impacts both the direct diffuse and specular highlights.
     */
    accessor directIntensity: number;
    /**
     * Intensity of the emissive part of the material.
     * This helps controlling the emissive effect without modifying the emissive color.
     */
    accessor emissiveIntensity: number;
    /**
     * Intensity of the environment e.g. how much the environment will light the object
     * either through harmonics for rough material or through the reflection for shiny ones.
     */
    accessor environmentIntensity: number;
    /**
     * This is a special control allowing the reduction of the specular highlights coming from the
     * four lights of the scene. Those highlights may not be needed in full environment lighting.
     */
    accessor specularIntensity: number;
    /**
     * Debug Control allowing disabling the bump map on this material.
     */
    accessor disableBumpMap: boolean;
    /**
     * AKA Diffuse Texture in standard nomenclature.
     */
    accessor albedoTexture: Nullable<BaseTexture>;
    /**
     * OpenPBR Base Weight texture (multiplier to the diffuse and metal lobes).
     */
    accessor baseWeightTexture: Nullable<BaseTexture>;
    /**
     * OpenPBR Base Diffuse Roughness texture (roughness of the diffuse lobe).
     */
    accessor baseDiffuseRoughnessTexture: Nullable<BaseTexture>;
    /**
     * AKA Occlusion Texture in other nomenclature.
     */
    accessor ambientTexture: Nullable<BaseTexture>;
    /**
     * AKA Occlusion Texture Intensity in other nomenclature.
     */
    accessor ambientTextureStrength: number;
    /**
     * Defines how much the AO map is occluding the analytical lights (point spot...).
     * 1 means it completely occludes it
     * 0 mean it has no impact
     */
    accessor ambientTextureImpactOnAnalyticalLights: number;
    /**
     * Stores the alpha values in a texture. Use luminance if texture.getAlphaFromRGB is true.
     */
    accessor opacityTexture: Nullable<BaseTexture>;
    /**
     * Stores the reflection values in a texture.
     */
    accessor reflectionTexture: Nullable<BaseTexture>;
    /**
     * Stores the emissive values in a texture.
     */
    accessor emissiveTexture: Nullable<BaseTexture>;
    /**
     * AKA Specular texture in other nomenclature.
     */
    accessor reflectivityTexture: Nullable<BaseTexture>;
    /**
     * Used to switch from specular/glossiness to metallic/roughness workflow.
     */
    accessor metallicTexture: Nullable<BaseTexture>;
    /**
     * Specifies the metallic scalar of the metallic/roughness workflow.
     * Can also be used to scale the metalness values of the metallic texture.
     */
    accessor metallic: Nullable<number>;
    /**
     * Specifies the roughness scalar of the metallic/roughness workflow.
     * Can also be used to scale the roughness values of the metallic texture.
     */
    accessor roughness: Nullable<number>;
    /**
     * In metallic workflow, specifies an F0 factor to help configuring the material F0.
     * By default the indexOfrefraction is used to compute F0;
     *
     * This is used as a factor against the default reflectance at normal incidence to tweak it.
     *
     * F0 = defaultF0 * metallicF0Factor * metallicReflectanceColor;
     * F90 = metallicReflectanceColor;
     */
    accessor metallicF0Factor: number;
    /**
     * In metallic workflow, specifies an F0 color.
     * By default the F90 is always 1;
     *
     * Please note that this factor is also used as a factor against the default reflectance at normal incidence.
     *
     * F0 = defaultF0_from_IOR * metallicF0Factor * metallicReflectanceColor
     * F90 = metallicF0Factor;
     */
    accessor metallicReflectanceColor: Color3;
    /**
     * Specifies that only the A channel from metallicReflectanceTexture should be used.
     * If false, both RGB and A channels will be used
     */
    accessor useOnlyMetallicFromMetallicReflectanceTexture: boolean;
    /**
     * Defines to store metallicReflectanceColor in RGB and metallicF0Factor in A
     * This is multiplied against the scalar values defined in the material.
     * If useOnlyMetallicFromMetallicReflectanceTexture is true, don't use the RGB channels, only A
     */
    accessor metallicReflectanceTexture: Nullable<BaseTexture>;
    /**
     * Defines to store reflectanceColor in RGB
     * This is multiplied against the scalar values defined in the material.
     * If both reflectanceTexture and metallicReflectanceTexture textures are provided and useOnlyMetallicFromMetallicReflectanceTexture
     * is false, metallicReflectanceTexture takes priority and reflectanceTexture is not used
     */
    accessor reflectanceTexture: Nullable<BaseTexture>;
    /**
     * Used to enable roughness/glossiness fetch from a separate channel depending on the current mode.
     * Gray Scale represents roughness in metallic mode and glossiness in specular mode.
     */
    accessor microSurfaceTexture: Nullable<BaseTexture>;
    /**
     * Stores surface normal data used to displace a mesh in a texture.
     */
    accessor bumpTexture: Nullable<BaseTexture>;
    /**
     * Stores the pre-calculated light information of a mesh in a texture.
     */
    accessor lightmapTexture: Nullable<BaseTexture>;
    /**
     * Stores the refracted light information in a texture.
     */
    get refractionTexture(): Nullable<BaseTexture>;
    set refractionTexture(value: Nullable<BaseTexture>);
    /**
     * The color of a material in ambient lighting.
     */
    accessor ambientColor: Color3;
    /**
     * AKA Diffuse Color in other nomenclature.
     */
    accessor albedoColor: Color3;
    /**
     * OpenPBR Base Weight (multiplier to the diffuse and metal lobes).
     */
    accessor baseWeight: number;
    /**
     * OpenPBR Base Diffuse Roughness (roughness of the diffuse lobe).
     */
    accessor baseDiffuseRoughness: Nullable<number>;
    /**
     * AKA Specular Color in other nomenclature.
     */
    accessor reflectivityColor: Color3;
    /**
     * The color reflected from the material.
     */
    accessor reflectionColor: Color3;
    /**
     * The color emitted from the material.
     */
    accessor emissiveColor: Color3;
    /**
     * AKA Glossiness in other nomenclature.
     */
    accessor microSurface: number;
    /**
     * Index of refraction of the material base layer.
     * https://en.wikipedia.org/wiki/List_of_refractive_indices
     *
     * This does not only impact refraction but also the Base F0 of Dielectric Materials.
     *
     * From dielectric fresnel rules: F0 = square((iorT - iorI) / (iorT + iorI))
     */
    get indexOfRefraction(): number;
    set indexOfRefraction(value: number);
    /**
     * Controls if refraction needs to be inverted on Y. This could be useful for procedural texture.
     */
    get invertRefractionY(): boolean;
    set invertRefractionY(value: boolean);
    /**
     * This parameters will make the material used its opacity to control how much it is refracting against not.
     * Materials half opaque for instance using refraction could benefit from this control.
     */
    get linkRefractionWithTransparency(): boolean;
    set linkRefractionWithTransparency(value: boolean);
    /**
     * If true, the light map contains occlusion information instead of lighting info.
     */
    accessor useLightmapAsShadowmap: boolean;
    /**
     * Specifies that the alpha is coming form the albedo channel alpha channel for alpha blending.
     */
    accessor useAlphaFromAlbedoTexture: boolean;
    /**
     * Enforces alpha test in opaque or blend mode in order to improve the performances of some situations.
     */
    accessor forceAlphaTest: boolean;
    /**
     * Defines the alpha limits in alpha test mode.
     */
    accessor alphaCutOff: number;
    /**
     * Specifies that the material will keep the specular highlights over a transparent surface (only the most luminous ones).
     * A car glass is a good example of that. When sun reflects on it you can not see what is behind.
     */
    accessor useSpecularOverAlpha: boolean;
    /**
     * Specifies if the reflectivity texture contains the glossiness information in its alpha channel.
     */
    accessor useMicroSurfaceFromReflectivityMapAlpha: boolean;
    /**
     * Specifies if the metallic texture contains the roughness information in its alpha channel.
     */
    accessor useRoughnessFromMetallicTextureAlpha: boolean;
    /**
     * Specifies if the metallic texture contains the roughness information in its green channel.
     * Needs useRoughnessFromMetallicTextureAlpha to be false.
     */
    accessor useRoughnessFromMetallicTextureGreen: boolean;
    /**
     * Specifies if the metallic texture contains the metallness information in its blue channel.
     */
    accessor useMetallnessFromMetallicTextureBlue: boolean;
    /**
     * Specifies if the metallic texture contains the ambient occlusion information in its red channel.
     */
    accessor useAmbientOcclusionFromMetallicTextureRed: boolean;
    /**
     * Specifies if the ambient texture contains the ambient occlusion information in its red channel only.
     */
    accessor useAmbientInGrayScale: boolean;
    /**
     * In case the reflectivity map does not contain the microsurface information in its alpha channel,
     * The material will try to infer what glossiness each pixel should be.
     */
    accessor useAutoMicroSurfaceFromReflectivityMap: boolean;
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
     * Specifies that the material will keeps the reflection highlights over a transparent surface (only the most luminous ones).
     * A car glass is a good example of that. When the street lights reflects on it you can not see what is behind.
     */
    accessor useRadianceOverAlpha: boolean;
    /**
     * Allows using an object space normal map (instead of tangent space).
     */
    accessor useObjectSpaceNormalMap: boolean;
    /**
     * Allows using the bump map in parallax mode.
     */
    accessor useParallax: boolean;
    /**
     * Allows using the bump map in parallax occlusion mode.
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
     * Force the shader to compute irradiance in the fragment shader in order to take bump in account.
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
     * It also prefilter the roughness map based on the bump values.
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
     * Instantiates a new PBRMaterial instance.
     *
     * @param name The material name
     * @param scene The scene the material will be use in.
     * @param forceGLSL Use the GLSL code generation for the shader (even on WebGPU). Default is false
     */
    constructor(name: string, scene?: Scene, forceGLSL?: boolean);
    /**
     * @returns the name of this material class.
     */
    getClassName(): string;
    /**
     * Makes a duplicate of the current material.
     * @param name - name to use for the new material.
     * @param cloneTexturesOnlyOnce - if a texture is used in more than one channel (e.g diffuse and opacity), only clone it once and reuse it on the other channels. Default false.
     * @param rootUrl defines the root URL to use to load textures
     * @returns cloned material instance
     */
    clone(name: string, cloneTexturesOnlyOnce?: boolean, rootUrl?: string): PBRMaterial;
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
     * @returns - PBRMaterial
     */
    static Parse(source: any, scene: Scene, rootUrl: string): PBRMaterial;
}
/**
 * Register side effects for pbrMaterial.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterPbrMaterial(): void;
/**
 * Register side effects for PBRMaterial.
 * Safe to call multiple times; only the first call has an effect.
 * Alias for {@link RegisterPbrMaterial}.
 */
export declare function RegisterPBRMaterial(): void;
