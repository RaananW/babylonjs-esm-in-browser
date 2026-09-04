/** This file must only contain pure code and pure imports */
import { FlowGraphBlock } from "../../flowGraphBlock.js";
import { RegisterClass } from "../../../Misc/typeStore.js";
import { RichTypeBoolean, RichTypeString } from "../../flowGraphRichTypes.pure.js";
/**
 * A data block that outputs whether a specific keyboard key is currently pressed,
 * optionally requiring one or more modifier keys to also be held.
 *
 * This block queries the scene event coordinator's `pressedKeys` set,
 * which is updated in real-time by the keyboard observers. It is designed
 * to be polled every frame (e.g. from a Scene Tick event chain) but can
 * also be read on demand from any execution context.
 *
 * The `key` input uses `KeyboardEvent.code` values (e.g. "KeyA", "Space",
 * "ShiftLeft", "ControlLeft", "AltLeft", "MetaLeft" for Mac Cmd).
 *
 * Modifier inputs (`withShift`, `withCtrl`, `withAlt`, `withMeta`,
 * `withCommandOrCtrl`) default to false. Set any to true to require that
 * modifier to also be held for `isPressed` to be true.
 * For example, key = "KeyA" + withCommandOrCtrl = true checks for
 * Cmd+A on macOS or Ctrl+A on Windows/Linux.
 */
export class FlowGraphIsKeyPressedBlock extends FlowGraphBlock {
    /**
     * Creates a new FlowGraphIsKeyPressedBlock.
     * @param config optional configuration
     */
    constructor(config) {
        super(config);
        this.key = this.registerDataInput("key", RichTypeString);
        this.withShift = this.registerDataInput("withShift", RichTypeBoolean);
        this.withCtrl = this.registerDataInput("withCtrl", RichTypeBoolean);
        this.withAlt = this.registerDataInput("withAlt", RichTypeBoolean);
        this.withMeta = this.registerDataInput("withMeta", RichTypeBoolean);
        this.withCommandOrCtrl = this.registerDataInput("withCommandOrCtrl", RichTypeBoolean);
        this.isPressed = this.registerDataOutput("isPressed", RichTypeBoolean);
    }
    /** @internal */
    _updateOutputs(context) {
        const coordinator = context.configuration.sceneEventCoordinator;
        if (!coordinator) {
            this.isPressed.setValue(false, context);
            return;
        }
        const keys = coordinator.pressedKeys;
        const keyCode = this.key.getValue(context);
        // Primary key must be held (unless empty, in which case only modifiers are checked)
        let pressed = keyCode ? keys.has(keyCode) : true;
        // Check required modifiers
        if (pressed && this.withShift.getValue(context)) {
            pressed = keys.has("ShiftLeft") || keys.has("ShiftRight");
        }
        if (pressed && this.withCtrl.getValue(context)) {
            pressed = keys.has("ControlLeft") || keys.has("ControlRight");
        }
        if (pressed && this.withAlt.getValue(context)) {
            pressed = keys.has("AltLeft") || keys.has("AltRight");
        }
        if (pressed && this.withMeta.getValue(context)) {
            pressed = keys.has("MetaLeft") || keys.has("MetaRight");
        }
        if (pressed && this.withCommandOrCtrl.getValue(context)) {
            pressed = keys.has("CommandOrControl");
        }
        this.isPressed.setValue(pressed, context);
    }
    /**
     * @returns class name of the block.
     */
    getClassName() {
        return "FlowGraphIsKeyPressedBlock" /* FlowGraphBlockNames.IsKeyPressed */;
    }
}
let _Registered = false;
/**
 * Registers the FlowGraphIsKeyPressedBlock class.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterFlowGraphIsKeyPressedBlock() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    RegisterClass("FlowGraphIsKeyPressedBlock" /* FlowGraphBlockNames.IsKeyPressed */, FlowGraphIsKeyPressedBlock);
}
//# sourceMappingURL=flowGraphIsKeyPressedBlock.pure.js.map