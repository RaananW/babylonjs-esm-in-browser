/** This file must only contain pure code and pure imports */
import { __esDecorate, __runInitializers } from "../../../tslib.es6.js";
import { serialize } from "../../../Misc/decorators.js";
import { SerializationHelper } from "../../../Misc/decorators.serialization.js";
import { PostProcess } from "../../postProcess.pure.js";
import { PostProcessRenderPipeline } from "../postProcessRenderPipeline.js";
import { PostProcessRenderEffect } from "../postProcessRenderEffect.js";
import { ScreenSpaceReflections2Configuration } from "../../../Rendering/screenSpaceReflections2Configuration.js";
import { PrePassRenderer } from "../../../Rendering/prePassRenderer.pure.js";
import { GeometryBufferRenderer } from "../../../Rendering/geometryBufferRenderer.pure.js";

import { DepthRenderer } from "../../../Rendering/depthRenderer.pure.js";
import { ThinSSRRenderingPipeline } from "./thinSSRRenderingPipeline.js";
import { ThinSSRPostProcess } from "../../thinSSRPostProcess.js";
import { RegisterPrePassRendererSceneComponent } from "../../../Rendering/prePassRendererSceneComponent.pure.js";
import { RegisterGeometryBufferRendererSceneComponent } from "../../../Rendering/geometryBufferRendererSceneComponent.pure.js";
import { ThinSSRBlurPostProcess } from "../../thinSSRBlurPostProcess.js";
import { ThinSSRBlurCombinerPostProcess } from "../../thinSSRBlurCombinerPostProcess.js";
import { RegisterClass } from "../../../Misc/typeStore.js";
/* eslint-disable @typescript-eslint/naming-convention */
/**
 * Render pipeline to produce Screen Space Reflections (SSR) effect
 *
 * References:
 *   Screen Space Ray Tracing:
 *     - http://casual-effects.blogspot.com/2014/08/screen-space-ray-tracing.html
 *     - https://sourceforge.net/p/g3d/code/HEAD/tree/G3D10/data-files/shader/screenSpaceRayTrace.glsl
 *     - https://github.com/kode80/kode80SSR
 *   SSR:
 *     - general tips: https://sakibsaikia.github.io/graphics/2016/12/26/Screen-Space-Reflection-in-Killing-Floor-2.html
 *     - computation of blur radius from roughness and distance: https://github.com/godotengine/godot/blob/master/servers/rendering/renderer_rd/shaders/effects/screen_space_reflection.glsl
 *     - blur and usage of back depth buffer: https://github.com/kode80/kode80SSR
 */
