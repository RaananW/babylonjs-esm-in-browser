/** This file must only contain pure code and pure imports */
import { FlowGraphExecutionBlockWithOutSignal } from "../../../flowGraphExecutionBlockWithOutSignal.js";
import { RichTypeAny, RichTypeVector3 } from "../../../flowGraphRichTypes.pure.js";
import { RegisterClass } from "../../../../Misc/typeStore.js";
/**
 * @experimental
 * A block that sets the linear velocity of a physics body.
 */
export class FlowGraphSetLinearVelocityBlock extends FlowGraphExecutionBlockWithOutSignal {
    /**
     * Constructs a new FlowGraphSetLinearVelocityBlock.
     * @param config - optional configuration for the block
     */
    constructor(config) {
        super(config);
        this.body = this.registerDataInput("body", RichTypeAny);
        this.velocity = this.registerDataInput("velocity", RichTypeVector3);
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
        physicsBody.setLinearVelocity(this.velocity.getValue(context));
        this.out._activateSignal(context);
    }
    /**
     * @returns class name of the block.
     */
    getClassName() {
        return "FlowGraphSetLinearVelocityBlock" /* FlowGraphBlockNames.PhysicsSetLinearVelocity */;
    }
}
let _Registered = false;
/**
 * Register side effects for flowGraphSetLinearVelocityBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterFlowGraphSetLinearVelocityBlock() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    RegisterClass("FlowGraphSetLinearVelocityBlock" /* FlowGraphBlockNames.PhysicsSetLinearVelocity */, FlowGraphSetLinearVelocityBlock);
}
//# sourceMappingURL=flowGraphSetLinearVelocityBlock.pure.js.map