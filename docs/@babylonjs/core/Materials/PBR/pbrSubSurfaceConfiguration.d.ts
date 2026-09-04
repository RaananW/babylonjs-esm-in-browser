import { type Nullable } from "../../types.js";
import { type IAnimatable } from "../../Animations/animatable.interface.js";
import { Color3 } from "../../Maths/math.color.pure.js";
import { type SmartArray } from "../../Misc/smartArray.js";
import { type BaseTexture } from "../../Materials/Textures/baseTexture.js";
import { type RenderTargetTexture } from "../../Materials/Textures/renderTargetTexture.js";
import { type UniformBuffer } from "../../Materials/uniformBuffer.js";
import { type EffectFallbacks } from "../effectFallbacks.js";
import { type SubMesh } from "../../Meshes/subMesh.js";
import { MaterialPluginBase } from "../materialPluginBase.pure.js";
import { MaterialDefines } from "../materialDefines.js";
import { type Engine } from "../../Engines/engine.js";
import { type Scene } from "../../scene.js";
import { type PBRBaseMaterial } from "./pbrBaseMaterial.js";
/**
 * @internal
 */
export declare class MaterialSubSurfaceDefines extends MaterialDefines {
    SUBSURFACE: boolean;
    SS_REFRACTION: boolean;
    SS_REFRACTION_USE_INTENSITY_FROM_THICKNESS: boolean;
    SS_TRANSLUCENCY: boolean;
    SS_TRANSLUCENCY_USE_INTENSITY_FROM_THICKNESS: boolean;
    SS_SCATTERING: boolean;
    SS_DISPERSION: boolean;
    SS_THICKNESSANDMASK_TEXTURE: boolean;
    SS_THICKNESSANDMASK_TEXTUREDIRECTUV: number;
    SS_HAS_THICKNESS: boolean;
    SS_REFRACTIONINTENSITY_TEXTURE: boolean;
    SS_REFRACTIONINTENSITY_TEXTUREDIRECTUV: number;
    SS_TRANSLUCENCYINTENSITY_TEXTURE: boolean;
    SS_TRANSLUCENCYINTENSITY_TEXTUREDIRECTUV: number;
    SS_TRANSLUCENCYCOLOR_TEXTURE: boolean;
    SS_TRANSLUCENCYCOLOR_TEXTUREDIRECTUV: number;
    SS_TRANSLUCENCYCOLOR_TEXTURE_GAMMA: boolean;
    SS_REFRACTIONMAP_3D: boolean;
    SS_REFRACTIONMAP_OPPOSITEZ: boolean;
    SS_LODINREFRACTIONALPHA: boolean;
    SS_GAMMAREFRACTION: boolean;
    SS_RGBDREFRACTION: boolean;
    SS_LINEARSPECULARREFRACTION: boolean;
    SS_LINKREFRACTIONTOTRANSPARENCY: boolean;
    SS_ALBEDOFORREFRACTIONTINT: boolean;
    SS_ALBEDOFORTRANSLUCENCYTINT: boolean;
    SS_USE_LOCAL_REFRACTIONMAP_CUBIC: boolean;
    SS_USE_THICKNESS_AS_DEPTH: boolean;
    SS_USE_GLTF_TEXTURES: boolean;
    SS_APPLY_ALBEDO_AFTER_SUBSURFACE: boolean;
    SS_TRANSLUCENCY_LEGACY: boolean;
}
/**
 * Plugin that implements the sub surface component of the PBR material
 */
