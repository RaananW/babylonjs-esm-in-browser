/** This file must only contain pure code and pure imports */
import { __esDecorate, __runInitializers } from "../../../tslib.es6.js";
import { Vector2, Vector3 } from "../../../Maths/math.vector.pure.js";
import { editableInPropertyPage } from "../../../Decorators/nodeDecorator.js";
import { NodeParticleBlock } from "../nodeParticleBlock.js";
import { NodeParticleBlockConnectionPointTypes } from "../Enums/nodeParticleBlockConnectionPointTypes.js";
import { Color4 } from "../../../Maths/math.color.pure.js";
import { RegisterClass } from "../../../Misc/typeStore.js";
/**
 * Operations supported by the Math block
 */
export var ParticleMathBlockOperations;
(function (ParticleMathBlockOperations) {
    /** Add */
    ParticleMathBlockOperations[ParticleMathBlockOperations["Add"] = 0] = "Add";
    /** Subtract */
    ParticleMathBlockOperations[ParticleMathBlockOperations["Subtract"] = 1] = "Subtract";
    /** Multiply */
    ParticleMathBlockOperations[ParticleMathBlockOperations["Multiply"] = 2] = "Multiply";
    /** Divide */
    ParticleMathBlockOperations[ParticleMathBlockOperations["Divide"] = 3] = "Divide";
    /** Max */
    ParticleMathBlockOperations[ParticleMathBlockOperations["Max"] = 4] = "Max";
    /** Min */
    ParticleMathBlockOperations[ParticleMathBlockOperations["Min"] = 5] = "Min";
})(ParticleMathBlockOperations || (ParticleMathBlockOperations = {}));
/**
 * Block used to apply math functions
 */
