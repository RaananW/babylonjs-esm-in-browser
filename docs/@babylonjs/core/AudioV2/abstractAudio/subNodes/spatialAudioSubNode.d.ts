import { type Quaternion, type Vector3 } from "../../../Maths/math.vector.js";
import { type Node } from "../../../node.js";
import { type Nullable } from "../../../types.js";
import { SpatialAudioAttachmentType } from "../../spatialAudioAttachmentType.js";
import { type AudioEngineV2 } from "../audioEngineV2.js";
import { type ISpatialAudioOptions, _SpatialAudioDefaults } from "../subProperties/abstractSpatialAudio.js";
import { type _AbstractAudioSubGraph } from "./abstractAudioSubGraph.js";
import { _AbstractAudioSubNode } from "./abstractAudioSubNode.js";
/** @internal */
export declare abstract class _SpatialAudioSubNode extends _AbstractAudioSubNode {
    private _attacherComponent;
    protected constructor(engine: AudioEngineV2);
    abstract coneInnerAngle: number;
    abstract coneOuterAngle: number;
    abstract coneOuterVolume: number;
    abstract distanceModel: DistanceModelType;
    abstract maxDistance: number;
    abstract minDistance: number;
    abstract orientation: Vector3;
    abstract panningEnabled: boolean;
    abstract panningModel: PanningModelType;
    abstract position: Vector3;
    abstract rolloffFactor: number;
    abstract rotation: Vector3;
    abstract rotationQuaternion: Quaternion;
    abstract _inNode: AudioNode;
    /** @internal */
    get isAttached(): boolean;
    /** @internal */
    get attachedNode(): Nullable<Node>;
    /** @internal */
    get useBoundingBox(): boolean;
    /** @internal */
    get attachmentType(): SpatialAudioAttachmentType;
    /** @internal */
    attach(sceneNode: Nullable<Node>, useBoundingBox: boolean, attachmentType: SpatialAudioAttachmentType): void;
    /** @internal */
    detach(): void;
    /** @internal */
    dispose(): void;
    /** @internal */
    setOptions(options: Partial<ISpatialAudioOptions>): void;
    /** @internal */
    update(): void;
    abstract _updatePosition(): void;
    abstract _updateRotation(): void;
}
/** @internal */
export declare function _GetSpatialAudioSubNode(subGraph: _AbstractAudioSubGraph): Nullable<_SpatialAudioSubNode>;
/** @internal */
export declare function _SetSpatialAudioProperty<K extends keyof typeof _SpatialAudioDefaults>(subGraph: _AbstractAudioSubGraph, property: K, value: _SpatialAudioSubNode[K]): void;
