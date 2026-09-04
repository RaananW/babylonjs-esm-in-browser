/** This file must only contain pure code and pure imports */
import { FlowGraphBlock, type IFlowGraphBlockConfiguration } from "../../../flowGraphBlock.js";
import { type FlowGraphContext } from "../../../flowGraphContext.js";
import { type FlowGraphDataConnection } from "../../../flowGraphDataConnection.pure.js";
/**
 * A block that outputs elements from the context
 */
export declare class FlowGraphContextBlock extends FlowGraphBlock {
    /**
     * Output connection: The user variables from the context
     */
    readonly userVariables: FlowGraphDataConnection<FlowGraphContext["userVariables"]>;
    /**
     * Output connection: The execution id from the context
     */
    readonly executionId: FlowGraphDataConnection<FlowGraphContext["executionId"]>;
    constructor(config?: IFlowGraphBlockConfiguration);
    _updateOutputs(context: FlowGraphContext): void;
    serialize(serializationObject?: any): void;
    getClassName(): string;
}
/**
 * Register side effects for flowGraphContextBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterFlowGraphContextBlock(): void;
