/** This file must only contain pure code and pure imports */
import { ColorGradient, Color3Gradient, GradientHelper } from "../Misc/gradients.js";
import { Observable } from "../Misc/observable.pure.js";
import { Vector3, Matrix, TmpVectors } from "../Maths/math.vector.pure.js";
import { VertexBuffer, Buffer } from "../Buffers/buffer.pure.js";
import { RawTexture } from "../Materials/Textures/rawTexture.js";
import { EngineStore } from "../Engines/engineStore.js";
import { BaseParticleSystem } from "./baseParticleSystem.pure.js";
import { Particle } from "./particle.js";

import { RegisterAnimatable } from "../Animations/animatable.pure.js";
import { RegisterEnginesExtensionsEngineAlpha } from "../Engines/Extensions/engine.alpha.pure.js";
import { DrawWrapper } from "../Materials/drawWrapper.js";
import { Color4, Color3, TmpColors } from "../Maths/math.color.pure.js";
import { AddClipPlaneUniforms, PrepareStringDefinesForClipPlanes, BindClipPlane } from "../Materials/clipPlaneMaterialHelper.js";
import { BindFogParameters, BindLogDepth } from "../Materials/materialHelper.functions.js";
import { BoxParticleEmitter } from "./EmitterTypes/boxParticleEmitter.js";
import { Lerp } from "../Maths/math.scalar.functions.js";
import { PrepareSamplersForImageProcessing, PrepareUniformsForImageProcessing } from "../Materials/imageProcessingConfiguration.functions.js";
import { _CreateAngleData, _CreateAngleGradientsData, _CreateColorData, _CreateColorDeadData, _CreateColorGradientsData, _CreateCustomDirectionData, _CreateCustomPositionData, _CreateDirectionData, _CreateDragData, _CreateEmitPowerData, _CreateIsLocalData, _CreateLifeGradientsData, _CreateLifetimeData, _CreateLimitVelocityGradients, _CreateNoiseData, _CreatePositionData, _CreateRampData, _CreateSheetData, _CreateSizeData, _CreateSizeGradientsData, _CreateStartSizeGradientsData, _CreateVelocityGradients, _ProcessAngularSpeed, _ProcessAngularSpeedGradients, _ProcessColor, _ProcessColorGradients, _ProcessDirection, _ProcessDragGradients, _ProcessGravity, _ProcessLimitVelocityGradients, _ProcessNoise, _ProcessPosition, _ProcessRemapGradients, _ProcessSizeGradients, _ProcessVelocityGradients, } from "./thinParticleSystem.function.js";
import { _ConnectAfter, _ConnectBefore, _RemoveFromQueue } from "./Queue/executionQueue.js";
/**
 * This represents a thin particle system in Babylon.
 * Particles are often small sprites used to simulate hard-to-reproduce phenomena like fire, smoke, water, or abstract visual effects like magic glitter and faery dust.
 * Particles can take different shapes while emitted like box, sphere, cone or you can write your custom function.
 * This thin version contains a limited subset of the total features in order to provide users with a way to get particles but with a smaller footprint
 * @example https://doc.babylonjs.com/features/featuresDeepDive/particles/particle_system/particle_system_intro
 */
