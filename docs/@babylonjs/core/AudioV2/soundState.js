/**
 * The state of a sound.
 */
export var SoundState;
(function (SoundState) {
    /**
     * The sound is waiting for its instances to stop.
     */
    SoundState[SoundState["Stopping"] = 0] = "Stopping";
    /**
     * The sound is stopped.
     */
    SoundState[SoundState["Stopped"] = 1] = "Stopped";
    /**
     * The sound is waiting for its instances to start.
     */
    SoundState[SoundState["Starting"] = 2] = "Starting";
    /**
     * The sound has started playing.
     */
    SoundState[SoundState["Started"] = 3] = "Started";
    /**
     * The sound failed to start, most likely due to the user not interacting with the page, yet.
     */
    SoundState[SoundState["FailedToStart"] = 4] = "FailedToStart";
    /**
     * The sound is paused.
     */
    SoundState[SoundState["Paused"] = 5] = "Paused";
})(SoundState || (SoundState = {}));
//# sourceMappingURL=soundState.js.map