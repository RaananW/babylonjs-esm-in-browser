/** This file must only contain pure code and pure imports */
import { type FlowGraphContext } from "../../../flowGraphContext.js";
import { type FlowGraphDataConnection } from "../../../flowGraphDataConnection.pure.js";
import { FlowGraphExecutionBlockWithOutSignal } from "../../../flowGraphExecutionBlockWithOutSignal.js";
import { type IFlowGraphBlockConfiguration } from "../../../flowGraphBlock.js";
import { type AnimationGroup } from "../../../../Animations/animationGroup.pure.js";
/**
 * @experimental
 * Block that pauses a running animation
 */
export declare class FlowGraphPauseAnimationBlock extends FlowGraphExecutionBlockWithOutSignal {
    /**
     * Input connection: The animation to pause.
     */
    readonly animationToPause: FlowGraphDataConnection<AnimationGroup>;
    constructor(config?: IFlowGraphBlockConfiguration);
    _execute(context: FlowGraphContext): void;
    /**
     * @returns class name of the block.
     */
    getClassName(): string;
}
/**
 * Register side effects for flowGraphPauseAnimationBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterFlowGraphPauseAnimationBlock(): void;
