/** This file must only contain pure code and pure imports */
import { Camera } from "../../Cameras/camera.pure.js";
import { UniversalCamera } from "../../Cameras/universalCamera.pure.js";
import { Vector3 } from "../../Maths/math.vector.pure.js";
import { _SetStereoscopicRigMode } from "../RigModes/stereoscopicRigMode.js";
import { Node } from "../../node.js";
/**
 * Camera used to simulate stereoscopic rendering (based on UniversalCamera)
 * @see https://doc.babylonjs.com/features/featuresDeepDive/cameras
 */
export class StereoscopicUniversalCamera extends UniversalCamera {
    /**
     * Creates a new StereoscopicUniversalCamera
     * @param name defines camera name
     * @param position defines initial position
     * @param interaxialDistance defines distance between each color axis
     * @param isStereoscopicSideBySide defines is stereoscopic is done side by side or over under
     * @param scene defines the hosting scene
     */
    constructor(name, position, interaxialDistance, isStereoscopicSideBySide, scene) {
        super(name, position, scene);
        this._setRigMode = () => _SetStereoscopicRigMode(this);
        this.interaxialDistance = interaxialDistance;
        this.isStereoscopicSideBySide = isStereoscopicSideBySide;
        this.setCameraRigMode(isStereoscopicSideBySide ? Camera.RIG_MODE_STEREOSCOPIC_SIDEBYSIDE_PARALLEL : Camera.RIG_MODE_STEREOSCOPIC_OVERUNDER, {
            interaxialDistance: interaxialDistance,
        });
    }
    /**
     * Gets camera class name
     * @returns StereoscopicUniversalCamera
     */
    getClassName() {
        return "StereoscopicUniversalCamera";
    }
}
let _Registered = false;
/**
 * Register side effects for stereoscopicUniversalCamera.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterStereoscopicUniversalCamera() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    Node.AddNodeConstructor("StereoscopicUniversalCamera", (name, scene, options) => {
        return () => new StereoscopicUniversalCamera(name, Vector3.Zero(), options.interaxial_distance, options.isStereoscopicSideBySide, scene);
    });
}
//# sourceMappingURL=stereoscopicUniversalCamera.pure.js.map