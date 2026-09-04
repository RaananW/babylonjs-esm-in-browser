/** This file must only contain pure code and pure imports */
import { Observable } from "../Misc/observable.pure.js";
import { type Nullable } from "../types.js";
import { type Scene } from "../scene.pure.js";
import { Matrix, Vector3, Vector2 } from "../Maths/math.vector.pure.js";
import { type AbstractMesh } from "../Meshes/abstractMesh.pure.js";
import { AutoRotationBehavior } from "../Behaviors/Cameras/autoRotationBehavior.js";
import { BouncingBehavior } from "../Behaviors/Cameras/bouncingBehavior.js";
import { FramingBehavior } from "../Behaviors/Cameras/framingBehavior.js";
import { Camera } from "./camera.pure.js";
import { TargetCamera } from "./targetCamera.pure.js";
import { ArcRotateCameraInputsManager } from "../Cameras/arcRotateCameraInputsManager.pure.js";
import { ArcRotateCameraMovement } from "./arcRotateCameraMovement.js";
import { type Collider } from "../Collisions/collider.js";
import { type TransformNode } from "../Meshes/transformNode.pure.js";
/**
 * Computes the alpha angle based on the source position and the target position.
 * @param offset The directional offset between the source position and the target position
 * @returns The alpha angle in radians
 */
export declare function ComputeAlpha(offset: Vector3): number;
/**
 * Computes the beta angle based on the source position and the target position.
 * @param verticalOffset The y value of the directional offset between the source position and the target position
 * @param radius The distance between the source position and the target position
 * @returns The beta angle in radians
 */
export declare function ComputeBeta(verticalOffset: number, radius: number): number;
/**
 * This represents an orbital type of camera.
 *
 * This camera always points towards a given target position and can be rotated around that target with the target as the centre of rotation. It can be controlled with cursors and mouse, or with touch events.
 * Think of this camera as one orbiting its target position, or more imaginatively as a spy satellite orbiting the earth. Its position relative to the target (earth) can be set by three parameters, alpha (radians) the longitudinal rotation, beta (radians) the latitudinal rotation and radius the distance from the target position.
 * @see https://doc.babylonjs.com/features/featuresDeepDive/cameras/camera_introduction#arc-rotate-camera
 */
