/** This file must only contain pure code and pure imports */
import { __esDecorate, __runInitializers } from "../../../tslib.es6.js";
import { editableInPropertyPage } from "../../../Decorators/nodeDecorator.js";
import { Vector2ToFixed, Vector3ToFixed } from "../../../Maths/math.vector.functions.js";
import { NodeParticleBlockConnectionPointTypes } from "../Enums/nodeParticleBlockConnectionPointTypes.js";
import { NodeParticleBlock } from "../nodeParticleBlock.js";
import { Observable } from "../../../Misc/observable.pure.js";
import { RegisterClass } from "../../../Misc/typeStore.js";
/**
 * Defines a block used to debug values going through it
 */
let ParticleDebugBlock = (() => {
    var _a;
    let _classSuper = NodeParticleBlock;
    let _stackSize_decorators;
    let _stackSize_initializers = [];
    let _stackSize_extraInitializers = [];
    return _a = class ParticleDebugBlock extends _classSuper {
            /**
             * Create a new ParticleDebugBlock
             * @param name defines the block name
             */
            constructor(name) {
                super(name);
                /**
                 * Gets the log entries
                 */
                this.log = [];
                /**
                 * Gets or sets the number of logs to keep
                 */
                this.stackSize = __runInitializers(this, _stackSize_initializers, 10);
                /**
                 * Observable raised when data is collected
                 */
                this.onDataCollectedObservable = (__runInitializers(this, _stackSize_extraInitializers), new Observable(undefined, true));
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
                return "ParticleDebugBlock";
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
                this.log = [];
                const func = (state) => {
                    const input = this.input.getConnectedValue(state);
                    if (this.log.length >= this.stackSize) {
                        return input;
                    }
                    if (input === null || input === undefined) {
                        this.log.push(["null", ""]);
                        return input;
                    }
                    switch (this.input.type) {
                        case NodeParticleBlockConnectionPointTypes.Vector2:
                            this.log.push([Vector2ToFixed(input, 4), input.toString()]);
                            break;
                        case NodeParticleBlockConnectionPointTypes.Vector3:
                            this.log.push([Vector3ToFixed(input, 4), input.toString()]);
                            break;
                        case NodeParticleBlockConnectionPointTypes.Color4:
                            this.log.push([`{R: ${input.r.toFixed(4)} G: ${input.g.toFixed(4)} B: ${input.b.toFixed(4)} A: ${input.a.toFixed(4)}}`, input.toString()]);
                            break;
                        default:
                            this.log.push([input.toString(), input.toString()]);
                            break;
                    }
                    this.onDataCollectedObservable.notifyObservers(this);
                    return input;
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
                serializationObject.stackSize = this.stackSize;
                return serializationObject;
            }
            _deserialize(serializationObject) {
                super._deserialize(serializationObject);
                this.stackSize = serializationObject.stackSize;
            }
            dispose() {
                this.onDataCollectedObservable.clear();
                super.dispose();
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _stackSize_decorators = [editableInPropertyPage("Reference", 2 /* PropertyTypeForEdition.Int */, "ADVANCED", { embedded: false, notifiers: { rebuild: true }, min: 1, max: 100 })];
            __esDecorate(null, null, _stackSize_decorators, { kind: "field", name: "stackSize", static: false, private: false, access: { has: obj => "stackSize" in obj, get: obj => obj.stackSize, set: (obj, value) => { obj.stackSize = value; } }, metadata: _metadata }, _stackSize_initializers, _stackSize_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
export { ParticleDebugBlock };
let _Registered = false;
/**
 * Register side effects for particleDebugBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterParticleDebugBlock() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    RegisterClass("BABYLON.ParticleDebugBlock", ParticleDebugBlock);
}
//# sourceMappingURL=particleDebugBlock.pure.js.map