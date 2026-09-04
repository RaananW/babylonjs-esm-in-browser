/** This file must only contain pure code and pure imports */
import { __esDecorate, __runInitializers } from "../tslib.es6.js";
import { serialize, serializeAsVector3, serializeAsMeshReference } from "../Misc/decorators.js";
import { Camera } from "./camera.pure.js";
import { Quaternion, Matrix, Vector3, Vector2, TmpVectors } from "../Maths/math.vector.pure.js";
import { Epsilon } from "../Maths/math.constants.js";
import { Axis } from "../Maths/math.axis.js";
import { Node } from "../node.js";
import { TargetCameraMovement } from "./targetCameraMovement.js";
// Temporary cache variables to avoid allocations.
const TmpMatrix = /*#__PURE__*/ Matrix.Zero();
const TmpQuaternion = /*#__PURE__*/ Quaternion.Identity();
/**
 * A target camera takes a mesh or position as a target and continues to look at it while it moves.
 * This is the base of the follow, arc rotate cameras and Free camera
 * @see https://doc.babylonjs.com/features/featuresDeepDive/cameras
 */
let TargetCamera = (() => {
    var _a;
    let _classSuper = Camera;
    let _updateUpVectorFromRotation_decorators;
    let _updateUpVectorFromRotation_initializers = [];
    let _updateUpVectorFromRotation_extraInitializers = [];
    let _rotation_decorators;
    let _rotation_initializers = [];
    let _rotation_extraInitializers = [];
    let _speed_decorators;
    let _speed_initializers = [];
    let _speed_extraInitializers = [];
    let _lockedTarget_decorators;
    let _lockedTarget_initializers = [];
    let _lockedTarget_extraInitializers = [];
    return _a = class TargetCamera extends _classSuper {
            /**
             * Defines the inertia (decay coefficient applied per reference frame at 60fps) of the camera.
             * This helps giving a smooth feeling to the camera movement.
             *
             * Override of {@link Camera.inertia} that writes through to the {@link movement} system so the
             * framerate-independent pan/rotation glide stays in sync. Setting this updates the movement
             * system immediately (matching the accessor convergence used by {@link ArcRotateCamera}).
             *
             * Backed by a local field rather than `super.inertia`: the shipped UMD bundle is compiled with
             * TypeScript at `target: ES5`, and ES5 downleveling of `super` access inside a decorated accessor
             * (the base {@link Camera.inertia} carries `@serialize()`) mis-compiles to `undefined`. That would
             * feed `NaN` into the movement decay and freeze the camera. It only breaks in the ES5 UMD bundle;
             * native-ESM dev keeps real `super`. See the `babylonjs/no-super-in-accessor` lint rule.
             */
            get inertia() {
                return this._targetInertia;
            }
            set inertia(value) {
                this._targetInertia = value;
                // `movement` is constructed in this class' constructor; guard for the base-constructor
                // assignment that runs before it exists.
                if (this.movement) {
                    this.movement.panInertia = value;
                    this.movement.rotationInertia = value;
                }
            }
            /**
             * Instantiates a target camera that takes a mesh or position as a target and continues to look at it while it moves.
             * This is the base of the follow, arc rotate cameras and Free camera
             * @see https://doc.babylonjs.com/features/featuresDeepDive/cameras
             * @param name Defines the name of the camera in the scene
             * @param position Defines the start position of the camera in the scene
             * @param scene Defines the scene the camera belongs to
             * @param setActiveOnSceneIfNoneActive Defines whether the camera should be marked as active if not other active cameras have been defined
             */
            constructor(name, position, scene, setActiveOnSceneIfNoneActive = true) {
                super(name, position, scene, setActiveOnSceneIfNoneActive);
                /**
                 * Define the current direction the camera is moving to
                 */
                this.cameraDirection = new Vector3(0, 0, 0);
                /**
                 * Define the current rotation the camera is rotating to
                 */
                this.cameraRotation = new Vector2(0, 0);
                this._targetInertia = 0.9;
                /**
                 * When set, the up vector of the camera will be updated by the rotation of the camera
                 */
                this.updateUpVectorFromRotation = __runInitializers(this, _updateUpVectorFromRotation_initializers, false);
                /**
                 * Define the current rotation of the camera
                 */
                this.rotation = (__runInitializers(this, _updateUpVectorFromRotation_extraInitializers), __runInitializers(this, _rotation_initializers, void 0));
                /**
                 * Define the current rotation of the camera as a quaternion to prevent Gimbal lock
                 */
                this.rotationQuaternion = __runInitializers(this, _rotation_extraInitializers);
                /**
                 * Define the current speed of the camera
                 */
                this.speed = __runInitializers(this, _speed_initializers, 2.0);
                /**
                 * Add constraint to the camera to prevent it to move freely in all directions and
                 * around all axis.
                 */
                this.noRotationConstraint = (__runInitializers(this, _speed_extraInitializers), false);
                /**
                 * Reverses mouselook direction to 'natural' panning as opposed to traditional direct
                 * panning
                 */
                this.invertRotation = false;
                /**
                 * Speed multiplier for inverse camera panning
                 */
                this.inverseRotationSpeed = 0.2;
                /**
                 * @internal
                 * @experimental
                 * Can be used to change clamping behavior for inertia. Hook into onBeforeRenderObservable to change the value per-frame
                 */
                this._panningEpsilon = Epsilon;
                /**
                 * @internal
                 * @experimental
                 * Can be used to change clamping behavior for inertia. Hook into onBeforeRenderObservable to change the value per-frame
                 */
                this._rotationEpsilon = Epsilon;
                /**
                 * Define the current target of the camera as an object or a position.
                 * Please note that locking a target will disable panning.
                 */
                this.lockedTarget = __runInitializers(this, _lockedTarget_initializers, null);
                this._currentTarget = (__runInitializers(this, _lockedTarget_extraInitializers), Vector3.Zero());
                this._initialFocalDistance = 1;
                this._viewMatrix = Matrix.Zero();
                /** @internal */
                this._cameraTransformMatrix = Matrix.Zero();
                /** @internal */
                this._cameraRotationMatrix = Matrix.Zero();
                this._transformedReferencePoint = Vector3.Zero();
                this._deferredPositionUpdate = new Vector3();
                this._deferredRotationQuaternionUpdate = new Quaternion();
                this._deferredRotationUpdate = new Vector3();
                this._deferredUpdated = false;
                this._deferOnly = false;
                this._cachedRotationZ = 0;
                this._cachedQuaternionRotationZ = 0;
                this._referencePoint = Vector3.Forward(this.getScene().useRightHandedSystem);
                // Set the y component of the rotation to Math.PI in right-handed system for backwards compatibility.
                this.rotation = new Vector3(0, this.getScene().useRightHandedSystem ? Math.PI : 0, 0);
                this.movement = new TargetCameraMovement(this.getScene(), this.position);
                // Seed movement-system inertia from the value set during base/subclass construction.
                // After this point, the `inertia` setter on this class pushes directly to movement.
                this.movement.panInertia = this.inertia;
                this.movement.rotationInertia = this.inertia;
            }
            /**
             * Gets the position in front of the camera at a given distance.
             * @param distance The distance from the camera we want the position to be
             * @returns the position
             */
            getFrontPosition(distance) {
                this.getWorldMatrix();
                const worldForward = TmpVectors.Vector3[0];
                const localForward = TmpVectors.Vector3[1];
                localForward.set(0, 0, this._scene.useRightHandedSystem ? -1.0 : 1.0);
                this.getDirectionToRef(localForward, worldForward);
                worldForward.scaleInPlace(distance);
                return this.globalPosition.add(worldForward);
            }
            /** @internal */
            _getLockedTargetPosition() {
                if (!this.lockedTarget) {
                    return null;
                }
                if (this.lockedTarget.absolutePosition) {
                    const lockedTarget = this.lockedTarget;
                    const m = lockedTarget.computeWorldMatrix();
                    // in some cases the absolute position resets externally, but doesn't update since the matrix is cached.
                    m.getTranslationToRef(lockedTarget.absolutePosition);
                }
                return this.lockedTarget.absolutePosition || this.lockedTarget;
            }
            /**
             * Store current camera state of the camera (fov, position, rotation, etc..)
             * @returns the camera
             */
            storeState() {
                this._storedPosition = this.position.clone();
                this._storedRotation = this.rotation.clone();
                if (this.rotationQuaternion) {
                    this._storedRotationQuaternion = this.rotationQuaternion.clone();
                }
                return super.storeState();
            }
            /**
             * Restored camera state. You must call storeState() first
             * @returns whether it was successful or not
             * @internal
             */
            _restoreStateValues() {
                if (!super._restoreStateValues()) {
                    return false;
                }
                this.position = this._storedPosition.clone();
                this.rotation = this._storedRotation.clone();
                if (this.rotationQuaternion && this._storedRotationQuaternion) {
                    this.rotationQuaternion = this._storedRotationQuaternion.clone();
                }
                this.cameraDirection.copyFromFloats(0, 0, 0);
                this.cameraRotation.copyFromFloats(0, 0);
                return true;
            }
            /** @internal */
            _initCache() {
                super._initCache();
                this._cache.lockedTarget = new Vector3(Number.MAX_VALUE, Number.MAX_VALUE, Number.MAX_VALUE);
                this._cache.rotation = new Vector3(Number.MAX_VALUE, Number.MAX_VALUE, Number.MAX_VALUE);
                this._cache.rotationQuaternion = new Quaternion(Number.MAX_VALUE, Number.MAX_VALUE, Number.MAX_VALUE, Number.MAX_VALUE);
            }
            /**
             * @internal
             */
            _updateCache(ignoreParentClass) {
                if (!ignoreParentClass) {
                    super._updateCache();
                }
                const lockedTargetPosition = this._getLockedTargetPosition();
                if (!lockedTargetPosition) {
                    this._cache.lockedTarget = null;
                }
                else {
                    if (!this._cache.lockedTarget) {
                        this._cache.lockedTarget = lockedTargetPosition.clone();
                    }
                    else {
                        this._cache.lockedTarget.copyFrom(lockedTargetPosition);
                    }
                }
                this._cache.rotation.copyFrom(this.rotation);
                if (this.rotationQuaternion) {
                    this._cache.rotationQuaternion.copyFrom(this.rotationQuaternion);
                }
            }
            // Synchronized
            /** @internal */
            _isSynchronizedViewMatrix() {
                if (!super._isSynchronizedViewMatrix()) {
                    return false;
                }
                const lockedTargetPosition = this._getLockedTargetPosition();
                return ((this._cache.lockedTarget ? this._cache.lockedTarget.equals(lockedTargetPosition) : !lockedTargetPosition) &&
                    (this.rotationQuaternion ? this.rotationQuaternion.equals(this._cache.rotationQuaternion) : this._cache.rotation.equals(this.rotation)));
            }
            // Methods
            /** @internal */
            _computeLocalCameraSpeed() {
                const engine = this.getEngine();
                return this.speed * Math.sqrt(engine.getDeltaTime() / (engine.getFps() * 100.0));
            }
            // Target
            /**
             * Defines the target the camera should look at.
             * @param target Defines the new target as a Vector
             */
            setTarget(target) {
                this.upVector.normalize();
                this._initialFocalDistance = target.subtract(this.position).length();
                if (this.position.z === target.z) {
                    this.position.z += Epsilon;
                }
                this._referencePoint.normalize().scaleInPlace(this._initialFocalDistance);
                if (this.getScene().useRightHandedSystem) {
                    Matrix.LookAtRHToRef(this.position, target, Vector3.UpReadOnly, TmpMatrix);
                }
                else {
                    Matrix.LookAtLHToRef(this.position, target, Vector3.UpReadOnly, TmpMatrix);
                }
                TmpMatrix.invert();
                const rotationQuaternion = this.rotationQuaternion || TmpQuaternion;
                Quaternion.FromRotationMatrixToRef(TmpMatrix, rotationQuaternion);
                rotationQuaternion.toEulerAnglesToRef(this.rotation);
                // Explicitly set z to 0 to match previous behavior.
                this.rotation.z = 0;
            }
            /**
             * Defines the target point of the camera.
             * The camera looks towards it form the radius distance.
             */
            get target() {
                return this.getTarget();
            }
            set target(value) {
                this.setTarget(value);
            }
            /**
             * Return the current target position of the camera. This value is expressed in local space.
             * @returns the target position
             */
            getTarget() {
                return this._currentTarget;
            }
            /** @internal */
            _decideIfNeedsToMove() {
                return Math.abs(this.cameraDirection.x) > 0 || Math.abs(this.cameraDirection.y) > 0 || Math.abs(this.cameraDirection.z) > 0;
            }
            /** @internal */
            _updatePosition() {
                if (this.parent) {
                    this.parent.getWorldMatrix().invertToRef(TmpVectors.Matrix[0]);
                    Vector3.TransformNormalToRef(this.cameraDirection, TmpVectors.Matrix[0], TmpVectors.Vector3[0]);
                    this._deferredPositionUpdate.addInPlace(TmpVectors.Vector3[0]);
                    if (!this._deferOnly) {
                        this.position.copyFrom(this._deferredPositionUpdate);
                    }
                    else {
                        this._deferredUpdated = true;
                    }
                    return;
                }
                this._deferredPositionUpdate.addInPlace(this.cameraDirection);
                if (!this._deferOnly) {
                    this.position.copyFrom(this._deferredPositionUpdate);
                }
                else {
                    this._deferredUpdated = true;
                }
            }
            /** @internal */
            _checkInputs() {
                // Fold this frame's raw input — written to `cameraDirection`/`cameraRotation` by the input
                // classes (and honored from direct external writes) — into the movement system, then let it
                // produce framerate-independent per-frame deltas (input plus inertial glide). The applied
                // delta is written back into `cameraDirection`/`cameraRotation` purely as a within-frame
                // hand-off so the collision, gravity, and rotation-constraint logic below reads it unchanged.
                // Both fields are reset to 0 at the end of this method (the inertial glide now lives in the
                // movement system's velocity, not in these fields), so external code polling them *after*
                // `_checkInputs()` reads 0 rather than the legacy residual glide value.
                const movement = this.movement;
                // Capture whether there is raw input on the pan channel THIS frame, before it is folded into the
                // movement system. This gates the legacy panning cutoff below so it only ends a decaying inertial
                // tail and never discards a small but legitimate active-input delta.
                const hasPanInput = this.cameraDirection.x !== 0 || this.cameraDirection.y !== 0 || this.cameraDirection.z !== 0;
                movement.panAccumulatedPixels.addInPlace(this.cameraDirection);
                movement.rotationAccumulatedPixels.x += this.cameraRotation.x;
                movement.rotationAccumulatedPixels.y += this.cameraRotation.y;
                movement.computeCurrentFrameDeltas();
                this.cameraDirection.copyFrom(movement.panDeltaCurrentFrame);
                this.cameraRotation.set(movement.rotationDeltaCurrentFrame.x, movement.rotationDeltaCurrentFrame.y);
                // Backward-compat glide cutoff: honor the legacy `_panningEpsilon` knob for translation.
                // Legacy `_checkInputs` snapped `cameraDirection` to 0 once the glide fell below the threshold,
                // ending the inertial glide at that point. The framerate-independent port moved glide into the
                // movement system's velocity, so we mirror that cutoff here and reset the velocity so the glide
                // terminates at the same point (and the public knob stays meaningful). This is gated on
                // `!hasPanInput` so it only fires on the decaying tail: on an active-input frame the emitted
                // delta is always applied, even when it is below the limit. Translation magnitude scales with
                // `this.speed` (inputs use `_computeLocalCameraSpeed`), so the panning cutoff is scaled by
                // `speed` too, keeping the glide *duration* independent of speed.
                const inertialPanningLimit = this.speed * this._panningEpsilon;
                if (!hasPanInput &&
                    Math.abs(this.cameraDirection.x) < inertialPanningLimit &&
                    Math.abs(this.cameraDirection.y) < inertialPanningLimit &&
                    Math.abs(this.cameraDirection.z) < inertialPanningLimit) {
                    this.cameraDirection.setAll(0);
                    movement.resetPanVelocity();
                }
                // Rotation has no legacy per-frame-delta cutoff: the movement system already terminates the
                // glide via its own framerate-independent velocity epsilon, so `cameraRotation` is naturally 0
                // once the rotation velocity decays. Applying a coarse `_rotationEpsilon` snap on top truncated
                // the inertia tail and reintroduced framerate dependence (the snap tests a per-frame delta, which
                // shrinks at high refresh rates), producing a visible "cut" in the glide that was worst at high
                // speeds and high frame rates (forum 61001). Deferring entirely to the velocity epsilon gives the
                // same smooth ease-out at every `speed` and refresh rate.
                const directionMultiplier = this.invertRotation ? -this.inverseRotationSpeed : 1.0;
                const needToMove = this._decideIfNeedsToMove();
                const needToRotate = !!(this.cameraRotation.x || this.cameraRotation.y);
                this._deferredUpdated = false;
                this._deferredRotationUpdate.copyFrom(this.rotation);
                this._deferredPositionUpdate.copyFrom(this.position);
                if (this.rotationQuaternion) {
                    this._deferredRotationQuaternionUpdate.copyFrom(this.rotationQuaternion);
                }
                // Move
                if (needToMove) {
                    this._updatePosition();
                }
                // Rotate
                if (needToRotate) {
                    //rotate, if quaternion is set and rotation was used
                    if (this.rotationQuaternion) {
                        this.rotationQuaternion.toEulerAnglesToRef(this._deferredRotationUpdate);
                    }
                    this._deferredRotationUpdate.x += this.cameraRotation.x * directionMultiplier;
                    this._deferredRotationUpdate.y += this.cameraRotation.y * directionMultiplier;
                    // Apply constraints
                    if (!this.noRotationConstraint) {
                        const limit = 1.570796;
                        if (this._deferredRotationUpdate.x > limit) {
                            this._deferredRotationUpdate.x = limit;
                        }
                        if (this._deferredRotationUpdate.x < -limit) {
                            this._deferredRotationUpdate.x = -limit;
                        }
                    }
                    if (!this._deferOnly) {
                        this.rotation.copyFrom(this._deferredRotationUpdate);
                    }
                    else {
                        this._deferredUpdated = true;
                    }
                    //rotate, if quaternion is set and rotation was used
                    if (this.rotationQuaternion) {
                        const len = this._deferredRotationUpdate.lengthSquared();
                        if (len) {
                            Quaternion.RotationYawPitchRollToRef(this._deferredRotationUpdate.y, this._deferredRotationUpdate.x, this._deferredRotationUpdate.z, this._deferredRotationQuaternionUpdate);
                            if (!this._deferOnly) {
                                this.rotationQuaternion.copyFrom(this._deferredRotationQuaternionUpdate);
                            }
                            else {
                                this._deferredUpdated = true;
                            }
                        }
                    }
                }
                // The movement system now owns inertial decay (framerate-independent), so reset the
                // per-frame delta surfaces. Glide persists inside the movement velocity and is re-emitted
                // next frame via `computeCurrentFrameDeltas`; zeroing here prevents the just-applied delta
                // from being re-folded into the accumulators on the next frame.
                this.cameraDirection.setAll(0);
                this.cameraRotation.set(0, 0);
                super._checkInputs();
            }
            _updateCameraRotationMatrix() {
                if (this.rotationQuaternion) {
                    this.rotationQuaternion.toRotationMatrix(this._cameraRotationMatrix);
                }
                else {
                    Matrix.RotationYawPitchRollToRef(this.rotation.y, this.rotation.x, this.rotation.z, this._cameraRotationMatrix);
                }
            }
            /**
             * Update the up vector to apply the rotation of the camera (So if you changed the camera rotation.z this will let you update the up vector as well)
             * @returns the current camera
             */
            _rotateUpVectorWithCameraRotationMatrix() {
                Vector3.TransformNormalToRef(Vector3.UpReadOnly, this._cameraRotationMatrix, this.upVector);
                return this;
            }
            /** @internal */
            _getViewMatrix() {
                if (this.lockedTarget) {
                    this.setTarget(this._getLockedTargetPosition());
                }
                // Compute
                this._updateCameraRotationMatrix();
                // Apply the changed rotation to the upVector
                if (this.rotationQuaternion && this._cachedQuaternionRotationZ != this.rotationQuaternion.z) {
                    this._rotateUpVectorWithCameraRotationMatrix();
                    this._cachedQuaternionRotationZ = this.rotationQuaternion.z;
                }
                else if (this._cachedRotationZ !== this.rotation.z) {
                    this._rotateUpVectorWithCameraRotationMatrix();
                    this._cachedRotationZ = this.rotation.z;
                }
                Vector3.TransformCoordinatesToRef(this._referencePoint, this._cameraRotationMatrix, this._transformedReferencePoint);
                // Computing target and final matrix
                this.position.addToRef(this._transformedReferencePoint, this._currentTarget);
                if (this.updateUpVectorFromRotation) {
                    if (this.rotationQuaternion) {
                        Axis.Y.rotateByQuaternionToRef(this.rotationQuaternion, this.upVector);
                    }
                    else {
                        Quaternion.FromEulerVectorToRef(this.rotation, TmpQuaternion);
                        Axis.Y.rotateByQuaternionToRef(TmpQuaternion, this.upVector);
                    }
                }
                this._computeViewMatrix(this.position, this._currentTarget, this.upVector);
                return this._viewMatrix;
            }
            _computeViewMatrix(position, target, up) {
                if (this.getScene().useRightHandedSystem) {
                    Matrix.LookAtRHToRef(position, target, up, this._viewMatrix);
                }
                else {
                    Matrix.LookAtLHToRef(position, target, up, this._viewMatrix);
                }
                if (this.parent) {
                    const parentWorldMatrix = this.parent.getWorldMatrix();
                    this._viewMatrix.invert();
                    this._viewMatrix.multiplyToRef(parentWorldMatrix, this._viewMatrix);
                    this._viewMatrix.invert();
                    this._markSyncedWithParent();
                }
            }
            /**
             * @internal
             */
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            createRigCamera(name, cameraIndex) {
                if (this.cameraRigMode !== Camera.RIG_MODE_NONE) {
                    const rigCamera = new _a(name, this.position.clone(), this.getScene());
                    rigCamera.isRigCamera = true;
                    rigCamera.rigParent = this;
                    if (this.cameraRigMode === Camera.RIG_MODE_VR) {
                        if (!this.rotationQuaternion) {
                            this.rotationQuaternion = new Quaternion();
                        }
                        rigCamera._cameraRigParams = {};
                        rigCamera.rotationQuaternion = new Quaternion();
                    }
                    rigCamera.mode = this.mode;
                    rigCamera.orthoLeft = this.orthoLeft;
                    rigCamera.orthoRight = this.orthoRight;
                    rigCamera.orthoTop = this.orthoTop;
                    rigCamera.orthoBottom = this.orthoBottom;
                    return rigCamera;
                }
                return null;
            }
            /**
             * @internal
             */
            _updateRigCameras() {
                const camLeft = this._rigCameras[0];
                const camRight = this._rigCameras[1];
                this.computeWorldMatrix();
                switch (this.cameraRigMode) {
                    case Camera.RIG_MODE_STEREOSCOPIC_ANAGLYPH:
                    case Camera.RIG_MODE_STEREOSCOPIC_SIDEBYSIDE_PARALLEL:
                    case Camera.RIG_MODE_STEREOSCOPIC_SIDEBYSIDE_CROSSEYED:
                    case Camera.RIG_MODE_STEREOSCOPIC_OVERUNDER:
                    case Camera.RIG_MODE_STEREOSCOPIC_INTERLACED: {
                        //provisionnaly using _cameraRigParams.stereoHalfAngle instead of calculations based on _cameraRigParams.interaxialDistance:
                        const leftSign = this.cameraRigMode === Camera.RIG_MODE_STEREOSCOPIC_SIDEBYSIDE_CROSSEYED ? 1 : -1;
                        const rightSign = this.cameraRigMode === Camera.RIG_MODE_STEREOSCOPIC_SIDEBYSIDE_CROSSEYED ? -1 : 1;
                        this._getRigCamPositionAndTarget(this._cameraRigParams.stereoHalfAngle * leftSign, camLeft);
                        this._getRigCamPositionAndTarget(this._cameraRigParams.stereoHalfAngle * rightSign, camRight);
                        break;
                    }
                    case Camera.RIG_MODE_VR:
                        if (camLeft.rotationQuaternion && camRight.rotationQuaternion && this.rotationQuaternion) {
                            camLeft.rotationQuaternion.copyFrom(this.rotationQuaternion);
                            camRight.rotationQuaternion.copyFrom(this.rotationQuaternion);
                        }
                        else {
                            camLeft.rotation.copyFrom(this.rotation);
                            camRight.rotation.copyFrom(this.rotation);
                        }
                        camLeft.position.copyFrom(this.position);
                        camRight.position.copyFrom(this.position);
                        break;
                }
                super._updateRigCameras();
            }
            _getRigCamPositionAndTarget(halfSpace, rigCamera) {
                const target = this.getTarget();
                target.subtractToRef(this.position, _a._TargetFocalPoint);
                _a._TargetFocalPoint.normalize().scaleInPlace(this._initialFocalDistance);
                const newFocalTarget = _a._TargetFocalPoint.addInPlace(this.position);
                Matrix.TranslationToRef(-newFocalTarget.x, -newFocalTarget.y, -newFocalTarget.z, _a._TargetTransformMatrix);
                _a._TargetTransformMatrix.multiplyToRef(Matrix.RotationAxis(rigCamera.upVector, halfSpace), _a._RigCamTransformMatrix);
                Matrix.TranslationToRef(newFocalTarget.x, newFocalTarget.y, newFocalTarget.z, _a._TargetTransformMatrix);
                _a._RigCamTransformMatrix.multiplyToRef(_a._TargetTransformMatrix, _a._RigCamTransformMatrix);
                Vector3.TransformCoordinatesToRef(this.position, _a._RigCamTransformMatrix, rigCamera.position);
                rigCamera.setTarget(newFocalTarget);
            }
            /**
             * Gets the current object class name.
             * @returns the class name
             */
            getClassName() {
                return "TargetCamera";
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _updateUpVectorFromRotation_decorators = [serialize()];
            _rotation_decorators = [serializeAsVector3()];
            _speed_decorators = [serialize()];
            _lockedTarget_decorators = [serializeAsMeshReference("lockedTargetId")];
            __esDecorate(null, null, _updateUpVectorFromRotation_decorators, { kind: "field", name: "updateUpVectorFromRotation", static: false, private: false, access: { has: obj => "updateUpVectorFromRotation" in obj, get: obj => obj.updateUpVectorFromRotation, set: (obj, value) => { obj.updateUpVectorFromRotation = value; } }, metadata: _metadata }, _updateUpVectorFromRotation_initializers, _updateUpVectorFromRotation_extraInitializers);
            __esDecorate(null, null, _rotation_decorators, { kind: "field", name: "rotation", static: false, private: false, access: { has: obj => "rotation" in obj, get: obj => obj.rotation, set: (obj, value) => { obj.rotation = value; } }, metadata: _metadata }, _rotation_initializers, _rotation_extraInitializers);
            __esDecorate(null, null, _speed_decorators, { kind: "field", name: "speed", static: false, private: false, access: { has: obj => "speed" in obj, get: obj => obj.speed, set: (obj, value) => { obj.speed = value; } }, metadata: _metadata }, _speed_initializers, _speed_extraInitializers);
            __esDecorate(null, null, _lockedTarget_decorators, { kind: "field", name: "lockedTarget", static: false, private: false, access: { has: obj => "lockedTarget" in obj, get: obj => obj.lockedTarget, set: (obj, value) => { obj.lockedTarget = value; } }, metadata: _metadata }, _lockedTarget_initializers, _lockedTarget_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a._RigCamTransformMatrix = new Matrix(),
        _a._TargetTransformMatrix = new Matrix(),
        _a._TargetFocalPoint = new Vector3(),
        _a;
})();
export { TargetCamera };
let _Registered = false;
/**
 * Register side effects for targetCamera.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterTargetCamera() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    Node.AddNodeConstructor("TargetCamera", (name, scene) => {
        return () => new TargetCamera(name, Vector3.Zero(), scene);
    });
}
//# sourceMappingURL=targetCamera.pure.js.map