import { type Nullable } from "../types.js";
import { type BaseTexture } from "./Textures/baseTexture.js";
import { type UniformBuffer } from "./uniformBuffer.js";
import { type IAnimatable } from "../Animations/animatable.interface.js";
import { MaterialDefines } from "./materialDefines.js";
import { MaterialPluginBase } from "./materialPluginBase.pure.js";
import { type Scene } from "../scene.js";
import { type StandardMaterial } from "./standardMaterial.js";
import { type PBRBaseMaterial } from "./PBR/pbrBaseMaterial.js";
import { type AbstractEngine } from "../Engines/abstractEngine.js";
/**
 * @internal
 */
export declare class MaterialDetailMapDefines extends MaterialDefines {
    DETAIL: boolean;
    DETAILDIRECTUV: number;
    DETAIL_NORMALBLENDMETHOD: number;
}
/**
 * Plugin that implements the detail map component of a material
 *
 * Inspired from:
 *   Unity: https://docs.unity3d.com/Packages/com.unity.render-pipelines.high-definition@9.0/manual/Mask-Map-and-Detail-Map.html and https://docs.unity3d.com/Manual/StandardShaderMaterialParameterDetail.html
 *   Unreal: https://docs.unrealengine.com/en-US/Engine/Rendering/Materials/HowTo/DetailTexturing/index.html
 *   Cryengine: https://docs.cryengine.com/display/SDKDOC2/Detail+Maps
 */
export declare class DetailMapConfiguration extends MaterialPluginBase {
    private _texture;
    /**
     * The detail texture of the material.
     */
    accessor texture: Nullable<BaseTexture>;
    /**
     * Defines how strongly the detail diffuse/albedo channel is blended with the regular diffuse/albedo texture
     * Bigger values mean stronger blending
     */
    diffuseBlendLevel: number;
    /**
     * Defines how strongly the detail roughness channel is blended with the regular roughness value
     * Bigger values mean stronger blending. Only used with PBR materials
     */
    roughnessBlendLevel: number;
    /**
     * Defines how strong the bump effect from the detail map is
     * Bigger values mean stronger effect
     */
    bumpLevel: number;
    private _normalBlendMethod;
    /**
     * The method used to blend the bump and detail normals together
     */
    accessor normalBlendMethod: number;
    private _isEnabled;
    /**
     * Enable or disable the detail map on this material
     */
    accessor isEnabled: boolean;
    /** @internal */
    private _internalMarkAllSubMeshesAsTexturesDirty;
    /** @internal */
    _markAllSubMeshesAsTexturesDirty(): void;
    /**
     * Gets a boolean indicating that the plugin is compatible with a given shader language.
     * @returns true if the plugin is compatible with the shader language
     */
    isCompatible(): boolean;
    constructor(material: PBRBaseMaterial | StandardMaterial, addToPluginList?: boolean);
    /**
     * Checks whether the detail map textures are ready for the sub mesh.
     * @param defines defines the material defines to inspect
     * @param scene defines the scene to use for readiness checks
     * @param engine defines the engine to use for readiness checks
     * @returns true if the detail map is ready
     */
    isReadyForSubMesh(defines: MaterialDetailMapDefines, scene: Scene, engine: AbstractEngine): boolean;
    /**
     * Updates the material defines for the detail map.
     * @param defines defines the material defines to update
     * @param scene defines the scene to use for texture checks
     */
    prepareDefines(defines: MaterialDetailMapDefines, scene: Scene): void;
    /**
     * Binds the detail map data for a sub mesh.
     * @param uniformBuffer defines the uniform buffer to update
     * @param scene defines the scene to use for texture binding
     */
    bindForSubMesh(uniformBuffer: UniformBuffer, scene: Scene): void;
    /**
     * Checks whether the detail map uses a texture.
     * @param texture defines the texture to check
     * @returns true if the texture is used by the detail map
     */
    hasTexture(texture: BaseTexture): boolean;
    /**
     * Adds the active detail map textures.
     * @param activeTextures defines the list of active textures to update
     */
    getActiveTextures(activeTextures: BaseTexture[]): void;
    /**
     * Adds the animatable detail map textures.
     * @param animatables defines the list of animatables to update
     */
    getAnimatables(animatables: IAnimatable[]): void;
    /**
     * Disposes the detail map textures.
     * @param forceDisposeTextures defines whether to dispose the textures
     */
    dispose(forceDisposeTextures?: boolean): void;
    getClassName(): string;
    /**
     * Adds the detail map sampler names.
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
