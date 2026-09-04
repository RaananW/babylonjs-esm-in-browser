/** This file must only contain pure code and pure imports */
import { CameraMovement } from "./cameraMovement.js";
import { InputMapper } from "./inputMapper.js";
/**
 * Shared movement system for {@link TargetCamera} and its subclasses (FreeCamera, FlyCamera,
 * FollowCamera). Provides framerate-independent physics (via {@link CameraMovement}) and a
 * declarative {@link InputMapper} for configuring which physical inputs trigger which interactions.
 *
 * Accumulator mapping for this camera family:
 * - `translate` feeds `panAccumulatedPixels` as a WORLD-space direction (input classes orient local
 *   intent into world space before populating it, mirroring the legacy `cameraDirection` surface).
 * - `rotate` feeds `rotationAccumulatedPixels` (x=pitch, y=yaw), mirroring legacy `cameraRotation`.
 *
 * These camera classes have no separate zoom channel: mouse-wheel input folds into translation/rotation
 * just like the legacy inputs, so there is no `zoom` interaction here.
 *
 * Input classes inject deltas using the same scaling they applied historically and the movement
 * system leaves all speed multipliers at 1, so at the reference framerate the per-frame applied
 * delta matches the legacy value exactly while inertial glide becomes framerate-independent.
 */
export class TargetCameraMovement extends CameraMovement {
    /**
     * Creates a movement system for the {@link TargetCamera} family.
     * @param scene The scene the owning camera belongs to.
     * @param cameraPosition The owning camera's position vector (shared by reference).
     * @param behavior Optional interpolating behavior used to suppress input while animating.
     */
    constructor(scene, cameraPosition, behavior) {
        super(scene, cameraPosition, behavior);
        this.input = new InputMapper({
            translate: (deltaX, deltaY, deltaZ) => {
                this.panAccumulatedPixels.x += deltaX;
                this.panAccumulatedPixels.y += deltaY;
                this.panAccumulatedPixels.z += deltaZ;
            },
            rotate: (pitch, yaw) => {
                this.rotationAccumulatedPixels.x += pitch;
                this.rotationAccumulatedPixels.y += yaw;
            },
        }, () => this._createDefaultInputMap());
    }
    _createDefaultInputMap() {
        // Default entries leave `sensitivity` unset so each input class falls back to its legacy
        // sensibility properties (`angularSensibility`, `rotationSpeed`, `touchAngularSensibility`,
        // etc.) for backward compatibility. Setting `sensitivity` on an entry overrides those.
        //
        // These entries declare which interactions each source is allowed to drive; the input
        // classes still decide *direction* from their own configuration (keyboard key lists,
        // touch single/multi-finger mode, mouse-wheel per-axis actions). Removing an entry
        // disables that source→interaction pairing without otherwise changing the input class.
        return [
            // Mouse drag → look (any button; FreeCameraMouseInput gates on its own `buttons` list).
            { source: "pointer", interaction: "rotate" },
            // Keyboard movement keys → translate, rotation keys → look.
            { source: "keyboard", interaction: "translate" },
            { source: "keyboard", interaction: "rotate" },
            // Touch drag → look or move depending on the input's single/multi-finger mode.
            { source: "touch", interaction: "rotate" },
            { source: "touch", interaction: "translate" },
        ];
    }
}
//# sourceMappingURL=targetCameraMovement.js.map