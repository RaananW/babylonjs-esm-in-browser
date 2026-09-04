import { type Collider } from "./collider.js";
import { Vector3 } from "../Maths/math.vector.pure.js";
import { type Nullable } from "../types.js";
import { type Observer } from "../Misc/observable.js";
import { type AbstractMesh } from "../Meshes/abstractMesh.js";
/**
 * @internal
 */
export declare class _MeshCollisionData {
    _checkCollisions: boolean;
    _collisionMask: number;
    _collisionGroup: number;
    _surroundingMeshes: Nullable<AbstractMesh[]>;
    _collider: Nullable<Collider>;
    _oldPositionForCollisions: Vector3;
    _diffPositionForCollisions: Vector3;
    _onCollideObserver: Nullable<Observer<AbstractMesh>>;
    _onCollisionPositionChangeObserver: Nullable<Observer<Vector3>>;
    _collisionResponse: boolean;
}
