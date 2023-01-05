import { Logger } from "../../Misc/logger.js";
import { Observable } from "../../Misc/observable.js";
import { FreeCamera } from "../../Cameras/freeCamera.js";
import { TargetCamera } from "../../Cameras/targetCamera.js";
import { DeviceOrientationCamera } from "../../Cameras/deviceOrientationCamera.js";
import { VRDeviceOrientationFreeCamera } from "../../Cameras/VR/vrDeviceOrientationFreeCamera.js";
import { WebVRFreeCamera } from "../../Cameras/VR/webVRCamera.js";
import { PointerEventTypes } from "../../Events/pointerEvents.js";
import { Quaternion, Matrix, Vector3 } from "../../Maths/math.vector.js";
import { Color3, Color4 } from "../../Maths/math.color.js";
import { Gamepad } from "../../Gamepads/gamepad.js";
import { PoseEnabledController, PoseEnabledControllerType } from "../../Gamepads/Controllers/poseEnabledController.js";
import { WebVRController } from "../../Gamepads/Controllers/webVRController.js";
import { Xbox360Button } from "../../Gamepads/xboxGamepad.js";
import { Mesh } from "../../Meshes/mesh.js";
import { Ray } from "../../Culling/ray.js";
import { ImageProcessingConfiguration } from "../../Materials/imageProcessingConfiguration.js";
import { StandardMaterial } from "../../Materials/standardMaterial.js";
import { DynamicTexture } from "../../Materials/Textures/dynamicTexture.js";
import { ImageProcessingPostProcess } from "../../PostProcesses/imageProcessingPostProcess.js";
import { SineEase, EasingFunction, CircleEase } from "../../Animations/easing.js";
import { Animation } from "../../Animations/animation.js";
import { VRCameraMetrics } from "../../Cameras/VR/vrCameraMetrics.js";
import "../../Gamepads/gamepadSceneComponent.js";
import "../../Animations/animatable.js";
import { Axis } from "../../Maths/math.axis.js";
import { WebXRSessionManager } from "../../XR/webXRSessionManager.js";
import { WebXRState } from "../../XR/webXRTypes.js";
import { CreateCylinder } from "../../Meshes/Builders/cylinderBuilder.js";
import { CreateTorus } from "../../Meshes/Builders/torusBuilder.js";
import { CreateGround } from "../../Meshes/Builders/groundBuilder.js";
class VRExperienceHelperGazer {
    constructor(scene, gazeTrackerToClone = null) {
        this.scene = scene;
        /** @internal */
        this._pointerDownOnMeshAsked = false;
        /** @internal */
        this._isActionableMesh = false;
        /** @internal */
        this._teleportationRequestInitiated = false;
        /** @internal */
        this._teleportationBackRequestInitiated = false;
        /** @internal */
        this._rotationRightAsked = false;
        /** @internal */
        this._rotationLeftAsked = false;
        /** @internal */
        this._dpadPressed = true;
        /** @internal */
        this._activePointer = false;
        this._id = VRExperienceHelperGazer._IdCounter++;
        // Gaze tracker
        if (!gazeTrackerToClone) {
            this._gazeTracker = CreateTorus("gazeTracker", {
                diameter: 0.0035,
                thickness: 0.0025,
                tessellation: 20,
                updatable: false,
            }, scene);
            this._gazeTracker.bakeCurrentTransformIntoVertices();
            this._gazeTracker.isPickable = false;
            this._gazeTracker.isVisible = false;
            const targetMat = new StandardMaterial("targetMat", scene);
            targetMat.specularColor = Color3.Black();
            targetMat.emissiveColor = new Color3(0.7, 0.7, 0.7);
            targetMat.backFaceCulling = false;
            this._gazeTracker.material = targetMat;
        }
        else {
            this._gazeTracker = gazeTrackerToClone.clone("gazeTracker");
        }
    }
    /**
     * @internal
     */
    _getForwardRay(length) {
        return new Ray(Vector3.Zero(), new Vector3(0, 0, length));
    }
    /** @internal */
    _selectionPointerDown() {
        this._pointerDownOnMeshAsked = true;
        if (this._currentHit) {
            this.scene.simulatePointerDown(this._currentHit, { pointerId: this._id });
        }
    }
    /** @internal */
    _selectionPointerUp() {
        if (this._currentHit) {
            this.scene.simulatePointerUp(this._currentHit, { pointerId: this._id });
        }
        this._pointerDownOnMeshAsked = false;
    }
    /** @internal */
    _activatePointer() {
        this._activePointer = true;
    }
    /** @internal */
    _deactivatePointer() {
        this._activePointer = false;
    }
    /**
     * @internal
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _updatePointerDistance(distance = 100) { }
    dispose() {
        this._interactionsEnabled = false;
        this._teleportationEnabled = false;
        if (this._gazeTracker) {
            this._gazeTracker.dispose();
        }
    }
}
VRExperienceHelperGazer._IdCounter = 0;
class VRExperienceHelperControllerGazer extends VRExperienceHelperGazer {
    constructor(webVRController, scene, gazeTrackerToClone) {
        super(scene, gazeTrackerToClone);
        this.webVRController = webVRController;
        // Laser pointer
        this._laserPointer = CreateCylinder("laserPointer", {
            updatable: false,
            height: 1,
            diameterTop: 0.004,
            diameterBottom: 0.0002,
            tessellation: 20,
            subdivisions: 1,
        }, scene);
        const laserPointerMaterial = new StandardMaterial("laserPointerMat", scene);
        laserPointerMaterial.emissiveColor = new Color3(0.7, 0.7, 0.7);
        laserPointerMaterial.alpha = 0.6;
        this._laserPointer.material = laserPointerMaterial;
        this._laserPointer.rotation.x = Math.PI / 2;
        this._laserPointer.position.z = -0.5;
        this._laserPointer.isVisible = false;
        this._laserPointer.isPickable = false;
        if (!webVRController.mesh) {
            // Create an empty mesh that is used prior to loading the high quality model
            const preloadMesh = new Mesh("preloadControllerMesh", scene);
            const preloadPointerPose = new Mesh(PoseEnabledController.POINTING_POSE, scene);
            preloadPointerPose.rotation.x = -0.7;
            preloadMesh.addChild(preloadPointerPose);
            webVRController.attachToMesh(preloadMesh);
        }
        this._setLaserPointerParent(webVRController.mesh);
        this._meshAttachedObserver = webVRController._meshAttachedObservable.add((mesh) => {
            this._setLaserPointerParent(mesh);
        });
    }
    _getForwardRay(length) {
        return this.webVRController.getForwardRay(length);
    }
    /** @internal */
    _activatePointer() {
        super._activatePointer();
        this._laserPointer.isVisible = true;
    }
    /** @internal */
    _deactivatePointer() {
        super._deactivatePointer();
        this._laserPointer.isVisible = false;
    }
    /**
     * @internal
     */
    _setLaserPointerColor(color) {
        this._laserPointer.material.emissiveColor = color;
    }
    /**
     * @internal
     */
    _setLaserPointerLightingDisabled(disabled) {
        this._laserPointer.material.disableLighting = disabled;
    }
    /**
     * @internal
     */
    _setLaserPointerParent(mesh) {
        const makeNotPick = (root) => {
            root.isPickable = false;
            root.getChildMeshes().forEach((c) => {
                makeNotPick(c);
            });
        };
        makeNotPick(mesh);
        const meshChildren = mesh.getChildren(undefined, false);
        let laserParent = mesh;
        this.webVRController._pointingPoseNode = null;
        for (let i = 0; i < meshChildren.length; i++) {
            if (meshChildren[i].name && meshChildren[i].name.indexOf(PoseEnabledController.POINTING_POSE) >= 0) {
                laserParent = meshChildren[i];
                this.webVRController._pointingPoseNode = laserParent;
                break;
            }
        }
        this._laserPointer.parent = laserParent;
    }
    _updatePointerDistance(distance = 100) {
        this._laserPointer.scaling.y = distance;
        this._laserPointer.position.z = -distance / 2;
    }
    dispose() {
        super.dispose();
        this._laserPointer.dispose();
        if (this._meshAttachedObserver) {
            this.webVRController._meshAttachedObservable.remove(this._meshAttachedObserver);
        }
    }
}
class VRExperienceHelperCameraGazer extends VRExperienceHelperGazer {
    constructor(_getCamera, scene) {
        super(scene);
        this._getCamera = _getCamera;
    }
    _getForwardRay(length) {
        const camera = this._getCamera();
        if (camera) {
            return camera.getForwardRay(length);
        }
        else {
            return new Ray(Vector3.Zero(), Vector3.Forward());
        }
    }
}
/**
 * Event containing information after VR has been entered
 */
export class OnAfterEnteringVRObservableEvent {
}
/**
 * Helps to quickly add VR support to an existing scene.
 * See https://doc.babylonjs.com/features/featuresDeepDive/cameras/webVRHelper
 * @deprecated
 */
