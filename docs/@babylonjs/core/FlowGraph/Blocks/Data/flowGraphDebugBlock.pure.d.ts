/** This file must only contain pure code and pure imports */
import { type FlowGraphContext } from "../../flowGraphContext.js";
import { type IFlowGraphBlockConfiguration, FlowGraphBlock } from "../../flowGraphBlock.js";
import { type FlowGraphDataConnection } from "../../flowGraphDataConnection.pure.js";
/**
 * A passthrough block used to debug data values flowing through connections.
 * Spliced into a data connection to observe the value passing through it.
 */
export declare class FlowGraphDebugBlock extends FlowGraphBlock {
    /**
     * Input connection: The value to observe.
     */
    readonly input: FlowGraphDataConnection<any>;
    /**
     * Output connection: The same value, passed through unchanged.
     */
    readonly output: FlowGraphDataConnection<any>;
    /**
     * Log of values that have passed through this block.
     * Each entry is a [displayString, tooltipString] tuple.
     */
    log: string[][];
    /**
     * Whether this block is a debug block.
     * Used by the editor to identify debug blocks.
     */
    readonly _isDebug: boolean;
    constructor(config?: IFlowGraphBlockConfiguration);
    /**
     * @internal
     */
    _updateOutputs(context: FlowGraphContext): void;
    /**
     * Format and store a value in the log.
     * @param value
     */
    private _logValue;
    /**
     * Type-aware value formatting.
     * @param value the value to format
     * @returns a human-readable string
     */
    private static _FormatValue;
    getClassName(): string;
}
/**
 * Register side effects for flowGraphDebugBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterFlowGraphDebugBlock(): void;
