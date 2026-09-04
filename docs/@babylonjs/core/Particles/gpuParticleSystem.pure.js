/** This file must only contain pure code and pure imports */
import { ColorGradient, GradientHelper } from "../Misc/gradients.js";
import { Observable } from "../Misc/observable.pure.js";
import { Vector3, Matrix, TmpVectors } from "../Maths/math.vector.pure.js";
import { Color4, TmpColors } from "../Maths/math.color.pure.js";
import { Lerp } from "../Maths/math.scalar.functions.js";
import { VertexBuffer, Buffer } from "../Buffers/buffer.pure.js";
import { BaseParticleSystem } from "./baseParticleSystem.pure.js";
import { ParticleSystem } from "./particleSystem.pure.js";
import { Attractor } from "./attractor.js";
import { Logger } from "../Misc/logger.js";
import { BoxParticleEmitter } from "../Particles/EmitterTypes/boxParticleEmitter.js";
import { Scene } from "../scene.pure.js";
import { ImageProcessingConfiguration } from "../Materials/imageProcessingConfiguration.pure.js";
import { RawTexture } from "../Materials/Textures/rawTexture.js";

import { EngineStore } from "../Engines/engineStore.js";
import { RegisterAnimatable } from "../Animations/animatable.pure.js";
import { CustomParticleEmitter } from "./EmitterTypes/customParticleEmitter.js";
import { AbstractEngine } from "../Engines/abstractEngine.pure.js";
import { DrawWrapper } from "../Materials/drawWrapper.js";
import { GetClass } from "../Misc/typeStore.js";
import { _IsSideEffectImplemented } from "../Misc/devTools.js";
import { AddClipPlaneUniforms, BindClipPlane, PrepareStringDefinesForClipPlanes } from "../Materials/clipPlaneMaterialHelper.js";
import { BindFogParameters, BindLogDepth } from "../Materials/materialHelper.functions.js";
import { MeshParticleEmitter } from "./EmitterTypes/meshParticleEmitter.js";
/**
 * This represents a GPU particle system in Babylon
 * This is the fastest particle system in Babylon as it uses the GPU to update the individual particle data
 * @see https://www.babylonjs-playground.com/#PU4WYI#4
 */
