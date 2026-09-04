import { Color4, TmpColors } from "../../../Maths/math.color.pure.js";
import { FrameGraphTaskMultiRenderTarget } from "../../frameGraphTaskMultiRenderTarget.js";
import { backbufferColorTextureHandle } from "../../frameGraphTypes.js";
/**
 * Task used to clear a texture.
 */
export class FrameGraphClearTextureTask extends FrameGraphTaskMultiRenderTarget {
    /**
     * Constructs a new clear task.
     * @param name The name of the task.
     * @param frameGraph The frame graph the task belongs to.
     */
    constructor(name, frameGraph) {
        super(name, frameGraph);
        /**
         * The color to clear the texture with.
         */
        this.color = new Color4(0.2, 0.2, 0.3, 1);
        /**
         * If the color should be cleared.
         */
        this.clearColor = true;
        /**
         * If the color should be converted to linear space (default: false).
         */
        this.convertColorToLinearSpace = false;
        /**
         * If the depth should be cleared.
         */
        this.clearDepth = false;
        /**
         * If the stencil should be cleared.
         */
        this.clearStencil = false;
        /**
         * The value to use to clear the stencil buffer (default: 0).
         */
        this.stencilValue = 0;
        this.outputTexture = this._frameGraph.textureManager.createDanglingHandle();
        this.outputDepthTexture = this._frameGraph.textureManager.createDanglingHandle();
    }
    getClassName() {
        return "FrameGraphClearTextureTask";
    }
    record(skipCreationOfDisabledPasses = false) {
        if (this.targetTexture === undefined && this.depthTexture === undefined) {
            throw new Error(`FrameGraphClearTextureTask ${this.name}: targetTexture and depthTexture can't both be undefined.`);
        }
        const textureManager = this._frameGraph.textureManager;
        const targetTextures = this.targetTexture !== undefined ? (Array.isArray(this.targetTexture) ? this.targetTexture : [this.targetTexture]) : undefined;
        if (this.targetTexture !== undefined) {
            textureManager.resolveDanglingHandle(this.outputTexture, targetTextures[0]);
        }
        if (this.depthTexture !== undefined) {
            textureManager.resolveDanglingHandle(this.outputDepthTexture, this.depthTexture);
        }
        if (this.targetTexture !== undefined && this.depthTexture !== undefined) {
            const targetDescription = textureManager.getTextureDescription(targetTextures[0]);
            const depthDescription = textureManager.getTextureDescription(this.depthTexture);
            if (targetDescription.size.width !== depthDescription.size.width || targetDescription.size.height !== depthDescription.size.height) {
                throw new Error(`FrameGraphClearTextureTask ${this.name}: the depth texture (size: ${depthDescription.size.width}x${depthDescription.size.height}) and the target texture (size: ${targetDescription.size.width}x${targetDescription.size.height}) must have the same dimensions.`);
            }
            const textureSamples = targetDescription.options.samples || 1;
            const depthSamples = depthDescription.options.samples || 1;
            if (textureSamples !== depthSamples && textureSamples !== 0 && depthSamples !== 0) {
                throw new Error(`FrameGraphClearTextureTask ${this.name}: the depth texture (${depthSamples} samples) and the target texture (${textureSamples} samples) must have the same number of samples.`);
            }
        }
        const attachments = this._frameGraph.engine.buildTextureLayout(targetTextures ? Array(targetTextures.length).fill(true) : [], this.targetTexture === backbufferColorTextureHandle && !this._frameGraph.textureManager.backBufferTextureOverriden);
        const color = TmpColors.Color4[0];
        const pass = this._frameGraph.addRenderPass(this.name);
        pass.setRenderTarget(targetTextures);
        pass.setRenderTargetDepth(this.depthTexture);
        pass.setInitializeFunc(() => {
            const renderTargetWrapper = pass.frameGraphRenderTarget.renderTargetWrapper;
            if (renderTargetWrapper) {
                renderTargetWrapper.disableAutomaticMSAAResolve = true;
            }
        });
        pass.setExecuteFunc((context) => {
            this._updateLayerAndFaceIndices(pass);
            color.copyFrom(this.color);
            if (this.convertColorToLinearSpace) {
                color.toLinearSpaceToRef(color);
            }
            context.clearAttachments(color, attachments, !!this.clearColor, !!this.clearDepth, !!this.clearStencil, this.stencilValue);
        });
        if (!skipCreationOfDisabledPasses) {
            const passDisabled = this._frameGraph.addRenderPass(this.name + "_disabled", true);
            passDisabled.setRenderTarget(targetTextures);
            passDisabled.setRenderTargetDepth(this.depthTexture);
            passDisabled.setExecuteFunc((_context) => { });
        }
        return pass;
    }
}
//# sourceMappingURL=clearTextureTask.js.map