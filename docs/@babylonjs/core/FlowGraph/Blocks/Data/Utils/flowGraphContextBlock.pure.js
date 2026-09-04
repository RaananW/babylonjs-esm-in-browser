/** This file must only contain pure code and pure imports */
import { FlowGraphBlock } from "../../../flowGraphBlock.js";
import { RichTypeAny, RichTypeNumber } from "../../../flowGraphRichTypes.pure.js";
import { RegisterClass } from "../../../../Misc/typeStore.js";
/**
 * A block that outputs elements from the context
 */
export class FlowGraphContextBlock extends FlowGraphBlock {
    constructor(config) {
        super(config);
        this.userVariables = this.registerDataOutput("userVariables", RichTypeAny);
        this.executionId = this.registerDataOutput("executionId", RichTypeNumber);
    }
    _updateOutputs(context) {
        this.userVariables.setValue(context.userVariables, context);
        this.executionId.setValue(context.executionId, context);
    }
    serialize(serializationObject) {
        super.serialize(serializationObject);
    }
    getClassName() {
        return "FlowGraphContextBlock" /* FlowGraphBlockNames.Context */;
    }
}
let _Registered = false;
/**
 * Register side effects for flowGraphContextBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterFlowGraphContextBlock() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    RegisterClass("FlowGraphContextBlock" /* FlowGraphBlockNames.Context */, FlowGraphContextBlock);
}
//# sourceMappingURL=flowGraphContextBlock.pure.js.map