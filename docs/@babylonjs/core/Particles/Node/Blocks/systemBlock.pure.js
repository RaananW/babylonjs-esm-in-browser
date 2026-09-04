/** This file must only contain pure code and pure imports */
import { __esDecorate, __runInitializers } from "../../../tslib.es6.js";

import { _IsSideEffectImplemented } from "../../../Misc/devTools.js";
import { editableInPropertyPage } from "../../../Decorators/nodeDecorator.js";
import { Vector2, Vector3 } from "../../../Maths/math.vector.pure.js";
import { Color4 } from "../../../Maths/math.color.pure.js";
import { BaseParticleSystem } from "../../baseParticleSystem.pure.js";
import { NodeParticleBlock } from "../nodeParticleBlock.js";
import { _TriggerSubEmitter } from "./Triggers/triggerTools.js";
import { NodeParticleBlockConnectionPointTypes } from "../Enums/nodeParticleBlockConnectionPointTypes.js";
import { RegisterClass } from "../../../Misc/typeStore.js";
/**
 * Block used to get a system of particles
 */
let SystemBlock = (() => {
    var _a;
    let _classSuper = NodeParticleBlock;
    let _blendMode_decorators;
    let _blendMode_initializers = [];
    let _blendMode_extraInitializers = [];
    let _capacity_decorators;
    let _capacity_initializers = [];
    let _capacity_extraInitializers = [];
    let _manualEmitCount_decorators;
    let _manualEmitCount_initializers = [];
    let _manualEmitCount_extraInitializers = [];
    let _startDelay_decorators;
    let _startDelay_initializers = [];
    let _startDelay_extraInitializers = [];
    let _updateSpeed_decorators;
    let _updateSpeed_initializers = [];
    let _updateSpeed_extraInitializers = [];
    let _preWarmCycles_decorators;
    let _preWarmCycles_initializers = [];
    let _preWarmCycles_extraInitializers = [];
    let _preWarmStepOffset_decorators;
    let _preWarmStepOffset_initializers = [];
    let _preWarmStepOffset_extraInitializers = [];
    let _isBillboardBased_decorators;
    let _isBillboardBased_initializers = [];
    let _isBillboardBased_extraInitializers = [];
    let _billBoardMode_decorators;
    let _billBoardMode_initializers = [];
    let _billBoardMode_extraInitializers = [];
    let _isLocal_decorators;
    let _isLocal_initializers = [];
    let _isLocal_extraInitializers = [];
    let _disposeOnStop_decorators;
    let _disposeOnStop_initializers = [];
    let _disposeOnStop_extraInitializers = [];
    let _doNoStart_decorators;
    let _doNoStart_initializers = [];
    let _doNoStart_extraInitializers = [];
    let _renderingGroupId_decorators;
    let _renderingGroupId_initializers = [];
    let _renderingGroupId_extraInitializers = [];
    return _a = class SystemBlock extends _classSuper {
            /**
             * Create a new SystemBlock
             * @param name defines the block name
             */
            constructor(name) {
                super(name);
                /**
                 * Gets or sets the blend mode for the particle system
                 */
                this.blendMode = __runInitializers(this, _blendMode_initializers, BaseParticleSystem.BLENDMODE_ONEONE);
                /**
                 * Gets or sets the epsilon value used for comparison
                 */
                this.capacity = (__runInitializers(this, _blendMode_extraInitializers), __runInitializers(this, _capacity_initializers, 1000));
                /**
                 * Gets or sets the manual emit count
                 */
                this.manualEmitCount = (__runInitializers(this, _capacity_extraInitializers), __runInitializers(this, _manualEmitCount_initializers, -1));
                /**
                 * Gets or sets the target stop duration for the particle system
                 */
                this.startDelay = (__runInitializers(this, _manualEmitCount_extraInitializers), __runInitializers(this, _startDelay_initializers, 0));
                /**
                 * Gets or sets the target stop duration for the particle system
                 */
                this.updateSpeed = (__runInitializers(this, _startDelay_extraInitializers), __runInitializers(this, _updateSpeed_initializers, 0.0167));
                /**
                 * Gets or sets the number of pre-warm cycles before rendering the particle system
                 */
                this.preWarmCycles = (__runInitializers(this, _updateSpeed_extraInitializers), __runInitializers(this, _preWarmCycles_initializers, 0));
                /**
                 * Gets or sets the time step multiplier used for pre-warm
                 */
                this.preWarmStepOffset = (__runInitializers(this, _preWarmCycles_extraInitializers), __runInitializers(this, _preWarmStepOffset_initializers, 0));
                /**
                 * Gets or sets a boolean indicating if the system is billboard based
                 */
                this.isBillboardBased = (__runInitializers(this, _preWarmStepOffset_extraInitializers), __runInitializers(this, _isBillboardBased_initializers, true));
                /**
                 * Gets or sets the billboard mode for the particle system
                 */
                this.billBoardMode = (__runInitializers(this, _isBillboardBased_extraInitializers), __runInitializers(this, _billBoardMode_initializers, 7));
                /**
                 * Gets or sets a boolean indicating if the system coordinate space is local or global
                 */
                this.isLocal = (__runInitializers(this, _billBoardMode_extraInitializers), __runInitializers(this, _isLocal_initializers, false));
                /**
                 * Gets or sets a boolean indicating if the system should be disposed when stopped
                 */
                this.disposeOnStop = (__runInitializers(this, _isLocal_extraInitializers), __runInitializers(this, _disposeOnStop_initializers, false));
                /**
                 * Gets or sets a boolean indicating if the system should not start automatically
                 */
                this.doNoStart = (__runInitializers(this, _disposeOnStop_extraInitializers), __runInitializers(this, _doNoStart_initializers, false));
                /**
                 * Gets or sets the rendering group id for the particle system (0 by default)
                 */
                this.renderingGroupId = (__runInitializers(this, _doNoStart_extraInitializers), __runInitializers(this, _renderingGroupId_initializers, 0));
                /** @internal */
                this._internalId = (__runInitializers(this, _renderingGroupId_extraInitializers), _a._IdCounter++);
                /**
                 * Gets or sets the custom shader configuration used to render the particles.
                 * This can be used to set your own shader to render the particle system.
                 */
                this.customShader = null;
                /**
                 * Gets or sets the emitter for the particle system.
                 */
                this.emitter = Vector3.Zero();
                this._isSystem = true;
                this.registerInput("particle", NodeParticleBlockConnectionPointTypes.Particle);
                this.registerInput("emitRate", NodeParticleBlockConnectionPointTypes.Int, true, 10, 0);
                this.registerInput("texture", NodeParticleBlockConnectionPointTypes.Texture);
                this.registerInput("translationPivot", NodeParticleBlockConnectionPointTypes.Vector2, true);
                this.registerInput("textureMask", NodeParticleBlockConnectionPointTypes.Color4, true);
                this.registerInput("targetStopDuration", NodeParticleBlockConnectionPointTypes.Float, true, 0, 0);
                this.registerInput("onStart", NodeParticleBlockConnectionPointTypes.System, true);
                this.registerInput("onEnd", NodeParticleBlockConnectionPointTypes.System, true);
                this.registerOutput("system", NodeParticleBlockConnectionPointTypes.System);
            }
            /**
             * Gets the current class name
             * @returns the class name
             */
            getClassName() {
                return "SystemBlock";
            }
            /**
             * Gets the particle input component
             */
            get particle() {
                return this._inputs[0];
            }
            /**
             * Gets the emitRate input component
             */
            get emitRate() {
                return this._inputs[1];
            }
            /**
             * Gets the texture input component
             */
            get texture() {
                return this._inputs[2];
            }
            /**
             * Gets the translationPivot input component
             */
            get translationPivot() {
                return this._inputs[3];
            }
            /**
             * Gets the textureMask input component
             */
            get textureMask() {
                return this._inputs[4];
            }
            /**
             * Gets the targetStopDuration input component
             */
            get targetStopDuration() {
                return this._inputs[5];
            }
            /**
             * Gets the onStart input component
             */
            get onStart() {
                return this._inputs[6];
            }
            /**
             * Gets the onEnd input component
             */
            get onEnd() {
                return this._inputs[7];
            }
            /**
             * Gets the system output component
             */
            get system() {
                return this._outputs[0];
            }
            /**
             * Builds the block and return a functional particle system
             * @param state defines the building state
             * @returns the built particle system
             */
            createSystem(state) {
                state.capacity = this.capacity;
                state.buildId = this._buildId++;
                this.build(state);
                const particleSystem = this.particle.getConnectedValue(state);
                particleSystem.particleTexture = this.texture.getConnectedValue(state);
                particleSystem.emitRate = this.emitRate.getConnectedValue(state);
                particleSystem.manualEmitCount = this.manualEmitCount;
                particleSystem.updateSpeed = this.updateSpeed;
                particleSystem.preWarmCycles = this.preWarmCycles;
                particleSystem.preWarmStepOffset = this.preWarmStepOffset;
                particleSystem.blendMode = this.blendMode;
                particleSystem.name = this.name;
                particleSystem._targetStopDuration = this.targetStopDuration.getConnectedValue(state) ?? 0;
                particleSystem.startDelay = this.startDelay;
                particleSystem.isBillboardBased = this.isBillboardBased;
                particleSystem.billboardMode = this.billBoardMode;
                particleSystem.translationPivot = this.translationPivot.getConnectedValue(state) || Vector2.Zero();
                particleSystem.textureMask = this.textureMask.getConnectedValue(state) ?? new Color4(1, 1, 1, 1);
                particleSystem.isLocal = this.isLocal;
                particleSystem.disposeOnStop = this.disposeOnStop;
                particleSystem.renderingGroupId = this.renderingGroupId;
                if (this.emitter) {
                    particleSystem.emitter = this.emitter;
                }
                // Apply custom shader if defined
                if (this.customShader) {
                    const engine = particleSystem.getScene()?.getEngine();
                    if (engine && _IsSideEffectImplemented(engine.createEffectForParticles)) {
                        const defines = this.customShader.shaderOptions.defines.length > 0 ? this.customShader.shaderOptions.defines.join("\n") : "";
                        const effect = engine.createEffectForParticles(this.customShader.shaderPath.fragmentElement, this.customShader.shaderOptions.uniforms, this.customShader.shaderOptions.samplers, defines);
                        particleSystem.setCustomEffect(effect, 0);
                        particleSystem.customShader = this.customShader;
                    }
                }
                // The emit rate can vary if it is connected to another block like a gradient
                particleSystem._calculateEmitRate = () => {
                    state.systemContext = particleSystem;
                    return this.emitRate.getConnectedValue(state);
                };
                this.system._storedValue = this;
                particleSystem.canStart = () => {
                    return !this.doNoStart;
                };
                particleSystem.onStartedObservable.add((system) => {
                    // Triggers
                    const onStartSystem = this.onStart.getConnectedValue(state);
                    if (onStartSystem) {
                        system.onStartedObservable.addOnce(() => {
                            state.systemContext = particleSystem;
                            const clone = _TriggerSubEmitter(onStartSystem, state.scene, state.emitterPosition);
                            this.onDisposeObservable.addOnce(() => {
                                // Clean up the cloned system when the original system is disposed
                                clone.dispose();
                            });
                        });
                    }
                    const onEndSystem = this.onEnd.getConnectedValue(state);
                    if (onEndSystem) {
                        system.onStoppedObservable.addOnce(() => {
                            state.systemContext = particleSystem;
                            const clone = _TriggerSubEmitter(onEndSystem, state.scene, state.emitterPosition);
                            this.onDisposeObservable.addOnce(() => {
                                // Clean up the cloned system when the original system is disposed
                                clone.dispose();
                            });
                        });
                    }
                });
                this.onDisposeObservable.addOnce(() => {
                    particleSystem.dispose();
                });
                // Return
                return particleSystem;
            }
            /**
             * Serializes the system block
             * @returns The serialized object
             */
            serialize() {
                const serializationObject = super.serialize();
                serializationObject.capacity = this.capacity;
                serializationObject.manualEmitCount = this.manualEmitCount;
                serializationObject.blendMode = this.blendMode;
                serializationObject.updateSpeed = this.updateSpeed;
                serializationObject.preWarmCycles = this.preWarmCycles;
                serializationObject.preWarmStepOffset = this.preWarmStepOffset;
                serializationObject.isBillboardBased = this.isBillboardBased;
                serializationObject.billBoardMode = this.billBoardMode;
                serializationObject.isLocal = this.isLocal;
                serializationObject.disposeOnStop = this.disposeOnStop;
                serializationObject.doNoStart = this.doNoStart;
                serializationObject.renderingGroupId = this.renderingGroupId;
                serializationObject.startDelay = this.startDelay;
                serializationObject.customShader = this.customShader;
                return serializationObject;
            }
            /**
             * Deserializes the system block
             * @param serializationObject The serialized system
             */
            _deserialize(serializationObject) {
                super._deserialize(serializationObject);
                this.capacity = serializationObject.capacity;
                this.manualEmitCount = serializationObject.manualEmitCount ?? -1;
                this.updateSpeed = serializationObject.updateSpeed ?? 0.0167;
                this.preWarmCycles = serializationObject.preWarmCycles ?? 0;
                this.preWarmStepOffset = serializationObject.preWarmStepOffset ?? 0;
                this.isBillboardBased = serializationObject.isBillboardBased ?? true;
                this.billBoardMode = serializationObject.billBoardMode ?? 7;
                this.isLocal = serializationObject.isLocal ?? false;
                this.disposeOnStop = serializationObject.disposeOnStop ?? false;
                this.doNoStart = !!serializationObject.doNoStart;
                this.renderingGroupId = serializationObject.renderingGroupId ?? 0;
                if (serializationObject.emitRate !== undefined) {
                    this.emitRate.value = serializationObject.emitRate;
                }
                if (serializationObject.blendMode !== undefined) {
                    this.blendMode = serializationObject.blendMode;
                }
                if (serializationObject.startDelay !== undefined) {
                    this.startDelay = serializationObject.startDelay;
                }
                if (serializationObject.customShader !== undefined) {
                    this.customShader = serializationObject.customShader;
                }
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _blendMode_decorators = [editableInPropertyPage("Blend mode", 5 /* PropertyTypeForEdition.List */, "ADVANCED", {
                    notifiers: { rebuild: true },
                    embedded: true,
                    options: [
                        { label: "Blend Mode OneOne", value: BaseParticleSystem.BLENDMODE_ONEONE },
                        { label: "Blend Mode Standard", value: BaseParticleSystem.BLENDMODE_STANDARD },
                        { label: "Blend Mode Add", value: BaseParticleSystem.BLENDMODE_ADD },
                        { label: "Blend Mode Multiply", value: BaseParticleSystem.BLENDMODE_MULTIPLY },
                        { label: "Blend Mode MultiplyAdd", value: BaseParticleSystem.BLENDMODE_MULTIPLYADD },
                    ],
                })];
            _capacity_decorators = [editableInPropertyPage("Capacity", 2 /* PropertyTypeForEdition.Int */, "ADVANCED", { embedded: true, notifiers: { rebuild: true }, min: 0, max: 10000 })];
            _manualEmitCount_decorators = [editableInPropertyPage("Manual emit count", 2 /* PropertyTypeForEdition.Int */, "ADVANCED", { embedded: true, notifiers: { rebuild: true }, min: -1 })];
            _startDelay_decorators = [editableInPropertyPage("Delay start(ms)", 1 /* PropertyTypeForEdition.Float */, "ADVANCED", { embedded: true, notifiers: { rebuild: true }, min: 0 })];
            _updateSpeed_decorators = [editableInPropertyPage("updateSpeed", 1 /* PropertyTypeForEdition.Float */, "ADVANCED", { embedded: true, notifiers: { rebuild: true }, min: 0, max: 0.1 })];
            _preWarmCycles_decorators = [editableInPropertyPage("Pre-warm cycles", 1 /* PropertyTypeForEdition.Float */, "ADVANCED", { embedded: true, notifiers: { rebuild: true }, min: 0 })];
            _preWarmStepOffset_decorators = [editableInPropertyPage("Pre-warm step multiplier", 1 /* PropertyTypeForEdition.Float */, "ADVANCED", { embedded: true, notifiers: { rebuild: true }, min: 0 })];
            _isBillboardBased_decorators = [editableInPropertyPage("Is billboard based", 0 /* PropertyTypeForEdition.Boolean */, "ADVANCED", { embedded: true, notifiers: { rebuild: true } })];
            _billBoardMode_decorators = [editableInPropertyPage("Billboard mode", 5 /* PropertyTypeForEdition.List */, "ADVANCED", {
                    notifiers: { rebuild: true },
                    embedded: true,
                    options: [
                        { label: "Billboard Mode All", value: 7 },
                        { label: "Billboard Mode Y", value: 2 },
                        { label: "Billboard Mode Stretched", value: 8 },
                        { label: "Billboard Mode Stretched Local", value: 9 },
                    ],
                })];
            _isLocal_decorators = [editableInPropertyPage("Is local", 0 /* PropertyTypeForEdition.Boolean */, "ADVANCED", { embedded: true, notifiers: { rebuild: true } })];
            _disposeOnStop_decorators = [editableInPropertyPage("Dispose on stop", 0 /* PropertyTypeForEdition.Boolean */, "ADVANCED", { embedded: true, notifiers: { rebuild: true } })];
            _doNoStart_decorators = [editableInPropertyPage("Do no start", 0 /* PropertyTypeForEdition.Boolean */, "ADVANCED", { embedded: true, notifiers: { rebuild: true } })];
            _renderingGroupId_decorators = [editableInPropertyPage("Rendering group id", 2 /* PropertyTypeForEdition.Int */, "ADVANCED", { embedded: true, notifiers: { rebuild: true }, min: 0 })];
            __esDecorate(null, null, _blendMode_decorators, { kind: "field", name: "blendMode", static: false, private: false, access: { has: obj => "blendMode" in obj, get: obj => obj.blendMode, set: (obj, value) => { obj.blendMode = value; } }, metadata: _metadata }, _blendMode_initializers, _blendMode_extraInitializers);
            __esDecorate(null, null, _capacity_decorators, { kind: "field", name: "capacity", static: false, private: false, access: { has: obj => "capacity" in obj, get: obj => obj.capacity, set: (obj, value) => { obj.capacity = value; } }, metadata: _metadata }, _capacity_initializers, _capacity_extraInitializers);
            __esDecorate(null, null, _manualEmitCount_decorators, { kind: "field", name: "manualEmitCount", static: false, private: false, access: { has: obj => "manualEmitCount" in obj, get: obj => obj.manualEmitCount, set: (obj, value) => { obj.manualEmitCount = value; } }, metadata: _metadata }, _manualEmitCount_initializers, _manualEmitCount_extraInitializers);
            __esDecorate(null, null, _startDelay_decorators, { kind: "field", name: "startDelay", static: false, private: false, access: { has: obj => "startDelay" in obj, get: obj => obj.startDelay, set: (obj, value) => { obj.startDelay = value; } }, metadata: _metadata }, _startDelay_initializers, _startDelay_extraInitializers);
            __esDecorate(null, null, _updateSpeed_decorators, { kind: "field", name: "updateSpeed", static: false, private: false, access: { has: obj => "updateSpeed" in obj, get: obj => obj.updateSpeed, set: (obj, value) => { obj.updateSpeed = value; } }, metadata: _metadata }, _updateSpeed_initializers, _updateSpeed_extraInitializers);
            __esDecorate(null, null, _preWarmCycles_decorators, { kind: "field", name: "preWarmCycles", static: false, private: false, access: { has: obj => "preWarmCycles" in obj, get: obj => obj.preWarmCycles, set: (obj, value) => { obj.preWarmCycles = value; } }, metadata: _metadata }, _preWarmCycles_initializers, _preWarmCycles_extraInitializers);
            __esDecorate(null, null, _preWarmStepOffset_decorators, { kind: "field", name: "preWarmStepOffset", static: false, private: false, access: { has: obj => "preWarmStepOffset" in obj, get: obj => obj.preWarmStepOffset, set: (obj, value) => { obj.preWarmStepOffset = value; } }, metadata: _metadata }, _preWarmStepOffset_initializers, _preWarmStepOffset_extraInitializers);
            __esDecorate(null, null, _isBillboardBased_decorators, { kind: "field", name: "isBillboardBased", static: false, private: false, access: { has: obj => "isBillboardBased" in obj, get: obj => obj.isBillboardBased, set: (obj, value) => { obj.isBillboardBased = value; } }, metadata: _metadata }, _isBillboardBased_initializers, _isBillboardBased_extraInitializers);
            __esDecorate(null, null, _billBoardMode_decorators, { kind: "field", name: "billBoardMode", static: false, private: false, access: { has: obj => "billBoardMode" in obj, get: obj => obj.billBoardMode, set: (obj, value) => { obj.billBoardMode = value; } }, metadata: _metadata }, _billBoardMode_initializers, _billBoardMode_extraInitializers);
            __esDecorate(null, null, _isLocal_decorators, { kind: "field", name: "isLocal", static: false, private: false, access: { has: obj => "isLocal" in obj, get: obj => obj.isLocal, set: (obj, value) => { obj.isLocal = value; } }, metadata: _metadata }, _isLocal_initializers, _isLocal_extraInitializers);
            __esDecorate(null, null, _disposeOnStop_decorators, { kind: "field", name: "disposeOnStop", static: false, private: false, access: { has: obj => "disposeOnStop" in obj, get: obj => obj.disposeOnStop, set: (obj, value) => { obj.disposeOnStop = value; } }, metadata: _metadata }, _disposeOnStop_initializers, _disposeOnStop_extraInitializers);
            __esDecorate(null, null, _doNoStart_decorators, { kind: "field", name: "doNoStart", static: false, private: false, access: { has: obj => "doNoStart" in obj, get: obj => obj.doNoStart, set: (obj, value) => { obj.doNoStart = value; } }, metadata: _metadata }, _doNoStart_initializers, _doNoStart_extraInitializers);
            __esDecorate(null, null, _renderingGroupId_decorators, { kind: "field", name: "renderingGroupId", static: false, private: false, access: { has: obj => "renderingGroupId" in obj, get: obj => obj.renderingGroupId, set: (obj, value) => { obj.renderingGroupId = value; } }, metadata: _metadata }, _renderingGroupId_initializers, _renderingGroupId_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a._IdCounter = 0,
        _a;
})();
export { SystemBlock };
let _Registered = false;
/**
 * Register side effects for systemBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterSystemBlock() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    RegisterClass("BABYLON.SystemBlock", SystemBlock);
}
//# sourceMappingURL=systemBlock.pure.js.map