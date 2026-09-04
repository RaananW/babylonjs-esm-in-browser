/** This file must only contain pure code and pure imports */
import { __esDecorate, __runInitializers } from "../../../tslib.es6.js";
import { NodeGeometryBlock } from "../nodeGeometryBlock.js";
import { NodeGeometryBlockConnectionPointTypes } from "../Enums/nodeGeometryConnectionPointTypes.js";
import { editableInPropertyPage } from "../../../Decorators/nodeDecorator.js";
import { Vector3 } from "../../../Maths/math.vector.pure.js";
import { VertexData } from "../../mesh.vertexData.js";
import { RegisterClass } from "../../../Misc/typeStore.js";
/**
 * Cap mode for the extrusion
 */
export var ExtrudeGeometryCap;
(function (ExtrudeGeometryCap) {
    /** No caps — only the extruded side walls are generated */
    ExtrudeGeometryCap[ExtrudeGeometryCap["NoCap"] = 0] = "NoCap";
    /** Cap the bottom face (the original input geometry face) */
    ExtrudeGeometryCap[ExtrudeGeometryCap["CapStart"] = 1] = "CapStart";
    /** Cap the top face (the offset/extruded geometry face) */
    ExtrudeGeometryCap[ExtrudeGeometryCap["CapEnd"] = 2] = "CapEnd";
    /** Cap both the bottom and top faces (default). Creates a solid */
    ExtrudeGeometryCap[ExtrudeGeometryCap["CapAll"] = 3] = "CapAll";
})(ExtrudeGeometryCap || (ExtrudeGeometryCap = {}));
/**
 * Block used to extrude a geometry along its face normals
 */
