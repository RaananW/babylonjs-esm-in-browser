/** This file must only contain pure code and pure imports */
import { WebXRFeatureName, WebXRFeaturesManager } from "../webXRFeaturesManager.js";
import { Observable } from "../../Misc/observable.pure.js";
import { WebXRAbstractFeature } from "./WebXRAbstractFeature.js";
/**
 * A module that will automatically disable background meshes when entering AR and will enable them when leaving AR.
 */
export class WebXRBackgroundRemover extends WebXRAbstractFeature {
    /**
     * constructs a new background remover module
     * @param _xrSessionManager the session manager for this module
     * @param options read-only options to be used in this module
     */
    constructor(_xrSessionManager, 
    /**
     * [Empty Object] read-only options to be used in this module
     */
    options = {}) {
        super(_xrSessionManager);
        this.options = options;
        /**
         * registered observers will be triggered when the background state changes
         */
        this.onBackgroundStateChangedObservable = new Observable();
    }
    /**
     * attach this feature
     * Will usually be called by the features manager
     *
     * @returns true if successful.
     */
    attach() {
        this._setBackgroundState(false);
        return super.attach();
    }
    /**
     * detach this feature.
     * Will usually be called by the features manager
     *
     * @returns true if successful.
     */
    detach() {
        this._setBackgroundState(true);
        return super.detach();
    }
    /**
     * Dispose this feature and all of the resources attached
     */
    dispose() {
        super.dispose();
        this.onBackgroundStateChangedObservable.clear();
    }
    _onXRFrame(_xrFrame) {
        // no-op
    }
    _setBackgroundState(newState) {
        const scene = this._xrSessionManager.scene;
        if (!this.options.ignoreEnvironmentHelper) {
            if (this.options.environmentHelperRemovalFlags) {
                if (this.options.environmentHelperRemovalFlags.skyBox) {
                    const backgroundSkybox = scene.getMeshByName("BackgroundSkybox");
                    if (backgroundSkybox) {
                        backgroundSkybox.setEnabled(newState);
                    }
                }
                if (this.options.environmentHelperRemovalFlags.ground) {
                    const backgroundPlane = scene.getMeshByName("BackgroundPlane");
                    if (backgroundPlane) {
                        backgroundPlane.setEnabled(newState);
                    }
                }
            }
            else {
                const backgroundHelper = scene.getMeshByName("BackgroundHelper");
                if (backgroundHelper) {
                    backgroundHelper.setEnabled(newState);
                }
            }
        }
        if (this.options.backgroundMeshes) {
            for (const mesh of this.options.backgroundMeshes) {
                mesh.setEnabled(newState);
            }
        }
        this.onBackgroundStateChangedObservable.notifyObservers(newState);
    }
}
/**
 * The module's name
 */
WebXRBackgroundRemover.Name = WebXRFeatureName.BACKGROUND_REMOVER;
/**
 * The (Babylon) version of this module.
 * This is an integer representing the implementation version.
 * This number does not correspond to the WebXR specs version
 */
WebXRBackgroundRemover.Version = 1;
let _Registered = false;
/**
 * Register side effects for webXRBackgroundRemover.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterWebXRBackgroundRemover() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    //register the plugin
    WebXRFeaturesManager.AddWebXRFeature(WebXRBackgroundRemover.Name, (xrSessionManager, options) => {
        return () => new WebXRBackgroundRemover(xrSessionManager, options);
    }, WebXRBackgroundRemover.Version, true);
}
//# sourceMappingURL=WebXRBackgroundRemover.pure.js.map