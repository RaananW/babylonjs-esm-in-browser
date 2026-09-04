import { Quaternion, Vector3 } from "../../../Maths/math.vector.pure.js";
/**
 * Provides a common interface for attaching an audio listener or source to a specific entity, ensuring only one entity
 * is attached at a time.
 * @internal
 */
export class _SpatialAudioAttacherComponent {
    /** @internal */
    constructor(spatialAudioNode) {
        /** @internal */
        this._attachmentType = 3 /* SpatialAudioAttachmentType.PositionAndRotation */;
        this._position = new Vector3();
        this._rotationQuaternion = new Quaternion();
        this._sceneNode = null;
        this._useBoundingBox = false;
        /**
         * Releases associated resources.
         */
        this.dispose = () => {
            this.detach();
        };
        this._spatialAudioNode = spatialAudioNode;
    }
    /**
     * Returns `true` if attached to a scene node; otherwise returns `false`.
     */
    get isAttached() {
        return this._sceneNode !== null;
    }
    /**
     * The scene node this attacher is currently attached to, or `null` if not attached.
     */
    get sceneNode() {
        return this._sceneNode;
    }
    /**
     * Whether the attacher is using the scene node's bounding box for positioning.
     */
    get useBoundingBox() {
        return this._useBoundingBox;
    }
    /**
     * Which components (position, rotation, or both) of the scene node's world transform drive the spatial audio.
     */
    get attachmentType() {
        return this._attachmentType;
    }
    /**
     * Attaches to a scene node.
     *
     * Detaches automatically before attaching to the given scene node.
     * If `sceneNode` is `null` it is the same as calling `detach()`.
     *
     * @param sceneNode The scene node to attach to, or `null` to detach.
     * @param useBoundingBox Whether to use the scene node's bounding box for positioning. Defaults to `false`.
     * @param attachmentType Whether to attach to the scene node's position and/or rotation. Defaults to `PositionAndRotation`.
     */
    attach(sceneNode, useBoundingBox, attachmentType) {
        if (this._sceneNode === sceneNode) {
            return;
        }
        this.detach();
        if (!sceneNode) {
            return;
        }
        this._attachmentType = attachmentType;
        this._sceneNode = sceneNode;
        this._sceneNode.onDisposeObservable.add(this.dispose);
        this._useBoundingBox = useBoundingBox;
    }
    /**
     * Detaches from the scene node if attached.
     */
    detach() {
        this._sceneNode?.onDisposeObservable.removeCallback(this.dispose);
        this._sceneNode = null;
    }
    /**
     * Updates the position and rotation of the associated audio engine object in the audio rendering graph.
     *
     * This is called automatically by default and only needs to be called manually if automatic updates are disabled.
     */
    update() {
        const updatesPosition = !!(this._attachmentType & 1 /* SpatialAudioAttachmentType.Position */);
        if (updatesPosition) {
            if (this._useBoundingBox && this._sceneNode.getBoundingInfo) {
                this._position.copyFrom(this._sceneNode.getBoundingInfo().boundingBox.centerWorld);
            }
            else {
                this._sceneNode?.getWorldMatrix().getTranslationToRef(this._position);
            }
            this._spatialAudioNode.position.copyFrom(this._position);
            this._spatialAudioNode._updatePosition();
        }
        if (this._attachmentType & 2 /* SpatialAudioAttachmentType.Rotation */) {
            this._sceneNode?.getWorldMatrix().decompose(undefined, this._rotationQuaternion);
            this._spatialAudioNode.rotationQuaternion.copyFrom(this._rotationQuaternion);
            this._spatialAudioNode._updateRotation();
        }
        if (!updatesPosition && "panningEnabled" in this._spatialAudioNode && !this._spatialAudioNode.panningEnabled) {
            this._spatialAudioNode._updatePosition();
        }
    }
}
//# sourceMappingURL=spatialAudioAttacherComponent.js.map