let SSRRenderingPipeline = (() => {
    var _a;
    let _classSuper = PostProcessRenderPipeline;
    let _instanceExtraInitializers = [];
    let _get_samples_decorators;
    let _get_maxDistance_decorators;
    let _get_step_decorators;
    let _get_thickness_decorators;
    let _get_strength_decorators;
    let _get_reflectionSpecularFalloffExponent_decorators;
    let _get_maxSteps_decorators;
    let _get_roughnessFactor_decorators;
    let _get_selfCollisionNumSkip_decorators;
    let _get_reflectivityThreshold_decorators;
    let _get_ssrDownsample_decorators;
    let _get_blurDispersionStrength_decorators;
    let _get_blurDownsample_decorators;
    let _get_enableSmoothReflections_decorators;
    let _get_environmentTexture_decorators;
    let _get_environmentTextureIsProbe_decorators;
    let _get_attenuateScreenBorders_decorators;
    let _get_attenuateIntersectionDistance_decorators;
    let _get_attenuateIntersectionIterations_decorators;
    let _get_attenuateFacingCamera_decorators;
    let _get_attenuateBackfaceReflection_decorators;
    let _get_clipToFrustum_decorators;
    let _get_useFresnel_decorators;
    let _get_enableAutomaticThicknessComputation_decorators;
    let __backfaceDepthTextureDownsample_decorators;
    let __backfaceDepthTextureDownsample_initializers = [];
    let __backfaceDepthTextureDownsample_extraInitializers = [];
    let __backfaceForceDepthWriteTransparentMeshes_decorators;
    let __backfaceForceDepthWriteTransparentMeshes_initializers = [];
    let __backfaceForceDepthWriteTransparentMeshes_extraInitializers = [];
    let __isEnabled_decorators;
    let __isEnabled_initializers = [];
    let __isEnabled_extraInitializers = [];
    let _get_inputTextureColorIsInGammaSpace_decorators;
    let _get_generateOutputInGammaSpace_decorators;
    let _get_debug_decorators;
    return _a = class SSRRenderingPipeline extends _classSuper {
            /**
             * MSAA sample count, setting this to 4 will provide 4x anti aliasing. (default: 1)
             */
            set samples(sampleCount) {
                if (this._samples === sampleCount) {
                    return;
                }
                this._samples = sampleCount;
                if (this._ssrPostProcess) {
                    this._ssrPostProcess.samples = this.samples;
                }
            }
            get samples() {
                return this._samples;
            }
            /**
             * Gets or sets the maxDistance used to define how far we look for reflection during the ray-marching on the reflected ray (default: 1000).
             * Note that this value is a view (camera) space distance (not pixels!).
             */
            get maxDistance() {
                return this._thinSSRRenderingPipeline.maxDistance;
            }
            set maxDistance(distance) {
                this._thinSSRRenderingPipeline.maxDistance = distance;
            }
            /**
             * Gets or sets the step size used to iterate until the effect finds the color of the reflection's pixel. Should be an integer \>= 1 as it is the number of pixels we advance at each step (default: 1).
             * Use higher values to improve performances (but at the expense of quality).
             */
            get step() {
                return this._thinSSRRenderingPipeline.step;
            }
            set step(step) {
                this._thinSSRRenderingPipeline.step = step;
            }
            /**
             * Gets or sets the thickness value used as tolerance when computing the intersection between the reflected ray and the scene (default: 0.5).
             * If setting "enableAutomaticThicknessComputation" to true, you can use lower values for "thickness" (even 0), as the geometry thickness
             * is automatically computed thank to the regular depth buffer + the backface depth buffer
             */
            get thickness() {
                return this._thinSSRRenderingPipeline.thickness;
            }
            set thickness(thickness) {
                this._thinSSRRenderingPipeline.thickness = thickness;
            }
            /**
             * Gets or sets the current reflection strength. 1.0 is an ideal value but can be increased/decreased for particular results (default: 1).
             */
            get strength() {
                return this._thinSSRRenderingPipeline.strength;
            }
            set strength(strength) {
                this._thinSSRRenderingPipeline.strength = strength;
            }
            /**
             * Gets or sets the falloff exponent used to compute the reflection strength. Higher values lead to fainter reflections (default: 1).
             */
            get reflectionSpecularFalloffExponent() {
                return this._thinSSRRenderingPipeline.reflectionSpecularFalloffExponent;
            }
            set reflectionSpecularFalloffExponent(exponent) {
                this._thinSSRRenderingPipeline.reflectionSpecularFalloffExponent = exponent;
            }
            /**
             * Maximum number of steps during the ray marching process after which we consider an intersection could not be found (default: 1000).
             * Should be an integer value.
             */
            get maxSteps() {
                return this._thinSSRRenderingPipeline.maxSteps;
            }
            set maxSteps(steps) {
                this._thinSSRRenderingPipeline.maxSteps = steps;
            }
            /**
             * Gets or sets the factor applied when computing roughness. Default value is 0.2.
             * When blurring based on roughness is enabled (meaning blurDispersionStrength \> 0), roughnessFactor is used as a global roughness factor applied on all objects.
             * If you want to disable this global roughness set it to 0.
             */
            get roughnessFactor() {
                return this._thinSSRRenderingPipeline.roughnessFactor;
            }
            set roughnessFactor(factor) {
                this._thinSSRRenderingPipeline.roughnessFactor = factor;
            }
            /**
             * Number of steps to skip at start when marching the ray to avoid self collisions (default: 1)
             * 1 should normally be a good value, depending on the scene you may need to use a higher value (2 or 3)
             */
            get selfCollisionNumSkip() {
                return this._thinSSRRenderingPipeline.selfCollisionNumSkip;
            }
            set selfCollisionNumSkip(skip) {
                this._thinSSRRenderingPipeline.selfCollisionNumSkip = skip;
            }
            /**
             * Gets or sets the minimum value for one of the reflectivity component of the material to consider it for SSR (default: 0.04).
             * If all r/g/b components of the reflectivity is below or equal this value, the pixel will not be considered reflective and SSR won't be applied.
             */
            get reflectivityThreshold() {
                return this._thinSSRRenderingPipeline.reflectivityThreshold;
            }
            set reflectivityThreshold(threshold) {
                const currentThreshold = this.reflectivityThreshold;
                if (threshold === currentThreshold) {
                    return;
                }
                this._thinSSRRenderingPipeline.reflectivityThreshold = threshold;
                if ((threshold === 0 && currentThreshold !== 0) || (threshold !== 0 && currentThreshold === 0)) {
                    this._buildPipeline();
                }
            }
            /**
             * Gets or sets the downsample factor used to reduce the size of the texture used to compute the SSR contribution (default: 0).
             * Use 0 to render the SSR contribution at full resolution, 1 to render at half resolution, 2 to render at 1/3 resolution, etc.
             * Note that it is used only when blurring is enabled (blurDispersionStrength \> 0), because in that mode the SSR contribution is generated in a separate texture.
             */
            get ssrDownsample() {
                return this._thinSSRRenderingPipeline.ssrDownsample;
            }
            set ssrDownsample(downsample) {
                this._thinSSRRenderingPipeline.ssrDownsample = downsample;
                this._buildPipeline();
            }
            /**
             * Gets or sets the blur dispersion strength. Set this value to 0 to disable blurring (default: 0.03)
             * The reflections are blurred based on the roughness of the surface and the distance between the pixel shaded and the reflected pixel: the higher the distance the more blurry the reflection is.
             * blurDispersionStrength allows to increase or decrease this effect.
             */
            get blurDispersionStrength() {
                return this._thinSSRRenderingPipeline.blurDispersionStrength;
            }
            set blurDispersionStrength(strength) {
                const currentStrength = this.blurDispersionStrength;
                if (strength === currentStrength) {
                    return;
                }
                this._thinSSRRenderingPipeline.blurDispersionStrength = strength;
                if ((strength === 0 && currentStrength !== 0) || (strength !== 0 && currentStrength === 0)) {
                    this._buildPipeline();
                }
            }
            _useBlur() {
                return this.blurDispersionStrength > 0;
            }
            /**
             * Gets or sets the downsample factor used to reduce the size of the textures used to blur the reflection effect (default: 0).
             * Use 0 to blur at full resolution, 1 to render at half resolution, 2 to render at 1/3 resolution, etc.
             */
            get blurDownsample() {
                return this._thinSSRRenderingPipeline.blurDownsample;
            }
            set blurDownsample(downsample) {
                this._thinSSRRenderingPipeline.blurDownsample = downsample;
                this._buildPipeline();
            }
            /**
             * Gets or sets whether or not smoothing reflections is enabled (default: false)
             * Enabling smoothing will require more GPU power.
             * Note that this setting has no effect if step = 1: it's only used if step \> 1.
             */
            get enableSmoothReflections() {
                return this._thinSSRRenderingPipeline.enableSmoothReflections;
            }
            set enableSmoothReflections(enabled) {
                this._thinSSRRenderingPipeline.enableSmoothReflections = enabled;
            }
            get _useScreenspaceDepth() {
                return this._thinSSRRenderingPipeline.useScreenspaceDepth;
            }
            /**
             * Gets or sets the environment cube texture used to define the reflection when the reflected rays of SSR leave the view space or when the maxDistance/maxSteps is reached.
             */
            get environmentTexture() {
                return this._thinSSRRenderingPipeline.environmentTexture;
            }
            set environmentTexture(texture) {
                this._thinSSRRenderingPipeline.environmentTexture = texture;
            }
            /**
             * Gets or sets the boolean defining if the environment texture is a standard cubemap (false) or a probe (true). Default value is false.
             * Note: a probe cube texture is treated differently than an ordinary cube texture because the Y axis is reversed.
             */
            get environmentTextureIsProbe() {
                return this._thinSSRRenderingPipeline.environmentTextureIsProbe;
            }
            set environmentTextureIsProbe(isProbe) {
                this._thinSSRRenderingPipeline.environmentTextureIsProbe = isProbe;
            }
            /**
             * Gets or sets a boolean indicating if the reflections should be attenuated at the screen borders (default: true).
             */
            get attenuateScreenBorders() {
                return this._thinSSRRenderingPipeline.attenuateScreenBorders;
            }
            set attenuateScreenBorders(attenuate) {
                this._thinSSRRenderingPipeline.attenuateScreenBorders = attenuate;
            }
            /**
             * Gets or sets a boolean indicating if the reflections should be attenuated according to the distance of the intersection (default: true).
             */
            get attenuateIntersectionDistance() {
                return this._thinSSRRenderingPipeline.attenuateIntersectionDistance;
            }
            set attenuateIntersectionDistance(attenuate) {
                this._thinSSRRenderingPipeline.attenuateIntersectionDistance = attenuate;
            }
            /**
             * Gets or sets a boolean indicating if the reflections should be attenuated according to the number of iterations performed to find the intersection (default: true).
             */
            get attenuateIntersectionIterations() {
                return this._thinSSRRenderingPipeline.attenuateIntersectionIterations;
            }
            set attenuateIntersectionIterations(attenuate) {
                this._thinSSRRenderingPipeline.attenuateIntersectionIterations = attenuate;
            }
            /**
             * Gets or sets a boolean indicating if the reflections should be attenuated when the reflection ray is facing the camera (the view direction) (default: false).
             */
            get attenuateFacingCamera() {
                return this._thinSSRRenderingPipeline.attenuateFacingCamera;
            }
            set attenuateFacingCamera(attenuate) {
                this._thinSSRRenderingPipeline.attenuateFacingCamera = attenuate;
            }
            /**
             * Gets or sets a boolean indicating if the backface reflections should be attenuated (default: false).
             */
            get attenuateBackfaceReflection() {
                return this._thinSSRRenderingPipeline.attenuateBackfaceReflection;
            }
            set attenuateBackfaceReflection(attenuate) {
                this._thinSSRRenderingPipeline.attenuateBackfaceReflection = attenuate;
            }
            /**
             * Gets or sets a boolean indicating if the ray should be clipped to the frustum (default: true).
             * You can try to set this parameter to false to save some performances: it may produce some artefacts in some cases, but generally they won't really be visible
             */
            get clipToFrustum() {
                return this._thinSSRRenderingPipeline.clipToFrustum;
            }
            set clipToFrustum(clip) {
                this._thinSSRRenderingPipeline.clipToFrustum = clip;
            }
            /**
             * Gets or sets a boolean indicating whether the blending between the current color pixel and the reflection color should be done with a Fresnel coefficient (default: false).
             * It is more physically accurate to use the Fresnel coefficient (otherwise it uses the reflectivity of the material for blending), but it is also more expensive when you use blur (when blurDispersionStrength \> 0).
             */
            get useFresnel() {
                return this._thinSSRRenderingPipeline.useFresnel;
            }
            set useFresnel(fresnel) {
                this._thinSSRRenderingPipeline.useFresnel = fresnel;
                this._buildPipeline();
            }
            /**
             * Gets or sets a boolean defining if geometry thickness should be computed automatically (default: false).
             * When enabled, a depth renderer is created which will render the back faces of the scene to a depth texture (meaning additional work for the GPU).
             * In that mode, the "thickness" property is still used as an offset to compute the ray intersection, but you can typically use a much lower
             * value than when enableAutomaticThicknessComputation is false (it's even possible to use a value of 0 when using low values for "step")
             * Note that for performance reasons, this option will only apply to the first camera to which the rendering pipeline is attached!
             */
            get enableAutomaticThicknessComputation() {
                return this._thinSSRRenderingPipeline.enableAutomaticThicknessComputation;
            }
            set enableAutomaticThicknessComputation(automatic) {
                this._thinSSRRenderingPipeline.enableAutomaticThicknessComputation = automatic;
                this._buildPipeline();
            }
            /**
             * Gets the depth renderer used to render the back faces of the scene to a depth texture.
             */
            get backfaceDepthRenderer() {
                return this._depthRenderer;
            }
            /**
             * Gets or sets the downsample factor (default: 0) used to create the backface depth texture - used only if enableAutomaticThicknessComputation = true.
             * Use 0 to render the depth at full resolution, 1 to render at half resolution, 2 to render at 1/4 resolution, etc.
             * Note that you will get rendering artefacts when using a value different from 0: it's a tradeoff between image quality and performances.
             */
            get backfaceDepthTextureDownsample() {
                return this._backfaceDepthTextureDownsample;
            }
            set backfaceDepthTextureDownsample(factor) {
                if (this._backfaceDepthTextureDownsample === factor) {
                    return;
                }
                this._backfaceDepthTextureDownsample = factor;
                this._resizeDepthRenderer();
            }
            /**
             * Gets or sets a boolean (default: true) indicating if the depth of transparent meshes should be written to the backface depth texture (when automatic thickness computation is enabled).
             */
            get backfaceForceDepthWriteTransparentMeshes() {
                return this._backfaceForceDepthWriteTransparentMeshes;
            }
            set backfaceForceDepthWriteTransparentMeshes(force) {
                if (this._backfaceForceDepthWriteTransparentMeshes === force) {
                    return;
                }
                this._backfaceForceDepthWriteTransparentMeshes = force;
                if (this._depthRenderer) {
                    this._depthRenderer.forceDepthWriteTransparentMeshes = force;
                }
            }
            /**
             * Gets or sets a boolean indicating if the effect is enabled (default: true).
             */
            get isEnabled() {
                return this._isEnabled;
            }
            set isEnabled(value) {
                if (this._isEnabled === value) {
                    return;
                }
                this._isEnabled = value;
                if (!value) {
                    if (this._cameras !== null) {
                        this._scene.postProcessRenderPipelineManager.detachCamerasFromRenderPipeline(this._name, this._cameras);
                        this._cameras = this._camerasToBeAttached.slice();
                    }
                }
                else if (value) {
                    if (!this._isDirty) {
                        if (this._cameras !== null) {
                            this._scene.postProcessRenderPipelineManager.attachCamerasToRenderPipeline(this._name, this._cameras);
                        }
                    }
                    else {
                        this._buildPipeline();
                    }
                }
            }
            /**
             * Gets or sets a boolean defining if the input color texture is in gamma space (default: true)
             * The SSR effect works in linear space, so if the input texture is in gamma space, we must convert the texture to linear space before applying the effect
             */
            get inputTextureColorIsInGammaSpace() {
                return this._thinSSRRenderingPipeline.inputTextureColorIsInGammaSpace;
            }
            set inputTextureColorIsInGammaSpace(gammaSpace) {
                this._thinSSRRenderingPipeline.inputTextureColorIsInGammaSpace = gammaSpace;
                this._buildPipeline();
            }
            /**
             * Gets or sets a boolean defining if the output color texture generated by the SSR pipeline should be in gamma space (default: true)
             * If you have a post-process that comes after the SSR and that post-process needs the input to be in a linear space, you must disable generateOutputInGammaSpace
             */
            get generateOutputInGammaSpace() {
                return this._thinSSRRenderingPipeline.generateOutputInGammaSpace;
            }
            set generateOutputInGammaSpace(gammaSpace) {
                this._thinSSRRenderingPipeline.generateOutputInGammaSpace = gammaSpace;
                this._buildPipeline();
            }
            /**
             * Gets or sets a boolean indicating if the effect should be rendered in debug mode (default: false).
             * In this mode, colors have this meaning:
             *   - blue: the ray hit the max distance (we reached maxDistance)
             *   - red: the ray ran out of steps (we reached maxSteps)
             *   - yellow: the ray went off screen
             *   - green: the ray hit a surface. The brightness of the green color is proportional to the distance between the ray origin and the intersection point: A brighter green means more computation than a darker green.
             * In the first 3 cases, the final color is calculated by mixing the skybox color with the pixel color (if environmentTexture is defined), otherwise the pixel color is not modified
             * You should try to get as few blue/red/yellow pixels as possible, as this means that the ray has gone further than if it had hit a surface.
             */
            get debug() {
                return this._thinSSRRenderingPipeline.debug;
            }
            set debug(value) {
                this._thinSSRRenderingPipeline.debug = value;
                this._buildPipeline();
            }
            /**
             * Checks if all the post processes in the pipeline are ready.
             * @returns True if all the post processes in the pipeline are ready
             */
            isReady() {
                return this._thinSSRRenderingPipeline.isReady();
            }
            /**
             * Gets the scene the effect belongs to.
             * @returns the scene the effect belongs to.
             */
            getScene() {
                return this._scene;
            }
            get _geometryBufferRenderer() {
                if (!this._forceGeometryBuffer) {
                    return null;
                }
                return this._scene.geometryBufferRenderer;
            }
            get _prePassRenderer() {
                if (this._forceGeometryBuffer) {
                    return null;
                }
                return this._scene.prePassRenderer;
            }
            /**
             * Gets active scene
             */
            get scene() {
                return this._scene;
            }
            /**
             * Returns true if SSR is supported by the running hardware
             */
            get isSupported() {
                const caps = this._scene.getEngine().getCaps();
                return caps.drawBuffersExtension && caps.texelFetch;
            }
            /**
             * Constructor of the SSR rendering pipeline
             * @param name The rendering pipeline name
             * @param scene The scene linked to this pipeline
             * @param cameras The array of cameras that the rendering pipeline will be attached to (default: scene.cameras)
             * @param forceGeometryBuffer Set to true if you want to use the legacy geometry buffer renderer (default: false)
             * @param textureType The texture type used by the different post processes created by SSR (default: 0)
             * @param useScreenspaceDepth Indicates if the depth buffer should be linear or screenspace (default: false). This allows sharing the buffer with other effect pipelines that may require the depth to be in screenspace.
             */
            constructor(name, scene, cameras, forceGeometryBuffer = false, textureType = 0, useScreenspaceDepth = false) {
                RegisterPrePassRendererSceneComponent(PrePassRenderer);
                RegisterGeometryBufferRendererSceneComponent(GeometryBufferRenderer);
                super(scene.getEngine(), name);
                /**
                 * The SSR PostProcess effect id in the pipeline
                 */
                this.SSRRenderEffect = (__runInitializers(this, _instanceExtraInitializers), "SSRRenderEffect");
                /**
                 * The blur PostProcess effect id in the pipeline
                 */
                this.SSRBlurRenderEffect = "SSRBlurRenderEffect";
                /**
                 * The PostProcess effect id in the pipeline that combines the SSR-Blur output with the original scene color
                 */
                this.SSRCombineRenderEffect = "SSRCombineRenderEffect";
                this._samples = 1;
                this._backfaceDepthTextureDownsample = __runInitializers(this, __backfaceDepthTextureDownsample_initializers, 0);
                this._backfaceForceDepthWriteTransparentMeshes = (__runInitializers(this, __backfaceDepthTextureDownsample_extraInitializers), __runInitializers(this, __backfaceForceDepthWriteTransparentMeshes_initializers, true));
                this._isEnabled = (__runInitializers(this, __backfaceForceDepthWriteTransparentMeshes_extraInitializers), __runInitializers(this, __isEnabled_initializers, true));
                this._forceGeometryBuffer = (__runInitializers(this, __isEnabled_extraInitializers), false);
                this._isDirty = false;
                this._camerasToBeAttached = [];
                this._thinSSRRenderingPipeline = new ThinSSRRenderingPipeline(name, scene);
                this._thinSSRRenderingPipeline.isSSRSupported = false;
                this._thinSSRRenderingPipeline.useScreenspaceDepth = useScreenspaceDepth;
                this._cameras = cameras || scene.cameras;
                this._cameras = this._cameras.slice();
                this._camerasToBeAttached = this._cameras.slice();
                this._scene = scene;
                this._textureType = textureType;
                this._forceGeometryBuffer = forceGeometryBuffer;
                if (this.isSupported) {
                    this._createSSRPostProcess();
                    scene.postProcessRenderPipelineManager.addPipeline(this);
                    if (this._forceGeometryBuffer) {
                        const geometryBufferRenderer = scene.enableGeometryBufferRenderer();
                        if (geometryBufferRenderer) {
                            geometryBufferRenderer.enableReflectivity = true;
                            geometryBufferRenderer.useSpecificClearForDepthTexture = true;
                            geometryBufferRenderer.enableScreenspaceDepth = this._useScreenspaceDepth;
                            geometryBufferRenderer.enableDepth = !this._useScreenspaceDepth;
                        }
                    }
                    else {
                        const prePassRenderer = scene.enablePrePassRenderer();
                        if (prePassRenderer) {
                            prePassRenderer.useSpecificClearForDepthTexture = true;
                            prePassRenderer.markAsDirty();
                        }
                    }
                    this._thinSSRRenderingPipeline.isSSRSupported = !!this._geometryBufferRenderer || !!this._prePassRenderer;
                    this._buildPipeline();
                }
            }
            /**
             * Get the class name
             * @returns "SSRRenderingPipeline"
             */
            getClassName() {
                return "SSRRenderingPipeline";
            }
            /**
             * Adds a camera to the pipeline
             * @param camera the camera to be added
             */
            addCamera(camera) {
                this._camerasToBeAttached.push(camera);
                this._buildPipeline();
            }
            /**
             * Removes a camera from the pipeline
             * @param camera the camera to remove
             */
            removeCamera(camera) {
                const index = this._camerasToBeAttached.indexOf(camera);
                this._camerasToBeAttached.splice(index, 1);
                this._buildPipeline();
            }
            /**
             * Removes the internal pipeline assets and detaches the pipeline from the scene cameras
             * @param disableGeometryBufferRenderer if the geometry buffer renderer should be disabled
             */
            dispose(disableGeometryBufferRenderer = false) {
                this._disposeDepthRenderer();
                this._disposeSSRPostProcess();
                this._disposeBlurPostProcesses();
                if (disableGeometryBufferRenderer) {
                    this._scene.disableGeometryBufferRenderer();
                }
                this._scene.postProcessRenderPipelineManager.detachCamerasFromRenderPipeline(this._name, this._cameras);
                this._scene.postProcessRenderPipelineManager.removePipeline(this._name);
                this._thinSSRRenderingPipeline.dispose();
                super.dispose();
            }
            _getTextureSize() {
                const engine = this._scene.getEngine();
                const prePassRenderer = this._prePassRenderer;
                let textureSize = { width: engine.getRenderWidth(), height: engine.getRenderHeight() };
                if (prePassRenderer && this._scene.activeCamera?._getFirstPostProcess() === this._ssrPostProcess) {
                    const renderTarget = prePassRenderer.getRenderTarget();
                    if (renderTarget && renderTarget.textures) {
                        textureSize = renderTarget.textures[prePassRenderer.getIndex(4)].getSize();
                    }
                }
                else if (this._ssrPostProcess?.inputTexture) {
                    textureSize.width = this._ssrPostProcess.inputTexture.width;
                    textureSize.height = this._ssrPostProcess.inputTexture.height;
                }
                return textureSize;
            }
            _buildPipeline() {
                if (!this.isSupported) {
                    return;
                }
                if (!this._isEnabled) {
                    this._isDirty = true;
                    return;
                }
                this._isDirty = false;
                const engine = this._scene.getEngine();
                this._disposeDepthRenderer();
                if (this._cameras !== null) {
                    this._scene.postProcessRenderPipelineManager.detachCamerasFromRenderPipeline(this._name, this._cameras);
                    // get back cameras to be used to reattach pipeline
                    this._cameras = this._camerasToBeAttached.slice();
                    if (this._cameras.length > 0) {
                        this._thinSSRRenderingPipeline.camera = this._cameras[0];
                    }
                }
                this._reset();
                this._thinSSRRenderingPipeline.normalsAreInWorldSpace = !!(this._geometryBufferRenderer?.generateNormalsInWorldSpace ?? this._prePassRenderer?.generateNormalsInWorldSpace);
                if (this.enableAutomaticThicknessComputation) {
                    const camera = this._cameras?.[0];
                    if (camera) {
                        this._depthRendererCamera = camera;
                        this._depthRenderer = new DepthRenderer(this._scene, undefined, undefined, this._useScreenspaceDepth, 1, !this._useScreenspaceDepth, "SSRBackDepth");
                        this._depthRenderer.reverseCulling = true; // we generate depth for the back faces
                        this._depthRenderer.forceDepthWriteTransparentMeshes = this.backfaceForceDepthWriteTransparentMeshes;
                        this._resizeDepthRenderer();
                        camera.customRenderTargets.push(this._depthRenderer.getDepthMap());
                    }
                }
                this.addEffect(new PostProcessRenderEffect(engine, this.SSRRenderEffect, () => {
                    return this._ssrPostProcess;
                }, true));
                this._disposeBlurPostProcesses();
                if (this._useBlur()) {
                    this._createBlurAndCombinerPostProcesses();
                    this.addEffect(new PostProcessRenderEffect(engine, this.SSRBlurRenderEffect, () => {
                        return [this._blurPostProcessX, this._blurPostProcessY];
                    }, true));
                    this.addEffect(new PostProcessRenderEffect(engine, this.SSRCombineRenderEffect, () => {
                        return this._blurCombinerPostProcess;
                    }, true));
                }
                if (this._cameras !== null) {
                    this._scene.postProcessRenderPipelineManager.attachCamerasToRenderPipeline(this._name, this._cameras);
                }
            }
            _resizeDepthRenderer() {
                if (!this._depthRenderer) {
                    return;
                }
                const textureSize = this._getTextureSize();
                const depthRendererSize = this._depthRenderer.getDepthMap().getSize();
                const width = Math.floor(textureSize.width / (this.backfaceDepthTextureDownsample + 1));
                const height = Math.floor(textureSize.height / (this.backfaceDepthTextureDownsample + 1));
                if (depthRendererSize.width !== width || depthRendererSize.height !== height) {
                    this._depthRenderer.getDepthMap().resize({ width, height });
                }
            }
            _disposeDepthRenderer() {
                if (this._depthRenderer) {
                    if (this._depthRendererCamera) {
                        const idx = this._depthRendererCamera.customRenderTargets.indexOf(this._depthRenderer.getDepthMap()) ?? -1;
                        if (idx !== -1) {
                            this._depthRendererCamera.customRenderTargets.splice(idx, 1);
                        }
                    }
                    this._depthRendererCamera = null;
                    this._depthRenderer.getDepthMap().dispose();
                }
                this._depthRenderer = null;
            }
            _disposeBlurPostProcesses() {
                for (let i = 0; i < this._cameras.length; i++) {
                    const camera = this._cameras[i];
                    this._blurPostProcessX?.dispose(camera);
                    this._blurPostProcessY?.dispose(camera);
                    this._blurCombinerPostProcess?.dispose(camera);
                }
                this._blurPostProcessX = null;
                this._blurPostProcessY = null;
                this._blurCombinerPostProcess = null;
            }
            _disposeSSRPostProcess() {
                for (let i = 0; i < this._cameras.length; i++) {
                    const camera = this._cameras[i];
                    this._ssrPostProcess?.dispose(camera);
                }
                this._ssrPostProcess = null;
            }
            _createSSRPostProcess() {
                this._ssrPostProcess = new PostProcess("ssr", ThinSSRPostProcess.FragmentUrl, {
                    uniformNames: ThinSSRPostProcess.Uniforms,
                    samplerNames: ThinSSRPostProcess.Samplers,
                    size: 1.0,
                    samplingMode: 2,
                    engine: this._scene.getEngine(),
                    textureType: this._textureType,
                    effectWrapper: this._thinSSRRenderingPipeline._ssrPostProcess,
                });
                this._ssrPostProcess.onApply = (effect) => {
                    this._resizeDepthRenderer();
                    const geometryBufferRenderer = this._geometryBufferRenderer;
                    const prePassRenderer = this._prePassRenderer;
                    if (!prePassRenderer && !geometryBufferRenderer) {
                        return;
                    }
                    if (geometryBufferRenderer) {
                        const roughnessIndex = geometryBufferRenderer.getTextureIndex(GeometryBufferRenderer.REFLECTIVITY_TEXTURE_TYPE);
                        const normalIndex = geometryBufferRenderer.getTextureIndex(GeometryBufferRenderer.NORMAL_TEXTURE_TYPE);
                        effect.setTexture("normalSampler", geometryBufferRenderer.getGBuffer().textures[normalIndex]);
                        effect.setTexture("reflectivitySampler", geometryBufferRenderer.getGBuffer().textures[roughnessIndex]);
                        if (this._useScreenspaceDepth) {
                            const depthIndex = geometryBufferRenderer.getTextureIndex(GeometryBufferRenderer.SCREENSPACE_DEPTH_TEXTURE_TYPE);
                            effect.setTexture("depthSampler", geometryBufferRenderer.getGBuffer().textures[depthIndex]);
                        }
                        else {
                            const depthIndex = geometryBufferRenderer.getTextureIndex(GeometryBufferRenderer.DEPTH_TEXTURE_TYPE);
                            effect.setTexture("depthSampler", geometryBufferRenderer.getGBuffer().textures[depthIndex]);
                        }
                    }
                    else if (prePassRenderer) {
                        const depthIndex = prePassRenderer.getIndex(this._useScreenspaceDepth ? 10 : 5);
                        const roughnessIndex = prePassRenderer.getIndex(3);
                        const normalIndex = prePassRenderer.getIndex(6);
                        effect.setTexture("normalSampler", prePassRenderer.getRenderTarget().textures[normalIndex]);
                        effect.setTexture("depthSampler", prePassRenderer.getRenderTarget().textures[depthIndex]);
                        effect.setTexture("reflectivitySampler", prePassRenderer.getRenderTarget().textures[roughnessIndex]);
                    }
                    if (this.enableAutomaticThicknessComputation && this._depthRenderer) {
                        effect.setTexture("backDepthSampler", this._depthRenderer.getDepthMap());
                        effect.setFloat("backSizeFactor", this.backfaceDepthTextureDownsample + 1);
                    }
                    const textureSize = this._getTextureSize();
                    this._thinSSRRenderingPipeline._ssrPostProcess.textureWidth = textureSize.width;
                    this._thinSSRRenderingPipeline._ssrPostProcess.textureHeight = textureSize.height;
                };
                this._ssrPostProcess.samples = this.samples;
                if (!this._forceGeometryBuffer) {
                    this._ssrPostProcess._prePassEffectConfiguration = new ScreenSpaceReflections2Configuration(this._useScreenspaceDepth);
                }
            }
            _createBlurAndCombinerPostProcesses() {
                const engine = this._scene.getEngine();
                this._blurPostProcessX = new PostProcess("SSRblurX", ThinSSRBlurPostProcess.FragmentUrl, {
                    uniformNames: ThinSSRBlurPostProcess.Uniforms,
                    samplerNames: ThinSSRBlurPostProcess.Samplers,
                    size: 1 / (this.ssrDownsample + 1),
                    samplingMode: 2,
                    engine,
                    textureType: this._textureType,
                    effectWrapper: this._thinSSRRenderingPipeline._ssrBlurXPostProcess,
                });
                this._blurPostProcessX.autoClear = false;
                this._blurPostProcessX.onApplyObservable.add(() => {
                    this._thinSSRRenderingPipeline._ssrBlurXPostProcess.textureWidth = this._blurPostProcessX?.inputTexture.width ?? this._scene.getEngine().getRenderWidth();
                    this._thinSSRRenderingPipeline._ssrBlurXPostProcess.textureHeight = 1; // not used
                });
                this._blurPostProcessY = new PostProcess("SSRblurY", ThinSSRBlurPostProcess.FragmentUrl, {
                    uniformNames: ThinSSRBlurPostProcess.Uniforms,
                    samplerNames: ThinSSRBlurPostProcess.Samplers,
                    size: 1 / (this.blurDownsample + 1),
                    samplingMode: 2,
                    engine,
                    textureType: this._textureType,
                    effectWrapper: this._thinSSRRenderingPipeline._ssrBlurYPostProcess,
                });
                this._blurPostProcessY.autoClear = false;
                this._blurPostProcessY.onApplyObservable.add(() => {
                    this._thinSSRRenderingPipeline._ssrBlurYPostProcess.textureWidth = 1; // not used
                    this._thinSSRRenderingPipeline._ssrBlurYPostProcess.textureHeight = this._blurPostProcessY?.inputTexture.height ?? this._scene.getEngine().getRenderHeight();
                });
                this._blurCombinerPostProcess = new PostProcess("SSRblurCombiner", ThinSSRBlurCombinerPostProcess.FragmentUrl, {
                    uniformNames: ThinSSRBlurCombinerPostProcess.Uniforms,
                    samplerNames: ThinSSRBlurCombinerPostProcess.Samplers,
                    size: 1 / (this.blurDownsample + 1),
                    samplingMode: 1,
                    engine,
                    textureType: this._textureType,
                    effectWrapper: this._thinSSRRenderingPipeline._ssrBlurCombinerPostProcess,
                });
                this._blurCombinerPostProcess.autoClear = false;
                this._blurCombinerPostProcess.onApplyObservable.add((effect) => {
                    const geometryBufferRenderer = this._geometryBufferRenderer;
                    const prePassRenderer = this._prePassRenderer;
                    if (!prePassRenderer && !geometryBufferRenderer) {
                        return;
                    }
                    if (prePassRenderer && this._scene.activeCamera?._getFirstPostProcess() === this._ssrPostProcess) {
                        const renderTarget = prePassRenderer.getRenderTarget();
                        if (renderTarget && renderTarget.textures) {
                            effect.setTexture("mainSampler", renderTarget.textures[prePassRenderer.getIndex(4)]);
                        }
                    }
                    else {
                        effect.setTextureFromPostProcess("mainSampler", this._ssrPostProcess);
                    }
                    if (geometryBufferRenderer) {
                        const roughnessIndex = geometryBufferRenderer.getTextureIndex(GeometryBufferRenderer.REFLECTIVITY_TEXTURE_TYPE);
                        effect.setTexture("reflectivitySampler", geometryBufferRenderer.getGBuffer().textures[roughnessIndex]);
                        if (this.useFresnel) {
                            effect.setTexture("normalSampler", geometryBufferRenderer.getGBuffer().textures[1]);
                            if (this._useScreenspaceDepth) {
                                const depthIndex = geometryBufferRenderer.getTextureIndex(GeometryBufferRenderer.SCREENSPACE_DEPTH_TEXTURE_TYPE);
                                effect.setTexture("depthSampler", geometryBufferRenderer.getGBuffer().textures[depthIndex]);
                            }
                            else {
                                effect.setTexture("depthSampler", geometryBufferRenderer.getGBuffer().textures[0]);
                            }
                        }
                    }
                    else if (prePassRenderer) {
                        const roughnessIndex = prePassRenderer.getIndex(3);
                        effect.setTexture("reflectivitySampler", prePassRenderer.getRenderTarget().textures[roughnessIndex]);
                        if (this.useFresnel) {
                            const depthIndex = prePassRenderer.getIndex(this._useScreenspaceDepth ? 10 : 5);
                            const normalIndex = prePassRenderer.getIndex(6);
                            effect.setTexture("normalSampler", prePassRenderer.getRenderTarget().textures[normalIndex]);
                            effect.setTexture("depthSampler", prePassRenderer.getRenderTarget().textures[depthIndex]);
                        }
                    }
                });
            }
            /**
             * Serializes the rendering pipeline (Used when exporting)
             * @returns the serialized object
             */
            serialize() {
                const serializationObject = SerializationHelper.Serialize(this);
                serializationObject.customType = "SSRRenderingPipeline";
                return serializationObject;
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _get_samples_decorators = [serialize()];
            _get_maxDistance_decorators = [serialize()];
            _get_step_decorators = [serialize()];
            _get_thickness_decorators = [serialize()];
            _get_strength_decorators = [serialize()];
            _get_reflectionSpecularFalloffExponent_decorators = [serialize()];
            _get_maxSteps_decorators = [serialize()];
            _get_roughnessFactor_decorators = [serialize()];
            _get_selfCollisionNumSkip_decorators = [serialize()];
            _get_reflectivityThreshold_decorators = [serialize()];
            _get_ssrDownsample_decorators = [serialize()];
            _get_blurDispersionStrength_decorators = [serialize("blurDispersionStrength")];
            _get_blurDownsample_decorators = [serialize("blurDownsample")];
            _get_enableSmoothReflections_decorators = [serialize("enableSmoothReflections")];
            _get_environmentTexture_decorators = [serialize("environmentTexture")];
            _get_environmentTextureIsProbe_decorators = [serialize("environmentTextureIsProbe")];
            _get_attenuateScreenBorders_decorators = [serialize("attenuateScreenBorders")];
            _get_attenuateIntersectionDistance_decorators = [serialize("attenuateIntersectionDistance")];
            _get_attenuateIntersectionIterations_decorators = [serialize("attenuateIntersectionIterations")];
            _get_attenuateFacingCamera_decorators = [serialize("attenuateFacingCamera")];
            _get_attenuateBackfaceReflection_decorators = [serialize("attenuateBackfaceReflection")];
            _get_clipToFrustum_decorators = [serialize("clipToFrustum")];
            _get_useFresnel_decorators = [serialize("useFresnel")];
            _get_enableAutomaticThicknessComputation_decorators = [serialize("enableAutomaticThicknessComputation")];
            __backfaceDepthTextureDownsample_decorators = [serialize("backfaceDepthTextureDownsample")];
            __backfaceForceDepthWriteTransparentMeshes_decorators = [serialize("backfaceForceDepthWriteTransparentMeshes")];
            __isEnabled_decorators = [serialize("isEnabled")];
            _get_inputTextureColorIsInGammaSpace_decorators = [serialize("inputTextureColorIsInGammaSpace")];
            _get_generateOutputInGammaSpace_decorators = [serialize("generateOutputInGammaSpace")];
            _get_debug_decorators = [serialize("debug")];
            __esDecorate(_a, null, _get_samples_decorators, { kind: "getter", name: "samples", static: false, private: false, access: { has: obj => "samples" in obj, get: obj => obj.samples }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _get_maxDistance_decorators, { kind: "getter", name: "maxDistance", static: false, private: false, access: { has: obj => "maxDistance" in obj, get: obj => obj.maxDistance }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _get_step_decorators, { kind: "getter", name: "step", static: false, private: false, access: { has: obj => "step" in obj, get: obj => obj.step }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _get_thickness_decorators, { kind: "getter", name: "thickness", static: false, private: false, access: { has: obj => "thickness" in obj, get: obj => obj.thickness }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _get_strength_decorators, { kind: "getter", name: "strength", static: false, private: false, access: { has: obj => "strength" in obj, get: obj => obj.strength }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _get_reflectionSpecularFalloffExponent_decorators, { kind: "getter", name: "reflectionSpecularFalloffExponent", static: false, private: false, access: { has: obj => "reflectionSpecularFalloffExponent" in obj, get: obj => obj.reflectionSpecularFalloffExponent }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _get_maxSteps_decorators, { kind: "getter", name: "maxSteps", static: false, private: false, access: { has: obj => "maxSteps" in obj, get: obj => obj.maxSteps }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _get_roughnessFactor_decorators, { kind: "getter", name: "roughnessFactor", static: false, private: false, access: { has: obj => "roughnessFactor" in obj, get: obj => obj.roughnessFactor }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _get_selfCollisionNumSkip_decorators, { kind: "getter", name: "selfCollisionNumSkip", static: false, private: false, access: { has: obj => "selfCollisionNumSkip" in obj, get: obj => obj.selfCollisionNumSkip }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _get_reflectivityThreshold_decorators, { kind: "getter", name: "reflectivityThreshold", static: false, private: false, access: { has: obj => "reflectivityThreshold" in obj, get: obj => obj.reflectivityThreshold }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _get_ssrDownsample_decorators, { kind: "getter", name: "ssrDownsample", static: false, private: false, access: { has: obj => "ssrDownsample" in obj, get: obj => obj.ssrDownsample }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _get_blurDispersionStrength_decorators, { kind: "getter", name: "blurDispersionStrength", static: false, private: false, access: { has: obj => "blurDispersionStrength" in obj, get: obj => obj.blurDispersionStrength }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _get_blurDownsample_decorators, { kind: "getter", name: "blurDownsample", static: false, private: false, access: { has: obj => "blurDownsample" in obj, get: obj => obj.blurDownsample }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _get_enableSmoothReflections_decorators, { kind: "getter", name: "enableSmoothReflections", static: false, private: false, access: { has: obj => "enableSmoothReflections" in obj, get: obj => obj.enableSmoothReflections }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _get_environmentTexture_decorators, { kind: "getter", name: "environmentTexture", static: false, private: false, access: { has: obj => "environmentTexture" in obj, get: obj => obj.environmentTexture }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _get_environmentTextureIsProbe_decorators, { kind: "getter", name: "environmentTextureIsProbe", static: false, private: false, access: { has: obj => "environmentTextureIsProbe" in obj, get: obj => obj.environmentTextureIsProbe }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _get_attenuateScreenBorders_decorators, { kind: "getter", name: "attenuateScreenBorders", static: false, private: false, access: { has: obj => "attenuateScreenBorders" in obj, get: obj => obj.attenuateScreenBorders }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _get_attenuateIntersectionDistance_decorators, { kind: "getter", name: "attenuateIntersectionDistance", static: false, private: false, access: { has: obj => "attenuateIntersectionDistance" in obj, get: obj => obj.attenuateIntersectionDistance }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _get_attenuateIntersectionIterations_decorators, { kind: "getter", name: "attenuateIntersectionIterations", static: false, private: false, access: { has: obj => "attenuateIntersectionIterations" in obj, get: obj => obj.attenuateIntersectionIterations }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _get_attenuateFacingCamera_decorators, { kind: "getter", name: "attenuateFacingCamera", static: false, private: false, access: { has: obj => "attenuateFacingCamera" in obj, get: obj => obj.attenuateFacingCamera }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _get_attenuateBackfaceReflection_decorators, { kind: "getter", name: "attenuateBackfaceReflection", static: false, private: false, access: { has: obj => "attenuateBackfaceReflection" in obj, get: obj => obj.attenuateBackfaceReflection }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _get_clipToFrustum_decorators, { kind: "getter", name: "clipToFrustum", static: false, private: false, access: { has: obj => "clipToFrustum" in obj, get: obj => obj.clipToFrustum }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _get_useFresnel_decorators, { kind: "getter", name: "useFresnel", static: false, private: false, access: { has: obj => "useFresnel" in obj, get: obj => obj.useFresnel }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _get_enableAutomaticThicknessComputation_decorators, { kind: "getter", name: "enableAutomaticThicknessComputation", static: false, private: false, access: { has: obj => "enableAutomaticThicknessComputation" in obj, get: obj => obj.enableAutomaticThicknessComputation }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _get_inputTextureColorIsInGammaSpace_decorators, { kind: "getter", name: "inputTextureColorIsInGammaSpace", static: false, private: false, access: { has: obj => "inputTextureColorIsInGammaSpace" in obj, get: obj => obj.inputTextureColorIsInGammaSpace }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _get_generateOutputInGammaSpace_decorators, { kind: "getter", name: "generateOutputInGammaSpace", static: false, private: false, access: { has: obj => "generateOutputInGammaSpace" in obj, get: obj => obj.generateOutputInGammaSpace }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _get_debug_decorators, { kind: "getter", name: "debug", static: false, private: false, access: { has: obj => "debug" in obj, get: obj => obj.debug }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(null, null, __backfaceDepthTextureDownsample_decorators, { kind: "field", name: "_backfaceDepthTextureDownsample", static: false, private: false, access: { has: obj => "_backfaceDepthTextureDownsample" in obj, get: obj => obj._backfaceDepthTextureDownsample, set: (obj, value) => { obj._backfaceDepthTextureDownsample = value; } }, metadata: _metadata }, __backfaceDepthTextureDownsample_initializers, __backfaceDepthTextureDownsample_extraInitializers);
            __esDecorate(null, null, __backfaceForceDepthWriteTransparentMeshes_decorators, { kind: "field", name: "_backfaceForceDepthWriteTransparentMeshes", static: false, private: false, access: { has: obj => "_backfaceForceDepthWriteTransparentMeshes" in obj, get: obj => obj._backfaceForceDepthWriteTransparentMeshes, set: (obj, value) => { obj._backfaceForceDepthWriteTransparentMeshes = value; } }, metadata: _metadata }, __backfaceForceDepthWriteTransparentMeshes_initializers, __backfaceForceDepthWriteTransparentMeshes_extraInitializers);
            __esDecorate(null, null, __isEnabled_decorators, { kind: "field", name: "_isEnabled", static: false, private: false, access: { has: obj => "_isEnabled" in obj, get: obj => obj._isEnabled, set: (obj, value) => { obj._isEnabled = value; } }, metadata: _metadata }, __isEnabled_initializers, __isEnabled_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
export { SSRRenderingPipeline };
let _Registered = false;
/**
 * Parse the serialized pipeline
 * @param source Source pipeline.
 * @param scene The scene to load the pipeline to.
 * @param rootUrl The URL of the serialized pipeline.
 * @returns An instantiated pipeline from the serialized object.
 */
export function SSRRenderingPipelineParse(source, scene, rootUrl) {
    return SerializationHelper.Parse(() => new SSRRenderingPipeline(source._name, scene, source._ratio), source, scene, rootUrl);
}
/**
 * Register side effects for ssrRenderingPipeline.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterSsrRenderingPipeline() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    SSRRenderingPipeline.Parse = SSRRenderingPipelineParse;
    RegisterClass("BABYLON.SSRRenderingPipeline", SSRRenderingPipeline);
}
//# sourceMappingURL=ssrRenderingPipeline.pure.js.map