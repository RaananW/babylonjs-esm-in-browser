/** This file must only contain pure code and pure imports */
import { type FlowGraphContext } from "../../../flowGraphContext.js";
import { type FlowGraphDataConnection } from "../../../flowGraphDataConnection.pure.js";
import { FlowGraphExecutionBlockWithOutSignal } from "../../../flowGraphExecutionBlockWithOutSignal.js";
import { type FlowGraphSignalConnection } from "../../../flowGraphSignalConnection.pure.js";
import { type IFlowGraphBlockConfiguration } from "../../../flowGraphBlock.js";
import { type AbstractSound } from "../../../../AudioV2/abstractAudio/abstractSound.js";
/**
 * @experimental
 * A block that plays an Audio V2 sound.
 */
export declare class FlowGraphPlaySoundBlock extends FlowGraphExecutionBlockWithOutSignal {
    /**
     * Input connection: The sound to play.
     */
    readonly sound: FlowGraphDataConnection<AbstractSound>;
    /**
     * Input connection: The volume to play at (0–1). Defaults to 1.
     */
    readonly volume: FlowGraphDataConnection<number>;
    /**
     * Input connection: The time offset in seconds to start playback from. Defaults to 0.
     */
    readonly startOffset: FlowGraphDataConnection<number>;
    /**
     * Input connection: Whether the sound should loop. Defaults to false.
     */
    readonly loop: FlowGraphDataConnection<boolean>;
    /**
     * Constructs a new FlowGraphPlaySoundBlock.
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
 * Register side effects for flowGraphPlaySoundBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterFlowGraphPlaySoundBlock(): void;
