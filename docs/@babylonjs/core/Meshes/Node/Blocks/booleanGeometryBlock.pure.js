/** This file must only contain pure code and pure imports */
import { __esDecorate, __runInitializers } from "../../../tslib.es6.js";
import { NodeGeometryBlock } from "../nodeGeometryBlock.js";
import { NodeGeometryBlockConnectionPointTypes } from "../Enums/nodeGeometryConnectionPointTypes.js";
import { editableInPropertyPage } from "../../../Decorators/nodeDecorator.js";
import { CSG2, InitializeCSG2Async, IsCSG2Ready } from "../../csg2.js";
import { CSG } from "../../csg.js";
import { RegisterClass } from "../../../Misc/typeStore.js";
/**
 * Operations supported by the boolean block
 */
export var BooleanGeometryOperations;
(function (BooleanGeometryOperations) {
    /** Intersect */
    BooleanGeometryOperations[BooleanGeometryOperations["Intersect"] = 0] = "Intersect";
    /** Subtract */
    BooleanGeometryOperations[BooleanGeometryOperations["Subtract"] = 1] = "Subtract";
    /** Union */
    BooleanGeometryOperations[BooleanGeometryOperations["Union"] = 2] = "Union";
})(BooleanGeometryOperations || (BooleanGeometryOperations = {}));
/**
 * Block used to apply a boolean operation between 2 geometries
 */
