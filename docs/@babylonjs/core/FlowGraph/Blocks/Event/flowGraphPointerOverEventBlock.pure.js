/** This file must only contain pure code and pure imports */
import { FlowGraphEventBlock } from "../../flowGraphEventBlock.js";
import { RichTypeAny, RichTypeNumber } from "../../flowGraphRichTypes.pure.js";
import { _IsDescendantOf } from "../../utils.js";
import { RegisterClass } from "../../../Misc/typeStore.js";
/**
 * A pointer over event block.
 * This block can be used as an entry pointer to when a pointer is over a specific target mesh.
 */
export class FlowGraphPointerOverEventBlock extends FlowGraphEventBlock {
    constructor(config) {
        super(config);
        this.type = "PointerOver" /* FlowGraphEventType.PointerOver */;
        this.pointerId = this.registerDataOutput("pointerId", RichTypeNumber);
        this.targetMesh = this.registerDataInput("targetMesh", RichTypeAny, config?.targetMesh);
        this.meshUnderPointer = this.registerDataOutput("meshUnderPointer", RichTypeAny);
    }
    _executeEvent(context, payload) {
        const mesh = this.targetMesh.getValue(context);
        this.meshUnderPointer.setValue(payload.mesh, context);
        // skip if we moved from a mesh that is under the hierarchy of the target mesh
        const skipEvent = payload.out && _IsDescendantOf(payload.out, mesh);
        this.pointerId.setValue(payload.pointerId, context);
        if (!skipEvent && (payload.mesh === mesh || _IsDescendantOf(payload.mesh, mesh))) {
            this._execute(context);
            return !this.config?.stopPropagation;
        }
        return true;
    }
    _preparePendingTasks(_context) {
        // no-op
    }
    _cancelPendingTasks(_context) {
        // no-op
    }
    getClassName() {
        return "FlowGraphPointerOverEventBlock" /* FlowGraphBlockNames.PointerOverEvent */;
    }
}
let _Registered = false;
/**
 * Register side effects for flowGraphPointerOverEventBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterFlowGraphPointerOverEventBlock() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    RegisterClass("FlowGraphPointerOverEventBlock" /* FlowGraphBlockNames.PointerOverEvent */, FlowGraphPointerOverEventBlock);
}
//# sourceMappingURL=flowGraphPointerOverEventBlock.pure.js.map