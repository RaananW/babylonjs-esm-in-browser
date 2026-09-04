/** This file must only contain pure code and pure imports */
import { GaussianSplattingMaterial } from "../../Materials/GaussianSplatting/gaussianSplattingMaterial.pure.js";
import { GaussianSplattingDebugMaterialPlugin } from "../../Materials/GaussianSplatting/gaussianSplattingDebugMaterialPlugin.pure.js";
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
export class GaussianSplattingDebugger {
    constructor() {
        this._plugins = [];
        this._meshes = [];
        this._disposeObservers = [];
        // observable.add() returns Nullable<Observer<T>>; Observable.remove() accepts null safely.
        this._partCountObservers = [];
        this._partRemovedObservers = [];
        // Cached option state so newly added meshes inherit current settings
        this._clippingBox = null;
        this._opacityCulling = null;
        this._sizeCulling = null;
        this._opacityScale = 1.0;
        this._opacitySaturate = false;
        this._shDc = true;
        this._shOrder1 = true;
        this._shOrder2 = true;
        this._shOrder3 = true;
        this._shOrder4 = true;
    }
    /**
     * Adds a mesh to the debugger, attaching a debug plugin to its material.
     * The mesh must already have a GaussianSplattingMaterial assigned (i.e., data
     * must have been loaded at least once). Current option values are applied immediately.
     * The mesh is automatically unregistered if it is disposed.
     * @param mesh The mesh to register.
     */
    addMesh(mesh) {
        if (this._meshes.indexOf(mesh) !== -1) {
            return;
        }
        const mat = mesh.material;
        if (!(mat instanceof GaussianSplattingMaterial)) {
            throw new Error("GaussianSplattingDebugger.addMesh: mesh must have a GaussianSplattingMaterial.");
        }
        const plugin = new GaussianSplattingDebugMaterialPlugin(mat);
        plugin.partCount = mesh.partCount ?? 0;
        this._applyAllTo(plugin);
        this._meshes.push(mesh);
        this._plugins.push(plugin);
        this._disposeObservers.push(mesh.onDisposeObservable.add(() => this.removeMesh(mesh)));
        this._partCountObservers.push(mesh.onPartCountChangedObservable.add((count) => {
            plugin.partCount = count;
        }));
        this._partRemovedObservers.push(mesh.onPartRemovedObservable.add((removedIndex) => {
            plugin.shiftPartOptions(removedIndex);
        }));
    }
    /**
     * Removes a mesh and disposes its debug plugin.
     * @param mesh The mesh to unregister.
     */
    removeMesh(mesh) {
        const idx = this._meshes.indexOf(mesh);
        if (idx === -1) {
            return;
        }
        mesh.onDisposeObservable.remove(this._disposeObservers[idx]);
        mesh.onPartCountChangedObservable.remove(this._partCountObservers[idx]);
        mesh.onPartRemovedObservable.remove(this._partRemovedObservers[idx]);
        this._plugins[idx].dispose();
        this._meshes.splice(idx, 1);
        this._plugins.splice(idx, 1);
        this._disposeObservers.splice(idx, 1);
        this._partCountObservers.splice(idx, 1);
        this._partRemovedObservers.splice(idx, 1);
    }
    /** Disposes all debug plugins and clears the mesh list. */
    dispose() {
        for (let i = 0; i < this._meshes.length; i++) {
            this._meshes[i].onDisposeObservable.remove(this._disposeObservers[i]);
            this._meshes[i].onPartCountChangedObservable.remove(this._partCountObservers[i]);
            this._meshes[i].onPartRemovedObservable.remove(this._partRemovedObservers[i]);
            this._plugins[i].dispose();
        }
        this._meshes.length = 0;
        this._plugins.length = 0;
        this._disposeObservers.length = 0;
        this._partCountObservers.length = 0;
        this._partRemovedObservers.length = 0;
    }
    /**
     * Returns the min/max size range of splats in a mesh.
     * Convenience wrapper for GaussianSplattingMeshBase.splatSizeRange.
     * @param mesh The mesh to query.
     * @returns the splat size range, or null if not yet computed.
     */
    static GetSplatSizeRange(mesh) {
        return mesh.splatSizeRange;
    }
    // ----- Option setters (broadcast to all plugins) -----
    _applyAllTo(plugin) {
        plugin.clippingBox = this._clippingBox;
        plugin.opacityCulling = this._opacityCulling;
        plugin.sizeCulling = this._sizeCulling;
        plugin.opacityScale = this._opacityScale;
        plugin.opacitySaturate = this._opacitySaturate;
        plugin.shDc = this._shDc;
        plugin.shOrder1 = this._shOrder1;
        plugin.shOrder2 = this._shOrder2;
        plugin.shOrder3 = this._shOrder3;
        plugin.shOrder4 = this._shOrder4;
    }
    /**
     * World-space axis-aligned clipping box. Splats outside are not rendered.
     * Set to null to disable.
     */
    get clippingBox() {
        return this._clippingBox;
    }
    set clippingBox(value) {
        this._clippingBox = value;
        for (const p of this._plugins) {
            p.clippingBox = value;
        }
    }
    /**
     * Opacity culling range [0..1]. Splats outside this range are not rendered.
     * Set to null to disable.
     */
    get opacityCulling() {
        return this._opacityCulling;
    }
    set opacityCulling(value) {
        this._opacityCulling = value;
        for (const p of this._plugins) {
            p.opacityCulling = value;
        }
    }
    /**
     * Size culling range. Size is pow(|det(Σ)|, 1/6) of the 3D covariance matrix,
     * equal to the geometric mean of the principal radii. Splats outside this range are not rendered.
     * Use GaussianSplattingDebugger.GetSplatSizeRange(mesh) to find an asset's range.
     * Set to null to disable.
     */
    get sizeCulling() {
        return this._sizeCulling;
    }
    set sizeCulling(value) {
        this._sizeCulling = value;
        for (const p of this._plugins) {
            p.sizeCulling = value;
        }
    }
    /** Scalar multiplier applied to every splat's opacity. 1.0 = no change. */
    get opacityScale() {
        return this._opacityScale;
    }
    set opacityScale(value) {
        this._opacityScale = value;
        for (const p of this._plugins) {
            p.opacityScale = value;
        }
    }
    /**
     * When true, replaces the Gaussian spatial falloff with a flat uniform opacity,
     * showing each splat as a solid disk.
     */
    get opacitySaturate() {
        return this._opacitySaturate;
    }
    set opacitySaturate(value) {
        this._opacitySaturate = value;
        for (const p of this._plugins) {
            p.opacitySaturate = value;
        }
    }
    /** Include the DC (base) color from colorsTexture. Default: true. */
    get shDc() {
        return this._shDc;
    }
    set shDc(value) {
        this._shDc = value;
        for (const p of this._plugins) {
            p.shDc = value;
        }
    }
    /** Include SH band 1 contribution. Default: true. */
    get shOrder1() {
        return this._shOrder1;
    }
    set shOrder1(value) {
        this._shOrder1 = value;
        for (const p of this._plugins) {
            p.shOrder1 = value;
        }
    }
    /** Include SH band 2 contribution. Default: true. */
    get shOrder2() {
        return this._shOrder2;
    }
    set shOrder2(value) {
        this._shOrder2 = value;
        for (const p of this._plugins) {
            p.shOrder2 = value;
        }
    }
    /** Include SH band 3 contribution. Default: true. */
    get shOrder3() {
        return this._shOrder3;
    }
    set shOrder3(value) {
        this._shOrder3 = value;
        for (const p of this._plugins) {
            p.shOrder3 = value;
        }
    }
    /** Include SH band 4 contribution. Default: true. */
    get shOrder4() {
        return this._shOrder4;
    }
    set shOrder4(value) {
        this._shOrder4 = value;
        for (const p of this._plugins) {
            p.shOrder4 = value;
        }
    }
    // ----- Per-part API (compound meshes only) -----
    /**
     * Sets per-part debug overrides for a specific part of a compound mesh.
     * The mesh must already be registered via addMesh(). Logs an error if the mesh
     * is not compound (partCount is 0).
     * @param mesh The compound mesh.
     * @param partIndex The zero-based part index.
     * @param options Partial set of debug options to override for this part.
     */
    setPartOptions(mesh, partIndex, options) {
        const idx = this._meshes.indexOf(mesh);
        if (idx < 0) {
            return;
        }
        this._plugins[idx].setPartOptions(partIndex, options);
    }
    /**
     * Clears all per-part debug overrides for a specific part, falling back to global settings.
     * @param mesh The compound mesh.
     * @param partIndex The zero-based part index.
     */
    clearPartOptions(mesh, partIndex) {
        const idx = this._meshes.indexOf(mesh);
        if (idx < 0) {
            return;
        }
        this._plugins[idx].clearPartOptions(partIndex);
    }
}
//# sourceMappingURL=gaussianSplattingDebugger.pure.js.map