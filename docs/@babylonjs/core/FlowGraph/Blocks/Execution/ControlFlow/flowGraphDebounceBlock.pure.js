/** This file must only contain pure code and pure imports */
import { RichTypeNumber } from "../../../flowGraphRichTypes.pure.js";
import { FlowGraphExecutionBlockWithOutSignal } from "../../../flowGraphExecutionBlockWithOutSignal.js";
import { RegisterClass } from "../../../../Misc/typeStore.js";
/**
 * This block debounces the execution of a input, i.e. ensures that the input is only executed once every X times
 */
export class FlowGraphDebounceBlock extends FlowGraphExecutionBlockWithOutSignal {
    constructor(config) {
        super(config);
        this.count = this.registerDataInput("count", RichTypeNumber);
        this.reset = this._registerSignalInput("reset");
        this.currentCount = this.registerDataOutput("currentCount", RichTypeNumber);
    }
    _execute(context, callingSignal) {
        if (callingSignal === this.reset) {
            context._setExecutionVariable(this, "debounceCount", 0);
            return;
        }
        const count = this.count.getValue(context);
        const currentCount = context._getExecutionVariable(this, "debounceCount", 0);
        const newCount = currentCount + 1;
        this.currentCount.setValue(newCount, context);
        context._setExecutionVariable(this, "debounceCount", newCount);
        if (newCount >= count) {
            this.out._activateSignal(context);
            context._setExecutionVariable(this, "debounceCount", 0);
        }
    }
    /**
     * @returns class name of the block.
     */
    getClassName() {
        return "FlowGraphDebounceBlock" /* FlowGraphBlockNames.Debounce */;
    }
}
let _Registered = false;
/**
 * Register side effects for flowGraphDebounceBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterFlowGraphDebounceBlock() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    RegisterClass("FlowGraphDebounceBlock" /* FlowGraphBlockNames.Debounce */, FlowGraphDebounceBlock);
}
//# sourceMappingURL=flowGraphDebounceBlock.pure.js.map