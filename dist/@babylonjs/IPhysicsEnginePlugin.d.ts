import type { Vector3, Quaternion } from "../../Maths/math.vector";
import type { AbstractMesh } from "../../Meshes/abstractMesh";
import type { PhysicsRaycastResult } from "../physicsRaycastResult";
import type { PhysicsBody } from "./physicsBody";
import type { PhysicsShape } from "./physicsShape";
import type { PhysicsConstraint } from "./physicsConstraint";
import type { BoundingBox } from "../../Culling/boundingBox";
import type { TransformNode } from "../../Meshes/transformNode";
import type { PhysicsMaterial } from "./physicsMaterial";
import type { Mesh } from "../../Meshes/mesh";
/** @internal */
export declare enum ConstraintAxisLimitMode {
    FREE = 0,
    LIMITED = 1,
    LOCKED = 2,
    NONE = 3
}
/** @internal */
export declare enum ConstraintAxis {
    LINEAR_X = 0,
    LINEAR_Y = 1,
    LINEAR_Z = 2,
    ANGULAR_X = 3,
    ANGULAR_Y = 4,
    ANGULAR_Z = 5,
    LINEAR_DISTANCE = 6
}
/** @internal */
export declare enum ConstraintType {
    BALL_AND_SOCKET = 0,
    DISTANCE = 1,
    HINGE = 2,
    SLIDER = 3,
    LOCK = 4
}
/** @internal */
export declare enum ShapeType {
    SPHERE = 0,
    CAPSULE = 1,
    CYLINDER = 2,
    BOX = 3,
    CONVEX_HULL = 4,
    CONTAINER = 5,
    MESH = 6,
    HEIGHTFIELD = 7
}
/** @internal */
export declare enum ConstraintMotorType {
    NONE = 0,
    VELOCITY = 1,
    POSITION = 2
}
/** @internal */
export interface PhysicsShapeParameters {
    center?: Vector3;
    radius?: number;
    pointA?: Vector3;
    pointB?: Vector3;
    rotation?: Quaternion;
    extents?: Vector3;
    mesh?: AbstractMesh;
}
/** @internal */
export interface PhysicsConstraintParameters {
    pivotA?: Vector3;
    pivotB?: Vector3;
    axisA?: Vector3;
    axisB?: Vector3;
}
/**
 *
 */
