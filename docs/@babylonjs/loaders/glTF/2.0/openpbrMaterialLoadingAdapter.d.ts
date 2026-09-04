import { type OpenPBRMaterial } from "@babylonjs/core/Materials/PBR/openpbrMaterial.js";
import { type Material } from "@babylonjs/core/Materials/material.js";
import { type BaseTexture } from "@babylonjs/core/Materials/Textures/baseTexture.js";
import { type Nullable } from "@babylonjs/core/types.js";
import { Color3 } from "@babylonjs/core/Maths/math.color.js";
import { type IMaterialLoadingAdapter } from "./materialLoadingAdapter.js";
import { type GLTFLoader } from "./glTFLoader.js";
/**
 * Material Loading Adapter for OpenPBR materials that provides a unified OpenPBR-like interface.
 */
export declare class OpenPBRMaterialLoadingAdapter implements IMaterialLoadingAdapter {
    private _material;
    private _specWorkflow;
    /**
     * Creates a new instance of the OpenPBRMaterialLoadingAdapter.
     * @param material - The OpenPBR material to adapt.
     */
    constructor(material: Material);
    /**
     * Gets the underlying material
     */
    get material(): OpenPBRMaterial;
    /**
     * Whether the material should be treated as unlit
     */
    get isUnlit(): boolean;
    /**
     * Sets whether the material should be treated as unlit
     */
    set isUnlit(value: boolean);
    /**
     * Sets whether back face culling is enabled.
     * @param value True to enable back face culling
     */
    set backFaceCulling(value: boolean);
    /**
     * Gets whether back face culling is enabled.
     * @returns True if back face culling is enabled
     */
    get backFaceCulling(): boolean;
    /**
     * Sets whether two-sided lighting is enabled.
     * @param value True to enable two-sided lighting
     */
    set twoSidedLighting(value: boolean);
    /**
     * Gets whether two-sided lighting is enabled.
     * @returns True if two-sided lighting is enabled
     */
    get twoSidedLighting(): boolean;
    /**
     * Sets the alpha cutoff value for alpha testing.
     * Note: OpenPBR doesn't have a direct equivalent, so this is a no-op.
     * @param value The alpha cutoff threshold (ignored for OpenPBR)
     */
    set alphaCutOff(value: number);
    /**
     * Gets the alpha cutoff value.
     * @returns Default value of 0.5 (OpenPBR doesn't support this directly)
     */
    get alphaCutOff(): number;
    /**
     * Sets whether to use alpha from the base color texture.
     * Note: OpenPBR handles this differently through the baseColorTexture alpha channel.
     * @param value True to use alpha from base color texture (handled automatically in OpenPBR)
     */
    set useAlphaFromBaseColorTexture(value: boolean);
    /**
     * Gets whether alpha is used from the base color texture.
     * @returns True if alpha is used from the base color texture
     */
    get useAlphaFromBaseColorTexture(): boolean;
    /**
     * Gets whether the transparency is treated as alpha coverage.
     */
    get transparencyAsAlphaCoverage(): boolean;
    /**
     * Sets/Gets whether the transparency is treated as alpha coverage
     */
    set transparencyAsAlphaCoverage(value: boolean);
    /**
     * Sets the base color of the OpenPBR material.
     * @param value The base color as a Color3
     */
    set baseColor(value: Color3);
    /**
     * Gets the base color of the OpenPBR material.
     * @returns The base color as a Color3
     */
    get baseColor(): Color3;
    /**
     * Sets the base color texture of the OpenPBR material.
     * @param value The base color texture or null
     */
    set baseColorTexture(value: Nullable<BaseTexture>);
    /**
     * Gets the base color texture of the OpenPBR material.
     * @returns The base color texture or null
     */
    get baseColorTexture(): Nullable<BaseTexture>;
    /**
     * Sets the base diffuse roughness of the OpenPBR material.
     * @param value The diffuse roughness value (0-1)
     */
    set baseDiffuseRoughness(value: number);
    /**
     * Gets the base diffuse roughness of the OpenPBR material.
     * @returns The diffuse roughness value (0-1)
     */
    get baseDiffuseRoughness(): number;
    /**
     * Sets the base diffuse roughness texture of the OpenPBR material.
     * @param value The diffuse roughness texture or null
     */
    set baseDiffuseRoughnessTexture(value: Nullable<BaseTexture>);
    /**
     * Gets the base diffuse roughness texture of the OpenPBR material.
     * @returns The diffuse roughness texture or null
     */
    get baseDiffuseRoughnessTexture(): Nullable<BaseTexture>;
    /**
     * Sets the base metalness value of the OpenPBR material.
     * @param value The metalness value (0-1)
     */
    set baseMetalness(value: number);
    /**
     * Gets the base metalness value of the OpenPBR material.
     * @returns The metalness value (0-1)
     */
    get baseMetalness(): number;
    /**
     * Sets the base metalness texture of the OpenPBR material.
     * @param value The metalness texture or null
     */
    set baseMetalnessTexture(value: Nullable<BaseTexture>);
    /**
     * Gets the base metalness texture of the OpenPBR material.
     * @returns The metalness texture or null
     */
    get baseMetalnessTexture(): Nullable<BaseTexture>;
    /**
     * Sets whether to use roughness from the metallic texture's green channel.
     * @param value True to use green channel for roughness
     */
    set useRoughnessFromMetallicTextureGreen(value: boolean);
    /**
     * Sets whether to use metalness from the metallic texture's blue channel.
     * @param value True to use blue channel for metalness
     */
    set useMetallicFromMetallicTextureBlue(value: boolean);
    /**
     * Configures specular properties for OpenPBR material.
     * @param _enableEdgeColor Whether to enable edge color support (ignored for OpenPBR)
     */
    enableSpecularEdgeColor(_enableEdgeColor?: boolean): void;
    configureSpecularGlossiness(): void;
    /**
     * Sets the specular weight of the OpenPBR material.
     * @param value The specular weight value (0-1)
     */
    set specularWeight(value: number);
    /**
     * Gets the specular weight of the OpenPBR material.
     * @returns The specular weight value (0-1)
     */
    get specularWeight(): number;
    /**
     * Sets the specular weight texture of the OpenPBR material.
     * If the same texture is used for specular color, optimizes by using alpha channel for weight.
     * @param value The specular weight texture or null
     */
    set specularWeightTexture(value: Nullable<BaseTexture>);
    /**
     * Gets the specular weight texture of the OpenPBR material.
     * @returns The specular weight texture or null
     */
    get specularWeightTexture(): Nullable<BaseTexture>;
    /**
     * Sets the specular color of the OpenPBR material.
     * @param value The specular color as a Color3
     */
    set specularColor(value: Color3);
    /**
     * Gets the specular color of the OpenPBR material.
     * @returns The specular color as a Color3
     */
    get specularColor(): Color3;
    /**
     * Sets the specular color texture of the OpenPBR material.
     * If the same texture is used for specular weight, optimizes by using alpha channel for weight.
     * @param value The specular color texture or null
     */
    set specularColorTexture(value: Nullable<BaseTexture>);
    /**
     * Gets the specular color texture of the OpenPBR material.
     * @returns The specular color texture or null
     */
    get specularColorTexture(): Nullable<BaseTexture>;
    /**
     * Sets the specular roughness of the OpenPBR material.
     * @param value The roughness value (0-1)
     */
    set specularRoughness(value: number);
    /**
     * Gets the specular roughness of the OpenPBR material.
     * @returns The roughness value (0-1)
     */
    get specularRoughness(): number;
    /**
     * Sets the specular roughness texture of the OpenPBR material.
     * @param value The roughness texture or null
     */
    set specularRoughnessTexture(value: Nullable<BaseTexture>);
    /**
     * Gets the specular roughness texture of the OpenPBR material.
     * @returns The roughness texture or null
     */
    get specularRoughnessTexture(): Nullable<BaseTexture>;
    /**
     * Sets the specular index of refraction (IOR) of the OpenPBR material.
     * @param value The IOR value
     */
    set specularIor(value: number);
    /**
     * Gets the specular index of refraction (IOR) of the OpenPBR material.
     * @returns The IOR value
     */
    get specularIor(): number;
    /**
     * Sets the glossiness (inverted roughness) of the OpenPBR material.
     */
    set glossiness(value: number);
    get glossiness(): number;
    /**
     * Sets the emission color of the OpenPBR material.
     * @param value The emission color as a Color3
     */
    set emissionColor(value: Color3);
    /**
     * Gets the emission color of the OpenPBR material.
     * @returns The emission color as a Color3
     */
    get emissionColor(): Color3;
    /**
     * Sets the emission luminance of the OpenPBR material.
     * @param value The emission luminance value
     */
    set emissionLuminance(value: number);
    /**
     * Gets the emission luminance of the OpenPBR material.
     * @returns The emission luminance value
     */
    get emissionLuminance(): number;
    /**
     * Sets the emission color texture of the OpenPBR material.
     * @param value The emission texture or null
     */
    set emissionColorTexture(value: Nullable<BaseTexture>);
    /**
     * Gets the emission color texture of the OpenPBR material.
     * @returns The emission texture or null
     */
    get emissionColorTexture(): Nullable<BaseTexture>;
    /**
     * Sets the ambient occlusion texture of the OpenPBR material.
     * @param value The ambient occlusion texture or null
     */
    set ambientOcclusionTexture(value: Nullable<BaseTexture>);
    /**
     * Gets the ambient occlusion texture of the OpenPBR material.
     * @returns The ambient occlusion texture or null
     */
    get ambientOcclusionTexture(): Nullable<BaseTexture>;
    /**
     * Sets the ambient occlusion texture strength by modifying the texture's level.
     * @param value The strength value (typically 0-1)
     */
    set ambientOcclusionTextureStrength(value: number);
    /**
     * Gets the ambient occlusion texture strength from the texture's level property.
     * @returns The strength value, defaults to 1.0 if no texture or level is set
     */
    get ambientOcclusionTextureStrength(): number;
    /**
     * Configures coat parameters for OpenPBR material.
     * OpenPBR coat is already built-in, so no configuration is needed.
     */
    configureCoat(): void;
    /**
     * Sets the coat weight of the OpenPBR material.
     * @param value The coat weight value (0-1)
     */
    set coatWeight(value: number);
    /**
     * Gets the coat weight of the OpenPBR material.
     * @returns The coat weight value (0-1)
     */
    get coatWeight(): number;
    /**
     * Sets the coat weight texture of the OpenPBR material.
     * @param value The coat weight texture or null
     */
    set coatWeightTexture(value: Nullable<BaseTexture>);
    /**
     * Gets the coat weight texture of the OpenPBR material.
     * @returns The coat weight texture or null
     */
    get coatWeightTexture(): Nullable<BaseTexture>;
    /**
     * Sets the coat color of the OpenPBR material.
     * @param value The coat color as a Color3
     */
    set coatColor(value: Color3);
    /**
     * Gets the coat color of the OpenPBR material.
     */
    get coatColor(): Color3;
    /**
     * Sets the coat color texture of the OpenPBR material.
     * @param value The coat color texture or null
     */
    set coatColorTexture(value: Nullable<BaseTexture>);
    /**
     * Sets the coat roughness of the OpenPBR material.
     * @param value The coat roughness value (0-1)
     */
    set coatRoughness(value: number);
    /**
     * Gets the coat roughness of the OpenPBR material.
     * @returns The coat roughness value (0-1)
     */
    get coatRoughness(): number;
    /**
     * Sets the coat roughness texture of the OpenPBR material.
     * @param value The coat roughness texture or null
     */
    set coatRoughnessTexture(value: Nullable<BaseTexture>);
    /**
     * Gets the coat roughness texture of the OpenPBR material.
     * @returns The coat roughness texture or null
     */
    get coatRoughnessTexture(): Nullable<BaseTexture>;
    /**
     * Sets the coat index of refraction (IOR) of the OpenPBR material.
     */
    set coatIor(value: number);
    get coatIor(): number;
    /**
     * Sets the coat darkening value of the OpenPBR material.
     * @param value The coat darkening value
     */
    set coatDarkening(value: number);
    get coatDarkening(): number;
    /**
     * Sets the coat darkening texture (OpenPBR: coatDarkeningTexture, no PBR equivalent)
     */
    set coatDarkeningTexture(value: Nullable<BaseTexture>);
    /**
     * Sets the coat roughness anisotropy.
     * TODO: Implementation pending OpenPBR coat anisotropy feature availability.
     * @param value The coat anisotropy intensity value
     */
    set coatRoughnessAnisotropy(value: number);
    /**
     * Gets the coat roughness anisotropy.
     * TODO: Implementation pending OpenPBR coat anisotropy feature availability.
     * @returns Currently returns 0 as coat anisotropy is not yet available
     */
    get coatRoughnessAnisotropy(): number;
    /**
     * Sets the coat tangent angle for anisotropy.
     * TODO: Implementation pending OpenPBR coat anisotropy feature availability.
     * @param value The coat anisotropy rotation angle in radians
     */
    set geometryCoatTangentAngle(value: number);
    /**
     * Sets the coat tangent texture for anisotropy.
     * TODO: Implementation pending OpenPBR coat anisotropy feature availability.
     * @param value The coat anisotropy texture or null
     */
    set geometryCoatTangentTexture(value: Nullable<BaseTexture>);
    /**
     * Gets the coat tangent texture for anisotropy.
     * TODO: Implementation pending OpenPBR coat anisotropy feature availability.
     * @returns Currently returns null as coat anisotropy is not yet available
     */
    get geometryCoatTangentTexture(): Nullable<BaseTexture>;
    /**
     * Configures transmission for OpenPBR material.
     */
    configureTransmission(): void;
    /**
     * Sets the transmission weight.
     * @param value The transmission weight value (0-1)
     */
    set transmissionWeight(value: number);
    /**
     * Sets the transmission weight texture.
     * @param value The transmission weight texture or null
     */
    set transmissionWeightTexture(value: Nullable<BaseTexture>);
    get transmissionWeightTexture(): Nullable<BaseTexture>;
    /**
     * Gets the transmission weight.
     * @returns Currently returns 0 as transmission is not yet available
     */
    get transmissionWeight(): number;
    /**
     * Sets the transmission scatter coefficient.
     * @param value The scatter coefficient as a Vector3
     */
    set transmissionScatter(value: Color3);
    /**
     * Gets the transmission scatter coefficient.
     * @returns The scatter coefficient as a Vector3
     */
    get transmissionScatter(): Color3;
    /**
     * Sets the transmission scatter texture.
     * @param value The transmission scatter texture or null
     */
    set transmissionScatterTexture(value: Nullable<BaseTexture>);
    /**
     * Gets the transmission scatter texture.
     * @returns The transmission scatter texture or null
     */
    get transmissionScatterTexture(): Nullable<BaseTexture>;
    /**
     * Sets the transmission scattering anisotropy.
     * @param value The anisotropy intensity value (-1 to 1)
     */
    set transmissionScatterAnisotropy(value: number);
    /**
     * Sets the transmission dispersion Abbe number.
     * @param value The Abbe number value
     */
    set transmissionDispersionAbbeNumber(value: number);
    /**
     * Sets the transmission dispersion scale.
     * @param value The dispersion scale value
     */
    set transmissionDispersionScale(value: number);
    /**
     * Sets the attenuation distance.
     * @param value The attenuation distance value
     */
    set transmissionDepth(value: number);
    /**
     * Gets the attenuation distance.
     */
    get transmissionDepth(): number;
    /**
     * Sets the attenuation color.
     * @param value The attenuation color as a Color3
     */
    set transmissionColor(value: Color3);
    /**
     * Gets the attenuation color.
     */
    get transmissionColor(): Color3;
    /**
     * Gets the refraction background texture
     * @returns The refraction background texture or null
     */
    get refractionBackgroundTexture(): Nullable<BaseTexture>;
    /**
     * Sets the refraction background texture
     * @param value The refraction background texture or null
     */
    set refractionBackgroundTexture(value: Nullable<BaseTexture>);
    /**
     * Configures volume properties for OpenPBR material.
     */
    configureVolume(): void;
    /**
     * Sets whether the material is thin-walled (i.e. non-volumetric) or not.
     */
    set geometryThinWalled(value: boolean);
    /**
     * Gets whether the material is thin-walled (i.e. non-volumetric) or not.
     */
    get geometryThinWalled(): boolean;
    /**
     * Sets the thickness texture.
     * @param value The thickness texture or null
     */
    set volumeThicknessTexture(value: Nullable<BaseTexture>);
    /**
     * Sets the thickness factor.
     * @param value The thickness value
     */
    set volumeThickness(value: number);
    /**
     * Configures subsurface properties for PBR material
     */
    configureSubsurface(): void;
    /**
     * Sets the subsurface weight
     */
    set subsurfaceWeight(value: number);
    get subsurfaceWeight(): number;
    /**
     * Sets the subsurface weight texture
     */
    set subsurfaceWeightTexture(value: Nullable<BaseTexture>);
    get subsurfaceWeightTexture(): Nullable<BaseTexture>;
    /**
     * Sets the subsurface color.
     * @param value The subsurface tint color as a Color3
     */
    set subsurfaceColor(value: Color3);
    /**
     * Sets the subsurface color texture.
     * @param value The subsurface tint texture or null
     */
    set subsurfaceColorTexture(value: Nullable<BaseTexture>);
    private _diffuseTransmissionTint;
    private _diffuseTransmissionTintTexture;
    /**
     * Sets the diffuse transmission tint of the material
     */
    set diffuseTransmissionTint(value: Color3);
    /**
     * Gets the diffuse transmission tint of the material
     */
    get diffuseTransmissionTint(): Color3;
    /**
     * Sets the diffuse transmission tint texture of the material
     */
    set diffuseTransmissionTintTexture(value: Nullable<BaseTexture>);
    /**
     * Gets the subsurface radius for subsurface scattering.
     * subsurfaceRadiusScale * subsurfaceRadius gives the mean free path per color channel.
     */
    get subsurfaceRadius(): number;
    /**
     * Sets the subsurface radius for subsurface scattering.
     * subsurfaceRadiusScale * subsurfaceRadius gives the mean free path per color channel.
     * @param value The subsurface radius value
     */
    set subsurfaceRadius(value: number);
    /**
     * Gets the subsurface radius scale for subsurface scattering.
     * subsurfaceRadiusScale * subsurfaceRadius gives the mean free path per color channel.
     */
    get subsurfaceRadiusScale(): Color3;
    /**
     * Sets the subsurface radius scale for subsurface scattering.
     * subsurfaceRadiusScale * subsurfaceRadius gives the mean free path per color channel.
     * @param value The subsurface radius scale as a Color3
     */
    set subsurfaceRadiusScale(value: Color3);
    /**
     * Sets the subsurface scattering anisotropy.
     * @param value The anisotropy intensity value
     */
    set subsurfaceScatterAnisotropy(value: number);
    /**
     * Does this material have a translucent surface (i.e. either transmission or subsurface)?
     * @returns True if the material is translucent, false otherwise
     */
    isTranslucent(): boolean;
    /**
     * Configures fuzz for OpenPBR.
     * Enables fuzz and sets up proper configuration.
     */
    configureFuzz(): void;
    /**
     * Sets the fuzz weight.
     * @param value The fuzz weight value
     */
    set fuzzWeight(value: number);
    /**
     * Sets the fuzz weight texture.
     * @param value The fuzz weight texture or null
     */
    set fuzzWeightTexture(value: Nullable<BaseTexture>);
    /**
     * Sets the fuzz color.
     * @param value The fuzz color as a Color3
     */
    set fuzzColor(value: Color3);
    /**
     * Sets the fuzz color texture.
     * @param value The fuzz color texture or null
     */
    set fuzzColorTexture(value: Nullable<BaseTexture>);
    /**
     * Sets the fuzz roughness.
     * @param value The fuzz roughness value (0-1)
     */
    set fuzzRoughness(value: number);
    /**
     * Sets the fuzz roughness texture.
     * @param value The fuzz roughness texture or null
     */
    set fuzzRoughnessTexture(value: Nullable<BaseTexture>);
    /**
     * Sets the specular roughness anisotropy of the OpenPBR material.
     * @param value The anisotropy intensity value
     */
    set specularRoughnessAnisotropy(value: number);
    /**
     * Gets the specular roughness anisotropy of the OpenPBR material.
     * @returns The anisotropy intensity value
     */
    get specularRoughnessAnisotropy(): number;
    /**
     * Sets the anisotropy rotation angle.
     * @param value The anisotropy rotation angle in radians
     */
    set geometryTangentAngle(value: number);
    /**
     * Sets the geometry tangent texture for anisotropy.
     * Automatically enables using anisotropy from the tangent texture.
     * @param value The anisotropy texture or null
     */
    set geometryTangentTexture(value: Nullable<BaseTexture>);
    /**
     * Gets the geometry tangent texture for anisotropy.
     * @returns The anisotropy texture or null
     */
    get geometryTangentTexture(): Nullable<BaseTexture>;
    /**
     * Configures glTF-style anisotropy for the OpenPBR material.
     * @param useGltfStyle Whether to use glTF-style anisotropy
     */
    configureGltfStyleAnisotropy(useGltfStyle?: boolean): void;
    /**
     * Sets the thin film weight.
     * @param value The thin film weight value
     */
    set thinFilmWeight(value: number);
    /**
     * Sets the thin film IOR.
     * @param value The thin film IOR value
     */
    set thinFilmIor(value: number);
    /**
     * Sets the thin film thickness minimum.
     * @param value The minimum thickness value in nanometers
     */
    set thinFilmThicknessMinimum(value: number);
    /**
     * Sets the thin film thickness maximum.
     * @param value The maximum thickness value in nanometers
     */
    set thinFilmThicknessMaximum(value: number);
    /**
     * Sets the thin film weight texture.
     * @param value The thin film weight texture or null
     */
    set thinFilmWeightTexture(value: Nullable<BaseTexture>);
    /**
     * Sets the thin film thickness texture.
     * @param value The thin film thickness texture or null
     */
    set thinFilmThicknessTexture(value: Nullable<BaseTexture>);
    /**
     * Sets whether the OpenPBR material is unlit.
     * @param value True to make the material unlit
     */
    set unlit(value: boolean);
    /**
     * Sets the geometry opacity of the OpenPBR material.
     * @param value The opacity value (0-1)
     */
    set geometryOpacity(value: number);
    /**
     * Gets the geometry opacity of the OpenPBR material.
     * @returns The opacity value (0-1)
     */
    get geometryOpacity(): number;
    /**
     * Sets the geometry normal texture of the OpenPBR material.
     * @param value The normal texture or null
     */
    set geometryNormalTexture(value: Nullable<BaseTexture>);
    /**
     * Gets the geometry normal texture of the OpenPBR material.
     * @returns The normal texture or null
     */
    get geometryNormalTexture(): Nullable<BaseTexture>;
    /**
     * Sets the normal map inversions for the OpenPBR material.
     * Note: OpenPBR may handle normal map inversions differently or may not need them.
     * @param invertX Whether to invert the normal map on the X axis (may be ignored)
     * @param invertY Whether to invert the normal map on the Y axis (may be ignored)
     */
    setNormalMapInversions(invertX: boolean, invertY: boolean): void;
    /**
     * Sets the geometry coat normal texture of the OpenPBR material.
     * @param value The coat normal texture or null
     */
    set geometryCoatNormalTexture(value: Nullable<BaseTexture>);
    /**
     * Gets the geometry coat normal texture of the OpenPBR material.
     * @returns The coat normal texture or null
     */
    get geometryCoatNormalTexture(): Nullable<BaseTexture>;
    /**
     * Sets the geometry coat normal texture scale.
     * @param value The scale value for the coat normal texture
     */
    set geometryCoatNormalTextureScale(value: number);
    /**
     * Finalizes material properties after all loading is complete.
     * @param loader The glTF loader; `loader._disposed` is polled between texture passes to bail early on dispose.
     */
    finalizeAsync(loader: GLTFLoader): Promise<void>;
    private copySurfaceToCoatAsync;
}
