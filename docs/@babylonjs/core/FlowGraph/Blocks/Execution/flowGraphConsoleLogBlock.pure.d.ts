/** This file must only contain pure code and pure imports */
import { type FlowGraphContext } from "../../flowGraphContext.js";
import { type FlowGraphDataConnection } from "../../flowGraphDataConnection.pure.js";
import { FlowGraphExecutionBlockWithOutSignal } from "../../flowGraphExecutionBlockWithOutSignal.js";
import { type IFlowGraphBlockConfiguration } from "../../flowGraphBlock.js";
/**
 * Configuration for the console log block.
 */
export interface IFlowGraphConsoleLogBlockConfiguration extends IFlowGraphBlockConfiguration {
    /**
     * An optional message template to use for the log message.
     * If provided, the template can hold placeholders for the message value.
     * For example, if the template is "The message is: \{data\}", a new data input called "data" will be created.
     * The value of the message input will be used to replace the placeholder in the template.
     */
    messageTemplate?: string;
}
/**
 * Block that logs a message to the console.
 */
export declare class FlowGraphConsoleLogBlock extends FlowGraphExecutionBlockWithOutSignal {
    /**
     * Input connection: The message to log.
     * Will be ignored if a message template is provided.
     */
    readonly message: FlowGraphDataConnection<any>;
    /**
     * Input connection: The log type.
     */
    readonly logType: FlowGraphDataConnection<"log" | "warn" | "error">;
    /**
     * Creates a new console log block.
     * @param config optional configuration
     */
    constructor(config?: IFlowGraphConsoleLogBlockConfiguration);
    /**
     * @internal
     */
    _execute(context: FlowGraphContext): void;
    /**
     * @returns class name of the block.
     */
    getClassName(): string;
    private _serializeValue;
    private _getMessageValue;
    private _getTemplateMatches;
}
/**
 * Register side effects for flowGraphConsoleLogBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterFlowGraphConsoleLogBlock(): void;