export declare class ArcRotateCamera extends TargetCamera {
    /**
     * Defines the rotation angle of the camera along the longitudinal axis.
     */
    alpha: number;
    /**
     * Defines the rotation angle of the camera along the latitudinal axis.
     */
    beta: number;
    /**
     * Defines the radius of the camera from its target point.
     */
    radius: number;
    /**
     * Defines an override value to use as the parameter to setTarget.
     * This allows the parameter to be specified when animating the target (e.g. using FramingBehavior).
     */
    overrideCloneAlphaBetaRadius: Nullable<boolean>;
    protected _target: Vector3;
    protected _targetHost: Nullable<TransformNode>;
    /**
     * Defines the target point of the camera.
     * The camera looks towards it from the radius distance.
     */
    get target(): Vector3;
    set target(value: Vector3);
    /**
     * Defines the target transform node of the camera.
     * The camera looks towards it from the radius distance.
     * Please note that setting a target host will disable panning.
     */
    get targetHost(): Nullable<TransformNode>;
    set targetHost(value: Nullable<TransformNode>);
    /**
     * Return the current target position of the camera. This value is expressed in local space.
     * @returns the target position
     */
    getTarget(): Vector3;
    /**
     * Define the current local position of the camera in the scene
     */
    get position(): Vector3;
    set position(newPosition: Vector3);
    protected _upToYMatrix: Matrix;
    protected _yToUpMatrix: Matrix;
    /**
     * The vector the camera should consider as up. (default is Vector3(0, 1, 0) as returned by Vector3.Up())
     * Setting this will copy the given vector to the camera's upVector, and set rotation matrices to and from Y up.
     * DO NOT set the up vector using copyFrom or copyFromFloats, as this bypasses setting the above matrices.
     */
    set upVector(vec: Vector3);
    get upVector(): Vector3;
    /**
     * Sets the Y-up to camera up-vector rotation matrix, and the up-vector to Y-up rotation matrix.
     */
    setMatUp(): void;
    /**
     * Current inertia value on the longitudinal axis.
     * When nonzero, represents the per-frame angular offset (in radians) applied to `alpha`.
     * Each frame, this value is multiplied by {@link inertia} (a decay coefficient where
     * 0 = instant stop, 0.9 = smooth glide, 1 = never stops).
     * Reading this value also reflects the rotation delta the movement system will apply this frame
     * (decays toward 0 over the inertia tail), preserving legacy semantics for "is the camera still animating?" checks.
     * Setting this to 0 also stops the movement system's rotation velocity for backward compatibility.
     */
    get inertialAlphaOffset(): number;
    set inertialAlphaOffset(value: number);
    private _inertialAlphaOffset;
    /**
     * Current inertia value on the latitudinal axis.
     * When nonzero, represents the per-frame angular offset (in radians) applied to `beta`.
     * Each frame, this value is multiplied by {@link inertia} (a decay coefficient where
     * 0 = instant stop, 0.9 = smooth glide, 1 = never stops).
     * Reading this value also reflects the rotation delta the movement system will apply this frame
     * (decays toward 0 over the inertia tail), preserving legacy semantics for "is the camera still animating?" checks.
     * Setting this to 0 also stops the movement system's rotation velocity for backward compatibility.
     */
    get inertialBetaOffset(): number;
    set inertialBetaOffset(value: number);
    private _inertialBetaOffset;
    /**
     * Current inertia value on the radius axis.
     * When nonzero, represents the per-frame offset (in scene units) applied to `radius`.
     * Each frame, this value is multiplied by {@link inertia} (a decay coefficient where
     * 0 = instant stop, 0.9 = smooth glide, 1 = never stops).
     * Reading this value also reflects the zoom delta the movement system will apply this frame
     * (decays toward 0 over the inertia tail), preserving legacy semantics for "is the camera still animating?" checks.
     * Setting this to 0 also stops the movement system's zoom velocity for backward compatibility.
     */
    get inertialRadiusOffset(): number;
    set inertialRadiusOffset(value: number);
    private _inertialRadiusOffset;
    /**
     * Minimum allowed angle on the longitudinal axis.
     * This can help limiting how the Camera is able to move in the scene.
     */
    lowerAlphaLimit: Nullable<number>;
    /**
     * Maximum allowed angle on the longitudinal axis.
     * This can help limiting how the Camera is able to move in the scene.
     */
    upperAlphaLimit: Nullable<number>;
    /**
     * Minimum allowed angle on the latitudinal axis.
     * This can help limiting how the Camera is able to move in the scene.
     */
    lowerBetaLimit: Nullable<number>;
    /**
     * Maximum allowed angle on the latitudinal axis.
     * This can help limiting how the Camera is able to move in the scene.
     */
    upperBetaLimit: Nullable<number>;
    /**
     * Minimum allowed distance of the camera to the target (The camera can not get closer).
     * This can help limiting how the Camera is able to move in the scene.
     */
    lowerRadiusLimit: Nullable<number>;
    /**
     * Maximum allowed distance of the camera to the target (The camera can not get further).
     * This can help limiting how the Camera is able to move in the scene.
     */
    upperRadiusLimit: Nullable<number>;
    /**
     * Minimum allowed vertical target position of the camera.
     * Use this setting in combination with `upperRadiusLimit` to set a global limit for the Cameras vertical position.
     */
    lowerTargetYLimit: number;
    /**
     * Defines the current inertia value used during panning of the camera along the X axis.
     */
    inertialPanningX: number;
    /**
     * Defines the current inertia value used during panning of the camera along the Y axis.
     */
    inertialPanningY: number;
    /**
     * Defines the distance used to consider the camera in pan mode vs pinch/zoom.
     * Basically if your fingers moves away from more than this distance you will be considered
     * in pinch mode.
     */
    pinchToPanMaxDistance: number;
    /**
     * Defines the maximum distance the camera can pan.
     * This could help keeping the camera always in your scene.
     */
    panningDistanceLimit: Nullable<number>;
    /**
     * Defines the target of the camera before panning.
     */
    panningOriginTarget: Vector3;
    /**
     * Defines the value of the inertia used during panning.
     * A decay coefficient applied per reference frame at 60fps:
     * 0 means stop instantly, 0.9 means smooth glide, 1 means never stop.
     * Setting this also updates the movement system's pan inertia.
     */
    get panningInertia(): number;
    set panningInertia(value: number);
    private _panningInertia;
    private _inertia;
    /**
     * Defines the rotation/zoom inertia (decay coefficient applied per reference frame at 60fps).
     * Override of {@link Camera.inertia} that automatically syncs to the movement system
     * (rotation and zoom). Panning inertia is controlled separately via {@link panningInertia}.
     */
    get inertia(): number;
    set inertia(value: number);
    /**
     * Gets or Set the pointer angular sensibility  along the X axis or how fast is the camera rotating.
     */
    get angularSensibilityX(): number;
    set angularSensibilityX(value: number);
    /**
     * Gets or Set the pointer angular sensibility along the Y axis or how fast is the camera rotating.
     */
    get angularSensibilityY(): number;
    set angularSensibilityY(value: number);
    /**
     * Gets or Set the pointer pinch precision or how fast is the camera zooming.
     */
    get pinchPrecision(): number;
    set pinchPrecision(value: number);
    /**
     * Gets or Set the pointer pinch delta percentage or how fast is the camera zooming.
     * It will be used instead of pinchPrecision if different from 0.
     * It defines the percentage of current camera.radius to use as delta when pinch zoom is used.
     */
    get pinchDeltaPercentage(): number;
    set pinchDeltaPercentage(value: number);
    /**
     * Gets or Set the pointer use natural pinch zoom to override the pinch precision
     * and pinch delta percentage.
     * When useNaturalPinchZoom is true, multi touch zoom will zoom in such
     * that any object in the plane at the camera's target point will scale
     * perfectly with finger motion.
     */
    get useNaturalPinchZoom(): boolean;
    set useNaturalPinchZoom(value: boolean);
    /**
     * Gets or Set the pointer panning sensibility or how fast is the camera moving.
     */
    get panningSensibility(): number;
    set panningSensibility(value: number);
    /**
     * Gets or Set the list of keyboard keys used to control beta angle in a positive direction.
     */
    get keysUp(): number[];
    set keysUp(value: number[]);
    /**
     * Gets or Set the list of keyboard keys used to control beta angle in a negative direction.
     */
    get keysDown(): number[];
    set keysDown(value: number[]);
    /**
     * Gets or Set the list of keyboard keys used to control alpha angle in a negative direction.
     */
    get keysLeft(): number[];
    set keysLeft(value: number[]);
    /**
     * Gets or Set the list of keyboard keys used to control alpha angle in a positive direction.
     */
    get keysRight(): number[];
    set keysRight(value: number[]);
    /**
     * Gets or Set the mouse wheel precision or how fast is the camera zooming.
     */
    get wheelPrecision(): number;
    set wheelPrecision(value: number);
    /**
     * Gets or Set the boolean value that controls whether or not the mouse wheel
     * zooms to the location of the mouse pointer or not.  The default is false.
     */
    get zoomToMouseLocation(): boolean;
    set zoomToMouseLocation(value: boolean);
    /**
     * Gets or Set the mouse wheel delta percentage or how fast is the camera zooming.
     * It will be used instead of wheelPrecision if different from 0.
     * It defines the percentage of current camera.radius to use as delta when wheel zoom is used.
     */
    get wheelDeltaPercentage(): number;
    set wheelDeltaPercentage(value: number);
    /**
     * Defines how much the radius should be scaled while zooming on a particular mesh (through the zoomOn function)
     */
    zoomOnFactor: number;
    /**
     * Defines a screen offset for the camera position.
     */
    targetScreenOffset: Vector2;
    /**
     * Allows the camera to be completely reversed.
     * If false the camera can not arrive upside down.
     */
    allowUpsideDown: boolean;
    /**
     * Define if double tap/click is used to restore the previously saved state of the camera.
     */
    useInputToRestoreState: boolean;
    /**
     * Factor for restoring information interpolation. default is 0 = off. Any value \< 0 or \> 1 will disable interpolation.
     */
    restoreStateInterpolationFactor: number;
    private _currentInterpolationFactor;
    /** @internal */
    _viewMatrix: Matrix;
    private _useCtrlForPanningInternal;
    private _panningMouseButtonInternal;
    /**
     * Defines the input associated to the camera.
     */
    inputs: ArcRotateCameraInputsManager;
    /**
     * Movement controller that provides framerate-independent physics and the declarative
     * inputMap for configuring which inputs map to which camera behaviors.
     *
     * See {@link InputMapper} for the full inputMap API (e.g. `setInteraction`, `getEntry`, `addEntry`).
     */
    movement: ArcRotateCameraMovement;
    /**
     * Gets or sets whether ctrl+keyboard triggers panning.
     * Setting this updates the keyboard→pan inputMap entry.
     * @internal kept for backward compatibility
     */
    get _useCtrlForPanning(): boolean;
    set _useCtrlForPanning(value: boolean);
    /**
     * Gets or sets which mouse button triggers panning (0=left, 1=middle, 2=right).
     * Setting this updates the pointer→pan inputMap entry.
     * @internal kept for backward compatibility with attachControl signature
     */
    get _panningMouseButton(): number;
    set _panningMouseButton(value: number);
    /** @internal */
    _reset: () => void;
    /**
     * Defines the allowed panning axis.
     */
    panningAxis: Vector3;
    protected _transformedDirection: Vector3;
    /**
     * Defines if camera will eliminate transform on y axis.
     */
    mapPanning: boolean;
    private _bouncingBehavior;
    private _isInterpolating;
    /**
     * If true, indicates the camera is currently interpolating to a new pose.
     */
    get isInterpolating(): boolean;
    /**
     * Gets the bouncing behavior of the camera if it has been enabled.
     * @see https://doc.babylonjs.com/features/featuresDeepDive/behaviors/cameraBehaviors#bouncing-behavior
     */
    get bouncingBehavior(): Nullable<BouncingBehavior>;
    /**
     * Defines if the bouncing behavior of the camera is enabled on the camera.
     * @see https://doc.babylonjs.com/features/featuresDeepDive/behaviors/cameraBehaviors#bouncing-behavior
     */
    get useBouncingBehavior(): boolean;
    set useBouncingBehavior(value: boolean);
    private _framingBehavior;
    /**
     * Gets the framing behavior of the camera if it has been enabled.
     * @see https://doc.babylonjs.com/features/featuresDeepDive/behaviors/cameraBehaviors#framing-behavior
     */
    get framingBehavior(): Nullable<FramingBehavior>;
    /**
     * Defines if the framing behavior of the camera is enabled on the camera.
     * @see https://doc.babylonjs.com/features/featuresDeepDive/behaviors/cameraBehaviors#framing-behavior
     */
    get useFramingBehavior(): boolean;
    set useFramingBehavior(value: boolean);
    private _autoRotationBehavior;
    /**
     * Gets the auto rotation behavior of the camera if it has been enabled.
     * @see https://doc.babylonjs.com/features/featuresDeepDive/behaviors/cameraBehaviors#autorotation-behavior
     */
    get autoRotationBehavior(): Nullable<AutoRotationBehavior>;
    /**
     * Defines if the auto rotation behavior of the camera is enabled on the camera.
     * @see https://doc.babylonjs.com/features/featuresDeepDive/behaviors/cameraBehaviors#autorotation-behavior
     */
    get useAutoRotationBehavior(): boolean;
    set useAutoRotationBehavior(value: boolean);
    /**
     * Observable triggered when the transform node target has been changed on the camera.
     */
    onMeshTargetChangedObservable: Observable<Nullable<TransformNode>>;
    /**
     * Event raised when the camera is colliding with a mesh.
     */
    onCollide: (collidedMesh: AbstractMesh) => void;
    /**
     * Defines whether the camera should check collision with the objects oh the scene.
     * @see https://doc.babylonjs.com/features/featuresDeepDive/cameras/camera_collisions#how-can-i-do-this-
     */
    checkCollisions: boolean;
    /**
     * Defines the collision radius of the camera.
     * This simulates a sphere around the camera.
     * @see https://doc.babylonjs.com/features/featuresDeepDive/cameras/camera_collisions#arcrotatecamera
     */
    collisionRadius: Vector3;
    protected _collider: Collider;
    protected _previousPosition: Vector3;
    protected _collisionVelocity: Vector3;
    protected _newPosition: Vector3;
    protected _previousAlpha: number;
    protected _previousBeta: number;
    protected _previousRadius: number;
    protected _collisionTriggered: boolean;
    protected _targetBoundingCenter: Nullable<Vector3>;
    private _computationVector;
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
    constructor(name: string, alpha: number, beta: number, radius: number, target: Vector3, scene?: Scene, setActiveOnSceneIfNoneActive?: boolean);
    /** @internal */
    _initCache(): void;
    /**
     * @internal
     */
    _updateCache(ignoreParentClass?: boolean): void;
    protected _getTargetPosition(): Vector3;
    private _storedAlpha;
    private _storedBeta;
    private _storedRadius;
    private _storedTarget;
    private _storedTargetScreenOffset;
    private _goalAlpha;
    private _goalBeta;
    private _goalRadius;
    private readonly _goalTarget;
    private readonly _goalTargetScreenOffset;
    /**
     * Stores the current state of the camera (alpha, beta, radius and target)
     * @returns the camera itself
     */
    storeState(): Camera;
    /**
     * @internal
     * Restored camera state. You must call storeState() first
     */
    _restoreStateValues(): boolean;
    /**
     * Stops any in-progress interpolation.
     */
    stopInterpolation(): void;
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
    interpolateTo(alpha?: number, beta?: number, radius?: number, target?: Vector3, targetScreenOffset?: Vector2, interpolationFactor?: number): void;
    /** @internal */
    _isSynchronizedViewMatrix(): boolean;
    /**
     * Attach the input controls to a specific dom element to get the input from.
     * @param noPreventDefault Defines whether event caught by the controls should call preventdefault() (https://developer.mozilla.org/en-US/docs/Web/API/Event/preventDefault)
     */
    attachControl(noPreventDefault?: boolean): void;
    /**
     * Attach the input controls to a specific dom element to get the input from.
     * @param ignored defines an ignored parameter kept for backward compatibility.
     * @param noPreventDefault Defines whether event caught by the controls should call preventdefault() (https://developer.mozilla.org/en-US/docs/Web/API/Event/preventDefault)
     */
    attachControl(ignored: any, noPreventDefault?: boolean): void;
    /**
     * Attached controls to the current camera.
     * @param noPreventDefault Defines whether event caught by the controls should call preventdefault() (https://developer.mozilla.org/en-US/docs/Web/API/Event/preventDefault)
     * @param useCtrlForPanning  Defines whether ctrl is used for panning within the controls
     */
    attachControl(noPreventDefault: boolean, useCtrlForPanning: boolean): void;
    /**
     * Attached controls to the current camera.
     * @param ignored defines an ignored parameter kept for backward compatibility.
     * @param noPreventDefault Defines whether event caught by the controls should call preventdefault() (https://developer.mozilla.org/en-US/docs/Web/API/Event/preventDefault)
     * @param useCtrlForPanning  Defines whether ctrl is used for panning within the controls
     */
    attachControl(ignored: any, noPreventDefault: boolean, useCtrlForPanning: boolean): void;
    /**
     * Attached controls to the current camera.
     * @param noPreventDefault Defines whether event caught by the controls should call preventdefault() (https://developer.mozilla.org/en-US/docs/Web/API/Event/preventDefault)
     * @param useCtrlForPanning  Defines whether ctrl is used for panning within the controls
     * @param panningMouseButton Defines whether panning is allowed through mouse click button
     */
    attachControl(noPreventDefault: boolean, useCtrlForPanning: boolean, panningMouseButton: number): void;
    /**
     * Detach the current controls from the specified dom element.
     */
    detachControl(): void;
    /**
     * Applies rotation and zoom deltas to the camera, handling invertRotation, handedness, and beta-flip.
     * Shared by both the movement system and legacy inertia paths.
     * @param alphaOffset - Alpha (horizontal orbit) delta
     * @param betaOffset - Beta (vertical orbit) delta
     * @param radiusOffset - Radius (zoom) delta
     */
    private _applyRotationAndZoomDelta;
    /**
     * Applies a pan delta to the camera target in screen space.
     * Shared by both the movement system and legacy inertia paths.
     * @param panX - Horizontal pan delta
     * @param panY - Vertical pan delta
     */
    private _applyPanDelta;
    /** @internal */
    _checkInputs(): void;
    protected _checkLimits(): void;
    /**
     * Rebuilds angles (alpha, beta) and radius from the give position and target
     */
    rebuildAnglesAndRadius(): void;
    /**
     * Use a position to define the current camera related information like alpha, beta and radius
     * @param position Defines the position to set the camera at
     */
    setPosition(position: Vector3): void;
    /**
     * Defines the target the camera should look at.
     * This will automatically adapt alpha beta and radius to fit within the new target.
     * Please note that setting a target as a mesh will disable panning.
     * @param target Defines the new target as a Vector or a transform node
     * @param toBoundingCenter In case of a mesh target, defines whether to target the mesh position or its bounding information center
     * @param allowSamePosition If false, prevents reapplying the new computed position if it is identical to the current one (optim)
     * @param cloneAlphaBetaRadius If true, replicate the current setup (alpha, beta, radius) on the new target
     */
    setTarget(target: TransformNode | Vector3, toBoundingCenter?: boolean, allowSamePosition?: boolean, cloneAlphaBetaRadius?: boolean): void;
    /** @internal */
    _getViewMatrix(): Matrix;
    protected _onCollisionPositionChange: (collisionId: number, newPosition: Vector3, collidedMesh?: Nullable<AbstractMesh>) => void;
    /**
     * Zooms on a mesh to be at the min distance where we could see it fully in the current viewport.
     * @param meshes Defines the mesh to zoom on
     * @param doNotUpdateMaxZ Defines whether or not maxZ should be updated whilst zooming on the mesh (this can happen if the mesh is big and the maxradius pretty small for instance)
     */
    zoomOn(meshes?: AbstractMesh[], doNotUpdateMaxZ?: boolean): void;
    /**
     * Focus on a mesh or a bounding box. This adapts the target and maxRadius if necessary but does not update the current radius.
     * The target will be changed but the radius
     * @param meshesOrMinMaxVectorAndDistance Defines the mesh or bounding info to focus on
     * @param doNotUpdateMaxZ Defines whether or not maxZ should be updated whilst zooming on the mesh (this can happen if the mesh is big and the maxradius pretty small for instance)
     */
    focusOn(meshesOrMinMaxVectorAndDistance: AbstractMesh[] | {
        min: Vector3;
        max: Vector3;
        distance: number;
    }, doNotUpdateMaxZ?: boolean): void;
    /**
     * @override
     * Override Camera.createRigCamera
     * @param name the name of the camera
     * @param cameraIndex the index of the camera in the rig cameras array
     */
    createRigCamera(name: string, cameraIndex: number): Camera;
    /**
     * @internal
     * @override
     * Override Camera._updateRigCameras
     */
    _updateRigCameras(): void;
    /**
     * @internal
     */
    _calculateLowerRadiusFromModelBoundingSphere(minimumWorld: Vector3, maximumWorld: Vector3, radiusScale?: number): number;
    /**
     * Destroy the camera and release the current resources hold by it.
     */
    dispose(): void;
    /**
     * Gets the current object class name.
     * @returns the class name
     */
    getClassName(): string;
}
/**
 * Register side effects for arcRotateCamera.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterArcRotateCamera(): void;
