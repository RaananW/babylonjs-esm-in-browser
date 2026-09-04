/** This file must only contain pure code and pure imports */
import { CameraMovement } from "./cameraMovement.js";
import { type GeospatialLimits } from "./Limits/geospatialLimits.js";
import { Vector3 } from "../Maths/math.vector.pure.js";
import { type MeshPredicate } from "../Culling/ray.core.js";
import { type Scene } from "../scene.pure.js";
import { type PickingInfo } from "../Collisions/pickingInfo.js";
import { type Nullable } from "../types.js";
import { type InterpolatingBehavior } from "../Behaviors/Cameras/interpolatingBehavior.js";
import { type GeospatialCamera } from "./geospatialCamera.pure.js";
import { InputMapper } from "./inputMapper.js";
/**
 * Handler for geospatial pan (globe drag) interactions.
 * Pan uses screen coordinates and needs a lifecycle (start/update/stop) because
 * it establishes a drag plane on the globe surface to anchor the cursor.
 */
export type GeospatialPanHandler = {
    /** Begin a pan gesture at screen position */
    start(screenX: number, screenY: number): void;
    /** Continue panning to new screen position */
    update(screenX: number, screenY: number): void;
    /** End the pan gesture */
    stop(): void;
};
/**
 * Handler shape for geospatial camera interactions.
 * Property names are the canonical interaction type strings used in inputMap entries.
 * Single-method handlers are plain functions; multi-method handlers (pan) are objects.
 */
export type GeospatialHandlers = {
    /** Handler for pan (globe drag) interactions — object because it needs start/update/stop lifecycle */
    pan: GeospatialPanHandler;
    /** Handler for rotate (tilt) interactions — accepts yaw (horizontal) and pitch (vertical) deltas */
    rotate: (yaw: number, pitch: number) => void;
    /** Handler for zoom interactions — accepts delta and whether to zoom toward cursor */
    zoom: (delta: number, toCursor: boolean) => void;
};
/** Interaction type string for geospatial camera, derived from handler property names */
export type GeospatialInteraction = keyof GeospatialHandlers;
/**
 * Geospatial-specific camera movement system that extends the base movement with
 * raycasting and altitude-aware zoom constraints.
 *
 * This class encapsulates geospatial camera movement logic:
 * - Dragging in a way which keeps cursor anchored to globe
 * - Latitude-based pan speed dampening
 * - Zoom speed scaling based on distance to center
 * - Raycasting to determine zoom constraints based on terrain/globe
 * - Altitude-based zoom clamping
 * - Zoom direction calculation (towards cursor vs along look vector)
 */
