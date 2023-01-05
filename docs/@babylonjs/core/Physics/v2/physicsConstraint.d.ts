import type { Scene } from "../../scene";
import type { Vector3 } from "../../Maths/math.vector";
import type { IPhysicsEnginePluginV2, ConstraintAxis, PhysicsConstraintParameters, ConstraintAxisLimitMode, ConstraintMotorType } from "./IPhysicsEnginePlugin";
import { ConstraintType } from "./IPhysicsEnginePlugin";
import type { PhysicsBody } from "./physicsBody";
/**
 * This is a holder class for the physics constraint created by the physics plugin
 * It holds a set of functions to control the underlying constraint
 * @see https://doc.babylonjs.com/features/featuresDeepDive/physics/usingPhysicsEngine
 */
/** @internal */
export declare class PhysicsConstraint {
    /** @internal */
    /**
     *
     */
    _pluginData: any;
    protected _physicsPlugin: IPhysicsEnginePluginV2;
    /**
     *
     */
    constructor(type: ConstraintType, options: PhysicsConstraintParameters, scene: Scene);
    /**
     *
     * @param body
     */
    setParentBody(body: PhysicsBody): void;
    /**
     *
     * @returns
     */
    getParentBody(): PhysicsBody | undefined;
    /**
     *
     * @param body
     */
    setChildBody(body: PhysicsBody): void;
    /**
     *
     * @returns
     */
    getChildBody(): PhysicsBody | undefined;
    /**
     *
     * @param pivot +
     * @param axisX
     * @param axisY
     */
    setAnchorInParent(pivot: Vector3, axisX: Vector3, axisY: Vector3): void;
    /**
     *
     * @param pivot
     * @param axisX
     * @param axisY
     */
    setAnchorInChild(pivot: Vector3, axisX: Vector3, axisY: Vector3): void;
    /**
     *
     * @param isEnabled
     */
    setEnabled(isEnabled: boolean): void;
    /**
     *
     * @returns
     */
    getEnabled(): boolean;
    /**
     *
     * @param isEnabled
     */
    setCollisionsEnabled(isEnabled: boolean): void;
    /**
     *
     * @returns
     */
    getCollisionsEnabled(): boolean;
    /**
     *
     * @param axis
     * @param friction
     */
    setAxisFriction(axis: ConstraintAxis, friction: number): void;
    /**
     *
     * @param axis
     * @returns
     */
    getAxisFriction(axis: ConstraintAxis): number;
    /**
     *
     * @param axis
     * @param limitMode
     */
    setAxisMode(axis: ConstraintAxis, limitMode: ConstraintAxisLimitMode): void;
    /**
     *
     * @param axis
     */
    getAxisMode(axis: ConstraintAxis): ConstraintAxisLimitMode;
    /**
     *
     */
    setAxisMinLimit(axis: ConstraintAxis, minLimit: number): void;
    /**
     *
     */
    getAxisMinLimit(axis: ConstraintAxis): number;
    /**
     *
     */
    setAxisMaxLimit(axis: ConstraintAxis, limit: number): void;
    /**
     *
     */
    getAxisMaxLimit(axis: ConstraintAxis): number;
    /**
     *
     */
    setAxisMotorType(axis: ConstraintAxis, motorType: ConstraintMotorType): void;
    /**
     *
     */
    getAxisMotorType(axis: ConstraintAxis): ConstraintMotorType;
    /**
     *
     */
    setAxisMotorTarget(axis: ConstraintAxis, target: number): void;
    /**
     *
     */
    getAxisMotorTarget(axis: ConstraintAxis): number;
    /**
     *
     */
    setAxisMotorMaxForce(axis: ConstraintAxis, maxForce: number): void;
    /**
     *
     */
    getAxisMotorMaxForce(axis: ConstraintAxis): number;
    /**
     *
     */
    dispose(): void;
}
/**
 *
 */
/** @internal */
export declare class PhysicsConstraintBallAndSocket extends PhysicsConstraint {
    /** @internal */
    constructor(pivotA: Vector3, pivotB: Vector3, axisA: Vector3, axisB: Vector3, scene: Scene);
}
/**
 *
 */
/** @internal */
export declare class PhysicsConstraintDistance extends PhysicsConstraint {
    /** @internal */
    constructor(pivotA: Vector3, pivotB: Vector3, axisA: Vector3, axisB: Vector3, scene: Scene);
}
/**
 *
 */
/** @internal */
export declare class PhysicsConstraintHinge extends PhysicsConstraint {
    /** @internal */
    constructor(pivotA: Vector3, pivotB: Vector3, axisA: Vector3, axisB: Vector3, scene: Scene);
}
/**
 *
 */
/** @internal */
export declare class PhysicsConstraintSlider extends PhysicsConstraint {
    /** @internal */
    constructor(pivotA: Vector3, pivotB: Vector3, axisA: Vector3, axisB: Vector3, scene: Scene);
}
/**
 *
 */
/** @internal */
export declare class PhysicsConstraintLock extends PhysicsConstraint {
    /** @internal */
    constructor(pivotA: Vector3, pivotB: Vector3, axisA: Vector3, axisB: Vector3, scene: Scene);
}
