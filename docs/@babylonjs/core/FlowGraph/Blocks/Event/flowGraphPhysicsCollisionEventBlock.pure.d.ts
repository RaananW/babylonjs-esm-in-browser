/** This file must only contain pure code and pure imports */
import { FlowGraphEventBlock } from "../../flowGraphEventBlock.js";
import { type FlowGraphContext } from "../../flowGraphContext.js";
import { type IFlowGraphBlockConfiguration } from "../../flowGraphBlock.js";
import { type FlowGraphDataConnection } from "../../flowGraphDataConnection.pure.js";
import { type Vector3 } from "../../../Maths/math.vector.pure.js";
import { type PhysicsBody } from "../../../Physics/v2/physicsBody.js";
/**
 * Configuration for the physics collision event block.
 */
export interface IFlowGraphPhysicsCollisionEventBlockConfiguration extends IFlowGraphBlockConfiguration {
}
/**
 * @experimental
 * An event block that fires when a physics collision occurs on the specified body.
 * Subscribes to the body's collision observable and exposes collision details
 * (the other body, contact point, normal, impulse, and distance) as data outputs.
 */
export declare class FlowGraphPhysicsCollisionEventBlock extends FlowGraphEventBlock {
    /**
     * the configuration of the block
     */
    config?: IFlowGraphPhysicsCollisionEventBlockConfiguration | undefined;
    /**
     * Input connection: The physics body to monitor for collisions.
     */
    readonly body: FlowGraphDataConnection<PhysicsBody>;
    /**
     * Output connection: The other physics body involved in the collision.
     */
    readonly otherBody: FlowGraphDataConnection<PhysicsBody>;
    /**
     * Output connection: The world-space contact point of the collision.
     */
    readonly point: FlowGraphDataConnection<Vector3>;
    /**
     * Output connection: The world-space collision normal direction.
     */
    readonly normal: FlowGraphDataConnection<Vector3>;
    /**
     * Output connection: The impulse magnitude computed by the physics solver.
     */
    readonly impulse: FlowGraphDataConnection<number>;
    /**
     * Output connection: The penetration distance of the collision.
     */
    readonly distance: FlowGraphDataConnection<number>;
    /**
     * Constructs a new FlowGraphPhysicsCollisionEventBlock.
     * @param config - optional configuration for the block
     */
    constructor(
    /**
     * the configuration of the block
     */
    config?: IFlowGraphPhysicsCollisionEventBlockConfiguration | undefined);
    /**
     * @internal
     */
    _preparePendingTasks(context: FlowGraphContext): void;
    private _onCollision;
    /**
     * @internal
     */
    _executeEvent(_context: FlowGraphContext, _payload: any): boolean;
    /**
     * @internal
     */
    _cancelPendingTasks(context: FlowGraphContext): void;
    /**
     * @returns class name of the block.
     */
    getClassName(): string;
}
/**
 * Register side effects for flowGraphPhysicsCollisionEventBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterFlowGraphPhysicsCollisionEventBlock(): void;
