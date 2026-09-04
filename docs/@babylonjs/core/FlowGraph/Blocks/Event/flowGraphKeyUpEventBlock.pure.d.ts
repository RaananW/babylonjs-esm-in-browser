/** This file must only contain pure code and pure imports */
import { FlowGraphEventType } from "../../flowGraphEventType.js";
import { FlowGraphKeyboardEventBlock, type IFlowGraphKeyboardEventBlockConfiguration } from "./flowGraphKeyboardEventBlock.js";
/**
 * A keyboard event block that fires when a key is released.
 * Inherits all inputs/outputs from {@link FlowGraphKeyboardEventBlock}.
 */
export declare class FlowGraphKeyUpEventBlock extends FlowGraphKeyboardEventBlock {
    /** @internal */
    readonly type: FlowGraphEventType;
    /**
     * Creates a new FlowGraphKeyUpEventBlock.
     * @param config optional configuration
     */
    constructor(config?: IFlowGraphKeyboardEventBlockConfiguration);
    /**
     * @returns class name of the block.
     */
    getClassName(): string;
}
/**
 * Registers the FlowGraphKeyUpEventBlock class.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterFlowGraphKeyUpEventBlock(): void;
