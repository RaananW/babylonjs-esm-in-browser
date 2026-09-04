/** This file must only contain pure code and pure imports */
import { __esDecorate, __runInitializers } from "../../../tslib.es6.js";
import { editableInPropertyPage } from "../../../Decorators/nodeDecorator.js";
import { NodeParticleBlockConnectionPointTypes } from "../Enums/nodeParticleBlockConnectionPointTypes.js";
import { NodeParticleBlock } from "../nodeParticleBlock.js";
import { RegisterClass } from "../../../Misc/typeStore.js";
export var ParticleLocalVariableBlockScope;
(function (ParticleLocalVariableBlockScope) {
    ParticleLocalVariableBlockScope[ParticleLocalVariableBlockScope["Particle"] = 0] = "Particle";
    ParticleLocalVariableBlockScope[ParticleLocalVariableBlockScope["Loop"] = 1] = "Loop";
})(ParticleLocalVariableBlockScope || (ParticleLocalVariableBlockScope = {}));
/**
 * Defines a block used to store local values
 * #A1OS53#5
 */
let ParticleLocalVariableBlock = (() => {
    var _a;
    let _classSuper = NodeParticleBlock;
    let _scope_decorators;
    let _scope_initializers = [];
    let _scope_extraInitializers = [];
    return _a = class ParticleLocalVariableBlock extends _classSuper {
            /**
             * Create a new ParticleLocalVariableBlock
             * @param name defines the block name
             */
            constructor(name) {
                super(name);
                /**
                 * Gets or sets the scope used by the block
                 */
                this.scope = __runInitializers(this, _scope_initializers, ParticleLocalVariableBlockScope.Particle);
                this._storage = (__runInitializers(this, _scope_extraInitializers), new Map());
                this._isDebug = true;
                this.registerInput("input", NodeParticleBlockConnectionPointTypes.AutoDetect);
                this.registerOutput("output", NodeParticleBlockConnectionPointTypes.BasedOnInput);
                this._outputs[0]._typeConnectionSource = this._inputs[0];
                this._inputs[0].excludedConnectionPointTypes.push(NodeParticleBlockConnectionPointTypes.FloatGradient);
                this._inputs[0].excludedConnectionPointTypes.push(NodeParticleBlockConnectionPointTypes.Vector2Gradient);
                this._inputs[0].excludedConnectionPointTypes.push(NodeParticleBlockConnectionPointTypes.Vector3Gradient);
                this._inputs[0].excludedConnectionPointTypes.push(NodeParticleBlockConnectionPointTypes.Color4Gradient);
                this._inputs[0].excludedConnectionPointTypes.push(NodeParticleBlockConnectionPointTypes.System);
                this._inputs[0].excludedConnectionPointTypes.push(NodeParticleBlockConnectionPointTypes.Particle);
                this._inputs[0].excludedConnectionPointTypes.push(NodeParticleBlockConnectionPointTypes.Texture);
            }
            /**
             * Gets the current class name
             * @returns the class name
             */
            getClassName() {
                return "ParticleLocalVariableBlock";
            }
            /**
             * Gets the input component
             */
            get input() {
                return this._inputs[0];
            }
            /**
             * Gets the output component
             */
            get output() {
                return this._outputs[0];
            }
            _build(state) {
                if (!this.input.isConnected) {
                    this.output._storedFunction = null;
                    this.output._storedValue = null;
                    return;
                }
                const func = (state) => {
                    if (!state.particleContext && !state.systemContext) {
                        this._storage.clear();
                        return null;
                    }
                    const id = (this.scope === ParticleLocalVariableBlockScope.Particle ? state.particleContext?.id : state.systemContext?.getScene().getFrameId()) || -1;
                    if (!this._storage.has(id)) {
                        let value = this.input.getConnectedValue(state);
                        if (value.clone) {
                            value = value.clone(); // We clone to snapshot the value at this moment
                        }
                        this._storage.set(id, value);
                        if (this.scope === ParticleLocalVariableBlockScope.Particle) {
                            state.particleContext._properties.onReset = () => {
                                this._storage.delete(id);
                                state.particleContext._properties.onReset = null;
                            };
                        }
                        state.systemContext.onDisposeObservable.addOnce(() => {
                            this._storage.clear();
                        });
                    }
                    return this._storage.get(id);
                };
                if (this.output.isConnected) {
                    this.output._storedFunction = func;
                }
                else {
                    this.output._storedValue = func(state);
                }
            }
            serialize() {
                const serializationObject = super.serialize();
                serializationObject.scope = this.scope;
                return serializationObject;
            }
            _deserialize(serializationObject) {
                super._deserialize(serializationObject);
                this.scope = serializationObject.scope;
            }
            dispose() {
                this._storage.clear();
                super.dispose();
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _scope_decorators = [editableInPropertyPage("Scope", 5 /* PropertyTypeForEdition.List */, "ADVANCED", {
                    embedded: true,
                    notifiers: { rebuild: true },
                    options: [
                        { label: "Particle", value: ParticleLocalVariableBlockScope.Particle },
                        { label: "Loop", value: ParticleLocalVariableBlockScope.Loop },
                    ],
                })];
            __esDecorate(null, null, _scope_decorators, { kind: "field", name: "scope", static: false, private: false, access: { has: obj => "scope" in obj, get: obj => obj.scope, set: (obj, value) => { obj.scope = value; } }, metadata: _metadata }, _scope_initializers, _scope_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
export { ParticleLocalVariableBlock };
let _Registered = false;
/**
 * Register side effects for particleLocalVariableBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterParticleLocalVariableBlock() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    RegisterClass("BABYLON.ParticleLocalVariableBlock", ParticleLocalVariableBlock);
}
//# sourceMappingURL=particleLocalVariableBlock.pure.js.map