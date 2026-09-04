/** This file must only contain pure code and pure imports */
import { type Nullable } from "../../types.js";
import { type Scene } from "../../scene.js";
import { type AbstractEngine } from "../../Engines/abstractEngine.js";
import { type SubMesh } from "../../Meshes/subMesh.js";
import { type UniformBuffer } from "../uniformBuffer.js";
import { MaterialDefines } from "../materialDefines.js";
import { MaterialPluginBase } from "../materialPluginBase.pure.js";
import { ShaderLanguage } from "../shaderLanguage.js";
import { type Vector3 } from "../../Maths/math.vector.js";
import { type GaussianSplattingMaterial } from "./gaussianSplattingMaterial.pure.js";
/** @internal */
declare class GaussianSplattingDebugDefines extends MaterialDefines {
    /** Defines whether any debug feature is active */
    GS_DBG_ENABLED: boolean;
    /** Defines whether world-space clipping box is enabled (0: off, 1: on) */
    GS_DBG_CLIP: number;
    /** Defines whether opacity culling is enabled (0: off, 1: on) */
    GS_DBG_CULL_OPACITY: number;
    /** Defines whether size culling is enabled (0: off, 1: on) */
    GS_DBG_CULL_SIZE: number;
    /** Defines whether per-splat opacity scaling is enabled (0: off, 1: on) */
    GS_DBG_OPACITY_SCALE: number;
    /** Defines whether opacity saturation (flat disk) is enabled (0: off, 1: on) */
    GS_DBG_OPACITY_SATURATE: number;
    /** Defines whether the DC (base) SH color is included (0: off, 1: on) */
    GS_DBG_SH_DC: number;
    /** Defines whether SH band 1 contribution is included (0: off, 1: on) */
    GS_DBG_SH_ORDER1: number;
    /** Defines whether SH band 2 contribution is included (0: off, 1: on) */
    GS_DBG_SH_ORDER2: number;
    /** Defines whether SH band 3 contribution is included (0: off, 1: on) */
    GS_DBG_SH_ORDER3: number;
    /** Defines whether SH band 4 contribution is included (0: off, 1: on) */
    GS_DBG_SH_ORDER4: number;
}
/**
 * Per-part debug options for compound Gaussian splat meshes.
 * Each field is optional; unset fields fall back to the global setting on the plugin,
 * and if that is also unset, a neutral value is used (no culling, full SH, etc.).
 */
export interface IGaussianSplattingDebugOptions {
    /** World-space axis-aligned clipping box, or null to disable. */
    clippingBox: Nullable<{
        min: Vector3;
        max: Vector3;
    }>;
    /** Opacity culling range [0..1], or null to disable. */
    opacityCulling: Nullable<{
        min: number;
        max: number;
    }>;
    /** Size culling range, or null to disable. */
    sizeCulling: Nullable<{
        min: number;
        max: number;
    }>;
    /** Scalar opacity multiplier. 1.0 = no change. */
    opacityScale: number;
    /** When true, replaces Gaussian falloff with flat disk opacity. */
    opacitySaturate: boolean;
    /** Include the DC (base) SH color. */
    shDc: boolean;
    /** Include SH band 1 contribution. */
    shOrder1: boolean;
    /** Include SH band 2 contribution. */
    shOrder2: boolean;
    /** Include SH band 3 contribution. */
    shOrder3: boolean;
    /** Include SH band 4 contribution. */
    shOrder4: boolean;
}
/**
 * Debug plugin for GaussianSplattingMaterial.
 * Provides runtime controls for clipping, opacity/size culling, opacity scaling,
 * opacity saturation, and per-SH-order toggling. All features are gated behind
 * the GS_DBG_ENABLED shader define — when every option is at its default value
 * the define is absent and the shader compiles to identical code as without the plugin.
 *
 * In compound mode (partCount \> 0), per-part overrides can be set via setPartOptions().
 * Global settings act as defaults; per-part settings override them for that part index.
 */
