/** This file must only contain pure code and pure imports */
import { type Nullable } from "../types.js";
import { Scene } from "../scene.pure.js";
import { Vector3 } from "../Maths/math.vector.pure.js";
import { Collider } from "./collider.js";
import { type AbstractMesh } from "../Meshes/abstractMesh.pure.js";
/** @internal */
export interface ICollisionCoordinator {
    createCollider(): Collider;
    getNewPosition(position: Vector3, displacement: Vector3, collider: Collider, maximumRetry: number, excludedMesh: Nullable<AbstractMesh>, onNewPosition: (collisionIndex: number, newPosition: Vector3, collidedMesh: Nullable<AbstractMesh>) => void, collisionIndex: number, slideOnCollide?: boolean): Vector3;
    init(scene: Scene): void;
}
/** @internal */
export declare class DefaultCollisionCoordinator implements ICollisionCoordinator {
    private _scene;
    private _scaledPosition;
    private _scaledVelocity;
    private _finalPosition;
    getNewPosition(position: Vector3, displacement: Vector3, collider: Collider, maximumRetry: number, excludedMesh: AbstractMesh, onNewPosition: (collisionIndex: number, newPosition: Vector3, collidedMesh: Nullable<AbstractMesh>) => void, collisionIndex: number, slideOnCollide?: boolean): Vector3;
    createCollider(): Collider;
    init(scene: Scene): void;
    private _collideWithWorld;
}
/**
 * Register side effects for collisionCoordinator.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterCollisionCoordinator(): void;
