/** This file must only contain pure code and pure imports */
import { type FlowGraphContext } from "../../../flowGraphContext.js";
import { type FlowGraphDataConnection } from "../../../flowGraphDataConnection.pure.js";
import { type FlowGraphSignalConnection } from "../../../flowGraphSignalConnection.pure.js";
import { type IFlowGraphBlockConfiguration } from "../../../flowGraphBlock.js";
import { FlowGraphExecutionBlockWithOutSignal } from "../../../flowGraphExecutionBlockWithOutSignal.js";
/**
 * Configuration for the while loop block.
 */
export interface IFlowGraphWhileLoopBlockConfiguration extends IFlowGraphBlockConfiguration {
    /**
     * If true, the loop body will be executed at least once.
     */
    doWhile?: boolean;
}
/**
 * A block that executes a branch while a condition is true.
 */
export declare class FlowGraphWhileLoopBlock extends FlowGraphExecutionBlockWithOutSignal {
    /**
     * the configuration of the block
     */
    config?: IFlowGraphWhileLoopBlockConfiguration | undefined;
    /**
     * The maximum number of iterations allowed in a loop.
     * This can be set to avoid an infinite loop.
     */
    static MaxLoopCount: number;
    /**
     * Input connection: The condition to evaluate.
     */
    readonly condition: FlowGraphDataConnection<boolean>;
    /**
     * Output connection: The loop body.
     */
    readonly executionFlow: FlowGraphSignalConnection;
    /**
     * Output connection: The completed signal. Triggered when condition is false.
     * No out signal is available.
     */
    readonly completed: FlowGraphSignalConnection;
    constructor(
    /**
     * the configuration of the block
     */
    config?: IFlowGraphWhileLoopBlockConfiguration | undefined);
    _execute(context: FlowGraphContext, _callingSignal: FlowGraphSignalConnection): void;
    getClassName(): string;
}
/**
 * Register side effects for flowGraphWhileLoopBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterFlowGraphWhileLoopBlock(): void;
