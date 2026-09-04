/** This file must only contain pure code and pure imports */
import { RichTypeAny, RichTypeString } from "../../flowGraphRichTypes.pure.js";
import { FlowGraphCachedOperationBlock } from "./flowGraphCachedOperationBlock.js";
import { RegisterClass } from "../../../Misc/typeStore.js";
/**
 * This block will deliver a property of an asset, based on the property name and an input asset.
 * The property name can include dots ("."), which will be interpreted as a path to the property.
 *
 * For example, with an input of a mesh asset, the property name "position.x" will deliver the x component of the position of the mesh.
 *
 * Note that it is recommended to input the object on which you are working on (i.e. a material) rather than providing a mesh as object and then getting the material from it.
 */
export class FlowGraphGetPropertyBlock extends FlowGraphCachedOperationBlock {
    /**
     * Constructs a new FlowGraphGetPropertyBlock.
     * @param config - the configuration of the block
     */
    constructor(
    /**
     * the configuration of the block
     */
    config) {
        super(RichTypeAny, config);
        this.config = config;
        this.object = this.registerDataInput("object", RichTypeAny, config.object);
        this.propertyName = this.registerDataInput("propertyName", RichTypeString, config.propertyName);
        this.customGetFunction = this.registerDataInput("customGetFunction", RichTypeAny);
    }
    /**
     * Retrieves the property value from the target object.
     * @param context - the flow graph context
     * @returns the property value, or undefined if the target or property name is not set
     */
    _doOperation(context) {
        const getter = this.customGetFunction.getValue(context);
        let value;
        if (getter) {
            value = getter(this.object.getValue(context), this.propertyName.getValue(context), context);
        }
        else {
            const target = this.object.getValue(context);
            const propertyName = this.propertyName.getValue(context);
            value = target && propertyName ? this._getPropertyValue(target, propertyName) : undefined;
        }
        return value;
    }
    _getPropertyValue(target, propertyName) {
        const path = propertyName.split(".");
        let value = target;
        for (const prop of path) {
            value = value[prop];
            if (value === undefined) {
                return;
            }
        }
        return value;
    }
    /**
     * Returns the class name of this block.
     * @returns the class name
     */
    getClassName() {
        return "FlowGraphGetPropertyBlock" /* FlowGraphBlockNames.GetProperty */;
    }
}
let _Registered = false;
/**
 * Register side effects for flowGraphGetPropertyBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterFlowGraphGetPropertyBlock() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    RegisterClass("FlowGraphGetPropertyBlock" /* FlowGraphBlockNames.GetProperty */, FlowGraphGetPropertyBlock);
}
//# sourceMappingURL=flowGraphGetPropertyBlock.pure.js.map