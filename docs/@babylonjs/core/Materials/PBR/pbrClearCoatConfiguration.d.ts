import { type Nullable } from "../../types.js";
import { Color3 } from "../../Maths/math.color.pure.js";
import { type BaseTexture } from "../../Materials/Textures/baseTexture.js";
import { type UniformBuffer } from "../../Materials/uniformBuffer.js";
import { type IAnimatable } from "../../Animations/animatable.interface.js";
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
export declare class MaterialClearCoatDefines extends MaterialDefines {
    CLEARCOAT: boolean;
    CLEARCOAT_DEFAULTIOR: boolean;
    CLEARCOAT_TEXTURE: boolean;
    CLEARCOAT_TEXTURE_ROUGHNESS: boolean;
    CLEARCOAT_TEXTUREDIRECTUV: number;
    CLEARCOAT_TEXTURE_ROUGHNESSDIRECTUV: number;
    CLEARCOAT_BUMP: boolean;
    CLEARCOAT_BUMPDIRECTUV: number;
    CLEARCOAT_USE_ROUGHNESS_FROM_MAINTEXTURE: boolean;
    CLEARCOAT_REMAP_F0: boolean;
    CLEARCOAT_TINT: boolean;
    CLEARCOAT_TINT_TEXTURE: boolean;
    CLEARCOAT_TINT_TEXTUREDIRECTUV: number;
    CLEARCOAT_TINT_GAMMATEXTURE: boolean;
}
/**
 * Plugin that implements the clear coat component of the PBR material
 */
export declare class PBRClearCoatConfiguration extends MaterialPluginBase {
    protected _material: PBRBaseMaterial;
    /**
     * This defaults to 1.5 corresponding to a 0.04 f0 or a 4% reflectance at normal incidence
     * The default fits with a polyurethane material.
     * @internal
     */
    static readonly _DefaultIndexOfRefraction = 1.5;
    private _isEnabled;
    /**
     * Defines if the clear coat is enabled in the material.
     */
    accessor isEnabled: boolean;
    /**
     * Defines the clear coat layer strength (between 0 and 1) it defaults to 1.
     */
    intensity: number;
    /**
     * Defines the clear coat layer roughness.
     */
    roughness: number;
    private _indexOfRefraction;
    /**
     * Defines the index of refraction of the clear coat.
     * This defaults to 1.5 corresponding to a 0.04 f0 or a 4% reflectance at normal incidence
     * The default fits with a polyurethane material.
     * Changing the default value is more performance intensive.
     */
    accessor indexOfRefraction: number;
    private _texture;
    /**
     * Stores the clear coat values in a texture (red channel is intensity and green channel is roughness)
     * If useRoughnessFromMainTexture is false, the green channel of texture is not used and the green channel of textureRoughness is used instead
     * if textureRoughness is not empty, else no texture roughness is used
     */
    accessor texture: Nullable<BaseTexture>;
    private _useRoughnessFromMainTexture;
    /**
     * Indicates that the green channel of the texture property will be used for roughness (default: true)
     * If false, the green channel from textureRoughness is used for roughness
     */
    accessor useRoughnessFromMainTexture: boolean;
    private _textureRoughness;
    /**
     * Stores the clear coat roughness in a texture (green channel)
     * Not used if useRoughnessFromMainTexture is true
     */
    accessor textureRoughness: Nullable<BaseTexture>;
    private _remapF0OnInterfaceChange;
    /**
     * Defines if the F0 value should be remapped to account for the interface change in the material.
     */
    accessor remapF0OnInterfaceChange: boolean;
    private _bumpTexture;
    /**
     * Define the clear coat specific bump texture.
     */
    accessor bumpTexture: Nullable<BaseTexture>;
    private _isTintEnabled;
    /**
     * Defines if the clear coat tint is enabled in the material.
     */
    accessor isTintEnabled: boolean;
    /**
     * Defines the clear coat tint of the material.
     * This is only use if tint is enabled
     */
    tintColor: Color3;
    /**
     * Defines the distance at which the tint color should be found in the
     * clear coat media.
     * This is only use if tint is enabled
     */
    tintColorAtDistance: number;
    /**
     * Defines the clear coat layer thickness.
     * This is only use if tint is enabled
     */
    tintThickness: number;
    private _tintTexture;
    /**
     * Stores the clear tint values in a texture.
     * rgb is tint
     * a is a thickness factor
     */
    accessor tintTexture: Nullable<BaseTexture>;
    /** @internal */
    private _internalMarkAllSubMeshesAsTexturesDirty;
    /** @internal */
    _markAllSubMeshesAsTexturesDirty(): void;
    /**
     * Gets a boolean indicating that the plugin is compatible with a given shader language.
     * @returns true if the plugin is compatible with the shader language
     */
    isCompatible(): boolean;
    constructor(material: PBRBaseMaterial, addToPluginList?: boolean);
    /**
     * Checks whether the clear coat textures are ready for the sub mesh.
     * @param defines defines the material defines to inspect
     * @param scene defines the scene to use for readiness checks
     * @param engine defines the engine to use for readiness checks
     * @returns true if clear coat is ready
     */
    isReadyForSubMesh(defines: MaterialClearCoatDefines, scene: Scene, engine: Engine): boolean;
    /**
     * Updates shader defines for clear coat before attributes are processed.
     * @param defines defines the material defines to update
     * @param scene defines the scene to use for texture checks
     */
    prepareDefinesBeforeAttributes(defines: MaterialClearCoatDefines, scene: Scene): void;
    /**
     * Binds clear coat data for a sub mesh.
     * @param uniformBuffer defines the uniform buffer to update
     * @param scene defines the scene to use for texture binding
     * @param engine defines the engine to use for capability checks
     * @param subMesh defines the sub mesh being rendered
     */
    bindForSubMesh(uniformBuffer: UniformBuffer, scene: Scene, engine: Engine, subMesh: SubMesh): void;
    /**
     * Checks whether clear coat uses a texture.
     * @param texture defines the texture to check
     * @returns true if the texture is used by clear coat
     */
    hasTexture(texture: BaseTexture): boolean;
    /**
     * Adds the active clear coat textures.
     * @param activeTextures defines the list of active textures to update
     */
    getActiveTextures(activeTextures: BaseTexture[]): void;
    /**
     * Adds the animatable clear coat textures.
     * @param animatables defines the list of animatables to update
     */
    getAnimatables(animatables: IAnimatable[]): void;
    /**
     * Disposes the clear coat textures.
     * @param forceDisposeTextures defines whether to dispose the textures
     */
    dispose(forceDisposeTextures?: boolean): void;
    getClassName(): string;
    addFallbacks(defines: MaterialClearCoatDefines, fallbacks: EffectFallbacks, currentRank: number): number;
    /**
     * Adds the clear coat sampler names.
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