let ParticleMathBlock = (() => {
    var _a;
    let _classSuper = NodeParticleBlock;
    let _operation_decorators;
    let _operation_initializers = [];
    let _operation_extraInitializers = [];
    return _a = class ParticleMathBlock extends _classSuper {
            /**
             * Create a new ParticleMathBlock
             * @param name defines the block name
             */
            constructor(name) {
                super(name);
                /**
                 * Gets or sets the operation applied by the block
                 */
                this.operation = __runInitializers(this, _operation_initializers, ParticleMathBlockOperations.Add);
                this._connectionObservers = __runInitializers(this, _operation_extraInitializers);
                this.registerInput("left", NodeParticleBlockConnectionPointTypes.AutoDetect);
                this.registerInput("right", NodeParticleBlockConnectionPointTypes.AutoDetect);
                this.registerOutput("output", NodeParticleBlockConnectionPointTypes.BasedOnInput);
                this.output._typeConnectionSource = this.left;
                const excludedConnectionPointTypes = [
                    NodeParticleBlockConnectionPointTypes.Matrix,
                    NodeParticleBlockConnectionPointTypes.Particle,
                    NodeParticleBlockConnectionPointTypes.Texture,
                    NodeParticleBlockConnectionPointTypes.System,
                    NodeParticleBlockConnectionPointTypes.FloatGradient,
                    NodeParticleBlockConnectionPointTypes.Color4Gradient,
                    NodeParticleBlockConnectionPointTypes.Vector2Gradient,
                    NodeParticleBlockConnectionPointTypes.Vector3Gradient,
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
                return "ParticleMathBlock";
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
                const leftIsScalar = left.type === NodeParticleBlockConnectionPointTypes.Float || left.type === NodeParticleBlockConnectionPointTypes.Int;
                const rightIsScalar = right.type === NodeParticleBlockConnectionPointTypes.Float || right.type === NodeParticleBlockConnectionPointTypes.Int;
                // If both input types are scalars, then this is a scalar operation.
                const isScalar = leftIsScalar && rightIsScalar;
                switch (this.operation) {
                    case ParticleMathBlockOperations.Add: {
                        if (isScalar) {
                            func = (state) => {
                                return left.getConnectedValue(state) + right.getConnectedValue(state);
                            };
                        }
                        else if (leftIsScalar) {
                            func = (state) => {
                                return state.adapt(left, right.type).add(right.getConnectedValue(state));
                            };
                        }
                        else {
                            func = (state) => {
                                return left.getConnectedValue(state).add(state.adapt(right, left.type));
                            };
                        }
                        break;
                    }
                    case ParticleMathBlockOperations.Subtract: {
                        if (isScalar) {
                            func = (state) => {
                                return left.getConnectedValue(state) - right.getConnectedValue(state);
                            };
                        }
                        else if (leftIsScalar) {
                            func = (state) => {
                                return state.adapt(left, right.type).subtract(right.getConnectedValue(state));
                            };
                        }
                        else {
                            func = (state) => {
                                return left.getConnectedValue(state).subtract(state.adapt(right, left.type));
                            };
                        }
                        break;
                    }
                    case ParticleMathBlockOperations.Multiply: {
                        if (isScalar) {
                            func = (state) => {
                                return left.getConnectedValue(state) * right.getConnectedValue(state);
                            };
                        }
                        else if (leftIsScalar) {
                            func = (state) => {
                                return state.adapt(left, right.type).multiply(right.getConnectedValue(state));
                            };
                        }
                        else {
                            func = (state) => {
                                return left.getConnectedValue(state).multiply(state.adapt(right, left.type));
                            };
                        }
                        break;
                    }
                    case ParticleMathBlockOperations.Divide: {
                        if (isScalar) {
                            func = (state) => {
                                return left.getConnectedValue(state) / right.getConnectedValue(state);
                            };
                        }
                        else if (leftIsScalar) {
                            func = (state) => {
                                return state.adapt(left, right.type).divide(right.getConnectedValue(state));
                            };
                        }
                        else {
                            func = (state) => {
                                return left.getConnectedValue(state).divide(state.adapt(right, left.type));
                            };
                        }
                        break;
                    }
                    case ParticleMathBlockOperations.Min: {
                        if (isScalar) {
                            func = (state) => {
                                return Math.min(left.getConnectedValue(state), right.getConnectedValue(state));
                            };
                        }
                        else {
                            const [vector, scalar] = leftIsScalar ? [right, left] : [left, right];
                            switch (vector.type) {
                                case NodeParticleBlockConnectionPointTypes.Vector2: {
                                    func = (state) => {
                                        return Vector2.Minimize(vector.getConnectedValue(state), state.adapt(scalar, vector.type));
                                    };
                                    break;
                                }
                                case NodeParticleBlockConnectionPointTypes.Vector3: {
                                    func = (state) => {
                                        return Vector3.Minimize(vector.getConnectedValue(state), state.adapt(scalar, vector.type));
                                    };
                                    break;
                                }
                                case NodeParticleBlockConnectionPointTypes.Color4: {
                                    func = (state) => {
                                        const other = vector.getConnectedValue(state);
                                        const { r, g, b, a } = state.adapt(scalar, vector.type);
                                        return new Color4(Math.min(other.r, r), Math.min(other.g, g), Math.min(other.b, b), Math.min(other.a, a));
                                    };
                                    break;
                                }
                            }
                        }
                        break;
                    }
                    case ParticleMathBlockOperations.Max: {
                        if (isScalar) {
                            func = (state) => {
                                return Math.max(left.getConnectedValue(state), right.getConnectedValue(state));
                            };
                        }
                        else {
                            const [vector, scalar] = leftIsScalar ? [right, left] : [left, right];
                            switch (vector.type) {
                                case NodeParticleBlockConnectionPointTypes.Vector2: {
                                    func = (state) => {
                                        return Vector2.Maximize(vector.getConnectedValue(state), state.adapt(scalar, vector.type));
                                    };
                                    break;
                                }
                                case NodeParticleBlockConnectionPointTypes.Vector3: {
                                    func = (state) => {
                                        return Vector3.Maximize(vector.getConnectedValue(state), state.adapt(scalar, vector.type));
                                    };
                                    break;
                                }
                                case NodeParticleBlockConnectionPointTypes.Color4: {
                                    func = (state) => {
                                        const other = vector.getConnectedValue(state);
                                        const { r, g, b, a } = state.adapt(scalar, vector.type);
                                        return new Color4(Math.max(other.r, r), Math.max(other.g, g), Math.max(other.b, b), Math.max(other.a, a));
                                    };
                                    break;
                                }
                            }
                            break;
                        }
                    }
                }
                this.output._storedFunction = (state) => {
                    if (left.type === NodeParticleBlockConnectionPointTypes.Int) {
                        return func(state) | 0;
                    }
                    return func(state);
                };
            }
            _updateInputOutputTypes() {
                // First update the output type with the initial assumption that we'll base it on the left input.
                this.output._typeConnectionSource = this.left;
                if (this.left.isConnected && this.right.isConnected) {
                    // Both inputs are connected, so we need to determine the output type based on the input types.
                    if (this.left.type === NodeParticleBlockConnectionPointTypes.Int ||
                        (this.left.type === NodeParticleBlockConnectionPointTypes.Float && this.right.type !== NodeParticleBlockConnectionPointTypes.Int)) {
                        this.output._typeConnectionSource = this.right;
                    }
                }
                else if (this.left.isConnected !== this.right.isConnected) {
                    // Only one input is connected, so we need to determine the output type based on the connected input.
                    this.output._typeConnectionSource = this.left.isConnected ? this.left : this.right;
                }
                // Next update the accepted connection point types for the inputs based on the current input connection state.
                if (this.left.isConnected || this.right.isConnected) {
                    for (const [first, second] of [
                        [this.left, this.right],
                        [this.right, this.left],
                    ]) {
                        // Always allow Ints and Floats.
                        first.acceptedConnectionPointTypes = [NodeParticleBlockConnectionPointTypes.Int, NodeParticleBlockConnectionPointTypes.Float];
                        if (second.isConnected) {
                            // The same types as the connected input are always allowed.
                            first.acceptedConnectionPointTypes.push(second.type);
                            // If the other input is a scalar, then we also allow Vector types.
                            if (second.type === NodeParticleBlockConnectionPointTypes.Int || second.type === NodeParticleBlockConnectionPointTypes.Float) {
                                first.acceptedConnectionPointTypes.push(NodeParticleBlockConnectionPointTypes.Vector2, NodeParticleBlockConnectionPointTypes.Vector3, NodeParticleBlockConnectionPointTypes.Color4);
                            }
                        }
                    }
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
                        { label: "Add", value: ParticleMathBlockOperations.Add },
                        { label: "Subtract", value: ParticleMathBlockOperations.Subtract },
                        { label: "Multiply", value: ParticleMathBlockOperations.Multiply },
                        { label: "Divide", value: ParticleMathBlockOperations.Divide },
                        { label: "Max", value: ParticleMathBlockOperations.Max },
                        { label: "Min", value: ParticleMathBlockOperations.Min },
                    ],
                })];
            __esDecorate(null, null, _operation_decorators, { kind: "field", name: "operation", static: false, private: false, access: { has: obj => "operation" in obj, get: obj => obj.operation, set: (obj, value) => { obj.operation = value; } }, metadata: _metadata }, _operation_initializers, _operation_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
export { ParticleMathBlock };
let _Registered = false;
/**
 * Register side effects for particleMathBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterParticleMathBlock() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    RegisterClass("BABYLON.ParticleMathBlock", ParticleMathBlock);
}
//# sourceMappingURL=particleMathBlock.pure.js.map