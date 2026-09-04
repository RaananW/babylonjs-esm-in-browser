import { Vector2 } from "../../Maths/math.vector.pure.js";
/**
 * Limits for geospatial camera
 */
export declare class GeospatialLimits {
    private _planetRadius;
    private _radiusMin;
    private _radiusMax;
    /** Gets the minimum pitch angle (angle from horizon) -- 0 means looking straight down at planet */
    pitchMin: number;
    /**  Gets the maximum pitch angle (angle from horizon) -- Pi/2 means looking at horizon */
    pitchMax: number;
    /**
     * Controls how pitch is disabled as the camera zooms out.
     * x = radius scale at which full pitch is allowed (e.g., 1.5 means 1.5 * planetRadius)
     * y = radius scale at which pitch is fully disabled (forced to pitchMin)
     * Set to undefined to disable this feature.
     */
    pitchDisabledRadiusScale?: Vector2;
    /** Gets the minimum yaw angle (rotation around up axis) */
    yawMin: number;
    /** Gets the maximum yaw angle (rotation around up axis) */
    yawMax: number;
    /**
     * @param planetRadius The radius of the planet
     */
    constructor(planetRadius: number);
    get radiusMin(): number;
    /**
     * Sets the minimum radius
     */
    set radiusMin(value: number);
    get radiusMax(): number;
    /**
     * Sets the maximum radius
     */
    set radiusMax(value: number);
    /**
     * Gets the planet radius used for altitude/radius conversions
     */
    get planetRadius(): number;
    /** Sets the planet radius and updates the radius limits to maintain current altitude */
    set planetRadius(value: number);
    /**
     * Clamps a zoom distance to respect the radius limits.
     * @param zoomDistance The requested zoom distance (positive = zoom in, negative = zoom out)
     * @param currentRadius The current camera radius
     * @param distanceToTarget Optional distance to the zoom target point (used for zoom-in clamping)
     * @returns The clamped zoom distance
     */
    clampZoomDistance(zoomDistance: number, currentRadius: number, distanceToTarget?: number): number;
    /**
     * Computes the effective maximum pitch based on the current camera radius.
     * When pitchDisabledRadiusScale is set, pitch is interpolated from pitchMax to pitchMin
     * as the camera zooms out from x*planetRadius to y*planetRadius.
     * @param currentRadius The current camera radius
     * @returns The effective maximum pitch angle
     */
    getEffectivePitchMax(currentRadius: number): number;
}
