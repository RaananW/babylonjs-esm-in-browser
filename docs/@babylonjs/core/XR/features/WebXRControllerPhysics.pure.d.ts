/** This file must only contain pure code and pure imports */
import { WebXRAbstractFeature } from "./WebXRAbstractFeature.js";
import { type WebXRInputSource } from "../webXRInputSource.js";
import { PhysicsImpostor } from "../../Physics/v1/physicsImpostor.pure.js";
import { type WebXRInput } from "../webXRInput.js";
import { type WebXRSessionManager } from "../webXRSessionManager.js";
import { type Nullable } from "../../types.js";
import { PhysicsAggregate } from "../../Physics/v2/physicsAggregate.js";
import { type PhysicsBody } from "../../Physics/v2/physicsBody.js";
/**
 * Options for the controller physics feature
 */
export declare class IWebXRControllerPhysicsOptions {
    /**
     * Should the headset get its own impostor
     */
    enableHeadsetImpostor?: boolean;
    /**
     * Optional parameters for the headset impostor
     */
    headsetImpostorParams?: {
        /**
         * The type of impostor to create. Default is sphere
         */
        impostorType: number;
        /**
         * the size of the impostor. Defaults to 10cm
         */
        impostorSize?: number | {
            width: number;
            height: number;
            depth: number;
        };
        /**
         * Friction definitions
         */
        friction?: number;
        /**
         * Restitution
         */
        restitution?: number;
    };
    /**
     * The physics properties of the future impostors
     */
    physicsProperties?: {
        /**
         * If set to true, a mesh impostor will be created when the controller mesh was loaded
         * Note that this requires a physics engine that supports mesh impostors!
         */
        useControllerMesh?: boolean;
        /**
         * The type of impostor to create. Default is sphere
         */
        impostorType?: number;
        /**
         * the size of the impostor. Defaults to 10cm
         */
        impostorSize?: number | {
            width: number;
            height: number;
            depth: number;
        };
        /**
         * Friction definitions
         */
        friction?: number;
        /**
         * Restitution
         */
        restitution?: number;
    };
    /**
     * the xr input to use with this pointer selection
     */
    xrInput: WebXRInput;
}
/**
 * Add physics impostor to your webxr controllers,
 * including naive calculation of their linear and angular velocity
 */
export declare class WebXRControllerPhysics extends WebXRAbstractFeature {
    private readonly _options;
    private _attachController;
    private _attachControllerV1;
    private _attachControllerV2;
    private _mapImpostorTypeToShapeType;
    private _createPhysicsImpostor;
    private _createPhysicsAggregate;
    private _controllers;
    private _debugMode;
    private _delta;
    private _headsetImpostor?;
    private _headsetMesh?;
    private _headsetAggregateV2?;
    private _lastTimestamp;
    private _physicsVersion;
    private _tmpQuaternion;
    private _tmpVector;
    /**
     * The module's name
     */
    static readonly Name: "xr-physics-controller";
    /**
     * The (Babylon) version of this module.
     * This is an integer representing the implementation version.
     * This number does not correspond to the webxr specs version
     */
    static readonly Version = 2;
    /**
     * Construct a new Controller Physics Feature
     * @param _xrSessionManager the corresponding xr session manager
     * @param _options options to create this feature with
     */
    constructor(_xrSessionManager: WebXRSessionManager, _options: IWebXRControllerPhysicsOptions);
    /**
     * @internal
     * enable debugging - will show console outputs and the impostor mesh
     */
    _enablePhysicsDebug(): void;
    /**
     * Manually add a controller (if no xrInput was provided or physics engine was not enabled)
     * @param xrController the controller to add
     */
    addController(xrController: WebXRInputSource): void;
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
     * Get the headset impostor, if enabled
     * @returns the impostor
     */
    getHeadsetImpostor(): PhysicsImpostor | undefined;
    /**
     * Get the physics impostor of a specific controller.
     * The impostor is not attached to a mesh because a mesh for each controller is not obligatory
     * @param controller the controller or the controller id of which to get the impostor
     * @returns the impostor or null
     */
    getImpostorForController(controller: WebXRInputSource | string): Nullable<PhysicsImpostor>;
    /**
     * Get the physics aggregate for a controller (v2 only)
     * @param controller the controller or the controller id
     * @returns the aggregate or null
     */
    getPhysicsAggregateForController(controller: WebXRInputSource | string): Nullable<PhysicsAggregate>;
    /**
     * Get the physics body for a controller (v2 only)
     * @param controller the controller or the controller id
     * @returns the physics body or null
     */
    getPhysicsBodyForController(controller: WebXRInputSource | string): Nullable<PhysicsBody>;
    /**
     * Get the headset physics aggregate (v2 only)
     * @returns the physics aggregate or null
     */
    getHeadsetPhysicsAggregate(): Nullable<PhysicsAggregate>;
    /**
     * Update the physics properties provided in the constructor
     * @param newProperties the new properties object
     * @param newProperties.impostorType
     * @param newProperties.impostorSize
     * @param newProperties.friction
     * @param newProperties.restitution
     */
    setPhysicsProperties(newProperties: {
        impostorType?: number;
        impostorSize?: number | {
            width: number;
            height: number;
            depth: number;
        };
        friction?: number;
        restitution?: number;
    }): void;
    protected _onXRFrame(_xrFrame: any): void;
    private _onXRFrameV1;
    private _onXRFrameV2;
    private _enableHeadsetPhysicsV1;
    private _enableHeadsetPhysicsV2;
    private _detachController;
}
/**
 * Register side effects for webXRControllerPhysics.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterWebXRControllerPhysics(): void;
