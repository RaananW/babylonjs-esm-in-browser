/** This file must only contain pure code and pure imports */
import { type Immutable, type Nullable } from "../types.js";
import { type Color3Gradient, type IValueGradient } from "../Misc/gradients.js";
import { Observable } from "../Misc/observable.pure.js";
import { Matrix } from "../Maths/math.vector.pure.js";
import { Color4 } from "../Maths/math.color.pure.js";
import { VertexBuffer } from "../Buffers/buffer.pure.js";
import { type IParticleSystem } from "./IParticleSystem.js";
import { BaseParticleSystem } from "./baseParticleSystem.pure.js";
import { ParticleSystem } from "./particleSystem.pure.js";
import { Attractor } from "./attractor.js";
import { type IDisposable, Scene } from "../scene.pure.js";
import { type Effect } from "../Materials/effect.pure.js";
import { RawTexture } from "../Materials/Textures/rawTexture.js";
import { type IAnimatable } from "../Animations/animatable.interface.js";
import { AbstractEngine } from "../Engines/abstractEngine.pure.js";
import { type DataBuffer } from "../Buffers/dataBuffer.js";
import { DrawWrapper } from "../Materials/drawWrapper.js";
import { type Texture } from "../Materials/Textures/texture.pure.js";
/**
 * This represents a GPU particle system in Babylon
 * This is the fastest particle system in Babylon as it uses the GPU to update the individual particle data
 * @see https://www.babylonjs-playground.com/#PU4WYI#4
 */
export declare class GPUParticleSystem extends BaseParticleSystem implements IDisposable, IParticleSystem, IAnimatable {
    /**
     * The layer mask we are rendering the particles through.
     */
    layerMask: number;
    private _capacity;
    private _maxActiveParticleCount;
    private _currentActiveCount;
    private _accumulatedCount;
    private _writePointer;
    private _emitIndex;
    private _emitCount;
    private _updateBuffer;
    private _buffer0;
    private _buffer1;
    private _spriteBuffer;
    private _renderVertexBuffers;
    private _linesIndexBufferUseInstancing;
    private _targetIndex;
    private _sourceBuffer;
    private _targetBuffer;
    /** Set to true when any entry in `_colorGradients` has a `color2` (per-particle random color range). */
    private _hasColorGradientColor2;
    private _currentRenderId;
    private _currentRenderingCameraUniqueId;
    private _started;
    private _stopped;
    private _timeDelta;
    /** @internal */
    _randomTexture: RawTexture;
    /** @internal */
    _randomTexture2: RawTexture;
    /** Indicates that the update of particles is done in the animate function (and not in render). Default: false */
    updateInAnimate: boolean;
    private _attributesStrideSize;
    private _cachedUpdateDefines;
    private _randomTextureSize;
    private _actualFrame;
    private _drawWrappers;
    private _customWrappers;
    private _renderShadersLoaded;
    private readonly _rawTextureWidth;
    private _platform;
    private _rebuildingAfterContextLost;
    /**
     * Whether the particle buffer needs to store the initial emission direction.
     * True when particles are not billboarded (they orient by direction) or when
     * using stretched-local billboard mode (stretches along initial direction).
     * @internal
     */
    get _needsInitialDirection(): boolean;
    private _currentEmitRateGradient;
    private _currentEmitRate1;
    private _currentEmitRate2;
    private _currentStartSizeGradient;
    private _currentStartSize1;
    private _currentStartSize2;
    private _startSizeGradientFactor;
    private _lifeTimeGradientMin;
    private _lifeTimeGradientMax;
    /**
     * Specifies if the particle system should be serialized
     */
    doNotSerialize: boolean;
    /**
     * Gets a boolean indicating if the GPU particles can be rendered on current browser
     */
    static get IsSupported(): boolean;
    /**
     * An event triggered when the system is disposed.
     */
    onDisposeObservable: Observable<IParticleSystem>;
    /**
     * An event triggered when the system is stopped
     */
    onStoppedObservable: Observable<IParticleSystem>;
    /**
     * An event triggered when the system is started
     */
    onStartedObservable: Observable<IParticleSystem>;
    private _createIndexBuffer;
    /**
     * Gets the maximum number of particles active at the same time.
     * @returns The max number of active particles.
     */
    getCapacity(): number;
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
    emitRateControl: boolean;
    /**
     * Forces the particle to write their depth information to the depth buffer. This can help preventing other draw calls
     * to override the particles.
     */
    forceDepthWrite: boolean;
    /**
     * Gets or set the number of active particles
     * The value cannot be greater than "capacity" (if it is, it will be limited to "capacity").
     */
    get maxActiveParticleCount(): number;
    set maxActiveParticleCount(value: number);
    /**
     * Gets or set the number of active particles
     * @deprecated Please use maxActiveParticleCount instead.
     */
    get activeParticleCount(): number;
    set activeParticleCount(value: number);
    private _preWarmDone;
    /**
     * Specifies if the particles are updated in emitter local space or world space.
     */
    isLocal: boolean;
    /** Indicates that the particle system is GPU based */
    readonly isGPU = true;
    /** Attractors */
    /**
     * Maximum number of attractors for this GPU particle system instance.
     * Determined at construction time via the `maxAttractors` option (default 8).
     * Limited by the fixed-size uniform arrays in the update shaders.
     */
    readonly maxAttractors: number;
    /**
     * Add an attractor to the particle system. Attractors are used to change the direction of the particles in the system.
     * @param attractor - The attractor to add to the particle system
     */
    addAttractor(attractor: Attractor): void;
    /** Gets or sets a matrix to use to compute projection */
    defaultProjectionMatrix: Matrix;
    /**
     * Gets or sets an object used to store user defined information for the particle system
     */
    metadata: any;
    /** Flow map */
    /** @internal */
    _flowMap: Nullable<Texture>;
    /**
     * The strength of the flow map
     */
    flowMapStrength: number;
    /** Gets or sets the current flow map */
    get flowMap(): Nullable<Texture>;
    set flowMap(value: Nullable<Texture>);
    /** Mesh emitter textures */
    /** @internal */
    _meshPositionTexture: Nullable<RawTexture>;
    /** @internal */
    _meshNormalTexture: Nullable<RawTexture>;
    /** @internal */
    _meshTriangleCount: number;
    /** @internal */
    _meshTextureWidth: number;
    private _meshEmitterMeshId;
    private _meshEmitterUsedNormals;
    /**
     * Is this system ready to be used/rendered
     * @returns true if the system is ready
     */
    isReady(): boolean;
    /**
     * Gets if the system has been started. (Note: this will still be true after stop is called)
     * @returns True if it has been started, otherwise false.
     */
    isStarted(): boolean;
    /**
     * Gets if the system has been stopped. (Note: rendering is still happening but the system is frozen)
     * @returns True if it has been stopped, otherwise false.
     */
    isStopped(): boolean;
    /**
     * Gets a boolean indicating that the system is stopping
     * @returns true if the system is currently stopping
     */
    isStopping(): boolean;
    /**
     * Gets the number of particles active at the same time.
     * @returns The number of active particles.
     */
    getActiveCount(): number;
    /**
     * Starts the particle system and begins to emit
     * @param delay defines the delay in milliseconds before starting the system (this.startDelay by default)
     */
    start(delay?: number): void;
    /**
     * Stops the particle system.
     */
    stop(): void;
    /**
     * Remove all active particles
     */
    reset(): void;
    /**
     * Returns the string "GPUParticleSystem"
     * @returns a string containing the class name
     */
    getClassName(): string;
    /**
     * Gets the custom effect used to render the particles
     * @param blendMode Blend mode for which the effect should be retrieved
     * @returns The effect
     */
    getCustomEffect(blendMode?: number): Nullable<Effect>;
    private _getCustomDrawWrapper;
    /**
     * Sets the custom effect used to render the particles
     * @param effect The effect to set
     * @param blendMode Blend mode for which the effect should be set
     */
    setCustomEffect(effect: Nullable<Effect>, blendMode?: number): void;
    /** @internal */
    protected _onBeforeDrawParticlesObservable: Nullable<Observable<Nullable<Effect>>>;
    /**
     * Observable that will be called just before the particles are drawn
     */
    get onBeforeDrawParticlesObservable(): Observable<Nullable<Effect>>;
    /**
     * Gets the name of the particle vertex shader
     */
    get vertexShaderName(): string;
    /**
     * Gets the vertex buffers used by the particle system
     * Should be called after render() has been called for the current frame so that the buffers returned are the ones that have been updated
     * in the current frame (there's a ping-pong between two sets of buffers - for a given frame, one set is used as the source and the other as the destination)
     */
    get vertexBuffers(): Immutable<{
        [key: string]: VertexBuffer;
    }>;
    /**
     * Gets the index buffer used by the particle system (null for GPU particle systems)
     */
    get indexBuffer(): Nullable<DataBuffer>;
    /** @internal */
    _colorGradientsTexture: RawTexture;
    protected _removeGradientAndTexture(gradient: number, gradients: Nullable<IValueGradient[]>, texture: RawTexture): BaseParticleSystem;
    /**
     * Adds a new color gradient
     * @param gradient defines the gradient to use (between 0 and 1)
     * @param color1 defines the color to affect to the specified gradient
     * @param color2 defines an optional second color to be used to produce a random color per particle at the gradient (lerped with color1 using a per-particle random value)
     * @returns the current particle system
     */
    addColorGradient(gradient: number, color1: Color4, color2?: Color4): GPUParticleSystem;
    /**
     * Resyncs the color gradient state after a change.
     * @param reorder true to re-sort the gradient list by position
     * @returns true when the existing lookup texture was re-baked in place (value-only change — nothing to
     * release, the live particle pool survives), false when the change is structural (family emptied, color2 row
     * layout flipped, or no texture yet) and the caller must release the buffers; in that case the outdated
     * texture is disposed for lazy recreation.
     */
    private _refreshColorGradient;
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
    forceRefreshGradients(): void;
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
    private _gradientFamilyNeedsResync;
    /**
     * Remove a specific color gradient
     * @param gradient defines the gradient to remove
     * @returns the current particle system
     */
    removeColorGradient(gradient: number): GPUParticleSystem;
    /**
     * Resets the draw wrappers cache
     */
    resetDrawCache(): void;
    /** @internal */
    _angularSpeedGradientsTexture: RawTexture;
    /** @internal */
    _sizeGradientsTexture: RawTexture;
    /** @internal */
    _velocityGradientsTexture: RawTexture;
    /** @internal */
    _limitVelocityGradientsTexture: RawTexture;
    /** @internal */
    _dragGradientsTexture: RawTexture;
    /**
     * Adds a new size gradient
     * @param gradient defines the gradient to use (between 0 and 1)
     * @param factor defines the size factor to affect to the specified gradient
     * @param factor2 defines an additional factor used to define a range ([factor, factor2]) with main value to pick the final value from
     * @returns the current particle system
     */
    addSizeGradient(gradient: number, factor: number, factor2?: number): GPUParticleSystem;
    /**
     * Remove a specific size gradient
     * @param gradient defines the gradient to remove
     * @returns the current particle system
     */
    removeSizeGradient(gradient: number): GPUParticleSystem;
    /**
     * Resyncs a factor gradient family's lookup texture after a change.
     * @param factorGradients defines the gradient family that changed
     * @param textureName defines the name of the property holding the family's lookup texture
     * @returns true when the existing texture was re-baked in place (value-only change — nothing to release, the
     * live particle pool survives), false when the caller must release the buffers (no texture to re-bake, or the
     * family was emptied); in that case the outdated texture is disposed for lazy recreation.
     */
    private _refreshFactorGradient;
    /**
     * Adds a new angular speed gradient
     * @param gradient defines the gradient to use (between 0 and 1)
     * @param factor defines the angular speed to affect to the specified gradient
     * @param factor2 defines an additional factor used to define a range ([factor, factor2]) with main value to pick the final value from
     * @returns the current particle system
     */
    addAngularSpeedGradient(gradient: number, factor: number, factor2?: number): GPUParticleSystem;
    /**
     * Remove a specific angular speed gradient
     * @param gradient defines the gradient to remove
     * @returns the current particle system
     */
    removeAngularSpeedGradient(gradient: number): GPUParticleSystem;
    /**
     * Adds a new velocity gradient
     * @param gradient defines the gradient to use (between 0 and 1)
     * @param factor defines the velocity to affect to the specified gradient
     * @param factor2 defines an additional factor used to define a range ([factor, factor2]) with main value to pick the final value from
     * @returns the current particle system
     */
    addVelocityGradient(gradient: number, factor: number, factor2?: number): GPUParticleSystem;
    /**
     * Remove a specific velocity gradient
     * @param gradient defines the gradient to remove
     * @returns the current particle system
     */
    removeVelocityGradient(gradient: number): GPUParticleSystem;
    /**
     * Adds a new limit velocity gradient
     * @param gradient defines the gradient to use (between 0 and 1)
     * @param factor defines the limit velocity value to affect to the specified gradient
     * @param factor2 defines an additional factor used to define a range ([factor, factor2]) with main value to pick the final value from
     * @returns the current particle system
     */
    addLimitVelocityGradient(gradient: number, factor: number, factor2?: number): GPUParticleSystem;
    /**
     * Remove a specific limit velocity gradient
     * @param gradient defines the gradient to remove
     * @returns the current particle system
     */
    removeLimitVelocityGradient(gradient: number): GPUParticleSystem;
    /**
     * Adds a new drag gradient
     * @param gradient defines the gradient to use (between 0 and 1)
     * @param factor defines the drag value to affect to the specified gradient
     * @param factor2 defines an additional factor used to define a range ([factor, factor2]) with main value to pick the final value from
     * @returns the current particle system
     */
    addDragGradient(gradient: number, factor: number, factor2?: number): GPUParticleSystem;
    /**
     * Remove a specific drag gradient
     * @param gradient defines the gradient to remove
     * @returns the current particle system
     */
    removeDragGradient(gradient: number): GPUParticleSystem;
    /**
     * Adds a new start size gradient (please note that this will only work if you set the targetStopDuration property)
     * @param gradient defines the gradient to use (between 0 and 1)
     * @param factor defines the start size factor to affect to the specified gradient
     * @param factor2 defines an additional factor used to define a range ([factor, factor2]) with main value to pick the final value from
     * @returns the current particle system
     */
    addStartSizeGradient(gradient: number, factor: number, factor2?: number): IParticleSystem;
    /**
     * Remove a specific start size gradient
     * @param gradient defines the gradient to remove
     * @returns the current particle system
     */
    removeStartSizeGradient(gradient: number): IParticleSystem;
    /**
     * Not supported by GPUParticleSystem
     * @returns the current particle system
     */
    addColorRemapGradient(): IParticleSystem;
    /**
     * Not supported by GPUParticleSystem
     * @returns the current particle system
     */
    removeColorRemapGradient(): IParticleSystem;
    /**
     * Not supported by GPUParticleSystem
     * @returns the current particle system
     */
    addAlphaRemapGradient(): IParticleSystem;
    /**
     * Not supported by GPUParticleSystem
     * @returns the current particle system
     */
    removeAlphaRemapGradient(): IParticleSystem;
    /**
     * Not supported by GPUParticleSystem
     * @returns the current particle system
     */
    addRampGradient(): IParticleSystem;
    /**
     * Not supported by GPUParticleSystem
     * @returns the current particle system
     */
    removeRampGradient(): IParticleSystem;
    /**
     * Not supported by GPUParticleSystem
     * @returns the list of ramp gradients
     */
    getRampGradients(): Nullable<Array<Color3Gradient>>;
    /**
     * Not supported by GPUParticleSystem
     * Gets or sets a boolean indicating that ramp gradients must be used
     * @see https://doc.babylonjs.com/features/featuresDeepDive/particles/particle_system/particle_system_intro#ramp-gradients
     */
    get useRampGradients(): boolean;
    set useRampGradients(value: boolean);
    /**
     * Adds a new life time gradient (please note that this will only work if you set the targetStopDuration property)
     * @param gradient defines the gradient to use (between 0 and 1)
     * @param factor defines the life time factor to affect to the specified gradient
     * @param factor2 defines an additional factor used to define a range ([factor, factor2]) with main value to pick the final value from
     * @returns the current particle system
     */
    addLifeTimeGradient(gradient: number, factor: number, factor2?: number): IParticleSystem;
    /**
     * Remove a specific life time gradient
     * @param gradient defines the gradient to remove
     * @returns the current particle system
     */
    removeLifeTimeGradient(gradient: number): IParticleSystem;
    /**
     * Instantiates a GPU particle system.
     * Particles are often small sprites used to simulate hard-to-reproduce phenomena like fire, smoke, water, or abstract visual effects like magic glitter and faery dust.
     * @param name The name of the particle system
     * @param options The options used to create the system
     * @param sceneOrEngine The scene the particle system belongs to or the engine to use if no scene
     * @param customEffect a custom effect used to change the way particles are rendered by default
     * @param isAnimationSheetEnabled Must be true if using a spritesheet to animate the particles texture
     */
    constructor(name: string, options: Partial<{
        capacity: number;
        randomTextureSize: number;
        emitRateControl: boolean;
        maxAttractors: number;
    }>, sceneOrEngine: Scene | AbstractEngine, customEffect?: Nullable<Effect>, isAnimationSheetEnabled?: boolean);
    protected _reset(): void;
    private _createVertexBuffers;
    private _initialize;
    /**
     * Forces the update effect to be recreated on the next render.
     */
    private _resetEffect;
    /** @internal */
    _recreateUpdateEffect(): boolean;
    /**
     * @internal
     */
    _getWrapper(blendMode: number): DrawWrapper;
    /**
     * @internal
     */
    static _GetAttributeNamesOrOptions(hasColorGradients?: boolean, isAnimationSheetEnabled?: boolean, isBillboardBased?: boolean, isBillboardStretched?: boolean, isBillboardStretchedLocal?: boolean, hasColorGradientColor2?: boolean): string[];
    /**
     * @internal
     */
    static _GetEffectCreationOptions(isAnimationSheetEnabled?: boolean, useLogarithmicDepth?: boolean, applyFog?: boolean): string[];
    /**
     * Fill the defines array according to the current settings of the particle system
     * @param defines Array to be updated
     * @param blendMode blend mode to take into account when updating the array
     * @param fillImageProcessing fills the image processing defines
     */
    fillDefines(defines: Array<string>, blendMode?: number, fillImageProcessing?: boolean): void;
    /**
     * Fill the uniforms, attributes and samplers arrays according to the current settings of the particle system
     * @param uniforms Uniforms array to fill
     * @param attributes Attributes array to fill
     * @param samplers Samplers array to fill
     */
    fillUniformsAttributesAndSamplerNames(uniforms: Array<string>, attributes: Array<string>, samplers: Array<string>): void;
    /**
     * Animates the particle system for the current frame by emitting new particles and or animating the living ones.
     * @param preWarm defines if we are in the pre-warmimg phase
     */
    animate(preWarm?: boolean): void;
    private _bakeFactorGradientData;
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
    private _rebakeFactorGradientTexture;
    private _createFactorGradientTexture;
    private _createSizeGradientTexture;
    private _createAngularSpeedGradientTexture;
    private _createVelocityGradientTexture;
    private _createLimitVelocityGradientTexture;
    private _createDragGradientTexture;
    private _disposeMeshEmitterTextures;
    private _createMeshEmitterTextures;
    private _bakeColorGradientData;
    /**
     * Re-bakes the color gradient lookup texture pixels in place (same texture identity, so retained bindings —
     * e.g. the WebGPU update compute shader's — stay valid and the live particle pool survives the edit). Only
     * valid while the row layout is unchanged: a color2 range appearing or disappearing changes the texture
     * height and the render vertex buffer layout, which must go through the structural dispose + release path.
     * @returns false when the re-bake cannot handle the change (no texture yet, family emptied, or row layout flip)
     */
    private _rebakeColorGradientTexture;
    private _createColorGradientTexture;
    private _render;
    /** @internal */
    _update(emitterWM?: Matrix): void;
    /**
     * Renders the particle system in its current state
     * @param preWarm defines if the system should only update the particles but not render them
     * @param forceUpdateOnly if true, force to only update the particles and never display them (meaning, even if preWarm=false, when forceUpdateOnly=true the particles won't be displayed)
     * @returns the current number of particles
     */
    render(preWarm?: boolean, forceUpdateOnly?: boolean): number;
    /**
     * Rebuilds the particle system
     */
    rebuild(): void;
    private _releaseBuffers;
    /**
     * Disposes the particle system and free the associated resources
     * @param disposeTexture defines if the particule texture must be disposed as well (true by default)
     */
    dispose(disposeTexture?: boolean): void;
    /**
     * Clones the particle system.
     * @param name The name of the cloned object
     * @param newEmitter The new emitter to use
     * @param cloneTexture Also clone the textures if true
     * @returns the cloned particle system
     */
    clone(name: string, newEmitter: any, cloneTexture?: boolean): GPUParticleSystem;
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
    static fromParticleSystem(source: ParticleSystem, sceneOrEngine: Scene | AbstractEngine, options?: Partial<{
        capacity: number;
        randomTextureSize: number;
        emitRateControl: boolean;
        maxAttractors: number;
    }>): GPUParticleSystem;
    /**
     * Serializes the particle system to a JSON object
     * @param serializeTexture defines if the texture must be serialized as well
     * @returns the JSON object
     */
    serialize(serializeTexture?: boolean): any;
    /**
     * Parses a JSON object to create a GPU particle system.
     * @param parsedParticleSystem The JSON object to parse
     * @param sceneOrEngine The scene or the engine to create the particle system in
     * @param rootUrl The root url to use to load external dependencies like texture
     * @param doNotStart Ignore the preventAutoStart attribute and does not start
     * @param capacity defines the system capacity (if null or undefined the sotred capacity will be used)
     * @returns the parsed GPU particle system
     */
    static Parse(parsedParticleSystem: any, sceneOrEngine: Scene | AbstractEngine, rootUrl: string, doNotStart?: boolean, capacity?: number): GPUParticleSystem;
}
