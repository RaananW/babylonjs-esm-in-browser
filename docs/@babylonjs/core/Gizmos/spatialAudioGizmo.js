import { Quaternion, TmpVectors } from "../Maths/math.vector.pure.js";
import { Color3 } from "../Maths/math.color.pure.js";
import { Mesh } from "../Meshes/mesh.pure.js";
import { Gizmo } from "./gizmo.js";
import { UtilityLayerRenderer } from "../Rendering/utilityLayerRenderer.js";
import { StandardMaterial } from "../Materials/standardMaterial.pure.js";
import { CreateCylinder } from "../Meshes/Builders/cylinderBuilder.pure.js";
import { CreateSphere } from "../Meshes/Builders/sphereBuilder.pure.js";
import { PointerEventTypes } from "../Events/pointerEvents.js";
import { Observable } from "../Misc/observable.js";
/**
 * Gizmo that visualizes the position and orientation of a v2 spatial sound source.
 */
export class SpatialAudioGizmo extends Gizmo {
    /**
     * Creates a SpatialAudioGizmo.
     * @param gizmoLayer The utility layer the gizmo will be added to.
     */
    constructor(gizmoLayer = UtilityLayerRenderer.DefaultUtilityLayer) {
        super(gizmoLayer);
        this._soundSource = null;
        this._pointerObserver = null;
        /** Event that fires each time the gizmo is clicked. */
        this.onClickedObservable = new Observable();
        const utilityScene = this.gizmoLayer.utilityLayerScene;
        // Parent under _rootMesh so super.dispose() — which only disposes _rootMesh —
        // also tears down our attachedMesh and avoids leaking it in the utility layer scene.
        this.attachedMesh = new Mesh("spatialAudioGizmo", utilityScene);
        this.attachedMesh.parent = this._rootMesh;
        this._material = new StandardMaterial("spatialAudio", utilityScene);
        this._material.diffuseColor = new Color3(0.5, 0.5, 0.5);
        this._material.specularColor = new Color3(0.1, 0.1, 0.1);
        this._audioMesh = SpatialAudioGizmo._CreateSpeakerMesh(utilityScene);
        this._audioMesh.parent = this._rootMesh;
        for (const child of this._audioMesh.getChildMeshes(false)) {
            child.material = this._material;
        }
        const gizmoLight = this.gizmoLayer._getSharedGizmoLight();
        gizmoLight.includedOnlyMeshes = gizmoLight.includedOnlyMeshes.concat(this._audioMesh.getChildMeshes(false));
        this._pointerObserver = utilityScene.onPointerObservable.add((pointerInfo) => {
            if (!this._soundSource) {
                return;
            }
            const picked = pointerInfo.pickInfo?.pickedMesh;
            this._isHovered = !!picked && this._rootMesh.getChildMeshes().indexOf(picked) !== -1;
            if (this._isHovered && pointerInfo.type === PointerEventTypes.POINTERDOWN && pointerInfo.event.button === 0) {
                this.onClickedObservable.notifyObservers(this._soundSource);
            }
        });
    }
    /**
     * The sound source the gizmo is attached to.
     */
    get soundSource() {
        return this._soundSource;
    }
    set soundSource(soundSource) {
        var _a;
        this._soundSource = soundSource;
        if (soundSource && this.attachedMesh) {
            if (!this.attachedMesh.reservedDataStore) {
                this.attachedMesh.reservedDataStore = {};
            }
            this.attachedMesh.reservedDataStore.spatialAudioGizmo = this;
            (_a = this.attachedMesh).rotationQuaternion ?? (_a.rotationQuaternion = new Quaternion());
            this._update();
        }
    }
    /**
     * Gets the material used to render the gizmo.
     */
    get material() {
        return this._material;
    }
    /**
     * @internal
     * Mirrors the attached mesh to the sound source's spatial position and rotation.
     */
    _update() {
        super._update();
        const source = this._soundSource;
        const attachedMesh = this.attachedMesh;
        if (!source || !attachedMesh || !source._isSpatial) {
            return;
        }
        attachedMesh.rotationQuaternion ?? (attachedMesh.rotationQuaternion = new Quaternion());
        // When the sound is attached to a scene node, the actual world transform is on the node;
        // the spatial facade only caches the most recent user-set position/rotation. Decompose
        // the node's world matrix directly so the gizmo tracks movement of the attached entity,
        // and honor the spatial sub-property's attachment options (useBoundingBox, attachmentType).
        const spatial = source.spatial;
        const attachedNode = spatial.attachedNode;
        if (attachedNode) {
            const worldRotation = TmpVectors.Quaternion[0];
            const worldPosition = TmpVectors.Vector3[0];
            attachedNode.getWorldMatrix().decompose(undefined, worldRotation, worldPosition);
            if (spatial.attachmentType & 1 /* SpatialAudioAttachmentType.Position */) {
                if (spatial.useBoundingBox && attachedNode.getBoundingInfo) {
                    attachedMesh.position.copyFrom(attachedNode.getBoundingInfo().boundingBox.centerWorld);
                }
                else {
                    attachedMesh.position.copyFrom(worldPosition);
                }
            }
            else {
                attachedMesh.position.copyFrom(spatial.position);
            }
            if (spatial.attachmentType & 2 /* SpatialAudioAttachmentType.Rotation */) {
                attachedMesh.rotationQuaternion.copyFrom(worldRotation);
            }
            else {
                attachedMesh.rotationQuaternion.copyFrom(spatial.rotationQuaternion);
            }
        }
        else {
            attachedMesh.position.copyFrom(spatial.position);
            attachedMesh.rotationQuaternion.copyFrom(spatial.rotationQuaternion);
        }
    }
    /**
     * Disposes of the gizmo.
     */
    dispose() {
        this.onClickedObservable.clear();
        this.gizmoLayer.utilityLayerScene.onPointerObservable.remove(this._pointerObserver);
        this._material.dispose();
        // _audioMesh and attachedMesh are children of _rootMesh, so super.dispose() handles them.
        super.dispose();
    }
    static _CreateSpeakerMesh(scene) {
        const root = new Mesh("spatialAudioRoot", scene);
        // Spherical body for the source point.
        const body = CreateSphere("spatialAudioBody", { diameter: 1, segments: 8 }, scene);
        body.parent = root;
        // A flared cone pointing along +Z to indicate the sound's facing direction.
        const cone = CreateCylinder("spatialAudioCone", {
            height: 1.4,
            diameterTop: 1.6,
            diameterBottom: 0.2,
            tessellation: 12,
            subdivisions: 1,
        }, scene);
        cone.parent = root;
        cone.rotation.x = Math.PI / 2;
        cone.position.z = 0.9;
        root.scaling.scaleInPlace(SpatialAudioGizmo._Scale);
        return root;
    }
}
SpatialAudioGizmo._Scale = 0.035;
//# sourceMappingURL=spatialAudioGizmo.js.map