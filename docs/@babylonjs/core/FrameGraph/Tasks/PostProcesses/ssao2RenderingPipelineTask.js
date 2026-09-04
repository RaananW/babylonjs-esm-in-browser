
import { FrameGraphTask } from "../../frameGraphTask.js";
import { ThinSSAO2RenderingPipeline } from "../../../PostProcesses/RenderPipeline/Pipelines/thinSSAO2RenderingPipeline.js";
import { FrameGraphSSAO2Task } from "./ssao2Task.js";
import { FrameGraphSSAO2BlurTask } from "./ssao2BlurTask.js";
import { FrameGraphPostProcessTask } from "./postProcessTask.js";
/**
 * Task which applies a SSAO2 post process.
 */
export class FrameGraphSSAO2RenderingPipelineTask extends FrameGraphTask {
    /**
     * The alpha mode to use when applying the SSAO2 effect.
     */
    get alphaMode() {
        return this._ssaoCombine.alphaMode;
    }
    set alphaMode(mode) {
        this._ssaoCombine.alphaMode = mode;
    }
    /**
     * The camera used to render the scene.
     */
    get camera() {
        return this._camera;
    }
    set camera(camera) {
        if (camera === this._camera) {
            return;
        }
        this._camera = camera;
        this.ssao.camera = camera;
        if (this._ssao) {
            this._ssao.camera = camera;
        }
    }
    /**
     * The name of the task.
     */
    get name() {
        return this._name;
    }
    set name(name) {
        this._name = name;
        if (this._ssao) {
            this._ssao.name = `${name} SSAO2 main`;
        }
        if (this._ssaoBlurX) {
            this._ssaoBlurX.name = `${name} SSAO2 Blur X`;
        }
        if (this._ssaoBlurY) {
            this._ssaoBlurY.name = `${name} SSAO2 Blur Y`;
        }
        if (this._ssaoCombine) {
            this._ssaoCombine.name = `${name} SSAO2 Combine`;
        }
    }
    /**
     * Constructs a SSAO2 rendering pipeline task.
     * @param name The name of the task.
     * @param frameGraph The frame graph this task belongs to.
     * @param ratioSSAO The ratio between the SSAO texture size and the source texture size
     * @param ratioBlur The ratio between the SSAO blur texture size and the source texture size
     * @param textureType The texture type used by the different post processes created by SSAO2 (default: 0)
     */
    constructor(name, frameGraph, ratioSSAO, ratioBlur, textureType = 0) {
        super(name, frameGraph);
        /**
         * The sampling mode to use for the source texture.
         */
        this.sourceSamplingMode = 2;
        this.ratioSSAO = ratioSSAO;
        this.ratioBlur = ratioBlur;
        this.textureType = textureType;
        this.ssao = new ThinSSAO2RenderingPipeline(name, frameGraph.scene);
        this._ssao = new FrameGraphSSAO2Task(`${name} SSAO2 main`, this._frameGraph, this.ssao._ssaoPostProcess);
        this._ssaoBlurX = new FrameGraphSSAO2BlurTask(`${name} SSAO2 Blur X`, this._frameGraph, true, this.ssao._ssaoBlurXPostProcess);
        this._ssaoBlurY = new FrameGraphSSAO2BlurTask(`${name} SSAO2 Blur Y`, this._frameGraph, false, this.ssao._ssaoBlurYPostProcess);
        this._ssaoCombine = new FrameGraphPostProcessTask(`${name} SSAO2 Combine`, this._frameGraph, this.ssao._ssaoCombinePostProcess);
        this.outputTexture = this._frameGraph.textureManager.createDanglingHandle();
    }
    isReady() {
        return this.ssao.isReady();
    }
    getClassName() {
        return "FrameGraphSSAO2RenderingPipelineTask";
    }
    record() {
        if (this.sourceTexture === undefined || this.depthTexture === undefined || this.normalTexture === undefined || this.camera === undefined) {
            throw new Error(`FrameGraphSSAO2RenderingPipelineTask "${this.name}": sourceTexture, depthTexture, normalTexture and camera are required`);
        }
        const sourceTextureDescription = this._frameGraph.textureManager.getTextureDescription(this.sourceTexture);
        this._ssao.sourceTexture = this.sourceTexture;
        this._ssao.sourceSamplingMode = this.sourceSamplingMode;
        this._ssao.camera = this.camera;
        this._ssao.depthTexture = this.depthTexture;
        this._ssao.normalTexture = this.normalTexture;
        const textureSize = {
            width: Math.floor(sourceTextureDescription.size.width * this.ratioSSAO) || 1,
            height: Math.floor(sourceTextureDescription.size.height * this.ratioSSAO) || 1,
        };
        const textureCreationOptions = {
            size: textureSize,
            options: {
                createMipMaps: false,
                types: [this.textureType],
                formats: [5],
                samples: 1,
                useSRGBBuffers: [false],
                labels: [""],
            },
            sizeIsPercentage: false,
        };
        const ssaoTextureHandle = this._frameGraph.textureManager.createRenderTargetTexture(this._ssao.name, textureCreationOptions);
        // SSAO main post process
        this._ssao.targetTexture = ssaoTextureHandle;
        this._ssao.record(true);
        // SSAO Blur X & Y
        textureSize.width = Math.floor(sourceTextureDescription.size.width * this.ratioBlur) || 1;
        textureSize.height = Math.floor(sourceTextureDescription.size.height * this.ratioBlur) || 1;
        const sourceTextureCreationOptions = this._frameGraph.textureManager.getTextureCreationOptions(this.sourceTexture);
        this._frameGraph.textureManager.resolveDanglingHandle(this.outputTexture, this.targetTexture, this.name + " Output", sourceTextureCreationOptions);
        const blurXTextureHandle = this._frameGraph.textureManager.createRenderTargetTexture(this._ssaoBlurX.name, textureCreationOptions);
        this._ssaoBlurX.sourceTexture = ssaoTextureHandle;
        this._ssaoBlurX.depthTexture = this.depthTexture;
        this._ssaoBlurX.sourceSamplingMode = 2;
        this._ssaoBlurX.targetTexture = blurXTextureHandle;
        this._ssaoBlurX.record(true);
        const blurYTextureHandle = this._frameGraph.textureManager.createRenderTargetTexture(this._ssaoBlurY.name, textureCreationOptions);
        this._ssaoBlurY.sourceTexture = blurXTextureHandle;
        this._ssaoBlurY.depthTexture = this.depthTexture;
        this._ssaoBlurY.sourceSamplingMode = 2;
        this._ssaoBlurY.targetTexture = blurYTextureHandle;
        this._ssaoBlurY.record(true);
        // SSAO Combine
        this._ssaoCombine.sourceTexture = this.sourceTexture;
        this._ssaoCombine.sourceSamplingMode = this.sourceSamplingMode;
        this._ssaoCombine.targetTexture = this.outputTexture;
        const combinerPass = this._ssaoCombine.record(true, (context) => {
            context.setTextureSamplingMode(this.sourceTexture, this.sourceSamplingMode);
            context.setTextureSamplingMode(blurYTextureHandle, 2);
        }, (context) => {
            context.bindTextureHandle(this._ssaoCombine.drawWrapper.effect, "textureSampler", blurYTextureHandle);
            context.bindTextureHandle(this._ssaoCombine.drawWrapper.effect, "originalColor", this.sourceTexture);
        });
        combinerPass.addDependencies(blurYTextureHandle);
        const passDisabled = this._frameGraph.addRenderPass(this.name + "_disabled", true);
        passDisabled.addDependencies(this.sourceTexture);
        passDisabled.setRenderTarget(this.outputTexture);
        passDisabled.setExecuteFunc((context) => {
            if (this.alphaMode === 0) {
                context.copyTexture(this.sourceTexture);
            }
        });
    }
    dispose() {
        this._ssao.dispose();
        this._ssaoBlurX.dispose();
        this._ssaoBlurY.dispose();
        this._ssaoCombine.dispose();
        this.ssao.dispose();
        super.dispose();
    }
}
//# sourceMappingURL=ssao2RenderingPipelineTask.js.map