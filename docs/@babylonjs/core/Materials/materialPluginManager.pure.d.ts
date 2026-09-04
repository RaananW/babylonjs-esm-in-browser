/** This file must only contain pure code and pure imports */
import { type ShaderCustomProcessingFunction } from "../Engines/Processors/shaderProcessingOptions.js";
import { type Nullable } from "../types.js";
import { Material } from "./material.pure.js";
import { type MaterialPluginPrepareEffect, type MaterialPluginBindForSubMesh, type MaterialPluginDisposed, type MaterialPluginGetActiveTextures, type MaterialPluginGetAnimatables, type MaterialPluginGetDefineNames, type MaterialPluginHasTexture, type MaterialPluginIsReadyForSubMesh, type MaterialPluginPrepareDefines, type MaterialPluginPrepareUniformBuffer, type MaterialPluginHardBindForSubMesh, type MaterialPluginHasRenderTargetTextures, type MaterialPluginFillRenderTargetTextures } from "./materialPluginEvent.js";
import { type Scene } from "../scene.pure.js";
import { type AbstractEngine } from "../Engines/abstractEngine.pure.js";
import { type MaterialPluginBase } from "./materialPluginBase.pure.js";
/**
 * Class that manages the plugins of a material
 * @since 5.0
 */
export declare class MaterialPluginManager {
    /** Map a plugin class name to a #define name (used in the vertex/fragment shaders as a marker of the plugin usage) */
    private static _MaterialPluginClassToMainDefine;
    private static _MaterialPluginCounter;
    protected _material: Material;
    protected _scene: Scene;
    protected _engine: AbstractEngine;
    /** @internal */
    _plugins: MaterialPluginBase[];
    protected _activePlugins: MaterialPluginBase[];
    protected _activePluginsForExtraEvents: MaterialPluginBase[];
    protected _codeInjectionPoints: {
        [shaderType: string]: {
            [codeName: string]: boolean;
        };
    };
    protected _defineNamesFromPlugins?: {
        [name: string]: {
            type: string;
            default: any;
        };
    };
    protected _uboDeclaration: string;
    protected _vertexDeclaration: string;
    protected _fragmentDeclaration: string;
    protected _uniformList: string[];
    protected _samplerList: string[];
    protected _uboList: string[];
    /**
     * Creates a new instance of the plugin manager
     * @param material material that this manager will manage the plugins for
     */
    constructor(material: Material);
    /**
     * @internal
     */
    _addPlugin(plugin: MaterialPluginBase): boolean;
    /**
     * @internal
     */
    _activatePlugin(plugin: MaterialPluginBase): void;
    /**
     * Gets a plugin from the list of plugins managed by this manager
     * @param name name of the plugin
     * @returns the plugin if found, else null
     */
    getPlugin<T = MaterialPluginBase>(name: string): Nullable<T>;
    protected _handlePluginEventIsReadyForSubMesh(eventData: MaterialPluginIsReadyForSubMesh): void;
    protected _handlePluginEventPrepareDefinesBeforeAttributes(eventData: MaterialPluginPrepareDefines): void;
    protected _handlePluginEventPrepareDefines(eventData: MaterialPluginPrepareDefines): void;
    protected _handlePluginEventHardBindForSubMesh(eventData: MaterialPluginHardBindForSubMesh): void;
    protected _handlePluginEventBindForSubMesh(eventData: MaterialPluginBindForSubMesh): void;
    protected _handlePluginEventHasRenderTargetTextures(eventData: MaterialPluginHasRenderTargetTextures): void;
    protected _handlePluginEventFillRenderTargetTextures(eventData: MaterialPluginFillRenderTargetTextures): void;
    protected _handlePluginEvent(id: number, info: MaterialPluginGetActiveTextures | MaterialPluginGetAnimatables | MaterialPluginHasTexture | MaterialPluginDisposed | MaterialPluginGetDefineNames | MaterialPluginPrepareEffect | MaterialPluginPrepareUniformBuffer): void;
    protected _collectPointNames(shaderType: string, customCode: Nullable<{
        [pointName: string]: string;
    }> | undefined): void;
    protected _injectCustomCode(eventData: MaterialPluginPrepareEffect, existingCallback?: (shaderType: string, code: string) => string): ShaderCustomProcessingFunction;
}
/**
 * Type for plugin material factories.
 */
export type PluginMaterialFactory = (material: Material) => Nullable<MaterialPluginBase>;
/**
 * Registers side effects for the material plugin manager.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterMaterialPluginManager(): void;
/**
 * Registers a new material plugin through a factory, or updates it. This makes the plugin available to all materials instantiated after its registration.
 * Register side effects for materialPlugin.
 * Safe to call multiple times; only the first call has an effect.
 * @param pluginName The plugin name
 * @param factory The factory function which allows to create the plugin
 */
export declare function RegisterMaterialPlugin(pluginName: string, factory: PluginMaterialFactory): void;
/**
 * Removes a material plugin from the list of global plugins.
 * @param pluginName The plugin name
 * @returns true if the plugin has been removed, else false
 */
export declare function UnregisterMaterialPlugin(pluginName: string): boolean;
/**
 * Clear the list of global material plugins
 */
export declare function UnregisterAllMaterialPlugins(): void;
