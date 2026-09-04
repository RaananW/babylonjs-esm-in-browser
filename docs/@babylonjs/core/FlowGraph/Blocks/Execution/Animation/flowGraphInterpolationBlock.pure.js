/** This file must only contain pure code and pure imports */

import { FlowGraphBlock } from "../../../flowGraphBlock.js";
import { getRichTypeByAnimationType, getRichTypeByFlowGraphType, RichTypeAny, RichTypeNumber, RichTypeString } from "../../../flowGraphRichTypes.pure.js";
import { AnimationCreateAnimation } from "../../../../Animations/animation.pure.js";
import { RegisterClass } from "../../../../Misc/typeStore.js";
/**
 * This block is responsible for interpolating between two values.
 * The babylon concept used is Animation, and it is the output of this block.
 *
 * Note that values will be parsed when the in connection is triggered. until then changing the value will not trigger a new interpolation.
 *
 * Internally this block uses the Animation class.
 *
 * Note that if the interpolation is already running a signal will be sent to stop the animation group running it.
 */
export class FlowGraphInterpolationBlock extends FlowGraphBlock {
    constructor(config = {}) {
        super(config);
        /**
         * The keyframes to interpolate between.
         * Each keyframe has a duration input and a value input.
         */
        this.keyFrames = [];
        const type = typeof config?.animationType === "string"
            ? getRichTypeByFlowGraphType(config.animationType)
            : getRichTypeByAnimationType(config?.animationType ?? 0);
        const numberOfKeyFrames = config?.keyFramesCount ?? 1;
        const duration = this.registerDataInput(`duration_0`, RichTypeNumber, 0);
        const value = this.registerDataInput(`value_0`, type);
        this.keyFrames.push({ duration, value });
        for (let i = 1; i < numberOfKeyFrames + 1; i++) {
            const duration = this.registerDataInput(`duration_${i}`, RichTypeNumber, i === numberOfKeyFrames ? config.duration : undefined);
            const value = this.registerDataInput(`value_${i}`, type);
            this.keyFrames.push({ duration, value });
        }
        this.initialValue = this.keyFrames[0].value;
        this.endValue = this.keyFrames[numberOfKeyFrames].value;
        this.easingFunction = this.registerDataInput("easingFunction", RichTypeAny);
        this.animation = this.registerDataOutput("animation", RichTypeAny);
        this.propertyName = this.registerDataInput("propertyName", RichTypeString, config?.propertyName);
        this.customBuildAnimation = this.registerDataInput("customBuildAnimation", RichTypeAny);
    }
    _updateOutputs(context) {
        const interpolationAnimations = context._getGlobalContextVariable("interpolationAnimations", []);
        const propertyName = this.propertyName.getValue(context);
        const easingFunction = this.easingFunction.getValue(context);
        const animation = this._createAnimation(context, propertyName, easingFunction);
        // If an old animation exists, it will be ignored here.
        // This is because if the animation is running and they both have the same target, the old will be stopped.
        // This doesn't happen here, it happens in the play animation block.
        this.animation.setValue(animation, context);
        // to make sure no 2 interpolations are running on the same target, we will mark the animation in the context
        if (Array.isArray(animation)) {
            for (const anim of animation) {
                interpolationAnimations.push(anim.uniqueId);
            }
        }
        else {
            interpolationAnimations.push(animation.uniqueId);
        }
        context._setGlobalContextVariable("interpolationAnimations", interpolationAnimations);
    }
    _createAnimation(context, propertyName, easingFunction) {
        const type = this.initialValue.richType;
        const keys = [];
        // add initial value
        const currentValue = this.initialValue.getValue(context) || type.defaultValue;
        keys.push({ frame: 0, value: currentValue });
        const numberOfKeyFrames = this.config?.numberOfKeyFrames ?? 1;
        for (let i = 1; i < numberOfKeyFrames + 1; i++) {
            const duration = this.keyFrames[i].duration?.getValue(context);
            let value = this.keyFrames[i].value?.getValue(context);
            if (i === numberOfKeyFrames - 1) {
                value = value || type.defaultValue;
            }
            if (duration !== undefined && value) {
                // convert duration to frames, based on 60 fps
                keys.push({ frame: duration * 60, value });
            }
        }
        const customBuildAnimation = this.customBuildAnimation.getValue(context);
        if (customBuildAnimation) {
            return customBuildAnimation(null, null, context)(keys, 60, type.animationType, easingFunction);
        }
        if (typeof propertyName === "string") {
            const animation = AnimationCreateAnimation(propertyName, type.animationType, 60, easingFunction);
            animation.setKeys(keys);
            return [animation];
        }
        else {
            const animations = propertyName.map((name) => {
                const animation = AnimationCreateAnimation(name, type.animationType, 60, easingFunction);
                animation.setKeys(keys);
                return animation;
            });
            return animations;
        }
    }
    getClassName() {
        return "FlowGraphInterpolationBlock" /* FlowGraphBlockNames.ValueInterpolation */;
    }
}
// #L54P2C
let _Registered = false;
/**
 * Register side effects for flowGraphInterpolationBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterFlowGraphInterpolationBlock() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    RegisterClass("FlowGraphInterpolationBlock" /* FlowGraphBlockNames.ValueInterpolation */, FlowGraphInterpolationBlock);
}
//# sourceMappingURL=flowGraphInterpolationBlock.pure.js.map