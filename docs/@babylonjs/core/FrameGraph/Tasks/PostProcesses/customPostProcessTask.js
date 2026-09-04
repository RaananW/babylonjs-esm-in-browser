import { FrameGraphPostProcessTask } from "./postProcessTask.js";
import { ThinCustomPostProcess } from "../../../PostProcesses/thinCustomPostProcess.js";
/**
 * Task which applies a custom post process.
 */
export class FrameGraphCustomPostProcessTask extends FrameGraphPostProcessTask {
    /**
     * Constructs a new custom post process task.
     * @param name The name of the task.
     * @param frameGraph The frame graph this task is associated with.
     * @param options Options to configure the post process
     */
    constructor(name, frameGraph, options) {
        super(name, frameGraph, new ThinCustomPostProcess(name, frameGraph.engine, options));
        this.onApplyObservable = this.postProcess.onBindObservable;
    }
    getClassName() {
        return "FrameGraphCustomPostProcessTask";
    }
}
//# sourceMappingURL=customPostProcessTask.js.map