/** This file must only contain pure code and pure imports */
import { type WebXRSessionManager } from "../webXRSessionManager.js";
import { type AbstractMesh } from "../../Meshes/abstractMesh.pure.js";
import { Observable } from "../../Misc/observable.pure.js";
import { WebXRAbstractFeature } from "./WebXRAbstractFeature.js";
/**
 * Options interface for the background remover plugin
 */
export interface IWebXRBackgroundRemoverOptions {
    /**
     * Further background meshes to disable when entering AR
     */
    backgroundMeshes?: AbstractMesh[];
    /**
     * flags to configure the removal of the environment helper.
     * If not set, the entire background will be removed. If set, flags should be set as well.
     */
    environmentHelperRemovalFlags?: {
        /**
         * Should the skybox be removed (default false)
         */
        skyBox?: boolean;
        /**
         * Should the ground be removed (default false)
         */
        ground?: boolean;
    };
    /**
     * don't disable the environment helper
     */
    ignoreEnvironmentHelper?: boolean;
}
/**
 * A module that will automatically disable background meshes when entering AR and will enable them when leaving AR.
 */
export declare class WebXRBackgroundRemover extends WebXRAbstractFeature {
    /**
     * [Empty Object] read-only options to be used in this module
     */
    readonly options: IWebXRBackgroundRemoverOptions;
    /**
     * The module's name
     */
    static readonly Name: "xr-background-remover";
    /**
     * The (Babylon) version of this module.
     * This is an integer representing the implementation version.
     * This number does not correspond to the WebXR specs version
     */
    static readonly Version = 1;
    /**
     * registered observers will be triggered when the background state changes
     */
    onBackgroundStateChangedObservable: Observable<boolean>;
    /**
     * constructs a new background remover module
     * @param _xrSessionManager the session manager for this module
     * @param options read-only options to be used in this module
     */
    constructor(_xrSessionManager: WebXRSessionManager, 
    /**
     * [Empty Object] read-only options to be used in this module
     */
    options?: IWebXRBackgroundRemoverOptions);
    /**
     * attach this feature
     * Will usually be called by the features manager
     *
     * @returns true if successful.
     */
    attach(): boolean;
    /**
     * detach this feature.
     * Will usually be called by the features manager
     *
     * @returns true if successful.
     */
    detach(): boolean;
    /**
     * Dispose this feature and all of the resources attached
     */
    dispose(): void;
    protected _onXRFrame(_xrFrame: XRFrame): void;
    private _setBackgroundState;
}
/**
 * Register side effects for webXRBackgroundRemover.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterWebXRBackgroundRemover(): void;
