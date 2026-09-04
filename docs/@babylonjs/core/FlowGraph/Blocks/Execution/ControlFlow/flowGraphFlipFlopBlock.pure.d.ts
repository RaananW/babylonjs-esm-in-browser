/** This file must only contain pure code and pure imports */
import { type FlowGraphContext } from "../../../flowGraphContext.js";
import { type FlowGraphDataConnection } from "../../../flowGraphDataConnection.pure.js";
import { FlowGraphExecutionBlock } from "../../../flowGraphExecutionBlock.js";
import { type FlowGraphSignalConnection } from "../../../flowGraphSignalConnection.pure.js";
import { type IFlowGraphBlockConfiguration } from "../../../flowGraphBlock.js";
/**
 * Configuration for the flip flop block.
 */
export interface IFlowGraphFlipFlopBlockConfiguration extends IFlowGraphBlockConfiguration {
    /**
     * The starting value of the flip flop switch
     */
    startValue?: boolean;
}
/**
 * This block flip flops between two outputs.
 */
export declare class FlowGraphFlipFlopBlock extends FlowGraphExecutionBlock {
    /**
     * Output connection: The signal to execute when the variable is on.
     */
    readonly onOn: FlowGraphSignalConnection;
    /**
     * Output connection: The signal to execute when the variable is off.
     */
    readonly onOff: FlowGraphSignalConnection;
    /**
     * Output connection: If the variable is on.
     */
    readonly value: FlowGraphDataConnection<boolean>;
    constructor(config?: IFlowGraphFlipFlopBlockConfiguration);
    _execute(context: FlowGraphContext, _callingSignal: FlowGraphSignalConnection): void;
    /**
     * @returns class name of the block.
     */
    getClassName(): string;
}
/**
 * Register side effects for flowGraphFlipFlopBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterFlowGraphFlipFlopBlock(): void;
