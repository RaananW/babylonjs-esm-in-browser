/** This file must only contain pure code and pure imports */
import { __esDecorate, __runInitializers } from "../../../tslib.es6.js";
import { NodeGeometryBlock } from "../nodeGeometryBlock.js";
import { NodeGeometryBlockConnectionPointTypes } from "../Enums/nodeGeometryConnectionPointTypes.js";
import { editableInPropertyPage } from "../../../Decorators/nodeDecorator.js";
import { WithinEpsilon } from "../../../Maths/math.scalar.functions.js";
import { GeometryInputBlock } from "./geometryInputBlock.pure.js";
import { RegisterClass } from "../../../Misc/typeStore.js";
/**
 * Conditions supported by the condition block
 */
export var ConditionBlockTests;
(function (ConditionBlockTests) {
    /** Equal */
    ConditionBlockTests[ConditionBlockTests["Equal"] = 0] = "Equal";
    /** NotEqual */
    ConditionBlockTests[ConditionBlockTests["NotEqual"] = 1] = "NotEqual";
    /** LessThan */
    ConditionBlockTests[ConditionBlockTests["LessThan"] = 2] = "LessThan";
    /** GreaterThan */
    ConditionBlockTests[ConditionBlockTests["GreaterThan"] = 3] = "GreaterThan";
    /** LessOrEqual */
    ConditionBlockTests[ConditionBlockTests["LessOrEqual"] = 4] = "LessOrEqual";
    /** GreaterOrEqual */
    ConditionBlockTests[ConditionBlockTests["GreaterOrEqual"] = 5] = "GreaterOrEqual";
    /** Logical Exclusive OR */
    ConditionBlockTests[ConditionBlockTests["Xor"] = 6] = "Xor";
    /** Logical Or */
    ConditionBlockTests[ConditionBlockTests["Or"] = 7] = "Or";
    /** Logical And */
    ConditionBlockTests[ConditionBlockTests["And"] = 8] = "And";
})(ConditionBlockTests || (ConditionBlockTests = {}));
/**
 * Block used to evaluate a condition and return a true or false value
 */
