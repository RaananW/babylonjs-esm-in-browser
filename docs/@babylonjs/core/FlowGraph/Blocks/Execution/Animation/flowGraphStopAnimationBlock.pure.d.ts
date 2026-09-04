/** This file must only contain pure code and pure imports */
import { type FlowGraphContext } from "../../../flowGraphContext.js";
import { type FlowGraphDataConnection } from "../../../flowGraphDataConnection.pure.js";
import { type IFlowGraphBlockConfiguration } from "../../../flowGraphBlock.js";
import { type AnimationGroup } from "../../../../Animations/animationGroup.pure.js";
import { FlowGraphAsyncExecutionBlock } from "../../../flowGraphAsyncExecutionBlock.js";
/**
 * @experimental
 * Block that stops a running animation
 */
export declare class FlowGraphStopAnimationBlock extends FlowGraphAsyncExecutionBlock {
    /**
     * Input connection: The animation to stop.
     */
    readonly animationGroup: FlowGraphDataConnection<AnimationGroup>;
    /**
     * Input connection - if defined (positive integer) the animation will stop at this frame.
     */
    readonly stopAtFrame: FlowGraphDataConnection<number>;
    constructor(config?: IFlowGraphBlockConfiguration);
    _preparePendingTasks(context: FlowGraphContext): void;
    _cancelPendingTasks(context: FlowGraphContext): void;
    _execute(context: FlowGraphContext): void;
    _executeOnTick(context: FlowGraphContext): void;
    /**
     * @returns class name of the block.
     */
    getClassName(): string;
    private _stopAnimation;
}
/**
 * Register side effects for flowGraphStopAnimationBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterFlowGraphStopAnimationBlock(): void;
