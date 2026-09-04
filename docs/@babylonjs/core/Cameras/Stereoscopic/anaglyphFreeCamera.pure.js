/** This file must only contain pure code and pure imports */
import { Camera } from "../../Cameras/camera.pure.js";
import { FreeCamera } from "../../Cameras/freeCamera.pure.js";
import { Vector3 } from "../../Maths/math.vector.pure.js";
import { _SetStereoscopicAnaglyphRigMode } from "../RigModes/stereoscopicAnaglyphRigMode.js";
import { Node } from "../../node.js";
/**
 * Camera used to simulate anaglyphic rendering (based on FreeCamera)
 * @see https://doc.babylonjs.com/features/featuresDeepDive/cameras/camera_introduction#anaglyph-cameras
 */
export class AnaglyphFreeCamera extends FreeCamera {
    /**
     * Creates a new AnaglyphFreeCamera
     * @param name defines camera name
     * @param position defines initial position
     * @param interaxialDistance defines distance between each color axis
     * @param scene defines the hosting scene
     */
    constructor(name, position, interaxialDistance, scene) {
        super(name, position, scene);
        this._setRigMode = () => _SetStereoscopicAnaglyphRigMode(this);
        this.interaxialDistance = interaxialDistance;
        this.setCameraRigMode(Camera.RIG_MODE_STEREOSCOPIC_ANAGLYPH, { interaxialDistance: interaxialDistance });
    }
    /**
     * Gets camera class name
     * @returns AnaglyphFreeCamera
     */
    getClassName() {
        return "AnaglyphFreeCamera";
    }
}
let _Registered = false;
/**
 * Register side effects for anaglyphFreeCamera.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterAnaglyphFreeCamera() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    Node.AddNodeConstructor("AnaglyphFreeCamera", (name, scene, options) => {
        return () => new AnaglyphFreeCamera(name, Vector3.Zero(), options.interaxial_distance, scene);
    });
}
//# sourceMappingURL=anaglyphFreeCamera.pure.js.map