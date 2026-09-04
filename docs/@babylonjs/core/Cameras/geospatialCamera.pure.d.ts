/** This file must only contain pure code and pure imports */
import { GeospatialCameraInputsManager } from "./geospatialCameraInputsManager.js";
import { Vector3, Matrix, type Vector2 } from "../Maths/math.vector.pure.js";
import { Camera } from "./camera.pure.js";
import { type Scene } from "../scene.pure.js";
import { type MeshPredicate } from "../Culling/ray.core.js";
import { type DeepImmutable } from "../types.js";
import { GeospatialLimits } from "./Limits/geospatialLimits.js";
import { GeospatialCameraMovement } from "./geospatialCameraMovement.js";
import { type IVector3Like } from "../Maths/math.like.js";
import { type EasingFunction } from "../Animations/easing.js";
export type GeospatialCameraOptions = {
    /**
     * Radius of the planet being orbited
     */
    planetRadius: number;
    /**
     * If supplied, will be used by the movement class when picking the globe. Can later update camera.movement.pickPredicate directly
     */
    pickPredicate?: MeshPredicate;
};
/**
 * Camera equipped to orbit a spherical planet centered at world origin
 */
export declare class GeospatialCamera extends Camera {
    inputs: GeospatialCameraInputsManager;
    /** Movement controller that provides input mapping and framerate-independent physics for geospatial interactions */
    readonly movement: GeospatialCameraMovement;
    private _tempPosition;
    private _tempCenter;
    private _viewMatrix;
    private _isViewMatrixDirty;
    private _lookAtVector;
    /** Behavior used for smooth flying animations */
    private _flyingBehavior;
    private _flyToTargets;
    private _collider?;
    private _collisionVelocity;
    /** Public option to customize the collision offset applied each frame - vs the one calculated using internal CollisionCoordinator */
    perFrameCollisionOffset: Vector3;
    /** Enable or disable collision checking for this camera. Default is false. */
    checkCollisions: boolean;
    constructor(name: string, scene: Scene, options: GeospatialCameraOptions);
    private _center;
    /** The point on the globe that we are anchoring around. If no alternate rotation point is supplied, this will represent the center of screen*/
    get center(): Vector3;
    /**
     * Sets the camera position to orbit around a new center point
     * @param center The world position (ECEF) to orbit around
     */
    set center(center: IVector3Like);
    private _yaw;
    /**
     * Gets the camera's yaw (rotation around the geocentric normal) in radians
     */
    get yaw(): number;
    /**
     * Sets the camera's yaw (rotation around the geocentric normal). Will wrap value to [-π, π)
     * @param yaw The desired yaw angle in radians (0 = north, π/2 = east)
     */
    set yaw(yaw: number);
    private _pitch;
    /**
     * Gets the camera's pitch (angle from looking straight at globe)
     * Pitch is measured from looking straight down at planet center:
     * - zero pitch = looking straight at planet center (down)
     * - positive pitch = tilting up away from planet
     * - π/2 pitch = looking at horizon (perpendicular to geocentric normal)
     */
    get pitch(): number;
    /**
     * Sets the camera's pitch (angle from looking straight at globe). Will wrap value to [-π, π)
     * @param pitch The desired pitch angle in radians (0 = looking at planet center, π/2 = looking at horizon)
     */
    set pitch(pitch: number);
    private _radius;
    /**
     * Gets the camera's distance from the current center point. This is distinct from planetRadius supplied at construction.
     */
    get radius(): number;
    /**
     * Sets the camera's distance from the current center point
     * @param radius The desired radius
     */
    set radius(radius: number);
    protected _checkLimits(): void;
    private _tempVect;
    private _tempEast;
    private _tempNorth;
    private _tempUp;
    private _setOrientation;
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
    updateFlyToDestination(targetYaw?: number, targetPitch?: number, targetRadius?: number, targetCenter?: Vector3): Promise<void> | undefined;
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
    flyToAsync(targetYaw?: number, targetPitch?: number, targetRadius?: number, targetCenter?: Vector3, flightDurationMs?: number, easingFunction?: EasingFunction, centerHopScale?: number): Promise<void>;
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
    private _flyToAsync;
    /**
     * Helper function to move camera towards a given point by `distanceScale` of the current camera-to-destination distance (by default 50%).
     * @param destination point to move towards
     * @param distanceScale value between 0 and 1, % of distance to move
     * @param durationMs duration of flight, default 1s
     * @param easingFn optional easing function for flight interpolation of properties
     * @param centerHopScale If supplied, will define the parabolic hop height scale for center animation to create a "bounce" effect
     */
    flyToPointAsync(destination: Vector3, distanceScale?: number, durationMs?: number, easingFn?: EasingFunction, centerHopScale?: number): Promise<void>;
    private _limits;
    /**
     * Gets the limits for this camera
     */
    get limits(): GeospatialLimits;
    private _resetToDefault;
    /** @internal */
    _getViewMatrix(): Matrix;
    /** @internal */
    _isSynchronizedViewMatrix(): boolean;
    private _applyGeocentricTranslation;
    /**
     * This rotation keeps the camera oriented towards the globe as it orbits around it. This is different from cameraCentricRotation which is when the camera rotates around its own axis
     */
    private _applyGeocentricRotation;
    private _getCenterAndRadiusFromZoomToPoint;
    /**
     * Apply zoom by moving the camera toward/away from a target point.
     */
    private _applyZoom;
    private _clampZoomDelta;
    /**
     * Zoom towards a specific point on the globe
     * @param targetPoint The point to zoom towards
     * @param distance The distance to move
     */
    zoomToPoint(targetPoint: DeepImmutable<IVector3Like>, distance: number): void;
    /**
     * Zoom along the camera's lookAt direction
     * @param distance The distance to zoom
     */
    zoomAlongLookAt(distance: number): void;
    /** @internal */
    _checkInputs(): void;
    private _wasCenterMovingLastFrame;
    private _recalculateCenter;
    /**
     * Allows extended classes to override how collision offset is calculated
     * @param newPosition
     * @returns
     */
    protected _getCollisionOffset(newPosition: Vector3): Vector3;
    /** @internal */
    attachControl(noPreventDefault?: boolean): void;
    /** @internal */
    detachControl(): void;
    /**
     * Gets the class name of the camera.
     * @returns the class name
     */
    getClassName(): string;
}
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
export declare function ComputeLookAtFromYawPitchToRef(yaw: number, pitch: number, center: Vector3, useRightHandedSystem: boolean, result: Vector3, calculateUpVectorFromPointToRef?: (point: Vector3, result: Vector3) => Vector3): Vector3;
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
export declare function ComputeYawPitchFromLookAtToRef(lookAt: Vector3, center: Vector3, useRightHandedSystem: boolean, currentYaw: number, result: Vector2, calculateUpVectorFromPointToRef?: (point: Vector3, result: Vector3) => Vector3): Vector2;
/**
 * Register side effects for geospatialCamera.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterGeospatialCamera(): void;
