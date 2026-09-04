/** This file must only contain pure code and pure imports */
import { WebGLHardwareTexture } from "../../Engines/WebGL/webGLHardwareTexture.js";
import { InternalTexture } from "../../Materials/Textures/internalTexture.js";
import { Observable } from "../../Misc/observable.pure.js";
import { Logger } from "../../Misc/logger.js";
import { WebXRFeatureName, WebXRFeaturesManager } from "../webXRFeaturesManager.js";
import { WebXRAbstractFeature } from "./WebXRAbstractFeature.js";

import { Color3 } from "../../Maths/math.color.pure.js";
import { Vector3 } from "../../Maths/math.vector.pure.js";
import { DirectionalLight } from "../../Lights/directionalLight.pure.js";
import { BaseTexture } from "../../Materials/Textures/baseTexture.pure.js";
import { SphericalHarmonics, SphericalPolynomial } from "../../Maths/sphericalPolynomial.pure.js";
import { LightConstants } from "../../Lights/lightConstants.js";
import { HDRFiltering } from "../../Materials/Textures/Filtering/hdrFiltering.js";
const WebGPUReflectionWarning = "WebXR Light Estimation reflection cube maps are unavailable with WebGPU XR because they are exposed only by XRWebGLBinding; light direction, intensity, and spherical harmonics remain enabled.";
/**
 * Light Estimation Feature
 *
 * @since 5.0.0
 */
