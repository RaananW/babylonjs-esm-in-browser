import { ThinBlurPostProcess } from "../../../PostProcesses/thinBlurPostProcess.js";
import { FrameGraphPostProcessTask } from "./postProcessTask.js";
import { Vector2 } from "../../../Maths/math.vector.pure.js";
/**
 * Task which applies a blur post process.
 */
export class FrameGraphBlurTask extends FrameGraphPostProcessTask {
    /**
     * Constructs a new blur task.
     * @param name Name of the task.
     * @param frameGraph Frame graph this task is associated with.
     * @param thinPostProcess The thin post process to use for the blur effect.
     */
    constructor(name, frameGraph, thinPostProcess) {
        super(name, frameGraph, thinPostProcess || new ThinBlurPostProcess(name, frameGraph.engine, new Vector2(1, 0), 10));
    }
    getClassName() {
        return "FrameGraphBlurTask";
    }
    /**
     * Records the blur task into the frame graph.
     * @param skipCreationOfDisabledPasses defines whether disabled passes should be skipped
     * @param additionalExecute defines an optional callback executed by the pass
     * @param additionalBindings defines an optional callback used to bind extra resources
     * @returns the recorded render pass
     */
    record(skipCreationOfDisabledPasses = false, additionalExecute, additionalBindings) {
        const pass = super.record(skipCreationOfDisabledPasses, additionalExecute, additionalBindings);
        this.postProcess.textureWidth = this._outputWidth; // should be _sourceWidth, but to avoid a breaking change, we use _outputWidth (BlurPostProcess uses _outputTexture to get width/height)
        this.postProcess.textureHeight = this._outputHeight; // same as above for height
        return pass;
    }
}
//# sourceMappingURL=blurTask.js.map