/** This file must only contain pure code and pure imports */
import { CameraMovement } from "./cameraMovement.js";
import { type Scene } from "../scene.pure.js";
import { type Vector3 } from "../Maths/math.vector.pure.js";
import { type InterpolatingBehavior } from "../Behaviors/Cameras/interpolatingBehavior.js";
import { type ArcRotateCamera } from "./arcRotateCamera.pure.js";
import { InputMapper } from "./inputMapper.js";
/**
 * Handler shape for arc-rotate camera interactions.
 * Property names are the canonical interaction type strings used in inputMap entries.
 * All handlers are plain functions since none need multi-method lifecycle.
 */
export type ArcRotateHandlers = {
    /** Pan by pre-scaled pixel deltas */
    pan: (deltaX: number, deltaY: number) => void;
    /** Orbit by pre-scaled pixel deltas */
    rotate: (deltaX: number, deltaY: number) => void;
    /** Zoom by a pre-computed delta (already scaled by input) */
    zoom: (delta: number) => void;
};
/** Interaction type string for arc-rotate camera, derived from handler property names */
export type ArcRotateInteraction = keyof ArcRotateHandlers;
/**
 * Arc-rotate camera movement system that provides framerate-independent physics
 * and input mapping for pan, rotate, and zoom interactions.
 *
 * Default accumulator-based flow: input classes feed pixel deltas into the accumulators
 * (panAccumulatedPixels, rotationAccumulatedPixels, zoomAccumulatedPixels).
 * The base class's computeCurrentFrameDeltas() converts these to framerate-independent
 * deltas with proper inertia, which the camera reads each frame.
 */
export declare class ArcRotateCameraMovement extends CameraMovement {
    /** Input system that maps physical inputs to interactions and dispatches to handlers. */
    readonly input: InputMapper<ArcRotateHandlers>;
    constructor(scene: Scene, cameraPosition: Vector3, behavior?: InterpolatingBehavior<ArcRotateCamera>);
    private _createDefaultInputMap;
}
