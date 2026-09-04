/** This file must only contain pure code and pure imports */
import { type Nullable } from "../../types.js";
import { type Scene } from "../../scene.pure.js";
import { type AbstractMesh } from "../abstractMesh.pure.js";
import { Mesh } from "../mesh.pure.js";
import { BoundingInfo } from "../../Culling/boundingInfo.js";
import { type GaussianSplattingMesh } from "./gaussianSplattingMesh.pure.js";
import { type Ray } from "../../Culling/ray.core.js";
import { PickingInfo } from "../../Collisions/pickingInfo.js";
import { Vector3 } from "../../Maths/math.vector.pure.js";
/**
 * Class used as a proxy mesh for a part of a compound Gaussian Splatting mesh
 */
export declare class GaussianSplattingPartProxyMesh extends Mesh {
    /**
     * Local-space bounds for this part, stored directly on the proxy so it does not
     * need to retain a reference to the original source mesh.
     */
    private _minimum;
    private _maximum;
    private _disabledVisibility;
    /**
     * The index of the part in the compound mesh (internal storage)
     */
    private _partIndex;
    /**
     * Number of splats owned by this part.
     * @internal
     */
    _vertexCount: number;
    /**
     * Offset of this part in the compound splat ordering.
     * @internal
     */
    _splatsDataOffset: number;
    /**
     * Texel offset of this part inside the compound SH textures.
     * This matches the splat offset because SH data is stored one texel per splat.
     * @internal
     */
    _shDataOffset: number;
    /**
     * Gets the index of the part in the compound mesh
     */
    get partIndex(): number;
    /**
     * The compound mesh that owns this part proxy
     */
    readonly compoundSplatMesh: GaussianSplattingMesh;
    /**
     * Backward-compatible alias for the owning compound mesh.
     * @deprecated Use `compoundSplatMesh` instead.
     */
    get proxiedMesh(): GaussianSplattingMesh;
    /**
     * Creates a new Gaussian Splatting part proxy mesh
     * @param name The name of the proxy mesh
     * @param scene The scene the proxy mesh belongs to
     * @param compoundSplatMesh The compound mesh that owns this part proxy
     * @param partIndex The index of the part in the compound mesh
     * @param boundingInfo Local-space bounds of the part inside the compound mesh
     * @param vertexCount Number of splats owned by the part
     * @param splatsDataOffset Offset of the part in the compound splat ordering
     * @param shDataOffset Offset of the part in the compound SH textures
     */
    constructor(name: string, scene: Nullable<Scene>, compoundSplatMesh: GaussianSplattingMesh, partIndex: number, boundingInfo: BoundingInfo, vertexCount: number, splatsDataOffset: number, shDataOffset?: number);
    /**
     * Updates the bounding info of this proxy mesh from its stored part metadata.
     */
    updateBoundingInfoFromPartData(): void;
    /**
     * Backward-compatible alias retained while callers move away from source-mesh based semantics.
     */
    updateBoundingInfoFromProxiedMesh(): void;
    private _applyBoundingInfo;
    /**
     * Returns the class name
     * @returns "GaussianSplattingPartProxyMesh"
     */
    getClassName(): string;
    /**
     * Returns the world-space bounding vectors spanning this part (and any descendants).
     *
     * A part proxy carries real bounds (set via {@link setBoundingInfo}) but owns NO geometry — the compound
     * holds the splats. The base {@link Node.getHierarchyBoundingVectors} only folds in a mesh's own bounds
     * when it has a `subMeshes` array (a geometry-less mesh's is `undefined`) and skips zero-vertex descendants,
     * so for a bare proxy it returns a degenerate ±MAX_VALUE box. Callers that treat the proxy as a normal mesh
     * (camera framing, grounding, picking) would then derive NaN / astronomically large offsets. This override
     * folds the proxy's own world-space box into whatever the base returns for descendants.
     * @param includeDescendants include bounding vectors from descendant meshes
     * @param predicate optional filter applied to each descendant mesh
     * @returns the world-space min/max spanning this part (and any descendants)
     */
    getHierarchyBoundingVectors(includeDescendants?: boolean, predicate?: Nullable<(abstractMesh: AbstractMesh) => boolean>): {
        min: Vector3;
        max: Vector3;
    };
    /**
     * Updates the part index for this proxy mesh.
     * This should only be called internally when parts are removed from the compound mesh.
     * @param newPartIndex the new part index
     * @internal
     */
    updatePartIndex(newPartIndex: number): void;
    /**
     * Updates the per-part metadata for this proxy mesh.
     * This is used internally when compound parts are rebuilt and re-indexed.
     * @param vertexCount the number of splats owned by the part
     * @param splatsDataOffset the new splat offset in the compound
     * @param shDataOffset the new SH texel offset in the compound
     * @internal
     */
    updatePartMetadata(vertexCount: number, splatsDataOffset: number, shDataOffset?: number): void;
    /**
     * Gets whether the part should be visible when this proxy is enabled
     */
    get isVisible(): boolean;
    /**
     * Sets whether the part should be visible when this proxy is enabled
     */
    set isVisible(value: boolean);
    /**
     * Gets the visibility applied to the part while this proxy is enabled (0.0 to 1.0)
     */
    get visibility(): number;
    /**
     * Sets the visibility to apply to the part while this proxy is enabled (0.0 to 1.0)
     */
    set visibility(value: number);
    /**
     * Checks if a ray intersects with this proxy mesh using only bounding info
     * @param ray defines the ray to test
     * @returns the picking info with this mesh set as pickedMesh if hit
     */
    intersects(ray: Ray): PickingInfo;
    /**
     * Serialize current GaussianSplattingPartProxyMesh
     * @param serializationObject defines the object which will receive the serialization data
     * @returns the serialized object
     */
    serialize(serializationObject?: any): any;
    /**
     * Parses a serialized GaussianSplattingPartProxyMesh
     * @param parsedMesh the serialized mesh
     * @param scene the scene to create the GaussianSplattingPartProxyMesh in
     * @returns the created GaussianSplattingPartProxyMesh
     */
    static Parse(parsedMesh: any, scene: Scene): GaussianSplattingPartProxyMesh;
}
/**
 * Register side effects for gaussianSplattingPartProxyMesh.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterGaussianSplattingPartProxyMesh(): void;
