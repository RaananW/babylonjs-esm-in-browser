/** This file must only contain pure code and pure imports */
import { FlowGraphExecutionBlock } from "../../../flowGraphExecutionBlock.js";
import { RichTypeBoolean } from "../../../flowGraphRichTypes.pure.js";
import { RegisterClass } from "../../../../Misc/typeStore.js";
/**
 * This block flip flops between two outputs.
 */
export class FlowGraphFlipFlopBlock extends FlowGraphExecutionBlock {
    constructor(config) {
        super(config);
        this.onOn = this._registerSignalOutput("onOn");
        this.onOff = this._registerSignalOutput("onOff");
        this.value = this.registerDataOutput("value", RichTypeBoolean);
    }
    _execute(context, _callingSignal) {
        let value = context._getExecutionVariable(this, "value", typeof this.config?.startValue === "boolean" ? !this.config.startValue : false);
        value = !value;
        context._setExecutionVariable(this, "value", value);
        this.value.setValue(value, context);
        if (value) {
            this.onOn._activateSignal(context);
        }
        else {
            this.onOff._activateSignal(context);
        }
    }
    /**
     * @returns class name of the block.
     */
    getClassName() {
        return "FlowGraphFlipFlopBlock" /* FlowGraphBlockNames.FlipFlop */;
    }
}
let _Registered = false;
/**
 * Register side effects for flowGraphFlipFlopBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterFlowGraphFlipFlopBlock() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    RegisterClass("FlowGraphFlipFlopBlock" /* FlowGraphBlockNames.FlipFlop */, FlowGraphFlipFlopBlock);
}
//# sourceMappingURL=flowGraphFlipFlopBlock.pure.js.map