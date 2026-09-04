import { CubicEase, EasingFunction } from "../../Animations/easing.js";
import { Animation } from "../../Animations/animation.pure.js";
/**
 * Animate camera property changes with an interpolation effect
 * @see https://doc.babylonjs.com/features/featuresDeepDive/behaviors/cameraBehaviors
 */
export class InterpolatingBehavior {
    /**
     * Gets the name of the behavior.
     */
    get name() {
        return "Interpolating";
    }
    /**
     * Attached node of this behavior
     */
    get attachedNode() {
        return this._attachedCamera;
    }
    /**
     * Initializes the behavior
     */
    constructor() {
        /**
         * The easing function to use for interpolation
         */
        this.easingFunction = new CubicEase();
        /**
         * The easing mode (default is EASINGMODE_EASEINOUT)
         */
        this.easingMode = EasingFunction.EASINGMODE_EASEINOUT;
        /**
         * Duration of the animation in milliseconds
         */
        this.transitionDuration = 450;
        this._attachedCamera = null;
        this._animatables = new Map();
        this.easingFunction.setEasingMode(this.easingMode);
    }
    /**
     * Initializes the behavior
     */
    init() {
        // Nothing to do on init
    }
    /**
     * Attaches the behavior to a camera
     * @param camera The camera to attach to
     */
    attach(camera) {
        this._attachedCamera = camera;
    }
    /**
     * Detaches the behavior from the camera
     */
    detach() {
        if (!this._attachedCamera) {
            return;
        }
        this.stopAllAnimations();
        this._attachedCamera = null;
    }
    get isInterpolating() {
        return this._animatables.size > 0;
    }
    /**
     * Gets the longest remaining duration (in milliseconds) across all in-flight property animations.
     * Returns 0 when nothing is currently animating.
     */
    get remainingDurationMs() {
        let remaining = 0;
        this._animatables.forEach((animatable) => {
            const remainingFrames = Math.max(animatable.toFrame - animatable.masterFrame, 0);
            remaining = Math.max(remaining, (remainingFrames / InterpolatingBehavior._FrameRate) * 1000);
        });
        return remaining;
    }
    /**
     * Stops and removes all animations
     */
    stopAllAnimations() {
        if (this._attachedCamera) {
            this._animatables.forEach((animatable) => animatable.stop());
        }
        this._animatables.clear();
        this._promiseResolve?.();
        this._promiseResolve = undefined;
    }
    /**
     * Called when a single property's transition completes (or is applied instantly). Cleans up the
     * spent animation and resolves the in-flight promise once every property has reached its target.
     * @param propertyName name of the property whose animation has finished
     */
    _onPropertyAnimationEnd(propertyName) {
        const camera = this._attachedCamera;
        if (camera) {
            // Remove the associated animation from camera once the transition to target is complete so that property animations don't accumulate
            for (let i = camera.animations.length - 1; i >= 0; --i) {
                if (camera.animations[i].name === propertyName + "Animation") {
                    camera.animations.splice(i, 1);
                }
            }
        }
        this._animatables.delete(propertyName);
        if (this._animatables.size === 0) {
            const resolve = this._promiseResolve;
            this._promiseResolve = undefined;
            resolve?.();
        }
    }
    /**
     * Redirects any in-flight transition toward the given property values, reusing the time remaining in the
     * current transition. No-op when nothing is currently animating.
     * @deprecated Prefer `animatePropertiesAsync(properties, remainingDurationMs)`, which makes the duration
     * explicit. This method is retained for backward compatibility.
     * @param properties defines the property values to redirect toward
     */
    updateProperties(properties) {
        if (!this.isInterpolating) {
            return;
        }
        void this.animatePropertiesAsync(properties, this.remainingDurationMs);
    }
    /**
     * Animates camera properties to new values.
     * @param properties defines the property values to animate to
     * @param transitionDuration defines the transition duration in milliseconds
     * @param easingFn defines the easing function to use
     * @param updateAnimation defines an optional callback used to update each generated animation
     * @returns a promise that resolves when the animation completes
     */
    async animatePropertiesAsync(properties, transitionDuration = this.transitionDuration, easingFn = this.easingFunction, updateAnimation) {
        const promise = new Promise((resolve) => {
            this.stopAllAnimations();
            this._promiseResolve = resolve;
            if (!this._attachedCamera) {
                this._promiseResolve = undefined;
                return resolve();
            }
            const camera = this._attachedCamera;
            const scene = camera.getScene();
            properties.forEach((value, key) => {
                if (value !== undefined && camera[key] !== value) {
                    const propertyName = String(key);
                    const animation = Animation.CreateAnimation(propertyName, GetAnimationType(value), InterpolatingBehavior._FrameRate, easingFn);
                    // Optionally allow caller to further customize the animation
                    updateAnimation?.(propertyName, animation);
                    // Pass false for stopCurrent so that we can interpolate multiple properties at once
                    const animatable = Animation.TransitionTo(propertyName, value, camera, scene, InterpolatingBehavior._FrameRate, animation, transitionDuration, () => this._onPropertyAnimationEnd(propertyName), false);
                    if (animatable) {
                        this._animatables.set(propertyName, animatable);
                    }
                }
            });
            // Nothing needed animating (already at target): resolve immediately rather than hang.
            if (this._animatables.size === 0) {
                this._promiseResolve = undefined;
                resolve();
            }
        });
        return await promise;
    }
}
// Frame rate used for all generated transition animations. Kept as a single constant so the duration
// math in remainingDurationMs stays consistent with the animations created in animatePropertiesAsync.
InterpolatingBehavior._FrameRate = 60;
// Structural type-guards (no instanceof)
function IsQuaternionLike(v) {
    return v != null && typeof v.x === "number" && typeof v.y === "number" && typeof v.z === "number" && typeof v.w === "number";
}
function IsMatrixLike(v) {
    return v != null && (Array.isArray(v.m) || typeof v.m === "object");
}
function IsVector3Like(v) {
    return v != null && typeof v.x === "number" && typeof v.y === "number" && typeof v.z === "number";
}
function IsVector2Like(v) {
    return v != null && typeof v.x === "number" && typeof v.y === "number";
}
function IsColor3Like(v) {
    return v != null && typeof v.r === "number" && typeof v.g === "number" && typeof v.b === "number";
}
function IsColor4Like(v) {
    return v != null && typeof v.r === "number" && typeof v.g === "number" && typeof v.b === "number" && typeof v.a === "number";
}
function IsSizeLike(v) {
    return v != null && typeof v.width === "number" && typeof v.height === "number";
}
const GetAnimationType = (value) => {
    if (IsQuaternionLike(value)) {
        return Animation.ANIMATIONTYPE_QUATERNION;
    }
    if (IsMatrixLike(value)) {
        return Animation.ANIMATIONTYPE_MATRIX;
    }
    if (IsVector3Like(value)) {
        return Animation.ANIMATIONTYPE_VECTOR3;
    }
    if (IsVector2Like(value)) {
        return Animation.ANIMATIONTYPE_VECTOR2;
    }
    if (IsColor3Like(value)) {
        return Animation.ANIMATIONTYPE_COLOR3;
    }
    if (IsColor4Like(value)) {
        return Animation.ANIMATIONTYPE_COLOR4;
    }
    if (IsSizeLike(value)) {
        return Animation.ANIMATIONTYPE_SIZE;
    }
    // Fallback to float for numbers and unknown shapes
    return Animation.ANIMATIONTYPE_FLOAT;
};
//# sourceMappingURL=interpolatingBehavior.js.map