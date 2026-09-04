import { FrameGraphPostProcessTask } from "./postProcessTask.js";
import { ThinConvolutionPostProcess } from "../../../PostProcesses/thinConvolutionPostProcess.js";
/**
 * Task which applies a convolution post process.
 */
export class FrameGraphConvolutionTask extends FrameGraphPostProcessTask {
    /**
     * Constructs a new convolution task.
     * @param name The name of the task.
     * @param frameGraph The frame graph this task belongs to.
     * @param thinPostProcess The thin post process to use for the task. If not provided, a new one will be created.
     */
    constructor(name, frameGraph, thinPostProcess) {
        super(name, frameGraph, thinPostProcess || new ThinConvolutionPostProcess(name, frameGraph.engine, ThinConvolutionPostProcess.EmbossKernel));
    }
    getClassName() {
        return "FrameGraphConvolutionTask";
    }
    record(skipCreationOfDisabledPasses = false, additionalExecute, additionalBindings) {
        const pass = super.record(skipCreationOfDisabledPasses, additionalExecute, additionalBindings);
        this.postProcess.textureWidth = this._sourceWidth;
        this.postProcess.textureHeight = this._sourceHeight;
        return pass;
    }
}
//# sourceMappingURL=convolutionTask.js.map