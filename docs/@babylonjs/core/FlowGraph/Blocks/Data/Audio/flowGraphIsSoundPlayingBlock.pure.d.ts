/** This file must only contain pure code and pure imports */
import { type IFlowGraphBlockConfiguration } from "../../../flowGraphBlock.js";
import { type FlowGraphContext } from "../../../flowGraphContext.js";
import { type FlowGraphDataConnection } from "../../../flowGraphDataConnection.pure.js";
import { FlowGraphCachedOperationBlock } from "../flowGraphCachedOperationBlock.js";
import { type AbstractSound } from "../../../../AudioV2/abstractAudio/abstractSound.js";
/**
 * @experimental
 * A data block that checks whether an Audio V2 sound is currently playing.
 */
export declare class FlowGraphIsSoundPlayingBlock extends FlowGraphCachedOperationBlock<boolean> {
    /**
     * Input connection: The sound to check.
     */
    readonly sound: FlowGraphDataConnection<AbstractSound>;
    /**
     * Constructs a new FlowGraphIsSoundPlayingBlock.
     * @param config - optional configuration for the block
     */
    constructor(config?: IFlowGraphBlockConfiguration);
    /**
     * @internal
     */
    _doOperation(context: FlowGraphContext): boolean | undefined;
    /**
     * @returns class name of the block.
     */
    getClassName(): string;
}
/**
 * Register side effects for flowGraphIsSoundPlayingBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterFlowGraphIsSoundPlayingBlock(): void;
