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
 * A block that applies an impulse to a physics body at a given location.
 * Unlike a force (which is applied over time), an impulse is an instantaneous
 * change in momentum.
 */
export declare class FlowGraphApplyImpulseBlock extends FlowGraphExecutionBlockWithOutSignal {
    /**
     * Input connection: The physics body to apply the impulse to.
     */
    readonly body: FlowGraphDataConnection<PhysicsBody>;
    /**
     * Input connection: The impulse vector to apply.
     */
    readonly impulse: FlowGraphDataConnection<Vector3>;
    /**
     * Input connection: The world-space location at which to apply the impulse.
     */
    readonly location: FlowGraphDataConnection<Vector3>;
    /**
     * Constructs a new FlowGraphApplyImpulseBlock.
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
 * Register side effects for flowGraphApplyImpulseBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterFlowGraphApplyImpulseBlock(): void;
