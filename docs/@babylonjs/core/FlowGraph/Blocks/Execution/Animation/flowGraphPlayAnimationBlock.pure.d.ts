/** This file must only contain pure code and pure imports */
import { type FlowGraphContext } from "../../../flowGraphContext.js";
import { type FlowGraphDataConnection } from "../../../flowGraphDataConnection.pure.js";
import { FlowGraphAsyncExecutionBlock } from "../../../flowGraphAsyncExecutionBlock.js";
import { type IFlowGraphBlockConfiguration } from "../../../flowGraphBlock.js";
import { AnimationGroup } from "../../../../Animations/animationGroup.pure.js";
import { type Animation } from "../../../../Animations/animation.pure.js";
/**
 * @experimental
 * A block that plays an animation on an animatable object.
 */
export declare class FlowGraphPlayAnimationBlock extends FlowGraphAsyncExecutionBlock {
    /**
     * the configuration of the block
     */
    config?: IFlowGraphBlockConfiguration | undefined;
    /**
     * Input connection: The speed of the animation.
     */
    readonly speed: FlowGraphDataConnection<number>;
    /**
     * Input connection: Should the animation loop?
     * Not in glTF specs, but useful for the engine.
     */
    readonly loop: FlowGraphDataConnection<boolean>;
    /**
     * Input connection: The starting frame of the animation.
     */
    readonly from: FlowGraphDataConnection<number>;
    /**
     * Input connection: The ending frame of the animation.
     */
    readonly to: FlowGraphDataConnection<number>;
    /**
     * Output connection: The current frame of the animation.
     */
    readonly currentFrame: FlowGraphDataConnection<number>;
    /**
     * Output connection: The current time of the animation.
     */
    readonly currentTime: FlowGraphDataConnection<number>;
    /**
     * Output connection: The animatable that is currently running.
     */
    readonly currentAnimationGroup: FlowGraphDataConnection<AnimationGroup>;
    /**
     * Input: Will be initialized if no animation group was provided in the configuration.
     */
    readonly animationGroup: FlowGraphDataConnection<AnimationGroup>;
    /**
     * Input: If provided this animation will be used. Priority will be given to the animation group input.
     */
    readonly animation: FlowGraphDataConnection<Animation | Animation[]>;
    /**
     * Input connection: The target object that will be animated. If animation group is provided this input will be ignored.
     */
    readonly object: FlowGraphDataConnection<any>;
    constructor(
    /**
     * the configuration of the block
     */
    config?: IFlowGraphBlockConfiguration | undefined);
    /**
     * @internal
     * @param context
     */
    _startPendingTasks(context: FlowGraphContext): void;
    /**
     * @internal
     * @param context the graph context
     */
    _preparePendingTasks(context: FlowGraphContext): void;
    /**
     * Prepares and starts the animation, reporting whether it could be started. Invalid inputs
     * activate `err` and return false, so the caller neither activates `out` nor registers the
     * block as pending.
     * @param context the graph context
     * @returns whether the animation was prepared and started successfully
     */
    private _tryPreparePendingTasks;
    protected _reportError(context: FlowGraphContext, error: string | Error): void;
    /**
     * @internal
     */
    _executeOnTick(_context: FlowGraphContext): void;
    _execute(context: FlowGraphContext): void;
    private _onAnimationGroupEnd;
    /**
     * The idea behind this function is to check every running animation group and check if the targeted animations it uses are interpolation animations.
     * If they are, we want to see that they don't collide with the current interpolation animations that are starting to play.
     * If they do, we want to stop the already-running animation group.
     * @internal
     */
    private _checkInterpolationDuplications;
    private _stopAnimationGroup;
    private _removeFromCurrentlyRunning;
    /**
     * @internal
     * Stop any currently running animations.
     */
    _cancelPendingTasks(context: FlowGraphContext): void;
    /**
     * @returns class name of the block.
     */
    getClassName(): string;
}
/**
 * Register side effects for flowGraphPlayAnimationBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterFlowGraphPlayAnimationBlock(): void;
