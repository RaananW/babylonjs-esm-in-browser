/** This file must only contain pure code and pure imports */
import { type FlowGraphContext } from "../../flowGraphContext.js";
import { FlowGraphEventBlock } from "../../flowGraphEventBlock.js";
import { type RichType } from "../../flowGraphRichTypes.pure.js";
import { type FlowGraphDataConnection } from "../../flowGraphDataConnection.pure.js";
import { type IFlowGraphBlockConfiguration } from "../../flowGraphBlock.js";
/**
 * Parameters used to create a FlowGraphReceiveCustomEventBlock.
 */
export interface IFlowGraphReceiveCustomEventBlockConfiguration extends IFlowGraphBlockConfiguration {
    /**
     * The id of the event to receive.
     * This event id is unique to the environment (not the context).
     */
    eventId: string;
    /**
     * The names of the data outputs for that event. Should be in the same order as the event data in
     * SendCustomEvent
     */
    eventData: {
        [key: string]: {
            type: RichType<any>;
        };
    };
}
/**
 * A block that receives a custom event.
 * It saves the event data in the data outputs, based on the provided eventData in the configuration. For example, if the event data is
 * `{ x: { type: RichTypeNumber }, y: { type: RichTypeNumber } }`, the block will have two data outputs: x and y.
 */
export declare class FlowGraphReceiveCustomEventBlock extends FlowGraphEventBlock {
    /**
     * the configuration of the block
     */
    config: IFlowGraphReceiveCustomEventBlockConfiguration;
    initPriority: number;
    /**
     * Output: the opaque reference identifying the received event source.
     * Receivers configured with the same event id share the same reference, so comparing their
     * `event` outputs for equality succeeds. The reference format is owned by the host environment.
     */
    readonly eventRef: FlowGraphDataConnection<string>;
    constructor(
    /**
     * the configuration of the block
     */
    config: IFlowGraphReceiveCustomEventBlockConfiguration);
    _updateOutputs(context: FlowGraphContext): void;
    _preparePendingTasks(context: FlowGraphContext): void;
    /**
     * The value an output falls back to when the sender provides no value for it: the default
     * declared by the payload schema, or the socket type's default when the schema declares none.
     * @param key the payload key
     * @returns the default value for that key
     */
    private _getEventDataDefault;
    _cancelPendingTasks(context: FlowGraphContext): void;
    _executeEvent(_context: FlowGraphContext, _payload: any): boolean;
    serialize(serializationObject?: any): void;
    /**
     * @returns class name of the block.
     */
    getClassName(): string;
}
/**
 * Register side effects for flowGraphReceiveCustomEventBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterFlowGraphReceiveCustomEventBlock(): void;
