/** This file must only contain pure code and pure imports */
import { type IFlowGraphBlockConfiguration } from "../../../flowGraphBlock.js";
import { type FlowGraphContext } from "../../../flowGraphContext.js";
import { FlowGraphExecutionBlock } from "../../../flowGraphExecutionBlock.js";
import { type FlowGraphSignalConnection } from "../../../flowGraphSignalConnection.pure.js";
/**
 * Configuration for the sequence block.
 */
export interface IFlowGraphSequenceBlockConfiguration extends IFlowGraphBlockConfiguration {
    /**
     * The number of output signals. Defaults to 1.
     */
    outputSignalCount?: number;
}
/**
 * A block that executes its output flows in sequence.
 */
export declare class FlowGraphSequenceBlock extends FlowGraphExecutionBlock {
    /**
     * the configuration of the block
     */
    config: IFlowGraphSequenceBlockConfiguration;
    /**
     * The output flows.
     */
    executionSignals: FlowGraphSignalConnection[];
    constructor(
    /**
     * the configuration of the block
     */
    config: IFlowGraphSequenceBlockConfiguration);
    _execute(context: FlowGraphContext): void;
    /**
     * Sets the block's output flows. Would usually be passed from the constructor but can be changed afterwards.
     * @param outputSignalCount the number of output flows
     */
    setNumberOfOutputSignals(outputSignalCount?: number): void;
    /**
     * @returns class name of the block.
     */
    getClassName(): string;
}
/**
 * Register side effects for flowGraphSequenceBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterFlowGraphSequenceBlock(): void;
