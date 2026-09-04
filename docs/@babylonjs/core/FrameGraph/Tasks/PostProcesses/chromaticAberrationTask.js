import { ThinChromaticAberrationPostProcess } from "../../../PostProcesses/thinChromaticAberrationPostProcess.js";
import { FrameGraphPostProcessTask } from "./postProcessTask.js";
/**
 * Task which applies a chromatic aberration post process.
 */
export class FrameGraphChromaticAberrationTask extends FrameGraphPostProcessTask {
    /**
     * Constructs a new chromatic aberration task.
     * @param name The name of the task.
     * @param frameGraph The frame graph this task is associated with.
     * @param thinPostProcess The thin post process to use for the chromatic aberration effect. If not provided, a new one will be created.
     */
    constructor(name, frameGraph, thinPostProcess) {
        super(name, frameGraph, thinPostProcess || new ThinChromaticAberrationPostProcess(name, frameGraph.engine));
    }
    getClassName() {
        return "FrameGraphChromaticAberrationTask";
    }
    record(skipCreationOfDisabledPasses = false, additionalExecute, additionalBindings) {
        const pass = super.record(skipCreationOfDisabledPasses, additionalExecute, additionalBindings);
        this.postProcess.screenWidth = this._sourceWidth;
        this.postProcess.screenHeight = this._sourceHeight;
        return pass;
    }
}
//# sourceMappingURL=chromaticAberrationTask.js.map