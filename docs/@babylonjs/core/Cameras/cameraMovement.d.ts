/** This file must only contain pure code and pure imports */
import { type Scene } from "../scene.pure.js";
import { Vector3 } from "../Maths/math.vector.pure.js";
import { type InterpolatingBehavior } from "../Behaviors/Cameras/interpolatingBehavior.js";
/**
 * Base class for camera movement systems that convert raw input into framerate-independent camera deltas.
 *
 * This class handles the physics layer: velocity tracking, inertial decay, speed multipliers,
 * and per-frame delta computation. Input mapping (which physical inputs trigger which interactions)
 * is handled by an `InputMapper` instance composed on each movement subclass as `input`.
 *
 * **Speed and inertia** — Properties on this class that control how accumulated pixel deltas
 * are converted to framerate-independent camera deltas via `computeCurrentFrameDeltas()`:
 * - `panSpeed`, `rotationXSpeed`, `rotationYSpeed`, `zoomSpeed` — units of movement per pixel
 * - `panInertia`, `rotationInertia`, `zoomInertia` — velocity decay factor when input stops (0 = instant stop, 0.9 = smooth glide)
 */
export declare class CameraMovement {
    protected _cameraPosition: Vector3;
    protected _behavior?: InterpolatingBehavior | undefined;
    protected _scene: Scene;
    /**
     * Should be set by input classes to indicate whether there is active input this frame.
     * This helps differentiate between 0 pixel delta due to no input vs user actively holding still.
     */
    activeInput: boolean;
    /**
     * ------------ Speed ----------------
     * Speed defines the amount of camera movement expected per input pixel movement
     * -----------------------------------
     */
    /**
     * Global speed multiplier applied to all movement (pan, rotation, zoom).
     * Acts as a master scale factor on top of the individual speed properties.
     */
    speed: number;
    /**
     * Desired coordinate unit movement per input pixel when zooming
     */
    zoomSpeed: number;
    /**
     * Desired coordinate unit movement per input pixel when panning
     */
    panSpeed: number;
    /**
     * Desired radians movement per input pixel when rotating along x axis
     */
    rotationXSpeed: number;
    /**
     * Desired radians movement per input pixel when rotating along y axis
     */
    rotationYSpeed: number;
    /**
     * ----------- Speed multipliers ---------------
     * Multipliers allow movement classes to modify the effective speed dynamically per-frame
     * (ex: scale zoom based on distance from target)
     * -----------------------------------
     */
    /**
     * Multiplied atop zoom speed. Used to dynamically adjust zoom speed based on per-frame context (ex: zoom faster when further from target)
     */
    protected _zoomSpeedMultiplier: number;
    /**
     * Multiplied atop pan speed. Used to dynamically adjust pan speed based on per-frame context (ex: pan slowly when close to target)
     */
    protected _panSpeedMultiplier: number;
    /**
     * ---------- Inertia ----------------
     * Inertia represents the decay factor per-frame applied to the velocity when there is no user input.
     * 0 = No inertia, instant stop (velocity immediately becomes 0)
     * 0.5 = Strong decay, velocity halves every frame at 60fps
     * 0.9 = Moderate inertia, velocity retains 90% per frame at 60fps
     * 0.95 = High inertia, smooth glide, velocity retains 95% per frame at 60fps
     * 1 = Infinite inertia, never stops (velocity never decays)
     * -----------------------------------
     */
    /**
     * Inertia applied to the zoom velocity when there is no user input.
     * Higher inertia === slower decay, velocity retains more of its value each frame.
     *
     * Note: ArcRotateCamera syncs this from `camera.inertia` via an accessor on the camera class.
     * To tune independently, override inside `scene.onBeforeRenderObservable` after `camera.inertia` is read.
     */
    zoomInertia: number;
    /**
     * Inertia applied to the panning velocity when there is no user input.
     * Higher inertia === slower decay, velocity retains more of its value each frame.
     *
     * Note: ArcRotateCamera overrides this from `camera.panningInertia` (which defaults to `camera.inertia`).
     */
    panInertia: number;
    /**
     * Inertia applied to the rotation velocity when there is no user input.
     * Higher inertia === slower decay, velocity retains more of its value each frame.
     *
     * Note: ArcRotateCamera syncs this from `camera.inertia` via an accessor on the camera class.
     * To tune independently, override inside `scene.onBeforeRenderObservable` after `camera.inertia` is read.
     */
    rotationInertia: number;
    /**
     * ---------- Accumulated Pixel Deltas -----------
     * Pixel inputs accumulated throughout the frame by input classes (reset each frame after processing)
     * -----------------------------------
     */
    /**
     * Accumulated pixel delta (by input classes) for zoom this frame
     * Read by computeCurrentFrameDeltas() function and converted into zoomDeltaCurrentFrame (taking speed into account)
     * Reset to zero after each frame
     */
    zoomAccumulatedPixels: number;
    /**
     * Accumulated pixel delta (by input classes) for panning this frame
     * Read by computeCurrentFrameDeltas() function and converted into panDeltaCurrentFrame (taking speed into account)
     * Reset to zero after each frame
     */
    panAccumulatedPixels: Vector3;
    /**
     * Accumulated pixel delta (by input classes) for rotation this frame
     * Read by computeCurrentFrameDeltas() function and converted into rotationDeltaCurrentFrame (taking speed into account)
     * Reset to zero after each frame
     */
    rotationAccumulatedPixels: Vector3;
    /**
     * ---------- Current Frame Movement Deltas -----------
     * Deltas read on each frame by camera class in order to move the camera
     * -----------------------------------
     */
    /**
     * Zoom delta to apply to camera this frame, computed by computeCurrentFrameDeltas() from zoomPixelDelta (taking speed into account)
     */
    zoomDeltaCurrentFrame: number;
    /**
     * Pan delta to apply to camera this frame, computed by computeCurrentFrameDeltas() from panPixelDelta (taking speed into account)
     */
    panDeltaCurrentFrame: Vector3;
    /**
     * Rotation delta to apply to camera this frame, computed by computeCurrentFrameDeltas() from rotationPixelDelta (taking speed into account)
     */
    rotationDeltaCurrentFrame: Vector3;
    /**
     * ---------- Velocity -----------
     * Used to track velocity between frames for inertia calculation
     * -----------------------------------
     */
    /**
     * Zoom pixel velocity used for inertia calculations (pixels / ms).
     */
    protected _zoomVelocity: number;
    /**
     * Pan velocity used for inertia calculations (movement / time)
     */
    private _panVelocity;
    /**
     * Framerate (Hz) at which inertia values are calibrated. Default 60 matches legacy camera feel
     * at any actual refresh rate. Override to 120, 144, etc. only if your app was tuned on that
     * specific refresh rate under the legacy (framerate-dependent) camera math and you want to
     * preserve that exact decay characteristic. Most applications should leave this at 60.
     */
    referenceFrameRate: number;
    /**
     * Rotation velocity used for inertia calculations (movement / time)
     */
    private _rotationVelocity;
    /**
     * Last frame's effective deltaTime in ms. Updated at the end of each
     * `computeCurrentFrameDeltas` call. Initialized to 0 so the very-first-frame fallback
     * (used when the engine reports `getDeltaTime() === 0`) always reflects the *current*
     * `referenceFrameRate` rather than baking in the value at construction time — see
     * `_getEffectiveDeltaMs`.
     */
    private _prevFrameTimeMs;
    constructor(scene: Scene, _cameraPosition: Vector3, _behavior?: InterpolatingBehavior | undefined);
    /**
     * When called, will take the accumulated pixel deltas set by input classes and convert them into current frame deltas, stored in currentFrameMovementDelta properties
     * Takes speed, scaling, inertia, and framerate into account to ensure smooth movement
     * Zeros out pixelDeltas before returning
     */
    computeCurrentFrameDeltas(): void;
    /**
     * Resets the rotation velocity and accumulated pixels, stopping any in-progress rotation inertia.
     * Called when inertialAlphaOffset or inertialBetaOffset are explicitly zeroed (backward compat).
     */
    resetRotationVelocity(): void;
    /**
     * Resets the pan velocity and accumulated pixels, stopping any in-progress pan inertia.
     */
    resetPanVelocity(): void;
    /**
     * Resets the zoom velocity and accumulated pixels, stopping any in-progress zoom inertia.
     * Called when inertialRadiusOffset is explicitly zeroed out (backward compat).
     */
    resetZoomVelocity(): void;
    /**
     * Returns true when the camera is playing an interpolating (fly-to) animation.
     * Useful for suppressing user-input movement while a programmatic animation is active.
     */
    get isInterpolating(): boolean;
    /**
     * Returns the per-frame decay factor for a given inertia, adjusted to this frame's `dt`.
     * At the reference frame rate, returns `inertia` unchanged (matches legacy per-frame `*= inertia`).
     * Use this when implementing custom decaying accumulators (e.g. zoom-to-cursor coupled pan)
     * that need framerate-independent glide duration.
     * @param inertia - The inertia value (0-1) whose per-frame decay factor is needed.
     * @returns The decay factor to multiply a value by this frame.
     */
    getFrameIndependentDecay(inertia: number): number;
    /**
     * Returns the input-scale factor to apply to an impulse injected into a decaying accumulator
     * so that the integrated total is framerate-independent and matches legacy at 60fps.
     * At the reference frame rate, returns 1 (no-op). At high fps, scales the impulse down so
     * the sum over the decay tail stays equal to `impulse / (1 - inertia)` — the legacy total.
     * @param inertia - The inertia value (0-1) used by the accumulator.
     * @returns The scaling factor to multiply an impulse by before adding it to the accumulator.
     */
    getFrameIndependentInputScale(inertia: number): number;
    /**
     * Resolves the effective delta time for the current frame, falling back to the previous
     * frame's value when the engine reports a 0 delta. When neither is available yet (first
     * frame), falls back to the duration of one frame at `referenceFrameRate` so the very
     * first frame's decay matches the user's currently configured frame rate.
     * @param dt - Raw delta time in ms reported by the engine (0 if unavailable this frame).
     * @returns The effective delta time in ms to use for this frame's decay calculations.
     */
    private _getEffectiveDeltaMs;
    private _calculateCurrentVelocity;
}
