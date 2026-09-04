/** This file must only contain pure code and pure imports */
import { RawTexture } from "../../Materials/Textures/rawTexture.js";
import { WebXRFeatureName, WebXRFeaturesManager } from "../webXRFeaturesManager.js";
import { WebXRAbstractFeature } from "./WebXRAbstractFeature.js";
import { Logger } from "../../Misc/logger.js";
import { Texture } from "../../Materials/Textures/texture.pure.js";
import { Observable } from "../../Misc/observable.pure.js";

import { WebGLHardwareTexture } from "../../Engines/WebGL/webGLHardwareTexture.js";
import { MaterialPluginBase } from "../../Materials/materialPluginBase.pure.js";
import { MaterialDefines } from "../../Materials/materialDefines.js";
import { PBRBaseMaterial } from "../../Materials/PBR/pbrBaseMaterial.pure.js";
import { RegisterMaterialPlugin, UnregisterMaterialPlugin } from "../../Materials/materialPluginManager.pure.js";
import { Matrix } from "../../Maths/math.vector.pure.js";
import { RegisterClass } from "../../Misc/typeStore.js";
class DepthSensingMaterialDefines extends MaterialDefines {
    constructor() {
        super(...arguments);
        /**
         * Is the feature enabled
         */
        this.DEPTH_SENSING = false;
        /**
         * Is the texture type provided as a texture array
         */
        this.DEPTH_SENSING_TEXTURE_ARRAY = false;
        /**
         * Is the texture type provided as Alpha-Luminance (unpacked differently on the shader)
         */
        this.DEPTH_SENSING_TEXTURE_AL = false;
        /**
         * Should the shader discard the pixel if the depth is less than the asset depth
         * Will lead to better performance. the other variant is to change the color based on a tolerance factor
         */
        this.DEPTH_SENSING_DISCARD = true;
    }
}
let IsPluginEnabled = false;
let DepthTexture = null;
let DepthTextureRight = null;
let AlphaLuminanceTexture = false;
const ScreenSize = { width: 512, height: 512 };
const ShaderViewport = { x: 0, y: 0, width: 1, height: 1 };
let GlobalRawValueToMeters = 1;
let GlobalRawValueToMetersRight = 1;
let GlobalDepthAvailableLeft = 0;
let GlobalDepthAvailableRight = 0;
let GlobalWorldScale = 1;
let ViewIndex = 0;
let EnableDiscard = true;
const UvTransform = /*#__PURE__*/ Matrix.Identity();
const UvTransformRight = /*#__PURE__*/ Matrix.Identity();
const RightView = /*#__PURE__*/ Matrix.Identity();
const ManagedMaterialPlugins = [];
const WebGPUGPUDepthWarning = "WebXR Depth Sensing is unavailable with WebGPU XR when the session negotiates gpu-optimized depth because XRGPUBinding has no environment-depth equivalent; request cpu-optimized depth to use the feature.";
/**
 * @internal
 */
