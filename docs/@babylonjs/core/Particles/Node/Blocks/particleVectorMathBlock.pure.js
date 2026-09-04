/** This file must only contain pure code and pure imports */
import { __esDecorate, __runInitializers } from "../../../tslib.es6.js";
import { NodeParticleBlock } from "../nodeParticleBlock.js";
import { NodeParticleBlockConnectionPointTypes } from "../Enums/nodeParticleBlockConnectionPointTypes.js";
import { editableInPropertyPage } from "../../../Decorators/nodeDecorator.js";
import { Vector3 } from "../../../Maths/math.vector.pure.js";
import { RegisterClass } from "../../../Misc/typeStore.js";
/**
 * Operations supported by the Vector Math block
 */
export var ParticleVectorMathBlockOperations;
(function (ParticleVectorMathBlockOperations) {
    /** Dot product */
    ParticleVectorMathBlockOperations[ParticleVectorMathBlockOperations["Dot"] = 0] = "Dot";
    /** Distance between two vectors */
    ParticleVectorMathBlockOperations[ParticleVectorMathBlockOperations["Distance"] = 1] = "Distance";
})(ParticleVectorMathBlockOperations || (ParticleVectorMathBlockOperations = {}));
/**
 * Block used to apply math operations that only apply to vectors
 */
let ParticleVectorMathBlock = (() => {
    var _a;
    let _classSuper = NodeParticleBlock;
    let _operation_decorators;
    let _operation_initializers = [];
    let _operation_extraInitializers = [];
    return _a = class ParticleVectorMathBlock extends _classSuper {
            /**
             * Create a new ParticleVectorMathBlock
             * @param name defines the block name
             */
            constructor(name) {
                super(name);
                /**
                 * Gets or sets the operation applied by the block
                 */
                this.operation = __runInitializers(this, _operation_initializers, ParticleVectorMathBlockOperations.Dot);
                __runInitializers(this, _operation_extraInitializers);
                this.registerInput("left", NodeParticleBlockConnectionPointTypes.Vector3);
                this.registerInput("right", NodeParticleBlockConnectionPointTypes.Vector3);
                this.registerOutput("output", NodeParticleBlockConnectionPointTypes.Float);
            }
            /**
             * Gets the current class name
             * @returns the class name
             */
            getClassName() {
                return "ParticleVectorMathBlock";
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
                    case ParticleVectorMathBlockOperations.Dot: {
                        func = (state) => {
                            return Vector3.Dot(left.getConnectedValue(state), right.getConnectedValue(state));
                        };
                        break;
                    }
                    case ParticleVectorMathBlockOperations.Distance: {
                        func = (state) => {
                            return Vector3.Distance(left.getConnectedValue(state), right.getConnectedValue(state));
                        };
                        break;
                    }
                }
                this.output._storedFunction = (state) => {
                    return func(state);
                };
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
                        { label: "Dot", value: ParticleVectorMathBlockOperations.Dot },
                        { label: "Distance", value: ParticleVectorMathBlockOperations.Distance },
                    ],
                })];
            __esDecorate(null, null, _operation_decorators, { kind: "field", name: "operation", static: false, private: false, access: { has: obj => "operation" in obj, get: obj => obj.operation, set: (obj, value) => { obj.operation = value; } }, metadata: _metadata }, _operation_initializers, _operation_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
export { ParticleVectorMathBlock };
let _Registered = false;
/**
 * Register side effects for particleVectorMathBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterParticleVectorMathBlock() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    RegisterClass("BABYLON.ParticleVectorMathBlock", ParticleVectorMathBlock);
}
//# sourceMappingURL=particleVectorMathBlock.pure.js.map