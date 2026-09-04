/** This file must only contain pure code and pure imports */
import { FlowGraphEventBlock } from "../../flowGraphEventBlock.js";
import { _IsDescendantOf } from "../../utils.js";
import { RichTypeAny, RichTypeNumber } from "../../flowGraphRichTypes.pure.js";
import { RegisterClass } from "../../../Misc/typeStore.js";
/**
 * A pointer move event block.
 * This block fires when the pointer moves.
 * Optionally filters to a specific mesh via the `targetMesh` input.
 */
export class FlowGraphPointerMoveEventBlock extends FlowGraphEventBlock {
    /**
     * Creates a new FlowGraphPointerMoveEventBlock.
     * @param config optional configuration
     */
    constructor(config) {
        super(config);
        /** @internal */
        this.type = "PointerMove" /* FlowGraphEventType.PointerMove */;
        this.targetMesh = this.registerDataInput("targetMesh", RichTypeAny, config?.targetMesh);
        this.pointerId = this.registerDataOutput("pointerId", RichTypeNumber);
        this.meshUnderPointer = this.registerDataOutput("meshUnderPointer", RichTypeAny);
        this.pickedPoint = this.registerDataOutput("pickedPoint", RichTypeAny);
    }
    /** @internal */
    _executeEvent(context, pointerInfo) {
        const mesh = this.targetMesh.getValue(context);
        const pickedMesh = pointerInfo.pickInfo?.pickedMesh;
        // If a target mesh is set, only fire when that mesh (or a descendant) is under the pointer.
        if (mesh && !(pickedMesh === mesh || (pickedMesh && _IsDescendantOf(pickedMesh, mesh)))) {
            return true;
        }
        this.pointerId.setValue(pointerInfo.event.pointerId, context);
        this.meshUnderPointer.setValue(pickedMesh ?? null, context);
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
        return "FlowGraphPointerMoveEventBlock" /* FlowGraphBlockNames.PointerMoveEvent */;
    }
}
let _Registered = false;
/**
 * Register side effects for flowGraphPointerMoveEventBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterFlowGraphPointerMoveEventBlock() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    RegisterClass("FlowGraphPointerMoveEventBlock" /* FlowGraphBlockNames.PointerMoveEvent */, FlowGraphPointerMoveEventBlock);
}
//# sourceMappingURL=flowGraphPointerMoveEventBlock.pure.js.map