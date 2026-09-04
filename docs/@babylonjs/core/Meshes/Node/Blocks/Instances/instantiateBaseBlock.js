import { __esDecorate, __runInitializers } from "../../../../tslib.es6.js";
import { NodeGeometryBlock } from "../../nodeGeometryBlock.js";
import { NodeGeometryBlockConnectionPointTypes } from "../../Enums/nodeGeometryConnectionPointTypes.js";
import { editableInPropertyPage } from "../../../../Decorators/nodeDecorator.js";
/**
 * Block used as a base for InstantiateXXX blocks
 */
let InstantiateBaseBlock = (() => {
    var _a;
    let _classSuper = NodeGeometryBlock;
    let _evaluateContext_decorators;
    let _evaluateContext_initializers = [];
    let _evaluateContext_extraInitializers = [];
    return _a = class InstantiateBaseBlock extends _classSuper {
            /**
             * Create a new InstantiateBaseBlock
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
                this.registerInput("instance", NodeGeometryBlockConnectionPointTypes.Geometry, true);
                this.registerInput("count", NodeGeometryBlockConnectionPointTypes.Int, true, 1);
                this.registerOutput("output", NodeGeometryBlockConnectionPointTypes.Geometry);
            }
            /**
             * Gets the current instance index in the current flow
             * @returns the current index
             */
            getInstanceIndex() {
                return this._currentIndex;
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
                return "InstantiateBaseBlock";
            }
            /**
             * Gets the instance input component
             */
            get instance() {
                return this._inputs[0];
            }
            /**
             * Gets the count input component
             */
            get count() {
                return this._inputs[1];
            }
            /**
             * Gets the geometry output component
             */
            get output() {
                return this._outputs[0];
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
export { InstantiateBaseBlock };
//# sourceMappingURL=instantiateBaseBlock.js.map