/** This file must only contain pure code and pure imports */
import { type FlowGraphContext } from "../../../flowGraphContext.js";
import { type FlowGraphDataConnection } from "../../../flowGraphDataConnection.pure.js";
import { FlowGraphExecutionBlockWithOutSignal } from "../../../flowGraphExecutionBlockWithOutSignal.js";
import { type FlowGraphSignalConnection } from "../../../flowGraphSignalConnection.pure.js";
import { type IFlowGraphBlockConfiguration } from "../../../flowGraphBlock.js";
import { type AbstractSound } from "../../../../AudioV2/abstractAudio/abstractSound.js";
/**
 * @experimental
 * A block that stops an Audio V2 sound.
 */
export declare class FlowGraphStopSoundBlock extends FlowGraphExecutionBlockWithOutSignal {
    /**
     * Input connection: The sound to stop.
     */
    readonly sound: FlowGraphDataConnection<AbstractSound>;
    /**
     * Constructs a new FlowGraphStopSoundBlock.
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
 * Register side effects for flowGraphStopSoundBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterFlowGraphStopSoundBlock(): void;
