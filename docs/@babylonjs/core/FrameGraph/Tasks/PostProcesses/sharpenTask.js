import { FrameGraphPostProcessTask } from "./postProcessTask.js";
import { ThinSharpenPostProcess } from "../../../PostProcesses/thinSharpenPostProcess.js";
/**
 * Task which applies a sharpen post process.
 */
export class FrameGraphSharpenTask extends FrameGraphPostProcessTask {
    /**
     * Constructs a new sharpen task.
     * @param name The name of the task.
     * @param frameGraph The frame graph this task belongs to.
     * @param thinPostProcess The thin post process to use for the task. If not provided, a new one will be created.
     */
    constructor(name, frameGraph, thinPostProcess) {
        super(name, frameGraph, thinPostProcess || new ThinSharpenPostProcess(name, frameGraph.engine));
    }
    getClassName() {
        return "FrameGraphSharpenTask";
    }
    record(skipCreationOfDisabledPasses = false, additionalExecute, additionalBindings) {
        const pass = super.record(skipCreationOfDisabledPasses, additionalExecute, additionalBindings);
        this.postProcess.textureWidth = this._sourceWidth;
        this.postProcess.textureHeight = this._sourceHeight;
        return pass;
    }
}
//# sourceMappingURL=sharpenTask.js.map