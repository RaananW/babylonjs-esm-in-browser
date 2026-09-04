import { ThinColorCorrectionPostProcess } from "../../../PostProcesses/thinColorCorrectionPostProcess.js";
import { FrameGraphPostProcessTask } from "./postProcessTask.js";
/**
 * Task which applies a color correction post process.
 */
export class FrameGraphColorCorrectionTask extends FrameGraphPostProcessTask {
    /**
     * Constructs a new color correction task.
     * @param name The name of the task.
     * @param frameGraph The frame graph this task is associated with.
     * @param colorTableUrl The URL of the color table to use for the color correction effect.
     * @param thinPostProcess The thin post process to use for the color correction effect. If not provided, a new one will be created.
     */
    constructor(name, frameGraph, colorTableUrl, thinPostProcess) {
        super(name, frameGraph, thinPostProcess || new ThinColorCorrectionPostProcess(name, frameGraph.scene, colorTableUrl));
    }
    getClassName() {
        return "FrameGraphColorCorrectionTask";
    }
}
//# sourceMappingURL=colorCorrectionTask.js.map