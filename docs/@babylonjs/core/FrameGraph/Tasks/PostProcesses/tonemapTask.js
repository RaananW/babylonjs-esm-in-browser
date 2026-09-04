import { ThinTonemapPostProcess } from "../../../PostProcesses/thinTonemapPostProcess.js";
import { FrameGraphPostProcessTask } from "./postProcessTask.js";
/**
 * Task which applies a tonemap post process.
 */
export class FrameGraphTonemapTask extends FrameGraphPostProcessTask {
    /**
     * Constructs a new tonemap task.
     * @param name The name of the task.
     * @param frameGraph The frame graph this task is associated with.
     * @param thinPostProcess The thin post process to use for the tonemap effect. If not provided, a new one will be created.
     */
    constructor(name, frameGraph, thinPostProcess) {
        super(name, frameGraph, thinPostProcess || new ThinTonemapPostProcess(name, frameGraph.engine));
    }
    getClassName() {
        return "FrameGraphTonemapTask";
    }
}
//# sourceMappingURL=tonemapTask.js.map