/** This file must only contain pure code and pure imports */
import { RichTypeBoolean } from "../../../flowGraphRichTypes.pure.js";
import { FlowGraphExecutionBlock } from "../../../flowGraphExecutionBlock.js";
import { RegisterClass } from "../../../../Misc/typeStore.js";
/**
 * A block that evaluates a condition and activates one of two branches.
 */
export class FlowGraphBranchBlock extends FlowGraphExecutionBlock {
    constructor(config) {
        super(config);
        this.condition = this.registerDataInput("condition", RichTypeBoolean);
        this.onTrue = this._registerSignalOutput("onTrue");
        this.onFalse = this._registerSignalOutput("onFalse");
    }
    _execute(context) {
        if (this.condition.getValue(context)) {
            this.onTrue._activateSignal(context);
        }
        else {
            this.onFalse._activateSignal(context);
        }
    }
    /**
     * @returns class name of the block.
     */
    getClassName() {
        return "FlowGraphBranchBlock" /* FlowGraphBlockNames.Branch */;
    }
}
let _Registered = false;
/**
 * Register side effects for flowGraphBranchBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterFlowGraphBranchBlock() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    RegisterClass("FlowGraphBranchBlock" /* FlowGraphBlockNames.Branch */, FlowGraphBranchBlock);
}
//# sourceMappingURL=flowGraphBranchBlock.pure.js.map