import { __decorate } from "../../../tslib.es6.js";
/* eslint-disable @typescript-eslint/naming-convention */
import { Logger } from "../../../Misc/logger.js";
import { serialize, SerializationHelper } from "../../../Misc/decorators.js";
import { Vector3, TmpVectors } from "../../../Maths/math.vector.js";
import { Camera } from "../../../Cameras/camera.js";
import { Texture } from "../../../Materials/Textures/texture.js";
import { DynamicTexture } from "../../../Materials/Textures/dynamicTexture.js";
import { PostProcess } from "../../../PostProcesses/postProcess.js";
import { PostProcessRenderPipeline } from "../../../PostProcesses/RenderPipeline/postProcessRenderPipeline.js";
import { PostProcessRenderEffect } from "../../../PostProcesses/RenderPipeline/postProcessRenderEffect.js";
import { PassPostProcess } from "../../../PostProcesses/passPostProcess.js";
import { RegisterClass } from "../../../Misc/typeStore.js";
import { EngineStore } from "../../../Engines/engineStore.js";
import { SSAO2Configuration } from "../../../Rendering/ssao2Configuration.js";

import "../../../PostProcesses/RenderPipeline/postProcessRenderPipelineManagerSceneComponent.js";
import "../../../Shaders/ssao2.fragment.js";
import "../../../Shaders/ssaoCombine.fragment.js";
/**
 * Render pipeline to produce ssao effect
 */
