/** This file must only contain pure code and pure imports */
import { FlowGraphExecutionBlockWithOutSignal } from "../../../flowGraphExecutionBlockWithOutSignal.js";
import { RichTypeAny, RichTypeBoolean, RichTypeNumber } from "../../../flowGraphRichTypes.pure.js";
import { RegisterClass } from "../../../../Misc/typeStore.js";
/**
 * @experimental
 * A block that plays an Audio V2 sound.
 */
export class FlowGraphPlaySoundBlock extends FlowGraphExecutionBlockWithOutSignal {
    /**
     * Constructs a new FlowGraphPlaySoundBlock.
     * @param config - optional configuration for the block
     */
    constructor(config) {
        super(config);
        this.sound = this.registerDataInput("sound", RichTypeAny);
        this.volume = this.registerDataInput("volume", RichTypeNumber, 1);
        this.startOffset = this.registerDataInput("startOffset", RichTypeNumber, 0);
        this.loop = this.registerDataInput("loop", RichTypeBoolean, false);
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
        const offset = this.startOffset.getValue(context);
        const loopVal = this.loop.getValue(context);
        soundValue.play({ volume: vol, startOffset: offset, loop: loopVal });
        this.out._activateSignal(context);
    }
    /**
     * @returns class name of the block.
     */
    getClassName() {
        return "FlowGraphPlaySoundBlock" /* FlowGraphBlockNames.AudioPlaySound */;
    }
}
let _Registered = false;
/**
 * Register side effects for flowGraphPlaySoundBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterFlowGraphPlaySoundBlock() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    RegisterClass("FlowGraphPlaySoundBlock" /* FlowGraphBlockNames.AudioPlaySound */, FlowGraphPlaySoundBlock);
}
//# sourceMappingURL=flowGraphPlaySoundBlock.pure.js.map