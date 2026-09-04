import { AbstractAudioBus } from "./abstractAudioBus.js";
/**
 * Abstract class representing a main audio bus.
 *
 * Main audio buses are the last bus in the audio graph.
 *
 * Unlike {@link AudioBus} instances, `MainAudioBus` instances have no spatial audio and stereo output capabilities,
 * and they cannot be connected downstream to another audio bus. They only connect downstream to the audio engine's
 * main output.
 *
 * Main audio buses are created by the {@link CreateMainAudioBusAsync} function.
 */
export class MainAudioBus extends AbstractAudioBus {
    constructor(name, engine) {
        super(name, engine);
    }
}
//# sourceMappingURL=mainAudioBus.js.map