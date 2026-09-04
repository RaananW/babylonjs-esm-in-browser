/** This file must only contain pure code and pure imports */
import { Scene } from "../scene.pure.js";
import { Vector3 } from "../Maths/math.vector.pure.js";
import { Collider } from "./collider.js";
import { AbstractEngine } from "../Engines/abstractEngine.pure.js";
/** @internal */
export class DefaultCollisionCoordinator {
    constructor() {
        this._scaledPosition = Vector3.Zero();
        this._scaledVelocity = Vector3.Zero();
        this._finalPosition = Vector3.Zero();
    }
    getNewPosition(position, displacement, collider, maximumRetry, excludedMesh, onNewPosition, collisionIndex, slideOnCollide = true) {
        position.divideToRef(collider._radius, this._scaledPosition);
        displacement.divideToRef(collider._radius, this._scaledVelocity);
        collider.collidedMesh = null;
        collider._retry = 0;
        collider._initialVelocity = this._scaledVelocity;
        collider._initialPosition = this._scaledPosition;
        this._collideWithWorld(this._scaledPosition, this._scaledVelocity, collider, maximumRetry, this._finalPosition, slideOnCollide, excludedMesh);
        this._finalPosition.multiplyInPlace(collider._radius);
        //run the callback
        onNewPosition(collisionIndex, this._finalPosition, collider.collidedMesh);
        return this._finalPosition;
    }
    createCollider() {
        return new Collider();
    }
    init(scene) {
        this._scene = scene;
    }
    _collideWithWorld(position, velocity, collider, maximumRetry, finalPosition, slideOnCollide, excludedMesh = null) {
        const closeDistance = AbstractEngine.CollisionsEpsilon * 10.0;
        if (collider._retry >= maximumRetry) {
            finalPosition.copyFrom(position);
            return;
        }
        // Check if this is a mesh else camera or -1
        const collisionMask = excludedMesh ? excludedMesh.collisionMask : collider.collisionMask;
        collider._initialize(position, velocity, closeDistance);
        // Check if collision detection should happen against specified list of meshes or,
        // if not specified, against all meshes in the scene
        const meshes = (excludedMesh && excludedMesh.surroundingMeshes) || this._scene.meshes;
        for (let index = 0; index < meshes.length; index++) {
            const mesh = meshes[index];
            if (mesh.isEnabled() && mesh.checkCollisions && mesh.subMeshes && mesh !== excludedMesh && (collisionMask & mesh.collisionGroup) !== 0) {
                mesh._checkCollision(collider);
            }
        }
        if (!collider.collisionFound) {
            position.addToRef(velocity, finalPosition);
            return;
        }
        if (velocity.x !== 0 || velocity.y !== 0 || velocity.z !== 0) {
            collider._getResponse(position, velocity, slideOnCollide);
            // Halt all movement at the first collision, if not slideOnCollide
            if (!slideOnCollide) {
                velocity.setAll(0);
            }
        }
        if (velocity.length() <= closeDistance) {
            finalPosition.copyFrom(position);
            return;
        }
        collider._retry++;
        this._collideWithWorld(position, velocity, collider, maximumRetry, finalPosition, slideOnCollide, excludedMesh);
    }
}
let _Registered = false;
/**
 * Register side effects for collisionCoordinator.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterCollisionCoordinator() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    Scene.CollisionCoordinatorFactory = () => {
        return new DefaultCollisionCoordinator();
    };
}
//# sourceMappingURL=collisionCoordinator.pure.js.map