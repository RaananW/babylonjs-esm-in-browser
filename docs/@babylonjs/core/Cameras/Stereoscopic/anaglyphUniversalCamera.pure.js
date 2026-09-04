/** This file must only contain pure code and pure imports */
import { Camera } from "../../Cameras/camera.pure.js";
import { UniversalCamera } from "../../Cameras/universalCamera.pure.js";
import { Vector3 } from "../../Maths/math.vector.pure.js";
import { _SetStereoscopicAnaglyphRigMode } from "../RigModes/stereoscopicAnaglyphRigMode.js";
import { Node } from "../../node.js";
/**
 * Camera used to simulate anaglyphic rendering (based on UniversalCamera)
 * @see https://doc.babylonjs.com/features/featuresDeepDive/cameras/camera_introduction#anaglyph-cameras
 */
export class AnaglyphUniversalCamera extends UniversalCamera {
    /**
     * Creates a new AnaglyphUniversalCamera
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
     * @returns AnaglyphUniversalCamera
     */
    getClassName() {
        return "AnaglyphUniversalCamera";
    }
}
let _Registered = false;
/**
 * Register side effects for anaglyphUniversalCamera.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterAnaglyphUniversalCamera() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    Node.AddNodeConstructor("AnaglyphUniversalCamera", (name, scene, options) => {
        return () => new AnaglyphUniversalCamera(name, Vector3.Zero(), options.interaxial_distance, scene);
    });
}
//# sourceMappingURL=anaglyphUniversalCamera.pure.js.map