let ConditionBlock = (() => {
    var _a;
    let _classSuper = NodeGeometryBlock;
    let _test_decorators;
    let _test_initializers = [];
    let _test_extraInitializers = [];
    let _epsilon_decorators;
    let _epsilon_initializers = [];
    let _epsilon_extraInitializers = [];
    return _a = class ConditionBlock extends _classSuper {
            /**
             * Create a new ConditionBlock
             * @param name defines the block name
             */
            constructor(name) {
                super(name);
                /**
                 * Gets or sets the test used by the block
                 */
                this.test = __runInitializers(this, _test_initializers, ConditionBlockTests.Equal);
                /**
                 * Gets or sets the epsilon value used for comparison
                 */
                this.epsilon = (__runInitializers(this, _test_extraInitializers), __runInitializers(this, _epsilon_initializers, 0));
                __runInitializers(this, _epsilon_extraInitializers);
                this.registerInput("left", NodeGeometryBlockConnectionPointTypes.Float);
                this.registerInput("right", NodeGeometryBlockConnectionPointTypes.Float, true, 0);
                this.registerInput("ifTrue", NodeGeometryBlockConnectionPointTypes.AutoDetect, true, 1);
                this.registerInput("ifFalse", NodeGeometryBlockConnectionPointTypes.AutoDetect, true, 0);
                this.registerOutput("output", NodeGeometryBlockConnectionPointTypes.BasedOnInput);
                this._outputs[0]._typeConnectionSource = this._inputs[2];
                this._outputs[0]._defaultConnectionPointType = NodeGeometryBlockConnectionPointTypes.Float;
                this._inputs[0].acceptedConnectionPointTypes.push(NodeGeometryBlockConnectionPointTypes.Int);
                this._inputs[1].acceptedConnectionPointTypes.push(NodeGeometryBlockConnectionPointTypes.Int);
                this._linkConnectionTypes(2, 3);
            }
            /**
             * Gets the current class name
             * @returns the class name
             */
            getClassName() {
                return "ConditionBlock";
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
             * Gets the ifTrue input component
             */
            get ifTrue() {
                return this._inputs[2];
            }
            /**
             * Gets the ifFalse input component
             */
            get ifFalse() {
                return this._inputs[3];
            }
            /**
             * Gets the output component
             */
            get output() {
                return this._outputs[0];
            }
            /** @internal */
            autoConfigure(nodeGeometry) {
                if (!this.ifTrue.isConnected) {
                    const minInput = nodeGeometry.getBlockByPredicate((b) => b.isInput && b.value === 1 && b.name === "True") ||
                        new GeometryInputBlock("True");
                    minInput.value = 1;
                    minInput.output.connectTo(this.ifTrue);
                }
                if (!this.ifFalse.isConnected) {
                    const maxInput = nodeGeometry.getBlockByPredicate((b) => b.isInput && b.value === 0 && b.name === "False") ||
                        new GeometryInputBlock("False");
                    maxInput.value = 0;
                    maxInput.output.connectTo(this.ifFalse);
                }
            }
            _buildBlock() {
                if (!this.left.isConnected) {
                    this.output._storedFunction = null;
                    this.output._storedValue = null;
                    return;
                }
                const func = (state) => {
                    const left = this.left.getConnectedValue(state);
                    const right = this.right.getConnectedValue(state);
                    let condition = false;
                    switch (this.test) {
                        case ConditionBlockTests.Equal:
                            condition = WithinEpsilon(left, right, this.epsilon);
                            break;
                        case ConditionBlockTests.NotEqual:
                            condition = !WithinEpsilon(left, right, this.epsilon);
                            break;
                        case ConditionBlockTests.LessThan:
                            condition = left < right + this.epsilon;
                            break;
                        case ConditionBlockTests.GreaterThan:
                            condition = left > right - this.epsilon;
                            break;
                        case ConditionBlockTests.LessOrEqual:
                            condition = left <= right + this.epsilon;
                            break;
                        case ConditionBlockTests.GreaterOrEqual:
                            condition = left >= right - this.epsilon;
                            break;
                        case ConditionBlockTests.Xor:
                            condition = (!!left && !right) || (!left && !!right);
                            break;
                        case ConditionBlockTests.Or:
                            condition = !!left || !!right;
                            break;
                        case ConditionBlockTests.And:
                            condition = !!left && !!right;
                            break;
                    }
                    return condition;
                };
                this.output._storedFunction = (state) => {
                    if (func(state)) {
                        return this.ifTrue.getConnectedValue(state);
                    }
                    return this.ifFalse.getConnectedValue(state);
                };
            }
            _dumpPropertiesCode() {
                let codeString = super._dumpPropertiesCode() + `${this._codeVariableName}.test = BABYLON.ConditionBlockTests.${ConditionBlockTests[this.test]};\n`;
                codeString += `${this._codeVariableName}.epsilon = ${this.epsilon};\n`;
                return codeString;
            }
            /**
             * Serializes this block in a JSON representation
             * @returns the serialized block object
             */
            serialize() {
                const serializationObject = super.serialize();
                serializationObject.test = this.test;
                serializationObject.epsilon = this.epsilon;
                return serializationObject;
            }
            /** @internal */
            _deserialize(serializationObject) {
                super._deserialize(serializationObject);
                this.test = serializationObject.test;
                if (serializationObject.epsilon !== undefined) {
                    this.epsilon = serializationObject.epsilon;
                }
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _test_decorators = [editableInPropertyPage("Test", 5 /* PropertyTypeForEdition.List */, "ADVANCED", {
                    notifiers: { rebuild: true },
                    embedded: true,
                    options: [
                        { label: "Equal", value: ConditionBlockTests.Equal },
                        { label: "NotEqual", value: ConditionBlockTests.NotEqual },
                        { label: "LessThan", value: ConditionBlockTests.LessThan },
                        { label: "GreaterThan", value: ConditionBlockTests.GreaterThan },
                        { label: "LessOrEqual", value: ConditionBlockTests.LessOrEqual },
                        { label: "GreaterOrEqual", value: ConditionBlockTests.GreaterOrEqual },
                        { label: "Xor", value: ConditionBlockTests.Xor },
                        { label: "Or", value: ConditionBlockTests.Or },
                        { label: "And", value: ConditionBlockTests.And },
                    ],
                })];
            _epsilon_decorators = [editableInPropertyPage("Epsilon", 1 /* PropertyTypeForEdition.Float */, "ADVANCED", { embedded: true, notifiers: { rebuild: true } })];
            __esDecorate(null, null, _test_decorators, { kind: "field", name: "test", static: false, private: false, access: { has: obj => "test" in obj, get: obj => obj.test, set: (obj, value) => { obj.test = value; } }, metadata: _metadata }, _test_initializers, _test_extraInitializers);
            __esDecorate(null, null, _epsilon_decorators, { kind: "field", name: "epsilon", static: false, private: false, access: { has: obj => "epsilon" in obj, get: obj => obj.epsilon, set: (obj, value) => { obj.epsilon = value; } }, metadata: _metadata }, _epsilon_initializers, _epsilon_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
export { ConditionBlock };
let _Registered = false;
/**
 * Register side effects for conditionBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterConditionBlock() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    RegisterClass("BABYLON.ConditionBlock", ConditionBlock);
}
//# sourceMappingURL=conditionBlock.pure.js.map