/** This file must only contain pure code and pure imports */
import { type RichType } from "../../flowGraphRichTypes.pure.js";
import { FlowGraphExecutionBlockWithOutSignal } from "../../flowGraphExecutionBlockWithOutSignal.js";
import { type FlowGraphContext } from "../../flowGraphContext.js";
import { type IFlowGraphBlockConfiguration } from "../../flowGraphBlock.js";
/**
 * Parameters used to create a FlowGraphSendCustomEventBlock.
 */
export interface IFlowGraphSendCustomEventBlockConfiguration extends IFlowGraphBlockConfiguration {
    /**
     * The id of the event to send.
     * Note - in the glTF specs this is an index to the event array (i.e. - a number)
     */
    eventId: string;
    /**
     * The names of the data inputs for that event.
     */
    eventData: {
        [key: string]: {
            type: RichType<any>;
            value?: any;
        };
    };
}
/**
 * A block that sends a custom event.
 * To receive this event you need to use the ReceiveCustomEvent block.
 * This block has no output, but does have inputs based on the eventData from the configuration.
 * @see FlowGraphReceiveCustomEventBlock
 */
export declare class FlowGraphSendCustomEventBlock extends FlowGraphExecutionBlockWithOutSignal {
    /**
     * the configuration of the block
     */
    config: IFlowGraphSendCustomEventBlockConfiguration;
    constructor(
    /**
     * the configuration of the block
     */
    config: IFlowGraphSendCustomEventBlockConfiguration);
    _execute(context: FlowGraphContext): void;
    serialize(serializationObject?: any): void;
    /**
     * @returns class name of the block.
     */
    getClassName(): string;
}
/**
 * Register side effects for flowGraphSendCustomEventBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterFlowGraphSendCustomEventBlock(): void;