export class WebXRLightEstimation extends WebXRAbstractFeature {
    /**
     * Creates a new instance of the light estimation feature
     * @param _xrSessionManager an instance of WebXRSessionManager
     * @param options options to use when constructing this feature
     */
    constructor(_xrSessionManager, 
    /**
     * options to use when constructing this feature
     */
    options) {
        super(_xrSessionManager);
        this.options = options;
        this._reflectionCubeMap = null;
        this._xrLightEstimate = null;
        this._xrLightProbe = null;
        this._reflectionCubeMapEnabled = false;
        this._webGPUReflectionWarningEmitted = false;
        this._lightDirection = Vector3.Up().negateInPlace();
        this._lightColor = Color3.White();
        this._intensity = 1;
        this._sphericalHarmonics = new SphericalHarmonics();
        this._cubeMapPollTime = Date.now();
        this._lightEstimationPollTime = Date.now();
        /**
         * ARCore's reflection cube map size is 16x16.
         * Once other systems support this feature we will need to change this to be dynamic.
         * see https://github.com/immersive-web/lighting-estimation/blob/main/lighting-estimation-explainer.md#cube-map-open-questions
         */
        this._reflectionCubeMapTextureSize = 16;
        /**
         * If createDirectionalLightSource is set to true this light source will be created automatically.
         * Otherwise this can be set with an external directional light source.
         * This light will be updated whenever the light estimation values change.
         */
        this.directionalLight = null;
        /**
         * The scale factor to multiply the intensity of the directional light by. Defaults to 1.0.
         */
        this.directionalLightIntensityFactor = 1.0;
        /**
         * This observable will notify when the reflection cube map is updated.
         */
        this.onReflectionCubeMapUpdatedObservable = new Observable();
        /**
         * Event Listener for "reflectionchange" events.
         */
        this._updateReflectionCubeMap = () => {
            if (!this._xrLightProbe) {
                return;
            }
            // check poll time, do not update if it has not been long enough
            if (this.options.cubeMapPollInterval) {
                const now = Date.now();
                if (now - this._cubeMapPollTime < this.options.cubeMapPollInterval) {
                    return;
                }
                this._cubeMapPollTime = now;
            }
            const graphicsBinding = this._getXRWebGLBinding();
            const lp = graphicsBinding.binding.getReflectionCubeMap(this._xrLightProbe);
            if (lp && this._reflectionCubeMap) {
                if (!this._reflectionCubeMap._texture) {
                    const internalTexture = new InternalTexture(this._xrSessionManager.scene.getEngine(), 0 /* InternalTextureSource.Unknown */);
                    internalTexture.isCube = true;
                    internalTexture.invertY = false;
                    internalTexture._useSRGBBuffer = this.options.reflectionFormat === "srgba8";
                    internalTexture.format = 5;
                    internalTexture.generateMipMaps = true;
                    internalTexture.type = this.options.reflectionFormat !== "srgba8" ? 2 : 0;
                    internalTexture.samplingMode = 3;
                    internalTexture.width = this._reflectionCubeMapTextureSize;
                    internalTexture.height = this._reflectionCubeMapTextureSize;
                    internalTexture._cachedWrapU = 1;
                    internalTexture._cachedWrapV = 1;
                    internalTexture._hardwareTexture = new WebGLHardwareTexture(lp, graphicsBinding.context);
                    this._reflectionCubeMap._texture = internalTexture;
                }
                else {
                    this._reflectionCubeMap._texture._hardwareTexture?.set(lp);
                    this._reflectionCubeMap._texture.getEngine().resetTextureCache();
                }
                this._reflectionCubeMap._texture.isReady = true;
                if (!this.options.disablePreFiltering) {
                    this._xrLightProbe.removeEventListener("reflectionchange", this._updateReflectionCubeMap);
                    // eslint-disable-next-line @typescript-eslint/no-floating-promises, github/no-then
                    this._hdrFilter.prefilter(this._reflectionCubeMap).then(() => {
                        this._xrSessionManager.scene.markAllMaterialsAsDirty(1);
                        this.onReflectionCubeMapUpdatedObservable.notifyObservers(this._reflectionCubeMap);
                        this._xrLightProbe.addEventListener("reflectionchange", this._updateReflectionCubeMap);
                    });
                }
                else {
                    this._xrSessionManager.scene.markAllMaterialsAsDirty(1);
                    this.onReflectionCubeMapUpdatedObservable.notifyObservers(this._reflectionCubeMap);
                }
            }
        };
        this.xrNativeFeatureName = "light-estimation";
        if (this.options.createDirectionalLightSource) {
            this.directionalLight = new DirectionalLight("light estimation directional", this._lightDirection, this._xrSessionManager.scene);
            this.directionalLight.position = new Vector3(0, 8, 0);
            // intensity will be set later
            this.directionalLight.intensity = 0;
            this.directionalLight.falloffType = LightConstants.FALLOFF_GLTF;
        }
        this.directionalLightIntensityFactor = this.options.directionalLightIntensityFactor ?? 1.0;
        this._hdrFilter = new HDRFiltering(this._xrSessionManager.scene.getEngine());
        // https://immersive-web.github.io/lighting-estimation/
        Logger.Warn("light-estimation is an experimental and unstable feature.");
    }
    /**
     * While the estimated cube map is expected to update over time to better reflect the user's environment as they move around those changes are unlikely to happen with every XRFrame.
     * Since creating and processing the cube map is potentially expensive, especially if mip maps are needed, you can listen to the onReflectionCubeMapUpdatedObservable to determine
     * when it has been updated.
     */
    get reflectionCubeMapTexture() {
        return this._reflectionCubeMap;
    }
    /**
     * The most recent light estimate.  Available starting on the first frame where the device provides a light probe.
     */
    get xrLightingEstimate() {
        if (this._xrLightEstimate) {
            return {
                lightColor: this._lightColor,
                lightDirection: this._lightDirection,
                lightIntensity: this._intensity,
                sphericalHarmonics: this._sphericalHarmonics,
            };
        }
        return this._xrLightEstimate;
    }
    _getXRWebGLBinding() {
        const graphicsBinding = this._xrSessionManager._getGraphicsBinding();
        if (graphicsBinding.bindingType !== 0 /* WebXRGraphicsBindingType.WebGL */) {
            throw new Error("Expected a WebGL graphics binding for WebXR Light Estimation reflections.");
        }
        return graphicsBinding;
    }
    /**
     * attach this feature
     * Will usually be called by the features manager
     *
     * @returns true if successful.
     */
    attach() {
        if (!super.attach()) {
            return false;
        }
        const isWebGPU = this._xrSessionManager.scene.getEngine().isWebGPU;
        this._reflectionCubeMapEnabled = !this.options.disableCubeMapReflection && !isWebGPU;
        if (!this.options.disableCubeMapReflection && isWebGPU && !this._webGPUReflectionWarningEmitted) {
            Logger.Warn(WebGPUReflectionWarning);
            this._webGPUReflectionWarningEmitted = true;
        }
        const reflectionFormat = this.options.reflectionFormat ?? (this._xrSessionManager.session.preferredReflectionFormat || "srgba8");
        this.options.reflectionFormat = reflectionFormat;
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        this._xrSessionManager.session
            .requestLightProbe({
            reflectionFormat,
        })
            // eslint-disable-next-line github/no-then
            .then((xrLightProbe) => {
            this._xrLightProbe = xrLightProbe;
            if (this._reflectionCubeMapEnabled) {
                if (!this._reflectionCubeMap) {
                    this._reflectionCubeMap = new BaseTexture(this._xrSessionManager.scene);
                    this._reflectionCubeMap._isCube = true;
                    this._reflectionCubeMap.coordinatesMode = 3;
                    if (this.options.setSceneEnvironmentTexture) {
                        this._xrSessionManager.scene.environmentTexture = this._reflectionCubeMap;
                    }
                }
                this._xrLightProbe.addEventListener("reflectionchange", this._updateReflectionCubeMap);
            }
        });
        return true;
    }
    /**
     * detach this feature.
     * Will usually be called by the features manager
     *
     * @returns true if successful.
     */
    detach() {
        const detached = super.detach();
        if (this._xrLightProbe !== null) {
            if (this._reflectionCubeMapEnabled) {
                this._xrLightProbe.removeEventListener("reflectionchange", this._updateReflectionCubeMap);
            }
            this._xrLightProbe = null;
        }
        this._xrLightEstimate = null;
        return detached;
    }
    /**
     * Dispose this feature and all of the resources attached
     */
    dispose() {
        super.dispose();
        this.onReflectionCubeMapUpdatedObservable.clear();
        if (this.directionalLight) {
            this.directionalLight.dispose();
            this.directionalLight = null;
        }
        if (this._reflectionCubeMap !== null) {
            if (this._reflectionCubeMap._texture) {
                this._reflectionCubeMap._texture.dispose();
            }
            this._reflectionCubeMap.dispose();
            this._reflectionCubeMap = null;
        }
    }
    _onXRFrame(_xrFrame) {
        if (this._xrLightProbe !== null) {
            if (this.options.lightEstimationPollInterval) {
                const now = Date.now();
                if (now - this._lightEstimationPollTime < this.options.lightEstimationPollInterval) {
                    return;
                }
                this._lightEstimationPollTime = now;
            }
            this._xrLightEstimate = _xrFrame.getLightEstimate(this._xrLightProbe);
            if (this._xrLightEstimate) {
                this._intensity = Math.max(1.0, this._xrLightEstimate.primaryLightIntensity.x, this._xrLightEstimate.primaryLightIntensity.y, this._xrLightEstimate.primaryLightIntensity.z);
                const rhsFactor = this._xrSessionManager.scene.useRightHandedSystem ? 1.0 : -1.0;
                // recreate the vector caches, so that the last one provided to the user will persist
                if (this.options.disableVectorReuse) {
                    this._lightDirection = new Vector3();
                    this._lightColor = new Color3();
                    if (this.directionalLight) {
                        this.directionalLight.direction = this._lightDirection;
                        this.directionalLight.diffuse = this._lightColor;
                    }
                }
                this._lightDirection.copyFromFloats(this._xrLightEstimate.primaryLightDirection.x, this._xrLightEstimate.primaryLightDirection.y, this._xrLightEstimate.primaryLightDirection.z * rhsFactor);
                this._lightColor.copyFromFloats(this._xrLightEstimate.primaryLightIntensity.x / this._intensity, this._xrLightEstimate.primaryLightIntensity.y / this._intensity, this._xrLightEstimate.primaryLightIntensity.z / this._intensity);
                this._sphericalHarmonics.updateFromFloatsArray(this._xrLightEstimate.sphericalHarmonicsCoefficients);
                if (this._reflectionCubeMap && !this.options.disableSphericalPolynomial) {
                    this._reflectionCubeMap.sphericalPolynomial = this._reflectionCubeMap.sphericalPolynomial || new SphericalPolynomial();
                    this._reflectionCubeMap.sphericalPolynomial?.updateFromHarmonics(this._sphericalHarmonics);
                }
                // direction from instead of direction to
                this._lightDirection.negateInPlace();
                // set the values after calculating them
                if (this.directionalLight) {
                    this.directionalLight.direction.copyFrom(this._lightDirection);
                    this.directionalLight.intensity = Math.min(this._intensity, 1.0) * this.directionalLightIntensityFactor;
                    this.directionalLight.diffuse.copyFrom(this._lightColor);
                }
            }
        }
    }
}
/**
 * The module's name
 */
WebXRLightEstimation.Name = WebXRFeatureName.LIGHT_ESTIMATION;
/**
 * The (Babylon) version of this module.
 * This is an integer representing the implementation version.
 * This number does not correspond to the WebXR specs version
 */
WebXRLightEstimation.Version = 1;
let _Registered = false;
/**
 * Register side effects for webXRLightEstimation.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterWebXRLightEstimation() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    // register the plugin
    WebXRFeaturesManager.AddWebXRFeature(WebXRLightEstimation.Name, (xrSessionManager, options) => {
        return () => new WebXRLightEstimation(xrSessionManager, options);
    }, WebXRLightEstimation.Version, false);
}
//# sourceMappingURL=WebXRLightEstimation.pure.js.map