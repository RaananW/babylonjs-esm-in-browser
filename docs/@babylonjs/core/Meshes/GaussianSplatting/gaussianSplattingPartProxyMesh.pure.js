/** This file must only contain pure code and pure imports */
import { Mesh } from "../mesh.pure.js";
import { BoundingInfo } from "../../Culling/boundingInfo.js";
import { PickingInfo } from "../../Collisions/pickingInfo.js";
import { Vector3 } from "../../Maths/math.vector.pure.js";
/**
 * Class used as a proxy mesh for a part of a compound Gaussian Splatting mesh
 */
export class GaussianSplattingPartProxyMesh extends Mesh {
    /**
     * Gets the index of the part in the compound mesh
     */
    get partIndex() {
        return this._partIndex;
    }
    /**
     * Backward-compatible alias for the owning compound mesh.
     * @deprecated Use `compoundSplatMesh` instead.
     */
    get proxiedMesh() {
        return this.compoundSplatMesh;
    }
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
    constructor(name, scene, compoundSplatMesh, partIndex, boundingInfo, vertexCount, splatsDataOffset, shDataOffset = splatsDataOffset) {
        super(name, scene);
        this._disabledVisibility = null;
        this._partIndex = partIndex;
        this._vertexCount = vertexCount;
        this._splatsDataOffset = splatsDataOffset;
        this._shDataOffset = shDataOffset;
        this._minimum = boundingInfo.minimum.clone();
        this._maximum = boundingInfo.maximum.clone();
        this.compoundSplatMesh = compoundSplatMesh;
        this._applyBoundingInfo();
        this.compoundSplatMesh.setWorldMatrixForPart(this.partIndex, this.getWorldMatrix());
        // Update the compound mesh's part matrix when this proxy's world matrix changes.
        this.onAfterWorldMatrixUpdateObservable.add(() => {
            this.compoundSplatMesh.setWorldMatrixForPart(this.partIndex, this.getWorldMatrix());
        });
        this.onEffectiveEnabledStateChangedObservable.add((isEnabled) => {
            if (isEnabled) {
                this.compoundSplatMesh.setPartVisibility(this.partIndex, this._disabledVisibility ?? this.compoundSplatMesh.getPartVisibility(this.partIndex));
                this._disabledVisibility = null;
            }
            else {
                this._disabledVisibility = this.compoundSplatMesh.getPartVisibility(this.partIndex);
                this.compoundSplatMesh.setPartVisibility(this.partIndex, 0);
            }
        });
    }
    /**
     * Updates the bounding info of this proxy mesh from its stored part metadata.
     */
    updateBoundingInfoFromPartData() {
        this._applyBoundingInfo();
    }
    /**
     * Backward-compatible alias retained while callers move away from source-mesh based semantics.
     */
    updateBoundingInfoFromProxiedMesh() {
        this.updateBoundingInfoFromPartData();
    }
    _applyBoundingInfo() {
        this.setBoundingInfo(new BoundingInfo(this._minimum.clone(), this._maximum.clone()));
    }
    /**
     * Returns the class name
     * @returns "GaussianSplattingPartProxyMesh"
     */
    getClassName() {
        return "GaussianSplattingPartProxyMesh";
    }
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
    getHierarchyBoundingVectors(includeDescendants = true, predicate = null) {
        // Base recomputes this proxy's world matrix but skips its (geometry-less) own bounds.
        const result = super.getHierarchyBoundingVectors(includeDescendants, predicate);
        // Refresh the world-space corners against the just-computed world matrix, then extend the result:
        // CheckExtends turns the base's ±MAX_VALUE sentinel seed into this part's real box.
        const info = this.getBoundingInfo();
        info.update(this.getWorldMatrix());
        Vector3.CheckExtends(info.boundingBox.minimumWorld, result.min, result.max);
        Vector3.CheckExtends(info.boundingBox.maximumWorld, result.min, result.max);
        return result;
    }
    /**
     * Updates the part index for this proxy mesh.
     * This should only be called internally when parts are removed from the compound mesh.
     * @param newPartIndex the new part index
     * @internal
     */
    updatePartIndex(newPartIndex) {
        this._partIndex = newPartIndex;
    }
    /**
     * Updates the per-part metadata for this proxy mesh.
     * This is used internally when compound parts are rebuilt and re-indexed.
     * @param vertexCount the number of splats owned by the part
     * @param splatsDataOffset the new splat offset in the compound
     * @param shDataOffset the new SH texel offset in the compound
     * @internal
     */
    updatePartMetadata(vertexCount, splatsDataOffset, shDataOffset = splatsDataOffset) {
        this._vertexCount = vertexCount;
        this._splatsDataOffset = splatsDataOffset;
        this._shDataOffset = shDataOffset;
    }
    /**
     * Gets whether the part should be visible when this proxy is enabled
     */
    get isVisible() {
        return this.visibility > 0;
    }
    /**
     * Sets whether the part should be visible when this proxy is enabled
     */
    set isVisible(value) {
        this.visibility = value ? 1.0 : 0.0;
    }
    /**
     * Gets the visibility applied to the part while this proxy is enabled (0.0 to 1.0)
     */
    get visibility() {
        return this._disabledVisibility ?? this.compoundSplatMesh.getPartVisibility(this.partIndex);
    }
    /**
     * Sets the visibility to apply to the part while this proxy is enabled (0.0 to 1.0)
     */
    set visibility(value) {
        const visibility = Math.max(0.0, Math.min(1.0, value));
        if (this.isEnabled()) {
            this.compoundSplatMesh.setPartVisibility(this.partIndex, visibility);
        }
        else {
            this._disabledVisibility = visibility;
        }
    }
    /**
     * Checks if a ray intersects with this proxy mesh using only bounding info
     * @param ray defines the ray to test
     * @returns the picking info with this mesh set as pickedMesh if hit
     */
    intersects(ray) {
        const pickingInfo = new PickingInfo();
        const boundingInfo = this.getBoundingInfo();
        if (!boundingInfo) {
            return pickingInfo;
        }
        // Always check against bounding info for proxy meshes
        if (!ray.intersectsSphere(boundingInfo.boundingSphere) || !ray.intersectsBox(boundingInfo.boundingBox)) {
            return pickingInfo;
        }
        // If we hit the bounding volume, report this mesh as picked
        pickingInfo.hit = true;
        pickingInfo.pickedMesh = this;
        pickingInfo.distance = Vector3.Distance(ray.origin, boundingInfo.boundingSphere.center);
        pickingInfo.subMeshId = 0;
        return pickingInfo;
    }
    /**
     * Serialize current GaussianSplattingPartProxyMesh
     * @param serializationObject defines the object which will receive the serialization data
     * @returns the serialized object
     */
    serialize(serializationObject = {}) {
        serializationObject = super.serialize(serializationObject);
        // GaussianSplattingPartProxyMesh needs no SubMesh, Geometry, or Material
        serializationObject.subMeshes = [];
        serializationObject.geometryUniqueId = undefined;
        serializationObject.geometryId = undefined;
        serializationObject.materialUniqueId = undefined;
        serializationObject.materialId = undefined;
        serializationObject.instances = [];
        serializationObject.actions = undefined;
        serializationObject.type = this.getClassName();
        serializationObject.compoundSplatMeshId = this.compoundSplatMesh.id;
        // Part metadata is needed to reconnect the proxy to the correct compound segment.
        serializationObject.partIndex = this._partIndex;
        serializationObject.vertexCount = this._vertexCount;
        serializationObject.splatsDataOffset = this._splatsDataOffset;
        serializationObject.shDataOffset = this._shDataOffset;
        const boundingInfo = this.getBoundingInfo();
        serializationObject.boundingInfo = {
            minimum: boundingInfo.minimum.asArray(),
            maximum: boundingInfo.maximum.asArray(),
        };
        return serializationObject;
    }
    /**
     * Parses a serialized GaussianSplattingPartProxyMesh
     * @param parsedMesh the serialized mesh
     * @param scene the scene to create the GaussianSplattingPartProxyMesh in
     * @returns the created GaussianSplattingPartProxyMesh
     */
    static Parse(parsedMesh, scene) {
        const partIndex = parsedMesh.partIndex;
        const compoundSplatMesh = parsedMesh.compoundSplatMesh ?? scene.getLastMeshById(parsedMesh.compoundSplatMeshId);
        if (!compoundSplatMesh) {
            throw new Error(`GaussianSplattingPartProxyMesh: compound mesh not found with ID ${parsedMesh.compoundSplatMeshId}`);
        }
        const minimum = Vector3.FromArray(parsedMesh.boundingInfo.minimum);
        const maximum = Vector3.FromArray(parsedMesh.boundingInfo.maximum);
        const boundingInfo = new BoundingInfo(minimum, maximum);
        const vertexCount = parsedMesh.vertexCount ?? 0;
        const splatsDataOffset = parsedMesh.splatsDataOffset ?? 0;
        const shDataOffset = parsedMesh.shDataOffset ?? splatsDataOffset;
        return new GaussianSplattingPartProxyMesh(parsedMesh.name, scene, compoundSplatMesh, partIndex, boundingInfo, vertexCount, splatsDataOffset, shDataOffset);
    }
}
let _Registered = false;
/**
 * Register side effects for gaussianSplattingPartProxyMesh.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterGaussianSplattingPartProxyMesh() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    Mesh._GaussianSplattingPartProxyMeshParser = GaussianSplattingPartProxyMesh.Parse;
}
//# sourceMappingURL=gaussianSplattingPartProxyMesh.pure.js.map