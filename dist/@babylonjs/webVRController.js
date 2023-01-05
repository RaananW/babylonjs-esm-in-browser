import { Observable } from "../../Misc/observable.js";
import { PoseEnabledController } from "./poseEnabledController.js";
/**
 * Defines the WebVRController object that represents controllers tracked in 3D space
 * @deprecated Use WebXR instead
 */
export class WebVRController extends PoseEnabledController {
    /**
     * Creates a new WebVRController from a gamepad
     * @param vrGamepad the gamepad that the WebVRController should be created from
     */
    constructor(vrGamepad) {
        super(vrGamepad);
        // Observables
        /**
         * Fired when the trigger state has changed
         */
        this.onTriggerStateChangedObservable = new Observable();
        /**
         * Fired when the main button state has changed
         */
        this.onMainButtonStateChangedObservable = new Observable();
        /**
         * Fired when the secondary button state has changed
         */
        this.onSecondaryButtonStateChangedObservable = new Observable();
        /**
         * Fired when the pad state has changed
         */
        this.onPadStateChangedObservable = new Observable();
        /**
         * Fired when controllers stick values have changed
         */
        this.onPadValuesChangedObservable = new Observable();
        /**
         * X and Y axis corresponding to the controllers joystick
         */
        this.pad = { x: 0, y: 0 };
        // avoid GC, store state in a tmp object
        this._changes = {
            pressChanged: false,
            touchChanged: false,
            valueChanged: false,
            changed: false,
        };
        this._buttons = new Array(vrGamepad.buttons.length);
        this.hand = vrGamepad.hand;
    }
    /**
     * Fired when a controller button's state has changed
     * @param callback the callback containing the button that was modified
     */
    onButtonStateChange(callback) {
        this._onButtonStateChange = callback;
    }
    /**
     * The default controller model for the controller
     */
    get defaultModel() {
        return this._defaultModel;
    }
    /**
     * Updates the state of the controller and mesh based on the current position and rotation of the controller
     */
    update() {
        super.update();
        for (let index = 0; index < this._buttons.length; index++) {
            this._setButtonValue(this.browserGamepad.buttons[index], this._buttons[index], index);
        }
        if (this.leftStick.x !== this.pad.x || this.leftStick.y !== this.pad.y) {
            this.pad.x = this.leftStick.x;
            this.pad.y = this.leftStick.y;
            this.onPadValuesChangedObservable.notifyObservers(this.pad);
        }
    }
    _setButtonValue(newState, currentState, buttonIndex) {
        if (!newState) {
            newState = {
                pressed: false,
                touched: false,
                value: 0,
            };
        }
        if (!currentState) {
            this._buttons[buttonIndex] = {
                pressed: newState.pressed,
                touched: newState.touched,
                value: newState.value,
            };
            return;
        }
        this._checkChanges(newState, currentState);
        if (this._changes.changed) {
            this._onButtonStateChange && this._onButtonStateChange(this.index, buttonIndex, newState);
            this._handleButtonChange(buttonIndex, newState, this._changes);
        }
        this._buttons[buttonIndex].pressed = newState.pressed;
        this._buttons[buttonIndex].touched = newState.touched;
        // oculus triggers are never 0, thou not touched.
        this._buttons[buttonIndex].value = newState.value < 0.00000001 ? 0 : newState.value;
    }
    _checkChanges(newState, currentState) {
        this._changes.pressChanged = newState.pressed !== currentState.pressed;
        this._changes.touchChanged = newState.touched !== currentState.touched;
        this._changes.valueChanged = newState.value !== currentState.value;
        this._changes.changed = this._changes.pressChanged || this._changes.touchChanged || this._changes.valueChanged;
        return this._changes;
    }
    /**
     * Disposes of th webVRController
     */
    dispose() {
        super.dispose();
        this._defaultModel = null;
        this.onTriggerStateChangedObservable.clear();
        this.onMainButtonStateChangedObservable.clear();
        this.onSecondaryButtonStateChangedObservable.clear();
        this.onPadStateChangedObservable.clear();
        this.onPadValuesChangedObservable.clear();
    }
}
//# sourceMappingURL=webVRController.js.map