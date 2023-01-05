import { Logger } from "../Misc/logger.js";
import { Observable } from "../Misc/observable.js";
import { Vector3 } from "../Maths/math.vector.js";
import { Color3 } from "../Maths/math.color.js";
import { Gizmo } from "./gizmo.js";
import { AxisDragGizmo } from "./axisDragGizmo.js";
import { PlaneDragGizmo } from "./planeDragGizmo.js";
import { UtilityLayerRenderer } from "../Rendering/utilityLayerRenderer.js";
/**
 * Gizmo that enables dragging a mesh along 3 axis
 */
export class PositionGizmo extends Gizmo {
    /**
     * Creates a PositionGizmo
     * @param gizmoLayer The utility layer the gizmo will be added to
      @param thickness display gizmo axis thickness
     * @param gizmoManager
     */
    constructor(gizmoLayer = UtilityLayerRenderer.DefaultUtilityLayer, thickness = 1, gizmoManager) {
        super(gizmoLayer);
        /**
         * protected variables
         */
        this._meshAttached = null;
        this._nodeAttached = null;
        this._observables = [];
        /** Node Caching for quick lookup */
        this._gizmoAxisCache = new Map();
        /** Fires an event when any of it's sub gizmos are dragged */
        this.onDragStartObservable = new Observable();
        /** Fires an event when any of it's sub gizmos are released from dragging */
        this.onDragEndObservable = new Observable();
        /**
         * If set to true, planar drag is enabled
         */
        this._planarGizmoEnabled = false;
        this.xGizmo = new AxisDragGizmo(new Vector3(1, 0, 0), Color3.Red().scale(0.5), gizmoLayer, this, thickness);
        this.yGizmo = new AxisDragGizmo(new Vector3(0, 1, 0), Color3.Green().scale(0.5), gizmoLayer, this, thickness);
        this.zGizmo = new AxisDragGizmo(new Vector3(0, 0, 1), Color3.Blue().scale(0.5), gizmoLayer, this, thickness);
        this.xPlaneGizmo = new PlaneDragGizmo(new Vector3(1, 0, 0), Color3.Red().scale(0.5), this.gizmoLayer, this);
        this.yPlaneGizmo = new PlaneDragGizmo(new Vector3(0, 1, 0), Color3.Green().scale(0.5), this.gizmoLayer, this);
        this.zPlaneGizmo = new PlaneDragGizmo(new Vector3(0, 0, 1), Color3.Blue().scale(0.5), this.gizmoLayer, this);
        // Relay drag events
        [this.xGizmo, this.yGizmo, this.zGizmo, this.xPlaneGizmo, this.yPlaneGizmo, this.zPlaneGizmo].forEach((gizmo) => {
            gizmo.dragBehavior.onDragStartObservable.add(() => {
                this.onDragStartObservable.notifyObservers({});
            });
            gizmo.dragBehavior.onDragEndObservable.add(() => {
                this.onDragEndObservable.notifyObservers({});
            });
        });
        this.attachedMesh = null;
        if (gizmoManager) {
            gizmoManager.addToAxisCache(this._gizmoAxisCache);
        }
        else {
            // Only subscribe to pointer event if gizmoManager isnt
            Gizmo.GizmoAxisPointerObserver(gizmoLayer, this._gizmoAxisCache);
        }
    }
    get attachedMesh() {
        return this._meshAttached;
    }
    set attachedMesh(mesh) {
        this._meshAttached = mesh;
        this._nodeAttached = mesh;
        [this.xGizmo, this.yGizmo, this.zGizmo, this.xPlaneGizmo, this.yPlaneGizmo, this.zPlaneGizmo].forEach((gizmo) => {
            if (gizmo.isEnabled) {
                gizmo.attachedMesh = mesh;
            }
            else {
                gizmo.attachedMesh = null;
            }
        });
    }
    get attachedNode() {
        return this._nodeAttached;
    }
    set attachedNode(node) {
        this._meshAttached = null;
        this._nodeAttached = node;
        [this.xGizmo, this.yGizmo, this.zGizmo, this.xPlaneGizmo, this.yPlaneGizmo, this.zPlaneGizmo].forEach((gizmo) => {
            if (gizmo.isEnabled) {
                gizmo.attachedNode = node;
            }
            else {
                gizmo.attachedNode = null;
            }
        });
    }
    /**
     * True when the mouse pointer is hovering a gizmo mesh
     */
    get isHovered() {
        let hovered = false;
        [this.xGizmo, this.yGizmo, this.zGizmo, this.xPlaneGizmo, this.yPlaneGizmo, this.zPlaneGizmo].forEach((gizmo) => {
            hovered = hovered || gizmo.isHovered;
        });
        return hovered;
    }
    /**
     * If the planar drag gizmo is enabled
     * setting this will enable/disable XY, XZ and YZ planes regardless of individual gizmo settings.
     */
    set planarGizmoEnabled(value) {
        this._planarGizmoEnabled = value;
        [this.xPlaneGizmo, this.yPlaneGizmo, this.zPlaneGizmo].forEach((gizmo) => {
            if (gizmo) {
                gizmo.isEnabled = value;
                if (value) {
                    if (gizmo.attachedMesh) {
                        gizmo.attachedMesh = this.attachedMesh;
                    }
                    else {
                        gizmo.attachedNode = this.attachedNode;
                    }
                }
            }
        }, this);
    }
    get planarGizmoEnabled() {
        return this._planarGizmoEnabled;
    }
    /**
     * If set the gizmo's rotation will be updated to match the attached mesh each frame (Default: true)
     * NOTE: This is only possible for meshes with uniform scaling, as otherwise it's not possible to decompose the rotation
     */
    set updateGizmoRotationToMatchAttachedMesh(value) {
        this._updateGizmoRotationToMatchAttachedMesh = value;
        [this.xGizmo, this.yGizmo, this.zGizmo, this.xPlaneGizmo, this.yPlaneGizmo, this.zPlaneGizmo].forEach((gizmo) => {
            if (gizmo) {
                gizmo.updateGizmoRotationToMatchAttachedMesh = value;
            }
        });
    }
    get updateGizmoRotationToMatchAttachedMesh() {
        return this._updateGizmoRotationToMatchAttachedMesh;
    }
    set updateGizmoPositionToMatchAttachedMesh(value) {
        this._updateGizmoPositionToMatchAttachedMesh = value;
        [this.xGizmo, this.yGizmo, this.zGizmo, this.xPlaneGizmo, this.yPlaneGizmo, this.zPlaneGizmo].forEach((gizmo) => {
            if (gizmo) {
                gizmo.updateGizmoPositionToMatchAttachedMesh = value;
            }
        });
    }
    get updateGizmoPositionToMatchAttachedMesh() {
        return this._updateGizmoPositionToMatchAttachedMesh;
    }
    set updateScale(value) {
        if (this.xGizmo) {
            this.xGizmo.updateScale = value;
            this.yGizmo.updateScale = value;
            this.zGizmo.updateScale = value;
        }
    }
    get updateScale() {
        return this.xGizmo.updateScale;
    }
    /**
     * Drag distance in babylon units that the gizmo will snap to when dragged (Default: 0)
     */
    set snapDistance(value) {
        this._snapDistance = value;
        [this.xGizmo, this.yGizmo, this.zGizmo, this.xPlaneGizmo, this.yPlaneGizmo, this.zPlaneGizmo].forEach((gizmo) => {
            if (gizmo) {
                gizmo.snapDistance = value;
            }
        });
    }
    get snapDistance() {
        return this._snapDistance;
    }
    /**
     * Ratio for the scale of the gizmo (Default: 1)
     */
    set scaleRatio(value) {
        this._scaleRatio = value;
        [this.xGizmo, this.yGizmo, this.zGizmo, this.xPlaneGizmo, this.yPlaneGizmo, this.zPlaneGizmo].forEach((gizmo) => {
            if (gizmo) {
                gizmo.scaleRatio = value;
            }
        });
    }
    get scaleRatio() {
        return this._scaleRatio;
    }
    /**
     * Builds Gizmo Axis Cache to enable features such as hover state preservation and graying out other axis during manipulation
     * @param mesh Axis gizmo mesh
     * @param cache Gizmo axis definition used for reactive gizmo UI
     */
    addToAxisCache(mesh, cache) {
        this._gizmoAxisCache.set(mesh, cache);
    }
    /**
     * Disposes of the gizmo
     */
    dispose() {
        [this.xGizmo, this.yGizmo, this.zGizmo, this.xPlaneGizmo, this.yPlaneGizmo, this.zPlaneGizmo].forEach((gizmo) => {
            if (gizmo) {
                gizmo.dispose();
            }
        });
        this._observables.forEach((obs) => {
            this.gizmoLayer.utilityLayerScene.onPointerObservable.remove(obs);
        });
        this.onDragStartObservable.clear();
        this.onDragEndObservable.clear();
    }
    /**
     * CustomMeshes are not supported by this gizmo
     */
    setCustomMesh() {
        Logger.Error("Custom meshes are not supported on this gizmo, please set the custom meshes on the gizmos contained within this one (gizmo.xGizmo, gizmo.yGizmo, gizmo.zGizmo,gizmo.xPlaneGizmo, gizmo.yPlaneGizmo, gizmo.zPlaneGizmo)");
    }
}
//# sourceMappingURL=positionGizmo.js.map