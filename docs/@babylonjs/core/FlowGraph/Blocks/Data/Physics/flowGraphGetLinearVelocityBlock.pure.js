/** This file must only contain pure code and pure imports */
import { RichTypeAny, RichTypeVector3 } from "../../../flowGraphRichTypes.pure.js";
import { FlowGraphCachedOperationBlock } from "../flowGraphCachedOperationBlock.js";
import { Vector3 } from "../../../../Maths/math.vector.pure.js";
import { RegisterClass } from "../../../../Misc/typeStore.js";
/**
 * @experimental
 * A data block that reads the linear velocity of a physics body.
 */
export class FlowGraphGetLinearVelocityBlock extends FlowGraphCachedOperationBlock {
    /**
     * Constructs a new FlowGraphGetLinearVelocityBlock.
     * @param config - optional configuration for the block
     */
    constructor(config) {
        super(RichTypeVector3, config);
        this.body = this.registerDataInput("body", RichTypeAny);
    }
    /**
     * @internal
     */
    _doOperation(context) {
        const physicsBody = this.body.getValue(context);
        if (!physicsBody) {
            return undefined;
        }
        let result = context._getExecutionVariable(this, "_cachedVelocity", null);
        if (!result) {
            result = new Vector3();
            context._setExecutionVariable(this, "_cachedVelocity", result);
        }
        physicsBody.getLinearVelocityToRef(result);
        return result;
    }
    /**
     * @returns class name of the block.
     */
    getClassName() {
        return "FlowGraphGetLinearVelocityBlock" /* FlowGraphBlockNames.PhysicsGetLinearVelocity */;
    }
}
let _Registered = false;
/**
 * Register side effects for flowGraphGetLinearVelocityBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterFlowGraphGetLinearVelocityBlock() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    RegisterClass("FlowGraphGetLinearVelocityBlock" /* FlowGraphBlockNames.PhysicsGetLinearVelocity */, FlowGraphGetLinearVelocityBlock);
}
//# sourceMappingURL=flowGraphGetLinearVelocityBlock.pure.js.map