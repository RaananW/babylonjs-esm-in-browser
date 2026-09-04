import { type Behavior } from "../../Behaviors/behavior.js";
import { type GeospatialCamera } from "../../Cameras/geospatialCamera.js";
import { type Nullable } from "../../types.js";
/**
 * The GeospatialClippingBehavior automatically adjusts the near and far clip planes of a GeospatialCamera
 * based on altitude to optimize depth buffer precision for geospatial applications.
 *
 * The near plane scales with altitude (distance to planet surface) to maintain good depth precision.
 * The far plane is calculated based on the visible horizon distance.
 */
export declare class GeospatialClippingBehavior implements Behavior<GeospatialCamera> {
    /**
     * Gets the name of the behavior.
     */
    get name(): string;
    private _attachedCamera;
    private _onBeforeRenderObserver;
    /**
     * Gets the attached camera.
     */
    get attachedNode(): Nullable<GeospatialCamera>;
    /**
     * Initializes the behavior.
     */
    init(): void;
    /**
     * Attaches the behavior to its geospatial camera.
     * @param camera Defines the camera to attach the behavior to
     */
    attach(camera: GeospatialCamera): void;
    /**
     * Detaches the behavior from its current geospatial camera.
     */
    detach(): void;
    /**
     * Updates the camera's near and far clip planes based on altitude.
     */
    private _updateCameraClipPlanes;
}
