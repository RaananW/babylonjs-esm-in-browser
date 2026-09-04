/** This file must only contain pure code and pure imports */
import { RichTypeAny, RichTypeNumber } from "../../../flowGraphRichTypes.pure.js";
import { FlowGraphCachedOperationBlock } from "../flowGraphCachedOperationBlock.js";
import { RegisterClass } from "../../../../Misc/typeStore.js";
/**
 * @experimental
 * A data block that reads the current volume of an Audio V2 sound.
 */
export class FlowGraphGetSoundVolumeBlock extends FlowGraphCachedOperationBlock {
    /**
     * Constructs a new FlowGraphGetSoundVolumeBlock.
     * @param config - optional configuration for the block
     */
    constructor(config) {
        super(RichTypeNumber, config);
        this.sound = this.registerDataInput("sound", RichTypeAny);
    }
    /**
     * @internal
     */
    _doOperation(context) {
        const soundValue = this.sound.getValue(context);
        if (!soundValue) {
            return undefined;
        }
        return soundValue.volume;
    }
    /**
     * @returns class name of the block.
     */
    getClassName() {
        return "FlowGraphGetSoundVolumeBlock" /* FlowGraphBlockNames.AudioGetVolume */;
    }
}
let _Registered = false;
/**
 * Register side effects for flowGraphGetSoundVolumeBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterFlowGraphGetSoundVolumeBlock() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    RegisterClass("FlowGraphGetSoundVolumeBlock" /* FlowGraphBlockNames.AudioGetVolume */, FlowGraphGetSoundVolumeBlock);
}
//# sourceMappingURL=flowGraphGetSoundVolumeBlock.pure.js.map