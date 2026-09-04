/** This file must only contain pure code and pure imports */
import { FlowGraphEventBlock } from "../../flowGraphEventBlock.js";
import { RichTypeString } from "../../flowGraphRichTypes.pure.js";
import { RegisterClass } from "../../../Misc/typeStore.js";
/** Event source key used to build this block's event reference. */
const EventKey = "sceneReady";
/**
 * Block that triggers when a scene is ready.
 */
export class FlowGraphSceneReadyEventBlock extends FlowGraphEventBlock {
    constructor() {
        super();
        this.initPriority = -1;
        this.type = "SceneReady" /* FlowGraphEventType.SceneReady */;
        this.eventRef = this.registerDataOutput("event", RichTypeString);
    }
    _updateOutputs(context) {
        this.eventRef.setValue(context.getEventReference(EventKey), context);
    }
    _executeEvent(context, _payload) {
        this.eventRef.setValue(context.getEventReference(EventKey), context);
        this._execute(context);
        return true;
    }
    _preparePendingTasks(context) {
        // no-op
    }
    _cancelPendingTasks(context) {
        // no-op
    }
    /**
     * @returns class name of the block.
     */
    getClassName() {
        return "FlowGraphSceneReadyEventBlock" /* FlowGraphBlockNames.SceneReadyEvent */;
    }
}
let _Registered = false;
/**
 * Register side effects for flowGraphSceneReadyEventBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterFlowGraphSceneReadyEventBlock() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    RegisterClass("FlowGraphSceneReadyEventBlock" /* FlowGraphBlockNames.SceneReadyEvent */, FlowGraphSceneReadyEventBlock);
}
//# sourceMappingURL=flowGraphSceneReadyEventBlock.pure.js.map