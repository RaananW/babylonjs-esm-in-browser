import { Observable } from "../../Misc/observable.js";
import { type ICameraInput } from "../../Cameras/cameraInputsManager.js";
import { type FreeCamera } from "../../Cameras/freeCamera.js";
/**
 * Manage the mouse inputs to control the movement of a free camera.
 * @see https://doc.babylonjs.com/features/featuresDeepDive/cameras/customizingCameraInputs
 */
export declare class FreeCameraMouseInput implements ICameraInput<FreeCamera> {
    /**
     * [true] Define if touch is enabled in the mouse input
     */
    touchEnabled: boolean;
    /**
     * Defines the camera the input is attached to.
     */
    camera: FreeCamera;
    /**
     * Defines the buttons associated with the input to handle camera move.
     */
    buttons: number[];
    /**
     * Defines the pointer angular sensibility  along the X and Y axis or how fast is the camera rotating.
     */
    angularSensibility: number;
    private _pointerInput;
    private _onMouseMove;
    private _observer;
    private _previousPosition;
    /**
     * Observable for when a pointer move event occurs containing the move offset
     */
    onPointerMovedObservable: Observable<{
        offsetX: number;
        offsetY: number;
    }>;
    /**
     * @internal
     * If the camera should be rotated automatically based on pointer movement
     */
    _allowCameraRotation: boolean;
    private _currentActiveButton;
    private _activePointerId;
    private _contextMenuBind;
    /** Reused conditions object for `resolveInteraction` to avoid per-move allocations. */
    private readonly _pointerConditions;
    /**
     * Applies a pointer-drag delta as camera rotation, but only if the camera's configurable
     * input map resolves the current pointer interaction to "rotate". The map is consulted with
     * the currently active mouse button so consumers can remap or disable pointer-driven rotation.
     * The applied scale comes from the resolved entry's `sensitivity`/`sensitivityX`/`sensitivityY`,
     * falling back to the legacy `angularSensibility` for backward compatibility. The rotation is
     * still written to `camera.cameraRotation` (not the movement accumulators) so existing code that
     * reads `cameraRotation` immediately after a pointer event keeps working.
     * @param offsetX Horizontal pointer delta (already handedness-adjusted).
     * @param offsetY Vertical pointer delta (already handedness-adjusted).
     */
    private _applyPointerRotation;
    /**
     * Manage the mouse inputs to control the movement of a free camera.
     * @see https://doc.babylonjs.com/features/featuresDeepDive/cameras/customizingCameraInputs
     * @param touchEnabled Defines if touch is enabled or not
     */
    constructor(
    /**
     * [true] Define if touch is enabled in the mouse input
     */
    touchEnabled?: boolean);
    /**
     * Attach the input controls to a specific dom element to get the input from.
     * @param noPreventDefault Defines whether event caught by the controls should call preventdefault() (https://developer.mozilla.org/en-US/docs/Web/API/Event/preventDefault)
     */
    attachControl(noPreventDefault?: boolean): void;
    /**
     * Called on JS contextmenu event.
     * Override this method to provide functionality.
     * @param evt the context menu event
     */
    onContextMenu(evt: PointerEvent): void;
    /**
     * Detach the current controls from the specified dom element.
     */
    detachControl(): void;
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
