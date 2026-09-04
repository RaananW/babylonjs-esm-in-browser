/** This file must only contain pure code and pure imports */
import { __esDecorate, __runInitializers } from "../../../tslib.es6.js";
import { NodeGeometryBlock } from "../nodeGeometryBlock.js";
import { NodeGeometryBlockConnectionPointTypes } from "../Enums/nodeGeometryConnectionPointTypes.js";
import { editableInPropertyPage } from "../../../Decorators/nodeDecorator.js";
import { RegisterClass } from "../../../Misc/typeStore.js";
/**
 * Block used to randomly pick a geometry from a collection
 */
let GeometryCollectionBlock = (() => {
    var _a;
    let _classSuper = NodeGeometryBlock;
    let _evaluateContext_decorators;
    let _evaluateContext_initializers = [];
    let _evaluateContext_extraInitializers = [];
    return _a = class GeometryCollectionBlock extends _classSuper {
            /**
             * Create a new GeometryCollectionBlock
             * @param name defines the block name
             */
            constructor(name) {
                super(name);
                /**
                 * Gets or sets a boolean indicating that this block can evaluate context
                 * Build performance is improved when this value is set to false as the system will cache values instead of reevaluating everything per context change
                 */
                this.evaluateContext = __runInitializers(this, _evaluateContext_initializers, true);
                __runInitializers(this, _evaluateContext_extraInitializers);
                this.registerInput("geometry0", NodeGeometryBlockConnectionPointTypes.Geometry, true);
                this.registerInput("geometry1", NodeGeometryBlockConnectionPointTypes.Geometry, true);
                this.registerInput("geometry2", NodeGeometryBlockConnectionPointTypes.Geometry, true);
                this.registerInput("geometry3", NodeGeometryBlockConnectionPointTypes.Geometry, true);
                this.registerInput("geometry4", NodeGeometryBlockConnectionPointTypes.Geometry, true);
                this.registerInput("geometry5", NodeGeometryBlockConnectionPointTypes.Geometry, true);
                this.registerInput("geometry6", NodeGeometryBlockConnectionPointTypes.Geometry, true);
                this.registerInput("geometry7", NodeGeometryBlockConnectionPointTypes.Geometry, true);
                this.registerInput("geometry8", NodeGeometryBlockConnectionPointTypes.Geometry, true);
                this.registerInput("geometry9", NodeGeometryBlockConnectionPointTypes.Geometry, true);
                this.registerOutput("output", NodeGeometryBlockConnectionPointTypes.Geometry);
                this._outputs[0]._typeConnectionSource = this._inputs[0];
                this._linkConnectionTypes(0, 1);
            }
            /**
             * Gets the current class name
             * @returns the class name
             */
            getClassName() {
                return "GeometryCollectionBlock";
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
             * Gets the geometry5 input component
             */
            get geometry5() {
                return this._inputs[5];
            }
            /**
             * Gets the geometry6 input component
             */
            get geometry6() {
                return this._inputs[6];
            }
            /**
             * Gets the geometry7 input component
             */
            get geometry7() {
                return this._inputs[7];
            }
            /**
             * Gets the geometry8 input component
             */
            get geometry8() {
                return this._inputs[8];
            }
            /**
             * Gets the geometry9 input component
             */
            get geometry9() {
                return this._inputs[9];
            }
            /**
             * Gets the geometry output component
             */
            get output() {
                return this._outputs[0];
            }
            _storeGeometry(input, state, index, availables) {
                if (input.isConnected) {
                    const vertexData = input.getConnectedValue(state);
                    if (!vertexData) {
                        return;
                    }
                    vertexData.metadata = vertexData.metadata || {};
                    vertexData.metadata.collectionId = index;
                    availables.push(vertexData);
                }
            }
            _buildBlock(state) {
                const func = (state) => {
                    const availables = [];
                    this._storeGeometry(this.geometry0, state, 0, availables);
                    this._storeGeometry(this.geometry1, state, 1, availables);
                    this._storeGeometry(this.geometry2, state, 2, availables);
                    this._storeGeometry(this.geometry3, state, 3, availables);
                    this._storeGeometry(this.geometry4, state, 4, availables);
                    this._storeGeometry(this.geometry5, state, 5, availables);
                    this._storeGeometry(this.geometry6, state, 6, availables);
                    this._storeGeometry(this.geometry7, state, 7, availables);
                    this._storeGeometry(this.geometry8, state, 8, availables);
                    this._storeGeometry(this.geometry9, state, 9, availables);
                    if (!availables.length) {
                        return null;
                    }
                    return availables[Math.round(Math.random() * (availables.length - 1))];
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
export { GeometryCollectionBlock };
let _Registered = false;
/**
 * Register side effects for geometryCollectionBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterGeometryCollectionBlock() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    RegisterClass("BABYLON.GeometryCollectionBlock", GeometryCollectionBlock);
}
//# sourceMappingURL=geometryCollectionBlock.pure.js.map