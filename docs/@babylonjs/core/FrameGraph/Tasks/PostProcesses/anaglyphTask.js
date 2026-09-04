import { ThinAnaglyphPostProcess } from "../../../PostProcesses/thinAnaglyphPostProcess.js";
import { FrameGraphPostProcessTask } from "./postProcessTask.js";
/**
 * Task which applies an anaglyph post process.
 */
export class FrameGraphAnaglyphTask extends FrameGraphPostProcessTask {
    /**
     * Constructs a new anaglyph task.
     * @param name The name of the task.
     * @param frameGraph The frame graph this task is associated with.
     * @param thinPostProcess The thin post process to use for the anaglyph effect. If not provided, a new one will be created.
     */
    constructor(name, frameGraph, thinPostProcess) {
        super(name, frameGraph, thinPostProcess || new ThinAnaglyphPostProcess(name, frameGraph.engine));
    }
    getClassName() {
        return "FrameGraphAnaglyphTask";
    }
    record(skipCreationOfDisabledPasses = false) {
        if (this.sourceTexture === undefined || this.leftTexture === undefined) {
            throw new Error(`FrameGraphAnaglyphTask "${this.name}": sourceTexture and leftTexture are required`);
        }
        const pass = super.record(skipCreationOfDisabledPasses, undefined, (context) => {
            context.bindTextureHandle(this._postProcessDrawWrapper.effect, "leftSampler", this.leftTexture);
        });
        pass.addDependencies(this.leftTexture);
        return pass;
    }
}
//# sourceMappingURL=anaglyphTask.js.map