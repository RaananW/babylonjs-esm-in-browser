/** This file must only contain pure code and pure imports */
import { __esDecorate, __runInitializers } from "../../../../tslib.es6.js";
import { NodeGeometryBlock } from "../../nodeGeometryBlock.js";
import { NodeGeometryBlockConnectionPointTypes } from "../../Enums/nodeGeometryConnectionPointTypes.js";
import { editableInPropertyPage } from "../../../../Decorators/nodeDecorator.js";
import { RegisterClass } from "../../../../Misc/typeStore.js";
/**
 * Block used to set colors for a geometry
 */
let SetColorsBlock = (() => {
    var _a;
    let _classSuper = NodeGeometryBlock;
    let _evaluateContext_decorators;
    let _evaluateContext_initializers = [];
    let _evaluateContext_extraInitializers = [];
    return _a = class SetColorsBlock extends _classSuper {
            /**
             * Create a new SetColorsBlock
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
                this.registerInput("geometry", NodeGeometryBlockConnectionPointTypes.Geometry);
                this.registerInput("colors", NodeGeometryBlockConnectionPointTypes.AutoDetect);
                this.registerOutput("output", NodeGeometryBlockConnectionPointTypes.Geometry);
                this._inputs[1].excludedConnectionPointTypes.push(NodeGeometryBlockConnectionPointTypes.Int);
                this._inputs[1].excludedConnectionPointTypes.push(NodeGeometryBlockConnectionPointTypes.Float);
                this._inputs[1].excludedConnectionPointTypes.push(NodeGeometryBlockConnectionPointTypes.Vector2);
                this._inputs[1].excludedConnectionPointTypes.push(NodeGeometryBlockConnectionPointTypes.Texture);
                this._inputs[1].excludedConnectionPointTypes.push(NodeGeometryBlockConnectionPointTypes.Texture);
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
                return "SetColorsBlock";
            }
            /**
             * Gets the geometry input component
             */
            get geometry() {
                return this._inputs[0];
            }
            /**
             * Gets the colors input component
             */
            get colors() {
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
                    if (this._vertexData) {
                        this._vertexData = this._vertexData.clone(); // Preserve source data
                    }
                    state.pushGeometryContext(this._vertexData);
                    if (!this._vertexData || !this._vertexData.positions) {
                        state.restoreGeometryContext();
                        state.restoreExecutionContext();
                        this.output._storedValue = null;
                        return;
                    }
                    if (!this.colors.isConnected) {
                        state.restoreGeometryContext();
                        state.restoreExecutionContext();
                        this.output._storedValue = this._vertexData;
                        return;
                    }
                    if (!this._vertexData.colors) {
                        this._vertexData.colors = [];
                    }
                    // Processing
                    const vertexCount = this._vertexData.positions.length / 3;
                    for (this._currentIndex = 0; this._currentIndex < vertexCount; this._currentIndex++) {
                        if (this.colors.connectedPoint?.type === NodeGeometryBlockConnectionPointTypes.Vector3) {
                            const tempVector3 = this.colors.getConnectedValue(state);
                            if (tempVector3) {
                                tempVector3.toArray(this._vertexData.colors, this._currentIndex * 4);
                                this._vertexData.colors[this._currentIndex * 4 + 3] = 1; // Alpha
                                this._vertexData.hasVertexAlpha = false;
                            }
                        }
                        else {
                            const tempVector4 = this.colors.getConnectedValue(state);
                            if (tempVector4) {
                                tempVector4.toArray(this._vertexData.colors, this._currentIndex * 4);
                                this._vertexData.hasVertexAlpha = true;
                            }
                        }
                    }
                    // Storage
                    state.restoreGeometryContext();
                    state.restoreExecutionContext();
                    return this._vertexData;
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
                if (serializationObject.evaluateContext !== undefined) {
                    this.evaluateContext = serializationObject.evaluateContext;
                }
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
export { SetColorsBlock };
let _Registered = false;
/**
 * Register side effects for setColorsBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterSetColorsBlock() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    RegisterClass("BABYLON.SetColorsBlock", SetColorsBlock);
}
//# sourceMappingURL=setColorsBlock.pure.js.map