export declare class PBRSubSurfaceConfiguration extends MaterialPluginBase {
    /**
     * Default value used for applyAlbedoAfterSubSurface.
     *
     * This property only exists for backward compatibility reasons.
     * Set it to true if your rendering in 8.0+ is different from that in 7 when you use sub-surface properties (transmission, refraction, etc.). Default is false.
     * Note however that the PBR calculation is wrong when this property is set to true, so only use it if you want to mimic the 7.0 behavior.
     */
    static DEFAULT_APPLY_ALBEDO_AFTERSUBSURFACE: boolean;
    /**
     * Default value used for legacyTranslucency.
     *
     * This property only exists for backward compatibility reasons.
     * Set it to true if your rendering in 8.0+ is different from that in 7 when you use sub-surface translucency. Default is false.
     */
    static DEFAULT_LEGACY_TRANSLUCENCY: boolean;
    protected _material: PBRBaseMaterial;
    private _isRefractionEnabled;
    /**
     * Defines if the refraction is enabled in the material.
     */
    accessor isRefractionEnabled: boolean;
    private _isTranslucencyEnabled;
    /**
     * Defines if the translucency is enabled in the material.
     */
    accessor isTranslucencyEnabled: boolean;
    private _isDispersionEnabled;
    /**
     * Defines if dispersion is enabled in the material.
     */
    accessor isDispersionEnabled: boolean;
    private _isScatteringEnabled;
    /**
     * Defines if the sub surface scattering is enabled in the material.
     */
    accessor isScatteringEnabled: boolean;
    private _scatteringDiffusionProfileIndex;
    /**
     * Diffusion profile for subsurface scattering.
     * Useful for better scattering in the skins or foliages.
     */
    get scatteringDiffusionProfile(): Nullable<Color3>;
    set scatteringDiffusionProfile(c: Nullable<Color3>);
    /**
     * Defines the refraction intensity of the material.
     * The refraction when enabled replaces the Diffuse part of the material.
     * The intensity helps transitioning between diffuse and refraction.
     */
    refractionIntensity: number;
    /**
     * Defines the translucency intensity of the material.
     * When translucency has been enabled, this defines how much of the "translucency"
     * is added to the diffuse part of the material.
     */
    translucencyIntensity: number;
    private _useAlbedoToTintRefraction;
    /**
     * When enabled, transparent surfaces will be tinted with the albedo colour (independent of thickness)
     */
    accessor useAlbedoToTintRefraction: boolean;
    private _useAlbedoToTintTranslucency;
    /**
     * When enabled, translucent surfaces will be tinted with the albedo colour (independent of thickness)
     */
    accessor useAlbedoToTintTranslucency: boolean;
    private _thicknessTexture;
    /**
     * Stores the average thickness of a mesh in a texture (The texture is holding the values linearly).
     * The red (or green if useGltfStyleTextures=true) channel of the texture should contain the thickness remapped between 0 and 1.
     * 0 would mean minimumThickness
     * 1 would mean maximumThickness
     * The other channels might be use as a mask to vary the different effects intensity.
     */
    accessor thicknessTexture: Nullable<BaseTexture>;
    private _refractionTexture;
    /**
     * Defines the texture to use for refraction.
     */
    accessor refractionTexture: Nullable<BaseTexture>;
    /** @internal */
    _indexOfRefraction: number;
    /**
     * Index of refraction of the material base layer.
     * https://en.wikipedia.org/wiki/List_of_refractive_indices
     *
     * This does not only impact refraction but also the Base F0 of Dielectric Materials.
     *
     * From dielectric fresnel rules: F0 = square((iorT - iorI) / (iorT + iorI))
     */
    accessor indexOfRefraction: number;
    private _volumeIndexOfRefraction;
    /**
     * Index of refraction of the material's volume.
     * https://en.wikipedia.org/wiki/List_of_refractive_indices
     *
     * This ONLY impacts refraction. If not provided or given a non-valid value,
     * the volume will use the same IOR as the surface.
     */
    get volumeIndexOfRefraction(): number;
    set volumeIndexOfRefraction(value: number);
    private _invertRefractionY;
    /**
     * Controls if refraction needs to be inverted on Y. This could be useful for procedural texture.
     */
    accessor invertRefractionY: boolean;
    /** @internal */
    _linkRefractionWithTransparency: boolean;
    /**
     * This parameters will make the material used its opacity to control how much it is refracting against not.
     * Materials half opaque for instance using refraction could benefit from this control.
     */
    accessor linkRefractionWithTransparency: boolean;
    /**
     * Defines the minimum thickness stored in the thickness map.
     * If no thickness map is defined, this value will be used to simulate thickness.
     */
    minimumThickness: number;
    /**
     * Defines the maximum thickness stored in the thickness map.
     */
    maximumThickness: number;
    /**
     * Defines that the thickness should be used as a measure of the depth volume.
     */
    useThicknessAsDepth: boolean;
    /**
     * Defines the volume tint of the material.
     * This is used for both translucency and scattering.
     */
    tintColor: Color3;
    /**
     * Defines the distance at which the tint color should be found in the media.
     * This is used for refraction only.
     */
    tintColorAtDistance: number;
    /**
     * Defines the Abbe number for the volume.
     */
    dispersion: number;
    /**
     * Defines how far each channel transmit through the media.
     * It is defined as a color to simplify it selection.
     */
    diffusionDistance: Color3;
    private _useMaskFromThicknessTexture;
    /**
     * Stores the intensity of the different subsurface effects in the thickness texture.
     * Note that if refractionIntensityTexture and/or translucencyIntensityTexture is provided it takes precedence over thicknessTexture + useMaskFromThicknessTexture
     * * the green (red if useGltfStyleTextures = true) channel is the refraction intensity.
     * * the blue (alpha if useGltfStyleTextures = true) channel is the translucency intensity.
     */
    accessor useMaskFromThicknessTexture: boolean;
    private _refractionIntensityTexture;
    /**
     * Stores the intensity of the refraction. If provided, it takes precedence over thicknessTexture + useMaskFromThicknessTexture
     * * the green (red if useGltfStyleTextures = true) channel is the refraction intensity.
     */
    accessor refractionIntensityTexture: Nullable<BaseTexture>;
    private _translucencyIntensityTexture;
    /**
     * Stores the intensity of the translucency. If provided, it takes precedence over thicknessTexture + useMaskFromThicknessTexture
     * * the blue (alpha if useGltfStyleTextures = true) channel is the translucency intensity.
     */
    accessor translucencyIntensityTexture: Nullable<BaseTexture>;
    /**
     * Defines the translucency tint of the material.
     * If not set, the tint color will be used instead.
     */
    translucencyColor: Nullable<Color3>;
    private _translucencyColorTexture;
    /**
     * Defines the translucency tint color of the material as a texture.
     * This is multiplied against the translucency color to add variety and realism to the material.
     * If translucencyColor is not set, the tint color will be used instead.
     */
    accessor translucencyColorTexture: Nullable<BaseTexture>;
    private _useGltfStyleTextures;
    /**
     * Use channels layout used by glTF:
     * * thicknessTexture: the green (instead of red) channel is the thickness
     * * thicknessTexture/refractionIntensityTexture: the red (instead of green) channel is the refraction intensity
     * * thicknessTexture/translucencyIntensityTexture: the alpha (instead of blue) channel is the translucency intensity
     */
    accessor useGltfStyleTextures: boolean;
    /**
     * This property only exists for backward compatibility reasons.
     * Set it to true if your rendering in 8.0+ is different from that in 7 when you use sub-surface properties (transmission, refraction, etc.). Default is false.
     * Note however that the PBR calculation is wrong when this property is set to true, so only use it if you want to mimic the 7.0 behavior.
     */
    applyAlbedoAfterSubSurface: boolean;
    /**
     * This property only exists for backward compatibility reasons.
     * Set it to true if your rendering in 8.0+ is different from that in 7 when you use sub-surface translucency. Default is false.
     */
    legacyTranslucency: boolean;
    /**
     * Keeping for backward compatibility... Should not be used anymore. It has been replaced by
     * the property with the correct spelling.
     * @see legacyTranslucency
     */
    get legacyTransluceny(): boolean;
    set legacyTransluceny(value: boolean);
    private _scene;
    /** @internal */
    private _internalMarkAllSubMeshesAsTexturesDirty;
    private _internalMarkScenePrePassDirty;
    /** @internal */
    _markAllSubMeshesAsTexturesDirty(): void;
    /** @internal */
    _markScenePrePassDirty(): void;
    /**
     * Gets a boolean indicating that the plugin is compatible with a given shader language.
     * @returns true if the plugin is compatible with the shader language
     */
    isCompatible(): boolean;
    constructor(material: PBRBaseMaterial, addToPluginList?: boolean);
    /**
     * Checks whether the subsurface textures are ready for the sub mesh.
     * @param defines defines the material defines to inspect
     * @param scene defines the scene to use for readiness checks
     * @returns true if subsurface is ready
     */
    isReadyForSubMesh(defines: MaterialSubSurfaceDefines, scene: Scene): boolean;
    /**
     * Updates shader defines for subsurface rendering before attributes are processed.
     * @param defines defines the material defines to update
     * @param scene defines the scene to use for texture checks
     */
    prepareDefinesBeforeAttributes(defines: MaterialSubSurfaceDefines, scene: Scene): void;
    /**
     * Binds the material data (this function is called even if mustRebind() returns false)
     * @param uniformBuffer defines the Uniform buffer to fill in.
     * @param scene defines the scene the material belongs to.
     * @param engine defines the engine the material belongs to.
     * @param subMesh the submesh to bind data for
     */
    hardBindForSubMesh(uniformBuffer: UniformBuffer, scene: Scene, engine: Engine, subMesh: SubMesh): void;
    /**
     * Binds subsurface data for a sub mesh.
     * @param uniformBuffer defines the uniform buffer to update
     * @param scene defines the scene to use for texture binding
     * @param engine defines the engine used for binding
     * @param subMesh defines the sub mesh being rendered
     */
    bindForSubMesh(uniformBuffer: UniformBuffer, scene: Scene, engine: Engine, subMesh: SubMesh): void;
    /**
     * Returns the texture used for refraction or null if none is used.
     * @param scene defines the scene the material belongs to.
     * @returns - Refraction texture if present.  If no refraction texture and refraction
     * is linked with transparency, returns environment texture.  Otherwise, returns null.
     */
    private _getRefractionTexture;
    /**
     * Returns true if alpha blending should be disabled.
     */
    get disableAlphaBlending(): boolean;
    /**
     * Fills the list of render target textures.
     * @param renderTargets the list of render targets to update
     */
    fillRenderTargetTextures(renderTargets: SmartArray<RenderTargetTexture>): void;
    /**
     * Checks whether subsurface rendering uses a texture.
     * @param texture defines the texture to check
     * @returns true if the texture is used by subsurface rendering
     */
    hasTexture(texture: BaseTexture): boolean;
    hasRenderTargetTextures(): boolean;
    /**
     * Adds the active subsurface textures.
     * @param activeTextures defines the list of active textures to update
     */
    getActiveTextures(activeTextures: BaseTexture[]): void;
    /**
     * Adds the animatable subsurface textures.
     * @param animatables defines the list of animatables to update
     */
    getAnimatables(animatables: IAnimatable[]): void;
    /**
     * Disposes the subsurface textures.
     * @param forceDisposeTextures defines whether to dispose the textures
     */
    dispose(forceDisposeTextures?: boolean): void;
    getClassName(): string;
    addFallbacks(defines: MaterialSubSurfaceDefines, fallbacks: EffectFallbacks, currentRank: number): number;
    /**
     * Adds the subsurface sampler names.
     * @param samplers defines the list of sampler names to update
     */
    getSamplers(samplers: string[]): void;
    getUniforms(): {
        ubo?: Array<{
            name: string;
            size: number;
            type: string;
        }>;
        vertex?: string;
        fragment?: string;
    };
}
