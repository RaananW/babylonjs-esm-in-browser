/** This file must only contain pure code and pure imports */
import { __esDecorate, __runInitializers } from "../../../../tslib.es6.js";
import { NodeMaterialBlockConnectionPointTypes } from "../../Enums/nodeMaterialBlockConnectionPointTypes.js";
import { NodeMaterialBlockTargets } from "../../Enums/nodeMaterialBlockTargets.js";
import { InputBlock } from "../Input/inputBlock.pure.js";
import { NodeMaterialConnectionPointCustomObject } from "../../nodeMaterialConnectionPointCustomObject.js";
import { editableInPropertyPage } from "../../../../Decorators/nodeDecorator.js";
import { NodeMaterialBlock } from "../../nodeMaterialBlock.js";
import { CubeTextureParse } from "../../../Textures/cubeTexture.pure.js";
import { Texture } from "../../../Textures/texture.pure.js";
import { NodeMaterialSystemValues } from "../../Enums/nodeMaterialSystemValues.js";
import { RegisterClass } from "../../../../Misc/typeStore.js";
/**
 * Block used to implement the refraction part of the sub surface module of the PBR material
 */
let RefractionBlock = (() => {
    var _a;
    let _classSuper = NodeMaterialBlock;
    let _linkRefractionWithTransparency_decorators;
    let _linkRefractionWithTransparency_initializers = [];
    let _linkRefractionWithTransparency_extraInitializers = [];
    let _invertRefractionY_decorators;
    let _invertRefractionY_initializers = [];
    let _invertRefractionY_extraInitializers = [];
    let _useThicknessAsDepth_decorators;
    let _useThicknessAsDepth_initializers = [];
    let _useThicknessAsDepth_extraInitializers = [];
    return _a = class RefractionBlock extends _classSuper {
            /**
             * Create a new RefractionBlock
             * @param name defines the block name
             */
            constructor(name) {
                super(name, NodeMaterialBlockTargets.Fragment);
                /**
                 * This parameters will make the material used its opacity to control how much it is refracting against not.
                 * Materials half opaque for instance using refraction could benefit from this control.
                 */
                this.linkRefractionWithTransparency = __runInitializers(this, _linkRefractionWithTransparency_initializers, false);
                /**
                 * Controls if refraction needs to be inverted on Y. This could be useful for procedural texture.
                 */
                this.invertRefractionY = (__runInitializers(this, _linkRefractionWithTransparency_extraInitializers), __runInitializers(this, _invertRefractionY_initializers, false));
                /**
                 * Controls if refraction needs to be inverted on Y. This could be useful for procedural texture.
                 */
                this.useThicknessAsDepth = (__runInitializers(this, _invertRefractionY_extraInitializers), __runInitializers(this, _useThicknessAsDepth_initializers, false));
                /**
                 * Gets or sets the texture associated with the node
                 */
                this.texture = __runInitializers(this, _useThicknessAsDepth_extraInitializers);
                this._isUnique = true;
                this.registerInput("intensity", NodeMaterialBlockConnectionPointTypes.Float, false, NodeMaterialBlockTargets.Fragment);
                this.registerInput("tintAtDistance", NodeMaterialBlockConnectionPointTypes.Float, true, NodeMaterialBlockTargets.Fragment);
                this.registerInput("volumeIndexOfRefraction", NodeMaterialBlockConnectionPointTypes.Float, true, NodeMaterialBlockTargets.Fragment);
                this.registerOutput("refraction", NodeMaterialBlockConnectionPointTypes.Object, NodeMaterialBlockTargets.Fragment, new NodeMaterialConnectionPointCustomObject("refraction", this, 1 /* NodeMaterialConnectionPointDirection.Output */, _a, "RefractionBlock"));
            }
            /**
             * Initialize the block and prepare the context for build
             * @param state defines the state that will be used for the build
             */
            initialize(state) {
                state._excludeVariableName("vRefractionPosition");
                state._excludeVariableName("vRefractionSize");
            }
            /**
             * Gets the current class name
             * @returns the class name
             */
            getClassName() {
                return "RefractionBlock";
            }
            /**
             * Gets the intensity input component
             */
            get intensity() {
                return this._inputs[0];
            }
            /**
             * Gets the tint at distance input component
             */
            get tintAtDistance() {
                return this._inputs[1];
            }
            /**
             * Gets the volume index of refraction input component
             */
            get volumeIndexOfRefraction() {
                return this._inputs[2];
            }
            /**
             * Gets the view input component
             */
            get view() {
                return this.viewConnectionPoint;
            }
            /**
             * Gets the refraction object output component
             */
            get refraction() {
                return this._outputs[0];
            }
            /**
             * Returns true if the block has a texture
             */
            get hasTexture() {
                return !!this._getTexture();
            }
            _getTexture() {
                if (this.texture) {
                    return this.texture;
                }
                return this._scene.environmentTexture;
            }
            /**
             * Auto configure the block based on the material
             * @param material - the node material
             * @param additionalFilteringInfo - additional filtering info
             */
            autoConfigure(material, additionalFilteringInfo = () => true) {
                if (!this.intensity.isConnected) {
                    const intensityInput = new InputBlock("Refraction intensity", NodeMaterialBlockTargets.Fragment, NodeMaterialBlockConnectionPointTypes.Float);
                    intensityInput.value = 1;
                    intensityInput.output.connectTo(this.intensity);
                }
                if (this.view && !this.view.isConnected) {
                    let viewInput = material.getInputBlockByPredicate((b) => b.systemValue === NodeMaterialSystemValues.View && additionalFilteringInfo(b));
                    if (!viewInput) {
                        viewInput = new InputBlock("view");
                        viewInput.setAsSystemValue(NodeMaterialSystemValues.View);
                    }
                    viewInput.output.connectTo(this.view);
                }
            }
            /**
             * Prepare the list of defines
             * @param defines - the list of defines
             */
            prepareDefines(defines) {
                const refractionTexture = this._getTexture();
                const refraction = refractionTexture && refractionTexture.getTextureMatrix;
                defines.setValue("SS_REFRACTION", refraction, true);
                if (!refraction) {
                    return;
                }
                defines.setValue(this._define3DName, refractionTexture.isCube, true);
                defines.setValue(this._defineLODRefractionAlpha, refractionTexture.lodLevelInAlpha, true);
                defines.setValue(this._defineLinearSpecularRefraction, refractionTexture.linearSpecularLOD, true);
                defines.setValue(this._defineOppositeZ, this._scene.useRightHandedSystem && refractionTexture.isCube ? !refractionTexture.invertZ : refractionTexture.invertZ, true);
                defines.setValue("SS_LINKREFRACTIONTOTRANSPARENCY", this.linkRefractionWithTransparency, true);
                defines.setValue("SS_GAMMAREFRACTION", refractionTexture.gammaSpace, true);
                defines.setValue("SS_RGBDREFRACTION", refractionTexture.isRGBD, true);
                defines.setValue("SS_USE_LOCAL_REFRACTIONMAP_CUBIC", refractionTexture.boundingBoxSize ? true : false, true);
                defines.setValue("SS_USE_THICKNESS_AS_DEPTH", this.useThicknessAsDepth, true);
            }
            /**
             * Checks if the block is ready
             * @returns true if ready
             */
            isReady() {
                const texture = this._getTexture();
                if (texture && !texture.isReadyOrNotBlocking()) {
                    return false;
                }
                return true;
            }
            /**
             * Bind data to effect
             * @param effect - the effect to bind to
             * @param nodeMaterial - the node material
             * @param mesh - the mesh
             */
            bind(effect, nodeMaterial, mesh) {
                super.bind(effect, nodeMaterial, mesh);
                const refractionTexture = this._getTexture();
                if (!refractionTexture) {
                    return;
                }
                if (refractionTexture.isCube) {
                    effect.setTexture(this._cubeSamplerName, refractionTexture);
                }
                else {
                    effect.setTexture(this._2DSamplerName, refractionTexture);
                }
                effect.setMatrix(this._refractionMatrixName, refractionTexture.getRefractionTextureMatrix());
                let depth = 1.0;
                if (!refractionTexture.isCube) {
                    if (refractionTexture.depth) {
                        depth = refractionTexture.depth;
                    }
                }
                const indexOfRefraction = this.volumeIndexOfRefraction.connectInputBlock?.value ?? this.indexOfRefractionConnectionPoint.connectInputBlock?.value ?? 1.5;
                effect.setFloat4(this._vRefractionInfosName, refractionTexture.level, 1 / indexOfRefraction, depth, this.invertRefractionY ? -1 : 1);
                effect.setFloat4(this._vRefractionMicrosurfaceInfosName, refractionTexture.getSize().width, refractionTexture.lodGenerationScale, refractionTexture.lodGenerationOffset, 1 / indexOfRefraction);
                const width = refractionTexture.getSize().width;
                effect.setFloat2(this._vRefractionFilteringInfoName, width, Math.log2(width));
                if (refractionTexture.boundingBoxSize) {
                    const cubeTexture = refractionTexture;
                    effect.setVector3("vRefractionPosition", cubeTexture.boundingBoxPosition);
                    effect.setVector3("vRefractionSize", cubeTexture.boundingBoxSize);
                }
            }
            /**
             * Gets the main code of the block (fragment side)
             * @param state current state of the node material building
             * @returns the shader code
             */
            getCode(state) {
                const code = "";
                state.sharedData.blockingBlocks.push(this);
                state.sharedData.textureBlocks.push(this);
                // Samplers
                this._cubeSamplerName = state._getFreeVariableName(this.name + "CubeSampler");
                state.samplers.push(this._cubeSamplerName);
                this._2DSamplerName = state._getFreeVariableName(this.name + "2DSampler");
                state.samplers.push(this._2DSamplerName);
                this._define3DName = state._getFreeDefineName("SS_REFRACTIONMAP_3D");
                const refractionTexture = this._getTexture();
                if (refractionTexture) {
                    state._samplerDeclaration += `#ifdef ${this._define3DName}\n`;
                    state._emitCubeSampler(this._cubeSamplerName, undefined, true);
                    state._samplerDeclaration += `#else\n`;
                    state._emit2DSampler(this._2DSamplerName, undefined, true);
                    state._samplerDeclaration += `#endif\n`;
                }
                // Fragment
                state.sharedData.blocksWithDefines.push(this);
                state.sharedData.bindableBlocks.push(this);
                this._defineLODRefractionAlpha = state._getFreeDefineName("SS_LODINREFRACTIONALPHA");
                this._defineLinearSpecularRefraction = state._getFreeDefineName("SS_LINEARSPECULARREFRACTION");
                this._defineOppositeZ = state._getFreeDefineName("SS_REFRACTIONMAP_OPPOSITEZ");
                this._refractionMatrixName = state._getFreeVariableName("refractionMatrix");
                state._emitUniformFromString(this._refractionMatrixName, NodeMaterialBlockConnectionPointTypes.Matrix);
                if (state.shaderLanguage !== 1 /* ShaderLanguage.WGSL */) {
                    state._emitFunction("sampleRefraction", `
                #ifdef ${this._define3DName}
                    #define sampleRefraction(s, c) textureCube(s, c)
                #else
                    #define sampleRefraction(s, c) texture2D(s, c)
                #endif\n`, `//${this.name}`);
                    state._emitFunction("sampleRefractionLod", `
                #ifdef ${this._define3DName}
                    #define sampleRefractionLod(s, c, l) textureCubeLodEXT(s, c, l)
                #else
                    #define sampleRefractionLod(s, c, l) texture2DLodEXT(s, c, l)
                #endif\n`, `//${this.name}`);
                }
                this._vRefractionMicrosurfaceInfosName = state._getFreeVariableName("vRefractionMicrosurfaceInfos");
                state._emitUniformFromString(this._vRefractionMicrosurfaceInfosName, NodeMaterialBlockConnectionPointTypes.Vector4);
                this._vRefractionInfosName = state._getFreeVariableName("vRefractionInfos");
                state._emitUniformFromString(this._vRefractionInfosName, NodeMaterialBlockConnectionPointTypes.Vector4);
                this._vRefractionFilteringInfoName = state._getFreeVariableName("vRefractionFilteringInfo");
                state._emitUniformFromString(this._vRefractionFilteringInfoName, NodeMaterialBlockConnectionPointTypes.Vector2);
                state._emitUniformFromString("vRefractionPosition", NodeMaterialBlockConnectionPointTypes.Vector3);
                state._emitUniformFromString("vRefractionSize", NodeMaterialBlockConnectionPointTypes.Vector3);
                return code;
            }
            _buildBlock(state) {
                this._scene = state.sharedData.scene;
                return this;
            }
            _dumpPropertiesCode() {
                let codeString = super._dumpPropertiesCode();
                if (this.texture) {
                    if (this.texture.isCube) {
                        codeString = `${this._codeVariableName}.texture = new BABYLON.CubeTexture("${this.texture.name}");\n`;
                    }
                    else {
                        codeString = `${this._codeVariableName}.texture = new BABYLON.Texture("${this.texture.name}");\n`;
                    }
                    codeString += `${this._codeVariableName}.texture.coordinatesMode = ${this.texture.coordinatesMode};\n`;
                }
                codeString += `${this._codeVariableName}.linkRefractionWithTransparency = ${this.linkRefractionWithTransparency};\n`;
                codeString += `${this._codeVariableName}.invertRefractionY = ${this.invertRefractionY};\n`;
                codeString += `${this._codeVariableName}.useThicknessAsDepth = ${this.useThicknessAsDepth};\n`;
                return codeString;
            }
            /**
             * Serializes the block
             * @returns the serialized object
             */
            serialize() {
                const serializationObject = super.serialize();
                if (this.texture && !this.texture.isRenderTarget) {
                    serializationObject.texture = this.texture.serialize();
                }
                serializationObject.linkRefractionWithTransparency = this.linkRefractionWithTransparency;
                serializationObject.invertRefractionY = this.invertRefractionY;
                serializationObject.useThicknessAsDepth = this.useThicknessAsDepth;
                return serializationObject;
            }
            /**
             * Deserializes the block
             * @param serializationObject - the serialization object
             * @param scene - the scene
             * @param rootUrl - the root URL
             */
            _deserialize(serializationObject, scene, rootUrl) {
                super._deserialize(serializationObject, scene, rootUrl);
                if (serializationObject.texture) {
                    rootUrl = serializationObject.texture.url.indexOf("data:") === 0 ? "" : rootUrl;
                    if (serializationObject.texture.isCube) {
                        this.texture = CubeTextureParse(serializationObject.texture, scene, rootUrl);
                    }
                    else {
                        this.texture = Texture.Parse(serializationObject.texture, scene, rootUrl);
                    }
                }
                this.linkRefractionWithTransparency = serializationObject.linkRefractionWithTransparency;
                this.invertRefractionY = serializationObject.invertRefractionY;
                this.useThicknessAsDepth = !!serializationObject.useThicknessAsDepth;
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _linkRefractionWithTransparency_decorators = [editableInPropertyPage("Link refraction to transparency", 0 /* PropertyTypeForEdition.Boolean */, "ADVANCED", { embedded: true, notifiers: { update: true } })];
            _invertRefractionY_decorators = [editableInPropertyPage("Invert refraction Y", 0 /* PropertyTypeForEdition.Boolean */, "ADVANCED", { embedded: true, notifiers: { update: true } })];
            _useThicknessAsDepth_decorators = [editableInPropertyPage("Use thickness as depth", 0 /* PropertyTypeForEdition.Boolean */, "ADVANCED", { embedded: true, notifiers: { update: true } })];
            __esDecorate(null, null, _linkRefractionWithTransparency_decorators, { kind: "field", name: "linkRefractionWithTransparency", static: false, private: false, access: { has: obj => "linkRefractionWithTransparency" in obj, get: obj => obj.linkRefractionWithTransparency, set: (obj, value) => { obj.linkRefractionWithTransparency = value; } }, metadata: _metadata }, _linkRefractionWithTransparency_initializers, _linkRefractionWithTransparency_extraInitializers);
            __esDecorate(null, null, _invertRefractionY_decorators, { kind: "field", name: "invertRefractionY", static: false, private: false, access: { has: obj => "invertRefractionY" in obj, get: obj => obj.invertRefractionY, set: (obj, value) => { obj.invertRefractionY = value; } }, metadata: _metadata }, _invertRefractionY_initializers, _invertRefractionY_extraInitializers);
            __esDecorate(null, null, _useThicknessAsDepth_decorators, { kind: "field", name: "useThicknessAsDepth", static: false, private: false, access: { has: obj => "useThicknessAsDepth" in obj, get: obj => obj.useThicknessAsDepth, set: (obj, value) => { obj.useThicknessAsDepth = value; } }, metadata: _metadata }, _useThicknessAsDepth_initializers, _useThicknessAsDepth_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
export { RefractionBlock };
let _Registered = false;
/**
 * Register side effects for refractionBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterRefractionBlock() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    RegisterClass("BABYLON.RefractionBlock", RefractionBlock);
}
//# sourceMappingURL=refractionBlock.pure.js.map