import type { MassProperties } from "./IPhysicsEnginePlugin";
import type { PhysicsShape } from "./physicsShape";
import type { Vector3 } from "../../Maths/math.vector";
import type { Scene } from "../../scene";
import type { TransformNode } from "../../Meshes";
/**
 *
 */
/** @internal */
export declare class PhysicsBody {
    /** @internal */
    _pluginData: any;
    /**
     *
     */
    _pluginDataInstances: Array<any>;
    private _physicsPlugin;
    /**
     *
     */
    node: TransformNode;
    /**
     *
     * @param scene
     * @returns
     */
    constructor(node: TransformNode, scene: Scene);
    /**
     *
     * @param shape
     */
    setShape(shape: PhysicsShape): void;
    /**
     *
     * @returns
     */
    getShape(): PhysicsShape | undefined;
    /**
     *
     * @param group
     */
    setFilterGroup(group: number): void;
    /**
     *
     * @returns
     */
    getFilterGroup(): number;
    /**
     *
     * @param eventMask
     */
    setEventMask(eventMask: number): void;
    /**
     *
     * @returns
     */
    getEventMask(): number;
    /**
     *
     * @param massProps
     */
    setMassProperties(massProps: MassProperties): void;
    /**
     *
     * @returns
     */
    getMassProperties(): MassProperties | undefined;
    /**
     *
     * @param damping
     */
    setLinearDamping(damping: number): void;
    /**
     *
     * @returns
     */
    getLinearDamping(): number;
    /**
     *
     * @param damping
     */
    setAngularDamping(damping: number): void;
    /**
     *
     * @returns
     */
    getAngularDamping(): number;
    /**
     *
     * @param linVel
     */
    setLinearVelocity(linVel: Vector3): void;
    /**
     *
     * @returns
     */
    getLinearVelocityToRef(linVel: Vector3): void;
    /**
     *
     * @param angVel
     */
    setAngularVelocity(angVel: Vector3): void;
    /**
     *
     * @returns
     */
    getAngularVelocityToRef(angVel: Vector3): void;
    /**
     *
     * @param location
     * @param impulse
     */
    applyImpulse(location: Vector3, impulse: Vector3): void;
    getGeometry(): {};
    /**
     *
     */
    dispose(): void;
}
