import { ThinTAAPostProcess } from "../../../PostProcesses/thinTAAPostProcess.js";
import { FrameGraphPostProcessTask } from "./postProcessTask.js";

/**
 * Task which applies a Temporal Anti-Aliasing post process.
 */
export class FrameGraphTAATask extends FrameGraphPostProcessTask {
    /**
     * Constructs a new Temporal Anti-Aliasing task.
     * @param name The name of the task.
     * @param frameGraph The frame graph this task is associated with.
     * @param thinPostProcess The thin post process to use for the Temporal Anti-Aliasing effect. If not provided, a new one will be created.
     */
    constructor(name, frameGraph, thinPostProcess) {
        super(name, frameGraph, thinPostProcess || new ThinTAAPostProcess(name, frameGraph.scene));
    }
    getClassName() {
        return "FrameGraphTAATask";
    }
    record() {
        if (this.sourceTexture === undefined || this.objectRendererTask === undefined) {
            throw new Error(`FrameGraphPostProcessTask "${this.name}": sourceTexture and objectRendererTask are required`);
        }
        this._frameGraph.scene.onBeforeRenderObservable.remove(this._onBeforeRenderSceneObserver);
        this._onBeforeRenderSceneObserver = this._frameGraph.scene.onBeforeRenderObservable.add(() => {
            if (this.postProcess.reprojectHistory && !this.disabled) {
                this.postProcess._updateJitter();
            }
        });
        const objectRenderer = this.objectRendererTask.objectRenderer;
        objectRenderer.onInitRenderingObservable.remove(this._initRenderingObserver);
        this._initRenderingObserver = objectRenderer.onInitRenderingObservable.add(() => {
            if (!this.postProcess.reprojectHistory && !this.disabled) {
                this.postProcess._updateJitter();
                // We pass false to this.camera.getProjectionMatrix() when TAA is enabled to avoid overwriting the projection matrix calculated by the call to this.postProcess.updateJitter()
                const camera = objectRenderer.activeCamera;
                this._frameGraph.scene.setTransformMatrix(camera.getViewMatrix(), camera.getProjectionMatrix(this.postProcess.disabled));
            }
        });
        const textureManager = this._frameGraph.textureManager;
        const sourceSize = textureManager.getTextureAbsoluteDimensions(this.sourceTexture);
        this._sourceWidth = this._outputWidth = sourceSize.width;
        this._sourceHeight = this._outputHeight = sourceSize.height;
        const renderTextureSize = textureManager.getTextureAbsoluteDimensions(this.objectRendererTask.outputTexture);
        this.postProcess.textureWidth = renderTextureSize.width;
        this.postProcess.textureHeight = renderTextureSize.height;
        const pingPongTextureCreationOptions = {
            size: sourceSize,
            options: {
                createMipMaps: false,
                types: [2],
                formats: [5],
                samples: 1,
                useSRGBBuffers: [false],
                creationFlags: [0],
                labels: [""],
            },
            sizeIsPercentage: false,
            isHistoryTexture: true,
        };
        const pingPongHandle = textureManager.createRenderTargetTexture(`${this.name} history`, pingPongTextureCreationOptions);
        textureManager.resolveDanglingHandle(this.outputTexture, pingPongHandle);
        const pass = this._frameGraph.addRenderPass(this.name);
        pass.depthReadOnly = this.depthReadOnly;
        pass.stencilReadOnly = this.stencilReadOnly;
        pass.addDependencies(this.sourceTexture);
        pass.setRenderTarget(this.outputTexture);
        pass.setRenderTargetDepth(this.depthAttachmentTexture);
        pass.setExecuteFunc((context) => {
            objectRenderer.dontSetTransformationMatrix = !this.postProcess.reprojectHistory;
            this.postProcess.camera = objectRenderer.activeCamera;
            if (this.sourceTexture !== undefined) {
                context.setTextureSamplingMode(this.sourceTexture, this.sourceSamplingMode);
            }
            if (this.velocityTexture !== undefined) {
                context.setTextureSamplingMode(this.velocityTexture, 2);
            }
            context.setTextureSamplingMode(pingPongHandle, 2);
            context.applyFullScreenEffect(this._postProcessDrawWrapper, () => {
                context.bindTextureHandle(this._postProcessDrawWrapper.effect, "textureSampler", this.sourceTexture);
                context.bindTextureHandle(this._postProcessDrawWrapper.effect, "historySampler", pingPongHandle);
                if (this.postProcess.reprojectHistory && this.velocityTexture !== undefined) {
                    context.bindTextureHandle(this._postProcessDrawWrapper.effect, "velocitySampler", this.velocityTexture);
                }
                this.postProcess.bind();
            }, this.stencilState, this.disableColorWrite, this.drawBackFace, this.depthTest);
        });
        const passDisabled = this._frameGraph.addRenderPass(this.name + "_disabled", true);
        passDisabled.depthReadOnly = this.depthReadOnly;
        passDisabled.stencilReadOnly = this.stencilReadOnly;
        passDisabled.addDependencies(this.sourceTexture);
        passDisabled.setRenderTarget(this.outputTexture);
        passDisabled.setRenderTargetDepth(this.depthAttachmentTexture);
        passDisabled.setExecuteFunc((context) => {
            context.copyTexture(this.sourceTexture);
        });
        return pass;
    }
    dispose() {
        this.objectRendererTask?.objectRenderer.onInitRenderingObservable.remove(this._initRenderingObserver);
        this._frameGraph.scene.onBeforeRenderObservable.remove(this._onBeforeRenderSceneObserver);
        super.dispose();
    }
}
//# sourceMappingURL=taaTask.js.map