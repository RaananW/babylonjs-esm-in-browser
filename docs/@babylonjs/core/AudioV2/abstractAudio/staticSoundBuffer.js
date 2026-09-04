let StaticSoundBufferId = 1;
/**
 * Abstract class representing a static sound buffer.
 *
 * A static sound buffer is a fully downloaded and decoded array of audio data that is ready to be played.
 *
 * Static sound buffers can be reused multiple times by different {@link StaticSound} instances.
 *
 * Static sound buffers are created by the {@link CreateSoundBufferAsync} function.
 *
 * @see {@link StaticSound.buffer}
 */
export class StaticSoundBuffer {
    constructor(engine) {
        /**
         * The name of the sound buffer.
         */
        this.name = `StaticSoundBuffer #${StaticSoundBufferId++}`;
        this.engine = engine;
    }
}
//# sourceMappingURL=staticSoundBuffer.js.map