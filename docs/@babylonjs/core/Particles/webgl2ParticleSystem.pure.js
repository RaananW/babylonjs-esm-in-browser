/** This file must only contain pure code and pure imports */
import { CustomParticleEmitter } from "./EmitterTypes/customParticleEmitter.js";
import { UniformBufferEffectCommonAccessor } from "../Materials/uniformBufferEffectCommonAccessor.js";

import { RegisterClass } from "../Misc/typeStore.js";
import { RegisterEngineTransformFeedback } from "../Engines/Extensions/engine.transformFeedback.pure.js";
/** @internal */
export class WebGL2ParticleSystem {
    /** @internal */
    constructor(parent, engine) {
        this._renderVAO = [];
        this._updateVAO = [];
        /** @internal */
        this.alignDataInBuffer = false;
        RegisterEngineTransformFeedback();
        this._parent = parent;
        this._engine = engine;
        this._updateEffectOptions = {
            attributes: [
                "position",
                "initialPosition",
                "age",
                "life",
                "seed",
                "size",
                "color",
                "direction",
                "initialDirection",
                "angle",
                "cellIndex",
                "cellStartOffset",
                "noiseCoordinates1",
                "noiseCoordinates2",
            ],
            uniformsNames: [
                "currentCount",
                "timeDelta",
                "emitterWM",
                "lifeTime",
                "color1",
                "color2",
                "sizeRange",
                "scaleRange",
                "gravity",
                "emitPower",
                "direction1",
                "direction2",
                "minEmitBox",
                "maxEmitBox",
                "radius",
                "directionRandomizer",
                "height",
                "coneAngle",
                "stopFactor",
                "emitIndex",
                "emitCount",
                "angleRange",
                "radiusRange",
                "cellInfos",
                "noiseStrength",
                "limitVelocityDamping",
                "flowMapProjection",
                "flowMapStrength",
            ],
            uniformBuffersNames: [],
            samplers: [
                "randomSampler",
                "randomSampler2",
                "sizeGradientSampler",
                "angularSpeedGradientSampler",
                "velocityGradientSampler",
                "limitVelocityGradientSampler",
                "noiseSampler",
                "dragGradientSampler",
                "flowMapSampler",
                "meshPositionSampler",
                "meshNormalSampler",
            ],
            defines: "",
            fallbacks: null,
            onCompiled: null,
            onError: null,
            indexParameters: null,
            maxSimultaneousLights: 0,
            transformFeedbackVaryings: [],
        };
        this._baseUniformsNamesLength = this._updateEffectOptions.uniformsNames.length;
    }
    /** @internal */
    contextLost() {
        this._updateEffect = undefined;
        this._renderVAO.length = 0;
        this._updateVAO.length = 0;
    }
    /** @internal */
    isUpdateBufferCreated() {
        return !!this._updateEffect;
    }
    /** @internal */
    isUpdateBufferReady() {
        return this._updateEffect?.isReady() ?? false;
    }
    /** @internal */
    createUpdateBuffer(defines) {
        // Reset dynamic uniforms to avoid accumulating duplicates on rebuild
        this._updateEffectOptions.uniformsNames.length = this._baseUniformsNamesLength;
        this._updateEffectOptions.transformFeedbackVaryings = ["outPosition"];
        this._updateEffectOptions.transformFeedbackVaryings.push("outAge");
        this._updateEffectOptions.transformFeedbackVaryings.push("outSize");
        this._updateEffectOptions.transformFeedbackVaryings.push("outLife");
        this._updateEffectOptions.transformFeedbackVaryings.push("outSeed");
        this._updateEffectOptions.transformFeedbackVaryings.push("outDirection");
        if (this._parent.particleEmitterType instanceof CustomParticleEmitter) {
            this._updateEffectOptions.transformFeedbackVaryings.push("outInitialPosition");
        }
        if (!this._parent._colorGradientsTexture) {
            this._updateEffectOptions.transformFeedbackVaryings.push("outColor");
        }
        if (this._parent._needsInitialDirection) {
            this._updateEffectOptions.transformFeedbackVaryings.push("outInitialDirection");
        }
        if (this._parent.noiseTexture) {
            this._updateEffectOptions.transformFeedbackVaryings.push("outNoiseCoordinates1");
            this._updateEffectOptions.transformFeedbackVaryings.push("outNoiseCoordinates2");
        }
        this._updateEffectOptions.transformFeedbackVaryings.push("outAngle");
        if (this._parent.isAnimationSheetEnabled) {
            this._updateEffectOptions.transformFeedbackVaryings.push("outCellIndex");
            if (this._parent.spriteRandomStartCell) {
                this._updateEffectOptions.transformFeedbackVaryings.push("outCellStartOffset");
            }
        }
        this._updateEffectOptions.defines = defines;
        // Add attractor uniform names dynamically based on maxAttractors
        if (defines.indexOf("ATTRACTORS") !== -1) {
            this._updateEffectOptions.uniformsNames.push("attractorCount");
            for (let i = 0; i < this._parent.maxAttractors; i++) {
                this._updateEffectOptions.uniformsNames.push("attractorPositionAndStrength[" + i + "]");
            }
        }
        if (defines.indexOf("STARTSIZEGRADIENTS") !== -1) {
            this._updateEffectOptions.uniformsNames.push("startSizeGradientFactor");
        }
        if (defines.indexOf("LIFETIMEGRADIENTS") !== -1) {
            this._updateEffectOptions.uniformsNames.push("lifeTimeGradientRange");
        }
        if (defines.indexOf("MESHEMITTER") !== -1) {
            this._updateEffectOptions.uniformsNames.push("meshTriangleCount");
            this._updateEffectOptions.uniformsNames.push("meshTextureWidth");
        }
        this._updateEffect = this._engine.createEffect("gpuUpdateParticles", this._updateEffectOptions, this._engine);
        return new UniformBufferEffectCommonAccessor(this._updateEffect);
    }
    /** @internal */
    createVertexBuffers(updateBuffer, renderVertexBuffers) {
        this._updateVAO.push(this._createUpdateVAO(updateBuffer));
        this._renderVAO.push(this._engine.recordVertexArrayObject(renderVertexBuffers, null, this._parent._getWrapper(this._parent.blendMode).effect));
        this._engine.bindArrayBuffer(null);
        this._renderVertexBuffers = renderVertexBuffers;
    }
    /** @internal */
    createParticleBuffer(data) {
        return data;
    }
    /** @internal */
    bindDrawBuffers(index, effect, indexBuffer) {
        if (indexBuffer) {
            this._engine.bindBuffers(this._renderVertexBuffers, indexBuffer, effect);
        }
        else {
            this._engine.bindVertexArrayObject(this._renderVAO[index], null);
        }
    }
    /** @internal */
    preUpdateParticleBuffer() {
        const engine = this._engine;
        this._engine.enableEffect(this._updateEffect);
        if (!engine.setState) {
            throw new Error("GPU particles cannot work without a full Engine. ThinEngine is not supported");
        }
    }
    /** @internal */
    updateParticleBuffer(index, targetBuffer, currentActiveCount) {
        this._updateEffect.setTexture("randomSampler", this._parent._randomTexture);
        this._updateEffect.setTexture("randomSampler2", this._parent._randomTexture2);
        if (this._parent._flowMap) {
            this._updateEffect.setTexture("flowMapSampler", this._parent._flowMap);
        }
        if (this._parent._sizeGradientsTexture) {
            this._updateEffect.setTexture("sizeGradientSampler", this._parent._sizeGradientsTexture);
        }
        if (this._parent._angularSpeedGradientsTexture) {
            this._updateEffect.setTexture("angularSpeedGradientSampler", this._parent._angularSpeedGradientsTexture);
        }
        if (this._parent._velocityGradientsTexture) {
            this._updateEffect.setTexture("velocityGradientSampler", this._parent._velocityGradientsTexture);
        }
        if (this._parent._limitVelocityGradientsTexture) {
            this._updateEffect.setTexture("limitVelocityGradientSampler", this._parent._limitVelocityGradientsTexture);
        }
        if (this._parent._dragGradientsTexture) {
            this._updateEffect.setTexture("dragGradientSampler", this._parent._dragGradientsTexture);
        }
        if (this._parent.noiseTexture) {
            this._updateEffect.setTexture("noiseSampler", this._parent.noiseTexture);
        }
        if (this._parent._meshPositionTexture) {
            this._updateEffect.setTexture("meshPositionSampler", this._parent._meshPositionTexture);
        }
        if (this._parent._meshNormalTexture) {
            this._updateEffect.setTexture("meshNormalSampler", this._parent._meshNormalTexture);
        }
        // Bind source VAO
        this._engine.bindVertexArrayObject(this._updateVAO[index], null);
        // Update
        const engine = this._engine;
        engine.bindTransformFeedbackBuffer(targetBuffer.getBuffer());
        engine.setRasterizerState(false);
        engine.beginTransformFeedback(true);
        engine.drawArraysType(3, 0, currentActiveCount);
        engine.endTransformFeedback();
        engine.setRasterizerState(true);
        engine.bindTransformFeedbackBuffer(null);
    }
    /** @internal */
    releaseBuffers() { }
    /** @internal */
    releaseVertexBuffers() {
        for (let index = 0; index < this._updateVAO.length; index++) {
            this._engine.releaseVertexArrayObject(this._updateVAO[index]);
        }
        this._updateVAO.length = 0;
        for (let index = 0; index < this._renderVAO.length; index++) {
            this._engine.releaseVertexArrayObject(this._renderVAO[index]);
        }
        this._renderVAO.length = 0;
    }
    _createUpdateVAO(source) {
        const updateVertexBuffers = {};
        updateVertexBuffers["position"] = source.createVertexBuffer("position", 0, 3);
        let offset = 3;
        updateVertexBuffers["age"] = source.createVertexBuffer("age", offset, 1);
        offset += 1;
        updateVertexBuffers["size"] = source.createVertexBuffer("size", offset, 3);
        offset += 3;
        updateVertexBuffers["life"] = source.createVertexBuffer("life", offset, 1);
        offset += 1;
        updateVertexBuffers["seed"] = source.createVertexBuffer("seed", offset, 4);
        offset += 4;
        updateVertexBuffers["direction"] = source.createVertexBuffer("direction", offset, 3);
        offset += 3;
        if (this._parent.particleEmitterType instanceof CustomParticleEmitter) {
            updateVertexBuffers["initialPosition"] = source.createVertexBuffer("initialPosition", offset, 3);
            offset += 3;
        }
        if (!this._parent._colorGradientsTexture) {
            updateVertexBuffers["color"] = source.createVertexBuffer("color", offset, 4);
            offset += 4;
        }
        if (this._parent._needsInitialDirection) {
            updateVertexBuffers["initialDirection"] = source.createVertexBuffer("initialDirection", offset, 3);
            offset += 3;
        }
        if (this._parent.noiseTexture) {
            updateVertexBuffers["noiseCoordinates1"] = source.createVertexBuffer("noiseCoordinates1", offset, 3);
            offset += 3;
            updateVertexBuffers["noiseCoordinates2"] = source.createVertexBuffer("noiseCoordinates2", offset, 3);
            offset += 3;
        }
        if (this._parent._angularSpeedGradientsTexture) {
            updateVertexBuffers["angle"] = source.createVertexBuffer("angle", offset, 1);
            offset += 1;
        }
        else {
            updateVertexBuffers["angle"] = source.createVertexBuffer("angle", offset, 2);
            offset += 2;
        }
        if (this._parent._isAnimationSheetEnabled) {
            updateVertexBuffers["cellIndex"] = source.createVertexBuffer("cellIndex", offset, 1);
            offset += 1;
            if (this._parent.spriteRandomStartCell) {
                updateVertexBuffers["cellStartOffset"] = source.createVertexBuffer("cellStartOffset", offset, 1);
            }
        }
        const vao = this._engine.recordVertexArrayObject(updateVertexBuffers, null, this._updateEffect);
        this._engine.bindArrayBuffer(null);
        return vao;
    }
}
let _Registered = false;
/**
 * Register side effects for webgl2ParticleSystem.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterWebgl2ParticleSystem() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    RegisterClass("BABYLON.WebGL2ParticleSystem", WebGL2ParticleSystem);
}
//# sourceMappingURL=webgl2ParticleSystem.pure.js.map