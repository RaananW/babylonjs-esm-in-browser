/** This file must only contain pure code and pure imports */
import { type FlowGraphContext } from "../../../flowGraphContext.js";
import { type FlowGraphDataConnection } from "../../../flowGraphDataConnection.pure.js";
import { FlowGraphExecutionBlock } from "../../../flowGraphExecutionBlock.js";
import { type FlowGraphSignalConnection } from "../../../flowGraphSignalConnection.pure.js";
import { type IFlowGraphBlockConfiguration } from "../../../flowGraphBlock.js";
/**
 * A block that evaluates a condition and activates one of two branches.
 */
export declare class FlowGraphBranchBlock extends FlowGraphExecutionBlock {
    /**
     * Input connection: The condition to evaluate.
     */
    readonly condition: FlowGraphDataConnection<boolean>;
    /**
     * Output connection: The branch to execute if the condition is true.
     */
    readonly onTrue: FlowGraphSignalConnection;
    /**
     * Output connection: The branch to execute if the condition is false.
     */
    readonly onFalse: FlowGraphSignalConnection;
    constructor(config?: IFlowGraphBlockConfiguration);
    _execute(context: FlowGraphContext): void;
    /**
     * @returns class name of the block.
     */
    getClassName(): string;
}
/**
 * Register side effects for flowGraphBranchBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterFlowGraphBranchBlock(): void;
