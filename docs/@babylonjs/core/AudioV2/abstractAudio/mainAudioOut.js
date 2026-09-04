import { AbstractAudioNode } from "./abstractAudioNode.js";
/**
 * Abstract class for the main audio output node.
 *
 * A main audio output is the last audio node in the audio graph before the audio is sent to the speakers.
 *
 * @see {@link AudioEngineV2.mainOut}
 * @internal
 */
export class _MainAudioOut extends AbstractAudioNode {
    constructor(engine) {
        super(engine, 1 /* AudioNodeType.HAS_INPUTS */);
    }
}
//# sourceMappingURL=mainAudioOut.js.map