/** This file must only contain pure code and pure imports */
import { FlowGraphExecutionBlockWithOutSignal } from "../../../flowGraphExecutionBlockWithOutSignal.js";
import { RichTypeAny } from "../../../flowGraphRichTypes.pure.js";
import { RegisterClass } from "../../../../Misc/typeStore.js";
/**
 * @experimental
 * A block that pauses an Audio V2 sound. If the sound is already paused, resumes it.
 */
export class FlowGraphPauseSoundBlock extends FlowGraphExecutionBlockWithOutSignal {
    /**
     * Constructs a new FlowGraphPauseSoundBlock.
     * @param config - optional configuration for the block
     */
    constructor(config) {
        super(config);
        this.sound = this.registerDataInput("sound", RichTypeAny);
    }
    /**
     * @internal
     */
    _execute(context, _callingSignal) {
        const soundValue = this.sound.getValue(context);
        if (!soundValue) {
            this._reportError(context, "No sound provided");
            this.out._activateSignal(context);
            return;
        }
        if (soundValue.state === 5 /* SoundState.Paused */) {
            soundValue.resume();
        }
        else if (soundValue.state === 2 /* SoundState.Starting */ || soundValue.state === 3 /* SoundState.Started */) {
            soundValue.pause();
        }
        this.out._activateSignal(context);
    }
    /**
     * @returns class name of the block.
     */
    getClassName() {
        return "FlowGraphPauseSoundBlock" /* FlowGraphBlockNames.AudioPauseSound */;
    }
}
let _Registered = false;
/**
 * Register side effects for flowGraphPauseSoundBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterFlowGraphPauseSoundBlock() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    RegisterClass("FlowGraphPauseSoundBlock" /* FlowGraphBlockNames.AudioPauseSound */, FlowGraphPauseSoundBlock);
}
//# sourceMappingURL=flowGraphPauseSoundBlock.pure.js.map