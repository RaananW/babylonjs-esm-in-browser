/** This file must only contain pure code and pure imports */
import { __esDecorate, __runInitializers } from "../../../../tslib.es6.js";
import { NodeGeometryBlock } from "../../nodeGeometryBlock.js";
import { NodeGeometryBlockConnectionPointTypes } from "../../Enums/nodeGeometryConnectionPointTypes.js";
import { VertexDataMaterialInfo } from "../../../../Meshes/mesh.vertexData.js";
import { editableInPropertyPage } from "../../../../Decorators/nodeDecorator.js";
import { RegisterClass } from "../../../../Misc/typeStore.js";
/**
 * Block used to affect a material ID to a geometry
 */
let SetMaterialIDBlock = (() => {
    var _a;
    let _classSuper = NodeGeometryBlock;
    let _evaluateContext_decorators;
    let _evaluateContext_initializers = [];
    let _evaluateContext_extraInitializers = [];
    return _a = class SetMaterialIDBlock extends _classSuper {
            /**
             * Create a new SetMaterialIDBlock
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
                this.registerInput("id", NodeGeometryBlockConnectionPointTypes.Int, true, 0);
                this.registerOutput("output", NodeGeometryBlockConnectionPointTypes.Geometry);
                this.id.acceptedConnectionPointTypes.push(NodeGeometryBlockConnectionPointTypes.Float);
            }
            /**
             * Gets the current class name
             * @returns the class name
             */
            getClassName() {
                return "SetMaterialIDBlock";
            }
            /**
             * Gets the geometry input component
             */
            get geometry() {
                return this._inputs[0];
            }
            /**
             * Gets the id input component
             */
            get id() {
                return this._inputs[1];
            }
            /**
             * Gets the geometry output component
             */
            get output() {
                return this._outputs[0];
            }
            _buildBlock(state) {
                if (!this.geometry.isConnected) {
                    this.output._storedFunction = null;
                    this.output._storedValue = null;
                    return;
                }
                const func = (state) => {
                    const vertexData = this.geometry.getConnectedValue(state);
                    if (!vertexData || !vertexData.indices || !vertexData.positions) {
                        return vertexData;
                    }
                    const materialInfo = new VertexDataMaterialInfo();
                    materialInfo.materialIndex = this.id.getConnectedValue(state) | 0;
                    materialInfo.indexStart = 0;
                    materialInfo.indexCount = vertexData.indices.length;
                    materialInfo.verticesStart = 0;
                    materialInfo.verticesCount = vertexData.positions.length / 3;
                    vertexData.materialInfos = [materialInfo];
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
export { SetMaterialIDBlock };
let _Registered = false;
/**
 * Register side effects for setMaterialIDBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterSetMaterialIDBlock() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    RegisterClass("BABYLON.SetMaterialIDBlock", SetMaterialIDBlock);
}
//# sourceMappingURL=setMaterialIDBlock.pure.js.map