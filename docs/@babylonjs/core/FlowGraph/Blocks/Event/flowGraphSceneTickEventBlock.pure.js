/** This file must only contain pure code and pure imports */
import { FlowGraphEventBlock } from "../../flowGraphEventBlock.js";
import { RichTypeNumber, RichTypeString } from "../../flowGraphRichTypes.pure.js";
import { RegisterClass } from "../../../Misc/typeStore.js";
/** Event source key used to build this block's event reference. */
const EventKey = "sceneTick";
/**
 * Block that triggers on scene tick (before each render).
 */
export class FlowGraphSceneTickEventBlock extends FlowGraphEventBlock {
    constructor() {
        super();
        this.type = "SceneBeforeRender" /* FlowGraphEventType.SceneBeforeRender */;
        this.timeSinceStart = this.registerDataOutput("timeSinceStart", RichTypeNumber);
        this.deltaTime = this.registerDataOutput("deltaTime", RichTypeNumber);
        this.eventRef = this.registerDataOutput("event", RichTypeString);
    }
    _updateOutputs(context) {
        this.eventRef.setValue(context.getEventReference(EventKey), context);
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
    _executeEvent(context, payload) {
        this.timeSinceStart.setValue(payload.timeSinceStart, context);
        this.deltaTime.setValue(payload.deltaTime, context);
        this.eventRef.setValue(context.getEventReference(EventKey), context);
        this._execute(context);
        return true;
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
        return "FlowGraphSceneTickEventBlock" /* FlowGraphBlockNames.SceneTickEvent */;
    }
}
let _Registered = false;
/**
 * Register side effects for flowGraphSceneTickEventBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterFlowGraphSceneTickEventBlock() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    RegisterClass("FlowGraphSceneTickEventBlock" /* FlowGraphBlockNames.SceneTickEvent */, FlowGraphSceneTickEventBlock);
}
//# sourceMappingURL=flowGraphSceneTickEventBlock.pure.js.map