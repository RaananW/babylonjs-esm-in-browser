import { FlowGraphEventBlock } from "../../flowGraphEventBlock.js";
import { RichTypeBoolean, RichTypeString } from "../../flowGraphRichTypes.pure.js";
import { _IsMacPlatform } from "../../utils.js";
/**
 * Shared base class for keyboard event blocks (KeyDown / KeyUp).
 *
 * Provides a `key` input filter, output data connections for the key code,
 * key string, modifier states, and a platform-aware `commandOrCtrl` flag.
 * Subclasses only need to set their event type and class name.
 */
export class FlowGraphKeyboardEventBlock extends FlowGraphEventBlock {
    constructor(config) {
        super(config);
        this.key = this.registerDataInput("key", RichTypeString);
        this.keyCode = this.registerDataOutput("keyCode", RichTypeString);
        this.keyValue = this.registerDataOutput("keyValue", RichTypeString);
        this.shiftKey = this.registerDataOutput("shiftKey", RichTypeBoolean);
        this.ctrlKey = this.registerDataOutput("ctrlKey", RichTypeBoolean);
        this.altKey = this.registerDataOutput("altKey", RichTypeBoolean);
        this.metaKey = this.registerDataOutput("metaKey", RichTypeBoolean);
        this.commandOrCtrl = this.registerDataOutput("commandOrCtrl", RichTypeBoolean);
    }
    /** @internal */
    _executeEvent(context, keyboardInfo) {
        const evt = keyboardInfo.event;
        const filterKey = this.key.getValue(context);
        // If a key filter is set, only fire when it matches.
        if (filterKey && filterKey !== evt.code) {
            return true;
        }
        this.keyCode.setValue(evt.code, context);
        this.keyValue.setValue(evt.key, context);
        this.shiftKey.setValue(evt.shiftKey, context);
        this.ctrlKey.setValue(evt.ctrlKey, context);
        this.altKey.setValue(evt.altKey, context);
        this.metaKey.setValue(evt.metaKey, context);
        this.commandOrCtrl.setValue(_IsMacPlatform ? evt.metaKey : evt.ctrlKey, context);
        this._execute(context);
        return !this.config?.stopPropagation;
    }
    /** @internal */
    _preparePendingTasks(_context) {
        // no-op
    }
    /** @internal */
    _cancelPendingTasks(_context) {
        // no-op
    }
}
//# sourceMappingURL=flowGraphKeyboardEventBlock.js.map