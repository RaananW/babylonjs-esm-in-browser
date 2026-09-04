
import { Vector4 } from "../../../../Maths/math.vector.pure.js";
import { ThinCustomPostProcess } from "../../../../PostProcesses/thinCustomPostProcess.js";
import { FrameGraphTask } from "../../../frameGraphTask.js";
/**
 * Task used to spatially blur IBL shadows.
 * @internal
 */
export class FrameGraphIblShadowsSpatialBlurTask extends FrameGraphTask {
    constructor(name, frameGraph) {
        super(name, frameGraph);
        this._blurParameters = new Vector4(0, 0, 0, 0);
        this.postProcess = new ThinCustomPostProcess(name, frameGraph.engine, {
            fragmentShader: "iblShadowSpatialBlur",
            uniforms: ["blurParameters"],
            samplers: ["voxelTracingSampler", "depthSampler", "worldNormalSampler"],
            shaderLanguage: frameGraph.engine.isWebGPU ? 1 /* ShaderLanguage.WGSL */ : 0 /* ShaderLanguage.GLSL */,
        });
        this._postProcessDrawWrapper = this.postProcess.drawWrapper;
        this.outputTexture = this._frameGraph.textureManager.createDanglingHandle();
    }
    getClassName() {
        return "FrameGraphIblShadowsSpatialBlurTask";
    }
    // eslint-disable-next-line @typescript-eslint/promise-function-async, no-restricted-syntax
    initAsync() {
        if (this._frameGraph.engine.isWebGPU) {
            return import("../../../../ShadersWGSL/iblShadowSpatialBlur.fragment.js");
        }
        return import("../../../../Shaders/iblShadowSpatialBlur.fragment.js");
    }
    isReady() {
        return this.postProcess.isReady();
    }
    record() {
        if (this.sourceTexture === undefined || this.depthTexture === undefined || this.normalTexture === undefined) {
            throw new Error(`FrameGraphIblShadowsSpatialBlurTask ${this.name}: sourceTexture, depthTexture and normalTexture are required`);
        }
        const textureManager = this._frameGraph.textureManager;
        const size = textureManager.getTextureAbsoluteDimensions(this.sourceTexture);
        const creationOptions = {
            size,
            sizeIsPercentage: false,
            isHistoryTexture: false,
            options: {
                createMipMaps: false,
                samples: 1,
                types: [0],
                formats: [5],
                useSRGBBuffers: [false],
                creationFlags: [0],
                labels: [`${this.name} Output`],
            },
        };
        textureManager.resolveDanglingHandle(this.outputTexture, undefined, `${this.name} Output`, creationOptions);
        const pass = this._frameGraph.addRenderPass(this.name);
        pass.addDependencies(this.sourceTexture);
        pass.addDependencies(this.depthTexture);
        pass.addDependencies(this.normalTexture);
        pass.setRenderTarget(this.outputTexture);
        pass.setExecuteFunc((context) => {
            context.setTextureSamplingMode(this.sourceTexture, 1);
            context.setTextureSamplingMode(this.depthTexture, 1);
            context.setTextureSamplingMode(this.normalTexture, 1);
            const iterationCount = 1;
            this._blurParameters.set(iterationCount, this.voxelizationTask?.voxelGridSize ?? 1.0, 0.0, 0.0);
            context.applyFullScreenEffect(this._postProcessDrawWrapper, () => {
                const effect = this._postProcessDrawWrapper.effect;
                context.bindTextureHandle(effect, "voxelTracingSampler", this.sourceTexture);
                context.bindTextureHandle(effect, "depthSampler", this.depthTexture);
                context.bindTextureHandle(effect, "worldNormalSampler", this.normalTexture);
                effect.setVector4("blurParameters", this._blurParameters);
                this.postProcess.bind();
            }, undefined, false, false, true);
        });
    }
    dispose() {
        this.postProcess.dispose();
        super.dispose();
    }
}
//# sourceMappingURL=iblShadowsSpatialBlurTask.js.map