/** This file must only contain pure code and pure imports */
import { FlowGraphExecutionBlockWithOutSignal } from "../../flowGraphExecutionBlockWithOutSignal.js";
import { RichTypeAny } from "../../flowGraphRichTypes.pure.js";
import { RegisterClass } from "../../../Misc/typeStore.js";
/**
 * This block will set a variable on the context.
 */
export class FlowGraphSetVariableBlock extends FlowGraphExecutionBlockWithOutSignal {
    constructor(config) {
        super(config);
        // check if the variable is an array
        if (config.variables && config.variable) {
            throw new Error("FlowGraphSetVariableBlock: variable and variables are both defined");
        }
        // check if we have either a variable or variables. If we have variables, set the inputs correctly
        if (config.variables) {
            for (const variable of config.variables) {
                this.registerDataInput(variable, RichTypeAny);
            }
        }
        else {
            this.registerDataInput("value", RichTypeAny);
        }
    }
    _execute(context, _callingSignal) {
        if (this.config?.variables) {
            for (const variable of this.config.variables) {
                this._saveVariable(context, variable);
            }
        }
        else {
            this._saveVariable(context, this.config?.variable, "value");
        }
        this.out._activateSignal(context);
    }
    _saveVariable(context, variableName, inputName) {
        // check if there is an animation(group) running on this variable. If there is, stop the animation - a value was force-set.
        const currentlyRunningAnimationGroups = context._getGlobalContextVariable("currentlyRunningAnimationGroups", []);
        for (const animationUniqueId of currentlyRunningAnimationGroups) {
            const animationGroup = context.assetsContext.animationGroups.find((animationGroup) => animationGroup.uniqueId == animationUniqueId);
            if (animationGroup) {
                // check if there is a target animation that has the target set to be the context
                for (const targetAnimation of animationGroup.targetedAnimations) {
                    // check if the target property is the variable we are setting
                    if (targetAnimation.target === context) {
                        // check the variable name
                        if (targetAnimation.animation.targetProperty === variableName) {
                            // stop the animation
                            animationGroup.stop();
                            // remove the animation from the currently running animations
                            const index = currentlyRunningAnimationGroups.indexOf(animationUniqueId);
                            if (index > -1) {
                                currentlyRunningAnimationGroups.splice(index, 1);
                            }
                            context._setGlobalContextVariable("currentlyRunningAnimationGroups", currentlyRunningAnimationGroups);
                            break;
                        }
                    }
                }
            }
        }
        const value = this.getDataInput(inputName || variableName)?.getValue(context);
        context.setVariable(variableName, value);
    }
    getClassName() {
        return "FlowGraphSetVariableBlock" /* FlowGraphBlockNames.SetVariable */;
    }
    serialize(serializationObject) {
        super.serialize(serializationObject);
        serializationObject.config.variable = this.config?.variable;
    }
}
let _Registered = false;
/**
 * Register side effects for flowGraphSetVariableBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterFlowGraphSetVariableBlock() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    RegisterClass("FlowGraphSetVariableBlock" /* FlowGraphBlockNames.SetVariable */, FlowGraphSetVariableBlock);
}
//# sourceMappingURL=flowGraphSetVariableBlock.pure.js.map