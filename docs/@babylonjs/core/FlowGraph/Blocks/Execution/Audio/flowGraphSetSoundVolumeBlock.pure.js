/** This file must only contain pure code and pure imports */
import { FlowGraphExecutionBlockWithOutSignal } from "../../../flowGraphExecutionBlockWithOutSignal.js";
import { RichTypeAny, RichTypeNumber } from "../../../flowGraphRichTypes.pure.js";
import { RegisterClass } from "../../../../Misc/typeStore.js";
/**
 * @experimental
 * A block that sets the volume of an Audio V2 sound.
 */
export class FlowGraphSetSoundVolumeBlock extends FlowGraphExecutionBlockWithOutSignal {
    /**
     * Constructs a new FlowGraphSetSoundVolumeBlock.
     * @param config - optional configuration for the block
     */
    constructor(config) {
        super(config);
        this.sound = this.registerDataInput("sound", RichTypeAny);
        this.volume = this.registerDataInput("volume", RichTypeNumber, 1);
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
        const vol = this.volume.getValue(context);
        soundValue.volume = vol;
        this.out._activateSignal(context);
    }
    /**
     * @returns class name of the block.
     */
    getClassName() {
        return "FlowGraphSetSoundVolumeBlock" /* FlowGraphBlockNames.AudioSetVolume */;
    }
}
let _Registered = false;
/**
 * Register side effects for flowGraphSetSoundVolumeBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterFlowGraphSetSoundVolumeBlock() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    RegisterClass("FlowGraphSetSoundVolumeBlock" /* FlowGraphBlockNames.AudioSetVolume */, FlowGraphSetSoundVolumeBlock);
}
//# sourceMappingURL=flowGraphSetSoundVolumeBlock.pure.js.map