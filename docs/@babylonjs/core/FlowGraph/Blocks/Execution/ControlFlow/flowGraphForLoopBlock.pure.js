/** This file must only contain pure code and pure imports */
import { FlowGraphExecutionBlockWithOutSignal } from "../../../flowGraphExecutionBlockWithOutSignal.js";
import { RichTypeAny, RichTypeFlowGraphInteger, RichTypeNumber } from "../../../flowGraphRichTypes.pure.js";
import { getNumericValue } from "../../../utils.js";
import { FlowGraphInteger } from "../../../CustomTypes/flowGraphInteger.pure.js";
import { Logger } from "../../../../Misc/logger.js";
import { RegisterClass } from "../../../../Misc/typeStore.js";
/**
 * Block that executes an action in a loop.
 */
export class FlowGraphForLoopBlock extends FlowGraphExecutionBlockWithOutSignal {
    constructor(config) {
        super(config);
        this.startIndex = this.registerDataInput("startIndex", RichTypeAny, 0);
        this.endIndex = this.registerDataInput("endIndex", RichTypeAny);
        this.step = this.registerDataInput("step", RichTypeNumber, 1);
        this.index = this.registerDataOutput("index", RichTypeFlowGraphInteger, new FlowGraphInteger(getNumericValue(config?.initialIndex ?? 0)));
        this.executionFlow = this._registerSignalOutput("executionFlow");
        this.completed = this._registerSignalOutput("completed");
        this._unregisterSignalOutput("out");
    }
    /**
     * @internal
     */
    _execute(context) {
        const index = getNumericValue(this.startIndex.getValue(context));
        const step = this.step.getValue(context);
        let endIndex = getNumericValue(this.endIndex.getValue(context));
        // Per-block override of the runaway-loop guard, falling back to the process-wide default.
        const maxIterations = this.config?.maxLoopIterations ?? FlowGraphForLoopBlock.MaxLoopIterations;
        let iterations = 0;
        let truncated = false;
        for (let i = index; i < endIndex; i += step) {
            this.index.setValue(new FlowGraphInteger(i), context);
            this.executionFlow._activateSignal(context);
            endIndex = getNumericValue(this.endIndex.getValue(context));
            // Safety net against runaway loops. The cap counts iterations (not the index value) so it
            // behaves correctly regardless of startIndex/step.
            if (++iterations >= maxIterations) {
                truncated = true;
                break;
            }
        }
        if (truncated) {
            // The loop hit its safety cap before its range completed, so the outputs below are for a
            // truncated run, not a natural finish. Warn so a genuinely runaway asset is diagnosable
            // rather than silently producing wrong numbers (the completed signal still fires, and
            // incrementIndexWhenLoopDone will not land on endIndex).
            Logger.Warn(`FlowGraphForLoopBlock: loop stopped after reaching the ${maxIterations}-iteration safety cap before its range completed.`);
        }
        if (this.config?.incrementIndexWhenLoopDone) {
            this.index.setValue(new FlowGraphInteger(getNumericValue(this.index.getValue(context)) + step), context);
        }
        this.completed._activateSignal(context);
    }
    /**
     * @returns class name of the block.
     */
    getClassName() {
        return "FlowGraphForLoopBlock" /* FlowGraphBlockNames.ForLoop */;
    }
}
/**
 * The default maximum number of iterations allowed for the loop, used as a safety net against
 * runaway loops. Kept conservative so a runaway loop is caught before it can freeze the tab.
 * A single graph that legitimately needs more iterations should set the per-block
 * {@link IFlowGraphForLoopBlockConfiguration.maxLoopIterations} rather than raising this
 * process-wide default that every other FlowGraph relies on.
 */
FlowGraphForLoopBlock.MaxLoopIterations = 1000;
let _Registered = false;
/**
 * Register side effects for flowGraphForLoopBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterFlowGraphForLoopBlock() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    RegisterClass("FlowGraphForLoopBlock" /* FlowGraphBlockNames.ForLoop */, FlowGraphForLoopBlock);
}
//# sourceMappingURL=flowGraphForLoopBlock.pure.js.map