/** This file must only contain pure code and pure imports */
import { type Nullable } from "../../types.js";
import { type Scene } from "../../scene.pure.js";
import { type AbstractEngine } from "../../Engines/abstractEngine.pure.js";
import { type SubMesh } from "../../Meshes/subMesh.pure.js";
import { type UniformBuffer } from "../uniformBuffer.js";
import { type MaterialDefines } from "../materialDefines.js";
import { type Color3 } from "../../Maths/math.color.pure.js";
import { MaterialPluginBase } from "../materialPluginBase.pure.js";
import { ShaderLanguage } from "../shaderLanguage.js";
import { type GaussianSplattingMaterial } from "./gaussianSplattingMaterial.pure.js";
/**
 * Plugin for GaussianSplattingMaterial that replaces per-splat colors with a
 * solid color per compound-mesh part. Each part index maps to a single Color3
 * value, which is looked up in a uniform array in the fragment shader.
 */
export declare class GaussianSplattingSolidColorMaterialPlugin extends MaterialPluginBase {
    private _partColors;
    private _maxPartCount;
    private _isEnabled;
    private readonly _partColorArray;
    /**
     * Whether the solid-color override is active. When false, splats
     * render with their original per-splat colors.
     * Toggled via a shader uniform so no recompilation is required.
     */
    get isEnabled(): boolean;
    set isEnabled(value: boolean);
    /** @internal */
    _onIsEnabledChanged(): void;
    /**
     * Creates a new GaussianSplatSolidColorPlugin.
     * @param material The GaussianSplattingMaterial to attach the plugin to.
     * @param partColors A map from part index to the solid Color3 for that part.
     * @param maxPartCount The maximum number of parts supported. This determines the size of the uniform array.
     */
    constructor(material: GaussianSplattingMaterial, partColors: Color3[], maxPartCount?: number);
    /**
     * Updates the part colors dynamically.
     * @param partColors A map from part index to the solid Color3 for that part.
     */
    updatePartColors(partColors: Color3[]): void;
    /**
     * @returns the class name
     */
    getClassName(): string;
    /**
     * Indicates this plugin supports both GLSL and WGSL.
     * @param shaderLanguage the shader language to check
     * @returns true for GLSL and WGSL
     */
    isCompatible(shaderLanguage: ShaderLanguage): boolean;
    /**
     * Always ready — no textures or async resources to wait on.
     * @param _defines the defines
     * @param _scene the scene
     * @param _engine the engine
     * @param _subMesh the submesh
     * @returns true
     */
    isReadyForSubMesh(_defines: MaterialDefines, _scene: Scene, _engine: AbstractEngine, _subMesh: SubMesh): boolean;
    /**
     * Returns custom shader code fragments to inject solid-color rendering.
     *
     * @param shaderType "vertex" or "fragment"
     * @param shaderLanguage the shader language to use (default: GLSL)
     * @returns null or a map of injection point names to code strings
     */
    getCustomCode(shaderType: string, shaderLanguage?: ShaderLanguage): Nullable<{
        [pointName: string]: string;
    }>;
    private _getCustomCodeGLSL;
    private _getCustomCodeWGSL;
    /**
     * Registers the plugin uniforms with the engine so that
     * the Effect can resolve their locations.
     * @returns uniform descriptions
     */
    getUniforms(): {
        ubo?: Array<{
            name: string;
            size?: number;
            type?: string;
            arraySize?: number;
        }>;
        vertex?: string;
        fragment?: string;
        externalUniforms?: string[];
    };
    /**
     * Binds the plugin uniforms each frame.
     * @param _uniformBuffer the uniform buffer (unused — we bind directly on the effect)
     * @param _scene the current scene
     * @param _engine the current engine
     * @param subMesh the submesh being rendered
     */
    bindForSubMesh(_uniformBuffer: UniformBuffer, _scene: Scene, _engine: AbstractEngine, subMesh: SubMesh): void;
}
/**
 * Register side effects for gaussianSplattingSolidColorMaterialPlugin.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterGaussianSplattingSolidColorMaterialPlugin(): void;
