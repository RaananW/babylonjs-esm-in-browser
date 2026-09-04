import { Quaternion, Vector3 } from "../../../Maths/math.vector.pure.js";
export const _SpatialAudioDefaults = {
    coneInnerAngle: 6.28318530718,
    coneOuterAngle: 6.28318530718,
    coneOuterVolume: 0,
    distanceModel: "linear",
    maxDistance: 10000,
    minDistance: 1,
    orientation: Vector3.Right(),
    panningEnabled: true,
    panningModel: "equalpower",
    position: Vector3.Zero(),
    rolloffFactor: 1,
    rotation: Vector3.Zero(),
    rotationQuaternion: new Quaternion(),
};
/**
 * @param options The spatial audio options to check.
 * @returns `true` if spatial audio options are defined, otherwise `false`.
 */
export function _HasSpatialAudioOptions(options) {
    return (options.spatialEnabled ||
        options.spatialAutoUpdate !== undefined ||
        options.spatialConeInnerAngle !== undefined ||
        options.spatialConeOuterAngle !== undefined ||
        options.spatialConeOuterVolume !== undefined ||
        options.spatialDistanceModel !== undefined ||
        options.spatialMaxDistance !== undefined ||
        options.spatialMinDistance !== undefined ||
        options.spatialMinUpdateTime !== undefined ||
        options.spatialOrientation !== undefined ||
        options.spatialPanningEnabled !== undefined ||
        options.spatialPanningModel !== undefined ||
        options.spatialPosition !== undefined ||
        options.spatialRolloffFactor !== undefined ||
        options.spatialRotation !== undefined ||
        options.spatialRotationQuaternion !== undefined);
}
/**
 * Abstract class representing the `spatial` audio property on a sound or audio bus.
 *
 * @see {@link AudioEngineV2.listener}
 */
export class AbstractSpatialAudio {
}
//# sourceMappingURL=abstractSpatialAudio.js.map