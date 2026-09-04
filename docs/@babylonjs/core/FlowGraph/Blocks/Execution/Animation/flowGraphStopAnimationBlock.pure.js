/** This file must only contain pure code and pure imports */
import { RichTypeAny, RichTypeNumber } from "../../../flowGraphRichTypes.pure.js";
import { Logger } from "../../../../Misc/logger.js";
import { FlowGraphAsyncExecutionBlock } from "../../../flowGraphAsyncExecutionBlock.js";
import { RegisterClass } from "../../../../Misc/typeStore.js";
/**
 * @experimental
 * Block that stops a running animation
 */
export class FlowGraphStopAnimationBlock extends FlowGraphAsyncExecutionBlock {
    constructor(config) {
        super(config);
        this.animationGroup = this.registerDataInput("animationGroup", RichTypeAny);
        this.stopAtFrame = this.registerDataInput("stopAtFrame", RichTypeNumber, -1);
    }
    _preparePendingTasks(context) {
        const animationToStopValue = this.animationGroup.getValue(context);
        const stopAtFrame = this.stopAtFrame.getValue(context) ?? -1;
        // get the context variable
        const pendingStopAnimations = context._getGlobalContextVariable("pendingStopAnimations", []);
        // add the animation to the list
        pendingStopAnimations.push({ uniqueId: animationToStopValue.uniqueId, stopAtFrame });
        // set the global context variable
        context._setGlobalContextVariable("pendingStopAnimations", pendingStopAnimations);
    }
    _cancelPendingTasks(context) {
        // remove the animation from the list
        const animationToStopValue = this.animationGroup.getValue(context);
        const pendingStopAnimations = context._getGlobalContextVariable("pendingStopAnimations", []);
        for (let i = 0; i < pendingStopAnimations.length; i++) {
            if (pendingStopAnimations[i].uniqueId === animationToStopValue.uniqueId) {
                pendingStopAnimations.splice(i, 1);
                // set the global context variable
                context._setGlobalContextVariable("pendingStopAnimations", pendingStopAnimations);
                break;
            }
        }
    }
    _execute(context) {
        const animationToStopValue = this.animationGroup.getValue(context);
        const stopTime = this.stopAtFrame.getValue(context) ?? -1;
        // check the values
        if (!animationToStopValue) {
            Logger.Warn("No animation group provided to stop.");
            return this._reportError(context, "No animation group provided to stop.");
        }
        if (isNaN(stopTime)) {
            return this._reportError(context, "Invalid stop time.");
        }
        if (stopTime > 0) {
            this._startPendingTasks(context);
        }
        else {
            this._stopAnimation(animationToStopValue, context);
        }
        // note that out will not be triggered in case of an error
        this.out._activateSignal(context);
    }
    _executeOnTick(context) {
        const animationToStopValue = this.animationGroup.getValue(context);
        // check each frame if any animation should be stopped
        const pendingStopAnimations = context._getGlobalContextVariable("pendingStopAnimations", []);
        for (let i = 0; i < pendingStopAnimations.length; i++) {
            // compare the uniqueId to the animation to stop
            if (pendingStopAnimations[i].uniqueId === animationToStopValue.uniqueId) {
                // check if the current frame is AFTER the stopAtFrame
                if (animationToStopValue.getCurrentFrame() >= pendingStopAnimations[i].stopAtFrame) {
                    // stop the animation
                    this._stopAnimation(animationToStopValue, context);
                    // remove the animation from the list
                    pendingStopAnimations.splice(i, 1);
                    // set the global context variable
                    context._setGlobalContextVariable("pendingStopAnimations", pendingStopAnimations);
                    this.done._activateSignal(context);
                    context._removePendingBlock(this);
                    break;
                }
            }
        }
    }
    /**
     * @returns class name of the block.
     */
    getClassName() {
        return "FlowGraphStopAnimationBlock" /* FlowGraphBlockNames.StopAnimation */;
    }
    _stopAnimation(animationGroup, context) {
        const currentlyRunning = context._getGlobalContextVariable("currentlyRunningAnimationGroups", []);
        const index = currentlyRunning.indexOf(animationGroup.uniqueId);
        if (index !== -1) {
            // Skip the animation-end observable so that stopping does not activate the originating
            // starting block's `done` flow. When an animation is
            // stopped (animation/stop or animation/stopAt) the previously associated `done` flows MUST NOT be
            // activated; only animation/stopAt's own `done` flow (fired from _executeOnTick) should run.
            animationGroup.stop(true);
            currentlyRunning.splice(index, 1);
            // update the global context variable
            context._setGlobalContextVariable("currentlyRunningAnimationGroups", currentlyRunning);
        }
        else {
            // Logger.Warn("Trying to stop an animation that is not running.");
            // no-op for now. Probably no need to log anything here.
        }
    }
}
let _Registered = false;
/**
 * Register side effects for flowGraphStopAnimationBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterFlowGraphStopAnimationBlock() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    RegisterClass("FlowGraphStopAnimationBlock" /* FlowGraphBlockNames.StopAnimation */, FlowGraphStopAnimationBlock);
}
//# sourceMappingURL=flowGraphStopAnimationBlock.pure.js.map