/** This file must only contain pure code and pure imports */
import { Camera } from "../../Cameras/camera.pure.js";
import { ArcRotateCamera } from "../../Cameras/arcRotateCamera.pure.js";
import { Vector3 } from "../../Maths/math.vector.pure.js";
import { _SetStereoscopicRigMode } from "../RigModes/stereoscopicRigMode.js";
import { Node } from "../../node.js";
/**
 * Camera used to simulate stereoscopic rendering (based on ArcRotateCamera)
 * @see https://doc.babylonjs.com/features/featuresDeepDive/cameras
 */
export class StereoscopicArcRotateCamera extends ArcRotateCamera {
    /**
     * Creates a new StereoscopicArcRotateCamera
     * @param name defines camera name
     * @param alpha defines alpha angle (in radians)
     * @param beta defines beta angle (in radians)
     * @param radius defines radius
     * @param target defines camera target
     * @param interaxialDistance defines distance between each color axis
     * @param isStereoscopicSideBySide defines is stereoscopic is done side by side or over under
     * @param scene defines the hosting scene
     */
    constructor(name, alpha, beta, radius, target, interaxialDistance, isStereoscopicSideBySide, scene) {
        super(name, alpha, beta, radius, target, scene);
        this._setRigMode = () => _SetStereoscopicRigMode(this);
        this.interaxialDistance = interaxialDistance;
        this.isStereoscopicSideBySide = isStereoscopicSideBySide;
        this.setCameraRigMode(isStereoscopicSideBySide ? Camera.RIG_MODE_STEREOSCOPIC_SIDEBYSIDE_PARALLEL : Camera.RIG_MODE_STEREOSCOPIC_OVERUNDER, {
            interaxialDistance: interaxialDistance,
        });
    }
    /**
     * Gets camera class name
     * @returns StereoscopicArcRotateCamera
     */
    getClassName() {
        return "StereoscopicArcRotateCamera";
    }
}
let _Registered = false;
/**
 * Register side effects for stereoscopicArcRotateCamera.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterStereoscopicArcRotateCamera() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    Node.AddNodeConstructor("StereoscopicArcRotateCamera", (name, scene, options) => {
        return () => new StereoscopicArcRotateCamera(name, 0, 0, 1.0, Vector3.Zero(), options.interaxial_distance, options.isStereoscopicSideBySide, scene);
    });
}
//# sourceMappingURL=stereoscopicArcRotateCamera.pure.js.map