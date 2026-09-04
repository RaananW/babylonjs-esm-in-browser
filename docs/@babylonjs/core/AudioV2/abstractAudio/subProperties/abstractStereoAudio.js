export const _StereoAudioDefaults = {
    pan: 0,
};
/**
 * @param options The stereo audio options to check.
 * @returns `true` if stereo audio options are defined, otherwise `false`.
 */
export function _HasStereoAudioOptions(options) {
    return options.stereoEnabled || options.stereoPan !== undefined;
}
/**
 * Abstract class representing the `stereo` audio property on a sound or audio bus.
 *
 * @see {@link AudioEngineV2.listener}
 */
export class AbstractStereoAudio {
}
//# sourceMappingURL=abstractStereoAudio.js.map