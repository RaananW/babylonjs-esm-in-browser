/** This file must only contain pure code and pure imports */
import { Observable } from "../../Misc/observable.pure.js";
import { type WebXRSessionManager } from "../webXRSessionManager.js";
import { WebXRAbstractFeature } from "./WebXRAbstractFeature.js";
/**
 * Exposes input sources that the XR runtime continues tracking while they are not active input sources.
 *
 * Tracked sources are intentionally kept separate from `XRSession.inputSources` and Babylon's normal
 * WebXR input/controller pipeline.
 * @see https://immersive-web.github.io/webxr/#dom-xrsession-trackedsources
 * @see https://playground.babylonjs.com/#JRBQVL#0
 */
export declare class WebXRTrackedSources extends WebXRAbstractFeature {
    private readonly _trackedSources;
    private _trackedSourcesSession;
    /**
     * The module's name.
     */
    static readonly Name: "xr-tracked-sources";
    /**
     * The Babylon version of this module.
     *
     * This number does not correspond to the WebXR specification version.
     */
    static readonly Version = 1;
    /**
     * Notifies observers when a source enters the feature's current tracked source set.
     */
    readonly onTrackedSourceAddedObservable: Observable<XRInputSource>;
    /**
     * Notifies observers when a source leaves the feature's current tracked source set, including on detach.
     */
    readonly onTrackedSourceRemovedObservable: Observable<XRInputSource>;
    /**
     * Creates a WebXR tracked sources feature.
     * @param _xrSessionManager The WebXR session manager.
     */
    constructor(_xrSessionManager: WebXRSessionManager);
    /**
     * Gets a copy of the sources currently reported by `XRSession.trackedSources`.
     *
     * These sources are not added to `XRSession.inputSources` or Babylon's controller collection.
     */
    get trackedSources(): ReadonlyArray<XRInputSource>;
    /**
     * Attaches the feature to the active XR session.
     * @param force Whether to reattach when the feature is already attached.
     * @returns `true` when attachment succeeds; otherwise `false`.
     */
    attach(force?: boolean): boolean;
    /**
     * Detaches the feature and clears its tracked source state.
     * @returns `true` when detachment succeeds; otherwise `false`.
     */
    detach(): boolean;
    /**
     * Disposes the feature and clears its observables.
     */
    dispose(): void;
    protected _onXRFrame(): void;
    private _onTrackedSourcesChanged;
    private _synchronizeTrackedSources;
    private _clearTrackedSources;
}
/**
 * Registers the WebXR tracked sources feature.
 *
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterWebXRTrackedSources(): void;
