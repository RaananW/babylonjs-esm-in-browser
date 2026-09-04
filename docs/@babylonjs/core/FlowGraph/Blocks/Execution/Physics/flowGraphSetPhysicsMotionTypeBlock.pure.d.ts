/** This file must only contain pure code and pure imports */
import { type FlowGraphContext } from "../../../flowGraphContext.js";
import { type FlowGraphDataConnection } from "../../../flowGraphDataConnection.pure.js";
import { FlowGraphExecutionBlockWithOutSignal } from "../../../flowGraphExecutionBlockWithOutSignal.js";
import { type FlowGraphSignalConnection } from "../../../flowGraphSignalConnection.pure.js";
import { type IFlowGraphBlockConfiguration } from "../../../flowGraphBlock.js";
import { type PhysicsBody } from "../../../../Physics/v2/physicsBody.js";
/**
 * @experimental
 * A block that sets the motion type of a physics body.
 *
 * The motion type input is a number corresponding to the PhysicsMotionType enum:
 * - 0 = STATIC (not moving, not affected by forces)
 * - 1 = ANIMATED (not affected by other bodies, but pushes them)
 * - 2 = DYNAMIC (fully simulated, affected by forces and collisions)
 */
export declare class FlowGraphSetPhysicsMotionTypeBlock extends FlowGraphExecutionBlockWithOutSignal {
    /**
     * Input connection: The physics body whose motion type will be set.
     */
    readonly body: FlowGraphDataConnection<PhysicsBody>;
    /**
     * Input connection: The motion type to set (0=STATIC, 1=ANIMATED, 2=DYNAMIC).
     */
    readonly motionType: FlowGraphDataConnection<number>;
    /**
     * Constructs a new FlowGraphSetPhysicsMotionTypeBlock.
     * @param config - optional configuration for the block
     */
    constructor(config?: IFlowGraphBlockConfiguration);
    /**
     * @internal
     */
    _execute(context: FlowGraphContext, _callingSignal: FlowGraphSignalConnection): void;
    /**
     * @returns class name of the block.
     */
    getClassName(): string;
}
/**
 * Register side effects for flowGraphSetPhysicsMotionTypeBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterFlowGraphSetPhysicsMotionTypeBlock(): void;
