import { type Nullable } from "../../types.js";
import { type BaseTexture } from "../../Materials/Textures/baseTexture.js";
import { type UniformBuffer } from "../../Materials/uniformBuffer.js";
import { type IAnimatable } from "../../Animations/animatable.interface.js";
import { type EffectFallbacks } from "../effectFallbacks.js";
import { MaterialPluginBase } from "../materialPluginBase.pure.js";
import { MaterialDefines } from "../materialDefines.js";
import { type Scene } from "../../scene.js";
import { type PBRBaseMaterial } from "./pbrBaseMaterial.js";
/**
 * @internal
 */
export declare class MaterialIridescenceDefines extends MaterialDefines {
    IRIDESCENCE: boolean;
    IRIDESCENCE_TEXTURE: boolean;
    IRIDESCENCE_TEXTUREDIRECTUV: number;
    IRIDESCENCE_THICKNESS_TEXTURE: boolean;
    IRIDESCENCE_THICKNESS_TEXTUREDIRECTUV: number;
}
/**
 * Plugin that implements the iridescence (thin film) component of the PBR material
 */
export declare class PBRIridescenceConfiguration extends MaterialPluginBase {
    protected _material: PBRBaseMaterial;
    /**
     * The default minimum thickness of the thin-film layer given in nanometers (nm).
     * Defaults to 100 nm.
     * @internal
     */
    static readonly _DefaultMinimumThickness = 100;
    /**
     * The default maximum thickness of the thin-film layer given in nanometers (nm).
     * Defaults to 400 nm.
     * @internal
     */
    static readonly _DefaultMaximumThickness = 400;
    /**
     * The default index of refraction of the thin-film layer.
     * Defaults to 1.3
     * @internal
     */
    static readonly _DefaultIndexOfRefraction = 1.3;
    private _isEnabled;
    /**
     * Defines if the iridescence is enabled in the material.
     */
    accessor isEnabled: boolean;
    /**
     * Defines the iridescence layer strength (between 0 and 1) it defaults to 1.
     */
    intensity: number;
    /**
     * Defines the minimum thickness of the thin-film layer given in nanometers (nm).
     */
    minimumThickness: number;
    /**
     * Defines the maximum thickness of the thin-film layer given in nanometers (nm). This will be the thickness used if not thickness texture has been set.
     */
    maximumThickness: number;
    /**
     * Defines the maximum thickness of the thin-film layer given in nanometers (nm).
     */
    indexOfRefraction: number;
    private _texture;
    /**
     * Stores the iridescence intensity in a texture (red channel)
     */
    accessor texture: Nullable<BaseTexture>;
    private _thicknessTexture;
    /**
     * Stores the iridescence thickness in a texture (green channel)
     */
    accessor thicknessTexture: Nullable<BaseTexture>;
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
     * Checks whether the iridescence textures are ready for the sub mesh.
     * @param defines defines the material defines to inspect
     * @param scene defines the scene to use for readiness checks
     * @returns true if iridescence is ready
     */
    isReadyForSubMesh(defines: MaterialIridescenceDefines, scene: Scene): boolean;
    /**
     * Updates shader defines for iridescence before attributes are processed.
     * @param defines defines the material defines to update
     * @param scene defines the scene to use for texture checks
     */
    prepareDefinesBeforeAttributes(defines: MaterialIridescenceDefines, scene: Scene): void;
    /**
     * Binds iridescence data for a sub mesh.
     * @param uniformBuffer defines the uniform buffer to update
     * @param scene defines the scene to use for texture binding
     */
    bindForSubMesh(uniformBuffer: UniformBuffer, scene: Scene): void;
    /**
     * Checks whether iridescence uses a texture.
     * @param texture defines the texture to check
     * @returns true if the texture is used by iridescence
     */
    hasTexture(texture: BaseTexture): boolean;
    /**
     * Adds the active iridescence textures.
     * @param activeTextures defines the list of active textures to update
     */
    getActiveTextures(activeTextures: BaseTexture[]): void;
    /**
     * Adds the animatable iridescence textures.
     * @param animatables defines the list of animatables to update
     */
    getAnimatables(animatables: IAnimatable[]): void;
    /**
     * Disposes the iridescence textures.
     * @param forceDisposeTextures defines whether to dispose the textures
     */
    dispose(forceDisposeTextures?: boolean): void;
    getClassName(): string;
    addFallbacks(defines: MaterialIridescenceDefines, fallbacks: EffectFallbacks, currentRank: number): number;
    /**
     * Adds the iridescence sampler names.
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
