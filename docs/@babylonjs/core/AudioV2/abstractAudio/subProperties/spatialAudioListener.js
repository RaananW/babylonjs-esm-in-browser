import { _SpatialAudioAttacherComponent } from "../components/spatialAudioAttacherComponent.js";
import { _SpatialAudioListenerDefaults, AbstractSpatialAudioListener } from "./abstractSpatialAudioListener.js";
/** @internal */
export class _SpatialAudioListener extends AbstractSpatialAudioListener {
    constructor() {
        super();
        this._attacherComponent = null;
        this._attacherComponent = new _SpatialAudioAttacherComponent(this);
    }
    /** @internal */
    get isAttached() {
        return this._attacherComponent !== null && this._attacherComponent.isAttached;
    }
    /** @internal */
    get attachedNode() {
        return this._attacherComponent?.sceneNode ?? null;
    }
    /**
     * Attaches to a scene node.
     *
     * Detaches automatically before attaching to the given scene node.
     * If `sceneNode` is `null` it is the same as calling `detach()`.
     *
     * @param sceneNode The scene node to attach to, or `null` to detach.
     * @param useBoundingBox Whether to use the bounding box of the node for positioning. Defaults to `false`.
     * @param attachmentType Whether to attach to the node's position and/or rotation. Defaults to `PositionAndRotation`.
     */
    attach(sceneNode, useBoundingBox = false, attachmentType = 3 /* SpatialAudioAttachmentType.PositionAndRotation */) {
        if (!this._attacherComponent) {
            this._attacherComponent = new _SpatialAudioAttacherComponent(this);
        }
        this._attacherComponent.attach(sceneNode, useBoundingBox, attachmentType);
    }
    /**
     * Detaches from the scene node if attached.
     */
    detach() {
        this._attacherComponent?.detach();
    }
    /** @internal */
    dispose() {
        this._attacherComponent?.dispose();
        this._attacherComponent = null;
    }
    /** @internal */
    setOptions(options) {
        if (options.listenerMinUpdateTime !== undefined) {
            this.minUpdateTime = options.listenerMinUpdateTime;
        }
        if (options.listenerPosition) {
            this.position = options.listenerPosition.clone();
        }
        if (options.listenerRotationQuaternion) {
            this.rotationQuaternion = options.listenerRotationQuaternion.clone();
        }
        else if (options.listenerRotation) {
            this.rotation = options.listenerRotation.clone();
        }
        else {
            this.rotationQuaternion = _SpatialAudioListenerDefaults.rotationQuaternion.clone();
        }
        this.update();
    }
}
//# sourceMappingURL=spatialAudioListener.js.map