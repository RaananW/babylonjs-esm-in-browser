/** This file must only contain pure code and pure imports */
import { FlowGraphBlock } from "../../../flowGraphBlock.js";
import { RichTypeAny, RichTypeString } from "../../../flowGraphRichTypes.pure.js";
import { RegisterClass } from "../../../../Misc/typeStore.js";
/**
 * A flow graph block that takes a function name, an object and an optional context as inputs and calls the function on the object.
 */
export class FlowGraphFunctionReferenceBlock extends FlowGraphBlock {
    constructor(
    /**
     * the configuration of the block
     */
    config) {
        super(config);
        this.functionName = this.registerDataInput("functionName", RichTypeString);
        this.object = this.registerDataInput("object", RichTypeAny);
        this.context = this.registerDataInput("context", RichTypeAny, null);
        this.output = this.registerDataOutput("output", RichTypeAny);
    }
    _updateOutputs(context) {
        const functionName = this.functionName.getValue(context);
        const object = this.object.getValue(context);
        const contextValue = this.context.getValue(context);
        if (object && functionName) {
            const func = object[functionName];
            if (func && typeof func === "function") {
                this.output.setValue(func.bind(contextValue), context);
            }
        }
    }
    getClassName() {
        return "FlowGraphFunctionReference" /* FlowGraphBlockNames.FunctionReference */;
    }
}
let _Registered = false;
/**
 * Register side effects for flowGraphFunctionReferenceBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterFlowGraphFunctionReferenceBlock() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    RegisterClass("FlowGraphFunctionReference" /* FlowGraphBlockNames.FunctionReference */, FlowGraphFunctionReferenceBlock);
}
//# sourceMappingURL=flowGraphFunctionReferenceBlock.pure.js.map