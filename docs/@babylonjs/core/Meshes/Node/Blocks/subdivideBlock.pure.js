/** This file must only contain pure code and pure imports */
import { __esDecorate, __runInitializers } from "../../../tslib.es6.js";
import { Subdivide } from "../../mesh.vertexData.subdivide.js";
import { NodeGeometryBlockConnectionPointTypes } from "../Enums/nodeGeometryConnectionPointTypes.js";
import { NodeGeometryBlock } from "../nodeGeometryBlock.js";
import { editableInPropertyPage } from "../../../Decorators/nodeDecorator.js";
import { RegisterClass } from "../../../Misc/typeStore.js";
/**
 * Block used to subdivide for a geometry using Catmull-Clark algorithm
 */
let SubdivideBlock = (() => {
    var _a;
    let _classSuper = NodeGeometryBlock;
    let _flatOnly_decorators;
    let _flatOnly_initializers = [];
    let _flatOnly_extraInitializers = [];
    let _loopWeight_decorators;
    let _loopWeight_initializers = [];
    let _loopWeight_extraInitializers = [];
    return _a = class SubdivideBlock extends _classSuper {
            /**
             * Creates a new ComputeNormalsBlock
             * @param name defines the block name
             */
            constructor(name) {
                super(name);
                /**
                 * Gets or sets a boolean indicating that this block can evaluate context
                 */
                this.flatOnly = __runInitializers(this, _flatOnly_initializers, false);
                /**
                 * Gets or sets a float defining the loop weight. i.e how much to weigh favoring heavy corners vs favoring Loop's formula
                 */
                this.loopWeight = (__runInitializers(this, _flatOnly_extraInitializers), __runInitializers(this, _loopWeight_initializers, 1.0));
                __runInitializers(this, _loopWeight_extraInitializers);
                this.registerInput("geometry", NodeGeometryBlockConnectionPointTypes.Geometry);
                this.registerInput("level", NodeGeometryBlockConnectionPointTypes.Int, true, 1, 0, 8);
                this.registerOutput("output", NodeGeometryBlockConnectionPointTypes.Geometry);
            }
            /**
             * Gets the current class name
             * @returns the class name
             */
            getClassName() {
                return "SubdivideBlock";
            }
            /**
             * Gets the geometry component
             */
            get geometry() {
                return this._inputs[0];
            }
            /**
             * Gets the level component
             */
            get level() {
                return this._inputs[1];
            }
            /**
             * Gets the output component
             */
            get output() {
                return this._outputs[0];
            }
            _buildBlock() {
                this.output._storedFunction = (state) => {
                    if (!this.geometry.isConnected) {
                        return null;
                    }
                    const vertexData = this.geometry.getConnectedValue(state);
                    if (!vertexData) {
                        return null;
                    }
                    const level = this.level.getConnectedValue(state);
                    return Subdivide(vertexData, level, {
                        flatOnly: this.flatOnly,
                        weight: this.loopWeight,
                    });
                };
            }
            _dumpPropertiesCode() {
                let codeString = super._dumpPropertiesCode() + `${this._codeVariableName}.flatOnly = ${this.flatOnly ? "true" : "false"};\n`;
                codeString += `${this._codeVariableName}.loopWeight = ${this.loopWeight};\n`;
                return codeString;
            }
            /**
             * Serializes this block in a JSON representation
             * @returns the serialized block object
             */
            serialize() {
                const serializationObject = super.serialize();
                serializationObject.flatOnly = this.flatOnly;
                serializationObject.loopWeight = this.loopWeight;
                return serializationObject;
            }
            /** @internal */
            _deserialize(serializationObject) {
                super._deserialize(serializationObject);
                this.flatOnly = serializationObject.flatOnly;
                this.loopWeight = serializationObject.loopWeight;
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _flatOnly_decorators = [editableInPropertyPage("Flat Only", 0 /* PropertyTypeForEdition.Boolean */, "ADVANCED", { embedded: true, notifiers: { rebuild: true } })];
            _loopWeight_decorators = [editableInPropertyPage("Loop weight", 1 /* PropertyTypeForEdition.Float */, "ADVANCED", { embedded: true, min: 0, max: 1, notifiers: { rebuild: true } })];
            __esDecorate(null, null, _flatOnly_decorators, { kind: "field", name: "flatOnly", static: false, private: false, access: { has: obj => "flatOnly" in obj, get: obj => obj.flatOnly, set: (obj, value) => { obj.flatOnly = value; } }, metadata: _metadata }, _flatOnly_initializers, _flatOnly_extraInitializers);
            __esDecorate(null, null, _loopWeight_decorators, { kind: "field", name: "loopWeight", static: false, private: false, access: { has: obj => "loopWeight" in obj, get: obj => obj.loopWeight, set: (obj, value) => { obj.loopWeight = value; } }, metadata: _metadata }, _loopWeight_initializers, _loopWeight_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
export { SubdivideBlock };
let _Registered = false;
/**
 * Register side effects for subdivideBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterSubdivideBlock() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    RegisterClass("BABYLON.SubdivideBlock", SubdivideBlock);
}
//# sourceMappingURL=subdivideBlock.pure.js.map