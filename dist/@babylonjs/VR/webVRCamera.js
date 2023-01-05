import { Observable } from "../../Misc/observable.js";
import { FreeCamera } from "../../Cameras/freeCamera.js";
import { Camera } from "../../Cameras/camera.js";
import { Quaternion, Matrix, Vector3 } from "../../Maths/math.vector.js";
import { Gamepad } from "../../Gamepads/gamepad.js";
import { PoseEnabledControllerType } from "../../Gamepads/Controllers/poseEnabledController.js";
import { Node } from "../../node.js";
import { HemisphericLight } from "../../Lights/hemisphericLight.js";
import { Logger } from "../../Misc/logger.js";
import { VRMultiviewToSingleviewPostProcess } from "../../PostProcesses/vrMultiviewToSingleviewPostProcess.js";
import { Tools } from "../../Misc/tools.js";
import { setWebVRRigMode } from "../RigModes/webVRRigMode.js";
// Side effect import to add webvr support to engine
import "../../Engines/Extensions/engine.webVR.js";
Node.AddNodeConstructor("WebVRFreeCamera", (name, scene) => {
    return () => new WebVRFreeCamera(name, Vector3.Zero(), scene);
});
Node.AddNodeConstructor("WebVRGamepadCamera", (name, scene) => {
    return () => new WebVRFreeCamera(name, Vector3.Zero(), scene);
});
/**
 * This represents a WebVR camera.
 * The WebVR camera is Babylon's simple interface to interaction with Windows Mixed Reality, HTC Vive and Oculus Rift.
 * @deprecated Use WebXR instead - https://doc.babylonjs.com/features/featuresDeepDive/webXR
 * @example https://doc.babylonjs.com/features/featuresDeepDive/cameras/webVRCamera
 */
