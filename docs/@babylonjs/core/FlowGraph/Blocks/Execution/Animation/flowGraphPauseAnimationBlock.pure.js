/** This file must only contain pure code and pure imports */
import { FlowGraphExecutionBlockWithOutSignal } from "../../../flowGraphExecutionBlockWithOutSignal.js";
import { RichTypeAny } from "../../../flowGraphRichTypes.pure.js";
import { RegisterClass } from "../../../../Misc/typeStore.js";
/**
 * @experimental
 * Block that pauses a running animation
 */
export class FlowGraphPauseAnimationBlock extends FlowGraphExecutionBlockWithOutSignal {
    constructor(config) {
        super(config);
        this.animationToPause = this.registerDataInput("animationToPause", RichTypeAny);
    }
    _execute(context) {
        const animationToPauseValue = this.animationToPause.getValue(context);
        animationToPauseValue.pause();
        this.out._activateSignal(context);
    }
    /**
     * @returns class name of the block.
     */
    getClassName() {
        return "FlowGraphPauseAnimationBlock" /* FlowGraphBlockNames.PauseAnimation */;
    }
}
let _Registered = false;
/**
 * Register side effects for flowGraphPauseAnimationBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterFlowGraphPauseAnimationBlock() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    RegisterClass("FlowGraphPauseAnimationBlock" /* FlowGraphBlockNames.PauseAnimation */, FlowGraphPauseAnimationBlock);
}
//# sourceMappingURL=flowGraphPauseAnimationBlock.pure.js.map