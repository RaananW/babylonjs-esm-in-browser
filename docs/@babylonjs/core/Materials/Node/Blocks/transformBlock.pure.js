/** This file must only contain pure code and pure imports */
import { __esDecorate, __runInitializers } from "../../../tslib.es6.js";
import { NodeMaterialBlock } from "../nodeMaterialBlock.js";
import { NodeMaterialBlockConnectionPointTypes } from "../Enums/nodeMaterialBlockConnectionPointTypes.js";
import { NodeMaterialBlockTargets } from "../Enums/nodeMaterialBlockTargets.js";
import { editableInPropertyPage } from "../../../Decorators/nodeDecorator.js";
import { RegisterClass } from "../../../Misc/typeStore.js";
/**
 * Block used to transform a vector (2, 3 or 4) with a matrix. It will generate a Vector4
 */
let TransformBlock = (() => {
    var _a;
    let _classSuper = NodeMaterialBlock;
    let _instanceExtraInitializers = [];
    let _get_transformAsDirection_decorators;
    return _a = class TransformBlock extends _classSuper {
            /**
             * Boolean indicating if the transformation is made for a direction vector and not a position vector
             * If set to true the complementW value will be set to 0 else it will be set to 1
             */
            get transformAsDirection() {
                return this.complementW === 0;
            }
            set transformAsDirection(value) {
                this.complementW = value ? 0 : 1;
            }
            /**
             * Creates a new TransformBlock
             * @param name defines the block name
             */
            constructor(name) {
                super(name, NodeMaterialBlockTargets.Neutral);
                /**
                 * Defines the value to use to complement W value to transform it to a Vector4
                 */
                this.complementW = (__runInitializers(this, _instanceExtraInitializers), 1);
                /**
                 * Defines the value to use to complement z value to transform it to a Vector4
                 */
                this.complementZ = 0;
                this.target = NodeMaterialBlockTargets.Vertex;
                this.registerInput("vector", NodeMaterialBlockConnectionPointTypes.AutoDetect);
                this.registerInput("transform", NodeMaterialBlockConnectionPointTypes.Matrix);
                this.registerOutput("output", NodeMaterialBlockConnectionPointTypes.Vector4);
                this.registerOutput("xyz", NodeMaterialBlockConnectionPointTypes.Vector3);
                this._inputs[0].onConnectionObservable.add((other) => {
                    if (other.ownerBlock.isInput) {
                        const otherAsInput = other.ownerBlock;
                        if (otherAsInput.name === "normal" || otherAsInput.name === "tangent") {
                            this.complementW = 0;
                        }
                    }
                });
            }
            /**
             * Gets the current class name
             * @returns the class name
             */
            getClassName() {
                return "TransformBlock";
            }
            /**
             * Initialize the block and prepare the context for build
             * @param state defines the state that will be used for the build
             */
            initialize(state) {
                // eslint-disable-next-line @typescript-eslint/no-floating-promises
                this._initShaderSourceAsync(state.shaderLanguage);
            }
            async _initShaderSourceAsync(shaderLanguage) {
                this._codeIsReady = false;
                if (shaderLanguage === 1 /* ShaderLanguage.WGSL */) {
                    await import("../../../ShadersWGSL/ShadersInclude/helperFunctions.js");
                }
                else {
                    await import("../../../Shaders/ShadersInclude/helperFunctions.js");
                }
                this._codeIsReady = true;
                this.onCodeIsReadyObservable.notifyObservers(this);
            }
            /**
             * Gets the vector input
             */
            get vector() {
                return this._inputs[0];
            }
            /**
             * Gets the output component
             */
            get output() {
                return this._outputs[0];
            }
            /**
             * Gets the xyz output component
             */
            get xyz() {
                return this._outputs[1];
            }
            /**
             * Gets the matrix transform input
             */
            get transform() {
                return this._inputs[1];
            }
            _buildBlock(state) {
                super._buildBlock(state);
                const vector = this.vector;
                const transform = this.transform;
                const vec4 = state._getShaderType(NodeMaterialBlockConnectionPointTypes.Vector4);
                const vec3 = state._getShaderType(NodeMaterialBlockConnectionPointTypes.Vector3);
                if (vector.connectedPoint) {
                    // None uniform scaling case.
                    if (this.complementW === 0 || this.transformAsDirection) {
                        const comments = `//${this.name}`;
                        state._emitFunctionFromInclude("helperFunctions", comments);
                        state.sharedData.blocksWithDefines.push(this);
                        const transformName = state._getFreeVariableName(`${transform.associatedVariableName}_NUS`);
                        if (state.shaderLanguage === 1 /* ShaderLanguage.WGSL */) {
                            state.compilationString += `var ${transformName}: mat3x3f = mat3x3f(${transform.associatedVariableName}[0].xyz, ${transform.associatedVariableName}[1].xyz, ${transform.associatedVariableName}[2].xyz);\n`;
                        }
                        else {
                            state.compilationString += `mat3 ${transformName} = mat3(${transform.associatedVariableName});\n`;
                        }
                        state.compilationString += `#ifdef NONUNIFORMSCALING\n`;
                        state.compilationString += `${transformName} = transposeMat3(inverseMat3(${transformName}));\n`;
                        state.compilationString += `#endif\n`;
                        switch (vector.connectedPoint.type) {
                            case NodeMaterialBlockConnectionPointTypes.Vector2:
                                state.compilationString +=
                                    state._declareOutput(this.output) +
                                        ` = ${vec4}(${transformName} * ${vec3}(${vector.associatedVariableName}, ${this._writeFloat(this.complementZ)}), ${this._writeFloat(this.complementW)});\n`;
                                break;
                            case NodeMaterialBlockConnectionPointTypes.Vector3:
                            case NodeMaterialBlockConnectionPointTypes.Color3:
                                state.compilationString +=
                                    state._declareOutput(this.output) + ` = ${vec4}(${transformName} * ${vector.associatedVariableName}, ${this._writeFloat(this.complementW)});\n`;
                                break;
                            default:
                                state.compilationString +=
                                    state._declareOutput(this.output) + ` = ${vec4}(${transformName} * ${vector.associatedVariableName}.xyz, ${this._writeFloat(this.complementW)});\n`;
                                break;
                        }
                    }
                    else {
                        const transformName = transform.associatedVariableName;
                        switch (vector.connectedPoint.type) {
                            case NodeMaterialBlockConnectionPointTypes.Vector2:
                                state.compilationString +=
                                    state._declareOutput(this.output) +
                                        ` = ${transformName} * ${vec4}(${vector.associatedVariableName}, ${this._writeFloat(this.complementZ)}, ${this._writeFloat(this.complementW)});\n`;
                                break;
                            case NodeMaterialBlockConnectionPointTypes.Vector3:
                            case NodeMaterialBlockConnectionPointTypes.Color3:
                                state.compilationString +=
                                    state._declareOutput(this.output) + ` = ${transformName} * ${vec4}(${vector.associatedVariableName}, ${this._writeFloat(this.complementW)});\n`;
                                break;
                            default:
                                state.compilationString += state._declareOutput(this.output) + ` = ${transformName} * ${vector.associatedVariableName};\n`;
                                break;
                        }
                    }
                    if (this.xyz.hasEndpoints) {
                        state.compilationString += state._declareOutput(this.xyz) + ` = ${this.output.associatedVariableName}.xyz;\n`;
                    }
                }
                return this;
            }
            /**
             * Update defines for shader compilation
             * @param defines defines the material defines to update
             * @param nodeMaterial defines the node material requesting the update
             * @param mesh defines the mesh to be rendered
             */
            prepareDefines(defines, nodeMaterial, mesh) {
                if (mesh && mesh.nonUniformScaling) {
                    defines.setValue("NONUNIFORMSCALING", true);
                }
            }
            /**
             * Serializes the block
             * @returns the serialized object
             */
            serialize() {
                const serializationObject = super.serialize();
                serializationObject.complementZ = this.complementZ;
                serializationObject.complementW = this.complementW;
                return serializationObject;
            }
            /**
             * Deserializes the block from a serialization object
             * @param serializationObject - the object to deserialize from
             * @param scene - the current scene
             * @param rootUrl - the root URL for loading
             */
            _deserialize(serializationObject, scene, rootUrl) {
                super._deserialize(serializationObject, scene, rootUrl);
                this.complementZ = serializationObject.complementZ !== undefined ? serializationObject.complementZ : 0.0;
                this.complementW = serializationObject.complementW !== undefined ? serializationObject.complementW : 1.0;
            }
            _dumpPropertiesCode() {
                let codeString = super._dumpPropertiesCode() + `${this._codeVariableName}.complementZ = ${this.complementZ};\n`;
                codeString += `${this._codeVariableName}.complementW = ${this.complementW};\n`;
                return codeString;
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _get_transformAsDirection_decorators = [editableInPropertyPage("Transform as direction", 0 /* PropertyTypeForEdition.Boolean */, undefined, { embedded: true })];
            __esDecorate(_a, null, _get_transformAsDirection_decorators, { kind: "getter", name: "transformAsDirection", static: false, private: false, access: { has: obj => "transformAsDirection" in obj, get: obj => obj.transformAsDirection }, metadata: _metadata }, null, _instanceExtraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
export { TransformBlock };
let _Registered = false;
/**
 * Register side effects for transformBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterTransformBlock() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    RegisterClass("BABYLON.TransformBlock", TransformBlock);
}
//# sourceMappingURL=transformBlock.pure.js.map