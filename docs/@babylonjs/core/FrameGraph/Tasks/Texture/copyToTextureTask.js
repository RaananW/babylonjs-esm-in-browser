import { FrameGraphTask } from "../../frameGraphTask.js";

import { IsDepthTexture } from "../../../Materials/Textures/textureHelper.functions.js";
/**
 * Task used to copy a texture to another texture.
 */
export class FrameGraphCopyToTextureTask extends FrameGraphTask {
    /**
     * Constructs a new FrameGraphCopyToTextureTask.
     * @param name The name of the task.
     * @param frameGraph The frame graph the task belongs to.
     */
    constructor(name, frameGraph) {
        super(name, frameGraph);
        /**
         * The LOD level to copy from the source texture (default: 0).
         */
        this.lodLevel = 0;
        this.outputTexture = this._frameGraph.textureManager.createDanglingHandle();
    }
    getClassName() {
        return "FrameGraphCopyToTextureTask";
    }
    record() {
        if (this.sourceTexture === undefined || this.targetTexture === undefined) {
            throw new Error(`FrameGraphCopyToTextureTask "${this.name}": sourceTexture and targetTexture are required`);
        }
        this._frameGraph.textureManager.resolveDanglingHandle(this.outputTexture, this.targetTexture);
        const pass = this._frameGraph.addRenderPass(this.name);
        const passDisabled = this._frameGraph.addRenderPass(this.name + "_disabled", true);
        pass.addDependencies(this.sourceTexture);
        passDisabled.addDependencies(this.sourceTexture);
        const textureDescription = this._frameGraph.textureManager.getTextureDescription(this.targetTexture);
        const targetIsDepthTexture = IsDepthTexture(textureDescription.options.formats[0]);
        if (targetIsDepthTexture) {
            pass.setRenderTargetDepth(this.outputTexture);
            passDisabled.setRenderTargetDepth(this.outputTexture);
        }
        else {
            pass.setRenderTarget(this.outputTexture);
            passDisabled.setRenderTarget(this.outputTexture);
        }
        pass.setExecuteFunc((context) => {
            if (this.viewport) {
                context.setViewport(this.viewport);
            }
            context.setTextureSamplingMode(this.sourceTexture, targetIsDepthTexture
                ? 1
                : this.lodLevel > 0
                    ? 3
                    : 2);
            context.copyTexture(this.sourceTexture, undefined, this.viewport !== undefined, this.lodLevel);
        });
        passDisabled.setExecuteFunc((_context) => { });
    }
}
//# sourceMappingURL=copyToTextureTask.js.map