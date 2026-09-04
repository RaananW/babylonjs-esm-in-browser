/** This file must only contain pure code and pure imports */
import { MaterialDefines } from "../../Materials/materialDefines.js";
import { MaterialPluginBase } from "../../Materials/materialPluginBase.pure.js";
import { type InternalTexture } from "../../Materials/Textures/internalTexture.js";
import { type Material } from "../../Materials/material.pure.js";
import { type StandardMaterial } from "../../Materials/standardMaterial.pure.js";
import { PBRBaseMaterial } from "../../Materials/PBR/pbrBaseMaterial.pure.js";
import { type UniformBuffer } from "../../Materials/uniformBuffer.js";
import { ShaderLanguage } from "../../Materials/shaderLanguage.js";
import { type OpenPBRMaterial } from "../../Materials/PBR/openpbrMaterial.pure.js";
/**
 * @internal
 */
declare class MaterialIBLShadowsRenderDefines extends MaterialDefines {
    RENDER_WITH_IBL_SHADOWS: boolean;
    COLORED_IBL_SHADOWS: boolean;
}
/**
 * Plugin used to render the contribution from IBL shadows.
 */
export declare class IBLShadowsPluginMaterial extends MaterialPluginBase {
    /**
     * Defines the name of the plugin.
     */
    static readonly Name = "IBLShadowsPluginMaterial";
    /**
     * The texture containing the contribution from IBL shadows.
     */
    private _iblShadowsTexture;
    get iblShadowsTexture(): InternalTexture;
    set iblShadowsTexture(value: InternalTexture);
    /**
     * The opacity of the shadows.
     */
    shadowOpacity: number;
    private _isEnabled;
    private _isColored;
    get isColored(): boolean;
    set isColored(value: boolean);
    /**
     * Defines if the plugin is enabled in the material.
     */
    accessor isEnabled: boolean;
    protected _markAllSubMeshesAsTexturesDirty(): void;
    private _internalMarkAllSubMeshesAsTexturesDirty;
    /**
     * Gets a boolean indicating that the plugin is compatible with a give shader language.
     * @returns true if the plugin is compatible with the shader language
     */
    isCompatible(): boolean;
    constructor(material: Material | StandardMaterial | PBRBaseMaterial | OpenPBRMaterial);
    private _isOpenPBRMaterial;
    prepareDefines(defines: MaterialIBLShadowsRenderDefines): void;
    getClassName(): string;
    getUniforms(_shaderLanguage: ShaderLanguage): any;
    getSamplers(samplers: string[]): void;
    bindForSubMesh(uniformBuffer: UniformBuffer): void;
    getCustomCode(shaderType: string, shaderLanguage: ShaderLanguage): {
        [name: string]: string;
    } | null;
}
/**
 * Register side effects for iblShadowsPluginMaterial.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterIblShadowsPluginMaterial(): void;
export {};
