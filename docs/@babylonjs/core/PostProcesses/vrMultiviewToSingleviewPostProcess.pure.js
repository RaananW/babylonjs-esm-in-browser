/** This file must only contain pure code and pure imports */
import { Texture } from "../Materials/Textures/texture.pure.js";
import { PostProcess } from "./postProcess.pure.js";
import { RegisterEngineMultiview } from "../Engines/Extensions/engine.multiview.pure.js";
/**
 * VRMultiviewToSingleview used to convert multiview texture arrays to standard textures for scenarios such as webVR
 * This will not be used for webXR as it supports displaying texture arrays directly
 */
export class VRMultiviewToSingleviewPostProcess extends PostProcess {
    /**
     * Gets a string identifying the name of the class
     * @returns "VRMultiviewToSingleviewPostProcess" string
     */
    getClassName() {
        return "VRMultiviewToSingleviewPostProcess";
    }
    /**
     * Initializes a VRMultiviewToSingleview
     * @param name name of the post process
     * @param camera camera to be applied to
     * @param scaleFactor scaling factor to the size of the output texture
     */
    constructor(name, camera, scaleFactor) {
        super(name, "vrMultiviewToSingleview", ["imageIndex"], ["multiviewSampler"], scaleFactor, camera, Texture.BILINEAR_SAMPLINGMODE);
        RegisterEngineMultiview();
        const cam = camera ?? this.getCamera();
        this.onSizeChangedObservable.add(() => { });
        this.onApplyObservable.add((effect) => {
            if (cam._scene.activeCamera && cam._scene.activeCamera.isLeftCamera) {
                effect.setInt("imageIndex", 0);
            }
            else {
                effect.setInt("imageIndex", 1);
            }
            effect.setTexture("multiviewSampler", cam._multiviewTexture);
        });
    }
}
//# sourceMappingURL=vrMultiviewToSingleviewPostProcess.pure.js.map