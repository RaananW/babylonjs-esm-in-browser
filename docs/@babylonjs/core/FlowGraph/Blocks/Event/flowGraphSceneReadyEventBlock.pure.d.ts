/** This file must only contain pure code and pure imports */
import { FlowGraphEventBlock } from "../../flowGraphEventBlock.js";
import { type FlowGraphContext } from "../../flowGraphContext.js";
import { type FlowGraphDataConnection } from "../../flowGraphDataConnection.pure.js";
import { FlowGraphBlockNames } from "../flowGraphBlockNames.js";
import { FlowGraphEventType } from "../../flowGraphEventType.js";
/**
 * Block that triggers when a scene is ready.
 */
export declare class FlowGraphSceneReadyEventBlock extends FlowGraphEventBlock {
    initPriority: number;
    readonly type: FlowGraphEventType;
    /**
     * Output: the opaque reference identifying this event source.
     * All instances of this block share the same reference, so comparing the `event` output of two
     * of them for equality succeeds. The reference format is owned by the host environment.
     */
    readonly eventRef: FlowGraphDataConnection<string>;
    constructor();
    _updateOutputs(context: FlowGraphContext): void;
    _executeEvent(context: FlowGraphContext, _payload: any): boolean;
    _preparePendingTasks(context: FlowGraphContext): void;
    _cancelPendingTasks(context: FlowGraphContext): void;
    /**
     * @returns class name of the block.
     */
    getClassName(): FlowGraphBlockNames;
}
/**
 * Register side effects for flowGraphSceneReadyEventBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterFlowGraphSceneReadyEventBlock(): void;
