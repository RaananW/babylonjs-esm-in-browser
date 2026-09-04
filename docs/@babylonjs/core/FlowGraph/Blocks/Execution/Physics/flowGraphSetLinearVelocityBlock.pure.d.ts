/** This file must only contain pure code and pure imports */
import { type FlowGraphContext } from "../../../flowGraphContext.js";
import { type FlowGraphDataConnection } from "../../../flowGraphDataConnection.pure.js";
import { FlowGraphExecutionBlockWithOutSignal } from "../../../flowGraphExecutionBlockWithOutSignal.js";
import { type FlowGraphSignalConnection } from "../../../flowGraphSignalConnection.pure.js";
import { type IFlowGraphBlockConfiguration } from "../../../flowGraphBlock.js";
import { type PhysicsBody } from "../../../../Physics/v2/physicsBody.js";
import { type Vector3 } from "../../../../Maths/math.vector.pure.js";
/**
 * @experimental
 * A block that sets the linear velocity of a physics body.
 */
export declare class FlowGraphSetLinearVelocityBlock extends FlowGraphExecutionBlockWithOutSignal {
    /**
     * Input connection: The physics body whose velocity will be set.
     */
    readonly body: FlowGraphDataConnection<PhysicsBody>;
    /**
     * Input connection: The linear velocity to set.
     */
    readonly velocity: FlowGraphDataConnection<Vector3>;
    /**
     * Constructs a new FlowGraphSetLinearVelocityBlock.
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
 * Register side effects for flowGraphSetLinearVelocityBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterFlowGraphSetLinearVelocityBlock(): void;
