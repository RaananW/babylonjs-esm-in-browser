/** This file must only contain pure code and pure imports */
import { type KeyboardInfo } from "../../../Events/keyboardEvents.js";
import { type FlowGraphContext } from "../../flowGraphContext.js";
import { type FlowGraphDataConnection } from "../../flowGraphDataConnection.pure.js";
import { FlowGraphEventType } from "../../flowGraphEventType.js";
import { FlowGraphKeyboardEventBlock, type IFlowGraphKeyboardEventBlockConfiguration } from "./flowGraphKeyboardEventBlock.js";
/**
 * Configuration for the key down event block.
 */
export interface IFlowGraphKeyDownEventBlockConfiguration extends IFlowGraphKeyboardEventBlockConfiguration {
    /**
     * When true, auto-repeat key-down events (the user holding a key) are
     * ignored and only the initial press fires the block. Defaults to false.
     */
    ignoreRepeat?: boolean;
}
/**
 * A keyboard event block that fires when a key is pressed down.
 * Extends {@link FlowGraphKeyboardEventBlock} with an `isRepeat` output
 * and an `ignoreRepeat` configuration option.
 */
export declare class FlowGraphKeyDownEventBlock extends FlowGraphKeyboardEventBlock {
    /**
     * Output connection: whether this is an auto-repeat event (key held down).
     */
    readonly isRepeat: FlowGraphDataConnection<boolean>;
    /** @internal */
    readonly type: FlowGraphEventType;
    /**
     * Creates a new FlowGraphKeyDownEventBlock.
     * @param config optional configuration
     */
    constructor(config?: IFlowGraphKeyDownEventBlockConfiguration);
    /** @internal */
    _executeEvent(context: FlowGraphContext, keyboardInfo: KeyboardInfo): boolean;
    /**
     * @returns class name of the block.
     */
    getClassName(): string;
}
/**
 * Registers the FlowGraphKeyDownEventBlock class.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterFlowGraphKeyDownEventBlock(): void;