/** @internal */
export interface MassProperties {
    /**
     *
     */
    centerOfMass: Vector3;
    /**
     *
     */
    mass: number;
    /**
     *
     */
    intertia: Vector3;
    /**
     *
     */
    inertiaOrientation: Quaternion;
}
/** @internal */
export interface IPhysicsEnginePluginV2 {
    /**
     *
     */
    world: any;
    /**
     *
     */
    name: string;
    setGravity(gravity: Vector3): void;
    setTimeStep(timeStep: number): void;
    getTimeStep(): number;
    executeStep(delta: number, bodies: Array<PhysicsBody>): void;
    getPluginVersion(): number;
    initBody(body: PhysicsBody, position: Vector3, orientation: Quaternion): void;
    initBodyInstances(body: PhysicsBody, mesh: Mesh): void;
    setShape(body: PhysicsBody, shape: PhysicsShape): void;
    getShape(body: PhysicsBody): PhysicsShape;
    setFilterGroup(body: PhysicsBody, group: number): void;
    getFilterGroup(body: PhysicsBody): number;
    setEventMask(body: PhysicsBody, eventMask: number): void;
    getEventMask(body: PhysicsBody): number;
    setMassProperties(body: PhysicsBody, massProps: MassProperties): void;
    getMassProperties(body: PhysicsBody): MassProperties;
    setLinearDamping(body: PhysicsBody, damping: number): void;
    getLinearDamping(body: PhysicsBody): number;
    setAngularDamping(body: PhysicsBody, damping: number): void;
    getAngularDamping(body: PhysicsBody): number;
    setLinearVelocity(body: PhysicsBody, linVel: Vector3): void;
    getLinearVelocityToRef(body: PhysicsBody, linVel: Vector3): void;
    applyImpulse(body: PhysicsBody, location: Vector3, impulse: Vector3): void;
    setAngularVelocity(body: PhysicsBody, angVel: Vector3): void;
    getAngularVelocityToRef(body: PhysicsBody, angVel: Vector3): void;
    getBodyGeometry(body: PhysicsBody): {};
    disposeBody(body: PhysicsBody): void;
    initShape(shape: PhysicsShape, type: ShapeType, options: PhysicsShapeParameters): void;
    setFilterLayer(shape: PhysicsShape, layer: number): void;
    getFilterLayer(shape: PhysicsShape): number;
    setMaterial(shape: PhysicsShape, material: PhysicsMaterial): void;
    getMaterial(shape: PhysicsShape): PhysicsMaterial;
    setDensity(shape: PhysicsShape, density: number): void;
    getDensity(shape: PhysicsShape): number;
    addChild(shape: PhysicsShape, newChild: PhysicsShape, childTransform: TransformNode): void;
    removeChild(shape: PhysicsShape, childIndex: number): void;
    getNumChildren(shape: PhysicsShape): number;
    getBoundingBox(shape: PhysicsShape): BoundingBox;
    disposeShape(shape: PhysicsShape): void;
    initMaterial(material: PhysicsMaterial): void;
    setFriction(material: PhysicsMaterial, friction: number): void;
    getFriction(material: PhysicsMaterial): number;
    setRestitution(material: PhysicsMaterial, restitution: number): void;
    getRestitution(material: PhysicsMaterial): number;
    disposeMaterial(material: PhysicsMaterial): void;
    initConstraint(constraint: PhysicsConstraint, type: ConstraintType, options: PhysicsConstraintParameters): void;
    setParentBody(constraint: PhysicsConstraint, body: PhysicsBody): void;
    getParentBody(constraint: PhysicsConstraint): PhysicsBody;
    setChildBody(constraint: PhysicsConstraint, body: PhysicsBody): void;
    getChildBody(constraint: PhysicsConstraint): PhysicsBody;
    setAnchorInParent(constraint: PhysicsConstraint, pivot: Vector3, axisX: Vector3, axisY: Vector3): void;
    setAnchorInChild(constraint: PhysicsConstraint, pivot: Vector3, axisX: Vector3, axisY: Vector3): void;
    setEnabled(constraint: PhysicsConstraint, isEnabled: boolean): void;
    getEnabled(constraint: PhysicsConstraint): boolean;
    setCollisionsEnabled(constraint: PhysicsConstraint, isEnabled: boolean): void;
    getCollisionsEnabled(constraint: PhysicsConstraint): boolean;
    setAxisFriction(constraint: PhysicsConstraint, axis: ConstraintAxis, friction: number): void;
    getAxisFriction(constraint: PhysicsConstraint, axis: ConstraintAxis): number;
    setAxisMode(constraint: PhysicsConstraint, axis: ConstraintAxis, limitMode: ConstraintAxisLimitMode): void;
    getAxisMode(constraint: PhysicsConstraint, axis: ConstraintAxis): ConstraintAxisLimitMode;
    setAxisMinLimit(constraint: PhysicsConstraint, axis: ConstraintAxis, minLimit: number): void;
    getAxisMinLimit(constraint: PhysicsConstraint, axis: ConstraintAxis): number;
    setAxisMaxLimit(constraint: PhysicsConstraint, axis: ConstraintAxis, limit: number): void;
    getAxisMaxLimit(constraint: PhysicsConstraint, axis: ConstraintAxis): number;
    setAxisMotorType(constraint: PhysicsConstraint, axis: ConstraintAxis, motorType: ConstraintMotorType): void;
    getAxisMotorType(constraint: PhysicsConstraint, axis: ConstraintAxis): ConstraintMotorType;
    setAxisMotorTarget(constraint: PhysicsConstraint, axis: ConstraintAxis, target: number): void;
    getAxisMotorTarget(constraint: PhysicsConstraint, axis: ConstraintAxis): number;
    setAxisMotorMaxForce(constraint: PhysicsConstraint, axis: ConstraintAxis, maxForce: number): void;
    getAxisMotorMaxForce(constraint: PhysicsConstraint, axis: ConstraintAxis): number;
    disposeConstraint(constraint: PhysicsConstraint): void;
    raycast(from: Vector3, to: Vector3, result: PhysicsRaycastResult): void;
    dispose(): void;
}
