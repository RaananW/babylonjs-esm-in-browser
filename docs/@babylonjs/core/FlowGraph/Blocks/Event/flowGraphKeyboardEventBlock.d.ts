import { FlowGraphEventBlock } from "../../flowGraphEventBlock.js";
import { type KeyboardInfo } from "../../../Events/keyboardEvents.js";
import { type FlowGraphContext } from "../../flowGraphContext.js";
import { type IFlowGraphBlockConfiguration } from "../../flowGraphBlock.js";
import { type FlowGraphDataConnection } from "../../flowGraphDataConnection.js";
/**
 * Configuration for keyboard event blocks.
 */
export interface IFlowGraphKeyboardEventBlockConfiguration extends IFlowGraphBlockConfiguration {
    /**
     * When true, prevent the event from propagating to other listeners.
     */
    stopPropagation?: boolean;
}
/**
 * Shared base class for keyboard event blocks (KeyDown / KeyUp).
 *
 * Provides a `key` input filter, output data connections for the key code,
 * key string, modifier states, and a platform-aware `commandOrCtrl` flag.
 * Subclasses only need to set their event type and class name.
 */
export declare abstract class FlowGraphKeyboardEventBlock extends FlowGraphEventBlock {
    /**
     * Input connection: optional key code to filter on (e.g. "KeyA", "Space", "ShiftLeft").
     * Uses `KeyboardEvent.code` values. Leave empty / disconnected to fire on any key event.
     */
    readonly key: FlowGraphDataConnection<string>;
    /**
     * Output connection: the `KeyboardEvent.code` of the key.
     */
    readonly keyCode: FlowGraphDataConnection<string>;
    /**
     * Output connection: the `KeyboardEvent.key` string (printable character or key name).
     */
    readonly keyValue: FlowGraphDataConnection<string>;
    /**
     * Output connection: whether the Shift key was held.
     */
    readonly shiftKey: FlowGraphDataConnection<boolean>;
    /**
     * Output connection: whether the Ctrl key was held.
     */
    readonly ctrlKey: FlowGraphDataConnection<boolean>;
    /**
     * Output connection: whether the Alt key (Option on macOS) was held.
     */
    readonly altKey: FlowGraphDataConnection<boolean>;
    /**
     * Output connection: whether the Meta key (Windows / Cmd) was held.
     */
    readonly metaKey: FlowGraphDataConnection<boolean>;
    /**
     * Output connection: platform-aware "command or control" modifier.
     * True when Meta (Cmd) is held on macOS, or Ctrl is held on Windows/Linux.
     */
    readonly commandOrCtrl: FlowGraphDataConnection<boolean>;
    protected constructor(config?: IFlowGraphKeyboardEventBlockConfiguration);
    /** @internal */
    _executeEvent(context: FlowGraphContext, keyboardInfo: KeyboardInfo): boolean;
    /** @internal */
    _preparePendingTasks(_context: FlowGraphContext): void;
    /** @internal */
    _cancelPendingTasks(_context: FlowGraphContext): void;
}
