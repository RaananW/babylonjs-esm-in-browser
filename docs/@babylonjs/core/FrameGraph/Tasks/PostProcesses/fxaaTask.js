import { ThinFXAAPostProcess } from "../../../PostProcesses/thinFXAAPostProcess.js";
import { FrameGraphPostProcessTask } from "./postProcessTask.js";
/**
 * Task which applies a FXAA post process.
 */
export class FrameGraphFXAATask extends FrameGraphPostProcessTask {
    /**
     * Constructs a new FXAA task.
     * @param name The name of the task.
     * @param frameGraph The frame graph this task is associated with.
     * @param thinPostProcess The thin post process to use for the FXAA effect. If not provided, a new one will be created.
     */
    constructor(name, frameGraph, thinPostProcess) {
        super(name, frameGraph, thinPostProcess || new ThinFXAAPostProcess(name, frameGraph.engine));
    }
    getClassName() {
        return "FrameGraphFXAATask";
    }
    record(skipCreationOfDisabledPasses = false, additionalExecute, additionalBindings) {
        const pass = super.record(skipCreationOfDisabledPasses, additionalExecute, additionalBindings);
        this.postProcess.texelSize.x = 1 / this._sourceWidth;
        this.postProcess.texelSize.y = 1 / this._sourceHeight;
        return pass;
    }
}
//# sourceMappingURL=fxaaTask.js.map