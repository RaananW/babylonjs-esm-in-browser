/** This file must only contain pure code and pure imports */
import { FlowGraphEventBlock } from "../../flowGraphEventBlock.js";
import { PointerEventTypes } from "../../../Events/pointerEvents.js";
import { _IsDescendantOf } from "../../utils.js";
import { RichTypeAny, RichTypeNumber, RichTypeVector3 } from "../../flowGraphRichTypes.pure.js";
import { RegisterClass } from "../../../Misc/typeStore.js";
/**
 * A block that activates when a mesh is picked.
 */
export class FlowGraphMeshPickEventBlock extends FlowGraphEventBlock {
    constructor(
    /**
     * the configuration of the block
     */
    config) {
        super(config);
        this.config = config;
        /**
         * the type of the event this block reacts to
         */
        this.type = "MeshPick" /* FlowGraphEventType.MeshPick */;
        this.asset = this.registerDataInput("asset", RichTypeAny, config?.targetMesh);
        this.pickedPoint = this.registerDataOutput("pickedPoint", RichTypeVector3);
        this.pickOrigin = this.registerDataOutput("pickOrigin", RichTypeVector3);
        this.pointerId = this.registerDataOutput("pointerId", RichTypeNumber);
        this.pickedMesh = this.registerDataOutput("pickedMesh", RichTypeAny);
        this.pointerType = this.registerDataInput("pointerType", RichTypeAny, PointerEventTypes.POINTERPICK);
    }
    _getReferencedMesh(context) {
        return this.asset.getValue(context);
    }
    _executeEvent(context, pickedInfo) {
        // get the pointer type
        const pointerType = this.pointerType.getValue(context);
        if (pointerType !== pickedInfo.type) {
            // returning true here to continue the propagation of the pointer event to the rest of the blocks
            return true;
        }
        const mesh = this._getReferencedMesh(context);
        const pickedMesh = pickedInfo.pickInfo?.pickedMesh;
        // When no target mesh is configured, fire for any picked mesh.
        // When a target is configured, require an exact match or descendant match.
        // Match by reference first, then by descendant, then by stable name/id as a
        // fallback for scene reloads where the object reference changes but the mesh
        // identity (name) is preserved (uniqueId increments monotonically and is NOT
        // stable across reloads).
        const meshMatches = !mesh ? !!pickedMesh : !!(pickedMesh && (pickedMesh === mesh || _IsDescendantOf(pickedMesh, mesh) || pickedMesh.name === mesh.name));
        if (meshMatches && pickedMesh) {
            this.pointerId.setValue(pickedInfo.event.pointerId, context);
            this.pickOrigin.setValue(pickedInfo.pickInfo.ray?.origin, context);
            this.pickedPoint.setValue(pickedInfo.pickInfo.pickedPoint, context);
            this.pickedMesh.setValue(pickedMesh, context);
            this._execute(context);
            // stop the propagation if the configuration says so
            return !this.config?.stopPropagation;
        }
        else {
            // reset the outputs
            this.pointerId.resetToDefaultValue(context);
            this.pickOrigin.resetToDefaultValue(context);
            this.pickedPoint.resetToDefaultValue(context);
            this.pickedMesh.resetToDefaultValue(context);
        }
        return true;
    }
    /**
     * @internal
     */
    _preparePendingTasks(_context) {
        // no-op
    }
    /**
     * @internal
     */
    _cancelPendingTasks(_context) {
        // no-op
    }
    /**
     * @returns class name of the block.
     */
    getClassName() {
        return "FlowGraphMeshPickEventBlock" /* FlowGraphBlockNames.MeshPickEvent */;
    }
}
let _Registered = false;
/**
 * Register side effects for flowGraphMeshPickEventBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterFlowGraphMeshPickEventBlock() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    RegisterClass("FlowGraphMeshPickEventBlock" /* FlowGraphBlockNames.MeshPickEvent */, FlowGraphMeshPickEventBlock);
}
//# sourceMappingURL=flowGraphMeshPickEventBlock.pure.js.map