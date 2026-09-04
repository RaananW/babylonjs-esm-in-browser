import { FrameGraphTask } from "../../frameGraphTask.js";
import { UtilityLayerRenderer } from "../../../Rendering/utilityLayerRenderer.js";
/**
 * Task used to render an utility layer.
 */
export class FrameGraphUtilityLayerRendererTask extends FrameGraphTask {
    /**
     * The camera used to render the utility layer.
     */
    get camera() {
        return this._camera;
    }
    set camera(value) {
        this._camera = value;
        this.layer.setRenderCamera(value);
        this.layer.utilityLayerScene.activeCamera = value;
    }
    /**
     * Creates a new utility layer renderer task.
     * @param name The name of the task.
     * @param frameGraph The frame graph the task belongs to.
     * @param scene The scene the task belongs to.
     * @param handleEvents If the utility layer should handle events.
     */
    constructor(name, frameGraph, scene, handleEvents = true) {
        super(name, frameGraph);
        this.layer = new UtilityLayerRenderer(scene, handleEvents, true);
        this.layer.utilityLayerScene._useCurrentFrameBuffer = true;
        this.outputTexture = this._frameGraph.textureManager.createDanglingHandle();
    }
    getClassName() {
        return "FrameGraphUtilityLayerRendererTask";
    }
    record() {
        if (!this.targetTexture || !this.camera) {
            throw new Error(`FrameGraphUtilityLayerRendererTask "${this.name}": targetTexture and camera are required`);
        }
        this._frameGraph.textureManager.resolveDanglingHandle(this.outputTexture, this.targetTexture);
        const pass = this._frameGraph.addRenderPass(this.name);
        pass.setRenderTarget(this.outputTexture);
        pass.setExecuteFunc((context) => {
            context.render(this.layer);
        });
        const passDisabled = this._frameGraph.addRenderPass(this.name + "_disabled", true);
        passDisabled.setRenderTarget(this.outputTexture);
        passDisabled.setExecuteFunc((_context) => { });
    }
    dispose() {
        this.layer.dispose();
        super.dispose();
    }
}
//# sourceMappingURL=utilityLayerRendererTask.js.map