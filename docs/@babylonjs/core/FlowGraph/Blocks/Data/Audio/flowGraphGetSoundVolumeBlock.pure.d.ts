/** This file must only contain pure code and pure imports */
import { type IFlowGraphBlockConfiguration } from "../../../flowGraphBlock.js";
import { type FlowGraphContext } from "../../../flowGraphContext.js";
import { type FlowGraphDataConnection } from "../../../flowGraphDataConnection.pure.js";
import { FlowGraphCachedOperationBlock } from "../flowGraphCachedOperationBlock.js";
import { type AbstractSound } from "../../../../AudioV2/abstractAudio/abstractSound.js";
/**
 * @experimental
 * A data block that reads the current volume of an Audio V2 sound.
 */
export declare class FlowGraphGetSoundVolumeBlock extends FlowGraphCachedOperationBlock<number> {
    /**
     * Input connection: The sound to read the volume from.
     */
    readonly sound: FlowGraphDataConnection<AbstractSound>;
    /**
     * Constructs a new FlowGraphGetSoundVolumeBlock.
     * @param config - optional configuration for the block
     */
    constructor(config?: IFlowGraphBlockConfiguration);
    /**
     * @internal
     */
    _doOperation(context: FlowGraphContext): number | undefined;
    /**
     * @returns class name of the block.
     */
    getClassName(): string;
}
/**
 * Register side effects for flowGraphGetSoundVolumeBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterFlowGraphGetSoundVolumeBlock(): void;
