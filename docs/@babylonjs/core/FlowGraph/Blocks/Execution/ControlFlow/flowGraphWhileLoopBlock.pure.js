/** This file must only contain pure code and pure imports */
import { RichTypeBoolean } from "../../../flowGraphRichTypes.pure.js";
import { FlowGraphExecutionBlockWithOutSignal } from "../../../flowGraphExecutionBlockWithOutSignal.js";
import { Logger } from "../../../../Misc/logger.js";
import { RegisterClass } from "../../../../Misc/typeStore.js";
/**
 * A block that executes a branch while a condition is true.
 */
export class FlowGraphWhileLoopBlock extends FlowGraphExecutionBlockWithOutSignal {
    constructor(
    /**
     * the configuration of the block
     */
    config) {
        super(config);
        this.config = config;
        this.condition = this.registerDataInput("condition", RichTypeBoolean);
        this.executionFlow = this._registerSignalOutput("executionFlow");
        this.completed = this._registerSignalOutput("completed");
        // unregister "out" signal
        this._unregisterSignalOutput("out");
    }
    _execute(context, _callingSignal) {
        let conditionValue = this.condition.getValue(context);
        if (this.config?.doWhile && !conditionValue) {
            this.executionFlow._activateSignal(context);
        }
        let i = 0;
        while (conditionValue) {
            this.executionFlow._activateSignal(context);
            ++i;
            if (i >= FlowGraphWhileLoopBlock.MaxLoopCount) {
                Logger.Warn("FlowGraphWhileLoopBlock: Max loop count reached. Breaking.");
                break;
            }
            conditionValue = this.condition.getValue(context);
        }
        // out is not triggered - completed is triggered
        this.completed._activateSignal(context);
    }
    getClassName() {
        return "FlowGraphWhileLoopBlock" /* FlowGraphBlockNames.WhileLoop */;
    }
}
/**
 * The maximum number of iterations allowed in a loop.
 * This can be set to avoid an infinite loop.
 */
FlowGraphWhileLoopBlock.MaxLoopCount = 1000;
let _Registered = false;
/**
 * Register side effects for flowGraphWhileLoopBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterFlowGraphWhileLoopBlock() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    RegisterClass("FlowGraphWhileLoopBlock" /* FlowGraphBlockNames.WhileLoop */, FlowGraphWhileLoopBlock);
}
//# sourceMappingURL=flowGraphWhileLoopBlock.pure.js.map