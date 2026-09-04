import { _GetSpatialAudioSubNode, _SetSpatialAudioProperty } from "../subNodes/spatialAudioSubNode.js";
import { _SpatialAudioDefaults, AbstractSpatialAudio } from "./abstractSpatialAudio.js";
/** @internal */
export class _SpatialAudio extends AbstractSpatialAudio {
    /** @internal */
    constructor(subGraph) {
        super();
        this._coneInnerAngle = _SpatialAudioDefaults.coneInnerAngle;
        this._coneOuterAngle = _SpatialAudioDefaults.coneOuterAngle;
        this._coneOuterVolume = _SpatialAudioDefaults.coneOuterVolume;
        this._distanceModel = _SpatialAudioDefaults.distanceModel;
        this._maxDistance = _SpatialAudioDefaults.maxDistance;
        this._minDistance = _SpatialAudioDefaults.minDistance;
        this._panningEnabled = _SpatialAudioDefaults.panningEnabled;
        this._panningModel = _SpatialAudioDefaults.panningModel;
        this._rolloffFactor = _SpatialAudioDefaults.rolloffFactor;
        const subNode = _GetSpatialAudioSubNode(subGraph);
        if (subNode) {
            this._orientation = subNode.orientation.clone();
            this._panningEnabled = subNode.panningEnabled;
            this._position = subNode.position.clone();
            this._rotation = subNode.rotation.clone();
            this._rotationQuaternion = subNode.rotationQuaternion.clone();
        }
        else {
            this._orientation = _SpatialAudioDefaults.orientation.clone();
            this._position = _SpatialAudioDefaults.position.clone();
            this._rotation = _SpatialAudioDefaults.rotation.clone();
            this._rotationQuaternion = _SpatialAudioDefaults.rotationQuaternion.clone();
            // eslint-disable-next-line @typescript-eslint/no-floating-promises
            subGraph.createAndAddSubNodeAsync("Spatial" /* AudioSubNode.SPATIAL */);
        }
        this._subGraph = subGraph;
    }
    /** @internal */
    dispose() {
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        this._subGraph.removeSubNodeAsync(_GetSpatialAudioSubNode(this._subGraph));
    }
    /** @internal */
    get coneInnerAngle() {
        return this._coneInnerAngle;
    }
    set coneInnerAngle(value) {
        this._coneInnerAngle = value;
        _SetSpatialAudioProperty(this._subGraph, "coneInnerAngle", value);
    }
    /** @internal */
    get coneOuterAngle() {
        return this._coneOuterAngle;
    }
    set coneOuterAngle(value) {
        this._coneOuterAngle = value;
        _SetSpatialAudioProperty(this._subGraph, "coneOuterAngle", value);
    }
    /** @internal */
    get coneOuterVolume() {
        return this._coneOuterVolume;
    }
    set coneOuterVolume(value) {
        this._coneOuterVolume = value;
        _SetSpatialAudioProperty(this._subGraph, "coneOuterVolume", value);
    }
    /** @internal */
    get distanceModel() {
        return this._distanceModel;
    }
    set distanceModel(value) {
        this._distanceModel = value;
        _SetSpatialAudioProperty(this._subGraph, "distanceModel", value);
    }
    /** @internal */
    get isAttached() {
        return this._subGraph.getSubNode("Spatial" /* AudioSubNode.SPATIAL */)?.isAttached ?? false;
    }
    /** @internal */
    get attachedNode() {
        return this._subGraph.getSubNode("Spatial" /* AudioSubNode.SPATIAL */)?.attachedNode ?? null;
    }
    /** @internal */
    get useBoundingBox() {
        return this._subGraph.getSubNode("Spatial" /* AudioSubNode.SPATIAL */)?.useBoundingBox ?? false;
    }
    /** @internal */
    get attachmentType() {
        return this._subGraph.getSubNode("Spatial" /* AudioSubNode.SPATIAL */)?.attachmentType ?? 3 /* SpatialAudioAttachmentType.PositionAndRotation */;
    }
    /** @internal */
    get maxDistance() {
        return this._maxDistance;
    }
    set maxDistance(value) {
        if (value <= 0) {
            value = 0.000001;
        }
        this._maxDistance = value;
        _SetSpatialAudioProperty(this._subGraph, "maxDistance", value);
    }
    /** @internal */
    get minDistance() {
        return this._minDistance;
    }
    set minDistance(value) {
        this._minDistance = value;
        _SetSpatialAudioProperty(this._subGraph, "minDistance", value);
    }
    /** @internal */
    get orientation() {
        return this._orientation;
    }
    set orientation(value) {
        this._orientation = value;
        this._updateRotation();
    }
    /** @internal */
    get panningEnabled() {
        return this._panningEnabled;
    }
    set panningEnabled(value) {
        this._panningEnabled = value;
        _SetSpatialAudioProperty(this._subGraph, "panningEnabled", value);
    }
    /** @internal */
    get panningModel() {
        return this._panningModel;
    }
    set panningModel(value) {
        this._panningModel = value;
        _SetSpatialAudioProperty(this._subGraph, "panningModel", value);
    }
    /** @internal */
    get position() {
        return this._position;
    }
    set position(value) {
        this._position = value;
        this._updatePosition();
    }
    /** @internal */
    get rolloffFactor() {
        return this._rolloffFactor;
    }
    set rolloffFactor(value) {
        this._rolloffFactor = value;
        _SetSpatialAudioProperty(this._subGraph, "rolloffFactor", value);
    }
    /** @internal */
    get rotation() {
        return this._rotation;
    }
    set rotation(value) {
        this._rotation = value;
        this._updateRotation();
    }
    /** @internal */
    get rotationQuaternion() {
        return this._rotationQuaternion;
    }
    set rotationQuaternion(value) {
        this._rotationQuaternion = value;
        this._updateRotation();
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
        _GetSpatialAudioSubNode(this._subGraph)?.attach(sceneNode, useBoundingBox, attachmentType);
    }
    /**
     * Detaches from the scene node if attached.
     */
    detach() {
        _GetSpatialAudioSubNode(this._subGraph)?.detach();
    }
    /** @internal */
    update() {
        const subNode = _GetSpatialAudioSubNode(this._subGraph);
        if (!subNode) {
            return;
        }
        if (subNode.isAttached) {
            subNode.update();
        }
        else {
            this._updatePosition(subNode);
            this._updateRotation(subNode);
        }
    }
    _updatePosition(subNode = null) {
        if (!subNode) {
            subNode = _GetSpatialAudioSubNode(this._subGraph);
            if (!subNode) {
                return;
            }
        }
        const position = subNode.position;
        if (!position.equalsWithEpsilon(this._position)) {
            subNode.position.copyFrom(this._position);
            subNode._updatePosition();
        }
        else if (!subNode.panningEnabled) {
            subNode._updatePosition();
        }
    }
    _updateRotation(subNode = null) {
        if (!subNode) {
            subNode = _GetSpatialAudioSubNode(this._subGraph);
            if (!subNode) {
                return;
            }
        }
        if (!subNode.rotationQuaternion.equalsWithEpsilon(this._rotationQuaternion)) {
            subNode.rotationQuaternion.copyFrom(this._rotationQuaternion);
            subNode._updateRotation();
            this._orientation.copyFrom(subNode.orientation);
            this._rotation.copyFrom(subNode.rotation);
        }
        else if (!subNode.rotation.equalsWithEpsilon(this._rotation)) {
            subNode.rotation.copyFrom(this._rotation);
            subNode._updateRotation();
            this._orientation.copyFrom(subNode.orientation);
            this._rotationQuaternion.copyFrom(subNode.rotationQuaternion);
        }
        else if (!subNode.orientation.equalsWithEpsilon(this._orientation)) {
            subNode.orientation.copyFrom(this._orientation);
            subNode._updateRotation();
            this._rotation.copyFrom(subNode.rotation);
            this._rotationQuaternion.copyFrom(subNode.rotationQuaternion);
        }
    }
}
//# sourceMappingURL=spatialAudio.js.map