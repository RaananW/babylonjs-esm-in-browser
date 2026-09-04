/** This file must only contain pure code and pure imports */
import { type Nullable } from "../../types.js";
import { type Vector3 } from "../../Maths/math.vector.js";
import { type IGaussianSplattingDebugOptions } from "../../Materials/GaussianSplatting/gaussianSplattingDebugMaterialPlugin.pure.js";
import { type GaussianSplattingMeshBase } from "./gaussianSplattingMeshBase.pure.js";
/**
 * Manages debug rendering options across a set of Gaussian splat meshes.
 * Create one instance, add meshes via addMesh(), then set options to apply
 * them to every registered mesh simultaneously.
 *
 * All options default to their "off" states so there is no rendering cost
 * until a feature is explicitly enabled.
 *
 * @example
 * ```ts
 * // Global options — applied to every registered mesh
 * const gsDebugger = new GaussianSplattingDebugger();
 * gsDebugger.addMesh(mesh1);
 * gsDebugger.addMesh(compoundMesh); // compound mesh with multiple parts
 * gsDebugger.clippingBox = { min: new Vector3(-2, -2, -2), max: new Vector3(2, 2, 2) };
 * gsDebugger.shOrder1 = false;
 *
 * // Per-part override — saturate opacity on part 0 of the compound mesh only,
 * // leaving all other parts (and mesh1) unaffected
 * gsDebugger.setPartOptions(compoundMesh, 0, { opacitySaturate: true });
 * // Later, restore part 0 to the global setting
 * gsDebugger.clearPartOptions(compoundMesh, 0);
 * ```
 */
export declare class GaussianSplattingDebugger {
    private _plugins;
    private _meshes;
    private _disposeObservers;
    private _partCountObservers;
    private _partRemovedObservers;
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
    /**
     * Adds a mesh to the debugger, attaching a debug plugin to its material.
     * The mesh must already have a GaussianSplattingMaterial assigned (i.e., data
     * must have been loaded at least once). Current option values are applied immediately.
     * The mesh is automatically unregistered if it is disposed.
     * @param mesh The mesh to register.
     */
    addMesh(mesh: GaussianSplattingMeshBase): void;
    /**
     * Removes a mesh and disposes its debug plugin.
     * @param mesh The mesh to unregister.
     */
    removeMesh(mesh: GaussianSplattingMeshBase): void;
    /** Disposes all debug plugins and clears the mesh list. */
    dispose(): void;
    /**
     * Returns the min/max size range of splats in a mesh.
     * Convenience wrapper for GaussianSplattingMeshBase.splatSizeRange.
     * @param mesh The mesh to query.
     * @returns the splat size range, or null if not yet computed.
     */
    static GetSplatSizeRange(mesh: GaussianSplattingMeshBase): Nullable<{
        min: number;
        max: number;
    }>;
    private _applyAllTo;
    /**
     * World-space axis-aligned clipping box. Splats outside are not rendered.
     * Set to null to disable.
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
     * Opacity culling range [0..1]. Splats outside this range are not rendered.
     * Set to null to disable.
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
     * equal to the geometric mean of the principal radii. Splats outside this range are not rendered.
     * Use GaussianSplattingDebugger.GetSplatSizeRange(mesh) to find an asset's range.
     * Set to null to disable.
     */
    get sizeCulling(): Nullable<{
        min: number;
        max: number;
    }>;
    set sizeCulling(value: Nullable<{
        min: number;
        max: number;
    }>);
    /** Scalar multiplier applied to every splat's opacity. 1.0 = no change. */
    get opacityScale(): number;
    set opacityScale(value: number);
    /**
     * When true, replaces the Gaussian spatial falloff with a flat uniform opacity,
     * showing each splat as a solid disk.
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
     * Sets per-part debug overrides for a specific part of a compound mesh.
     * The mesh must already be registered via addMesh(). Logs an error if the mesh
     * is not compound (partCount is 0).
     * @param mesh The compound mesh.
     * @param partIndex The zero-based part index.
     * @param options Partial set of debug options to override for this part.
     */
    setPartOptions(mesh: GaussianSplattingMeshBase, partIndex: number, options: Partial<IGaussianSplattingDebugOptions>): void;
    /**
     * Clears all per-part debug overrides for a specific part, falling back to global settings.
     * @param mesh The compound mesh.
     * @param partIndex The zero-based part index.
     */
    clearPartOptions(mesh: GaussianSplattingMeshBase, partIndex: number): void;
}
