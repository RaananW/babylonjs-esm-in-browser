import { Epsilon } from "../../Maths/math.constants.js";
import { Vector2 } from "../../Maths/math.vector.pure.js";
import { Clamp } from "../../Maths/math.scalar.functions.js";
/**
 * Limits for geospatial camera
 */
export class GeospatialLimits {
    /**
     * @param planetRadius The radius of the planet
     */
    constructor(planetRadius) {
        this._radiusMin = 10;
        this._radiusMax = Infinity;
        /** Gets the minimum pitch angle (angle from horizon) -- 0 means looking straight down at planet */
        this.pitchMin = Epsilon;
        /**  Gets the maximum pitch angle (angle from horizon) -- Pi/2 means looking at horizon */
        this.pitchMax = Math.PI / 2 - 0.01;
        /**
         * Controls how pitch is disabled as the camera zooms out.
         * x = radius scale at which full pitch is allowed (e.g., 1.5 means 1.5 * planetRadius)
         * y = radius scale at which pitch is fully disabled (forced to pitchMin)
         * Set to undefined to disable this feature.
         */
        this.pitchDisabledRadiusScale = new Vector2(2, 4);
        /** Gets the minimum yaw angle (rotation around up axis) */
        this.yawMin = -Infinity;
        /** Gets the maximum yaw angle (rotation around up axis) */
        this.yawMax = Infinity;
        this._planetRadius = planetRadius;
        this.radiusMax = planetRadius * 4;
    }
    get radiusMin() {
        return this._radiusMin;
    }
    /**
     * Sets the minimum radius
     */
    set radiusMin(value) {
        this._radiusMin = value;
    }
    get radiusMax() {
        return this._radiusMax;
    }
    /**
     * Sets the maximum radius
     */
    set radiusMax(value) {
        this._radiusMax = value;
    }
    /**
     * Gets the planet radius used for altitude/radius conversions
     */
    get planetRadius() {
        return this._planetRadius;
    }
    /** Sets the planet radius and updates the radius limits to maintain current altitude */
    set planetRadius(value) {
        this._planetRadius = value;
    }
    /**
     * Clamps a zoom distance to respect the radius limits.
     * @param zoomDistance The requested zoom distance (positive = zoom in, negative = zoom out)
     * @param currentRadius The current camera radius
     * @param distanceToTarget Optional distance to the zoom target point (used for zoom-in clamping)
     * @returns The clamped zoom distance
     */
    clampZoomDistance(zoomDistance, currentRadius, distanceToTarget) {
        if (zoomDistance > 0) {
            // Zooming IN - don't zoom past the surface or below radiusMin
            const maxZoomIn = (distanceToTarget ?? currentRadius) - this._radiusMin;
            return Math.min(zoomDistance, Math.max(0, maxZoomIn));
        }
        else {
            // Zooming OUT - don't exceed radiusMax
            const maxZoomOut = this._radiusMax - currentRadius;
            return Math.max(zoomDistance, -Math.max(0, maxZoomOut));
        }
    }
    /**
     * Computes the effective maximum pitch based on the current camera radius.
     * When pitchDisabledRadiusScale is set, pitch is interpolated from pitchMax to pitchMin
     * as the camera zooms out from x*planetRadius to y*planetRadius.
     * @param currentRadius The current camera radius
     * @returns The effective maximum pitch angle
     */
    getEffectivePitchMax(currentRadius) {
        if (!this.pitchDisabledRadiusScale) {
            return this.pitchMax;
        }
        const fullPitchRadius = this.pitchDisabledRadiusScale.x * this._planetRadius;
        const noPitchRadius = this.pitchDisabledRadiusScale.y * this._planetRadius;
        if (currentRadius <= fullPitchRadius) {
            // Full pitch allowed
            return this.pitchMax;
        }
        else if (currentRadius >= noPitchRadius) {
            // No pitch allowed
            return this.pitchMin;
        }
        else {
            // Interpolate between pitchMax and pitchMin
            const t = (currentRadius - fullPitchRadius) / (noPitchRadius - fullPitchRadius);
            const clampedT = Clamp(t, 0, 1);
            return this.pitchMax * (1 - clampedT) + this.pitchMin * clampedT;
        }
    }
}
//# sourceMappingURL=geospatialLimits.js.map