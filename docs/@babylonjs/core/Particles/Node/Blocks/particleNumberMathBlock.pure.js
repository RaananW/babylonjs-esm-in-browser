/** This file must only contain pure code and pure imports */
import { __esDecorate, __runInitializers } from "../../../tslib.es6.js";
import { NodeParticleBlock } from "../nodeParticleBlock.js";
import { NodeParticleBlockConnectionPointTypes } from "../Enums/nodeParticleBlockConnectionPointTypes.js";
import { editableInPropertyPage } from "../../../Decorators/nodeDecorator.js";
import { RegisterClass } from "../../../Misc/typeStore.js";
/**
 * Operations supported by the Number Math block
 */
export var ParticleNumberMathBlockOperations;
(function (ParticleNumberMathBlockOperations) {
    /** Modulo */
    ParticleNumberMathBlockOperations[ParticleNumberMathBlockOperations["Modulo"] = 0] = "Modulo";
    /** Power */
    ParticleNumberMathBlockOperations[ParticleNumberMathBlockOperations["Pow"] = 1] = "Pow";
})(ParticleNumberMathBlockOperations || (ParticleNumberMathBlockOperations = {}));
/**
 * Block used to apply math operations that only appply to numbers (int/float)
 */
let ParticleNumberMathBlock = (() => {
    var _a;
    let _classSuper = NodeParticleBlock;
    let _operation_decorators;
    let _operation_initializers = [];
    let _operation_extraInitializers = [];
    return _a = class ParticleNumberMathBlock extends _classSuper {
            /**
             * Create a new ParticleNumberMathBlock
             * @param name defines the block name
             */
            constructor(name) {
                super(name);
                /**
                 * Gets or sets the operation applied by the block
                 */
                this.operation = __runInitializers(this, _operation_initializers, ParticleNumberMathBlockOperations.Modulo);
                this._connectionObservers = __runInitializers(this, _operation_extraInitializers);
                this.registerInput("left", NodeParticleBlockConnectionPointTypes.AutoDetect);
                this.registerInput("right", NodeParticleBlockConnectionPointTypes.AutoDetect);
                this.registerOutput("output", NodeParticleBlockConnectionPointTypes.BasedOnInput);
                this.output._typeConnectionSource = this.left;
                this.left.acceptedConnectionPointTypes.push(NodeParticleBlockConnectionPointTypes.Int);
                this.left.acceptedConnectionPointTypes.push(NodeParticleBlockConnectionPointTypes.Float);
                this.right.acceptedConnectionPointTypes.push(NodeParticleBlockConnectionPointTypes.Int);
                this.right.acceptedConnectionPointTypes.push(NodeParticleBlockConnectionPointTypes.Float);
                const excludedConnectionPointTypes = [
                    NodeParticleBlockConnectionPointTypes.Vector2,
                    NodeParticleBlockConnectionPointTypes.Vector3,
                    NodeParticleBlockConnectionPointTypes.Matrix,
                    NodeParticleBlockConnectionPointTypes.Particle,
                    NodeParticleBlockConnectionPointTypes.Texture,
                    NodeParticleBlockConnectionPointTypes.Color4,
                    NodeParticleBlockConnectionPointTypes.FloatGradient,
                    NodeParticleBlockConnectionPointTypes.Vector2Gradient,
                    NodeParticleBlockConnectionPointTypes.Vector3Gradient,
                    NodeParticleBlockConnectionPointTypes.Color4Gradient,
                    NodeParticleBlockConnectionPointTypes.System,
                    NodeParticleBlockConnectionPointTypes.Undefined,
                ];
                this.left.excludedConnectionPointTypes.push(...excludedConnectionPointTypes);
                this.right.excludedConnectionPointTypes.push(...excludedConnectionPointTypes);
                this._linkConnectionTypes(0, 1);
                this._connectionObservers = [
                    this.left.onConnectionObservable.add(() => this._updateInputOutputTypes()),
                    this.left.onDisconnectionObservable.add(() => this._updateInputOutputTypes()),
                    this.right.onConnectionObservable.add(() => this._updateInputOutputTypes()),
                    this.right.onDisconnectionObservable.add(() => this._updateInputOutputTypes()),
                ];
            }
            /**
             * Gets the current class name
             * @returns the class name
             */
            getClassName() {
                return "ParticleNumberMathBlock";
            }
            /**
             * Gets the left input component
             */
            get left() {
                return this._inputs[0];
            }
            /**
             * Gets the right input component
             */
            get right() {
                return this._inputs[1];
            }
            /**
             * Gets the geometry output component
             */
            get output() {
                return this._outputs[0];
            }
            _build(state) {
                let func;
                const left = this.left;
                const right = this.right;
                if (!left.isConnected || !right.isConnected) {
                    this.output._storedFunction = null;
                    this.output._storedValue = null;
                    return;
                }
                switch (this.operation) {
                    case ParticleNumberMathBlockOperations.Modulo: {
                        func = (state) => {
                            return left.getConnectedValue(state) % right.getConnectedValue(state);
                        };
                        break;
                    }
                    case ParticleNumberMathBlockOperations.Pow: {
                        func = (state) => {
                            return Math.pow(left.getConnectedValue(state), right.getConnectedValue(state));
                        };
                        break;
                    }
                }
                this.output._storedFunction = (state) => {
                    // We use the left type to determine if we need to cast to int
                    if (left.type === NodeParticleBlockConnectionPointTypes.Int) {
                        return func(state) | 0;
                    }
                    return func(state);
                };
            }
            _updateInputOutputTypes() {
                // First update the output type with the initial assumption that we'll base it on the left input.
                this.output._typeConnectionSource = this.left;
                // If left is not connected, then instead use the type of right if it's connected.
                if (!this.left.isConnected && this.right.isConnected) {
                    this.output._typeConnectionSource = this.right;
                }
            }
            /**
             * Release resources
             */
            dispose() {
                super.dispose();
                for (const observer of this._connectionObservers) {
                    observer.remove();
                }
                this._connectionObservers.length = 0;
            }
            /**
             * Serializes this block in a JSON representation
             * @returns the serialized block object
             */
            serialize() {
                const serializationObject = super.serialize();
                serializationObject.operation = this.operation;
                return serializationObject;
            }
            /**
             * Deserializes the block from a JSON object
             * @param serializationObject the JSON object to deserialize from
             */
            _deserialize(serializationObject) {
                super._deserialize(serializationObject);
                this.operation = serializationObject.operation;
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _operation_decorators = [editableInPropertyPage("Operation", 5 /* PropertyTypeForEdition.List */, "ADVANCED", {
                    notifiers: { rebuild: true },
                    embedded: true,
                    options: [
                        { label: "Modulo", value: ParticleNumberMathBlockOperations.Modulo },
                        { label: "Power", value: ParticleNumberMathBlockOperations.Pow },
                    ],
                })];
            __esDecorate(null, null, _operation_decorators, { kind: "field", name: "operation", static: false, private: false, access: { has: obj => "operation" in obj, get: obj => obj.operation, set: (obj, value) => { obj.operation = value; } }, metadata: _metadata }, _operation_initializers, _operation_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
export { ParticleNumberMathBlock };
let _Registered = false;
/**
 * Register side effects for particleNumberMathBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterParticleNumberMathBlock() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    RegisterClass("BABYLON.ParticleNumberMathBlock", ParticleNumberMathBlock);
}
//# sourceMappingURL=particleNumberMathBlock.pure.js.map