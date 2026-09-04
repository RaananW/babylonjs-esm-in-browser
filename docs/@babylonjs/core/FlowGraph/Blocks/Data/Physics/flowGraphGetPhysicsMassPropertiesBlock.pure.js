/** This file must only contain pure code and pure imports */
import { FlowGraphBlock } from "../../../flowGraphBlock.js";
import { RichTypeAny, RichTypeNumber, RichTypeVector3 } from "../../../flowGraphRichTypes.pure.js";
import { RegisterClass } from "../../../../Misc/typeStore.js";
/**
 * @experimental
 * A data block that reads the mass properties of a physics body.
 * Outputs the mass, center of mass (local space), and principal inertia.
 */
export class FlowGraphGetPhysicsMassPropertiesBlock extends FlowGraphBlock {
    /**
     * Constructs a new FlowGraphGetPhysicsMassPropertiesBlock.
     * @param config - optional configuration for the block
     */
    constructor(config) {
        super(config);
        this.body = this.registerDataInput("body", RichTypeAny);
        this.mass = this.registerDataOutput("mass", RichTypeNumber);
        this.centerOfMass = this.registerDataOutput("centerOfMass", RichTypeVector3);
        this.inertia = this.registerDataOutput("inertia", RichTypeVector3);
    }
    /**
     * @internal
     */
    _updateOutputs(context) {
        const physicsBody = this.body.getValue(context);
        if (!physicsBody) {
            return;
        }
        const props = physicsBody.getMassProperties();
        if (props.mass !== undefined) {
            this.mass.setValue(props.mass, context);
        }
        if (props.centerOfMass) {
            this.centerOfMass.setValue(props.centerOfMass, context);
        }
        if (props.inertia) {
            this.inertia.setValue(props.inertia, context);
        }
    }
    /**
     * @returns class name of the block.
     */
    getClassName() {
        return "FlowGraphGetPhysicsMassPropertiesBlock" /* FlowGraphBlockNames.PhysicsGetMassProperties */;
    }
}
let _Registered = false;
/**
 * Register side effects for flowGraphGetPhysicsMassPropertiesBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterFlowGraphGetPhysicsMassPropertiesBlock() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    RegisterClass("FlowGraphGetPhysicsMassPropertiesBlock" /* FlowGraphBlockNames.PhysicsGetMassProperties */, FlowGraphGetPhysicsMassPropertiesBlock);
}
//# sourceMappingURL=flowGraphGetPhysicsMassPropertiesBlock.pure.js.map