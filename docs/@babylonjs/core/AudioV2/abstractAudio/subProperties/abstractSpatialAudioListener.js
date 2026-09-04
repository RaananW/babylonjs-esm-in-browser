import { Quaternion, Vector3 } from "../../../Maths/math.vector.pure.js";
export const _SpatialAudioListenerDefaults = {
    position: Vector3.Zero(),
    rotation: Vector3.Zero(),
    rotationQuaternion: new Quaternion(),
};
/**
 * @param options The spatial audio listener options to check.
 * @returns `true` if spatial audio listener options are defined, otherwise `false`.
 */
export function _HasSpatialAudioListenerOptions(options) {
    return (options.listenerEnabled ||
        options.listenerMinUpdateTime !== undefined ||
        options.listenerPosition !== undefined ||
        options.listenerRotation !== undefined ||
        options.listenerRotationQuaternion !== undefined);
}
/**
 * Abstract class representing the spatial audio `listener` property on an audio engine.
 *
 * @see {@link AudioEngineV2.listener}
 */
export class AbstractSpatialAudioListener {
}
//# sourceMappingURL=abstractSpatialAudioListener.js.map