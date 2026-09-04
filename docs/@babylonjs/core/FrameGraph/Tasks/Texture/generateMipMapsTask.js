import { FrameGraphTask } from "../../frameGraphTask.js";
/**
 * Task which generates mipmaps for a texture.
 */
export class FrameGraphGenerateMipMapsTask extends FrameGraphTask {
    /**
     * Constructs a new FrameGraphGenerateMipMapsTask.
     * @param name The name of the task.
     * @param frameGraph The frame graph the task belongs to.
     */
    constructor(name, frameGraph) {
        super(name, frameGraph);
        this.outputTexture = this._frameGraph.textureManager.createDanglingHandle();
    }
    getClassName() {
        return "FrameGraphGenerateMipMapsTask";
    }
    record() {
        if (this.targetTexture === undefined) {
            throw new Error(`FrameGraphGenerateMipMapsTask ${this.name}: targetTexture is required`);
        }
        this._frameGraph.textureManager.resolveDanglingHandle(this.outputTexture, this.targetTexture);
        const outputTextureDescription = this._frameGraph.textureManager.getTextureDescription(this.targetTexture);
        if (!outputTextureDescription.options.createMipMaps) {
            throw new Error(`FrameGraphGenerateMipMapsTask ${this.name}: targetTexture must have createMipMaps set to true`);
        }
        const pass = this._frameGraph.addRenderPass(this.name);
        pass.setRenderTarget(this.outputTexture);
        pass.setExecuteFunc((context) => {
            context.generateMipMaps();
        });
        const passDisabled = this._frameGraph.addRenderPass(this.name + "_disabled", true);
        passDisabled.setRenderTarget(this.outputTexture);
        passDisabled.setExecuteFunc((_context) => { });
    }
}
//# sourceMappingURL=generateMipMapsTask.js.map