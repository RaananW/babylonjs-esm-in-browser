import { _SpatialAudioAttacherComponent } from "../components/spatialAudioAttacherComponent.js";
import { _SpatialAudioDefaults } from "../subProperties/abstractSpatialAudio.js";
import { _AbstractAudioSubNode } from "./abstractAudioSubNode.js";
/** @internal */
export class _SpatialAudioSubNode extends _AbstractAudioSubNode {
    constructor(engine) {
        super("Spatial" /* AudioSubNode.SPATIAL */, engine);
        this._attacherComponent = null;
    }
    /** @internal */
    get isAttached() {
        return this._attacherComponent !== null && this._attacherComponent.isAttached;
    }
    /** @internal */
    get attachedNode() {
        return this._attacherComponent?.sceneNode ?? null;
    }
    /** @internal */
    get useBoundingBox() {
        return this._attacherComponent?.useBoundingBox ?? false;
    }
    /** @internal */
    get attachmentType() {
        return this._attacherComponent?.attachmentType ?? 3 /* SpatialAudioAttachmentType.PositionAndRotation */;
    }
    /** @internal */
    attach(sceneNode, useBoundingBox, attachmentType) {
        this.detach();
        if (!this._attacherComponent) {
            this._attacherComponent = new _SpatialAudioAttacherComponent(this);
        }
        this._attacherComponent.attach(sceneNode, useBoundingBox, attachmentType);
    }
    /** @internal */
    detach() {
        this._attacherComponent?.detach();
    }
    /** @internal */
    dispose() {
        super.dispose();
        this._attacherComponent?.dispose();
        this._attacherComponent = null;
    }
    /** @internal */
    setOptions(options) {
        this.coneInnerAngle = options.spatialConeInnerAngle ?? _SpatialAudioDefaults.coneInnerAngle;
        this.coneOuterAngle = options.spatialConeOuterAngle ?? _SpatialAudioDefaults.coneOuterAngle;
        this.coneOuterVolume = options.spatialConeOuterVolume ?? _SpatialAudioDefaults.coneOuterVolume;
        this.distanceModel = options.spatialDistanceModel ?? _SpatialAudioDefaults.distanceModel;
        this.maxDistance = options.spatialMaxDistance ?? _SpatialAudioDefaults.maxDistance;
        this.minDistance = options.spatialMinDistance ?? _SpatialAudioDefaults.minDistance;
        this.orientation = options.spatialOrientation ?? _SpatialAudioDefaults.orientation;
        this.panningEnabled = options.spatialPanningEnabled ?? _SpatialAudioDefaults.panningEnabled;
        this.panningModel = options.spatialPanningModel ?? _SpatialAudioDefaults.panningModel;
        this.rolloffFactor = options.spatialRolloffFactor ?? _SpatialAudioDefaults.rolloffFactor;
        if (options.spatialPosition) {
            this.position = options.spatialPosition.clone();
        }
        if (options.spatialRotationQuaternion) {
            this.rotationQuaternion = options.spatialRotationQuaternion.clone();
        }
        else if (options.spatialRotation) {
            this.rotation = options.spatialRotation.clone();
        }
        else {
            this.rotationQuaternion = _SpatialAudioDefaults.rotationQuaternion.clone();
        }
        this.update();
    }
    /** @internal */
    update() {
        if (this.isAttached) {
            this._attacherComponent?.update();
        }
        else {
            this._updatePosition();
            this._updateRotation();
        }
    }
}
/** @internal */
export function _GetSpatialAudioSubNode(subGraph) {
    return subGraph.getSubNode("Spatial" /* AudioSubNode.SPATIAL */);
}
/** @internal */
export function _SetSpatialAudioProperty(subGraph, property, value) {
    subGraph.callOnSubNode("Spatial" /* AudioSubNode.SPATIAL */, (node) => {
        node[property] = value;
    });
}
//# sourceMappingURL=spatialAudioSubNode.js.map