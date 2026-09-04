import { FrameGraphPostProcessTask } from "./postProcessTask.js";
import { ThinImageProcessingPostProcess } from "../../../PostProcesses/thinImageProcessingPostProcess.js";
/**
 * Task which applies an image processing post process.
 */
export class FrameGraphImageProcessingTask extends FrameGraphPostProcessTask {
    /**
     * Constructs a new image processing task.
     * @param name The name of the task.
     * @param frameGraph The frame graph this task belongs to.
     * @param thinPostProcess The thin post process to use for the task. If not provided, a new one will be created.
     */
    constructor(name, frameGraph, thinPostProcess) {
        super(name, frameGraph, thinPostProcess || new ThinImageProcessingPostProcess(name, frameGraph.engine));
    }
    getClassName() {
        return "FrameGraphImageProcessingTask";
    }
    record(skipCreationOfDisabledPasses = false, additionalExecute, additionalBindings) {
        const pass = super.record(skipCreationOfDisabledPasses, additionalExecute, additionalBindings);
        this.postProcess.outputTextureWidth = this._outputWidth;
        this.postProcess.outputTextureHeight = this._outputHeight;
        return pass;
    }
}
//# sourceMappingURL=imageProcessingTask.js.map