/** This file must only contain pure code and pure imports */
import { __esDecorate, __runInitializers } from "../../../tslib.es6.js";
import { NodeGeometryBlockConnectionPointTypes } from "../Enums/nodeGeometryConnectionPointTypes.js";
import { NodeGeometryBlock } from "../nodeGeometryBlock.js";
import { editableInPropertyPage } from "../../../Decorators/nodeDecorator.js";
import { FixFlippedFaces } from "../../../Maths/math.functions.js";
import { RegisterClass } from "../../../Misc/typeStore.js";
/**
 * Block used to clean a geometry
 */
let CleanGeometryBlock = (() => {
    var _a;
    let _classSuper = NodeGeometryBlock;
    let _evaluateContext_decorators;
    let _evaluateContext_initializers = [];
    let _evaluateContext_extraInitializers = [];
    return _a = class CleanGeometryBlock extends _classSuper {
            /**
             * Creates a new CleanGeometryBlock
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
                this.registerOutput("output", NodeGeometryBlockConnectionPointTypes.Geometry);
            }
            /**
             * Gets the current class name
             * @returns the class name
             */
            getClassName() {
                return "CleanGeometryBlock";
            }
            /**
             * Gets the geometry component
             */
            get geometry() {
                return this._inputs[0];
            }
            /**
             * Gets the output component
             */
            get output() {
                return this._outputs[0];
            }
            _buildBlock(state) {
                const func = (state) => {
                    if (!this.geometry.isConnected) {
                        return null;
                    }
                    const vertexData = this.geometry.getConnectedValue(state).clone();
                    if (!vertexData.positions || !vertexData.indices || !vertexData.normals) {
                        return vertexData;
                    }
                    const indices = vertexData.indices;
                    const positions = vertexData.positions;
                    FixFlippedFaces(positions, indices);
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
                return super._dumpPropertiesCode() + `${this._codeVariableName}.evaluateContext = ${this.evaluateContext ? "true" : "false"};\n`;
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
export { CleanGeometryBlock };
let _Registered = false;
/**
 * Register side effects for cleanGeometryBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterCleanGeometryBlock() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    RegisterClass("BABYLON.CleanGeometryBlock", CleanGeometryBlock);
}
//# sourceMappingURL=cleanGeometryBlock.pure.js.map