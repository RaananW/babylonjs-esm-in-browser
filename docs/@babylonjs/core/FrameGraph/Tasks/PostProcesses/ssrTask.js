
import { FrameGraphPostProcessTask } from "./postProcessTask.js";
import { ThinSSRPostProcess } from "../../../PostProcesses/thinSSRPostProcess.js";
/**
 * @internal
 */
export class FrameGraphSSRTask extends FrameGraphPostProcessTask {
    constructor(name, frameGraph, thinPostProcess) {
        super(name, frameGraph, thinPostProcess || new ThinSSRPostProcess(name, frameGraph.scene));
    }
    getClassName() {
        return "FrameGraphSSRTask";
    }
    record(skipCreationOfDisabledPasses = false) {
        if (this.sourceTexture === undefined ||
            this.normalTexture === undefined ||
            this.depthTexture === undefined ||
            this.reflectivityTexture === undefined ||
            this.camera === undefined) {
            throw new Error(`FrameGraphSSRTask "${this.name}": sourceTexture, normalTexture, depthTexture, reflectivityTexture and camera are required`);
        }
        const pass = super.record(skipCreationOfDisabledPasses, (context) => {
            this.postProcess.camera = this.camera;
            context.setTextureSamplingMode(this.normalTexture, 2);
            context.setTextureSamplingMode(this.depthTexture, 2);
            context.setTextureSamplingMode(this.reflectivityTexture, 2);
            if (this.backDepthTexture) {
                context.setTextureSamplingMode(this.backDepthTexture, 1);
            }
        }, (context) => {
            context.bindTextureHandle(this._postProcessDrawWrapper.effect, "normalSampler", this.normalTexture);
            context.bindTextureHandle(this._postProcessDrawWrapper.effect, "depthSampler", this.depthTexture);
            context.bindTextureHandle(this._postProcessDrawWrapper.effect, "reflectivitySampler", this.reflectivityTexture);
            if (this.backDepthTexture) {
                context.bindTextureHandle(this._postProcessDrawWrapper.effect, "backDepthSampler", this.backDepthTexture);
            }
            if (this.postProcess.enableAutomaticThicknessComputation) {
                this._postProcessDrawWrapper.effect.setFloat("backSizeFactor", 1);
            }
        });
        pass.addDependencies([this.normalTexture, this.depthTexture, this.reflectivityTexture]);
        this.postProcess.textureWidth = this._sourceWidth;
        this.postProcess.textureHeight = this._sourceHeight;
        return pass;
    }
}
//# sourceMappingURL=ssrTask.js.map