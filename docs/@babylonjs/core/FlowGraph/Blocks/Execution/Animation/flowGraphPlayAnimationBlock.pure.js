/** This file must only contain pure code and pure imports */
import { FlowGraphAsyncExecutionBlock } from "../../../flowGraphAsyncExecutionBlock.js";
import { RichTypeAny, RichTypeNumber, RichTypeBoolean } from "../../../flowGraphRichTypes.pure.js";
import { AnimationGroup } from "../../../../Animations/animationGroup.pure.js";
import { RegisterClass } from "../../../../Misc/typeStore.js";
/**
 * @experimental
 * A block that plays an animation on an animatable object.
 */
export class FlowGraphPlayAnimationBlock extends FlowGraphAsyncExecutionBlock {
    constructor(
    /**
     * the configuration of the block
     */
    config) {
        super(config, ["animationLoop", "animationEnd", "animationGroupLoop"]);
        this.config = config;
        this.speed = this.registerDataInput("speed", RichTypeNumber);
        this.loop = this.registerDataInput("loop", RichTypeBoolean);
        this.from = this.registerDataInput("from", RichTypeNumber, 0);
        this.to = this.registerDataInput("to", RichTypeNumber);
        this.currentFrame = this.registerDataOutput("currentFrame", RichTypeNumber);
        this.currentTime = this.registerDataOutput("currentTime", RichTypeNumber);
        this.currentAnimationGroup = this.registerDataOutput("currentAnimationGroup", RichTypeAny);
        this.animationGroup = this.registerDataInput("animationGroup", RichTypeAny, config?.animationGroup);
        this.animation = this.registerDataInput("animation", RichTypeAny);
        this.object = this.registerDataInput("object", RichTypeAny);
    }
    /**
     * @internal
     * @param context
     */
    _startPendingTasks(context) {
        if (context._getExecutionVariable(this, "_initialized", false)) {
            this._cancelPendingTasks(context);
            this._resetAfterCanceled(context);
        }
        if (!this._tryPreparePendingTasks(context)) {
            return;
        }
        context._addPendingBlock(this);
        this.out._activateSignal(context);
        context._setExecutionVariable(this, "_initialized", true);
    }
    /**
     * @internal
     * @param context the graph context
     */
    _preparePendingTasks(context) {
        this._tryPreparePendingTasks(context);
    }
    /**
     * Prepares and starts the animation, reporting whether it could be started. Invalid inputs
     * activate `err` and return false, so the caller neither activates `out` nor registers the
     * block as pending.
     * @param context the graph context
     * @returns whether the animation was prepared and started successfully
     */
    _tryPreparePendingTasks(context) {
        const ag = this.animationGroup.getValue(context);
        const animation = this.animation.getValue(context);
        if (!ag && !animation) {
            this._reportError(context, "No animation or animation group provided");
            return false;
        }
        else {
            // if an animation group was already created, dispose it and create a new one
            const currentAnimationGroup = this.currentAnimationGroup.getValue(context);
            if (currentAnimationGroup && currentAnimationGroup !== ag) {
                currentAnimationGroup.dispose();
            }
            let animationGroupToUse = ag;
            let isInterpolation = false;
            let interpolationAnimationsArray;
            let interpolationTarget;
            // check which animation to use. If no animationGroup was defined and an animation was provided, use the animation
            if (animation && !animationGroupToUse) {
                const target = this.object.getValue(context);
                if (!target) {
                    this._reportError(context, "No target object provided");
                    return false;
                }
                const animationsArray = Array.isArray(animation) ? animation : [animation];
                const name = animationsArray[0].name;
                animationGroupToUse = new AnimationGroup("flowGraphAnimationGroup-" + name + "-" + target.name, context.configuration.scene);
                const interpolationAnimations = context._getGlobalContextVariable("interpolationAnimations", []);
                for (const anim of animationsArray) {
                    animationGroupToUse.addTargetedAnimation(anim, target);
                    if (interpolationAnimations.indexOf(anim.uniqueId) !== -1) {
                        isInterpolation = true;
                    }
                }
                interpolationAnimationsArray = animationsArray;
                interpolationTarget = target;
            }
            // not accepting 0
            const speed = this.speed.getValue(context) || 1;
            const from = this.from.getValue(context) ?? 0;
            // Read the raw end time before it is defaulted to the animation group's natural end, so that an
            // explicitly provided NaN end time can still be detected by the animation/start validation below.
            const rawTo = this.to.getValue(context);
            // not accepting 0
            const to = rawTo || animationGroupToUse.to;
            // Input validation. Only applies to animation-group playback
            // (animation/start); interpolation uses the `animation` input and has its own validation below.
            // The operation activates its `err` flow when the speed is NaN, infinite, or <= 0, or
            // when the end time is NaN. A NaN or infinite start time is caught by the finite check on `from`.
            if (!animation) {
                if (isNaN(rawTo)) {
                    this._reportError(context, "Invalid animation end time");
                    return false;
                }
                // Only validate a speed that was explicitly provided; an unconnected speed keeps the engine
                // default of 1 (matching the historical Babylon behavior for animation/start without a speed).
                if (this.speed.isConnected() || context._hasConnectionValue(this.speed)) {
                    const providedSpeed = this.speed.getValue(context);
                    if (!isFinite(providedSpeed) || providedSpeed <= 0) {
                        this._reportError(context, "Invalid animation speed");
                        return false;
                    }
                }
            }
            // The start value (interpolation start frame / animation start time) must always be finite. For
            // animation/start this also satisfies the spec requirement that a NaN or infinite start time
            // activates the err flow.
            if (!isFinite(from)) {
                this._reportError(context, "Invalid animation duration");
                return false;
            }
            // For interpolation the end value is the animation duration and must be a finite, non-negative number.
            // Animation-group playback (animation/start) instead allows an infinite end time — it means "play to
            // the natural end / loop" (see the `loop` computation below) — and its NaN end time was already
            // rejected above, so the end value is only range-checked here for the interpolation case.
            if (animation && (!isFinite(to) || to < 0)) {
                this._reportError(context, "Invalid animation duration");
                return false;
            }
            // CSS cubic-bezier control points must be finite, and the X components must be in [0, 1].
            if (animation) {
                const animationsArray = Array.isArray(animation) ? animation : [animation];
                for (const anim of animationsArray) {
                    const easing = anim.getEasingFunction?.();
                    if (easing && "x1" in easing) {
                        const bezier = easing;
                        if (!Number.isFinite(bezier.x1) ||
                            !Number.isFinite(bezier.y1) ||
                            !Number.isFinite(bezier.x2) ||
                            !Number.isFinite(bezier.y2) ||
                            bezier.x1 < 0 ||
                            bezier.x1 > 1 ||
                            bezier.x2 < 0 ||
                            bezier.x2 > 1) {
                            this._reportError(context, "Invalid bezier curve control points");
                            return false;
                        }
                    }
                }
            }
            // Stop any interpolation already running on the same target/property, but only after validation has
            // passed. An invalid interpolation (bad duration or NaN control points) must report [err] without
            // disturbing an interpolation that is already running on the same target.
            if (isInterpolation && interpolationAnimationsArray && interpolationTarget !== undefined) {
                this._checkInterpolationDuplications(context, interpolationAnimationsArray, interpolationTarget);
            }
            const loop = !isFinite(to) || this.loop.getValue(context);
            this.currentAnimationGroup.setValue(animationGroupToUse, context);
            const currentlyRunningAnimationGroups = context._getGlobalContextVariable("currentlyRunningAnimationGroups", []);
            // check if it already running
            if (currentlyRunningAnimationGroups.indexOf(animationGroupToUse.uniqueId) !== -1) {
                animationGroupToUse.stop();
            }
            try {
                animationGroupToUse.start(loop, speed, from, to);
                animationGroupToUse.onAnimationGroupEndObservable.add(() => this._onAnimationGroupEnd(context));
                animationGroupToUse.onAnimationEndObservable.add(() => this._eventsSignalOutputs["animationEnd"]._activateSignal(context));
                animationGroupToUse.onAnimationLoopObservable.add(() => this._eventsSignalOutputs["animationLoop"]._activateSignal(context));
                animationGroupToUse.onAnimationGroupLoopObservable.add(() => this._eventsSignalOutputs["animationGroupLoop"]._activateSignal(context));
                currentlyRunningAnimationGroups.push(animationGroupToUse.uniqueId);
                context._setGlobalContextVariable("currentlyRunningAnimationGroups", currentlyRunningAnimationGroups);
            }
            catch (e) {
                this._reportError(context, e);
                return false;
            }
            return true;
        }
    }
    _reportError(context, error) {
        super._reportError(context, error);
        this.currentFrame.setValue(-1, context);
        this.currentTime.setValue(-1, context);
    }
    /**
     * @internal
     */
    _executeOnTick(_context) {
        const ag = this.currentAnimationGroup.getValue(_context);
        if (ag) {
            this.currentFrame.setValue(ag.getCurrentFrame(), _context);
            this.currentTime.setValue(ag.animatables[0]?.elapsedTime ?? 0, _context);
        }
    }
    _execute(context) {
        this._startPendingTasks(context);
    }
    _onAnimationGroupEnd(context) {
        this._removeFromCurrentlyRunning(context, this.currentAnimationGroup.getValue(context));
        this._resetAfterCanceled(context);
        this.done._activateSignal(context);
    }
    /**
     * The idea behind this function is to check every running animation group and check if the targeted animations it uses are interpolation animations.
     * If they are, we want to see that they don't collide with the current interpolation animations that are starting to play.
     * If they do, we want to stop the already-running animation group.
     * @internal
     */
    _checkInterpolationDuplications(context, animation, target) {
        const currentlyRunningAnimationGroups = context._getGlobalContextVariable("currentlyRunningAnimationGroups", []);
        for (const uniqueId of currentlyRunningAnimationGroups) {
            const ag = context.assetsContext.animationGroups.find((ag) => ag.uniqueId === uniqueId);
            if (ag) {
                for (const anim of ag.targetedAnimations) {
                    for (const animToCheck of animation) {
                        if (anim.animation.targetProperty === animToCheck.targetProperty && anim.target === target) {
                            this._stopAnimationGroup(context, ag);
                        }
                    }
                }
            }
        }
    }
    _stopAnimationGroup(context, animationGroup) {
        // stop, while skipping the on AnimationEndObservable to avoid the "done" signal
        animationGroup.stop(true);
        // Only dispose animation groups that were internally created by this block
        // (i.e. built from individual animations). Scene-provided animation groups
        // must not be disposed as that removes them from the scene catalog and
        // breaks the editor dropdown / re-use on replay.
        if (animationGroup.name.startsWith("flowGraphAnimationGroup-")) {
            animationGroup.dispose();
        }
        this._removeFromCurrentlyRunning(context, animationGroup);
    }
    _removeFromCurrentlyRunning(context, animationGroup) {
        const currentlyRunningAnimationGroups = context._getGlobalContextVariable("currentlyRunningAnimationGroups", []);
        const idx = currentlyRunningAnimationGroups.indexOf(animationGroup.uniqueId);
        if (idx !== -1) {
            currentlyRunningAnimationGroups.splice(idx, 1);
            context._setGlobalContextVariable("currentlyRunningAnimationGroups", currentlyRunningAnimationGroups);
        }
    }
    /**
     * @internal
     * Stop any currently running animations.
     */
    _cancelPendingTasks(context) {
        const ag = this.currentAnimationGroup.getValue(context);
        if (ag) {
            this._stopAnimationGroup(context, ag);
        }
    }
    /**
     * @returns class name of the block.
     */
    getClassName() {
        return "FlowGraphPlayAnimationBlock" /* FlowGraphBlockNames.PlayAnimation */;
    }
}
let _Registered = false;
/**
 * Register side effects for flowGraphPlayAnimationBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterFlowGraphPlayAnimationBlock() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    RegisterClass("FlowGraphPlayAnimationBlock" /* FlowGraphBlockNames.PlayAnimation */, FlowGraphPlayAnimationBlock);
}
//# sourceMappingURL=flowGraphPlayAnimationBlock.pure.js.map