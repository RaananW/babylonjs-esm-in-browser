import { ThinDepthOfFieldMergePostProcess } from "../../../PostProcesses/thinDepthOfFieldMergePostProcess.js";
import { FrameGraphPostProcessTask } from "./postProcessTask.js";

/**
 * @internal
 */
export class FrameGraphDepthOfFieldMergeTask extends FrameGraphPostProcessTask {
    constructor(name, frameGraph, thinPostProcess) {
        super(name, frameGraph, thinPostProcess || new ThinDepthOfFieldMergePostProcess(name, frameGraph.engine));
        this.blurSteps = [];
    }
    getClassName() {
        return "FrameGraphDepthOfFieldMergeTask";
    }
    record(skipCreationOfDisabledPasses = false) {
        if (this.sourceTexture === undefined || this.circleOfConfusionTexture === undefined || this.blurSteps.length === 0) {
            throw new Error(`FrameGraphBloomMergeTask "${this.name}": sourceTexture, circleOfConfusionTexture and blurSteps are required`);
        }
        this.postProcess.updateEffect("#define BLUR_LEVEL " + (this.blurSteps.length - 1) + "\n");
        const pass = super.record(skipCreationOfDisabledPasses, (context) => {
            context.setTextureSamplingMode(this.blurSteps[this.blurSteps.length - 1], 2);
        }, (context) => {
            context.bindTextureHandle(this._postProcessDrawWrapper.effect, "circleOfConfusionSampler", this.circleOfConfusionTexture);
            for (let i = 0; i < this.blurSteps.length; i++) {
                const handle = this.blurSteps[i];
                context.bindTextureHandle(this._postProcessDrawWrapper.effect, "blurStep" + (this.blurSteps.length - i - 1), handle);
            }
        });
        pass.addDependencies(this.circleOfConfusionTexture);
        pass.addDependencies(this.blurSteps);
        return pass;
    }
}
//# sourceMappingURL=depthOfFieldMergeTask.js.map