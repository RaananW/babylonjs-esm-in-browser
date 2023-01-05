import { Observable } from "../Misc/observable.js";
import { TransformNode } from "../Meshes/transformNode.js";
import { Mesh } from "../Meshes/mesh.js";
import { CreateCylinder } from "../Meshes/Builders/cylinderBuilder.js";
import { PointerDragBehavior } from "../Behaviors/Meshes/pointerDragBehavior.js";
import { Gizmo } from "./gizmo.js";
import { UtilityLayerRenderer } from "../Rendering/utilityLayerRenderer.js";
import { StandardMaterial } from "../Materials/standardMaterial.js";
import { Color3 } from "../Maths/math.color.js";
import { TmpVectors } from "../Maths/math.vector.js";
/**
 * Single axis drag gizmo
 */
export class AxisDragGizmo extends Gizmo {
    /**
     * Creates an AxisDragGizmo
     * @param dragAxis The axis which the gizmo will be able to drag on
     * @param color The color of the gizmo
     * @param gizmoLayer The utility layer the gizmo will be added to
     * @param parent
     * @param thickness display gizmo axis thickness
     */
    constructor(dragAxis, color = Color3.Gray(), gizmoLayer = UtilityLayerRenderer.DefaultUtilityLayer, parent = null, thickness = 1) {
        var _a;
        super(gizmoLayer);
        this._pointerObserver = null;
        /**
         * Drag distance in babylon units that the gizmo will snap to when dragged (Default: 0)
         */
        this.snapDistance = 0;
        /**
         * Event that fires each time the gizmo snaps to a new location.
         * * snapDistance is the the change in distance
         */
        this.onSnapObservable = new Observable();
        this._isEnabled = true;
        this._parent = null;
        this._dragging = false;
        this._parent = parent;
        // Create Material
        this._coloredMaterial = new StandardMaterial("", gizmoLayer.utilityLayerScene);
        this._coloredMaterial.diffuseColor = color;
        this._coloredMaterial.specularColor = color.subtract(new Color3(0.1, 0.1, 0.1));
        this._hoverMaterial = new StandardMaterial("", gizmoLayer.utilityLayerScene);
        this._hoverMaterial.diffuseColor = Color3.Yellow();
        this._disableMaterial = new StandardMaterial("", gizmoLayer.utilityLayerScene);
        this._disableMaterial.diffuseColor = Color3.Gray();
        this._disableMaterial.alpha = 0.4;
        // Build Mesh + Collider
        const arrow = AxisDragGizmo._CreateArrow(gizmoLayer.utilityLayerScene, this._coloredMaterial, thickness);
        const collider = AxisDragGizmo._CreateArrow(gizmoLayer.utilityLayerScene, this._coloredMaterial, thickness + 4, true);
        // Add to Root Node
        this._gizmoMesh = new Mesh("", gizmoLayer.utilityLayerScene);
        this._gizmoMesh.addChild(arrow);
        this._gizmoMesh.addChild(collider);
        this._gizmoMesh.lookAt(this._rootMesh.position.add(dragAxis));
        this._gizmoMesh.scaling.scaleInPlace(1 / 3);
        this._gizmoMesh.parent = this._rootMesh;
        let currentSnapDragDistance = 0;
        const tmpSnapEvent = { snapDistance: 0 };
        // Add drag behavior to handle events when the gizmo is dragged
        this.dragBehavior = new PointerDragBehavior({ dragAxis: dragAxis });
        this.dragBehavior.moveAttached = false;
        this.dragBehavior.updateDragPlane = false;
        this._rootMesh.addBehavior(this.dragBehavior);
        this.dragBehavior.onDragObservable.add((event) => {
            if (this.attachedNode) {
                this._handlePivot();
                // Keep world translation and use it to update world transform
                // if the node has parent, the local transform properties (position, rotation, scale)
                // will be recomputed in _matrixChanged function
                let matrixChanged = false;
                // Snapping logic
                if (this.snapDistance == 0) {
                    this.attachedNode.getWorldMatrix().getTranslationToRef(TmpVectors.Vector3[2]);
                    TmpVectors.Vector3[2].addInPlace(event.delta);
                    if (this.dragBehavior.validateDrag(TmpVectors.Vector3[2])) {
                        if (this.attachedNode.position) {
                            // Required for nodes like lights
                            this.attachedNode.position.addInPlaceFromFloats(event.delta.x, event.delta.y, event.delta.z);
                        }
                        // use _worldMatrix to not force a matrix update when calling GetWorldMatrix especially with Cameras
                        this.attachedNode.getWorldMatrix().addTranslationFromFloats(event.delta.x, event.delta.y, event.delta.z);
                        this.attachedNode.updateCache();
                        matrixChanged = true;
                    }
                }
                else {
                    currentSnapDragDistance += event.dragDistance;
                    if (Math.abs(currentSnapDragDistance) > this.snapDistance) {
                        const dragSteps = Math.floor(Math.abs(currentSnapDragDistance) / this.snapDistance);
                        currentSnapDragDistance = currentSnapDragDistance % this.snapDistance;
                        event.delta.normalizeToRef(TmpVectors.Vector3[1]);
                        TmpVectors.Vector3[1].scaleInPlace(this.snapDistance * dragSteps);
                        this.attachedNode.getWorldMatrix().getTranslationToRef(TmpVectors.Vector3[2]);
                        TmpVectors.Vector3[2].addInPlace(TmpVectors.Vector3[1]);
                        if (this.dragBehavior.validateDrag(TmpVectors.Vector3[2])) {
                            this.attachedNode.getWorldMatrix().addTranslationFromFloats(TmpVectors.Vector3[1].x, TmpVectors.Vector3[1].y, TmpVectors.Vector3[1].z);
                            this.attachedNode.updateCache();
                            tmpSnapEvent.snapDistance = this.snapDistance * dragSteps;
                            this.onSnapObservable.notifyObservers(tmpSnapEvent);
                            matrixChanged = true;
                        }
                    }
                }
                if (matrixChanged) {
                    this._matrixChanged();
                }
            }
        });
        this.dragBehavior.onDragStartObservable.add(() => {
            this._dragging = true;
        });
        this.dragBehavior.onDragEndObservable.add(() => {
            this._dragging = false;
        });
        const light = gizmoLayer._getSharedGizmoLight();
        light.includedOnlyMeshes = light.includedOnlyMeshes.concat(this._rootMesh.getChildMeshes(false));
        const cache = {
            gizmoMeshes: arrow.getChildMeshes(),
            colliderMeshes: collider.getChildMeshes(),
            material: this._coloredMaterial,
            hoverMaterial: this._hoverMaterial,
            disableMaterial: this._disableMaterial,
            active: false,
            dragBehavior: this.dragBehavior,
        };
        (_a = this._parent) === null || _a === void 0 ? void 0 : _a.addToAxisCache(collider, cache);
        this._pointerObserver = gizmoLayer.utilityLayerScene.onPointerObservable.add((pointerInfo) => {
            var _a;
            if (this._customMeshSet) {
                return;
            }
            this._isHovered = !!(cache.colliderMeshes.indexOf((_a = pointerInfo === null || pointerInfo === void 0 ? void 0 : pointerInfo.pickInfo) === null || _a === void 0 ? void 0 : _a.pickedMesh) != -1);
            if (!this._parent) {
                const material = this.dragBehavior.enabled ? (this._isHovered || this._dragging ? this._hoverMaterial : this._coloredMaterial) : this._disableMaterial;
                this._setGizmoMeshMaterial(cache.gizmoMeshes, material);
            }
        });
        this.dragBehavior.onEnabledObservable.add((newState) => {
            this._setGizmoMeshMaterial(cache.gizmoMeshes, newState ? cache.material : cache.disableMaterial);
        });
    }
    /** Default material used to render when gizmo is not disabled or hovered */
    get coloredMaterial() {
        return this._coloredMaterial;
    }
    /** Material used to render when gizmo is hovered with mouse*/
    get hoverMaterial() {
        return this._hoverMaterial;
    }
    /** Material used to render when gizmo is disabled. typically grey.*/
    get disableMaterial() {
        return this._disableMaterial;
    }
    /**
     * @internal
     */
    static _CreateArrow(scene, material, thickness = 1, isCollider = false) {
        const arrow = new TransformNode("arrow", scene);
        const cylinder = CreateCylinder("cylinder", { diameterTop: 0, height: 0.075, diameterBottom: 0.0375 * (1 + (thickness - 1) / 4), tessellation: 96 }, scene);
        const line = CreateCylinder("cylinder", { diameterTop: 0.005 * thickness, height: 0.275, diameterBottom: 0.005 * thickness, tessellation: 96 }, scene);
        // Position arrow pointing in its drag axis
        cylinder.parent = arrow;
        cylinder.material = material;
        cylinder.rotation.x = Math.PI / 2;
        cylinder.position.z += 0.3;
        line.parent = arrow;
        line.material = material;
        line.position.z += 0.275 / 2;
        line.rotation.x = Math.PI / 2;
        if (isCollider) {
            line.visibility = 0;
            cylinder.visibility = 0;
        }
        return arrow;
    }
    /**
     * @internal
     */
    static _CreateArrowInstance(scene, arrow) {
        const instance = new TransformNode("arrow", scene);
        for (const mesh of arrow.getChildMeshes()) {
            const childInstance = mesh.createInstance(mesh.name);
            childInstance.parent = instance;
        }
        return instance;
    }
    _attachedNodeChanged(value) {
        if (this.dragBehavior) {
            this.dragBehavior.enabled = value ? true : false;
        }
    }
    /**
     * If the gizmo is enabled
     */
    set isEnabled(value) {
        this._isEnabled = value;
        if (!value) {
            this.attachedMesh = null;
            this.attachedNode = null;
        }
        else {
            if (this._parent) {
                this.attachedMesh = this._parent.attachedMesh;
                this.attachedNode = this._parent.attachedNode;
            }
        }
    }
    get isEnabled() {
        return this._isEnabled;
    }
    /**
     * Disposes of the gizmo
     */
    dispose() {
        this.onSnapObservable.clear();
        this.gizmoLayer.utilityLayerScene.onPointerObservable.remove(this._pointerObserver);
        this.dragBehavior.detach();
        if (this._gizmoMesh) {
            this._gizmoMesh.dispose();
        }
        [this._coloredMaterial, this._hoverMaterial, this._disableMaterial].forEach((matl) => {
            if (matl) {
                matl.dispose();
            }
        });
        super.dispose();
    }
}
//# sourceMappingURL=axisDragGizmo.js.map