let ExtrudeGeometryBlock = (() => {
    var _a;
    let _classSuper = NodeGeometryBlock;
    let _evaluateContext_decorators;
    let _evaluateContext_initializers = [];
    let _evaluateContext_extraInitializers = [];
    let _cap_decorators;
    let _cap_initializers = [];
    let _cap_extraInitializers = [];
    return _a = class ExtrudeGeometryBlock extends _classSuper {
            /**
             * Create a new ExtrudeGeometryBlock
             * @param name defines the block name
             */
            constructor(name) {
                super(name);
                /**
                 * Gets or sets a boolean indicating that this block can evaluate context
                 * Build performance is improved when this value is set to false as the system will cache values instead of reevaluating everything per context change
                 */
                this.evaluateContext = __runInitializers(this, _evaluateContext_initializers, false);
                /**
                 * Gets or sets the cap mode for the extrusion
                 */
                this.cap = (__runInitializers(this, _evaluateContext_extraInitializers), __runInitializers(this, _cap_initializers, ExtrudeGeometryCap.CapAll));
                __runInitializers(this, _cap_extraInitializers);
                this.registerInput("geometry", NodeGeometryBlockConnectionPointTypes.Geometry);
                this.registerInput("depth", NodeGeometryBlockConnectionPointTypes.Float, true, 1.0);
                this.registerOutput("output", NodeGeometryBlockConnectionPointTypes.Geometry);
            }
            /**
             * Gets the current class name
             * @returns the class name
             */
            getClassName() {
                return "ExtrudeGeometryBlock";
            }
            /**
             * Gets the geometry input component
             */
            get geometry() {
                return this._inputs[0];
            }
            /**
             * Gets the depth input component
             */
            get depth() {
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
                    const inputGeometry = this.geometry.getConnectedValue(state);
                    if (!inputGeometry || !inputGeometry.positions || !inputGeometry.indices) {
                        return null;
                    }
                    const vertexData = inputGeometry.clone();
                    const positions = vertexData.positions;
                    const indices = vertexData.indices;
                    const depthValue = this.depth.getConnectedValue(state) ?? 1.0;
                    if (depthValue === 0) {
                        return vertexData;
                    }
                    // Step 2: Compute average face normal
                    const normal = new Vector3(0, 0, 0);
                    const v0 = new Vector3();
                    const v1 = new Vector3();
                    const v2 = new Vector3();
                    const edge1 = new Vector3();
                    const edge2 = new Vector3();
                    const faceNormal = new Vector3();
                    for (let i = 0; i < indices.length; i += 3) {
                        const i0 = indices[i];
                        const i1 = indices[i + 1];
                        const i2 = indices[i + 2];
                        v0.set(positions[i0 * 3], positions[i0 * 3 + 1], positions[i0 * 3 + 2]);
                        v1.set(positions[i1 * 3], positions[i1 * 3 + 1], positions[i1 * 3 + 2]);
                        v2.set(positions[i2 * 3], positions[i2 * 3 + 1], positions[i2 * 3 + 2]);
                        v1.subtractToRef(v0, edge1);
                        v2.subtractToRef(v0, edge2);
                        Vector3.CrossToRef(edge1, edge2, faceNormal);
                        normal.addInPlace(faceNormal);
                    }
                    if (normal.lengthSquared() < 1e-10) {
                        normal.set(0, 1, 0);
                    }
                    else {
                        normal.normalize();
                    }
                    // Step 3: Create offset positions
                    const offset = normal.scale(depthValue);
                    const vertexCount = positions.length / 3;
                    const bottomPositions = new Float32Array(positions);
                    const topPositions = new Float32Array(vertexCount * 3);
                    for (let i = 0; i < vertexCount; i++) {
                        topPositions[i * 3] = positions[i * 3] + offset.x;
                        topPositions[i * 3 + 1] = positions[i * 3 + 1] + offset.y;
                        topPositions[i * 3 + 2] = positions[i * 3 + 2] + offset.z;
                    }
                    // Step 4: Detect boundary edges
                    const edgeCount = new Map();
                    for (let i = 0; i < indices.length; i += 3) {
                        const triIdx = i;
                        const triVerts = [indices[i], indices[i + 1], indices[i + 2]];
                        for (let e = 0; e < 3; e++) {
                            const a = triVerts[e];
                            const b = triVerts[(e + 1) % 3];
                            const key = Math.min(a, b) + "_" + Math.max(a, b);
                            const existing = edgeCount.get(key);
                            if (existing) {
                                existing.count++;
                            }
                            else {
                                edgeCount.set(key, { count: 1, triIndex: triIdx });
                            }
                        }
                    }
                    // Collect boundary edges with winding info
                    const boundaryEdges = [];
                    for (const [key, value] of Array.from(edgeCount)) {
                        if (value.count === 1) {
                            const parts = key.split("_");
                            const minV = parseInt(parts[0]);
                            const maxV = parseInt(parts[1]);
                            // Check original winding order in the triangle
                            const ti = value.triIndex;
                            const t0 = indices[ti];
                            const t1 = indices[ti + 1];
                            const t2 = indices[ti + 2];
                            // Determine if edge (minV, maxV) appears in order or reversed in the triangle
                            let inOrder = false;
                            if ((t0 === minV && t1 === maxV) || (t1 === minV && t2 === maxV) || (t2 === minV && t0 === maxV)) {
                                inOrder = true;
                            }
                            boundaryEdges.push({ a: minV, b: maxV, orderedAb: inOrder });
                        }
                    }
                    // Step 5: Generate side wall faces
                    const sideIndices = [];
                    for (const edge of boundaryEdges) {
                        const a = edge.a;
                        const b = edge.b;
                        const aTop = a + vertexCount;
                        const bTop = b + vertexCount;
                        if (edge.orderedAb) {
                            // Edge appears as (a, b) in triangle — outward normals
                            sideIndices.push(a, b, bTop);
                            sideIndices.push(a, bTop, aTop);
                        }
                        else {
                            // Edge appears as (b, a) in triangle — reverse winding
                            sideIndices.push(b, a, aTop);
                            sideIndices.push(b, aTop, bTop);
                        }
                    }
                    // Step 6: Assemble final VertexData
                    const capStart = (this.cap & ExtrudeGeometryCap.CapStart) !== 0;
                    const capEnd = (this.cap & ExtrudeGeometryCap.CapEnd) !== 0;
                    // Build indices
                    const finalIndices = [];
                    // Bottom cap: original indices
                    if (capStart) {
                        for (let i = 0; i < indices.length; i++) {
                            finalIndices.push(indices[i]);
                        }
                    }
                    // Top cap: original indices offset by vertexCount, reversed winding
                    if (capEnd) {
                        for (let i = 0; i < indices.length; i += 3) {
                            finalIndices.push(indices[i] + vertexCount);
                            finalIndices.push(indices[i + 2] + vertexCount);
                            finalIndices.push(indices[i + 1] + vertexCount);
                        }
                    }
                    // Side walls
                    for (let i = 0; i < sideIndices.length; i++) {
                        finalIndices.push(sideIndices[i]);
                    }
                    // Build positions: [bottom, top]
                    const finalPositions = new Float32Array(vertexCount * 2 * 3);
                    finalPositions.set(bottomPositions, 0);
                    finalPositions.set(topPositions, vertexCount * 3);
                    // Build the result VertexData
                    const result = new VertexData();
                    result.positions = Array.from(finalPositions);
                    result.indices = finalIndices;
                    // Duplicate UVs if present
                    if (vertexData.uvs) {
                        const uvs = vertexData.uvs;
                        const finalUVs = new Float32Array(vertexCount * 2 * 2);
                        finalUVs.set(new Float32Array(uvs), 0);
                        finalUVs.set(new Float32Array(uvs), vertexCount * 2);
                        result.uvs = Array.from(finalUVs);
                    }
                    // Duplicate colors if present
                    if (vertexData.colors) {
                        const colors = vertexData.colors;
                        const finalColors = new Float32Array(vertexCount * 2 * 4);
                        finalColors.set(new Float32Array(colors), 0);
                        finalColors.set(new Float32Array(colors), vertexCount * 4);
                        result.colors = Array.from(finalColors);
                    }
                    // Duplicate tangents if present
                    if (vertexData.tangents) {
                        const tangents = vertexData.tangents;
                        const finalTangents = new Float32Array(vertexCount * 2 * 4);
                        finalTangents.set(new Float32Array(tangents), 0);
                        finalTangents.set(new Float32Array(tangents), vertexCount * 4);
                        result.tangents = Array.from(finalTangents);
                    }
                    // Duplicate UV2-UV6 if present
                    const uvSets = ["uvs2", "uvs3", "uvs4", "uvs5", "uvs6"];
                    for (const uvSet of uvSets) {
                        const uvData = vertexData[uvSet];
                        if (uvData) {
                            const finalUV = new Float32Array(vertexCount * 2 * 2);
                            finalUV.set(new Float32Array(uvData), 0);
                            finalUV.set(new Float32Array(uvData), vertexCount * 2);
                            result[uvSet] = Array.from(finalUV);
                        }
                    }
                    // Compute normals using the simplified approach
                    const normals = [];
                    VertexData.ComputeNormals(result.positions, result.indices, normals);
                    result.normals = normals;
                    return result;
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
                codeString += `${this._codeVariableName}.cap = BABYLON.ExtrudeGeometryCap.${ExtrudeGeometryCap[this.cap]};\n`;
                return codeString;
            }
            /**
             * Serializes this block in a JSON representation
             * @returns the serialized block object
             */
            serialize() {
                const serializationObject = super.serialize();
                serializationObject.evaluateContext = this.evaluateContext;
                serializationObject.cap = this.cap;
                return serializationObject;
            }
            /** @internal */
            _deserialize(serializationObject) {
                super._deserialize(serializationObject);
                if (serializationObject.evaluateContext !== undefined) {
                    this.evaluateContext = serializationObject.evaluateContext;
                }
                if (serializationObject.cap !== undefined) {
                    this.cap = serializationObject.cap;
                }
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _evaluateContext_decorators = [editableInPropertyPage("Evaluate context", 0 /* PropertyTypeForEdition.Boolean */, "ADVANCED", { embedded: true, notifiers: { rebuild: true } })];
            _cap_decorators = [editableInPropertyPage("Cap", 5 /* PropertyTypeForEdition.List */, "ADVANCED", {
                    notifiers: { rebuild: true },
                    embedded: true,
                    options: [
                        { label: "No Cap", value: ExtrudeGeometryCap.NoCap },
                        { label: "Cap Start", value: ExtrudeGeometryCap.CapStart },
                        { label: "Cap End", value: ExtrudeGeometryCap.CapEnd },
                        { label: "Cap All", value: ExtrudeGeometryCap.CapAll },
                    ],
                })];
            __esDecorate(null, null, _evaluateContext_decorators, { kind: "field", name: "evaluateContext", static: false, private: false, access: { has: obj => "evaluateContext" in obj, get: obj => obj.evaluateContext, set: (obj, value) => { obj.evaluateContext = value; } }, metadata: _metadata }, _evaluateContext_initializers, _evaluateContext_extraInitializers);
            __esDecorate(null, null, _cap_decorators, { kind: "field", name: "cap", static: false, private: false, access: { has: obj => "cap" in obj, get: obj => obj.cap, set: (obj, value) => { obj.cap = value; } }, metadata: _metadata }, _cap_initializers, _cap_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
export { ExtrudeGeometryBlock };
let _Registered = false;
/**
 * Register side effects for extrudeGeometryBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterExtrudeGeometryBlock() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    RegisterClass("BABYLON.ExtrudeGeometryBlock", ExtrudeGeometryBlock);
}
//# sourceMappingURL=extrudeGeometryBlock.pure.js.map