/** This file must only contain pure code and pure imports */
import { __esDecorate, __runInitializers } from "../tslib.es6.js";
import { serialize, serializeAsVector3, serializeAsMeshReference, serializeAsVector2 } from "../Misc/decorators.js";
import { Observable } from "../Misc/observable.pure.js";
import { Matrix, Vector3, Vector2, TmpVectors, Quaternion } from "../Maths/math.vector.pure.js";
import { Clamp } from "../Maths/math.scalar.functions.js";
import { Node } from "../node.js";
import { Mesh } from "../Meshes/mesh.pure.js";
import { AutoRotationBehavior } from "../Behaviors/Cameras/autoRotationBehavior.js";
import { BouncingBehavior } from "../Behaviors/Cameras/bouncingBehavior.js";
import { FramingBehavior } from "../Behaviors/Cameras/framingBehavior.js";
import { Camera } from "./camera.pure.js";
import { TargetCamera } from "./targetCamera.pure.js";
import { ArcRotateCameraInputsManager } from "../Cameras/arcRotateCameraInputsManager.pure.js";
import { Epsilon } from "../Maths/math.constants.js";
import { Tools } from "../Misc/tools.pure.js";
import { RegisterClass } from "../Misc/typeStore.js";
import { ArcRotateCameraMovement } from "./arcRotateCameraMovement.js";
/**
 * Computes the alpha angle based on the source position and the target position.
 * @param offset The directional offset between the source position and the target position
 * @returns The alpha angle in radians
 */
export function ComputeAlpha(offset) {
    // Default alpha to π/2 to handle the edge case where x and z are both zero (when looking along up axis)
    let alpha = Math.PI / 2;
    if (!(offset.x === 0 && offset.z === 0)) {
        alpha = Math.acos(offset.x / Math.sqrt(Math.pow(offset.x, 2) + Math.pow(offset.z, 2)));
    }
    if (offset.z < 0) {
        alpha = 2 * Math.PI - alpha;
    }
    return alpha;
}
/**
 * Computes the beta angle based on the source position and the target position.
 * @param verticalOffset The y value of the directional offset between the source position and the target position
 * @param radius The distance between the source position and the target position
 * @returns The beta angle in radians
 */
export function ComputeBeta(verticalOffset, radius) {
    return Math.acos(verticalOffset / radius);
}
// Returns the value if not NaN, otherwise returns the fallback value.
function CheckNaN(value, fallback) {
    return isNaN(value) ? fallback : value;
}
/**
 * This represents an orbital type of camera.
 *
 * This camera always points towards a given target position and can be rotated around that target with the target as the centre of rotation. It can be controlled with cursors and mouse, or with touch events.
 * Think of this camera as one orbiting its target position, or more imaginatively as a spy satellite orbiting the earth. Its position relative to the target (earth) can be set by three parameters, alpha (radians) the longitudinal rotation, beta (radians) the latitudinal rotation and radius the distance from the target position.
 * @see https://doc.babylonjs.com/features/featuresDeepDive/cameras/camera_introduction#arc-rotate-camera
 */
