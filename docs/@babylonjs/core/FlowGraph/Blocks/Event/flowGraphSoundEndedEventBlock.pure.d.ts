/** This file must only contain pure code and pure imports */
import { FlowGraphEventBlock } from "../../flowGraphEventBlock.js";
import { type FlowGraphContext } from "../../flowGraphContext.js";
import { type IFlowGraphBlockConfiguration } from "../../flowGraphBlock.js";
import { type FlowGraphDataConnection } from "../../flowGraphDataConnection.pure.js";
import { type AbstractSound } from "../../../AudioV2/abstractAudio/abstractSound.js";
/**
 * @experimental
 * An event block that fires when an Audio V2 sound stops or ends.
 * Subscribes to the sound's onEndedObservable, which fires when playback
 * stops for any reason (natural completion or a manual call to stop()).
 * Does not fire when a looping sound naturally restarts, but will still
 * fire if a looping sound is explicitly stopped.
 */
export declare class FlowGraphSoundEndedEventBlock extends FlowGraphEventBlock {
    /**
     * Input connection: The sound to monitor for when playback stops or ends.
     */
    readonly sound: FlowGraphDataConnection<AbstractSound>;
    /**
     * Constructs a new FlowGraphSoundEndedEventBlock.
     * @param config - optional configuration for the block
     */
    constructor(config?: IFlowGraphBlockConfiguration);
    /**
     * @internal
     */
    _preparePendingTasks(context: FlowGraphContext): void;
    /**
     * @internal
     */
    _executeEvent(_context: FlowGraphContext, _payload: any): boolean;
    /**
     * @internal
     */
    _cancelPendingTasks(context: FlowGraphContext): void;
    /**
     * @returns class name of the block.
     */
    getClassName(): string;
}
/**
 * Register side effects for flowGraphSoundEndedEventBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterFlowGraphSoundEndedEventBlock(): void;
