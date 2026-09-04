/** This file must only contain pure code and pure imports */
import { type Nullable } from "../../types.js";
import { type Scene } from "../../scene.pure.js";
import { type AbstractEngine } from "../../Engines/abstractEngine.pure.js";
import { type SubMesh } from "../../Meshes/subMesh.pure.js";
import { type UniformBuffer } from "../uniformBuffer.js";
import { type MaterialDefines } from "../materialDefines.js";
import { MaterialPluginBase } from "../materialPluginBase.pure.js";
import { ShaderLanguage } from "../shaderLanguage.js";
import { type GaussianSplattingMaterial } from "./gaussianSplattingMaterial.pure.js";
/**
 * Plugin for GaussianSplattingMaterial that replaces per-splat color output with
 * a pre-computed picking color for GPU-based hit testing.
 *
 * The picking color is computed on the CPU by encoding a 24-bit picking ID as RGB
 * (matching the readback decoding in GPUPicker).
 * @experimental
 */
export declare class GaussianSplattingGpuPickingMaterialPlugin extends MaterialPluginBase {
    private _pickingColor;
    private _isCompound;
    private _partPickingColors;
    private _partVisibility;
    private _defaultPartVisibility;
    private _maxPartCount;
    private _enableDepthPicking;
    private _enablePackedDepthPicking;
    /**
     * Creates a new GaussianSplattingGpuPickingMaterialPlugin.
     * @param material The GaussianSplattingMaterial to attach the plugin to.
     * @param maxPartCount The maximum number of parts supported for compound meshes.
     */
    constructor(material: GaussianSplattingMaterial, maxPartCount?: number);
    /**
     * Enables writing the GPU picker depth MRT attachment.
     */
    set enableDepthPicking(value: boolean);
    /**
     * Enables byte-packed depth output for the GPU picker depth MRT attachment.
     */
    set enablePackedDepthPicking(value: boolean);
    /**
     * Encodes a 24-bit picking ID into normalized RGB components.
     * @param id The picking ID to encode
     * @returns A tuple [r, g, b] with values in [0, 1]
     */
    static EncodeIdToColor(id: number): [number, number, number];
    /**
     * Sets the picking color for a non-compound mesh from a picking ID.
     * The ID is encoded into an RGB color on the CPU.
     * @param id The 24-bit picking ID.
     */
    set meshId(id: number);
    /**
     * Sets whether this material is for a compound mesh with per-part picking.
     */
    set isCompound(value: boolean);
    /**
     * Gets whether this material is for a compound mesh with per-part picking.
     */
    get isCompound(): boolean;
    /**
     * Sets the per-part picking colors from an array of picking IDs.
     * Each ID is encoded into an RGB color on the CPU.
     * @param ids Array mapping part index to picking ID.
     */
    set partMeshIds(ids: number[]);
    /**
     * Sets which parts are active (pickable) for the compound picking pass.
     * Parts not in the set are discarded in the shader by overriding partVisibility to 0.
     * @param activeParts Array of part indices that should be pickable.
     */
    setPartActive(activeParts: number[]): void;
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
     * Sets the defines for the next rendering.
     * @param defines the list of defines to update
     */
    prepareDefines(defines: MaterialDefines): void;
    /**
     * Returns custom shader code to inject GPU picking color output.
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
     * Registers the picking uniforms with the engine.
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
     * Binds the picking color uniform(s) each frame.
     * @param _uniformBuffer the uniform buffer (unused — we bind directly on the effect)
     * @param _scene the current scene
     * @param _engine the current engine
     * @param subMesh the submesh being rendered
     */
    bindForSubMesh(_uniformBuffer: UniformBuffer, _scene: Scene, _engine: AbstractEngine, subMesh: SubMesh): void;
}
/**
 * Register side effects for gaussianSplattingGpuPickingMaterialPlugin.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterGaussianSplattingGpuPickingMaterialPlugin(): void;