export class WebVRFreeCamera extends FreeCamera {
    /**
     * Instantiates a WebVRFreeCamera.
     * @param name The name of the WebVRFreeCamera
     * @param position The starting anchor position for the camera
     * @param scene The scene the camera belongs to
     * @param _webVROptions a set of customizable options for the webVRCamera
     */
    constructor(name, position, scene, _webVROptions = {}) {
        super(name, position, scene);
        this._webVROptions = _webVROptions;
        /**
         * @internal
         * The vrDisplay tied to the camera. See https://developer.mozilla.org/en-US/docs/Web/API/VRDisplay
         */
        this._vrDevice = null;
        /**
         * The rawPose of the vrDevice.
         */
        this.rawPose = null;
        this._specsVersion = "1.1";
        this._attached = false;
        this._descendants = [];
        // Represents device position and rotation in room space. Should only be used to help calculate babylon space values
        this._deviceRoomPosition = Vector3.Zero();
        /** @internal */
        this._deviceRoomRotationQuaternion = Quaternion.Identity();
        this._standingMatrix = null;
        /**
         * Represents device position in babylon space.
         */
        this.devicePosition = Vector3.Zero();
        /**
         * Represents device rotation in babylon space.
         */
        this.deviceRotationQuaternion = Quaternion.Identity();
        /**
         * The scale of the device to be used when translating from device space to babylon space.
         */
        this.deviceScaleFactor = 1;
        this._deviceToWorld = Matrix.Identity();
        this._worldToDevice = Matrix.Identity();
        /**
         * References to the webVR controllers for the vrDevice.
         */
        this.controllers = [];
        /**
         * Emits an event when a controller is attached.
         */
        this.onControllersAttachedObservable = new Observable();
        /**
         * Emits an event when a controller's mesh has been loaded;
         */
        this.onControllerMeshLoadedObservable = new Observable();
        /**
         * Emits an event when the HMD's pose has been updated.
         */
        this.onPoseUpdatedFromDeviceObservable = new Observable();
        this._poseSet = false;
        /**
         * If the rig cameras be used as parent instead of this camera.
         */
        this.rigParenting = true;
        this._defaultHeight = undefined;
        this._setRigMode = setWebVRRigMode.bind(null, this);
        this._detachIfAttached = () => {
            const vrDisplay = this.getEngine().getVRDevice();
            if (vrDisplay && !vrDisplay.isPresenting) {
                this.detachControl();
            }
        };
        this._workingVector = Vector3.Zero();
        this._oneVector = Vector3.One();
        this._workingMatrix = Matrix.Identity();
        this._tmpMatrix = new Matrix();
        this._cache.position = Vector3.Zero();
        if (_webVROptions.defaultHeight) {
            this._defaultHeight = _webVROptions.defaultHeight;
            this.position.y = this._defaultHeight;
        }
        this.minZ = 0.1;
        //legacy support - the compensation boolean was removed.
        if (arguments.length === 5) {
            // eslint-disable-next-line prefer-rest-params
            this._webVROptions = arguments[4];
        }
        // default webVR options
        if (this._webVROptions.trackPosition == undefined) {
            this._webVROptions.trackPosition = true;
        }
        if (this._webVROptions.controllerMeshes == undefined) {
            this._webVROptions.controllerMeshes = true;
        }
        if (this._webVROptions.defaultLightingOnControllers == undefined) {
            this._webVROptions.defaultLightingOnControllers = true;
        }
        this.rotationQuaternion = new Quaternion();
        if (this._webVROptions && this._webVROptions.positionScale) {
            this.deviceScaleFactor = this._webVROptions.positionScale;
        }
        //enable VR
        const engine = this.getEngine();
        this._onVREnabled = (success) => {
            if (success) {
                this.initControllers();
            }
        };
        engine.onVRRequestPresentComplete.add(this._onVREnabled);
        engine.initWebVR().add((event) => {
            if (!event.vrDisplay || this._vrDevice === event.vrDisplay) {
                return;
            }
            this._vrDevice = event.vrDisplay;
            //reset the rig parameters.
            this.setCameraRigMode(Camera.RIG_MODE_WEBVR, { parentCamera: this, vrDisplay: this._vrDevice, frameData: this._frameData, specs: this._specsVersion });
            if (this._attached) {
                this.getEngine().enableVR(this._webVROptions);
            }
        });
        if (typeof VRFrameData !== "undefined") {
            this._frameData = new VRFrameData();
        }
        if (_webVROptions.useMultiview) {
            if (!this.getScene().getEngine().getCaps().multiview) {
                Logger.Warn("Multiview is not supported, falling back to standard rendering");
                this._useMultiviewToSingleView = false;
            }
            else {
                this._useMultiviewToSingleView = true;
                this._rigPostProcess = new VRMultiviewToSingleviewPostProcess("VRMultiviewToSingleview", this, 1.0);
            }
        }
        /**
         * The idea behind the following lines:
         * objects that have the camera as parent should actually have the rig cameras as a parent.
         * BUT, each of those cameras has a different view matrix, which means that if we set the parent to the first rig camera,
         * the second will not show it correctly.
         *
         * To solve this - each object that has the camera as parent will be added to a protected array.
         * When the rig camera renders, it will take this array and set all of those to be its children.
         * This way, the right camera will be used as a parent, and the mesh will be rendered correctly.
         * Amazing!
         */
        this.getScene().onBeforeCameraRenderObservable.add((camera) => {
            if (camera.parent === this && this.rigParenting) {
                this._descendants = this.getDescendants(true, (n) => {
                    // don't take the cameras or the controllers!
                    const isController = this.controllers.some((controller) => {
                        return controller._mesh === n;
                    });
                    const isRigCamera = this._rigCameras.indexOf(n) !== -1;
                    return !isController && !isRigCamera;
                });
                this._descendants.forEach((node) => {
                    node.parent = camera;
                });
            }
        });
        this.getScene().onAfterCameraRenderObservable.add((camera) => {
            if (camera.parent === this && this.rigParenting) {
                this._descendants.forEach((node) => {
                    node.parent = this;
                });
            }
        });
    }
    /**
     * Gets the device distance from the ground in meters.
     * @returns the distance in meters from the vrDevice to ground in device space. If standing matrix is not supported for the vrDevice 0 is returned.
     */
    deviceDistanceToRoomGround() {
        if (this._standingMatrix) {
            // Add standing matrix offset to get real offset from ground in room
            this._standingMatrix.getTranslationToRef(this._workingVector);
            return this._deviceRoomPosition.y + this._workingVector.y;
        }
        //If VRDisplay does not inform stage parameters and no default height is set we fallback to zero.
        return this._defaultHeight || 0;
    }
    /**
     * Enables the standing matrix when supported. This can be used to position the user's view the correct height from the ground.
     * @param callback will be called when the standing matrix is set. Callback parameter is if the standing matrix is supported.
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    useStandingMatrix(callback = (bool) => { }) {
        // Use standing matrix if available
        this.getEngine()
            .initWebVRAsync()
            .then((result) => {
            if (!result.vrDisplay || !result.vrDisplay.stageParameters || !result.vrDisplay.stageParameters.sittingToStandingTransform || !this._webVROptions.trackPosition) {
                callback(false);
            }
            else {
                this._standingMatrix = new Matrix();
                Matrix.FromFloat32ArrayToRefScaled(result.vrDisplay.stageParameters.sittingToStandingTransform, 0, 1, this._standingMatrix);
                if (!this.getScene().useRightHandedSystem) {
                    if (this._standingMatrix) {
                        this._standingMatrix.toggleModelMatrixHandInPlace();
                    }
                }
                callback(true);
            }
        });
    }
    /**
     * Enables the standing matrix when supported. This can be used to position the user's view the correct height from the ground.
     * @returns A promise with a boolean set to if the standing matrix is supported.
     */
    useStandingMatrixAsync() {
        return new Promise((res) => {
            this.useStandingMatrix((supported) => {
                res(supported);
            });
        });
    }
    /**
     * Disposes the camera
     */
    dispose() {
        this._detachIfAttached();
        this.getEngine().onVRRequestPresentComplete.removeCallback(this._onVREnabled);
        if (this._updateCacheWhenTrackingDisabledObserver) {
            this._scene.onBeforeRenderObservable.remove(this._updateCacheWhenTrackingDisabledObserver);
        }
        super.dispose();
    }
    /**
     * Gets a vrController by name.
     * @param name The name of the controller to retrieve
     * @returns the controller matching the name specified or null if not found
     */
    getControllerByName(name) {
        for (const gp of this.controllers) {
            if (gp.hand === name) {
                return gp;
            }
        }
        return null;
    }
    /**
     * The controller corresponding to the users left hand.
     */
    get leftController() {
        if (!this._leftController) {
            this._leftController = this.getControllerByName("left");
        }
        return this._leftController;
    }
    /**
     * The controller corresponding to the users right hand.
     */
    get rightController() {
        if (!this._rightController) {
            this._rightController = this.getControllerByName("right");
        }
        return this._rightController;
    }
    /**
     * Casts a ray forward from the vrCamera's gaze.
     * @param length Length of the ray (default: 100)
     * @returns the ray corresponding to the gaze
     */
    getForwardRay(length = 100) {
        if (this.leftCamera) {
            // Use left eye to avoid computation to compute center on every call
            return super.getForwardRay(length, this.leftCamera.getWorldMatrix(), this.leftCamera.globalPosition); // Need the actual rendered camera
        }
        else {
            return super.getForwardRay(length);
        }
    }
    /**
     * @internal
     * Updates the camera based on device's frame data
     */
    _checkInputs() {
        if (this._vrDevice && this._vrDevice.isPresenting) {
            this._vrDevice.getFrameData(this._frameData);
            this.updateFromDevice(this._frameData.pose);
        }
        super._checkInputs();
    }
    /**
     * Updates the poseControlled values based on the input device pose.
     * @param poseData Pose coming from the device
     */
    updateFromDevice(poseData) {
        if (poseData && poseData.orientation && poseData.orientation.length === 4) {
            this.rawPose = poseData;
            this._deviceRoomRotationQuaternion.copyFromFloats(poseData.orientation[0], poseData.orientation[1], -poseData.orientation[2], -poseData.orientation[3]);
            if (this.getScene().useRightHandedSystem) {
                this._deviceRoomRotationQuaternion.z *= -1;
                this._deviceRoomRotationQuaternion.w *= -1;
            }
            if (this._webVROptions.trackPosition && this.rawPose.position) {
                this._deviceRoomPosition.copyFromFloats(this.rawPose.position[0], this.rawPose.position[1], -this.rawPose.position[2]);
                if (this.getScene().useRightHandedSystem) {
                    this._deviceRoomPosition.z *= -1;
                }
            }
            this._poseSet = true;
        }
    }
    /**
     * WebVR's attach control will start broadcasting frames to the device.
     * Note that in certain browsers (chrome for example) this function must be called
     * within a user-interaction callback. Example:
     * <pre> scene.onPointerDown = function() { camera.attachControl(canvas); }</pre>
     *
     * @param noPreventDefault prevent the default html element operation when attaching the vrDevice
     */
    attachControl(noPreventDefault) {
        // eslint-disable-next-line prefer-rest-params
        noPreventDefault = Tools.BackCompatCameraNoPreventDefault(arguments);
        super.attachControl(noPreventDefault);
        this._attached = true;
        noPreventDefault = Camera.ForceAttachControlToAlwaysPreventDefault ? false : noPreventDefault;
        if (this._vrDevice) {
            this.getEngine().enableVR(this._webVROptions);
        }
        const hostWindow = this._scene.getEngine().getHostWindow();
        if (hostWindow) {
            hostWindow.addEventListener("vrdisplaypresentchange", this._detachIfAttached);
        }
    }
    /**
     * Detach the current controls from the specified dom element.
     */
    detachControl() {
        this.getScene().gamepadManager.onGamepadConnectedObservable.remove(this._onGamepadConnectedObserver);
        this.getScene().gamepadManager.onGamepadDisconnectedObservable.remove(this._onGamepadDisconnectedObserver);
        super.detachControl();
        this._attached = false;
        this.getEngine().disableVR();
        window.removeEventListener("vrdisplaypresentchange", this._detachIfAttached);
    }
    /**
     * @returns the name of this class
     */
    getClassName() {
        return "WebVRFreeCamera";
    }
    /**
     * Calls resetPose on the vrDisplay
     * See: https://developer.mozilla.org/en-US/docs/Web/API/VRDisplay/resetPose
     */
    resetToCurrentRotation() {
        //uses the vrDisplay's "resetPose()".
        //pitch and roll won't be affected.
        this._vrDevice.resetPose();
    }
    /**
     * @internal
     * Updates the rig cameras (left and right eye)
     */
    _updateRigCameras() {
        const camLeft = this._rigCameras[0];
        const camRight = this._rigCameras[1];
        camLeft.rotationQuaternion.copyFrom(this._deviceRoomRotationQuaternion);
        camRight.rotationQuaternion.copyFrom(this._deviceRoomRotationQuaternion);
        camLeft.position.copyFrom(this._deviceRoomPosition);
        camRight.position.copyFrom(this._deviceRoomPosition);
    }
    // Remove translation from 6dof headset if trackposition is set to false
    _correctPositionIfNotTrackPosition(matrix, isViewMatrix = false) {
        if (this.rawPose && this.rawPose.position && !this._webVROptions.trackPosition) {
            Matrix.TranslationToRef(this.rawPose.position[0], this.rawPose.position[1], -this.rawPose.position[2], this._tmpMatrix);
            if (!isViewMatrix) {
                this._tmpMatrix.invert();
            }
            this._tmpMatrix.multiplyToRef(matrix, matrix);
        }
    }
    /**
     * @internal
     * Updates the cached values of the camera
     * @param ignoreParentClass ignores updating the parent class's cache (default: false)
     */
    _updateCache(ignoreParentClass) {
        if (!this.rotationQuaternion.equals(this._cache.rotationQuaternion) || !this.position.equals(this._cache.position)) {
            // Update to ensure devicePosition is up to date with most recent _deviceRoomPosition
            if (!this._updateCacheCalled) {
                // make sure it is only called once per loop. this.update() might cause an infinite loop.
                this._updateCacheCalled = true;
                this.update();
            }
            // Set working vector to the device position in room space rotated by the new rotation
            this.rotationQuaternion.toRotationMatrix(this._workingMatrix);
            Vector3.TransformCoordinatesToRef(this._deviceRoomPosition, this._workingMatrix, this._workingVector);
            // Subtract this vector from the current device position in world to get the translation for the device world matrix
            this.devicePosition.subtractToRef(this._workingVector, this._workingVector);
            Matrix.ComposeToRef(this._oneVector, this.rotationQuaternion, this._workingVector, this._deviceToWorld);
            // Add translation from anchor position
            this._deviceToWorld.getTranslationToRef(this._workingVector);
            this._workingVector.addInPlace(this.position);
            this._workingVector.subtractInPlace(this._cache.position);
            this._deviceToWorld.setTranslation(this._workingVector);
            // Set an inverted matrix to be used when updating the camera
            this._deviceToWorld.invertToRef(this._worldToDevice);
            // Update the gamepad to ensure the mesh is updated on the same frame as camera
            this.controllers.forEach((controller) => {
                controller._deviceToWorld.copyFrom(this._deviceToWorld);
                this._correctPositionIfNotTrackPosition(controller._deviceToWorld);
                controller.update();
            });
        }
        if (!ignoreParentClass) {
            super._updateCache();
        }
        this._updateCacheCalled = false;
    }
    /**
     * @internal
     * Get current device position in babylon world
     */
    _computeDevicePosition() {
        Vector3.TransformCoordinatesToRef(this._deviceRoomPosition, this._deviceToWorld, this.devicePosition);
    }
    /**
     * Updates the current device position and rotation in the babylon world
     */
    update() {
        this._computeDevicePosition();
        // Get current device rotation in babylon world
        Matrix.FromQuaternionToRef(this._deviceRoomRotationQuaternion, this._workingMatrix);
        this._workingMatrix.multiplyToRef(this._deviceToWorld, this._workingMatrix);
        Quaternion.FromRotationMatrixToRef(this._workingMatrix, this.deviceRotationQuaternion);
        if (this._poseSet) {
            this.onPoseUpdatedFromDeviceObservable.notifyObservers(null);
        }
        super.update();
    }
    /**
     * @internal
     * Gets the view matrix of this camera (Always set to identity as left and right eye cameras contain the actual view matrix)
     * @returns an identity matrix
     */
    _getViewMatrix() {
        return Matrix.Identity();
    }
    /**
     * This function is called by the two RIG cameras.
     * 'this' is the left or right camera (and NOT (!!!) the WebVRFreeCamera instance)
     * @internal
     */
    _getWebVRViewMatrix() {
        // Update the parent camera prior to using a child camera to avoid desynchronization
        const parentCamera = this._cameraRigParams["parentCamera"];
        parentCamera._updateCache();
        //WebVR 1.1
        const viewArray = this._cameraRigParams["left"] ? this._cameraRigParams["frameData"].leftViewMatrix : this._cameraRigParams["frameData"].rightViewMatrix;
        Matrix.FromArrayToRef(viewArray, 0, this._webvrViewMatrix);
        if (!this.getScene().useRightHandedSystem) {
            this._webvrViewMatrix.toggleModelMatrixHandInPlace();
        }
        // update the camera rotation matrix
        this._webvrViewMatrix.getRotationMatrixToRef(this._cameraRotationMatrix);
        Vector3.TransformCoordinatesToRef(this._referencePoint, this._cameraRotationMatrix, this._transformedReferencePoint);
        // Computing target and final matrix
        this.position.addToRef(this._transformedReferencePoint, this._currentTarget);
        // should the view matrix be updated with scale and position offset?
        if (parentCamera.deviceScaleFactor !== 1) {
            this._webvrViewMatrix.invert();
            // scale the position, if set
            if (parentCamera.deviceScaleFactor) {
                this._webvrViewMatrix.multiplyAtIndex(12, parentCamera.deviceScaleFactor);
                this._webvrViewMatrix.multiplyAtIndex(13, parentCamera.deviceScaleFactor);
                this._webvrViewMatrix.multiplyAtIndex(14, parentCamera.deviceScaleFactor);
            }
            this._webvrViewMatrix.invert();
        }
        // Remove translation from 6dof headset if trackposition is set to false
        parentCamera._correctPositionIfNotTrackPosition(this._webvrViewMatrix, true);
        parentCamera._worldToDevice.multiplyToRef(this._webvrViewMatrix, this._webvrViewMatrix);
        // Compute global position
        this._workingMatrix = this._workingMatrix || Matrix.Identity();
        this._webvrViewMatrix.invertToRef(this._workingMatrix);
        this._workingMatrix.multiplyToRef(parentCamera.getWorldMatrix(), this._workingMatrix);
        this._workingMatrix.getTranslationToRef(this._globalPosition);
        this._markSyncedWithParent();
        return this._webvrViewMatrix;
    }
    /** @internal */
    _getWebVRProjectionMatrix() {
        const parentCamera = this.parent;
        parentCamera._vrDevice.depthNear = parentCamera.minZ;
        parentCamera._vrDevice.depthFar = parentCamera.maxZ;
        const projectionArray = this._cameraRigParams["left"] ? this._cameraRigParams["frameData"].leftProjectionMatrix : this._cameraRigParams["frameData"].rightProjectionMatrix;
        Matrix.FromArrayToRef(projectionArray, 0, this._projectionMatrix);
        //babylon compatible matrix
        if (!this.getScene().useRightHandedSystem) {
            this._projectionMatrix.toggleProjectionMatrixHandInPlace();
        }
        return this._projectionMatrix;
    }
    /**
     * Initializes the controllers and their meshes
     */
    initControllers() {
        this.controllers.length = 0;
        const manager = this.getScene().gamepadManager;
        this._onGamepadDisconnectedObserver = manager.onGamepadDisconnectedObservable.add((gamepad) => {
            if (gamepad.type === Gamepad.POSE_ENABLED) {
                const webVrController = gamepad;
                if (webVrController.defaultModel) {
                    webVrController.defaultModel.setEnabled(false);
                }
                if (webVrController.hand === "right") {
                    this._rightController = null;
                }
                if (webVrController.hand === "left") {
                    this._leftController = null;
                }
                const controllerIndex = this.controllers.indexOf(webVrController);
                if (controllerIndex !== -1) {
                    this.controllers.splice(controllerIndex, 1);
                }
            }
        });
        this._onGamepadConnectedObserver = manager.onGamepadConnectedObservable.add((gamepad) => {
            if (gamepad.type === Gamepad.POSE_ENABLED) {
                const webVrController = gamepad;
                if (!this._webVROptions.trackPosition) {
                    webVrController._disableTrackPosition(new Vector3(webVrController.hand == "left" ? -0.15 : 0.15, -0.5, 0.25));
                    // Cache must be updated before rendering controllers to avoid them being one frame behind
                    if (!this._updateCacheWhenTrackingDisabledObserver) {
                        this._updateCacheWhenTrackingDisabledObserver = this._scene.onBeforeRenderObservable.add(() => {
                            this._updateCache();
                        });
                    }
                }
                webVrController.deviceScaleFactor = this.deviceScaleFactor;
                webVrController._deviceToWorld.copyFrom(this._deviceToWorld);
                this._correctPositionIfNotTrackPosition(webVrController._deviceToWorld);
                if (this._webVROptions.controllerMeshes) {
                    if (webVrController.defaultModel) {
                        webVrController.defaultModel.setEnabled(true);
                    }
                    else {
                        // Load the meshes
                        webVrController.initControllerMesh(this.getScene(), (loadedMesh) => {
                            loadedMesh.scaling.scaleInPlace(this.deviceScaleFactor);
                            this.onControllerMeshLoadedObservable.notifyObservers(webVrController);
                            if (this._webVROptions.defaultLightingOnControllers) {
                                if (!this._lightOnControllers) {
                                    this._lightOnControllers = new HemisphericLight("vrControllersLight", new Vector3(0, 1, 0), this.getScene());
                                }
                                const activateLightOnSubMeshes = function (mesh, light) {
                                    const children = mesh.getChildren();
                                    if (children && children.length !== 0) {
                                        children.forEach((mesh) => {
                                            light.includedOnlyMeshes.push(mesh);
                                            activateLightOnSubMeshes(mesh, light);
                                        });
                                    }
                                };
                                this._lightOnControllers.includedOnlyMeshes.push(loadedMesh);
                                activateLightOnSubMeshes(loadedMesh, this._lightOnControllers);
                            }
                        });
                    }
                }
                webVrController.attachToPoseControlledCamera(this);
                // since this is async - sanity check. Is the controller already stored?
                if (this.controllers.indexOf(webVrController) === -1) {
                    //add to the controllers array
                    this.controllers.push(webVrController);
                    // Forced to add some control code for Vive as it doesn't always fill properly the "hand" property
                    // Sometimes, both controllers are set correctly (left and right), sometimes none, sometimes only one of them...
                    // So we're overriding setting left & right manually to be sure
                    let firstViveWandDetected = false;
                    for (let i = 0; i < this.controllers.length; i++) {
                        if (this.controllers[i].controllerType === PoseEnabledControllerType.VIVE) {
                            if (!firstViveWandDetected) {
                                firstViveWandDetected = true;
                                this.controllers[i].hand = "left";
                            }
                            else {
                                this.controllers[i].hand = "right";
                            }
                        }
                    }
                    //did we find enough controllers? Great! let the developer know.
                    if (this.controllers.length >= 2) {
                        this.onControllersAttachedObservable.notifyObservers(this.controllers);
                    }
                }
            }
        });
    }
}
//# sourceMappingURL=webVRCamera.js.map