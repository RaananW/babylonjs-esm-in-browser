/** This file must only contain pure code and pure imports */
import { RegisterClass } from "../../../Misc/typeStore.js";
import { RichTypeBoolean } from "../../flowGraphRichTypes.pure.js";
import { FlowGraphKeyboardEventBlock } from "./flowGraphKeyboardEventBlock.js";
/**
 * A keyboard event block that fires when a key is pressed down.
 * Extends {@link FlowGraphKeyboardEventBlock} with an `isRepeat` output
 * and an `ignoreRepeat` configuration option.
 */
export class FlowGraphKeyDownEventBlock extends FlowGraphKeyboardEventBlock {
    /**
     * Creates a new FlowGraphKeyDownEventBlock.
     * @param config optional configuration
     */
    constructor(config) {
        super(config);
        /** @internal */
        this.type = "KeyDown" /* FlowGraphEventType.KeyDown */;
        this.isRepeat = this.registerDataOutput("isRepeat", RichTypeBoolean);
    }
    /** @internal */
    _executeEvent(context, keyboardInfo) {
        const repeat = keyboardInfo.event.repeat ?? false;
        // Skip auto-repeat events when configured to do so.
        if (repeat && this.config?.ignoreRepeat) {
            return true;
        }
        // Set the repeat output before delegating to the base class,
        // which calls _execute() and fires signals — downstream blocks
        // must see the correct value during that execution chain.
        this.isRepeat.setValue(repeat, context);
        // Delegate to the base class for key filtering, output population, and execution.
        return super._executeEvent(context, keyboardInfo);
    }
    /**
     * @returns class name of the block.
     */
    getClassName() {
        return "FlowGraphKeyDownEventBlock" /* FlowGraphBlockNames.KeyDownEvent */;
    }
}
let _Registered = false;
/**
 * Registers the FlowGraphKeyDownEventBlock class.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterFlowGraphKeyDownEventBlock() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    RegisterClass("FlowGraphKeyDownEventBlock" /* FlowGraphBlockNames.KeyDownEvent */, FlowGraphKeyDownEventBlock);
}
//# sourceMappingURL=flowGraphKeyDownEventBlock.pure.js.map