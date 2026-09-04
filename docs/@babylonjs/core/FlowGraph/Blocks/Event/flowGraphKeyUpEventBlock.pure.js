/** This file must only contain pure code and pure imports */
import { RegisterClass } from "../../../Misc/typeStore.js";
import { FlowGraphKeyboardEventBlock } from "./flowGraphKeyboardEventBlock.js";
/**
 * A keyboard event block that fires when a key is released.
 * Inherits all inputs/outputs from {@link FlowGraphKeyboardEventBlock}.
 */
export class FlowGraphKeyUpEventBlock extends FlowGraphKeyboardEventBlock {
    /**
     * Creates a new FlowGraphKeyUpEventBlock.
     * @param config optional configuration
     */
    constructor(config) {
        super(config);
        /** @internal */
        this.type = "KeyUp" /* FlowGraphEventType.KeyUp */;
    }
    /**
     * @returns class name of the block.
     */
    getClassName() {
        return "FlowGraphKeyUpEventBlock" /* FlowGraphBlockNames.KeyUpEvent */;
    }
}
let _Registered = false;
/**
 * Registers the FlowGraphKeyUpEventBlock class.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterFlowGraphKeyUpEventBlock() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    RegisterClass("FlowGraphKeyUpEventBlock" /* FlowGraphBlockNames.KeyUpEvent */, FlowGraphKeyUpEventBlock);
}
//# sourceMappingURL=flowGraphKeyUpEventBlock.pure.js.map