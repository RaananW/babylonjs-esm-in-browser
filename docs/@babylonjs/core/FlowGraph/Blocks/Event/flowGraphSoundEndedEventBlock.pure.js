/** This file must only contain pure code and pure imports */
import { FlowGraphEventBlock } from "../../flowGraphEventBlock.js";
import { RichTypeAny } from "../../flowGraphRichTypes.pure.js";
import { RegisterClass } from "../../../Misc/typeStore.js";
/**
 * @experimental
 * An event block that fires when an Audio V2 sound stops or ends.
 * Subscribes to the sound's onEndedObservable, which fires when playback
 * stops for any reason (natural completion or a manual call to stop()).
 * Does not fire when a looping sound naturally restarts, but will still
 * fire if a looping sound is explicitly stopped.
 */
export class FlowGraphSoundEndedEventBlock extends FlowGraphEventBlock {
    /**
     * Constructs a new FlowGraphSoundEndedEventBlock.
     * @param config - optional configuration for the block
     */
    constructor(config) {
        super(config);
        this.sound = this.registerDataInput("sound", RichTypeAny);
    }
    /**
     * @internal
     */
    _preparePendingTasks(context) {
        const soundValue = this.sound.getValue(context);
        if (!soundValue) {
            this._reportError(context, "No sound provided for sound-ended event");
            return;
        }
        const observer = soundValue.onEndedObservable.add(() => {
            this._execute(context);
        });
        // Store observer and subscribed sound per-context for safe multi-context usage
        context._setExecutionVariable(this, "_soundEndedObserver", observer);
        context._setExecutionVariable(this, "_subscribedSound", soundValue);
    }
    /**
     * @internal
     */
    _executeEvent(_context, _payload) {
        // This block manages its own observable subscription, so the
        // central event coordinator does not dispatch to it.
        return true;
    }
    /**
     * @internal
     */
    _cancelPendingTasks(context) {
        const observer = context._getExecutionVariable(this, "_soundEndedObserver", null);
        const subscribedSound = context._getExecutionVariable(this, "_subscribedSound", null);
        if (observer && subscribedSound) {
            subscribedSound.onEndedObservable.remove(observer);
        }
        context._setExecutionVariable(this, "_soundEndedObserver", null);
        context._setExecutionVariable(this, "_subscribedSound", null);
    }
    /**
     * @returns class name of the block.
     */
    getClassName() {
        return "FlowGraphSoundEndedEventBlock" /* FlowGraphBlockNames.AudioSoundEndedEvent */;
    }
}
let _Registered = false;
/**
 * Register side effects for flowGraphSoundEndedEventBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterFlowGraphSoundEndedEventBlock() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    RegisterClass("FlowGraphSoundEndedEventBlock" /* FlowGraphBlockNames.AudioSoundEndedEvent */, FlowGraphSoundEndedEventBlock);
}
//# sourceMappingURL=flowGraphSoundEndedEventBlock.pure.js.map