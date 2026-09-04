/** This file must only contain pure code and pure imports */
import { type FlowGraphContext } from "../../../flowGraphContext.js";
import { type FlowGraphDataConnection } from "../../../flowGraphDataConnection.pure.js";
import { FlowGraphExecutionBlockWithOutSignal } from "../../../flowGraphExecutionBlockWithOutSignal.js";
import { type FlowGraphSignalConnection } from "../../../flowGraphSignalConnection.pure.js";
import { type IFlowGraphBlockConfiguration } from "../../../flowGraphBlock.js";
import { type AbstractSound } from "../../../../AudioV2/abstractAudio/abstractSound.js";
/**
 * @experimental
 * A block that sets the volume of an Audio V2 sound.
 */
export declare class FlowGraphSetSoundVolumeBlock extends FlowGraphExecutionBlockWithOutSignal {
    /**
     * Input connection: The sound to set the volume on.
     */
    readonly sound: FlowGraphDataConnection<AbstractSound>;
    /**
     * Input connection: The target volume (0–1). Defaults to 1.
     */
    readonly volume: FlowGraphDataConnection<number>;
    /**
     * Constructs a new FlowGraphSetSoundVolumeBlock.
     * @param config - optional configuration for the block
     */
    constructor(config?: IFlowGraphBlockConfiguration);
    /**
     * @internal
     */
    _execute(context: FlowGraphContext, _callingSignal: FlowGraphSignalConnection): void;
    /**
     * @returns class name of the block.
     */
    getClassName(): string;
}
/**
 * Register side effects for flowGraphSetSoundVolumeBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterFlowGraphSetSoundVolumeBlock(): void;
