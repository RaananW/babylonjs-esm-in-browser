/** This file must only contain pure code and pure imports */
import { __esDecorate, __runInitializers } from "../../../tslib.es6.js";
import { NodeGeometryBlock } from "../nodeGeometryBlock.js";
import { NodeGeometryBlockConnectionPointTypes } from "../Enums/nodeGeometryConnectionPointTypes.js";
import { editableInPropertyPage } from "../../../Decorators/nodeDecorator.js";
import { RegisterClass } from "../../../Misc/typeStore.js";
/**
 * Block used to merge several geometries
 */
let MergeGeometryBlock = (() => {
    var _a;
    let _classSuper = NodeGeometryBlock;
    let _evaluateContext_decorators;
    let _evaluateContext_initializers = [];
    let _evaluateContext_extraInitializers = [];
    return _a = class MergeGeometryBlock extends _classSuper {
            /**
             * Create a new MergeGeometryBlock
             * @param name defines the block name
             */
            constructor(name) {
                super(name);
                /**
                 * Gets or sets a boolean indicating that this block can evaluate context
                 * Build performance is improved when this value is set to false as the system will cache values instead of reevaluating everything per context change
                 */
                this.evaluateContext = __runInitializers(this, _evaluateContext_initializers, false);
                __runInitializers(this, _evaluateContext_extraInitializers);
                this.registerInput("geometry0", NodeGeometryBlockConnectionPointTypes.Geometry);
                this.registerInput("geometry1", NodeGeometryBlockConnectionPointTypes.Geometry, true);
                this.registerInput("geometry2", NodeGeometryBlockConnectionPointTypes.Geometry, true);
                this.registerInput("geometry3", NodeGeometryBlockConnectionPointTypes.Geometry, true);
                this.registerInput("geometry4", NodeGeometryBlockConnectionPointTypes.Geometry, true);
                this.registerOutput("output", NodeGeometryBlockConnectionPointTypes.Geometry);
            }
            /**
             * Gets the current class name
             * @returns the class name
             */
            getClassName() {
                return "MergeGeometryBlock";
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
             * Gets the geometry2 input component
             */
            get geometry2() {
                return this._inputs[2];
            }
            /**
             * Gets the geometry3 input component
             */
            get geometry3() {
                return this._inputs[3];
            }
            /**
             * Gets the geometry4 input component
             */
            get geometry4() {
                return this._inputs[4];
            }
            /**
             * Gets the geometry output component
             */
            get output() {
                return this._outputs[0];
            }
            _buildBlock(state) {
                const func = (state) => {
                    const vertexDataSource = [];
                    if (this.geometry0.isConnected) {
                        const data = this.geometry0.getConnectedValue(state);
                        if (data) {
                            vertexDataSource.push(data);
                        }
                    }
                    if (this.geometry1.isConnected) {
                        const data = this.geometry1.getConnectedValue(state);
                        if (data) {
                            vertexDataSource.push(data);
                        }
                    }
                    if (this.geometry2.isConnected) {
                        const data = this.geometry2.getConnectedValue(state);
                        if (data) {
                            vertexDataSource.push(data);
                        }
                    }
                    if (this.geometry3.isConnected) {
                        const data = this.geometry3.getConnectedValue(state);
                        if (data) {
                            vertexDataSource.push(data);
                        }
                    }
                    if (this.geometry4.isConnected) {
                        const data = this.geometry4.getConnectedValue(state);
                        if (data) {
                            vertexDataSource.push(data);
                        }
                    }
                    if (vertexDataSource.length === 0) {
                        return null;
                    }
                    let vertexData = vertexDataSource[0].clone(); // Preserve source data
                    const additionalVertexData = vertexDataSource.slice(1);
                    if (additionalVertexData.length && vertexData) {
                        vertexData = vertexData.merge(additionalVertexData, true, false, true, true);
                    }
                    return vertexData;
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
                const codeString = super._dumpPropertiesCode() + `${this._codeVariableName}.evaluateContext = ${this.evaluateContext ? "true" : "false"};\n`;
                return codeString;
            }
            /**
             * Serializes this block in a JSON representation
             * @returns the serialized block object
             */
            serialize() {
                const serializationObject = super.serialize();
                serializationObject.evaluateContext = this.evaluateContext;
                return serializationObject;
            }
            /** @internal */
            _deserialize(serializationObject) {
                super._deserialize(serializationObject);
                this.evaluateContext = serializationObject.evaluateContext;
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _evaluateContext_decorators = [editableInPropertyPage("Evaluate context", 0 /* PropertyTypeForEdition.Boolean */, "ADVANCED", { embedded: true, notifiers: { rebuild: true } })];
            __esDecorate(null, null, _evaluateContext_decorators, { kind: "field", name: "evaluateContext", static: false, private: false, access: { has: obj => "evaluateContext" in obj, get: obj => obj.evaluateContext, set: (obj, value) => { obj.evaluateContext = value; } }, metadata: _metadata }, _evaluateContext_initializers, _evaluateContext_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
export { MergeGeometryBlock };
let _Registered = false;
/**
 * Register side effects for mergeGeometryBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterMergeGeometryBlock() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    RegisterClass("BABYLON.MergeGeometryBlock", MergeGeometryBlock);
}
//# sourceMappingURL=mergeGeometryBlock.pure.js.map