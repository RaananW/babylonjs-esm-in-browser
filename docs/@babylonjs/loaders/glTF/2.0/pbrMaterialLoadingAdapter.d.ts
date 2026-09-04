import { type PBRMaterial } from "@babylonjs/core/Materials/PBR/pbrMaterial.js";
import { type Material } from "@babylonjs/core/Materials/material.js";
import { type BaseTexture } from "@babylonjs/core/Materials/Textures/baseTexture.js";
import { type Nullable } from "@babylonjs/core/types.js";
import { Color3 } from "@babylonjs/core/Maths/math.color.pure.js";
import { type IMaterialLoadingAdapter } from "./materialLoadingAdapter.js";
import { type GLTFLoader } from "./glTFLoader.js";
/**
 * Material Loading Adapter for PBR materials that provides a unified OpenPBR-like interface.
 */
export declare class PBRMaterialLoadingAdapter implements IMaterialLoadingAdapter {
    private _material;
    private _specWorkflow;
    /**
     * Creates a new instance of the PBRMaterialLoadingAdapter.
     * @param material - The PBR material to adapt.
     */
    constructor(material: Material);
    /**
     * Gets the underlying material
     */
    get material(): PBRMaterial;
    /**
     * No-op: PBRMaterial has no deferred finalization.
     * @param _loader Unused.
     */
    finalizeAsync(_loader: GLTFLoader): Promise<void>;
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
     * @param value The alpha cutoff threshold (0-1)
     */
    set alphaCutOff(value: number);
    /**
     * Gets the alpha cutoff value.
     * @returns The alpha cutoff threshold (0-1)
     */
    get alphaCutOff(): number;
    /**
     * Sets whether to use alpha from the albedo texture.
     * @param value True to use alpha from albedo texture
     */
    set useAlphaFromBaseColorTexture(value: boolean);
    /**
     * Gets whether alpha is used from the albedo texture.
     * @returns True if using alpha from albedo texture
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
     * Sets the base color of the material (mapped to PBR albedoColor).
     * @param value The base color as a Color3
     */
    set baseColor(value: Color3);
    /**
     * Gets the base color of the material.
     * @returns The base color as a Color3
     */
    get baseColor(): Color3;
    /**
     * Sets the base color texture of the material (mapped to PBR albedoTexture).
     * @param value The base color texture or null
     */
    set baseColorTexture(value: Nullable<BaseTexture>);
    /**
     * Gets the base color texture of the material.
     * @returns The base color texture or null
     */
    get baseColorTexture(): Nullable<BaseTexture>;
    /**
     * Sets the base diffuse roughness of the material.
     * @param value The diffuse roughness value (0-1)
     */
    set baseDiffuseRoughness(value: number);
    /**
     * Gets the base diffuse roughness of the material.
     * @returns The diffuse roughness value (0-1), defaults to 0 if not set
     */
    get baseDiffuseRoughness(): number;
    /**
     * Sets the base diffuse roughness texture of the material.
     * @param value The diffuse roughness texture or null
     */
    set baseDiffuseRoughnessTexture(value: Nullable<BaseTexture>);
    /**
     * Gets the base diffuse roughness texture of the material.
     * @returns The diffuse roughness texture or null
     */
    get baseDiffuseRoughnessTexture(): Nullable<BaseTexture>;
    /**
     * Sets the base metalness value of the material (mapped to PBR metallic).
     * @param value The metalness value (0-1)
     */
    set baseMetalness(value: number);
    /**
     * Gets the base metalness value of the material.
     * @returns The metalness value (0-1), defaults to 1 if not set
     */
    get baseMetalness(): number;
    /**
     * Sets the base metalness texture of the material (mapped to PBR metallicTexture).
     * @param value The metalness texture or null
     */
    set baseMetalnessTexture(value: Nullable<BaseTexture>);
    /**
     * Gets the base metalness texture of the material.
     * @returns The metalness texture or null
     */
    get baseMetalnessTexture(): Nullable<BaseTexture>;
    /**
     * Sets whether to use roughness from the metallic texture's green channel.
     * Also disables using roughness from the alpha channel when enabled.
     * @param value True to use green channel for roughness
     */
    set useRoughnessFromMetallicTextureGreen(value: boolean);
    /**
     * Sets whether to use metalness from the metallic texture's blue channel.
     * @param value True to use blue channel for metalness
     */
    set useMetallicFromMetallicTextureBlue(value: boolean);
    /**
     * Configures specular properties and optionally enables OpenPBR BRDF model for edge color support.
     * @param enableEdgeColor Whether to enable OpenPBR BRDF models for edge color support
     */
    enableSpecularEdgeColor(enableEdgeColor?: boolean): void;
    /**
     * Enable the specular/glossiness workflow and disable metallic/roughness.
     */
    configureSpecularGlossiness(): void;
    /**
     * Sets the specular weight (mapped to PBR metallicF0Factor).
     * @param value The specular weight value
     */
    set specularWeight(value: number);
    /**
     * Gets the specular weight.
     * @returns The specular weight value, defaults to 1 if not set
     */
    get specularWeight(): number;
    /**
     * Sets the specular weight texture (mapped to PBR metallicReflectanceTexture).
     * Configures the material to use only metalness from this texture when set.
     * @param value The specular weight texture or null
     */
    set specularWeightTexture(value: Nullable<BaseTexture>);
    /**
     * Gets the specular weight texture.
     * @returns The specular weight texture or null
     */
    get specularWeightTexture(): Nullable<BaseTexture>;
    /**
     * Sets the specular color (mapped to PBR metallicReflectanceColor).
     * @param value The specular color as a Color3
     */
    set specularColor(value: Color3);
    /**
     * Gets the specular color.
     * @returns The specular color as a Color3
     */
    get specularColor(): Color3;
    /**
     * Sets the specular color texture (mapped to PBR reflectanceTexture).
     * @param value The specular color texture or null
     */
    set specularColorTexture(value: Nullable<BaseTexture>);
    /**
     * Gets the specular color texture.
     * @returns The specular color texture or null
     */
    get specularColorTexture(): Nullable<BaseTexture>;
    /**
     * Sets the specular roughness (mapped to PBR roughness).
     * @param value The roughness value (0-1)
     */
    set specularRoughness(value: number);
    /**
     * Gets the specular roughness.
     * @returns The roughness value (0-1), defaults to 1 if not set
     */
    get specularRoughness(): number;
    /**
     * Sets the specular roughness texture.
     * Note: PBR uses the same texture for both metallic and roughness,
     * so this only sets the texture if no base metalness texture exists.
     * @param value The roughness texture or null
     */
    set specularRoughnessTexture(value: Nullable<BaseTexture>);
    /**
     * Gets the specular roughness texture.
     * @returns The roughness texture (same as metallic texture for PBR) or null
     */
    get specularRoughnessTexture(): Nullable<BaseTexture>;
    /**
     * Sets the specular index of refraction (mapped to PBR indexOfRefraction).
     * @param value The IOR value
     */
    set specularIor(value: number);
    /**
     * Gets the specular index of refraction.
     * @returns The IOR value
     */
    get specularIor(): number;
    /**
     * Sets/gets the glossiness (inverted roughness)
     * ONLY used for specular/glossiness workflow; has no effect when metallic/roughness workflow is active
     */
    get glossiness(): number;
    /**
     * Sets/gets the glossiness (inverted roughness)
     * ONLY used for specular/glossiness workflow; has no effect when metallic/roughness workflow is active
     */
    set glossiness(value: number);
    /**
     * Sets the emission color (mapped to PBR emissiveColor).
     * @param value The emission color as a Color3
     */
    set emissionColor(value: Color3);
    /**
     * Gets the emission color.
     * @returns The emission color as a Color3
     */
    get emissionColor(): Color3;
    /**
     * Sets the emission luminance/intensity (mapped to PBR emissiveIntensity).
     * @param value The emission intensity value
     */
    set emissionLuminance(value: number);
    /**
     * Gets the emission luminance/intensity.
     * @returns The emission intensity value
     */
    get emissionLuminance(): number;
    /**
     * Sets the emission color texture (mapped to PBR emissiveTexture).
     * @param value The emission texture or null
     */
    set emissionColorTexture(value: Nullable<BaseTexture>);
    /**
     * Gets the emission color texture.
     * @returns The emission texture or null
     */
    get emissionColorTexture(): Nullable<BaseTexture>;
    /**
     * Sets the ambient occlusion texture (mapped to PBR ambientTexture).
     * Automatically enables grayscale mode when set.
     * @param value The ambient occlusion texture or null
     */
    set ambientOcclusionTexture(value: Nullable<BaseTexture>);
    /**
     * Gets the ambient occlusion texture.
     * @returns The ambient occlusion texture or null
     */
    get ambientOcclusionTexture(): Nullable<BaseTexture>;
    /**
     * Sets the ambient occlusion texture strength.
     * @param value The strength value (typically 0-1)
     */
    set ambientOcclusionTextureStrength(value: number);
    /**
     * Gets the ambient occlusion texture strength.
     * @returns The strength value, defaults to 1.0 if not set
     */
    get ambientOcclusionTextureStrength(): number;
    /**
     * Configures clear coat for PBR material.
     * Enables clear coat and sets up proper configuration.
     */
    configureCoat(): void;
    /**
     * Sets the coat weight (mapped to PBR clearCoat.intensity).
     * Automatically enables clear coat.
     * @param value The coat weight value (0-1)
     */
    set coatWeight(value: number);
    /**
     * Gets the coat weight.
     * @returns The coat weight value
     */
    get coatWeight(): number;
    /**
     * Sets the coat weight texture (mapped to PBR clearCoat.texture).
     * Automatically enables clear coat.
     * @param value The coat weight texture or null
     */
    set coatWeightTexture(value: Nullable<BaseTexture>);
    /**
     * Gets the coat weight texture.
     * @returns The coat weight texture or null
     */
    get coatWeightTexture(): Nullable<BaseTexture>;
    /**
     * Sets the coat color (mapped to PBR clearCoat.tintColor).
     * @param value The coat tint color as a Color3
     */
    set coatColor(value: Color3);
    /**
     * Sets the coat color texture (mapped to PBR clearCoat.tintTexture).
     * @param value The coat color texture or null
     */
    set coatColorTexture(value: Nullable<BaseTexture>);
    /**
     * Sets the coat roughness (mapped to PBR clearCoat.roughness).
     * Automatically enables clear coat.
     * @param value The coat roughness value (0-1)
     */
    set coatRoughness(value: number);
    /**
     * Gets the coat roughness.
     * @returns The coat roughness value, defaults to 0 if not set
     */
    get coatRoughness(): number;
    /**
     * Sets the coat roughness texture (mapped to PBR clearCoat.textureRoughness).
     * Automatically enables clear coat and disables using roughness from main texture.
     * @param value The coat roughness texture or null
     */
    set coatRoughnessTexture(value: Nullable<BaseTexture>);
    /**
     * Gets the coat roughness texture.
     * @returns The coat roughness texture or null
     */
    get coatRoughnessTexture(): Nullable<BaseTexture>;
    /**
     * Sets the coat index of refraction (IOR).
     */
    set coatIor(value: number);
    /**
     * Sets the coat darkening value.
     * Note: PBR doesn't have a direct coat darkening property, so this is a no-op.
     * @param value The coat darkening value (ignored for PBR)
     */
    set coatDarkening(value: number);
    /**
     * Sets the coat darkening texture
     * @param value The coat darkening texture or null
     */
    set coatDarkeningTexture(value: Nullable<BaseTexture>);
    /**
     * Sets the coat roughness anisotropy.
     * Note: PBR clearCoat doesn't support anisotropy yet, so this is a placeholder.
     * @param value The coat anisotropy intensity value (currently ignored)
     */
    set coatRoughnessAnisotropy(value: number);
    /**
     * Gets the coat roughness anisotropy.
     * Note: PBR clearCoat doesn't support anisotropy yet, so this returns 0.
     * @returns Currently returns 0 as clearCoat anisotropy is not yet available
     */
    get coatRoughnessAnisotropy(): number;
    /**
     * Sets the coat tangent angle for anisotropy.
     * Note: PBR clearCoat doesn't support anisotropy yet, so this is a placeholder.
     * @param value The coat anisotropy rotation angle in radians (currently ignored)
     */
    set geometryCoatTangentAngle(value: number);
    /**
     * Sets the coat tangent texture for anisotropy.
     * Note: PBR clearCoat doesn't support anisotropy textures yet, so this is a placeholder.
     * @param value The coat anisotropy texture (currently ignored)
     */
    set geometryCoatTangentTexture(value: Nullable<BaseTexture>);
    /**
     * Gets the coat tangent texture for anisotropy.
     * Note: PBR clearCoat doesn't support anisotropy textures yet, so this returns null.
     * @returns Currently returns null as clearCoat anisotropy is not yet available
     */
    get geometryCoatTangentTexture(): Nullable<BaseTexture>;
    /**
     * Sets the transmission weight (mapped to PBR subSurface.refractionIntensity).
     * Enables refraction when value \> 0.
     * @param value The transmission weight value (0-1)
     */
    set transmissionWeight(value: number);
    /**
     * Gets the transmission weight.
     * @returns The transmission weight value
     */
    get transmissionWeight(): number;
    /**
     * Sets the transmission weight texture (mapped to PBR subSurface.refractionIntensityTexture).
     * Automatically enables refraction and glTF-style textures.
     * @param value The transmission weight texture or null
     */
    set transmissionWeightTexture(value: Nullable<BaseTexture>);
    /**
     * Sets the attenuation distance for volume.
     * @param value The attenuation distance value
     */
    set transmissionDepth(value: number);
    /**
     * Gets the attenuation distance for volume.
     * @returns The attenuation distance value
     */
    get transmissionDepth(): number;
    /**
     * Sets the attenuation color (mapped to PBR subSurface.tintColor).
     * @param value The attenuation color as a Color3
     */
    set transmissionColor(value: Color3);
    /**
     * Sets the attenuation color (mapped to PBR subSurface.tintColor).
     * @returns The attenuation color as a Color3
     */
    get transmissionColor(): Color3;
    /**
     * Sets the transmission scatter coefficient.
     * @param value The scatter coefficient as a Color3
     */
    set transmissionScatter(value: Color3);
    /**
     * Sets the transmission scatter coefficient.
     * @returns The scatter coefficient as a Color3
     */
    get transmissionScatter(): Color3;
    set transmissionScatterTexture(value: Nullable<BaseTexture>);
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
     * Configures transmission for thin-surface transmission (KHR_materials_transmission).
     * Sets up the material for proper thin-surface transmission behavior.
     */
    configureTransmission(): void;
    /**
     * Configures volume properties for PBR material. Nothing to do for PBRMaterial.
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
     * Sets the thickness texture (mapped to PBR subSurface.thicknessTexture).
     * Automatically enables refraction.
     * @param value The thickness texture or null
     */
    set volumeThicknessTexture(value: Nullable<BaseTexture>);
    /**
     * Sets the thickness factor (mapped to PBR subSurface.maximumThickness).
     * Automatically enables refraction.
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
    /**
     * Gets the subsurface weight
     * @returns The subsurface weight value
     */
    get subsurfaceWeight(): number;
    /**
     * Sets the subsurface weight texture
     */
    set subsurfaceWeightTexture(value: Nullable<BaseTexture>);
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
    /**
     * Sets the surface tint of the material (when using subsurface scattering)
     */
    set diffuseTransmissionTint(value: Color3);
    /**
     * Gets the subsurface constant tint (when using subsurface scattering)
     * @returns The subsurface constant tint as a Color3
     */
    get diffuseTransmissionTint(): Color3;
    /**
     * Sets the subsurface constant tint texture (when using subsurface scattering)
     * @param value The subsurface constant tint texture or null
     */
    set diffuseTransmissionTintTexture(value: Nullable<BaseTexture>);
    /**
     * Gets the subsurface radius (used for subsurface scattering)
     * subsurfaceRadiusScale * subsurfaceRadius gives the mean free path per color channel.
     * @returns The subsurface radius as a Color3
     */
    get subsurfaceRadius(): number;
    /**
     * Sets the subsurface radius (used for subsurface scattering)
     * subsurfaceRadiusScale * subsurfaceRadius gives the mean free path per color channel.
     * @param value The subsurface radius as a number
     */
    set subsurfaceRadius(value: number);
    /**
     * Gets the subsurface radius scale (used for subsurface scattering)
     * subsurfaceRadiusScale * subsurfaceRadius gives the mean free path per color channel.
     * @returns The subsurface radius scale as a Color3
     */
    get subsurfaceRadiusScale(): Color3;
    /**
     * Sets the subsurface radius scale (used for subsurface scattering)
     * subsurfaceRadiusScale * subsurfaceRadius gives the mean free path per color channel.
     * @param value The subsurface radius scale as a Color3
     */
    set subsurfaceRadiusScale(value: Color3);
    /**
     * Sets the subsurface scattering anisotropy.
     * Note: PBRMaterial does not have a direct equivalent, so this is a no-op.
     * @param value The anisotropy intensity value (ignored for PBR)
     */
    set subsurfaceScatterAnisotropy(value: number);
    /**
     * Does this material have a translucent surface (i.e. either transmission or subsurface)?
     * @returns True if the material is translucent, false otherwise
     */
    isTranslucent(): boolean;
    /**
     * Configures sheen for PBR material.
     * Enables sheen and sets up proper configuration.
     */
    configureFuzz(): void;
    /**
     * Sets the sheen weight (mapped to PBR sheen.intensity).
     * Automatically enables sheen.
     * @param value The sheen weight value
     */
    set fuzzWeight(value: number);
    /**
     * Sets the fuzz weight texture.
     * @param value The fuzz weight texture or null
     */
    set fuzzWeightTexture(value: Nullable<BaseTexture>);
    /**
     * Sets the sheen color (mapped to PBR sheen.color).
     * Automatically enables sheen.
     * @param value The sheen color as a Color3
     */
    set fuzzColor(value: Color3);
    /**
     * Sets the sheen color texture (mapped to PBR sheen.texture).
     * Automatically enables sheen.
     * @param value The sheen color texture or null
     */
    set fuzzColorTexture(value: Nullable<BaseTexture>);
    /**
     * Sets the sheen roughness (mapped to PBR sheen.roughness).
     * Automatically enables sheen.
     * @param value The sheen roughness value (0-1)
     */
    set fuzzRoughness(value: number);
    /**
     * Sets the sheen roughness texture (mapped to PBR sheen.textureRoughness).
     * Automatically enables sheen.
     * @param value The sheen roughness texture or null
     */
    set fuzzRoughnessTexture(value: Nullable<BaseTexture>);
    /**
     * Sets the specular roughness anisotropy (mapped to PBR anisotropy.intensity).
     * Automatically enables anisotropy.
     * @param value The anisotropy intensity value
     */
    set specularRoughnessAnisotropy(value: number);
    /**
     * Gets the specular roughness anisotropy.
     * @returns The anisotropy intensity value
     */
    get specularRoughnessAnisotropy(): number;
    /**
     * Sets the anisotropy rotation (mapped to PBR anisotropy.angle).
     * Automatically enables anisotropy.
     * @param value The anisotropy rotation angle in radians
     */
    set geometryTangentAngle(value: number);
    /**
     * Sets the geometry tangent texture (mapped to PBR anisotropy.texture).
     * Automatically enables anisotropy.
     * @param value The anisotropy texture or null
     */
    set geometryTangentTexture(value: Nullable<BaseTexture>);
    /**
     * Gets the geometry tangent texture.
     * @returns The anisotropy texture or null
     */
    get geometryTangentTexture(): Nullable<BaseTexture>;
    /**
     * Configures glTF-style anisotropy for the material.
     * Note: PBR materials don't need this configuration, so this is a no-op.
     * @param useGltfStyle Whether to use glTF-style anisotropy (ignored for PBR)
     */
    configureGltfStyleAnisotropy(useGltfStyle?: boolean): void;
    /**
     * Sets the iridescence weight (mapped to PBR iridescence.intensity).
     * Automatically enables iridescence.
     * @param value The iridescence intensity value
     */
    set thinFilmWeight(value: number);
    /**
     * Sets the iridescence IOR (mapped to PBR iridescence.indexOfRefraction).
     * @param value The iridescence IOR value
     */
    set thinFilmIor(value: number);
    /**
     * Sets the iridescence thickness minimum (mapped to PBR iridescence.minimumThickness).
     * @param value The minimum thickness value in nanometers
     */
    set thinFilmThicknessMinimum(value: number);
    /**
     * Sets the iridescence thickness maximum (mapped to PBR iridescence.maximumThickness).
     * @param value The maximum thickness value in nanometers
     */
    set thinFilmThicknessMaximum(value: number);
    /**
     * Sets the thin film weight texture (mapped to PBR iridescence.texture).
     * @param value The thin film weight texture or null
     */
    set thinFilmWeightTexture(value: Nullable<BaseTexture>);
    /**
     * Sets the iridescence thickness texture (mapped to PBR iridescence.thicknessTexture).
     * @param value The iridescence thickness texture or null
     */
    set thinFilmThicknessTexture(value: Nullable<BaseTexture>);
    /**
     * Sets whether the material is unlit.
     * @param value True to make the material unlit
     */
    set unlit(value: boolean);
    /**
     * Sets the geometry opacity (mapped to PBR alpha).
     * @param value The opacity value (0-1)
     */
    set geometryOpacity(value: number);
    /**
     * Gets the geometry opacity.
     * @returns The opacity value (0-1)
     */
    get geometryOpacity(): number;
    /**
     * Sets the geometry normal texture (mapped to PBR bumpTexture).
     * Also forces irradiance computation in fragment shader for better lighting.
     * @param value The normal texture or null
     */
    set geometryNormalTexture(value: Nullable<BaseTexture>);
    /**
     * Gets the geometry normal texture.
     * @returns The normal texture or null
     */
    get geometryNormalTexture(): Nullable<BaseTexture>;
    /**
     * Sets the normal map inversions for the material.
     * @param invertX Whether to invert the normal map on the X axis
     * @param invertY Whether to invert the normal map on the Y axis
     */
    setNormalMapInversions(invertX: boolean, invertY: boolean): void;
    /**
     * Sets the geometry coat normal texture (mapped to PBR clearCoat.bumpTexture).
     * Automatically enables clear coat.
     * @param value The coat normal texture or null
     */
    set geometryCoatNormalTexture(value: Nullable<BaseTexture>);
    /**
     * Gets the geometry coat normal texture.
     * @returns The coat normal texture or null
     */
    get geometryCoatNormalTexture(): Nullable<BaseTexture>;
    /**
     * Sets the geometry coat normal texture scale.
     * @param value The scale value for the coat normal texture
     */
    set geometryCoatNormalTextureScale(value: number);
}
