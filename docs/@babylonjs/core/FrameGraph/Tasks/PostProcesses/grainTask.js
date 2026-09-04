import { ThinGrainPostProcess } from "../../../PostProcesses/thinGrainPostProcess.js";
import { FrameGraphPostProcessTask } from "./postProcessTask.js";
/**
 * Task which applies a grain post process.
 */
export class FrameGraphGrainTask extends FrameGraphPostProcessTask {
    /**
     * Constructs a new grain task.
     * @param name The name of the task.
     * @param frameGraph The frame graph this task is associated with.
     * @param thinPostProcess The thin post process to use for the grain effect. If not provided, a new one will be created.
     */
    constructor(name, frameGraph, thinPostProcess) {
        super(name, frameGraph, thinPostProcess || new ThinGrainPostProcess(name, frameGraph.engine));
    }
    getClassName() {
        return "FrameGraphGrainTask";
    }
}
//# sourceMappingURL=grainTask.js.map