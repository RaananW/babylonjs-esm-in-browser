/** This file must only contain pure code and pure imports */
import { __esDecorate, __runInitializers } from "../../../tslib.es6.js";
import { NodeGeometryBlockConnectionPointTypes } from "../Enums/nodeGeometryConnectionPointTypes.js";
import { NodeGeometryBlock } from "../nodeGeometryBlock.js";
import { editableInPropertyPage } from "../../../Decorators/nodeDecorator.js";
import { VertexData } from "../../../Meshes/mesh.vertexData.js";
import { WithinEpsilon } from "../../../Maths/math.scalar.functions.js";
import { Epsilon } from "../../../Maths/math.constants.js";
import { RegisterClass } from "../../../Misc/typeStore.js";
/**
 * Block used to extract unique positions from a geometry
 */
let GeometryOptimizeBlock = (() => {
    var _a;
    let _classSuper = NodeGeometryBlock;
    let _evaluateContext_decorators;
    let _evaluateContext_initializers = [];
    let _evaluateContext_extraInitializers = [];
    let _epsilon_decorators;
    let _epsilon_initializers = [];
    let _epsilon_extraInitializers = [];
    let _optimizeFaces_decorators;
    let _optimizeFaces_initializers = [];
    let _optimizeFaces_extraInitializers = [];
    return _a = class GeometryOptimizeBlock extends _classSuper {
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
             * Creates a new GeometryOptimizeBlock
             * @param name defines the block name
             */
            constructor(name) {
                super(name);
                /**
                 * Gets or sets a boolean indicating that this block can evaluate context
                 * Build performance is improved when this value is set to false as the system will cache values instead of reevaluating everything per context change
                 */
                this.evaluateContext = __runInitializers(this, _evaluateContext_initializers, true);
                /**
                 * Define the epsilon used to compare similar positions
                 */
                this.epsilon = (__runInitializers(this, _evaluateContext_extraInitializers), __runInitializers(this, _epsilon_initializers, Epsilon));
                /**
                 * Optimize faces (by removing duplicates)
                 */
                this.optimizeFaces = (__runInitializers(this, _epsilon_extraInitializers), __runInitializers(this, _optimizeFaces_initializers, false));
                __runInitializers(this, _optimizeFaces_extraInitializers);
                this.registerInput("geometry", NodeGeometryBlockConnectionPointTypes.Geometry);
                this.registerInput("selector", NodeGeometryBlockConnectionPointTypes.Int, true);
                this.registerOutput("output", NodeGeometryBlockConnectionPointTypes.Geometry);
            }
            /**
             * Gets the current class name
             * @returns the class name
             */
            getClassName() {
                return "GeometryOptimizeBlock";
            }
            /**
             * Gets the geometry component
             */
            get geometry() {
                return this._inputs[0];
            }
            /**
             * Gets the selector component
             */
            get selector() {
                return this._inputs[1];
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
                    const vertexData = this.geometry.getConnectedValue(state);
                    const newPositions = [];
                    const newIndicesMap = {};
                    const newUVs = [];
                    state.pushExecutionContext(this);
                    state.pushGeometryContext(vertexData);
                    // Optimize positions
                    for (let index = 0; index < vertexData.positions.length; index += 3) {
                        this._currentIndex = index / 3;
                        if (this.selector.isConnected) {
                            const selector = this.selector.getConnectedValue(state);
                            if (!selector) {
                                continue;
                            }
                        }
                        const x = vertexData.positions[index];
                        const y = vertexData.positions[index + 1];
                        const z = vertexData.positions[index + 2];
                        const uvIndex = (index / 3) * 2;
                        const u = vertexData.uvs ? vertexData.uvs[uvIndex] : 0;
                        const v = vertexData.uvs ? vertexData.uvs[uvIndex + 1] : 0;
                        // check if we already have it
                        let found = false;
                        for (let checkIndex = 0; checkIndex < newPositions.length; checkIndex += 3) {
                            if (WithinEpsilon(x, newPositions[checkIndex], this.epsilon) &&
                                WithinEpsilon(y, newPositions[checkIndex + 1], this.epsilon) &&
                                WithinEpsilon(z, newPositions[checkIndex + 2], this.epsilon)) {
                                newIndicesMap[index / 3] = checkIndex / 3;
                                found = true;
                                continue;
                            }
                        }
                        if (!found) {
                            newIndicesMap[index / 3] = newPositions.length / 3;
                            newPositions.push(x, y, z);
                            newUVs.push(u, v);
                        }
                    }
                    const newVertexData = new VertexData();
                    newVertexData.positions = newPositions;
                    if (vertexData.uvs) {
                        newVertexData.uvs = newUVs;
                    }
                    const indices = vertexData.indices.map((index) => newIndicesMap[index]);
                    const newIndices = [];
                    if (this.optimizeFaces) {
                        // Optimize indices
                        for (let index = 0; index < indices.length; index += 3) {
                            const a = indices[index];
                            const b = indices[index + 1];
                            const c = indices[index + 2];
                            if (a === b || b == c || c === a) {
                                continue;
                            }
                            // check if we already have it
                            let found = false;
                            for (let checkIndex = 0; checkIndex < newIndices.length; checkIndex += 3) {
                                if (a === newIndices[checkIndex] && b === newIndices[checkIndex + 1] && c === newIndices[checkIndex + 2]) {
                                    found = true;
                                    continue;
                                }
                                if (a === newIndices[checkIndex + 1] && b === newIndices[checkIndex + 2] && c === newIndices[checkIndex]) {
                                    found = true;
                                    continue;
                                }
                                if (a === newIndices[checkIndex + 2] && b === newIndices[checkIndex] && c === newIndices[checkIndex + 1]) {
                                    found = true;
                                    continue;
                                }
                            }
                            if (!found) {
                                newIndices.push(a, b, c);
                            }
                        }
                        newVertexData.indices = newIndices;
                    }
                    else {
                        newVertexData.indices = indices;
                    }
                    state.restoreGeometryContext();
                    state.restoreExecutionContext();
                    return newVertexData;
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
                let codeString = super._dumpPropertiesCode() + `${this._codeVariableName}.evaluateContext = ${this.evaluateContext ? "true" : "false"};\n`;
                codeString += `${this._codeVariableName}.epsilon = ${this.epsilon};\n`;
                codeString += `${this._codeVariableName}.optimizeFaces = ${this.optimizeFaces ? "true" : "false"};\n`;
                return codeString;
            }
            /**
             * Serializes this block in a JSON representation
             * @returns the serialized block object
             */
            serialize() {
                const serializationObject = super.serialize();
                serializationObject.evaluateContext = this.evaluateContext;
                serializationObject.epsilon = this.epsilon;
                serializationObject.optimizeFaces = this.optimizeFaces;
                return serializationObject;
            }
            /** @internal */
            _deserialize(serializationObject) {
                super._deserialize(serializationObject);
                this.evaluateContext = serializationObject.evaluateContext;
                this.epsilon = serializationObject.epsilon;
                this.optimizeFaces = serializationObject.optimizeFaces;
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _evaluateContext_decorators = [editableInPropertyPage("Evaluate context", 0 /* PropertyTypeForEdition.Boolean */, "ADVANCED", { embedded: true, notifiers: { rebuild: true } })];
            _epsilon_decorators = [editableInPropertyPage("Epsilon", 1 /* PropertyTypeForEdition.Float */, "ADVANCED", { embedded: true, notifiers: { rebuild: true } })];
            _optimizeFaces_decorators = [editableInPropertyPage("Optimize faces", 0 /* PropertyTypeForEdition.Boolean */, "ADVANCED", { embedded: true, notifiers: { rebuild: true } })];
            __esDecorate(null, null, _evaluateContext_decorators, { kind: "field", name: "evaluateContext", static: false, private: false, access: { has: obj => "evaluateContext" in obj, get: obj => obj.evaluateContext, set: (obj, value) => { obj.evaluateContext = value; } }, metadata: _metadata }, _evaluateContext_initializers, _evaluateContext_extraInitializers);
            __esDecorate(null, null, _epsilon_decorators, { kind: "field", name: "epsilon", static: false, private: false, access: { has: obj => "epsilon" in obj, get: obj => obj.epsilon, set: (obj, value) => { obj.epsilon = value; } }, metadata: _metadata }, _epsilon_initializers, _epsilon_extraInitializers);
            __esDecorate(null, null, _optimizeFaces_decorators, { kind: "field", name: "optimizeFaces", static: false, private: false, access: { has: obj => "optimizeFaces" in obj, get: obj => obj.optimizeFaces, set: (obj, value) => { obj.optimizeFaces = value; } }, metadata: _metadata }, _optimizeFaces_initializers, _optimizeFaces_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
export { GeometryOptimizeBlock };
let _Registered = false;
/**
 * Register side effects for geometryOptimizeBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterGeometryOptimizeBlock() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    RegisterClass("BABYLON.GeometryOptimizeBlock", GeometryOptimizeBlock);
}
//# sourceMappingURL=geometryOptimizeBlock.pure.js.map