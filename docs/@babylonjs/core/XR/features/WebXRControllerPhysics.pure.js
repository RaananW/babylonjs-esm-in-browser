/** This file must only contain pure code and pure imports */
import { WebXRAbstractFeature } from "./WebXRAbstractFeature.js";
import { Vector3, Quaternion } from "../../Maths/math.vector.pure.js";
import { PhysicsImpostor } from "../../Physics/v1/physicsImpostor.pure.js";
import { CreateSphere } from "../../Meshes/Builders/sphereBuilder.pure.js";
import { WebXRFeatureName, WebXRFeaturesManager } from "../webXRFeaturesManager.js";
import { Logger } from "../../Misc/logger.js";
import { PhysicsAggregate } from "../../Physics/v2/physicsAggregate.js";
/**
 * Options for the controller physics feature
 */
export class IWebXRControllerPhysicsOptions {
}
/**
 * Add physics impostor to your webxr controllers,
 * including naive calculation of their linear and angular velocity
 */
export class WebXRControllerPhysics extends WebXRAbstractFeature {
    _mapImpostorTypeToShapeType(impostorType) {
        // Map v1 PhysicsImpostor types to v2 PhysicsShapeType
        switch (impostorType) {
            case PhysicsImpostor.SphereImpostor:
                return 0 /* PhysicsShapeType.SPHERE */;
            case PhysicsImpostor.BoxImpostor:
                return 3 /* PhysicsShapeType.BOX */;
            case PhysicsImpostor.CapsuleImpostor:
                return 1 /* PhysicsShapeType.CAPSULE */;
            case PhysicsImpostor.CylinderImpostor:
                return 2 /* PhysicsShapeType.CYLINDER */;
            case PhysicsImpostor.MeshImpostor:
                return 6 /* PhysicsShapeType.MESH */;
            case PhysicsImpostor.ConvexHullImpostor:
                return 4 /* PhysicsShapeType.CONVEX_HULL */;
            default:
                Logger.Warn(`Unsupported impostor type ${impostorType} for v2 physics, defaulting to SPHERE`);
                return 0 /* PhysicsShapeType.SPHERE */;
        }
    }
    _createPhysicsImpostor(xrController) {
        const impostorType = this._options.physicsProperties.impostorType || PhysicsImpostor.SphereImpostor;
        const impostorSize = this._options.physicsProperties.impostorSize || 0.1;
        const impostorMesh = CreateSphere("impostor-mesh-" + xrController.uniqueId, {
            diameterX: typeof impostorSize === "number" ? impostorSize : impostorSize.width,
            diameterY: typeof impostorSize === "number" ? impostorSize : impostorSize.height,
            diameterZ: typeof impostorSize === "number" ? impostorSize : impostorSize.depth,
        });
        impostorMesh.isVisible = this._debugMode;
        impostorMesh.isPickable = false;
        impostorMesh.rotationQuaternion = new Quaternion();
        const controllerMesh = xrController.grip || xrController.pointer;
        impostorMesh.position.copyFrom(controllerMesh.position);
        impostorMesh.rotationQuaternion.copyFrom(controllerMesh.rotationQuaternion);
        const impostor = new PhysicsImpostor(impostorMesh, impostorType, {
            mass: 0,
            ...this._options.physicsProperties,
        });
        this._controllers[xrController.uniqueId] = {
            xrController,
            impostor,
            impostorMesh,
        };
    }
    _createPhysicsAggregate(xrController) {
        const impostorType = this._options.physicsProperties.impostorType || PhysicsImpostor.SphereImpostor;
        const impostorSize = this._options.physicsProperties.impostorSize || 0.1;
        const impostorMesh = CreateSphere("impostor-mesh-" + xrController.uniqueId, {
            diameterX: typeof impostorSize === "number" ? impostorSize : impostorSize.width,
            diameterY: typeof impostorSize === "number" ? impostorSize : impostorSize.height,
            diameterZ: typeof impostorSize === "number" ? impostorSize : impostorSize.depth,
        });
        impostorMesh.isVisible = this._debugMode;
        impostorMesh.isPickable = false;
        impostorMesh.rotationQuaternion = new Quaternion();
        const controllerMesh = xrController.grip || xrController.pointer;
        impostorMesh.position.copyFrom(controllerMesh.position);
        impostorMesh.rotationQuaternion.copyFrom(controllerMesh.rotationQuaternion);
        const shapeType = this._mapImpostorTypeToShapeType(impostorType);
        const aggregate = new PhysicsAggregate(impostorMesh, shapeType, {
            mass: 0,
            friction: this._options.physicsProperties?.friction ?? 0.2,
            restitution: this._options.physicsProperties?.restitution ?? 0.2,
        }, this._xrSessionManager.scene);
        aggregate.body.setMotionType(1 /* PhysicsMotionType.ANIMATED */);
        this._controllers[xrController.uniqueId] = {
            xrController,
            physicsAggregate: aggregate,
            physicsBody: aggregate.body,
            isPhysicsV2: true,
            impostorMesh,
        };
    }
    /**
     * Construct a new Controller Physics Feature
     * @param _xrSessionManager the corresponding xr session manager
     * @param _options options to create this feature with
     */
    constructor(_xrSessionManager, _options) {
        super(_xrSessionManager);
        this._options = _options;
        this._attachController = (xrController) => {
            if (this._controllers[xrController.uniqueId]) {
                // already attached
                return;
            }
            if (!this._xrSessionManager.scene.isPhysicsEnabled()) {
                Logger.Warn("physics engine not enabled, skipped. Please add this controller manually.");
            }
            if (this._physicsVersion === 2) {
                this._attachControllerV2(xrController);
            }
            else {
                this._attachControllerV1(xrController);
            }
        };
        this._attachControllerV1 = (xrController) => {
            // if no motion controller available, create impostors!
            if (this._options.physicsProperties.useControllerMesh && xrController.inputSource.gamepad) {
                xrController.onMotionControllerInitObservable.addOnce((motionController) => {
                    if (!motionController._doNotLoadControllerMesh) {
                        motionController.onModelLoadedObservable.addOnce(() => {
                            const impostor = new PhysicsImpostor(motionController.rootMesh, PhysicsImpostor.MeshImpostor, {
                                mass: 0,
                                ...this._options.physicsProperties,
                            });
                            const controllerMesh = xrController.grip || xrController.pointer;
                            this._controllers[xrController.uniqueId] = {
                                xrController,
                                impostor,
                                oldPos: controllerMesh.position.clone(),
                                oldRotation: controllerMesh.rotationQuaternion.clone(),
                            };
                        });
                    }
                    else {
                        // This controller isn't using a model, create impostors instead
                        this._createPhysicsImpostor(xrController);
                    }
                });
            }
            else {
                this._createPhysicsImpostor(xrController);
            }
        };
        this._attachControllerV2 = (xrController) => {
            // if no motion controller available, create physics aggregates!
            if (this._options.physicsProperties.useControllerMesh && xrController.inputSource.gamepad) {
                xrController.onMotionControllerInitObservable.addOnce((motionController) => {
                    if (!motionController._doNotLoadControllerMesh) {
                        motionController.onModelLoadedObservable.addOnce(() => {
                            const shapeType = this._mapImpostorTypeToShapeType(PhysicsImpostor.MeshImpostor);
                            const aggregate = new PhysicsAggregate(motionController.rootMesh, shapeType, {
                                mass: 0,
                                friction: this._options.physicsProperties?.friction ?? 0.2,
                                restitution: this._options.physicsProperties?.restitution ?? 0.2,
                            }, this._xrSessionManager.scene);
                            aggregate.body.setMotionType(1 /* PhysicsMotionType.ANIMATED */);
                            const controllerMesh = xrController.grip || xrController.pointer;
                            this._controllers[xrController.uniqueId] = {
                                xrController,
                                physicsAggregate: aggregate,
                                physicsBody: aggregate.body,
                                isPhysicsV2: true,
                                oldPos: controllerMesh.position.clone(),
                                oldRotation: controllerMesh.rotationQuaternion.clone(),
                            };
                        });
                    }
                    else {
                        // This controller isn't using a model, create physics aggregate instead
                        this._createPhysicsAggregate(xrController);
                    }
                });
            }
            else {
                this._createPhysicsAggregate(xrController);
            }
        };
        this._controllers = {};
        this._debugMode = false;
        this._delta = 0;
        this._lastTimestamp = 0;
        this._physicsVersion = 1;
        this._tmpQuaternion = new Quaternion();
        this._tmpVector = new Vector3();
        if (!this._options.physicsProperties) {
            this._options.physicsProperties = {};
        }
    }
    /**
     * @internal
     * enable debugging - will show console outputs and the impostor mesh
     */
    _enablePhysicsDebug() {
        this._debugMode = true;
        const keys = Object.keys(this._controllers);
        for (const controllerId of keys) {
            const controllerData = this._controllers[controllerId];
            if (controllerData.impostorMesh) {
                controllerData.impostorMesh.isVisible = true;
            }
        }
    }
    /**
     * Manually add a controller (if no xrInput was provided or physics engine was not enabled)
     * @param xrController the controller to add
     */
    addController(xrController) {
        this._attachController(xrController);
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
        // Detect physics version
        const physicsEngine = this._xrSessionManager.scene.getPhysicsEngine();
        if (physicsEngine) {
            this._physicsVersion = physicsEngine.getPluginVersion() || 1;
        }
        else {
            // Default to v1 if no physics engine (warning will be shown later)
            this._physicsVersion = 1;
        }
        if (!this._options.xrInput) {
            return true;
        }
        for (const controller of this._options.xrInput.controllers) {
            this._attachController(controller);
        }
        this._addNewAttachObserver(this._options.xrInput.onControllerAddedObservable, this._attachController);
        this._addNewAttachObserver(this._options.xrInput.onControllerRemovedObservable, (controller) => {
            // REMOVE the controller
            this._detachController(controller.uniqueId);
        });
        if (this._options.enableHeadsetImpostor) {
            if (this._physicsVersion === 2) {
                this._enableHeadsetPhysicsV2();
            }
            else {
                this._enableHeadsetPhysicsV1();
            }
        }
        return true;
    }
    /**
     * detach this feature.
     * Will usually be called by the features manager
     *
     * @returns true if successful.
     */
    detach() {
        if (!super.detach()) {
            return false;
        }
        const keys = Object.keys(this._controllers);
        for (const controllerId of keys) {
            this._detachController(controllerId);
        }
        if (this._headsetMesh) {
            this._headsetMesh.dispose();
        }
        // Dispose v2 aggregate if present
        if (this._headsetAggregateV2) {
            this._headsetAggregateV2.dispose();
            this._headsetAggregateV2 = undefined;
        }
        return true;
    }
    /**
     * Get the headset impostor, if enabled
     * @returns the impostor
     */
    getHeadsetImpostor() {
        return this._headsetImpostor;
    }
    /**
     * Get the physics impostor of a specific controller.
     * The impostor is not attached to a mesh because a mesh for each controller is not obligatory
     * @param controller the controller or the controller id of which to get the impostor
     * @returns the impostor or null
     */
    getImpostorForController(controller) {
        const id = typeof controller === "string" ? controller : controller.uniqueId;
        if (this._controllers[id]) {
            return this._controllers[id].impostor || null;
        }
        else {
            return null;
        }
    }
    /**
     * Get the physics aggregate for a controller (v2 only)
     * @param controller the controller or the controller id
     * @returns the aggregate or null
     */
    getPhysicsAggregateForController(controller) {
        const id = typeof controller === "string" ? controller : controller.uniqueId;
        if (this._controllers[id]) {
            return this._controllers[id].physicsAggregate || null;
        }
        else {
            return null;
        }
    }
    /**
     * Get the physics body for a controller (v2 only)
     * @param controller the controller or the controller id
     * @returns the physics body or null
     */
    getPhysicsBodyForController(controller) {
        const id = typeof controller === "string" ? controller : controller.uniqueId;
        if (this._controllers[id]) {
            return this._controllers[id].physicsBody || null;
        }
        else {
            return null;
        }
    }
    /**
     * Get the headset physics aggregate (v2 only)
     * @returns the physics aggregate or null
     */
    getHeadsetPhysicsAggregate() {
        return this._headsetAggregateV2 || null;
    }
    /**
     * Update the physics properties provided in the constructor
     * @param newProperties the new properties object
     * @param newProperties.impostorType
     * @param newProperties.impostorSize
     * @param newProperties.friction
     * @param newProperties.restitution
     */
    setPhysicsProperties(newProperties) {
        this._options.physicsProperties = {
            ...this._options.physicsProperties,
            ...newProperties,
        };
    }
    _onXRFrame(_xrFrame) {
        this._delta = this._xrSessionManager.currentTimestamp - this._lastTimestamp;
        this._lastTimestamp = this._xrSessionManager.currentTimestamp;
        if (this._physicsVersion === 2) {
            this._onXRFrameV2();
        }
        else {
            this._onXRFrameV1();
        }
    }
    _onXRFrameV1() {
        if (this._headsetMesh && this._headsetImpostor) {
            this._headsetMesh.position.copyFrom(this._options.xrInput.xrCamera.globalPosition);
            this._headsetMesh.rotationQuaternion.copyFrom(this._options.xrInput.xrCamera.absoluteRotation);
            if (this._options.xrInput.xrCamera._lastXRViewerPose?.linearVelocity) {
                const lv = this._options.xrInput.xrCamera._lastXRViewerPose.linearVelocity;
                this._tmpVector.set(lv.x, lv.y, lv.z);
                this._headsetImpostor.setLinearVelocity(this._tmpVector);
            }
            if (this._options.xrInput.xrCamera._lastXRViewerPose?.angularVelocity) {
                const av = this._options.xrInput.xrCamera._lastXRViewerPose.angularVelocity;
                this._tmpVector.set(av.x, av.y, av.z);
                this._headsetImpostor.setAngularVelocity(this._tmpVector);
            }
        }
        const keys = Object.keys(this._controllers);
        for (const controllerId of keys) {
            const controllerData = this._controllers[controllerId];
            const controllerMesh = controllerData.xrController.grip || controllerData.xrController.pointer;
            const comparedPosition = controllerData.oldPos || controllerData.impostorMesh.position;
            if (controllerData.xrController._lastXRPose?.linearVelocity) {
                const lv = controllerData.xrController._lastXRPose.linearVelocity;
                this._tmpVector.set(lv.x, lv.y, lv.z);
                controllerData.impostor.setLinearVelocity(this._tmpVector);
            }
            else {
                controllerMesh.position.subtractToRef(comparedPosition, this._tmpVector);
                this._tmpVector.scaleInPlace(1000 / this._delta);
                controllerData.impostor.setLinearVelocity(this._tmpVector);
            }
            comparedPosition.copyFrom(controllerMesh.position);
            if (this._debugMode) {
                Logger.Log([this._tmpVector, "linear"]);
            }
            const comparedQuaternion = controllerData.oldRotation || controllerData.impostorMesh.rotationQuaternion;
            if (controllerData.xrController._lastXRPose?.angularVelocity) {
                const av = controllerData.xrController._lastXRPose.angularVelocity;
                this._tmpVector.set(av.x, av.y, av.z);
                controllerData.impostor.setAngularVelocity(this._tmpVector);
            }
            else {
                if (!comparedQuaternion.equalsWithEpsilon(controllerMesh.rotationQuaternion)) {
                    // roughly based on this - https://www.gamedev.net/forums/topic/347752-quaternion-and-angular-velocity/
                    comparedQuaternion.conjugateInPlace().multiplyToRef(controllerMesh.rotationQuaternion, this._tmpQuaternion);
                    const len = Math.sqrt(this._tmpQuaternion.x * this._tmpQuaternion.x + this._tmpQuaternion.y * this._tmpQuaternion.y + this._tmpQuaternion.z * this._tmpQuaternion.z);
                    this._tmpVector.set(this._tmpQuaternion.x, this._tmpQuaternion.y, this._tmpQuaternion.z);
                    // define a better epsilon
                    if (len < 0.001) {
                        this._tmpVector.scaleInPlace(2);
                    }
                    else {
                        const angle = 2 * Math.atan2(len, this._tmpQuaternion.w);
                        this._tmpVector.scaleInPlace(angle / (len * (this._delta / 1000)));
                    }
                    controllerData.impostor.setAngularVelocity(this._tmpVector);
                }
            }
            comparedQuaternion.copyFrom(controllerMesh.rotationQuaternion);
            if (this._debugMode) {
                Logger.Log([this._tmpVector, this._tmpQuaternion, "angular"]);
            }
        }
    }
    _onXRFrameV2() {
        if (this._headsetMesh && this._headsetAggregateV2) {
            this._headsetMesh.position.copyFrom(this._options.xrInput.xrCamera.globalPosition);
            this._headsetMesh.rotationQuaternion.copyFrom(this._options.xrInput.xrCamera.absoluteRotation);
            if (this._options.xrInput.xrCamera._lastXRViewerPose?.linearVelocity) {
                const lv = this._options.xrInput.xrCamera._lastXRViewerPose.linearVelocity;
                this._tmpVector.set(lv.x, lv.y, lv.z);
                this._headsetAggregateV2.body.setLinearVelocity(this._tmpVector);
            }
            if (this._options.xrInput.xrCamera._lastXRViewerPose?.angularVelocity) {
                const av = this._options.xrInput.xrCamera._lastXRViewerPose.angularVelocity;
                this._tmpVector.set(av.x, av.y, av.z);
                this._headsetAggregateV2.body.setAngularVelocity(this._tmpVector);
            }
        }
        const keys = Object.keys(this._controllers);
        for (const controllerId of keys) {
            const controllerData = this._controllers[controllerId];
            if (!controllerData.isPhysicsV2) {
                continue;
            }
            const controllerMesh = controllerData.xrController.grip || controllerData.xrController.pointer;
            const comparedPosition = controllerData.oldPos || controllerData.impostorMesh.position;
            if (controllerData.xrController._lastXRPose?.linearVelocity) {
                const lv = controllerData.xrController._lastXRPose.linearVelocity;
                this._tmpVector.set(lv.x, lv.y, lv.z);
                controllerData.physicsBody.setLinearVelocity(this._tmpVector);
            }
            else {
                controllerMesh.position.subtractToRef(comparedPosition, this._tmpVector);
                this._tmpVector.scaleInPlace(1000 / this._delta);
                controllerData.physicsBody.setLinearVelocity(this._tmpVector);
            }
            comparedPosition.copyFrom(controllerMesh.position);
            if (this._debugMode) {
                Logger.Log([this._tmpVector, "linear"]);
            }
            const comparedQuaternion = controllerData.oldRotation || controllerData.impostorMesh.rotationQuaternion;
            if (controllerData.xrController._lastXRPose?.angularVelocity) {
                const av = controllerData.xrController._lastXRPose.angularVelocity;
                this._tmpVector.set(av.x, av.y, av.z);
                controllerData.physicsBody.setAngularVelocity(this._tmpVector);
            }
            else {
                if (!comparedQuaternion.equalsWithEpsilon(controllerMesh.rotationQuaternion)) {
                    // roughly based on this - https://www.gamedev.net/forums/topic/347752-quaternion-and-angular-velocity/
                    comparedQuaternion.conjugateInPlace().multiplyToRef(controllerMesh.rotationQuaternion, this._tmpQuaternion);
                    const len = Math.sqrt(this._tmpQuaternion.x * this._tmpQuaternion.x + this._tmpQuaternion.y * this._tmpQuaternion.y + this._tmpQuaternion.z * this._tmpQuaternion.z);
                    this._tmpVector.set(this._tmpQuaternion.x, this._tmpQuaternion.y, this._tmpQuaternion.z);
                    // define a better epsilon
                    if (len < 0.001) {
                        this._tmpVector.scaleInPlace(2);
                    }
                    else {
                        const angle = 2 * Math.atan2(len, this._tmpQuaternion.w);
                        this._tmpVector.scaleInPlace(angle / (len * (this._delta / 1000)));
                    }
                    controllerData.physicsBody.setAngularVelocity(this._tmpVector);
                }
            }
            comparedQuaternion.copyFrom(controllerMesh.rotationQuaternion);
            if (this._debugMode) {
                Logger.Log([this._tmpVector, this._tmpQuaternion, "angular"]);
            }
        }
    }
    _enableHeadsetPhysicsV1() {
        const params = this._options.headsetImpostorParams || {
            impostorType: PhysicsImpostor.SphereImpostor,
            restitution: 0.8,
            impostorSize: 0.3,
        };
        const impostorSize = params.impostorSize || 0.3;
        this._headsetMesh = CreateSphere("headset-mesh", {
            diameterX: typeof impostorSize === "number" ? impostorSize : impostorSize.width,
            diameterY: typeof impostorSize === "number" ? impostorSize : impostorSize.height,
            diameterZ: typeof impostorSize === "number" ? impostorSize : impostorSize.depth,
        });
        this._headsetMesh.rotationQuaternion = new Quaternion();
        this._headsetMesh.isVisible = false;
        this._headsetImpostor = new PhysicsImpostor(this._headsetMesh, params.impostorType, { mass: 0, ...params });
    }
    _enableHeadsetPhysicsV2() {
        const params = this._options.headsetImpostorParams || {
            impostorType: PhysicsImpostor.SphereImpostor,
            restitution: 0.8,
            impostorSize: 0.3,
        };
        const impostorSize = params.impostorSize || 0.3;
        this._headsetMesh = CreateSphere("headset-mesh", {
            diameterX: typeof impostorSize === "number" ? impostorSize : impostorSize.width,
            diameterY: typeof impostorSize === "number" ? impostorSize : impostorSize.height,
            diameterZ: typeof impostorSize === "number" ? impostorSize : impostorSize.depth,
        });
        this._headsetMesh.rotationQuaternion = new Quaternion();
        this._headsetMesh.isVisible = false;
        const shapeType = this._mapImpostorTypeToShapeType(params.impostorType);
        this._headsetAggregateV2 = new PhysicsAggregate(this._headsetMesh, shapeType, {
            mass: 0,
            friction: params.friction ?? 0.2,
            restitution: params.restitution ?? 0.8,
        }, this._xrSessionManager.scene);
        this._headsetAggregateV2.body.setMotionType(1 /* PhysicsMotionType.ANIMATED */);
        this._headsetAggregateV2.body.disableSync = true;
    }
    _detachController(xrControllerUniqueId) {
        const controllerData = this._controllers[xrControllerUniqueId];
        if (!controllerData) {
            return;
        }
        if (controllerData.impostorMesh) {
            controllerData.impostorMesh.dispose();
        }
        // Dispose v2 aggregate if present
        if (controllerData.physicsAggregate) {
            controllerData.physicsAggregate.dispose();
        }
        // remove from the map
        delete this._controllers[xrControllerUniqueId];
    }
}
/**
 * The module's name
 */
WebXRControllerPhysics.Name = WebXRFeatureName.PHYSICS_CONTROLLERS;
/**
 * The (Babylon) version of this module.
 * This is an integer representing the implementation version.
 * This number does not correspond to the webxr specs version
 */
WebXRControllerPhysics.Version = 2;
let _Registered = false;
/**
 * Register side effects for webXRControllerPhysics.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterWebXRControllerPhysics() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    //register the plugin
    WebXRFeaturesManager.AddWebXRFeature(WebXRControllerPhysics.Name, (xrSessionManager, options) => {
        return () => new WebXRControllerPhysics(xrSessionManager, options);
    }, WebXRControllerPhysics.Version, true);
}
//# sourceMappingURL=WebXRControllerPhysics.pure.js.map