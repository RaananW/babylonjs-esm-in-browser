/** This file must only contain pure code and pure imports */
import { FlowGraphEventBlock } from "../../flowGraphEventBlock.js";
import { _IsDescendantOf } from "../../utils.js";
import { RichTypeAny, RichTypeNumber } from "../../flowGraphRichTypes.pure.js";
import { RegisterClass } from "../../../Misc/typeStore.js";
/**
 * A pointer down event block.
 * This block fires when a pointer is pressed (mouse button down / touch start).
 * Optionally filters to a specific mesh via the `targetMesh` input.
 */
export class FlowGraphPointerDownEventBlock extends FlowGraphEventBlock {
    /**
     * Creates a new FlowGraphPointerDownEventBlock.
     * @param config optional configuration
     */
    constructor(config) {
        super(config);
        /** @internal */
        this.type = "PointerDown" /* FlowGraphEventType.PointerDown */;
        this.targetMesh = this.registerDataInput("targetMesh", RichTypeAny, config?.targetMesh);
        this.pointerId = this.registerDataOutput("pointerId", RichTypeNumber);
        this.pickedMesh = this.registerDataOutput("pickedMesh", RichTypeAny);
        this.pickedPoint = this.registerDataOutput("pickedPoint", RichTypeAny);
    }
    /** @internal */
    _executeEvent(context, pointerInfo) {
        const mesh = this.targetMesh.getValue(context);
        const pickedMesh = pointerInfo.pickInfo?.pickedMesh;
        // If a target mesh is set, only fire when that mesh (or a descendant) is picked.
        if (mesh && !(pickedMesh === mesh || (pickedMesh && _IsDescendantOf(pickedMesh, mesh)))) {
            return true;
        }
        this.pointerId.setValue(pointerInfo.event.pointerId, context);
        this.pickedMesh.setValue(pickedMesh ?? null, context);
        this.pickedPoint.setValue(pointerInfo.pickInfo?.pickedPoint ?? null, context);
        this._execute(context);
        return !this.config?.stopPropagation;
    }
    /** @internal */
    _preparePendingTasks(_context) {
        // no-op
    }
    /** @internal */
    _cancelPendingTasks(_context) {
        // no-op
    }
    /**
     * @returns the class name of the block.
     */
    getClassName() {
        return "FlowGraphPointerDownEventBlock" /* FlowGraphBlockNames.PointerDownEvent */;
    }
}
let _Registered = false;
/**
 * Register side effects for flowGraphPointerDownEventBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterFlowGraphPointerDownEventBlock() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    RegisterClass("FlowGraphPointerDownEventBlock" /* FlowGraphBlockNames.PointerDownEvent */, FlowGraphPointerDownEventBlock);
}
//# sourceMappingURL=flowGraphPointerDownEventBlock.pure.js.map