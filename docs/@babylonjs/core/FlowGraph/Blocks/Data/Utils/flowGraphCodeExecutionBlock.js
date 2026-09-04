import { FlowGraphBlock } from "../../../flowGraphBlock.js";
import { RichTypeAny } from "../../../flowGraphRichTypes.pure.js";
/**
 * This block takes in a function that is defined OUTSIDE of the flow graph and executes it.
 * The function can be a normal function or an async function.
 * The function's arguments will be the value of the input connection as the first variable, and the flow graph context as the second variable.
 */
export class FlowGraphCodeExecutionBlock extends FlowGraphBlock {
    /**
     * Construct a FlowGraphCodeExecutionBlock.
     * @param config construction parameters
     */
    constructor(config) {
        super(config);
        this.config = config;
        this.executionFunction = this.registerDataInput("function", RichTypeAny);
        this.value = this.registerDataInput("value", RichTypeAny);
        this.result = this.registerDataOutput("result", RichTypeAny);
    }
    /**
     * @internal
     */
    _updateOutputs(context) {
        const func = this.executionFunction.getValue(context);
        const value = this.value.getValue(context);
        if (func) {
            this.result.setValue(func(value, context), context);
        }
    }
    getClassName() {
        return "FlowGraphCodeExecutionBlock" /* FlowGraphBlockNames.CodeExecution */;
    }
}
//# sourceMappingURL=flowGraphCodeExecutionBlock.js.map