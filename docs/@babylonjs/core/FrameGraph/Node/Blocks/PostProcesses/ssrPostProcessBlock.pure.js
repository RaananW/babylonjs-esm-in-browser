/** This file must only contain pure code and pure imports */
import { __esDecorate, __runInitializers } from "../../../../tslib.es6.js";

import { NodeRenderGraphBlockConnectionPointTypes } from "../../Types/nodeRenderGraphTypes.js";
import { editableInPropertyPage } from "../../../../Decorators/nodeDecorator.js";
import { FrameGraphSSRRenderingPipelineTask } from "../../../Tasks/PostProcesses/ssrRenderingPipelineTask.js";
import { NodeRenderGraphBasePostProcessBlock } from "./basePostProcessBlock.js";
import { RegisterClass } from "../../../../Misc/typeStore.js";
/**
 * Block that implements the SSR post process
 */
let NodeRenderGraphSSRPostProcessBlock = (() => {
    var _a;
    let _classSuper = NodeRenderGraphBasePostProcessBlock;
    let _instanceExtraInitializers = [];
    let _get_textureType_decorators;
    let _get_debug_decorators;
    let _get_strength_decorators;
    let _get_reflectionSpecularFalloffExponent_decorators;
    let _get_reflectivityThreshold_decorators;
    let _get_thickness_decorators;
    let _get_step_decorators;
    let _get_enableSmoothReflections_decorators;
    let _get_maxSteps_decorators;
    let _get_maxDistance_decorators;
    let _get_roughnessFactor_decorators;
    let _get_selfCollisionNumSkip_decorators;
    let _get_ssrDownsample_decorators;
    let _get_clipToFrustum_decorators;
    let _get_enableAutomaticThicknessComputation_decorators;
    let _get_useFresnel_decorators;
    let _get_blurDispersionStrength_decorators;
    let _get_blurDownsample_decorators;
    let _get_attenuateScreenBorders_decorators;
    let _get_attenuateIntersectionDistance_decorators;
    let _get_attenuateIntersectionIterations_decorators;
    let _get_attenuateFacingCamera_decorators;
    let _get_attenuateBackfaceReflection_decorators;
    let _get_inputTextureColorIsInGammaSpace_decorators;
    let _get_generateOutputInGammaSpace_decorators;
    return _a = class NodeRenderGraphSSRPostProcessBlock extends _classSuper {
            /**
             * Gets the frame graph task associated with this block
             */
            get task() {
                return this._frameGraphTask;
            }
            /**
             * Create a new NodeRenderGraphSSRPostProcessBlock
             * @param name defines the block name
             * @param frameGraph defines the hosting frame graph
             * @param scene defines the hosting scene
             * @param textureType The texture type used by the different post processes created by SSR (default: 0)
             */
            constructor(name, frameGraph, scene, textureType = 0) {
                super(name, frameGraph, scene);
                this._frameGraphTask = __runInitializers(this, _instanceExtraInitializers);
                this._additionalConstructionParameters = [textureType];
                this.registerInput("camera", NodeRenderGraphBlockConnectionPointTypes.Camera);
                this.registerInput("geomDepth", NodeRenderGraphBlockConnectionPointTypes.AutoDetect);
                this.registerInput("geomNormal", NodeRenderGraphBlockConnectionPointTypes.AutoDetect);
                this.registerInput("geomReflectivity", NodeRenderGraphBlockConnectionPointTypes.TextureReflectivity);
                this.registerInput("geomBackDepth", NodeRenderGraphBlockConnectionPointTypes.AutoDetect, true);
                this.geomNormal.addExcludedConnectionPointFromAllowedTypes(NodeRenderGraphBlockConnectionPointTypes.TextureWorldNormal | NodeRenderGraphBlockConnectionPointTypes.TextureViewNormal);
                this.geomDepth.addExcludedConnectionPointFromAllowedTypes(NodeRenderGraphBlockConnectionPointTypes.TextureScreenDepth | NodeRenderGraphBlockConnectionPointTypes.TextureViewDepth);
                this.geomBackDepth.addExcludedConnectionPointFromAllowedTypes(NodeRenderGraphBlockConnectionPointTypes.TextureScreenDepth | NodeRenderGraphBlockConnectionPointTypes.TextureViewDepth);
                this._finalizeInputOutputRegistering();
                this._frameGraphTask = new FrameGraphSSRRenderingPipelineTask(this.name, frameGraph, textureType);
            }
            _createTask(textureType) {
                const sourceSamplingMode = this.sourceSamplingMode;
                const maxDistance = this.maxDistance;
                const step = this.step;
                const thickness = this.thickness;
                const strength = this.strength;
                const reflectionSpecularFalloffExponent = this.reflectionSpecularFalloffExponent;
                const maxSteps = this.maxSteps;
                const roughnessFactor = this.roughnessFactor;
                const selfCollisionNumSkip = this.selfCollisionNumSkip;
                const reflectivityThreshold = this.reflectivityThreshold;
                const ssrDownsample = this.ssrDownsample;
                const blurDispersionStrength = this.blurDispersionStrength;
                const blurDownsample = this.blurDownsample;
                const enableSmoothReflections = this.enableSmoothReflections;
                const attenuateScreenBorders = this.attenuateScreenBorders;
                const attenuateIntersectionDistance = this.attenuateIntersectionDistance;
                const attenuateIntersectionIterations = this.attenuateIntersectionIterations;
                const attenuateFacingCamera = this.attenuateFacingCamera;
                const attenuateBackfaceReflection = this.attenuateBackfaceReflection;
                const clipToFrustum = this.clipToFrustum;
                const enableAutomaticThicknessComputation = this.enableAutomaticThicknessComputation;
                const useFresnel = this.useFresnel;
                const inputTextureColorIsInGammaSpace = this.inputTextureColorIsInGammaSpace;
                const generateOutputInGammaSpace = this.generateOutputInGammaSpace;
                const debug = this.debug;
                this._frameGraphTask.dispose();
                this._frameGraphTask = new FrameGraphSSRRenderingPipelineTask(this.name, this._frameGraph, textureType);
                this.sourceSamplingMode = sourceSamplingMode;
                this.maxDistance = maxDistance;
                this.step = step;
                this.thickness = thickness;
                this.strength = strength;
                this.reflectionSpecularFalloffExponent = reflectionSpecularFalloffExponent;
                this.maxSteps = maxSteps;
                this.roughnessFactor = roughnessFactor;
                this.selfCollisionNumSkip = selfCollisionNumSkip;
                this.reflectivityThreshold = reflectivityThreshold;
                this.ssrDownsample = ssrDownsample;
                this.blurDispersionStrength = blurDispersionStrength;
                this.blurDownsample = blurDownsample;
                this.enableSmoothReflections = enableSmoothReflections;
                this.attenuateScreenBorders = attenuateScreenBorders;
                this.attenuateIntersectionDistance = attenuateIntersectionDistance;
                this.attenuateIntersectionIterations = attenuateIntersectionIterations;
                this.attenuateFacingCamera = attenuateFacingCamera;
                this.attenuateBackfaceReflection = attenuateBackfaceReflection;
                this.clipToFrustum = clipToFrustum;
                this.useFresnel = useFresnel;
                this.enableAutomaticThicknessComputation = enableAutomaticThicknessComputation;
                this.inputTextureColorIsInGammaSpace = inputTextureColorIsInGammaSpace;
                this.generateOutputInGammaSpace = generateOutputInGammaSpace;
                this.debug = debug;
                this._additionalConstructionParameters = [textureType];
            }
            /** The texture type used by the different post processes created by SSR */
            get textureType() {
                return this._frameGraphTask.textureType;
            }
            set textureType(value) {
                this._createTask(value);
            }
            /** Gets or sets a boolean indicating if the effect should be rendered in debug mode */
            get debug() {
                return this._frameGraphTask.ssr.debug;
            }
            set debug(value) {
                this._frameGraphTask.ssr.debug = value;
            }
            /** Gets or sets the current reflection strength. 1.0 is an ideal value but can be increased/decreased for particular results */
            get strength() {
                return this._frameGraphTask.ssr.strength;
            }
            set strength(value) {
                this._frameGraphTask.ssr.strength = value;
            }
            /** Gets or sets the falloff exponent used to compute the reflection strength. Higher values lead to fainter reflections */
            get reflectionSpecularFalloffExponent() {
                return this._frameGraphTask.ssr.reflectionSpecularFalloffExponent;
            }
            set reflectionSpecularFalloffExponent(value) {
                this._frameGraphTask.ssr.reflectionSpecularFalloffExponent = value;
            }
            /** Gets or sets the minimum value for one of the reflectivity component of the material to consider it for SSR */
            get reflectivityThreshold() {
                return this._frameGraphTask.ssr.reflectivityThreshold;
            }
            set reflectivityThreshold(value) {
                this._frameGraphTask.ssr.reflectivityThreshold = value;
            }
            /** Gets or sets the thickness value used as tolerance when computing the intersection between the reflected ray and the scene */
            get thickness() {
                return this._frameGraphTask.ssr.thickness;
            }
            set thickness(value) {
                this._frameGraphTask.ssr.thickness = value;
            }
            /** Gets or sets the step size used to iterate until the effect finds the color of the reflection's pixel */
            get step() {
                return this._frameGraphTask.ssr.step;
            }
            set step(value) {
                this._frameGraphTask.ssr.step = value;
            }
            /** Gets or sets whether or not smoothing reflections is enabled */
            get enableSmoothReflections() {
                return this._frameGraphTask.ssr.enableSmoothReflections;
            }
            set enableSmoothReflections(value) {
                this._frameGraphTask.ssr.enableSmoothReflections = value;
            }
            /** Maximum number of steps during the ray marching process after which we consider an intersection could not be found */
            get maxSteps() {
                return this._frameGraphTask.ssr.maxSteps;
            }
            set maxSteps(value) {
                this._frameGraphTask.ssr.maxSteps = value;
            }
            /** Gets or sets the max distance used to define how far we look for reflection during the ray-marching on the reflected ray */
            get maxDistance() {
                return this._frameGraphTask.ssr.maxDistance;
            }
            set maxDistance(value) {
                this._frameGraphTask.ssr.maxDistance = value;
            }
            /** Gets or sets the factor applied when computing roughness */
            get roughnessFactor() {
                return this._frameGraphTask.ssr.roughnessFactor;
            }
            set roughnessFactor(value) {
                this._frameGraphTask.ssr.roughnessFactor = value;
            }
            /** Number of steps to skip at start when marching the ray to avoid self collisions */
            get selfCollisionNumSkip() {
                return this._frameGraphTask.ssr.selfCollisionNumSkip;
            }
            set selfCollisionNumSkip(value) {
                this._frameGraphTask.ssr.selfCollisionNumSkip = value;
            }
            /** Gets or sets the downsample factor used to reduce the size of the texture used to compute the SSR contribution */
            get ssrDownsample() {
                return this._frameGraphTask.ssr.ssrDownsample;
            }
            set ssrDownsample(value) {
                this._frameGraphTask.ssr.ssrDownsample = value;
            }
            /** Gets or sets a boolean indicating if the ray should be clipped to the frustum */
            get clipToFrustum() {
                return this._frameGraphTask.ssr.clipToFrustum;
            }
            set clipToFrustum(value) {
                this._frameGraphTask.ssr.clipToFrustum = value;
            }
            /** Gets or sets a boolean defining if geometry thickness should be computed automatically */
            get enableAutomaticThicknessComputation() {
                return this._frameGraphTask.ssr.enableAutomaticThicknessComputation;
            }
            set enableAutomaticThicknessComputation(value) {
                this._frameGraphTask.ssr.enableAutomaticThicknessComputation = value;
            }
            /** Gets or sets a boolean indicating whether the blending between the current color pixel and the reflection color should be done with a Fresnel coefficient */
            get useFresnel() {
                return this._frameGraphTask.ssr.useFresnel;
            }
            set useFresnel(value) {
                this._frameGraphTask.ssr.useFresnel = value;
            }
            /** Gets or sets the blur dispersion strength. Set this value to 0 to disable blurring */
            get blurDispersionStrength() {
                return this._frameGraphTask.ssr.blurDispersionStrength;
            }
            set blurDispersionStrength(value) {
                this._frameGraphTask.ssr.blurDispersionStrength = value;
            }
            /** Gets or sets the downsample factor used to reduce the size of the textures used to blur the reflection effect */
            get blurDownsample() {
                return this._frameGraphTask.ssr.blurDownsample;
            }
            set blurDownsample(value) {
                this._frameGraphTask.ssr.blurDownsample = value;
            }
            /** Gets or sets a boolean indicating if the reflections should be attenuated at the screen borders */
            get attenuateScreenBorders() {
                return this._frameGraphTask.ssr.attenuateScreenBorders;
            }
            set attenuateScreenBorders(value) {
                this._frameGraphTask.ssr.attenuateScreenBorders = value;
            }
            /** Gets or sets a boolean indicating if the reflections should be attenuated according to the distance of the intersection */
            get attenuateIntersectionDistance() {
                return this._frameGraphTask.ssr.attenuateIntersectionDistance;
            }
            set attenuateIntersectionDistance(value) {
                this._frameGraphTask.ssr.attenuateIntersectionDistance = value;
            }
            /** Gets or sets a boolean indicating if the reflections should be attenuated according to the number of iterations performed to find the intersection */
            get attenuateIntersectionIterations() {
                return this._frameGraphTask.ssr.attenuateIntersectionIterations;
            }
            set attenuateIntersectionIterations(value) {
                this._frameGraphTask.ssr.attenuateIntersectionIterations = value;
            }
            /** Gets or sets a boolean indicating if the reflections should be attenuated when the reflection ray is facing the camera (the view direction) */
            get attenuateFacingCamera() {
                return this._frameGraphTask.ssr.attenuateFacingCamera;
            }
            set attenuateFacingCamera(value) {
                this._frameGraphTask.ssr.attenuateFacingCamera = value;
            }
            /** Gets or sets a boolean indicating if the backface reflections should be attenuated */
            get attenuateBackfaceReflection() {
                return this._frameGraphTask.ssr.attenuateBackfaceReflection;
            }
            set attenuateBackfaceReflection(value) {
                this._frameGraphTask.ssr.attenuateBackfaceReflection = value;
            }
            /** Gets or sets a boolean defining if the input color texture is in gamma space */
            get inputTextureColorIsInGammaSpace() {
                return this._frameGraphTask.ssr.inputTextureColorIsInGammaSpace;
            }
            set inputTextureColorIsInGammaSpace(value) {
                this._frameGraphTask.ssr.inputTextureColorIsInGammaSpace = value;
            }
            /** Gets or sets a boolean defining if the output color texture generated by the SSR pipeline should be in gamma space */
            get generateOutputInGammaSpace() {
                return this._frameGraphTask.ssr.generateOutputInGammaSpace;
            }
            set generateOutputInGammaSpace(value) {
                this._frameGraphTask.ssr.generateOutputInGammaSpace = value;
            }
            /**
             * Gets the current class name
             * @returns the class name
             */
            getClassName() {
                return "NodeRenderGraphSSRPostProcessBlock";
            }
            /**
             * Gets the camera input component
             */
            get camera() {
                return this._inputs[2];
            }
            /**
             * Gets the geometry depth input component
             */
            get geomDepth() {
                return this._inputs[3];
            }
            /**
             * Gets the geometry normal input component
             */
            get geomNormal() {
                return this._inputs[4];
            }
            /**
             * Gets the geometry reflectivity input component
             */
            get geomReflectivity() {
                return this._inputs[5];
            }
            /**
             * Gets the geometry back depth input component
             */
            get geomBackDepth() {
                return this._inputs[6];
            }
            _buildBlock(state) {
                super._buildBlock(state);
                this._frameGraphTask.normalTexture = this.geomNormal.connectedPoint?.value;
                this._frameGraphTask.depthTexture = this.geomDepth.connectedPoint?.value;
                this._frameGraphTask.reflectivityTexture = this.geomReflectivity.connectedPoint?.value;
                this._frameGraphTask.backDepthTexture = this.geomBackDepth.connectedPoint?.value;
                this._frameGraphTask.camera = this.camera.connectedPoint?.value;
                if (this.enableAutomaticThicknessComputation) {
                    if (!this._frameGraphTask.backDepthTexture) {
                        throw new Error(`SSR post process "${this.name}": Automatic thickness computation requires a back depth texture to be connected!`);
                    }
                    const geomBackDepthOwnerBlock = this.geomBackDepth.connectedPoint.ownerBlock;
                    if (geomBackDepthOwnerBlock.getClassName() === "NodeRenderGraphGeometryRendererBlock") {
                        const geometryBackFaceRendererBlock = geomBackDepthOwnerBlock;
                        if (!geometryBackFaceRendererBlock.reverseCulling) {
                            throw new Error(`SSR post process "${this.name}": Automatic thickness computation requires the geometry renderer block for the back depth texture to have reverse culling enabled!`);
                        }
                        if (this._frameGraphTask.depthTexture) {
                            const geomDepthOwnerBlock = this.geomDepth.connectedPoint.ownerBlock;
                            if (geomDepthOwnerBlock.getClassName() === "NodeRenderGraphGeometryRendererBlock") {
                                const geomDepthConnectionPointType = this.geomDepth.connectedPoint.type;
                                const geomBackDepthConnectionPointType = this.geomBackDepth.connectedPoint.type;
                                if (geomDepthConnectionPointType !== geomBackDepthConnectionPointType) {
                                    throw new Error(`SSR post process "${this.name}": Automatic thickness computation requires that geomDepth and geomBackDepth have the same type (view or screen space depth)!`);
                                }
                            }
                        }
                    }
                }
                if (this.geomNormal.connectedPoint) {
                    if (this.geomNormal.connectedPoint.type === NodeRenderGraphBlockConnectionPointTypes.TextureWorldNormal) {
                        this._frameGraphTask.ssr.normalsAreInWorldSpace = true;
                        this._frameGraphTask.ssr.normalsAreUnsigned = true;
                    }
                }
                if (this.geomDepth.connectedPoint) {
                    if (this.geomDepth.connectedPoint.type === NodeRenderGraphBlockConnectionPointTypes.TextureScreenDepth) {
                        this._frameGraphTask.ssr.useScreenspaceDepth = true;
                    }
                }
            }
            _dumpPropertiesCode() {
                const codes = [];
                codes.push(`${this._codeVariableName}.debug = ${this.debug};`);
                codes.push(`${this._codeVariableName}.strength = ${this.strength};`);
                codes.push(`${this._codeVariableName}.reflectionSpecularFalloffExponent = ${this.reflectionSpecularFalloffExponent};`);
                codes.push(`${this._codeVariableName}.reflectivityThreshold = ${this.reflectivityThreshold};`);
                codes.push(`${this._codeVariableName}.thickness = ${this.thickness};`);
                codes.push(`${this._codeVariableName}.step = ${this.step};`);
                codes.push(`${this._codeVariableName}.enableSmoothReflections = ${this.enableSmoothReflections};`);
                codes.push(`${this._codeVariableName}.maxSteps = ${this.maxSteps};`);
                codes.push(`${this._codeVariableName}.maxDistance = ${this.maxDistance};`);
                codes.push(`${this._codeVariableName}.roughnessFactor = ${this.roughnessFactor};`);
                codes.push(`${this._codeVariableName}.selfCollisionNumSkip = ${this.selfCollisionNumSkip};`);
                codes.push(`${this._codeVariableName}.ssrDownsample = ${this.ssrDownsample};`);
                codes.push(`${this._codeVariableName}.clipToFrustum = ${this.clipToFrustum};`);
                codes.push(`${this._codeVariableName}.useFresnel = ${this.useFresnel};`);
                codes.push(`${this._codeVariableName}.enableAutomaticThicknessComputation = ${this.enableAutomaticThicknessComputation};`);
                codes.push(`${this._codeVariableName}.blurDispersionStrength = ${this.blurDispersionStrength};`);
                codes.push(`${this._codeVariableName}.blurDownsample = ${this.blurDownsample};`);
                codes.push(`${this._codeVariableName}.attenuateScreenBorders = ${this.attenuateScreenBorders};`);
                codes.push(`${this._codeVariableName}.attenuateIntersectionDistance = ${this.attenuateIntersectionDistance};`);
                codes.push(`${this._codeVariableName}.attenuateIntersectionIterations = ${this.attenuateIntersectionIterations};`);
                codes.push(`${this._codeVariableName}.attenuateFacingCamera = ${this.attenuateFacingCamera};`);
                codes.push(`${this._codeVariableName}.attenuateBackfaceReflection = ${this.attenuateBackfaceReflection};`);
                codes.push(`${this._codeVariableName}.inputTextureColorIsInGammaSpace = ${this.inputTextureColorIsInGammaSpace};`);
                codes.push(`${this._codeVariableName}.generateOutputInGammaSpace = ${this.generateOutputInGammaSpace};`);
                return super._dumpPropertiesCode() + codes.join("\n");
            }
            serialize() {
                const serializationObject = super.serialize();
                serializationObject.debug = this.debug;
                serializationObject.strength = this.strength;
                serializationObject.reflectionSpecularFalloffExponent = this.reflectionSpecularFalloffExponent;
                serializationObject.reflectivityThreshold = this.reflectivityThreshold;
                serializationObject.thickness = this.thickness;
                serializationObject.step = this.step;
                serializationObject.enableSmoothReflections = this.enableSmoothReflections;
                serializationObject.maxSteps = this.maxSteps;
                serializationObject.maxDistance = this.maxDistance;
                serializationObject.roughnessFactor = this.roughnessFactor;
                serializationObject.selfCollisionNumSkip = this.selfCollisionNumSkip;
                serializationObject.ssrDownsample = this.ssrDownsample;
                serializationObject.clipToFrustum = this.clipToFrustum;
                serializationObject.useFresnel = this.useFresnel;
                serializationObject.enableAutomaticThicknessComputation = this.enableAutomaticThicknessComputation;
                serializationObject.blurDispersionStrength = this.blurDispersionStrength;
                serializationObject.blurDownsample = this.blurDownsample;
                serializationObject.attenuateScreenBorders = this.attenuateScreenBorders;
                serializationObject.attenuateIntersectionDistance = this.attenuateIntersectionDistance;
                serializationObject.attenuateIntersectionIterations = this.attenuateIntersectionIterations;
                serializationObject.attenuateFacingCamera = this.attenuateFacingCamera;
                serializationObject.attenuateBackfaceReflection = this.attenuateBackfaceReflection;
                serializationObject.inputTextureColorIsInGammaSpace = this.inputTextureColorIsInGammaSpace;
                serializationObject.generateOutputInGammaSpace = this.generateOutputInGammaSpace;
                return serializationObject;
            }
            _deserialize(serializationObject) {
                super._deserialize(serializationObject);
                this.debug = serializationObject.debug;
                this.strength = serializationObject.strength;
                this.reflectionSpecularFalloffExponent = serializationObject.reflectionSpecularFalloffExponent;
                this.reflectivityThreshold = serializationObject.reflectivityThreshold;
                this.thickness = serializationObject.thickness;
                this.step = serializationObject.step;
                this.enableSmoothReflections = serializationObject.enableSmoothReflections;
                this.maxSteps = serializationObject.maxSteps;
                this.maxDistance = serializationObject.maxDistance;
                this.roughnessFactor = serializationObject.roughnessFactor;
                this.selfCollisionNumSkip = serializationObject.selfCollisionNumSkip;
                this.ssrDownsample = serializationObject.ssrDownsample;
                this.clipToFrustum = serializationObject.clipToFrustum;
                this.useFresnel = serializationObject.useFresnel;
                this.enableAutomaticThicknessComputation = serializationObject.enableAutomaticThicknessComputation;
                this.blurDispersionStrength = serializationObject.blurDispersionStrength;
                this.blurDownsample = serializationObject.blurDownsample;
                this.attenuateScreenBorders = serializationObject.attenuateScreenBorders;
                this.attenuateIntersectionDistance = serializationObject.attenuateIntersectionDistance;
                this.attenuateIntersectionIterations = serializationObject.attenuateIntersectionIterations;
                this.attenuateFacingCamera = serializationObject.attenuateFacingCamera;
                this.attenuateBackfaceReflection = serializationObject.attenuateBackfaceReflection;
                this.inputTextureColorIsInGammaSpace = serializationObject.inputTextureColorIsInGammaSpace;
                this.generateOutputInGammaSpace = serializationObject.generateOutputInGammaSpace;
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _get_textureType_decorators = [editableInPropertyPage("Texture type", 10 /* PropertyTypeForEdition.TextureType */, "SSR")];
            _get_debug_decorators = [editableInPropertyPage("Debug", 0 /* PropertyTypeForEdition.Boolean */, "SSR")];
            _get_strength_decorators = [editableInPropertyPage("Strength", 1 /* PropertyTypeForEdition.Float */, "SSR", { min: 0, max: 5 })];
            _get_reflectionSpecularFalloffExponent_decorators = [editableInPropertyPage("Reflection exponent", 1 /* PropertyTypeForEdition.Float */, "SSR", { min: 0, max: 5 })];
            _get_reflectivityThreshold_decorators = [editableInPropertyPage("Reflectivity threshold", 1 /* PropertyTypeForEdition.Float */, "SSR", { min: 0, max: 1 })];
            _get_thickness_decorators = [editableInPropertyPage("Thickness", 1 /* PropertyTypeForEdition.Float */, "SSR", { min: 0, max: 10 })];
            _get_step_decorators = [editableInPropertyPage("Step", 2 /* PropertyTypeForEdition.Int */, "SSR", { min: 1, max: 50 })];
            _get_enableSmoothReflections_decorators = [editableInPropertyPage("Smooth reflections", 0 /* PropertyTypeForEdition.Boolean */, "SSR")];
            _get_maxSteps_decorators = [editableInPropertyPage("Max steps", 2 /* PropertyTypeForEdition.Int */, "SSR", { min: 1, max: 3000 })];
            _get_maxDistance_decorators = [editableInPropertyPage("Max distance", 1 /* PropertyTypeForEdition.Float */, "SSR", { min: 1, max: 3000 })];
            _get_roughnessFactor_decorators = [editableInPropertyPage("Roughness factor", 1 /* PropertyTypeForEdition.Float */, "SSR", { min: 0, max: 1 })];
            _get_selfCollisionNumSkip_decorators = [editableInPropertyPage("Self collision skips", 2 /* PropertyTypeForEdition.Int */, "SSR", { min: 1, max: 10 })];
            _get_ssrDownsample_decorators = [editableInPropertyPage("SSR downsample", 2 /* PropertyTypeForEdition.Int */, "SSR", { min: 0, max: 5 })];
            _get_clipToFrustum_decorators = [editableInPropertyPage("Clip to frustum", 0 /* PropertyTypeForEdition.Boolean */, "SSR")];
            _get_enableAutomaticThicknessComputation_decorators = [editableInPropertyPage("Automatic thickness computation", 0 /* PropertyTypeForEdition.Boolean */, "SSR")];
            _get_useFresnel_decorators = [editableInPropertyPage("Use Fresnel", 0 /* PropertyTypeForEdition.Boolean */, "SSR")];
            _get_blurDispersionStrength_decorators = [editableInPropertyPage("Strength", 1 /* PropertyTypeForEdition.Float */, "Blur", { min: 0, max: 0.15 })];
            _get_blurDownsample_decorators = [editableInPropertyPage("Blur downsample", 2 /* PropertyTypeForEdition.Int */, "Blur", { min: 0, max: 5 })];
            _get_attenuateScreenBorders_decorators = [editableInPropertyPage("Screen borders", 0 /* PropertyTypeForEdition.Boolean */, "Attenuations")];
            _get_attenuateIntersectionDistance_decorators = [editableInPropertyPage("Distance", 0 /* PropertyTypeForEdition.Boolean */, "Attenuations")];
            _get_attenuateIntersectionIterations_decorators = [editableInPropertyPage("Step iterations", 0 /* PropertyTypeForEdition.Boolean */, "Attenuations")];
            _get_attenuateFacingCamera_decorators = [editableInPropertyPage("Facing camera", 0 /* PropertyTypeForEdition.Boolean */, "Attenuations")];
            _get_attenuateBackfaceReflection_decorators = [editableInPropertyPage("Backface reflections", 0 /* PropertyTypeForEdition.Boolean */, "Attenuations")];
            _get_inputTextureColorIsInGammaSpace_decorators = [editableInPropertyPage("Input is in gamma space", 0 /* PropertyTypeForEdition.Boolean */, "Color space")];
            _get_generateOutputInGammaSpace_decorators = [editableInPropertyPage("Output to gamma space", 0 /* PropertyTypeForEdition.Boolean */, "Color space")];
            __esDecorate(_a, null, _get_textureType_decorators, { kind: "getter", name: "textureType", static: false, private: false, access: { has: obj => "textureType" in obj, get: obj => obj.textureType }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _get_debug_decorators, { kind: "getter", name: "debug", static: false, private: false, access: { has: obj => "debug" in obj, get: obj => obj.debug }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _get_strength_decorators, { kind: "getter", name: "strength", static: false, private: false, access: { has: obj => "strength" in obj, get: obj => obj.strength }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _get_reflectionSpecularFalloffExponent_decorators, { kind: "getter", name: "reflectionSpecularFalloffExponent", static: false, private: false, access: { has: obj => "reflectionSpecularFalloffExponent" in obj, get: obj => obj.reflectionSpecularFalloffExponent }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _get_reflectivityThreshold_decorators, { kind: "getter", name: "reflectivityThreshold", static: false, private: false, access: { has: obj => "reflectivityThreshold" in obj, get: obj => obj.reflectivityThreshold }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _get_thickness_decorators, { kind: "getter", name: "thickness", static: false, private: false, access: { has: obj => "thickness" in obj, get: obj => obj.thickness }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _get_step_decorators, { kind: "getter", name: "step", static: false, private: false, access: { has: obj => "step" in obj, get: obj => obj.step }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _get_enableSmoothReflections_decorators, { kind: "getter", name: "enableSmoothReflections", static: false, private: false, access: { has: obj => "enableSmoothReflections" in obj, get: obj => obj.enableSmoothReflections }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _get_maxSteps_decorators, { kind: "getter", name: "maxSteps", static: false, private: false, access: { has: obj => "maxSteps" in obj, get: obj => obj.maxSteps }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _get_maxDistance_decorators, { kind: "getter", name: "maxDistance", static: false, private: false, access: { has: obj => "maxDistance" in obj, get: obj => obj.maxDistance }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _get_roughnessFactor_decorators, { kind: "getter", name: "roughnessFactor", static: false, private: false, access: { has: obj => "roughnessFactor" in obj, get: obj => obj.roughnessFactor }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _get_selfCollisionNumSkip_decorators, { kind: "getter", name: "selfCollisionNumSkip", static: false, private: false, access: { has: obj => "selfCollisionNumSkip" in obj, get: obj => obj.selfCollisionNumSkip }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _get_ssrDownsample_decorators, { kind: "getter", name: "ssrDownsample", static: false, private: false, access: { has: obj => "ssrDownsample" in obj, get: obj => obj.ssrDownsample }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _get_clipToFrustum_decorators, { kind: "getter", name: "clipToFrustum", static: false, private: false, access: { has: obj => "clipToFrustum" in obj, get: obj => obj.clipToFrustum }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _get_enableAutomaticThicknessComputation_decorators, { kind: "getter", name: "enableAutomaticThicknessComputation", static: false, private: false, access: { has: obj => "enableAutomaticThicknessComputation" in obj, get: obj => obj.enableAutomaticThicknessComputation }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _get_useFresnel_decorators, { kind: "getter", name: "useFresnel", static: false, private: false, access: { has: obj => "useFresnel" in obj, get: obj => obj.useFresnel }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _get_blurDispersionStrength_decorators, { kind: "getter", name: "blurDispersionStrength", static: false, private: false, access: { has: obj => "blurDispersionStrength" in obj, get: obj => obj.blurDispersionStrength }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _get_blurDownsample_decorators, { kind: "getter", name: "blurDownsample", static: false, private: false, access: { has: obj => "blurDownsample" in obj, get: obj => obj.blurDownsample }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _get_attenuateScreenBorders_decorators, { kind: "getter", name: "attenuateScreenBorders", static: false, private: false, access: { has: obj => "attenuateScreenBorders" in obj, get: obj => obj.attenuateScreenBorders }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _get_attenuateIntersectionDistance_decorators, { kind: "getter", name: "attenuateIntersectionDistance", static: false, private: false, access: { has: obj => "attenuateIntersectionDistance" in obj, get: obj => obj.attenuateIntersectionDistance }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _get_attenuateIntersectionIterations_decorators, { kind: "getter", name: "attenuateIntersectionIterations", static: false, private: false, access: { has: obj => "attenuateIntersectionIterations" in obj, get: obj => obj.attenuateIntersectionIterations }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _get_attenuateFacingCamera_decorators, { kind: "getter", name: "attenuateFacingCamera", static: false, private: false, access: { has: obj => "attenuateFacingCamera" in obj, get: obj => obj.attenuateFacingCamera }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _get_attenuateBackfaceReflection_decorators, { kind: "getter", name: "attenuateBackfaceReflection", static: false, private: false, access: { has: obj => "attenuateBackfaceReflection" in obj, get: obj => obj.attenuateBackfaceReflection }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _get_inputTextureColorIsInGammaSpace_decorators, { kind: "getter", name: "inputTextureColorIsInGammaSpace", static: false, private: false, access: { has: obj => "inputTextureColorIsInGammaSpace" in obj, get: obj => obj.inputTextureColorIsInGammaSpace }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _get_generateOutputInGammaSpace_decorators, { kind: "getter", name: "generateOutputInGammaSpace", static: false, private: false, access: { has: obj => "generateOutputInGammaSpace" in obj, get: obj => obj.generateOutputInGammaSpace }, metadata: _metadata }, null, _instanceExtraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
export { NodeRenderGraphSSRPostProcessBlock };
let _Registered = false;
/**
 * Register side effects for ssrPostProcessBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterSsrPostProcessBlock() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    RegisterClass("BABYLON.NodeRenderGraphSSRPostProcessBlock", NodeRenderGraphSSRPostProcessBlock);
}
//# sourceMappingURL=ssrPostProcessBlock.pure.js.map