/** This file must only contain pure code and pure imports */
import { RichTypeNumber } from "../../../flowGraphRichTypes.pure.js";
import { FlowGraphExecutionBlockWithOutSignal } from "../../../flowGraphExecutionBlockWithOutSignal.js";
import { RegisterClass } from "../../../../Misc/typeStore.js";
/**
 * A block that counts the number of times it has been called.
 * Afterwards it activates its out signal.
 */
export class FlowGraphCallCounterBlock extends FlowGraphExecutionBlockWithOutSignal {
    constructor(config) {
        super(config);
        this.count = this.registerDataOutput("count", RichTypeNumber);
        this.reset = this._registerSignalInput("reset");
    }
    _execute(context, callingSignal) {
        if (callingSignal === this.reset) {
            context._setExecutionVariable(this, "count", 0);
            this.count.setValue(0, context);
            return;
        }
        const countValue = context._getExecutionVariable(this, "count", 0) + 1;
        context._setExecutionVariable(this, "count", countValue);
        this.count.setValue(countValue, context);
        this.out._activateSignal(context);
    }
    /**
     * @returns class name of the block.
     */
    getClassName() {
        return "FlowGraphCallCounterBlock" /* FlowGraphBlockNames.CallCounter */;
    }
}
let _Registered = false;
/**
 * Register side effects for flowGraphCounterBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterFlowGraphCounterBlock() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    RegisterClass("FlowGraphCallCounterBlock" /* FlowGraphBlockNames.CallCounter */, FlowGraphCallCounterBlock);
}
//# sourceMappingURL=flowGraphCounterBlock.pure.js.map