class WebXRDepthSensingMaterialPlugin extends MaterialPluginBase {
    /** @internal */
    _markAllDefinesAsDirty() {
        this._enable(this._isEnabled);
        this.markAllDefinesAsDirty();
    }
    /**
     * Gets whether the mesh debug plugin is enabled in the material.
     */
    get isEnabled() {
        return this._isEnabled;
    }
    /**
     * Sets whether the mesh debug plugin is enabled in the material.
     * @param value enabled
     */
    set isEnabled(value) {
        if (this._isEnabled === value) {
            return;
        }
        this._isEnabled = value;
        this._markAllDefinesAsDirty();
    }
    /**
     * Gets a boolean indicating that the plugin is compatible with a given shader language.
     * @param shaderLanguage The shader language to use.
     * @returns true if the plugin is compatible with the shader language
     */
    isCompatible(shaderLanguage) {
        switch (shaderLanguage) {
            case 0 /* ShaderLanguage.GLSL */:
            case 1 /* ShaderLanguage.WGSL */:
                return true;
            default:
                return false;
        }
    }
    constructor(material) {
        super(material, "DepthSensing", 222, new DepthSensingMaterialDefines());
        this._isEnabled = false;
        this._varColorName = material instanceof PBRBaseMaterial ? "finalColor" : "color";
        this.doNotSerialize = true;
        ManagedMaterialPlugins.push(this);
    }
    /**
     * Prepare the defines
     * @param defines the defines
     */
    prepareDefines(defines) {
        defines.DEPTH_SENSING = !!DepthTexture && IsPluginEnabled;
        defines.DEPTH_SENSING_TEXTURE_ARRAY = DepthTexture?.is2DArray ?? false;
        defines.DEPTH_SENSING_TEXTURE_AL = AlphaLuminanceTexture;
        defines.DEPTH_SENSING_DISCARD = EnableDiscard;
    }
    getUniforms(shaderLanguage = 0 /* ShaderLanguage.GLSL */) {
        const ubo = [
            { name: "ds_invScreenSize", size: 2, type: "vec2" },
            { name: "ds_rawValueToMeters", size: 1, type: "float" },
            { name: "ds_viewIndex", size: 1, type: "float" },
            { name: "ds_shaderViewport", size: 4, type: "vec4" },
            { name: "ds_uvTransform", size: 16, type: "mat4" },
        ];
        if (shaderLanguage === 1 /* ShaderLanguage.WGSL */) {
            ubo.push({ name: "ds_rawValueToMetersRight", size: 1, type: "float" }, { name: "ds_depthAvailableLeft", size: 1, type: "float" }, { name: "ds_depthAvailableRight", size: 1, type: "float" }, { name: "ds_worldScale", size: 1, type: "float" }, { name: "ds_viewDepthSign", size: 1, type: "float" }, { name: "ds_uvTransformRight", size: 16, type: "mat4" }, { name: "ds_viewRight", size: 16, type: "mat4" });
        }
        return {
            // first, define the UBO with the correct type and size.
            ubo,
            // now, on the fragment shader, add the uniform itself in case uniform buffers are not supported by the engine
            fragment: shaderLanguage === 0 /* ShaderLanguage.GLSL */
                ? `#ifdef DEPTH_SENSING
                uniform vec2 ds_invScreenSize;
                uniform float ds_rawValueToMeters;
                uniform float ds_viewIndex;
                uniform vec4 ds_shaderViewport;
                uniform mat4 ds_uvTransform;
                #endif
                `
                : "",
        };
    }
    getSamplers(samplers) {
        samplers.push("ds_depthSampler");
        samplers.push("ds_depthSamplerRight");
    }
    bindForSubMesh(uniformBuffer) {
        if (IsPluginEnabled && DepthTexture) {
            const isWGSL = this._material.shaderLanguage === 1 /* ShaderLanguage.WGSL */;
            uniformBuffer.updateFloat2("ds_invScreenSize", 1 / ScreenSize.width, 1 / ScreenSize.height);
            uniformBuffer.updateFloat("ds_rawValueToMeters", GlobalRawValueToMeters);
            uniformBuffer.updateFloat("ds_viewIndex", ViewIndex);
            uniformBuffer.updateFloat4("ds_shaderViewport", ShaderViewport.x, ShaderViewport.y, ShaderViewport.width, ShaderViewport.height);
            uniformBuffer.setTexture("ds_depthSampler", DepthTexture);
            uniformBuffer.updateMatrix("ds_uvTransform", UvTransform);
            if (isWGSL) {
                uniformBuffer.updateFloat("ds_rawValueToMetersRight", GlobalRawValueToMetersRight);
                uniformBuffer.updateFloat("ds_depthAvailableLeft", GlobalDepthAvailableLeft);
                uniformBuffer.updateFloat("ds_depthAvailableRight", GlobalDepthAvailableRight);
                uniformBuffer.updateFloat("ds_worldScale", GlobalWorldScale);
                uniformBuffer.updateFloat("ds_viewDepthSign", this._material.getScene().useRightHandedSystem ? -1 : 1);
                uniformBuffer.setTexture("ds_depthSamplerRight", DepthTextureRight);
                uniformBuffer.updateMatrix("ds_uvTransformRight", UvTransformRight);
                uniformBuffer.updateMatrix("ds_viewRight", RightView);
            }
        }
    }
    getClassName() {
        return "DepthSensingMaterialPlugin";
    }
    getCustomCode(shaderType, shaderLanguage = 0 /* ShaderLanguage.GLSL */) {
        if (shaderLanguage === 1 /* ShaderLanguage.WGSL */) {
            return shaderType === "vertex"
                ? {
                    CUSTOM_VERTEX_MAIN_BEGIN: `
                #ifdef DEPTH_SENSING
                #ifdef MULTIVIEW
                    vertexOutputs.ds_viewIndexMultiview = f32(gl_ViewID_OVR);
                #endif
                #endif
                `,
                    CUSTOM_VERTEX_DEFINITIONS: `
                #ifdef DEPTH_SENSING
                #ifdef MULTIVIEW
                    varying ds_viewIndexMultiview: f32;
                #endif
                #endif
                `,
                }
                : {
                    CUSTOM_FRAGMENT_DEFINITIONS: `
                    #ifdef DEPTH_SENSING
                        #ifdef DEPTH_SENSING_TEXTURE_ARRAY
                            var ds_depthSampler: texture_2d_array<f32>;
                        #else
                            var ds_depthSampler: texture_2d<f32>;
                        #endif
                        var ds_depthSamplerSampler: sampler;
                        #if defined(MULTIVIEW) && !defined(DEPTH_SENSING_TEXTURE_ARRAY)
                            var ds_depthSamplerRight: texture_2d<f32>;
                            var ds_depthSamplerRightSampler: sampler;
                        #endif
                        #ifdef MULTIVIEW
                            varying ds_viewIndexMultiview: f32;
                        #endif
                    #endif
                  `,
                    CUSTOM_FRAGMENT_MAIN_BEGIN: `
#ifdef DEPTH_SENSING
    #ifdef MULTIVIEW
        let ds_viewIndexSet: f32 = fragmentInputs.ds_viewIndexMultiview;
        let ds_compensation: vec2f = vec2f(0.0, 0.0);
    #else
        let ds_viewIndexSet: f32 = uniforms.ds_viewIndex;
        let ds_compensation: vec2f = vec2f(ds_viewIndexSet, 0.0);
    #endif
    let ds_baseUvBottomLeft: vec2f = (fragmentInputs.position.xy * uniforms.ds_invScreenSize - uniforms.ds_shaderViewport.xy) / uniforms.ds_shaderViewport.zw;
    let ds_baseUv: vec2f = vec2f(ds_baseUvBottomLeft.x, 1.0 - ds_baseUvBottomLeft.y);
    var ds_depthSample: vec4f = vec4f(0.0);
    var ds_rawValueToMetersSet: f32 = uniforms.ds_rawValueToMeters;
    #if defined(MULTIVIEW) && !defined(DEPTH_SENSING_TEXTURE_ARRAY)
        var ds_depthAvailable: f32 = uniforms.ds_depthAvailableLeft;
        if (ds_viewIndexSet < 0.5) {
            if (ds_depthAvailable > 0.5) {
                let ds_depthUv: vec2f = (uniforms.ds_uvTransform * vec4f(ds_baseUv, 0.0, 1.0)).xy;
                ds_depthSample = textureSampleLevel(ds_depthSampler, ds_depthSamplerSampler, ds_depthUv, 0.0);
            }
        } else {
            ds_depthAvailable = uniforms.ds_depthAvailableRight;
            if (ds_depthAvailable > 0.5) {
                let ds_depthUv: vec2f = (uniforms.ds_uvTransformRight * vec4f(ds_baseUv, 0.0, 1.0)).xy;
                ds_depthSample = textureSampleLevel(ds_depthSamplerRight, ds_depthSamplerRightSampler, ds_depthUv, 0.0);
            }
            ds_rawValueToMetersSet = uniforms.ds_rawValueToMetersRight;
        }
    #else
        let ds_depthAvailable: f32 = 1.0;
        #ifdef DEPTH_SENSING_TEXTURE_ARRAY
            let ds_uv: vec2f = ds_baseUv - ds_compensation;
            let ds_depthUv: vec2f = (uniforms.ds_uvTransform * vec4f(ds_uv, 0.0, 1.0)).xy;
            ds_depthSample = textureSample(ds_depthSampler, ds_depthSamplerSampler, ds_depthUv, i32(ds_viewIndexSet));
        #else
            let ds_depthUv: vec2f = (uniforms.ds_uvTransform * vec4f(ds_baseUv, 0.0, 1.0)).xy;
            ds_depthSample = textureSample(ds_depthSampler, ds_depthSamplerSampler, ds_depthUv);
        #endif
    #endif
    var ds_cameraDepth: f32;
    #ifdef DEPTH_SENSING_TEXTURE_AL
        let ds_alphaLuminance: vec2f = ds_depthSample.ra;
        ds_cameraDepth = dot(ds_alphaLuminance, vec2f(255.0, 256.0 * 255.0));
    #else
        ds_cameraDepth = ds_depthSample.r;
    #endif

    ds_cameraDepth = ds_cameraDepth * ds_rawValueToMetersSet;

    var ds_viewPosition: vec4f = scene.view * vec4f(fragmentInputs.vPositionW, 1.0);
    #ifdef MULTIVIEW
        if (ds_viewIndexSet >= 0.5) {
            ds_viewPosition = uniforms.ds_viewRight * vec4f(fragmentInputs.vPositionW, 1.0);
        }
    #endif
    let ds_assetDepth: f32 = (ds_viewPosition.z * uniforms.ds_viewDepthSign) / uniforms.ds_worldScale;
    #ifdef DEPTH_SENSING_DISCARD
    if (ds_depthAvailable > 0.5 && ds_cameraDepth > 0.0 && ds_cameraDepth < ds_assetDepth) {
        discard;
    }
    #endif
#endif
                  `,
                    CUSTOM_FRAGMENT_BEFORE_FRAGCOLOR: `
#ifdef DEPTH_SENSING
    #ifndef DEPTH_SENSING_DISCARD
        if (ds_depthAvailable > 0.5 && ds_cameraDepth > 0.0) {
            let ds_depthTolerancePerM: f32 = 0.005;
            let ds_occlusion: f32 = clamp(1.0 - 0.5 * (ds_cameraDepth - ds_assetDepth) / (ds_depthTolerancePerM * ds_assetDepth) +
                0.5, 0.0, 1.0);
            ${this._varColorName} *= (1.0 - ds_occlusion);
        }
    #endif
#endif
                  `,
                };
        }
        return shaderType === "vertex"
            ? {
                CUSTOM_VERTEX_MAIN_BEGIN: `
                #ifdef DEPTH_SENSING
                #ifdef MULTIVIEW
                    ds_viewIndexMultiview = float(gl_ViewID_OVR);
                #endif
                #endif
                `,
                CUSTOM_VERTEX_DEFINITIONS: `
                #ifdef DEPTH_SENSING
                #ifdef MULTIVIEW
                    varying float ds_viewIndexMultiview;
                #endif
                #endif
                `,
            }
            : {
                CUSTOM_FRAGMENT_DEFINITIONS: `
                    #ifdef DEPTH_SENSING
                        #ifdef DEPTH_SENSING_TEXTURE_ARRAY
                            uniform highp sampler2DArray ds_depthSampler;
                        #else
                            uniform sampler2D ds_depthSampler;
                        #endif
                        #ifdef MULTIVIEW
                            varying float ds_viewIndexMultiview;
                        #endif
                    #endif
                  `,
                CUSTOM_FRAGMENT_MAIN_BEGIN: `
#ifdef DEPTH_SENSING
    #ifdef MULTIVIEW
        float ds_viewIndexSet = ds_viewIndexMultiview;
        vec2 ds_compensation = vec2(0.0, 0.0);
    #else
        float ds_viewIndexSet = ds_viewIndex;
        vec2 ds_compensation = vec2(ds_viewIndexSet, 0.0);
    #endif
    vec2 ds_baseUv = gl_FragCoord.xy * ds_invScreenSize;
    #ifdef DEPTH_SENSING_TEXTURE_ARRAY
        vec2 ds_uv = ds_baseUv - ds_compensation;
        vec3 ds_depthUv = vec3((ds_uvTransform * vec4(ds_uv, 0.0, 1.0)).xy, ds_viewIndexSet);
    #else
        vec2 ds_depthUv = (ds_uvTransform * vec4(ds_baseUv.x, 1.0 - ds_baseUv.y, 0.0, 1.0)).xy;
    #endif
    #ifdef DEPTH_SENSING_TEXTURE_AL
        // from alpha-luminance - taken from the explainer
        vec2 ds_alphaLuminance = texture(ds_depthSampler, ds_depthUv).ra;
        float ds_cameraDepth = dot(ds_alphaLuminance, vec2(255.0, 256.0 * 255.0));
    #else
        float ds_cameraDepth = texture(ds_depthSampler, ds_depthUv).r;
    #endif

    ds_cameraDepth = ds_cameraDepth * ds_rawValueToMeters;

    float ds_assetDepth = gl_FragCoord.z;
    #ifdef DEPTH_SENSING_DISCARD
    if(ds_cameraDepth < ds_assetDepth) {
        discard;
    }
    #endif
#endif  
                  `,
                CUSTOM_FRAGMENT_BEFORE_FRAGCOLOR: `
#ifdef DEPTH_SENSING
    #ifndef DEPTH_SENSING_DISCARD
        const float ds_depthTolerancePerM = 0.005;
        float ds_occlusion = clamp(1.0 - 0.5 * (ds_cameraDepth - ds_assetDepth) / (ds_depthTolerancePerM * ds_assetDepth) +
            0.5, 0.0, 1.0);
        ${this._varColorName} *= (1.0 - ds_occlusion);
    #endif
#endif                  
                  `,
            };
    }
    dispose(_forceDisposeTextures) {
        const index = ManagedMaterialPlugins.indexOf(this);
        if (index !== -1) {
            ManagedMaterialPlugins.splice(index, 1);
        }
        super.dispose(_forceDisposeTextures);
    }
}
/**
 * WebXR Feature for WebXR Depth Sensing Module
 * @since 5.49.1
 */