export class SSAO2RenderingPipeline extends PostProcessRenderPipeline {
    /**
     * @constructor
     * @param name The rendering pipeline name
     * @param scene The scene linked to this pipeline
     * @param ratio The size of the postprocesses. Can be a number shared between passes or an object for more precision: { ssaoRatio: 0.5, blurRatio: 1.0 }
     * @param cameras The array of cameras that the rendering pipeline will be attached to
     * @param forceGeometryBuffer Set to true if you want to use the legacy geometry buffer renderer
     * @param textureType The texture type used by the different post processes created by SSAO (default: 0)
     */
    constructor(name, scene, ratio, cameras, forceGeometryBuffer = false, textureType = 0) {
        super(scene.getEngine(), name);
        // Members
        /**
         * @ignore
         * The PassPostProcess id in the pipeline that contains the original scene color
         */
        this.SSAOOriginalSceneColorEffect = "SSAOOriginalSceneColorEffect";
        /**
         * @ignore
         * The SSAO PostProcess id in the pipeline
         */
        this.SSAORenderEffect = "SSAORenderEffect";
        /**
         * @ignore
         * The horizontal blur PostProcess id in the pipeline
         */
        this.SSAOBlurHRenderEffect = "SSAOBlurHRenderEffect";
        /**
         * @ignore
         * The vertical blur PostProcess id in the pipeline
         */
        this.SSAOBlurVRenderEffect = "SSAOBlurVRenderEffect";
        /**
         * @ignore
         * The PostProcess id in the pipeline that combines the SSAO-Blur output with the original scene color (SSAOOriginalSceneColorEffect)
         */
        this.SSAOCombineRenderEffect = "SSAOCombineRenderEffect";
        /**
         * The output strength of the SSAO post-process. Default value is 1.0.
         */
        this.totalStrength = 1.0;
        /**
         * Maximum depth value to still render AO. A smooth falloff makes the dimming more natural, so there will be no abrupt shading change.
         */
        this.maxZ = 100.0;
        /**
         * In order to save performances, SSAO radius is clamped on close geometry. This ratio changes by how much
         */
        this.minZAspect = 0.2;
        this._samples = 8;
        this._textureSamples = 1;
        /**
         * Force rendering the geometry through geometry buffer
         */
        this._forceGeometryBuffer = false;
        this._expensiveBlur = true;
        /**
         * The radius around the analyzed pixel used by the SSAO post-process. Default value is 2.0
         */
        this.radius = 2.0;
        /**
         * The base color of the SSAO post-process
         * The final result is "base + ssao" between [0, 1]
         */
        this.base = 0;
        this._bits = new Uint32Array(1);
        this._scene = scene;
        this._ratio = ratio;
        this._forceGeometryBuffer = forceGeometryBuffer;
        if (!this.isSupported) {
            Logger.Error("The current engine does not support SSAO 2.");
            return;
        }
        const ssaoRatio = this._ratio.ssaoRatio || ratio;
        const blurRatio = this._ratio.blurRatio || ratio;
        // Set up assets
        if (this._forceGeometryBuffer) {
            scene.enableGeometryBufferRenderer();
        }
        else {
            scene.enablePrePassRenderer();
        }
        this._createRandomTexture();
        this._originalColorPostProcess = new PassPostProcess("SSAOOriginalSceneColor", 1.0, null, Texture.BILINEAR_SAMPLINGMODE, scene.getEngine(), undefined, textureType);
        this._originalColorPostProcess.samples = this.textureSamples;
        this._createSSAOPostProcess(1.0, textureType);
        this._createBlurPostProcess(ssaoRatio, blurRatio, textureType);
        this._createSSAOCombinePostProcess(blurRatio, textureType);
        // Set up pipeline
        this.addEffect(new PostProcessRenderEffect(scene.getEngine(), this.SSAOOriginalSceneColorEffect, () => {
            return this._originalColorPostProcess;
        }, true));
        this.addEffect(new PostProcessRenderEffect(scene.getEngine(), this.SSAORenderEffect, () => {
            return this._ssaoPostProcess;
        }, true));
        this.addEffect(new PostProcessRenderEffect(scene.getEngine(), this.SSAOBlurHRenderEffect, () => {
            return this._blurHPostProcess;
        }, true));
        this.addEffect(new PostProcessRenderEffect(scene.getEngine(), this.SSAOBlurVRenderEffect, () => {
            return this._blurVPostProcess;
        }, true));
        this.addEffect(new PostProcessRenderEffect(scene.getEngine(), this.SSAOCombineRenderEffect, () => {
            return this._ssaoCombinePostProcess;
        }, true));
        // Finish
        scene.postProcessRenderPipelineManager.addPipeline(this);
        if (cameras) {
            scene.postProcessRenderPipelineManager.attachCamerasToRenderPipeline(name, cameras);
        }
    }
    /**
     * Number of samples used for the SSAO calculations. Default value is 8
     */
    set samples(n) {
        this._samples = n;
        this._ssaoPostProcess.updateEffect(this._getDefinesForSSAO());
        this._sampleSphere = this._generateHemisphere();
    }
    get samples() {
        return this._samples;
    }
    /**
     * Number of samples to use for antialiasing
     */
    set textureSamples(n) {
        this._textureSamples = n;
        if (this._prePassRenderer) {
            this._prePassRenderer.samples = n;
        }
        else {
            this._originalColorPostProcess.samples = n;
        }
    }
    get textureSamples() {
        return this._textureSamples;
    }
    get _geometryBufferRenderer() {
        if (!this._forceGeometryBuffer) {
            return null;
        }
        return this._scene.geometryBufferRenderer;
    }
    get _prePassRenderer() {
        if (this._forceGeometryBuffer) {
            return null;
        }
        return this._scene.prePassRenderer;
    }
    /**
     * If bilateral blur should be used
     */
    set expensiveBlur(b) {
        this._blurHPostProcess.updateEffect("#define BILATERAL_BLUR\n#define BILATERAL_BLUR_H\n#define SAMPLES 16\n#define EXPENSIVE " + (b ? "1" : "0") + "\n", null, [
            "textureSampler",
            "depthSampler",
        ]);
        this._blurVPostProcess.updateEffect("#define BILATERAL_BLUR\n#define SAMPLES 16\n#define EXPENSIVE " + (b ? "1" : "0") + "\n", null, ["textureSampler", "depthSampler"]);
        this._expensiveBlur = b;
    }
    get expensiveBlur() {
        return this._expensiveBlur;
    }
    /**
     *  Support test.
     */
    static get IsSupported() {
        const engine = EngineStore.LastCreatedEngine;
        if (!engine) {
            return false;
        }
        return engine._features.supportSSAO2;
    }
    /**
     * Gets active scene
     */
    get scene() {
        return this._scene;
    }
    // Public Methods
    /**
     * Get the class name
     * @returns "SSAO2RenderingPipeline"
     */
    getClassName() {
        return "SSAO2RenderingPipeline";
    }
    /**
     * Removes the internal pipeline assets and detaches the pipeline from the scene cameras
     * @param disableGeometryBufferRenderer
     */
    dispose(disableGeometryBufferRenderer = false) {
        for (let i = 0; i < this._scene.cameras.length; i++) {
            const camera = this._scene.cameras[i];
            this._originalColorPostProcess.dispose(camera);
            this._ssaoPostProcess.dispose(camera);
            this._blurHPostProcess.dispose(camera);
            this._blurVPostProcess.dispose(camera);
            this._ssaoCombinePostProcess.dispose(camera);
        }
        this._randomTexture.dispose();
        if (disableGeometryBufferRenderer) {
            this._scene.disableGeometryBufferRenderer();
        }
        this._scene.postProcessRenderPipelineManager.detachCamerasFromRenderPipeline(this._name, this._scene.cameras);
        super.dispose();
    }
    // Private Methods
    _createBlurPostProcess(ssaoRatio, blurRatio, textureType) {
        this._samplerOffsets = [];
        const expensive = this.expensiveBlur;
        for (let i = -8; i < 8; i++) {
            this._samplerOffsets.push(i * 2 + 0.5);
        }
        this._blurHPostProcess = new PostProcess("BlurH", "ssao2", ["outSize", "samplerOffsets", "near", "far", "radius"], ["depthSampler"], ssaoRatio, null, Texture.TRILINEAR_SAMPLINGMODE, this._scene.getEngine(), false, "#define BILATERAL_BLUR\n#define BILATERAL_BLUR_H\n#define SAMPLES 16\n#define EXPENSIVE " + (expensive ? "1" : "0") + "\n", textureType);
        this._blurHPostProcess.onApply = (effect) => {
            if (!this._scene.activeCamera) {
                return;
            }
            effect.setFloat("outSize", this._ssaoCombinePostProcess.width > 0 ? this._ssaoCombinePostProcess.width : this._originalColorPostProcess.width);
            effect.setFloat("near", this._scene.activeCamera.minZ);
            effect.setFloat("far", this._scene.activeCamera.maxZ);
            effect.setFloat("radius", this.radius);
            if (this._geometryBufferRenderer) {
                effect.setTexture("depthSampler", this._geometryBufferRenderer.getGBuffer().textures[0]);
            }
            else if (this._prePassRenderer) {
                effect.setTexture("depthSampler", this._prePassRenderer.getRenderTarget().textures[this._prePassRenderer.getIndex(5)]);
            }
            effect.setArray("samplerOffsets", this._samplerOffsets);
        };
        this._blurVPostProcess = new PostProcess("BlurV", "ssao2", ["outSize", "samplerOffsets", "near", "far", "radius"], ["depthSampler"], blurRatio, null, Texture.TRILINEAR_SAMPLINGMODE, this._scene.getEngine(), false, "#define BILATERAL_BLUR\n#define BILATERAL_BLUR_V\n#define SAMPLES 16\n#define EXPENSIVE " + (expensive ? "1" : "0") + "\n", textureType);
        this._blurVPostProcess.onApply = (effect) => {
            if (!this._scene.activeCamera) {
                return;
            }
            effect.setFloat("outSize", this._ssaoCombinePostProcess.height > 0 ? this._ssaoCombinePostProcess.height : this._originalColorPostProcess.height);
            effect.setFloat("near", this._scene.activeCamera.minZ);
            effect.setFloat("far", this._scene.activeCamera.maxZ);
            effect.setFloat("radius", this.radius);
            if (this._geometryBufferRenderer) {
                effect.setTexture("depthSampler", this._geometryBufferRenderer.getGBuffer().textures[0]);
            }
            else if (this._prePassRenderer) {
                effect.setTexture("depthSampler", this._prePassRenderer.getRenderTarget().textures[this._prePassRenderer.getIndex(5)]);
            }
            effect.setArray("samplerOffsets", this._samplerOffsets);
        };
        this._blurHPostProcess.samples = this.textureSamples;
        this._blurVPostProcess.samples = this.textureSamples;
    }
    /** @internal */
    _rebuild() {
        super._rebuild();
    }
    //Van der Corput radical inverse
    _radicalInverse_VdC(i) {
        this._bits[0] = i;
        this._bits[0] = ((this._bits[0] << 16) | (this._bits[0] >> 16)) >>> 0;
        this._bits[0] = ((this._bits[0] & 0x55555555) << 1) | (((this._bits[0] & 0xaaaaaaaa) >>> 1) >>> 0);
        this._bits[0] = ((this._bits[0] & 0x33333333) << 2) | (((this._bits[0] & 0xcccccccc) >>> 2) >>> 0);
        this._bits[0] = ((this._bits[0] & 0x0f0f0f0f) << 4) | (((this._bits[0] & 0xf0f0f0f0) >>> 4) >>> 0);
        this._bits[0] = ((this._bits[0] & 0x00ff00ff) << 8) | (((this._bits[0] & 0xff00ff00) >>> 8) >>> 0);
        return this._bits[0] * 2.3283064365386963e-10; // / 0x100000000 or / 4294967296
    }
    _hammersley(i, n) {
        return [i / n, this._radicalInverse_VdC(i)];
    }
    _hemisphereSample_uniform(u, v) {
        const phi = v * 2.0 * Math.PI;
        // rejecting samples that are close to tangent plane to avoid z-fighting artifacts
        const cosTheta = 1.0 - u * 0.85;
        const sinTheta = Math.sqrt(1.0 - cosTheta * cosTheta);
        return new Vector3(Math.cos(phi) * sinTheta, Math.sin(phi) * sinTheta, cosTheta);
    }
    _generateHemisphere() {
        const numSamples = this.samples;
        const result = [];
        let vector;
        let i = 0;
        while (i < numSamples) {
            if (numSamples < 16) {
                vector = this._hemisphereSample_uniform(Math.random(), Math.random());
            }
            else {
                const rand = this._hammersley(i, numSamples);
                vector = this._hemisphereSample_uniform(rand[0], rand[1]);
            }
            result.push(vector.x, vector.y, vector.z);
            i++;
        }
        return result;
    }
    _getDefinesForSSAO() {
        const defines = "#define SAMPLES " + this.samples + "\n#define SSAO";
        return defines;
    }
    _createSSAOPostProcess(ratio, textureType) {
        this._sampleSphere = this._generateHemisphere();
        const defines = this._getDefinesForSSAO();
        const samplers = ["randomSampler", "depthSampler", "normalSampler"];
        this._ssaoPostProcess = new PostProcess("ssao2", "ssao2", [
            "sampleSphere",
            "samplesFactor",
            "randTextureTiles",
            "totalStrength",
            "radius",
            "base",
            "range",
            "projection",
            "near",
            "far",
            "texelSize",
            "xViewport",
            "yViewport",
            "maxZ",
            "minZAspect",
            "depthProjection",
        ], samplers, ratio, null, Texture.BILINEAR_SAMPLINGMODE, this._scene.getEngine(), false, defines, textureType);
        this._ssaoPostProcess.onApply = (effect) => {
            var _a, _b, _c, _d;
            if (!this._scene.activeCamera) {
                return;
            }
            effect.setArray3("sampleSphere", this._sampleSphere);
            effect.setFloat("randTextureTiles", 32.0);
            effect.setFloat("samplesFactor", 1 / this.samples);
            effect.setFloat("totalStrength", this.totalStrength);
            effect.setFloat2("texelSize", 1 / this._ssaoPostProcess.width, 1 / this._ssaoPostProcess.height);
            effect.setFloat("radius", this.radius);
            effect.setFloat("maxZ", this.maxZ);
            effect.setFloat("minZAspect", this.minZAspect);
            effect.setFloat("base", this.base);
            effect.setFloat("near", this._scene.activeCamera.minZ);
            effect.setFloat("far", this._scene.activeCamera.maxZ);
            if (this._scene.activeCamera.mode === Camera.PERSPECTIVE_CAMERA) {
                effect.setMatrix3x3("depthProjection", SSAO2RenderingPipeline.PERSPECTIVE_DEPTH_PROJECTION);
                effect.setFloat("xViewport", Math.tan(this._scene.activeCamera.fov / 2) * this._scene.getEngine().getAspectRatio(this._scene.activeCamera, true));
                effect.setFloat("yViewport", Math.tan(this._scene.activeCamera.fov / 2));
            }
            else {
                const halfWidth = this._scene.getEngine().getRenderWidth() / 2.0;
                const halfHeight = this._scene.getEngine().getRenderHeight() / 2.0;
                const orthoLeft = (_a = this._scene.activeCamera.orthoLeft) !== null && _a !== void 0 ? _a : -halfWidth;
                const orthoRight = (_b = this._scene.activeCamera.orthoRight) !== null && _b !== void 0 ? _b : halfWidth;
                const orthoBottom = (_c = this._scene.activeCamera.orthoBottom) !== null && _c !== void 0 ? _c : -halfHeight;
                const orthoTop = (_d = this._scene.activeCamera.orthoTop) !== null && _d !== void 0 ? _d : halfHeight;
                effect.setMatrix3x3("depthProjection", SSAO2RenderingPipeline.ORTHO_DEPTH_PROJECTION);
                effect.setFloat("xViewport", (orthoRight - orthoLeft) * 0.5);
                effect.setFloat("yViewport", (orthoTop - orthoBottom) * 0.5);
            }
            effect.setMatrix("projection", this._scene.getProjectionMatrix());
            if (this._geometryBufferRenderer) {
                effect.setTexture("depthSampler", this._geometryBufferRenderer.getGBuffer().textures[0]);
                effect.setTexture("normalSampler", this._geometryBufferRenderer.getGBuffer().textures[1]);
            }
            else if (this._prePassRenderer) {
                effect.setTexture("depthSampler", this._prePassRenderer.getRenderTarget().textures[this._prePassRenderer.getIndex(5)]);
                effect.setTexture("normalSampler", this._prePassRenderer.getRenderTarget().textures[this._prePassRenderer.getIndex(6)]);
            }
            effect.setTexture("randomSampler", this._randomTexture);
        };
        this._ssaoPostProcess.samples = this.textureSamples;
        if (!this._forceGeometryBuffer) {
            this._ssaoPostProcess._prePassEffectConfiguration = new SSAO2Configuration();
        }
    }
    _createSSAOCombinePostProcess(ratio, textureType) {
        this._ssaoCombinePostProcess = new PostProcess("ssaoCombine", "ssaoCombine", [], ["originalColor", "viewport"], ratio, null, Texture.BILINEAR_SAMPLINGMODE, this._scene.getEngine(), false, undefined, textureType);
        this._ssaoCombinePostProcess.onApply = (effect) => {
            const viewport = this._scene.activeCamera.viewport;
            effect.setVector4("viewport", TmpVectors.Vector4[0].copyFromFloats(viewport.x, viewport.y, viewport.width, viewport.height));
            effect.setTextureFromPostProcessOutput("originalColor", this._originalColorPostProcess);
        };
        this._ssaoCombinePostProcess.samples = this.textureSamples;
    }
    _createRandomTexture() {
        const size = 128;
        this._randomTexture = new DynamicTexture("SSAORandomTexture", size, this._scene, false, Texture.TRILINEAR_SAMPLINGMODE);
        this._randomTexture.wrapU = Texture.WRAP_ADDRESSMODE;
        this._randomTexture.wrapV = Texture.WRAP_ADDRESSMODE;
        const context = this._randomTexture.getContext();
        const rand = (min, max) => {
            return Math.random() * (max - min) + min;
        };
        const randVector = Vector3.Zero();
        for (let x = 0; x < size; x++) {
            for (let y = 0; y < size; y++) {
                randVector.x = rand(0.0, 1.0);
                randVector.y = rand(0.0, 1.0);
                randVector.z = 0.0;
                randVector.normalize();
                randVector.scaleInPlace(255);
                randVector.x = Math.floor(randVector.x);
                randVector.y = Math.floor(randVector.y);
                context.fillStyle = "rgb(" + randVector.x + ", " + randVector.y + ", " + randVector.z + ")";
                context.fillRect(x, y, 1, 1);
            }
        }
        this._randomTexture.update(false);
    }
    /**
     * Serialize the rendering pipeline (Used when exporting)
     * @returns the serialized object
     */
    serialize() {
        const serializationObject = SerializationHelper.Serialize(this);
        serializationObject.customType = "SSAO2RenderingPipeline";
        return serializationObject;
    }
    /**
     * Parse the serialized pipeline
     * @param source Source pipeline.
     * @param scene The scene to load the pipeline to.
     * @param rootUrl The URL of the serialized pipeline.
     * @returns An instantiated pipeline from the serialized object.
     */
    static Parse(source, scene, rootUrl) {
        return SerializationHelper.Parse(() => new SSAO2RenderingPipeline(source._name, scene, source._ratio), source, scene, rootUrl);
    }
}
SSAO2RenderingPipeline.ORTHO_DEPTH_PROJECTION = [1, 0, 0, 0, 1, 0, 0, 0, 1];
SSAO2RenderingPipeline.PERSPECTIVE_DEPTH_PROJECTION = [0, 0, 0, 0, 0, 0, 1, 1, 1];
__decorate([
    serialize()
], SSAO2RenderingPipeline.prototype, "totalStrength", void 0);
__decorate([
    serialize()
], SSAO2RenderingPipeline.prototype, "maxZ", void 0);
__decorate([
    serialize()
], SSAO2RenderingPipeline.prototype, "minZAspect", void 0);
__decorate([
    serialize("samples")
], SSAO2RenderingPipeline.prototype, "_samples", void 0);
__decorate([
    serialize("textureSamples")
], SSAO2RenderingPipeline.prototype, "_textureSamples", void 0);
__decorate([
    serialize()
], SSAO2RenderingPipeline.prototype, "_ratio", void 0);
__decorate([
    serialize("expensiveBlur")
], SSAO2RenderingPipeline.prototype, "_expensiveBlur", void 0);
__decorate([
    serialize()
], SSAO2RenderingPipeline.prototype, "radius", void 0);
__decorate([
    serialize()
], SSAO2RenderingPipeline.prototype, "base", void 0);
RegisterClass("BABYLON.SSAO2RenderingPipeline", SSAO2RenderingPipeline);
//# sourceMappingURL=ssao2RenderingPipeline.js.map