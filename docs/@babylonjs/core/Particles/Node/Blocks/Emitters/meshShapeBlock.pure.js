/** This file must only contain pure code and pure imports */
import { __esDecorate, __runInitializers } from "../../../../tslib.es6.js";
import { VertexData } from "../../../../Meshes/mesh.vertexData.js";
import { editableInPropertyPage } from "../../../../Decorators/nodeDecorator.js";
import { NodeParticleBlock } from "../../nodeParticleBlock.js";
import { NodeParticleBlockConnectionPointTypes } from "../../Enums/nodeParticleBlockConnectionPointTypes.js";
import { TmpVectors, Vector3, Vector4 } from "../../../../Maths/math.vector.pure.js";
import { RandomRange } from "../../../../Maths/math.scalar.functions.js";
import { _CreateLocalPositionData } from "./emitters.functions.js";
import { RegisterClass } from "../../../../Misc/typeStore.js";
/**
 * Defines a block used to generate particle shape from mesh geometry data
 */
let MeshShapeBlock = (() => {
    var _a;
    let _classSuper = NodeParticleBlock;
    let _serializedCachedData_decorators;
    let _serializedCachedData_initializers = [];
    let _serializedCachedData_extraInitializers = [];
    let _useMeshNormalsForDirection_decorators;
    let _useMeshNormalsForDirection_initializers = [];
    let _useMeshNormalsForDirection_extraInitializers = [];
    let _useMeshColorForColor_decorators;
    let _useMeshColorForColor_initializers = [];
    let _useMeshColorForColor_extraInitializers = [];
    let _worldSpace_decorators;
    let _worldSpace_initializers = [];
    let _worldSpace_extraInitializers = [];
    return _a = class MeshShapeBlock extends _classSuper {
            /**
             * Gets or sets the mesh to use to get vertex data
             */
            get mesh() {
                return this._mesh;
            }
            set mesh(value) {
                this._mesh = value;
            }
            /**
             * Create a new MeshShapeBlock
             * @param name defines the block name
             */
            constructor(name) {
                super(name);
                this._cachedVertexData = null;
                this._indices = null;
                this._positions = null;
                this._normals = null;
                this._colors = null;
                this._storedNormal = Vector3.Zero();
                /**
                 * Gets or sets a boolean indicating that this block should serialize its cached data
                 */
                this.serializedCachedData = __runInitializers(this, _serializedCachedData_initializers, false);
                /**
                 * Gets or sets a boolean indicating if the mesh normals should be used for particle direction
                 */
                this.useMeshNormalsForDirection = (__runInitializers(this, _serializedCachedData_extraInitializers), __runInitializers(this, _useMeshNormalsForDirection_initializers, true));
                /**
                 * Gets or sets a boolean indicating if the mesh colors should be used for particle color
                 */
                this.useMeshColorForColor = (__runInitializers(this, _useMeshNormalsForDirection_extraInitializers), __runInitializers(this, _useMeshColorForColor_initializers, false));
                /**
                 * Gets or sets a boolean indicating if the coordinates should be in world space (local space by default)
                 */
                this.worldSpace = (__runInitializers(this, _useMeshColorForColor_extraInitializers), __runInitializers(this, _worldSpace_initializers, false));
                __runInitializers(this, _worldSpace_extraInitializers);
                this.registerInput("particle", NodeParticleBlockConnectionPointTypes.Particle);
                this.registerInput("direction1", NodeParticleBlockConnectionPointTypes.Vector3, true, new Vector3(0, 1.0, 0));
                this.registerInput("direction2", NodeParticleBlockConnectionPointTypes.Vector3, true, new Vector3(0, 1.0, 0));
                this.registerOutput("output", NodeParticleBlockConnectionPointTypes.Particle);
            }
            /**
             * Gets the current class name
             * @returns the class name
             */
            getClassName() {
                return "MeshShapeBlock";
            }
            /**
             * Gets a boolean indicating if the block is using cached data
             */
            get isUsingCachedData() {
                return !this.mesh && !!this._cachedVertexData;
            }
            /**
             * Gets the particle component
             */
            get particle() {
                return this._inputs[0];
            }
            /**
             * Gets the direction1 input component
             */
            get direction1() {
                return this._inputs[1];
            }
            /**
             * Gets the direction2 input component
             */
            get direction2() {
                return this._inputs[2];
            }
            /**
             * Gets the output component
             */
            get output() {
                return this._outputs[0];
            }
            /**
             * Remove stored data
             */
            cleanData() {
                this._mesh = null;
                this._cachedVertexData = null;
            }
            /**
             * Builds the block
             * @param state defines the build state
             */
            _build(state) {
                const system = this.particle.getConnectedValue(state);
                if (!this._mesh && !this._cachedVertexData) {
                    this.output._storedValue = system;
                    return;
                }
                if (this._mesh) {
                    this._cachedVertexData = VertexData.ExtractFromMesh(this._mesh, false, true);
                }
                if (!this._cachedVertexData) {
                    this.output._storedValue = system;
                    return;
                }
                this._indices = this._cachedVertexData.indices;
                this._positions = this._cachedVertexData.positions;
                this._normals = this._cachedVertexData.normals;
                this._colors = this._cachedVertexData.colors;
                if (this.useMeshColorForColor && this._colors) {
                    system._colorCreation.process = () => { };
                }
                system._directionCreation.process = (particle) => {
                    state.particleContext = particle;
                    state.systemContext = system;
                    if (this.useMeshNormalsForDirection && this._normals) {
                        if (system.isLocal) {
                            particle.direction.copyFrom(this._storedNormal);
                        }
                        else {
                            Vector3.TransformNormalToRef(this._storedNormal, state.emitterWorldMatrix, particle.direction);
                        }
                        return;
                    }
                    const direction1 = this.direction1.getConnectedValue(state);
                    const direction2 = this.direction2.getConnectedValue(state);
                    const randX = RandomRange(direction1.x, direction2.x);
                    const randY = RandomRange(direction1.y, direction2.y);
                    const randZ = RandomRange(direction1.z, direction2.z);
                    if (system.isLocal) {
                        particle.direction.copyFromFloats(randX, randY, randZ);
                    }
                    else {
                        Vector3.TransformNormalFromFloatsToRef(randX, randY, randZ, state.emitterWorldMatrix, particle.direction);
                    }
                    particle._properties.initialDirection = particle.direction.clone();
                };
                system._positionCreation.process = (particle) => {
                    state.particleContext = particle;
                    state.systemContext = system;
                    if (!this._indices || !this._positions) {
                        return;
                    }
                    const randomFaceIndex = 3 * ((Math.random() * (this._indices.length / 3)) | 0);
                    const bu = Math.random();
                    const bv = Math.random() * (1.0 - bu);
                    const bw = 1.0 - bu - bv;
                    const faceIndexA = this._indices[randomFaceIndex];
                    const faceIndexB = this._indices[randomFaceIndex + 1];
                    const faceIndexC = this._indices[randomFaceIndex + 2];
                    const vertexA = TmpVectors.Vector3[0];
                    const vertexB = TmpVectors.Vector3[1];
                    const vertexC = TmpVectors.Vector3[2];
                    const randomVertex = TmpVectors.Vector3[3];
                    Vector3.FromArrayToRef(this._positions, faceIndexA * 3, vertexA);
                    Vector3.FromArrayToRef(this._positions, faceIndexB * 3, vertexB);
                    Vector3.FromArrayToRef(this._positions, faceIndexC * 3, vertexC);
                    randomVertex.x = bu * vertexA.x + bv * vertexB.x + bw * vertexC.x;
                    randomVertex.y = bu * vertexA.y + bv * vertexB.y + bw * vertexC.y;
                    randomVertex.z = bu * vertexA.z + bv * vertexB.z + bw * vertexC.z;
                    if (this.worldSpace && this.mesh) {
                        Vector3.TransformCoordinatesFromFloatsToRef(randomVertex.x, randomVertex.y, randomVertex.z, this.mesh.getWorldMatrix(), randomVertex);
                    }
                    if (system.isLocal) {
                        particle.position.copyFromFloats(randomVertex.x, randomVertex.y, randomVertex.z);
                    }
                    else {
                        Vector3.TransformCoordinatesFromFloatsToRef(randomVertex.x, randomVertex.y, randomVertex.z, state.emitterWorldMatrix, particle.position);
                    }
                    _CreateLocalPositionData(particle);
                    if (this.useMeshNormalsForDirection && this._normals) {
                        Vector3.FromArrayToRef(this._normals, faceIndexA * 3, vertexA);
                        Vector3.FromArrayToRef(this._normals, faceIndexB * 3, vertexB);
                        Vector3.FromArrayToRef(this._normals, faceIndexC * 3, vertexC);
                        this._storedNormal.x = bu * vertexA.x + bv * vertexB.x + bw * vertexC.x;
                        this._storedNormal.y = bu * vertexA.y + bv * vertexB.y + bw * vertexC.y;
                        this._storedNormal.z = bu * vertexA.z + bv * vertexB.z + bw * vertexC.z;
                    }
                    if (this.useMeshColorForColor && this._colors) {
                        Vector4.FromArrayToRef(this._colors, faceIndexA * 4, TmpVectors.Vector4[0]);
                        Vector4.FromArrayToRef(this._colors, faceIndexB * 4, TmpVectors.Vector4[1]);
                        Vector4.FromArrayToRef(this._colors, faceIndexC * 4, TmpVectors.Vector4[2]);
                        particle.color.copyFromFloats(bu * TmpVectors.Vector4[0].x + bv * TmpVectors.Vector4[1].x + bw * TmpVectors.Vector4[2].x, bu * TmpVectors.Vector4[0].y + bv * TmpVectors.Vector4[1].y + bw * TmpVectors.Vector4[2].y, bu * TmpVectors.Vector4[0].z + bv * TmpVectors.Vector4[1].z + bw * TmpVectors.Vector4[2].z, bu * TmpVectors.Vector4[0].w + bv * TmpVectors.Vector4[1].w + bw * TmpVectors.Vector4[2].w);
                    }
                };
                this.output._storedValue = system;
            }
            /**
             * Serializes this block in a JSON representation
             * @returns the serialized block object
             */
            serialize() {
                const serializationObject = super.serialize();
                serializationObject.serializedCachedData = this.serializedCachedData;
                if (this.serializedCachedData) {
                    if (this._mesh) {
                        serializationObject.cachedVertexData = VertexData.ExtractFromMesh(this._mesh, false, true).serialize();
                    }
                    else if (this._cachedVertexData) {
                        serializationObject.cachedVertexData = this._cachedVertexData.serialize();
                    }
                }
                serializationObject.useMeshNormalsForDirection = this.useMeshNormalsForDirection;
                serializationObject.useMeshColorForColor = this.useMeshColorForColor;
                serializationObject.worldSpace = this.worldSpace;
                return serializationObject;
            }
            _deserialize(serializationObject) {
                super._deserialize(serializationObject);
                if (serializationObject.cachedVertexData) {
                    this._cachedVertexData = VertexData.Parse(serializationObject.cachedVertexData);
                }
                this.serializedCachedData = !!serializationObject.serializedCachedData;
                this.useMeshNormalsForDirection = !!serializationObject.useMeshNormalsForDirection;
                this.useMeshColorForColor = !!serializationObject.useMeshColorForColor;
                this.worldSpace = !!serializationObject.worldSpace;
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _serializedCachedData_decorators = [editableInPropertyPage("Serialize cached data", 0 /* PropertyTypeForEdition.Boolean */, "ADVANCED", { embedded: true, notifiers: { rebuild: true } })];
            _useMeshNormalsForDirection_decorators = [editableInPropertyPage("Use normals for direction", 0 /* PropertyTypeForEdition.Boolean */, "ADVANCED", { embedded: true, notifiers: { rebuild: true } })];
            _useMeshColorForColor_decorators = [editableInPropertyPage("Use vertex color for color", 0 /* PropertyTypeForEdition.Boolean */, "ADVANCED", { embedded: true, notifiers: { rebuild: true } })];
            _worldSpace_decorators = [editableInPropertyPage("World space", 0 /* PropertyTypeForEdition.Boolean */, "ADVANCED", { embedded: true, notifiers: { rebuild: true } })];
            __esDecorate(null, null, _serializedCachedData_decorators, { kind: "field", name: "serializedCachedData", static: false, private: false, access: { has: obj => "serializedCachedData" in obj, get: obj => obj.serializedCachedData, set: (obj, value) => { obj.serializedCachedData = value; } }, metadata: _metadata }, _serializedCachedData_initializers, _serializedCachedData_extraInitializers);
            __esDecorate(null, null, _useMeshNormalsForDirection_decorators, { kind: "field", name: "useMeshNormalsForDirection", static: false, private: false, access: { has: obj => "useMeshNormalsForDirection" in obj, get: obj => obj.useMeshNormalsForDirection, set: (obj, value) => { obj.useMeshNormalsForDirection = value; } }, metadata: _metadata }, _useMeshNormalsForDirection_initializers, _useMeshNormalsForDirection_extraInitializers);
            __esDecorate(null, null, _useMeshColorForColor_decorators, { kind: "field", name: "useMeshColorForColor", static: false, private: false, access: { has: obj => "useMeshColorForColor" in obj, get: obj => obj.useMeshColorForColor, set: (obj, value) => { obj.useMeshColorForColor = value; } }, metadata: _metadata }, _useMeshColorForColor_initializers, _useMeshColorForColor_extraInitializers);
            __esDecorate(null, null, _worldSpace_decorators, { kind: "field", name: "worldSpace", static: false, private: false, access: { has: obj => "worldSpace" in obj, get: obj => obj.worldSpace, set: (obj, value) => { obj.worldSpace = value; } }, metadata: _metadata }, _worldSpace_initializers, _worldSpace_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
export { MeshShapeBlock };
let _Registered = false;
/**
 * Register side effects for meshShapeBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterMeshShapeBlock() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    RegisterClass("BABYLON.MeshShapeBlock", MeshShapeBlock);
}
//# sourceMappingURL=meshShapeBlock.pure.js.map