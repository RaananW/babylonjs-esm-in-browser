import { type UniformBuffer } from "../../Materials/uniformBuffer.js";
import { Color3 } from "../../Maths/math.color.pure.js";
import { type BaseTexture } from "../../Materials/Textures/baseTexture.js";
import { type Nullable } from "../../types.js";
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
export declare class MaterialSheenDefines extends MaterialDefines {
    SHEEN: boolean;
    SHEEN_TEXTURE: boolean;
    SHEEN_GAMMATEXTURE: boolean;
    SHEEN_TEXTURE_ROUGHNESS: boolean;
    SHEEN_TEXTUREDIRECTUV: number;
    SHEEN_TEXTURE_ROUGHNESSDIRECTUV: number;
    SHEEN_LINKWITHALBEDO: boolean;
    SHEEN_ROUGHNESS: boolean;
    SHEEN_ALBEDOSCALING: boolean;
    SHEEN_USE_ROUGHNESS_FROM_MAINTEXTURE: boolean;
}
/**
 * Plugin that implements the sheen component of the PBR material.
 */
export declare class PBRSheenConfiguration extends MaterialPluginBase {
    private _isEnabled;
    /**
     * Defines if the material uses sheen.
     */
    accessor isEnabled: boolean;
    private _linkSheenWithAlbedo;
    /**
     * Defines if the sheen is linked to the sheen color.
     */
    accessor linkSheenWithAlbedo: boolean;
    /**
     * Defines the sheen intensity.
     */
    intensity: number;
    /**
     * Defines the sheen color.
     */
    color: Color3;
    private _texture;
    /**
     * Stores the sheen tint values in a texture.
     * rgb is tint
     * a is a intensity or roughness if the roughness property has been defined and useRoughnessFromTexture is true (in that case, textureRoughness won't be used)
     * If the roughness property has been defined and useRoughnessFromTexture is false then the alpha channel is not used to modulate roughness
     */
    accessor texture: Nullable<BaseTexture>;
    private _useRoughnessFromMainTexture;
    /**
     * Indicates that the alpha channel of the texture property will be used for roughness.
     * Has no effect if the roughness (and texture!) property is not defined
     */
    accessor useRoughnessFromMainTexture: boolean;
    private _roughness;
    /**
     * Defines the sheen roughness.
     * It is not taken into account if linkSheenWithAlbedo is true.
     * To stay backward compatible, material roughness is used instead if sheen roughness = null
     */
    accessor roughness: Nullable<number>;
    private _textureRoughness;
    /**
     * Stores the sheen roughness in a texture.
     * alpha channel is the roughness. This texture won't be used if the texture property is not empty and useRoughnessFromTexture is true
     */
    accessor textureRoughness: Nullable<BaseTexture>;
    private _albedoScaling;
    /**
     * If true, the sheen effect is layered above the base BRDF with the albedo-scaling technique.
     * It allows the strength of the sheen effect to not depend on the base color of the material,
     * making it easier to setup and tweak the effect
     */
    accessor albedoScaling: boolean;
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
     * Checks whether the sheen textures are ready for the sub mesh.
     * @param defines defines the material defines to inspect
     * @param scene defines the scene to use for readiness checks
     * @returns true if sheen is ready
     */
    isReadyForSubMesh(defines: MaterialSheenDefines, scene: Scene): boolean;
    /**
     * Updates shader defines for sheen before attributes are processed.
     * @param defines defines the material defines to update
     * @param scene defines the scene to use for texture checks
     */
    prepareDefinesBeforeAttributes(defines: MaterialSheenDefines, scene: Scene): void;
    /**
     * Binds sheen data for a sub mesh.
     * @param uniformBuffer defines the uniform buffer to update
     * @param scene defines the scene to use for texture binding
     * @param engine defines the engine to use for capability checks
     * @param subMesh defines the sub mesh being rendered
     */
    bindForSubMesh(uniformBuffer: UniformBuffer, scene: Scene, engine: Engine, subMesh: SubMesh): void;
    /**
     * Checks whether sheen uses a texture.
     * @param texture defines the texture to check
     * @returns true if the texture is used by sheen
     */
    hasTexture(texture: BaseTexture): boolean;
    /**
     * Adds the active sheen textures.
     * @param activeTextures defines the list of active textures to update
     */
    getActiveTextures(activeTextures: BaseTexture[]): void;
    /**
     * Adds the animatable sheen textures.
     * @param animatables defines the list of animatables to update
     */
    getAnimatables(animatables: IAnimatable[]): void;
    /**
     * Disposes the sheen textures.
     * @param forceDisposeTextures defines whether to dispose the textures
     */
    dispose(forceDisposeTextures?: boolean): void;
    getClassName(): string;
    addFallbacks(defines: MaterialSheenDefines, fallbacks: EffectFallbacks, currentRank: number): number;
    /**
     * Adds the sheen sampler names.
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
