/** This file must only contain pure code and pure imports */
import { __esDecorate, __runInitializers } from "../../../../tslib.es6.js";
import { NodeRenderGraphBaseObjectRendererBlock } from "./baseObjectRendererBlock.js";
import { NodeRenderGraphBlockConnectionPointTypes } from "../../Types/nodeRenderGraphTypes.js";
import { editableInPropertyPage } from "../../../../Decorators/nodeDecorator.js";
import { FrameGraphGeometryRendererTask } from "../../../Tasks/Rendering/geometryRendererTask.js";

import { RegisterClass } from "../../../../Misc/typeStore.js";
/**
 * Block that render geometry of objects to a multi render target
 */
let NodeRenderGraphGeometryRendererBlock = (() => {
    var _a;
    let _classSuper = NodeRenderGraphBaseObjectRendererBlock;
    let _instanceExtraInitializers = [];
    let _get_width_decorators;
    let _get_height_decorators;
    let _get_sizeInPercentage_decorators;
    let _get_samples_decorators;
    let _get_reverseCulling_decorators;
    let _get_dontRenderWhenMaterialDepthWriteIsDisabled_decorators;
    let _get_disableDepthPrePass_decorators;
    let _irradianceFormat_decorators;
    let _irradianceFormat_initializers = [];
    let _irradianceFormat_extraInitializers = [];
    let _irradianceType_decorators;
    let _irradianceType_initializers = [];
    let _irradianceType_extraInitializers = [];
    let _viewDepthFormat_decorators;
    let _viewDepthFormat_initializers = [];
    let _viewDepthFormat_extraInitializers = [];
    let _viewDepthType_decorators;
    let _viewDepthType_initializers = [];
    let _viewDepthType_extraInitializers = [];
    let _normalizedViewDepthFormat_decorators;
    let _normalizedViewDepthFormat_initializers = [];
    let _normalizedViewDepthFormat_extraInitializers = [];
    let _normalizedViewDepthType_decorators;
    let _normalizedViewDepthType_initializers = [];
    let _normalizedViewDepthType_extraInitializers = [];
    let _screenDepthFormat_decorators;
    let _screenDepthFormat_initializers = [];
    let _screenDepthFormat_extraInitializers = [];
    let _screenDepthType_decorators;
    let _screenDepthType_initializers = [];
    let _screenDepthType_extraInitializers = [];
    let _viewNormalFormat_decorators;
    let _viewNormalFormat_initializers = [];
    let _viewNormalFormat_extraInitializers = [];
    let _viewNormalType_decorators;
    let _viewNormalType_initializers = [];
    let _viewNormalType_extraInitializers = [];
    let _worldNormalFormat_decorators;
    let _worldNormalFormat_initializers = [];
    let _worldNormalFormat_extraInitializers = [];
    let _worldNormalType_decorators;
    let _worldNormalType_initializers = [];
    let _worldNormalType_extraInitializers = [];
    let _localPositionFormat_decorators;
    let _localPositionFormat_initializers = [];
    let _localPositionFormat_extraInitializers = [];
    let _localPositionType_decorators;
    let _localPositionType_initializers = [];
    let _localPositionType_extraInitializers = [];
    let _worldPositionFormat_decorators;
    let _worldPositionFormat_initializers = [];
    let _worldPositionFormat_extraInitializers = [];
    let _worldPositionType_decorators;
    let _worldPositionType_initializers = [];
    let _worldPositionType_extraInitializers = [];
    let _albedoFormat_decorators;
    let _albedoFormat_initializers = [];
    let _albedoFormat_extraInitializers = [];
    let _albedoType_decorators;
    let _albedoType_initializers = [];
    let _albedoType_extraInitializers = [];
    let _reflectivityFormat_decorators;
    let _reflectivityFormat_initializers = [];
    let _reflectivityFormat_extraInitializers = [];
    let _reflectivityType_decorators;
    let _reflectivityType_initializers = [];
    let _reflectivityType_extraInitializers = [];
    let _velocityFormat_decorators;
    let _velocityFormat_initializers = [];
    let _velocityFormat_extraInitializers = [];
    let _velocityType_decorators;
    let _velocityType_initializers = [];
    let _velocityType_extraInitializers = [];
    let _linearVelocityFormat_decorators;
    let _linearVelocityFormat_initializers = [];
    let _linearVelocityFormat_extraInitializers = [];
    let _linearVelocityType_decorators;
    let _linearVelocityType_initializers = [];
    let _linearVelocityType_extraInitializers = [];
    return _a = class NodeRenderGraphGeometryRendererBlock extends _classSuper {
            /**
             * Gets the frame graph task associated with this block
             */
            get task() {
                return this._frameGraphTask;
            }
            /**
             * Create a new NodeRenderGraphGeometryRendererBlock
             * @param name defines the block name
             * @param frameGraph defines the hosting frame graph
             * @param scene defines the hosting scene
             * @param doNotChangeAspectRatio True (default) to not change the aspect ratio of the scene in the RTT
             * @param enableClusteredLights True (default) to enable clustered lights
             */
            constructor(name, frameGraph, scene, doNotChangeAspectRatio = true, enableClusteredLights = true) {
                super(name, frameGraph, scene);
                this._frameGraphTask = __runInitializers(this, _instanceExtraInitializers);
                // Irradiance
                /** The format of the irradiance output texture */
                this.irradianceFormat = __runInitializers(this, _irradianceFormat_initializers, 5);
                /** The type of the irradiance output texture */
                this.irradianceType = (__runInitializers(this, _irradianceFormat_extraInitializers), __runInitializers(this, _irradianceType_initializers, 2));
                // View depth
                /** The format of the view depth output texture */
                this.viewDepthFormat = (__runInitializers(this, _irradianceType_extraInitializers), __runInitializers(this, _viewDepthFormat_initializers, 6));
                /** The type of the view depth output texture */
                this.viewDepthType = (__runInitializers(this, _viewDepthFormat_extraInitializers), __runInitializers(this, _viewDepthType_initializers, 1));
                // Normalized view depth
                /** The format of the normalized view depth output texture */
                this.normalizedViewDepthFormat = (__runInitializers(this, _viewDepthType_extraInitializers), __runInitializers(this, _normalizedViewDepthFormat_initializers, 6));
                /** The type of the normalized view depth output texture */
                this.normalizedViewDepthType = (__runInitializers(this, _normalizedViewDepthFormat_extraInitializers), __runInitializers(this, _normalizedViewDepthType_initializers, 2));
                // Screen depth
                /** The format of the screen depth output texture */
                this.screenDepthFormat = (__runInitializers(this, _normalizedViewDepthType_extraInitializers), __runInitializers(this, _screenDepthFormat_initializers, 6));
                /** The type of the screen depth output texture */
                this.screenDepthType = (__runInitializers(this, _screenDepthFormat_extraInitializers), __runInitializers(this, _screenDepthType_initializers, 1));
                // View normal
                /** The format of the view normal output texture */
                this.viewNormalFormat = (__runInitializers(this, _screenDepthType_extraInitializers), __runInitializers(this, _viewNormalFormat_initializers, 5));
                /** The type of the view normal output texture */
                this.viewNormalType = (__runInitializers(this, _viewNormalFormat_extraInitializers), __runInitializers(this, _viewNormalType_initializers, 2));
                // World normal
                /** The format of the world normal output texture */
                this.worldNormalFormat = (__runInitializers(this, _viewNormalType_extraInitializers), __runInitializers(this, _worldNormalFormat_initializers, 5));
                /** The type of the world normal output texture */
                this.worldNormalType = (__runInitializers(this, _worldNormalFormat_extraInitializers), __runInitializers(this, _worldNormalType_initializers, 0));
                // Local position
                /** The format of the local position output texture */
                this.localPositionFormat = (__runInitializers(this, _worldNormalType_extraInitializers), __runInitializers(this, _localPositionFormat_initializers, 5));
                /** The type of the local position output texture */
                this.localPositionType = (__runInitializers(this, _localPositionFormat_extraInitializers), __runInitializers(this, _localPositionType_initializers, 2));
                // World Position
                /** The format of the world position output texture */
                this.worldPositionFormat = (__runInitializers(this, _localPositionType_extraInitializers), __runInitializers(this, _worldPositionFormat_initializers, 5));
                /** The type of the world position output texture */
                this.worldPositionType = (__runInitializers(this, _worldPositionFormat_extraInitializers), __runInitializers(this, _worldPositionType_initializers, 2));
                // Albedo
                /** The format of the albedo output texture */
                this.albedoFormat = (__runInitializers(this, _worldPositionType_extraInitializers), __runInitializers(this, _albedoFormat_initializers, 5));
                /** The type of the albedo output texture */
                this.albedoType = (__runInitializers(this, _albedoFormat_extraInitializers), __runInitializers(this, _albedoType_initializers, 0));
                // Reflectivity
                /** The format of the reflectivity output texture */
                this.reflectivityFormat = (__runInitializers(this, _albedoType_extraInitializers), __runInitializers(this, _reflectivityFormat_initializers, 5));
                /** The type of the reflectivity output texture */
                this.reflectivityType = (__runInitializers(this, _reflectivityFormat_extraInitializers), __runInitializers(this, _reflectivityType_initializers, 0));
                // Velocity
                /** The format of the velocity output texture */
                this.velocityFormat = (__runInitializers(this, _reflectivityType_extraInitializers), __runInitializers(this, _velocityFormat_initializers, 5));
                /** The type of the velocity output texture */
                this.velocityType = (__runInitializers(this, _velocityFormat_extraInitializers), __runInitializers(this, _velocityType_initializers, 0));
                // Linear velocity
                /** The format of the linear velocity output texture */
                this.linearVelocityFormat = (__runInitializers(this, _velocityType_extraInitializers), __runInitializers(this, _linearVelocityFormat_initializers, 5));
                /** The type of the linear velocity output texture */
                this.linearVelocityType = (__runInitializers(this, _linearVelocityFormat_extraInitializers), __runInitializers(this, _linearVelocityType_initializers, 2));
                __runInitializers(this, _linearVelocityType_extraInitializers);
                this.getInputByName("target").isOptional = true;
                this.registerOutput("geomIrradiance", NodeRenderGraphBlockConnectionPointTypes.TextureIrradiance);
                this.registerOutput("geomViewDepth", NodeRenderGraphBlockConnectionPointTypes.TextureViewDepth);
                this.registerOutput("geomNormViewDepth", NodeRenderGraphBlockConnectionPointTypes.TextureNormalizedViewDepth);
                this.registerOutput("geomScreenDepth", NodeRenderGraphBlockConnectionPointTypes.TextureScreenDepth);
                this.registerOutput("geomViewNormal", NodeRenderGraphBlockConnectionPointTypes.TextureViewNormal);
                this.registerOutput("geomWorldNormal", NodeRenderGraphBlockConnectionPointTypes.TextureWorldNormal);
                this.registerOutput("geomLocalPosition", NodeRenderGraphBlockConnectionPointTypes.TextureLocalPosition);
                this.registerOutput("geomWorldPosition", NodeRenderGraphBlockConnectionPointTypes.TextureWorldPosition);
                this.registerOutput("geomAlbedo", NodeRenderGraphBlockConnectionPointTypes.TextureAlbedo);
                this.registerOutput("geomReflectivity", NodeRenderGraphBlockConnectionPointTypes.TextureReflectivity);
                this.registerOutput("geomVelocity", NodeRenderGraphBlockConnectionPointTypes.TextureVelocity);
                this.registerOutput("geomLinearVelocity", NodeRenderGraphBlockConnectionPointTypes.TextureLinearVelocity);
                this._frameGraphTask = new FrameGraphGeometryRendererTask(this.name, frameGraph, scene, { doNotChangeAspectRatio, enableClusteredLights });
            }
            _createFrameGraphObject() {
                this._frameGraphTask?.dispose();
                this._frameGraphTask = new FrameGraphGeometryRendererTask(this.name, this._frameGraph, this._scene, {
                    doNotChangeAspectRatio: this._additionalConstructionParameters[0],
                    enableClusteredLights: this._additionalConstructionParameters[1],
                });
            }
            _saveState(state) {
                super._saveState(state);
                state.disabled = this._frameGraphTask.disabled;
                state.isMainObjectRenderer = this.isMainObjectRenderer;
                state.depthTest = this.depthTest;
                state.depthWrite = this.depthWrite;
                state.disableShadows = this.disableShadows;
                state.renderInLinearSpace = this.renderInLinearSpace;
                state.renderParticles = this.renderParticles;
                state.renderSprites = this.renderSprites;
                state.forceLayerMaskCheck = this.forceLayerMaskCheck;
                state.enableBoundingBoxRendering = this.enableBoundingBoxRendering;
                state.enableOutlineRendering = this.enableOutlineRendering;
                state.width = this.width;
                state.height = this.height;
                state.sizeInPercentage = this.sizeInPercentage;
                state.samples = this.samples;
                state.reverseCulling = this.reverseCulling;
                state.dontRenderWhenMaterialDepthWriteIsDisabled = this.dontRenderWhenMaterialDepthWriteIsDisabled;
                state.disableDepthPrePass = this.disableDepthPrePass;
            }
            _restoreState(state) {
                super._restoreState(state);
                this._frameGraphTask.disabled = state.disabled;
                this.isMainObjectRenderer = state.isMainObjectRenderer;
                this.depthTest = state.depthTest;
                this.depthWrite = state.depthWrite;
                this.disableShadows = state.disableShadows;
                this.renderInLinearSpace = state.renderInLinearSpace;
                this.renderParticles = state.renderParticles;
                this.renderSprites = state.renderSprites;
                this.forceLayerMaskCheck = state.forceLayerMaskCheck;
                this.enableBoundingBoxRendering = state.enableBoundingBoxRendering;
                this.enableOutlineRendering = state.enableOutlineRendering;
                this.width = state.width;
                this.height = state.height;
                this.sizeInPercentage = state.sizeInPercentage;
                this.samples = state.samples;
                this.reverseCulling = state.reverseCulling;
                this.dontRenderWhenMaterialDepthWriteIsDisabled = state.dontRenderWhenMaterialDepthWriteIsDisabled;
                this.disableDepthPrePass = state.disableDepthPrePass;
            }
            /** Width of the geometry texture */
            get width() {
                return this._frameGraphTask.size.width;
            }
            set width(value) {
                this._frameGraphTask.size.width = value;
            }
            /** Height of the geometry texture */
            get height() {
                return this._frameGraphTask.size.height;
            }
            set height(value) {
                this._frameGraphTask.size.height = value;
            }
            /** Indicates if the geometry texture width and height are percentages or absolute values */
            get sizeInPercentage() {
                return this._frameGraphTask.sizeIsPercentage;
            }
            set sizeInPercentage(value) {
                this._frameGraphTask.sizeIsPercentage = value;
            }
            /** Number of samples of the geometry texture */
            get samples() {
                return this._frameGraphTask.samples;
            }
            set samples(value) {
                this._frameGraphTask.samples = value;
            }
            /** Indicates if culling must be reversed */
            get reverseCulling() {
                return this._frameGraphTask.reverseCulling;
            }
            set reverseCulling(value) {
                this._frameGraphTask.reverseCulling = value;
            }
            /** Indicates if a mesh shouldn't be rendered when its material has depth write disabled */
            get dontRenderWhenMaterialDepthWriteIsDisabled() {
                return this._frameGraphTask.dontRenderWhenMaterialDepthWriteIsDisabled;
            }
            set dontRenderWhenMaterialDepthWriteIsDisabled(value) {
                this._frameGraphTask.dontRenderWhenMaterialDepthWriteIsDisabled = value;
            }
            /** Indicates if depth pre-pass must be disabled */
            get disableDepthPrePass() {
                return this._frameGraphTask.disableDepthPrePass;
            }
            set disableDepthPrePass(value) {
                this._frameGraphTask.disableDepthPrePass = value;
            }
            /**
             * Gets the current class name
             * @returns the class name
             */
            getClassName() {
                return "NodeRenderGraphGeometryRendererBlock";
            }
            /**
             * Gets the geometry irradiance component
             */
            get geomIrradiance() {
                return this._outputs[3];
            }
            /**
             * Gets the geometry view depth component
             */
            get geomViewDepth() {
                return this._outputs[4];
            }
            /**
             * Gets the geometry normalized view depth component
             */
            get geomNormViewDepth() {
                return this._outputs[5];
            }
            /**
             * Gets the geometry screen depth component
             */
            get geomScreenDepth() {
                return this._outputs[6];
            }
            /**
             * Gets the geometry view normal component
             */
            get geomViewNormal() {
                return this._outputs[7];
            }
            /**
             * Gets the world geometry normal component
             */
            get geomWorldNormal() {
                return this._outputs[8];
            }
            /**
             * Gets the geometry local position component
             */
            get geomLocalPosition() {
                return this._outputs[9];
            }
            /**
             * Gets the geometry world position component
             */
            get geomWorldPosition() {
                return this._outputs[10];
            }
            /**
             * Gets the geometry albedo component
             */
            get geomAlbedo() {
                return this._outputs[11];
            }
            /**
             * Gets the geometry reflectivity component
             */
            get geomReflectivity() {
                return this._outputs[12];
            }
            /**
             * Gets the geometry velocity component
             */
            get geomVelocity() {
                return this._outputs[13];
            }
            /**
             * Gets the geometry linear velocity component
             */
            get geomLinearVelocity() {
                return this._outputs[14];
            }
            _buildBlock(state) {
                super._buildBlock(state);
                const textureActivation = [
                    this.geomIrradiance.isConnected,
                    this.geomViewDepth.isConnected,
                    this.geomNormViewDepth.isConnected,
                    this.geomScreenDepth.isConnected,
                    this.geomViewNormal.isConnected,
                    this.geomWorldNormal.isConnected,
                    this.geomLocalPosition.isConnected,
                    this.geomWorldPosition.isConnected,
                    this.geomAlbedo.isConnected,
                    this.geomReflectivity.isConnected,
                    this.geomVelocity.isConnected,
                    this.geomLinearVelocity.isConnected,
                ];
                this.geomIrradiance.value = this._frameGraphTask.geometryIrradianceTexture;
                this.geomViewDepth.value = this._frameGraphTask.geometryViewDepthTexture;
                this.geomNormViewDepth.value = this._frameGraphTask.geometryNormViewDepthTexture;
                this.geomScreenDepth.value = this._frameGraphTask.geometryScreenDepthTexture;
                this.geomViewNormal.value = this._frameGraphTask.geometryViewNormalTexture;
                this.geomWorldNormal.value = this._frameGraphTask.geometryWorldNormalTexture;
                this.geomLocalPosition.value = this._frameGraphTask.geometryLocalPositionTexture;
                this.geomWorldPosition.value = this._frameGraphTask.geometryWorldPositionTexture;
                this.geomAlbedo.value = this._frameGraphTask.geometryAlbedoTexture;
                this.geomReflectivity.value = this._frameGraphTask.geometryReflectivityTexture;
                this.geomVelocity.value = this._frameGraphTask.geometryVelocityTexture;
                this.geomLinearVelocity.value = this._frameGraphTask.geometryLinearVelocityTexture;
                this._frameGraphTask.textureDescriptions = [];
                const textureFormats = [
                    this.irradianceFormat,
                    this.viewDepthFormat,
                    this.normalizedViewDepthFormat,
                    this.screenDepthFormat,
                    this.viewNormalFormat,
                    this.worldNormalFormat,
                    this.localPositionFormat,
                    this.worldPositionFormat,
                    this.albedoFormat,
                    this.reflectivityFormat,
                    this.velocityFormat,
                    this.linearVelocityFormat,
                ];
                const textureTypes = [
                    this.irradianceType,
                    this.viewDepthType,
                    this.normalizedViewDepthType,
                    this.screenDepthType,
                    this.viewNormalType,
                    this.worldNormalType,
                    this.localPositionType,
                    this.worldPositionType,
                    this.albedoType,
                    this.reflectivityType,
                    this.velocityType,
                    this.linearVelocityType,
                ];
                const bufferTypes = [
                    14,
                    5,
                    13,
                    10,
                    6,
                    8,
                    9,
                    1,
                    12,
                    3,
                    2,
                    11,
                ];
                for (let i = 0; i < textureActivation.length; i++) {
                    if (textureActivation[i]) {
                        this._frameGraphTask.textureDescriptions.push({
                            textureFormat: textureFormats[i],
                            textureType: textureTypes[i],
                            type: bufferTypes[i],
                        });
                    }
                }
            }
            _dumpPropertiesCode() {
                const codes = [];
                codes.push(`${this._codeVariableName}.size = { width: ${this.width}, height: ${this.height} };`);
                codes.push(`${this._codeVariableName}.sizeInPercentage = ${this.sizeInPercentage};`);
                codes.push(`${this._codeVariableName}.samples = ${this.samples};`);
                codes.push(`${this._codeVariableName}.reverseCulling = ${this.reverseCulling};`);
                codes.push(`${this._codeVariableName}.dontRenderWhenMaterialDepthWriteIsDisabled = ${this.dontRenderWhenMaterialDepthWriteIsDisabled};`);
                codes.push(`${this._codeVariableName}.disableDepthPrePass = ${this.disableDepthPrePass};`);
                codes.push(`${this._codeVariableName}.irradianceFormat = ${this.irradianceFormat};`);
                codes.push(`${this._codeVariableName}.irradianceType = ${this.irradianceType};`);
                codes.push(`${this._codeVariableName}.viewDepthFormat = ${this.viewDepthFormat};`);
                codes.push(`${this._codeVariableName}.viewDepthType = ${this.viewDepthType};`);
                codes.push(`${this._codeVariableName}.normalizedViewDepthFormat = ${this.normalizedViewDepthFormat};`);
                codes.push(`${this._codeVariableName}.normalizedViewDepthType = ${this.normalizedViewDepthType};`);
                codes.push(`${this._codeVariableName}.screenDepthFormat = ${this.screenDepthFormat};`);
                codes.push(`${this._codeVariableName}.screenDepthType = ${this.screenDepthType};`);
                codes.push(`${this._codeVariableName}.localPositionFormat = ${this.localPositionFormat};`);
                codes.push(`${this._codeVariableName}.localPositionType = ${this.localPositionType};`);
                codes.push(`${this._codeVariableName}.worldPositionFormat = ${this.worldPositionFormat};`);
                codes.push(`${this._codeVariableName}.worldPositionType = ${this.worldPositionType};`);
                codes.push(`${this._codeVariableName}.viewNormalFormat = ${this.viewNormalFormat};`);
                codes.push(`${this._codeVariableName}.viewNormalType = ${this.viewNormalType};`);
                codes.push(`${this._codeVariableName}.worldNormalFormat = ${this.worldNormalFormat};`);
                codes.push(`${this._codeVariableName}.worldNormalType = ${this.worldNormalType};`);
                codes.push(`${this._codeVariableName}.albedoFormat = ${this.albedoFormat};`);
                codes.push(`${this._codeVariableName}.albedoType = ${this.albedoType};`);
                codes.push(`${this._codeVariableName}.reflectivityFormat = ${this.reflectivityFormat};`);
                codes.push(`${this._codeVariableName}.reflectivityType = ${this.reflectivityType};`);
                codes.push(`${this._codeVariableName}.velocityFormat = ${this.velocityFormat};`);
                codes.push(`${this._codeVariableName}.velocityType = ${this.velocityType};`);
                codes.push(`${this._codeVariableName}.linearVelocityFormat = ${this.linearVelocityFormat};`);
                codes.push(`${this._codeVariableName}.linearVelocityType = ${this.linearVelocityType};`);
                return super._dumpPropertiesCode() + codes.join("\n");
            }
            /**
             * Serializes this block
             * @returns the serialized object
             */
            serialize() {
                const serializationObject = super.serialize();
                serializationObject.sizeInPercentage = this.sizeInPercentage;
                serializationObject.width = this.width;
                serializationObject.height = this.height;
                serializationObject.samples = this.samples;
                serializationObject.reverseCulling = this.reverseCulling;
                serializationObject.dontRenderWhenMaterialDepthWriteIsDisabled = this.dontRenderWhenMaterialDepthWriteIsDisabled;
                serializationObject.disableDepthPrePass = this.disableDepthPrePass;
                serializationObject.irradianceFormat = this.irradianceFormat;
                serializationObject.irradianceType = this.irradianceType;
                serializationObject.viewDepthFormat = this.viewDepthFormat;
                serializationObject.viewDepthType = this.viewDepthType;
                serializationObject.normalizedViewDepthFormat = this.normalizedViewDepthFormat;
                serializationObject.normalizedViewDepthType = this.normalizedViewDepthType;
                serializationObject.screenDepthFormat = this.screenDepthFormat;
                serializationObject.screenDepthType = this.screenDepthType;
                serializationObject.localPositionFormat = this.localPositionFormat;
                serializationObject.localPositionType = this.localPositionType;
                serializationObject.worldPositionFormat = this.worldPositionFormat;
                serializationObject.worldPositionType = this.worldPositionType;
                serializationObject.viewNormalFormat = this.viewNormalFormat;
                serializationObject.viewNormalType = this.viewNormalType;
                serializationObject.worldNormalFormat = this.worldNormalFormat;
                serializationObject.worldNormalType = this.worldNormalType;
                serializationObject.albedoFormat = this.albedoFormat;
                serializationObject.albedoType = this.albedoType;
                serializationObject.reflectivityFormat = this.reflectivityFormat;
                serializationObject.reflectivityType = this.reflectivityType;
                serializationObject.velocityFormat = this.velocityFormat;
                serializationObject.velocityType = this.velocityType;
                serializationObject.linearVelocityFormat = this.linearVelocityFormat;
                serializationObject.linearVelocityType = this.linearVelocityType;
                return serializationObject;
            }
            _deserialize(serializationObject) {
                super._deserialize(serializationObject);
                this.sizeInPercentage = !!serializationObject.sizeInPercentage;
                this.width = serializationObject.width ?? 100;
                this.height = serializationObject.height ?? 100;
                this.samples = serializationObject.samples;
                this.reverseCulling = serializationObject.reverseCulling;
                this.dontRenderWhenMaterialDepthWriteIsDisabled = serializationObject.dontRenderWhenMaterialDepthWriteIsDisabled;
                this.disableDepthPrePass = serializationObject.disableDepthPrePass ?? true;
                this.irradianceFormat = serializationObject.irradianceFormat ?? 5;
                this.irradianceType = serializationObject.irradianceType ?? 2;
                this.viewDepthFormat = serializationObject.viewDepthFormat;
                this.viewDepthType = serializationObject.viewDepthType;
                this.normalizedViewDepthFormat = serializationObject.normalizedViewDepthFormat ?? 6;
                this.normalizedViewDepthType = serializationObject.normalizedViewDepthType ?? 0;
                this.screenDepthFormat = serializationObject.screenDepthFormat;
                this.screenDepthType = serializationObject.screenDepthType;
                this.localPositionFormat = serializationObject.localPositionFormat;
                this.localPositionType = serializationObject.localPositionType;
                this.worldPositionFormat = serializationObject.worldPositionFormat;
                this.worldPositionType = serializationObject.worldPositionType;
                this.viewNormalFormat = serializationObject.viewNormalFormat;
                this.viewNormalType = serializationObject.viewNormalType;
                this.worldNormalFormat = serializationObject.worldNormalFormat;
                this.worldNormalType = serializationObject.worldNormalType;
                this.albedoFormat = serializationObject.albedoFormat;
                this.albedoType = serializationObject.albedoType;
                this.reflectivityFormat = serializationObject.reflectivityFormat;
                this.reflectivityType = serializationObject.reflectivityType;
                this.velocityFormat = serializationObject.velocityFormat;
                this.velocityType = serializationObject.velocityType;
                this.linearVelocityFormat = serializationObject.linearVelocityFormat;
                this.linearVelocityType = serializationObject.linearVelocityType;
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _get_width_decorators = [editableInPropertyPage("Texture width", 2 /* PropertyTypeForEdition.Int */, "GEOMETRY")];
            _get_height_decorators = [editableInPropertyPage("Texture height", 2 /* PropertyTypeForEdition.Int */, "GEOMETRY")];
            _get_sizeInPercentage_decorators = [editableInPropertyPage("Size is in percentage", 0 /* PropertyTypeForEdition.Boolean */, "GEOMETRY")];
            _get_samples_decorators = [editableInPropertyPage("Samples", 2 /* PropertyTypeForEdition.Int */, "GEOMETRY", { min: 1, max: 8 })];
            _get_reverseCulling_decorators = [editableInPropertyPage("Reverse culling", 0 /* PropertyTypeForEdition.Boolean */, "GEOMETRY")];
            _get_dontRenderWhenMaterialDepthWriteIsDisabled_decorators = [editableInPropertyPage("Don't render if material depth write is disabled", 0 /* PropertyTypeForEdition.Boolean */, "GEOMETRY")];
            _get_disableDepthPrePass_decorators = [editableInPropertyPage("Disable depth pre-pass", 0 /* PropertyTypeForEdition.Boolean */, "GEOMETRY")];
            _irradianceFormat_decorators = [editableInPropertyPage("Format", 9 /* PropertyTypeForEdition.TextureFormat */, "OUTPUT - IRRADIANCE")];
            _irradianceType_decorators = [editableInPropertyPage("Type", 10 /* PropertyTypeForEdition.TextureType */, "OUTPUT - IRRADIANCE")];
            _viewDepthFormat_decorators = [editableInPropertyPage("Format", 9 /* PropertyTypeForEdition.TextureFormat */, "OUTPUT - VIEW DEPTH")];
            _viewDepthType_decorators = [editableInPropertyPage("Type", 10 /* PropertyTypeForEdition.TextureType */, "OUTPUT - VIEW DEPTH")];
            _normalizedViewDepthFormat_decorators = [editableInPropertyPage("Format", 9 /* PropertyTypeForEdition.TextureFormat */, "OUTPUT - NORMALIZED VIEW DEPTH")];
            _normalizedViewDepthType_decorators = [editableInPropertyPage("Type", 10 /* PropertyTypeForEdition.TextureType */, "OUTPUT - NORMALIZED VIEW DEPTH")];
            _screenDepthFormat_decorators = [editableInPropertyPage("Format", 9 /* PropertyTypeForEdition.TextureFormat */, "OUTPUT - SCREEN DEPTH")];
            _screenDepthType_decorators = [editableInPropertyPage("Type", 10 /* PropertyTypeForEdition.TextureType */, "OUTPUT - SCREEN DEPTH")];
            _viewNormalFormat_decorators = [editableInPropertyPage("Format", 9 /* PropertyTypeForEdition.TextureFormat */, "OUTPUT - VIEW NORMAL")];
            _viewNormalType_decorators = [editableInPropertyPage("Type", 10 /* PropertyTypeForEdition.TextureType */, "OUTPUT - VIEW NORMAL")];
            _worldNormalFormat_decorators = [editableInPropertyPage("Format", 9 /* PropertyTypeForEdition.TextureFormat */, "OUTPUT - WORLD NORMAL")];
            _worldNormalType_decorators = [editableInPropertyPage("Type", 10 /* PropertyTypeForEdition.TextureType */, "OUTPUT - WORLD NORMAL")];
            _localPositionFormat_decorators = [editableInPropertyPage("Format", 9 /* PropertyTypeForEdition.TextureFormat */, "OUTPUT - LOCAL POSITION")];
            _localPositionType_decorators = [editableInPropertyPage("Type", 10 /* PropertyTypeForEdition.TextureType */, "OUTPUT - LOCAL POSITION")];
            _worldPositionFormat_decorators = [editableInPropertyPage("Format", 9 /* PropertyTypeForEdition.TextureFormat */, "OUTPUT - WORLD POSITION")];
            _worldPositionType_decorators = [editableInPropertyPage("Type", 10 /* PropertyTypeForEdition.TextureType */, "OUTPUT - WORLD POSITION")];
            _albedoFormat_decorators = [editableInPropertyPage("Format", 9 /* PropertyTypeForEdition.TextureFormat */, "OUTPUT - ALBEDO")];
            _albedoType_decorators = [editableInPropertyPage("Type", 10 /* PropertyTypeForEdition.TextureType */, "OUTPUT - ALBEDO")];
            _reflectivityFormat_decorators = [editableInPropertyPage("Format", 9 /* PropertyTypeForEdition.TextureFormat */, "OUTPUT - REFLECTIVITY")];
            _reflectivityType_decorators = [editableInPropertyPage("Type", 10 /* PropertyTypeForEdition.TextureType */, "OUTPUT - REFLECTIVITY")];
            _velocityFormat_decorators = [editableInPropertyPage("Format", 9 /* PropertyTypeForEdition.TextureFormat */, "OUTPUT - VELOCITY")];
            _velocityType_decorators = [editableInPropertyPage("Type", 10 /* PropertyTypeForEdition.TextureType */, "OUTPUT - VELOCITY")];
            _linearVelocityFormat_decorators = [editableInPropertyPage("Format", 9 /* PropertyTypeForEdition.TextureFormat */, "OUTPUT - LINEAR VELOCITY")];
            _linearVelocityType_decorators = [editableInPropertyPage("Type", 10 /* PropertyTypeForEdition.TextureType */, "OUTPUT - LINEAR VELOCITY")];
            __esDecorate(_a, null, _get_width_decorators, { kind: "getter", name: "width", static: false, private: false, access: { has: obj => "width" in obj, get: obj => obj.width }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _get_height_decorators, { kind: "getter", name: "height", static: false, private: false, access: { has: obj => "height" in obj, get: obj => obj.height }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _get_sizeInPercentage_decorators, { kind: "getter", name: "sizeInPercentage", static: false, private: false, access: { has: obj => "sizeInPercentage" in obj, get: obj => obj.sizeInPercentage }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _get_samples_decorators, { kind: "getter", name: "samples", static: false, private: false, access: { has: obj => "samples" in obj, get: obj => obj.samples }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _get_reverseCulling_decorators, { kind: "getter", name: "reverseCulling", static: false, private: false, access: { has: obj => "reverseCulling" in obj, get: obj => obj.reverseCulling }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _get_dontRenderWhenMaterialDepthWriteIsDisabled_decorators, { kind: "getter", name: "dontRenderWhenMaterialDepthWriteIsDisabled", static: false, private: false, access: { has: obj => "dontRenderWhenMaterialDepthWriteIsDisabled" in obj, get: obj => obj.dontRenderWhenMaterialDepthWriteIsDisabled }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _get_disableDepthPrePass_decorators, { kind: "getter", name: "disableDepthPrePass", static: false, private: false, access: { has: obj => "disableDepthPrePass" in obj, get: obj => obj.disableDepthPrePass }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(null, null, _irradianceFormat_decorators, { kind: "field", name: "irradianceFormat", static: false, private: false, access: { has: obj => "irradianceFormat" in obj, get: obj => obj.irradianceFormat, set: (obj, value) => { obj.irradianceFormat = value; } }, metadata: _metadata }, _irradianceFormat_initializers, _irradianceFormat_extraInitializers);
            __esDecorate(null, null, _irradianceType_decorators, { kind: "field", name: "irradianceType", static: false, private: false, access: { has: obj => "irradianceType" in obj, get: obj => obj.irradianceType, set: (obj, value) => { obj.irradianceType = value; } }, metadata: _metadata }, _irradianceType_initializers, _irradianceType_extraInitializers);
            __esDecorate(null, null, _viewDepthFormat_decorators, { kind: "field", name: "viewDepthFormat", static: false, private: false, access: { has: obj => "viewDepthFormat" in obj, get: obj => obj.viewDepthFormat, set: (obj, value) => { obj.viewDepthFormat = value; } }, metadata: _metadata }, _viewDepthFormat_initializers, _viewDepthFormat_extraInitializers);
            __esDecorate(null, null, _viewDepthType_decorators, { kind: "field", name: "viewDepthType", static: false, private: false, access: { has: obj => "viewDepthType" in obj, get: obj => obj.viewDepthType, set: (obj, value) => { obj.viewDepthType = value; } }, metadata: _metadata }, _viewDepthType_initializers, _viewDepthType_extraInitializers);
            __esDecorate(null, null, _normalizedViewDepthFormat_decorators, { kind: "field", name: "normalizedViewDepthFormat", static: false, private: false, access: { has: obj => "normalizedViewDepthFormat" in obj, get: obj => obj.normalizedViewDepthFormat, set: (obj, value) => { obj.normalizedViewDepthFormat = value; } }, metadata: _metadata }, _normalizedViewDepthFormat_initializers, _normalizedViewDepthFormat_extraInitializers);
            __esDecorate(null, null, _normalizedViewDepthType_decorators, { kind: "field", name: "normalizedViewDepthType", static: false, private: false, access: { has: obj => "normalizedViewDepthType" in obj, get: obj => obj.normalizedViewDepthType, set: (obj, value) => { obj.normalizedViewDepthType = value; } }, metadata: _metadata }, _normalizedViewDepthType_initializers, _normalizedViewDepthType_extraInitializers);
            __esDecorate(null, null, _screenDepthFormat_decorators, { kind: "field", name: "screenDepthFormat", static: false, private: false, access: { has: obj => "screenDepthFormat" in obj, get: obj => obj.screenDepthFormat, set: (obj, value) => { obj.screenDepthFormat = value; } }, metadata: _metadata }, _screenDepthFormat_initializers, _screenDepthFormat_extraInitializers);
            __esDecorate(null, null, _screenDepthType_decorators, { kind: "field", name: "screenDepthType", static: false, private: false, access: { has: obj => "screenDepthType" in obj, get: obj => obj.screenDepthType, set: (obj, value) => { obj.screenDepthType = value; } }, metadata: _metadata }, _screenDepthType_initializers, _screenDepthType_extraInitializers);
            __esDecorate(null, null, _viewNormalFormat_decorators, { kind: "field", name: "viewNormalFormat", static: false, private: false, access: { has: obj => "viewNormalFormat" in obj, get: obj => obj.viewNormalFormat, set: (obj, value) => { obj.viewNormalFormat = value; } }, metadata: _metadata }, _viewNormalFormat_initializers, _viewNormalFormat_extraInitializers);
            __esDecorate(null, null, _viewNormalType_decorators, { kind: "field", name: "viewNormalType", static: false, private: false, access: { has: obj => "viewNormalType" in obj, get: obj => obj.viewNormalType, set: (obj, value) => { obj.viewNormalType = value; } }, metadata: _metadata }, _viewNormalType_initializers, _viewNormalType_extraInitializers);
            __esDecorate(null, null, _worldNormalFormat_decorators, { kind: "field", name: "worldNormalFormat", static: false, private: false, access: { has: obj => "worldNormalFormat" in obj, get: obj => obj.worldNormalFormat, set: (obj, value) => { obj.worldNormalFormat = value; } }, metadata: _metadata }, _worldNormalFormat_initializers, _worldNormalFormat_extraInitializers);
            __esDecorate(null, null, _worldNormalType_decorators, { kind: "field", name: "worldNormalType", static: false, private: false, access: { has: obj => "worldNormalType" in obj, get: obj => obj.worldNormalType, set: (obj, value) => { obj.worldNormalType = value; } }, metadata: _metadata }, _worldNormalType_initializers, _worldNormalType_extraInitializers);
            __esDecorate(null, null, _localPositionFormat_decorators, { kind: "field", name: "localPositionFormat", static: false, private: false, access: { has: obj => "localPositionFormat" in obj, get: obj => obj.localPositionFormat, set: (obj, value) => { obj.localPositionFormat = value; } }, metadata: _metadata }, _localPositionFormat_initializers, _localPositionFormat_extraInitializers);
            __esDecorate(null, null, _localPositionType_decorators, { kind: "field", name: "localPositionType", static: false, private: false, access: { has: obj => "localPositionType" in obj, get: obj => obj.localPositionType, set: (obj, value) => { obj.localPositionType = value; } }, metadata: _metadata }, _localPositionType_initializers, _localPositionType_extraInitializers);
            __esDecorate(null, null, _worldPositionFormat_decorators, { kind: "field", name: "worldPositionFormat", static: false, private: false, access: { has: obj => "worldPositionFormat" in obj, get: obj => obj.worldPositionFormat, set: (obj, value) => { obj.worldPositionFormat = value; } }, metadata: _metadata }, _worldPositionFormat_initializers, _worldPositionFormat_extraInitializers);
            __esDecorate(null, null, _worldPositionType_decorators, { kind: "field", name: "worldPositionType", static: false, private: false, access: { has: obj => "worldPositionType" in obj, get: obj => obj.worldPositionType, set: (obj, value) => { obj.worldPositionType = value; } }, metadata: _metadata }, _worldPositionType_initializers, _worldPositionType_extraInitializers);
            __esDecorate(null, null, _albedoFormat_decorators, { kind: "field", name: "albedoFormat", static: false, private: false, access: { has: obj => "albedoFormat" in obj, get: obj => obj.albedoFormat, set: (obj, value) => { obj.albedoFormat = value; } }, metadata: _metadata }, _albedoFormat_initializers, _albedoFormat_extraInitializers);
            __esDecorate(null, null, _albedoType_decorators, { kind: "field", name: "albedoType", static: false, private: false, access: { has: obj => "albedoType" in obj, get: obj => obj.albedoType, set: (obj, value) => { obj.albedoType = value; } }, metadata: _metadata }, _albedoType_initializers, _albedoType_extraInitializers);
            __esDecorate(null, null, _reflectivityFormat_decorators, { kind: "field", name: "reflectivityFormat", static: false, private: false, access: { has: obj => "reflectivityFormat" in obj, get: obj => obj.reflectivityFormat, set: (obj, value) => { obj.reflectivityFormat = value; } }, metadata: _metadata }, _reflectivityFormat_initializers, _reflectivityFormat_extraInitializers);
            __esDecorate(null, null, _reflectivityType_decorators, { kind: "field", name: "reflectivityType", static: false, private: false, access: { has: obj => "reflectivityType" in obj, get: obj => obj.reflectivityType, set: (obj, value) => { obj.reflectivityType = value; } }, metadata: _metadata }, _reflectivityType_initializers, _reflectivityType_extraInitializers);
            __esDecorate(null, null, _velocityFormat_decorators, { kind: "field", name: "velocityFormat", static: false, private: false, access: { has: obj => "velocityFormat" in obj, get: obj => obj.velocityFormat, set: (obj, value) => { obj.velocityFormat = value; } }, metadata: _metadata }, _velocityFormat_initializers, _velocityFormat_extraInitializers);
            __esDecorate(null, null, _velocityType_decorators, { kind: "field", name: "velocityType", static: false, private: false, access: { has: obj => "velocityType" in obj, get: obj => obj.velocityType, set: (obj, value) => { obj.velocityType = value; } }, metadata: _metadata }, _velocityType_initializers, _velocityType_extraInitializers);
            __esDecorate(null, null, _linearVelocityFormat_decorators, { kind: "field", name: "linearVelocityFormat", static: false, private: false, access: { has: obj => "linearVelocityFormat" in obj, get: obj => obj.linearVelocityFormat, set: (obj, value) => { obj.linearVelocityFormat = value; } }, metadata: _metadata }, _linearVelocityFormat_initializers, _linearVelocityFormat_extraInitializers);
            __esDecorate(null, null, _linearVelocityType_decorators, { kind: "field", name: "linearVelocityType", static: false, private: false, access: { has: obj => "linearVelocityType" in obj, get: obj => obj.linearVelocityType, set: (obj, value) => { obj.linearVelocityType = value; } }, metadata: _metadata }, _linearVelocityType_initializers, _linearVelocityType_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
export { NodeRenderGraphGeometryRendererBlock };
let _Registered = false;
/**
 * Register side effects for geometryRendererBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterGeometryRendererBlock() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    RegisterClass("BABYLON.NodeRenderGraphGeometryRendererBlock", NodeRenderGraphGeometryRendererBlock);
}
//# sourceMappingURL=geometryRendererBlock.pure.js.map