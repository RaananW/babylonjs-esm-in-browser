/** This file must only contain pure code and pure imports */
import { FlowGraphExecutionBlockWithOutSignal } from "../../../flowGraphExecutionBlockWithOutSignal.js";
import { RichTypeAny, RichTypeVector3 } from "../../../flowGraphRichTypes.pure.js";
import { RegisterClass } from "../../../../Misc/typeStore.js";
/**
 * @experimental
 * A block that applies an impulse to a physics body at a given location.
 * Unlike a force (which is applied over time), an impulse is an instantaneous
 * change in momentum.
 */
export class FlowGraphApplyImpulseBlock extends FlowGraphExecutionBlockWithOutSignal {
    /**
     * Constructs a new FlowGraphApplyImpulseBlock.
     * @param config - optional configuration for the block
     */
    constructor(config) {
        super(config);
        this.body = this.registerDataInput("body", RichTypeAny);
        this.impulse = this.registerDataInput("impulse", RichTypeVector3);
        this.location = this.registerDataInput("location", RichTypeVector3);
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
        const impulseVec = this.impulse.getValue(context);
        const locationVec = this.location.getValue(context);
        physicsBody.applyImpulse(impulseVec, locationVec);
        this.out._activateSignal(context);
    }
    /**
     * @returns class name of the block.
     */
    getClassName() {
        return "FlowGraphApplyImpulseBlock" /* FlowGraphBlockNames.PhysicsApplyImpulse */;
    }
}
let _Registered = false;
/**
 * Register side effects for flowGraphApplyImpulseBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterFlowGraphApplyImpulseBlock() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    RegisterClass("FlowGraphApplyImpulseBlock" /* FlowGraphBlockNames.PhysicsApplyImpulse */, FlowGraphApplyImpulseBlock);
}
//# sourceMappingURL=flowGraphApplyImpulseBlock.pure.js.map