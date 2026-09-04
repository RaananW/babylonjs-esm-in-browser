/** This file must only contain pure code and pure imports */
import { FlowGraphExecutionBlockWithOutSignal } from "../../../flowGraphExecutionBlockWithOutSignal.js";
import { RichTypeFlowGraphInteger } from "../../../flowGraphRichTypes.pure.js";
import { getNumericValue } from "../../../utils.js";
import { MarkDelayInactive } from "../../../flowGraphDelayRegistry.js";
import { RegisterClass } from "../../../../Misc/typeStore.js";
/**
 * This block cancels a delay that was previously scheduled.
 */
export class FlowGraphCancelDelayBlock extends FlowGraphExecutionBlockWithOutSignal {
    constructor(config) {
        super(config);
        this.delayIndex = this.registerDataInput("delayIndex", RichTypeFlowGraphInteger);
    }
    _execute(context, _callingSignal) {
        const delayIndex = getNumericValue(this.delayIndex.getValue(context));
        if (delayIndex < 0 || isNaN(delayIndex) || !isFinite(delayIndex)) {
            return this._reportError(context, "Invalid delay index");
        }
        const timers = context._getGlobalContextVariable("pendingDelays", []);
        const timer = timers[delayIndex];
        if (timer) {
            timer.dispose();
            delete timers[delayIndex];
            context._setGlobalContextVariable("pendingDelays", timers);
        }
        // The delay is cancelled, so drop it from the active set used by handle validity checks.
        MarkDelayInactive(context, delayIndex);
        // activate the out output flow
        this.out._activateSignal(context);
    }
    getClassName() {
        return "FlowGraphCancelDelayBlock" /* FlowGraphBlockNames.CancelDelay */;
    }
}
let _Registered = false;
/**
 * Register side effects for flowGraphCancelDelayBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterFlowGraphCancelDelayBlock() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    RegisterClass("FlowGraphCancelDelayBlock" /* FlowGraphBlockNames.CancelDelay */, FlowGraphCancelDelayBlock);
}
//# sourceMappingURL=flowGraphCancelDelayBlock.pure.js.map