/**
 * The GeospatialClippingBehavior automatically adjusts the near and far clip planes of a GeospatialCamera
 * based on altitude to optimize depth buffer precision for geospatial applications.
 *
 * The near plane scales with altitude (distance to planet surface) to maintain good depth precision.
 * The far plane is calculated based on the visible horizon distance.
 */
export class GeospatialClippingBehavior {
    constructor() {
        this._attachedCamera = null;
        this._onBeforeRenderObserver = null;
    }
    /**
     * Gets the name of the behavior.
     */
    get name() {
        return "GeospatialClipping";
    }
    /**
     * Gets the attached camera.
     */
    get attachedNode() {
        return this._attachedCamera;
    }
    /**
     * Initializes the behavior.
     */
    init() {
        // Do nothing
    }
    /**
     * Attaches the behavior to its geospatial camera.
     * @param camera Defines the camera to attach the behavior to
     */
    attach(camera) {
        this._attachedCamera = camera;
        const scene = camera.getScene();
        this._onBeforeRenderObserver = scene.onBeforeRenderObservable.add(() => {
            this._updateCameraClipPlanes();
        });
    }
    /**
     * Detaches the behavior from its current geospatial camera.
     */
    detach() {
        if (this._attachedCamera) {
            const scene = this._attachedCamera.getScene();
            if (this._onBeforeRenderObserver) {
                scene.onBeforeRenderObservable.remove(this._onBeforeRenderObserver);
                this._onBeforeRenderObserver = null;
            }
        }
        this._attachedCamera = null;
    }
    /**
     * Updates the camera's near and far clip planes based on altitude.
     */
    _updateCameraClipPlanes() {
        const camera = this._attachedCamera;
        if (!camera) {
            return;
        }
        const planetRadius = camera.limits.planetRadius;
        // Camera position length gives distance to world origin (planet center)
        const altitude = Math.max(1, camera.position.length() - planetRadius);
        // Near plane: scale with altitude to maintain depth buffer precision
        // Use a fraction of altitude - the closest visible point on a sphere is straight down at distance = altitude
        camera.minZ = Math.max(1, altitude * 0.001);
        // Far plane: see to the horizon and beyond
        // Horizon distance formula: √(2Rh + h²) where h is altitude above surface
        const horizonDist = Math.sqrt(2 * planetRadius * altitude + altitude * altitude);
        camera.maxZ = horizonDist + planetRadius * 0.1;
    }
}
//# sourceMappingURL=geospatialClippingBehavior.js.map