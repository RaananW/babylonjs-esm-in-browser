/** This file must only contain pure code and pure imports */
import { __esDecorate, __runInitializers } from "../../../../tslib.es6.js";
import { NodeGeometryBlockConnectionPointTypes } from "../../Enums/nodeGeometryConnectionPointTypes.js";
import { NodeGeometryBlock } from "../../nodeGeometryBlock.js";
import { GeometryInputBlock } from "../geometryInputBlock.pure.js";
import { CreateIcoSphereVertexData } from "../../../Builders/icoSphereBuilder.pure.js";
import { editableInPropertyPage } from "../../../../Decorators/nodeDecorator.js";
import { RegisterClass } from "../../../../Misc/typeStore.js";
/**
 * Defines a block used to generate icosphere geometry data
 */
let IcoSphereBlock = (() => {
    var _a;
    let _classSuper = NodeGeometryBlock;
    let _evaluateContext_decorators;
    let _evaluateContext_initializers = [];
    let _evaluateContext_extraInitializers = [];
    return _a = class IcoSphereBlock extends _classSuper {
            /**
             * Create a new IcoSphereBlock
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
                this.registerInput("radius", NodeGeometryBlockConnectionPointTypes.Float, true, 1);
                this.registerInput("radiusX", NodeGeometryBlockConnectionPointTypes.Float, true, 0);
                this.registerInput("radiusY", NodeGeometryBlockConnectionPointTypes.Float, true, 0);
                this.registerInput("radiusZ", NodeGeometryBlockConnectionPointTypes.Float, true, 0);
                this.registerInput("subdivisions", NodeGeometryBlockConnectionPointTypes.Int, true, 4);
                this.registerOutput("geometry", NodeGeometryBlockConnectionPointTypes.Geometry);
            }
            /**
             * Gets the current class name
             * @returns the class name
             */
            getClassName() {
                return "IcoSphereBlock";
            }
            /**
             * Gets the radius input component
             */
            get radius() {
                return this._inputs[0];
            }
            /**
             * Gets the radiusX input component
             */
            get radiusX() {
                return this._inputs[1];
            }
            /**
             * Gets the radiusY input component
             */
            get radiusY() {
                return this._inputs[2];
            }
            /**
             * Gets the radiusZ input component
             */
            get radiusZ() {
                return this._inputs[3];
            }
            /**
             * Gets the subdivisions input component
             */
            get subdivisions() {
                return this._inputs[4];
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
                    options.subdivisions = this.subdivisions.getConnectedValue(state);
                    options.radiusX = this.radiusX.getConnectedValue(state);
                    options.radiusY = this.radiusY.getConnectedValue(state);
                    options.radiusZ = this.radiusZ.getConnectedValue(state);
                    // Append vertex data from the plane builder
                    return CreateIcoSphereVertexData(options);
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
export { IcoSphereBlock };
let _Registered = false;
/**
 * Register side effects for icoSphereBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterIcoSphereBlock() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    RegisterClass("BABYLON.IcoSphereBlock", IcoSphereBlock);
}
//# sourceMappingURL=icoSphereBlock.pure.js.map