/** This file must only contain pure code and pure imports */
import { __esDecorate, __runInitializers } from "../../../../tslib.es6.js";
import { NodeGeometryBlock } from "../../nodeGeometryBlock.js";
import { NodeGeometryBlockConnectionPointTypes } from "../../Enums/nodeGeometryConnectionPointTypes.js";
import { editableInPropertyPage } from "../../../../Decorators/nodeDecorator.js";
import { Vector2, Vector3, Vector4 } from "../../../../Maths/math.vector.pure.js";
import { RegisterClass } from "../../../../Misc/typeStore.js";
/**
 * Conditions supported by the condition block
 */
export var Aggregations;
(function (Aggregations) {
    /** Max */
    Aggregations[Aggregations["Max"] = 0] = "Max";
    /** Min */
    Aggregations[Aggregations["Min"] = 1] = "Min";
    /** Sum */
    Aggregations[Aggregations["Sum"] = 2] = "Sum";
})(Aggregations || (Aggregations = {}));
/**
 * Block used to extract a valuefrom a geometry
 */
let AggregatorBlock = (() => {
    var _a;
    let _classSuper = NodeGeometryBlock;
    let _aggregation_decorators;
    let _aggregation_initializers = [];
    let _aggregation_extraInitializers = [];
    let _evaluateContext_decorators;
    let _evaluateContext_initializers = [];
    let _evaluateContext_extraInitializers = [];
    return _a = class AggregatorBlock extends _classSuper {
            /**
             * Create a new SetPositionsBlock
             * @param name defines the block name
             */
            constructor(name) {
                super(name);
                /**
                 * Gets or sets the test used by the block
                 */
                this.aggregation = __runInitializers(this, _aggregation_initializers, Aggregations.Sum);
                /**
                 * Gets or sets a boolean indicating that this block can evaluate context
                 * Build performance is improved when this value is set to false as the system will cache values instead of reevaluating everything per context change
                 */
                this.evaluateContext = (__runInitializers(this, _aggregation_extraInitializers), __runInitializers(this, _evaluateContext_initializers, true));
                __runInitializers(this, _evaluateContext_extraInitializers);
                this.registerInput("geometry", NodeGeometryBlockConnectionPointTypes.Geometry);
                this.registerInput("source", NodeGeometryBlockConnectionPointTypes.AutoDetect);
                this.registerOutput("output", NodeGeometryBlockConnectionPointTypes.BasedOnInput);
                this._outputs[0]._typeConnectionSource = this._inputs[1];
            }
            /**
             * Gets the current index in the current flow
             * @returns the current index
             */
            getExecutionIndex() {
                return this._currentIndex;
            }
            /**
             * Gets the current loop index in the current flow
             * @returns the current loop index
             */
            getExecutionLoopIndex() {
                return this._currentIndex;
            }
            /**
             * Gets the current face index in the current flow
             * @returns the current face index
             */
            getExecutionFaceIndex() {
                return 0;
            }
            /**
             * Gets the current class name
             * @returns the class name
             */
            getClassName() {
                return "AggregatorBlock";
            }
            /**
             * Gets the geometry input component
             */
            get geometry() {
                return this._inputs[0];
            }
            /**
             * Gets the source input component
             */
            get source() {
                return this._inputs[1];
            }
            /**
             * Gets the geometry output component
             */
            get output() {
                return this._outputs[0];
            }
            _buildBlock(state) {
                const func = (state) => {
                    state.pushExecutionContext(this);
                    this._vertexData = this.geometry.getConnectedValue(state);
                    state.pushGeometryContext(this._vertexData);
                    if (!this._vertexData || !this._vertexData.positions || !this.source.isConnected) {
                        state.restoreGeometryContext();
                        state.restoreExecutionContext();
                        this.output._storedValue = null;
                        return;
                    }
                    // Processing
                    const vertexCount = this._vertexData.positions.length / 3;
                    const context = [];
                    for (this._currentIndex = 0; this._currentIndex < vertexCount; this._currentIndex++) {
                        context.push(this.source.getConnectedValue(state));
                    }
                    // Aggregation
                    let func = null;
                    switch (this.aggregation) {
                        case Aggregations.Max: {
                            func = (a, b) => Math.max(a, b);
                            break;
                        }
                        case Aggregations.Min: {
                            func = (a, b) => Math.min(a, b);
                            break;
                        }
                        case Aggregations.Sum: {
                            func = (a, b) => a + b;
                            break;
                        }
                    }
                    if (!func) {
                        state.restoreGeometryContext();
                        state.restoreExecutionContext();
                        this.output._storedFunction = null;
                        this.output._storedValue = null;
                        return;
                    }
                    let returnValue;
                    switch (this.source.type) {
                        case NodeGeometryBlockConnectionPointTypes.Int:
                        case NodeGeometryBlockConnectionPointTypes.Float: {
                            returnValue = context.reduce(func);
                            break;
                        }
                        case NodeGeometryBlockConnectionPointTypes.Vector2: {
                            const x = context.map((v) => v.x).reduce(func);
                            const y = context.map((v) => v.y).reduce(func);
                            returnValue = new Vector2(x, y);
                            break;
                        }
                        case NodeGeometryBlockConnectionPointTypes.Vector3: {
                            const x = context.map((v) => v.x).reduce(func);
                            const y = context.map((v) => v.y).reduce(func);
                            const z = context.map((v) => v.z).reduce(func);
                            returnValue = new Vector3(x, y, z);
                            break;
                        }
                        case NodeGeometryBlockConnectionPointTypes.Vector4: {
                            const x = context.map((v) => v.x).reduce(func);
                            const y = context.map((v) => v.y).reduce(func);
                            const z = context.map((v) => v.z).reduce(func);
                            const w = context.map((v) => v.w).reduce(func);
                            returnValue = new Vector4(x, y, z, w);
                            break;
                        }
                    }
                    // Storage
                    state.restoreGeometryContext();
                    state.restoreExecutionContext();
                    return returnValue;
                };
                if (this.evaluateContext) {
                    this.output._storedFunction = func;
                }
                else {
                    this.output._storedFunction = null;
                    this.output._storedValue = func(state);
                }
            }
            _dumpPropertiesCode() {
                let codeString = super._dumpPropertiesCode() + `${this._codeVariableName}.evaluateContext = ${this.evaluateContext ? "true" : "false"};\n`;
                codeString += `${this._codeVariableName}.aggregation = BABYLON.Aggregations.${Aggregations[this.aggregation]};\n`;
                return codeString;
            }
            /**
             * Serializes this block in a JSON representation
             * @returns the serialized block object
             */
            serialize() {
                const serializationObject = super.serialize();
                serializationObject.evaluateContext = this.evaluateContext;
                serializationObject.aggregation = this.aggregation;
                return serializationObject;
            }
            /** @internal */
            _deserialize(serializationObject) {
                super._deserialize(serializationObject);
                if (serializationObject.evaluateContext !== undefined) {
                    this.evaluateContext = serializationObject.evaluateContext;
                }
                if (serializationObject.aggregation !== undefined) {
                    this.aggregation = serializationObject.aggregation;
                }
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _aggregation_decorators = [editableInPropertyPage("Aggregation", 5 /* PropertyTypeForEdition.List */, "ADVANCED", {
                    notifiers: { rebuild: true },
                    embedded: true,
                    options: [
                        { label: "Max", value: Aggregations.Max },
                        { label: "Min", value: Aggregations.Min },
                        { label: "Sum", value: Aggregations.Sum },
                    ],
                })];
            _evaluateContext_decorators = [editableInPropertyPage("Evaluate context", 0 /* PropertyTypeForEdition.Boolean */, "ADVANCED", { notifiers: { rebuild: true } })];
            __esDecorate(null, null, _aggregation_decorators, { kind: "field", name: "aggregation", static: false, private: false, access: { has: obj => "aggregation" in obj, get: obj => obj.aggregation, set: (obj, value) => { obj.aggregation = value; } }, metadata: _metadata }, _aggregation_initializers, _aggregation_extraInitializers);
            __esDecorate(null, null, _evaluateContext_decorators, { kind: "field", name: "evaluateContext", static: false, private: false, access: { has: obj => "evaluateContext" in obj, get: obj => obj.evaluateContext, set: (obj, value) => { obj.evaluateContext = value; } }, metadata: _metadata }, _evaluateContext_initializers, _evaluateContext_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
export { AggregatorBlock };
let _Registered = false;
/**
 * Register side effects for aggregatorBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterAggregatorBlock() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    RegisterClass("BABYLON.AggregatorBlock", AggregatorBlock);
}
//# sourceMappingURL=aggregatorBlock.pure.js.map