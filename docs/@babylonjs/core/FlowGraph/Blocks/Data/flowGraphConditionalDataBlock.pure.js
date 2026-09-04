/** This file must only contain pure code and pure imports */
import { FlowGraphBlock } from "../../flowGraphBlock.js";
import { RichTypeBoolean, RichTypeAny } from "../../flowGraphRichTypes.pure.js";
import { RegisterClass } from "../../../Misc/typeStore.js";
/**
 * Block that returns a value based on a condition.
 */
export class FlowGraphConditionalDataBlock extends FlowGraphBlock {
    /**
     * Creates a new instance of the block
     * @param config optional configuration for this block
     */
    constructor(config) {
        super(config);
        this.condition = this.registerDataInput("condition", RichTypeBoolean);
        this.onTrue = this.registerDataInput("onTrue", RichTypeAny);
        this.onFalse = this.registerDataInput("onFalse", RichTypeAny);
        this.output = this.registerDataOutput("output", RichTypeAny);
    }
    /**
     * @internal
     */
    _updateOutputs(context) {
        // get the value of the condition
        const condition = this.condition.getValue(context);
        // set the value based on the condition truth-ness.
        this.output.setValue(condition ? this.onTrue.getValue(context) : this.onFalse.getValue(context), context);
    }
    /**
     * Gets the class name of this block
     * @returns the class name
     */
    getClassName() {
        return "FlowGraphConditionalBlock" /* FlowGraphBlockNames.Conditional */;
    }
}
let _Registered = false;
/**
 * Register side effects for flowGraphConditionalDataBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterFlowGraphConditionalDataBlock() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    RegisterClass("FlowGraphConditionalBlock" /* FlowGraphBlockNames.Conditional */, FlowGraphConditionalDataBlock);
}
//# sourceMappingURL=flowGraphConditionalDataBlock.pure.js.map