export declare class GaussianSplattingDebugMaterialPlugin extends MaterialPluginBase {
    private _clippingBox;
    private _opacityCulling;
    private _sizeCulling;
    private _opacityScale;
    private _opacitySaturate;
    private _shDc;
    private _shOrder1;
    private _shOrder2;
    private _shOrder3;
    private _shOrder4;
    private _partCount;
    private _partClippingBoxes;
    private _partOpacityCullings;
    private _partSizeCullings;
    private _partOpacityScales;
    private _partOpacitySaturates;
    private _partShDcs;
    private _partShOrder1s;
    private _partShOrder2s;
    private _partShOrder3s;
    private _partShOrder4s;
    private readonly _partArrays;
    private _dbgPartDataTexture;
    private _textureDirty;
    private _maxPartCount;
    /**
     * Creates a new GaussianSplattingDebugMaterialPlugin.
     * @param material The GaussianSplattingMaterial to attach the plugin to.
     */
    constructor(material: GaussianSplattingMaterial);
    private _isAnyFeatureActive;
    private _markDirty;
    /**
     * Number of parts in compound mode. Set automatically by GaussianSplattingDebugger.addMesh().
     * When 0 (non-compound), setPartOptions() logs an error.
     * @returns the part count
     */
    get partCount(): number;
    set partCount(count: number);
    /**
     * Sets per-part debug overrides for the given part index.
     * Only valid on compound meshes (partCount \> 0); logs an error otherwise.
     * @param partIndex The zero-based part index.
     * @param options Partial set of debug options to override for this part.
     */
    setPartOptions(partIndex: number, options: Partial<IGaussianSplattingDebugOptions>): void;
    /**
     * Clears all per-part debug overrides for the given part index,
     * falling back to global settings.
     * @param partIndex The zero-based part index.
     */
    clearPartOptions(partIndex: number): void;
    /**
     * Removes the per-part override slot at `removedIndex` and shifts all higher-indexed
     * slots down by one, keeping the arrays aligned with the compound mesh's new part layout.
     * @param removedIndex The original (pre-removal) part index.
     * @internal
     */
    shiftPartOptions(removedIndex: number): void;
    /**
     * World-space axis-aligned clipping box. Splats outside are not rendered.
     * Set to null to disable clipping.
     * Example: `{ min: new Vector3(-2,-2,-2), max: new Vector3(2,2,2) }`
     */
    get clippingBox(): Nullable<{
        min: Vector3;
        max: Vector3;
    }>;
    set clippingBox(value: Nullable<{
        min: Vector3;
        max: Vector3;
    }>);
    /**
     * Opacity culling range [0..1]. Splats whose stored opacity falls outside this
     * range are not rendered. Set to null to disable.
     */
    get opacityCulling(): Nullable<{
        min: number;
        max: number;
    }>;
    set opacityCulling(value: Nullable<{
        min: number;
        max: number;
    }>);
    /**
     * Size culling range. Size is pow(|det(Σ)|, 1/6) of the 3D covariance matrix,
     * equal to the geometric mean of the principal radii. Use GaussianSplattingMeshBase.splatSizeRange
     * to find the asset's range. Set to null to disable.
     */
    get sizeCulling(): Nullable<{
        min: number;
        max: number;
    }>;
    set sizeCulling(value: Nullable<{
        min: number;
        max: number;
    }>);
    /**
     * Scalar multiplier applied to every splat's opacity after all other modifiers.
     * 1.0 (default) = no change.
     */
    get opacityScale(): number;
    set opacityScale(value: number);
    /**
     * When true, replaces the Gaussian spatial falloff with a flat uniform opacity,
     * making each splat appear as a solid disk with its raw alpha value.
     */
    get opacitySaturate(): boolean;
    set opacitySaturate(value: boolean);
    /** Include the DC (base) color from colorsTexture. Default: true. */
    get shDc(): boolean;
    set shDc(value: boolean);
    /** Include SH band 1 contribution. Default: true. */
    get shOrder1(): boolean;
    set shOrder1(value: boolean);
    /** Include SH band 2 contribution. Default: true. */
    get shOrder2(): boolean;
    set shOrder2(value: boolean);
    /** Include SH band 3 contribution. Default: true. */
    get shOrder3(): boolean;
    set shOrder3(value: boolean);
    /** Include SH band 4 contribution. Default: true. */
    get shOrder4(): boolean;
    set shOrder4(value: boolean);
    /**
     * Adds the per-part debug data texture name to the sampler list so the effect can bind it.
     * @param samplers the sampler list to populate
     */
    getSamplers(samplers: string[]): void;
    /** @returns the class name of this plugin */
    getClassName(): string;
    /**
     * @param shaderLanguage the shader language to check
     * @returns true for GLSL and WGSL
     */
    isCompatible(shaderLanguage: ShaderLanguage): boolean;
    /**
     * Always ready — no async resources.
     * @param _defines unused
     * @param _scene unused
     * @param _engine unused
     * @param _subMesh unused
     * @returns true
     */
    isReadyForSubMesh(_defines: MaterialDefines, _scene: Scene, _engine: AbstractEngine, _subMesh: SubMesh): boolean;
    /**
     * Sets shader defines from current property state. GS_DBG_ENABLED is set to true
     * only when at least one feature is non-default, ensuring zero overhead otherwise.
     * Sub-flags also check per-part arrays so compound-only overrides activate the correct
     * code paths even when the global setting is at its default.
     * @param defines the defines object
     */
    prepareDefines(defines: GaussianSplattingDebugDefines): void;
    /**
     * Returns shader code injections for the debug features.
     * @param shaderType "vertex" or "fragment"
     * @param shaderLanguage GLSL or WGSL
     * @returns map of injection-point name to injected code, or null
     */
    getCustomCode(shaderType: string, shaderLanguage?: ShaderLanguage): Nullable<{
        [pointName: string]: string;
    }>;
    private _getCustomCodeGLSL;
    private _getCustomCodeWGSL;
    /**
     * Declares the non-compound scalar debug uniform names as external so the Effect can
     * resolve their locations. WGSL uniforms are declared inline in getCustomCode() injections.
     * @returns uniform descriptor with externalUniforms list
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
    private _buildTextureData;
    private _updateOrCreateTexture;
    /**
     * Binds uniform values each frame. Scalar uniforms are uploaded for non-compound mode;
     * the per-part data texture is updated and bound for compound mode.
     * @param _uniformBuffer unused
     * @param _scene the current scene
     * @param _engine unused
     * @param subMesh the submesh being rendered
     */
    bindForSubMesh(_uniformBuffer: UniformBuffer, _scene: Scene, _engine: AbstractEngine, subMesh: SubMesh): void;
    /**
     * Disposes the per-part data texture.
     * @param _forceDisposeTextures unused; the LUT texture is always disposed as it is owned by this plugin
     */
    dispose(_forceDisposeTextures?: boolean): void;
}
/**
 * Register side effects for GaussianSplattingDebugMaterialPlugin.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterGaussianSplattingDebugMaterialPlugin(): void;
export {};
