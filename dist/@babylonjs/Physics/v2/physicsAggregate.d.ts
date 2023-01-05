import type { PhysicsBody } from "./physicsBody";
import { PhysicsMaterial } from "./physicsMaterial";
import type { PhysicsShape } from "./physicsShape";
import type { Scene } from "../../scene";
import type { TransformNode } from "../../Meshes/transformNode";
/**
 * The interface for the physics aggregate parameters
 */
/** @internal */
export interface PhysicsAggregateParameters {
    /** @internal */
    /**
     * The mass of the physics imposter
     */
    mass: number;
    /**
     * The friction of the physics imposter
     */
    friction?: number;
    /**
     * The coefficient of restitution of the physics imposter
     */
    restitution?: number;
    /**
     * The native options of the physics imposter
     */
    nativeOptions?: any;
    /**
     * Specifies if the parent should be ignored
     */
    ignoreParent?: boolean;
    /**
     * Specifies if bi-directional transformations should be disabled
     */
    disableBidirectionalTransformation?: boolean;
    /**
     * The pressure inside the physics imposter, soft object only
     */
    pressure?: number;
    /**
     * The stiffness the physics imposter, soft object only
     */
    stiffness?: number;
    /**
     * The number of iterations used in maintaining consistent vertex velocities, soft object only
     */
    velocityIterations?: number;
    /**
     * The number of iterations used in maintaining consistent vertex positions, soft object only
     */
    positionIterations?: number;
    /**
     * The number used to fix points on a cloth (0, 1, 2, 4, 8) or rope (0, 1, 2) only
     * 0 None, 1, back left or top, 2, back right or bottom, 4, front left, 8, front right
     * Add to fix multiple points
     */
    fixedPoints?: number;
    /**
     * The collision margin around a soft object
     */
    margin?: number;
    /**
     * The collision margin around a soft object
     */
    damping?: number;
    /**
     * The path for a rope based on an extrusion
     */
    path?: any;
    /**
     * The shape of an extrusion used for a rope based on an extrusion
     */
    shape?: any;
}
/**
 *
 */
export declare class PhysicsAggregate {
    /**
     * The physics-enabled object used as the physics imposter
     */
    transformNode: TransformNode;
    /**
     * The type of the physics imposter
     */
    type: number;
    private _options;
    private _scene?;
    /**
     *
     */
    body: PhysicsBody;
    /**
     *
     */
    shape: PhysicsShape;
    /**
     *
     */
    material: PhysicsMaterial;
    constructor(
    /**
     * The physics-enabled object used as the physics imposter
     */
    transformNode: TransformNode, 
    /**
     * The type of the physics imposter
     */
    type: number, _options?: PhysicsAggregateParameters, _scene?: Scene | undefined);
    /**
     *
     */
    dispose(): void;
}
