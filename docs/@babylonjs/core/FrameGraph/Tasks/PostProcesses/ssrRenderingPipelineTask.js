
import { FrameGraphTask } from "../../frameGraphTask.js";
import { ThinSSRRenderingPipeline } from "../../../PostProcesses/RenderPipeline/Pipelines/thinSSRRenderingPipeline.js";
import { FrameGraphSSRTask } from "./ssrTask.js";
import { FrameGraphSSRBlurTask } from "./ssrBlurTask.js";
import { FrameGraphPostProcessTask } from "./postProcessTask.js";
/**
 * Task which applies a SSR post process.
 */
export class FrameGraphSSRRenderingPipelineTask extends FrameGraphTask {
    /**
     * The alpha mode to use when applying the SSR effect.
     */
    get alphaMode() {
        return this._ssrBlurCombiner.alphaMode;
    }
    set alphaMode(mode) {
        this._ssrBlurCombiner.alphaMode = mode;
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
        this.ssr.camera = camera;
        if (this._ssr) {
            this._ssr.camera = camera;
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
        if (this._ssr) {
            this._ssr.name = `${name} SSR main`;
        }
        if (this._ssrBlurX) {
            this._ssrBlurX.name = `${name} SSR Blur X`;
        }
        if (this._ssrBlurY) {
            this._ssrBlurY.name = `${name} SSR Blur Y`;
        }
        if (this._ssrBlurCombiner) {
            this._ssrBlurCombiner.name = `${name} SSR Blur Combiner`;
        }
    }
    /**
     * Constructs a SSR rendering pipeline task.
     * @param name The name of the task.
     * @param frameGraph The frame graph this task belongs to.
     * @param textureType The texture type used by the different post processes created by SSR (default: 0)
     */
    constructor(name, frameGraph, textureType = 0) {
        super(name, frameGraph);
        /**
         * The sampling mode to use for the source texture.
         */
        this.sourceSamplingMode = 2;
        this.textureType = textureType;
        this.ssr = new ThinSSRRenderingPipeline(name, frameGraph.scene);
        this._ssr = new FrameGraphSSRTask(`${name} SSR main`, this._frameGraph, this.ssr._ssrPostProcess);
        this._ssrBlurX = new FrameGraphSSRBlurTask(`${name} SSR Blur X`, this._frameGraph, this.ssr._ssrBlurXPostProcess);
        this._ssrBlurY = new FrameGraphSSRBlurTask(`${name} SSR Blur Y`, this._frameGraph, this.ssr._ssrBlurYPostProcess);
        this._ssrBlurCombiner = new FrameGraphPostProcessTask(`${name} SSR Blur Combiner`, this._frameGraph, this.ssr._ssrBlurCombinerPostProcess);
        this.outputTexture = this._frameGraph.textureManager.createDanglingHandle();
    }
    isReady() {
        return this.ssr.isReady();
    }
    getClassName() {
        return "FrameGraphSSRRenderingPipelineTask";
    }
    record() {
        if (this.sourceTexture === undefined ||
            this.normalTexture === undefined ||
            this.depthTexture === undefined ||
            this.reflectivityTexture === undefined ||
            this.camera === undefined) {
            throw new Error(`FrameGraphSSRRenderingPipelineTask "${this.name}": sourceTexture, normalTexture, depthTexture, reflectivityTexture and camera are required`);
        }
        const sourceTextureDescription = this._frameGraph.textureManager.getTextureDescription(this.sourceTexture);
        this._ssr.sourceTexture = this.sourceTexture;
        this._ssr.sourceSamplingMode = this.sourceSamplingMode;
        this._ssr.camera = this.camera;
        this._ssr.normalTexture = this.normalTexture;
        this._ssr.depthTexture = this.depthTexture;
        this._ssr.backDepthTexture = this.backDepthTexture;
        this._ssr.reflectivityTexture = this.reflectivityTexture;
        let ssrTextureHandle;
        const textureSize = {
            width: Math.floor(sourceTextureDescription.size.width / (this.ssr.ssrDownsample + 1)) || 1,
            height: Math.floor(sourceTextureDescription.size.height / (this.ssr.ssrDownsample + 1)) || 1,
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
        if (this.ssr.blurDispersionStrength > 0 || !this.targetTexture) {
            ssrTextureHandle = this._frameGraph.textureManager.createRenderTargetTexture(this._ssr.name, textureCreationOptions);
        }
        if (this.ssr.blurDispersionStrength === 0) {
            this._ssr.targetTexture = this.outputTexture;
            if (ssrTextureHandle !== undefined) {
                this._frameGraph.textureManager.resolveDanglingHandle(this.outputTexture, ssrTextureHandle);
            }
            else {
                this._frameGraph.textureManager.resolveDanglingHandle(this.outputTexture, this.targetTexture);
            }
            this._ssr.record(true);
        }
        else {
            this._ssr.targetTexture = ssrTextureHandle;
            this._ssr.record(true);
            textureSize.width = Math.floor(sourceTextureDescription.size.width / (this.ssr.blurDownsample + 1)) || 1;
            textureSize.height = Math.floor(sourceTextureDescription.size.height / (this.ssr.blurDownsample + 1)) || 1;
            const sourceTextureCreationOptions = this._frameGraph.textureManager.getTextureCreationOptions(this.sourceTexture);
            this._frameGraph.textureManager.resolveDanglingHandle(this.outputTexture, this.targetTexture, this.name + " Output", sourceTextureCreationOptions);
            const blurXTextureHandle = this._frameGraph.textureManager.createRenderTargetTexture(this._ssrBlurX.name, textureCreationOptions);
            this._ssrBlurX.sourceTexture = ssrTextureHandle;
            this._ssrBlurX.sourceSamplingMode = 2;
            this._ssrBlurX.targetTexture = blurXTextureHandle;
            this._ssrBlurX.record(true);
            const blurYTextureHandle = this._frameGraph.textureManager.createRenderTargetTexture(this._ssrBlurY.name, textureCreationOptions);
            this._ssrBlurY.sourceTexture = blurXTextureHandle;
            this._ssrBlurY.sourceSamplingMode = 2;
            this._ssrBlurY.targetTexture = blurYTextureHandle;
            this._ssrBlurY.record(true);
            this._ssrBlurCombiner.sourceTexture = this.sourceTexture;
            this._ssrBlurCombiner.sourceSamplingMode = this.sourceSamplingMode;
            this._ssrBlurCombiner.targetTexture = this.outputTexture;
            const combinerPass = this._ssrBlurCombiner.record(true, undefined, (context) => {
                context.bindTextureHandle(this._ssrBlurCombiner.drawWrapper.effect, "mainSampler", this.sourceTexture);
                context.bindTextureHandle(this._ssrBlurCombiner.drawWrapper.effect, "textureSampler", blurYTextureHandle);
                context.bindTextureHandle(this._ssrBlurCombiner.drawWrapper.effect, "reflectivitySampler", this.reflectivityTexture);
                if (this.ssr.useFresnel) {
                    context.bindTextureHandle(this._ssrBlurCombiner.drawWrapper.effect, "normalSampler", this.normalTexture);
                    context.bindTextureHandle(this._ssrBlurCombiner.drawWrapper.effect, "depthSampler", this.depthTexture);
                }
            });
            combinerPass.addDependencies(blurYTextureHandle);
        }
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
        this._ssr.dispose();
        this._ssrBlurX.dispose();
        this._ssrBlurY.dispose();
        this._ssrBlurCombiner.dispose();
        this.ssr.dispose();
        super.dispose();
    }
}
//# sourceMappingURL=ssrRenderingPipelineTask.js.map