export class GPUParticleSystem extends BaseParticleSystem {
    /**
     * Whether the particle buffer needs to store the initial emission direction.
     * True when particles are not billboarded (they orient by direction) or when
     * using stretched-local billboard mode (stretches along initial direction).
     * @internal
     */
    get _needsInitialDirection() {
        return !this._isBillboardBased || this.billboardMode === ParticleSystem.BILLBOARDMODE_STRETCHED_LOCAL;
    }
    /**
     * Gets a boolean indicating if the GPU particles can be rendered on current browser
     */
    static get IsSupported() {
        if (!EngineStore.LastCreatedEngine) {
            return false;
        }
        const caps = EngineStore.LastCreatedEngine.getCaps();
        return caps.supportTransformFeedbacks || caps.supportComputeShaders;
    }
    _createIndexBuffer() {
        this._linesIndexBufferUseInstancing = this._engine.createIndexBuffer(new Uint32Array([0, 1, 1, 3, 3, 2, 2, 0, 0, 3]), undefined, "GPUParticleSystemLinesIndexBuffer");
    }
    /**
     * Gets the maximum number of particles active at the same time.
     * @returns The max number of active particles.
     */
    getCapacity() {
        return this._capacity;
    }
    /**
     * Gets or set the number of active particles
     * The value cannot be greater than "capacity" (if it is, it will be limited to "capacity").
     */
    get maxActiveParticleCount() {
        return this._maxActiveParticleCount;
    }
    set maxActiveParticleCount(value) {
        this._maxActiveParticleCount = Math.min(value, this._capacity);
    }
    /**
     * Gets or set the number of active particles
     * @deprecated Please use maxActiveParticleCount instead.
     */
    get activeParticleCount() {
        return this.maxActiveParticleCount;
    }
    set activeParticleCount(value) {
        this.maxActiveParticleCount = value;
    }
    /**
     * Add an attractor to the particle system. Attractors are used to change the direction of the particles in the system.
     * @param attractor - The attractor to add to the particle system
     */
    addAttractor(attractor) {
        if (this._attractors.length >= this.maxAttractors) {
            Logger.Warn(`GPU particle system supports a maximum of ${this.maxAttractors} attractors. Ignoring additional attractor.`);
            return;
        }
        super.addAttractor(attractor);
    }
    /** Gets or sets the current flow map */
    get flowMap() {
        return this._flowMap;
    }
    set flowMap(value) {
        if (this._flowMap === value) {
            return;
        }
        this._flowMap = value;
    }
    /**
     * Is this system ready to be used/rendered
     * @returns true if the system is ready
     */
    isReady() {
        if (!this.emitter ||
            (this._imageProcessingConfiguration && !this._imageProcessingConfiguration.isReady()) ||
            (this._flowMap && !this._flowMap.isReady()) ||
            !this.particleTexture ||
            !this.particleTexture.isReady() ||
            this._rebuildingAfterContextLost) {
            return false;
        }
        if (this.blendMode !== ParticleSystem.BLENDMODE_MULTIPLYADD) {
            if (!this._getWrapper(this.blendMode).effect.isReady()) {
                return false;
            }
        }
        else {
            if (!this._getWrapper(ParticleSystem.BLENDMODE_MULTIPLY).effect.isReady()) {
                return false;
            }
            if (!this._getWrapper(ParticleSystem.BLENDMODE_ADD).effect.isReady()) {
                return false;
            }
        }
        if (!this._platform.isUpdateBufferCreated()) {
            this._recreateUpdateEffect();
            return false;
        }
        return this._platform.isUpdateBufferReady();
    }
    /**
     * Gets if the system has been started. (Note: this will still be true after stop is called)
     * @returns True if it has been started, otherwise false.
     */
    isStarted() {
        return this._started;
    }
    /**
     * Gets if the system has been stopped. (Note: rendering is still happening but the system is frozen)
     * @returns True if it has been stopped, otherwise false.
     */
    isStopped() {
        return this._stopped;
    }
    /**
     * Gets a boolean indicating that the system is stopping
     * @returns true if the system is currently stopping
     */
    isStopping() {
        return false; // Stop is immediate on GPU
    }
    /**
     * Gets the number of particles active at the same time.
     * @returns The number of active particles.
     */
    getActiveCount() {
        return this._currentActiveCount;
    }
    /**
     * Starts the particle system and begins to emit
     * @param delay defines the delay in milliseconds before starting the system (this.startDelay by default)
     */
    start(delay = this.startDelay) {
        if (!this.targetStopDuration && this._hasTargetStopDurationDependantGradient()) {
            // eslint-disable-next-line no-throw-literal
            throw "Particle system started with a targetStopDuration dependant gradient (eg. startSizeGradients) but no targetStopDuration set";
        }
        if (delay) {
            setTimeout(() => {
                this.start(0);
            }, delay);
            return;
        }
        this._started = true;
        this._stopped = false;
        this._actualFrame = 0;
        this._preWarmDone = false;
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
        // Animations
        if (this.beginAnimationOnStart && this.animations && this.animations.length > 0 && this._scene) {
            this._scene.beginAnimation(this, this.beginAnimationFrom, this.beginAnimationTo, this.beginAnimationLoop);
        }
    }
    /**
     * Stops the particle system.
     */
    stop() {
        if (this._stopped) {
            return;
        }
        this.onStoppedObservable.notifyObservers(this);
        this._stopped = true;
    }
    /**
     * Remove all active particles
     */
    reset() {
        this._releaseBuffers();
        this._platform.releaseVertexBuffers();
        this._currentActiveCount = 0;
        this._targetIndex = 0;
        this._writePointer = 0;
        this._emitIndex = 0;
        this._emitCount = 0;
        this._accumulatedCount = 0;
    }
    /**
     * Returns the string "GPUParticleSystem"
     * @returns a string containing the class name
     */
    getClassName() {
        return "GPUParticleSystem";
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
        return "gpuRenderParticles";
    }
    /**
     * Gets the vertex buffers used by the particle system
     * Should be called after render() has been called for the current frame so that the buffers returned are the ones that have been updated
     * in the current frame (there's a ping-pong between two sets of buffers - for a given frame, one set is used as the source and the other as the destination)
     */
    get vertexBuffers() {
        // We return the other buffers than those corresponding to this._targetIndex because it is assumed vertexBuffers will be called in the current frame
        // after render() has been called, meaning that the buffers have already been swapped and this._targetIndex points to the buffers that will be updated
        // in the next frame (and which are the sources in this frame) and (this._targetIndex ^ 1) points to the buffers that have been updated this frame
        // (and that will be the source buffers in the next frame)
        return this._renderVertexBuffers[this._targetIndex ^ 1];
    }
    /**
     * Gets the index buffer used by the particle system (null for GPU particle systems)
     */
    get indexBuffer() {
        return null;
    }
    _removeGradientAndTexture(gradient, gradients, texture) {
        super._removeGradientAndTexture(gradient, gradients, texture);
        this._releaseBuffers();
        return this;
    }
    /**
     * Adds a new color gradient
     * @param gradient defines the gradient to use (between 0 and 1)
     * @param color1 defines the color to affect to the specified gradient
     * @param color2 defines an optional second color to be used to produce a random color per particle at the gradient (lerped with color1 using a per-particle random value)
     * @returns the current particle system
     */
    addColorGradient(gradient, color1, color2) {
        if (!this._colorGradients) {
            this._colorGradients = [];
        }
        const colorGradient = new ColorGradient(gradient, color1, color2);
        this._colorGradients.push(colorGradient);
        if (!this._refreshColorGradient(true)) {
            this._releaseBuffers();
        }
        return this;
    }
    /**
     * Resyncs the color gradient state after a change.
     * @param reorder true to re-sort the gradient list by position
     * @returns true when the existing lookup texture was re-baked in place (value-only change — nothing to
     * release, the live particle pool survives), false when the change is structural (family emptied, color2 row
     * layout flipped, or no texture yet) and the caller must release the buffers; in that case the outdated
     * texture is disposed for lazy recreation.
     */
    _refreshColorGradient(reorder = false) {
        if (this._colorGradients) {
            if (reorder) {
                this._colorGradients.sort((a, b) => {
                    if (a.gradient < b.gradient) {
                        return -1;
                    }
                    else if (a.gradient > b.gradient) {
                        return 1;
                    }
                    return 0;
                });
            }
            // Recompute whether any stop uses a color2 range. Done here (not inside _createColorGradientTexture)
            // so the flag is available to both define generation (fillDefines) and render vertex buffer layout
            // (_createVertexBuffers), which can run before the texture is recreated.
            this._hasColorGradientColor2 = false;
            for (const g of this._colorGradients) {
                if (g.color2) {
                    this._hasColorGradientColor2 = true;
                    break;
                }
            }
            // When the texture layout is unchanged, re-bake the existing texture's pixels in place: identity is
            // preserved, so retained bindings (e.g. the WebGPU update compute shader's) stay valid and no buffer
            // release is needed.
            if (this._rebakeColorGradientTexture()) {
                return true;
            }
            if (this._colorGradientsTexture) {
                this._colorGradientsTexture.dispose();
                this._colorGradientsTexture = null;
            }
        }
        else {
            this._hasColorGradientColor2 = false;
        }
        return false;
    }
    /**
     * Force the system to rebuild all gradients that need to be resync.
     *
     * This is the live-edit entry point both Inspectors call from their gradient onChange handlers, so a
     * value-only edit must preserve the running simulation: every family whose lookup texture can be re-baked
     * in place is updated without touching the particle buffers. Only a STRUCTURAL change — a family that has
     * no texture to re-bake yet, one that was emptied, or a color2 row-layout flip — rebuilds the pool.
     *
     * An ABSENT family is not a structural change: it has nothing to resync, and counting it as one would
     * reset the pool on every call (the destruction this method exists to avoid). Absence has two spellings —
     * see _gradientFamilyNeedsResync.
     */
    forceRefreshGradients() {
        let structural = false;
        if (this._gradientFamilyNeedsResync(this._colorGradients, "_colorGradientsTexture") && !this._refreshColorGradient()) {
            structural = true;
        }
        if (this._gradientFamilyNeedsResync(this._sizeGradients, "_sizeGradientsTexture") && !this._refreshFactorGradient(this._sizeGradients, "_sizeGradientsTexture")) {
            structural = true;
        }
        if (this._gradientFamilyNeedsResync(this._angularSpeedGradients, "_angularSpeedGradientsTexture") &&
            !this._refreshFactorGradient(this._angularSpeedGradients, "_angularSpeedGradientsTexture")) {
            structural = true;
        }
        if (this._gradientFamilyNeedsResync(this._velocityGradients, "_velocityGradientsTexture") &&
            !this._refreshFactorGradient(this._velocityGradients, "_velocityGradientsTexture")) {
            structural = true;
        }
        if (this._gradientFamilyNeedsResync(this._limitVelocityGradients, "_limitVelocityGradientsTexture") &&
            !this._refreshFactorGradient(this._limitVelocityGradients, "_limitVelocityGradientsTexture")) {
            structural = true;
        }
        if (this._gradientFamilyNeedsResync(this._dragGradients, "_dragGradientsTexture") && !this._refreshFactorGradient(this._dragGradients, "_dragGradientsTexture")) {
            structural = true;
        }
        if (structural) {
            this.reset();
        }
    }
    /**
     * Whether a gradient family still has anything for a resync pass to do.
     *
     * Absence has TWO spellings: a family that was never initialized is `null`, but one that has been emptied
     * stays `[]`. Only the first is falsy, so a bare truthiness test reads an emptied family as unfinished
     * business on every later call — its refresh finds nothing to re-bake, reports "structural", and
     * forceRefreshGradients resets the live pool forever after, which is precisely the destruction it exists
     * to prevent.
     *
     * Entries always mean work (re-bake in place, or build when there is no texture yet). An EMPTY family is
     * work only while it still owns a texture: that is the just-emptied transition, whose stale texture must
     * be disposed. `[]` with no texture is settled absence — nothing left to resync.
     * @param gradients the gradient family to test, or null when it was never initialized
     * @param textureName the name of the lookup texture property backing that family
     * @returns true when the family still has work for a resync pass, false when its absence is settled
     */
    _gradientFamilyNeedsResync(gradients, textureName) {
        if (!gradients) {
            return false;
        }
        return gradients.length > 0 || !!this[textureName];
    }
    /**
     * Remove a specific color gradient
     * @param gradient defines the gradient to remove
     * @returns the current particle system
     */
    removeColorGradient(gradient) {
        super._removeGradientAndTexture(gradient, this._colorGradients, null);
        // The set of remaining gradients may no longer contain a color2; _refreshColorGradient recomputes the flag
        // and either re-bakes the texture in place (value-only change) or signals a structural change.
        if (!this._refreshColorGradient()) {
            this._releaseBuffers();
        }
        return this;
    }
    /**
     * Resets the draw wrappers cache
     */
    resetDrawCache() {
        for (const blendMode in this._drawWrappers) {
            const drawWrapper = this._drawWrappers[blendMode];
            drawWrapper.drawContext?.reset();
        }
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
        this._addFactorGradient(this._sizeGradients, gradient, factor, factor2);
        if (!this._refreshFactorGradient(this._sizeGradients, "_sizeGradientsTexture")) {
            this._releaseBuffers();
        }
        return this;
    }
    /**
     * Remove a specific size gradient
     * @param gradient defines the gradient to remove
     * @returns the current particle system
     */
    removeSizeGradient(gradient) {
        this._removeFactorGradient(this._sizeGradients, gradient);
        if (!this._refreshFactorGradient(this._sizeGradients, "_sizeGradientsTexture")) {
            this._releaseBuffers();
        }
        return this;
    }
    /**
     * Resyncs a factor gradient family's lookup texture after a change.
     * @param factorGradients defines the gradient family that changed
     * @param textureName defines the name of the property holding the family's lookup texture
     * @returns true when the existing texture was re-baked in place (value-only change — nothing to release, the
     * live particle pool survives), false when the caller must release the buffers (no texture to re-bake, or the
     * family was emptied); in that case the outdated texture is disposed for lazy recreation.
     */
    _refreshFactorGradient(factorGradients, textureName) {
        if (!factorGradients) {
            return false;
        }
        if (this._rebakeFactorGradientTexture(factorGradients, textureName)) {
            return true;
        }
        const that = this;
        if (that[textureName]) {
            that[textureName].dispose();
            that[textureName] = null;
        }
        return false;
    }
    /**
     * Adds a new angular speed gradient
     * @param gradient defines the gradient to use (between 0 and 1)
     * @param factor defines the angular speed to affect to the specified gradient
     * @param factor2 defines an additional factor used to define a range ([factor, factor2]) with main value to pick the final value from
     * @returns the current particle system
     */
    addAngularSpeedGradient(gradient, factor, factor2) {
        if (!this._angularSpeedGradients) {
            this._angularSpeedGradients = [];
        }
        this._addFactorGradient(this._angularSpeedGradients, gradient, factor, factor2);
        if (!this._refreshFactorGradient(this._angularSpeedGradients, "_angularSpeedGradientsTexture")) {
            this._releaseBuffers();
        }
        return this;
    }
    /**
     * Remove a specific angular speed gradient
     * @param gradient defines the gradient to remove
     * @returns the current particle system
     */
    removeAngularSpeedGradient(gradient) {
        this._removeFactorGradient(this._angularSpeedGradients, gradient);
        if (!this._refreshFactorGradient(this._angularSpeedGradients, "_angularSpeedGradientsTexture")) {
            this._releaseBuffers();
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
        this._addFactorGradient(this._velocityGradients, gradient, factor, factor2);
        if (!this._refreshFactorGradient(this._velocityGradients, "_velocityGradientsTexture")) {
            this._releaseBuffers();
        }
        return this;
    }
    /**
     * Remove a specific velocity gradient
     * @param gradient defines the gradient to remove
     * @returns the current particle system
     */
    removeVelocityGradient(gradient) {
        this._removeFactorGradient(this._velocityGradients, gradient);
        if (!this._refreshFactorGradient(this._velocityGradients, "_velocityGradientsTexture")) {
            this._releaseBuffers();
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
        this._addFactorGradient(this._limitVelocityGradients, gradient, factor, factor2);
        if (!this._refreshFactorGradient(this._limitVelocityGradients, "_limitVelocityGradientsTexture")) {
            this._releaseBuffers();
        }
        return this;
    }
    /**
     * Remove a specific limit velocity gradient
     * @param gradient defines the gradient to remove
     * @returns the current particle system
     */
    removeLimitVelocityGradient(gradient) {
        this._removeFactorGradient(this._limitVelocityGradients, gradient);
        if (!this._refreshFactorGradient(this._limitVelocityGradients, "_limitVelocityGradientsTexture")) {
            this._releaseBuffers();
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
        this._addFactorGradient(this._dragGradients, gradient, factor, factor2);
        if (!this._refreshFactorGradient(this._dragGradients, "_dragGradientsTexture")) {
            this._releaseBuffers();
        }
        return this;
    }
    /**
     * Remove a specific drag gradient
     * @param gradient defines the gradient to remove
     * @returns the current particle system
     */
    removeDragGradient(gradient) {
        this._removeFactorGradient(this._dragGradients, gradient);
        if (!this._refreshFactorGradient(this._dragGradients, "_dragGradientsTexture")) {
            this._releaseBuffers();
        }
        return this;
    }
    /**
     * Adds a new start size gradient (please note that this will only work if you set the targetStopDuration property)
     * @param gradient defines the gradient to use (between 0 and 1)
     * @param factor defines the start size factor to affect to the specified gradient
     * @param factor2 defines an additional factor used to define a range ([factor, factor2]) with main value to pick the final value from
     * @returns the current particle system
     */
    addStartSizeGradient(gradient, factor, factor2) {
        if (!this._startSizeGradients) {
            this._startSizeGradients = [];
        }
        const hadGradients = this._startSizeGradients.length > 0;
        this._addFactorGradient(this._startSizeGradients, gradient, factor, factor2);
        if (!hadGradients) {
            this._resetEffect();
        }
        return this;
    }
    /**
     * Remove a specific start size gradient
     * @param gradient defines the gradient to remove
     * @returns the current particle system
     */
    removeStartSizeGradient(gradient) {
        const hadGradients = this._startSizeGradients && this._startSizeGradients.length > 0;
        this._removeFactorGradient(this._startSizeGradients, gradient);
        if (hadGradients && (!this._startSizeGradients || this._startSizeGradients.length === 0)) {
            this._resetEffect();
        }
        return this;
    }
    /**
     * Not supported by GPUParticleSystem
     * @returns the current particle system
     */
    addColorRemapGradient() {
        // Do nothing as start size is not supported by GPUParticleSystem
        return this;
    }
    /**
     * Not supported by GPUParticleSystem
     * @returns the current particle system
     */
    removeColorRemapGradient() {
        // Do nothing as start size is not supported by GPUParticleSystem
        return this;
    }
    /**
     * Not supported by GPUParticleSystem
     * @returns the current particle system
     */
    addAlphaRemapGradient() {
        // Do nothing as start size is not supported by GPUParticleSystem
        return this;
    }
    /**
     * Not supported by GPUParticleSystem
     * @returns the current particle system
     */
    removeAlphaRemapGradient() {
        // Do nothing as start size is not supported by GPUParticleSystem
        return this;
    }
    /**
     * Not supported by GPUParticleSystem
     * @returns the current particle system
     */
    addRampGradient() {
        //Not supported by GPUParticleSystem
        return this;
    }
    /**
     * Not supported by GPUParticleSystem
     * @returns the current particle system
     */
    removeRampGradient() {
        //Not supported by GPUParticleSystem
        return this;
    }
    /**
     * Not supported by GPUParticleSystem
     * @returns the list of ramp gradients
     */
    getRampGradients() {
        return null;
    }
    /**
     * Not supported by GPUParticleSystem
     * Gets or sets a boolean indicating that ramp gradients must be used
     * @see https://doc.babylonjs.com/features/featuresDeepDive/particles/particle_system/particle_system_intro#ramp-gradients
     */
    get useRampGradients() {
        //Not supported by GPUParticleSystem
        return false;
    }
    set useRampGradients(value) {
        //Not supported by GPUParticleSystem
    }
    /**
     * Adds a new life time gradient (please note that this will only work if you set the targetStopDuration property)
     * @param gradient defines the gradient to use (between 0 and 1)
     * @param factor defines the life time factor to affect to the specified gradient
     * @param factor2 defines an additional factor used to define a range ([factor, factor2]) with main value to pick the final value from
     * @returns the current particle system
     */
    addLifeTimeGradient(gradient, factor, factor2) {
        if (!this._lifeTimeGradients) {
            this._lifeTimeGradients = [];
        }
        const hadGradients = this._lifeTimeGradients.length > 0;
        this._addFactorGradient(this._lifeTimeGradients, gradient, factor, factor2);
        if (!hadGradients) {
            this._resetEffect();
        }
        return this;
    }
    /**
     * Remove a specific life time gradient
     * @param gradient defines the gradient to remove
     * @returns the current particle system
     */
    removeLifeTimeGradient(gradient) {
        const hadGradients = this._lifeTimeGradients && this._lifeTimeGradients.length > 0;
        this._removeFactorGradient(this._lifeTimeGradients, gradient);
        if (hadGradients && (!this._lifeTimeGradients || this._lifeTimeGradients.length === 0)) {
            this._resetEffect();
        }
        return this;
    }
    /**
     * Instantiates a GPU particle system.
     * Particles are often small sprites used to simulate hard-to-reproduce phenomena like fire, smoke, water, or abstract visual effects like magic glitter and faery dust.
     * @param name The name of the particle system
     * @param options The options used to create the system
     * @param sceneOrEngine The scene the particle system belongs to or the engine to use if no scene
     * @param customEffect a custom effect used to change the way particles are rendered by default
     * @param isAnimationSheetEnabled Must be true if using a spritesheet to animate the particles texture
     */
    constructor(name, options, sceneOrEngine, customEffect = null, isAnimationSheetEnabled = false) {
        RegisterAnimatable();
        super(name);
        /**
         * The layer mask we are rendering the particles through.
         */
        this.layerMask = 0x0fffffff;
        this._accumulatedCount = 0;
        this._writePointer = 0;
        this._emitIndex = 0;
        this._emitCount = 0;
        this._renderVertexBuffers = [];
        this._targetIndex = 0;
        /** Set to true when any entry in `_colorGradients` has a `color2` (per-particle random color range). */
        this._hasColorGradientColor2 = false;
        this._currentRenderId = -1;
        this._currentRenderingCameraUniqueId = -1;
        this._started = false;
        this._stopped = false;
        this._timeDelta = 0;
        /** Indicates that the update of particles is done in the animate function (and not in render). Default: false */
        this.updateInAnimate = false;
        this._actualFrame = 0;
        this._renderShadersLoaded = false;
        this._rawTextureWidth = 256;
        this._rebuildingAfterContextLost = false;
        // Emit rate gradient caching (mirrors ThinParticleSystem)
        this._currentEmitRateGradient = null;
        this._currentEmitRate1 = 0;
        this._currentEmitRate2 = 0;
        // Start size gradient caching (mirrors ThinParticleSystem)
        this._currentStartSizeGradient = null;
        this._currentStartSize1 = 0;
        this._currentStartSize2 = 0;
        this._startSizeGradientFactor = 1.0;
        // Life time gradient factor range for per-particle randomization in shader
        this._lifeTimeGradientMin = 1.0;
        this._lifeTimeGradientMax = 1.0;
        /**
         * Specifies if the particle system should be serialized
         */
        this.doNotSerialize = false;
        /**
         * An event triggered when the system is disposed.
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
        /**
         * Gets or sets whether emit rate control is enabled.
         * When true, the GPU particle system limits the number of active particles
         * to approximately emitRate * maxLifeTime (matching CPU particle behavior)
         * and uses a circular buffer to recycle particle slots.
         * When false (default), all dead particles are recycled immediately,
         * which is the legacy GPU particle behavior.
         * Changing the value takes effect on the next frame (the update and render effects are rebuilt
         * automatically when their shader defines change; buffer allocation does not depend on it).
         */
        this.emitRateControl = false;
        /**
         * Forces the particle to write their depth information to the depth buffer. This can help preventing other draw calls
         * to override the particles.
         */
        this.forceDepthWrite = false;
        this._preWarmDone = false;
        /**
         * Specifies if the particles are updated in emitter local space or world space.
         */
        this.isLocal = false;
        /** Indicates that the particle system is GPU based */
        this.isGPU = true;
        /**
         * Gets or sets an object used to store user defined information for the particle system
         */
        this.metadata = null;
        /** Flow map */
        /** @internal */
        this._flowMap = null;
        /**
         * The strength of the flow map
         */
        this.flowMapStrength = 1.0;
        /** Mesh emitter textures */
        /** @internal */
        this._meshPositionTexture = null;
        /** @internal */
        this._meshNormalTexture = null;
        /** @internal */
        this._meshTriangleCount = 0;
        /** @internal */
        this._meshTextureWidth = 0;
        // Track mesh emitter inputs for invalidation
        this._meshEmitterMeshId = -1;
        this._meshEmitterUsedNormals = false;
        /** @internal */
        this._onBeforeDrawParticlesObservable = null;
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
        if (this._engine.getCaps().supportComputeShaders) {
            if (!GetClass("BABYLON.ComputeShaderParticleSystem")) {
                throw new Error("The ComputeShaderParticleSystem class is not available! Make sure you have imported it.");
            }
            this._platform = new (GetClass("BABYLON.ComputeShaderParticleSystem"))(this, this._engine);
        }
        else {
            if (!GetClass("BABYLON.WebGL2ParticleSystem")) {
                throw new Error("The WebGL2ParticleSystem class is not available! Make sure you have imported it.");
            }
            this._platform = new (GetClass("BABYLON.WebGL2ParticleSystem"))(this, this._engine);
        }
        this._customWrappers = { 0: new DrawWrapper(this._engine) };
        this._customWrappers[0].effect = customEffect;
        this._drawWrappers = { 0: new DrawWrapper(this._engine) };
        if (this._drawWrappers[0].drawContext) {
            this._drawWrappers[0].drawContext.useInstancing = true;
        }
        this._createIndexBuffer();
        // Setup the default processing configuration to the scene.
        this._attachImageProcessingConfiguration(null);
        options = options ?? {};
        if (!options.randomTextureSize) {
            delete options.randomTextureSize;
        }
        const fullOptions = {
            capacity: 50000,
            randomTextureSize: this._engine.getCaps().maxTextureSize,
            ...options,
        };
        const optionsAsNumber = options;
        if (isFinite(optionsAsNumber)) {
            fullOptions.capacity = optionsAsNumber;
        }
        this._capacity = fullOptions.capacity;
        this._maxActiveParticleCount = fullOptions.capacity;
        this._currentActiveCount = 0;
        this._isAnimationSheetEnabled = isAnimationSheetEnabled;
        this.emitRateControl = !!options.emitRateControl;
        this.maxAttractors = options.maxAttractors ?? 8;
        this.particleEmitterType = new BoxParticleEmitter();
        // Random data
        const maxTextureSize = Math.min(this._engine.getCaps().maxTextureSize, fullOptions.randomTextureSize);
        let d = [];
        for (let i = 0; i < maxTextureSize; ++i) {
            d.push(Math.random());
            d.push(Math.random());
            d.push(Math.random());
            d.push(Math.random());
        }
        this._randomTexture = new RawTexture(new Float32Array(d), maxTextureSize, 1, 5, sceneOrEngine, false, false, 1, 1);
        this._randomTexture.name = "GPUParticleSystem_random1";
        this._randomTexture.wrapU = 1;
        this._randomTexture.wrapV = 1;
        d = [];
        for (let i = 0; i < maxTextureSize; ++i) {
            d.push(Math.random());
            d.push(Math.random());
            d.push(Math.random());
            d.push(Math.random());
        }
        this._randomTexture2 = new RawTexture(new Float32Array(d), maxTextureSize, 1, 5, sceneOrEngine, false, false, 1, 1);
        this._randomTexture2.name = "GPUParticleSystem_random2";
        this._randomTexture2.wrapU = 1;
        this._randomTexture2.wrapV = 1;
        this._randomTextureSize = maxTextureSize;
    }
    _reset() {
        this._releaseBuffers();
    }
    _createVertexBuffers(updateBuffer, renderBuffer, spriteSource) {
        const renderVertexBuffers = {};
        renderVertexBuffers["position"] = renderBuffer.createVertexBuffer("position", 0, 3, this._attributesStrideSize, true);
        let offset = 3;
        renderVertexBuffers["age"] = renderBuffer.createVertexBuffer("age", offset, 1, this._attributesStrideSize, true);
        offset += 1;
        renderVertexBuffers["size"] = renderBuffer.createVertexBuffer("size", offset, 3, this._attributesStrideSize, true);
        offset += 3;
        renderVertexBuffers["life"] = renderBuffer.createVertexBuffer("life", offset, 1, this._attributesStrideSize, true);
        offset += 1;
        if (this._hasColorGradientColor2) {
            // Expose `seed` to the render shader so it can pick a stable per-particle mix factor between
            // the color1 and color2 rows of the color gradient texture.
            renderVertexBuffers["seed"] = renderBuffer.createVertexBuffer("seed", offset, 4, this._attributesStrideSize, true);
        }
        offset += 4; // seed
        if (this.billboardMode === ParticleSystem.BILLBOARDMODE_STRETCHED || this.billboardMode === ParticleSystem.BILLBOARDMODE_STRETCHED_LOCAL) {
            renderVertexBuffers["direction"] = renderBuffer.createVertexBuffer("direction", offset, 3, this._attributesStrideSize, true);
        }
        offset += 3; // direction
        if (this._platform.alignDataInBuffer) {
            offset += 1;
        }
        if (this.particleEmitterType instanceof CustomParticleEmitter) {
            offset += 3;
            if (this._platform.alignDataInBuffer) {
                offset += 1;
            }
        }
        if (!this._colorGradientsTexture) {
            renderVertexBuffers["color"] = renderBuffer.createVertexBuffer("color", offset, 4, this._attributesStrideSize, true);
            offset += 4;
        }
        if (this._needsInitialDirection) {
            renderVertexBuffers["initialDirection"] = renderBuffer.createVertexBuffer("initialDirection", offset, 3, this._attributesStrideSize, true);
            offset += 3;
            if (this._platform.alignDataInBuffer) {
                offset += 1;
            }
        }
        if (this.noiseTexture) {
            renderVertexBuffers["noiseCoordinates1"] = renderBuffer.createVertexBuffer("noiseCoordinates1", offset, 3, this._attributesStrideSize, true);
            offset += 3;
            if (this._platform.alignDataInBuffer) {
                offset += 1;
            }
            renderVertexBuffers["noiseCoordinates2"] = renderBuffer.createVertexBuffer("noiseCoordinates2", offset, 3, this._attributesStrideSize, true);
            offset += 3;
            if (this._platform.alignDataInBuffer) {
                offset += 1;
            }
        }
        renderVertexBuffers["angle"] = renderBuffer.createVertexBuffer("angle", offset, 1, this._attributesStrideSize, true);
        if (this._angularSpeedGradientsTexture) {
            offset++;
        }
        else {
            offset += 2;
        }
        if (this._isAnimationSheetEnabled) {
            renderVertexBuffers["cellIndex"] = renderBuffer.createVertexBuffer("cellIndex", offset, 1, this._attributesStrideSize, true);
            offset += 1;
            if (this.spriteRandomStartCell) {
                renderVertexBuffers["cellStartOffset"] = renderBuffer.createVertexBuffer("cellStartOffset", offset, 1, this._attributesStrideSize, true);
            }
        }
        renderVertexBuffers["offset"] = spriteSource.createVertexBuffer("offset", 0, 2);
        renderVertexBuffers["uv"] = spriteSource.createVertexBuffer("uv", 2, 2);
        this._renderVertexBuffers.push(renderVertexBuffers);
        this._platform.createVertexBuffers(updateBuffer, renderVertexBuffers);
        this.resetDrawCache();
    }
    _initialize(force = false) {
        if (this._buffer0 && !force) {
            return;
        }
        const engine = this._engine;
        const data = [];
        this._attributesStrideSize = 21;
        this._targetIndex = 0;
        if (this._platform.alignDataInBuffer) {
            this._attributesStrideSize += 1;
        }
        if (this.particleEmitterType instanceof CustomParticleEmitter) {
            this._attributesStrideSize += 3;
            if (this._platform.alignDataInBuffer) {
                this._attributesStrideSize += 1;
            }
        }
        if (this._needsInitialDirection) {
            this._attributesStrideSize += 3;
            if (this._platform.alignDataInBuffer) {
                this._attributesStrideSize += 1;
            }
        }
        if (this._colorGradientsTexture) {
            this._attributesStrideSize -= 4;
        }
        if (this._angularSpeedGradientsTexture) {
            this._attributesStrideSize -= 1;
        }
        if (this._isAnimationSheetEnabled) {
            this._attributesStrideSize += 1;
            if (this.spriteRandomStartCell) {
                this._attributesStrideSize += 1;
            }
        }
        if (this.noiseTexture) {
            this._attributesStrideSize += 6;
            if (this._platform.alignDataInBuffer) {
                this._attributesStrideSize += 2;
            }
        }
        if (this._platform.alignDataInBuffer) {
            this._attributesStrideSize += 3 - ((this._attributesStrideSize + 3) & 3); // round to multiple of 4
        }
        const usingCustomEmitter = this.particleEmitterType instanceof CustomParticleEmitter;
        const tmpVector = TmpVectors.Vector3[0];
        let offset = 0;
        for (let particleIndex = 0; particleIndex < this._capacity; particleIndex++) {
            // position
            data.push(0.0);
            data.push(0.0);
            data.push(0.0);
            // Age
            data.push(0.0); // create the particle as a dead one to create a new one at start
            // Size
            data.push(0.0);
            data.push(0.0);
            data.push(0.0);
            // life
            data.push(0.0);
            // Seed
            data.push(Math.random());
            data.push(Math.random());
            data.push(Math.random());
            data.push(Math.random());
            // direction
            if (usingCustomEmitter) {
                this.particleEmitterType.particleDestinationGenerator(particleIndex, null, tmpVector);
                data.push(tmpVector.x);
                data.push(tmpVector.y);
                data.push(tmpVector.z);
            }
            else {
                data.push(0.0);
                data.push(0.0);
                data.push(0.0);
            }
            if (this._platform.alignDataInBuffer) {
                data.push(0.0); // dummy0
            }
            offset += 16; // position, age, size, life, seed, direction, dummy0
            if (usingCustomEmitter) {
                this.particleEmitterType.particlePositionGenerator(particleIndex, null, tmpVector);
                data.push(tmpVector.x);
                data.push(tmpVector.y);
                data.push(tmpVector.z);
                if (this._platform.alignDataInBuffer) {
                    data.push(0.0); // dummy1
                }
                offset += 4;
            }
            if (!this._colorGradientsTexture) {
                // color
                data.push(0.0);
                data.push(0.0);
                data.push(0.0);
                data.push(0.0);
                offset += 4;
            }
            if (this._needsInitialDirection) {
                // initialDirection
                data.push(0.0);
                data.push(0.0);
                data.push(0.0);
                if (this._platform.alignDataInBuffer) {
                    data.push(0.0); // dummy2
                }
                offset += 4;
            }
            if (this.noiseTexture) {
                // Random coordinates for reading into noise texture
                data.push(Math.random());
                data.push(Math.random());
                data.push(Math.random());
                if (this._platform.alignDataInBuffer) {
                    data.push(0.0); // dummy3
                }
                data.push(Math.random());
                data.push(Math.random());
                data.push(Math.random());
                if (this._platform.alignDataInBuffer) {
                    data.push(0.0); // dummy4
                }
                offset += 8;
            }
            // angle
            data.push(0.0);
            offset += 1;
            if (!this._angularSpeedGradientsTexture) {
                data.push(0.0);
                offset += 1;
            }
            if (this._isAnimationSheetEnabled) {
                data.push(0.0);
                offset += 1;
                if (this.spriteRandomStartCell) {
                    data.push(0.0);
                    offset += 1;
                }
            }
            if (this._platform.alignDataInBuffer) {
                let numDummies = 3 - ((offset + 3) & 3);
                offset += numDummies;
                while (numDummies-- > 0) {
                    data.push(0.0);
                }
            }
        }
        // Sprite data
        const spriteData = new Float32Array([0.5, 0.5, 1, 1, -0.5, 0.5, 0, 1, 0.5, -0.5, 1, 0, -0.5, -0.5, 0, 0]);
        const bufferData1 = this._platform.createParticleBuffer(data);
        const bufferData2 = this._platform.createParticleBuffer(data);
        // Buffers
        this._buffer0 = new Buffer(engine, bufferData1, false, this._attributesStrideSize);
        this._buffer1 = new Buffer(engine, bufferData2, false, this._attributesStrideSize);
        this._spriteBuffer = new Buffer(engine, spriteData, false, 4);
        // Update & Render vertex buffers
        this._renderVertexBuffers = [];
        this._createVertexBuffers(this._buffer0, this._buffer1, this._spriteBuffer);
        this._createVertexBuffers(this._buffer1, this._buffer0, this._spriteBuffer);
        // Links
        this._sourceBuffer = this._buffer0;
        this._targetBuffer = this._buffer1;
    }
    /**
     * Forces the update effect to be recreated on the next render.
     */
    _resetEffect() {
        this._cachedUpdateDefines = "";
    }
    /** @internal */
    _recreateUpdateEffect() {
        this._createColorGradientTexture();
        this._createSizeGradientTexture();
        this._createAngularSpeedGradientTexture();
        this._createVelocityGradientTexture();
        this._createLimitVelocityGradientTexture();
        this._createDragGradientTexture();
        this._createMeshEmitterTextures();
        let defines = this.particleEmitterType ? this.particleEmitterType.getEffectDefines() : "";
        if (this._isBillboardBased) {
            // Stretched local needs initialDirection in the buffer, which requires !BILLBOARD in the update shader.
            // The render shader still uses BILLBOARD — that's handled separately in fillDefines().
            if (this.billboardMode !== ParticleSystem.BILLBOARDMODE_STRETCHED_LOCAL) {
                defines += "\n#define BILLBOARD";
            }
        }
        if (this._colorGradientsTexture) {
            defines += "\n#define COLORGRADIENTS";
        }
        if (this._sizeGradientsTexture) {
            defines += "\n#define SIZEGRADIENTS";
        }
        if (this._angularSpeedGradientsTexture) {
            defines += "\n#define ANGULARSPEEDGRADIENTS";
        }
        if (this._velocityGradientsTexture) {
            defines += "\n#define VELOCITYGRADIENTS";
        }
        if (this._limitVelocityGradientsTexture) {
            defines += "\n#define LIMITVELOCITYGRADIENTS";
        }
        if (this._dragGradientsTexture) {
            defines += "\n#define DRAGGRADIENTS";
        }
        if (this._flowMap) {
            defines += "\n#define FLOWMAP";
        }
        if (this.isAnimationSheetEnabled) {
            defines += "\n#define ANIMATESHEET";
            if (this.spriteRandomStartCell) {
                defines += "\n#define ANIMATESHEETRANDOMSTART";
            }
        }
        if (this.noiseTexture) {
            defines += "\n#define NOISE";
        }
        if (this.isLocal) {
            defines += "\n#define LOCAL";
        }
        if (this._attractors.length > 0) {
            defines += "\n#define ATTRACTORS";
            defines += "\n#define MAX_ATTRACTORS " + this.maxAttractors;
        }
        if (this.emitRateControl) {
            defines += "\n#define EMITRATECTRL";
        }
        if (this._startSizeGradients && this._startSizeGradients.length > 0) {
            defines += "\n#define STARTSIZEGRADIENTS";
        }
        if (this._lifeTimeGradients && this._lifeTimeGradients.length > 0) {
            defines += "\n#define LIFETIMEGRADIENTS";
        }
        if (this.particleEmitterType instanceof MeshParticleEmitter && this._meshPositionTexture) {
            defines += "\n#define MESHEMITTER";
            if (this._meshNormalTexture) {
                defines += "\n#define MESHNORMALS";
            }
        }
        if (this._platform.isUpdateBufferCreated() && this._cachedUpdateDefines === defines) {
            return this._platform.isUpdateBufferReady();
        }
        this._cachedUpdateDefines = defines;
        this._updateBuffer = this._platform.createUpdateBuffer(defines);
        return this._platform.isUpdateBufferReady();
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
        let drawWrapper = this._drawWrappers[blendMode];
        if (!drawWrapper) {
            drawWrapper = new DrawWrapper(this._engine);
            if (drawWrapper.drawContext) {
                drawWrapper.drawContext.useInstancing = true;
            }
            this._drawWrappers[blendMode] = drawWrapper;
        }
        const join = defines.join("\n");
        if (drawWrapper.defines !== join) {
            const attributes = [];
            const uniforms = [];
            const samplers = [];
            this.fillUniformsAttributesAndSamplerNames(uniforms, attributes, samplers);
            const shaderLanguage = this._engine.isWebGPU ? 1 /* ShaderLanguage.WGSL */ : 0 /* ShaderLanguage.GLSL */;
            drawWrapper.setEffect(this._engine.createEffect("gpuRenderParticles", {
                attributes,
                uniformsNames: uniforms,
                samplers,
                defines: join,
                shaderLanguage,
                extraInitializationsAsync: this._renderShadersLoaded
                    ? undefined
                    : async () => {
                        if (shaderLanguage === 1 /* ShaderLanguage.WGSL */) {
                            await Promise.all([import("../ShadersWGSL/gpuRenderParticles.vertex.js"), import("../ShadersWGSL/gpuRenderParticles.fragment.js")]);
                        }
                        this._renderShadersLoaded = true;
                    },
            }, this._engine), join);
        }
        return drawWrapper;
    }
    /**
     * @internal
     */
    static _GetAttributeNamesOrOptions(hasColorGradients = false, isAnimationSheetEnabled = false, isBillboardBased = false, isBillboardStretched = false, isBillboardStretchedLocal = false, hasColorGradientColor2 = false) {
        const attributeNamesOrOptions = [VertexBuffer.PositionKind, "age", "life", "size", "angle"];
        if (!hasColorGradients) {
            attributeNamesOrOptions.push(VertexBuffer.ColorKind);
        }
        else if (hasColorGradientColor2) {
            // When packing a color1/color2 range into the gradient texture, the render shader needs the
            // particle's persistent random seed to pick a stable per-particle mix factor.
            attributeNamesOrOptions.push("seed");
        }
        if (isAnimationSheetEnabled) {
            attributeNamesOrOptions.push("cellIndex");
        }
        if (!isBillboardBased || isBillboardStretchedLocal) {
            attributeNamesOrOptions.push("initialDirection");
        }
        if (isBillboardStretched) {
            attributeNamesOrOptions.push("direction");
        }
        attributeNamesOrOptions.push("offset", VertexBuffer.UVKind);
        return attributeNamesOrOptions;
    }
    /**
     * @internal
     */
    static _GetEffectCreationOptions(isAnimationSheetEnabled = false, useLogarithmicDepth = false, applyFog = false) {
        const effectCreationOption = ["emitterWM", "worldOffset", "view", "projection", "colorDead", "invView", "translationPivot", "eyePosition"];
        AddClipPlaneUniforms(effectCreationOption);
        if (isAnimationSheetEnabled) {
            effectCreationOption.push("sheetInfos");
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
    fillDefines(defines, blendMode = 0, fillImageProcessing = true) {
        if (this._scene) {
            PrepareStringDefinesForClipPlanes(this, this._scene, defines);
            if (this.applyFog && this._scene.fogEnabled && this._scene.fogMode !== Scene.FOGMODE_NONE) {
                defines.push("#define FOG");
            }
        }
        if (blendMode === ParticleSystem.BLENDMODE_MULTIPLY) {
            defines.push("#define BLENDMULTIPLYMODE");
        }
        if (this.isLocal) {
            defines.push("#define LOCAL");
        }
        if (this.useLogarithmicDepth) {
            defines.push("#define LOGARITHMICDEPTH");
        }
        if (this._isBillboardBased) {
            defines.push("#define BILLBOARD");
            switch (this.billboardMode) {
                case ParticleSystem.BILLBOARDMODE_Y:
                    defines.push("#define BILLBOARDY");
                    break;
                case ParticleSystem.BILLBOARDMODE_STRETCHED:
                    defines.push("#define BILLBOARDSTRETCHED");
                    break;
                case ParticleSystem.BILLBOARDMODE_STRETCHED_LOCAL:
                    defines.push("#define BILLBOARDSTRETCHED");
                    defines.push("#define BILLBOARDSTRETCHED_LOCAL");
                    break;
                case ParticleSystem.BILLBOARDMODE_ALL:
                    defines.push("#define BILLBOARDMODE_ALL");
                    break;
                default:
                    break;
            }
        }
        if (this._colorGradientsTexture) {
            defines.push("#define COLORGRADIENTS");
            if (this._hasColorGradientColor2) {
                defines.push("#define COLORGRADIENTS_COLOR2");
            }
        }
        if (this.isAnimationSheetEnabled) {
            defines.push("#define ANIMATESHEET");
        }
        if (this.emitRateControl) {
            defines.push("#define EMITRATECTRL");
        }
        if (fillImageProcessing && this._imageProcessingConfiguration) {
            this._imageProcessingConfiguration.prepareDefines(this._imageProcessingConfigurationDefines);
            defines.push("" + this._imageProcessingConfigurationDefines.toString());
        }
    }
    /**
     * Fill the uniforms, attributes and samplers arrays according to the current settings of the particle system
     * @param uniforms Uniforms array to fill
     * @param attributes Attributes array to fill
     * @param samplers Samplers array to fill
     */
    fillUniformsAttributesAndSamplerNames(uniforms, attributes, samplers) {
        attributes.push(...GPUParticleSystem._GetAttributeNamesOrOptions(!!this._colorGradientsTexture, this._isAnimationSheetEnabled, this._isBillboardBased, this._isBillboardBased && (this.billboardMode === ParticleSystem.BILLBOARDMODE_STRETCHED || this.billboardMode === ParticleSystem.BILLBOARDMODE_STRETCHED_LOCAL), this.billboardMode === ParticleSystem.BILLBOARDMODE_STRETCHED_LOCAL, this._hasColorGradientColor2));
        uniforms.push(...GPUParticleSystem._GetEffectCreationOptions(this._isAnimationSheetEnabled, this.useLogarithmicDepth, this.applyFog));
        samplers.push("diffuseSampler", "colorGradientSampler");
        if (this._imageProcessingConfiguration) {
            ImageProcessingConfiguration.PrepareUniforms(uniforms, this._imageProcessingConfigurationDefines);
            ImageProcessingConfiguration.PrepareSamplers(samplers, this._imageProcessingConfigurationDefines);
        }
    }
    /**
     * Animates the particle system for the current frame by emitting new particles and or animating the living ones.
     * @param preWarm defines if we are in the pre-warmimg phase
     */
    animate(preWarm = false) {
        this._timeDelta = this.updateSpeed * (preWarm ? this.preWarmStepOffset : this._scene?.getAnimationRatio() || 1);
        this._actualFrame += this._timeDelta;
        if (!this._stopped) {
            if (this.targetStopDuration && this._actualFrame >= this.targetStopDuration) {
                this.stop();
            }
        }
        if (this.updateInAnimate) {
            this._update();
        }
    }
    _bakeFactorGradientData(factorGradients) {
        const data = new Float32Array(this._rawTextureWidth * 2);
        for (let x = 0; x < this._rawTextureWidth; x++) {
            const ratio = x / this._rawTextureWidth;
            GradientHelper.GetCurrentGradient(ratio, factorGradients, (currentGradient, nextGradient, scale) => {
                const cg = currentGradient;
                const ng = nextGradient;
                data[x * 2] = Lerp(cg.factor1, ng.factor1, scale);
                data[x * 2 + 1] = Lerp(cg.factor2 ?? cg.factor1, ng.factor2 ?? ng.factor1, scale);
            });
        }
        return data;
    }
    /**
     * Re-bakes an active factor gradient family's lookup texture pixels in place. The texture identity is
     * preserved, so retained bindings (e.g. the WebGPU update compute shader's) stay valid and no buffer
     * release is needed — the live particle pool survives the edit. The texture layout is independent of the
     * number of stops (fixed _rawTextureWidth x 1), so any change within an active family can be re-baked.
     * @param factorGradients defines the gradient family to bake
     * @param textureName defines the name of the property holding the family's lookup texture
     * @returns false when there is nothing to re-bake (no texture yet, or the family was emptied) — callers
     * fall back to the dispose + release path.
     */
    _rebakeFactorGradientTexture(factorGradients, textureName) {
        const texture = this[textureName];
        if (!texture || !factorGradients || !factorGradients.length) {
            return false;
        }
        texture.update(this._bakeFactorGradientData(factorGradients));
        return true;
    }
    _createFactorGradientTexture(factorGradients, textureName) {
        const texture = this[textureName];
        if (!factorGradients || !factorGradients.length || texture) {
            return;
        }
        const data = this._bakeFactorGradientData(factorGradients);
        this[textureName] = new RawTexture(data, this._rawTextureWidth, 1, 7, this._scene || this._engine, false, false, 1, 1);
        this[textureName].name = textureName.substring(1);
    }
    _createSizeGradientTexture() {
        this._createFactorGradientTexture(this._sizeGradients, "_sizeGradientsTexture");
    }
    _createAngularSpeedGradientTexture() {
        this._createFactorGradientTexture(this._angularSpeedGradients, "_angularSpeedGradientsTexture");
    }
    _createVelocityGradientTexture() {
        this._createFactorGradientTexture(this._velocityGradients, "_velocityGradientsTexture");
    }
    _createLimitVelocityGradientTexture() {
        this._createFactorGradientTexture(this._limitVelocityGradients, "_limitVelocityGradientsTexture");
    }
    _createDragGradientTexture() {
        this._createFactorGradientTexture(this._dragGradients, "_dragGradientsTexture");
    }
    _disposeMeshEmitterTextures() {
        if (this._meshPositionTexture) {
            this._meshPositionTexture.dispose();
            this._meshPositionTexture = null;
        }
        if (this._meshNormalTexture) {
            this._meshNormalTexture.dispose();
            this._meshNormalTexture = null;
        }
        this._meshTriangleCount = 0;
        this._meshTextureWidth = 0;
        this._meshEmitterMeshId = -1;
        this._meshEmitterUsedNormals = false;
    }
    _createMeshEmitterTextures() {
        if (!(this.particleEmitterType instanceof MeshParticleEmitter)) {
            // Emitter type changed away from mesh — dispose stale textures
            if (this._meshPositionTexture) {
                this._disposeMeshEmitterTextures();
            }
            return;
        }
        const meshEmitter = this.particleEmitterType;
        const mesh = meshEmitter.mesh;
        if (!mesh) {
            // Mesh removed — dispose stale textures
            if (this._meshPositionTexture) {
                this._disposeMeshEmitterTextures();
            }
            return;
        }
        const useNormals = meshEmitter.useMeshNormalsForDirection;
        // Invalidate if the source mesh or normals usage changed
        if (this._meshPositionTexture && (mesh.uniqueId !== this._meshEmitterMeshId || useNormals !== this._meshEmitterUsedNormals)) {
            this._disposeMeshEmitterTextures();
        }
        // Already created and still valid
        if (this._meshPositionTexture) {
            return;
        }
        const positions = mesh.getVerticesData(VertexBuffer.PositionKind);
        const normals = mesh.getVerticesData(VertexBuffer.NormalKind);
        const indices = mesh.getIndices();
        if (!positions || !indices) {
            return;
        }
        const triangleCount = indices.length / 3;
        this._meshTriangleCount = triangleCount;
        // Use a 2D texture layout so large meshes don't exceed maxTextureSize
        const totalTexels = triangleCount * 3;
        const maxTexSize = this._engine.getCaps().maxTextureSize;
        const texWidth = Math.min(totalTexels, maxTexSize);
        const texHeight = Math.ceil(totalTexels / texWidth);
        this._meshTextureWidth = texWidth;
        // Pack vertex positions: one texel per vertex, 3 vertices per triangle, RGBA float (xyz + padding)
        const posData = new Float32Array(texWidth * texHeight * 4);
        for (let t = 0; t < triangleCount; t++) {
            const i0 = indices[t * 3];
            const i1 = indices[t * 3 + 1];
            const i2 = indices[t * 3 + 2];
            const baseOffset = t * 3 * 4;
            posData[baseOffset] = positions[i0 * 3];
            posData[baseOffset + 1] = positions[i0 * 3 + 1];
            posData[baseOffset + 2] = positions[i0 * 3 + 2];
            posData[baseOffset + 3] = 0;
            posData[baseOffset + 4] = positions[i1 * 3];
            posData[baseOffset + 5] = positions[i1 * 3 + 1];
            posData[baseOffset + 6] = positions[i1 * 3 + 2];
            posData[baseOffset + 7] = 0;
            posData[baseOffset + 8] = positions[i2 * 3];
            posData[baseOffset + 9] = positions[i2 * 3 + 1];
            posData[baseOffset + 10] = positions[i2 * 3 + 2];
            posData[baseOffset + 11] = 0;
        }
        this._meshPositionTexture = new RawTexture(posData, texWidth, texHeight, 5, this._scene || this._engine, false, false, 1, 1);
        this._meshPositionTexture.name = "meshPositionTexture";
        // Pack normals the same way if available
        if (normals && useNormals) {
            const normData = new Float32Array(texWidth * texHeight * 4);
            for (let t = 0; t < triangleCount; t++) {
                const i0 = indices[t * 3];
                const i1 = indices[t * 3 + 1];
                const i2 = indices[t * 3 + 2];
                const baseOffset = t * 3 * 4;
                normData[baseOffset] = normals[i0 * 3];
                normData[baseOffset + 1] = normals[i0 * 3 + 1];
                normData[baseOffset + 2] = normals[i0 * 3 + 2];
                normData[baseOffset + 3] = 0;
                normData[baseOffset + 4] = normals[i1 * 3];
                normData[baseOffset + 5] = normals[i1 * 3 + 1];
                normData[baseOffset + 6] = normals[i1 * 3 + 2];
                normData[baseOffset + 7] = 0;
                normData[baseOffset + 8] = normals[i2 * 3];
                normData[baseOffset + 9] = normals[i2 * 3 + 1];
                normData[baseOffset + 10] = normals[i2 * 3 + 2];
                normData[baseOffset + 11] = 0;
            }
            this._meshNormalTexture = new RawTexture(normData, texWidth, texHeight, 5, this._scene || this._engine, false, false, 1, 1);
            this._meshNormalTexture.name = "meshNormalTexture";
        }
        this._meshEmitterMeshId = mesh.uniqueId;
        this._meshEmitterUsedNormals = useNormals;
    }
    _bakeColorGradientData(height) {
        const data = new Uint8Array(this._rawTextureWidth * 4 * height);
        const tmpColor = TmpColors.Color4[0];
        for (let x = 0; x < this._rawTextureWidth; x++) {
            const ratio = x / this._rawTextureWidth;
            GradientHelper.GetCurrentGradient(ratio, this._colorGradients, (currentGradient, nextGradient, scale) => {
                Color4.LerpToRef(currentGradient.color1, nextGradient.color1, scale, tmpColor);
                data[x * 4] = tmpColor.r * 255;
                data[x * 4 + 1] = tmpColor.g * 255;
                data[x * 4 + 2] = tmpColor.b * 255;
                data[x * 4 + 3] = tmpColor.a * 255;
            });
        }
        if (height === 2) {
            const rowOffset = this._rawTextureWidth * 4;
            for (let x = 0; x < this._rawTextureWidth; x++) {
                const ratio = x / this._rawTextureWidth;
                GradientHelper.GetCurrentGradient(ratio, this._colorGradients, (currentGradient, nextGradient, scale) => {
                    const cg = currentGradient;
                    const ng = nextGradient;
                    // Fall back to color1 for stops without a color2 so the row stays continuous.
                    Color4.LerpToRef(cg.color2 ?? cg.color1, ng.color2 ?? ng.color1, scale, tmpColor);
                    data[rowOffset + x * 4] = tmpColor.r * 255;
                    data[rowOffset + x * 4 + 1] = tmpColor.g * 255;
                    data[rowOffset + x * 4 + 2] = tmpColor.b * 255;
                    data[rowOffset + x * 4 + 3] = tmpColor.a * 255;
                });
            }
        }
        return data;
    }
    /**
     * Re-bakes the color gradient lookup texture pixels in place (same texture identity, so retained bindings —
     * e.g. the WebGPU update compute shader's — stay valid and the live particle pool survives the edit). Only
     * valid while the row layout is unchanged: a color2 range appearing or disappearing changes the texture
     * height and the render vertex buffer layout, which must go through the structural dispose + release path.
     * @returns false when the re-bake cannot handle the change (no texture yet, family emptied, or row layout flip)
     */
    _rebakeColorGradientTexture() {
        const texture = this._colorGradientsTexture;
        if (!texture || !this._colorGradients || !this._colorGradients.length) {
            return false;
        }
        const height = this._hasColorGradientColor2 ? 2 : 1;
        if (texture.getSize().height !== height) {
            return false;
        }
        texture.update(this._bakeColorGradientData(height));
        return true;
    }
    _createColorGradientTexture() {
        if (!this._colorGradients || !this._colorGradients.length || this._colorGradientsTexture) {
            return;
        }
        // When any stop has a color2, pack color1 into row 0 and color2 into row 1. The render shader
        // samples both rows and lerps using the particle's persistent seed.x for per-particle randomness.
        const height = this._hasColorGradientColor2 ? 2 : 1;
        const data = this._bakeColorGradientData(height);
        this._colorGradientsTexture = RawTexture.CreateRGBATexture(data, this._rawTextureWidth, height, this._scene, false, false, 1);
        this._colorGradientsTexture.name = "colorGradients";
    }
    _render(blendMode, emitterWM) {
        // Enable render effect
        const drawWrapper = this._getWrapper(blendMode);
        const effect = drawWrapper.effect;
        this._engine.enableEffect(drawWrapper);
        const viewMatrix = this._scene?.getViewMatrix() || Matrix.IdentityReadOnly;
        effect.setMatrix("view", viewMatrix);
        effect.setMatrix("projection", this.defaultProjectionMatrix ?? this._scene.getProjectionMatrix());
        effect.setTexture("diffuseSampler", this.particleTexture);
        effect.setVector2("translationPivot", this.translationPivot);
        const worldOffset = this.worldOffset.subtractToRef(this._scene?.floatingOriginOffset || Vector3.ZeroReadOnly, TmpVectors.Vector3[0]);
        effect.setVector3("worldOffset", worldOffset);
        if (this.isLocal) {
            effect.setMatrix("emitterWM", emitterWM);
        }
        if (this._colorGradientsTexture) {
            effect.setTexture("colorGradientSampler", this._colorGradientsTexture);
        }
        else {
            effect.setDirectColor4("colorDead", this.colorDead);
        }
        if (this._isAnimationSheetEnabled && this.particleTexture) {
            const baseSize = this.particleTexture.getBaseSize();
            effect.setFloat3("sheetInfos", this.spriteCellWidth / baseSize.width, this.spriteCellHeight / baseSize.height, baseSize.width / this.spriteCellWidth);
        }
        if (this._isBillboardBased && this._scene) {
            const camera = this._scene.activeCamera;
            effect.setVector3("eyePosition", camera.globalPosition);
        }
        const defines = effect.defines;
        if (this._scene) {
            BindClipPlane(effect, this, this._scene);
            if (this.applyFog) {
                BindFogParameters(this._scene, undefined, effect);
            }
        }
        if (defines.indexOf("#define BILLBOARDMODE_ALL") >= 0) {
            const invView = viewMatrix.clone();
            invView.invert();
            effect.setMatrix("invView", invView);
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
        // Bind source VAO
        this._platform.bindDrawBuffers(this._targetIndex, effect, this._scene?.forceWireframe ? this._linesIndexBufferUseInstancing : null);
        if (this._onBeforeDrawParticlesObservable) {
            this._onBeforeDrawParticlesObservable.notifyObservers(effect);
        }
        // Render
        if (this._scene?.forceWireframe) {
            this._engine.drawElementsType(6, 0, 10, this._currentActiveCount);
        }
        else {
            this._engine.drawArraysType(7, 0, 4, this._currentActiveCount);
        }
        this._engine.setAlphaMode(0);
        if (this._scene?.forceWireframe) {
            this._engine.unbindInstanceAttributes();
        }
        return this._currentActiveCount;
    }
    /** @internal */
    _update(emitterWM) {
        if (!this.emitter || !this._targetBuffer) {
            return;
        }
        if (!this._recreateUpdateEffect() || this._rebuildingAfterContextLost) {
            return;
        }
        if (!emitterWM) {
            if (this.emitter.position) {
                const emitterMesh = this.emitter;
                emitterWM = emitterMesh.getWorldMatrix();
            }
            else {
                const emitterPosition = this.emitter;
                emitterWM = TmpVectors.Matrix[0];
                Matrix.TranslationToRef(emitterPosition.x, emitterPosition.y, emitterPosition.z, emitterWM);
            }
        }
        const engine = this._engine;
        const depthWriteState = engine.getDepthWrite();
        engine.setDepthWrite(false);
        this._platform.preUpdateParticleBuffer();
        this._updateBuffer.setFloat("currentCount", this._currentActiveCount);
        this._updateBuffer.setFloat("timeDelta", this._timeDelta);
        this._updateBuffer.setFloat("stopFactor", this._stopped ? 0 : 1);
        this._updateBuffer.setFloat("emitIndex", this._emitIndex);
        this._updateBuffer.setFloat("emitCount", this._emitCount);
        this._updateBuffer.setInt("randomTextureSize", this._randomTextureSize);
        this._updateBuffer.setFloat2("lifeTime", this.minLifeTime, this.maxLifeTime);
        this._updateBuffer.setFloat2("emitPower", this.minEmitPower, this.maxEmitPower);
        if (!this._colorGradientsTexture) {
            this._updateBuffer.setDirectColor4("color1", this.color1);
            this._updateBuffer.setDirectColor4("color2", this.color2);
        }
        this._updateBuffer.setFloat2("sizeRange", this.minSize, this.maxSize);
        this._updateBuffer.setFloat4("scaleRange", this.minScaleX, this.maxScaleX, this.minScaleY, this.maxScaleY);
        this._updateBuffer.setFloat4("angleRange", this.minAngularSpeed, this.maxAngularSpeed, this.minInitialRotation, this.maxInitialRotation);
        this._updateBuffer.setVector3("gravity", this.gravity);
        if (this._limitVelocityGradientsTexture) {
            this._updateBuffer.setFloat("limitVelocityDamping", this.limitVelocityDamping);
        }
        if (this.particleEmitterType) {
            this.particleEmitterType.applyToShader(this._updateBuffer);
        }
        if (this._isAnimationSheetEnabled) {
            this._updateBuffer.setFloat4("cellInfos", this.startSpriteCellID, this.endSpriteCellID, this.spriteCellChangeSpeed, this.spriteCellLoop ? 1 : 0);
        }
        if (this.noiseTexture) {
            this._updateBuffer.setVector3("noiseStrength", this.noiseStrength);
        }
        if (this._flowMap) {
            const scene = this.getScene();
            this._updateBuffer.setFloat("flowMapStrength", this.flowMapStrength);
            this._updateBuffer.setMatrix("flowMapProjection", scene.getTransformMatrix());
        }
        if (!this.isLocal) {
            this._updateBuffer.setMatrix("emitterWM", emitterWM);
        }
        if (this._attractors.length > 0) {
            this._updateBuffer.setInt("attractorCount", this._attractors.length);
            // Compute inverse world matrix once for all attractors when in local space
            let invWorld;
            if (this.isLocal) {
                invWorld = TmpVectors.Matrix[1];
                emitterWM.invertToRef(invWorld);
            }
            for (let i = 0; i < this._attractors.length; i++) {
                const attractor = this._attractors[i];
                const name = "attractorPositionAndStrength[" + i + "]";
                if (invWorld) {
                    const localPos = TmpVectors.Vector3[0];
                    Vector3.TransformCoordinatesToRef(attractor.position, invWorld, localPos);
                    this._updateBuffer.setFloat4(name, localPos.x, localPos.y, localPos.z, attractor.strength);
                }
                else {
                    this._updateBuffer.setFloat4(name, attractor.position.x, attractor.position.y, attractor.position.z, attractor.strength);
                }
            }
        }
        if (this._startSizeGradients && this._startSizeGradients.length > 0) {
            this._updateBuffer.setFloat("startSizeGradientFactor", this._startSizeGradientFactor);
        }
        if (this._lifeTimeGradients && this._lifeTimeGradients.length > 0) {
            this._updateBuffer.setFloat2("lifeTimeGradientRange", this._lifeTimeGradientMin, this._lifeTimeGradientMax);
        }
        if (this._meshPositionTexture) {
            this._updateBuffer.setInt("meshTriangleCount", this._meshTriangleCount);
            this._updateBuffer.setInt("meshTextureWidth", this._meshTextureWidth);
        }
        this._platform.updateParticleBuffer(this._targetIndex, this._targetBuffer, this._currentActiveCount);
        // Switch VAOs
        this._targetIndex++;
        if (this._targetIndex === 2) {
            this._targetIndex = 0;
        }
        // Switch buffers
        const tmpBuffer = this._sourceBuffer;
        this._sourceBuffer = this._targetBuffer;
        this._targetBuffer = tmpBuffer;
        engine.setDepthWrite(depthWriteState);
    }
    /**
     * Renders the particle system in its current state
     * @param preWarm defines if the system should only update the particles but not render them
     * @param forceUpdateOnly if true, force to only update the particles and never display them (meaning, even if preWarm=false, when forceUpdateOnly=true the particles won't be displayed)
     * @returns the current number of particles
     */
    render(preWarm = false, forceUpdateOnly = false) {
        if (!this._started) {
            return 0;
        }
        if (!this.isReady()) {
            return 0;
        }
        if (!preWarm && this._scene) {
            if (!this._preWarmDone && this.preWarmCycles) {
                for (let index = 0; index < this.preWarmCycles; index++) {
                    this.animate(true);
                    this.render(true, true);
                }
                this._preWarmDone = true;
            }
            if (this._currentRenderId === this._scene.getRenderId() &&
                (!this._scene.activeCamera || (this._scene.activeCamera && this._currentRenderingCameraUniqueId === this._scene.activeCamera.uniqueId))) {
                return 0;
            }
            this._currentRenderId = this._scene.getRenderId();
            if (this._scene.activeCamera) {
                this._currentRenderingCameraUniqueId = this._scene.activeCamera.uniqueId;
            }
        }
        // Get everything ready to render
        this._initialize();
        // Compute effective emit rate, applying emit rate gradients if set
        let effectiveEmitRate = this.emitRate;
        if (this._emitRateGradients && this._emitRateGradients.length > 0 && this.targetStopDuration) {
            const ratio = this._actualFrame / this.targetStopDuration;
            GradientHelper.GetCurrentGradient(ratio, this._emitRateGradients, (currentGradient, nextGradient, scale) => {
                if (currentGradient !== this._currentEmitRateGradient) {
                    this._currentEmitRate1 = this._currentEmitRate2;
                    this._currentEmitRate2 = nextGradient.getFactor();
                    this._currentEmitRateGradient = currentGradient;
                }
                effectiveEmitRate = Lerp(this._currentEmitRate1, this._currentEmitRate2, scale);
            });
        }
        // Compute start size and life time gradient factors for shader uniforms
        if (this.targetStopDuration) {
            const ratio = this._actualFrame / this.targetStopDuration;
            if (this._startSizeGradients && this._startSizeGradients.length > 0) {
                GradientHelper.GetCurrentGradient(ratio, this._startSizeGradients, (currentGradient, nextGradient, scale) => {
                    if (currentGradient !== this._currentStartSizeGradient) {
                        this._currentStartSize1 = this._currentStartSize2;
                        this._currentStartSize2 = nextGradient.getFactor();
                        this._currentStartSizeGradient = currentGradient;
                    }
                    this._startSizeGradientFactor = Lerp(this._currentStartSize1, this._currentStartSize2, scale);
                });
            }
            else {
                this._startSizeGradientFactor = 1.0;
            }
            if (this._lifeTimeGradients && this._lifeTimeGradients.length > 0) {
                GradientHelper.GetCurrentGradient(ratio, this._lifeTimeGradients, (currentGradient, nextGradient, scale) => {
                    const current = currentGradient;
                    const next = nextGradient;
                    this._lifeTimeGradientMin = Lerp(current.factor1, next.factor1, scale);
                    this._lifeTimeGradientMax = Lerp(current.factor2 ?? current.factor1, next.factor2 ?? next.factor1, scale);
                });
            }
            else {
                this._lifeTimeGradientMin = 1.0;
                this._lifeTimeGradientMax = 1.0;
            }
        }
        if (this.emitRateControl) {
            // Emit-rate-controlled mode: limits active particles to ~emitRate * maxLifeTime,
            // matching CPU particle behavior with circular buffer recycling.
            // Accumulate fractional particles over time. Manual emit bypasses the rate.
            if (this.manualEmitCount > -1) {
                this._accumulatedCount += this.manualEmitCount;
                this.manualEmitCount = 0;
            }
            else if (!this._stopped) {
                this._accumulatedCount += effectiveEmitRate * this._timeDelta;
            }
            // Convert accumulated fractional count into whole particles to emit this frame.
            // The fractional remainder carries over to the next frame.
            let newParticles = 0;
            if (this._accumulatedCount >= 1) {
                newParticles = this._accumulatedCount | 0;
                this._accumulatedCount -= newParticles;
            }
            // The maximum number of particles that can be alive at once is bounded by
            // emitRate * maxLifeTime (e.g. 1000 emit/s * 0.3s = 300 particles).
            // This matches CPU particle system behavior and avoids filling the entire capacity.
            // When emitRate is 0 but manualEmitCount is used, the rate-based steady state
            // would be 0, blocking buffer growth. Use newParticles as a floor so manual
            // emissions can always allocate slots.
            const steadyStateCount = Math.min(Math.max(Math.ceil(effectiveEmitRate * this.maxLifeTime), newParticles), this._maxActiveParticleCount);
            // During ramp-up, grow the active buffer size by adding new slots.
            // Once _currentActiveCount reaches steadyStateCount, no new slots are added —
            // existing slots are recycled instead (handled by _emitIndex below).
            if (this._currentActiveCount < steadyStateCount && newParticles > 0) {
                const growth = Math.min(newParticles, steadyStateCount - this._currentActiveCount);
                this._currentActiveCount += growth;
            }
            // Tell the update shader which particle slots to (re)initialize this frame.
            // _emitIndex is where the circular write pointer starts in the buffer,
            // _emitCount is how many consecutive slots to reinitialize (with wrapping).
            // The shader checks each particle's index against this range to decide
            // whether to recycle it (emit branch) or advance its simulation (update branch).
            if (this._currentActiveCount > 0 && newParticles > 0) {
                this._emitCount = Math.min(newParticles, this._currentActiveCount);
                this._emitIndex = this._writePointer % this._currentActiveCount;
                this._writePointer += this._emitCount;
            }
            else {
                this._emitCount = 0;
            }
        }
        else {
            // Legacy mode: dead particles recycle immediately, filling up to capacity.
            if (this.manualEmitCount > -1) {
                this._accumulatedCount += this.manualEmitCount;
                this.manualEmitCount = 0;
            }
            else {
                this._accumulatedCount += effectiveEmitRate * this._timeDelta;
            }
            if (this._accumulatedCount >= 1) {
                const intPart = this._accumulatedCount | 0;
                this._accumulatedCount -= intPart;
                this._currentActiveCount += intPart;
            }
            this._currentActiveCount = Math.min(this._maxActiveParticleCount, this._currentActiveCount);
            this._emitIndex = 0;
            this._emitCount = 0;
        }
        if (!this._currentActiveCount) {
            return 0;
        }
        // Enable update effect
        let emitterWM;
        if (this.emitter.position) {
            const emitterMesh = this.emitter;
            emitterWM = emitterMesh.getWorldMatrix();
        }
        else {
            const emitterPosition = this.emitter;
            emitterWM = TmpVectors.Matrix[0];
            Matrix.TranslationToRef(emitterPosition.x, emitterPosition.y, emitterPosition.z, emitterWM);
        }
        const engine = this._engine;
        if (!this.updateInAnimate) {
            this._update(emitterWM);
        }
        let outparticles = 0;
        if (!preWarm && !forceUpdateOnly) {
            engine.setState(false);
            if (this.forceDepthWrite) {
                engine.setDepthWrite(true);
            }
            if (this.blendMode === ParticleSystem.BLENDMODE_MULTIPLYADD) {
                outparticles = this._render(ParticleSystem.BLENDMODE_MULTIPLY, emitterWM) + this._render(ParticleSystem.BLENDMODE_ADD, emitterWM);
            }
            else {
                outparticles = this._render(this.blendMode, emitterWM);
            }
            this._engine.setAlphaMode(0);
        }
        return outparticles;
    }
    /**
     * Rebuilds the particle system
     */
    rebuild() {
        const checkUpdateEffect = () => {
            if (!this._recreateUpdateEffect() || !this._platform.isUpdateBufferReady()) {
                setTimeout(checkUpdateEffect, 10);
            }
            else {
                this._initialize(true);
                this._rebuildingAfterContextLost = false;
            }
        };
        this._createIndexBuffer();
        this._cachedUpdateDefines = "";
        // Re-upload mesh emitter data if the mesh geometry changed
        this._disposeMeshEmitterTextures();
        this._platform.contextLost();
        this._rebuildingAfterContextLost = true;
        checkUpdateEffect();
    }
    _releaseBuffers() {
        if (this._buffer0) {
            this._buffer0.dispose();
            this._buffer0 = null;
        }
        if (this._buffer1) {
            this._buffer1.dispose();
            this._buffer1 = null;
        }
        if (this._spriteBuffer) {
            this._spriteBuffer.dispose();
            this._spriteBuffer = null;
        }
        this._platform.releaseBuffers();
    }
    /**
     * Disposes the particle system and free the associated resources
     * @param disposeTexture defines if the particule texture must be disposed as well (true by default)
     */
    dispose(disposeTexture = true) {
        for (const blendMode in this._drawWrappers) {
            const drawWrapper = this._drawWrappers[blendMode];
            drawWrapper.dispose();
        }
        this._drawWrappers = {};
        if (this._scene) {
            const index = this._scene.particleSystems.indexOf(this);
            if (index > -1) {
                this._scene.particleSystems.splice(index, 1);
            }
        }
        this._releaseBuffers();
        this._platform.releaseVertexBuffers();
        for (let i = 0; i < this._renderVertexBuffers.length; ++i) {
            const rvb = this._renderVertexBuffers[i];
            for (const key in rvb) {
                rvb[key].dispose();
            }
        }
        this._renderVertexBuffers = [];
        if (this._colorGradientsTexture) {
            this._colorGradientsTexture.dispose();
            this._colorGradientsTexture = null;
        }
        if (this._sizeGradientsTexture) {
            this._sizeGradientsTexture.dispose();
            this._sizeGradientsTexture = null;
        }
        if (this._angularSpeedGradientsTexture) {
            this._angularSpeedGradientsTexture.dispose();
            this._angularSpeedGradientsTexture = null;
        }
        if (this._velocityGradientsTexture) {
            this._velocityGradientsTexture.dispose();
            this._velocityGradientsTexture = null;
        }
        if (this._limitVelocityGradientsTexture) {
            this._limitVelocityGradientsTexture.dispose();
            this._limitVelocityGradientsTexture = null;
        }
        if (this._dragGradientsTexture) {
            this._dragGradientsTexture.dispose();
            this._dragGradientsTexture = null;
        }
        this._disposeMeshEmitterTextures();
        if (this._randomTexture) {
            this._randomTexture.dispose();
            this._randomTexture = null;
        }
        if (this._randomTexture2) {
            this._randomTexture2.dispose();
            this._randomTexture2 = null;
        }
        if (disposeTexture && this.particleTexture) {
            this.particleTexture.dispose();
            this.particleTexture = null;
        }
        if (disposeTexture && this.noiseTexture) {
            this.noiseTexture.dispose();
            this.noiseTexture = null;
        }
        if (disposeTexture && this._flowMap) {
            this._flowMap.dispose();
            this._flowMap = null;
        }
        // Callback
        this.onStoppedObservable.clear();
        this.onDisposeObservable.notifyObservers(this);
        this.onDisposeObservable.clear();
    }
    /**
     * Clones the particle system.
     * @param name The name of the cloned object
     * @param newEmitter The new emitter to use
     * @param cloneTexture Also clone the textures if true
     * @returns the cloned particle system
     */
    clone(name, newEmitter, cloneTexture = false) {
        const custom = { ...this._customWrappers };
        let program = null;
        const engine = this._engine;
        if (_IsSideEffectImplemented(engine.createEffectForParticles)) {
            if (this.customShader != null) {
                program = this.customShader;
                const defines = program.shaderOptions.defines.length > 0 ? program.shaderOptions.defines.join("\n") : "";
                custom[0] = engine.createEffectForParticles(program.shaderPath.fragmentElement, program.shaderOptions.uniforms, program.shaderOptions.samplers, defines, undefined, undefined, undefined, this);
            }
        }
        const serialization = this.serialize(cloneTexture);
        // When the texture is not serialized it is stored by name only, and Parse would reload it from
        // that name (which can resolve to a different image and reset texture settings like level).
        // Prefer a faithful copy of the source texture, and only skip the name-based reload when that
        // copy is available (clone() can legally return null for textures that do not implement it).
        const clonedTexture = cloneTexture === false && this.particleTexture ? this.particleTexture.clone() : null;
        if (clonedTexture) {
            serialization.textureName = undefined;
        }
        const result = GPUParticleSystem.Parse(serialization, this._scene || this._engine, this._rootUrl);
        result.name = name;
        result.customShader = program;
        result._customWrappers = custom;
        if (clonedTexture) {
            result.particleTexture = clonedTexture;
        }
        if (newEmitter === undefined) {
            newEmitter = this.emitter;
        }
        if (this.noiseTexture) {
            result.noiseTexture = this.noiseTexture.clone();
        }
        result.emitter = newEmitter;
        return result;
    }
    /**
     * Creates a new GPUParticleSystem from an existing CPU ParticleSystem, copying all shared properties.
     * Features that are not supported on the GPU (sub-emitters, custom `startDirectionFunction` /
     * `startPositionFunction`, `customShader`, ramp/remap gradients) are logged as warnings and skipped.
     * Flow maps are converted: the CPU `FlowMap` image data is uploaded to a new `RawTexture` which is
     * assigned to the result.
     *
     * Note: a custom `updateFunction` on the source cannot be detected (the property is always assigned
     * to a default) and has no equivalent on the GPU path, so any custom per-frame update logic will be
     * silently dropped.
     *
     * Textures (particleTexture, noiseTexture) are shared by reference between the source and the result.
     * All other mutable state (colors, vectors, emitter type, gradients, attractors) is cloned so that
     * the two systems can be modified independently after the call.
     *
     * Note: unlike the GPUParticleSystem constructor, `emitRateControl` defaults to `true` here so that
     * changes to `emitRate` on the converted system behave the same as on the CPU source. Pass
     * `{ emitRateControl: false }` explicitly to opt out.
     * @param source The CPU ParticleSystem to convert
     * @param sceneOrEngine The scene or engine the new GPU particle system belongs to
     * @param options Optional options forwarded to the new GPU particle system (capacity, randomTextureSize, emitRateControl, maxAttractors). `capacity` defaults to the source capacity and `emitRateControl` defaults to `true`.
     * @returns A new GPUParticleSystem with shared properties copied from the source
     */
    static fromParticleSystem(source, sceneOrEngine, options) {
        // Warn on features that cannot be represented on a GPU particle system.
        if (source.subEmitters && source.subEmitters.length > 0) {
            Logger.Warn("GPUParticleSystem.fromParticleSystem: 'subEmitters' is not supported on GPUParticleSystem and will be skipped.");
        }
        if (source.startDirectionFunction) {
            Logger.Warn("GPUParticleSystem.fromParticleSystem: 'startDirectionFunction' is not supported on GPUParticleSystem and will be skipped.");
        }
        if (source.startPositionFunction) {
            Logger.Warn("GPUParticleSystem.fromParticleSystem: 'startPositionFunction' is not supported on GPUParticleSystem and will be skipped.");
        }
        if (source.customShader) {
            Logger.Warn("GPUParticleSystem.fromParticleSystem: 'customShader' is not supported on GPUParticleSystem and will be skipped.");
        }
        const sourceRampGradients = source.getRampGradients();
        if (sourceRampGradients && sourceRampGradients.length > 0) {
            Logger.Warn("GPUParticleSystem.fromParticleSystem: 'rampGradients' are not supported on GPUParticleSystem and will be skipped.");
        }
        const sourceColorRemapGradients = source.getColorRemapGradients();
        if (sourceColorRemapGradients && sourceColorRemapGradients.length > 0) {
            Logger.Warn("GPUParticleSystem.fromParticleSystem: 'colorRemapGradients' are not supported on GPUParticleSystem and will be skipped.");
        }
        const sourceAlphaRemapGradients = source.getAlphaRemapGradients();
        if (sourceAlphaRemapGradients && sourceAlphaRemapGradients.length > 0) {
            Logger.Warn("GPUParticleSystem.fromParticleSystem: 'alphaRemapGradients' are not supported on GPUParticleSystem and will be skipped.");
        }
        const capacity = options?.capacity ?? source.getCapacity();
        const gpuOptions = { capacity };
        if (options?.randomTextureSize !== undefined) {
            gpuOptions.randomTextureSize = options.randomTextureSize;
        }
        // Default emitRateControl to true here: on a freshly constructed GPUParticleSystem the default is
        // false for backwards compatibility, but when converting an existing CPU system users expect
        // changes to emitRate to take effect — matching CPU behavior.
        gpuOptions.emitRateControl = options?.emitRateControl ?? true;
        if (options?.maxAttractors !== undefined) {
            gpuOptions.maxAttractors = options.maxAttractors;
        }
        const gpu = new GPUParticleSystem(source.name + " (GPU)", gpuOptions, sceneOrEngine, null, source.isAnimationSheetEnabled);
        gpu.id = source.id;
        // Emitter (shared by reference: mesh or Vector3 — users expect both systems to follow the same source).
        gpu.emitter = source.emitter;
        // Emitter type — cloned for independence.
        if (source.particleEmitterType) {
            gpu.particleEmitterType = source.particleEmitterType.clone();
        }
        // Textures — shared by reference.
        gpu.particleTexture = source.particleTexture;
        if (source.noiseTexture) {
            gpu.noiseTexture = source.noiseTexture;
        }
        // Colors.
        gpu.color1 = source.color1.clone();
        gpu.color2 = source.color2.clone();
        gpu.colorDead = source.colorDead.clone();
        gpu.textureMask = source.textureMask.clone();
        // Sizes.
        gpu.minSize = source.minSize;
        gpu.maxSize = source.maxSize;
        gpu.minScaleX = source.minScaleX;
        gpu.maxScaleX = source.maxScaleX;
        gpu.minScaleY = source.minScaleY;
        gpu.maxScaleY = source.maxScaleY;
        // Speeds / rotation.
        gpu.minEmitPower = source.minEmitPower;
        gpu.maxEmitPower = source.maxEmitPower;
        gpu.minAngularSpeed = source.minAngularSpeed;
        gpu.maxAngularSpeed = source.maxAngularSpeed;
        gpu.minInitialRotation = source.minInitialRotation;
        gpu.maxInitialRotation = source.maxInitialRotation;
        // Lifetime.
        gpu.minLifeTime = source.minLifeTime;
        gpu.maxLifeTime = source.maxLifeTime;
        // Emission.
        gpu.emitRate = source.emitRate;
        gpu.manualEmitCount = source.manualEmitCount;
        // Physics.
        gpu.gravity = source.gravity.clone();
        gpu.limitVelocityDamping = source.limitVelocityDamping;
        // Rendering.
        gpu.blendMode = source.blendMode;
        gpu.billboardMode = source.billboardMode;
        gpu.isBillboardBased = source.isBillboardBased;
        gpu.forceDepthWrite = source.forceDepthWrite;
        gpu.useLogarithmicDepth = source.useLogarithmicDepth;
        gpu.renderingGroupId = source.renderingGroupId;
        gpu.layerMask = source.layerMask;
        // Animation sheet.
        gpu.startSpriteCellID = source.startSpriteCellID;
        gpu.endSpriteCellID = source.endSpriteCellID;
        gpu.spriteCellWidth = source.spriteCellWidth;
        gpu.spriteCellHeight = source.spriteCellHeight;
        gpu.spriteCellChangeSpeed = source.spriteCellChangeSpeed;
        gpu.spriteCellLoop = source.spriteCellLoop;
        gpu.spriteRandomStartCell = source.spriteRandomStartCell;
        // Space.
        gpu.isLocal = source.isLocal;
        gpu.worldOffset = source.worldOffset.clone();
        gpu.translationPivot = source.translationPivot.clone();
        // Lifecycle.
        gpu.targetStopDuration = source.targetStopDuration;
        gpu.disposeOnStop = source.disposeOnStop;
        gpu.startDelay = source.startDelay;
        gpu.preWarmCycles = source.preWarmCycles;
        gpu.preWarmStepOffset = source.preWarmStepOffset;
        gpu.updateSpeed = source.updateSpeed;
        gpu.preventAutoStart = source.preventAutoStart;
        // Animations (shared by reference, matching the rest of the scene-graph convention).
        gpu.animations = source.animations;
        gpu.beginAnimationOnStart = source.beginAnimationOnStart;
        gpu.beginAnimationFrom = source.beginAnimationFrom;
        gpu.beginAnimationTo = source.beginAnimationTo;
        gpu.beginAnimationLoop = source.beginAnimationLoop;
        // Noise.
        gpu.noiseStrength = source.noiseStrength.clone();
        // Flow map — convert the CPU FlowMap (JS-side image data) into a RawTexture for GPU sampling.
        // The CPU FlowMap stores image data top-left origin and flips V in its sampler; to get the
        // same orientation under the GPU shader's non-flipped sampling, the uploaded texture needs invertY=true.
        if (source.flowMap) {
            const sourceFlowMap = source.flowMap;
            const flowTexture = new RawTexture(new Uint8Array(sourceFlowMap.data.buffer, sourceFlowMap.data.byteOffset, sourceFlowMap.data.byteLength), sourceFlowMap.width, sourceFlowMap.height, 5, sceneOrEngine, false, true, 2);
            gpu.flowMap = flowTexture;
            gpu.flowMapStrength = source.flowMapStrength;
        }
        // Gradients.
        const colorGradients = source.getColorGradients();
        if (colorGradients) {
            for (const g of colorGradients) {
                gpu.addColorGradient(g.gradient, g.color1.clone(), g.color2?.clone());
            }
        }
        const sizeGradients = source.getSizeGradients();
        if (sizeGradients) {
            for (const g of sizeGradients) {
                gpu.addSizeGradient(g.gradient, g.factor1, g.factor2);
            }
        }
        const angularSpeedGradients = source.getAngularSpeedGradients();
        if (angularSpeedGradients) {
            for (const g of angularSpeedGradients) {
                gpu.addAngularSpeedGradient(g.gradient, g.factor1, g.factor2);
            }
        }
        const velocityGradients = source.getVelocityGradients();
        if (velocityGradients) {
            for (const g of velocityGradients) {
                gpu.addVelocityGradient(g.gradient, g.factor1, g.factor2);
            }
        }
        const limitVelocityGradients = source.getLimitVelocityGradients();
        if (limitVelocityGradients) {
            for (const g of limitVelocityGradients) {
                gpu.addLimitVelocityGradient(g.gradient, g.factor1, g.factor2);
            }
        }
        const dragGradients = source.getDragGradients();
        if (dragGradients) {
            for (const g of dragGradients) {
                gpu.addDragGradient(g.gradient, g.factor1, g.factor2);
            }
        }
        const emitRateGradients = source.getEmitRateGradients();
        if (emitRateGradients) {
            for (const g of emitRateGradients) {
                gpu.addEmitRateGradient(g.gradient, g.factor1, g.factor2);
            }
        }
        const startSizeGradients = source.getStartSizeGradients();
        if (startSizeGradients) {
            for (const g of startSizeGradients) {
                gpu.addStartSizeGradient(g.gradient, g.factor1, g.factor2);
            }
        }
        const lifeTimeGradients = source.getLifeTimeGradients();
        if (lifeTimeGradients) {
            for (const g of lifeTimeGradients) {
                gpu.addLifeTimeGradient(g.gradient, g.factor1, g.factor2);
            }
        }
        // Attractors — cloned.
        for (const attractor of source.attractors) {
            const newAttractor = new Attractor();
            newAttractor.position = attractor.position.clone();
            newAttractor.strength = attractor.strength;
            gpu.addAttractor(newAttractor);
        }
        return gpu;
    }
    /**
     * Serializes the particle system to a JSON object
     * @param serializeTexture defines if the texture must be serialized as well
     * @returns the JSON object
     */
    serialize(serializeTexture = false) {
        const serializationObject = {};
        ParticleSystem._Serialize(serializationObject, this, serializeTexture);
        serializationObject.activeParticleCount = this.activeParticleCount;
        serializationObject.randomTextureSize = this._randomTextureSize;
        serializationObject.emitRateControl = this.emitRateControl;
        serializationObject.maxAttractors = this.maxAttractors;
        serializationObject.customShader = this.customShader;
        serializationObject.preventAutoStart = this.preventAutoStart;
        serializationObject.worldOffset = this.worldOffset.asArray();
        if (this.metadata) {
            serializationObject.metadata = this.metadata;
        }
        // Attractors
        if (this._attractors.length > 0) {
            serializationObject.attractors = [];
            for (const attractor of this._attractors) {
                serializationObject.attractors.push(attractor.serialize());
            }
        }
        return serializationObject;
    }
    /**
     * Parses a JSON object to create a GPU particle system.
     * @param parsedParticleSystem The JSON object to parse
     * @param sceneOrEngine The scene or the engine to create the particle system in
     * @param rootUrl The root url to use to load external dependencies like texture
     * @param doNotStart Ignore the preventAutoStart attribute and does not start
     * @param capacity defines the system capacity (if null or undefined the sotred capacity will be used)
     * @returns the parsed GPU particle system
     */
    static Parse(parsedParticleSystem, sceneOrEngine, rootUrl, doNotStart = false, capacity) {
        const name = parsedParticleSystem.name;
        let engine;
        let scene;
        if (sceneOrEngine instanceof AbstractEngine) {
            engine = sceneOrEngine;
        }
        else {
            scene = sceneOrEngine;
            engine = scene.getEngine();
        }
        const particleSystem = new GPUParticleSystem(name, {
            capacity: capacity || parsedParticleSystem.capacity,
            randomTextureSize: parsedParticleSystem.randomTextureSize,
            emitRateControl: parsedParticleSystem.emitRateControl,
            maxAttractors: parsedParticleSystem.maxAttractors,
        }, sceneOrEngine, null, parsedParticleSystem.isAnimationSheetEnabled);
        particleSystem._rootUrl = rootUrl;
        if (parsedParticleSystem.customShader && _IsSideEffectImplemented(engine.createEffectForParticles)) {
            const program = parsedParticleSystem.customShader;
            const defines = program.shaderOptions.defines.length > 0 ? program.shaderOptions.defines.join("\n") : "";
            const custom = engine.createEffectForParticles(program.shaderPath.fragmentElement, program.shaderOptions.uniforms, program.shaderOptions.samplers, defines, undefined, undefined, undefined, particleSystem);
            particleSystem.setCustomEffect(custom, 0);
            particleSystem.customShader = program;
        }
        if (parsedParticleSystem.id) {
            particleSystem.id = parsedParticleSystem.id;
        }
        if (parsedParticleSystem.activeParticleCount) {
            particleSystem.activeParticleCount = parsedParticleSystem.activeParticleCount;
        }
        ParticleSystem._Parse(parsedParticleSystem, particleSystem, sceneOrEngine, rootUrl);
        if (parsedParticleSystem.worldOffset) {
            particleSystem.worldOffset = Vector3.FromArray(parsedParticleSystem.worldOffset);
        }
        // Auto start
        if (parsedParticleSystem.preventAutoStart) {
            particleSystem.preventAutoStart = parsedParticleSystem.preventAutoStart;
        }
        if (parsedParticleSystem.metadata) {
            particleSystem.metadata = parsedParticleSystem.metadata;
        }
        // Attractors
        if (parsedParticleSystem.attractors) {
            for (const attractorData of parsedParticleSystem.attractors) {
                const attractor = new Attractor();
                attractor.position = Vector3.FromArray(attractorData.position);
                attractor.strength = attractorData.strength;
                particleSystem.addAttractor(attractor);
            }
        }
        if (!doNotStart && !particleSystem.preventAutoStart) {
            particleSystem.start();
        }
        return particleSystem;
    }
}
//# sourceMappingURL=gpuParticleSystem.pure.js.map