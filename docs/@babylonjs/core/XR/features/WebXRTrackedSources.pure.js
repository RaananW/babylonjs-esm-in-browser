/** This file must only contain pure code and pure imports */
import { Observable } from "../../Misc/observable.pure.js";
import { WebXRFeatureName, WebXRFeaturesManager } from "../webXRFeaturesManager.js";
import { WebXRAbstractFeature } from "./WebXRAbstractFeature.js";
function IsTrackedSourcesSession(session) {
    return "trackedSources" in session;
}
/**
 * Exposes input sources that the XR runtime continues tracking while they are not active input sources.
 *
 * Tracked sources are intentionally kept separate from `XRSession.inputSources` and Babylon's normal
 * WebXR input/controller pipeline.
 * @see https://immersive-web.github.io/webxr/#dom-xrsession-trackedsources
 * @see https://playground.babylonjs.com/#JRBQVL#0
 */
export class WebXRTrackedSources extends WebXRAbstractFeature {
    /**
     * Creates a WebXR tracked sources feature.
     * @param _xrSessionManager The WebXR session manager.
     */
    constructor(_xrSessionManager) {
        super(_xrSessionManager);
        this._trackedSources = [];
        this._trackedSourcesSession = null;
        /**
         * Notifies observers when a source enters the feature's current tracked source set.
         */
        this.onTrackedSourceAddedObservable = new Observable();
        /**
         * Notifies observers when a source leaves the feature's current tracked source set, including on detach.
         */
        this.onTrackedSourceRemovedObservable = new Observable();
        this._onTrackedSourcesChanged = () => {
            this._synchronizeTrackedSources();
        };
        this.xrNativeFeatureName = "tracked-sources";
    }
    /**
     * Gets a copy of the sources currently reported by `XRSession.trackedSources`.
     *
     * These sources are not added to `XRSession.inputSources` or Babylon's controller collection.
     */
    get trackedSources() {
        return this._trackedSources.slice();
    }
    /**
     * Attaches the feature to the active XR session.
     * @param force Whether to reattach when the feature is already attached.
     * @returns `true` when attachment succeeds; otherwise `false`.
     */
    attach(force) {
        const session = this._xrSessionManager.session;
        if (!session || !IsTrackedSourcesSession(session)) {
            return this._disableAutoAttach("XRSession.trackedSources is not supported by this XR runtime.");
        }
        if (!super.attach(force)) {
            return false;
        }
        this._trackedSourcesSession = session;
        session.addEventListener("trackedsourceschange", this._onTrackedSourcesChanged);
        this._synchronizeTrackedSources();
        return true;
    }
    /**
     * Detaches the feature and clears its tracked source state.
     * @returns `true` when detachment succeeds; otherwise `false`.
     */
    detach() {
        if (!super.detach()) {
            return false;
        }
        this._trackedSourcesSession?.removeEventListener("trackedsourceschange", this._onTrackedSourcesChanged);
        this._trackedSourcesSession = null;
        this._clearTrackedSources();
        return true;
    }
    /**
     * Disposes the feature and clears its observables.
     */
    dispose() {
        super.dispose();
        this.onTrackedSourceAddedObservable.clear();
        this.onTrackedSourceRemovedObservable.clear();
    }
    _onXRFrame() { }
    _synchronizeTrackedSources() {
        const session = this._trackedSourcesSession;
        if (!this.attached || !session) {
            return;
        }
        for (let index = 0; index < this._trackedSources.length;) {
            const trackedSource = this._trackedSources[index];
            let isStillTracked = false;
            for (const nativeTrackedSource of session.trackedSources) {
                if (nativeTrackedSource === trackedSource) {
                    isStillTracked = true;
                    break;
                }
            }
            if (isStillTracked) {
                index++;
            }
            else {
                this._trackedSources.splice(index, 1);
                this.onTrackedSourceRemovedObservable.notifyObservers(trackedSource);
            }
        }
        for (const trackedSource of session.trackedSources) {
            if (this._trackedSources.indexOf(trackedSource) === -1) {
                this._trackedSources.push(trackedSource);
                this.onTrackedSourceAddedObservable.notifyObservers(trackedSource);
            }
        }
        let index = 0;
        for (const trackedSource of session.trackedSources) {
            this._trackedSources[index++] = trackedSource;
        }
    }
    _clearTrackedSources() {
        while (this._trackedSources.length > 0) {
            const trackedSource = this._trackedSources.shift();
            if (trackedSource) {
                this.onTrackedSourceRemovedObservable.notifyObservers(trackedSource);
            }
        }
    }
}
/**
 * The module's name.
 */
WebXRTrackedSources.Name = WebXRFeatureName.TRACKED_SOURCES;
/**
 * The Babylon version of this module.
 *
 * This number does not correspond to the WebXR specification version.
 */
WebXRTrackedSources.Version = 1;
let _Registered = false;
/**
 * Registers the WebXR tracked sources feature.
 *
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterWebXRTrackedSources() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    WebXRFeaturesManager.AddWebXRFeature(WebXRTrackedSources.Name, (xrSessionManager) => {
        return () => new WebXRTrackedSources(xrSessionManager);
    }, WebXRTrackedSources.Version);
}
//# sourceMappingURL=WebXRTrackedSources.pure.js.map