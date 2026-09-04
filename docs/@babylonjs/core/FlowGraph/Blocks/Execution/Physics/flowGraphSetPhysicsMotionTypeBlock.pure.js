/** This file must only contain pure code and pure imports */
import { FlowGraphExecutionBlockWithOutSignal } from "../../../flowGraphExecutionBlockWithOutSignal.js";
import { RichTypeAny, RichTypeNumber } from "../../../flowGraphRichTypes.pure.js";
import { RegisterClass } from "../../../../Misc/typeStore.js";
/**
 * @experimental
 * A block that sets the motion type of a physics body.
 *
 * The motion type input is a number corresponding to the PhysicsMotionType enum:
 * - 0 = STATIC (not moving, not affected by forces)
 * - 1 = ANIMATED (not affected by other bodies, but pushes them)
 * - 2 = DYNAMIC (fully simulated, affected by forces and collisions)
 */
export class FlowGraphSetPhysicsMotionTypeBlock extends FlowGraphExecutionBlockWithOutSignal {
    /**
     * Constructs a new FlowGraphSetPhysicsMotionTypeBlock.
     * @param config - optional configuration for the block
     */
    constructor(config) {
        super(config);
        this.body = this.registerDataInput("body", RichTypeAny);
        this.motionType = this.registerDataInput("motionType", RichTypeNumber, 2 /* PhysicsMotionType.DYNAMIC */);
    }
    /**
     * @internal
     */
    _execute(context, _callingSignal) {
        const physicsBody = this.body.getValue(context);
        if (!physicsBody) {
            this._reportError(context, "No physics body provided");
            this.out._activateSignal(context);
            return;
        }
        physicsBody.setMotionType(this.motionType.getValue(context));
        this.out._activateSignal(context);
    }
    /**
     * @returns class name of the block.
     */
    getClassName() {
        return "FlowGraphSetPhysicsMotionTypeBlock" /* FlowGraphBlockNames.PhysicsSetMotionType */;
    }
}
let _Registered = false;
/**
 * Register side effects for flowGraphSetPhysicsMotionTypeBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterFlowGraphSetPhysicsMotionTypeBlock() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    RegisterClass("FlowGraphSetPhysicsMotionTypeBlock" /* FlowGraphBlockNames.PhysicsSetMotionType */, FlowGraphSetPhysicsMotionTypeBlock);
}
//# sourceMappingURL=flowGraphSetPhysicsMotionTypeBlock.pure.js.map