export class VRExperienceHelper {
    /**
     * Instantiates a VRExperienceHelper.
     * Helps to quickly add VR support to an existing scene.
     * @param scene The scene the VRExperienceHelper belongs to.
     * @param webVROptions Options to modify the vr experience helper's behavior.
     */
    constructor(scene, 
    /** Options to modify the vr experience helper's behavior. */
    webVROptions = {}) {
        this.webVROptions = webVROptions;
        // Can the system support WebVR, even if a headset isn't plugged in?
        this._webVRsupported = false;
        // If WebVR is supported, is a headset plugged in and are we ready to present?
        this._webVRready = false;
        // Are we waiting for the requestPresent callback to complete?
        this._webVRrequesting = false;
        // Are we presenting to the headset right now? (this is the vrDevice state)
        this._webVRpresenting = false;
        // Are we presenting in the fullscreen fallback?
        this._fullscreenVRpresenting = false;
        /**
         * Gets or sets a boolean indicating that gaze can be enabled even if pointer lock is not engage (useful on iOS where fullscreen mode and pointer lock are not supported)
         */
        this.enableGazeEvenWhenNoPointerLock = false;
        /**
         * Gets or sets a boolean indicating that the VREXperienceHelper will exit VR if double tap is detected
         */
        this.exitVROnDoubleTap = true;
        /**
         * Observable raised right before entering VR.
         */
        this.onEnteringVRObservable = new Observable();
        /**
         * Observable raised when entering VR has completed.
         */
        this.onAfterEnteringVRObservable = new Observable();
        /**
         * Observable raised when exiting VR.
         */
        this.onExitingVRObservable = new Observable();
        /**
         * Observable raised when controller mesh is loaded.
         */
        this.onControllerMeshLoadedObservable = new Observable();
        this._useCustomVRButton = false;
        this._teleportationRequested = false;
        this._teleportActive = false;
        this._floorMeshesCollection = [];
        this._teleportationMode = VRExperienceHelper.TELEPORTATIONMODE_CONSTANTTIME;
        this._teleportationTime = 122;
        this._teleportationSpeed = 20;
        this._rotationAllowed = true;
        this._teleportBackwardsVector = new Vector3(0, -1, -1);
        this._isDefaultTeleportationTarget = true;
        this._teleportationFillColor = "#444444";
        this._teleportationBorderColor = "#FFFFFF";
        this._rotationAngle = 0;
        this._haloCenter = new Vector3(0, 0, 0);
        this._padSensibilityUp = 0.65;
        this._padSensibilityDown = 0.35;
        this._leftController = null;
        this._rightController = null;
        this._gazeColor = new Color3(0.7, 0.7, 0.7);
        this._laserColor = new Color3(0.7, 0.7, 0.7);
        this._pickedLaserColor = new Color3(0.2, 0.2, 1);
        this._pickedGazeColor = new Color3(0, 0, 1);
        /**
         * Observable raised when a new mesh is selected based on meshSelectionPredicate
         */
        this.onNewMeshSelected = new Observable();
        /**
         * Observable raised when a new mesh is selected based on meshSelectionPredicate.
         * This observable will provide the mesh and the controller used to select the mesh
         */
        this.onMeshSelectedWithController = new Observable();
        /**
         * Observable raised when a new mesh is picked based on meshSelectionPredicate
         */
        this.onNewMeshPicked = new Observable();
        /**
         * Observable raised before camera teleportation
         */
        this.onBeforeCameraTeleport = new Observable();
        /**
         *  Observable raised after camera teleportation
         */
        this.onAfterCameraTeleport = new Observable();
        /**
         * Observable raised when current selected mesh gets unselected
         */
        this.onSelectedMeshUnselected = new Observable();
        /**
         * Set teleportation enabled. If set to false camera teleportation will be disabled but camera rotation will be kept.
         */
        this.teleportationEnabled = true;
        this._teleportationInitialized = false;
        this._interactionsEnabled = false;
        this._interactionsRequested = false;
        this._displayGaze = true;
        this._displayLaserPointer = true;
        /**
         * If the gaze trackers scale should be updated to be constant size when pointing at near/far meshes
         */
        this.updateGazeTrackerScale = true;
        /**
         * If the gaze trackers color should be updated when selecting meshes
         */
        this.updateGazeTrackerColor = true;
        /**
         * If the controller laser color should be updated when selecting meshes
         */
        this.updateControllerLaserColor = true;
        /**
         * Defines whether or not Pointer lock should be requested when switching to
         * full screen.
         */
        this.requestPointerLockOnFullScreen = true;
        /**
         * Was the XR test done already. If this is true AND this.xr exists, xr is initialized.
         * If this is true and no this.xr, xr exists but is not supported, using WebVR.
         */
        this.xrTestDone = false;
        this._onResize = () => {
            this._moveButtonToBottomRight();
            if (this._fullscreenVRpresenting && this._webVRready) {
                this.exitVR();
            }
        };
        this._onFullscreenChange = () => {
            this._fullscreenVRpresenting = !!document.fullscreenElement;
            if (!this._fullscreenVRpresenting && this._inputElement) {
                this.exitVR();
                if (!this._useCustomVRButton && this._btnVR) {
                    this._btnVR.style.top = this._inputElement.offsetTop + this._inputElement.offsetHeight - 70 + "px";
                    this._btnVR.style.left = this._inputElement.offsetLeft + this._inputElement.offsetWidth - 100 + "px";
                    // make sure the button is visible after setting its position
                    this._updateButtonVisibility();
                }
            }
        };
        this._cachedAngularSensibility = { angularSensibilityX: null, angularSensibilityY: null, angularSensibility: null };
        this._beforeRender = () => {
            if (this._leftController && this._leftController._activePointer) {
                this._castRayAndSelectObject(this._leftController);
            }
            if (this._rightController && this._rightController._activePointer) {
                this._castRayAndSelectObject(this._rightController);
            }
            if (this._noControllerIsActive && (this._scene.getEngine().isPointerLock || this.enableGazeEvenWhenNoPointerLock)) {
                this._castRayAndSelectObject(this._cameraGazer);
            }
            else {
                this._cameraGazer._gazeTracker.isVisible = false;
            }
        };
        this._onNewGamepadConnected = (gamepad) => {
            if (gamepad.type !== Gamepad.POSE_ENABLED) {
                if (gamepad.leftStick) {
                    gamepad.onleftstickchanged((stickValues) => {
                        if (this._teleportationInitialized && this.teleportationEnabled) {
                            // Listening to classic/xbox gamepad only if no VR controller is active
                            if ((!this._leftController && !this._rightController) ||
                                (this._leftController && !this._leftController._activePointer && this._rightController && !this._rightController._activePointer)) {
                                this._checkTeleportWithRay(stickValues, this._cameraGazer);
                                this._checkTeleportBackwards(stickValues, this._cameraGazer);
                            }
                        }
                    });
                }
                if (gamepad.rightStick) {
                    gamepad.onrightstickchanged((stickValues) => {
                        if (this._teleportationInitialized) {
                            this._checkRotate(stickValues, this._cameraGazer);
                        }
                    });
                }
                if (gamepad.type === Gamepad.XBOX) {
                    gamepad.onbuttondown((buttonPressed) => {
                        if (this._interactionsEnabled && buttonPressed === Xbox360Button.A) {
                            this._cameraGazer._selectionPointerDown();
                        }
                    });
                    gamepad.onbuttonup((buttonPressed) => {
                        if (this._interactionsEnabled && buttonPressed === Xbox360Button.A) {
                            this._cameraGazer._selectionPointerUp();
                        }
                    });
                }
            }
            else {
                const webVRController = gamepad;
                const controller = new VRExperienceHelperControllerGazer(webVRController, this._scene, this._cameraGazer._gazeTracker);
                if (webVRController.hand === "right" || (this._leftController && this._leftController.webVRController != webVRController)) {
                    this._rightController = controller;
                }
                else {
                    this._leftController = controller;
                }
                this._tryEnableInteractionOnController(controller);
            }
        };
        // This only succeeds if the controller's mesh exists for the controller so this must be called whenever new controller is connected or when mesh is loaded
        this._tryEnableInteractionOnController = (controller) => {
            if (this._interactionsRequested && !controller._interactionsEnabled) {
                this._enableInteractionOnController(controller);
            }
            if (this._teleportationRequested && !controller._teleportationEnabled) {
                this._enableTeleportationOnController(controller);
            }
        };
        this._onNewGamepadDisconnected = (gamepad) => {
            if (gamepad instanceof WebVRController) {
                if (gamepad.hand === "left" && this._leftController != null) {
                    this._leftController.dispose();
                    this._leftController = null;
                }
                if (gamepad.hand === "right" && this._rightController != null) {
                    this._rightController.dispose();
                    this._rightController = null;
                }
            }
        };
        this._workingVector = Vector3.Zero();
        this._workingQuaternion = Quaternion.Identity();
        this._workingMatrix = Matrix.Identity();
        Logger.Warn("WebVR is deprecated. Please avoid using this experience helper and use the WebXR experience helper instead");
        this._scene = scene;
        this._inputElement = scene.getEngine().getInputElement();
        // check for VR support:
        const vrSupported = "getVRDisplays" in navigator;
        // no VR support? force XR but only when it is not set because web vr can work without the getVRDisplays
        if (!vrSupported && webVROptions.useXR === undefined) {
            webVROptions.useXR = true;
        }
        // Parse options
        if (webVROptions.createFallbackVRDeviceOrientationFreeCamera === undefined) {
            webVROptions.createFallbackVRDeviceOrientationFreeCamera = true;
        }
        if (webVROptions.createDeviceOrientationCamera === undefined) {
            webVROptions.createDeviceOrientationCamera = true;
        }
        if (webVROptions.laserToggle === undefined) {
            webVROptions.laserToggle = true;
        }
        if (webVROptions.defaultHeight === undefined) {
            webVROptions.defaultHeight = 1.7;
        }
        if (webVROptions.useCustomVRButton) {
            this._useCustomVRButton = true;
            if (webVROptions.customVRButton) {
                this._btnVR = webVROptions.customVRButton;
            }
        }
        if (webVROptions.rayLength) {
            this._rayLength = webVROptions.rayLength;
        }
        this._defaultHeight = webVROptions.defaultHeight;
        if (webVROptions.positionScale) {
            this._rayLength *= webVROptions.positionScale;
            this._defaultHeight *= webVROptions.positionScale;
        }
        this._hasEnteredVR = false;
        // Set position
        if (this._scene.activeCamera) {
            this._position = this._scene.activeCamera.position.clone();
        }
        else {
            this._position = new Vector3(0, this._defaultHeight, 0);
        }
        // Set non-vr camera
        if (webVROptions.createDeviceOrientationCamera || !this._scene.activeCamera) {
            this._deviceOrientationCamera = new DeviceOrientationCamera("deviceOrientationVRHelper", this._position.clone(), scene);
            // Copy data from existing camera
            if (this._scene.activeCamera) {
                this._deviceOrientationCamera.minZ = this._scene.activeCamera.minZ;
                this._deviceOrientationCamera.maxZ = this._scene.activeCamera.maxZ;
                // Set rotation from previous camera
                if (this._scene.activeCamera instanceof TargetCamera && this._scene.activeCamera.rotation) {
                    const targetCamera = this._scene.activeCamera;
                    if (targetCamera.rotationQuaternion) {
                        this._deviceOrientationCamera.rotationQuaternion.copyFrom(targetCamera.rotationQuaternion);
                    }
                    else {
                        this._deviceOrientationCamera.rotationQuaternion.copyFrom(Quaternion.RotationYawPitchRoll(targetCamera.rotation.y, targetCamera.rotation.x, targetCamera.rotation.z));
                    }
                    this._deviceOrientationCamera.rotation = targetCamera.rotation.clone();
                }
            }
            this._scene.activeCamera = this._deviceOrientationCamera;
            if (this._inputElement) {
                this._scene.activeCamera.attachControl();
            }
        }
        else {
            this._existingCamera = this._scene.activeCamera;
        }
        if (this.webVROptions.useXR && navigator.xr) {
            // force-check XR session support
            WebXRSessionManager.IsSessionSupportedAsync("immersive-vr").then((supported) => {
                if (supported) {
                    Logger.Log("Using WebXR. It is recommended to use the WebXRDefaultExperience directly");
                    // it is possible to use XR, let's do it!
                    scene
                        .createDefaultXRExperienceAsync({
                        floorMeshes: webVROptions.floorMeshes || [],
                    })
                        .then((xr) => {
                        this.xr = xr;
                        // connect observables
                        this.xrTestDone = true;
                        this._cameraGazer = new VRExperienceHelperCameraGazer(() => {
                            return this.xr.baseExperience.camera;
                        }, scene);
                        this.xr.baseExperience.onStateChangedObservable.add((state) => {
                            // support for entering / exiting
                            switch (state) {
                                case WebXRState.ENTERING_XR:
                                    this.onEnteringVRObservable.notifyObservers(this);
                                    if (!this._interactionsEnabled) {
                                        this.xr.pointerSelection.detach();
                                    }
                                    this.xr.pointerSelection.displayLaserPointer = this._displayLaserPointer;
                                    break;
                                case WebXRState.EXITING_XR:
                                    this.onExitingVRObservable.notifyObservers(this);
                                    // resize to update width and height when exiting vr exits fullscreen
                                    this._scene.getEngine().resize();
                                    break;
                                case WebXRState.IN_XR:
                                    this._hasEnteredVR = true;
                                    break;
                                case WebXRState.NOT_IN_XR:
                                    this._hasEnteredVR = false;
                                    break;
                            }
                        });
                    });
                }
                else {
                    // XR not supported (thou exists), continue WebVR init
                    this._completeVRInit(scene, webVROptions);
                }
            });
        }
        else {
            // no XR, continue init synchronous
            this._completeVRInit(scene, webVROptions);
        }
    }
    /** Return this.onEnteringVRObservable
     * Note: This one is for backward compatibility. Please use onEnteringVRObservable directly
     */
    get onEnteringVR() {
        return this.onEnteringVRObservable;
    }
    /** Return this.onExitingVRObservable
     * Note: This one is for backward compatibility. Please use onExitingVRObservable directly
     */
    get onExitingVR() {
        return this.onExitingVRObservable;
    }
    /** Return this.onControllerMeshLoadedObservable
     * Note: This one is for backward compatibility. Please use onControllerMeshLoadedObservable directly
     */
    get onControllerMeshLoaded() {
        return this.onControllerMeshLoadedObservable;
    }
    /**
     * The mesh used to display where the user is going to teleport.
     */
    get teleportationTarget() {
        return this._teleportationTarget;
    }
    /**
     * Sets the mesh to be used to display where the user is going to teleport.
     */
    set teleportationTarget(value) {
        if (value) {
            value.name = "teleportationTarget";
            this._isDefaultTeleportationTarget = false;
            this._teleportationTarget = value;
        }
    }
    /**
     * The mesh used to display where the user is selecting, this mesh will be cloned and set as the gazeTracker for the left and right controller
     * when set bakeCurrentTransformIntoVertices will be called on the mesh.
     * See https://doc.babylonjs.com/features/featuresDeepDive/mesh/transforms/center_origin/bakingTransforms
     */
    get gazeTrackerMesh() {
        return this._cameraGazer._gazeTracker;
    }
    set gazeTrackerMesh(value) {
        if (value) {
            // Dispose of existing meshes
            if (this._cameraGazer._gazeTracker) {
                this._cameraGazer._gazeTracker.dispose();
            }
            if (this._leftController && this._leftController._gazeTracker) {
                this._leftController._gazeTracker.dispose();
            }
            if (this._rightController && this._rightController._gazeTracker) {
                this._rightController._gazeTracker.dispose();
            }
            // Set and create gaze trackers on head and controllers
            this._cameraGazer._gazeTracker = value;
            this._cameraGazer._gazeTracker.bakeCurrentTransformIntoVertices();
            this._cameraGazer._gazeTracker.isPickable = false;
            this._cameraGazer._gazeTracker.isVisible = false;
            this._cameraGazer._gazeTracker.name = "gazeTracker";
            if (this._leftController) {
                this._leftController._gazeTracker = this._cameraGazer._gazeTracker.clone("gazeTracker");
            }
            if (this._rightController) {
                this._rightController._gazeTracker = this._cameraGazer._gazeTracker.clone("gazeTracker");
            }
        }
    }
    /**
     * The gaze tracking mesh corresponding to the left controller
     */
    get leftControllerGazeTrackerMesh() {
        if (this._leftController) {
            return this._leftController._gazeTracker;
        }
        return null;
    }
    /**
     * The gaze tracking mesh corresponding to the right controller
     */
    get rightControllerGazeTrackerMesh() {
        if (this._rightController) {
            return this._rightController._gazeTracker;
        }
        return null;
    }
    /**
     * If the ray of the gaze should be displayed.
     */
    get displayGaze() {
        return this._displayGaze;
    }
    /**
     * Sets if the ray of the gaze should be displayed.
     */
    set displayGaze(value) {
        this._displayGaze = value;
        if (!value) {
            this._cameraGazer._gazeTracker.isVisible = false;
            if (this._leftController) {
                this._leftController._gazeTracker.isVisible = false;
            }
            if (this._rightController) {
                this._rightController._gazeTracker.isVisible = false;
            }
        }
    }
    /**
     * If the ray of the LaserPointer should be displayed.
     */
    get displayLaserPointer() {
        return this._displayLaserPointer;
    }
    /**
     * Sets if the ray of the LaserPointer should be displayed.
     */
    set displayLaserPointer(value) {
        this._displayLaserPointer = value;
        if (!value) {
            if (this._rightController) {
                this._rightController._deactivatePointer();
                this._rightController._gazeTracker.isVisible = false;
            }
            if (this._leftController) {
                this._leftController._deactivatePointer();
                this._leftController._gazeTracker.isVisible = false;
            }
        }
        else {
            if (this._rightController) {
                this._rightController._activatePointer();
            }
            if (this._leftController) {
                this._leftController._activatePointer();
            }
        }
    }
    /**
     * The deviceOrientationCamera used as the camera when not in VR.
     */
    get deviceOrientationCamera() {
        return this._deviceOrientationCamera;
    }
    /**
     * Based on the current WebVR support, returns the current VR camera used.
     */
    get currentVRCamera() {
        if (this._webVRready) {
            return this._webVRCamera;
        }
        else {
            return this._scene.activeCamera;
        }
    }
    /**
     * The webVRCamera which is used when in VR.
     */
    get webVRCamera() {
        return this._webVRCamera;
    }
    /**
     * The deviceOrientationCamera that is used as a fallback when vr device is not connected.
     */
    get vrDeviceOrientationCamera() {
        return this._vrDeviceOrientationCamera;
    }
    /**
     * The html button that is used to trigger entering into VR.
     */
    get vrButton() {
        return this._btnVR;
    }
    get _teleportationRequestInitiated() {
        const result = this._cameraGazer._teleportationRequestInitiated ||
            (this._leftController !== null && this._leftController._teleportationRequestInitiated) ||
            (this._rightController !== null && this._rightController._teleportationRequestInitiated);
        return result;
    }
    _completeVRInit(scene, webVROptions) {
        this.xrTestDone = true;
        // Create VR cameras
        if (webVROptions.createFallbackVRDeviceOrientationFreeCamera) {
            if (webVROptions.useMultiview) {
                if (!webVROptions.vrDeviceOrientationCameraMetrics) {
                    webVROptions.vrDeviceOrientationCameraMetrics = VRCameraMetrics.GetDefault();
                }
                webVROptions.vrDeviceOrientationCameraMetrics.multiviewEnabled = true;
            }
            this._vrDeviceOrientationCamera = new VRDeviceOrientationFreeCamera("VRDeviceOrientationVRHelper", this._position, this._scene, true, webVROptions.vrDeviceOrientationCameraMetrics);
            this._vrDeviceOrientationCamera.angularSensibility = Number.MAX_VALUE;
        }
        this._webVRCamera = new WebVRFreeCamera("WebVRHelper", this._position, this._scene, webVROptions);
        this._webVRCamera.useStandingMatrix();
        this._cameraGazer = new VRExperienceHelperCameraGazer(() => {
            return this.currentVRCamera;
        }, scene);
        // Create default button
        if (!this._useCustomVRButton) {
            this._btnVR = document.createElement("BUTTON");
            this._btnVR.className = "babylonVRicon";
            this._btnVR.id = "babylonVRiconbtn";
            this._btnVR.title = "Click to switch to VR";
            const url = !window.SVGSVGElement
                ? "https://cdn.babylonjs.com/Assets/vrButton.png"
                : "data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%222048%22%20height%3D%221152%22%20viewBox%3D%220%200%202048%201152%22%20version%3D%221.1%22%3E%3Cpath%20transform%3D%22rotate%28180%201024%2C576.0000000000001%29%22%20d%3D%22m1109%2C896q17%2C0%2030%2C-12t13%2C-30t-12.5%2C-30.5t-30.5%2C-12.5l-170%2C0q-18%2C0%20-30.5%2C12.5t-12.5%2C30.5t13%2C30t30%2C12l170%2C0zm-85%2C256q59%2C0%20132.5%2C-1.5t154.5%2C-5.5t164.5%2C-11.5t163%2C-20t150%2C-30t124.5%2C-41.5q23%2C-11%2042%2C-24t38%2C-30q27%2C-25%2041%2C-61.5t14%2C-72.5l0%2C-257q0%2C-123%20-47%2C-232t-128%2C-190t-190%2C-128t-232%2C-47l-81%2C0q-37%2C0%20-68.5%2C14t-60.5%2C34.5t-55.5%2C45t-53%2C45t-53%2C34.5t-55.5%2C14t-55.5%2C-14t-53%2C-34.5t-53%2C-45t-55.5%2C-45t-60.5%2C-34.5t-68.5%2C-14l-81%2C0q-123%2C0%20-232%2C47t-190%2C128t-128%2C190t-47%2C232l0%2C257q0%2C68%2038%2C115t97%2C73q54%2C24%20124.5%2C41.5t150%2C30t163%2C20t164.5%2C11.5t154.5%2C5.5t132.5%2C1.5zm939%2C-298q0%2C39%20-24.5%2C67t-58.5%2C42q-54%2C23%20-122%2C39.5t-143.5%2C28t-155.5%2C19t-157%2C11t-148.5%2C5t-129.5%2C1.5q-59%2C0%20-130%2C-1.5t-148%2C-5t-157%2C-11t-155.5%2C-19t-143.5%2C-28t-122%2C-39.5q-34%2C-14%20-58.5%2C-42t-24.5%2C-67l0%2C-257q0%2C-106%2040.5%2C-199t110%2C-162.5t162.5%2C-109.5t199%2C-40l81%2C0q27%2C0%2052%2C14t50%2C34.5t51%2C44.5t55.5%2C44.5t63.5%2C34.5t74%2C14t74%2C-14t63.5%2C-34.5t55.5%2C-44.5t51%2C-44.5t50%2C-34.5t52%2C-14l14%2C0q37%2C0%2070%2C0.5t64.5%2C4.5t63.5%2C12t68%2C23q71%2C30%20128.5%2C78.5t98.5%2C110t63.5%2C133.5t22.5%2C149l0%2C257z%22%20fill%3D%22white%22%20/%3E%3C/svg%3E%0A";
            let css = ".babylonVRicon { position: absolute; right: 20px; height: 50px; width: 80px; background-color: rgba(51,51,51,0.7); background-image: url(" +
                url +
                "); background-size: 80%; background-repeat:no-repeat; background-position: center; border: none; outline: none; transition: transform 0.125s ease-out } .babylonVRicon:hover { transform: scale(1.05) } .babylonVRicon:active {background-color: rgba(51,51,51,1) } .babylonVRicon:focus {background-color: rgba(51,51,51,1) }";
            css += ".babylonVRicon.vrdisplaypresenting { display: none; }";
            // TODO: Add user feedback so that they know what state the VRDisplay is in (disconnected, connected, entering-VR)
            // css += ".babylonVRicon.vrdisplaysupported { }";
            // css += ".babylonVRicon.vrdisplayready { }";
            // css += ".babylonVRicon.vrdisplayrequesting { }";
            const style = document.createElement("style");
            style.appendChild(document.createTextNode(css));
            document.getElementsByTagName("head")[0].appendChild(style);
            this._moveButtonToBottomRight();
        }
        // VR button click event
        if (this._btnVR) {
            this._btnVR.addEventListener("click", () => {
                if (!this.isInVRMode) {
                    this.enterVR();
                }
                else {
                    this._scene.getEngine().disableVR();
                }
            });
        }
        // Window events
        const hostWindow = this._scene.getEngine().getHostWindow();
        if (!hostWindow) {
            return;
        }
        hostWindow.addEventListener("resize", this._onResize);
        document.addEventListener("fullscreenchange", this._onFullscreenChange, false);
        // Display vr button when headset is connected
        if (webVROptions.createFallbackVRDeviceOrientationFreeCamera) {
            this._displayVRButton();
        }
        else {
            this._scene.getEngine().onVRDisplayChangedObservable.add((e) => {
                if (e.vrDisplay) {
                    this._displayVRButton();
                }
            });
        }
        // Exiting VR mode using 'ESC' key on desktop
        this._onKeyDown = (event) => {
            if (event.keyCode === 27 && this.isInVRMode) {
                this.exitVR();
            }
        };
        document.addEventListener("keydown", this._onKeyDown);
        // Exiting VR mode double tapping the touch screen
        this._scene.onPrePointerObservable.add(() => {
            if (this._hasEnteredVR && this.exitVROnDoubleTap) {
                this.exitVR();
                if (this._fullscreenVRpresenting) {
                    this._scene.getEngine().exitFullscreen();
                }
            }
        }, PointerEventTypes.POINTERDOUBLETAP, false);
        // Listen for WebVR display changes
        this._onVRDisplayChangedBind = (eventArgs) => this._onVRDisplayChanged(eventArgs);
        this._onVrDisplayPresentChangeBind = () => this._onVrDisplayPresentChange();
        this._onVRRequestPresentStart = () => {
            this._webVRrequesting = true;
            this._updateButtonVisibility();
        };
        this._onVRRequestPresentComplete = () => {
            this._webVRrequesting = false;
            this._updateButtonVisibility();
        };
        scene.getEngine().onVRDisplayChangedObservable.add(this._onVRDisplayChangedBind);
        scene.getEngine().onVRRequestPresentStart.add(this._onVRRequestPresentStart);
        scene.getEngine().onVRRequestPresentComplete.add(this._onVRRequestPresentComplete);
        hostWindow.addEventListener("vrdisplaypresentchange", this._onVrDisplayPresentChangeBind);
        scene.onDisposeObservable.add(() => {
            this.dispose();
        });
        // Gamepad connection events
        this._webVRCamera.onControllerMeshLoadedObservable.add((webVRController) => this._onDefaultMeshLoaded(webVRController));
        this._scene.gamepadManager.onGamepadConnectedObservable.add(this._onNewGamepadConnected);
        this._scene.gamepadManager.onGamepadDisconnectedObservable.add(this._onNewGamepadDisconnected);
        this._updateButtonVisibility();
        //create easing functions
        this._circleEase = new CircleEase();
        this._circleEase.setEasingMode(EasingFunction.EASINGMODE_EASEINOUT);
        this._teleportationEasing = this._circleEase;
        // Allow clicking in the vrDeviceOrientationCamera
        scene.onPointerObservable.add((e) => {
            if (this._interactionsEnabled) {
                if (scene.activeCamera === this.vrDeviceOrientationCamera && e.event.pointerType === "mouse") {
                    if (e.type === PointerEventTypes.POINTERDOWN) {
                        this._cameraGazer._selectionPointerDown();
                    }
                    else if (e.type === PointerEventTypes.POINTERUP) {
                        this._cameraGazer._selectionPointerUp();
                    }
                }
            }
        });
        if (this.webVROptions.floorMeshes) {
            this.enableTeleportation({ floorMeshes: this.webVROptions.floorMeshes });
        }
    }
    // Raised when one of the controller has loaded successfully its associated default mesh
    _onDefaultMeshLoaded(webVRController) {
        if (this._leftController && this._leftController.webVRController == webVRController) {
            if (webVRController.mesh) {
                this._leftController._setLaserPointerParent(webVRController.mesh);
            }
        }
        if (this._rightController && this._rightController.webVRController == webVRController) {
            if (webVRController.mesh) {
                this._rightController._setLaserPointerParent(webVRController.mesh);
            }
        }
        try {
            this.onControllerMeshLoadedObservable.notifyObservers(webVRController);
        }
        catch (err) {
            Logger.Warn("Error in your custom logic onControllerMeshLoaded: " + err);
        }
    }
    /**
     * Gets a value indicating if we are currently in VR mode.
     */
    get isInVRMode() {
        return (this.xr && this.webVROptions.useXR && this.xr.baseExperience.state === WebXRState.IN_XR) || this._webVRpresenting || this._fullscreenVRpresenting;
    }
    _onVrDisplayPresentChange() {
        const vrDisplay = this._scene.getEngine().getVRDevice();
        if (vrDisplay) {
            const wasPresenting = this._webVRpresenting;
            this._webVRpresenting = vrDisplay.isPresenting;
            if (wasPresenting && !this._webVRpresenting) {
                this.exitVR();
            }
        }
        else {
            Logger.Warn("Detected VRDisplayPresentChange on an unknown VRDisplay. Did you can enterVR on the vrExperienceHelper?");
        }
        this._updateButtonVisibility();
    }
    _onVRDisplayChanged(eventArgs) {
        this._webVRsupported = eventArgs.vrSupported;
        this._webVRready = !!eventArgs.vrDisplay;
        this._webVRpresenting = eventArgs.vrDisplay && eventArgs.vrDisplay.isPresenting;
        this._updateButtonVisibility();
    }
    _moveButtonToBottomRight() {
        if (this._inputElement && !this._useCustomVRButton && this._btnVR) {
            const rect = this._inputElement.getBoundingClientRect();
            this._btnVR.style.top = rect.top + rect.height - 70 + "px";
            this._btnVR.style.left = rect.left + rect.width - 100 + "px";
        }
    }
    _displayVRButton() {
        if (!this._useCustomVRButton && !this._btnVRDisplayed && this._btnVR) {
            document.body.appendChild(this._btnVR);
            this._btnVRDisplayed = true;
        }
    }
    _updateButtonVisibility() {
        if (!this._btnVR || this._useCustomVRButton) {
            return;
        }
        this._btnVR.className = "babylonVRicon";
        if (this.isInVRMode) {
            this._btnVR.className += " vrdisplaypresenting";
        }
        else {
            if (this._webVRready) {
                this._btnVR.className += " vrdisplayready";
            }
            if (this._webVRsupported) {
                this._btnVR.className += " vrdisplaysupported";
            }
            if (this._webVRrequesting) {
                this._btnVR.className += " vrdisplayrequesting";
            }
        }
    }
    /**
     * Attempt to enter VR. If a headset is connected and ready, will request present on that.
     * Otherwise, will use the fullscreen API.
     */
    enterVR() {
        if (this.xr) {
            this.xr.baseExperience.enterXRAsync("immersive-vr", "local-floor", this.xr.renderTarget);
            return;
        }
        if (this.onEnteringVRObservable) {
            try {
                this.onEnteringVRObservable.notifyObservers(this);
            }
            catch (err) {
                Logger.Warn("Error in your custom logic onEnteringVR: " + err);
            }
        }
        if (this._scene.activeCamera) {
            this._position = this._scene.activeCamera.position.clone();
            if (this.vrDeviceOrientationCamera) {
                this.vrDeviceOrientationCamera.rotation = Quaternion.FromRotationMatrix(this._scene.activeCamera.getWorldMatrix().getRotationMatrix()).toEulerAngles();
                this.vrDeviceOrientationCamera.angularSensibility = 2000;
            }
            if (this.webVRCamera) {
                const currentYRotation = this.webVRCamera.deviceRotationQuaternion.toEulerAngles().y;
                const desiredYRotation = Quaternion.FromRotationMatrix(this._scene.activeCamera.getWorldMatrix().getRotationMatrix()).toEulerAngles().y;
                const delta = desiredYRotation - currentYRotation;
                const currentGlobalRotation = this.webVRCamera.rotationQuaternion.toEulerAngles().y;
                this.webVRCamera.rotationQuaternion = Quaternion.FromEulerAngles(0, currentGlobalRotation + delta, 0);
            }
            // make sure that we return to the last active camera
            this._existingCamera = this._scene.activeCamera;
            // Remove and cache angular sensability to avoid camera rotation when in VR
            if (this._existingCamera.angularSensibilityX) {
                this._cachedAngularSensibility.angularSensibilityX = this._existingCamera.angularSensibilityX;
                this._existingCamera.angularSensibilityX = Number.MAX_VALUE;
            }
            if (this._existingCamera.angularSensibilityY) {
                this._cachedAngularSensibility.angularSensibilityY = this._existingCamera.angularSensibilityY;
                this._existingCamera.angularSensibilityY = Number.MAX_VALUE;
            }
            if (this._existingCamera.angularSensibility) {
                this._cachedAngularSensibility.angularSensibility = this._existingCamera.angularSensibility;
                this._existingCamera.angularSensibility = Number.MAX_VALUE;
            }
        }
        if (this._webVRrequesting) {
            return;
        }
        // If WebVR is supported and a headset is connected
        if (this._webVRready) {
            if (!this._webVRpresenting) {
                this._scene.getEngine().onVRRequestPresentComplete.addOnce((result) => {
                    this.onAfterEnteringVRObservable.notifyObservers({ success: result });
                });
                this._webVRCamera.position = this._position;
                this._scene.activeCamera = this._webVRCamera;
            }
        }
        else if (this._vrDeviceOrientationCamera) {
            this._vrDeviceOrientationCamera.position = this._position;
            if (this._scene.activeCamera) {
                this._vrDeviceOrientationCamera.minZ = this._scene.activeCamera.minZ;
            }
            this._scene.activeCamera = this._vrDeviceOrientationCamera;
            this._scene.getEngine().enterFullscreen(this.requestPointerLockOnFullScreen);
            this._updateButtonVisibility();
            this._vrDeviceOrientationCamera.onViewMatrixChangedObservable.addOnce(() => {
                this.onAfterEnteringVRObservable.notifyObservers({ success: true });
            });
        }
        if (this._scene.activeCamera && this._inputElement) {
            this._scene.activeCamera.attachControl();
        }
        if (this._interactionsEnabled) {
            this._scene.registerBeforeRender(this._beforeRender);
        }
        if (this._displayLaserPointer) {
            [this._leftController, this._rightController].forEach((controller) => {
                if (controller) {
                    controller._activatePointer();
                }
            });
        }
        this._hasEnteredVR = true;
    }
    /**
     * Attempt to exit VR, or fullscreen.
     */
    exitVR() {
        if (this.xr) {
            this.xr.baseExperience.exitXRAsync();
            return;
        }
        if (this._hasEnteredVR) {
            if (this.onExitingVRObservable) {
                try {
                    this.onExitingVRObservable.notifyObservers(this);
                }
                catch (err) {
                    Logger.Warn("Error in your custom logic onExitingVR: " + err);
                }
            }
            if (this._webVRpresenting) {
                this._scene.getEngine().disableVR();
            }
            if (this._scene.activeCamera) {
                this._position = this._scene.activeCamera.position.clone();
            }
            if (this.vrDeviceOrientationCamera) {
                this.vrDeviceOrientationCamera.angularSensibility = Number.MAX_VALUE;
            }
            if (this._deviceOrientationCamera) {
                this._deviceOrientationCamera.position = this._position;
                this._scene.activeCamera = this._deviceOrientationCamera;
                // Restore angular sensibility
                if (this._cachedAngularSensibility.angularSensibilityX) {
                    this._deviceOrientationCamera.angularSensibilityX = this._cachedAngularSensibility.angularSensibilityX;
                    this._cachedAngularSensibility.angularSensibilityX = null;
                }
                if (this._cachedAngularSensibility.angularSensibilityY) {
                    this._deviceOrientationCamera.angularSensibilityY = this._cachedAngularSensibility.angularSensibilityY;
                    this._cachedAngularSensibility.angularSensibilityY = null;
                }
                if (this._cachedAngularSensibility.angularSensibility) {
                    this._deviceOrientationCamera.angularSensibility = this._cachedAngularSensibility.angularSensibility;
                    this._cachedAngularSensibility.angularSensibility = null;
                }
            }
            else if (this._existingCamera) {
                this._existingCamera.position = this._position;
                this._scene.activeCamera = this._existingCamera;
                if (this._inputElement) {
                    this._scene.activeCamera.attachControl();
                }
                // Restore angular sensibility
                if (this._cachedAngularSensibility.angularSensibilityX) {
                    this._existingCamera.angularSensibilityX = this._cachedAngularSensibility.angularSensibilityX;
                    this._cachedAngularSensibility.angularSensibilityX = null;
                }
                if (this._cachedAngularSensibility.angularSensibilityY) {
                    this._existingCamera.angularSensibilityY = this._cachedAngularSensibility.angularSensibilityY;
                    this._cachedAngularSensibility.angularSensibilityY = null;
                }
                if (this._cachedAngularSensibility.angularSensibility) {
                    this._existingCamera.angularSensibility = this._cachedAngularSensibility.angularSensibility;
                    this._cachedAngularSensibility.angularSensibility = null;
                }
            }
            this._updateButtonVisibility();
            if (this._interactionsEnabled) {
                this._scene.unregisterBeforeRender(this._beforeRender);
                this._cameraGazer._gazeTracker.isVisible = false;
                if (this._leftController) {
                    this._leftController._gazeTracker.isVisible = false;
                }
                if (this._rightController) {
                    this._rightController._gazeTracker.isVisible = false;
                }
            }
            // resize to update width and height when exiting vr exits fullscreen
            this._scene.getEngine().resize();
            [this._leftController, this._rightController].forEach((controller) => {
                if (controller) {
                    controller._deactivatePointer();
                }
            });
            this._hasEnteredVR = false;
            // Update engine state to re enable non-vr camera input
            const engine = this._scene.getEngine();
            if (engine._onVrDisplayPresentChange) {
                engine._onVrDisplayPresentChange();
            }
        }
    }
    /**
     * The position of the vr experience helper.
     */
    get position() {
        return this._position;
    }
    /**
     * Sets the position of the vr experience helper.
     */
    set position(value) {
        this._position = value;
        if (this._scene.activeCamera) {
            this._scene.activeCamera.position = value;
        }
    }
    /**
     * Enables controllers and user interactions such as selecting and object or clicking on an object.
     */
    enableInteractions() {
        if (!this._interactionsEnabled) {
            this._interactionsRequested = true;
            // in XR it is enabled by default, but just to make sure, re-attach
            if (this.xr) {
                if (this.xr.baseExperience.state === WebXRState.IN_XR) {
                    this.xr.pointerSelection.attach();
                }
                return;
            }
            if (this._leftController) {
                this._enableInteractionOnController(this._leftController);
            }
            if (this._rightController) {
                this._enableInteractionOnController(this._rightController);
            }
            this.raySelectionPredicate = (mesh) => {
                return mesh.isVisible && (mesh.isPickable || mesh.name === this._floorMeshName);
            };
            this.meshSelectionPredicate = () => {
                return true;
            };
            this._raySelectionPredicate = (mesh) => {
                if (this._isTeleportationFloor(mesh) ||
                    (mesh.name.indexOf("gazeTracker") === -1 && mesh.name.indexOf("teleportationTarget") === -1 && mesh.name.indexOf("torusTeleportation") === -1)) {
                    return this.raySelectionPredicate(mesh);
                }
                return false;
            };
            this._interactionsEnabled = true;
        }
    }
    get _noControllerIsActive() {
        return !(this._leftController && this._leftController._activePointer) && !(this._rightController && this._rightController._activePointer);
    }
    _isTeleportationFloor(mesh) {
        for (let i = 0; i < this._floorMeshesCollection.length; i++) {
            if (this._floorMeshesCollection[i].id === mesh.id) {
                return true;
            }
        }
        if (this._floorMeshName && mesh.name === this._floorMeshName) {
            return true;
        }
        return false;
    }
    /**
     * Adds a floor mesh to be used for teleportation.
     * @param floorMesh the mesh to be used for teleportation.
     */
    addFloorMesh(floorMesh) {
        if (!this._floorMeshesCollection) {
            return;
        }
        if (this._floorMeshesCollection.indexOf(floorMesh) > -1) {
            return;
        }
        this._floorMeshesCollection.push(floorMesh);
    }
    /**
     * Removes a floor mesh from being used for teleportation.
     * @param floorMesh the mesh to be removed.
     */
    removeFloorMesh(floorMesh) {
        if (!this._floorMeshesCollection) {
            return;
        }
        const meshIndex = this._floorMeshesCollection.indexOf(floorMesh);
        if (meshIndex !== -1) {
            this._floorMeshesCollection.splice(meshIndex, 1);
        }
    }
    /**
     * Enables interactions and teleportation using the VR controllers and gaze.
     * @param vrTeleportationOptions options to modify teleportation behavior.
     */
    enableTeleportation(vrTeleportationOptions = {}) {
        if (!this._teleportationInitialized) {
            this._teleportationRequested = true;
            this.enableInteractions();
            if (this.webVROptions.useXR && (vrTeleportationOptions.floorMeshes || vrTeleportationOptions.floorMeshName)) {
                const floorMeshes = vrTeleportationOptions.floorMeshes || [];
                if (!floorMeshes.length) {
                    const floorMesh = this._scene.getMeshByName(vrTeleportationOptions.floorMeshName);
                    if (floorMesh) {
                        floorMeshes.push(floorMesh);
                    }
                }
                if (this.xr) {
                    floorMeshes.forEach((mesh) => {
                        this.xr.teleportation.addFloorMesh(mesh);
                    });
                    if (!this.xr.teleportation.attached) {
                        this.xr.teleportation.attach();
                    }
                    return;
                }
                else if (!this.xrTestDone) {
                    const waitForXr = () => {
                        if (this.xrTestDone) {
                            this._scene.unregisterBeforeRender(waitForXr);
                            if (this.xr) {
                                if (!this.xr.teleportation.attached) {
                                    this.xr.teleportation.attach();
                                }
                            }
                            else {
                                this.enableTeleportation(vrTeleportationOptions);
                            }
                        }
                    };
                    this._scene.registerBeforeRender(waitForXr);
                    return;
                }
            }
            if (vrTeleportationOptions.floorMeshName) {
                this._floorMeshName = vrTeleportationOptions.floorMeshName;
            }
            if (vrTeleportationOptions.floorMeshes) {
                this._floorMeshesCollection = vrTeleportationOptions.floorMeshes;
            }
            if (vrTeleportationOptions.teleportationMode) {
                this._teleportationMode = vrTeleportationOptions.teleportationMode;
            }
            if (vrTeleportationOptions.teleportationTime && vrTeleportationOptions.teleportationTime > 0) {
                this._teleportationTime = vrTeleportationOptions.teleportationTime;
            }
            if (vrTeleportationOptions.teleportationSpeed && vrTeleportationOptions.teleportationSpeed > 0) {
                this._teleportationSpeed = vrTeleportationOptions.teleportationSpeed;
            }
            if (vrTeleportationOptions.easingFunction !== undefined) {
                this._teleportationEasing = vrTeleportationOptions.easingFunction;
            }
            if (this._leftController != null) {
                this._enableTeleportationOnController(this._leftController);
            }
            if (this._rightController != null) {
                this._enableTeleportationOnController(this._rightController);
            }
            // Creates an image processing post process for the vignette not relying
            // on the main scene configuration for image processing to reduce setup and spaces
            // (gamma/linear) conflicts.
            const imageProcessingConfiguration = new ImageProcessingConfiguration();
            imageProcessingConfiguration.vignetteColor = new Color4(0, 0, 0, 0);
            imageProcessingConfiguration.vignetteEnabled = true;
            this._postProcessMove = new ImageProcessingPostProcess("postProcessMove", 1.0, this._webVRCamera, undefined, undefined, undefined, undefined, imageProcessingConfiguration);
            this._webVRCamera.detachPostProcess(this._postProcessMove);
            this._teleportationInitialized = true;
            if (this._isDefaultTeleportationTarget) {
                this._createTeleportationCircles();
                this._teleportationTarget.scaling.scaleInPlace(this._webVRCamera.deviceScaleFactor);
            }
        }
    }
    _enableInteractionOnController(controller) {
        const controllerMesh = controller.webVRController.mesh;
        if (controllerMesh) {
            controller._interactionsEnabled = true;
            if (this.isInVRMode && this._displayLaserPointer) {
                controller._activatePointer();
            }
            if (this.webVROptions.laserToggle) {
                controller.webVRController.onMainButtonStateChangedObservable.add((stateObject) => {
                    // Enabling / disabling laserPointer
                    if (this._displayLaserPointer && stateObject.value === 1) {
                        if (controller._activePointer) {
                            controller._deactivatePointer();
                        }
                        else {
                            controller._activatePointer();
                        }
                        if (this.displayGaze) {
                            controller._gazeTracker.isVisible = controller._activePointer;
                        }
                    }
                });
            }
            controller.webVRController.onTriggerStateChangedObservable.add((stateObject) => {
                let gazer = controller;
                if (this._noControllerIsActive) {
                    gazer = this._cameraGazer;
                }
                if (!gazer._pointerDownOnMeshAsked) {
                    if (stateObject.value > this._padSensibilityUp) {
                        gazer._selectionPointerDown();
                    }
                }
                else if (stateObject.value < this._padSensibilityDown) {
                    gazer._selectionPointerUp();
                }
            });
        }
    }
    _checkTeleportWithRay(stateObject, gazer) {
        // Dont teleport if another gaze already requested teleportation
        if (this._teleportationRequestInitiated && !gazer._teleportationRequestInitiated) {
            return;
        }
        if (!gazer._teleportationRequestInitiated) {
            if (stateObject.y < -this._padSensibilityUp && gazer._dpadPressed) {
                gazer._activatePointer();
                gazer._teleportationRequestInitiated = true;
            }
        }
        else {
            // Listening to the proper controller values changes to confirm teleportation
            if (Math.sqrt(stateObject.y * stateObject.y + stateObject.x * stateObject.x) < this._padSensibilityDown) {
                if (this._teleportActive) {
                    this.teleportCamera(this._haloCenter);
                }
                gazer._teleportationRequestInitiated = false;
            }
        }
    }
    _checkRotate(stateObject, gazer) {
        // Only rotate when user is not currently selecting a teleportation location
        if (gazer._teleportationRequestInitiated) {
            return;
        }
        if (!gazer._rotationLeftAsked) {
            if (stateObject.x < -this._padSensibilityUp && gazer._dpadPressed) {
                gazer._rotationLeftAsked = true;
                if (this._rotationAllowed) {
                    this._rotateCamera(false);
                }
            }
        }
        else {
            if (stateObject.x > -this._padSensibilityDown) {
                gazer._rotationLeftAsked = false;
            }
        }
        if (!gazer._rotationRightAsked) {
            if (stateObject.x > this._padSensibilityUp && gazer._dpadPressed) {
                gazer._rotationRightAsked = true;
                if (this._rotationAllowed) {
                    this._rotateCamera(true);
                }
            }
        }
        else {
            if (stateObject.x < this._padSensibilityDown) {
                gazer._rotationRightAsked = false;
            }
        }
    }
    _checkTeleportBackwards(stateObject, gazer) {
        // Only teleport backwards when user is not currently selecting a teleportation location
        if (gazer._teleportationRequestInitiated) {
            return;
        }
        // Teleport backwards
        if (stateObject.y > this._padSensibilityUp && gazer._dpadPressed) {
            if (!gazer._teleportationBackRequestInitiated) {
                if (!this.currentVRCamera) {
                    return;
                }
                // Get rotation and position of the current camera
                let rotation = Quaternion.FromRotationMatrix(this.currentVRCamera.getWorldMatrix().getRotationMatrix());
                let position = this.currentVRCamera.position;
                // If the camera has device position, use that instead
                if (this.currentVRCamera.devicePosition && this.currentVRCamera.deviceRotationQuaternion) {
                    rotation = this.currentVRCamera.deviceRotationQuaternion;
                    position = this.currentVRCamera.devicePosition;
                }
                // Get matrix with only the y rotation of the device rotation
                rotation.toEulerAnglesToRef(this._workingVector);
                this._workingVector.z = 0;
                this._workingVector.x = 0;
                Quaternion.RotationYawPitchRollToRef(this._workingVector.y, this._workingVector.x, this._workingVector.z, this._workingQuaternion);
                this._workingQuaternion.toRotationMatrix(this._workingMatrix);
                // Rotate backwards ray by device rotation to cast at the ground behind the user
                Vector3.TransformCoordinatesToRef(this._teleportBackwardsVector, this._workingMatrix, this._workingVector);
                // Teleport if ray hit the ground and is not to far away eg. backwards off a cliff
                const ray = new Ray(position, this._workingVector);
                const hit = this._scene.pickWithRay(ray, this._raySelectionPredicate);
                if (hit && hit.pickedPoint && hit.pickedMesh && this._isTeleportationFloor(hit.pickedMesh) && hit.distance < 5) {
                    this.teleportCamera(hit.pickedPoint);
                }
                gazer._teleportationBackRequestInitiated = true;
            }
        }
        else {
            gazer._teleportationBackRequestInitiated = false;
        }
    }
    _enableTeleportationOnController(controller) {
        const controllerMesh = controller.webVRController.mesh;
        if (controllerMesh) {
            if (!controller._interactionsEnabled) {
                this._enableInteractionOnController(controller);
            }
            controller._interactionsEnabled = true;
            controller._teleportationEnabled = true;
            if (controller.webVRController.controllerType === PoseEnabledControllerType.VIVE) {
                controller._dpadPressed = false;
                controller.webVRController.onPadStateChangedObservable.add((stateObject) => {
                    controller._dpadPressed = stateObject.pressed;
                    if (!controller._dpadPressed) {
                        controller._rotationLeftAsked = false;
                        controller._rotationRightAsked = false;
                        controller._teleportationBackRequestInitiated = false;
                    }
                });
            }
            controller.webVRController.onPadValuesChangedObservable.add((stateObject) => {
                if (this.teleportationEnabled) {
                    this._checkTeleportBackwards(stateObject, controller);
                    this._checkTeleportWithRay(stateObject, controller);
                }
                this._checkRotate(stateObject, controller);
            });
        }
    }
    _createTeleportationCircles() {
        this._teleportationTarget = CreateGround("teleportationTarget", { width: 2, height: 2, subdivisions: 2 }, this._scene);
        this._teleportationTarget.isPickable = false;
        const length = 512;
        const dynamicTexture = new DynamicTexture("DynamicTexture", length, this._scene, true);
        dynamicTexture.hasAlpha = true;
        const context = dynamicTexture.getContext();
        const centerX = length / 2;
        const centerY = length / 2;
        const radius = 200;
        context.beginPath();
        context.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
        context.fillStyle = this._teleportationFillColor;
        context.fill();
        context.lineWidth = 10;
        context.strokeStyle = this._teleportationBorderColor;
        context.stroke();
        context.closePath();
        dynamicTexture.update();
        const teleportationCircleMaterial = new StandardMaterial("TextPlaneMaterial", this._scene);
        teleportationCircleMaterial.diffuseTexture = dynamicTexture;
        this._teleportationTarget.material = teleportationCircleMaterial;
        const torus = CreateTorus("torusTeleportation", {
            diameter: 0.75,
            thickness: 0.1,
            tessellation: 25,
            updatable: false,
        }, this._scene);
        torus.isPickable = false;
        torus.parent = this._teleportationTarget;
        const animationInnerCircle = new Animation("animationInnerCircle", "position.y", 30, Animation.ANIMATIONTYPE_FLOAT, Animation.ANIMATIONLOOPMODE_CYCLE);
        const keys = [];
        keys.push({
            frame: 0,
            value: 0,
        });
        keys.push({
            frame: 30,
            value: 0.4,
        });
        keys.push({
            frame: 60,
            value: 0,
        });
        animationInnerCircle.setKeys(keys);
        const easingFunction = new SineEase();
        easingFunction.setEasingMode(EasingFunction.EASINGMODE_EASEINOUT);
        animationInnerCircle.setEasingFunction(easingFunction);
        torus.animations = [];
        torus.animations.push(animationInnerCircle);
        this._scene.beginAnimation(torus, 0, 60, true);
        this._hideTeleportationTarget();
    }
    _displayTeleportationTarget() {
        this._teleportActive = true;
        if (this._teleportationInitialized) {
            this._teleportationTarget.isVisible = true;
            if (this._isDefaultTeleportationTarget) {
                this._teleportationTarget.getChildren()[0].isVisible = true;
            }
        }
    }
    _hideTeleportationTarget() {
        this._teleportActive = false;
        if (this._teleportationInitialized) {
            this._teleportationTarget.isVisible = false;
            if (this._isDefaultTeleportationTarget) {
                this._teleportationTarget.getChildren()[0].isVisible = false;
            }
        }
    }
    _rotateCamera(right) {
        if (!(this.currentVRCamera instanceof FreeCamera)) {
            return;
        }
        if (right) {
            this._rotationAngle++;
        }
        else {
            this._rotationAngle--;
        }
        this.currentVRCamera.animations = [];
        const target = Quaternion.FromRotationMatrix(Matrix.RotationY((Math.PI / 4) * this._rotationAngle));
        const animationRotation = new Animation("animationRotation", "rotationQuaternion", 90, Animation.ANIMATIONTYPE_QUATERNION, Animation.ANIMATIONLOOPMODE_CONSTANT);
        const animationRotationKeys = [];
        animationRotationKeys.push({
            frame: 0,
            value: this.currentVRCamera.rotationQuaternion,
        });
        animationRotationKeys.push({
            frame: 6,
            value: target,
        });
        animationRotation.setKeys(animationRotationKeys);
        animationRotation.setEasingFunction(this._circleEase);
        this.currentVRCamera.animations.push(animationRotation);
        this._postProcessMove.animations = [];
        const animationPP = new Animation("animationPP", "vignetteWeight", 90, Animation.ANIMATIONTYPE_FLOAT, Animation.ANIMATIONLOOPMODE_CONSTANT);
        const vignetteWeightKeys = [];
        vignetteWeightKeys.push({
            frame: 0,
            value: 0,
        });
        vignetteWeightKeys.push({
            frame: 3,
            value: 4,
        });
        vignetteWeightKeys.push({
            frame: 6,
            value: 0,
        });
        animationPP.setKeys(vignetteWeightKeys);
        animationPP.setEasingFunction(this._circleEase);
        this._postProcessMove.animations.push(animationPP);
        const animationPP2 = new Animation("animationPP2", "vignetteStretch", 90, Animation.ANIMATIONTYPE_FLOAT, Animation.ANIMATIONLOOPMODE_CONSTANT);
        const vignetteStretchKeys = [];
        vignetteStretchKeys.push({
            frame: 0,
            value: 0,
        });
        vignetteStretchKeys.push({
            frame: 3,
            value: 10,
        });
        vignetteStretchKeys.push({
            frame: 6,
            value: 0,
        });
        animationPP2.setKeys(vignetteStretchKeys);
        animationPP2.setEasingFunction(this._circleEase);
        this._postProcessMove.animations.push(animationPP2);
        this._postProcessMove.imageProcessingConfiguration.vignetteWeight = 0;
        this._postProcessMove.imageProcessingConfiguration.vignetteStretch = 0;
        this._postProcessMove.samples = 4;
        this._webVRCamera.attachPostProcess(this._postProcessMove);
        this._scene.beginAnimation(this._postProcessMove, 0, 6, false, 1, () => {
            this._webVRCamera.detachPostProcess(this._postProcessMove);
        });
        this._scene.beginAnimation(this.currentVRCamera, 0, 6, false, 1);
    }
    _moveTeleportationSelectorTo(hit, gazer, ray) {
        if (hit.pickedPoint) {
            if (gazer._teleportationRequestInitiated) {
                this._displayTeleportationTarget();
                this._haloCenter.copyFrom(hit.pickedPoint);
                this._teleportationTarget.position.copyFrom(hit.pickedPoint);
            }
            const pickNormal = this._convertNormalToDirectionOfRay(hit.getNormal(true, false), ray);
            if (pickNormal) {
                const axis1 = Vector3.Cross(Axis.Y, pickNormal);
                const axis2 = Vector3.Cross(pickNormal, axis1);
                Vector3.RotationFromAxisToRef(axis2, pickNormal, axis1, this._teleportationTarget.rotation);
            }
            this._teleportationTarget.position.y += 0.1;
        }
    }
    /**
     * Teleports the users feet to the desired location
     * @param location The location where the user's feet should be placed
     */
    teleportCamera(location) {
        if (!(this.currentVRCamera instanceof FreeCamera)) {
            return;
        }
        // Teleport the hmd to where the user is looking by moving the anchor to where they are looking minus the
        // offset of the headset from the anchor.
        if (this.webVRCamera.leftCamera) {
            this._workingVector.copyFrom(this.webVRCamera.leftCamera.globalPosition);
            this._workingVector.subtractInPlace(this.webVRCamera.position);
            location.subtractToRef(this._workingVector, this._workingVector);
        }
        else {
            this._workingVector.copyFrom(location);
        }
        // Add height to account for user's height offset
        if (this.isInVRMode) {
            this._workingVector.y += this.webVRCamera.deviceDistanceToRoomGround() * this._webVRCamera.deviceScaleFactor;
        }
        else {
            this._workingVector.y += this._defaultHeight;
        }
        this.onBeforeCameraTeleport.notifyObservers(this._workingVector);
        // Animations FPS
        const FPS = 90;
        let speedRatio, lastFrame;
        if (this._teleportationMode == VRExperienceHelper.TELEPORTATIONMODE_CONSTANTSPEED) {
            lastFrame = FPS;
            const dist = Vector3.Distance(this.currentVRCamera.position, this._workingVector);
            speedRatio = this._teleportationSpeed / dist;
        }
        else {
            // teleportationMode is TELEPORTATIONMODE_CONSTANTTIME
            lastFrame = Math.round((this._teleportationTime * FPS) / 1000);
            speedRatio = 1;
        }
        // Create animation from the camera's position to the new location
        this.currentVRCamera.animations = [];
        const animationCameraTeleportation = new Animation("animationCameraTeleportation", "position", FPS, Animation.ANIMATIONTYPE_VECTOR3, Animation.ANIMATIONLOOPMODE_CONSTANT);
        const animationCameraTeleportationKeys = [
            {
                frame: 0,
                value: this.currentVRCamera.position,
            },
            {
                frame: lastFrame,
                value: this._workingVector,
            },
        ];
        animationCameraTeleportation.setKeys(animationCameraTeleportationKeys);
        animationCameraTeleportation.setEasingFunction(this._teleportationEasing);
        this.currentVRCamera.animations.push(animationCameraTeleportation);
        this._postProcessMove.animations = [];
        // Calculate the mid frame for vignette animations
        const midFrame = Math.round(lastFrame / 2);
        const animationPP = new Animation("animationPP", "vignetteWeight", FPS, Animation.ANIMATIONTYPE_FLOAT, Animation.ANIMATIONLOOPMODE_CONSTANT);
        const vignetteWeightKeys = [];
        vignetteWeightKeys.push({
            frame: 0,
            value: 0,
        });
        vignetteWeightKeys.push({
            frame: midFrame,
            value: 8,
        });
        vignetteWeightKeys.push({
            frame: lastFrame,
            value: 0,
        });
        animationPP.setKeys(vignetteWeightKeys);
        this._postProcessMove.animations.push(animationPP);
        const animationPP2 = new Animation("animationPP2", "vignetteStretch", FPS, Animation.ANIMATIONTYPE_FLOAT, Animation.ANIMATIONLOOPMODE_CONSTANT);
        const vignetteStretchKeys = [];
        vignetteStretchKeys.push({
            frame: 0,
            value: 0,
        });
        vignetteStretchKeys.push({
            frame: midFrame,
            value: 10,
        });
        vignetteStretchKeys.push({
            frame: lastFrame,
            value: 0,
        });
        animationPP2.setKeys(vignetteStretchKeys);
        this._postProcessMove.animations.push(animationPP2);
        this._postProcessMove.imageProcessingConfiguration.vignetteWeight = 0;
        this._postProcessMove.imageProcessingConfiguration.vignetteStretch = 0;
        this._webVRCamera.attachPostProcess(this._postProcessMove);
        this._scene.beginAnimation(this._postProcessMove, 0, lastFrame, false, speedRatio, () => {
            this._webVRCamera.detachPostProcess(this._postProcessMove);
        });
        this._scene.beginAnimation(this.currentVRCamera, 0, lastFrame, false, speedRatio, () => {
            this.onAfterCameraTeleport.notifyObservers(this._workingVector);
        });
        this._hideTeleportationTarget();
    }
    _convertNormalToDirectionOfRay(normal, ray) {
        if (normal) {
            const angle = Math.acos(Vector3.Dot(normal, ray.direction));
            if (angle < Math.PI / 2) {
                normal.scaleInPlace(-1);
            }
        }
        return normal;
    }
    _castRayAndSelectObject(gazer) {
        if (!(this.currentVRCamera instanceof FreeCamera)) {
            return;
        }
        const ray = gazer._getForwardRay(this._rayLength);
        const hit = this._scene.pickWithRay(ray, this._raySelectionPredicate);
        if (hit) {
            this._scene.simulatePointerMove(hit, { pointerId: gazer._id });
        }
        gazer._currentHit = hit;
        // Moving the gazeTracker on the mesh face targetted
        if (hit && hit.pickedPoint) {
            if (this._displayGaze) {
                let multiplier = 1;
                gazer._gazeTracker.isVisible = true;
                if (gazer._isActionableMesh) {
                    multiplier = 3;
                }
                if (this.updateGazeTrackerScale) {
                    gazer._gazeTracker.scaling.x = hit.distance * multiplier;
                    gazer._gazeTracker.scaling.y = hit.distance * multiplier;
                    gazer._gazeTracker.scaling.z = hit.distance * multiplier;
                }
                const pickNormal = this._convertNormalToDirectionOfRay(hit.getNormal(), ray);
                // To avoid z-fighting
                const deltaFighting = 0.002;
                if (pickNormal) {
                    const axis1 = Vector3.Cross(Axis.Y, pickNormal);
                    const axis2 = Vector3.Cross(pickNormal, axis1);
                    Vector3.RotationFromAxisToRef(axis2, pickNormal, axis1, gazer._gazeTracker.rotation);
                }
                gazer._gazeTracker.position.copyFrom(hit.pickedPoint);
                if (gazer._gazeTracker.position.x < 0) {
                    gazer._gazeTracker.position.x += deltaFighting;
                }
                else {
                    gazer._gazeTracker.position.x -= deltaFighting;
                }
                if (gazer._gazeTracker.position.y < 0) {
                    gazer._gazeTracker.position.y += deltaFighting;
                }
                else {
                    gazer._gazeTracker.position.y -= deltaFighting;
                }
                if (gazer._gazeTracker.position.z < 0) {
                    gazer._gazeTracker.position.z += deltaFighting;
                }
                else {
                    gazer._gazeTracker.position.z -= deltaFighting;
                }
            }
            // Changing the size of the laser pointer based on the distance from the targetted point
            gazer._updatePointerDistance(hit.distance);
        }
        else {
            gazer._updatePointerDistance();
            gazer._gazeTracker.isVisible = false;
        }
        if (hit && hit.pickedMesh) {
            // The object selected is the floor, we're in a teleportation scenario
            if (this._teleportationInitialized && this._isTeleportationFloor(hit.pickedMesh) && hit.pickedPoint) {
                // Moving the teleportation area to this targetted point
                //Raise onSelectedMeshUnselected observable if ray collided floor mesh/meshes and a non floor mesh was previously selected
                if (gazer._currentMeshSelected && !this._isTeleportationFloor(gazer._currentMeshSelected)) {
                    this._notifySelectedMeshUnselected(gazer._currentMeshSelected);
                }
                gazer._currentMeshSelected = null;
                if (gazer._teleportationRequestInitiated) {
                    this._moveTeleportationSelectorTo(hit, gazer, ray);
                }
                return;
            }
            // If not, we're in a selection scenario
            //this._teleportationAllowed = false;
            if (hit.pickedMesh !== gazer._currentMeshSelected) {
                if (this.meshSelectionPredicate(hit.pickedMesh)) {
                    this.onNewMeshPicked.notifyObservers(hit);
                    gazer._currentMeshSelected = hit.pickedMesh;
                    if (hit.pickedMesh.isPickable && hit.pickedMesh.actionManager) {
                        this.changeGazeColor(this._pickedGazeColor);
                        this.changeLaserColor(this._pickedLaserColor);
                        gazer._isActionableMesh = true;
                    }
                    else {
                        this.changeGazeColor(this._gazeColor);
                        this.changeLaserColor(this._laserColor);
                        gazer._isActionableMesh = false;
                    }
                    try {
                        this.onNewMeshSelected.notifyObservers(hit.pickedMesh);
                        const gazerAsControllerGazer = gazer;
                        if (gazerAsControllerGazer.webVRController) {
                            this.onMeshSelectedWithController.notifyObservers({ mesh: hit.pickedMesh, controller: gazerAsControllerGazer.webVRController });
                        }
                    }
                    catch (err) {
                        Logger.Warn("Error while raising onNewMeshSelected or onMeshSelectedWithController: " + err);
                    }
                }
                else {
                    this._notifySelectedMeshUnselected(gazer._currentMeshSelected);
                    gazer._currentMeshSelected = null;
                    this.changeGazeColor(this._gazeColor);
                    this.changeLaserColor(this._laserColor);
                }
            }
        }
        else {
            this._notifySelectedMeshUnselected(gazer._currentMeshSelected);
            gazer._currentMeshSelected = null;
            //this._teleportationAllowed = false;
            this.changeGazeColor(this._gazeColor);
            this.changeLaserColor(this._laserColor);
        }
    }
    _notifySelectedMeshUnselected(mesh) {
        if (mesh) {
            this.onSelectedMeshUnselected.notifyObservers(mesh);
        }
    }
    /**
     * Permanently set new colors for the laser pointer
     * @param color the new laser color
     * @param pickedColor the new laser color when picked mesh detected
     */
    setLaserColor(color, pickedColor = this._pickedLaserColor) {
        this._laserColor = color;
        this._pickedLaserColor = pickedColor;
    }
    /**
     * Set lighting enabled / disabled on the laser pointer of both controllers
     * @param enabled should the lighting be enabled on the laser pointer
     */
    setLaserLightingState(enabled = true) {
        if (this._leftController) {
            this._leftController._setLaserPointerLightingDisabled(!enabled);
        }
        if (this._rightController) {
            this._rightController._setLaserPointerLightingDisabled(!enabled);
        }
    }
    /**
     * Permanently set new colors for the gaze pointer
     * @param color the new gaze color
     * @param pickedColor the new gaze color when picked mesh detected
     */
    setGazeColor(color, pickedColor = this._pickedGazeColor) {
        this._gazeColor = color;
        this._pickedGazeColor = pickedColor;
    }
    /**
     * Sets the color of the laser ray from the vr controllers.
     * @param color new color for the ray.
     */
    changeLaserColor(color) {
        if (!this.updateControllerLaserColor) {
            return;
        }
        if (this._leftController) {
            this._leftController._setLaserPointerColor(color);
        }
        if (this._rightController) {
            this._rightController._setLaserPointerColor(color);
        }
    }
    /**
     * Sets the color of the ray from the vr headsets gaze.
     * @param color new color for the ray.
     */
    changeGazeColor(color) {
        if (!this.updateGazeTrackerColor) {
            return;
        }
        if (!this._cameraGazer._gazeTracker.material) {
            return;
        }
        this._cameraGazer._gazeTracker.material.emissiveColor = color;
        if (this._leftController) {
            this._leftController._gazeTracker.material.emissiveColor = color;
        }
        if (this._rightController) {
            this._rightController._gazeTracker.material.emissiveColor = color;
        }
    }
    /**
     * Exits VR and disposes of the vr experience helper
     */
    dispose() {
        if (this.isInVRMode) {
            this.exitVR();
        }
        if (this._postProcessMove) {
            this._postProcessMove.dispose();
        }
        if (this._webVRCamera) {
            this._webVRCamera.dispose();
        }
        if (this._vrDeviceOrientationCamera) {
            this._vrDeviceOrientationCamera.dispose();
        }
        if (!this._useCustomVRButton && this._btnVR && this._btnVR.parentNode) {
            document.body.removeChild(this._btnVR);
        }
        if (this._deviceOrientationCamera && this._scene.activeCamera != this._deviceOrientationCamera) {
            this._deviceOrientationCamera.dispose();
        }
        if (this._cameraGazer) {
            this._cameraGazer.dispose();
        }
        if (this._leftController) {
            this._leftController.dispose();
        }
        if (this._rightController) {
            this._rightController.dispose();
        }
        if (this._teleportationTarget) {
            this._teleportationTarget.dispose();
        }
        if (this.xr) {
            this.xr.dispose();
        }
        this._floorMeshesCollection.length = 0;
        document.removeEventListener("keydown", this._onKeyDown);
        window.removeEventListener("vrdisplaypresentchange", this._onVrDisplayPresentChangeBind);
        window.removeEventListener("resize", this._onResize);
        document.removeEventListener("fullscreenchange", this._onFullscreenChange);
        this._scene.getEngine().onVRDisplayChangedObservable.removeCallback(this._onVRDisplayChangedBind);
        this._scene.getEngine().onVRRequestPresentStart.removeCallback(this._onVRRequestPresentStart);
        this._scene.getEngine().onVRRequestPresentComplete.removeCallback(this._onVRRequestPresentComplete);
        this._scene.gamepadManager.onGamepadConnectedObservable.removeCallback(this._onNewGamepadConnected);
        this._scene.gamepadManager.onGamepadDisconnectedObservable.removeCallback(this._onNewGamepadDisconnected);
        this._scene.unregisterBeforeRender(this._beforeRender);
    }
    /**
     * Gets the name of the VRExperienceHelper class
     * @returns "VRExperienceHelper"
     */
    getClassName() {
        return "VRExperienceHelper";
    }
}
/**
 * Time Constant Teleportation Mode
 */
VRExperienceHelper.TELEPORTATIONMODE_CONSTANTTIME = 0;
/**
 * Speed Constant Teleportation Mode
 */
VRExperienceHelper.TELEPORTATIONMODE_CONSTANTSPEED = 1;
//# sourceMappingURL=vrExperienceHelper.js.map