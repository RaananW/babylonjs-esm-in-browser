/** This file must only contain pure code and pure imports */
import { __esDecorate, __runInitializers } from "../../../../tslib.es6.js";
import { NodeGeometryBlockConnectionPointTypes } from "../../Enums/nodeGeometryConnectionPointTypes.js";
import { NodeGeometryBlock } from "../../nodeGeometryBlock.js";
import { GeometryInputBlock } from "../geometryInputBlock.pure.js";
import { CreateCylinderVertexData } from "../../../Builders/cylinderBuilder.pure.js";
import { editableInPropertyPage } from "../../../../Decorators/nodeDecorator.js";
import { RegisterClass } from "../../../../Misc/typeStore.js";
/**
 * Defines a block used to generate cylinder geometry data
 */
let CylinderBlock = (() => {
    var _a;
    let _classSuper = NodeGeometryBlock;
    let _evaluateContext_decorators;
    let _evaluateContext_initializers = [];
    let _evaluateContext_extraInitializers = [];
    return _a = class CylinderBlock extends _classSuper {
            /**
             * Create a new SphereBlock
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
                this.registerInput("height", NodeGeometryBlockConnectionPointTypes.Float, true, 25);
                this.registerInput("diameter", NodeGeometryBlockConnectionPointTypes.Float, true, 1);
                this.registerInput("diameterTop", NodeGeometryBlockConnectionPointTypes.Float, true, -1);
                this.registerInput("diameterBottom", NodeGeometryBlockConnectionPointTypes.Float, true, -1);
                this.registerInput("subdivisions", NodeGeometryBlockConnectionPointTypes.Int, true, 1);
                this.registerInput("tessellation", NodeGeometryBlockConnectionPointTypes.Int, true, 24);
                this.registerInput("arc", NodeGeometryBlockConnectionPointTypes.Float, true, 1.0);
                this.registerOutput("geometry", NodeGeometryBlockConnectionPointTypes.Geometry);
            }
            /**
             * Gets the current class name
             * @returns the class name
             */
            getClassName() {
                return "CylinderBlock";
            }
            /**
             * Gets the height input component
             */
            get height() {
                return this._inputs[0];
            }
            /**
             * Gets the diameter input component
             */
            get diameter() {
                return this._inputs[1];
            }
            /**
             * Gets the diameterTop input component
             */
            get diameterTop() {
                return this._inputs[2];
            }
            /**
             * Gets the diameterBottom input component
             */
            get diameterBottom() {
                return this._inputs[3];
            }
            /**
             * Gets the subdivisions input component
             */
            get subdivisions() {
                return this._inputs[4];
            }
            /**
             * Gets the tessellation input component
             */
            get tessellation() {
                return this._inputs[5];
            }
            /**
             * Gets the arc input component
             */
            get arc() {
                return this._inputs[6];
            }
            /**
             * Gets the geometry output component
             */
            get geometry() {
                return this._outputs[0];
            }
            /** @internal */
            autoConfigure() {
                if (!this.diameter.isConnected) {
                    const diameterInput = new GeometryInputBlock("Diameter");
                    diameterInput.value = 1;
                    diameterInput.output.connectTo(this.diameter);
                }
                if (!this.height.isConnected) {
                    const heightInput = new GeometryInputBlock("Height");
                    heightInput.value = 1;
                    heightInput.output.connectTo(this.height);
                }
            }
            _buildBlock(state) {
                const options = {};
                const func = (state) => {
                    options.height = this.height.getConnectedValue(state);
                    options.diameter = this.diameter.getConnectedValue(state);
                    options.diameterTop = this.diameterTop.getConnectedValue(state);
                    options.diameterBottom = this.diameterBottom.getConnectedValue(state);
                    if (options.diameterTop === -1) {
                        options.diameterTop = options.diameter;
                    }
                    if (options.diameterBottom === -1) {
                        options.diameterBottom = options.diameter;
                    }
                    options.tessellation = this.tessellation.getConnectedValue(state);
                    options.subdivisions = this.subdivisions.getConnectedValue(state);
                    options.arc = this.arc.getConnectedValue(state);
                    // Append vertex data from the plane builder
                    return CreateCylinderVertexData(options);
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
export { CylinderBlock };
let _Registered = false;
/**
 * Register side effects for cylinderBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterCylinderBlock() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    RegisterClass("BABYLON.CylinderBlock", CylinderBlock);
}
//# sourceMappingURL=cylinderBlock.pure.js.map