import type { Scene } from "../../scene";
import type { IPhysicsEnginePluginV2 } from "./IPhysicsEnginePlugin";
/**
 *
 */
/** @internal */
export declare class PhysicsMaterial {
    /** @internal */
    /**
     *
     */
    _pluginData: any;
    protected _physicsPlugin: IPhysicsEnginePluginV2;
    /**
     *
     * @param friction
     * @param restitution
     * @param scene
     */
    constructor(friction: number, restitution: number, scene: Scene);
    /**
     *
     * @param friction
     */
    setFriction(friction: number): void;
    /**
     *
     * @returns
     */
    getFriction(): number;
    /**
     *
     * @param restitution
     */
    setRestitution(restitution: number): void;
    /**
     *
     * @returns
     */
    getRestitution(): number;
    /**
     *
     */
    dispose(): void;
}
