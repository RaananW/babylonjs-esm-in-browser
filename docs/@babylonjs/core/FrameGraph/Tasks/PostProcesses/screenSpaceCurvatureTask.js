import { FrameGraphPostProcessTask } from "./postProcessTask.js";
import { ThinScreenSpaceCurvaturePostProcess } from "../../../PostProcesses/thinScreenSpaceCurvaturePostProcess.js";
/**
 * Task which applies a screen space curvature post process.
 */
export class FrameGraphScreenSpaceCurvatureTask extends FrameGraphPostProcessTask {
    /**
     * Constructs a new circle of confusion task.
     * @param name The name of the task.
     * @param frameGraph The frame graph this task belongs to.
     * @param thinPostProcess The thin post process to use for the task. If not provided, a new one will be created.
     */
    constructor(name, frameGraph, thinPostProcess) {
        super(name, frameGraph, thinPostProcess || new ThinScreenSpaceCurvaturePostProcess(name, frameGraph.engine));
    }
    getClassName() {
        return "FrameGraphScreenSpaceCurvatureTask";
    }
    record(skipCreationOfDisabledPasses = false) {
        if (this.sourceTexture === undefined || this.normalTexture === undefined) {
            throw new Error(`FrameGraphScreenSpaceCurvatureTask "${this.name}": sourceTexture and normalTexture are required`);
        }
        const pass = super.record(skipCreationOfDisabledPasses, undefined, (context) => {
            context.bindTextureHandle(this._postProcessDrawWrapper.effect, "normalSampler", this.normalTexture);
        });
        pass.addDependencies(this.normalTexture);
        return pass;
    }
}
//# sourceMappingURL=screenSpaceCurvatureTask.js.map