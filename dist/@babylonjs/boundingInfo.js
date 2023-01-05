import { ArrayTools } from "../Misc/arrayTools.js";
import { Vector3 } from "../Maths/math.vector.js";

import { BoundingBox } from "./boundingBox.js";
import { BoundingSphere } from "./boundingSphere.js";
const _result0 = { min: 0, max: 0 };
const _result1 = { min: 0, max: 0 };
const computeBoxExtents = (axis, box, result) => {
    const p = Vector3.Dot(box.centerWorld, axis);
    const r0 = Math.abs(Vector3.Dot(box.directions[0], axis)) * box.extendSize.x;
    const r1 = Math.abs(Vector3.Dot(box.directions[1], axis)) * box.extendSize.y;
    const r2 = Math.abs(Vector3.Dot(box.directions[2], axis)) * box.extendSize.z;
    const r = r0 + r1 + r2;
    result.min = p - r;
    result.max = p + r;
};
const axisOverlap = (axis, box0, box1) => {
    computeBoxExtents(axis, box0, _result0);
    computeBoxExtents(axis, box1, _result1);
    return !(_result0.min > _result1.max || _result1.min > _result0.max);
};
/**
 * Info for a bounding data of a mesh
 */
export class BoundingInfo {
    /**
     * Constructs bounding info
     * @param minimum min vector of the bounding box/sphere
     * @param maximum max vector of the bounding box/sphere
     * @param worldMatrix defines the new world matrix
     */
    constructor(minimum, maximum, worldMatrix) {
        this._isLocked = false;
        this.boundingBox = new BoundingBox(minimum, maximum, worldMatrix);
        this.boundingSphere = new BoundingSphere(minimum, maximum, worldMatrix);
    }
    /**
     * Recreates the entire bounding info from scratch as if we call the constructor in place
     * @param min defines the new minimum vector (in local space)
     * @param max defines the new maximum vector (in local space)
     * @param worldMatrix defines the new world matrix
     */
    reConstruct(min, max, worldMatrix) {
        this.boundingBox.reConstruct(min, max, worldMatrix);
        this.boundingSphere.reConstruct(min, max, worldMatrix);
    }
    /**
     * min vector of the bounding box/sphere
     */
    get minimum() {
        return this.boundingBox.minimum;
    }
    /**
     * max vector of the bounding box/sphere
     */
    get maximum() {
        return this.boundingBox.maximum;
    }
    /**
     * If the info is locked and won't be updated to avoid perf overhead
     */
    get isLocked() {
        return this._isLocked;
    }
    set isLocked(value) {
        this._isLocked = value;
    }
    // Methods
    /**
     * Updates the bounding sphere and box
     * @param world world matrix to be used to update
     */
    update(world) {
        if (this._isLocked) {
            return;
        }
        this.boundingBox._update(world);
        this.boundingSphere._update(world);
    }
    /**
     * Recreate the bounding info to be centered around a specific point given a specific extend.
     * @param center New center of the bounding info
     * @param extend New extend of the bounding info
     * @returns the current bounding info
     */
    centerOn(center, extend) {
        const minimum = BoundingInfo._TmpVector3[0].copyFrom(center).subtractInPlace(extend);
        const maximum = BoundingInfo._TmpVector3[1].copyFrom(center).addInPlace(extend);
        this.boundingBox.reConstruct(minimum, maximum, this.boundingBox.getWorldMatrix());
        this.boundingSphere.reConstruct(minimum, maximum, this.boundingBox.getWorldMatrix());
        return this;
    }
    /**
     * Grows the bounding info to include the given point.
     * @param point The point that will be included in the current bounding info
     * @returns the current bounding info
     */
    encapsulate(point) {
        const minimum = Vector3.Minimize(this.minimum, point);
        const maximum = Vector3.Maximize(this.maximum, point);
        this.reConstruct(minimum, maximum, this.boundingBox.getWorldMatrix());
        return this;
    }
    /**
     * Grows the bounding info to encapsulate the given bounding info.
     * @param toEncapsulate The bounding info that will be encapsulated in the current bounding info
     * @returns the current bounding info
     */
    encapsulateBoundingInfo(toEncapsulate) {
        this.encapsulate(toEncapsulate.boundingBox.centerWorld.subtract(toEncapsulate.boundingBox.extendSizeWorld));
        this.encapsulate(toEncapsulate.boundingBox.centerWorld.add(toEncapsulate.boundingBox.extendSizeWorld));
        return this;
    }
    /**
     * Scale the current bounding info by applying a scale factor
     * @param factor defines the scale factor to apply
     * @returns the current bounding info
     */
    scale(factor) {
        this.boundingBox.scale(factor);
        this.boundingSphere.scale(factor);
        return this;
    }
    /**
     * Returns `true` if the bounding info is within the frustum defined by the passed array of planes.
     * @param frustumPlanes defines the frustum to test
     * @param strategy defines the strategy to use for the culling (default is BABYLON.AbstractMesh.CULLINGSTRATEGY_STANDARD)
     * The different strategies available are:
     * * BABYLON.AbstractMesh.CULLINGSTRATEGY_STANDARD most accurate but slower @see https://doc.babylonjs.com/typedoc/classes/BABYLON.AbstractMesh#CULLINGSTRATEGY_STANDARD
     * * BABYLON.AbstractMesh.CULLINGSTRATEGY_BOUNDINGSPHERE_ONLY faster but less accurate @see https://doc.babylonjs.com/typedoc/classes/BABYLON.AbstractMesh#CULLINGSTRATEGY_BOUNDINGSPHERE_ONLY
     * * BABYLON.AbstractMesh.CULLINGSTRATEGY_OPTIMISTIC_INCLUSION can be faster if always visible @see https://doc.babylonjs.com/typedoc/classes/BABYLON.AbstractMesh#CULLINGSTRATEGY_OPTIMISTIC_INCLUSION
     * * BABYLON.AbstractMesh.CULLINGSTRATEGY_OPTIMISTIC_INCLUSION_THEN_BSPHERE_ONLY can be faster if always visible @see https://doc.babylonjs.com/typedoc/classes/BABYLON.AbstractMesh#CULLINGSTRATEGY_OPTIMISTIC_INCLUSION_THEN_BSPHERE_ONLY
     * @returns true if the bounding info is in the frustum planes
     */
    isInFrustum(frustumPlanes, strategy = 0) {
        const inclusionTest = strategy === 2 || strategy === 3;
        if (inclusionTest) {
            if (this.boundingSphere.isCenterInFrustum(frustumPlanes)) {
                return true;
            }
        }
        if (!this.boundingSphere.isInFrustum(frustumPlanes)) {
            return false;
        }
        const bSphereOnlyTest = strategy === 1 || strategy === 3;
        if (bSphereOnlyTest) {
            return true;
        }
        return this.boundingBox.isInFrustum(frustumPlanes);
    }
    /**
     * Gets the world distance between the min and max points of the bounding box
     */
    get diagonalLength() {
        const boundingBox = this.boundingBox;
        const diag = boundingBox.maximumWorld.subtractToRef(boundingBox.minimumWorld, BoundingInfo._TmpVector3[0]);
        return diag.length();
    }
    /**
     * Checks if a cullable object (mesh...) is in the camera frustum
     * Unlike isInFrustum this checks the full bounding box
     * @param frustumPlanes Camera near/planes
     * @returns true if the object is in frustum otherwise false
     */
    isCompletelyInFrustum(frustumPlanes) {
        return this.boundingBox.isCompletelyInFrustum(frustumPlanes);
    }
    /**
     * @internal
     */
    _checkCollision(collider) {
        return collider._canDoCollision(this.boundingSphere.centerWorld, this.boundingSphere.radiusWorld, this.boundingBox.minimumWorld, this.boundingBox.maximumWorld);
    }
    /**
     * Checks if a point is inside the bounding box and bounding sphere or the mesh
     * @see https://doc.babylonjs.com/features/featuresDeepDive/mesh/interactions/mesh_intersect
     * @param point the point to check intersection with
     * @returns if the point intersects
     */
    intersectsPoint(point) {
        if (!this.boundingSphere.centerWorld) {
            return false;
        }
        if (!this.boundingSphere.intersectsPoint(point)) {
            return false;
        }
        if (!this.boundingBox.intersectsPoint(point)) {
            return false;
        }
        return true;
    }
    /**
     * Checks if another bounding info intersects the bounding box and bounding sphere or the mesh
     * @see https://doc.babylonjs.com/features/featuresDeepDive/mesh/interactions/mesh_intersect
     * @param boundingInfo the bounding info to check intersection with
     * @param precise if the intersection should be done using OBB
     * @returns if the bounding info intersects
     */
    intersects(boundingInfo, precise) {
        if (!BoundingSphere.Intersects(this.boundingSphere, boundingInfo.boundingSphere)) {
            return false;
        }
        if (!BoundingBox.Intersects(this.boundingBox, boundingInfo.boundingBox)) {
            return false;
        }
        if (!precise) {
            return true;
        }
        const box0 = this.boundingBox;
        const box1 = boundingInfo.boundingBox;
        if (!axisOverlap(box0.directions[0], box0, box1)) {
            return false;
        }
        if (!axisOverlap(box0.directions[1], box0, box1)) {
            return false;
        }
        if (!axisOverlap(box0.directions[2], box0, box1)) {
            return false;
        }
        if (!axisOverlap(box1.directions[0], box0, box1)) {
            return false;
        }
        if (!axisOverlap(box1.directions[1], box0, box1)) {
            return false;
        }
        if (!axisOverlap(box1.directions[2], box0, box1)) {
            return false;
        }
        if (!axisOverlap(Vector3.Cross(box0.directions[0], box1.directions[0]), box0, box1)) {
            return false;
        }
        if (!axisOverlap(Vector3.Cross(box0.directions[0], box1.directions[1]), box0, box1)) {
            return false;
        }
        if (!axisOverlap(Vector3.Cross(box0.directions[0], box1.directions[2]), box0, box1)) {
            return false;
        }
        if (!axisOverlap(Vector3.Cross(box0.directions[1], box1.directions[0]), box0, box1)) {
            return false;
        }
        if (!axisOverlap(Vector3.Cross(box0.directions[1], box1.directions[1]), box0, box1)) {
            return false;
        }
        if (!axisOverlap(Vector3.Cross(box0.directions[1], box1.directions[2]), box0, box1)) {
            return false;
        }
        if (!axisOverlap(Vector3.Cross(box0.directions[2], box1.directions[0]), box0, box1)) {
            return false;
        }
        if (!axisOverlap(Vector3.Cross(box0.directions[2], box1.directions[1]), box0, box1)) {
            return false;
        }
        if (!axisOverlap(Vector3.Cross(box0.directions[2], box1.directions[2]), box0, box1)) {
            return false;
        }
        return true;
    }
}
BoundingInfo._TmpVector3 = ArrayTools.BuildArray(2, Vector3.Zero);
//# sourceMappingURL=boundingInfo.js.map