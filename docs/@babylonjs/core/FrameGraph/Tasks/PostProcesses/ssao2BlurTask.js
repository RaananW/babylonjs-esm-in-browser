
import { FrameGraphPostProcessTask } from "./postProcessTask.js";
import { ThinSSAO2BlurPostProcess } from "../../../PostProcesses/thinSSAO2BlurPostProcess.js";
/**
 * @internal
 */
export class FrameGraphSSAO2BlurTask extends FrameGraphPostProcessTask {
    constructor(name, frameGraph, _isHorizontal, thinPostProcess) {
        super(name, frameGraph, thinPostProcess || new ThinSSAO2BlurPostProcess(name, frameGraph.engine, _isHorizontal));
        this._isHorizontal = _isHorizontal;
    }
    getClassName() {
        return "FrameGraphSSAO2BlurTask";
    }
    record(skipCreationOfDisabledPasses = false) {
        if (this.sourceTexture === undefined || this.depthTexture === undefined) {
            throw new Error(`FrameGraphSSAO2BlurTask "${this.name}": sourceTexture and depthTexture are required`);
        }
        const pass = super.record(skipCreationOfDisabledPasses, (context) => {
            context.setTextureSamplingMode(this.depthTexture, 2);
        }, (context) => {
            context.bindTextureHandle(this._postProcessDrawWrapper.effect, "depthSampler", this.depthTexture);
        });
        this.postProcess.textureSize = this._isHorizontal ? this._outputWidth : this._outputHeight;
        return pass;
    }
}
//# sourceMappingURL=ssao2BlurTask.js.map