import { Observable } from "../Misc/observable.js";
import { Mesh } from "../Meshes/mesh.js";
import { CreateBox } from "../Meshes/Builders/boxBuilder.js";
import { CreateCylinder } from "../Meshes/Builders/cylinderBuilder.js";
import { StandardMaterial } from "../Materials/standardMaterial.js";
import { PointerDragBehavior } from "../Behaviors/Meshes/pointerDragBehavior.js";
import { Gizmo } from "./gizmo.js";
import { UtilityLayerRenderer } from "../Rendering/utilityLayerRenderer.js";
import { Color3 } from "../Maths/math.color.js";
import { TmpVectors, Matrix } from "../Maths/math.vector.js";
/**
 * Single axis scale gizmo
 */
export class AxisScaleGizmo extends Gizmo {
    /**
     * Creates an AxisScaleGizmo
     * @param dragAxis The axis which the gizmo will be able to scale on
     * @param color The color of the gizmo
     * @param gizmoLayer The utility layer the gizmo will be added to
     * @param parent
     * @param thickness display gizmo axis thickness
     */
    constructor(dragAxis, color = Color3.Gray(), gizmoLayer = UtilityLayerRenderer.DefaultUtilityLayer, parent = null, thickness = 1) {
        var _a, _b, _c, _d, _e, _f, _g;
        super(gizmoLayer);
        this._pointerObserver = null;
        /**
         * Scale distance in babylon units that the gizmo will snap to when dragged (Default: 0)
         */
        this.snapDistance = 0;
        /**
         * Event that fires each time the gizmo snaps to a new location.
         * * snapDistance is the the change in distance
         */
        this.onSnapObservable = new Observable();
        /**
         * If the scaling operation should be done on all axis (default: false)
         */
        this.uniformScaling = false;
        /**
         * Custom sensitivity value for the drag strength
         */
        this.sensitivity = 1;
        /**
         * The magnitude of the drag strength (scaling factor)
         */
        this.dragScale = 1;
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
        // Build mesh + Collider
        this._gizmoMesh = new Mesh("axis", gizmoLayer.utilityLayerScene);
        const { arrowMesh, arrowTail } = this._createGizmoMesh(this._gizmoMesh, thickness);
        const collider = this._createGizmoMesh(this._gizmoMesh, thickness + 4, true);
        this._gizmoMesh.lookAt(this._rootMesh.position.add(dragAxis));
        this._rootMesh.addChild(this._gizmoMesh, Gizmo.PreserveScaling);
        this._gizmoMesh.scaling.scaleInPlace(1 / 3);
        // Closure of initial prop values for resetting
        const nodePosition = arrowMesh.position.clone();
        const linePosition = arrowTail.position.clone();
        const lineScale = arrowTail.scaling.clone();
        const increaseGizmoMesh = (dragDistance) => {
            const dragStrength = dragDistance * (3 / this._rootMesh.scaling.length()) * 6;
            arrowMesh.position.z += dragStrength / 3.5;
            arrowTail.scaling.y += dragStrength;
            this.dragScale = arrowTail.scaling.y;
            arrowTail.position.z = arrowMesh.position.z / 2;
        };
        const resetGizmoMesh = () => {
            arrowMesh.position.set(nodePosition.x, nodePosition.y, nodePosition.z);
            arrowTail.position.set(linePosition.x, linePosition.y, linePosition.z);
            arrowTail.scaling.set(lineScale.x, lineScale.y, lineScale.z);
            this.dragScale = arrowTail.scaling.y;
            this._dragging = false;
        };
        // Add drag behavior to handle events when the gizmo is dragged
        this.dragBehavior = new PointerDragBehavior({ dragAxis: dragAxis });
        this.dragBehavior.moveAttached = false;
        this.dragBehavior.updateDragPlane = false;
        this._rootMesh.addBehavior(this.dragBehavior);
        let currentSnapDragDistance = 0;
        const tmpSnapEvent = { snapDistance: 0 };
        this.dragBehavior.onDragObservable.add((event) => {
            if (this.attachedNode) {
                this._handlePivot();
                // Drag strength is modified by the scale of the gizmo (eg. for small objects like boombox the strength will be increased to match the behavior of larger objects)
                const dragStrength = this.sensitivity * event.dragDistance * ((this.scaleRatio * 3) / this._rootMesh.scaling.length());
                // Snapping logic
                let snapped = false;
                let dragSteps = 0;
                if (this.uniformScaling) {
                    TmpVectors.Vector3[0].setAll(0.57735); // 1 / sqrt(3)
                }
                else {
                    TmpVectors.Vector3[0].copyFrom(dragAxis);
                }
                if (this.snapDistance == 0) {
                    TmpVectors.Vector3[0].scaleToRef(dragStrength, TmpVectors.Vector3[0]);
                }
                else {
                    currentSnapDragDistance += dragStrength;
                    if (Math.abs(currentSnapDragDistance) > this.snapDistance) {
                        dragSteps = Math.floor(Math.abs(currentSnapDragDistance) / this.snapDistance);
                        if (currentSnapDragDistance < 0) {
                            dragSteps *= -1;
                        }
                        currentSnapDragDistance = currentSnapDragDistance % this.snapDistance;
                        TmpVectors.Vector3[0].scaleToRef(this.snapDistance * dragSteps, TmpVectors.Vector3[0]);
                        snapped = true;
                    }
                    else {
                        TmpVectors.Vector3[0].scaleInPlace(0);
                    }
                }
                Matrix.ScalingToRef(1 + TmpVectors.Vector3[0].x, 1 + TmpVectors.Vector3[0].y, 1 + TmpVectors.Vector3[0].z, TmpVectors.Matrix[2]);
                TmpVectors.Matrix[2].multiplyToRef(this.attachedNode.getWorldMatrix(), TmpVectors.Matrix[1]);
                const transformNode = this.attachedNode._isMesh ? this.attachedNode : undefined;
                TmpVectors.Matrix[1].decompose(TmpVectors.Vector3[1], undefined, undefined, Gizmo.PreserveScaling ? transformNode : undefined);
                const maxScale = 100000;
                if (Math.abs(TmpVectors.Vector3[1].x) < maxScale && Math.abs(TmpVectors.Vector3[1].y) < maxScale && Math.abs(TmpVectors.Vector3[1].z) < maxScale) {
                    this.attachedNode.getWorldMatrix().copyFrom(TmpVectors.Matrix[1]);
                }
                if (snapped) {
                    tmpSnapEvent.snapDistance = this.snapDistance * dragSteps;
                    this.onSnapObservable.notifyObservers(tmpSnapEvent);
                }
                this._matrixChanged();
            }
        });
        // On Drag Listener: to move gizmo mesh with user action
        this.dragBehavior.onDragStartObservable.add(() => {
            this._dragging = true;
        });
        this.dragBehavior.onDragObservable.add((e) => increaseGizmoMesh(e.dragDistance));
        this.dragBehavior.onDragEndObservable.add(resetGizmoMesh);
        // Listeners for Universal Scalar
        (_c = (_b = (_a = parent === null || parent === void 0 ? void 0 : parent.uniformScaleGizmo) === null || _a === void 0 ? void 0 : _a.dragBehavior) === null || _b === void 0 ? void 0 : _b.onDragObservable) === null || _c === void 0 ? void 0 : _c.add((e) => increaseGizmoMesh(e.delta.y));
        (_f = (_e = (_d = parent === null || parent === void 0 ? void 0 : parent.uniformScaleGizmo) === null || _d === void 0 ? void 0 : _d.dragBehavior) === null || _e === void 0 ? void 0 : _e.onDragEndObservable) === null || _f === void 0 ? void 0 : _f.add(resetGizmoMesh);
        const cache = {
            gizmoMeshes: [arrowMesh, arrowTail],
            colliderMeshes: [collider.arrowMesh, collider.arrowTail],
            material: this._coloredMaterial,
            hoverMaterial: this._hoverMaterial,
            disableMaterial: this._disableMaterial,
            active: false,
            dragBehavior: this.dragBehavior,
        };
        (_g = this._parent) === null || _g === void 0 ? void 0 : _g.addToAxisCache(this._gizmoMesh, cache);
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
            this._setGizmoMeshMaterial(cache.gizmoMeshes, newState ? this._coloredMaterial : this._disableMaterial);
        });
        const light = gizmoLayer._getSharedGizmoLight();
        light.includedOnlyMeshes = light.includedOnlyMeshes.concat(this._rootMesh.getChildMeshes());
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
     * Create Geometry for Gizmo
     * @param parentMesh
     * @param thickness
     * @param isCollider
     */
    _createGizmoMesh(parentMesh, thickness, isCollider = false) {
        const arrowMesh = CreateBox("yPosMesh", { size: 0.4 * (1 + (thickness - 1) / 4) }, this.gizmoLayer.utilityLayerScene);
        const arrowTail = CreateCylinder("cylinder", { diameterTop: 0.005 * thickness, height: 0.275, diameterBottom: 0.005 * thickness, tessellation: 96 }, this.gizmoLayer.utilityLayerScene);
        // Position arrow pointing in its drag axis
        arrowMesh.scaling.scaleInPlace(0.1);
        arrowMesh.material = this._coloredMaterial;
        arrowMesh.rotation.x = Math.PI / 2;
        arrowMesh.position.z += 0.3;
        arrowTail.material = this._coloredMaterial;
        arrowTail.position.z += 0.275 / 2;
        arrowTail.rotation.x = Math.PI / 2;
        if (isCollider) {
            arrowMesh.visibility = 0;
            arrowTail.visibility = 0;
        }
        parentMesh.addChild(arrowMesh);
        parentMesh.addChild(arrowTail);
        return { arrowMesh, arrowTail };
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
    /**
     * Disposes and replaces the current meshes in the gizmo with the specified mesh
     * @param mesh The mesh to replace the default mesh of the gizmo
     * @param useGizmoMaterial If the gizmo's default material should be used (default: false)
     */
    setCustomMesh(mesh, useGizmoMaterial = false) {
        super.setCustomMesh(mesh);
        if (useGizmoMaterial) {
            this._rootMesh.getChildMeshes().forEach((m) => {
                m.material = this._coloredMaterial;
                if (m.color) {
                    m.color = this._coloredMaterial.diffuseColor;
                }
            });
            this._customMeshSet = false;
        }
    }
}
//# sourceMappingURL=axisScaleGizmo.js.map