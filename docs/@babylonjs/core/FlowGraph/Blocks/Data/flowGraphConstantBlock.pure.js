/** This file must only contain pure code and pure imports */
import { FlowGraphBlock } from "../../flowGraphBlock.js";
import { getRichTypeFromValue } from "../../flowGraphRichTypes.pure.js";
import { defaultValueSerializationFunction } from "../../serialization.js";
import { RegisterClass } from "../../../Misc/typeStore.js";
/**
 * Block that returns a constant value.
 */
export class FlowGraphConstantBlock extends FlowGraphBlock {
    constructor(
    /**
     * the configuration of the block
     */
    config) {
        super(config);
        this.config = config;
        this.output = this.registerDataOutput("output", getRichTypeFromValue(config.value));
    }
    _updateOutputs(context) {
        this.output.setValue(this.config.value, context);
    }
    /**
     * Gets the class name of this block
     * @returns the class name
     */
    getClassName() {
        return "FlowGraphConstantBlock" /* FlowGraphBlockNames.Constant */;
    }
    /**
     * Serializes this block
     * @param serializationObject the object to serialize to
     * @param valueSerializeFunction the function to use to serialize the value
     */
    serialize(serializationObject = {}, valueSerializeFunction = defaultValueSerializationFunction) {
        super.serialize(serializationObject);
        valueSerializeFunction("value", this.config.value, serializationObject.config);
    }
}
let _Registered = false;
/**
 * Register side effects for flowGraphConstantBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterFlowGraphConstantBlock() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    RegisterClass("FlowGraphConstantBlock" /* FlowGraphBlockNames.Constant */, FlowGraphConstantBlock);
}
//# sourceMappingURL=flowGraphConstantBlock.pure.js.map