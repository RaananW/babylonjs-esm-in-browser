/** This file must only contain pure code and pure imports */
import { FlowGraphExecutionBlockWithOutSignal } from "../../../flowGraphExecutionBlockWithOutSignal.js";
import { RichTypeAny, RichTypeVector3 } from "../../../flowGraphRichTypes.pure.js";
import { RegisterClass } from "../../../../Misc/typeStore.js";
/**
 * @experimental
 * A block that applies a force to a physics body at a given location.
 */
export class FlowGraphApplyForceBlock extends FlowGraphExecutionBlockWithOutSignal {
    /**
     * Constructs a new FlowGraphApplyForceBlock.
     * @param config - optional configuration for the block
     */
    constructor(config) {
        super(config);
        this.body = this.registerDataInput("body", RichTypeAny);
        this.force = this.registerDataInput("force", RichTypeVector3);
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
        const forceVec = this.force.getValue(context);
        const locationVec = this.location.getValue(context);
        physicsBody.applyForce(forceVec, locationVec);
        this.out._activateSignal(context);
    }
    /**
     * @returns class name of the block.
     */
    getClassName() {
        return "FlowGraphApplyForceBlock" /* FlowGraphBlockNames.PhysicsApplyForce */;
    }
}
let _Registered = false;
/**
 * Register side effects for flowGraphApplyForceBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterFlowGraphApplyForceBlock() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    RegisterClass("FlowGraphApplyForceBlock" /* FlowGraphBlockNames.PhysicsApplyForce */, FlowGraphApplyForceBlock);
}
//# sourceMappingURL=flowGraphApplyForceBlock.pure.js.map