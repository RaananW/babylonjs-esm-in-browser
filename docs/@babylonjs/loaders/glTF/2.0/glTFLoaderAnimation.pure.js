/** This file must only contain pure code and pure imports */
import { Animation } from "@babylonjs/core/Animations/animation.pure.js";
import { Quaternion, Vector3 } from "@babylonjs/core/Maths/math.vector.pure.js";
import { SetInterpolationForKey } from "./Extensions/objectModelMapping.js";
/** @internal */
// eslint-disable-next-line @typescript-eslint/naming-convention
export function getVector3(_target, source, offset, scale) {
    return Vector3.FromArray(source, offset).scaleInPlace(scale);
}
/** @internal */
// eslint-disable-next-line @typescript-eslint/naming-convention
export function getQuaternion(_target, source, offset, scale) {
    return Quaternion.FromArray(source, offset).scaleInPlace(scale);
}
/** @internal */
// eslint-disable-next-line @typescript-eslint/naming-convention
export function getWeights(target, source, offset, scale) {
    const value = new Array(target._numMorphTargets);
    for (let i = 0; i < value.length; i++) {
        value[i] = source[offset++] * scale;
    }
    return value;
}
/** @internal */
export class AnimationPropertyInfo {
    /** @internal */
    constructor(type, name, getValue, getStride) {
        this.type = type;
        this.name = name;
        this.getValue = getValue;
        this.getStride = getStride;
    }
    _buildAnimation(name, fps, keys) {
        const babylonAnimation = new Animation(name, this.name, fps, this.type);
        babylonAnimation.setKeys(keys, true);
        return babylonAnimation;
    }
}
/** @internal */
export class TransformNodeAnimationPropertyInfo extends AnimationPropertyInfo {
    /** @internal */
    buildAnimations(target, name, fps, keys) {
        const babylonAnimations = [];
        babylonAnimations.push({ babylonAnimatable: target._babylonTransformNode, babylonAnimation: this._buildAnimation(name, fps, keys) });
        return babylonAnimations;
    }
}
/** @internal */
export class WeightAnimationPropertyInfo extends AnimationPropertyInfo {
    buildAnimations(target, name, fps, keys) {
        const babylonAnimations = [];
        if (target._numMorphTargets) {
            for (let targetIndex = 0; targetIndex < target._numMorphTargets; targetIndex++) {
                const babylonAnimation = new Animation(`${name}_${targetIndex}`, this.name, fps, this.type);
                babylonAnimation.setKeys(keys.map((key) => ({
                    frame: key.frame,
                    inTangent: key.inTangent ? key.inTangent[targetIndex] : undefined,
                    value: key.value[targetIndex],
                    outTangent: key.outTangent ? key.outTangent[targetIndex] : undefined,
                    interpolation: key.interpolation,
                })), true);
                if (target._primitiveBabylonMeshes) {
                    for (const babylonMesh of target._primitiveBabylonMeshes) {
                        if (babylonMesh.morphTargetManager) {
                            const morphTarget = babylonMesh.morphTargetManager.getTarget(targetIndex);
                            const babylonAnimationClone = babylonAnimation.clone();
                            morphTarget.animations.push(babylonAnimationClone);
                            babylonAnimations.push({ babylonAnimatable: morphTarget, babylonAnimation: babylonAnimationClone });
                        }
                    }
                }
            }
        }
        return babylonAnimations;
    }
}
let _Registered = false;
/**
 * Registers the core glTF animation interpolation mappings.
 */
export function RegisterGLTFLoaderAnimation() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    SetInterpolationForKey("/nodes/{}/translation", [new TransformNodeAnimationPropertyInfo(Animation.ANIMATIONTYPE_VECTOR3, "position", getVector3, () => 3)]);
    SetInterpolationForKey("/nodes/{}/rotation", [new TransformNodeAnimationPropertyInfo(Animation.ANIMATIONTYPE_QUATERNION, "rotationQuaternion", getQuaternion, () => 4)]);
    SetInterpolationForKey("/nodes/{}/scale", [new TransformNodeAnimationPropertyInfo(Animation.ANIMATIONTYPE_VECTOR3, "scaling", getVector3, () => 3)]);
    SetInterpolationForKey("/nodes/{}/weights", [new WeightAnimationPropertyInfo(Animation.ANIMATIONTYPE_FLOAT, "influence", getWeights, (target) => target._numMorphTargets)]);
}
//# sourceMappingURL=glTFLoaderAnimation.pure.js.map