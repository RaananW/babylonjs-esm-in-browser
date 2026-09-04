/** This file must only contain pure code and pure imports */
import { RichTypeAny, RichTypeBoolean } from "../../../flowGraphRichTypes.pure.js";
import { FlowGraphCachedOperationBlock } from "../flowGraphCachedOperationBlock.js";
import { RegisterClass } from "../../../../Misc/typeStore.js";
/**
 * @experimental
 * A data block that checks whether an Audio V2 sound is currently playing.
 */
export class FlowGraphIsSoundPlayingBlock extends FlowGraphCachedOperationBlock {
    /**
     * Constructs a new FlowGraphIsSoundPlayingBlock.
     * @param config - optional configuration for the block
     */
    constructor(config) {
        super(RichTypeBoolean, config);
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
        return soundValue.state === 3 /* SoundState.Started */ || soundValue.state === 2 /* SoundState.Starting */;
    }
    /**
     * @returns class name of the block.
     */
    getClassName() {
        return "FlowGraphIsSoundPlayingBlock" /* FlowGraphBlockNames.AudioIsSoundPlaying */;
    }
}
let _Registered = false;
/**
 * Register side effects for flowGraphIsSoundPlayingBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterFlowGraphIsSoundPlayingBlock() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    RegisterClass("FlowGraphIsSoundPlayingBlock" /* FlowGraphBlockNames.AudioIsSoundPlaying */, FlowGraphIsSoundPlayingBlock);
}
//# sourceMappingURL=flowGraphIsSoundPlayingBlock.pure.js.map