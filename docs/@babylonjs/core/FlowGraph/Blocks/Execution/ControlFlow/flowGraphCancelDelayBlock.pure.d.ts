/** This file must only contain pure code and pure imports */
import { type IFlowGraphBlockConfiguration } from "../../../flowGraphBlock.js";
import { type FlowGraphContext } from "../../../flowGraphContext.js";
import { type FlowGraphDataConnection } from "../../../flowGraphDataConnection.pure.js";
import { FlowGraphExecutionBlockWithOutSignal } from "../../../flowGraphExecutionBlockWithOutSignal.js";
import { type FlowGraphSignalConnection } from "../../../flowGraphSignalConnection.pure.js";
import { type FlowGraphInteger } from "../../../CustomTypes/flowGraphInteger.pure.js";
/**
 * This block cancels a delay that was previously scheduled.
 */
export declare class FlowGraphCancelDelayBlock extends FlowGraphExecutionBlockWithOutSignal {
    /**
     * Input connection: The index value of the scheduled activation to be cancelled.
     */
    readonly delayIndex: FlowGraphDataConnection<FlowGraphInteger>;
    constructor(config?: IFlowGraphBlockConfiguration);
    _execute(context: FlowGraphContext, _callingSignal: FlowGraphSignalConnection): void;
    getClassName(): string;
}
/**
 * Register side effects for flowGraphCancelDelayBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterFlowGraphCancelDelayBlock(): void;
