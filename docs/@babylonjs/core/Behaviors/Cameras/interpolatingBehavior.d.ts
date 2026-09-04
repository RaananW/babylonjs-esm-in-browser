import { type Behavior } from "../behavior.js";
import { EasingFunction } from "../../Animations/easing.js";
import { type Nullable } from "../../types.js";
import { Animation } from "../../Animations/animation.pure.js";
import { type Camera } from "../../Cameras/camera.js";
import { type IColor3Like, type IColor4Like, type IMatrixLike, type IQuaternionLike, type IVector2Like, type IVector3Like } from "../../Maths/math.like.js";
export type AllowedAnimValue = number | IVector2Like | IVector3Like | IQuaternionLike | IMatrixLike | IColor3Like | IColor4Like | SizeLike | undefined;
/**
 * Animate camera property changes with an interpolation effect
 * @see https://doc.babylonjs.com/features/featuresDeepDive/behaviors/cameraBehaviors
 */
export declare class InterpolatingBehavior<C extends Camera = Camera> implements Behavior<C> {
    /**
     * Gets the name of the behavior.
     */
    get name(): string;
    /**
     * The easing function to use for interpolation
     */
    easingFunction: EasingFunction;
    /**
     * The easing mode (default is EASINGMODE_EASEINOUT)
     */
    easingMode: number;
    /**
     * Duration of the animation in milliseconds
     */
    transitionDuration: number;
    /**
     * Attached node of this behavior
     */
    get attachedNode(): Nullable<C>;
    private _attachedCamera;
    private _animatables;
    private _promiseResolve?;
    private static readonly _FrameRate;
    /**
     * Initializes the behavior
     */
    constructor();
    /**
     * Initializes the behavior
     */
    init(): void;
    /**
     * Attaches the behavior to a camera
     * @param camera The camera to attach to
     */
    attach(camera: C): void;
    /**
     * Detaches the behavior from the camera
     */
    detach(): void;
    get isInterpolating(): boolean;
    /**
     * Gets the longest remaining duration (in milliseconds) across all in-flight property animations.
     * Returns 0 when nothing is currently animating.
     */
    get remainingDurationMs(): number;
    /**
     * Stops and removes all animations
     */
    stopAllAnimations(): void;
    /**
     * Called when a single property's transition completes (or is applied instantly). Cleans up the
     * spent animation and resolves the in-flight promise once every property has reached its target.
     * @param propertyName name of the property whose animation has finished
     */
    private _onPropertyAnimationEnd;
    /**
     * Redirects any in-flight transition toward the given property values, reusing the time remaining in the
     * current transition. No-op when nothing is currently animating.
     * @deprecated Prefer `animatePropertiesAsync(properties, remainingDurationMs)`, which makes the duration
     * explicit. This method is retained for backward compatibility.
     * @param properties defines the property values to redirect toward
     */
    updateProperties<K extends keyof C>(properties: Map<K, AllowedAnimValue>): void;
    /**
     * Animates camera properties to new values.
     * @param properties defines the property values to animate to
     * @param transitionDuration defines the transition duration in milliseconds
     * @param easingFn defines the easing function to use
     * @param updateAnimation defines an optional callback used to update each generated animation
     * @returns a promise that resolves when the animation completes
     */
    animatePropertiesAsync<K extends keyof C>(properties: Map<K, AllowedAnimValue>, transitionDuration?: number, easingFn?: EasingFunction, updateAnimation?: (key: string, animation: Animation) => void): Promise<void>;
}
export type SizeLike = {
    width: number;
    height: number;
};
