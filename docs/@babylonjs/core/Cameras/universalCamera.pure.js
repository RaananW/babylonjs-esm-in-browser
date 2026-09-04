/** This file must only contain pure code and pure imports */
import { TouchCamera } from "./touchCamera.pure.js";
import { Vector3 } from "../Maths/math.vector.pure.js";
import { Node } from "../node.js";
import { Camera } from "./camera.pure.js";
/**
 * The Universal Camera is the one to choose for first person shooter type games, and works with all the keyboard, mouse, touch and gamepads. This replaces the earlier Free Camera,
 * which still works and will still be found in many Playgrounds.
 * @see https://doc.babylonjs.com/features/featuresDeepDive/cameras/camera_introduction#universal-camera
 */
export class UniversalCamera extends TouchCamera {
    /**
     * Defines the gamepad rotation sensibility.
     * This is the threshold from when rotation starts to be accounted for to prevent jittering.
     */
    get gamepadAngularSensibility() {
        const gamepad = this.inputs.attached["gamepad"];
        if (gamepad) {
            return gamepad.gamepadAngularSensibility;
        }
        return 0;
    }
    set gamepadAngularSensibility(value) {
        const gamepad = this.inputs.attached["gamepad"];
        if (gamepad) {
            gamepad.gamepadAngularSensibility = value;
        }
    }
    /**
     * Defines the gamepad move sensibility.
     * This is the threshold from when moving starts to be accounted for to prevent jittering.
     */
    get gamepadMoveSensibility() {
        const gamepad = this.inputs.attached["gamepad"];
        if (gamepad) {
            return gamepad.gamepadMoveSensibility;
        }
        return 0;
    }
    set gamepadMoveSensibility(value) {
        const gamepad = this.inputs.attached["gamepad"];
        if (gamepad) {
            gamepad.gamepadMoveSensibility = value;
        }
    }
    /**
     * The Universal Camera is the one to choose for first person shooter type games, and works with all the keyboard, mouse, touch and gamepads. This replaces the earlier Free Camera,
     * which still works and will still be found in many Playgrounds.
     * @see https://doc.babylonjs.com/features/featuresDeepDive/cameras/camera_introduction#universal-camera
     * @param name Define the name of the camera in the scene
     * @param position Define the start position of the camera in the scene
     * @param scene Define the scene the camera belongs to
     */
    constructor(name, position, scene) {
        super(name, position, scene);
        this.inputs.addGamepad();
    }
    /**
     * Gets the current object class name.
     * @returns the class name
     */
    getClassName() {
        return "UniversalCamera";
    }
}
let _Registered = false;
/**
 * Register side effects for universalCamera.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterUniversalCamera() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    Node.AddNodeConstructor("FreeCamera", (name, scene) => {
        // Forcing to use the Universal camera
        return () => new UniversalCamera(name, Vector3.Zero(), scene);
    });
    Camera._CreateDefaultParsedCamera = (name, scene) => {
        return new UniversalCamera(name, Vector3.Zero(), scene);
    };
}
//# sourceMappingURL=universalCamera.pure.js.map