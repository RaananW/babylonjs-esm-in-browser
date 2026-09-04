/** This file must only contain pure code and pure imports */
import { FlowGraphEventBlock } from "../../flowGraphEventBlock.js";
import { Logger } from "../../../Misc/logger.js";
import { getRichTypeByFlowGraphType, RichTypeString } from "../../flowGraphRichTypes.pure.js";
import { FlowGraphCoordinator } from "../../flowGraphCoordinator.js";
import { RegisterClass } from "../../../Misc/typeStore.js";
/**
 * A block that receives a custom event.
 * It saves the event data in the data outputs, based on the provided eventData in the configuration. For example, if the event data is
 * `{ x: { type: RichTypeNumber }, y: { type: RichTypeNumber } }`, the block will have two data outputs: x and y.
 */
export class FlowGraphReceiveCustomEventBlock extends FlowGraphEventBlock {
    constructor(
    /**
     * the configuration of the block
     */
    config) {
        super(config);
        this.config = config;
        this.initPriority = 1;
        // use event data to register data outputs
        for (const key in this.config.eventData) {
            const entry = this.config.eventData[key];
            // Handle deserialized config where type may be a string typeName, a plain object
            // with a typeName property (from old JSON serialization), or a proper RichType instance.
            const typeKey = typeof entry.type === "string" ? entry.type : entry.type?.typeName;
            const richType = typeof entry.type?.serialize === "function" ? entry.type : getRichTypeByFlowGraphType(typeKey);
            entry.type = richType;
            // Pass default value from event data schema so outputs have the correct initial value
            this.registerDataOutput(key, richType, entry.value);
        }
        // Reserved `event` output exposing the event reference. Guard against a
        // (pathological) custom event value socket literally named "event".
        this.eventRef =
            this.config.eventData && Object.prototype.hasOwnProperty.call(this.config.eventData, "event")
                ? this.getDataOutput("event")
                : this.registerDataOutput("event", RichTypeString);
    }
    _updateOutputs(context) {
        this.eventRef.setValue(context.getEventReference(this.config.eventId), context);
    }
    _preparePendingTasks(context) {
        const observable = context.configuration.coordinator.getCustomEventObservable(this.config.eventId);
        // check if we are not exceeding the max number of events
        if (observable && observable.hasObservers() && observable.observers.length > FlowGraphCoordinator.MaxEventsPerType) {
            this._reportError(context, `FlowGraphReceiveCustomEventBlock: Too many observers for event ${this.config.eventId}. Max is ${FlowGraphCoordinator.MaxEventsPerType}.`);
            return;
        }
        const eventObserver = observable.add((eventData, eventState) => {
            // Make this dispatch's EventState reachable by event/stopPropagation
            // for the duration of the synchronous receiver flow.
            context.configuration.coordinator._beginEventDispatch(this.config.eventId, eventState);
            try {
                // Drive the outputs from the configured payload schema rather than from the incoming
                // keys, so a key the sender omitted (or sent as undefined) resets to its configured
                // default instead of retaining the value from a previous dispatch.
                for (const key in this.config.eventData) {
                    const output = this.getDataOutput(key);
                    if (!output) {
                        continue;
                    }
                    const incoming = eventData?.[key];
                    output.setValue(incoming === undefined ? this._getEventDataDefault(key) : incoming, context);
                }
                // Expose the event reference before activating downstream flow.
                this.eventRef.setValue(context.getEventReference(this.config.eventId), context);
                this._execute(context);
            }
            finally {
                context.configuration.coordinator._endEventDispatch();
            }
        });
        context._setExecutionVariable(this, "_eventObserver", eventObserver);
    }
    /**
     * The value an output falls back to when the sender provides no value for it: the default
     * declared by the payload schema, or the socket type's default when the schema declares none.
     * @param key the payload key
     * @returns the default value for that key
     */
    _getEventDataDefault(key) {
        const entry = this.config.eventData?.[key];
        return entry?.value !== undefined ? entry.value : entry?.type?.defaultValue;
    }
    _cancelPendingTasks(context) {
        const observable = context.configuration.coordinator.getCustomEventObservable(this.config.eventId);
        if (observable) {
            const eventObserver = context._getExecutionVariable(this, "_eventObserver", null);
            observable.remove(eventObserver);
        }
        else {
            Logger.Warn(`FlowGraphReceiveCustomEventBlock: Missing observable for event ${this.config.eventId}`);
        }
    }
    _executeEvent(_context, _payload) {
        return true;
    }
    serialize(serializationObject = {}) {
        super.serialize(serializationObject);
        // Override the eventData in config to store typeName strings instead of RichType instances
        const serializedEventData = {};
        for (const key in this.config.eventData) {
            serializedEventData[key] = { type: this.config.eventData[key].type.typeName };
        }
        serializationObject.config.eventData = serializedEventData;
    }
    /**
     * @returns class name of the block.
     */
    getClassName() {
        return "FlowGraphReceiveCustomEventBlock" /* FlowGraphBlockNames.ReceiveCustomEvent */;
    }
}
let _Registered = false;
/**
 * Register side effects for flowGraphReceiveCustomEventBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterFlowGraphReceiveCustomEventBlock() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    RegisterClass("FlowGraphReceiveCustomEventBlock" /* FlowGraphBlockNames.ReceiveCustomEvent */, FlowGraphReceiveCustomEventBlock);
}
//# sourceMappingURL=flowGraphReceiveCustomEventBlock.pure.js.map