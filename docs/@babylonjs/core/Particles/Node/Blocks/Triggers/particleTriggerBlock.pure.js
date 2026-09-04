/** This file must only contain pure code and pure imports */
import { __esDecorate, __runInitializers } from "../../../../tslib.es6.js";
import { NodeParticleBlock } from "../../nodeParticleBlock.js";
import { NodeParticleBlockConnectionPointTypes } from "../../Enums/nodeParticleBlockConnectionPointTypes.js";
import { _ConnectAtTheEnd } from "../../../Queue/executionQueue.js";
import { editableInPropertyPage } from "../../../../Decorators/nodeDecorator.js";
import { _TriggerSubEmitter } from "./triggerTools.js";
import { RegisterClass } from "../../../../Misc/typeStore.js";
/**
 * Block used to trigger a particle system based on a condition.
 */
let ParticleTriggerBlock = (() => {
    var _a;
    let _classSuper = NodeParticleBlock;
    let _limit_decorators;
    let _limit_initializers = [];
    let _limit_extraInitializers = [];
    let _delay_decorators;
    let _delay_initializers = [];
    let _delay_extraInitializers = [];
    return _a = class ParticleTriggerBlock extends _classSuper {
            /**
             * Create a new ParticleTriggerBlock
             * @param name defines the block name
             */
            constructor(name) {
                super(name);
                this._triggerCount = 0;
                /**
                 * Gets or sets the emit rate
                 */
                this.limit = __runInitializers(this, _limit_initializers, 5);
                /**
                 * Gets or sets the emit rate
                 */
                this.delay = (__runInitializers(this, _limit_extraInitializers), __runInitializers(this, _delay_initializers, 250));
                this._previousOne = (__runInitializers(this, _delay_extraInitializers), null);
                this.registerInput("input", NodeParticleBlockConnectionPointTypes.Particle);
                this.registerInput("condition", NodeParticleBlockConnectionPointTypes.Float, true, 0);
                this.registerInput("system", NodeParticleBlockConnectionPointTypes.System);
                this.registerOutput("output", NodeParticleBlockConnectionPointTypes.Particle);
            }
            /**
             * Gets the current class name
             * @returns the class name
             */
            getClassName() {
                return "ParticleTriggerBlock";
            }
            /**
             * Gets the input component
             */
            get input() {
                return this._inputs[0];
            }
            /**
             * Gets the condition input component
             */
            get condition() {
                return this._inputs[1];
            }
            /**
             * Gets the target system input component
             */
            get system() {
                return this._inputs[2];
            }
            /**
             * Gets the output component
             */
            get output() {
                return this._outputs[0];
            }
            _build(state) {
                this._triggerCount = 0;
                const system = this.input.getConnectedValue(state);
                const processCondition = (particle) => {
                    state.particleContext = particle;
                    state.systemContext = system;
                    if (this.condition.getConnectedValue(state) !== 0) {
                        if (this.limit === 0 || this._triggerCount < this.limit) {
                            const now = new Date().getTime();
                            if (this._previousOne && now - this._previousOne < this.delay) {
                                return; // Skip if the delay has not passed
                            }
                            this._triggerCount++;
                            this._previousOne = now;
                            // Trigger the target particle system
                            const targetSystem = this.system.getConnectedValue(state);
                            if (targetSystem) {
                                const clone = _TriggerSubEmitter(targetSystem, state.scene, particle.position);
                                clone.onDisposeObservable.addOnce(() => {
                                    this._triggerCount--;
                                });
                                system.onDisposeObservable.addOnce(() => {
                                    // Clean up the cloned system when the original system is disposed
                                    clone.dispose();
                                });
                            }
                        }
                    }
                };
                const conditionProcessing = {
                    process: processCondition,
                    previousItem: null,
                    nextItem: null,
                };
                if (system._updateQueueStart) {
                    _ConnectAtTheEnd(conditionProcessing, system._updateQueueStart);
                }
                else {
                    system._updateQueueStart = conditionProcessing;
                }
                this.output._storedValue = system;
            }
            serialize() {
                const serializationObject = super.serialize();
                serializationObject.limit = this.limit;
                serializationObject.delay = this.delay;
                return serializationObject;
            }
            _deserialize(serializationObject) {
                super._deserialize(serializationObject);
                if (serializationObject.limit !== undefined) {
                    this.limit = serializationObject.limit;
                }
                if (serializationObject.delay !== undefined) {
                    this.delay = serializationObject.delay;
                }
            }
            dispose() {
                super.dispose();
                this._triggerCount = 0;
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _limit_decorators = [editableInPropertyPage("Max simultaneous", 2 /* PropertyTypeForEdition.Int */, "ADVANCED", { embedded: true, notifiers: { rebuild: true }, min: 0 })];
            _delay_decorators = [editableInPropertyPage("Delay between calls (ms)", 2 /* PropertyTypeForEdition.Int */, "ADVANCED", { embedded: true, notifiers: { rebuild: true }, min: 0 })];
            __esDecorate(null, null, _limit_decorators, { kind: "field", name: "limit", static: false, private: false, access: { has: obj => "limit" in obj, get: obj => obj.limit, set: (obj, value) => { obj.limit = value; } }, metadata: _metadata }, _limit_initializers, _limit_extraInitializers);
            __esDecorate(null, null, _delay_decorators, { kind: "field", name: "delay", static: false, private: false, access: { has: obj => "delay" in obj, get: obj => obj.delay, set: (obj, value) => { obj.delay = value; } }, metadata: _metadata }, _delay_initializers, _delay_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
export { ParticleTriggerBlock };
let _Registered = false;
/**
 * Register side effects for particleTriggerBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterParticleTriggerBlock() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    RegisterClass("BABYLON.ParticleTriggerBlock", ParticleTriggerBlock);
}
//# sourceMappingURL=particleTriggerBlock.pure.js.map