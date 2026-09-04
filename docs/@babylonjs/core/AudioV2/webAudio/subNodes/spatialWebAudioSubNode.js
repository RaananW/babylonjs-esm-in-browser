import { Matrix, Quaternion, Vector3 } from "../../../Maths/math.vector.pure.js";
import { _SpatialAudioSubNode } from "../../abstractAudio/subNodes/spatialAudioSubNode.js";
import { _SpatialAudioDefaults } from "../../abstractAudio/subProperties/abstractSpatialAudio.js";
import { _WebAudioParameterComponent } from "../components/webAudioParameterComponent.js";
const TmpMatrix = Matrix.Zero();
const TmpQuaternion = new Quaternion();
function D2r(degrees) {
    return (degrees * Math.PI) / 180;
}
function R2d(radians) {
    return (radians * 180) / Math.PI;
}
/** @internal */
// eslint-disable-next-line @typescript-eslint/require-await
export async function _CreateSpatialAudioSubNodeAsync(engine) {
    return new _SpatialWebAudioSubNode(engine);
}
/** @internal */
export class _SpatialWebAudioSubNode extends _SpatialAudioSubNode {
    /** @internal */
    constructor(engine) {
        super(engine);
        this._lastOrientation = Vector3.Zero();
        this._lastPosition = Vector3.Zero();
        this._lastRotation = Vector3.Zero();
        this._lastRotationQuaternion = new Quaternion();
        this._panningEnabled = _SpatialAudioDefaults.panningEnabled;
        /** @internal */
        this.orientation = _SpatialAudioDefaults.orientation.clone();
        /** @internal */
        this.position = _SpatialAudioDefaults.position.clone();
        /** @internal */
        this.rotation = _SpatialAudioDefaults.rotation.clone();
        /** @internal */
        this.rotationQuaternion = _SpatialAudioDefaults.rotationQuaternion.clone();
        this._inputNode = new GainNode(engine._audioContext);
        this._attenuationNode = new GainNode(engine._audioContext);
        this._attenuation = new _WebAudioParameterComponent(engine, this._attenuationNode.gain);
        this.node = new PannerNode(engine._audioContext);
        this._orientationX = new _WebAudioParameterComponent(engine, this.node.orientationX);
        this._orientationY = new _WebAudioParameterComponent(engine, this.node.orientationY);
        this._orientationZ = new _WebAudioParameterComponent(engine, this.node.orientationZ);
        this._positionX = new _WebAudioParameterComponent(engine, this.node.positionX);
        this._positionY = new _WebAudioParameterComponent(engine, this.node.positionY);
        this._positionZ = new _WebAudioParameterComponent(engine, this.node.positionZ);
        this._connectActiveInput();
    }
    /** @internal */
    dispose() {
        super.dispose();
        this._attenuation.dispose();
        this._orientationX.dispose();
        this._orientationY.dispose();
        this._orientationZ.dispose();
        this._positionX.dispose();
        this._positionY.dispose();
        this._positionZ.dispose();
        this._inputNode.disconnect();
        this._attenuationNode.disconnect();
        this.node.disconnect();
    }
    /** @internal */
    get coneInnerAngle() {
        return D2r(this.node.coneInnerAngle);
    }
    set coneInnerAngle(value) {
        this.node.coneInnerAngle = R2d(value);
    }
    /** @internal */
    get coneOuterAngle() {
        return D2r(this.node.coneOuterAngle);
    }
    set coneOuterAngle(value) {
        this.node.coneOuterAngle = R2d(value);
    }
    /** @internal */
    get coneOuterVolume() {
        return this.node.coneOuterGain;
    }
    set coneOuterVolume(value) {
        this.node.coneOuterGain = value;
    }
    /** @internal */
    get distanceModel() {
        return this.node.distanceModel;
    }
    set distanceModel(value) {
        this.node.distanceModel = value;
        // Wiggle the max distance to make the change take effect.
        const maxDistance = this.node.maxDistance;
        this.node.maxDistance = maxDistance + 0.001;
        this.node.maxDistance = maxDistance;
        this._updateAttenuation();
    }
    /** @internal */
    get minDistance() {
        return this.node.refDistance;
    }
    set minDistance(value) {
        this.node.refDistance = value;
        this._updateAttenuation();
    }
    /** @internal */
    get maxDistance() {
        return this.node.maxDistance;
    }
    set maxDistance(value) {
        this.node.maxDistance = value;
        this._updateAttenuation();
    }
    /** @internal */
    get panningEnabled() {
        return this._panningEnabled;
    }
    set panningEnabled(value) {
        if (this._panningEnabled === value) {
            return;
        }
        this._panningEnabled = value;
        this._connectActiveInput();
        this._updateAttenuation();
    }
    /** @internal */
    get panningModel() {
        return this.node.panningModel;
    }
    set panningModel(value) {
        this.node.panningModel = value;
    }
    /** @internal */
    get rolloffFactor() {
        return this.node.rolloffFactor;
    }
    set rolloffFactor(value) {
        this.node.rolloffFactor = value;
        this._updateAttenuation();
    }
    /** @internal */
    get _inNode() {
        return this._inputNode;
    }
    /** @internal */
    get _outNode() {
        return this._panningEnabled ? this.node : this._attenuationNode;
    }
    /** @internal */
    _updatePosition() {
        if (this._lastPosition.equalsWithEpsilon(this.position)) {
            this._updateAttenuation();
            return;
        }
        this._positionX.targetValue = this.position.x;
        this._positionY.targetValue = this.position.y;
        this._positionZ.targetValue = this.position.z;
        this._lastPosition.copyFrom(this.position);
        this._updateAttenuation();
    }
    /** @internal */
    _updateRotation() {
        let rotated = false;
        if (!this._lastRotationQuaternion.equalsWithEpsilon(this.rotationQuaternion)) {
            TmpQuaternion.copyFrom(this.rotationQuaternion);
            this._lastRotationQuaternion.copyFrom(this.rotationQuaternion);
            rotated = true;
        }
        else if (!this._lastRotation.equalsWithEpsilon(this.rotation)) {
            Quaternion.FromEulerAnglesToRef(this.rotation.x, this.rotation.y, this.rotation.z, TmpQuaternion);
            this._lastRotation.copyFrom(this.rotation);
            rotated = true;
        }
        else if (this._lastOrientation.equalsWithEpsilon(this.orientation)) {
            return;
        }
        if (rotated) {
            Matrix.FromQuaternionToRef(TmpQuaternion, TmpMatrix);
            Vector3.TransformNormalToRef(Vector3.RightReadOnly, TmpMatrix, this.orientation);
        }
        this._orientationX.targetValue = this.orientation.x;
        this._orientationY.targetValue = this.orientation.y;
        this._orientationZ.targetValue = this.orientation.z;
    }
    _connect(node) {
        const connected = super._connect(node);
        if (!connected) {
            return false;
        }
        // If the wrapped node is not available now, it will be connected later by the subgraph.
        if (node._inNode) {
            this.node.connect(node._inNode);
            this._attenuationNode.connect(node._inNode);
        }
        return true;
    }
    _disconnect(node) {
        const disconnected = super._disconnect(node);
        if (!disconnected) {
            return false;
        }
        if (node._inNode) {
            this.node.disconnect(node._inNode);
            this._attenuationNode.disconnect(node._inNode);
        }
        return true;
    }
    /** @internal */
    getClassName() {
        return "_SpatialWebAudioSubNode";
    }
    _connectActiveInput() {
        this._inputNode.disconnect();
        if (this._panningEnabled) {
            this._inputNode.connect(this.node);
        }
        else {
            this._inputNode.connect(this._attenuationNode);
        }
    }
    _updateAttenuation() {
        if (this._panningEnabled) {
            this._attenuation.targetValue = 1;
            return;
        }
        const listenerPosition = this.engine.listener.position;
        const deltaX = this.position.x - listenerPosition.x;
        const deltaY = this.position.y - listenerPosition.y;
        const deltaZ = this.position.z - listenerPosition.z;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY + deltaZ * deltaZ);
        const minDistance = Math.max(this.minDistance, 0);
        let attenuation = 1;
        switch (this.distanceModel) {
            case "linear":
                {
                    const maxDistance = Math.max(this.maxDistance, minDistance);
                    const clampedDistance = Math.min(Math.max(distance, minDistance), maxDistance);
                    attenuation =
                        maxDistance === minDistance ? (distance <= minDistance ? 1 : 0) : 1 - (this.rolloffFactor * (clampedDistance - minDistance)) / (maxDistance - minDistance);
                }
                break;
            case "inverse":
                if (minDistance === 0) {
                    attenuation = 0;
                    break;
                }
                attenuation = minDistance / (minDistance + this.rolloffFactor * (Math.max(distance, minDistance) - minDistance));
                break;
            case "exponential":
                if (minDistance === 0) {
                    attenuation = 0;
                    break;
                }
                attenuation = Math.pow(Math.max(distance, minDistance) / minDistance, -this.rolloffFactor);
                break;
        }
        this._attenuation.targetValue = Math.min(Math.max(attenuation, 0), 1);
    }
}
//# sourceMappingURL=spatialWebAudioSubNode.js.map