let BooleanGeometryBlock = (() => {
    var _a;
    let _classSuper = NodeGeometryBlock;
    let _evaluateContext_decorators;
    let _evaluateContext_initializers = [];
    let _evaluateContext_extraInitializers = [];
    let _operation_decorators;
    let _operation_initializers = [];
    let _operation_extraInitializers = [];
    let _useOldCSGEngine_decorators;
    let _useOldCSGEngine_initializers = [];
    let _useOldCSGEngine_extraInitializers = [];
    return _a = class BooleanGeometryBlock extends _classSuper {
            /**
             * @internal
             */
            get _isReadyState() {
                if (IsCSG2Ready()) {
                    return null;
                }
                if (!this._csg2LoadingPromise) {
                    this._csg2LoadingPromise = InitializeCSG2Async();
                }
                return this._csg2LoadingPromise;
            }
            /**
             * Create a new BooleanGeometryBlock
             * @param name defines the block name
             */
            constructor(name) {
                super(name);
                /**
                 * Gets or sets a boolean indicating that this block can evaluate context
                 * Build performance is improved when this value is set to false as the system will cache values instead of reevaluating everything per context change
                 */
                this.evaluateContext = __runInitializers(this, _evaluateContext_initializers, false);
                /**
                 * Gets or sets the operation applied by the block
                 */
                this.operation = (__runInitializers(this, _evaluateContext_extraInitializers), __runInitializers(this, _operation_initializers, BooleanGeometryOperations.Intersect));
                /**
                 * Gets or sets a boolean indicating that this block can evaluate context
                 * Build performance is improved when this value is set to false as the system will cache values instead of reevaluating everything per context change
                 */
                this.useOldCSGEngine = (__runInitializers(this, _operation_extraInitializers), __runInitializers(this, _useOldCSGEngine_initializers, false));
                this._csg2LoadingPromise = __runInitializers(this, _useOldCSGEngine_extraInitializers);
                this.registerInput("geometry0", NodeGeometryBlockConnectionPointTypes.Geometry);
                this.registerInput("geometry1", NodeGeometryBlockConnectionPointTypes.Geometry);
                this.registerOutput("output", NodeGeometryBlockConnectionPointTypes.Geometry);
            }
            /**
             * Gets the current class name
             * @returns the class name
             */
            getClassName() {
                return "BooleanGeometryBlock";
            }
            /**
             * Gets the geometry0 input component
             */
            get geometry0() {
                return this._inputs[0];
            }
            /**
             * Gets the geometry1 input component
             */
            get geometry1() {
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
                    const vertexData0 = this.geometry0.getConnectedValue(state);
                    const vertexData1 = this.geometry1.getConnectedValue(state);
                    if (!vertexData0 || !vertexData1) {
                        return null;
                    }
                    const vertexCount = vertexData0.positions.length / 3;
                    // Ensure that all the fields are filled to avoid problems later on in the graph
                    if (!vertexData0.normals && vertexData1.normals) {
                        vertexData0.normals = new Array(vertexData0.positions.length);
                    }
                    if (!vertexData1.normals && vertexData0.normals) {
                        vertexData1.normals = new Array(vertexData1.positions.length);
                    }
                    if (!vertexData0.uvs && vertexData1.uvs) {
                        vertexData0.uvs = new Array(vertexCount * 2);
                    }
                    if (!vertexData1.uvs && vertexData0.uvs) {
                        vertexData1.uvs = new Array(vertexCount * 2);
                    }
                    if (!vertexData0.colors && vertexData1.colors) {
                        vertexData0.colors = new Array(vertexCount * 4);
                    }
                    if (!vertexData1.colors && vertexData0.colors) {
                        vertexData1.colors = new Array(vertexCount * 4);
                    }
                    let boolCSG;
                    if (this.useOldCSGEngine) {
                        const csg0 = CSG.FromVertexData(vertexData0);
                        const csg1 = CSG.FromVertexData(vertexData1);
                        switch (this.operation) {
                            case BooleanGeometryOperations.Intersect:
                                boolCSG = csg0.intersect(csg1);
                                break;
                            case BooleanGeometryOperations.Subtract:
                                boolCSG = csg0.subtract(csg1);
                                break;
                            case BooleanGeometryOperations.Union:
                                boolCSG = csg0.union(csg1);
                                break;
                        }
                    }
                    else {
                        const csg0 = CSG2.FromVertexData(vertexData0);
                        const csg1 = CSG2.FromVertexData(vertexData1);
                        switch (this.operation) {
                            case BooleanGeometryOperations.Intersect:
                                boolCSG = csg0.intersect(csg1);
                                break;
                            case BooleanGeometryOperations.Subtract:
                                boolCSG = csg0.subtract(csg1);
                                break;
                            case BooleanGeometryOperations.Union:
                                boolCSG = csg0.add(csg1);
                                break;
                        }
                    }
                    return boolCSG.toVertexData();
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
                codeString += `${this._codeVariableName}.operation = BABYLON.BooleanGeometryOperations.${BooleanGeometryOperations[this.operation]};\n`;
                codeString += `${this._codeVariableName}.useOldCSGEngine = ${this.useOldCSGEngine ? "true" : "false"};\n`;
                return codeString;
            }
            /**
             * Serializes this block in a JSON representation
             * @returns the serialized block object
             */
            serialize() {
                const serializationObject = super.serialize();
                serializationObject.evaluateContext = this.evaluateContext;
                serializationObject.operation = this.operation;
                serializationObject.useOldCSGEngine = this.useOldCSGEngine;
                return serializationObject;
            }
            /** @internal */
            _deserialize(serializationObject) {
                super._deserialize(serializationObject);
                this.evaluateContext = serializationObject.evaluateContext;
                if (serializationObject.operation) {
                    this.operation = serializationObject.operation;
                }
                this.useOldCSGEngine = !!serializationObject.useOldCSGEngine;
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _evaluateContext_decorators = [editableInPropertyPage("Evaluate context", 0 /* PropertyTypeForEdition.Boolean */, "ADVANCED", { embedded: true, notifiers: { rebuild: true } })];
            _operation_decorators = [editableInPropertyPage("Operation", 5 /* PropertyTypeForEdition.List */, "ADVANCED", {
                    notifiers: { rebuild: true },
                    embedded: true,
                    options: [
                        { label: "Intersect", value: BooleanGeometryOperations.Intersect },
                        { label: "Subtract", value: BooleanGeometryOperations.Subtract },
                        { label: "Union", value: BooleanGeometryOperations.Union },
                    ],
                })];
            _useOldCSGEngine_decorators = [editableInPropertyPage("Use old CSG engine", 0 /* PropertyTypeForEdition.Boolean */, "ADVANCED", { embedded: true, notifiers: { rebuild: true } })];
            __esDecorate(null, null, _evaluateContext_decorators, { kind: "field", name: "evaluateContext", static: false, private: false, access: { has: obj => "evaluateContext" in obj, get: obj => obj.evaluateContext, set: (obj, value) => { obj.evaluateContext = value; } }, metadata: _metadata }, _evaluateContext_initializers, _evaluateContext_extraInitializers);
            __esDecorate(null, null, _operation_decorators, { kind: "field", name: "operation", static: false, private: false, access: { has: obj => "operation" in obj, get: obj => obj.operation, set: (obj, value) => { obj.operation = value; } }, metadata: _metadata }, _operation_initializers, _operation_extraInitializers);
            __esDecorate(null, null, _useOldCSGEngine_decorators, { kind: "field", name: "useOldCSGEngine", static: false, private: false, access: { has: obj => "useOldCSGEngine" in obj, get: obj => obj.useOldCSGEngine, set: (obj, value) => { obj.useOldCSGEngine = value; } }, metadata: _metadata }, _useOldCSGEngine_initializers, _useOldCSGEngine_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
export { BooleanGeometryBlock };
let _Registered = false;
/**
 * Register side effects for booleanGeometryBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterBooleanGeometryBlock() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    RegisterClass("BABYLON.BooleanGeometryBlock", BooleanGeometryBlock);
}
//# sourceMappingURL=booleanGeometryBlock.pure.js.map