/** This file must only contain pure code and pure imports */
import { __esDecorate, __runInitializers } from "../../../../tslib.es6.js";
import { NodeGeometryBlockConnectionPointTypes } from "../../Enums/nodeGeometryConnectionPointTypes.js";
import { NodeGeometryBlock } from "../../nodeGeometryBlock.js";
import { GeometryInputBlock } from "../geometryInputBlock.pure.js";
import { CreateDiscVertexData } from "../../../Builders/discBuilder.pure.js";
import { editableInPropertyPage } from "../../../../Decorators/nodeDecorator.js";
import { RegisterClass } from "../../../../Misc/typeStore.js";
/**
 * Defines a block used to generate disc geometry data
 */
let DiscBlock = (() => {
    var _a;
    let _classSuper = NodeGeometryBlock;
    let _evaluateContext_decorators;
    let _evaluateContext_initializers = [];
    let _evaluateContext_extraInitializers = [];
    return _a = class DiscBlock extends _classSuper {
            /**
             * Create a new DiscBlock
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
                this.registerInput("radius", NodeGeometryBlockConnectionPointTypes.Float, true, 0.5);
                this.registerInput("tessellation", NodeGeometryBlockConnectionPointTypes.Int, true, 64);
                this.registerInput("arc", NodeGeometryBlockConnectionPointTypes.Float, true, 1.0);
                this.registerOutput("geometry", NodeGeometryBlockConnectionPointTypes.Geometry);
            }
            /**
             * Gets the current class name
             * @returns the class name
             */
            getClassName() {
                return "DiscBlock";
            }
            /**
             * Gets the radius input component
             */
            get radius() {
                return this._inputs[0];
            }
            /**
             * Gets the tessellation input component
             */
            get tessellation() {
                return this._inputs[1];
            }
            /**
             * Gets the arc input component
             */
            get arc() {
                return this._inputs[2];
            }
            /**
             * Gets the geometry output component
             */
            get geometry() {
                return this._outputs[0];
            }
            /** @internal */
            autoConfigure() {
                if (!this.radius.isConnected) {
                    const radiusInput = new GeometryInputBlock("Radius");
                    radiusInput.value = 0.2;
                    radiusInput.output.connectTo(this.radius);
                }
            }
            _buildBlock(state) {
                const options = {};
                const func = (state) => {
                    options.radius = this.radius.getConnectedValue(state);
                    options.tessellation = this.tessellation.getConnectedValue(state);
                    options.arc = this.arc.getConnectedValue(state);
                    // Append vertex data from the plane builder
                    return CreateDiscVertexData(options);
                };
                if (this.evaluateContext) {
                    this.geometry._storedFunction = func;
                }
                else {
                    const value = func(state);
                    this.geometry._storedFunction = () => {
                        this.geometry._executionCount = 1;
                        return value.clone();
                    };
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
export { DiscBlock };
let _Registered = false;
/**
 * Register side effects for discBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterDiscBlock() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    RegisterClass("BABYLON.DiscBlock", DiscBlock);
}
//# sourceMappingURL=discBlock.pure.js.map