export class ThinParticleSystem extends BaseParticleSystem {
    /**
     * This function can be defined to specify initial direction for every new particle.
     * It by default use the emitterType defined function
     */
    get startDirectionFunction() {
        return this._startDirectionFunction;
    }
    set startDirectionFunction(value) {
        if (this._startDirectionFunction === value) {
            return;
        }
        this._startDirectionFunction = value;
        if (value) {
            this._directionCreation.process = _CreateCustomDirectionData;
        }
        else {
            this._directionCreation.process = _CreateDirectionData;
        }
    }
    /**
     * This function can be defined to specify initial position for every new particle.
     * It by default use the emitterType defined function
     */
    get startPositionFunction() {
        return this._startPositionFunction;
    }
    set startPositionFunction(value) {
        if (this._startPositionFunction === value) {
            return;
        }
        this._startPositionFunction = value;
        if (value) {
            this._positionCreation.process = _CreateCustomPositionData;
        }
        else {
            this._positionCreation.process = _CreatePositionData;
        }
    }
    /**
     * Sets a callback that will be triggered when the system is disposed
     */
    set onDispose(callback) {
        if (this._onDisposeObserver) {
            this.onDisposeObservable.remove(this._onDisposeObserver);
        }
        this._onDisposeObserver = this.onDisposeObservable.add(callback);
    }
    /**
     * Gets a boolean indicating that the particle system was disposed
     */
    get isDisposed() {
        return this._isDisposed;
    }
    /** Gets or sets a boolean indicating that ramp gradients must be used
     * @see https://doc.babylonjs.com/features/featuresDeepDive/particles/particle_system/particle_system_intro#ramp-gradients
     */
    get useRampGradients() {
        return this._useRampGradients;
    }
    set useRampGradients(value) {
        if (this._useRampGradients === value) {
            return;
        }
        this._useRampGradients = value;
        this._resetEffect();
        if (value) {
            this._rampCreation = {
                process: _CreateRampData,
                previousItem: null,
                nextItem: null,
            };
            _ConnectAfter(this._rampCreation, this._colorDeadCreation);
            // NPE based particles system do not have an update queue as that's represented by update blocks
            // So even if there is ramp/remap, do not try to add it to the queue unless it exists already (if it exists, gravityProcessing will be defined)
            if (this._gravityProcessing) {
                this._remapGradientProcessing = {
                    process: _ProcessRemapGradients,
                    previousItem: null,
                    nextItem: null,
                };
                _ConnectAfter(this._remapGradientProcessing, this._gravityProcessing);
            }
        }
        else {
            _RemoveFromQueue(this._rampCreation);
            _RemoveFromQueue(this._remapGradientProcessing);
        }
    }
    /**
     * Specifies if the particles are updated in emitter local space or world space
     */
    get isLocal() {
        return this._isLocal;
    }
    set isLocal(value) {
        if (this._isLocal === value) {
            return;
        }
        this._isLocal = value;
        if (value) {
            this._isLocalCreation = {
                process: _CreateIsLocalData,
                previousItem: null,
                nextItem: null,
            };
            _ConnectAfter(this._isLocalCreation, this._positionCreation);
        }
        else {
            _RemoveFromQueue(this._isLocalCreation);
        }
    }
    /**
     * Gets the current list of active particles
     */
    get particles() {
        return this._particles;
    }
    /**
     * Gets the shader language used in this material.
     */
    get shaderLanguage() {
        return this._shaderLanguage;
    }
    /** @internal */
    get _isAnimationSheetEnabled() {
        return this._animationSheetEnabled;
    }
    set _isAnimationSheetEnabled(value) {
        if (this._animationSheetEnabled === value) {
            return;
        }
        this._animationSheetEnabled = value;
        if (value) {
            this._sheetCreation = {
                process: _CreateSheetData,
                previousItem: null,
                nextItem: null,
            };
            _ConnectAfter(this._sheetCreation, this._colorDeadCreation);
        }
        else {
            _RemoveFromQueue(this._sheetCreation);
        }
        this._reset();
    }
    /**
     * Gets the number of particles active at the same time.
     * @returns The number of active particles.
     */
    getActiveCount() {
        return this._particles.length;
    }
    /**
     * Returns the string "ParticleSystem"
     * @returns a string containing the class name
     */
    getClassName() {
        return "ParticleSystem";
    }
    /**
     * Gets a boolean indicating that the system is stopping
     * @returns true if the system is currently stopping
     */
    isStopping() {
        return this._stopped && this.isAlive();
    }
    /**
     * Gets the custom effect used to render the particles
     * @param blendMode Blend mode for which the effect should be retrieved
     * @returns The effect
     */
    getCustomEffect(blendMode = 0) {
        return this._customWrappers[blendMode]?.effect ?? this._customWrappers[0].effect;
    }
    _getCustomDrawWrapper(blendMode = 0) {
        return this._customWrappers[blendMode] ?? this._customWrappers[0];
    }
    /**
     * Sets the custom effect used to render the particles
     * @param effect The effect to set
     * @param blendMode Blend mode for which the effect should be set
     */
    setCustomEffect(effect, blendMode = 0) {
        this._customWrappers[blendMode] = new DrawWrapper(this._engine);
        this._customWrappers[blendMode].effect = effect;
        if (this._customWrappers[blendMode].drawContext) {
            this._customWrappers[blendMode].drawContext.useInstancing = this._useInstancing;
        }
    }
    /**
     * Observable that will be called just before the particles are drawn
     */
    get onBeforeDrawParticlesObservable() {
        if (!this._onBeforeDrawParticlesObservable) {
            this._onBeforeDrawParticlesObservable = new Observable();
        }
        return this._onBeforeDrawParticlesObservable;
    }
    /**
     * Gets the name of the particle vertex shader
     */
    get vertexShaderName() {
        return "particles";
    }
    /**
     * Gets the vertex buffers used by the particle system
     */
    get vertexBuffers() {
        return this._vertexBuffers;
    }
    /**
     * Gets the index buffer used by the particle system (or null if no index buffer is used (if _useInstancing=true))
     */
    get indexBuffer() {
        return this._indexBuffer;
    }
    /**
     * Gets or sets a texture used to add random noise to particle positions
     */
    get noiseTexture() {
        return this._noiseTexture;
    }
    set noiseTexture(value) {
        if (this.noiseTexture === value) {
            return;
        }
        this._noiseTexture = value;
        if (!value) {
            _RemoveFromQueue(this._noiseCreation);
            _RemoveFromQueue(this._noiseProcessing);
            return;
        }
        this._noiseCreation = {
            process: _CreateNoiseData,
            previousItem: null,
            nextItem: null,
        };
        _ConnectAfter(this._noiseCreation, this._colorDeadCreation);
        this._noiseProcessing = {
            process: _ProcessNoise,
            previousItem: null,
            nextItem: null,
        };
        _ConnectAfter(this._noiseProcessing, this._positionProcessing);
    }
    /**
     * Instantiates a particle system.
     * Particles are often small sprites used to simulate hard-to-reproduce phenomena like fire, smoke, water, or abstract visual effects like magic glitter and faery dust.
     * @param name The name of the particle system
     * @param capacity The max number of particles alive at the same time
     * @param sceneOrEngine The scene the particle system belongs to or the engine to use if no scene
     * @param customEffect a custom effect used to change the way particles are rendered by default
     * @param isAnimationSheetEnabled Must be true if using a spritesheet to animate the particles texture
     * @param epsilon Offset used to render the particles
     * @param noUpdateQueue If true, the particle system will start with an empty update queue
     */
    constructor(name, capacity, sceneOrEngine, customEffect = null, isAnimationSheetEnabled = false, epsilon = 0.01, noUpdateQueue = false) {
        RegisterAnimatable();
        RegisterEnginesExtensionsEngineAlpha();
        super(name);
        /** @internal */
        this._emitterInverseWorldMatrix = Matrix.Identity();
        this._startDirectionFunction = null;
        this._startPositionFunction = null;
        /**
         * @internal
         */
        this._inheritedVelocityOffset = new Vector3();
        /**
         * An event triggered when the system is disposed
         */
        this.onDisposeObservable = new Observable();
        /**
         * An event triggered when the system is stopped
         */
        this.onStoppedObservable = new Observable();
        /**
         * An event triggered when the system is started
         */
        this.onStartedObservable = new Observable();
        /** @internal */
        this._noiseTextureSize = null;
        /** @internal */
        this._noiseTextureData = null;
        this._particles = new Array();
        this._stockParticles = new Array();
        this._newPartsExcess = 0;
        this._vertexBuffers = {};
        /** @internal */
        this._scaledColorStep = new Color4(0, 0, 0, 0);
        /** @internal */
        this._colorDiff = new Color4(0, 0, 0, 0);
        /** @internal */
        this._scaledGravity = Vector3.Zero();
        this._currentRenderId = -1;
        this._useInstancing = false;
        /** @internal */
        this._useFixedCapacityForSnapshot = false;
        this._fixedCapacityHighWaterMark = 0;
        this._isDisposed = false;
        this._started = false;
        this._stopped = false;
        /** @internal */
        this._actualFrame = 0;
        /** @internal */
        this._currentEmitRate1 = 0;
        /** @internal */
        this._currentEmitRate2 = 0;
        /** @internal */
        this._currentStartSize1 = 0;
        /** @internal */
        this._currentStartSize2 = 0;
        /** Indicates that the update of particles is done in the animate function */
        this.updateInAnimate = true;
        this._rawTextureWidth = 256;
        this._useRampGradients = false;
        /** @internal */
        this._updateQueueStart = null;
        this._startSizeCreation = null;
        this._createQueueStart = null;
        this._isLocal = false;
        /** Indicates that the particle system is CPU based */
        this.isGPU = false;
        /** Shader language used by the material */
        this._shaderLanguage = 0 /* ShaderLanguage.GLSL */;
        /** @internal */
        this._onBeforeDrawParticlesObservable = null;
        /** @internal */
        this._emitFromParticle = (_particle) => {
            // Do nothing
        };
        // start of sub system methods
        /**
         * "Recycles" one of the particle by copying it back to the "stock" of particles and removing it from the active list.
         * Its lifetime will start back at 0.
         * @param particle
         */
        this.recycleParticle = (particle) => {
            // move particle from activeParticle list to stock particles
            const lastParticle = this._particles.pop();
            if (lastParticle !== particle) {
                lastParticle.copyTo(particle);
            }
            lastParticle.metadata = null;
            this._stockParticles.push(lastParticle);
        };
        this._createParticle = () => {
            let particle;
            if (this._stockParticles.length !== 0) {
                particle = this._stockParticles.pop();
                particle._reset();
            }
            else {
                particle = new Particle(this);
            }
            this._prepareParticle(particle);
            return particle;
        };
        /**
         * Gets or sets a boolean indicating that the particle system is paused (no animation will be done).
         */
        this.paused = false;
        this._shadersLoaded = false;
        this._capacity = capacity;
        this._epsilon = epsilon;
        if (!sceneOrEngine || sceneOrEngine.getClassName() === "Scene") {
            this._scene = sceneOrEngine || EngineStore.LastCreatedScene;
            this._engine = this._scene.getEngine();
            this.uniqueId = this._scene.getUniqueId();
            this.layerMask = this._scene.defaultRenderableLayerMask;
            this._scene.particleSystems.push(this);
        }
        else {
            this._engine = sceneOrEngine;
            this.defaultProjectionMatrix = Matrix.PerspectiveFovLH(0.8, 1, 0.1, 100, this._engine.isNDCHalfZRange);
        }
        if (this._engine.getCaps().vertexArrayObject) {
            this._vertexArrayObject = null;
        }
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        this._initShaderSourceAsync();
        // Creation queue
        this._lifeTimeCreation = {
            process: _CreateLifetimeData,
            previousItem: null,
            nextItem: null,
        };
        this._positionCreation = {
            process: _CreatePositionData,
            previousItem: null,
            nextItem: null,
        };
        _ConnectAfter(this._positionCreation, this._lifeTimeCreation);
        this._directionCreation = {
            process: _CreateDirectionData,
            previousItem: null,
            nextItem: null,
        };
        _ConnectAfter(this._directionCreation, this._positionCreation);
        this._emitPowerCreation = {
            process: _CreateEmitPowerData,
            previousItem: null,
            nextItem: null,
        };
        _ConnectAfter(this._emitPowerCreation, this._directionCreation);
        this._sizeCreation = {
            process: _CreateSizeData,
            previousItem: null,
            nextItem: null,
        };
        _ConnectAfter(this._sizeCreation, this._emitPowerCreation);
        this._angleCreation = {
            process: _CreateAngleData,
            previousItem: null,
            nextItem: null,
        };
        _ConnectAfter(this._angleCreation, this._sizeCreation);
        this._colorCreation = {
            process: _CreateColorData,
            previousItem: null,
            nextItem: null,
        };
        _ConnectAfter(this._colorCreation, this._angleCreation);
        this._colorDeadCreation = {
            process: _CreateColorDeadData,
            previousItem: null,
            nextItem: null,
        };
        _ConnectAfter(this._colorDeadCreation, this._colorCreation);
        this._createQueueStart = this._lifeTimeCreation;
        // Processing queue
        if (!noUpdateQueue) {
            this._colorProcessing = {
                process: _ProcessColor,
                previousItem: null,
                nextItem: null,
            };
            this._angularSpeedProcessing = {
                process: _ProcessAngularSpeed,
                previousItem: null,
                nextItem: null,
            };
            _ConnectAfter(this._angularSpeedProcessing, this._colorProcessing);
            this._directionProcessing = {
                process: _ProcessDirection,
                previousItem: null,
                nextItem: null,
            };
            _ConnectAfter(this._directionProcessing, this._angularSpeedProcessing);
            this._positionProcessing = {
                process: _ProcessPosition,
                previousItem: null,
                nextItem: null,
            };
            _ConnectAfter(this._positionProcessing, this._directionProcessing);
            this._gravityProcessing = {
                process: _ProcessGravity,
                previousItem: null,
                nextItem: null,
            };
            _ConnectAfter(this._gravityProcessing, this._positionProcessing);
            this._updateQueueStart = this._colorProcessing;
        }
        this._isAnimationSheetEnabled = isAnimationSheetEnabled;
        // Setup the default processing configuration to the scene.
        this._attachImageProcessingConfiguration(null);
        // eslint-disable-next-line @typescript-eslint/naming-convention
        this._customWrappers = { 0: new DrawWrapper(this._engine) };
        this._customWrappers[0].effect = customEffect;
        this._drawWrappers = [];
        this._useInstancing = this._engine.getCaps().instancedArrays;
        this._createIndexBuffer();
        this._createVertexBuffers();
        // Default emitter type
        this.particleEmitterType = new BoxParticleEmitter();
        // Update
        this.updateFunction = (particles) => {
            if (this.noiseTexture) {
                // We need to get texture data back to CPU
                this._noiseTextureSize = this.noiseTexture.getSize();
                // eslint-disable-next-line @typescript-eslint/no-floating-promises, github/no-then
                this.noiseTexture.getContent()?.then((data) => {
                    this._noiseTextureData = data;
                });
            }
            const sameParticleArray = particles === this._particles;
            for (let index = 0; index < particles.length; index++) {
                const particle = particles[index];
                this._tempScaledUpdateSpeed = this._scaledUpdateSpeed;
                const previousAge = particle.age;
                particle.age += this._tempScaledUpdateSpeed;
                // Evaluate step to death
                if (particle.age > particle.lifeTime) {
                    const diff = particle.age - previousAge;
                    const oldDiff = particle.lifeTime - previousAge;
                    this._tempScaledUpdateSpeed = (oldDiff * this._tempScaledUpdateSpeed) / diff;
                    particle.age = particle.lifeTime;
                }
                this._ratio = particle.age / particle.lifeTime;
                particle._properties.directionScale = this._tempScaledUpdateSpeed;
                // Processing queue
                let currentQueueItem = this._updateQueueStart;
                while (currentQueueItem) {
                    currentQueueItem.process(particle, this);
                    currentQueueItem = currentQueueItem.nextItem;
                }
                if (this._isAnimationSheetEnabled && !noUpdateQueue) {
                    particle.updateCellIndex();
                }
                // Update the position of the attached sub-emitters to match their attached particle
                particle._inheritParticleInfoToSubEmitters();
                if (particle.age >= particle.lifeTime) {
                    // Recycle by swapping with last particle
                    this._emitFromParticle(particle);
                    if (particle._properties.attachedSubEmitters) {
                        for (const subEmitter of particle._properties.attachedSubEmitters) {
                            subEmitter.particleSystem.disposeOnStop = true;
                            subEmitter.particleSystem.stop();
                        }
                        particle._properties.attachedSubEmitters = null;
                    }
                    this.recycleParticle(particle);
                    if (sameParticleArray) {
                        index--;
                    }
                    continue;
                }
            }
        };
    }
    /**
     * Serializes the particle system to a JSON object.
     * @param _serializeTexture Whether to serialize the texture information
     */
    serialize(_serializeTexture) {
        throw new Error("Method not implemented.");
    }
    /**
     * Clones the particle system.
     * @param name The name of the cloned object
     * @param newEmitter The new emitter to use
     * @param _cloneTexture Also clone the textures if true
     */
    clone(name, newEmitter, _cloneTexture = false) {
        throw new Error("Method not implemented.");
    }
    _syncLifeTimeCreation() {
        if (this.targetStopDuration && this._lifeTimeGradients && this._lifeTimeGradients.length > 0) {
            this._lifeTimeCreation.process = _CreateLifeGradientsData;
            return;
        }
        this._lifeTimeCreation.process = _CreateLifetimeData;
    }
    _syncStartSizeCreation() {
        if (this._startSizeGradients && this._startSizeGradients[0] && this.targetStopDuration) {
            if (!this._startSizeCreation) {
                this._startSizeCreation = {
                    process: _CreateStartSizeGradientsData,
                    previousItem: null,
                    nextItem: null,
                };
                _ConnectAfter(this._startSizeCreation, this._sizeCreation);
            }
            return;
        }
        if (this._startSizeCreation) {
            _RemoveFromQueue(this._startSizeCreation);
            this._startSizeCreation = null;
        }
    }
    /**
     * The amount of time the particle system is running (depends of the overall update speed).
     */
    get targetStopDuration() {
        return this._targetStopDuration;
    }
    set targetStopDuration(value) {
        if (this.targetStopDuration === value) {
            return;
        }
        this._targetStopDuration = value;
        this._syncLifeTimeCreation();
        this._syncStartSizeCreation();
    }
    /**
     * Adds a new life time gradient
     * @param gradient defines the gradient to use (between 0 and 1)
     * @param factor defines the life time factor to affect to the specified gradient
     * @param factor2 defines an additional factor used to define a range ([factor, factor2]) with main value to pick the final value from
     * @returns the current particle system
     */
    addLifeTimeGradient(gradient, factor, factor2) {
        if (!this._lifeTimeGradients) {
            this._lifeTimeGradients = [];
        }
        this._addFactorGradient(this._lifeTimeGradients, gradient, factor, factor2);
        this._syncLifeTimeCreation();
        return this;
    }
    /**
     * Remove a specific life time gradient
     * @param gradient defines the gradient to remove
     * @returns the current particle system
     */
    removeLifeTimeGradient(gradient) {
        this._removeFactorGradient(this._lifeTimeGradients, gradient);
        this._syncLifeTimeCreation();
        return this;
    }
    /**
     * Adds a new size gradient
     * @param gradient defines the gradient to use (between 0 and 1)
     * @param factor defines the size factor to affect to the specified gradient
     * @param factor2 defines an additional factor used to define a range ([factor, factor2]) with main value to pick the final value from
     * @returns the current particle system
     */
    addSizeGradient(gradient, factor, factor2) {
        if (!this._sizeGradients) {
            this._sizeGradients = [];
        }
        if (this._sizeGradients.length === 0) {
            this._sizeCreation.process = _CreateSizeGradientsData;
            this._sizeGradientProcessing = {
                process: _ProcessSizeGradients,
                previousItem: null,
                nextItem: null,
            };
            _ConnectBefore(this._sizeGradientProcessing, this._gravityProcessing);
        }
        this._addFactorGradient(this._sizeGradients, gradient, factor, factor2);
        return this;
    }
    /**
     * Remove a specific size gradient
     * @param gradient defines the gradient to remove
     * @returns the current particle system
     */
    removeSizeGradient(gradient) {
        this._removeFactorGradient(this._sizeGradients, gradient);
        if (this._sizeGradients?.length === 0) {
            _RemoveFromQueue(this._sizeGradientProcessing);
            this._sizeCreation.process = _CreateSizeData;
        }
        return this;
    }
    /**
     * Adds a new color remap gradient
     * @param gradient defines the gradient to use (between 0 and 1)
     * @param min defines the color remap minimal range
     * @param max defines the color remap maximal range
     * @returns the current particle system
     */
    addColorRemapGradient(gradient, min, max) {
        if (!this._colorRemapGradients) {
            this._colorRemapGradients = [];
        }
        this._addFactorGradient(this._colorRemapGradients, gradient, min, max);
        return this;
    }
    /**
     * Remove a specific color remap gradient
     * @param gradient defines the gradient to remove
     * @returns the current particle system
     */
    removeColorRemapGradient(gradient) {
        this._removeFactorGradient(this._colorRemapGradients, gradient);
        return this;
    }
    /**
     * Adds a new alpha remap gradient
     * @param gradient defines the gradient to use (between 0 and 1)
     * @param min defines the alpha remap minimal range
     * @param max defines the alpha remap maximal range
     * @returns the current particle system
     */
    addAlphaRemapGradient(gradient, min, max) {
        if (!this._alphaRemapGradients) {
            this._alphaRemapGradients = [];
        }
        this._addFactorGradient(this._alphaRemapGradients, gradient, min, max);
        return this;
    }
    /**
     * Remove a specific alpha remap gradient
     * @param gradient defines the gradient to remove
     * @returns the current particle system
     */
    removeAlphaRemapGradient(gradient) {
        this._removeFactorGradient(this._alphaRemapGradients, gradient);
        return this;
    }
    /**
     * Adds a new angular speed gradient
     * @param gradient defines the gradient to use (between 0 and 1)
     * @param factor defines the angular speed  to affect to the specified gradient
     * @param factor2 defines an additional factor used to define a range ([factor, factor2]) with main value to pick the final value from
     * @returns the current particle system
     */
    addAngularSpeedGradient(gradient, factor, factor2) {
        if (!this._angularSpeedGradients) {
            this._angularSpeedGradients = [];
        }
        if (this._angularSpeedGradients.length === 0) {
            this._angleCreation.process = _CreateAngleGradientsData;
            this._angularSpeedGradientProcessing = {
                process: _ProcessAngularSpeedGradients,
                previousItem: null,
                nextItem: null,
            };
            _ConnectBefore(this._angularSpeedGradientProcessing, this._angularSpeedProcessing);
        }
        this._addFactorGradient(this._angularSpeedGradients, gradient, factor, factor2);
        return this;
    }
    /**
     * Remove a specific angular speed gradient
     * @param gradient defines the gradient to remove
     * @returns the current particle system
     */
    removeAngularSpeedGradient(gradient) {
        this._removeFactorGradient(this._angularSpeedGradients, gradient);
        if (this._angularSpeedGradients?.length === 0) {
            this._angleCreation.process = _CreateAngleData;
            _RemoveFromQueue(this._angularSpeedGradientProcessing);
        }
        return this;
    }
    /**
     * Adds a new velocity gradient
     * @param gradient defines the gradient to use (between 0 and 1)
     * @param factor defines the velocity to affect to the specified gradient
     * @param factor2 defines an additional factor used to define a range ([factor, factor2]) with main value to pick the final value from
     * @returns the current particle system
     */
    addVelocityGradient(gradient, factor, factor2) {
        if (!this._velocityGradients) {
            this._velocityGradients = [];
        }
        if (this._velocityGradients.length === 0) {
            this._velocityCreation = {
                process: _CreateVelocityGradients,
                previousItem: null,
                nextItem: null,
            };
            _ConnectAfter(this._velocityCreation, this._angleCreation);
            this._velocityGradientProcessing = {
                process: _ProcessVelocityGradients,
                previousItem: null,
                nextItem: null,
            };
            _ConnectBefore(this._velocityGradientProcessing, this._directionProcessing);
        }
        this._addFactorGradient(this._velocityGradients, gradient, factor, factor2);
        return this;
    }
    /**
     * Remove a specific velocity gradient
     * @param gradient defines the gradient to remove
     * @returns the current particle system
     */
    removeVelocityGradient(gradient) {
        this._removeFactorGradient(this._velocityGradients, gradient);
        if (this._velocityGradients?.length === 0) {
            _RemoveFromQueue(this._velocityCreation);
            _RemoveFromQueue(this._velocityGradientProcessing);
        }
        return this;
    }
    /**
     * Adds a new limit velocity gradient
     * @param gradient defines the gradient to use (between 0 and 1)
     * @param factor defines the limit velocity value to affect to the specified gradient
     * @param factor2 defines an additional factor used to define a range ([factor, factor2]) with main value to pick the final value from
     * @returns the current particle system
     */
    addLimitVelocityGradient(gradient, factor, factor2) {
        if (!this._limitVelocityGradients) {
            this._limitVelocityGradients = [];
        }
        if (this._limitVelocityGradients.length === 0) {
            this._limitVelocityCreation = {
                process: _CreateLimitVelocityGradients,
                previousItem: null,
                nextItem: null,
            };
            _ConnectAfter(this._limitVelocityCreation, this._angleCreation);
            this._limitVelocityGradientProcessing = {
                process: _ProcessLimitVelocityGradients,
                previousItem: null,
                nextItem: null,
            };
            _ConnectAfter(this._limitVelocityGradientProcessing, this._directionProcessing);
        }
        this._addFactorGradient(this._limitVelocityGradients, gradient, factor, factor2);
        return this;
    }
    /**
     * Remove a specific limit velocity gradient
     * @param gradient defines the gradient to remove
     * @returns the current particle system
     */
    removeLimitVelocityGradient(gradient) {
        this._removeFactorGradient(this._limitVelocityGradients, gradient);
        if (this._limitVelocityGradients?.length === 0) {
            _RemoveFromQueue(this._limitVelocityCreation);
            _RemoveFromQueue(this._limitVelocityGradientProcessing);
        }
        return this;
    }
    /**
     * Adds a new drag gradient
     * @param gradient defines the gradient to use (between 0 and 1)
     * @param factor defines the drag value to affect to the specified gradient
     * @param factor2 defines an additional factor used to define a range ([factor, factor2]) with main value to pick the final value from
     * @returns the current particle system
     */
    addDragGradient(gradient, factor, factor2) {
        if (!this._dragGradients) {
            this._dragGradients = [];
        }
        if (this._dragGradients.length === 0) {
            this._dragCreation = {
                process: _CreateDragData,
                previousItem: null,
                nextItem: null,
            };
            _ConnectBefore(this._dragCreation, this._colorDeadCreation);
            this._dragGradientProcessing = {
                process: _ProcessDragGradients,
                previousItem: null,
                nextItem: null,
            };
            _ConnectBefore(this._dragGradientProcessing, this._positionProcessing);
        }
        this._addFactorGradient(this._dragGradients, gradient, factor, factor2);
        return this;
    }
    /**
     * Remove a specific drag gradient
     * @param gradient defines the gradient to remove
     * @returns the current particle system
     */
    removeDragGradient(gradient) {
        this._removeFactorGradient(this._dragGradients, gradient);
        if (this._dragGradients?.length === 0) {
            _RemoveFromQueue(this._dragCreation);
            _RemoveFromQueue(this._dragGradientProcessing);
        }
        return this;
    }
    /**
     * Adds a new start size gradient (please note that this will only work if you set the targetStopDuration property)
     * @param gradient defines the gradient to use (between 0 and 1)
     * @param factor defines the start size value to affect to the specified gradient
     * @param factor2 defines an additional factor used to define a range ([factor, factor2]) with main value to pick the final value from
     * @returns the current particle system
     */
    addStartSizeGradient(gradient, factor, factor2) {
        if (!this._startSizeGradients) {
            this._startSizeGradients = [];
        }
        this._addFactorGradient(this._startSizeGradients, gradient, factor, factor2);
        this._syncStartSizeCreation();
        return this;
    }
    /**
     * Remove a specific start size gradient
     * @param gradient defines the gradient to remove
     * @returns the current particle system
     */
    removeStartSizeGradient(gradient) {
        this._removeFactorGradient(this._startSizeGradients, gradient);
        this._syncStartSizeCreation();
        return this;
    }
    _createRampGradientTexture() {
        if (!this._rampGradients || !this._rampGradients.length || this._rampGradientsTexture || !this._scene) {
            return;
        }
        const data = new Uint8Array(this._rawTextureWidth * 4);
        const tmpColor = TmpColors.Color3[0];
        for (let x = 0; x < this._rawTextureWidth; x++) {
            const ratio = x / this._rawTextureWidth;
            GradientHelper.GetCurrentGradient(ratio, this._rampGradients, (currentGradient, nextGradient, scale) => {
                Color3.LerpToRef(currentGradient.color, nextGradient.color, scale, tmpColor);
                data[x * 4] = tmpColor.r * 255;
                data[x * 4 + 1] = tmpColor.g * 255;
                data[x * 4 + 2] = tmpColor.b * 255;
                data[x * 4 + 3] = 255;
            });
        }
        this._rampGradientsTexture = RawTexture.CreateRGBATexture(data, this._rawTextureWidth, 1, this._scene, false, false, 1);
    }
    /**
     * Gets the current list of ramp gradients.
     * You must use addRampGradient and removeRampGradient to update this list
     * @returns the list of ramp gradients
     */
    getRampGradients() {
        return this._rampGradients;
    }
    /** Force the system to rebuild all gradients that need to be resync */
    forceRefreshGradients() {
        this._syncRampGradientTexture();
    }
    _syncRampGradientTexture() {
        if (!this._rampGradients) {
            return;
        }
        this._rampGradients.sort((a, b) => {
            if (a.gradient < b.gradient) {
                return -1;
            }
            else if (a.gradient > b.gradient) {
                return 1;
            }
            return 0;
        });
        if (this._rampGradientsTexture) {
            this._rampGradientsTexture.dispose();
            this._rampGradientsTexture = null;
        }
        this._createRampGradientTexture();
    }
    /**
     * Adds a new ramp gradient used to remap particle colors
     * @param gradient defines the gradient to use (between 0 and 1)
     * @param color defines the color to affect to the specified gradient
     * @returns the current particle system
     */
    addRampGradient(gradient, color) {
        if (!this._rampGradients) {
            this._rampGradients = [];
        }
        const rampGradient = new Color3Gradient(gradient, color);
        this._rampGradients.push(rampGradient);
        this._syncRampGradientTexture();
        return this;
    }
    /**
     * Remove a specific ramp gradient
     * @param gradient defines the gradient to remove
     * @returns the current particle system
     */
    removeRampGradient(gradient) {
        this._removeGradientAndTexture(gradient, this._rampGradients, this._rampGradientsTexture);
        this._rampGradientsTexture = null;
        if (this._rampGradients && this._rampGradients.length > 0) {
            this._createRampGradientTexture();
        }
        return this;
    }
    /**
     * Adds a new color gradient
     * @param gradient defines the gradient to use (between 0 and 1)
     * @param color1 defines the color to affect to the specified gradient
     * @param color2 defines an additional color used to define a range ([color, color2]) with main color to pick the final color from
     * @returns this particle system
     */
    addColorGradient(gradient, color1, color2) {
        if (!this._colorGradients) {
            this._colorGradients = [];
        }
        if (this._colorGradients.length === 0) {
            this._colorCreation.process = _CreateColorGradientsData;
            this._colorProcessing.process = _ProcessColorGradients;
        }
        const colorGradient = new ColorGradient(gradient, color1, color2);
        this._colorGradients.push(colorGradient);
        this._colorGradients.sort((a, b) => {
            if (a.gradient < b.gradient) {
                return -1;
            }
            else if (a.gradient > b.gradient) {
                return 1;
            }
            return 0;
        });
        return this;
    }
    /**
     * Remove a specific color gradient
     * @param gradient defines the gradient to remove
     * @returns this particle system
     */
    removeColorGradient(gradient) {
        if (!this._colorGradients) {
            return this;
        }
        let index = 0;
        for (const colorGradient of this._colorGradients) {
            if (colorGradient.gradient === gradient) {
                this._colorGradients.splice(index, 1);
                break;
            }
            index++;
        }
        if (this._colorGradients.length === 0) {
            this._colorCreation.process = _CreateColorData;
            this._colorProcessing.process = _ProcessColor;
        }
        return this;
    }
    /**
     * Resets the draw wrappers cache
     */
    resetDrawCache() {
        if (!this._drawWrappers) {
            return;
        }
        for (const drawWrappers of this._drawWrappers) {
            if (drawWrappers) {
                for (const drawWrapper of drawWrappers) {
                    drawWrapper?.dispose();
                }
            }
        }
        this._drawWrappers = [];
    }
    /** @internal */
    _fetchR(u, v, width, height, pixels) {
        u = Math.abs(u) * 0.5 + 0.5;
        v = Math.abs(v) * 0.5 + 0.5;
        const wrappedU = ((u * width) % width) | 0;
        const wrappedV = ((v * height) % height) | 0;
        const position = (wrappedU + wrappedV * width) * 4;
        return pixels[position] / 255;
    }
    _reset() {
        this._resetEffect();
    }
    _resetEffect() {
        if (this._vertexBuffer) {
            this._vertexBuffer.dispose();
            this._vertexBuffer = null;
        }
        if (this._spriteBuffer) {
            this._spriteBuffer.dispose();
            this._spriteBuffer = null;
        }
        if (this._vertexArrayObject) {
            this._engine.releaseVertexArrayObject(this._vertexArrayObject);
            this._vertexArrayObject = null;
        }
        this._createVertexBuffers();
    }
    _createVertexBuffers() {
        this._vertexBufferSize = this._useInstancing ? 10 : 12;
        if (this._isAnimationSheetEnabled) {
            this._vertexBufferSize += 1;
        }
        if (!this._isBillboardBased ||
            this.billboardMode === 8 ||
            this.billboardMode === 9) {
            this._vertexBufferSize += 3;
        }
        if (this._useRampGradients) {
            this._vertexBufferSize += 4;
        }
        const engine = this._engine;
        const vertexSize = this._vertexBufferSize * (this._useInstancing ? 1 : 4);
        this._vertexData = new Float32Array(this._capacity * vertexSize);
        this._vertexBuffer = new Buffer(engine, this._vertexData, true, vertexSize);
        let dataOffset = 0;
        const positions = this._vertexBuffer.createVertexBuffer(VertexBuffer.PositionKind, dataOffset, 3, this._vertexBufferSize, this._useInstancing);
        this._vertexBuffers[VertexBuffer.PositionKind] = positions;
        dataOffset += 3;
        const colors = this._vertexBuffer.createVertexBuffer(VertexBuffer.ColorKind, dataOffset, 4, this._vertexBufferSize, this._useInstancing);
        this._vertexBuffers[VertexBuffer.ColorKind] = colors;
        dataOffset += 4;
        const options = this._vertexBuffer.createVertexBuffer("angle", dataOffset, 1, this._vertexBufferSize, this._useInstancing);
        this._vertexBuffers["angle"] = options;
        dataOffset += 1;
        const size = this._vertexBuffer.createVertexBuffer("size", dataOffset, 2, this._vertexBufferSize, this._useInstancing);
        this._vertexBuffers["size"] = size;
        dataOffset += 2;
        if (this._isAnimationSheetEnabled) {
            const cellIndexBuffer = this._vertexBuffer.createVertexBuffer("cellIndex", dataOffset, 1, this._vertexBufferSize, this._useInstancing);
            this._vertexBuffers["cellIndex"] = cellIndexBuffer;
            dataOffset += 1;
        }
        if (!this._isBillboardBased ||
            this.billboardMode === 8 ||
            this.billboardMode === 9) {
            const directionBuffer = this._vertexBuffer.createVertexBuffer("direction", dataOffset, 3, this._vertexBufferSize, this._useInstancing);
            this._vertexBuffers["direction"] = directionBuffer;
            dataOffset += 3;
        }
        if (this._useRampGradients) {
            const rampDataBuffer = this._vertexBuffer.createVertexBuffer("remapData", dataOffset, 4, this._vertexBufferSize, this._useInstancing);
            this._vertexBuffers["remapData"] = rampDataBuffer;
            dataOffset += 4;
        }
        let offsets;
        if (this._useInstancing) {
            const spriteData = new Float32Array([0, 0, 1, 0, 0, 1, 1, 1]);
            this._spriteBuffer = new Buffer(engine, spriteData, false, 2);
            offsets = this._spriteBuffer.createVertexBuffer("offset", 0, 2);
        }
        else {
            offsets = this._vertexBuffer.createVertexBuffer("offset", dataOffset, 2, this._vertexBufferSize, this._useInstancing);
        }
        this._vertexBuffers["offset"] = offsets;
        this.resetDrawCache();
    }
    _createIndexBuffer() {
        if (this._useInstancing) {
            this._linesIndexBufferUseInstancing = this._engine.createIndexBuffer(new Uint32Array([0, 1, 1, 3, 3, 2, 2, 0, 0, 3]));
            return;
        }
        const indices = [];
        const indicesWireframe = [];
        let index = 0;
        for (let count = 0; count < this._capacity; count++) {
            indices.push(index);
            indices.push(index + 1);
            indices.push(index + 2);
            indices.push(index);
            indices.push(index + 2);
            indices.push(index + 3);
            indicesWireframe.push(index, index + 1, index + 1, index + 2, index + 2, index + 3, index + 3, index, index, index + 3);
            index += 4;
        }
        this._indexBuffer = this._engine.createIndexBuffer(indices);
        this._linesIndexBuffer = this._engine.createIndexBuffer(indicesWireframe);
    }
    /**
     * Gets the maximum number of particles active at the same time.
     * @returns The max number of active particles.
     */
    getCapacity() {
        return this._capacity;
    }
    /**
     * Gets whether there are still active particles in the system.
     * @returns True if it is alive, otherwise false.
     */
    isAlive() {
        return this._alive;
    }
    /**
     * Gets if the system has been started. (Note: this will still be true after stop is called)
     * @returns True if it has been started, otherwise false.
     */
    isStarted() {
        return this._started;
    }
    /** @internal */
    _preStart() {
        // Do nothing
    }
    /**
     * Starts the particle system and begins to emit
     * @param delay defines the delay in milliseconds before starting the system (this.startDelay by default)
     */
    start(delay = this.startDelay) {
        if (!this.targetStopDuration && this._hasTargetStopDurationDependantGradient()) {
            throw "Particle system started with a targetStopDuration dependant gradient (eg. startSizeGradients) but no targetStopDuration set";
        }
        if (delay) {
            this.startDelay = delay;
            setTimeout(() => {
                this.start(0);
            }, delay);
            return;
        }
        this._started = true;
        this._stopped = false;
        this._actualFrame = 0;
        this._preStart();
        // Reset emit gradient so it acts the same on every start
        if (this._emitRateGradients) {
            if (this._emitRateGradients.length > 0) {
                this._currentEmitRateGradient = this._emitRateGradients[0];
                this._currentEmitRate1 = this._currentEmitRateGradient.getFactor();
                this._currentEmitRate2 = this._currentEmitRate1;
            }
            if (this._emitRateGradients.length > 1) {
                this._currentEmitRate2 = this._emitRateGradients[1].getFactor();
            }
        }
        // Reset start size gradient so it acts the same on every start
        if (this._startSizeGradients) {
            if (this._startSizeGradients.length > 0) {
                this._currentStartSizeGradient = this._startSizeGradients[0];
                this._currentStartSize1 = this._currentStartSizeGradient.getFactor();
                this._currentStartSize2 = this._currentStartSize1;
            }
            if (this._startSizeGradients.length > 1) {
                this._currentStartSize2 = this._startSizeGradients[1].getFactor();
            }
        }
        if (this.preWarmCycles) {
            if (this.emitter?.getClassName().indexOf("Mesh") !== -1) {
                this.emitter.computeWorldMatrix(true);
            }
            // Ensure the scene transform matrix is up-to-date so matrix-dependent
            // update steps (notably flow map sampling, which projects world positions
            // into screen space) produce correct results during pre-warm, before any
            // render has had a chance to populate the matrix.
            this._scene?.updateTransformMatrix();
            const noiseTextureAsProcedural = this.noiseTexture;
            if (noiseTextureAsProcedural && noiseTextureAsProcedural.onGeneratedObservable) {
                noiseTextureAsProcedural.onGeneratedObservable.addOnce(() => {
                    setTimeout(() => {
                        for (let index = 0; index < this.preWarmCycles; index++) {
                            this.animate(true);
                            noiseTextureAsProcedural.render();
                        }
                    });
                });
            }
            else {
                for (let index = 0; index < this.preWarmCycles; index++) {
                    this.animate(true);
                }
            }
        }
        // Animations
        if (this.beginAnimationOnStart && this.animations && this.animations.length > 0 && this._scene) {
            this._scene.beginAnimation(this, this.beginAnimationFrom, this.beginAnimationTo, this.beginAnimationLoop);
        }
        this.onStartedObservable.notifyObservers(this);
    }
    /**
     * Stops the particle system.
     * @param stopSubEmitters if true it will stop the current system and all created sub-Systems if false it will stop the current root system only, this param is used by the root particle system only. The default value is true.
     */
    stop(stopSubEmitters = true) {
        if (this._stopped) {
            return;
        }
        this.onStoppedObservable.notifyObservers(this);
        this._stopped = true;
        this._postStop(stopSubEmitters);
    }
    /** @internal */
    _postStop(_stopSubEmitters) {
        // Do nothing
    }
    // Animation sheet
    /**
     * Remove all active particles
     */
    reset() {
        this._stockParticles.length = 0;
        this._particles.length = 0;
    }
    /**
     * @internal (for internal use only)
     */
    _appendParticleVertex(index, particle, offsetX, offsetY) {
        let offset = index * this._vertexBufferSize;
        const floatingOriginOffset = TmpVectors.Vector3[0].copyFrom(this._scene?.floatingOriginOffset || Vector3.ZeroReadOnly);
        this._vertexData[offset++] = particle.position.x + this.worldOffset.x - floatingOriginOffset.x;
        this._vertexData[offset++] = particle.position.y + this.worldOffset.y - floatingOriginOffset.y;
        this._vertexData[offset++] = particle.position.z + this.worldOffset.z - floatingOriginOffset.z;
        this._vertexData[offset++] = particle.color.r;
        this._vertexData[offset++] = particle.color.g;
        this._vertexData[offset++] = particle.color.b;
        this._vertexData[offset++] = particle.color.a;
        this._vertexData[offset++] = particle.angle;
        this._vertexData[offset++] = particle.scale.x * particle.size;
        this._vertexData[offset++] = particle.scale.y * particle.size;
        if (this._isAnimationSheetEnabled) {
            this._vertexData[offset++] = particle.cellIndex;
        }
        if (!this._isBillboardBased) {
            if (particle._properties.initialDirection) {
                let initialDirection = particle._properties.initialDirection;
                if (this.isLocal) {
                    Vector3.TransformNormalToRef(initialDirection, this._emitterWorldMatrix, TmpVectors.Vector3[0]);
                    initialDirection = TmpVectors.Vector3[0];
                }
                if (initialDirection.x === 0 && initialDirection.z === 0) {
                    initialDirection.x = 0.001;
                }
                this._vertexData[offset++] = initialDirection.x;
                this._vertexData[offset++] = initialDirection.y;
                this._vertexData[offset++] = initialDirection.z;
            }
            else {
                let direction = particle.direction;
                if (this.isLocal) {
                    Vector3.TransformNormalToRef(direction, this._emitterWorldMatrix, TmpVectors.Vector3[0]);
                    direction = TmpVectors.Vector3[0];
                }
                if (direction.x === 0 && direction.z === 0) {
                    direction.x = 0.001;
                }
                this._vertexData[offset++] = direction.x;
                this._vertexData[offset++] = direction.y;
                this._vertexData[offset++] = direction.z;
            }
        }
        else if (this.billboardMode === 8 || this.billboardMode === 9) {
            this._vertexData[offset++] = particle.direction.x;
            this._vertexData[offset++] = particle.direction.y;
            this._vertexData[offset++] = particle.direction.z;
        }
        if (this._useRampGradients && particle.remapData) {
            this._vertexData[offset++] = particle.remapData.x;
            this._vertexData[offset++] = particle.remapData.y;
            this._vertexData[offset++] = particle.remapData.z;
            this._vertexData[offset++] = particle.remapData.w;
        }
        if (!this._useInstancing) {
            if (this._isAnimationSheetEnabled) {
                if (offsetX === 0) {
                    offsetX = this._epsilon;
                }
                else if (offsetX === 1) {
                    offsetX = 1 - this._epsilon;
                }
                if (offsetY === 0) {
                    offsetY = this._epsilon;
                }
                else if (offsetY === 1) {
                    offsetY = 1 - this._epsilon;
                }
            }
            this._vertexData[offset++] = offsetX;
            this._vertexData[offset] = offsetY;
        }
    }
    /** @internal */
    _prepareParticle(_particle) {
        //Do nothing
    }
    _createNewOnes(newParticles) {
        // Add new ones
        let particle;
        for (let index = 0; index < newParticles; index++) {
            if (this._particles.length === this._capacity) {
                break;
            }
            particle = this._createParticle();
            this._particles.push(particle);
            // Creation queue
            let currentQueueItem = this._createQueueStart;
            while (currentQueueItem) {
                currentQueueItem.process(particle, this);
                currentQueueItem = currentQueueItem.nextItem;
            }
            // Update the position of the attached sub-emitters to match their attached particle
            particle._inheritParticleInfoToSubEmitters();
        }
    }
    _update(newParticles) {
        // Update current
        this._alive = this._particles.length > 0;
        if (this.emitter.position) {
            const emitterMesh = this.emitter;
            this._emitterWorldMatrix = emitterMesh.getWorldMatrix();
        }
        else {
            const emitterPosition = this.emitter;
            this._emitterWorldMatrix = Matrix.Translation(emitterPosition.x, emitterPosition.y, emitterPosition.z);
        }
        this._emitterWorldMatrix.invertToRef(this._emitterInverseWorldMatrix);
        this.updateFunction(this._particles);
        this._createNewOnes(newParticles);
    }
    /**
     * @internal
     */
    static _GetAttributeNamesOrOptions(isAnimationSheetEnabled = false, isBillboardBased = false, useRampGradients = false) {
        const attributeNamesOrOptions = [VertexBuffer.PositionKind, VertexBuffer.ColorKind, "angle", "offset", "size"];
        if (isAnimationSheetEnabled) {
            attributeNamesOrOptions.push("cellIndex");
        }
        if (!isBillboardBased) {
            attributeNamesOrOptions.push("direction");
        }
        if (useRampGradients) {
            attributeNamesOrOptions.push("remapData");
        }
        return attributeNamesOrOptions;
    }
    /**
     * @internal
     */
    static _GetEffectCreationOptions(isAnimationSheetEnabled = false, useLogarithmicDepth = false, applyFog = false) {
        const effectCreationOption = ["invView", "view", "projection", "textureMask", "translationPivot", "eyePosition"];
        AddClipPlaneUniforms(effectCreationOption);
        if (isAnimationSheetEnabled) {
            effectCreationOption.push("particlesInfos");
        }
        if (useLogarithmicDepth) {
            effectCreationOption.push("logarithmicDepthConstant");
        }
        if (applyFog) {
            effectCreationOption.push("vFogInfos");
            effectCreationOption.push("vFogColor");
        }
        return effectCreationOption;
    }
    /**
     * Fill the defines array according to the current settings of the particle system
     * @param defines Array to be updated
     * @param blendMode blend mode to take into account when updating the array
     * @param fillImageProcessing fills the image processing defines
     */
    fillDefines(defines, blendMode, fillImageProcessing = true) {
        if (this._scene) {
            PrepareStringDefinesForClipPlanes(this, this._scene, defines);
            if (this.applyFog && this._scene.fogEnabled && this._scene.fogMode !== 0) {
                defines.push("#define FOG");
            }
        }
        if (this._isAnimationSheetEnabled) {
            defines.push("#define ANIMATESHEET");
        }
        if (this.useLogarithmicDepth) {
            defines.push("#define LOGARITHMICDEPTH");
        }
        if (blendMode === BaseParticleSystem.BLENDMODE_MULTIPLY) {
            defines.push("#define BLENDMULTIPLYMODE");
        }
        if (this._useRampGradients) {
            defines.push("#define RAMPGRADIENT");
        }
        if (this._isBillboardBased) {
            defines.push("#define BILLBOARD");
            switch (this.billboardMode) {
                case 2:
                    defines.push("#define BILLBOARDY");
                    break;
                case 8:
                case 9:
                    defines.push("#define BILLBOARDSTRETCHED");
                    if (this.billboardMode === 9) {
                        defines.push("#define BILLBOARDSTRETCHED_LOCAL");
                    }
                    break;
                case 7:
                    defines.push("#define BILLBOARDMODE_ALL");
                    break;
                default:
                    break;
            }
        }
        if (fillImageProcessing && this._imageProcessingConfiguration) {
            this._imageProcessingConfiguration.prepareDefines(this._imageProcessingConfigurationDefines);
            defines.push(this._imageProcessingConfigurationDefines.toString());
        }
    }
    /**
     * Fill the uniforms, attributes and samplers arrays according to the current settings of the particle system
     * @param uniforms Uniforms array to fill
     * @param attributes Attributes array to fill
     * @param samplers Samplers array to fill
     */
    fillUniformsAttributesAndSamplerNames(uniforms, attributes, samplers) {
        attributes.push(...ThinParticleSystem._GetAttributeNamesOrOptions(this._isAnimationSheetEnabled, this._isBillboardBased &&
            this.billboardMode !== 8 &&
            this.billboardMode !== 9, this._useRampGradients));
        uniforms.push(...ThinParticleSystem._GetEffectCreationOptions(this._isAnimationSheetEnabled, this.useLogarithmicDepth, this.applyFog));
        samplers.push("diffuseSampler", "rampSampler");
        if (this._imageProcessingConfiguration) {
            PrepareUniformsForImageProcessing(uniforms, this._imageProcessingConfigurationDefines);
            PrepareSamplersForImageProcessing(samplers, this._imageProcessingConfigurationDefines);
        }
    }
    /**
     * @internal
     */
    _getWrapper(blendMode) {
        const customWrapper = this._getCustomDrawWrapper(blendMode);
        if (customWrapper?.effect) {
            return customWrapper;
        }
        const defines = [];
        this.fillDefines(defines, blendMode);
        // Effect
        const currentRenderPassId = this._engine._features.supportRenderPasses ? this._engine.currentRenderPassId : 0;
        let drawWrappers = this._drawWrappers[currentRenderPassId];
        if (!drawWrappers) {
            drawWrappers = this._drawWrappers[currentRenderPassId] = [];
        }
        let drawWrapper = drawWrappers[blendMode];
        if (!drawWrapper) {
            drawWrapper = new DrawWrapper(this._engine);
            if (drawWrapper.drawContext) {
                drawWrapper.drawContext.useInstancing = this._useInstancing;
            }
            drawWrappers[blendMode] = drawWrapper;
        }
        const join = defines.join("\n");
        if (drawWrapper.defines !== join) {
            const attributesNamesOrOptions = [];
            const effectCreationOption = [];
            const samplers = [];
            this.fillUniformsAttributesAndSamplerNames(effectCreationOption, attributesNamesOrOptions, samplers);
            drawWrapper.setEffect(this._engine.createEffect("particles", attributesNamesOrOptions, effectCreationOption, samplers, join, undefined, undefined, undefined, undefined, this._shaderLanguage), join);
        }
        return drawWrapper;
    }
    /**
     * Animates the particle system for the current frame by emitting new particles and or animating the living ones.
     * @param preWarmOnly will prevent the system from updating the vertex buffer (default is false)
     */
    animate(preWarmOnly = false) {
        if (!this._started || this.paused) {
            return;
        }
        if (!preWarmOnly && this._scene) {
            // Check
            if (!this.isReady()) {
                return;
            }
            if (this._currentRenderId === this._scene.getFrameId()) {
                return;
            }
            this._currentRenderId = this._scene.getFrameId();
        }
        this._scaledUpdateSpeed = this.updateSpeed * (preWarmOnly ? this.preWarmStepOffset : this._scene?.getAnimationRatio() || 1);
        // Determine the number of particles we need to create
        let newParticles;
        if (this.manualEmitCount > -1) {
            newParticles = this.manualEmitCount;
            this._newPartsExcess = 0;
            this.manualEmitCount = 0;
        }
        else {
            const rate = this._calculateEmitRate();
            newParticles = (rate * this._scaledUpdateSpeed) >> 0;
            this._newPartsExcess += rate * this._scaledUpdateSpeed - newParticles;
        }
        if (this._newPartsExcess > 1.0) {
            newParticles += this._newPartsExcess >> 0;
            this._newPartsExcess -= this._newPartsExcess >> 0;
        }
        this._alive = false;
        if (!this._stopped) {
            this._actualFrame += this._scaledUpdateSpeed;
            if (this.targetStopDuration && this._actualFrame >= this.targetStopDuration) {
                this.stop();
            }
        }
        else {
            newParticles = 0;
        }
        this._update(newParticles);
        // Stopped?
        if (this._stopped) {
            if (!this._alive) {
                this._started = false;
                if (this.onAnimationEnd) {
                    this.onAnimationEnd();
                }
                if (this.disposeOnStop && this._scene) {
                    this._scene._toBeDisposed.push(this);
                }
            }
        }
        if (!preWarmOnly) {
            // Update VBO
            let offset = 0;
            for (let index = 0; index < this._particles.length; index++) {
                const particle = this._particles[index];
                this._appendParticleVertices(offset, particle);
                offset += this._useInstancing ? 1 : 4;
            }
            if (this._vertexBuffer) {
                if (this._useFixedCapacityForSnapshot) {
                    // The vertex buffer is uploaded at full capacity so the FAST-snapshot bundle's draw call stays valid.
                    // Inactive slots must be zeroed so they collapse to degenerate (size=0) quads that emit no fragments.
                    const stride = this._vertexBufferSize * (this._useInstancing ? 1 : 4);
                    const currentCount = this._particles.length;
                    if (currentCount < this._fixedCapacityHighWaterMark) {
                        this._vertexData.fill(0, currentCount * stride, this._fixedCapacityHighWaterMark * stride);
                    }
                    this._fixedCapacityHighWaterMark = currentCount;
                    this._vertexBuffer.updateDirectly(this._vertexData, 0, this._capacity);
                }
                else {
                    this._vertexBuffer.updateDirectly(this._vertexData, 0, this._particles.length);
                }
            }
        }
        if (this.manualEmitCount === 0 && this.disposeOnStop) {
            this.stop();
        }
    }
    /** @internal */
    _initFixedCapacitySnapshotData() {
        if (this._useFixedCapacityForSnapshot) {
            return false;
        }
        this._useFixedCapacityForSnapshot = true;
        this._vertexData.fill(0);
        this._fixedCapacityHighWaterMark = 0;
        this._vertexBuffer?.updateDirectly(this._vertexData, 0, this._capacity);
        return true;
    }
    /** @internal */
    _clearFixedCapacitySnapshotData() {
        if (!this._useFixedCapacityForSnapshot || !this._vertexBuffer || this._fixedCapacityHighWaterMark === 0) {
            return;
        }
        const stride = this._vertexBufferSize * (this._useInstancing ? 1 : 4);
        this._vertexData.fill(0, 0, this._fixedCapacityHighWaterMark * stride);
        this._fixedCapacityHighWaterMark = 0;
        this._vertexBuffer.updateDirectly(this._vertexData, 0, this._capacity);
    }
    /**
     * Internal only. Calculates the current emit rate based on the gradients if any.
     * @returns The emit rate
     * @internal
     */
    _calculateEmitRate() {
        let rate = this.emitRate;
        if (this._emitRateGradients && this._emitRateGradients.length > 0 && this.targetStopDuration) {
            const ratio = this._actualFrame / this.targetStopDuration;
            GradientHelper.GetCurrentGradient(ratio, this._emitRateGradients, (currentGradient, nextGradient, scale) => {
                if (currentGradient !== this._currentEmitRateGradient) {
                    this._currentEmitRate1 = this._currentEmitRate2;
                    this._currentEmitRate2 = nextGradient.getFactor();
                    this._currentEmitRateGradient = currentGradient;
                }
                rate = Lerp(this._currentEmitRate1, this._currentEmitRate2, scale);
            });
        }
        return rate;
    }
    _appendParticleVertices(offset, particle) {
        this._appendParticleVertex(offset++, particle, 0, 0);
        if (!this._useInstancing) {
            this._appendParticleVertex(offset++, particle, 1, 0);
            this._appendParticleVertex(offset++, particle, 1, 1);
            this._appendParticleVertex(offset, particle, 0, 1);
        }
    }
    /**
     * Rebuilds the particle system.
     */
    rebuild() {
        if (this._engine.getCaps().vertexArrayObject) {
            this._vertexArrayObject = null;
        }
        this._createIndexBuffer();
        this._spriteBuffer?._rebuild();
        this._createVertexBuffers();
        this.resetDrawCache();
    }
    async _initShaderSourceAsync() {
        const engine = this._engine;
        if (engine.isWebGPU && !ThinParticleSystem.ForceGLSL) {
            this._shaderLanguage = 1 /* ShaderLanguage.WGSL */;
            await Promise.all([import("../ShadersWGSL/particles.vertex.js"), import("../ShadersWGSL/particles.fragment.js")]);
        }
        else {
            await Promise.all([import("../Shaders/particles.vertex.js"), import("../Shaders/particles.fragment.js")]);
        }
        this._shadersLoaded = true;
    }
    /**
     * Is this system ready to be used/rendered
     * @returns true if the system is ready
     */
    isReady() {
        if (!this._shadersLoaded) {
            return false;
        }
        if (!this.emitter || (this._imageProcessingConfiguration && !this._imageProcessingConfiguration.isReady()) || !this.particleTexture || !this.particleTexture.isReady()) {
            return false;
        }
        if (this.blendMode !== BaseParticleSystem.BLENDMODE_MULTIPLYADD) {
            if (!this._getWrapper(this.blendMode).effect.isReady()) {
                return false;
            }
        }
        else {
            if (!this._getWrapper(BaseParticleSystem.BLENDMODE_MULTIPLY).effect.isReady()) {
                return false;
            }
            if (!this._getWrapper(BaseParticleSystem.BLENDMODE_ADD).effect.isReady()) {
                return false;
            }
        }
        return true;
    }
    _render(blendMode) {
        const drawWrapper = this._getWrapper(blendMode);
        const effect = drawWrapper.effect;
        const engine = this._engine;
        // Render
        engine.enableEffect(drawWrapper);
        const viewMatrix = this.defaultViewMatrix ?? this._scene.getViewMatrix();
        effect.setTexture("diffuseSampler", this.particleTexture);
        effect.setMatrix("view", viewMatrix);
        effect.setMatrix("projection", this.defaultProjectionMatrix ?? this._scene.getProjectionMatrix());
        if (this._isAnimationSheetEnabled && this.particleTexture) {
            const baseSize = this.particleTexture.getBaseSize();
            effect.setFloat3("particlesInfos", this.spriteCellWidth / baseSize.width, this.spriteCellHeight / baseSize.height, this.spriteCellWidth / baseSize.width);
        }
        effect.setVector2("translationPivot", this.translationPivot);
        effect.setFloat4("textureMask", this.textureMask.r, this.textureMask.g, this.textureMask.b, this.textureMask.a);
        if (this._isBillboardBased && this._scene) {
            const camera = this._scene.activeCamera;
            effect.setVector3("eyePosition", camera.globalPosition);
        }
        if (this._rampGradientsTexture) {
            if (!this._rampGradients || !this._rampGradients.length) {
                this._rampGradientsTexture.dispose();
                this._rampGradientsTexture = null;
            }
            effect.setTexture("rampSampler", this._rampGradientsTexture);
        }
        const defines = effect.defines;
        if (this._scene) {
            BindClipPlane(effect, this, this._scene);
            if (this.applyFog) {
                BindFogParameters(this._scene, undefined, effect);
            }
        }
        if (defines.indexOf("#define BILLBOARDMODE_ALL") >= 0) {
            viewMatrix.invertToRef(TmpVectors.Matrix[0]);
            effect.setMatrix("invView", TmpVectors.Matrix[0]);
        }
        if (this._vertexArrayObject !== undefined) {
            if (this._scene?.forceWireframe) {
                engine.bindBuffers(this._vertexBuffers, this._linesIndexBufferUseInstancing, effect);
            }
            else {
                if (!this._vertexArrayObject) {
                    this._vertexArrayObject = this._engine.recordVertexArrayObject(this._vertexBuffers, this._indexBuffer, effect);
                }
                this._engine.bindVertexArrayObject(this._vertexArrayObject, this._indexBuffer);
            }
        }
        else {
            if (!this._indexBuffer) {
                // Use instancing mode
                engine.bindBuffers(this._vertexBuffers, this._scene?.forceWireframe ? this._linesIndexBufferUseInstancing : null, effect);
            }
            else {
                engine.bindBuffers(this._vertexBuffers, this._scene?.forceWireframe ? this._linesIndexBuffer : this._indexBuffer, effect);
            }
        }
        // Log. depth
        if (this.useLogarithmicDepth && this._scene) {
            BindLogDepth(defines, effect, this._scene);
        }
        // image processing
        if (this._imageProcessingConfiguration && !this._imageProcessingConfiguration.applyByPostProcess) {
            this._imageProcessingConfiguration.bind(effect);
        }
        // Draw order
        this._setEngineBasedOnBlendMode(blendMode);
        if (this._onBeforeDrawParticlesObservable) {
            this._onBeforeDrawParticlesObservable.notifyObservers(effect);
        }
        if (this._useInstancing) {
            if (this._scene?.forceWireframe) {
                engine.drawElementsType(6, 0, 10, this._useFixedCapacityForSnapshot ? this._capacity : this._particles.length);
            }
            else {
                engine.drawArraysType(7, 0, 4, this._useFixedCapacityForSnapshot ? this._capacity : this._particles.length);
            }
        }
        else {
            if (this._scene?.forceWireframe) {
                engine.drawElementsType(1, 0, (this._useFixedCapacityForSnapshot ? this._capacity : this._particles.length) * 10);
            }
            else {
                engine.drawElementsType(0, 0, (this._useFixedCapacityForSnapshot ? this._capacity : this._particles.length) * 6);
            }
        }
        return this._particles.length;
    }
    /**
     * Renders the particle system in its current state.
     * @returns the current number of particles
     */
    render() {
        // Check
        if (!this.isReady() || (!this._particles.length && !this._useFixedCapacityForSnapshot)) {
            return 0;
        }
        const engine = this._engine;
        if (engine.setState) {
            engine.setState(false);
            if (this.forceDepthWrite) {
                engine.setDepthWrite(true);
            }
        }
        let outparticles;
        if (this.blendMode === BaseParticleSystem.BLENDMODE_MULTIPLYADD) {
            outparticles = this._render(BaseParticleSystem.BLENDMODE_MULTIPLY) + this._render(BaseParticleSystem.BLENDMODE_ADD);
        }
        else {
            outparticles = this._render(this.blendMode);
        }
        this._engine.unbindInstanceAttributes();
        this._engine.setAlphaMode(0);
        return outparticles;
    }
    /** @internal */
    _onDispose(_disposeAttachedSubEmitters = false, _disposeEndSubEmitters = false) {
        // Do Nothing
    }
    /**
     * Disposes the particle system and free the associated resources
     * @param disposeTexture defines if the particle texture must be disposed as well (true by default)
     * @param disposeAttachedSubEmitters defines if the attached sub-emitters must be disposed as well (false by default)
     * @param disposeEndSubEmitters defines if the end type sub-emitters must be disposed as well (false by default)
     */
    dispose(disposeTexture = true, disposeAttachedSubEmitters = false, disposeEndSubEmitters = false) {
        this.resetDrawCache();
        if (this._vertexBuffer) {
            this._vertexBuffer.dispose();
            this._vertexBuffer = null;
        }
        if (this._spriteBuffer) {
            this._spriteBuffer.dispose();
            this._spriteBuffer = null;
        }
        if (this._indexBuffer) {
            this._engine._releaseBuffer(this._indexBuffer);
            this._indexBuffer = null;
        }
        if (this._linesIndexBuffer) {
            this._engine._releaseBuffer(this._linesIndexBuffer);
            this._linesIndexBuffer = null;
        }
        if (this._linesIndexBufferUseInstancing) {
            this._engine._releaseBuffer(this._linesIndexBufferUseInstancing);
            this._linesIndexBufferUseInstancing = null;
        }
        if (this._vertexArrayObject) {
            this._engine.releaseVertexArrayObject(this._vertexArrayObject);
            this._vertexArrayObject = null;
        }
        if (disposeTexture && this.particleTexture) {
            this.particleTexture.dispose();
            this.particleTexture = null;
        }
        if (disposeTexture && this.noiseTexture) {
            this.noiseTexture.dispose();
            this.noiseTexture = null;
        }
        if (this._rampGradientsTexture) {
            this._rampGradientsTexture.dispose();
            this._rampGradientsTexture = null;
        }
        this._onDispose(disposeAttachedSubEmitters, disposeEndSubEmitters);
        if (this._onBeforeDrawParticlesObservable) {
            this._onBeforeDrawParticlesObservable.clear();
        }
        // Remove from scene
        if (this._scene) {
            const index = this._scene.particleSystems.indexOf(this);
            if (index > -1) {
                this._scene.particleSystems.splice(index, 1);
            }
            this._scene._activeParticleSystems.dispose();
        }
        // Callback
        this.onDisposeObservable.notifyObservers(this);
        this.onDisposeObservable.clear();
        this.onStoppedObservable.clear();
        this.onStartedObservable.clear();
        this.reset();
        this._isDisposed = true;
    }
}
/**
 * Force all the particle systems to compile to glsl even on WebGPU engines.
 * False by default. This is mostly meant for backward compatibility.
 */
ThinParticleSystem.ForceGLSL = false;
//# sourceMappingURL=thinParticleSystem.pure.js.map