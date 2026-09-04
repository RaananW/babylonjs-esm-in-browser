/** This file must only contain pure code and pure imports */
import { FlowGraphExecutionBlockWithOutSignal } from "../../../flowGraphExecutionBlockWithOutSignal.js";
import { RichTypeAny } from "../../../flowGraphRichTypes.pure.js";
import { RegisterClass } from "../../../../Misc/typeStore.js";
/**
 * @experimental
 * A block that stops an Audio V2 sound.
 */
export class FlowGraphStopSoundBlock extends FlowGraphExecutionBlockWithOutSignal {
    /**
     * Constructs a new FlowGraphStopSoundBlock.
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
        soundValue.stop();
        this.out._activateSignal(context);
    }
    /**
     * @returns class name of the block.
     */
    getClassName() {
        return "FlowGraphStopSoundBlock" /* FlowGraphBlockNames.AudioStopSound */;
    }
}
let _Registered = false;
/**
 * Register side effects for flowGraphStopSoundBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterFlowGraphStopSoundBlock() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    RegisterClass("FlowGraphStopSoundBlock" /* FlowGraphBlockNames.AudioStopSound */, FlowGraphStopSoundBlock);
}
//# sourceMappingURL=flowGraphStopSoundBlock.pure.js.map