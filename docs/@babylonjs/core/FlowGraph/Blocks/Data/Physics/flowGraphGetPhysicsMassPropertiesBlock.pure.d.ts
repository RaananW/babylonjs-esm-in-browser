/** This file must only contain pure code and pure imports */
import { type IFlowGraphBlockConfiguration, FlowGraphBlock } from "../../../flowGraphBlock.js";
import { type FlowGraphContext } from "../../../flowGraphContext.js";
import { type FlowGraphDataConnection } from "../../../flowGraphDataConnection.pure.js";
import { type PhysicsBody } from "../../../../Physics/v2/physicsBody.js";
import { type Vector3 } from "../../../../Maths/math.vector.pure.js";
/**
 * @experimental
 * A data block that reads the mass properties of a physics body.
 * Outputs the mass, center of mass (local space), and principal inertia.
 */
export declare class FlowGraphGetPhysicsMassPropertiesBlock extends FlowGraphBlock {
    /**
     * Input connection: The physics body to read mass properties from.
     */
    readonly body: FlowGraphDataConnection<PhysicsBody>;
    /**
     * Output connection: The total mass in kilograms.
     */
    readonly mass: FlowGraphDataConnection<number>;
    /**
     * Output connection: The center of mass in local space.
     */
    readonly centerOfMass: FlowGraphDataConnection<Vector3>;
    /**
     * Output connection: The principal moments of inertia.
     */
    readonly inertia: FlowGraphDataConnection<Vector3>;
    /**
     * Constructs a new FlowGraphGetPhysicsMassPropertiesBlock.
     * @param config - optional configuration for the block
     */
    constructor(config?: IFlowGraphBlockConfiguration);
    /**
     * @internal
     */
    _updateOutputs(context: FlowGraphContext): void;
    /**
     * @returns class name of the block.
     */
    getClassName(): string;
}
/**
 * Register side effects for flowGraphGetPhysicsMassPropertiesBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterFlowGraphGetPhysicsMassPropertiesBlock(): void;
