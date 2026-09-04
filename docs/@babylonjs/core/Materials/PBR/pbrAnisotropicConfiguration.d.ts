import { type UniformBuffer } from "../../Materials/uniformBuffer.js";
import { Vector2 } from "../../Maths/math.vector.pure.js";
import { type BaseTexture } from "../../Materials/Textures/baseTexture.js";
import { type Nullable } from "../../types.js";
import { type IAnimatable } from "../../Animations/animatable.interface.js";
import { type EffectFallbacks } from "../effectFallbacks.js";
import { MaterialPluginBase } from "../materialPluginBase.pure.js";
import { MaterialDefines } from "../materialDefines.js";
import { type Scene } from "../../scene.js";
import { type AbstractMesh } from "../../Meshes/abstractMesh.js";
import { type PBRBaseMaterial } from "./pbrBaseMaterial.js";
/**
 * @internal
 */
export declare class MaterialAnisotropicDefines extends MaterialDefines {
    ANISOTROPIC: boolean;
    ANISOTROPIC_TEXTURE: boolean;
    ANISOTROPIC_TEXTUREDIRECTUV: number;
    ANISOTROPIC_LEGACY: boolean;
    MAINUV1: boolean;
}
/**
 * Plugin that implements the anisotropic component of the PBR material
 */
export declare class PBRAnisotropicConfiguration extends MaterialPluginBase {
    private _isEnabled;
    /**
     * Defines if the anisotropy is enabled in the material.
     */
    accessor isEnabled: boolean;
    /**
     * Defines the anisotropy strength (between 0 and 1) it defaults to 1.
     */
    intensity: number;
    /**
     * Defines if the effect is along the tangents, bitangents or in between.
     * By default, the effect is "stretching" the highlights along the tangents.
     */
    direction: Vector2;
    /**
     * Sets the anisotropy direction as an angle.
     */
    set angle(value: number);
    /**
     * Gets the anisotropy angle value in radians.
     * @returns the anisotropy angle value in radians.
     */
    get angle(): number;
    private _texture;
    /**
     * Stores the anisotropy values in a texture.
     * rg is direction (like normal from -1 to 1)
     * b is a intensity
     */
    accessor texture: Nullable<BaseTexture>;
    private _legacy;
    /**
     * Defines if the anisotropy is in legacy mode for backwards compatibility before 6.4.0.
     */
    accessor legacy: boolean;
    /** @internal */
    private _internalMarkAllSubMeshesAsTexturesDirty;
    /** @internal */
    _markAllSubMeshesAsTexturesDirty(): void;
    /** @internal */
    private _internalMarkAllSubMeshesAsMiscDirty;
    /** @internal */
    _markAllSubMeshesAsMiscDirty(): void;
    /**
     * Gets a boolean indicating that the plugin is compatible with a given shader language.
     * @returns true if the plugin is compatible with the shader language
     */
    isCompatible(): boolean;
    constructor(material: PBRBaseMaterial, addToPluginList?: boolean);
    /**
     * Checks whether the anisotropy textures are ready for the sub mesh.
     * @param defines defines the material defines to inspect
     * @param scene defines the scene to use for readiness checks
     * @returns true if anisotropy is ready
     */
    isReadyForSubMesh(defines: MaterialAnisotropicDefines, scene: Scene): boolean;
    /**
     * Updates shader defines for anisotropy before attributes are processed.
     * @param defines defines the material defines to update
     * @param scene defines the scene to use for texture checks
     * @param mesh defines the mesh to inspect for tangent data
     */
    prepareDefinesBeforeAttributes(defines: MaterialAnisotropicDefines, scene: Scene, mesh: AbstractMesh): void;
    /**
     * Binds anisotropy data for a sub mesh.
     * @param uniformBuffer defines the uniform buffer to update
     * @param scene defines the scene to use for texture binding
     */
    bindForSubMesh(uniformBuffer: UniformBuffer, scene: Scene): void;
    /**
     * Checks whether anisotropy uses a texture.
     * @param texture defines the texture to check
     * @returns true if the texture is used by anisotropy
     */
    hasTexture(texture: BaseTexture): boolean;
    /**
     * Adds the active anisotropy textures.
     * @param activeTextures defines the list of active textures to update
     */
    getActiveTextures(activeTextures: BaseTexture[]): void;
    /**
     * Adds the animatable anisotropy textures.
     * @param animatables defines the list of animatables to update
     */
    getAnimatables(animatables: IAnimatable[]): void;
    /**
     * Disposes the anisotropy textures.
     * @param forceDisposeTextures defines whether to dispose the textures
     */
    dispose(forceDisposeTextures?: boolean): void;
    getClassName(): string;
    addFallbacks(defines: MaterialAnisotropicDefines, fallbacks: EffectFallbacks, currentRank: number): number;
    /**
     * Adds the anisotropy sampler names.
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
    /**
     * Parses a anisotropy Configuration from a serialized object.
     * @param source - Serialized object.
     * @param scene Defines the scene we are parsing for
     * @param rootUrl Defines the rootUrl to load from
     */
    parse(source: any, scene: Scene, rootUrl: string): void;
}
