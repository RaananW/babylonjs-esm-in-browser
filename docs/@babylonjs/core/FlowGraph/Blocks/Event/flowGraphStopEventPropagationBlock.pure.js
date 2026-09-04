/** This file must only contain pure code and pure imports */
import { FlowGraphExecutionBlockWithOutSignal } from "../../flowGraphExecutionBlockWithOutSignal.js";
import { RichTypeBoolean, RichTypeString } from "../../flowGraphRichTypes.pure.js";
import { RegisterClass } from "../../../Misc/typeStore.js";
/**
 * Stops the propagation of an in-flight custom event.
 *
 * When activated it asks the coordinator to skip the remaining handler nodes of
 * the currently-dispatching event referenced by the `event` input, then activates
 * its `out` flow. If the `event` input is not a valid, currently-dispatching event
 * reference, activating this block only fires `out` with no other effect.
 */
export class FlowGraphStopEventPropagationBlock extends FlowGraphExecutionBlockWithOutSignal {
    constructor(config) {
        super(config);
        this.event = this.registerDataInput("event", RichTypeString);
        this.stopImmediate = this.registerDataInput("stopImmediate", RichTypeBoolean, false);
    }
    _execute(context) {
        const event = this.event.getValue(context);
        const stopImmediate = this.stopImmediate.getValue(context);
        context.configuration.coordinator.stopEventPropagation(event, stopImmediate);
        this.out._activateSignal(context);
    }
    /**
     * @returns class name of the block.
     */
    getClassName() {
        return "FlowGraphStopEventPropagationBlock" /* FlowGraphBlockNames.StopEventPropagation */;
    }
}
let _Registered = false;
/**
 * Register side effects for flowGraphStopEventPropagationBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterFlowGraphStopEventPropagationBlock() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    RegisterClass("FlowGraphStopEventPropagationBlock" /* FlowGraphBlockNames.StopEventPropagation */, FlowGraphStopEventPropagationBlock);
}
//# sourceMappingURL=flowGraphStopEventPropagationBlock.pure.js.map