/** This file must only contain pure code and pure imports */
import { FlowGraphEventBlock } from "../../flowGraphEventBlock.js";
import { RichTypeAny, RichTypeNumber } from "../../flowGraphRichTypes.pure.js";
import { _IsDescendantOf } from "../../utils.js";
import { RegisterClass } from "../../../Misc/typeStore.js";
/**
 * A pointe out event block.
 * This block can be used as an entry pointer to when a pointer is out of a specific target mesh.
 */
export class FlowGraphPointerOutEventBlock extends FlowGraphEventBlock {
    constructor(config) {
        super(config);
        this.type = "PointerOut" /* FlowGraphEventType.PointerOut */;
        this.pointerId = this.registerDataOutput("pointerId", RichTypeNumber);
        this.targetMesh = this.registerDataInput("targetMesh", RichTypeAny, config?.targetMesh);
        this.meshOutOfPointer = this.registerDataOutput("meshOutOfPointer", RichTypeAny);
    }
    _executeEvent(context, payload) {
        const mesh = this.targetMesh.getValue(context);
        this.meshOutOfPointer.setValue(payload.mesh, context);
        this.pointerId.setValue(payload.pointerId, context);
        const skipEvent = payload.over && _IsDescendantOf(payload.mesh, mesh);
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
        return "FlowGraphPointerOutEventBlock" /* FlowGraphBlockNames.PointerOutEvent */;
    }
}
let _Registered = false;
/**
 * Register side effects for flowGraphPointerOutEventBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterFlowGraphPointerOutEventBlock() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    RegisterClass("FlowGraphPointerOutEventBlock" /* FlowGraphBlockNames.PointerOutEvent */, FlowGraphPointerOutEventBlock);
}
//# sourceMappingURL=flowGraphPointerOutEventBlock.pure.js.map