export declare class GeospatialCameraMovement extends CameraMovement {
    /** Geospatial bounds (min/max latitude, longitude, altitude, etc.) used to clamp camera motion. */
    limits: GeospatialLimits;
    private _cameraCenter;
    private _cameraLookAt;
    /** Predicate function to determine which meshes to pick against (e.g., globe mesh) */
    pickPredicate?: MeshPredicate;
    /**
     * World-space picked point under the cursor, computed each frame that zoom input is active.
     * Used to determine the zoom direction when `zoomToCursor` is true.
     * Undefined when there is no active zoom or the pick misses the globe.
     */
    computedPerFrameZoomPickPoint?: Vector3;
    /**
     * When true, zooming moves toward the point under the cursor.
     * When false, zooming moves along the camera's look vector.
     */
    zoomToCursor: boolean;
    /** Input system that maps physical inputs to interactions and dispatches to handlers. */
    readonly input: InputMapper<GeospatialHandlers>;
    private _tempPickingRay;
    private _hitPointRadius?;
    private _dragPlane;
    private _dragPlaneNormal;
    private _dragPlaneOriginPointEcef;
    private _dragPlaneHitPointLocal;
    private _previousDragPlaneHitPointLocal;
    constructor(scene: Scene, 
    /** Geospatial bounds (min/max latitude, longitude, altitude, etc.) used to clamp camera motion. */
    limits: GeospatialLimits, cameraPosition: Vector3, _cameraCenter: Vector3, _cameraLookAt: Vector3, pickPredicate?: MeshPredicate, behavior?: InterpolatingBehavior<GeospatialCamera>);
    private _createDefaultInputMap;
    /**
     * Function to calculate the up vector from a given point.
     * Can be overridden to support non-spherical planets or custom up vector logic.
     * Defaults to using the geocentric normal.
     * @param point The point from which to calculate the up vector (e.g., camera position)
     * @param result The vector to store the calculated up vector
     * @returns The calculated up vector
     */
    calculateUpVectorFromPointToRef: (point: Vector3, result: Vector3) => Vector3;
    /**
     * Begins a drag (pan) gesture by picking the globe at the given screen position
     * and establishing a drag plane for subsequent updates.
     * @param pointerX - Screen X coordinate of the pointer
     * @param pointerY - Screen Y coordinate of the pointer
     */
    startDrag(pointerX: number, pointerY: number): void;
    /**
     * Ends the current drag gesture, releasing the drag plane.
     */
    stopDrag(): void;
    /**
     * The previous drag plane hit point in local space is stored to compute the movement delta.
     * As the drag movement occurs, we will continuously recalculate this point. The delta between the previous and current hit points is the delta we will apply to the camera's localtranslation
     * @param hitPointRadius The distance between the world origin (center of globe) and the initial drag hit point
     * @param ray The ray from the camera to the new cursor location
     * @param localToEcefResult The matrix to convert from local to ECEF space
     */
    private _recalculateDragPlaneHitPoint;
    /**
     * Updates the drag gesture by recalculating the intersection with the drag plane
     * and accumulating the resulting pan delta.
     * @param pointerX - Current screen X coordinate
     * @param pointerY - Current screen Y coordinate
     */
    handleDrag(pointerX: number, pointerY: number): void;
    /**
     * Consumes the per-frame accumulated pan/rotate/zoom deltas and applies them to the camera state,
     * with geospatial-specific dampening (e.g. slower panning near the poles, parallax-based pan compensation).
     * Called once per frame by the scene's render loop via `_checkInputs`.
     * @override
     */
    computeCurrentFrameDeltas(): void;
    /**
     * Returns true when a drag gesture is active (between startDrag and stopDrag).
     */
    get isDragging(): boolean;
    /**
     * Accumulates a zoom delta and determines the zoom target point via raycasting.
     * @param zoomDelta - Signed zoom amount (positive = zoom in, negative = zoom out)
     * @param toCursor - When true, zoom toward the point under the cursor; when false, zoom along the look vector
     */
    handleZoom(zoomDelta: number, toCursor: boolean): void;
    /**
     * Casts a ray from the camera position along the given direction and returns the pick result.
     * @param vector - World-space direction to cast along
     * @returns The pick result, or null if no hit
     */
    pickAlongVector(vector: Vector3): Nullable<PickingInfo>;
}
/** @internal */
export declare function ClampCenterFromPolesInPlace(center: Vector3): Vector3;
/**
 * Helper to build east/north/up basis vectors at a world position.
 * Cross product order is swapped based on handedness so that the east vector
 * encodes the coordinate-system convention, removing the need for a separate yawScale.
 * @param worldPos - The position on the globe
 * @param refEast - Receives the east direction
 * @param refNorth - Receives the north direction
 * @param refUp - Receives the up (outward) direction
 * @param useRightHandedSystem - Whether the scene uses a right-handed coordinate system (default: false)
 * @param calculateUpVectorFromPointToRef - Optional function to calculate the up vector from a point. If supplied, this function will be used instead of assuming a spherical geocentric normal, allowing support for non-spherical planets or custom up vector logic.
 * @internal
 */
export declare function ComputeLocalBasisToRefs(worldPos: Vector3, refEast: Vector3, refNorth: Vector3, refUp: Vector3, useRightHandedSystem?: boolean, calculateUpVectorFromPointToRef?: (point: Vector3, result: Vector3) => Vector3): void;
