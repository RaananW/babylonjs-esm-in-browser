/** This file must only contain pure code and pure imports */
import { FlowGraphBlock } from "../../../flowGraphBlock.js";
import { RichTypeAny, RichTypeFlowGraphInteger } from "../../../flowGraphRichTypes.pure.js";
import { FlowGraphInteger } from "../../../CustomTypes/flowGraphInteger.pure.js";
import { RegisterClass } from "../../../../Misc/typeStore.js";
/**
 * This block takes an object as input and an array and returns the index of the object in the array.
 */
export class FlowGraphIndexOfBlock extends FlowGraphBlock {
    /**
     * Construct a FlowGraphIndexOfBlock.
     * @param config construction parameters
     */
    constructor(config) {
        super(config);
        this.config = config;
        this.object = this.registerDataInput("object", RichTypeAny);
        this.array = this.registerDataInput("array", RichTypeAny);
        this.index = this.registerDataOutput("index", RichTypeFlowGraphInteger, new FlowGraphInteger(-1));
    }
    /**
     * @internal
     */
    _updateOutputs(context) {
        const object = this.object.getValue(context);
        const array = this.array.getValue(context);
        if (array) {
            this.index.setValue(new FlowGraphInteger(array.indexOf(object)), context);
        }
    }
    /**
     * Serializes this block
     * @param serializationObject the object to serialize to
     */
    serialize(serializationObject) {
        super.serialize(serializationObject);
    }
    getClassName() {
        return "FlowGraphIndexOfBlock" /* FlowGraphBlockNames.IndexOf */;
    }
}
let _Registered = false;
/**
 * Register side effects for flowGraphIndexOfBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterFlowGraphIndexOfBlock() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    RegisterClass("FlowGraphIndexOfBlock" /* FlowGraphBlockNames.IndexOf */, FlowGraphIndexOfBlock);
}
//# sourceMappingURL=flowGraphIndexOfBlock.pure.js.map