let ArcRotateCamera = (() => {
    var _a;
    let _classSuper = TargetCamera;
    let _instanceExtraInitializers = [];
    let _alpha_decorators;
    let _alpha_initializers = [];
    let _alpha_extraInitializers = [];
    let _beta_decorators;
    let _beta_initializers = [];
    let _beta_extraInitializers = [];
    let _radius_decorators;
    let _radius_initializers = [];
    let _radius_extraInitializers = [];
    let _overrideCloneAlphaBetaRadius_decorators;
    let _overrideCloneAlphaBetaRadius_initializers = [];
    let _overrideCloneAlphaBetaRadius_extraInitializers = [];
    let __target_decorators;
    let __target_initializers = [];
    let __target_extraInitializers = [];
    let __targetHost_decorators;
    let __targetHost_initializers = [];
    let __targetHost_extraInitializers = [];
    let _get_inertialAlphaOffset_decorators;
    let _get_inertialBetaOffset_decorators;
    let _get_inertialRadiusOffset_decorators;
    let _lowerAlphaLimit_decorators;
    let _lowerAlphaLimit_initializers = [];
    let _lowerAlphaLimit_extraInitializers = [];
    let _upperAlphaLimit_decorators;
    let _upperAlphaLimit_initializers = [];
    let _upperAlphaLimit_extraInitializers = [];
    let _lowerBetaLimit_decorators;
    let _lowerBetaLimit_initializers = [];
    let _lowerBetaLimit_extraInitializers = [];
    let _upperBetaLimit_decorators;
    let _upperBetaLimit_initializers = [];
    let _upperBetaLimit_extraInitializers = [];
    let _lowerRadiusLimit_decorators;
    let _lowerRadiusLimit_initializers = [];
    let _lowerRadiusLimit_extraInitializers = [];
    let _upperRadiusLimit_decorators;
    let _upperRadiusLimit_initializers = [];
    let _upperRadiusLimit_extraInitializers = [];
    let _lowerTargetYLimit_decorators;
    let _lowerTargetYLimit_initializers = [];
    let _lowerTargetYLimit_extraInitializers = [];
    let _inertialPanningX_decorators;
    let _inertialPanningX_initializers = [];
    let _inertialPanningX_extraInitializers = [];
    let _inertialPanningY_decorators;
    let _inertialPanningY_initializers = [];
    let _inertialPanningY_extraInitializers = [];
    let _pinchToPanMaxDistance_decorators;
    let _pinchToPanMaxDistance_initializers = [];
    let _pinchToPanMaxDistance_extraInitializers = [];
    let _panningDistanceLimit_decorators;
    let _panningDistanceLimit_initializers = [];
    let _panningDistanceLimit_extraInitializers = [];
    let _panningOriginTarget_decorators;
    let _panningOriginTarget_initializers = [];
    let _panningOriginTarget_extraInitializers = [];
    let _get_panningInertia_decorators;
    let _get_zoomToMouseLocation_decorators;
    let _zoomOnFactor_decorators;
    let _zoomOnFactor_initializers = [];
    let _zoomOnFactor_extraInitializers = [];
    let _targetScreenOffset_decorators;
    let _targetScreenOffset_initializers = [];
    let _targetScreenOffset_extraInitializers = [];
    let _allowUpsideDown_decorators;
    let _allowUpsideDown_initializers = [];
    let _allowUpsideDown_extraInitializers = [];
    let _useInputToRestoreState_decorators;
    let _useInputToRestoreState_initializers = [];
    let _useInputToRestoreState_extraInitializers = [];
    let _restoreStateInterpolationFactor_decorators;
    let _restoreStateInterpolationFactor_initializers = [];
    let _restoreStateInterpolationFactor_extraInitializers = [];
    return _a = class ArcRotateCamera extends _classSuper {
            /**
             * Defines the target point of the camera.
             * The camera looks towards it from the radius distance.
             */
            get target() {
                return this._target;
            }
            set target(value) {
                this.setTarget(value);
            }
            /**
             * Defines the target transform node of the camera.
             * The camera looks towards it from the radius distance.
             * Please note that setting a target host will disable panning.
             */
            get targetHost() {
                return this._targetHost;
            }
            set targetHost(value) {
                if (value) {
                    this.setTarget(value);
                }
            }
            /**
             * Return the current target position of the camera. This value is expressed in local space.
             * @returns the target position
             */
            getTarget() {
                return this.target;
            }
            /**
             * Define the current local position of the camera in the scene
             */
            get position() {
                return this._position;
            }
            set position(newPosition) {
                this.setPosition(newPosition);
            }
            /**
             * The vector the camera should consider as up. (default is Vector3(0, 1, 0) as returned by Vector3.Up())
             * Setting this will copy the given vector to the camera's upVector, and set rotation matrices to and from Y up.
             * DO NOT set the up vector using copyFrom or copyFromFloats, as this bypasses setting the above matrices.
             */
            set upVector(vec) {
                if (!this._upToYMatrix) {
                    this._yToUpMatrix = new Matrix();
                    this._upToYMatrix = new Matrix();
                    this._upVector = Vector3.Zero();
                }
                vec.normalize();
                this._upVector.copyFrom(vec);
                this.setMatUp();
            }
            get upVector() {
                return this._upVector;
            }
            /**
             * Sets the Y-up to camera up-vector rotation matrix, and the up-vector to Y-up rotation matrix.
             */
            setMatUp() {
                // from y-up to custom-up (used in _getViewMatrix)
                Matrix.RotationAlignToRef(Vector3.UpReadOnly, this._upVector, this._yToUpMatrix);
                // from custom-up to y-up (used in rebuildAnglesAndRadius)
                Matrix.RotationAlignToRef(this._upVector, Vector3.UpReadOnly, this._upToYMatrix);
            }
            /**
             * Current inertia value on the longitudinal axis.
             * When nonzero, represents the per-frame angular offset (in radians) applied to `alpha`.
             * Each frame, this value is multiplied by {@link inertia} (a decay coefficient where
             * 0 = instant stop, 0.9 = smooth glide, 1 = never stops).
             * Reading this value also reflects the rotation delta the movement system will apply this frame
             * (decays toward 0 over the inertia tail), preserving legacy semantics for "is the camera still animating?" checks.
             * Setting this to 0 also stops the movement system's rotation velocity for backward compatibility.
             */
            get inertialAlphaOffset() {
                if (this._inertialAlphaOffset !== 0) {
                    return this._inertialAlphaOffset;
                }
                if (this.movement.rotationAccumulatedPixels.x !== 0) {
                    return this.movement.rotationAccumulatedPixels.x;
                }
                const delta = this.movement.rotationDeltaCurrentFrame.x;
                return Math.abs(delta) < this._rotationEpsilon ? 0 : delta;
            }
            set inertialAlphaOffset(value) {
                this._inertialAlphaOffset = value;
                if (value === 0) {
                    this.movement.resetRotationVelocity();
                }
            }
            /**
             * Current inertia value on the latitudinal axis.
             * When nonzero, represents the per-frame angular offset (in radians) applied to `beta`.
             * Each frame, this value is multiplied by {@link inertia} (a decay coefficient where
             * 0 = instant stop, 0.9 = smooth glide, 1 = never stops).
             * Reading this value also reflects the rotation delta the movement system will apply this frame
             * (decays toward 0 over the inertia tail), preserving legacy semantics for "is the camera still animating?" checks.
             * Setting this to 0 also stops the movement system's rotation velocity for backward compatibility.
             */
            get inertialBetaOffset() {
                if (this._inertialBetaOffset !== 0) {
                    return this._inertialBetaOffset;
                }
                if (this.movement.rotationAccumulatedPixels.y !== 0) {
                    return this.movement.rotationAccumulatedPixels.y;
                }
                const delta = this.movement.rotationDeltaCurrentFrame.y;
                return Math.abs(delta) < this._rotationEpsilon ? 0 : delta;
            }
            set inertialBetaOffset(value) {
                this._inertialBetaOffset = value;
                if (value === 0) {
                    this.movement.resetRotationVelocity();
                }
            }
            /**
             * Current inertia value on the radius axis.
             * When nonzero, represents the per-frame offset (in scene units) applied to `radius`.
             * Each frame, this value is multiplied by {@link inertia} (a decay coefficient where
             * 0 = instant stop, 0.9 = smooth glide, 1 = never stops).
             * Reading this value also reflects the zoom delta the movement system will apply this frame
             * (decays toward 0 over the inertia tail), preserving legacy semantics for "is the camera still animating?" checks.
             * Setting this to 0 also stops the movement system's zoom velocity for backward compatibility.
             */
            get inertialRadiusOffset() {
                if (this._inertialRadiusOffset !== 0) {
                    return this._inertialRadiusOffset;
                }
                if (this.movement.zoomAccumulatedPixels !== 0) {
                    return this.movement.zoomAccumulatedPixels;
                }
                const delta = this.movement.zoomDeltaCurrentFrame;
                return Math.abs(delta) < this._rotationEpsilon ? 0 : delta;
            }
            set inertialRadiusOffset(value) {
                this._inertialRadiusOffset = value;
                if (value === 0) {
                    this.movement.resetZoomVelocity();
                }
            }
            /**
             * Defines the value of the inertia used during panning.
             * A decay coefficient applied per reference frame at 60fps:
             * 0 means stop instantly, 0.9 means smooth glide, 1 means never stop.
             * Setting this also updates the movement system's pan inertia.
             */
            get panningInertia() {
                return this._panningInertia;
            }
            set panningInertia(value) {
                this._panningInertia = value;
                if (this.movement) {
                    this.movement.panInertia = value;
                }
            }
            /**
             * Defines the rotation/zoom inertia (decay coefficient applied per reference frame at 60fps).
             * Override of {@link Camera.inertia} that automatically syncs to the movement system
             * (rotation and zoom). Panning inertia is controlled separately via {@link panningInertia}.
             */
            get inertia() {
                return this._inertia;
            }
            set inertia(value) {
                this._inertia = value;
                if (this.movement) {
                    this.movement.rotationInertia = value;
                    this.movement.zoomInertia = value;
                }
            }
            //-- begin properties for backward compatibility for inputs
            /**
             * Gets or Set the pointer angular sensibility  along the X axis or how fast is the camera rotating.
             */
            get angularSensibilityX() {
                const pointers = this.inputs.attached["pointers"];
                if (pointers) {
                    return pointers.angularSensibilityX;
                }
                return 0;
            }
            set angularSensibilityX(value) {
                const pointers = this.inputs.attached["pointers"];
                if (pointers) {
                    pointers.angularSensibilityX = value;
                }
            }
            /**
             * Gets or Set the pointer angular sensibility along the Y axis or how fast is the camera rotating.
             */
            get angularSensibilityY() {
                const pointers = this.inputs.attached["pointers"];
                if (pointers) {
                    return pointers.angularSensibilityY;
                }
                return 0;
            }
            set angularSensibilityY(value) {
                const pointers = this.inputs.attached["pointers"];
                if (pointers) {
                    pointers.angularSensibilityY = value;
                }
            }
            /**
             * Gets or Set the pointer pinch precision or how fast is the camera zooming.
             */
            get pinchPrecision() {
                const pointers = this.inputs.attached["pointers"];
                if (pointers) {
                    return pointers.pinchPrecision;
                }
                return 0;
            }
            set pinchPrecision(value) {
                const pointers = this.inputs.attached["pointers"];
                if (pointers) {
                    pointers.pinchPrecision = value;
                }
            }
            /**
             * Gets or Set the pointer pinch delta percentage or how fast is the camera zooming.
             * It will be used instead of pinchPrecision if different from 0.
             * It defines the percentage of current camera.radius to use as delta when pinch zoom is used.
             */
            get pinchDeltaPercentage() {
                const pointers = this.inputs.attached["pointers"];
                if (pointers) {
                    return pointers.pinchDeltaPercentage;
                }
                return 0;
            }
            set pinchDeltaPercentage(value) {
                const pointers = this.inputs.attached["pointers"];
                if (pointers) {
                    pointers.pinchDeltaPercentage = value;
                }
            }
            /**
             * Gets or Set the pointer use natural pinch zoom to override the pinch precision
             * and pinch delta percentage.
             * When useNaturalPinchZoom is true, multi touch zoom will zoom in such
             * that any object in the plane at the camera's target point will scale
             * perfectly with finger motion.
             */
            get useNaturalPinchZoom() {
                const pointers = this.inputs.attached["pointers"];
                if (pointers) {
                    return pointers.useNaturalPinchZoom;
                }
                return false;
            }
            set useNaturalPinchZoom(value) {
                const pointers = this.inputs.attached["pointers"];
                if (pointers) {
                    pointers.useNaturalPinchZoom = value;
                }
            }
            /**
             * Gets or Set the pointer panning sensibility or how fast is the camera moving.
             */
            get panningSensibility() {
                const pointers = this.inputs.attached["pointers"];
                if (pointers) {
                    return pointers.panningSensibility;
                }
                return 0;
            }
            set panningSensibility(value) {
                const pointers = this.inputs.attached["pointers"];
                if (pointers) {
                    pointers.panningSensibility = value;
                }
            }
            /**
             * Gets or Set the list of keyboard keys used to control beta angle in a positive direction.
             */
            get keysUp() {
                const keyboard = this.inputs.attached["keyboard"];
                if (keyboard) {
                    return keyboard.keysUp;
                }
                return [];
            }
            set keysUp(value) {
                const keyboard = this.inputs.attached["keyboard"];
                if (keyboard) {
                    keyboard.keysUp = value;
                }
            }
            /**
             * Gets or Set the list of keyboard keys used to control beta angle in a negative direction.
             */
            get keysDown() {
                const keyboard = this.inputs.attached["keyboard"];
                if (keyboard) {
                    return keyboard.keysDown;
                }
                return [];
            }
            set keysDown(value) {
                const keyboard = this.inputs.attached["keyboard"];
                if (keyboard) {
                    keyboard.keysDown = value;
                }
            }
            /**
             * Gets or Set the list of keyboard keys used to control alpha angle in a negative direction.
             */
            get keysLeft() {
                const keyboard = this.inputs.attached["keyboard"];
                if (keyboard) {
                    return keyboard.keysLeft;
                }
                return [];
            }
            set keysLeft(value) {
                const keyboard = this.inputs.attached["keyboard"];
                if (keyboard) {
                    keyboard.keysLeft = value;
                }
            }
            /**
             * Gets or Set the list of keyboard keys used to control alpha angle in a positive direction.
             */
            get keysRight() {
                const keyboard = this.inputs.attached["keyboard"];
                if (keyboard) {
                    return keyboard.keysRight;
                }
                return [];
            }
            set keysRight(value) {
                const keyboard = this.inputs.attached["keyboard"];
                if (keyboard) {
                    keyboard.keysRight = value;
                }
            }
            /**
             * Gets or Set the mouse wheel precision or how fast is the camera zooming.
             */
            get wheelPrecision() {
                const mousewheel = this.inputs.attached["mousewheel"];
                if (mousewheel) {
                    return mousewheel.wheelPrecision;
                }
                return 0;
            }
            set wheelPrecision(value) {
                const mousewheel = this.inputs.attached["mousewheel"];
                if (mousewheel) {
                    mousewheel.wheelPrecision = value;
                }
            }
            /**
             * Gets or Set the boolean value that controls whether or not the mouse wheel
             * zooms to the location of the mouse pointer or not.  The default is false.
             */
            get zoomToMouseLocation() {
                const mousewheel = this.inputs.attached["mousewheel"];
                if (mousewheel) {
                    return mousewheel.zoomToMouseLocation;
                }
                return false;
            }
            set zoomToMouseLocation(value) {
                const mousewheel = this.inputs.attached["mousewheel"];
                if (mousewheel) {
                    mousewheel.zoomToMouseLocation = value;
                }
            }
            /**
             * Gets or Set the mouse wheel delta percentage or how fast is the camera zooming.
             * It will be used instead of wheelPrecision if different from 0.
             * It defines the percentage of current camera.radius to use as delta when wheel zoom is used.
             */
            get wheelDeltaPercentage() {
                const mousewheel = this.inputs.attached["mousewheel"];
                if (mousewheel) {
                    return mousewheel.wheelDeltaPercentage;
                }
                return 0;
            }
            set wheelDeltaPercentage(value) {
                const mousewheel = this.inputs.attached["mousewheel"];
                if (mousewheel) {
                    mousewheel.wheelDeltaPercentage = value;
                }
            }
            /**
             * Gets or sets whether ctrl+keyboard triggers panning.
             * Setting this updates the keyboard→pan inputMap entry.
             * @internal kept for backward compatibility
             */
            get _useCtrlForPanning() {
                return this._useCtrlForPanningInternal;
            }
            set _useCtrlForPanning(value) {
                this._useCtrlForPanningInternal = value;
                const input = this.movement.input;
                // Manage keyboard ctrl → pan entry
                const keyboardEntry = input.getEntry("keyboard", "pan", { modifiers: { ctrl: true } });
                if (!value && keyboardEntry) {
                    input.inputMap.splice(input.inputMap.indexOf(keyboardEntry), 1);
                }
                else if (value && !keyboardEntry) {
                    input.addEntry({ source: "keyboard", modifiers: { ctrl: true }, interaction: "pan" });
                }
                // Manage pointer ctrl+left-drag → pan entry (matches legacy ArcRotateCameraPointersInput behavior)
                const pointerEntry = input.getEntry("pointer", "pan", { modifiers: { ctrl: true } });
                if (!value && pointerEntry) {
                    input.inputMap.splice(input.inputMap.indexOf(pointerEntry), 1);
                }
                else if (value && !pointerEntry) {
                    input.addEntry({ source: "pointer", button: 0, modifiers: { ctrl: true }, interaction: "pan" });
                }
            }
            /**
             * Gets or sets which mouse button triggers panning (0=left, 1=middle, 2=right).
             * Setting this updates the pointer→pan inputMap entry.
             * @internal kept for backward compatibility with attachControl signature
             */
            get _panningMouseButton() {
                return this._panningMouseButtonInternal;
            }
            set _panningMouseButton(value) {
                this._panningMouseButtonInternal = value;
                const entry = this.movement.input.getEntry("pointer", "pan", { modifiers: {} });
                if (entry) {
                    entry.button = value;
                }
            }
            /**
             * If true, indicates the camera is currently interpolating to a new pose.
             */
            get isInterpolating() {
                return this._isInterpolating;
            }
            /**
             * Gets the bouncing behavior of the camera if it has been enabled.
             * @see https://doc.babylonjs.com/features/featuresDeepDive/behaviors/cameraBehaviors#bouncing-behavior
             */
            get bouncingBehavior() {
                return this._bouncingBehavior;
            }
            /**
             * Defines if the bouncing behavior of the camera is enabled on the camera.
             * @see https://doc.babylonjs.com/features/featuresDeepDive/behaviors/cameraBehaviors#bouncing-behavior
             */
            get useBouncingBehavior() {
                return this._bouncingBehavior != null;
            }
            set useBouncingBehavior(value) {
                if (value === this.useBouncingBehavior) {
                    return;
                }
                if (value) {
                    this._bouncingBehavior = new BouncingBehavior();
                    this.addBehavior(this._bouncingBehavior);
                }
                else if (this._bouncingBehavior) {
                    this.removeBehavior(this._bouncingBehavior);
                    this._bouncingBehavior = null;
                }
            }
            /**
             * Gets the framing behavior of the camera if it has been enabled.
             * @see https://doc.babylonjs.com/features/featuresDeepDive/behaviors/cameraBehaviors#framing-behavior
             */
            get framingBehavior() {
                return this._framingBehavior;
            }
            /**
             * Defines if the framing behavior of the camera is enabled on the camera.
             * @see https://doc.babylonjs.com/features/featuresDeepDive/behaviors/cameraBehaviors#framing-behavior
             */
            get useFramingBehavior() {
                return this._framingBehavior != null;
            }
            set useFramingBehavior(value) {
                if (value === this.useFramingBehavior) {
                    return;
                }
                if (value) {
                    this._framingBehavior = new FramingBehavior();
                    this.addBehavior(this._framingBehavior);
                }
                else if (this._framingBehavior) {
                    this.removeBehavior(this._framingBehavior);
                    this._framingBehavior = null;
                }
            }
            /**
             * Gets the auto rotation behavior of the camera if it has been enabled.
             * @see https://doc.babylonjs.com/features/featuresDeepDive/behaviors/cameraBehaviors#autorotation-behavior
             */
            get autoRotationBehavior() {
                return this._autoRotationBehavior;
            }
            /**
             * Defines if the auto rotation behavior of the camera is enabled on the camera.
             * @see https://doc.babylonjs.com/features/featuresDeepDive/behaviors/cameraBehaviors#autorotation-behavior
             */
            get useAutoRotationBehavior() {
                return this._autoRotationBehavior != null;
            }
            set useAutoRotationBehavior(value) {
                if (value === this.useAutoRotationBehavior) {
                    return;
                }
                if (value) {
                    this._autoRotationBehavior = new AutoRotationBehavior();
                    this.addBehavior(this._autoRotationBehavior);
                }
                else if (this._autoRotationBehavior) {
                    this.removeBehavior(this._autoRotationBehavior);
                    this._autoRotationBehavior = null;
                }
            }
            /**
             * Instantiates a new ArcRotateCamera in a given scene
             * @param name Defines the name of the camera
             * @param alpha Defines the camera rotation along the longitudinal axis
             * @param beta Defines the camera rotation along the latitudinal axis
             * @param radius Defines the camera distance from its target
             * @param target Defines the camera target
             * @param scene Defines the scene the camera belongs to
             * @param setActiveOnSceneIfNoneActive Defines whether the camera should be marked as active if not other active cameras have been defined
             */
            constructor(name, alpha, beta, radius, target, scene, setActiveOnSceneIfNoneActive = true) {
                super(name, Vector3.Zero(), scene, setActiveOnSceneIfNoneActive);
                /**
                 * Defines the rotation angle of the camera along the longitudinal axis.
                 */
                this.alpha = (__runInitializers(this, _instanceExtraInitializers), __runInitializers(this, _alpha_initializers, void 0));
                /**
                 * Defines the rotation angle of the camera along the latitudinal axis.
                 */
                this.beta = (__runInitializers(this, _alpha_extraInitializers), __runInitializers(this, _beta_initializers, void 0));
                /**
                 * Defines the radius of the camera from its target point.
                 */
                this.radius = (__runInitializers(this, _beta_extraInitializers), __runInitializers(this, _radius_initializers, void 0));
                /**
                 * Defines an override value to use as the parameter to setTarget.
                 * This allows the parameter to be specified when animating the target (e.g. using FramingBehavior).
                 */
                this.overrideCloneAlphaBetaRadius = (__runInitializers(this, _radius_extraInitializers), __runInitializers(this, _overrideCloneAlphaBetaRadius_initializers, void 0));
                this._target = (__runInitializers(this, _overrideCloneAlphaBetaRadius_extraInitializers), __runInitializers(this, __target_initializers, void 0));
                this._targetHost = (__runInitializers(this, __target_extraInitializers), __runInitializers(this, __targetHost_initializers, void 0));
                // eslint-disable-next-line @typescript-eslint/naming-convention
                this._upToYMatrix = __runInitializers(this, __targetHost_extraInitializers);
                this._inertialAlphaOffset = 0;
                this._inertialBetaOffset = 0;
                this._inertialRadiusOffset = 0;
                /**
                 * Minimum allowed angle on the longitudinal axis.
                 * This can help limiting how the Camera is able to move in the scene.
                 */
                this.lowerAlphaLimit = __runInitializers(this, _lowerAlphaLimit_initializers, null);
                /**
                 * Maximum allowed angle on the longitudinal axis.
                 * This can help limiting how the Camera is able to move in the scene.
                 */
                this.upperAlphaLimit = (__runInitializers(this, _lowerAlphaLimit_extraInitializers), __runInitializers(this, _upperAlphaLimit_initializers, null));
                /**
                 * Minimum allowed angle on the latitudinal axis.
                 * This can help limiting how the Camera is able to move in the scene.
                 */
                this.lowerBetaLimit = (__runInitializers(this, _upperAlphaLimit_extraInitializers), __runInitializers(this, _lowerBetaLimit_initializers, 0.01));
                /**
                 * Maximum allowed angle on the latitudinal axis.
                 * This can help limiting how the Camera is able to move in the scene.
                 */
                this.upperBetaLimit = (__runInitializers(this, _lowerBetaLimit_extraInitializers), __runInitializers(this, _upperBetaLimit_initializers, Math.PI - 0.01));
                /**
                 * Minimum allowed distance of the camera to the target (The camera can not get closer).
                 * This can help limiting how the Camera is able to move in the scene.
                 */
                this.lowerRadiusLimit = (__runInitializers(this, _upperBetaLimit_extraInitializers), __runInitializers(this, _lowerRadiusLimit_initializers, null));
                /**
                 * Maximum allowed distance of the camera to the target (The camera can not get further).
                 * This can help limiting how the Camera is able to move in the scene.
                 */
                this.upperRadiusLimit = (__runInitializers(this, _lowerRadiusLimit_extraInitializers), __runInitializers(this, _upperRadiusLimit_initializers, null));
                /**
                 * Minimum allowed vertical target position of the camera.
                 * Use this setting in combination with `upperRadiusLimit` to set a global limit for the Cameras vertical position.
                 */
                this.lowerTargetYLimit = (__runInitializers(this, _upperRadiusLimit_extraInitializers), __runInitializers(this, _lowerTargetYLimit_initializers, -Infinity));
                /**
                 * Defines the current inertia value used during panning of the camera along the X axis.
                 */
                this.inertialPanningX = (__runInitializers(this, _lowerTargetYLimit_extraInitializers), __runInitializers(this, _inertialPanningX_initializers, 0));
                /**
                 * Defines the current inertia value used during panning of the camera along the Y axis.
                 */
                this.inertialPanningY = (__runInitializers(this, _inertialPanningX_extraInitializers), __runInitializers(this, _inertialPanningY_initializers, 0));
                /**
                 * Defines the distance used to consider the camera in pan mode vs pinch/zoom.
                 * Basically if your fingers moves away from more than this distance you will be considered
                 * in pinch mode.
                 */
                this.pinchToPanMaxDistance = (__runInitializers(this, _inertialPanningY_extraInitializers), __runInitializers(this, _pinchToPanMaxDistance_initializers, 20));
                /**
                 * Defines the maximum distance the camera can pan.
                 * This could help keeping the camera always in your scene.
                 */
                this.panningDistanceLimit = (__runInitializers(this, _pinchToPanMaxDistance_extraInitializers), __runInitializers(this, _panningDistanceLimit_initializers, null));
                /**
                 * Defines the target of the camera before panning.
                 */
                this.panningOriginTarget = (__runInitializers(this, _panningDistanceLimit_extraInitializers), __runInitializers(this, _panningOriginTarget_initializers, Vector3.Zero()));
                this._panningInertia = (__runInitializers(this, _panningOriginTarget_extraInitializers), 0.9);
                this._inertia = 0.9;
                //-- end properties for backward compatibility for inputs
                /**
                 * Defines how much the radius should be scaled while zooming on a particular mesh (through the zoomOn function)
                 */
                this.zoomOnFactor = __runInitializers(this, _zoomOnFactor_initializers, 1);
                /**
                 * Defines a screen offset for the camera position.
                 */
                this.targetScreenOffset = (__runInitializers(this, _zoomOnFactor_extraInitializers), __runInitializers(this, _targetScreenOffset_initializers, Vector2.Zero()));
                /**
                 * Allows the camera to be completely reversed.
                 * If false the camera can not arrive upside down.
                 */
                this.allowUpsideDown = (__runInitializers(this, _targetScreenOffset_extraInitializers), __runInitializers(this, _allowUpsideDown_initializers, true));
                /**
                 * Define if double tap/click is used to restore the previously saved state of the camera.
                 */
                this.useInputToRestoreState = (__runInitializers(this, _allowUpsideDown_extraInitializers), __runInitializers(this, _useInputToRestoreState_initializers, true));
                /**
                 * Factor for restoring information interpolation. default is 0 = off. Any value \< 0 or \> 1 will disable interpolation.
                 */
                this.restoreStateInterpolationFactor = (__runInitializers(this, _useInputToRestoreState_extraInitializers), __runInitializers(this, _restoreStateInterpolationFactor_initializers, 0));
                this._currentInterpolationFactor = (__runInitializers(this, _restoreStateInterpolationFactor_extraInitializers), 0);
                /** @internal */
                this._viewMatrix = new Matrix();
                this._useCtrlForPanningInternal = true;
                this._panningMouseButtonInternal = 2;
                /**
                 * Defines the allowed panning axis.
                 */
                this.panningAxis = new Vector3(1, 1, 0);
                this._transformedDirection = new Vector3();
                /**
                 * Defines if camera will eliminate transform on y axis.
                 */
                this.mapPanning = false;
                // This is redundant with all _goal* properties being NaN, but we track it anyway because we check for active interpolation in the hot path.
                this._isInterpolating = false;
                /**
                 * Observable triggered when the transform node target has been changed on the camera.
                 */
                this.onMeshTargetChangedObservable = new Observable();
                /**
                 * Defines whether the camera should check collision with the objects oh the scene.
                 * @see https://doc.babylonjs.com/features/featuresDeepDive/cameras/camera_collisions#how-can-i-do-this-
                 */
                this.checkCollisions = false;
                /**
                 * Defines the collision radius of the camera.
                 * This simulates a sphere around the camera.
                 * @see https://doc.babylonjs.com/features/featuresDeepDive/cameras/camera_collisions#arcrotatecamera
                 */
                this.collisionRadius = new Vector3(0.5, 0.5, 0.5);
                this._previousPosition = Vector3.Zero();
                this._collisionVelocity = Vector3.Zero();
                this._newPosition = Vector3.Zero();
                this._computationVector = Vector3.Zero();
                this._goalAlpha = NaN;
                this._goalBeta = NaN;
                this._goalRadius = NaN;
                this._goalTarget = new Vector3(NaN, NaN, NaN);
                this._goalTargetScreenOffset = new Vector2(NaN, NaN);
                this._onCollisionPositionChange = (collisionId, newPosition, collidedMesh = null) => {
                    if (!collidedMesh) {
                        this._previousPosition.copyFrom(this._position);
                    }
                    else {
                        this.setPosition(newPosition);
                        if (this.onCollide) {
                            this.onCollide(collidedMesh);
                        }
                    }
                    // Recompute because of constraints
                    const cosa = Math.cos(this.alpha);
                    const sina = Math.sin(this.alpha);
                    const cosb = Math.cos(this.beta);
                    let sinb = Math.sin(this.beta);
                    if (sinb === 0) {
                        sinb = 0.0001;
                    }
                    const target = this._getTargetPosition();
                    this._computationVector.copyFromFloats(this.radius * cosa * sinb, this.radius * cosb, this.radius * sina * sinb);
                    target.addToRef(this._computationVector, this._newPosition);
                    this._position.copyFrom(this._newPosition);
                    let up = this.upVector;
                    if (this.allowUpsideDown && this.beta < 0) {
                        up = up.clone();
                        up = up.negate();
                    }
                    this._computeViewMatrix(this._position, target, up);
                    this._viewMatrix.addAtIndex(12, this.targetScreenOffset.x);
                    this._viewMatrix.addAtIndex(13, this.targetScreenOffset.y);
                    this._collisionTriggered = false;
                };
                this._target = Vector3.Zero();
                if (target) {
                    this.setTarget(target);
                }
                this.alpha = alpha;
                this.beta = beta;
                this.radius = radius;
                this.getViewMatrix();
                this.inputs = new ArcRotateCameraInputsManager(this);
                this.inputs.addKeyboard().addMouseWheel().addPointers();
                this.movement = new ArcRotateCameraMovement(this.getScene(), this._position);
                // Seed movement-system inertia from the values set during base/subclass construction.
                // After this point, the inertia/panningInertia setters on this class push directly to movement.
                this.movement.rotationInertia = this._inertia;
                this.movement.zoomInertia = this._inertia;
                this.movement.panInertia = this._panningInertia;
            }
            // Cache
            /** @internal */
            _initCache() {
                super._initCache();
                this._cache._target = new Vector3(Number.MAX_VALUE, Number.MAX_VALUE, Number.MAX_VALUE);
                this._cache.alpha = undefined;
                this._cache.beta = undefined;
                this._cache.radius = undefined;
                this._cache.targetScreenOffset = Vector2.Zero();
            }
            /**
             * @internal
             */
            _updateCache(ignoreParentClass) {
                if (!ignoreParentClass) {
                    super._updateCache();
                }
                this._cache._target.copyFrom(this._getTargetPosition());
                this._cache.alpha = this.alpha;
                this._cache.beta = this.beta;
                this._cache.radius = this.radius;
                this._cache.targetScreenOffset.copyFrom(this.targetScreenOffset);
            }
            _getTargetPosition() {
                if (this._targetHost && this._targetHost.getAbsolutePosition) {
                    const pos = this._targetHost.getAbsolutePosition();
                    if (this._targetBoundingCenter) {
                        pos.addToRef(this._targetBoundingCenter, this._target);
                    }
                    else {
                        this._target.copyFrom(pos);
                    }
                }
                const lockedTargetPosition = this._getLockedTargetPosition();
                if (lockedTargetPosition) {
                    return lockedTargetPosition;
                }
                return this._target;
            }
            /**
             * Stores the current state of the camera (alpha, beta, radius and target)
             * @returns the camera itself
             */
            storeState() {
                this._storedAlpha = this.alpha;
                this._storedBeta = this.beta;
                this._storedRadius = this.radius;
                this._storedTarget = this._getTargetPosition().clone();
                this._storedTargetScreenOffset = this.targetScreenOffset.clone();
                return super.storeState();
            }
            /**
             * @internal
             * Restored camera state. You must call storeState() first
             */
            _restoreStateValues() {
                if (this.hasStateStored() && this.restoreStateInterpolationFactor > Epsilon && this.restoreStateInterpolationFactor < 1) {
                    this.interpolateTo(this._storedAlpha, this._storedBeta, this._storedRadius, this._storedTarget, this._storedTargetScreenOffset, this.restoreStateInterpolationFactor);
                    return true;
                }
                if (!super._restoreStateValues()) {
                    return false;
                }
                this.setTarget(this._storedTarget.clone());
                this.alpha = this._storedAlpha;
                this.beta = this._storedBeta;
                this.radius = this._storedRadius;
                this.targetScreenOffset = this._storedTargetScreenOffset.clone();
                this.inertialAlphaOffset = 0;
                this.inertialBetaOffset = 0;
                this.inertialRadiusOffset = 0;
                this.inertialPanningX = 0;
                this.inertialPanningY = 0;
                return true;
            }
            /**
             * Stops any in-progress interpolation.
             */
            stopInterpolation() {
                this._goalAlpha = NaN;
                this._goalBeta = NaN;
                this._goalRadius = NaN;
                this._goalTarget.set(NaN, NaN, NaN);
                this._goalTargetScreenOffset.set(NaN, NaN);
            }
            /**
             * Interpolates the camera to a goal state.
             * @param alpha Defines the goal alpha.
             * @param beta Defines the goal beta.
             * @param radius Defines the goal radius.
             * @param target Defines the goal target.
             * @param targetScreenOffset Defines the goal target screen offset.
             * @param interpolationFactor A value  between 0 and 1 that determines the speed of the interpolation.
             * @remarks Passing undefined for any of the parameters will use the current value (effectively stopping any in-progress interpolation for that parameter).
             *          Passing NaN will not start or stop any interpolation for that parameter (effectively allowing multiple interpolations of different parameters to overlap).
             */
            interpolateTo(alpha = this.alpha, beta = this.beta, radius = this.radius, target = this.target, targetScreenOffset = this.targetScreenOffset, interpolationFactor) {
                this.inertialAlphaOffset = 0;
                this.inertialBetaOffset = 0;
                this.inertialRadiusOffset = 0;
                this.inertialPanningX = 0;
                this.inertialPanningY = 0;
                if (interpolationFactor != null) {
                    this._currentInterpolationFactor = interpolationFactor;
                }
                else if (this.restoreStateInterpolationFactor !== 0) {
                    this._currentInterpolationFactor = this.restoreStateInterpolationFactor;
                }
                else {
                    this._currentInterpolationFactor = 0.1;
                }
                // If NaN is passed in for a goal value, keep the current goal value.
                this._goalAlpha = CheckNaN(alpha, this._goalAlpha);
                this._goalBeta = CheckNaN(beta, this._goalBeta);
                this._goalRadius = CheckNaN(radius, this._goalRadius);
                this._goalTarget.set(CheckNaN(target.x, this._goalTarget.x), CheckNaN(target.y, this._goalTarget.y), CheckNaN(target.z, this._goalTarget.z));
                this._goalTargetScreenOffset.set(CheckNaN(targetScreenOffset.x, this._goalTargetScreenOffset.x), CheckNaN(targetScreenOffset.y, this._goalTargetScreenOffset.y));
                this._goalAlpha = Clamp(this._goalAlpha, this.lowerAlphaLimit ?? -Infinity, this.upperAlphaLimit ?? Infinity);
                this._goalBeta = Clamp(this._goalBeta, this.lowerBetaLimit ?? -Infinity, this.upperBetaLimit ?? Infinity);
                this._goalRadius = Clamp(this._goalRadius, this.lowerRadiusLimit ?? -Infinity, this.upperRadiusLimit ?? Infinity);
                this._goalTarget.y = Clamp(this._goalTarget.y, this.lowerTargetYLimit ?? -Infinity, Infinity);
                this._isInterpolating = true;
            }
            // Synchronized
            /** @internal */
            _isSynchronizedViewMatrix() {
                if (!super._isSynchronizedViewMatrix()) {
                    return false;
                }
                return (this._cache._target.equals(this._getTargetPosition()) &&
                    this._cache.alpha === this.alpha &&
                    this._cache.beta === this.beta &&
                    this._cache.radius === this.radius &&
                    this._cache.targetScreenOffset.equals(this.targetScreenOffset));
            }
            /**
             * Attached controls to the current camera.
             * @param ignored defines an ignored parameter kept for backward compatibility.
             * @param noPreventDefault Defines whether event caught by the controls should call preventdefault() (https://developer.mozilla.org/en-US/docs/Web/API/Event/preventDefault)
             * @param useCtrlForPanning  Defines whether ctrl is used for panning within the controls
             * @param panningMouseButton Defines whether panning is allowed through mouse click button
             */
            attachControl(ignored, noPreventDefault, useCtrlForPanning = true, panningMouseButton = 2) {
                const args = arguments;
                noPreventDefault = Tools.BackCompatCameraNoPreventDefault(args);
                this._useCtrlForPanning = useCtrlForPanning;
                this._panningMouseButton = panningMouseButton;
                // backwards compatibility
                if (typeof args[0] === "boolean") {
                    if (args.length > 1) {
                        this._useCtrlForPanning = args[1];
                    }
                    if (args.length > 2) {
                        this._panningMouseButton = args[2];
                    }
                }
                this.inputs.attachElement(noPreventDefault);
                this._reset = () => {
                    this.inertialAlphaOffset = 0;
                    this.inertialBetaOffset = 0;
                    this.inertialRadiusOffset = 0;
                    this.inertialPanningX = 0;
                    this.inertialPanningY = 0;
                };
            }
            /**
             * Detach the current controls from the specified dom element.
             */
            detachControl() {
                this.inputs.detachElement();
                if (this._reset) {
                    this._reset();
                }
            }
            /**
             * Applies rotation and zoom deltas to the camera, handling invertRotation, handedness, and beta-flip.
             * Shared by both the movement system and legacy inertia paths.
             * @param alphaOffset - Alpha (horizontal orbit) delta
             * @param betaOffset - Beta (vertical orbit) delta
             * @param radiusOffset - Radius (zoom) delta
             */
            _applyRotationAndZoomDelta(alphaOffset, betaOffset, radiusOffset) {
                const directionModifier = this.invertRotation ? -1 : 1;
                const handednessMultiplier = this._calculateHandednessMultiplier();
                let adjustedAlpha = alphaOffset * handednessMultiplier;
                if (this.beta < 0) {
                    adjustedAlpha *= -1;
                }
                this.alpha += adjustedAlpha * directionModifier;
                this.beta += betaOffset * directionModifier;
                this.radius -= radiusOffset;
            }
            /**
             * Applies a pan delta to the camera target in screen space.
             * Shared by both the movement system and legacy inertia paths.
             * @param panX - Horizontal pan delta
             * @param panY - Vertical pan delta
             */
            _applyPanDelta(panX, panY) {
                const localDirection = TmpVectors.Vector3[0].copyFromFloats(panX, panY, panY);
                this._viewMatrix.invertToRef(this._cameraTransformMatrix);
                localDirection.multiplyInPlace(this.panningAxis);
                Vector3.TransformNormalToRef(localDirection, this._cameraTransformMatrix, this._transformedDirection);
                if (this.mapPanning) {
                    const up = this.upVector;
                    const right = Vector3.CrossToRef(this._transformedDirection, up, this._transformedDirection);
                    Vector3.CrossToRef(up, right, this._transformedDirection);
                }
                else if (!this.panningAxis.y) {
                    this._transformedDirection.y = 0;
                }
                if (!this._targetHost) {
                    if (this.panningDistanceLimit !== null) {
                        this._transformedDirection.addInPlace(this._target);
                        const distanceSquared = Vector3.DistanceSquared(this._transformedDirection, this.panningOriginTarget);
                        if (distanceSquared <= this.panningDistanceLimit * this.panningDistanceLimit) {
                            this._target.copyFrom(this._transformedDirection);
                        }
                    }
                    else {
                        if (this.parent) {
                            const m = TmpVectors.Matrix[0];
                            this.parent.getWorldMatrix().getRotationMatrixToRef(m);
                            m.transposeToRef(m);
                            Vector3.TransformCoordinatesToRef(this._transformedDirection, m, this._transformedDirection);
                        }
                        this._target.addInPlace(this._transformedDirection);
                    }
                }
            }
            /** @internal */
            _checkInputs() {
                //if (async) collision inspection was triggered, don't update the camera's position - until the collision callback was called.
                if (this._collisionTriggered) {
                    return;
                }
                this.inputs.checkInputs();
                let hasUserInteractions = false;
                this.movement.computeCurrentFrameDeltas();
                const rotDelta = this.movement.rotationDeltaCurrentFrame;
                const zoomDelta = this.movement.zoomDeltaCurrentFrame;
                const panDelta = this.movement.panDeltaCurrentFrame;
                if (rotDelta.x !== 0 || rotDelta.y !== 0 || zoomDelta !== 0 || panDelta.x !== 0 || panDelta.y !== 0) {
                    hasUserInteractions = true;
                    if (rotDelta.x !== 0 || rotDelta.y !== 0 || zoomDelta !== 0) {
                        this._applyRotationAndZoomDelta(rotDelta.x, rotDelta.y, zoomDelta);
                    }
                    if (panDelta.x !== 0 || panDelta.y !== 0) {
                        this._applyPanDelta(panDelta.x, panDelta.y);
                    }
                }
                // Legacy inertial offsets — backward compat path. Handles direct writes to inertialAlphaOffset
                // etc. (including zoomToMouseLocation which writes to inertialRadiusOffset).
                // Only activates when these values are nonzero, so it is free when unused.
                // We check the private fields here instead of the public getters because the getters fall back
                // to the movement system's current-frame deltas (for back-compat polling), which would cause
                // double-application of the rotation/zoom that movement.computeCurrentFrameDeltas just produced.
                //
                // Note: unlike TargetCamera, none of ArcRotateCamera's channels (rotate/zoom/pan) scale their
                // magnitude by `this.speed` (movement.speed stays 1; inputs use angularSensibility / wheel
                // precision / panningSensibility). So the glide cutoffs below must NOT be scaled by `speed` —
                // doing so only truncated the inertia tail earlier at higher speeds without making the camera
                // any faster (forum 61001).
                if (this._inertialAlphaOffset !== 0 || this._inertialBetaOffset !== 0 || this._inertialRadiusOffset !== 0) {
                    this._applyRotationAndZoomDelta(this._inertialAlphaOffset, this._inertialBetaOffset, this._inertialRadiusOffset);
                    this._inertialAlphaOffset *= this.inertia;
                    this._inertialBetaOffset *= this.inertia;
                    this._inertialRadiusOffset *= this.inertia;
                    if (Math.abs(this._inertialAlphaOffset) < this._rotationEpsilon) {
                        this._inertialAlphaOffset = 0;
                    }
                    if (Math.abs(this._inertialBetaOffset) < this._rotationEpsilon) {
                        this._inertialBetaOffset = 0;
                    }
                    if (Math.abs(this._inertialRadiusOffset) < this._rotationEpsilon) {
                        this._inertialRadiusOffset = 0;
                    }
                    hasUserInteractions = true;
                }
                if (this.inertialPanningX !== 0 || this.inertialPanningY !== 0) {
                    this._applyPanDelta(this.inertialPanningX, this.inertialPanningY);
                    this.inertialPanningX *= this.panningInertia;
                    this.inertialPanningY *= this.panningInertia;
                    const inertialPanningLimit = this._panningEpsilon;
                    if (Math.abs(this.inertialPanningX) < inertialPanningLimit) {
                        this.inertialPanningX = 0;
                    }
                    if (Math.abs(this.inertialPanningY) < inertialPanningLimit) {
                        this.inertialPanningY = 0;
                    }
                    hasUserInteractions = true;
                }
                if (hasUserInteractions) {
                    this.stopInterpolation();
                }
                else if (this._isInterpolating) {
                    let isInterpolating = false;
                    const dt = this._scene.getEngine().getDeltaTime() / 1000;
                    const t = 1 - Math.pow(2, -dt / this._currentInterpolationFactor);
                    // NOTE: If the goal is NaN, it means we are not interpolating to a new value, so we can use the current value. Hence the calls to checkNaN.
                    // Get the goal radius immediately as we'll need it for determining interpolation termination for the target.
                    const goalRadius = CheckNaN(this._goalRadius, this.radius);
                    // Interpolate the target if we haven't reached the goal yet.
                    if (!isNaN(this._goalTarget.x) || !isNaN(this._goalTarget.y) || !isNaN(this._goalTarget.z)) {
                        const goalTarget = TmpVectors.Vector3[0].set(CheckNaN(this._goalTarget.x, this._target.x), CheckNaN(this._goalTarget.y, this._target.y), CheckNaN(this._goalTarget.z, this._target.z));
                        Vector3.LerpToRef(this.target, goalTarget, t, this._target);
                        // Terminate the target interpolation if we the target is close relative to the radius.
                        // This is when visually (regardless of scale) the target appears close to its final goal position.
                        if ((Vector3.Distance(this.target, goalTarget) * 10) / goalRadius < Epsilon) {
                            this._goalTarget.set(NaN, NaN, NaN);
                            this.target.copyFrom(goalTarget);
                            // Call setTarget to trigger side effects like onMeshTargetChangedObservable.
                            // NOTE: We pass in true for allowSamePosition because we already checked that the goal target is different from the current target,
                            // but since we are updating the existing target Vector3 instance, it will otherwise look like the value has not changed.
                            this.setTarget(this.target, false, true, true);
                        }
                        else {
                            isInterpolating = true;
                        }
                    }
                    // Interpolate the rotation if we haven't reached the goal yet.
                    if (!isNaN(this._goalAlpha) || !isNaN(this._goalBeta)) {
                        // Using quaternion for smoother interpolation (and no Euler angles modulo)
                        const goalRotation = Quaternion.RotationAlphaBetaGammaToRef(CheckNaN(this._goalAlpha, this.alpha), CheckNaN(this._goalBeta, this.beta), 0, TmpVectors.Quaternion[0]);
                        const currentRotation = Quaternion.RotationAlphaBetaGammaToRef(this.alpha, this.beta, 0, TmpVectors.Quaternion[1]);
                        const newRotation = Quaternion.SlerpToRef(currentRotation, goalRotation, t, TmpVectors.Quaternion[2]);
                        newRotation.normalize();
                        const newAlphaBetaGamma = newRotation.toAlphaBetaGammaToRef(TmpVectors.Vector3[0]);
                        this.alpha = newAlphaBetaGamma.x;
                        this.beta = newAlphaBetaGamma.y;
                        // Terminate the rotation interpolation when the rotation appears visually close to the final goal rotation.
                        if (newRotation.isApprox(goalRotation, Epsilon / 5)) {
                            this._goalAlpha = NaN;
                            this._goalBeta = NaN;
                            const goalAlphaBetaGamma = goalRotation.toAlphaBetaGammaToRef(TmpVectors.Vector3[0]);
                            this.alpha = goalAlphaBetaGamma.x;
                            this.beta = goalAlphaBetaGamma.y;
                        }
                        else {
                            isInterpolating = true;
                        }
                    }
                    // Interpolate the radius if we haven't reached the goal yet.
                    if (!isNaN(this._goalRadius)) {
                        this.radius += (goalRadius - this.radius) * t;
                        // Terminate the radius interpolation when we are 99.9% of the way to the goal radius, at which point it is visually indistinguishable from the goal.
                        if (Math.abs(goalRadius / this.radius - 1) < Epsilon) {
                            this._goalRadius = NaN;
                            this.radius = goalRadius;
                        }
                        else {
                            isInterpolating = true;
                        }
                    }
                    // Interpolate the target screen offset if we haven't reached the goal yet.
                    if (!isNaN(this._goalTargetScreenOffset.x) || !isNaN(this._goalTargetScreenOffset.y)) {
                        const goalTargetScreenOffset = TmpVectors.Vector2[0].set(CheckNaN(this._goalTargetScreenOffset.x, this.targetScreenOffset.x), CheckNaN(this._goalTargetScreenOffset.y, this.targetScreenOffset.y));
                        Vector2.LerpToRef(this.targetScreenOffset, goalTargetScreenOffset, t, this.targetScreenOffset);
                        // Terminate the target screen offset interpolation when the target screen offset appears visually close to the final goal target screen offset.
                        if (Vector2.Distance(this.targetScreenOffset, goalTargetScreenOffset) < Epsilon) {
                            this._goalTargetScreenOffset.set(NaN, NaN);
                            this.targetScreenOffset.copyFrom(goalTargetScreenOffset);
                        }
                        else {
                            isInterpolating = true;
                        }
                    }
                    this._isInterpolating = isInterpolating;
                }
                // Limits
                this._checkLimits();
                super._checkInputs();
            }
            _checkLimits() {
                if (this.lowerBetaLimit === null || this.lowerBetaLimit === undefined) {
                    if (this.allowUpsideDown && this.beta > Math.PI) {
                        this.beta = this.beta - 2 * Math.PI;
                    }
                }
                else {
                    if (this.beta < this.lowerBetaLimit) {
                        this.beta = this.lowerBetaLimit;
                    }
                }
                if (this.upperBetaLimit === null || this.upperBetaLimit === undefined) {
                    if (this.allowUpsideDown && this.beta < -Math.PI) {
                        this.beta = this.beta + 2 * Math.PI;
                    }
                }
                else {
                    if (this.beta > this.upperBetaLimit) {
                        this.beta = this.upperBetaLimit;
                    }
                }
                if (this.lowerAlphaLimit !== null && this.alpha < this.lowerAlphaLimit) {
                    this.alpha = this.lowerAlphaLimit;
                }
                if (this.upperAlphaLimit !== null && this.alpha > this.upperAlphaLimit) {
                    this.alpha = this.upperAlphaLimit;
                }
                if (this.lowerRadiusLimit !== null && this.radius < this.lowerRadiusLimit) {
                    this.radius = this.lowerRadiusLimit;
                    this.inertialRadiusOffset = 0;
                }
                if (this.upperRadiusLimit !== null && this.radius > this.upperRadiusLimit) {
                    this.radius = this.upperRadiusLimit;
                    this.inertialRadiusOffset = 0;
                }
                this.target.y = Math.max(this.target.y, this.lowerTargetYLimit);
            }
            /**
             * Rebuilds angles (alpha, beta) and radius from the give position and target
             */
            rebuildAnglesAndRadius() {
                this._position.subtractToRef(this._getTargetPosition(), this._computationVector);
                // need to rotate to Y up equivalent if up vector not Axis.Y
                if (this._upVector.x !== 0 || this._upVector.y !== 1.0 || this._upVector.z !== 0) {
                    Vector3.TransformCoordinatesToRef(this._computationVector, this._upToYMatrix, this._computationVector);
                }
                this.radius = this._computationVector.length();
                if (this.radius === 0) {
                    this.radius = 0.0001; // Just to avoid division by zero
                }
                // Alpha and Beta
                const previousAlpha = this.alpha;
                this.alpha = ComputeAlpha(this._computationVector);
                this.beta = ComputeBeta(this._computationVector.y, this.radius);
                // Calculate the number of revolutions between the new and old alpha values.
                const alphaCorrectionTurns = Math.round((previousAlpha - this.alpha) / (2.0 * Math.PI));
                // Adjust alpha so that its numerical representation is the closest one to the old value.
                this.alpha += alphaCorrectionTurns * 2.0 * Math.PI;
                this._checkLimits();
            }
            /**
             * Use a position to define the current camera related information like alpha, beta and radius
             * @param position Defines the position to set the camera at
             */
            setPosition(position) {
                if (this._position.equals(position)) {
                    return;
                }
                this._position.copyFrom(position);
                this.rebuildAnglesAndRadius();
            }
            /**
             * Defines the target the camera should look at.
             * This will automatically adapt alpha beta and radius to fit within the new target.
             * Please note that setting a target as a mesh will disable panning.
             * @param target Defines the new target as a Vector or a transform node
             * @param toBoundingCenter In case of a mesh target, defines whether to target the mesh position or its bounding information center
             * @param allowSamePosition If false, prevents reapplying the new computed position if it is identical to the current one (optim)
             * @param cloneAlphaBetaRadius If true, replicate the current setup (alpha, beta, radius) on the new target
             */
            setTarget(target, toBoundingCenter = false, allowSamePosition = false, cloneAlphaBetaRadius = false) {
                cloneAlphaBetaRadius = this.overrideCloneAlphaBetaRadius ?? cloneAlphaBetaRadius;
                if (target.computeWorldMatrix) {
                    if (toBoundingCenter && target.getBoundingInfo) {
                        this._targetBoundingCenter = target.getBoundingInfo().boundingBox.centerWorld.clone();
                    }
                    else {
                        this._targetBoundingCenter = null;
                    }
                    target.computeWorldMatrix();
                    this._targetHost = target;
                    this._target = this._getTargetPosition();
                    this.onMeshTargetChangedObservable.notifyObservers(this._targetHost);
                }
                else {
                    const newTarget = target;
                    const currentTarget = this._getTargetPosition();
                    if (currentTarget && !allowSamePosition && currentTarget.equals(newTarget)) {
                        return;
                    }
                    this._targetHost = null;
                    this._target = newTarget;
                    this._targetBoundingCenter = null;
                    this.onMeshTargetChangedObservable.notifyObservers(null);
                }
                if (!cloneAlphaBetaRadius) {
                    this.rebuildAnglesAndRadius();
                }
            }
            /** @internal */
            _getViewMatrix() {
                // Compute
                const cosa = Math.cos(this.alpha);
                const sina = Math.sin(this.alpha);
                const cosb = Math.cos(this.beta);
                let sinb = Math.sin(this.beta);
                if (sinb === 0) {
                    sinb = 0.0001;
                }
                if (this.radius === 0) {
                    this.radius = 0.0001; // Just to avoid division by zero
                }
                const target = this._getTargetPosition();
                this._computationVector.copyFromFloats(this.radius * cosa * sinb, this.radius * cosb, this.radius * sina * sinb);
                // Rotate according to up vector
                if (this._upVector.x !== 0 || this._upVector.y !== 1.0 || this._upVector.z !== 0) {
                    Vector3.TransformCoordinatesToRef(this._computationVector, this._yToUpMatrix, this._computationVector);
                }
                target.addToRef(this._computationVector, this._newPosition);
                if (this.getScene().collisionsEnabled && this.checkCollisions) {
                    const coordinator = this.getScene().collisionCoordinator;
                    if (!this._collider) {
                        this._collider = coordinator.createCollider();
                    }
                    this._collider._radius = this.collisionRadius;
                    this._newPosition.subtractToRef(this._position, this._collisionVelocity);
                    this._collisionTriggered = true;
                    coordinator.getNewPosition(this._position, this._collisionVelocity, this._collider, 3, null, this._onCollisionPositionChange, this.uniqueId);
                }
                else {
                    this._position.copyFrom(this._newPosition);
                    let up = this.upVector;
                    if (this.allowUpsideDown && sinb < 0) {
                        up = up.negate();
                    }
                    this._computeViewMatrix(this._position, target, up);
                    this._viewMatrix.addAtIndex(12, this.targetScreenOffset.x);
                    this._viewMatrix.addAtIndex(13, this.targetScreenOffset.y);
                }
                this._currentTarget.copyFrom(target);
                return this._viewMatrix;
            }
            /**
             * Zooms on a mesh to be at the min distance where we could see it fully in the current viewport.
             * @param meshes Defines the mesh to zoom on
             * @param doNotUpdateMaxZ Defines whether or not maxZ should be updated whilst zooming on the mesh (this can happen if the mesh is big and the maxradius pretty small for instance)
             */
            zoomOn(meshes, doNotUpdateMaxZ = false) {
                meshes = meshes || this.getScene().meshes;
                const minMaxVector = Mesh.MinMax(meshes);
                let distance = this._calculateLowerRadiusFromModelBoundingSphere(minMaxVector.min, minMaxVector.max);
                // If there are defined limits, we need to take them into account
                distance = Math.max(Math.min(distance, this.upperRadiusLimit || Number.MAX_VALUE), this.lowerRadiusLimit || 0);
                this.radius = distance * this.zoomOnFactor;
                if (this.mode === Camera.ORTHOGRAPHIC_CAMERA) {
                    const aspectRatio = this.getScene().getEngine().getAspectRatio(this);
                    const orthoExtent = (distance * this.zoomOnFactor) / 2;
                    this.orthoLeft = -orthoExtent * aspectRatio;
                    this.orthoRight = orthoExtent * aspectRatio;
                    this.orthoBottom = -orthoExtent;
                    this.orthoTop = orthoExtent;
                }
                this.focusOn({ min: minMaxVector.min, max: minMaxVector.max, distance: distance }, doNotUpdateMaxZ);
            }
            /**
             * Focus on a mesh or a bounding box. This adapts the target and maxRadius if necessary but does not update the current radius.
             * The target will be changed but the radius
             * @param meshesOrMinMaxVectorAndDistance Defines the mesh or bounding info to focus on
             * @param doNotUpdateMaxZ Defines whether or not maxZ should be updated whilst zooming on the mesh (this can happen if the mesh is big and the maxradius pretty small for instance)
             */
            focusOn(meshesOrMinMaxVectorAndDistance, doNotUpdateMaxZ = false) {
                let meshesOrMinMaxVector;
                let distance;
                if (meshesOrMinMaxVectorAndDistance.min === undefined) {
                    // meshes
                    const meshes = meshesOrMinMaxVectorAndDistance || this.getScene().meshes;
                    meshesOrMinMaxVector = Mesh.MinMax(meshes);
                    distance = Vector3.Distance(meshesOrMinMaxVector.min, meshesOrMinMaxVector.max);
                }
                else {
                    //minMaxVector and distance
                    const minMaxVectorAndDistance = meshesOrMinMaxVectorAndDistance;
                    meshesOrMinMaxVector = minMaxVectorAndDistance;
                    distance = minMaxVectorAndDistance.distance;
                }
                this._target = Mesh.Center(meshesOrMinMaxVector);
                if (!doNotUpdateMaxZ) {
                    this.maxZ = distance * 2;
                }
            }
            /**
             * @override
             * Override Camera.createRigCamera
             * @param name the name of the camera
             * @param cameraIndex the index of the camera in the rig cameras array
             */
            createRigCamera(name, cameraIndex) {
                let alphaShift = 0;
                switch (this.cameraRigMode) {
                    case Camera.RIG_MODE_STEREOSCOPIC_ANAGLYPH:
                    case Camera.RIG_MODE_STEREOSCOPIC_SIDEBYSIDE_PARALLEL:
                    case Camera.RIG_MODE_STEREOSCOPIC_OVERUNDER:
                    case Camera.RIG_MODE_STEREOSCOPIC_INTERLACED:
                    case Camera.RIG_MODE_VR:
                        alphaShift = this._cameraRigParams.stereoHalfAngle * (cameraIndex === 0 ? 1 : -1);
                        break;
                    case Camera.RIG_MODE_STEREOSCOPIC_SIDEBYSIDE_CROSSEYED:
                        alphaShift = this._cameraRigParams.stereoHalfAngle * (cameraIndex === 0 ? -1 : 1);
                        break;
                }
                const rigCam = new _a(name, this.alpha + alphaShift, this.beta, this.radius, this._target, this.getScene());
                rigCam._cameraRigParams = {};
                rigCam.isRigCamera = true;
                rigCam.rigParent = this;
                rigCam.upVector = this.upVector;
                rigCam.mode = this.mode;
                rigCam.orthoLeft = this.orthoLeft;
                rigCam.orthoRight = this.orthoRight;
                rigCam.orthoBottom = this.orthoBottom;
                rigCam.orthoTop = this.orthoTop;
                return rigCam;
            }
            /**
             * @internal
             * @override
             * Override Camera._updateRigCameras
             */
            _updateRigCameras() {
                const camLeft = this._rigCameras[0];
                const camRight = this._rigCameras[1];
                camLeft.beta = camRight.beta = this.beta;
                switch (this.cameraRigMode) {
                    case Camera.RIG_MODE_STEREOSCOPIC_ANAGLYPH:
                    case Camera.RIG_MODE_STEREOSCOPIC_SIDEBYSIDE_PARALLEL:
                    case Camera.RIG_MODE_STEREOSCOPIC_OVERUNDER:
                    case Camera.RIG_MODE_STEREOSCOPIC_INTERLACED:
                    case Camera.RIG_MODE_VR:
                        camLeft.alpha = this.alpha - this._cameraRigParams.stereoHalfAngle;
                        camRight.alpha = this.alpha + this._cameraRigParams.stereoHalfAngle;
                        break;
                    case Camera.RIG_MODE_STEREOSCOPIC_SIDEBYSIDE_CROSSEYED:
                        camLeft.alpha = this.alpha + this._cameraRigParams.stereoHalfAngle;
                        camRight.alpha = this.alpha - this._cameraRigParams.stereoHalfAngle;
                        break;
                }
                super._updateRigCameras();
            }
            /**
             * @internal
             */
            _calculateLowerRadiusFromModelBoundingSphere(minimumWorld, maximumWorld, radiusScale = 1) {
                const boxVectorGlobalDiagonal = Vector3.Distance(minimumWorld, maximumWorld);
                // Get aspect ratio in order to calculate frustum slope
                const engine = this.getScene().getEngine();
                const aspectRatio = engine.getAspectRatio(this);
                const frustumSlopeY = Math.tan(this.fov / 2);
                const frustumSlopeX = frustumSlopeY * aspectRatio;
                // Formula for setting distance
                // (Good explanation: http://stackoverflow.com/questions/2866350/move-camera-to-fit-3d-scene)
                const radiusWithoutFraming = boxVectorGlobalDiagonal * 0.5;
                // Horizon distance
                const radius = radiusWithoutFraming * radiusScale;
                const distanceForHorizontalFrustum = radius * Math.sqrt(1.0 + 1.0 / (frustumSlopeX * frustumSlopeX));
                const distanceForVerticalFrustum = radius * Math.sqrt(1.0 + 1.0 / (frustumSlopeY * frustumSlopeY));
                return Math.max(distanceForHorizontalFrustum, distanceForVerticalFrustum);
            }
            /**
             * Destroy the camera and release the current resources hold by it.
             */
            dispose() {
                this.inputs.clear();
                super.dispose();
            }
            /**
             * Gets the current object class name.
             * @returns the class name
             */
            getClassName() {
                return "ArcRotateCamera";
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _alpha_decorators = [serialize()];
            _beta_decorators = [serialize()];
            _radius_decorators = [serialize()];
            _overrideCloneAlphaBetaRadius_decorators = [serialize()];
            __target_decorators = [serializeAsVector3("target")];
            __targetHost_decorators = [serializeAsMeshReference("targetHost")];
            _get_inertialAlphaOffset_decorators = [serialize()];
            _get_inertialBetaOffset_decorators = [serialize()];
            _get_inertialRadiusOffset_decorators = [serialize()];
            _lowerAlphaLimit_decorators = [serialize()];
            _upperAlphaLimit_decorators = [serialize()];
            _lowerBetaLimit_decorators = [serialize()];
            _upperBetaLimit_decorators = [serialize()];
            _lowerRadiusLimit_decorators = [serialize()];
            _upperRadiusLimit_decorators = [serialize()];
            _lowerTargetYLimit_decorators = [serialize()];
            _inertialPanningX_decorators = [serialize()];
            _inertialPanningY_decorators = [serialize()];
            _pinchToPanMaxDistance_decorators = [serialize()];
            _panningDistanceLimit_decorators = [serialize()];
            _panningOriginTarget_decorators = [serializeAsVector3()];
            _get_panningInertia_decorators = [serialize()];
            _get_zoomToMouseLocation_decorators = [serialize()];
            _zoomOnFactor_decorators = [serialize()];
            _targetScreenOffset_decorators = [serializeAsVector2()];
            _allowUpsideDown_decorators = [serialize()];
            _useInputToRestoreState_decorators = [serialize()];
            _restoreStateInterpolationFactor_decorators = [serialize()];
            __esDecorate(_a, null, _get_inertialAlphaOffset_decorators, { kind: "getter", name: "inertialAlphaOffset", static: false, private: false, access: { has: obj => "inertialAlphaOffset" in obj, get: obj => obj.inertialAlphaOffset }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _get_inertialBetaOffset_decorators, { kind: "getter", name: "inertialBetaOffset", static: false, private: false, access: { has: obj => "inertialBetaOffset" in obj, get: obj => obj.inertialBetaOffset }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _get_inertialRadiusOffset_decorators, { kind: "getter", name: "inertialRadiusOffset", static: false, private: false, access: { has: obj => "inertialRadiusOffset" in obj, get: obj => obj.inertialRadiusOffset }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _get_panningInertia_decorators, { kind: "getter", name: "panningInertia", static: false, private: false, access: { has: obj => "panningInertia" in obj, get: obj => obj.panningInertia }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _get_zoomToMouseLocation_decorators, { kind: "getter", name: "zoomToMouseLocation", static: false, private: false, access: { has: obj => "zoomToMouseLocation" in obj, get: obj => obj.zoomToMouseLocation }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(null, null, _alpha_decorators, { kind: "field", name: "alpha", static: false, private: false, access: { has: obj => "alpha" in obj, get: obj => obj.alpha, set: (obj, value) => { obj.alpha = value; } }, metadata: _metadata }, _alpha_initializers, _alpha_extraInitializers);
            __esDecorate(null, null, _beta_decorators, { kind: "field", name: "beta", static: false, private: false, access: { has: obj => "beta" in obj, get: obj => obj.beta, set: (obj, value) => { obj.beta = value; } }, metadata: _metadata }, _beta_initializers, _beta_extraInitializers);
            __esDecorate(null, null, _radius_decorators, { kind: "field", name: "radius", static: false, private: false, access: { has: obj => "radius" in obj, get: obj => obj.radius, set: (obj, value) => { obj.radius = value; } }, metadata: _metadata }, _radius_initializers, _radius_extraInitializers);
            __esDecorate(null, null, _overrideCloneAlphaBetaRadius_decorators, { kind: "field", name: "overrideCloneAlphaBetaRadius", static: false, private: false, access: { has: obj => "overrideCloneAlphaBetaRadius" in obj, get: obj => obj.overrideCloneAlphaBetaRadius, set: (obj, value) => { obj.overrideCloneAlphaBetaRadius = value; } }, metadata: _metadata }, _overrideCloneAlphaBetaRadius_initializers, _overrideCloneAlphaBetaRadius_extraInitializers);
            __esDecorate(null, null, __target_decorators, { kind: "field", name: "_target", static: false, private: false, access: { has: obj => "_target" in obj, get: obj => obj._target, set: (obj, value) => { obj._target = value; } }, metadata: _metadata }, __target_initializers, __target_extraInitializers);
            __esDecorate(null, null, __targetHost_decorators, { kind: "field", name: "_targetHost", static: false, private: false, access: { has: obj => "_targetHost" in obj, get: obj => obj._targetHost, set: (obj, value) => { obj._targetHost = value; } }, metadata: _metadata }, __targetHost_initializers, __targetHost_extraInitializers);
            __esDecorate(null, null, _lowerAlphaLimit_decorators, { kind: "field", name: "lowerAlphaLimit", static: false, private: false, access: { has: obj => "lowerAlphaLimit" in obj, get: obj => obj.lowerAlphaLimit, set: (obj, value) => { obj.lowerAlphaLimit = value; } }, metadata: _metadata }, _lowerAlphaLimit_initializers, _lowerAlphaLimit_extraInitializers);
            __esDecorate(null, null, _upperAlphaLimit_decorators, { kind: "field", name: "upperAlphaLimit", static: false, private: false, access: { has: obj => "upperAlphaLimit" in obj, get: obj => obj.upperAlphaLimit, set: (obj, value) => { obj.upperAlphaLimit = value; } }, metadata: _metadata }, _upperAlphaLimit_initializers, _upperAlphaLimit_extraInitializers);
            __esDecorate(null, null, _lowerBetaLimit_decorators, { kind: "field", name: "lowerBetaLimit", static: false, private: false, access: { has: obj => "lowerBetaLimit" in obj, get: obj => obj.lowerBetaLimit, set: (obj, value) => { obj.lowerBetaLimit = value; } }, metadata: _metadata }, _lowerBetaLimit_initializers, _lowerBetaLimit_extraInitializers);
            __esDecorate(null, null, _upperBetaLimit_decorators, { kind: "field", name: "upperBetaLimit", static: false, private: false, access: { has: obj => "upperBetaLimit" in obj, get: obj => obj.upperBetaLimit, set: (obj, value) => { obj.upperBetaLimit = value; } }, metadata: _metadata }, _upperBetaLimit_initializers, _upperBetaLimit_extraInitializers);
            __esDecorate(null, null, _lowerRadiusLimit_decorators, { kind: "field", name: "lowerRadiusLimit", static: false, private: false, access: { has: obj => "lowerRadiusLimit" in obj, get: obj => obj.lowerRadiusLimit, set: (obj, value) => { obj.lowerRadiusLimit = value; } }, metadata: _metadata }, _lowerRadiusLimit_initializers, _lowerRadiusLimit_extraInitializers);
            __esDecorate(null, null, _upperRadiusLimit_decorators, { kind: "field", name: "upperRadiusLimit", static: false, private: false, access: { has: obj => "upperRadiusLimit" in obj, get: obj => obj.upperRadiusLimit, set: (obj, value) => { obj.upperRadiusLimit = value; } }, metadata: _metadata }, _upperRadiusLimit_initializers, _upperRadiusLimit_extraInitializers);
            __esDecorate(null, null, _lowerTargetYLimit_decorators, { kind: "field", name: "lowerTargetYLimit", static: false, private: false, access: { has: obj => "lowerTargetYLimit" in obj, get: obj => obj.lowerTargetYLimit, set: (obj, value) => { obj.lowerTargetYLimit = value; } }, metadata: _metadata }, _lowerTargetYLimit_initializers, _lowerTargetYLimit_extraInitializers);
            __esDecorate(null, null, _inertialPanningX_decorators, { kind: "field", name: "inertialPanningX", static: false, private: false, access: { has: obj => "inertialPanningX" in obj, get: obj => obj.inertialPanningX, set: (obj, value) => { obj.inertialPanningX = value; } }, metadata: _metadata }, _inertialPanningX_initializers, _inertialPanningX_extraInitializers);
            __esDecorate(null, null, _inertialPanningY_decorators, { kind: "field", name: "inertialPanningY", static: false, private: false, access: { has: obj => "inertialPanningY" in obj, get: obj => obj.inertialPanningY, set: (obj, value) => { obj.inertialPanningY = value; } }, metadata: _metadata }, _inertialPanningY_initializers, _inertialPanningY_extraInitializers);
            __esDecorate(null, null, _pinchToPanMaxDistance_decorators, { kind: "field", name: "pinchToPanMaxDistance", static: false, private: false, access: { has: obj => "pinchToPanMaxDistance" in obj, get: obj => obj.pinchToPanMaxDistance, set: (obj, value) => { obj.pinchToPanMaxDistance = value; } }, metadata: _metadata }, _pinchToPanMaxDistance_initializers, _pinchToPanMaxDistance_extraInitializers);
            __esDecorate(null, null, _panningDistanceLimit_decorators, { kind: "field", name: "panningDistanceLimit", static: false, private: false, access: { has: obj => "panningDistanceLimit" in obj, get: obj => obj.panningDistanceLimit, set: (obj, value) => { obj.panningDistanceLimit = value; } }, metadata: _metadata }, _panningDistanceLimit_initializers, _panningDistanceLimit_extraInitializers);
            __esDecorate(null, null, _panningOriginTarget_decorators, { kind: "field", name: "panningOriginTarget", static: false, private: false, access: { has: obj => "panningOriginTarget" in obj, get: obj => obj.panningOriginTarget, set: (obj, value) => { obj.panningOriginTarget = value; } }, metadata: _metadata }, _panningOriginTarget_initializers, _panningOriginTarget_extraInitializers);
            __esDecorate(null, null, _zoomOnFactor_decorators, { kind: "field", name: "zoomOnFactor", static: false, private: false, access: { has: obj => "zoomOnFactor" in obj, get: obj => obj.zoomOnFactor, set: (obj, value) => { obj.zoomOnFactor = value; } }, metadata: _metadata }, _zoomOnFactor_initializers, _zoomOnFactor_extraInitializers);
            __esDecorate(null, null, _targetScreenOffset_decorators, { kind: "field", name: "targetScreenOffset", static: false, private: false, access: { has: obj => "targetScreenOffset" in obj, get: obj => obj.targetScreenOffset, set: (obj, value) => { obj.targetScreenOffset = value; } }, metadata: _metadata }, _targetScreenOffset_initializers, _targetScreenOffset_extraInitializers);
            __esDecorate(null, null, _allowUpsideDown_decorators, { kind: "field", name: "allowUpsideDown", static: false, private: false, access: { has: obj => "allowUpsideDown" in obj, get: obj => obj.allowUpsideDown, set: (obj, value) => { obj.allowUpsideDown = value; } }, metadata: _metadata }, _allowUpsideDown_initializers, _allowUpsideDown_extraInitializers);
            __esDecorate(null, null, _useInputToRestoreState_decorators, { kind: "field", name: "useInputToRestoreState", static: false, private: false, access: { has: obj => "useInputToRestoreState" in obj, get: obj => obj.useInputToRestoreState, set: (obj, value) => { obj.useInputToRestoreState = value; } }, metadata: _metadata }, _useInputToRestoreState_initializers, _useInputToRestoreState_extraInitializers);
            __esDecorate(null, null, _restoreStateInterpolationFactor_decorators, { kind: "field", name: "restoreStateInterpolationFactor", static: false, private: false, access: { has: obj => "restoreStateInterpolationFactor" in obj, get: obj => obj.restoreStateInterpolationFactor, set: (obj, value) => { obj.restoreStateInterpolationFactor = value; } }, metadata: _metadata }, _restoreStateInterpolationFactor_initializers, _restoreStateInterpolationFactor_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
export { ArcRotateCamera };
let _Registered = false;
/**
 * Register side effects for arcRotateCamera.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterArcRotateCamera() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    Node.AddNodeConstructor("ArcRotateCamera", (name, scene) => {
        return () => new ArcRotateCamera(name, 0, 0, 1.0, Vector3.Zero(), scene);
    });
    // Register Class Name
    RegisterClass("BABYLON.ArcRotateCamera", ArcRotateCamera);
}
//# sourceMappingURL=arcRotateCamera.pure.js.map