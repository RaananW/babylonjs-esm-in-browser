import { FrameGraphPostProcessTask } from "./postProcessTask.js";
import { ThinMotionBlurPostProcess } from "../../../PostProcesses/thinMotionBlurPostProcess.js";
/**
 * Task which applies a motion blur post process.
 */
export class FrameGraphMotionBlurTask extends FrameGraphPostProcessTask {
    /**
     * Constructs a new motion blur task.
     * @param name The name of the task.
     * @param frameGraph The frame graph this task belongs to.
     * @param thinPostProcess The thin post process to use for the task. If not provided, a new one will be created.
     */
    constructor(name, frameGraph, thinPostProcess) {
        super(name, frameGraph, thinPostProcess || new ThinMotionBlurPostProcess(name, frameGraph.scene));
    }
    getClassName() {
        return "FrameGraphMotionBlurTask";
    }
    record(skipCreationOfDisabledPasses = false) {
        if (this.sourceTexture === undefined) {
            throw new Error(`FrameGraphMotionBlurTask "${this.name}": sourceTexture is required`);
        }
        const pass = super.record(skipCreationOfDisabledPasses, undefined, (context) => {
            if (this.velocityTexture) {
                context.bindTextureHandle(this._postProcessDrawWrapper.effect, "velocitySampler", this.velocityTexture);
            }
            else if (this.postProcess.isObjectBased) {
                throw new Error(`FrameGraphMotionBlurTask "${this.name}": velocityTexture is required for object-based motion blur`);
            }
            if (this.depthTexture) {
                context.bindTextureHandle(this._postProcessDrawWrapper.effect, "depthSampler", this.depthTexture);
            }
            else if (!this.postProcess.isObjectBased) {
                throw new Error(`FrameGraphMotionBlurTask "${this.name}": depthTexture is required for screen-based motion blur`);
            }
        });
        pass.addDependencies(this.velocityTexture);
        pass.addDependencies(this.depthTexture);
        this.postProcess.textureWidth = this._sourceWidth;
        this.postProcess.textureHeight = this._sourceHeight;
        return pass;
    }
}
//# sourceMappingURL=motionBlurTask.js.map