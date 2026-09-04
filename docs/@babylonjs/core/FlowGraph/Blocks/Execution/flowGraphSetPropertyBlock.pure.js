/** This file must only contain pure code and pure imports */
import { FlowGraphExecutionBlockWithOutSignal } from "../../flowGraphExecutionBlockWithOutSignal.js";
import { RichTypeAny, RichTypeString } from "../../flowGraphRichTypes.pure.js";
import { RegisterClass } from "../../../Misc/typeStore.js";
/**
 * This block will set a property on a given target asset.
 * The property name can include dots ("."), which will be interpreted as a path to the property.
 * The target asset is an input and can be changed at any time.
 * The value of the property is an input and can be changed at any time.
 *
 * For example, with an input of a mesh asset, the property name "position.x" will set the x component of the position of the mesh.
 *
 * Note that it is recommended to input the object on which you are working on (i.e. a material) than providing a mesh and then getting the material from it.
 */
export class FlowGraphSetPropertyBlock extends FlowGraphExecutionBlockWithOutSignal {
    constructor(
    /**
     * the configuration of the block
     */
    config) {
        super(config);
        this.config = config;
        this.object = this.registerDataInput("object", RichTypeAny, config.target);
        this.value = this.registerDataInput("value", RichTypeAny);
        this.propertyName = this.registerDataInput("propertyName", RichTypeString, config.propertyName);
        this.customSetFunction = this.registerDataInput("customSetFunction", RichTypeAny);
    }
    _execute(context, _callingSignal) {
        try {
            const target = this.object.getValue(context);
            const value = this.value.getValue(context);
            const propertyName = this.propertyName.getValue(context);
            this._stopRunningAnimations(context, target, propertyName);
            const setFunction = this.customSetFunction.getValue(context);
            if (setFunction) {
                setFunction(target, propertyName, value, context);
            }
            else {
                this._setPropertyValue(target, propertyName, value);
            }
        }
        catch (e) {
            this._reportError(context, e);
        }
        this.out._activateSignal(context);
    }
    _stopRunningAnimations(context, target, propertyName) {
        const currentlyRunningAnimationGroups = context._getGlobalContextVariable("currentlyRunningAnimationGroups", []);
        for (const uniqueId of currentlyRunningAnimationGroups) {
            const animationGroup = context.assetsContext.animationGroups.find((animationGroup) => animationGroup.uniqueId === uniqueId);
            if (animationGroup) {
                for (const targetedAnimations of animationGroup.targetedAnimations) {
                    if (targetedAnimations.target === target && targetedAnimations.animation.targetProperty === propertyName) {
                        animationGroup.stop(true);
                        animationGroup.dispose();
                        const index = currentlyRunningAnimationGroups.indexOf(uniqueId);
                        if (index !== -1) {
                            currentlyRunningAnimationGroups.splice(index, 1);
                            context._setGlobalContextVariable("currentlyRunningAnimationGroups", currentlyRunningAnimationGroups);
                        }
                    }
                }
            }
        }
    }
    _setPropertyValue(target, propertyName, value) {
        const path = propertyName.split(".");
        let obj = target;
        for (let i = 0; i < path.length - 1; i++) {
            const prop = path[i];
            if (obj[prop] === undefined) {
                obj[prop] = {};
            }
            obj = obj[prop];
        }
        obj[path[path.length - 1]] = value;
    }
    getClassName() {
        return "FlowGraphSetPropertyBlock" /* FlowGraphBlockNames.SetProperty */;
    }
}
let _Registered = false;
/**
 * Register side effects for flowGraphSetPropertyBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterFlowGraphSetPropertyBlock() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    RegisterClass("FlowGraphSetPropertyBlock" /* FlowGraphBlockNames.SetProperty */, FlowGraphSetPropertyBlock);
}
//# sourceMappingURL=flowGraphSetPropertyBlock.pure.js.map