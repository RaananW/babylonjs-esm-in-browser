/** This file must only contain pure code and pure imports */
import { __esDecorate, __runInitializers } from "../tslib.es6.js";
import { GeospatialCameraInputsManager } from "./geospatialCameraInputsManager.js";
import { Vector3, Matrix, TmpVectors } from "../Maths/math.vector.pure.js";
import { Epsilon } from "../Maths/math.constants.js";
import { Camera } from "./camera.pure.js";
import { serialize, serializeAsVector3 } from "../Misc/decorators.js";
import { GeospatialLimits } from "./Limits/geospatialLimits.js";
import { ClampCenterFromPolesInPlace, ComputeLocalBasisToRefs, GeospatialCameraMovement } from "./geospatialCameraMovement.js";
import { Vector3CopyToRef, Vector3Distance, Vector3Dot, Vector3SubtractToRef } from "../Maths/math.vector.functions.js";
import { Clamp, NormalizeRadians } from "../Maths/math.scalar.functions.js";
import { InterpolatingBehavior } from "../Behaviors/Cameras/interpolatingBehavior.js";
import { RegisterClass } from "../Misc/typeStore.js";
/**
 * Camera equipped to orbit a spherical planet centered at world origin
 */
let GeospatialCamera = (() => {
    var _a;
    let _classSuper = Camera;
    let _checkCollisions_decorators;
    let _checkCollisions_initializers = [];
    let _checkCollisions_extraInitializers = [];
    let __center_decorators;
    let __center_initializers = [];
    let __center_extraInitializers = [];
    let __yaw_decorators;
    let __yaw_initializers = [];
    let __yaw_extraInitializers = [];
    let __pitch_decorators;
    let __pitch_initializers = [];
    let __pitch_extraInitializers = [];
    let __radius_decorators;
    let __radius_initializers = [];
    let __radius_extraInitializers = [];
    return _a = class GeospatialCamera extends _classSuper {
            constructor(name, scene, options) {
                super(name, new Vector3(), scene);
                // Temp vars
                this._tempPosition = new Vector3();
                this._tempCenter = new Vector3();
                this._viewMatrix = new Matrix();
                this._lookAtVector = new Vector3();
                this._flyToTargets = new Map();
                this._collisionVelocity = new Vector3();
                /** Public option to customize the collision offset applied each frame - vs the one calculated using internal CollisionCoordinator */
                this.perFrameCollisionOffset = new Vector3();
                /** Enable or disable collision checking for this camera. Default is false. */
                this.checkCollisions = __runInitializers(this, _checkCollisions_initializers, false);
                this._center = (__runInitializers(this, _checkCollisions_extraInitializers), __runInitializers(this, __center_initializers, new Vector3()));
                this._yaw = (__runInitializers(this, __center_extraInitializers), __runInitializers(this, __yaw_initializers, 0));
                this._pitch = (__runInitializers(this, __yaw_extraInitializers), __runInitializers(this, __pitch_initializers, 0));
                this._radius = (__runInitializers(this, __pitch_extraInitializers), __runInitializers(this, __radius_initializers, 0));
                this._tempVect = (__runInitializers(this, __radius_extraInitializers), new Vector3());
                this._tempEast = new Vector3();
                this._tempNorth = new Vector3();
                this._tempUp = new Vector3();
                this._wasCenterMovingLastFrame = false;
                this._limits = new GeospatialLimits(options.planetRadius);
                this._flyingBehavior = new InterpolatingBehavior();
                this.addBehavior(this._flyingBehavior);
                this.movement = new GeospatialCameraMovement(scene, this._limits, this.position, this.center, this._lookAtVector, options.pickPredicate, this._flyingBehavior);
                this._resetToDefault(this._limits);
                this.inputs = new GeospatialCameraInputsManager(this);
                this.inputs.addMouse().addMouseWheel().addKeyboard();
            }
            /** The point on the globe that we are anchoring around. If no alternate rotation point is supplied, this will represent the center of screen*/
            get center() {
                return this._center;
            }
            /**
             * Sets the camera position to orbit around a new center point
             * @param center The world position (ECEF) to orbit around
             */
            set center(center) {
                this._center.copyFromFloats(center.x, center.y, center.z);
                this._setOrientation(this._yaw, this._pitch, this._radius, this._center);
            }
            /**
             * Gets the camera's yaw (rotation around the geocentric normal) in radians
             */
            get yaw() {
                return this._yaw;
            }
            /**
             * Sets the camera's yaw (rotation around the geocentric normal). Will wrap value to [-π, π)
             * @param yaw The desired yaw angle in radians (0 = north, π/2 = east)
             */
            set yaw(yaw) {
                yaw !== this._yaw && this._setOrientation(yaw, this.pitch, this.radius, this.center);
            }
            /**
             * Gets the camera's pitch (angle from looking straight at globe)
             * Pitch is measured from looking straight down at planet center:
             * - zero pitch = looking straight at planet center (down)
             * - positive pitch = tilting up away from planet
             * - π/2 pitch = looking at horizon (perpendicular to geocentric normal)
             */
            get pitch() {
                return this._pitch;
            }
            /**
             * Sets the camera's pitch (angle from looking straight at globe). Will wrap value to [-π, π)
             * @param pitch The desired pitch angle in radians (0 = looking at planet center, π/2 = looking at horizon)
             */
            set pitch(pitch) {
                pitch !== this._pitch && this._setOrientation(this.yaw, pitch, this.radius, this.center);
            }
            /**
             * Gets the camera's distance from the current center point. This is distinct from planetRadius supplied at construction.
             */
            get radius() {
                return this._radius;
            }
            /**
             * Sets the camera's distance from the current center point
             * @param radius The desired radius
             */
            set radius(radius) {
                radius !== this._radius && this._setOrientation(this.yaw, this.pitch, radius, this.center);
            }
            _checkLimits() {
                const limits = this.limits;
                this._yaw = Clamp(this._yaw, limits.yawMin, limits.yawMax);
                const effectivePitchMax = limits.getEffectivePitchMax(this._radius);
                this._pitch = Clamp(this._pitch, limits.pitchMin, effectivePitchMax);
                this._radius = Clamp(this._radius, limits.radiusMin, limits.radiusMax);
                ClampCenterFromPolesInPlace(this._center);
            }
            _setOrientation(yaw, pitch, radius, center) {
                // Wrap yaw and pitch to [-π, π)
                this._yaw = NormalizeRadians(yaw);
                this._pitch = NormalizeRadians(pitch);
                this._radius = radius;
                Vector3CopyToRef(center, this._center);
                // Clamp to limits
                this._checkLimits();
                // Refresh local basis at center (treat these as read-only for the whole call)
                ComputeLocalBasisToRefs(this._center, this._tempEast, this._tempNorth, this._tempUp, this._scene.useRightHandedSystem, this.movement.calculateUpVectorFromPointToRef);
                // Compute lookAt from yaw/pitch
                ComputeLookAtFromYawPitchToRef(this._yaw, this._pitch, this._center, this._scene.useRightHandedSystem, this._lookAtVector, this.movement.calculateUpVectorFromPointToRef);
                // Build an orthonormal up aligned with geocentric Up
                // When looking straight down (pitch ≈ 0), lookAt is parallel to Up, so use the horizontal direction as the camera's up.
                const right = TmpVectors.Vector3[10];
                Vector3.CrossToRef(this._tempUp, this._lookAtVector, right);
                if (right.lengthSquared() < Epsilon) {
                    // horiz = north * cos(yaw) + east * sin(yaw)
                    // Using tempEast directly ensures handedness is taken into account
                    const horiz = TmpVectors.Vector3[11];
                    const t1 = TmpVectors.Vector3[12];
                    horiz
                        .copyFrom(this._tempNorth)
                        .scaleInPlace(Math.cos(this._yaw))
                        .addInPlace(t1.copyFrom(this._tempEast).scaleInPlace(Math.sin(this._yaw)));
                    // right = cross(horiz, lookAt)
                    Vector3.CrossToRef(horiz, this._lookAtVector, right);
                }
                right.normalize();
                // up = normalize(cross(look, right))
                Vector3.CrossToRef(this._lookAtVector, right, this.upVector);
                this.upVector.normalize();
                // Position = center - look * radius  (preserve unit look)
                this._tempVect.copyFrom(this._lookAtVector).scaleInPlace(-this._radius);
                this._tempPosition.copyFrom(this._center).addInPlace(this._tempVect);
                // Recalculate collisionOffset to be applied later when viewMatrix is calculated (allowing camera users to modify the value in afterCheckInputsObservable)
                if (this.checkCollisions) {
                    this.perFrameCollisionOffset = this._getCollisionOffset(this._tempPosition);
                }
                this._position.copyFrom(this._tempPosition);
                this._isViewMatrixDirty = true;
            }
            /**
             * If the camera is actively in flight, redirects it toward a new destination, using up the remaining
             * duration from the original flyToAsync call. The redirect starts from the camera's current pose, so it
             * stays smooth (no snap). If the camera is not currently in flight this is a no-op; start a new flight
             * with flyToAsync instead.
             *
             * Note: redirecting interrupts the in-flight animation, so the promise returned by the original
             * flyToAsync call resolves early. Await the promise returned here to be notified when the redirected
             * flight actually completes.
             *
             * Any property left undefined is frozen at its current value (matching flyToAsync), it does not continue
             * toward the original flight's destination for that property.
             * @param targetYaw - Target yaw in radians, or undefined to freeze yaw at its current value.
             * @param targetPitch - Target pitch in radians, or undefined to freeze pitch at its current value.
             * @param targetRadius - Target radius (distance from the look-at center), or undefined to freeze radius at its current value.
             * @param targetCenter - Target look-at center in scene coordinates, or undefined to freeze the center at its current value.
             * @returns Promise that resolves when the redirected flight completes (or is interrupted), or undefined if the camera was not in flight.
             */
            updateFlyToDestination(targetYaw, targetPitch, targetRadius, targetCenter) {
                if (!this._flyingBehavior.isInterpolating) {
                    // Nothing in flight to redirect. Callers should use flyToAsync to start a new flight.
                    return undefined;
                }
                // Redirecting is just a fresh flight that starts from the camera's current pose and uses up the
                // time left in the original flight. flyToAsync already eases from the current values, so this stays
                // smooth (no snap).
                return this._flyToAsync(targetYaw, targetPitch, targetRadius, targetCenter, this._flyingBehavior.remainingDurationMs);
            }
            /**
             * Animate camera towards passed in property values. If undefined, will use current value
             * @param targetYaw - Target yaw in radians, or undefined to keep the current yaw.
             * @param targetPitch - Target pitch in radians, or undefined to keep the current pitch.
             * @param targetRadius - Target radius (distance from the look-at center), or undefined to keep the current radius.
             * @param targetCenter - Target look-at center in scene coordinates, or undefined to keep the current center.
             * @param flightDurationMs - Total duration of the animation in milliseconds. Defaults to 1000ms.
             * @param easingFunction - Optional easing function applied to the animation curve.
             * @param centerHopScale If supplied, will define the parabolic hop height scale for center animation to create a "bounce" effect
             * @returns Promise that will return when the animation is complete (or interuppted by pointer input)
             */
            async flyToAsync(targetYaw, targetPitch, targetRadius, targetCenter, flightDurationMs = 1000, easingFunction, centerHopScale) {
                return await this._flyToAsync(targetYaw, targetPitch, targetRadius, targetCenter, flightDurationMs, easingFunction, centerHopScale);
            }
            /**
             * Shared flight implementation used by both flyToAsync (new flight) and updateFlyToDestination (redirect).
             * Builds the target property map (and the center SLERP/hop interpolation) and animates from the camera's
             * current pose over the given duration.
             * @param targetYaw - Target yaw in radians, or undefined to keep the current yaw.
             * @param targetPitch - Target pitch in radians, or undefined to keep the current pitch.
             * @param targetRadius - Target radius (distance from the look-at center), or undefined to keep the current radius.
             * @param targetCenter - Target look-at center in scene coordinates, or undefined to keep the current center.
             * @param flightDurationMs - Total duration of the animation in milliseconds. Defaults to 1000ms.
             * @param easingFunction - Optional easing function applied to the animation curve.
             * @param centerHopScale - If supplied, defines the parabolic hop height scale for the center animation to create a "bounce" effect.
             * @returns Promise that resolves when the animation is complete (or interrupted).
             */
            async _flyToAsync(targetYaw, targetPitch, targetRadius, targetCenter, flightDurationMs = 1000, easingFunction, centerHopScale) {
                this._flyToTargets.clear();
                // For yaw, use shortest path to target.
                const deltaYaw = targetYaw !== undefined ? NormalizeRadians(NormalizeRadians(targetYaw) - this._yaw) : 0;
                this._flyToTargets.set("yaw", deltaYaw === 0 ? undefined : this._yaw + deltaYaw);
                this._flyToTargets.set("pitch", targetPitch !== undefined ? NormalizeRadians(targetPitch) : undefined);
                this._flyToTargets.set("radius", targetRadius);
                this._flyToTargets.set("center", targetCenter?.clone());
                let overrideAnimationFunction;
                if (targetCenter !== undefined && !targetCenter.equals(this.center)) {
                    // Animate center directly with custom interpolation
                    overrideAnimationFunction = (key, animation) => {
                        if (key === "center") {
                            // Override the Vector3 interpolation to use SLERP + hop
                            animation.vector3InterpolateFunction = (startValue, endValue, gradient) => {
                                // gradient is the eased value (0 to 1) after easing function is applied
                                // Slerp between start and end
                                const newCenter = Vector3.SlerpToRef(startValue, endValue, gradient, this._tempCenter);
                                // Apply parabolic hop if requested
                                if (centerHopScale && centerHopScale > 0) {
                                    // Parabolic formula: peaks at t=0.5, returns to 0 at gradient=0 and gradient=1
                                    // if hopPeakT = .5 the denominator would be hopPeakT * hopPeakT - hopPeakT, which = -.25
                                    const hopPeakOffset = centerHopScale * Vector3Distance(startValue, endValue);
                                    const hopOffset = hopPeakOffset * Clamp((gradient * gradient - gradient) / -0.25);
                                    // Scale the center outward (away from origin)
                                    newCenter.scaleInPlace(1 + hopOffset / newCenter.length());
                                }
                                return newCenter;
                            };
                        }
                    };
                }
                return await this._flyingBehavior.animatePropertiesAsync(this._flyToTargets, flightDurationMs, easingFunction, overrideAnimationFunction);
            }
            /**
             * Helper function to move camera towards a given point by `distanceScale` of the current camera-to-destination distance (by default 50%).
             * @param destination point to move towards
             * @param distanceScale value between 0 and 1, % of distance to move
             * @param durationMs duration of flight, default 1s
             * @param easingFn optional easing function for flight interpolation of properties
             * @param centerHopScale If supplied, will define the parabolic hop height scale for center animation to create a "bounce" effect
             */
            async flyToPointAsync(destination, distanceScale = 0.5, durationMs = 1000, easingFn, centerHopScale) {
                // Move by a fraction of the camera-to-destination distance
                const zoomDistance = Vector3Distance(this.position, destination) * distanceScale;
                const newRadius = this._getCenterAndRadiusFromZoomToPoint(destination, zoomDistance, this._tempCenter);
                await this.flyToAsync(undefined, undefined, newRadius, this._tempCenter, durationMs, easingFn, centerHopScale);
                !this.isDisposed() && this._recalculateCenter(false, true /** force */);
            }
            /**
             * Gets the limits for this camera
             */
            get limits() {
                return this._limits;
            }
            _resetToDefault(limits) {
                // Camera configuration vars
                const restingAltitude = limits.radiusMax !== Infinity ? limits.radiusMax : limits.planetRadius * 4;
                this.position.copyFromFloats(restingAltitude, 0, 0);
                this._center.copyFromFloats(limits.planetRadius, 0, 0);
                this._radius = Vector3.Distance(this.position, this.center);
                // Temp vars
                this._tempPosition = new Vector3();
                // View matrix calculation vars
                this._viewMatrix = Matrix.Identity();
                this._center.subtractToRef(this._position, this._lookAtVector).normalize(); // Lookat vector of the camera
                this.upVector = Vector3.Up(); // Up vector of the camera (does work for -X look at)
                this._isViewMatrixDirty = true;
                this._setOrientation(this._yaw, this._pitch, this._radius, this._center);
            }
            /** @internal */
            _getViewMatrix() {
                if (!this._isViewMatrixDirty) {
                    return this._viewMatrix;
                }
                this._isViewMatrixDirty = false;
                // Ensure vectors are normalized
                this.upVector.normalize();
                this._lookAtVector.normalize();
                // Apply the same offset to both position and center to preserve orbital relationship
                // This keeps yaw/pitch/radius intact - just lifts the whole "rig"
                this._position.addInPlace(this.perFrameCollisionOffset);
                this._center.addInPlace(this.perFrameCollisionOffset);
                // Calculate view matrix with camera position and center
                if (this.getScene().useRightHandedSystem) {
                    Matrix.LookAtRHToRef(this.position, this._center, this.upVector, this._viewMatrix);
                }
                else {
                    Matrix.LookAtLHToRef(this.position, this._center, this.upVector, this._viewMatrix);
                }
                return this._viewMatrix;
            }
            /** @internal */
            _isSynchronizedViewMatrix() {
                if (!super._isSynchronizedViewMatrix() || this._isViewMatrixDirty) {
                    return false;
                }
                return true;
            }
            _applyGeocentricTranslation() {
                // Store pending position (without any corrections applied)
                this.center.addToRef(this.movement.panDeltaCurrentFrame, this._tempPosition);
                if (!this.movement.isInterpolating) {
                    // Calculate the position correction to keep camera at the same radius when applying translation
                    this._tempPosition.normalize().scaleInPlace(this.center.length());
                }
                // Set center which will call _setOrientation
                this.center = this._tempPosition;
            }
            /**
             * This rotation keeps the camera oriented towards the globe as it orbits around it. This is different from cameraCentricRotation which is when the camera rotates around its own axis
             */
            _applyGeocentricRotation() {
                const rotationDeltaCurrentFrame = this.movement.rotationDeltaCurrentFrame;
                if (rotationDeltaCurrentFrame.x !== 0 || rotationDeltaCurrentFrame.y !== 0) {
                    const pitch = rotationDeltaCurrentFrame.x !== 0 ? Clamp(this._pitch + rotationDeltaCurrentFrame.x, 0, 0.5 * Math.PI - Epsilon) : this._pitch;
                    const yaw = rotationDeltaCurrentFrame.y !== 0 ? this._yaw + rotationDeltaCurrentFrame.y : this._yaw;
                    this._setOrientation(yaw, pitch, this._radius, this._center);
                }
            }
            _getCenterAndRadiusFromZoomToPoint(targetPoint, distance, newCenterResult) {
                const directionToTarget = Vector3SubtractToRef(targetPoint, this._position, TmpVectors.Vector3[0]);
                const distanceToTarget = directionToTarget.length();
                // Don't zoom past the min radius limit.
                if (distanceToTarget < this.limits.radiusMin) {
                    newCenterResult.copyFrom(this._center);
                    const requestedRadius = this._radius - distance;
                    const newRadius = Clamp(requestedRadius, this.limits.radiusMin, this.limits.radiusMax);
                    return newRadius;
                }
                // Move the camera position towards targetPoint by distanceToTarget
                directionToTarget.scaleInPlace(distance / distanceToTarget);
                const newPosition = this._position.addToRef(directionToTarget, TmpVectors.Vector3[1]);
                // Project the movement onto the look vector to derive the new center/radius.
                const projectedDistance = Vector3Dot(directionToTarget, this._lookAtVector);
                const newRadius = this._radius - projectedDistance;
                const newRadiusClamped = Clamp(newRadius, this.limits.radiusMin, this.limits.radiusMax);
                newCenterResult.copyFrom(newPosition).addInPlace(this._lookAtVector.scale(newRadiusClamped));
                return newRadiusClamped;
            }
            /**
             * Apply zoom by moving the camera toward/away from a target point.
             */
            _applyZoom() {
                let zoomDelta = this.movement.zoomDeltaCurrentFrame;
                const pickedPoint = this.movement.computedPerFrameZoomPickPoint;
                // Clamp zoom delta to limits before applying
                zoomDelta = this._clampZoomDelta(zoomDelta, pickedPoint);
                if (Math.abs(zoomDelta) < Epsilon) {
                    return;
                }
                if (pickedPoint) {
                    // Zoom toward the picked point under cursor
                    this.zoomToPoint(pickedPoint, zoomDelta);
                }
                else {
                    // Zoom along lookAt vector (fallback when no surface under cursor)
                    this.zoomAlongLookAt(zoomDelta);
                }
            }
            _clampZoomDelta(zoomDelta, pickedPoint) {
                if (Math.abs(zoomDelta) < Epsilon) {
                    return 0;
                }
                const distanceToTarget = pickedPoint ? Vector3Distance(this._position, pickedPoint) : undefined;
                return this.limits.clampZoomDistance(zoomDelta, this._radius, distanceToTarget);
            }
            /**
             * Zoom towards a specific point on the globe
             * @param targetPoint The point to zoom towards
             * @param distance The distance to move
             */
            zoomToPoint(targetPoint, distance) {
                const newRadius = this._getCenterAndRadiusFromZoomToPoint(targetPoint, distance, this._tempCenter);
                // Apply the new orientation
                this._setOrientation(this._yaw, this._pitch, newRadius, this._tempCenter);
            }
            /**
             * Zoom along the camera's lookAt direction
             * @param distance The distance to zoom
             */
            zoomAlongLookAt(distance) {
                // Clamp radius to limits
                const requestedRadius = this._radius - distance;
                const newRadius = Clamp(requestedRadius, this.limits.radiusMin, this.limits.radiusMax);
                // Simply change radius without moving center
                this._setOrientation(this._yaw, this._pitch, newRadius, this._center);
            }
            /** @internal */
            _checkInputs() {
                this.inputs.checkInputs();
                this.perFrameCollisionOffset.setAll(0);
                // Let movement class handle all per-frame logic
                this.movement.computeCurrentFrameDeltas();
                let isCenterMoving = false;
                if (this.movement.panDeltaCurrentFrame.lengthSquared() > 0) {
                    this._applyGeocentricTranslation();
                    // After a drag, recalculate the center point to ensure it's still on the surface.
                    isCenterMoving = true;
                }
                if (this.movement.rotationDeltaCurrentFrame.lengthSquared() > 0) {
                    this._applyGeocentricRotation();
                }
                if (Math.abs(this.movement.zoomDeltaCurrentFrame) > Epsilon) {
                    this._applyZoom();
                    isCenterMoving = true;
                }
                // After a movement impacting center or radius, recalculate the center point to ensure it's still on the surface.
                this._recalculateCenter(isCenterMoving);
                super._checkInputs();
            }
            _recalculateCenter(isCenterMoving, forceRecalculate = false) {
                const shouldRecalculateCenterAfterMove = this._wasCenterMovingLastFrame && !isCenterMoving;
                this._wasCenterMovingLastFrame = isCenterMoving;
                // Wait until movement impacting center is complete to avoid wasted raycasting
                if (shouldRecalculateCenterAfterMove || forceRecalculate) {
                    const newCenter = this.movement.pickAlongVector(this._lookAtVector);
                    if (newCenter?.pickedPoint) {
                        // Direction from new center to origin
                        const centerToOrigin = TmpVectors.Vector3[4];
                        centerToOrigin.copyFrom(newCenter.pickedPoint).negateInPlace().normalize();
                        // Check if this direction aligns with camera's lookAt vector
                        const dotProduct = Vector3Dot(this._lookAtVector, centerToOrigin);
                        // Only update if the center is looking toward the origin (dot product > 0) to avoid a center on the opposite side of globe
                        if (dotProduct > 0) {
                            // Compute the new radius as distance from camera position to new center
                            const newRadius = Vector3Distance(this._position, newCenter.pickedPoint);
                            // Only update if the new center is in front of the camera
                            if (newRadius > Epsilon) {
                                // Compute yaw/pitch that correspond to current lookAt at new center
                                const yawPitch = TmpVectors.Vector2[0];
                                ComputeYawPitchFromLookAtToRef(this._lookAtVector, newCenter.pickedPoint, this._scene.useRightHandedSystem, this._yaw, yawPitch, this.movement.calculateUpVectorFromPointToRef);
                                // Call _setOrientation with the computed yaw/pitch and new center
                                this._setOrientation(yawPitch.x, yawPitch.y, newRadius, newCenter.pickedPoint);
                            }
                        }
                    }
                }
            }
            /**
             * Allows extended classes to override how collision offset is calculated
             * @param newPosition
             * @returns
             */
            _getCollisionOffset(newPosition) {
                const collisionOffset = TmpVectors.Vector3[6].setAll(0);
                if (!this.checkCollisions || !this._scene.collisionsEnabled) {
                    return collisionOffset;
                }
                const coordinator = this.getScene().collisionCoordinator;
                if (!coordinator) {
                    return collisionOffset;
                }
                if (!this._collider) {
                    this._collider = coordinator.createCollider();
                }
                this._collider._radius.setAll(this.limits.radiusMin);
                // Calculate velocity from old position to new position
                newPosition.subtractToRef(this._position, this._collisionVelocity);
                // Get the collision-adjusted position
                const adjustedPosition = coordinator.getNewPosition(this._position, this._collisionVelocity, this._collider, 3, null, () => { }, this.uniqueId);
                // Calculate the collision offset (how much the position was pushed)
                adjustedPosition.subtractToRef(newPosition, collisionOffset);
                return collisionOffset;
            }
            /** @internal */
            attachControl(noPreventDefault) {
                this.inputs.attachElement(noPreventDefault);
            }
            /** @internal */
            detachControl() {
                this.inputs.detachElement();
            }
            /**
             * Gets the class name of the camera.
             * @returns the class name
             */
            getClassName() {
                return "GeospatialCamera";
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _checkCollisions_decorators = [serialize()];
            __center_decorators = [serializeAsVector3()];
            __yaw_decorators = [serialize()];
            __pitch_decorators = [serialize()];
            __radius_decorators = [serialize()];
            __esDecorate(null, null, _checkCollisions_decorators, { kind: "field", name: "checkCollisions", static: false, private: false, access: { has: obj => "checkCollisions" in obj, get: obj => obj.checkCollisions, set: (obj, value) => { obj.checkCollisions = value; } }, metadata: _metadata }, _checkCollisions_initializers, _checkCollisions_extraInitializers);
            __esDecorate(null, null, __center_decorators, { kind: "field", name: "_center", static: false, private: false, access: { has: obj => "_center" in obj, get: obj => obj._center, set: (obj, value) => { obj._center = value; } }, metadata: _metadata }, __center_initializers, __center_extraInitializers);
            __esDecorate(null, null, __yaw_decorators, { kind: "field", name: "_yaw", static: false, private: false, access: { has: obj => "_yaw" in obj, get: obj => obj._yaw, set: (obj, value) => { obj._yaw = value; } }, metadata: _metadata }, __yaw_initializers, __yaw_extraInitializers);
            __esDecorate(null, null, __pitch_decorators, { kind: "field", name: "_pitch", static: false, private: false, access: { has: obj => "_pitch" in obj, get: obj => obj._pitch, set: (obj, value) => { obj._pitch = value; } }, metadata: _metadata }, __pitch_initializers, __pitch_extraInitializers);
            __esDecorate(null, null, __radius_decorators, { kind: "field", name: "_radius", static: false, private: false, access: { has: obj => "_radius" in obj, get: obj => obj._radius, set: (obj, value) => { obj._radius = value; } }, metadata: _metadata }, __radius_initializers, __radius_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
export { GeospatialCamera };
// Register Class Name
/**
 * Compute the lookAt direction vector from yaw and pitch angles at a given center point.
 * This is the forward formula used by GeospatialCamera._setOrientation.
 * @param yaw - The yaw angle in radians (0 = north, π/2 = east)
 * @param pitch - The pitch angle in radians (0 = looking at planet center, π/2 = looking at horizon)
 * @param center - The center point on the globe
 * @param useRightHandedSystem - Whether the scene uses a right-handed coordinate system
 * @param result - The vector to store the result in
 * @param calculateUpVectorFromPointToRef - Optional function to calculate the up vector from a point, allowing for non-spherical planets. If not supplied, a perfect sphere is assumed and the up vector is just the normalized center point.
 * @returns The normalized lookAt direction vector (same as result)
 */
export function ComputeLookAtFromYawPitchToRef(yaw, pitch, center, useRightHandedSystem, result, calculateUpVectorFromPointToRef) {
    const east = TmpVectors.Vector3[0];
    const north = TmpVectors.Vector3[1];
    const up = TmpVectors.Vector3[2];
    ComputeLocalBasisToRefs(center, east, north, up, useRightHandedSystem, calculateUpVectorFromPointToRef);
    const sinPitch = Math.sin(pitch);
    const cosPitch = Math.cos(pitch);
    // horiz = north * cos(yaw) + east * sin(yaw)
    // Handedness is taken into account when defining east vector via ComputeLocalBasisToRefs.
    const horiz = TmpVectors.Vector3[3];
    const t1 = TmpVectors.Vector3[4];
    horiz
        .copyFrom(north)
        .scaleInPlace(Math.cos(yaw))
        .addInPlace(t1.copyFrom(east).scaleInPlace(Math.sin(yaw)));
    // lookAt = horiz * sinPitch - up * cosPitch
    const t2 = TmpVectors.Vector3[5];
    result.copyFrom(horiz).scaleInPlace(sinPitch).addInPlace(t2.copyFrom(up).scaleInPlace(-cosPitch));
    return result.normalize();
}
/**
 * Given a lookAt direction and center, compute the yaw and pitch angles that would produce that lookAt.
 * This is the inverse of ComputeLookAtFromYawPitchToRef.
 * @param lookAt - The normalized lookAt direction vector
 * @param center - The center point on the globe
 * @param useRightHandedSystem - Whether the scene uses a right-handed coordinate system
 * @param currentYaw - The current yaw value to use as fallback when pitch is near 0 (looking straight down/up)
 * @param result - The Vector2 to store the result in (x = yaw, y = pitch)
 * @param calculateUpVectorFromPointToRef - Optional function to calculate the up vector from a point. If supplied, this function will be used instead of assuming a spherical geocentric normal, allowing support for non-spherical planets or custom up vector logic.
 * @returns The result Vector2
 */
export function ComputeYawPitchFromLookAtToRef(lookAt, center, useRightHandedSystem, currentYaw, result, calculateUpVectorFromPointToRef) {
    // Compute local basis at center
    const east = TmpVectors.Vector3[6];
    const north = TmpVectors.Vector3[7];
    const up = TmpVectors.Vector3[8];
    ComputeLocalBasisToRefs(center, east, north, up, useRightHandedSystem, calculateUpVectorFromPointToRef);
    // lookAt = horiz*sinPitch - up*cosPitch
    // where horiz = north*cos(yaw) + east*sin(yaw)
    //
    // The vertical component of lookAt (along up) gives us cosPitch:
    // lookAt · up = -cosPitch
    const lookDotUp = Vector3Dot(lookAt, up);
    const cosPitch = -lookDotUp;
    // Clamp cosPitch to valid range to avoid NaN from acos
    const clampedCosPitch = Clamp(cosPitch, -1, 1);
    const pitch = Math.acos(clampedCosPitch);
    // The horizontal component gives us yaw
    // lookHorizontal = lookAt + up*cosPitch = horiz*sinPitch
    const lookHorizontal = TmpVectors.Vector3[9];
    const scaledUp = TmpVectors.Vector3[10];
    scaledUp.copyFrom(up).scaleInPlace(cosPitch);
    lookHorizontal.copyFrom(lookAt).addInPlace(scaledUp);
    const sinPitch = Math.sin(pitch);
    if (Math.abs(sinPitch) < Epsilon) {
        // Looking straight down or up, yaw is undefined - keep current
        result.x = currentYaw;
        result.y = pitch;
        return result;
    }
    // horiz = lookHorizontal / sinPitch
    const horiz = lookHorizontal.scaleInPlace(1 / sinPitch);
    // From the forward formula: horiz = North*cos(yaw) + East*sin(yaw)
    // So: cosYaw = horiz · north, sinYaw = horiz · east
    const cosYaw = Vector3Dot(horiz, north);
    const sinYaw = Vector3Dot(horiz, east);
    result.x = Math.atan2(sinYaw, cosYaw);
    result.y = pitch;
    return result;
}
let _Registered = false;
/**
 * Register side effects for geospatialCamera.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterGeospatialCamera() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    RegisterClass("BABYLON.GeospatialCamera", GeospatialCamera);
}
//# sourceMappingURL=geospatialCamera.pure.js.map