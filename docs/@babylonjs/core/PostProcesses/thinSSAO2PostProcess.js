
import { EffectWrapper } from "../Materials/effectRenderer.pure.js";
import { Matrix, Vector2, Vector3 } from "../Maths/math.vector.pure.js";
import { Camera } from "../Cameras/camera.pure.js";
import { RawTexture } from "../Materials/Textures/rawTexture.js";
import { RandomRange } from "../Maths/math.scalar.functions.js";
import { Texture } from "../Materials/Textures/texture.pure.js";
/**
 * @internal
 */
export class ThinSSAO2PostProcess extends EffectWrapper {
    _gatherImports(useWebGPU, list) {
        if (useWebGPU) {
            this._webGPUReady = true;
            list.push(import("../ShadersWGSL/ssao2.fragment.js"));
        }
        else {
            list.push(import("../Shaders/ssao2.fragment.js"));
        }
    }
    get textureWidth() {
        return this._textureWidth;
    }
    set textureWidth(width) {
        if (this._textureWidth === width) {
            return;
        }
        this._textureWidth = width;
    }
    get textureHeight() {
        return this._textureHeight;
    }
    set textureHeight(height) {
        if (this._textureHeight === height) {
            return;
        }
        this._textureHeight = height;
    }
    set samples(n) {
        this._samples = n;
        this.updateEffect();
        this._sampleSphere = this._generateHemisphere();
    }
    get samples() {
        return this._samples;
    }
    set normalsInWorldSpace(value) {
        if (this._normalsInWorldSpace === value) {
            return;
        }
        this._normalsInWorldSpace = value;
        this.updateEffect();
    }
    get normalsInWorldSpace() {
        return this._normalsInWorldSpace;
    }
    set epsilon(n) {
        this._epsilon = n;
        this.updateEffect();
    }
    get epsilon() {
        return this._epsilon;
    }
    updateEffect() {
        super.updateEffect(this._getDefinesForSSAO());
    }
    constructor(name, scene, options) {
        super({
            ...options,
            name,
            engine: scene.getEngine(),
            useShaderStore: true,
            useAsPostProcess: true,
            fragmentShader: ThinSSAO2PostProcess.FragmentUrl,
            uniforms: ThinSSAO2PostProcess.Uniforms,
            samplers: ThinSSAO2PostProcess.Samplers,
            defines: `#define SSAO\n#define SAMPLES 8\n#define EPSILON 0.0001`,
            shaderLanguage: scene.getEngine().isWebGPU ? 1 /* ShaderLanguage.WGSL */ : 0 /* ShaderLanguage.GLSL */,
        });
        this.camera = null;
        this._textureWidth = 0;
        this._textureHeight = 0;
        this._samples = 8;
        this.totalStrength = 1.0;
        this.radius = 2.0;
        this.maxZ = 100.0;
        this.minZAspect = 0.2;
        this.base = 0;
        this._epsilon = 0.02;
        this._normalsInWorldSpace = false;
        this._normalWorldToViewMatrix = new Matrix();
        this._normalWorldToView = new Float32Array(9);
        this._bits = new Uint32Array(1);
        this._scene = scene;
        this._createRandomTexture();
        this.updateEffect();
        this._sampleSphere = this._generateHemisphere();
    }
    bind(noDefaultBindings = false) {
        super.bind(noDefaultBindings);
        const effect = this._drawWrapper.effect;
        const camera = this.camera;
        if (!camera) {
            return;
        }
        const projectionMatrix = camera.getProjectionMatrix();
        effect.setArray3("sampleSphere", this._sampleSphere);
        effect.setFloat("randTextureTiles", 32.0);
        effect.setFloat("samplesFactor", 1 / this.samples);
        effect.setFloat("totalStrength", this.totalStrength);
        effect.setFloat2("texelSize", 1 / this.textureWidth, 1 / this.textureHeight);
        effect.setFloat("radius", this.radius);
        effect.setFloat("maxZ", this.maxZ);
        effect.setFloat("minZAspect", this.minZAspect);
        effect.setFloat("base", this.base);
        effect.setFloat("near", camera.minZ);
        if (camera.mode === Camera.PERSPECTIVE_CAMERA) {
            effect.setMatrix3x3("depthProjection", ThinSSAO2PostProcess.PERSPECTIVE_DEPTH_PROJECTION);
            const viewportSize = Math.tan(camera.fov / 2);
            if (camera.fovMode === Camera.FOVMODE_VERTICAL_FIXED) {
                effect.setFloat("xViewport", viewportSize * this._scene.getEngine().getAspectRatio(camera, true));
                effect.setFloat("yViewport", viewportSize);
            }
            else {
                effect.setFloat("xViewport", viewportSize);
                effect.setFloat("yViewport", viewportSize / this._scene.getEngine().getAspectRatio(camera, true));
            }
        }
        else {
            const halfWidth = this._scene.getEngine().getRenderWidth() / 2.0;
            const halfHeight = this._scene.getEngine().getRenderHeight() / 2.0;
            const orthoLeft = camera.orthoLeft ?? -halfWidth;
            const orthoRight = camera.orthoRight ?? halfWidth;
            const orthoBottom = camera.orthoBottom ?? -halfHeight;
            const orthoTop = camera.orthoTop ?? halfHeight;
            effect.setMatrix3x3("depthProjection", ThinSSAO2PostProcess.ORTHO_DEPTH_PROJECTION);
            effect.setFloat4("viewport", orthoLeft, orthoRight, orthoBottom, orthoTop);
        }
        effect.setMatrix("projection", projectionMatrix);
        if (this._normalsInWorldSpace) {
            camera.getViewMatrix().toNormalMatrix(this._normalWorldToViewMatrix);
            const viewMatrix = this._normalWorldToViewMatrix.m;
            const normalWorldToView = this._normalWorldToView;
            normalWorldToView[0] = viewMatrix[0];
            normalWorldToView[1] = viewMatrix[1];
            normalWorldToView[2] = viewMatrix[2];
            normalWorldToView[3] = viewMatrix[4];
            normalWorldToView[4] = viewMatrix[5];
            normalWorldToView[5] = viewMatrix[6];
            normalWorldToView[6] = viewMatrix[8];
            normalWorldToView[7] = viewMatrix[9];
            normalWorldToView[8] = viewMatrix[10];
            effect.setMatrix3x3("normalWorldToView", normalWorldToView);
        }
        effect.setTexture("randomSampler", this._randomTexture);
    }
    dispose() {
        this._randomTexture.dispose();
        super.dispose();
    }
    _createRandomTexture() {
        const size = 128;
        const data = new Uint8Array(size * size * 4);
        const randVector = Vector2.Zero();
        for (let index = 0; index < data.length;) {
            randVector.set(RandomRange(0, 1), RandomRange(0, 1)).normalize().scaleInPlace(255);
            data[index++] = Math.floor(randVector.x);
            data[index++] = Math.floor(randVector.y);
            data[index++] = 0;
            data[index++] = 255;
        }
        const texture = RawTexture.CreateRGBATexture(data, size, size, this._scene, false, false, 2);
        texture.name = "SSAORandomTexture";
        texture.wrapU = Texture.WRAP_ADDRESSMODE;
        texture.wrapV = Texture.WRAP_ADDRESSMODE;
        this._randomTexture = texture;
    }
    //Van der Corput radical inverse
    _radicalInverseVdC(i) {
        this._bits[0] = i;
        this._bits[0] = ((this._bits[0] << 16) | (this._bits[0] >> 16)) >>> 0;
        this._bits[0] = ((this._bits[0] & 0x55555555) << 1) | (((this._bits[0] & 0xaaaaaaaa) >>> 1) >>> 0);
        this._bits[0] = ((this._bits[0] & 0x33333333) << 2) | (((this._bits[0] & 0xcccccccc) >>> 2) >>> 0);
        this._bits[0] = ((this._bits[0] & 0x0f0f0f0f) << 4) | (((this._bits[0] & 0xf0f0f0f0) >>> 4) >>> 0);
        this._bits[0] = ((this._bits[0] & 0x00ff00ff) << 8) | (((this._bits[0] & 0xff00ff00) >>> 8) >>> 0);
        return this._bits[0] * 2.3283064365386963e-10; // / 0x100000000 or / 4294967296
    }
    _hammersley(i, n) {
        return [i / n, this._radicalInverseVdC(i)];
    }
    _hemisphereSampleUniform(u, v) {
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
                vector = this._hemisphereSampleUniform(Math.random(), Math.random());
            }
            else {
                const rand = this._hammersley(i, numSamples);
                vector = this._hemisphereSampleUniform(rand[0], rand[1]);
            }
            result.push(vector.x, vector.y, vector.z);
            i++;
        }
        return result;
    }
    _getDefinesForSSAO() {
        const epsilon = this._epsilon ?? 0.02;
        const samples = this._samples ?? 8;
        let defines = `#define SSAO\n#define SAMPLES ${samples}\n#define EPSILON ${epsilon.toFixed(4)}`;
        if (this.camera?.mode === Camera.ORTHOGRAPHIC_CAMERA) {
            defines += `\n#define ORTHOGRAPHIC_CAMERA`;
        }
        if (this._normalsInWorldSpace) {
            defines += `\n#define NORMAL_WORLDSPACE`;
        }
        return defines;
    }
}
ThinSSAO2PostProcess.ORTHO_DEPTH_PROJECTION = [1, 0, 0, 0, 1, 0, 0, 0, 1];
ThinSSAO2PostProcess.PERSPECTIVE_DEPTH_PROJECTION = [0, 0, 0, 0, 0, 0, 1, 1, 1];
ThinSSAO2PostProcess.FragmentUrl = "ssao2";
ThinSSAO2PostProcess.Uniforms = [
    "sampleSphere",
    "samplesFactor",
    "randTextureTiles",
    "totalStrength",
    "radius",
    "base",
    "range",
    "projection",
    "near",
    "texelSize",
    "xViewport",
    "yViewport",
    "viewport",
    "maxZ",
    "minZAspect",
    "depthProjection",
    "normalWorldToView",
];
ThinSSAO2PostProcess.Samplers = ["randomSampler", "depthSampler", "normalSampler"];
//# sourceMappingURL=thinSSAO2PostProcess.js.map