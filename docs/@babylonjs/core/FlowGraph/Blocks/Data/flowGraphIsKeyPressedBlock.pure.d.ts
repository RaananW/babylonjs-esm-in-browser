/** This file must only contain pure code and pure imports */
import { FlowGraphBlock, type IFlowGraphBlockConfiguration } from "../../flowGraphBlock.js";
import { type FlowGraphContext } from "../../flowGraphContext.js";
import { type FlowGraphDataConnection } from "../../flowGraphDataConnection.pure.js";
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
export declare class FlowGraphIsKeyPressedBlock extends FlowGraphBlock {
    /**
     * Input connection: the `KeyboardEvent.code` of the key to check
     * (e.g. "KeyA", "Space", "ShiftLeft").
     */
    readonly key: FlowGraphDataConnection<string>;
    /**
     * Input connection: when true, Shift must also be held.
     */
    readonly withShift: FlowGraphDataConnection<boolean>;
    /**
     * Input connection: when true, Ctrl must also be held.
     */
    readonly withCtrl: FlowGraphDataConnection<boolean>;
    /**
     * Input connection: when true, Alt (Option on macOS) must also be held.
     */
    readonly withAlt: FlowGraphDataConnection<boolean>;
    /**
     * Input connection: when true, Meta (Win key / Cmd) must also be held.
     */
    readonly withMeta: FlowGraphDataConnection<boolean>;
    /**
     * Input connection: when true, the platform-appropriate "command" modifier
     * must also be held (Cmd on macOS, Ctrl on Windows/Linux).
     * This uses the virtual "CommandOrControl" key tracked by the coordinator.
     */
    readonly withCommandOrCtrl: FlowGraphDataConnection<boolean>;
    /**
     * Output connection: true if the key (and all required modifiers) are currently held down.
     */
    readonly isPressed: FlowGraphDataConnection<boolean>;
    /**
     * Creates a new FlowGraphIsKeyPressedBlock.
     * @param config optional configuration
     */
    constructor(config?: IFlowGraphBlockConfiguration);
    /** @internal */
    _updateOutputs(context: FlowGraphContext): void;
    /**
     * @returns class name of the block.
     */
    getClassName(): string;
}
/**
 * Registers the FlowGraphIsKeyPressedBlock class.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterFlowGraphIsKeyPressedBlock(): void;
