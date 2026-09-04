
import { FrameGraphPostProcessTask } from "./postProcessTask.js";
import { ThinSSAO2PostProcess } from "../../../PostProcesses/thinSSAO2PostProcess.js";
/**
 * @internal
 */
export class FrameGraphSSAO2Task extends FrameGraphPostProcessTask {
    constructor(name, frameGraph, thinPostProcess) {
        super(name, frameGraph, thinPostProcess || new ThinSSAO2PostProcess(name, frameGraph.scene));
        this._currentCameraMode = -1;
    }
    getClassName() {
        return "FrameGraphSSAO2Task";
    }
    record(skipCreationOfDisabledPasses = false) {
        if (this.sourceTexture === undefined || this.depthTexture === undefined || this.normalTexture === undefined || this.camera === undefined) {
            throw new Error(`FrameGraphSSAO2Task "${this.name}": sourceTexture, depthTexture, normalTexture and camera are required`);
        }
        this._currentCameraMode = this.camera.mode;
        this.postProcess.updateEffect();
        const pass = super.record(skipCreationOfDisabledPasses, (context) => {
            this.postProcess.camera = this.camera;
            if (this._currentCameraMode !== this.camera.mode) {
                this._currentCameraMode = this.camera.mode;
                this.postProcess.updateEffect();
            }
            context.setTextureSamplingMode(this.depthTexture, 2);
            context.setTextureSamplingMode(this.normalTexture, 2);
        }, (context) => {
            context.bindTextureHandle(this._postProcessDrawWrapper.effect, "depthSampler", this.depthTexture);
            context.bindTextureHandle(this._postProcessDrawWrapper.effect, "normalSampler", this.normalTexture);
        });
        pass.addDependencies([this.depthTexture]);
        this.postProcess.textureWidth = this._sourceWidth;
        this.postProcess.textureHeight = this._sourceHeight;
        return pass;
    }
}
//# sourceMappingURL=ssao2Task.js.map