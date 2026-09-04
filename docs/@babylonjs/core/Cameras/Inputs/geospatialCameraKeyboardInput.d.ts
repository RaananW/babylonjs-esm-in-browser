import { type GeospatialCamera } from "../geospatialCamera.js";
import { type ICameraInput } from "../cameraInputsManager.js";
/**
 * Manage the keyboard inputs to control the movement of a geospatial camera.
 * Arrow keys + Modifier key (ctrl/alt/option on mac): rotate
 * Arrow keys alone: pan
 * + / - keys: zoom in/out
 * @see https://doc.babylonjs.com/features/featuresDeepDive/cameras/customizingCameraInputs
 */
export declare class GeospatialCameraKeyboardInput implements ICameraInput<GeospatialCamera> {
    /**
     * Defines the camera the input is attached to.
     */
    camera: GeospatialCamera;
    /**
     * Defines the list of key codes associated with the up action (pan up)
     */
    keysUp: number[];
    /**
     * Defines the list of key codes associated with the down action (pan down)
     */
    keysDown: number[];
    /**
     * Defines the list of key codes associated with the left action (pan left)
     */
    keysLeft: number[];
    /**
     * Defines the list of key codes associated with the right action (pan right)
     */
    keysRight: number[];
    /**
     * Defines the list of key codes associated with zoom in (+ or =)
     */
    keysZoomIn: number[];
    /**
     * Defines the list of key codes associated with zoom out (-)
     */
    keysZoomOut: number[];
    /**
     * Defines the rotation sensitivity of the inputs.
     * (How many pixels of pointer input to apply per keypress, before rotation speed factor is applied by movement class)
     * @deprecated Use the `sensitivity` field on the keyboard rotate entry in `camera.movement.input.inputMap` instead.
     */
    get rotationSensitivity(): number;
    set rotationSensitivity(value: number);
    /**
     * Defines the panning sensitivity of the inputs.
     * (How many pixels of pointer input to apply per keypress, before pan speed factor is applied by movement class)
     * @deprecated Use the `sensitivity` field on the keyboard pan entry in `camera.movement.input.inputMap` instead.
     */
    get panSensitivity(): number;
    set panSensitivity(value: number);
    /**
     * Defines the zooming sensitivity of the inputs.
     * (How many pixels of pointer input to apply per keypress, before zoom speed factor is applied by movement class)
     * @deprecated Use the `sensitivity` field on the keyboard zoom entry in `camera.movement.input.inputMap` instead.
     */
    get zoomSensitivity(): number;
    set zoomSensitivity(value: number);
    private _keys;
    private _ctrlPressed;
    private _altPressed;
    private _shiftPressed;
    private _onCanvasBlurObserver;
    private _onKeyboardObserver;
    private _engine;
    private _scene;
    /**
     * Modifier state stored separately from `_keyboardConditions` so it can be typed as a
     * concrete (non-optional) object. This avoids non-null assertions when updating modifier
     * fields each frame, and the conditions object holds the same reference so
     * resolveInteraction sees the live state.
     */
    private _keyboardModifiers;
    /** Cached conditions object to avoid per-frame allocations in checkInputs */
    private _keyboardConditions;
    /** Reused accumulator for the per-frame keyboard pan direction, to avoid per-frame allocations */
    private _panDirection;
    /**
     * Attach the input controls to a specific dom element to get the input from.
     * @param noPreventDefault Defines whether event caught by the controls should call preventdefault() (https://developer.mozilla.org/en-US/docs/Web/API/Event/preventDefault)
     */
    attachControl(noPreventDefault?: boolean): void;
    /**
     * Detach the current controls from the specified dom element.
     */
    detachControl(): void;
    /**
     * Update the current camera state depending on the inputs that have been used this frame.
     * This is a dynamically created lambda to avoid the performance penalty of looping for inputs in the render loop.
     */
    checkInputs(): void;
    /**
     * Gets the class name of the current input.
     * @returns the class name
     */
    getClassName(): string;
    /**
     * Get the friendly name associated with the input class.
     * @returns the input friendly name
     */
    getSimpleName(): string;
}
