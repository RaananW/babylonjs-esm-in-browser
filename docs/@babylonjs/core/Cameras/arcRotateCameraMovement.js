/** This file must only contain pure code and pure imports */
import { CameraMovement } from "./cameraMovement.js";
import { InputMapper } from "./inputMapper.js";
/**
 * Arc-rotate camera movement system that provides framerate-independent physics
 * and input mapping for pan, rotate, and zoom interactions.
 *
 * Default accumulator-based flow: input classes feed pixel deltas into the accumulators
 * (panAccumulatedPixels, rotationAccumulatedPixels, zoomAccumulatedPixels).
 * The base class's computeCurrentFrameDeltas() converts these to framerate-independent
 * deltas with proper inertia, which the camera reads each frame.
 */
export class ArcRotateCameraMovement extends CameraMovement {
    constructor(scene, cameraPosition, behavior) {
        super(scene, cameraPosition, behavior);
        this.input = new InputMapper({
            pan: (deltaX, deltaY) => {
                this.panAccumulatedPixels.x += deltaX;
                this.panAccumulatedPixels.y += deltaY;
            },
            rotate: (deltaX, deltaY) => {
                this.rotationAccumulatedPixels.x += deltaX;
                this.rotationAccumulatedPixels.y += deltaY;
            },
            zoom: (delta) => {
                this.zoomAccumulatedPixels += delta;
            },
        }, () => this._createDefaultInputMap());
    }
    _createDefaultInputMap() {
        // Default entries leave `sensitivity` unset so each input class falls back to its legacy
        // sensibility properties (`angularSensibilityX/Y`, `panningSensibility`, `wheelPrecision`,
        // `angularSpeed`, `zoomingSensibility`) for backward compatibility. Setting `sensitivity`
        // on an entry overrides those properties — the long-term path for phasing them out.
        return [
            // ctrl+left-drag → pan (more specific than the bare rotate entry below; must come first so first-match-wins picks it).
            { source: "pointer", button: 0, modifiers: { ctrl: true }, interaction: "pan" },
            { source: "pointer", button: 0, interaction: "rotate" },
            { source: "pointer", button: 2, interaction: "pan" },
            { source: "wheel", interaction: "zoom" },
            { source: "keyboard", key: [187, 107, 189, 109], interaction: "zoom" }, // +/-/numpad+/numpad-
            { source: "keyboard", modifiers: { ctrl: true }, interaction: "pan" },
            { source: "keyboard", modifiers: { alt: true }, interaction: "zoom" },
            { source: "keyboard", interaction: "rotate" },
        ];
    }
}
//# sourceMappingURL=arcRotateCameraMovement.js.map