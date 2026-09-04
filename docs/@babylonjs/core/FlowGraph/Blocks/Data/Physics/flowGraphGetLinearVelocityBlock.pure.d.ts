/** This file must only contain pure code and pure imports */
import { type IFlowGraphBlockConfiguration } from "../../../flowGraphBlock.js";
import { type FlowGraphContext } from "../../../flowGraphContext.js";
import { type FlowGraphDataConnection } from "../../../flowGraphDataConnection.pure.js";
import { FlowGraphCachedOperationBlock } from "../flowGraphCachedOperationBlock.js";
import { type PhysicsBody } from "../../../../Physics/v2/physicsBody.js";
import { Vector3 } from "../../../../Maths/math.vector.pure.js";
/**
 * @experimental
 * A data block that reads the linear velocity of a physics body.
 */
export declare class FlowGraphGetLinearVelocityBlock extends FlowGraphCachedOperationBlock<Vector3> {
    /**
     * Input connection: The physics body to read the velocity from.
     */
    readonly body: FlowGraphDataConnection<PhysicsBody>;
    /**
     * Constructs a new FlowGraphGetLinearVelocityBlock.
     * @param config - optional configuration for the block
     */
    constructor(config?: IFlowGraphBlockConfiguration);
    /**
     * @internal
     */
    _doOperation(context: FlowGraphContext): Vector3 | undefined;
    /**
     * @returns class name of the block.
     */
    getClassName(): string;
}
/**
 * Register side effects for flowGraphGetLinearVelocityBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterFlowGraphGetLinearVelocityBlock(): void;
