
import { Matrix, Vector4 } from "../../../../Maths/math.vector.pure.js";
import { ThinCustomPostProcess } from "../../../../PostProcesses/thinCustomPostProcess.js";
import { FrameGraphTask } from "../../../frameGraphTask.js";
import { Color4 } from "../../../../Maths/math.color.pure.js";
/**
 * Task used to trace IBL shadows from a voxel grid.
 * @internal
 */
export class FrameGraphIblShadowsTracingTask extends FrameGraphTask {
    get sampleDirections() {
        return this._sampleDirections;
    }
    set sampleDirections(value) {
        this._sampleDirections = Math.max(1, Math.round(value));
    }
    get ssShadowSampleCount() {
        return this._ssShadowSampleCount;
    }
    set ssShadowSampleCount(value) {
        this._ssShadowSampleCount = Math.max(1, Math.round(value));
    }
    get ssShadowStride() {
        return this._ssShadowStride;
    }
    set ssShadowStride(value) {
        this._ssShadowStride = Math.max(1, Math.round(value));
    }
    constructor(name, frameGraph) {
        super(name, frameGraph);
        this._sampleDirections = 2;
        this.voxelShadowOpacity = 1;
        this.ssShadowOpacity = 1;
        this._ssShadowSampleCount = 16;
        this._ssShadowStride = 8;
        /** Scale factor applied to voxelGridSize / 2^resolutionExp to get the max SSS ray distance. */
        this.ssShadowDistanceScale = 1.25;
        /** Scale factor applied to voxelGridSize to get the SSS surface thickness. */
        this.ssShadowThicknessScale = 1.0;
        this.envRotation = 0;
        this.voxelNormalBias = 1.4;
        this.voxelDirectionBias = 1.75;
        this.worldScaleMatrix = Matrix.Identity();
        this._shadowParameters = new Vector4(0, 0, 0, 0);
        this._sssParameters = new Vector4(0, 0, 0, 0);
        this._opacityParameters = new Vector4(0, 0, 0, 0);
        this._voxelBiasParameters = new Vector4(0, 0, 0, 0);
        this._cameraInvView = Matrix.Identity();
        this._cameraInvProj = Matrix.Identity();
        this._cameraInvViewProjection = Matrix.Identity();
        this._frameId = 0;
        this._coloredShadows = false;
        this._currentDefines = "";
        this.postProcess = new ThinCustomPostProcess(name, frameGraph.engine, {
            fragmentShader: "iblShadowVoxelTracing",
            uniforms: [
                "viewMtx",
                "projMtx",
                "invProjMtx",
                "invViewMtx",
                "invVPMtx",
                "wsNormalizationMtx",
                "shadowParameters",
                "voxelBiasParameters",
                "sssParameters",
                "shadowOpacity",
            ],
            samplers: ["depthSampler", "worldNormalSampler", "blueNoiseSampler", "icdfSampler", "voxelGridSampler", "iblSampler"],
            shaderLanguage: frameGraph.engine.isWebGPU ? 1 /* ShaderLanguage.WGSL */ : 0 /* ShaderLanguage.GLSL */,
        });
        this._postProcessDrawWrapper = this.postProcess.drawWrapper;
        this.outputTexture = this._frameGraph.textureManager.createDanglingHandle();
    }
    getClassName() {
        return "FrameGraphIblShadowsTracingTask";
    }
    // eslint-disable-next-line @typescript-eslint/promise-function-async, no-restricted-syntax
    initAsync() {
        if (this._frameGraph.engine.isWebGPU) {
            return import("../../../../ShadersWGSL/iblShadowVoxelTracing.fragment.js");
        }
        return import("../../../../Shaders/iblShadowVoxelTracing.fragment.js");
    }
    get coloredShadows() {
        return this._coloredShadows;
    }
    set coloredShadows(value) {
        if (this._coloredShadows === value) {
            return;
        }
        this._coloredShadows = value;
        this._updateDefines();
    }
    isReady() {
        return this.postProcess.isReady();
    }
    record() {
        if (this.camera === undefined ||
            this.voxelGridTexture === undefined ||
            this.depthTexture === undefined ||
            this.normalTexture === undefined ||
            this.icdfTexture === undefined) {
            throw new Error(`FrameGraphIblShadowsTracingTask ${this.name}: camera, voxelGridTexture, depthTexture, normalTexture and icdfTexture are required`);
        }
        const textureManager = this._frameGraph.textureManager;
        const size = textureManager.getTextureAbsoluteDimensions(this.depthTexture);
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
        this._updateDefines();
        const pass = this._frameGraph.addRenderPass(this.name);
        const dependencies = [this.voxelGridTexture, this.depthTexture, this.normalTexture, this.icdfTexture];
        if (this.environmentTexture !== undefined) {
            dependencies.push(this.environmentTexture);
        }
        if (this.blueNoiseTexture !== undefined) {
            dependencies.push(this.blueNoiseTexture);
        }
        pass.addDependencies(dependencies);
        pass.setRenderTarget(this.outputTexture);
        pass.setExecuteFunc((context) => {
            if (this.icdfTexture === undefined || this.blueNoiseTexture === undefined || (this.coloredShadows && this.environmentTexture === undefined)) {
                context.clear(new Color4(1, 1, 1, 1), true, false, false);
                return;
            }
            context.setTextureSamplingMode(this.depthTexture, 1);
            context.setTextureSamplingMode(this.normalTexture, 1);
            context.setTextureSamplingMode(this.icdfTexture, 1);
            context.setTextureSamplingMode(this.blueNoiseTexture, 1);
            const view = this.camera.getViewMatrix();
            const projection = this.camera.getProjectionMatrix();
            projection.invertToRef(this._cameraInvProj);
            view.invertToRef(this._cameraInvView);
            this.camera.getTransformationMatrix().invertToRef(this._cameraInvViewProjection);
            const voxelGridSize = textureManager.getTextureAbsoluteDimensions(this.voxelGridTexture);
            const highestMip = Math.floor(Math.log2(Math.max(1, voxelGridSize.width)));
            this._frameId++;
            let rotation = 0.0;
            if (this.environmentTexture) {
                rotation = this._frameGraph.scene.environmentTexture.rotationY ?? 0;
            }
            rotation = this._frameGraph.scene.useRightHandedSystem ? -(rotation + 0.5 * Math.PI) : rotation - 0.5 * Math.PI;
            rotation = rotation % (2.0 * Math.PI);
            this._shadowParameters.set(this.sampleDirections, this._frameId, 1.0, rotation);
            this._voxelBiasParameters.set(this.voxelNormalBias, this.voxelDirectionBias, highestMip, 0.0);
            const gridSize = this.voxelizationTask?.voxelGridSize ?? 1.0;
            const resExp = this.voxelizationTask?.resolutionExp ?? 6;
            const sssMaxDist = (this.ssShadowDistanceScale * gridSize) / (1 << resExp);
            const sssThickness = this.ssShadowThicknessScale * 0.005 * gridSize;
            this._sssParameters.set(this.ssShadowSampleCount, this.ssShadowStride, sssMaxDist, sssThickness);
            this._opacityParameters.set(this.voxelShadowOpacity, this.ssShadowOpacity, 0.0, 0.0);
            context.applyFullScreenEffect(this._postProcessDrawWrapper, () => {
                const effect = this._postProcessDrawWrapper.effect;
                context.bindTextureHandle(effect, "voxelGridSampler", this.voxelGridTexture);
                context.bindTextureHandle(effect, "depthSampler", this.depthTexture);
                context.bindTextureHandle(effect, "worldNormalSampler", this.normalTexture);
                context.bindTextureHandle(effect, "icdfSampler", this.icdfTexture);
                context.bindTextureHandle(effect, "blueNoiseSampler", this.blueNoiseTexture);
                if (this.coloredShadows && this.environmentTexture !== undefined) {
                    context.bindTextureHandle(effect, "iblSampler", this.environmentTexture);
                }
                effect.setMatrix("viewMtx", view);
                effect.setMatrix("projMtx", projection);
                effect.setMatrix("invProjMtx", this._cameraInvProj);
                effect.setMatrix("invViewMtx", this._cameraInvView);
                effect.setMatrix("invVPMtx", this._cameraInvViewProjection);
                effect.setMatrix("wsNormalizationMtx", this.worldScaleMatrix);
                effect.setVector4("shadowParameters", this._shadowParameters);
                effect.setVector4("voxelBiasParameters", this._voxelBiasParameters);
                effect.setVector4("sssParameters", this._sssParameters);
                effect.setVector4("shadowOpacity", this._opacityParameters);
                this.postProcess.bind();
            }, undefined, false, false, true);
        });
    }
    dispose() {
        this.postProcess.dispose();
        super.dispose();
    }
    _updateDefines() {
        const defines = ["#define WORLD_NORMAL_UNSIGNED"];
        if (this._frameGraph.scene.useRightHandedSystem) {
            defines.push("#define RIGHT_HANDED");
        }
        if (this.coloredShadows) {
            defines.push("#define COLOR_SHADOWS 1u");
        }
        const defineString = defines.join("\n");
        if (defineString !== this._currentDefines) {
            this._currentDefines = defineString;
            this.postProcess.updateEffect(this._currentDefines);
        }
    }
}
//# sourceMappingURL=iblShadowsTracingTask.js.map