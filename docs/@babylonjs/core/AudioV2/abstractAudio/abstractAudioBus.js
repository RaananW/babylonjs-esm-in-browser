import { AbstractAudioOutNode } from "./abstractAudioOutNode.js";
/**
 * Abstract class representing an audio bus with volume control.
 *
 * An audio bus is a node in the audio graph that can have multiple inputs and outputs. It is typically used to group
 * sounds together and apply effects to them.
 */
export class AbstractAudioBus extends AbstractAudioOutNode {
    constructor(name, engine) {
        super(name, engine, 3 /* AudioNodeType.HAS_INPUTS_AND_OUTPUTS */);
    }
}
//# sourceMappingURL=abstractAudioBus.js.map