export class WebXRDepthSensing extends WebXRAbstractFeature {
    /**
     * Width of depth data. If depth data is not exist, returns null.
     */
    get width() {
        return this._width;
    }
    /**
     * Height of depth data. If depth data is not exist, returns null.
     */
    get height() {
        return this._height;
    }
    /**
     * Scale factor by which the raw depth values must be multiplied in order to get the depths in meters.
     */
    get rawValueToMeters() {
        return this._rawValueToMeters;
    }
    /**
     * An XRRigidTransform that needs to be applied when indexing into the depth buffer.
     */
    get normDepthBufferFromNormView() {
        return this._normDepthBufferFromNormView;
    }
    /**
     * Describes which depth-sensing usage ("cpu" or "gpu") is used.
     */
    get depthUsage() {
        switch (this._xrSessionManager.session.depthUsage) {
            case "cpu-optimized":
                return "cpu";
            case "gpu-optimized":
                return "gpu";
        }
    }
    /**
     * Describes which depth sensing data format ("ushort" or "float") is used.
     */
    get depthDataFormat() {
        switch (this._xrSessionManager.session.depthDataFormat) {
            case "luminance-alpha":
                return "ushort";
            case "float32":
                return "float";
            case "unsigned-short":
                return "ushort";
        }
    }
    /**
     * Whether depth sensing is currently active for the XR session.
     * Returns false when there is no active session or the runtime does not expose the active state.
     * @see https://immersive-web.github.io/depth-sensing/
     * @see https://playground.babylonjs.com/#SU7NUW#0
     */
    get isDepthSensingActive() {
        const session = this._xrSessionManager.session;
        return this._xrSessionManager.inXRSession && session?.depthActive === true;
    }
    /**
     * Pauses depth sensing for the active XR session.
     * @returns A promise that resolves when the native pause operation completes.
     * @throws If there is no active XR session or pausing depth sensing is not supported by the runtime.
     * @see https://immersive-web.github.io/depth-sensing/
     */
    async pauseDepthSensingAsync() {
        const session = this._xrSessionManager.session;
        if (!this._xrSessionManager.inXRSession || !session) {
            throw new Error("Pausing WebXR depth sensing requires an active XR session.");
        }
        if (typeof session.pauseDepthSensing !== "function") {
            throw new Error("XRSession.pauseDepthSensing is not supported by this XR runtime.");
        }
        return await session.pauseDepthSensing();
    }
    /**
     * Resumes depth sensing for the active XR session.
     * @returns A promise that resolves when the native resume operation completes.
     * @throws If there is no active XR session or resuming depth sensing is not supported by the runtime.
     * @see https://immersive-web.github.io/depth-sensing/
     */
    async resumeDepthSensingAsync() {
        const session = this._xrSessionManager.session;
        if (!this._xrSessionManager.inXRSession || !session) {
            throw new Error("Resuming WebXR depth sensing requires an active XR session.");
        }
        if (typeof session.resumeDepthSensing !== "function") {
            throw new Error("XRSession.resumeDepthSensing is not supported by this XR runtime.");
        }
        return await session.resumeDepthSensing();
    }
    /**
     * Latest cached InternalTexture which containing depth buffer information.
     * This can be used when the depth usage is "gpu".
     * @deprecated This will be removed in the future. Use latestDepthImageTexture
     */
    get latestInternalTexture() {
        if (!this._cachedWebGLTexture) {
            return null;
        }
        return this._getInternalTextureFromDepthInfo();
    }
    /**
     * cached depth buffer
     */
    get latestDepthBuffer() {
        if (!this._cachedDepthBuffer) {
            return null;
        }
        return this.depthDataFormat === "float" ? new Float32Array(this._cachedDepthBuffer) : new Uint16Array(this._cachedDepthBuffer);
    }
    /**
     * Latest cached Texture of depth image which is made from the depth buffer data.
     */
    get latestDepthImageTexture() {
        return this._cachedDepthImageTexture;
    }
    /**
     * Creates a new instance of the depth sensing feature
     * @param _xrSessionManager the WebXRSessionManager
     * @param options options for WebXR Depth Sensing Feature
     */
    constructor(_xrSessionManager, options) {
        super(_xrSessionManager);
        this.options = options;
        this._width = null;
        this._height = null;
        this._rawValueToMeters = null;
        this._textureType = null;
        this._normDepthBufferFromNormView = null;
        this._cachedDepthBuffer = null;
        this._cachedWebGLTexture = null;
        this._cachedDepthImageTexture = null;
        this._cachedDepthImageTextureWrapsExternalTexture = false;
        this._cpuDepthViewStates = [];
        this._disableAutoAttachBeforeWebGPUGPUDepth = false;
        this._disabledForWebGPUGPUDepth = false;
        this._onCameraObserver = null;
        this._onSessionEndedObserver = null;
        /**
         * Event that notify when `DepthInformation.getDepthInMeters` is available.
         * `getDepthInMeters` method needs active XRFrame (not available for cached XRFrame)
         */
        this.onGetDepthInMetersAvailable = new Observable();
        this.xrNativeFeatureName = "depth-sensing";
        // https://immersive-web.github.io/depth-sensing/
        if (!this._xrSessionManager.scene.getEngine().isWebGPU) {
            Logger.Warn("depth-sensing is an experimental and unstable feature.");
        }
        EnableDiscard = !options.useToleranceFactorForDepthSensing;
        RegisterMaterialPlugin("WebXRDepthSensingMaterialPlugin", (material) => new WebXRDepthSensingMaterialPlugin(material));
        this._onSessionEndedObserver = this._xrSessionManager.onXRSessionEnded.add(() => {
            if (this._disabledForWebGPUGPUDepth) {
                this._disabledForWebGPUGPUDepth = false;
                this.disableAutoAttach = this._disableAutoAttachBeforeWebGPUGPUDepth;
            }
        });
    }
    /**
     * attach this feature
     * Will usually be called by the features manager
     * @param force should attachment be forced (even when already attached)
     * @returns true if successful.
     */
    attach(force) {
        const engine = this._xrSessionManager.scene.getEngine();
        const depthUsage = this._xrSessionManager.session.depthUsage;
        const depthDataFormat = this._xrSessionManager.session.depthDataFormat;
        if (engine.isWebGPU && depthUsage === "gpu-optimized") {
            if (this._disabledForWebGPUGPUDepth) {
                this.disableAutoAttach = true;
                return false;
            }
            this._disableAutoAttachBeforeWebGPUGPUDepth = this._autoAttachPolicyBeforeAttach ?? this.disableAutoAttach;
            this._disabledForWebGPUGPUDepth = true;
            return this._disableAutoAttach(WebGPUGPUDepthWarning);
        }
        if (depthUsage == null || depthDataFormat == null) {
            return false;
        }
        if (!super.attach(force)) {
            return false;
        }
        if (!engine.isWebGPU) {
            const graphicsBinding = this._xrSessionManager._getGraphicsBinding();
            if (graphicsBinding.bindingType !== 0 /* WebXRGraphicsBindingType.WebGL */) {
                throw new Error("Expected a WebGL graphics binding for WebXR Depth Sensing.");
            }
            this._glBinding = graphicsBinding.binding;
        }
        IsPluginEnabled = !this.options.disableDepthSensingOnMaterials;
        if (IsPluginEnabled) {
            for (const plugin of ManagedMaterialPlugins) {
                plugin.isEnabled = true;
            }
            this._onCameraObserver = this._xrSessionManager.scene.onBeforeCameraRenderObservable.add((camera) => {
                if (!IsPluginEnabled) {
                    return;
                }
                // make sure this is a webxr camera
                if (camera.outputRenderTarget) {
                    const viewport = camera.rigCameras.length > 0 ? camera.rigCameras[0].viewport : camera.viewport;
                    ScreenSize.width = camera.outputRenderTarget.getRenderWidth() / (!engine.isWebGPU && camera.rigParent ? camera.rigParent.rigCameras.length || 1 : 1);
                    ScreenSize.height = camera.outputRenderTarget.getRenderHeight();
                    ShaderViewport.x = viewport.x;
                    ShaderViewport.y = viewport.y;
                    ShaderViewport.width = viewport.width;
                    ShaderViewport.height = viewport.height;
                    GlobalWorldScale = this._xrSessionManager.worldScalingFactor;
                    // find the viewIndex
                    if (camera.rigParent) {
                        const viewIndex = camera.rigParent.rigCameras.indexOf(camera);
                        ViewIndex = viewIndex === -1 ? 0 : viewIndex;
                        if (engine.isWebGPU && this.depthUsage === "cpu") {
                            this._bindCPUDepthView(ViewIndex, false);
                        }
                    }
                    else if (camera._renderingMultiview && engine.isWebGPU && this.depthUsage === "cpu") {
                        ViewIndex = 0;
                        const rightCamera = camera.rigCameras[1];
                        if (rightCamera) {
                            RightView.copyFrom(rightCamera.getViewMatrix());
                        }
                        this._bindCPUDepthView(0, true);
                    }
                }
            });
        }
        return true;
    }
    detach() {
        IsPluginEnabled = false;
        DepthTexture = null;
        DepthTextureRight = null;
        this._cachedWebGLTexture = null;
        this._cachedDepthBuffer = null;
        this._width = null;
        this._height = null;
        this._rawValueToMeters = null;
        this._textureType = null;
        this._normDepthBufferFromNormView = null;
        let cachedTextureDisposed = false;
        for (const viewState of this._cpuDepthViewStates) {
            viewState.texture?.dispose();
            cachedTextureDisposed || (cachedTextureDisposed = viewState.texture === this._cachedDepthImageTexture);
        }
        this._cpuDepthViewStates.length = 0;
        if (!cachedTextureDisposed) {
            if (this._cachedDepthImageTextureWrapsExternalTexture && this._cachedDepthImageTexture?._texture) {
                this._cachedDepthImageTexture._texture._hardwareTexture = null;
            }
            this._cachedDepthImageTexture?.dispose();
        }
        this._cachedDepthImageTexture = null;
        this._cachedDepthImageTextureWrapsExternalTexture = false;
        for (const plugin of ManagedMaterialPlugins) {
            plugin.isEnabled = false;
        }
        if (this._onCameraObserver) {
            this._xrSessionManager.scene.onBeforeCameraRenderObservable.remove(this._onCameraObserver);
            this._onCameraObserver = null;
        }
        return super.detach();
    }
    /**
     * Dispose this feature and all of the resources attached
     */
    dispose() {
        if (this._onSessionEndedObserver) {
            this._xrSessionManager.onXRSessionEnded.remove(this._onSessionEndedObserver);
            this._onSessionEndedObserver = null;
        }
        super.dispose();
        UnregisterMaterialPlugin("WebXRDepthSensingMaterialPlugin");
        this.onGetDepthInMetersAvailable.clear();
        // cleanup
        if (this._onCameraObserver) {
            this._xrSessionManager.scene.onBeforeCameraRenderObservable.remove(this._onCameraObserver);
        }
        for (const plugin of ManagedMaterialPlugins) {
            plugin.dispose();
        }
        ManagedMaterialPlugins.length = 0;
    }
    _onXRFrame(_xrFrame) {
        const referenceSPace = this._xrSessionManager.referenceSpace;
        const depthUsage = this.depthUsage;
        if (depthUsage === "cpu") {
            for (const viewState of this._cpuDepthViewStates) {
                viewState.available = false;
            }
        }
        const pose = _xrFrame.getViewerPose(referenceSPace);
        if (pose == null) {
            if (depthUsage === "cpu") {
                this._clearCPUDepthBinding();
            }
            return;
        }
        for (let viewIndex = 0; viewIndex < pose.views.length; viewIndex++) {
            const view = pose.views[viewIndex];
            switch (depthUsage) {
                case "cpu":
                    this._updateDepthInformationAndTextureCPUDepthUsage(_xrFrame, view, viewIndex, this.depthDataFormat);
                    break;
                case "gpu":
                    if (!this._glBinding) {
                        break;
                    }
                    this._updateDepthInformationAndTextureWebGLDepthUsage(this._glBinding, view, this.depthDataFormat);
                    break;
                default:
                    Logger.Error("Unknown depth usage");
                    this.detach();
                    break;
            }
        }
        if (depthUsage === "cpu" && !this._cpuDepthViewStates.some((viewState) => viewState.available)) {
            this._clearCPUDepthBinding();
        }
    }
    _updateDepthInformationAndTextureCPUDepthUsage(frame, view, viewIndex, dataFormat) {
        const depthInfo = frame.getDepthInformation(view);
        if (depthInfo == null) {
            return;
        }
        const { data, width, height, rawValueToMeters, getDepthInMeters, normDepthBufferFromNormView } = depthInfo;
        let viewState = this._cpuDepthViewStates[viewIndex];
        if (!viewState) {
            viewState = {
                available: true,
                height,
                rawValueToMeters,
                texture: null,
                uvTransform: Matrix.Identity(),
                visualizationDepthBuffer: null,
                width,
            };
            this._cpuDepthViewStates[viewIndex] = viewState;
        }
        const textureSizeChanged = viewState.width !== width || viewState.height !== height;
        this._width = width;
        this._height = height;
        this._rawValueToMeters = rawValueToMeters;
        this._normDepthBufferFromNormView = normDepthBufferFromNormView;
        this._cachedDepthBuffer = data;
        AlphaLuminanceTexture = dataFormat === "luminance-alpha";
        viewState.height = height;
        viewState.available = true;
        viewState.rawValueToMeters = rawValueToMeters;
        viewState.uvTransform.fromArray(normDepthBufferFromNormView.matrix);
        viewState.width = width;
        // to avoid Illegal Invocation error, bind `this`
        this.onGetDepthInMetersAvailable.notifyObservers(getDepthInMeters.bind(depthInfo));
        if (!viewState.texture || textureSizeChanged) {
            viewState.texture?.dispose();
            viewState.texture = RawTexture.CreateRTexture(null, width, height, this._xrSessionManager.scene, false, false, Texture.NEAREST_SAMPLINGMODE, 1);
        }
        this._cachedDepthImageTextureWrapsExternalTexture = false;
        this._cachedDepthImageTexture = viewState.texture;
        let depthValues = null;
        switch (dataFormat) {
            case "ushort":
            case "luminance-alpha":
                depthValues = new Uint16Array(data);
                break;
            case "float":
                depthValues = new Float32Array(data);
                break;
            default:
                break;
        }
        if (depthValues) {
            let uploadData;
            if (this.options.prepareTextureForVisualization) {
                if (!viewState.visualizationDepthBuffer || viewState.visualizationDepthBuffer.length !== depthValues.length) {
                    viewState.visualizationDepthBuffer = new Float32Array(depthValues.length);
                }
                uploadData = viewState.visualizationDepthBuffer;
                for (let index = 0; index < depthValues.length; index++) {
                    uploadData[index] = depthValues[index] * rawValueToMeters;
                }
            }
            else {
                uploadData = depthValues instanceof Float32Array ? depthValues : Float32Array.from(depthValues);
            }
            viewState.texture.update(uploadData);
        }
        if (!this._xrSessionManager.scene.getEngine().isWebGPU) {
            const hadDepthTexture = !!DepthTexture;
            DepthTexture = viewState.texture;
            DepthTextureRight = null;
            GlobalDepthAvailableLeft = 1;
            GlobalDepthAvailableRight = 0;
            GlobalRawValueToMeters = viewState.rawValueToMeters;
            UvTransform.copyFrom(viewState.uvTransform);
            if (!hadDepthTexture) {
                this._xrSessionManager.scene.markAllMaterialsAsDirty(1);
            }
        }
    }
    _clearCPUDepthBinding() {
        if (DepthTexture) {
            DepthTexture = null;
            DepthTextureRight = null;
            this._xrSessionManager.scene.markAllMaterialsAsDirty(1);
        }
    }
    _bindCPUDepthView(viewIndex, multiview) {
        const leftViewState = this._cpuDepthViewStates[0];
        const rightViewState = multiview ? this._cpuDepthViewStates[1] : null;
        const viewState = multiview
            ? leftViewState?.available && leftViewState.texture
                ? leftViewState
                : rightViewState?.available && rightViewState.texture
                    ? rightViewState
                    : null
            : this._cpuDepthViewStates[viewIndex];
        if (!viewState?.available || !viewState.texture) {
            this._clearCPUDepthBinding();
            return;
        }
        const hadDepthTexture = !!DepthTexture;
        if (multiview && leftViewState?.available && leftViewState.texture) {
            GlobalDepthAvailableLeft = 1;
            DepthTexture = leftViewState.texture;
            GlobalRawValueToMeters = leftViewState.rawValueToMeters;
            UvTransform.copyFrom(leftViewState.uvTransform);
        }
        else {
            GlobalDepthAvailableLeft = multiview ? 0 : 1;
            DepthTexture = viewState.texture;
            GlobalRawValueToMeters = viewState.rawValueToMeters;
            UvTransform.copyFrom(viewState.uvTransform);
        }
        if (multiview && rightViewState?.available && rightViewState.texture) {
            GlobalDepthAvailableRight = 1;
            DepthTextureRight = rightViewState.texture;
            GlobalRawValueToMetersRight = rightViewState.rawValueToMeters;
            UvTransformRight.copyFrom(rightViewState.uvTransform);
        }
        else {
            GlobalDepthAvailableRight = 0;
            DepthTextureRight = viewState.texture;
            GlobalRawValueToMetersRight = viewState.rawValueToMeters;
            UvTransformRight.copyFrom(viewState.uvTransform);
        }
        if (!hadDepthTexture) {
            this._xrSessionManager.scene.markAllMaterialsAsDirty(1);
        }
    }
    _updateDepthInformationAndTextureWebGLDepthUsage(webglBinding, view, dataFormat) {
        const depthInfo = webglBinding.getDepthInformation(view);
        if (depthInfo === null) {
            return;
        }
        const { texture, width, height, textureType, rawValueToMeters, normDepthBufferFromNormView } = depthInfo;
        GlobalRawValueToMeters = rawValueToMeters;
        AlphaLuminanceTexture = dataFormat === "luminance-alpha";
        UvTransform.fromArray(normDepthBufferFromNormView.matrix);
        if (this._cachedWebGLTexture) {
            return;
        }
        this._width = width;
        this._height = height;
        this._cachedWebGLTexture = texture;
        this._textureType = textureType;
        const scene = this._xrSessionManager.scene;
        const internalTexture = this._getInternalTextureFromDepthInfo();
        if (!this._cachedDepthImageTexture) {
            this._cachedDepthImageTexture = RawTexture.CreateRTexture(null, width, height, scene, false, true, Texture.NEAREST_SAMPLINGMODE, dataFormat === "float" ? 1 : 0);
            this._cachedDepthImageTexture._texture?.dispose();
        }
        this._cachedDepthImageTexture._texture = internalTexture;
        this._cachedDepthImageTextureWrapsExternalTexture = true;
        DepthTexture = this._cachedDepthImageTexture;
        this._xrSessionManager.scene.markAllMaterialsAsDirty(1);
    }
    /**
     * Extends the session init object if needed
     * @returns augmentation object for the xr session init object.
     */
    async getXRSessionInitExtension() {
        const isDepthUsageDeclared = this.options.usagePreference != null && this.options.usagePreference.length !== 0;
        const isDataFormatDeclared = this.options.dataFormatPreference != null && this.options.dataFormatPreference.length !== 0;
        return await new Promise((resolve) => {
            if (isDepthUsageDeclared && isDataFormatDeclared) {
                const usages = this.options.usagePreference.map((usage) => {
                    switch (usage) {
                        case "cpu":
                            return "cpu-optimized";
                        case "gpu":
                            return "gpu-optimized";
                    }
                });
                const dataFormats = this.options.dataFormatPreference.map((format) => {
                    switch (format) {
                        case "luminance-alpha":
                            return "luminance-alpha";
                        case "float":
                            return "float32";
                        case "ushort":
                            return "unsigned-short";
                    }
                });
                resolve({
                    depthSensing: {
                        usagePreference: usages,
                        dataFormatPreference: dataFormats,
                    },
                });
            }
            else {
                resolve({});
            }
        });
    }
    _getInternalTextureFromDepthInfo() {
        const engine = this._xrSessionManager.scene.getEngine();
        const dataFormat = this.depthDataFormat;
        const textureType = this._textureType;
        if (!this._width || !this._height || !this._cachedWebGLTexture) {
            throw new Error("Depth information is not available");
        }
        const internalTexture = engine.wrapWebGLTexture(this._cachedWebGLTexture, false, 1, this._width || 256, this._height || 256);
        internalTexture.isCube = false;
        internalTexture.invertY = false;
        internalTexture._useSRGBBuffer = false;
        internalTexture.format = dataFormat === "luminance-alpha" ? 2 : 5;
        internalTexture.generateMipMaps = false;
        internalTexture.type =
            dataFormat === "float" ? 1 : dataFormat === "ushort" ? 5 : 0;
        internalTexture._cachedWrapU = 1;
        internalTexture._cachedWrapV = 1;
        internalTexture._hardwareTexture = new WebGLHardwareTexture(this._cachedWebGLTexture, engine._gl);
        internalTexture.is2DArray = textureType === "texture-array";
        return internalTexture;
    }
}
/**
 * The module's name
 */
WebXRDepthSensing.Name = WebXRFeatureName.DEPTH_SENSING;
/**
 * The (Babylon) version of this module.
 * This is an integer representing the implementation version.
 * This number does not correspond to the WebXR specs version
 */
WebXRDepthSensing.Version = 1;
let _Registered = false;
/**
 * Register side effects for webXRDepthSensing.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterWebXRDepthSensing() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    RegisterClass(`BABYLON.DepthSensingMaterialPlugin`, WebXRDepthSensingMaterialPlugin);
    WebXRFeaturesManager.AddWebXRFeature(WebXRDepthSensing.Name, (xrSessionManager, options) => {
        return () => new WebXRDepthSensing(xrSessionManager, options);
    }, WebXRDepthSensing.Version, false);
}
//# sourceMappingURL=WebXRDepthSensing.pure.js.map