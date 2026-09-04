/** This file must only contain pure code and pure imports */
import { MaterialDefines } from "./materialDefines.js";
import { MaterialPluginBase } from "./materialPluginBase.pure.js";
import { type Scene } from "../scene.pure.js";
import { type Engine } from "../Engines/engine.pure.js";
import { type SubMesh } from "../Meshes/subMesh.pure.js";
import { type AbstractMesh } from "../Meshes/abstractMesh.pure.js";
import { type UniformBuffer } from "./uniformBuffer.js";
import { type PBRBaseMaterial } from "./PBR/pbrBaseMaterial.pure.js";
import { type StandardMaterial } from "./standardMaterial.pure.js";
/**
 * @internal
 */
export declare class DecalMapDefines extends MaterialDefines {
    DECAL: boolean;
    DECALDIRECTUV: number;
    DECAL_SMOOTHALPHA: boolean;
    GAMMADECAL: boolean;
}
/**
 * Plugin that implements the decal map component of a material
 * @since 5.49.1
 */
export declare class DecalMapConfiguration extends MaterialPluginBase {
    private _isEnabled;
    /**
     * Enables or disables the decal map on this material
     */
    accessor isEnabled: boolean;
    private _smoothAlpha;
    /**
     * Enables or disables the smooth alpha mode on this material. Default: false.
     * When enabled, the alpha value used to blend the decal map will be the squared value and will produce a smoother result.
     */
    accessor smoothAlpha: boolean;
    private _internalMarkAllSubMeshesAsTexturesDirty;
    /** @internal */
    _markAllSubMeshesAsTexturesDirty(): void;
    /**
     * Gets a boolean indicating that the plugin is compatible with a given shader language.
     * @returns true if the plugin is compatible with the shader language
     */
    isCompatible(): boolean;
    /**
     * Creates a new DecalMapConfiguration
     * @param material The material to attach the decal map plugin to
     * @param addToPluginList If the plugin should be added to the material plugin list
     */
    constructor(material: PBRBaseMaterial | StandardMaterial, addToPluginList?: boolean);
    /**
     * Checks if the sub mesh is ready to be used
     * @param defines the list of defines
     * @param scene the current scene
     * @param engine the current engine
     * @param subMesh the sub mesh to check
     * @returns true if the sub mesh is ready
     */
    isReadyForSubMesh(defines: DecalMapDefines, scene: Scene, engine: Engine, subMesh: SubMesh): boolean;
    /**
     * Prepares the defines before attributes are set
     * @param defines the list of defines
     * @param scene the current scene
     * @param mesh the current mesh
     */
    prepareDefinesBeforeAttributes(defines: DecalMapDefines, scene: Scene, mesh: AbstractMesh): void;
    /**
     * Binds the material data for a sub mesh
     * @param uniformBuffer the uniform buffer to update
     * @param scene the current scene
     * @param _engine the current engine
     * @param subMesh the sub mesh to bind
     */
    hardBindForSubMesh(uniformBuffer: UniformBuffer, scene: Scene, _engine: Engine, subMesh: SubMesh): void;
    /**
     * Gets the class name of this plugin
     * @returns the class name
     */
    getClassName(): string;
    /**
     * Gets the samplers used by the plugin
     * @param samplers the list of samplers to update
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
/**
 * Register side effects for materialDecalMapConfiguration.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterMaterialDecalMapConfiguration(): void;
