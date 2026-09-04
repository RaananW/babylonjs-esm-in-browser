/** This file must only contain pure code and pure imports */
import { __esDecorate, __runInitializers } from "../../../../tslib.es6.js";
import { NodeMaterialBlock } from "../../nodeMaterialBlock.js";
import { NodeMaterialBlockConnectionPointTypes } from "../../Enums/nodeMaterialBlockConnectionPointTypes.js";
import { NodeMaterialBlockTargets } from "../../Enums/nodeMaterialBlockTargets.js";
import { NodeMaterialSystemValues } from "../../Enums/nodeMaterialSystemValues.js";
import { InputBlock } from "../Input/inputBlock.pure.js";
import { PBRBaseMaterial } from "../../../PBR/pbrBaseMaterial.pure.js";
import { editableInPropertyPage } from "../../../../Decorators/nodeDecorator.js";
import { NodeMaterialConnectionPointCustomObject } from "../../nodeMaterialConnectionPointCustomObject.js";
import { SheenBlock } from "./sheenBlock.pure.js";
import { GetEnvironmentBRDFTexture } from "../../../../Misc/brdfTextureTools.js";
import { MaterialFlags } from "../../../materialFlags.js";
import { AnisotropyBlock } from "./anisotropyBlock.pure.js";
import { ReflectionBlock } from "./reflectionBlock.pure.js";
import { ClearCoatBlock } from "./clearCoatBlock.pure.js";
import { IridescenceBlock } from "./iridescenceBlock.pure.js";
import { SubSurfaceBlock } from "./subSurfaceBlock.pure.js";

import { Color3 } from "../../../../Maths/math.color.pure.js";
import { Logger } from "../../../../Misc/logger.js";
import { BindLight, BindLights, PrepareDefinesForLight, PrepareDefinesForLights, PrepareDefinesForMultiview, PrepareUniformsAndSamplersForLight, } from "../../../materialHelper.functions.js";
import { RegisterClass } from "../../../../Misc/typeStore.js";
const MapOutputToVariable = {
    ambientClr: ["finalAmbient", ""],
    diffuseDir: ["finalDiffuse", ""],
    specularDir: ["finalSpecularScaled", "!defined(UNLIT) && defined(SPECULARTERM)"],
    clearcoatDir: ["finalClearCoatScaled", "!defined(UNLIT) && defined(CLEARCOAT)"],
    sheenDir: ["finalSheenScaled", "!defined(UNLIT) && defined(SHEEN)"],
    diffuseInd: ["finalIrradiance", "!defined(UNLIT) && defined(REFLECTION)"],
    specularInd: ["finalRadianceScaled", "!defined(UNLIT) && defined(REFLECTION)"],
    clearcoatInd: ["clearcoatOut.finalClearCoatRadianceScaled", "!defined(UNLIT) && defined(REFLECTION) && defined(CLEARCOAT)"],
    sheenInd: ["sheenOut.finalSheenRadianceScaled", "!defined(UNLIT) && defined(REFLECTION) && defined(SHEEN) && defined(ENVIRONMENTBRDF)"],
    refraction: ["subSurfaceOut.finalRefraction", "!defined(UNLIT) && defined(SS_REFRACTION)"],
    lighting: ["finalColor.rgb", ""],
    shadow: ["aggShadow", ""],
    alpha: ["alpha", ""],
};
/**
 * Block used to implement the PBR metallic/roughness model
 * @see https://playground.babylonjs.com/#D8AK3Z#80
 */
let PBRMetallicRoughnessBlock = (() => {
    var _a;
    let _classSuper = NodeMaterialBlock;
    let _directIntensity_decorators;
    let _directIntensity_initializers = [];
    let _directIntensity_extraInitializers = [];
    let _environmentIntensity_decorators;
    let _environmentIntensity_initializers = [];
    let _environmentIntensity_extraInitializers = [];
    let _specularIntensity_decorators;
    let _specularIntensity_initializers = [];
    let _specularIntensity_extraInitializers = [];
    let _lightFalloff_decorators;
    let _lightFalloff_initializers = [];
    let _lightFalloff_extraInitializers = [];
    let _useAlphaTest_decorators;
    let _useAlphaTest_initializers = [];
    let _useAlphaTest_extraInitializers = [];
    let _alphaTestCutoff_decorators;
    let _alphaTestCutoff_initializers = [];
    let _alphaTestCutoff_extraInitializers = [];
    let _useAlphaBlending_decorators;
    let _useAlphaBlending_initializers = [];
    let _useAlphaBlending_extraInitializers = [];
    let _useRadianceOverAlpha_decorators;
    let _useRadianceOverAlpha_initializers = [];
    let _useRadianceOverAlpha_extraInitializers = [];
    let _useSpecularOverAlpha_decorators;
    let _useSpecularOverAlpha_initializers = [];
    let _useSpecularOverAlpha_extraInitializers = [];
    let _enableSpecularAntiAliasing_decorators;
    let _enableSpecularAntiAliasing_initializers = [];
    let _enableSpecularAntiAliasing_extraInitializers = [];
    let _realTimeFiltering_decorators;
    let _realTimeFiltering_initializers = [];
    let _realTimeFiltering_extraInitializers = [];
    let _realTimeFilteringQuality_decorators;
    let _realTimeFilteringQuality_initializers = [];
    let _realTimeFilteringQuality_extraInitializers = [];
    let _baseDiffuseModel_decorators;
    let _baseDiffuseModel_initializers = [];
    let _baseDiffuseModel_extraInitializers = [];
    let _useEnergyConservation_decorators;
    let _useEnergyConservation_initializers = [];
    let _useEnergyConservation_extraInitializers = [];
    let _useRadianceOcclusion_decorators;
    let _useRadianceOcclusion_initializers = [];
    let _useRadianceOcclusion_extraInitializers = [];
    let _useHorizonOcclusion_decorators;
    let _useHorizonOcclusion_initializers = [];
    let _useHorizonOcclusion_extraInitializers = [];
    let _unlit_decorators;
    let _unlit_initializers = [];
    let _unlit_extraInitializers = [];
    let _forceNormalForward_decorators;
    let _forceNormalForward_initializers = [];
    let _forceNormalForward_extraInitializers = [];
    let _generateOnlyFragmentCode_decorators;
    let _generateOnlyFragmentCode_initializers = [];
    let _generateOnlyFragmentCode_extraInitializers = [];
    let _debugMode_decorators;
    let _debugMode_initializers = [];
    let _debugMode_extraInitializers = [];
    let _debugLimit_decorators;
    let _debugLimit_initializers = [];
    let _debugLimit_extraInitializers = [];
    let _debugFactor_decorators;
    let _debugFactor_initializers = [];
    let _debugFactor_extraInitializers = [];
    return _a = class PBRMetallicRoughnessBlock extends _classSuper {
            static _OnGenerateOnlyFragmentCodeChanged(block, _propertyName) {
                const that = block;
                if (that.worldPosition.isConnected || that.worldNormal.isConnected) {
                    that.generateOnlyFragmentCode = !that.generateOnlyFragmentCode;
                    Logger.Error("The worldPosition and worldNormal inputs must not be connected to be able to switch!");
                    return false;
                }
                that._setTarget();
                return true;
            }
            _setTarget() {
                this._setInitialTarget(this.generateOnlyFragmentCode ? NodeMaterialBlockTargets.Fragment : NodeMaterialBlockTargets.VertexAndFragment);
                this.getInputByName("worldPosition").target = this.generateOnlyFragmentCode ? NodeMaterialBlockTargets.Fragment : NodeMaterialBlockTargets.Vertex;
                this.getInputByName("worldNormal").target = this.generateOnlyFragmentCode ? NodeMaterialBlockTargets.Fragment : NodeMaterialBlockTargets.Vertex;
            }
            /**
             * Create a new ReflectionBlock
             * @param name defines the block name
             */
            constructor(name) {
                super(name, NodeMaterialBlockTargets.VertexAndFragment);
                this._environmentBRDFTexture = null;
                this._metallicReflectanceColor = Color3.White();
                this._metallicF0Factor = 1;
                /**
                 * Intensity of the direct lights e.g. the four lights available in your scene.
                 * This impacts both the direct diffuse and specular highlights.
                 */
                this.directIntensity = __runInitializers(this, _directIntensity_initializers, 1.0);
                /**
                 * Intensity of the environment e.g. how much the environment will light the object
                 * either through harmonics for rough material or through the reflection for shiny ones.
                 */
                this.environmentIntensity = (__runInitializers(this, _directIntensity_extraInitializers), __runInitializers(this, _environmentIntensity_initializers, 1.0));
                /**
                 * This is a special control allowing the reduction of the specular highlights coming from the
                 * four lights of the scene. Those highlights may not be needed in full environment lighting.
                 */
                this.specularIntensity = (__runInitializers(this, _environmentIntensity_extraInitializers), __runInitializers(this, _specularIntensity_initializers, 1.0));
                /**
                 * Defines the  falloff type used in this material.
                 * It by default is Physical.
                 */
                this.lightFalloff = (__runInitializers(this, _specularIntensity_extraInitializers), __runInitializers(this, _lightFalloff_initializers, 0));
                /**
                 * Specifies that alpha test should be used
                 */
                this.useAlphaTest = (__runInitializers(this, _lightFalloff_extraInitializers), __runInitializers(this, _useAlphaTest_initializers, false));
                /**
                 * Defines the alpha limits in alpha test mode.
                 */
                this.alphaTestCutoff = (__runInitializers(this, _useAlphaTest_extraInitializers), __runInitializers(this, _alphaTestCutoff_initializers, 0.5));
                /**
                 * Specifies that alpha blending should be used
                 */
                this.useAlphaBlending = (__runInitializers(this, _alphaTestCutoff_extraInitializers), __runInitializers(this, _useAlphaBlending_initializers, false));
                /**
                 * Specifies that the material will keeps the reflection highlights over a transparent surface (only the most luminous ones).
                 * A car glass is a good example of that. When the street lights reflects on it you can not see what is behind.
                 */
                this.useRadianceOverAlpha = (__runInitializers(this, _useAlphaBlending_extraInitializers), __runInitializers(this, _useRadianceOverAlpha_initializers, true));
                /**
                 * Specifies that the material will keeps the specular highlights over a transparent surface (only the most luminous ones).
                 * A car glass is a good example of that. When sun reflects on it you can not see what is behind.
                 */
                this.useSpecularOverAlpha = (__runInitializers(this, _useRadianceOverAlpha_extraInitializers), __runInitializers(this, _useSpecularOverAlpha_initializers, true));
                /**
                 * Enables specular anti aliasing in the PBR shader.
                 * It will both interacts on the Geometry for analytical and IBL lighting.
                 * It also prefilter the roughness map based on the bump values.
                 */
                this.enableSpecularAntiAliasing = (__runInitializers(this, _useSpecularOverAlpha_extraInitializers), __runInitializers(this, _enableSpecularAntiAliasing_initializers, false));
                /**
                 * Enables realtime filtering on the texture.
                 */
                this.realTimeFiltering = (__runInitializers(this, _enableSpecularAntiAliasing_extraInitializers), __runInitializers(this, _realTimeFiltering_initializers, false));
                /**
                 * Quality switch for realtime filtering
                 */
                this.realTimeFilteringQuality = (__runInitializers(this, _realTimeFiltering_extraInitializers), __runInitializers(this, _realTimeFilteringQuality_initializers, 8));
                /**
                 * Base Diffuse Model
                 */
                this.baseDiffuseModel = (__runInitializers(this, _realTimeFilteringQuality_extraInitializers), __runInitializers(this, _baseDiffuseModel_initializers, 0));
                /**
                 * Defines if the material uses energy conservation.
                 */
                this.useEnergyConservation = (__runInitializers(this, _baseDiffuseModel_extraInitializers), __runInitializers(this, _useEnergyConservation_initializers, true));
                /**
                 * This parameters will enable/disable radiance occlusion by preventing the radiance to lit
                 * too much the area relying on ambient texture to define their ambient occlusion.
                 */
                this.useRadianceOcclusion = (__runInitializers(this, _useEnergyConservation_extraInitializers), __runInitializers(this, _useRadianceOcclusion_initializers, true));
                /**
                 * This parameters will enable/disable Horizon occlusion to prevent normal maps to look shiny when the normal
                 * makes the reflect vector face the model (under horizon).
                 */
                this.useHorizonOcclusion = (__runInitializers(this, _useRadianceOcclusion_extraInitializers), __runInitializers(this, _useHorizonOcclusion_initializers, true));
                /**
                 * If set to true, no lighting calculations will be applied.
                 */
                this.unlit = (__runInitializers(this, _useHorizonOcclusion_extraInitializers), __runInitializers(this, _unlit_initializers, false));
                /**
                 * Force normal to face away from face.
                 */
                this.forceNormalForward = (__runInitializers(this, _unlit_extraInitializers), __runInitializers(this, _forceNormalForward_initializers, false));
                /** Indicates that no code should be generated in the vertex shader. Can be useful in some specific circumstances (like when doing ray marching for eg) */
                this.generateOnlyFragmentCode = (__runInitializers(this, _forceNormalForward_extraInitializers), __runInitializers(this, _generateOnlyFragmentCode_initializers, false));
                /**
                 * Defines the material debug mode.
                 * It helps seeing only some components of the material while troubleshooting.
                 */
                this.debugMode = (__runInitializers(this, _generateOnlyFragmentCode_extraInitializers), __runInitializers(this, _debugMode_initializers, 0));
                /**
                 * Specify from where on screen the debug mode should start.
                 * The value goes from -1 (full screen) to 1 (not visible)
                 * It helps with side by side comparison against the final render
                 * This defaults to 0
                 */
                this.debugLimit = (__runInitializers(this, _debugMode_extraInitializers), __runInitializers(this, _debugLimit_initializers, 0));
                /**
                 * As the default viewing range might not be enough (if the ambient is really small for instance)
                 * You can use the factor to better multiply the final value.
                 */
                this.debugFactor = (__runInitializers(this, _debugLimit_extraInitializers), __runInitializers(this, _debugFactor_initializers, 1));
                __runInitializers(this, _debugFactor_extraInitializers);
                this._isUnique = true;
                this.registerInput("worldPosition", NodeMaterialBlockConnectionPointTypes.Vector4, false, NodeMaterialBlockTargets.Vertex);
                this.registerInput("worldNormal", NodeMaterialBlockConnectionPointTypes.Vector4, false, NodeMaterialBlockTargets.Vertex);
                this.registerInput("view", NodeMaterialBlockConnectionPointTypes.Matrix, false);
                this.registerInput("cameraPosition", NodeMaterialBlockConnectionPointTypes.Vector3, false, NodeMaterialBlockTargets.Fragment);
                this.registerInput("perturbedNormal", NodeMaterialBlockConnectionPointTypes.Vector4, true, NodeMaterialBlockTargets.Fragment);
                this.registerInput("baseColor", NodeMaterialBlockConnectionPointTypes.Color3, true, NodeMaterialBlockTargets.Fragment);
                this.registerInput("metallic", NodeMaterialBlockConnectionPointTypes.Float, false, NodeMaterialBlockTargets.Fragment);
                this.registerInput("roughness", NodeMaterialBlockConnectionPointTypes.Float, false, NodeMaterialBlockTargets.Fragment);
                this.registerInput("ambientOcc", NodeMaterialBlockConnectionPointTypes.Float, true, NodeMaterialBlockTargets.Fragment);
                this.registerInput("opacity", NodeMaterialBlockConnectionPointTypes.Float, true, NodeMaterialBlockTargets.Fragment);
                this.registerInput("indexOfRefraction", NodeMaterialBlockConnectionPointTypes.Float, true, NodeMaterialBlockTargets.Fragment);
                this.registerInput("ambientColor", NodeMaterialBlockConnectionPointTypes.Color3, true, NodeMaterialBlockTargets.Fragment);
                this.registerInput("reflection", NodeMaterialBlockConnectionPointTypes.Object, true, NodeMaterialBlockTargets.Fragment, new NodeMaterialConnectionPointCustomObject("reflection", this, 0 /* NodeMaterialConnectionPointDirection.Input */, ReflectionBlock, "ReflectionBlock"));
                this.registerInput("clearcoat", NodeMaterialBlockConnectionPointTypes.Object, true, NodeMaterialBlockTargets.Fragment, new NodeMaterialConnectionPointCustomObject("clearcoat", this, 0 /* NodeMaterialConnectionPointDirection.Input */, ClearCoatBlock, "ClearCoatBlock"));
                this.registerInput("sheen", NodeMaterialBlockConnectionPointTypes.Object, true, NodeMaterialBlockTargets.Fragment, new NodeMaterialConnectionPointCustomObject("sheen", this, 0 /* NodeMaterialConnectionPointDirection.Input */, SheenBlock, "SheenBlock"));
                this.registerInput("subsurface", NodeMaterialBlockConnectionPointTypes.Object, true, NodeMaterialBlockTargets.Fragment, new NodeMaterialConnectionPointCustomObject("subsurface", this, 0 /* NodeMaterialConnectionPointDirection.Input */, SubSurfaceBlock, "SubSurfaceBlock"));
                this.registerInput("anisotropy", NodeMaterialBlockConnectionPointTypes.Object, true, NodeMaterialBlockTargets.Fragment, new NodeMaterialConnectionPointCustomObject("anisotropy", this, 0 /* NodeMaterialConnectionPointDirection.Input */, AnisotropyBlock, "AnisotropyBlock"));
                this.registerInput("iridescence", NodeMaterialBlockConnectionPointTypes.Object, true, NodeMaterialBlockTargets.Fragment, new NodeMaterialConnectionPointCustomObject("iridescence", this, 0 /* NodeMaterialConnectionPointDirection.Input */, IridescenceBlock, "IridescenceBlock"));
                this.registerOutput("ambientClr", NodeMaterialBlockConnectionPointTypes.Color3, NodeMaterialBlockTargets.Fragment);
                this.registerOutput("diffuseDir", NodeMaterialBlockConnectionPointTypes.Color3, NodeMaterialBlockTargets.Fragment);
                this.registerOutput("specularDir", NodeMaterialBlockConnectionPointTypes.Color3, NodeMaterialBlockTargets.Fragment);
                this.registerOutput("clearcoatDir", NodeMaterialBlockConnectionPointTypes.Color3, NodeMaterialBlockTargets.Fragment);
                this.registerOutput("sheenDir", NodeMaterialBlockConnectionPointTypes.Color3, NodeMaterialBlockTargets.Fragment);
                this.registerOutput("diffuseInd", NodeMaterialBlockConnectionPointTypes.Color3, NodeMaterialBlockTargets.Fragment);
                this.registerOutput("specularInd", NodeMaterialBlockConnectionPointTypes.Color3, NodeMaterialBlockTargets.Fragment);
                this.registerOutput("clearcoatInd", NodeMaterialBlockConnectionPointTypes.Color3, NodeMaterialBlockTargets.Fragment);
                this.registerOutput("sheenInd", NodeMaterialBlockConnectionPointTypes.Color3, NodeMaterialBlockTargets.Fragment);
                this.registerOutput("refraction", NodeMaterialBlockConnectionPointTypes.Color3, NodeMaterialBlockTargets.Fragment);
                this.registerOutput("lighting", NodeMaterialBlockConnectionPointTypes.Color3, NodeMaterialBlockTargets.Fragment);
                this.registerOutput("shadow", NodeMaterialBlockConnectionPointTypes.Float, NodeMaterialBlockTargets.Fragment);
                this.registerOutput("alpha", NodeMaterialBlockConnectionPointTypes.Float, NodeMaterialBlockTargets.Fragment);
            }
            /**
             * Initialize the block and prepare the context for build
             * @param state defines the state that will be used for the build
             */
            initialize(state) {
                state._excludeVariableName("vLightingIntensity");
                state._excludeVariableName("geometricNormalW");
                state._excludeVariableName("normalW");
                state._excludeVariableName("faceNormal");
                state._excludeVariableName("albedoOpacityOut");
                state._excludeVariableName("surfaceAlbedo");
                state._excludeVariableName("alpha");
                state._excludeVariableName("aoOut");
                state._excludeVariableName("baseColor");
                state._excludeVariableName("reflectivityOut");
                state._excludeVariableName("microSurface");
                state._excludeVariableName("roughness");
                state._excludeVariableName("vReflectivityColor");
                state._excludeVariableName("NdotVUnclamped");
                state._excludeVariableName("NdotV");
                state._excludeVariableName("alphaG");
                state._excludeVariableName("AARoughnessFactors");
                state._excludeVariableName("environmentBrdf");
                state._excludeVariableName("ambientMonochrome");
                state._excludeVariableName("seo");
                state._excludeVariableName("eho");
                state._excludeVariableName("environmentRadiance");
                state._excludeVariableName("irradianceVector");
                state._excludeVariableName("environmentIrradiance");
                state._excludeVariableName("diffuseBase");
                state._excludeVariableName("specularBase");
                state._excludeVariableName("preInfo");
                state._excludeVariableName("info");
                state._excludeVariableName("shadow");
                state._excludeVariableName("finalDiffuse");
                state._excludeVariableName("finalAmbient");
                state._excludeVariableName("ambientOcclusionForDirectDiffuse");
                state._excludeVariableName("finalColor");
                state._excludeVariableName("vClipSpacePosition");
                state._excludeVariableName("vDebugMode");
                state._excludeVariableName("vViewDepth");
                // eslint-disable-next-line @typescript-eslint/no-floating-promises
                this._initShaderSourceAsync(state.shaderLanguage);
            }
            async _initShaderSourceAsync(shaderLanguage) {
                this._codeIsReady = false;
                if (shaderLanguage === 1 /* ShaderLanguage.WGSL */) {
                    await Promise.all([import("../../../../ShadersWGSL/pbr.vertex.js"), import("../../../../ShadersWGSL/pbr.fragment.js")]);
                }
                else {
                    await Promise.all([import("../../../../Shaders/pbr.vertex.js"), import("../../../../Shaders/pbr.fragment.js")]);
                }
                this._codeIsReady = true;
                this.onCodeIsReadyObservable.notifyObservers(this);
            }
            /**
             * Gets the current class name
             * @returns the class name
             */
            getClassName() {
                return "PBRMetallicRoughnessBlock";
            }
            /**
             * Gets the world position input component
             */
            get worldPosition() {
                return this._inputs[0];
            }
            /**
             * Gets the world normal input component
             */
            get worldNormal() {
                return this._inputs[1];
            }
            /**
             * Gets the view matrix parameter
             */
            get view() {
                return this._inputs[2];
            }
            /**
             * Gets the camera position input component
             */
            get cameraPosition() {
                return this._inputs[3];
            }
            /**
             * Gets the perturbed normal input component
             */
            get perturbedNormal() {
                return this._inputs[4];
            }
            /**
             * Gets the base color input component
             */
            get baseColor() {
                return this._inputs[5];
            }
            /**
             * Gets the metallic input component
             */
            get metallic() {
                return this._inputs[6];
            }
            /**
             * Gets the roughness input component
             */
            get roughness() {
                return this._inputs[7];
            }
            /**
             * Gets the ambient occlusion input component
             */
            get ambientOcc() {
                return this._inputs[8];
            }
            /**
             * Gets the opacity input component
             */
            get opacity() {
                return this._inputs[9];
            }
            /**
             * Gets the index of refraction input component
             */
            get indexOfRefraction() {
                return this._inputs[10];
            }
            /**
             * Gets the ambient color input component
             */
            get ambientColor() {
                return this._inputs[11];
            }
            /**
             * Gets the reflection object parameters
             */
            get reflection() {
                return this._inputs[12];
            }
            /**
             * Gets the clear coat object parameters
             */
            get clearcoat() {
                return this._inputs[13];
            }
            /**
             * Gets the sheen object parameters
             */
            get sheen() {
                return this._inputs[14];
            }
            /**
             * Gets the sub surface object parameters
             */
            get subsurface() {
                return this._inputs[15];
            }
            /**
             * Gets the anisotropy object parameters
             */
            get anisotropy() {
                return this._inputs[16];
            }
            /**
             * Gets the iridescence object parameters
             */
            get iridescence() {
                return this._inputs[17];
            }
            /**
             * Gets the ambient output component
             */
            get ambientClr() {
                return this._outputs[0];
            }
            /**
             * Gets the diffuse output component
             */
            get diffuseDir() {
                return this._outputs[1];
            }
            /**
             * Gets the specular output component
             */
            get specularDir() {
                return this._outputs[2];
            }
            /**
             * Gets the clear coat output component
             */
            get clearcoatDir() {
                return this._outputs[3];
            }
            /**
             * Gets the sheen output component
             */
            get sheenDir() {
                return this._outputs[4];
            }
            /**
             * Gets the indirect diffuse output component
             */
            get diffuseInd() {
                return this._outputs[5];
            }
            /**
             * Gets the indirect specular output component
             */
            get specularInd() {
                return this._outputs[6];
            }
            /**
             * Gets the indirect clear coat output component
             */
            get clearcoatInd() {
                return this._outputs[7];
            }
            /**
             * Gets the indirect sheen output component
             */
            get sheenInd() {
                return this._outputs[8];
            }
            /**
             * Gets the refraction output component
             */
            get refraction() {
                return this._outputs[9];
            }
            /**
             * Gets the global lighting output component
             */
            get lighting() {
                return this._outputs[10];
            }
            /**
             * Gets the shadow output component
             */
            get shadow() {
                return this._outputs[11];
            }
            /**
             * Gets the alpha output component
             */
            get alpha() {
                return this._outputs[12];
            }
            /**
             * Auto configure the block based on the material
             * @param material - the node material
             * @param additionalFilteringInfo - additional filtering info
             */
            autoConfigure(material, additionalFilteringInfo = () => true) {
                if (!this.cameraPosition.isConnected) {
                    let cameraPositionInput = material.getInputBlockByPredicate((b) => b.systemValue === NodeMaterialSystemValues.CameraPosition && additionalFilteringInfo(b));
                    if (!cameraPositionInput) {
                        cameraPositionInput = new InputBlock("cameraPosition");
                        cameraPositionInput.setAsSystemValue(NodeMaterialSystemValues.CameraPosition);
                    }
                    cameraPositionInput.output.connectTo(this.cameraPosition);
                }
                if (!this.view.isConnected) {
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
             * @param defines - the list of defines to update
             * @param nodeMaterial - the node material
             * @param mesh - the mesh to prepare defines for
             */
            prepareDefines(defines, nodeMaterial, mesh) {
                if (!mesh) {
                    return;
                }
                // General
                defines.setValue("PBR", true);
                defines.setValue("METALLICWORKFLOW", true);
                defines.setValue("DEBUGMODE", this.debugMode, true);
                defines.setValue("DEBUGMODE_FORCERETURN", true);
                defines.setValue("NORMALXYSCALE", true);
                defines.setValue("BUMP", this.perturbedNormal.isConnected, true);
                defines.setValue("LODBASEDMICROSFURACE", this._scene.getEngine().getCaps().textureLOD);
                // Albedo & Opacity
                defines.setValue("ALBEDO", false, true);
                defines.setValue("OPACITY", this.opacity.isConnected, true);
                // Ambient occlusion
                defines.setValue("AMBIENT", true, true);
                defines.setValue("AMBIENTINGRAYSCALE", false, true);
                // Reflectivity
                defines.setValue("REFLECTIVITY", false, true);
                defines.setValue("AOSTOREINMETALMAPRED", false, true);
                defines.setValue("METALLNESSSTOREINMETALMAPBLUE", false, true);
                defines.setValue("ROUGHNESSSTOREINMETALMAPALPHA", false, true);
                defines.setValue("ROUGHNESSSTOREINMETALMAPGREEN", false, true);
                // Lighting & colors
                if (this.lightFalloff === PBRBaseMaterial.LIGHTFALLOFF_STANDARD) {
                    defines.setValue("USEPHYSICALLIGHTFALLOFF", false);
                    defines.setValue("USEGLTFLIGHTFALLOFF", false);
                }
                else if (this.lightFalloff === PBRBaseMaterial.LIGHTFALLOFF_GLTF) {
                    defines.setValue("USEPHYSICALLIGHTFALLOFF", false);
                    defines.setValue("USEGLTFLIGHTFALLOFF", true);
                }
                else {
                    defines.setValue("USEPHYSICALLIGHTFALLOFF", true);
                    defines.setValue("USEGLTFLIGHTFALLOFF", false);
                }
                // Transparency
                const alphaTestCutOffString = this.alphaTestCutoff.toString();
                defines.setValue("ALPHABLEND", this.useAlphaBlending, true);
                defines.setValue("ALPHAFROMALBEDO", false, true);
                defines.setValue("ALPHATEST", this.useAlphaTest, true);
                defines.setValue("ALPHATESTVALUE", alphaTestCutOffString.indexOf(".") < 0 ? alphaTestCutOffString + "." : alphaTestCutOffString, true);
                defines.setValue("OPACITYRGB", false, true);
                // Rendering
                defines.setValue("RADIANCEOVERALPHA", this.useRadianceOverAlpha, true);
                defines.setValue("SPECULAROVERALPHA", this.useSpecularOverAlpha, true);
                defines.setValue("SPECULARAA", this._scene.getEngine().getCaps().standardDerivatives && this.enableSpecularAntiAliasing, true);
                defines.setValue("REALTIME_FILTERING", this.realTimeFiltering, true);
                const scene = mesh.getScene();
                const engine = scene.getEngine();
                if (engine._features.needTypeSuffixInShaderConstants) {
                    defines.setValue("NUM_SAMPLES", this.realTimeFilteringQuality + "u", true);
                }
                else {
                    defines.setValue("NUM_SAMPLES", "" + this.realTimeFilteringQuality, true);
                }
                defines.setValue("BASE_DIFFUSE_MODEL", this.baseDiffuseModel, true);
                // Advanced
                defines.setValue("BRDF_V_HEIGHT_CORRELATED", true);
                defines.setValue("LEGACY_SPECULAR_ENERGY_CONSERVATION", true);
                defines.setValue("MS_BRDF_ENERGY_CONSERVATION", this.useEnergyConservation, true);
                defines.setValue("RADIANCEOCCLUSION", this.useRadianceOcclusion, true);
                defines.setValue("HORIZONOCCLUSION", this.useHorizonOcclusion, true);
                defines.setValue("UNLIT", this.unlit, true);
                defines.setValue("FORCENORMALFORWARD", this.forceNormalForward, true);
                if (this._environmentBRDFTexture && MaterialFlags.ReflectionTextureEnabled) {
                    defines.setValue("ENVIRONMENTBRDF", true);
                    defines.setValue("ENVIRONMENTBRDF_RGBD", this._environmentBRDFTexture.isRGBD, true);
                }
                else {
                    defines.setValue("ENVIRONMENTBRDF", false);
                    defines.setValue("ENVIRONMENTBRDF_RGBD", false);
                }
                if (defines._areImageProcessingDirty && nodeMaterial.imageProcessingConfiguration) {
                    nodeMaterial.imageProcessingConfiguration.prepareDefines(defines);
                }
                if (!defines._areLightsDirty) {
                    return;
                }
                if (!this.light) {
                    // Lights
                    PrepareDefinesForLights(scene, mesh, defines, true, nodeMaterial.maxSimultaneousLights);
                    defines._needNormals = true;
                    // Multiview
                    PrepareDefinesForMultiview(scene, defines);
                }
                else {
                    const state = {
                        needNormals: false,
                        needRebuild: false,
                        lightmapMode: false,
                        shadowEnabled: false,
                        specularEnabled: false,
                    };
                    PrepareDefinesForLight(scene, mesh, this.light, this._lightId, defines, true, state);
                    if (state.needRebuild) {
                        defines.rebuild();
                    }
                }
            }
            /**
             * Update the uniforms and samples
             * @param state - the build state
             * @param nodeMaterial - the node material
             * @param defines - the list of defines
             * @param uniformBuffers - the uniform buffers
             */
            updateUniformsAndSamples(state, nodeMaterial, defines, uniformBuffers) {
                for (let lightIndex = 0; lightIndex < nodeMaterial.maxSimultaneousLights; lightIndex++) {
                    if (!defines["LIGHT" + lightIndex]) {
                        break;
                    }
                    const onlyUpdateBuffersList = state.uniforms.indexOf("vLightData" + lightIndex) >= 0;
                    PrepareUniformsAndSamplersForLight(lightIndex, state.uniforms, state.samplers, defines["PROJECTEDLIGHTTEXTURE" + lightIndex], uniformBuffers, onlyUpdateBuffersList, defines["IESLIGHTTEXTURE" + lightIndex], defines["CLUSTLIGHT" + lightIndex], defines["RECTAREALIGHTEMISSIONTEXTURE" + lightIndex], state.shaderLanguage === 1 /* ShaderLanguage.WGSL */);
                }
            }
            /**
             * Checks if the block is ready
             * @param mesh - the mesh to check
             * @param nodeMaterial - the node material
             * @param defines - the list of defines
             * @returns true if ready
             */
            isReady(mesh, nodeMaterial, defines) {
                if (this._environmentBRDFTexture && !this._environmentBRDFTexture.isReady()) {
                    return false;
                }
                if (defines._areImageProcessingDirty && nodeMaterial.imageProcessingConfiguration) {
                    if (!nodeMaterial.imageProcessingConfiguration.isReady()) {
                        return false;
                    }
                }
                if (this.light && !this.light.areLightTexturesReady()) {
                    return false;
                }
                return true;
            }
            /**
             * Bind data to effect
             * @param effect - the effect to bind data to
             * @param nodeMaterial - the node material
             * @param mesh - the mesh to bind data for
             */
            bind(effect, nodeMaterial, mesh) {
                if (!mesh) {
                    return;
                }
                const scene = mesh.getScene();
                if (!this.light) {
                    BindLights(scene, mesh, effect, true, nodeMaterial.maxSimultaneousLights);
                }
                else {
                    BindLight(this.light, this._lightId, scene, effect, true);
                }
                effect.setTexture(this._environmentBrdfSamplerName, this._environmentBRDFTexture);
                effect.setFloat2("vDebugMode", this.debugLimit, this.debugFactor);
                const ambientScene = this._scene.ambientColor;
                if (ambientScene) {
                    effect.setColor3("ambientFromScene", ambientScene);
                }
                const invertNormal = scene.useRightHandedSystem === (scene._mirroredCameraPosition != null);
                effect.setFloat(this._invertNormalName, invertNormal ? -1 : 1);
                effect.setFloat4("vLightingIntensity", this.directIntensity, 1, this.environmentIntensity * this._scene.environmentIntensity, this.specularIntensity);
                // reflectivity bindings
                const metallicF90 = this._metallicF0Factor;
                effect.setColor4(this._vMetallicReflectanceFactorsName, this._metallicReflectanceColor, metallicF90);
                if (nodeMaterial.imageProcessingConfiguration) {
                    nodeMaterial.imageProcessingConfiguration.bind(effect);
                }
            }
            _injectVertexCode(state) {
                const worldPos = this.worldPosition;
                const worldNormal = this.worldNormal;
                const comments = `//${this.name}`;
                const isWebGPU = state.shaderLanguage === 1 /* ShaderLanguage.WGSL */;
                const scene = state.sharedData.nodeMaterial.getScene();
                // Declaration
                if (!this.light) {
                    // Emit for all lights
                    state._emitFunctionFromInclude(state.supportUniformBuffers ? "lightVxUboDeclaration" : "lightVxFragmentDeclaration", comments, {
                        repeatKey: "maxSimultaneousLights",
                    });
                    this._lightId = 0;
                    state.sharedData.dynamicUniformBlocks.push(this);
                }
                else {
                    this._lightId = (state.counters["lightCounter"] !== undefined ? state.counters["lightCounter"] : -1) + 1;
                    state.counters["lightCounter"] = this._lightId;
                    state._emitFunctionFromInclude(state.supportUniformBuffers ? "lightVxUboDeclaration" : "lightVxFragmentDeclaration", comments, {
                        replaceStrings: [{ search: /{X}/g, replace: this._lightId.toString() }],
                    }, this._lightId.toString());
                }
                // Inject code in vertex
                const worldPosVaryingName = "v_" + worldPos.associatedVariableName;
                if (state._emitVaryingFromString(worldPosVaryingName, NodeMaterialBlockConnectionPointTypes.Vector4)) {
                    state.compilationString += (isWebGPU ? "vertexOutputs." : "") + `${worldPosVaryingName} = ${worldPos.associatedVariableName};\n`;
                }
                const worldNormalVaryingName = "v_" + worldNormal.associatedVariableName;
                if (state._emitVaryingFromString(worldNormalVaryingName, NodeMaterialBlockConnectionPointTypes.Vector4)) {
                    state.compilationString += (isWebGPU ? "vertexOutputs." : "") + `${worldNormalVaryingName} = ${worldNormal.associatedVariableName};\n`;
                }
                const reflectionBlock = this.reflection.isConnected ? this.reflection.connectedPoint?.ownerBlock : null;
                if (reflectionBlock) {
                    reflectionBlock.viewConnectionPoint = this.view;
                }
                state.compilationString += reflectionBlock?.handleVertexSide(state) ?? "";
                if (state._emitVaryingFromString("vClipSpacePosition", NodeMaterialBlockConnectionPointTypes.Vector4, "defined(IGNORE) || DEBUGMODE > 0")) {
                    state._injectAtEnd += `#if DEBUGMODE > 0\n`;
                    state._injectAtEnd += (isWebGPU ? "vertexOutputs." : "") + `vClipSpacePosition = ${isWebGPU ? "vertexOutputs.position" : "gl_Position"};\n`;
                    state._injectAtEnd += `#endif\n`;
                }
                if (this.light) {
                    state.compilationString += state._emitCodeFromInclude("shadowsVertex", comments, {
                        replaceStrings: [
                            { search: /{X}/g, replace: this._lightId.toString() },
                            { search: /worldPos/g, replace: worldPos.associatedVariableName },
                        ],
                    });
                }
                else {
                    state.compilationString += `${state._declareLocalVar("worldPos", NodeMaterialBlockConnectionPointTypes.Vector4)} = ${worldPos.associatedVariableName};\n`;
                    if (this.view.isConnected) {
                        state.compilationString += `${state._declareLocalVar("view", NodeMaterialBlockConnectionPointTypes.Matrix)} = ${this.view.associatedVariableName};\n`;
                        state._emitVaryingFromString("vViewDepth", NodeMaterialBlockConnectionPointTypes.Float);
                        state.compilationString +=
                            (state.shaderLanguage === 1 /* ShaderLanguage.WGSL */ ? "vertexOutputs." : "") +
                                `vViewDepth = ${scene.useRightHandedSystem ? "-" : ""}(${this.view.associatedVariableName} * ${worldPos.associatedVariableName}).z;\n`;
                    }
                    state.compilationString += state._emitCodeFromInclude("shadowsVertex", comments, {
                        repeatKey: "maxSimultaneousLights",
                    });
                }
            }
            _getAlbedoOpacityCode(state) {
                const isWebGPU = state.shaderLanguage === 1 /* ShaderLanguage.WGSL */;
                let code = isWebGPU ? "var albedoOpacityOut: albedoOpacityOutParams;\n" : `albedoOpacityOutParams albedoOpacityOut;\n`;
                const albedoColor = this.baseColor.isConnected ? this.baseColor.associatedVariableName : "vec3(1.)";
                const opacity = this.opacity.isConnected ? this.opacity.associatedVariableName : "1.";
                code += `albedoOpacityOut = albedoOpacityBlock(
                vec4${state.fSuffix}(${albedoColor}, 1.)
            #ifdef ALBEDO
                ,vec4${state.fSuffix}(1.)
                ,vec2${state.fSuffix}(1., 1.)
            #endif
                ,1. /* Base Weight */
            #ifdef OPACITY
                ,vec4${state.fSuffix}(${opacity})
                ,vec2${state.fSuffix}(1., 1.)
            #endif
            );

            ${state._declareLocalVar("surfaceAlbedo", NodeMaterialBlockConnectionPointTypes.Vector3)} = albedoOpacityOut.surfaceAlbedo;
            ${state._declareLocalVar("alpha", NodeMaterialBlockConnectionPointTypes.Float)} = albedoOpacityOut.alpha;\n`;
                return code;
            }
            _getAmbientOcclusionCode(state) {
                const isWebGPU = state.shaderLanguage === 1 /* ShaderLanguage.WGSL */;
                let code = isWebGPU ? "var aoOut: ambientOcclusionOutParams;\n" : `ambientOcclusionOutParams aoOut;\n`;
                const ao = this.ambientOcc.isConnected ? this.ambientOcc.associatedVariableName : "1.";
                code += `aoOut = ambientOcclusionBlock(
            #ifdef AMBIENT
                vec3${state.fSuffix}(${ao}),
                vec4${state.fSuffix}(0., 1.0, 1.0, 0.)
            #endif
            );\n`;
                return code;
            }
            _getReflectivityCode(state) {
                const isWebGPU = state.shaderLanguage === 1 /* ShaderLanguage.WGSL */;
                let code = isWebGPU ? "var reflectivityOut: reflectivityOutParams;\n" : `reflectivityOutParams reflectivityOut;\n`;
                const aoIntensity = "1.";
                this._vMetallicReflectanceFactorsName = state._getFreeVariableName("vMetallicReflectanceFactors");
                state._emitUniformFromString(this._vMetallicReflectanceFactorsName, NodeMaterialBlockConnectionPointTypes.Vector4);
                this._baseDiffuseRoughnessName = state._getFreeVariableName("baseDiffuseRoughness");
                state._emitUniformFromString(this._baseDiffuseRoughnessName, NodeMaterialBlockConnectionPointTypes.Float);
                const outsideIOR = 1; // consider air as clear coat and other layers would remap in the shader.
                const ior = this.indexOfRefraction.connectInputBlock?.value ?? 1.5;
                // Based of the schlick fresnel approximation model
                // for dielectrics.
                const f0 = Math.pow((ior - outsideIOR) / (ior + outsideIOR), 2);
                code += `${state._declareLocalVar("baseColor", NodeMaterialBlockConnectionPointTypes.Vector3)} = surfaceAlbedo;
            ${isWebGPU ? "let" : `vec4${state.fSuffix}`} vReflectivityColor = vec4${state.fSuffix}(${this.metallic.associatedVariableName}, ${this.roughness.associatedVariableName}, ${this.indexOfRefraction.associatedVariableName || "1.5"}, ${f0});
            reflectivityOut = reflectivityBlock(
                vReflectivityColor
            #ifdef METALLICWORKFLOW
                , surfaceAlbedo
                , ${(isWebGPU ? "uniforms." : "") + this._vMetallicReflectanceFactorsName}
            #endif
                , ${(isWebGPU ? "uniforms." : "") + this._baseDiffuseRoughnessName}
            #ifdef BASE_DIFFUSE_ROUGHNESS
                , 0.
                , vec2${state.fSuffix}(0., 0.)
            #endif
            #ifdef REFLECTIVITY
                , vec3${state.fSuffix}(0., 0., ${aoIntensity})
                , vec4${state.fSuffix}(1.)
            #endif
            #if defined(METALLICWORKFLOW) && defined(REFLECTIVITY)  && defined(AOSTOREINMETALMAPRED)
                , aoOut.ambientOcclusionColor
            #endif
            #ifdef MICROSURFACEMAP
                , microSurfaceTexel <== not handled!
            #endif
            );

            ${state._declareLocalVar("microSurface", NodeMaterialBlockConnectionPointTypes.Float)} = reflectivityOut.microSurface;
            ${state._declareLocalVar("roughness", NodeMaterialBlockConnectionPointTypes.Float)} = reflectivityOut.roughness;
            ${state._declareLocalVar("diffuseRoughness", NodeMaterialBlockConnectionPointTypes.Float)} = reflectivityOut.diffuseRoughness;

            #ifdef METALLICWORKFLOW
                surfaceAlbedo = reflectivityOut.surfaceAlbedo;
            #endif
            #if defined(METALLICWORKFLOW) && defined(REFLECTIVITY) && defined(AOSTOREINMETALMAPRED)
                aoOut.ambientOcclusionColor = reflectivityOut.ambientOcclusionColor;
            #endif\n`;
                return code;
            }
            _buildBlock(state) {
                super._buildBlock(state);
                this._scene = state.sharedData.scene;
                const isWebGPU = state.shaderLanguage === 1 /* ShaderLanguage.WGSL */;
                if (!this._environmentBRDFTexture) {
                    this._environmentBRDFTexture = GetEnvironmentBRDFTexture(this._scene);
                }
                const reflectionBlock = this.reflection.isConnected ? this.reflection.connectedPoint?.ownerBlock : null;
                if (reflectionBlock) {
                    // Need those variables to be setup when calling _injectVertexCode
                    reflectionBlock.worldPositionConnectionPoint = this.worldPosition;
                    reflectionBlock.cameraPositionConnectionPoint = this.cameraPosition;
                    reflectionBlock.worldNormalConnectionPoint = this.worldNormal;
                    reflectionBlock.viewConnectionPoint = this.view;
                }
                if (state.target !== NodeMaterialBlockTargets.Fragment) {
                    // Vertex
                    this._injectVertexCode(state);
                    return this;
                }
                // Fragment
                state.sharedData.forcedBindableBlocks.push(this);
                state.sharedData.blocksWithDefines.push(this);
                state.sharedData.blockingBlocks.push(this);
                if (this.generateOnlyFragmentCode) {
                    state.sharedData.dynamicUniformBlocks.push(this);
                }
                const comments = `//${this.name}`;
                const normalShading = this.perturbedNormal;
                let worldPosVarName = this.worldPosition.associatedVariableName;
                let worldPosVarName4 = this.worldPosition.associatedVariableName;
                let worldNormalVarName = this.worldNormal.associatedVariableName;
                if (this.generateOnlyFragmentCode) {
                    worldPosVarName = state._getFreeVariableName("globalWorldPos");
                    state._emitFunction("pbr_globalworldpos", `${state._declareLocalVar(worldPosVarName, NodeMaterialBlockConnectionPointTypes.Vector3, false, true)};\n`, comments);
                    state.compilationString += `${worldPosVarName} = ${this.worldPosition.associatedVariableName}.xyz;\n`;
                    worldPosVarName4 = state._getFreeVariableName("globalWorldPos4");
                    state._emitFunction("pbr_globalworldpos4", `${state._declareLocalVar(worldPosVarName4, NodeMaterialBlockConnectionPointTypes.Vector4, false, true)};\n`, comments);
                    state.compilationString += `${worldPosVarName4} = ${this.worldPosition.associatedVariableName};\n`;
                    worldNormalVarName = state._getFreeVariableName("globalWorldNormal");
                    state._emitFunction("pbr_globalworldnorm", `${state._declareLocalVar(worldNormalVarName, NodeMaterialBlockConnectionPointTypes.Vector4, false, true)};\n`, comments);
                    state.compilationString += `${worldNormalVarName} = ${this.worldNormal.associatedVariableName};\n`;
                    state.compilationString += state._emitCodeFromInclude("shadowsVertex", comments, {
                        repeatKey: "maxSimultaneousLights",
                        substitutionVars: `worldPos,${this.worldPosition.associatedVariableName}`,
                    });
                    state.compilationString += `#if DEBUGMODE > 0\n`;
                    state.compilationString += `${state._declareLocalVar("vClipSpacePosition", NodeMaterialBlockConnectionPointTypes.Vector4)} = vec4${state.fSuffix}((vec2${state.fSuffix}(${isWebGPU ? "fragmentInputs.position" : "gl_FragCoord.xy"}) / vec2${state.fSuffix}(1.0)) * 2.0 - 1.0, 0.0, 1.0);\n`;
                    state.compilationString += `#endif\n`;
                }
                else {
                    worldPosVarName = (isWebGPU ? "input." : "") + "v_" + worldPosVarName;
                    worldNormalVarName = (isWebGPU ? "input." : "") + "v_" + worldNormalVarName;
                }
                this._environmentBrdfSamplerName = state._getFreeVariableName("environmentBrdfSampler");
                state._emit2DSampler(this._environmentBrdfSamplerName);
                state.sharedData.hints.needAlphaBlending = state.sharedData.hints.needAlphaBlending || this.useAlphaBlending;
                state.sharedData.hints.needAlphaTesting = state.sharedData.hints.needAlphaTesting || this.useAlphaTest;
                state._emitExtension("lod", "#extension GL_EXT_shader_texture_lod : enable", "defined(LODBASEDMICROSFURACE)");
                state._emitExtension("derivatives", "#extension GL_OES_standard_derivatives : enable");
                state._emitUniformFromString("vDebugMode", NodeMaterialBlockConnectionPointTypes.Vector2, "defined(IGNORE) || DEBUGMODE > 0");
                state._emitUniformFromString("ambientFromScene", NodeMaterialBlockConnectionPointTypes.Vector3);
                // Image processing uniforms
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
                //
                // Includes
                //
                if (!this.light) {
                    if (this.generateOnlyFragmentCode && this.view.isConnected) {
                        state.compilationString += `${state._declareLocalVar("vViewDepth", NodeMaterialBlockConnectionPointTypes.Float)} = (${this.view.associatedVariableName} * ${worldPosVarName4}).z;\n`;
                    }
                    // Emit for all lights
                    state._emitFunctionFromInclude(state.supportUniformBuffers ? "lightUboDeclaration" : "lightFragmentDeclaration", comments, {
                        repeatKey: "maxSimultaneousLights",
                        substitutionVars: this.generateOnlyFragmentCode ? "varying," : undefined,
                    });
                }
                else {
                    state._emitFunctionFromInclude(state.supportUniformBuffers ? "lightUboDeclaration" : "lightFragmentDeclaration", comments, {
                        replaceStrings: [{ search: /{X}/g, replace: this._lightId.toString() }],
                    }, this._lightId.toString());
                }
                state._emitFunctionFromInclude("helperFunctions", comments);
                state._emitFunctionFromInclude("importanceSampling", comments);
                state._emitFunctionFromInclude("pbrHelperFunctions", comments);
                state._emitFunctionFromInclude("imageProcessingDeclaration", comments);
                state._emitFunctionFromInclude("imageProcessingFunctions", comments);
                state._emitFunctionFromInclude("shadowsFragmentFunctions", comments);
                state._emitFunctionFromInclude("pbrDirectLightingSetupFunctions", comments);
                state._emitFunctionFromInclude("pbrDirectLightingFalloffFunctions", comments);
                state._emitFunctionFromInclude("pbrBRDFFunctions", comments, {
                    replaceStrings: [{ search: /REFLECTIONMAP_SKYBOX/g, replace: reflectionBlock?._defineSkyboxName ?? "REFLECTIONMAP_SKYBOX" }],
                });
                state._emitFunctionFromInclude("hdrFilteringFunctions", comments);
                if (!isWebGPU) {
                    state._emitFunctionFromInclude("pbrDirectLightingFunctions", comments);
                }
                state._emitFunctionFromInclude("pbrIBLFunctions", comments);
                state._emitFunctionFromInclude("pbrBlockAlbedoOpacity", comments);
                state._emitFunctionFromInclude("pbrBlockReflectivity", comments);
                state._emitFunctionFromInclude("pbrBlockAmbientOcclusion", comments);
                state._emitFunctionFromInclude("pbrBlockAlphaFresnel", comments);
                state._emitFunctionFromInclude("pbrBlockAnisotropic", comments);
                //
                // code
                //
                state._emitUniformFromString("vLightingIntensity", NodeMaterialBlockConnectionPointTypes.Vector4);
                if (reflectionBlock?.generateOnlyFragmentCode) {
                    state.compilationString += reflectionBlock.handleVertexSide(state);
                }
                // _____________________________ Geometry Information ____________________________
                this._vNormalWName = state._getFreeVariableName("vNormalW");
                state.compilationString += `${state._declareLocalVar(this._vNormalWName, NodeMaterialBlockConnectionPointTypes.Vector4)} = normalize(${worldNormalVarName});\n`;
                if (state._registerTempVariable("viewDirectionW")) {
                    state.compilationString += `${state._declareLocalVar("viewDirectionW", NodeMaterialBlockConnectionPointTypes.Vector3)} = normalize(${this.cameraPosition.associatedVariableName} - ${worldPosVarName}.xyz);\n`;
                }
                state.compilationString += `${state._declareLocalVar("geometricNormalW", NodeMaterialBlockConnectionPointTypes.Vector3)} = ${this._vNormalWName}.xyz;\n`;
                state.compilationString += `${state._declareLocalVar("normalW", NodeMaterialBlockConnectionPointTypes.Vector3)} = ${normalShading.isConnected ? "normalize(" + normalShading.associatedVariableName + ".xyz)" : "geometricNormalW"};\n`;
                this._invertNormalName = state._getFreeVariableName("invertNormal");
                state._emitUniformFromString(this._invertNormalName, NodeMaterialBlockConnectionPointTypes.Float);
                state.compilationString += state._emitCodeFromInclude("pbrBlockNormalFinal", comments, {
                    replaceStrings: [
                        { search: /vPositionW/g, replace: worldPosVarName + ".xyz" },
                        { search: /vEyePosition.w/g, replace: this._invertNormalName },
                    ],
                });
                // _____________________________ Albedo & Opacity ______________________________
                state.compilationString += this._getAlbedoOpacityCode(state);
                state.compilationString += state._emitCodeFromInclude("depthPrePass", comments);
                // _____________________________ AO  _______________________________
                state.compilationString += this._getAmbientOcclusionCode(state);
                state.compilationString += state._emitCodeFromInclude("pbrBlockLightmapInit", comments);
                // _____________________________ UNLIT  _______________________________
                state.compilationString += `#ifdef UNLIT
                ${state._declareLocalVar("diffuseBase", NodeMaterialBlockConnectionPointTypes.Vector3)} = vec3${state.fSuffix}(1., 1., 1.);
            #else\n`;
                // _____________________________ Reflectivity _______________________________
                state.compilationString += this._getReflectivityCode(state);
                // _____________________________ Geometry info _________________________________
                state.compilationString += state._emitCodeFromInclude("pbrBlockGeometryInfo", comments, {
                    replaceStrings: [
                        { search: /REFLECTIONMAP_SKYBOX/g, replace: reflectionBlock?._defineSkyboxName ?? "REFLECTIONMAP_SKYBOX" },
                        { search: /REFLECTIONMAP_3D/g, replace: reflectionBlock?._define3DName ?? "REFLECTIONMAP_3D" },
                    ],
                });
                // _____________________________ Anisotropy _______________________________________
                const anisotropyBlock = this.anisotropy.isConnected ? this.anisotropy.connectedPoint?.ownerBlock : null;
                if (anisotropyBlock) {
                    anisotropyBlock.worldPositionConnectionPoint = this.worldPosition;
                    anisotropyBlock.worldNormalConnectionPoint = this.worldNormal;
                    state.compilationString += anisotropyBlock.getCode(state, !this.perturbedNormal.isConnected);
                }
                // _____________________________ Reflection _______________________________________
                if (reflectionBlock && reflectionBlock.hasTexture) {
                    state.compilationString += reflectionBlock.getCode(state, anisotropyBlock ? "anisotropicOut.anisotropicNormal" : "normalW");
                }
                state._emitFunctionFromInclude("pbrBlockReflection", comments, {
                    replaceStrings: [
                        { search: /computeReflectionCoords/g, replace: "computeReflectionCoordsPBR" },
                        { search: /REFLECTIONMAP_3D/g, replace: reflectionBlock?._define3DName ?? "REFLECTIONMAP_3D" },
                        { search: /REFLECTIONMAP_OPPOSITEZ/g, replace: reflectionBlock?._defineOppositeZ ?? "REFLECTIONMAP_OPPOSITEZ" },
                        { search: /REFLECTIONMAP_PROJECTION/g, replace: reflectionBlock?._defineProjectionName ?? "REFLECTIONMAP_PROJECTION" },
                        { search: /REFLECTIONMAP_SKYBOX/g, replace: reflectionBlock?._defineSkyboxName ?? "REFLECTIONMAP_SKYBOX" },
                        { search: /LODINREFLECTIONALPHA/g, replace: reflectionBlock?._defineLODReflectionAlpha ?? "LODINREFLECTIONALPHA" },
                        { search: /LINEARSPECULARREFLECTION/g, replace: reflectionBlock?._defineLinearSpecularReflection ?? "LINEARSPECULARREFLECTION" },
                        { search: /vReflectionFilteringInfo/g, replace: reflectionBlock?._vReflectionFilteringInfoName ?? "vReflectionFilteringInfo" },
                    ],
                });
                // ___________________ Compute Reflectance aka R0 F0 info _________________________
                state.compilationString += state._emitCodeFromInclude("pbrBlockReflectance0", comments, {
                    replaceStrings: [{ search: /metallicReflectanceFactors/g, replace: (isWebGPU ? "uniforms." : "") + this._vMetallicReflectanceFactorsName }],
                });
                // ________________________________ Sheen ______________________________
                const sheenBlock = this.sheen.isConnected ? this.sheen.connectedPoint?.ownerBlock : null;
                if (sheenBlock) {
                    state.compilationString += sheenBlock.getCode(reflectionBlock, state);
                }
                state._emitFunctionFromInclude("pbrBlockSheen", comments, {
                    replaceStrings: [
                        { search: /REFLECTIONMAP_3D/g, replace: reflectionBlock?._define3DName ?? "REFLECTIONMAP_3D" },
                        { search: /REFLECTIONMAP_SKYBOX/g, replace: reflectionBlock?._defineSkyboxName ?? "REFLECTIONMAP_SKYBOX" },
                        { search: /LODINREFLECTIONALPHA/g, replace: reflectionBlock?._defineLODReflectionAlpha ?? "LODINREFLECTIONALPHA" },
                        { search: /LINEARSPECULARREFLECTION/g, replace: reflectionBlock?._defineLinearSpecularReflection ?? "LINEARSPECULARREFLECTION" },
                    ],
                });
                // ____________________ Clear Coat Initialization Code _____________________
                const clearcoatBlock = this.clearcoat.isConnected ? this.clearcoat.connectedPoint?.ownerBlock : null;
                state.compilationString += ClearCoatBlock._GetInitializationCode(state, clearcoatBlock);
                // _____________________________ Iridescence _______________________________
                const iridescenceBlock = this.iridescence.isConnected ? this.iridescence.connectedPoint?.ownerBlock : null;
                state.compilationString += IridescenceBlock.GetCode(iridescenceBlock, state);
                state._emitFunctionFromInclude("pbrBlockIridescence", comments, {
                    replaceStrings: [],
                });
                // _____________________________ Clear Coat ____________________________
                const generateTBNSpace = !this.perturbedNormal.isConnected && !this.anisotropy.isConnected;
                const isTangentConnectedToPerturbNormal = this.perturbedNormal.isConnected && (this.perturbedNormal.connectedPoint?.ownerBlock).worldTangent?.isConnected;
                const isTangentConnectedToAnisotropy = this.anisotropy.isConnected && (this.anisotropy.connectedPoint?.ownerBlock).worldTangent.isConnected;
                let vTBNAvailable = isTangentConnectedToPerturbNormal || (!this.perturbedNormal.isConnected && isTangentConnectedToAnisotropy);
                state.compilationString += ClearCoatBlock.GetCode(state, clearcoatBlock, reflectionBlock, worldPosVarName, generateTBNSpace, vTBNAvailable, worldNormalVarName);
                if (generateTBNSpace) {
                    vTBNAvailable = clearcoatBlock?.worldTangent.isConnected ?? false;
                }
                state._emitFunctionFromInclude("pbrBlockClearcoat", comments, {
                    replaceStrings: [
                        { search: /computeReflectionCoords/g, replace: "computeReflectionCoordsPBR" },
                        { search: /REFLECTIONMAP_3D/g, replace: reflectionBlock?._define3DName ?? "REFLECTIONMAP_3D" },
                        { search: /REFLECTIONMAP_OPPOSITEZ/g, replace: reflectionBlock?._defineOppositeZ ?? "REFLECTIONMAP_OPPOSITEZ" },
                        { search: /REFLECTIONMAP_PROJECTION/g, replace: reflectionBlock?._defineProjectionName ?? "REFLECTIONMAP_PROJECTION" },
                        { search: /REFLECTIONMAP_SKYBOX/g, replace: reflectionBlock?._defineSkyboxName ?? "REFLECTIONMAP_SKYBOX" },
                        { search: /LODINREFLECTIONALPHA/g, replace: reflectionBlock?._defineLODReflectionAlpha ?? "LODINREFLECTIONALPHA" },
                        { search: /LINEARSPECULARREFLECTION/g, replace: reflectionBlock?._defineLinearSpecularReflection ?? "LINEARSPECULARREFLECTION" },
                        { search: /defined\(TANGENT\)/g, replace: vTBNAvailable ? "defined(TANGENT)" : "defined(IGNORE)" },
                    ],
                });
                // _________________________ Specular Environment Reflectance __________________________
                state.compilationString += state._emitCodeFromInclude("pbrBlockReflectance", comments, {
                    replaceStrings: [
                        { search: /REFLECTIONMAP_SKYBOX/g, replace: reflectionBlock?._defineSkyboxName ?? "REFLECTIONMAP_SKYBOX" },
                        { search: /REFLECTIONMAP_3D/g, replace: reflectionBlock?._define3DName ?? "REFLECTIONMAP_3D" },
                        { search: /uniforms\.vReflectivityColor/g, replace: "vReflectivityColor" },
                    ],
                });
                // ___________________________________ SubSurface ______________________________________
                const subsurfaceBlock = this.subsurface.isConnected ? this.subsurface.connectedPoint?.ownerBlock : null;
                const refractionBlock = this.subsurface.isConnected
                    ? (this.subsurface.connectedPoint?.ownerBlock).refraction.connectedPoint?.ownerBlock
                    : null;
                if (refractionBlock) {
                    refractionBlock.viewConnectionPoint = this.view;
                    refractionBlock.indexOfRefractionConnectionPoint = this.indexOfRefraction;
                }
                state.compilationString += SubSurfaceBlock.GetCode(state, subsurfaceBlock, reflectionBlock, worldPosVarName);
                state._emitFunctionFromInclude("pbrBlockSubSurface", comments, {
                    replaceStrings: [
                        { search: /REFLECTIONMAP_3D/g, replace: reflectionBlock?._define3DName ?? "REFLECTIONMAP_3D" },
                        { search: /REFLECTIONMAP_OPPOSITEZ/g, replace: reflectionBlock?._defineOppositeZ ?? "REFLECTIONMAP_OPPOSITEZ" },
                        { search: /REFLECTIONMAP_PROJECTION/g, replace: reflectionBlock?._defineProjectionName ?? "REFLECTIONMAP_PROJECTION" },
                        { search: /SS_REFRACTIONMAP_3D/g, replace: refractionBlock?._define3DName ?? "SS_REFRACTIONMAP_3D" },
                        { search: /SS_LODINREFRACTIONALPHA/g, replace: refractionBlock?._defineLODRefractionAlpha ?? "SS_LODINREFRACTIONALPHA" },
                        { search: /SS_LINEARSPECULARREFRACTION/g, replace: refractionBlock?._defineLinearSpecularRefraction ?? "SS_LINEARSPECULARREFRACTION" },
                        { search: /SS_REFRACTIONMAP_OPPOSITEZ/g, replace: refractionBlock?._defineOppositeZ ?? "SS_REFRACTIONMAP_OPPOSITEZ" },
                    ],
                });
                if (isWebGPU) {
                    state._emitFunctionFromInclude("pbrDirectLightingFunctions", comments);
                }
                if (!isWebGPU) {
                    // WebGL keeps clustered lighting in a separate include.
                    // WebGPU nests a per-light specialized include inside pbrDirectLightingFunctions
                    // so storage buffers are not passed as ptr function parameters.
                    state._emitFunctionFromInclude("pbrClusteredLightingFunctions", comments);
                }
                // _____________________________ Direct Lighting Info __________________________________
                state.compilationString += state._emitCodeFromInclude("pbrBlockDirectLighting", comments);
                if (this.light) {
                    state.compilationString += state._emitCodeFromInclude("lightFragment", comments, {
                        replaceStrings: [
                            { search: /{X}/g, replace: this._lightId.toString() },
                            { search: new RegExp(`${isWebGPU ? "fragmentInputs." : ""}vPositionW`, "g"), replace: worldPosVarName + ".xyz" },
                            { search: /uniforms\.vReflectivityColor/g, replace: "vReflectivityColor" },
                        ],
                    });
                }
                else {
                    let substitutionVars = `vPositionW,${worldPosVarName}.xyz`;
                    if (isWebGPU) {
                        substitutionVars = "fragmentInputs." + substitutionVars;
                        if (this.generateOnlyFragmentCode) {
                            substitutionVars += `,fragmentInputs.vViewDepth,vViewDepth`;
                        }
                    }
                    state.compilationString += state._emitCodeFromInclude("lightFragment", comments, {
                        repeatKey: "maxSimultaneousLights",
                        substitutionVars: substitutionVars + ",uniforms.vReflectivityColor,vReflectivityColor",
                    });
                }
                // _____________________________ Compute Final Lit Components ________________________
                state.compilationString += state._emitCodeFromInclude("pbrBlockFinalLitComponents", comments);
                // _____________________________ UNLIT (2) ________________________
                state.compilationString += `#endif\n`; // UNLIT
                // _____________________________ Compute Final Unlit Components ________________________
                const aoColor = this.ambientColor.isConnected ? this.ambientColor.associatedVariableName : `vec3${state.fSuffix}(0., 0., 0.)`;
                let aoDirectLightIntensity = PBRBaseMaterial.DEFAULT_AO_ON_ANALYTICAL_LIGHTS.toString();
                if (aoDirectLightIntensity.indexOf(".") === -1) {
                    aoDirectLightIntensity += ".";
                }
                let replaceStrings = [
                    { search: /vec3 finalEmissive[\s\S]*?finalEmissive\*=vLightingIntensity\.y;/g, replace: "" },
                    { search: new RegExp(`${isWebGPU ? "uniforms." : ""}vAmbientColor`, "g"), replace: aoColor + ` * ${isWebGPU ? "uniforms." : ""}ambientFromScene` },
                    { search: new RegExp(`${isWebGPU ? "uniforms." : ""}vAmbientInfos.w`, "g"), replace: aoDirectLightIntensity },
                ];
                if (isWebGPU) {
                    replaceStrings[0] = { search: /var finalEmissive[\s\S]*?finalEmissive\*=uniforms.vLightingIntensity\.y;/g, replace: "" };
                }
                state.compilationString += state._emitCodeFromInclude("pbrBlockFinalUnlitComponents", comments, {
                    replaceStrings: replaceStrings,
                });
                // _____________________________ Output Final Color Composition ________________________
                state.compilationString += state._emitCodeFromInclude("pbrBlockFinalColorComposition", comments, {
                    replaceStrings: [{ search: /finalEmissive/g, replace: `vec3${state.fSuffix}(0.)` }],
                });
                // _____________________________ Apply image processing ________________________
                if (isWebGPU) {
                    replaceStrings = [{ search: /mesh.visibility/g, replace: "1." }];
                }
                else {
                    replaceStrings = [{ search: /visibility/g, replace: "1." }];
                }
                state.compilationString += state._emitCodeFromInclude("pbrBlockImageProcessing", comments, {
                    replaceStrings: replaceStrings,
                });
                // _____________________________ Generate debug code ________________________
                const colorOutput = isWebGPU ? "fragmentOutputs.color" : "gl_FragColor";
                replaceStrings = [
                    { search: new RegExp(`${isWebGPU ? "fragmentInputs." : ""}vNormalW`, "g"), replace: this._vNormalWName },
                    { search: new RegExp(`${isWebGPU ? "fragmentInputs." : ""}vPositionW`, "g"), replace: worldPosVarName },
                    { search: /uniforms\.vReflectivityColor/g, replace: "vReflectivityColor" },
                    {
                        search: /albedoTexture\.rgb;/g,
                        replace: `vec3${state.fSuffix}(1.);\n${colorOutput}.rgb = toGammaSpace(${colorOutput}.rgb);\n`,
                    },
                ];
                state.compilationString += state._emitCodeFromInclude("pbrDebug", comments, {
                    replaceStrings: replaceStrings,
                });
                // _____________________________ Generate end points ________________________
                for (const output of this._outputs) {
                    if (output.hasEndpoints) {
                        const remap = MapOutputToVariable[output.name];
                        if (remap) {
                            const [varName, conditions] = remap;
                            if (conditions) {
                                state.compilationString += `#if ${conditions}\n`;
                            }
                            state.compilationString += `${state._declareOutput(output)} = ${varName};\n`;
                            if (conditions) {
                                state.compilationString += `#else\n`;
                                state.compilationString += `${state._declareOutput(output)} = vec3${state.fSuffix}(0.);\n`;
                                state.compilationString += `#endif\n`;
                            }
                        }
                        else {
                            state.sharedData.raiseBuildError(`There's no remapping for the ${output.name} end point! No code generated`);
                        }
                    }
                }
                return this;
            }
            _dumpPropertiesCode() {
                let codeString = super._dumpPropertiesCode();
                codeString += `${this._codeVariableName}.lightFalloff = ${this.lightFalloff};\n`;
                codeString += `${this._codeVariableName}.useAlphaTest = ${this.useAlphaTest};\n`;
                codeString += `${this._codeVariableName}.alphaTestCutoff = ${this.alphaTestCutoff};\n`;
                codeString += `${this._codeVariableName}.useAlphaBlending = ${this.useAlphaBlending};\n`;
                codeString += `${this._codeVariableName}.useRadianceOverAlpha = ${this.useRadianceOverAlpha};\n`;
                codeString += `${this._codeVariableName}.useSpecularOverAlpha = ${this.useSpecularOverAlpha};\n`;
                codeString += `${this._codeVariableName}.enableSpecularAntiAliasing = ${this.enableSpecularAntiAliasing};\n`;
                codeString += `${this._codeVariableName}.realTimeFiltering = ${this.realTimeFiltering};\n`;
                codeString += `${this._codeVariableName}.realTimeFilteringQuality = ${this.realTimeFilteringQuality};\n`;
                codeString += `${this._codeVariableName}.useEnergyConservation = ${this.useEnergyConservation};\n`;
                codeString += `${this._codeVariableName}.useRadianceOcclusion = ${this.useRadianceOcclusion};\n`;
                codeString += `${this._codeVariableName}.useHorizonOcclusion = ${this.useHorizonOcclusion};\n`;
                codeString += `${this._codeVariableName}.unlit = ${this.unlit};\n`;
                codeString += `${this._codeVariableName}.forceNormalForward = ${this.forceNormalForward};\n`;
                codeString += `${this._codeVariableName}.debugMode = ${this.debugMode};\n`;
                codeString += `${this._codeVariableName}.debugLimit = ${this.debugLimit};\n`;
                codeString += `${this._codeVariableName}.debugFactor = ${this.debugFactor};\n`;
                return codeString;
            }
            /**
             * Serializes the block
             * @returns the serialized object
             */
            serialize() {
                const serializationObject = super.serialize();
                if (this.light) {
                    serializationObject.lightId = this.light.id;
                }
                serializationObject.lightFalloff = this.lightFalloff;
                serializationObject.useAlphaTest = this.useAlphaTest;
                serializationObject.alphaTestCutoff = this.alphaTestCutoff;
                serializationObject.useAlphaBlending = this.useAlphaBlending;
                serializationObject.useRadianceOverAlpha = this.useRadianceOverAlpha;
                serializationObject.useSpecularOverAlpha = this.useSpecularOverAlpha;
                serializationObject.enableSpecularAntiAliasing = this.enableSpecularAntiAliasing;
                serializationObject.realTimeFiltering = this.realTimeFiltering;
                serializationObject.realTimeFilteringQuality = this.realTimeFilteringQuality;
                serializationObject.useEnergyConservation = this.useEnergyConservation;
                serializationObject.useRadianceOcclusion = this.useRadianceOcclusion;
                serializationObject.useHorizonOcclusion = this.useHorizonOcclusion;
                serializationObject.unlit = this.unlit;
                serializationObject.forceNormalForward = this.forceNormalForward;
                serializationObject.debugMode = this.debugMode;
                serializationObject.debugLimit = this.debugLimit;
                serializationObject.debugFactor = this.debugFactor;
                serializationObject.generateOnlyFragmentCode = this.generateOnlyFragmentCode;
                return serializationObject;
            }
            /**
             * Deserializes the block
             * @param serializationObject - the object to deserialize from
             * @param scene - the scene to deserialize in
             * @param rootUrl - the root URL for assets
             */
            _deserialize(serializationObject, scene, rootUrl) {
                super._deserialize(serializationObject, scene, rootUrl);
                if (serializationObject.lightId) {
                    this.light = scene.getLightById(serializationObject.lightId);
                }
                this.lightFalloff = serializationObject.lightFalloff ?? 0;
                this.useAlphaTest = serializationObject.useAlphaTest;
                this.alphaTestCutoff = serializationObject.alphaTestCutoff;
                this.useAlphaBlending = serializationObject.useAlphaBlending;
                this.useRadianceOverAlpha = serializationObject.useRadianceOverAlpha;
                this.useSpecularOverAlpha = serializationObject.useSpecularOverAlpha;
                this.enableSpecularAntiAliasing = serializationObject.enableSpecularAntiAliasing;
                this.realTimeFiltering = !!serializationObject.realTimeFiltering;
                this.realTimeFilteringQuality = serializationObject.realTimeFilteringQuality ?? 8;
                this.useEnergyConservation = serializationObject.useEnergyConservation;
                this.useRadianceOcclusion = serializationObject.useRadianceOcclusion;
                this.useHorizonOcclusion = serializationObject.useHorizonOcclusion;
                this.unlit = serializationObject.unlit;
                this.forceNormalForward = !!serializationObject.forceNormalForward;
                this.debugMode = serializationObject.debugMode;
                this.debugLimit = serializationObject.debugLimit;
                this.debugFactor = serializationObject.debugFactor;
                this.generateOnlyFragmentCode = !!serializationObject.generateOnlyFragmentCode;
                this._setTarget();
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _directIntensity_decorators = [editableInPropertyPage("Direct lights", 1 /* PropertyTypeForEdition.Float */, "INTENSITY", { min: 0, max: 1, notifiers: { update: true } })];
            _environmentIntensity_decorators = [editableInPropertyPage("Environment lights", 1 /* PropertyTypeForEdition.Float */, "INTENSITY", { min: 0, max: 1, notifiers: { update: true } })];
            _specularIntensity_decorators = [editableInPropertyPage("Specular highlights", 1 /* PropertyTypeForEdition.Float */, "INTENSITY", { min: 0, max: 1, notifiers: { update: true } })];
            _lightFalloff_decorators = [editableInPropertyPage("Light falloff", 5 /* PropertyTypeForEdition.List */, "LIGHTING & COLORS", {
                    notifiers: { update: true },
                    options: [
                        { label: "Physical", value: PBRBaseMaterial.LIGHTFALLOFF_PHYSICAL },
                        { label: "GLTF", value: PBRBaseMaterial.LIGHTFALLOFF_GLTF },
                        { label: "Standard", value: PBRBaseMaterial.LIGHTFALLOFF_STANDARD },
                    ],
                })];
            _useAlphaTest_decorators = [editableInPropertyPage("Alpha Testing", 0 /* PropertyTypeForEdition.Boolean */, "OPACITY")];
            _alphaTestCutoff_decorators = [editableInPropertyPage("Alpha CutOff", 1 /* PropertyTypeForEdition.Float */, "OPACITY", { min: 0, max: 1, notifiers: { update: true } })];
            _useAlphaBlending_decorators = [editableInPropertyPage("Alpha blending", 0 /* PropertyTypeForEdition.Boolean */, "OPACITY")];
            _useRadianceOverAlpha_decorators = [editableInPropertyPage("Radiance over alpha", 0 /* PropertyTypeForEdition.Boolean */, "RENDERING", { notifiers: { update: true } })];
            _useSpecularOverAlpha_decorators = [editableInPropertyPage("Specular over alpha", 0 /* PropertyTypeForEdition.Boolean */, "RENDERING", { notifiers: { update: true } })];
            _enableSpecularAntiAliasing_decorators = [editableInPropertyPage("Specular anti-aliasing", 0 /* PropertyTypeForEdition.Boolean */, "RENDERING", { notifiers: { update: true } })];
            _realTimeFiltering_decorators = [editableInPropertyPage("Realtime filtering", 0 /* PropertyTypeForEdition.Boolean */, "RENDERING", { notifiers: { update: true } })];
            _realTimeFilteringQuality_decorators = [editableInPropertyPage("Realtime filtering quality", 5 /* PropertyTypeForEdition.List */, "RENDERING", {
                    notifiers: { update: true },
                    options: [
                        { label: "Low", value: 8 },
                        { label: "Medium", value: 16 },
                        { label: "High", value: 64 },
                    ],
                })];
            _baseDiffuseModel_decorators = [editableInPropertyPage("Diffuse Model", 5 /* PropertyTypeForEdition.List */, "RENDERING", {
                    notifiers: { update: true },
                    options: [
                        { label: "Lambert", value: 2 },
                        { label: "Burley", value: 1 },
                        { label: "Oren-Nayar", value: 0 },
                        { label: "Legacy", value: 3 },
                    ],
                })];
            _useEnergyConservation_decorators = [editableInPropertyPage("Energy Conservation", 0 /* PropertyTypeForEdition.Boolean */, "ADVANCED", { notifiers: { update: true } })];
            _useRadianceOcclusion_decorators = [editableInPropertyPage("Radiance occlusion", 0 /* PropertyTypeForEdition.Boolean */, "ADVANCED", { notifiers: { update: true } })];
            _useHorizonOcclusion_decorators = [editableInPropertyPage("Horizon occlusion", 0 /* PropertyTypeForEdition.Boolean */, "ADVANCED", { notifiers: { update: true } })];
            _unlit_decorators = [editableInPropertyPage("Unlit", 0 /* PropertyTypeForEdition.Boolean */, "ADVANCED", { notifiers: { update: true } })];
            _forceNormalForward_decorators = [editableInPropertyPage("Force normal forward", 0 /* PropertyTypeForEdition.Boolean */, "ADVANCED", { notifiers: { update: true } })];
            _generateOnlyFragmentCode_decorators = [editableInPropertyPage("Generate only fragment code", 0 /* PropertyTypeForEdition.Boolean */, "ADVANCED", {
                    notifiers: { rebuild: true, update: true, onValidation: (block, prop) => PBRMetallicRoughnessBlock._OnGenerateOnlyFragmentCodeChanged(block, prop) },
                })];
            _debugMode_decorators = [editableInPropertyPage("Debug mode", 5 /* PropertyTypeForEdition.List */, "DEBUG", {
                    notifiers: { update: true },
                    options: [
                        { label: "None", value: 0 },
                        // Geometry
                        { label: "Normalized position", value: 1 },
                        { label: "Normals", value: 2 },
                        { label: "Tangents", value: 3 },
                        { label: "Bitangents", value: 4 },
                        { label: "Bump Normals", value: 5 },
                        //{ label: "UV1", value: 6 },
                        //{ label: "UV2", value: 7 },
                        { label: "ClearCoat Normals", value: 8 },
                        { label: "ClearCoat Tangents", value: 9 },
                        { label: "ClearCoat Bitangents", value: 10 },
                        { label: "Anisotropic Normals", value: 11 },
                        { label: "Anisotropic Tangents", value: 12 },
                        { label: "Anisotropic Bitangents", value: 13 },
                        // Maps
                        //{ label: "Emissive Map", value: 23 },
                        //{ label: "Light Map", value: 24 },
                        // Env
                        { label: "Env Refraction", value: 40 },
                        { label: "Env Reflection", value: 41 },
                        { label: "Env Clear Coat", value: 42 },
                        // Lighting
                        { label: "Direct Diffuse", value: 50 },
                        { label: "Direct Specular", value: 51 },
                        { label: "Direct Clear Coat", value: 52 },
                        { label: "Direct Sheen", value: 53 },
                        { label: "Env Irradiance", value: 54 },
                        // Lighting Params
                        { label: "Surface Albedo", value: 60 },
                        { label: "Reflectance 0", value: 61 },
                        { label: "Metallic", value: 62 },
                        { label: "Metallic F0", value: 71 },
                        { label: "Roughness", value: 63 },
                        { label: "AlphaG", value: 64 },
                        { label: "NdotV", value: 65 },
                        { label: "ClearCoat Color", value: 66 },
                        { label: "ClearCoat Roughness", value: 67 },
                        { label: "ClearCoat NdotV", value: 68 },
                        { label: "Transmittance", value: 69 },
                        { label: "Refraction Transmittance", value: 70 },
                        // Misc
                        { label: "SEO", value: 80 },
                        { label: "EHO", value: 81 },
                        { label: "Energy Factor", value: 82 },
                        { label: "Specular Reflectance", value: 83 },
                        { label: "Clear Coat Reflectance", value: 84 },
                        { label: "Sheen Reflectance", value: 85 },
                        { label: "Luminance Over Alpha", value: 86 },
                        { label: "Alpha", value: 87 },
                        { label: "Albedo color", value: 88 },
                        { label: "Ambient occlusion color", value: 89 },
                    ],
                })];
            _debugLimit_decorators = [editableInPropertyPage("Split position", 1 /* PropertyTypeForEdition.Float */, "DEBUG", { min: -1, max: 1, notifiers: { update: true } })];
            _debugFactor_decorators = [editableInPropertyPage("Output factor", 1 /* PropertyTypeForEdition.Float */, "DEBUG", { min: 0, max: 5, notifiers: { update: true } })];
            __esDecorate(null, null, _directIntensity_decorators, { kind: "field", name: "directIntensity", static: false, private: false, access: { has: obj => "directIntensity" in obj, get: obj => obj.directIntensity, set: (obj, value) => { obj.directIntensity = value; } }, metadata: _metadata }, _directIntensity_initializers, _directIntensity_extraInitializers);
            __esDecorate(null, null, _environmentIntensity_decorators, { kind: "field", name: "environmentIntensity", static: false, private: false, access: { has: obj => "environmentIntensity" in obj, get: obj => obj.environmentIntensity, set: (obj, value) => { obj.environmentIntensity = value; } }, metadata: _metadata }, _environmentIntensity_initializers, _environmentIntensity_extraInitializers);
            __esDecorate(null, null, _specularIntensity_decorators, { kind: "field", name: "specularIntensity", static: false, private: false, access: { has: obj => "specularIntensity" in obj, get: obj => obj.specularIntensity, set: (obj, value) => { obj.specularIntensity = value; } }, metadata: _metadata }, _specularIntensity_initializers, _specularIntensity_extraInitializers);
            __esDecorate(null, null, _lightFalloff_decorators, { kind: "field", name: "lightFalloff", static: false, private: false, access: { has: obj => "lightFalloff" in obj, get: obj => obj.lightFalloff, set: (obj, value) => { obj.lightFalloff = value; } }, metadata: _metadata }, _lightFalloff_initializers, _lightFalloff_extraInitializers);
            __esDecorate(null, null, _useAlphaTest_decorators, { kind: "field", name: "useAlphaTest", static: false, private: false, access: { has: obj => "useAlphaTest" in obj, get: obj => obj.useAlphaTest, set: (obj, value) => { obj.useAlphaTest = value; } }, metadata: _metadata }, _useAlphaTest_initializers, _useAlphaTest_extraInitializers);
            __esDecorate(null, null, _alphaTestCutoff_decorators, { kind: "field", name: "alphaTestCutoff", static: false, private: false, access: { has: obj => "alphaTestCutoff" in obj, get: obj => obj.alphaTestCutoff, set: (obj, value) => { obj.alphaTestCutoff = value; } }, metadata: _metadata }, _alphaTestCutoff_initializers, _alphaTestCutoff_extraInitializers);
            __esDecorate(null, null, _useAlphaBlending_decorators, { kind: "field", name: "useAlphaBlending", static: false, private: false, access: { has: obj => "useAlphaBlending" in obj, get: obj => obj.useAlphaBlending, set: (obj, value) => { obj.useAlphaBlending = value; } }, metadata: _metadata }, _useAlphaBlending_initializers, _useAlphaBlending_extraInitializers);
            __esDecorate(null, null, _useRadianceOverAlpha_decorators, { kind: "field", name: "useRadianceOverAlpha", static: false, private: false, access: { has: obj => "useRadianceOverAlpha" in obj, get: obj => obj.useRadianceOverAlpha, set: (obj, value) => { obj.useRadianceOverAlpha = value; } }, metadata: _metadata }, _useRadianceOverAlpha_initializers, _useRadianceOverAlpha_extraInitializers);
            __esDecorate(null, null, _useSpecularOverAlpha_decorators, { kind: "field", name: "useSpecularOverAlpha", static: false, private: false, access: { has: obj => "useSpecularOverAlpha" in obj, get: obj => obj.useSpecularOverAlpha, set: (obj, value) => { obj.useSpecularOverAlpha = value; } }, metadata: _metadata }, _useSpecularOverAlpha_initializers, _useSpecularOverAlpha_extraInitializers);
            __esDecorate(null, null, _enableSpecularAntiAliasing_decorators, { kind: "field", name: "enableSpecularAntiAliasing", static: false, private: false, access: { has: obj => "enableSpecularAntiAliasing" in obj, get: obj => obj.enableSpecularAntiAliasing, set: (obj, value) => { obj.enableSpecularAntiAliasing = value; } }, metadata: _metadata }, _enableSpecularAntiAliasing_initializers, _enableSpecularAntiAliasing_extraInitializers);
            __esDecorate(null, null, _realTimeFiltering_decorators, { kind: "field", name: "realTimeFiltering", static: false, private: false, access: { has: obj => "realTimeFiltering" in obj, get: obj => obj.realTimeFiltering, set: (obj, value) => { obj.realTimeFiltering = value; } }, metadata: _metadata }, _realTimeFiltering_initializers, _realTimeFiltering_extraInitializers);
            __esDecorate(null, null, _realTimeFilteringQuality_decorators, { kind: "field", name: "realTimeFilteringQuality", static: false, private: false, access: { has: obj => "realTimeFilteringQuality" in obj, get: obj => obj.realTimeFilteringQuality, set: (obj, value) => { obj.realTimeFilteringQuality = value; } }, metadata: _metadata }, _realTimeFilteringQuality_initializers, _realTimeFilteringQuality_extraInitializers);
            __esDecorate(null, null, _baseDiffuseModel_decorators, { kind: "field", name: "baseDiffuseModel", static: false, private: false, access: { has: obj => "baseDiffuseModel" in obj, get: obj => obj.baseDiffuseModel, set: (obj, value) => { obj.baseDiffuseModel = value; } }, metadata: _metadata }, _baseDiffuseModel_initializers, _baseDiffuseModel_extraInitializers);
            __esDecorate(null, null, _useEnergyConservation_decorators, { kind: "field", name: "useEnergyConservation", static: false, private: false, access: { has: obj => "useEnergyConservation" in obj, get: obj => obj.useEnergyConservation, set: (obj, value) => { obj.useEnergyConservation = value; } }, metadata: _metadata }, _useEnergyConservation_initializers, _useEnergyConservation_extraInitializers);
            __esDecorate(null, null, _useRadianceOcclusion_decorators, { kind: "field", name: "useRadianceOcclusion", static: false, private: false, access: { has: obj => "useRadianceOcclusion" in obj, get: obj => obj.useRadianceOcclusion, set: (obj, value) => { obj.useRadianceOcclusion = value; } }, metadata: _metadata }, _useRadianceOcclusion_initializers, _useRadianceOcclusion_extraInitializers);
            __esDecorate(null, null, _useHorizonOcclusion_decorators, { kind: "field", name: "useHorizonOcclusion", static: false, private: false, access: { has: obj => "useHorizonOcclusion" in obj, get: obj => obj.useHorizonOcclusion, set: (obj, value) => { obj.useHorizonOcclusion = value; } }, metadata: _metadata }, _useHorizonOcclusion_initializers, _useHorizonOcclusion_extraInitializers);
            __esDecorate(null, null, _unlit_decorators, { kind: "field", name: "unlit", static: false, private: false, access: { has: obj => "unlit" in obj, get: obj => obj.unlit, set: (obj, value) => { obj.unlit = value; } }, metadata: _metadata }, _unlit_initializers, _unlit_extraInitializers);
            __esDecorate(null, null, _forceNormalForward_decorators, { kind: "field", name: "forceNormalForward", static: false, private: false, access: { has: obj => "forceNormalForward" in obj, get: obj => obj.forceNormalForward, set: (obj, value) => { obj.forceNormalForward = value; } }, metadata: _metadata }, _forceNormalForward_initializers, _forceNormalForward_extraInitializers);
            __esDecorate(null, null, _generateOnlyFragmentCode_decorators, { kind: "field", name: "generateOnlyFragmentCode", static: false, private: false, access: { has: obj => "generateOnlyFragmentCode" in obj, get: obj => obj.generateOnlyFragmentCode, set: (obj, value) => { obj.generateOnlyFragmentCode = value; } }, metadata: _metadata }, _generateOnlyFragmentCode_initializers, _generateOnlyFragmentCode_extraInitializers);
            __esDecorate(null, null, _debugMode_decorators, { kind: "field", name: "debugMode", static: false, private: false, access: { has: obj => "debugMode" in obj, get: obj => obj.debugMode, set: (obj, value) => { obj.debugMode = value; } }, metadata: _metadata }, _debugMode_initializers, _debugMode_extraInitializers);
            __esDecorate(null, null, _debugLimit_decorators, { kind: "field", name: "debugLimit", static: false, private: false, access: { has: obj => "debugLimit" in obj, get: obj => obj.debugLimit, set: (obj, value) => { obj.debugLimit = value; } }, metadata: _metadata }, _debugLimit_initializers, _debugLimit_extraInitializers);
            __esDecorate(null, null, _debugFactor_decorators, { kind: "field", name: "debugFactor", static: false, private: false, access: { has: obj => "debugFactor" in obj, get: obj => obj.debugFactor, set: (obj, value) => { obj.debugFactor = value; } }, metadata: _metadata }, _debugFactor_initializers, _debugFactor_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
export { PBRMetallicRoughnessBlock };
let _Registered = false;
/**
 * Register side effects for pbrMetallicRoughnessBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterPbrMetallicRoughnessBlock() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    RegisterClass("BABYLON.PBRMetallicRoughnessBlock", PBRMetallicRoughnessBlock);
}
//# sourceMappingURL=pbrMetallicRoughnessBlock.pure.js.map