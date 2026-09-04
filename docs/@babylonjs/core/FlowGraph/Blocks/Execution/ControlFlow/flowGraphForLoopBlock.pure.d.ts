/** This file must only contain pure code and pure imports */
import { type FlowGraphSignalConnection } from "../../../flowGraphSignalConnection.pure.js";
import { type FlowGraphDataConnection } from "../../../flowGraphDataConnection.pure.js";
import { FlowGraphExecutionBlockWithOutSignal } from "../../../flowGraphExecutionBlockWithOutSignal.js";
import { type FlowGraphContext } from "../../../flowGraphContext.js";
import { type IFlowGraphBlockConfiguration } from "../../../flowGraphBlock.js";
import { type FlowGraphNumber } from "../../../utils.js";
import { FlowGraphInteger } from "../../../CustomTypes/flowGraphInteger.pure.js";
/**
 * Configuration for the For Loop block.
 */
export interface IFlowGraphForLoopBlockConfiguration extends IFlowGraphBlockConfiguration {
    /**
     * The initial index of the loop.
     * if not set will default to 0
     */
    initialIndex?: FlowGraphNumber;
    /**
     * If set to true, the index of the case will be incremented when the loop is done.
     * This will result that the index will equal endIndex when the loop finished its work.
     * This is the default behavior in glTF interactivity
     */
    incrementIndexWhenLoopDone?: boolean;
    /**
     * Overrides {@link FlowGraphForLoopBlock.MaxLoopIterations} for this block only.
     * Lets a single graph opt into a higher (or lower) runaway-loop guard without changing the
     * process-wide default that every other FlowGraph relies on.
     */
    maxLoopIterations?: number;
}
/**
 * Block that executes an action in a loop.
 */
export declare class FlowGraphForLoopBlock extends FlowGraphExecutionBlockWithOutSignal {
    /**
     * The default maximum number of iterations allowed for the loop, used as a safety net against
     * runaway loops. Kept conservative so a runaway loop is caught before it can freeze the tab.
     * A single graph that legitimately needs more iterations should set the per-block
     * {@link IFlowGraphForLoopBlockConfiguration.maxLoopIterations} rather than raising this
     * process-wide default that every other FlowGraph relies on.
     */
    static MaxLoopIterations: number;
    /**
     * Input connection: The start index of the loop.
     */
    readonly startIndex: FlowGraphDataConnection<FlowGraphNumber>;
    /**
     * Input connection: The end index of the loop.
     */
    readonly endIndex: FlowGraphDataConnection<FlowGraphNumber>;
    /**
     * Input connection: The step of the loop.
     */
    readonly step: FlowGraphDataConnection<number>;
    /**
     * Output connection: The current index of the loop.
     */
    readonly index: FlowGraphDataConnection<FlowGraphInteger>;
    /**
     * Output connection: The signal that is activated when the loop body is executed.
     */
    readonly executionFlow: FlowGraphSignalConnection;
    /**
     * Output connection: The completed signal. Triggered when condition is false.
     * No out signal is available.
     */
    readonly completed: FlowGraphSignalConnection;
    constructor(config?: IFlowGraphForLoopBlockConfiguration);
    /**
     * @internal
     */
    _execute(context: FlowGraphContext): void;
    /**
     * @returns class name of the block.
     */
    getClassName(): string;
}
/**
 * Register side effects for flowGraphForLoopBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterFlowGraphForLoopBlock(): void;
