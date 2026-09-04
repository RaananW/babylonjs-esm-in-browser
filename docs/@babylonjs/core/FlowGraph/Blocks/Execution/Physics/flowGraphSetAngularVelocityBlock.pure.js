/** This file must only contain pure code and pure imports */
import { FlowGraphExecutionBlockWithOutSignal } from "../../../flowGraphExecutionBlockWithOutSignal.js";
import { RichTypeAny, RichTypeVector3 } from "../../../flowGraphRichTypes.pure.js";
import { RegisterClass } from "../../../../Misc/typeStore.js";
/**
 * @experimental
 * A block that sets the angular velocity of a physics body.
 */
export class FlowGraphSetAngularVelocityBlock extends FlowGraphExecutionBlockWithOutSignal {
    /**
     * Constructs a new FlowGraphSetAngularVelocityBlock.
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
        physicsBody.setAngularVelocity(this.velocity.getValue(context));
        this.out._activateSignal(context);
    }
    /**
     * @returns class name of the block.
     */
    getClassName() {
        return "FlowGraphSetAngularVelocityBlock" /* FlowGraphBlockNames.PhysicsSetAngularVelocity */;
    }
}
let _Registered = false;
/**
 * Register side effects for flowGraphSetAngularVelocityBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterFlowGraphSetAngularVelocityBlock() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    RegisterClass("FlowGraphSetAngularVelocityBlock" /* FlowGraphBlockNames.PhysicsSetAngularVelocity */, FlowGraphSetAngularVelocityBlock);
}
//# sourceMappingURL=flowGraphSetAngularVelocityBlock.pure.js.map