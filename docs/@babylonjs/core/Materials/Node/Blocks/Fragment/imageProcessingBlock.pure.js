/** This file must only contain pure code and pure imports */
import { __esDecorate, __runInitializers } from "../../../../tslib.es6.js";
import { NodeMaterialBlock } from "../../nodeMaterialBlock.js";
import { NodeMaterialBlockConnectionPointTypes } from "../../Enums/nodeMaterialBlockConnectionPointTypes.js";
import { NodeMaterialBlockTargets } from "../../Enums/nodeMaterialBlockTargets.js";
import { editableInPropertyPage } from "../../../../Decorators/nodeDecorator.js";
import { RegisterClass } from "../../../../Misc/typeStore.js";
/**
 * Block used to add image processing support to fragment shader
 */
let ImageProcessingBlock = (() => {
    var _a;
    let _classSuper = NodeMaterialBlock;
    let _convertInputToLinearSpace_decorators;
    let _convertInputToLinearSpace_initializers = [];
    let _convertInputToLinearSpace_extraInitializers = [];
    return _a = class ImageProcessingBlock extends _classSuper {
            /**
             * Create a new ImageProcessingBlock
             * @param name defines the block name
             */
            constructor(name) {
                super(name, NodeMaterialBlockTargets.Fragment);
                /**
                 * Defines if the input should be converted to linear space (default: true)
                 */
                this.convertInputToLinearSpace = __runInitializers(this, _convertInputToLinearSpace_initializers, true);
                __runInitializers(this, _convertInputToLinearSpace_extraInitializers);
                this.registerInput("color", NodeMaterialBlockConnectionPointTypes.AutoDetect);
                this.registerOutput("output", NodeMaterialBlockConnectionPointTypes.Color4);
                this.registerOutput("rgb", NodeMaterialBlockConnectionPointTypes.Color3);
                this._inputs[0].addExcludedConnectionPointFromAllowedTypes(NodeMaterialBlockConnectionPointTypes.Color3 |
                    NodeMaterialBlockConnectionPointTypes.Color4 |
                    NodeMaterialBlockConnectionPointTypes.Vector3 |
                    NodeMaterialBlockConnectionPointTypes.Vector4);
            }
            /**
             * Gets the current class name
             * @returns the class name
             */
            getClassName() {
                return "ImageProcessingBlock";
            }
            /**
             * Gets the color input component
             */
            get color() {
                return this._inputs[0];
            }
            /**
             * Gets the output component
             */
            get output() {
                return this._outputs[0];
            }
            /**
             * Gets the rgb component
             */
            get rgb() {
                return this._outputs[1];
            }
            /**
             * Initialize the block and prepare the context for build
             * @param state defines the state that will be used for the build
             */
            initialize(state) {
                state._excludeVariableName("whiteBalanceMatrix");
                state._excludeVariableName("exposureLinear");
                state._excludeVariableName("contrast");
                state._excludeVariableName("vInverseScreenSize");
                state._excludeVariableName("vignetteSettings1");
                state._excludeVariableName("vignetteSettings2");
                state._excludeVariableName("vCameraColorCurveNegative");
                state._excludeVariableName("vCameraColorCurveNeutral");
                state._excludeVariableName("vCameraColorCurvePositive");
                state._excludeVariableName("txColorTransform");
                state._excludeVariableName("colorTransformSettings");
                state._excludeVariableName("ditherIntensity");
                // eslint-disable-next-line @typescript-eslint/no-floating-promises
                this._initShaderSourceAsync(state.shaderLanguage);
            }
            async _initShaderSourceAsync(shaderLanguage) {
                this._codeIsReady = false;
                if (shaderLanguage === 1 /* ShaderLanguage.WGSL */) {
                    await Promise.all([
                        import("../../../../ShadersWGSL/ShadersInclude/helperFunctions.js"),
                        import("../../../../ShadersWGSL/ShadersInclude/imageProcessingDeclaration.js"),
                        import("../../../../ShadersWGSL/ShadersInclude/imageProcessingFunctions.js"),
                    ]);
                }
                else {
                    await Promise.all([
                        import("../../../../Shaders/ShadersInclude/helperFunctions.js"),
                        import("../../../../Shaders/ShadersInclude/imageProcessingDeclaration.js"),
                        import("../../../../Shaders/ShadersInclude/imageProcessingFunctions.js"),
                    ]);
                }
                this._codeIsReady = true;
                this.onCodeIsReadyObservable.notifyObservers(this);
            }
            /**
             * Checks if the block is ready
             * @param mesh - the mesh to check
             * @param nodeMaterial - the node material
             * @param defines - the material defines
             * @returns true if ready
             */
            isReady(mesh, nodeMaterial, defines) {
                if (defines._areImageProcessingDirty && nodeMaterial.imageProcessingConfiguration) {
                    if (!nodeMaterial.imageProcessingConfiguration.isReady()) {
                        return false;
                    }
                }
                return true;
            }
            /**
             * Prepare the list of defines
             * @param defines - the material defines
             * @param nodeMaterial - the node material
             */
            prepareDefines(defines, nodeMaterial) {
                if (defines._areImageProcessingDirty && nodeMaterial.imageProcessingConfiguration) {
                    nodeMaterial.imageProcessingConfiguration.prepareDefines(defines);
                }
            }
            /**
             * Bind data to effect
             * @param effect - the effect to bind to
             * @param nodeMaterial - the node material
             * @param mesh - the mesh to bind for
             */
            bind(effect, nodeMaterial, mesh) {
                if (!mesh) {
                    return;
                }
                if (!nodeMaterial.imageProcessingConfiguration) {
                    return;
                }
                nodeMaterial.imageProcessingConfiguration.bind(effect);
            }
            _buildBlock(state) {
                super._buildBlock(state);
                // Register for defines
                state.sharedData.blocksWithDefines.push(this);
                // Register for blocking
                state.sharedData.blockingBlocks.push(this);
                // Register for binding
                state.sharedData.bindableBlocks.push(this);
                // Uniforms
                state.uniforms.push("whiteBalanceMatrix");
                state.uniforms.push("exposureLinear");
                state.uniforms.push("contrast");
                state.uniforms.push("vInverseScreenSize");
                state.uniforms.push("vignetteSettings1");
                state.uniforms.push("vignetteSettings2");
                state.uniforms.push("vCameraColorCurveNegative");
                state.uniforms.push("vCameraColorCurveNeutral");
                state.uniforms.push("vCameraColorCurvePositive");
                state.uniforms.push("txColorTransform");
                state.uniforms.push("colorTransformSettings");
                state.uniforms.push("ditherIntensity");
                // Emit code
                const color = this.color;
                const output = this._outputs[0];
                const comments = `//${this.name}`;
                const overrideText = state.shaderLanguage === 1 /* ShaderLanguage.WGSL */ ? "Vec3" : "";
                state._emitFunctionFromInclude("helperFunctions", comments);
                state._emitFunctionFromInclude("imageProcessingDeclaration", comments);
                state._emitFunctionFromInclude("imageProcessingFunctions", comments);
                if (color.connectedPoint?.isConnected) {
                    const isVec4Input = color.connectedPoint.type === NodeMaterialBlockConnectionPointTypes.Color4 || color.connectedPoint.type === NodeMaterialBlockConnectionPointTypes.Vector4;
                    // For vec3 inputs (Color3/Vector3), use 1.0 for alpha since they have no .a component
                    const alpha = isVec4Input ? `${color.associatedVariableName}.a` : "1.0";
                    if (isVec4Input) {
                        state.compilationString += `${state._declareOutput(output)} = ${color.associatedVariableName};\n`;
                    }
                    else {
                        state.compilationString += `${state._declareOutput(output)} = vec4${state.fSuffix}(${color.associatedVariableName}, 1.0);\n`;
                    }
                    state.compilationString += `#ifdef IMAGEPROCESSINGPOSTPROCESS\n`;
                    if (this.convertInputToLinearSpace) {
                        state.compilationString += `${output.associatedVariableName} = vec4${state.fSuffix}(toLinearSpace${overrideText}(${color.associatedVariableName}.rgb), ${alpha});\n`;
                    }
                    state.compilationString += `#else\n`;
                    state.compilationString += `#ifdef IMAGEPROCESSING\n`;
                    if (this.convertInputToLinearSpace) {
                        state.compilationString += `${output.associatedVariableName} = vec4${state.fSuffix}(toLinearSpace${overrideText}(${color.associatedVariableName}.rgb), ${alpha});\n`;
                    }
                    state.compilationString += `${output.associatedVariableName} = applyImageProcessing(${output.associatedVariableName});\n`;
                    state.compilationString += `#endif\n`;
                    state.compilationString += `#endif\n`;
                    if (this.rgb.hasEndpoints) {
                        state.compilationString += state._declareOutput(this.rgb) + ` = ${this.output.associatedVariableName}.xyz;\n`;
                    }
                }
                return this;
            }
            _dumpPropertiesCode() {
                let codeString = super._dumpPropertiesCode();
                codeString += `${this._codeVariableName}.convertInputToLinearSpace = ${this.convertInputToLinearSpace};\n`;
                return codeString;
            }
            /**
             * Serializes the block
             * @returns the serialized object
             */
            serialize() {
                const serializationObject = super.serialize();
                serializationObject.convertInputToLinearSpace = this.convertInputToLinearSpace;
                return serializationObject;
            }
            /**
             * Deserializes the block
             * @param serializationObject - the serialization object
             * @param scene - the scene
             * @param rootUrl - the root url
             */
            _deserialize(serializationObject, scene, rootUrl) {
                super._deserialize(serializationObject, scene, rootUrl);
                this.convertInputToLinearSpace = serializationObject.convertInputToLinearSpace ?? true;
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _convertInputToLinearSpace_decorators = [editableInPropertyPage("Convert input to linear space", 0 /* PropertyTypeForEdition.Boolean */, "ADVANCED")];
            __esDecorate(null, null, _convertInputToLinearSpace_decorators, { kind: "field", name: "convertInputToLinearSpace", static: false, private: false, access: { has: obj => "convertInputToLinearSpace" in obj, get: obj => obj.convertInputToLinearSpace, set: (obj, value) => { obj.convertInputToLinearSpace = value; } }, metadata: _metadata }, _convertInputToLinearSpace_initializers, _convertInputToLinearSpace_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
export { ImageProcessingBlock };
let _Registered = false;
/**
 * Register side effects for imageProcessingBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterImageProcessingBlock() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    RegisterClass("BABYLON.ImageProcessingBlock", ImageProcessingBlock);
}
//# sourceMappingURL=imageProcessingBlock.pure.js.map