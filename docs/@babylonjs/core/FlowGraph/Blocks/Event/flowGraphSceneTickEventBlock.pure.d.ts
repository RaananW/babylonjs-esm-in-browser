/** This file must only contain pure code and pure imports */
import { FlowGraphEventBlock } from "../../flowGraphEventBlock.js";
import { type FlowGraphContext } from "../../flowGraphContext.js";
import { type FlowGraphDataConnection } from "../../flowGraphDataConnection.pure.js";
import { FlowGraphEventType } from "../../flowGraphEventType.js";
/**
 * Payload for the scene tick event.
 */
export interface IFlowGraphOnTickEventPayload {
    /**
     * the time in seconds since the scene started.
     */
    timeSinceStart: number;
    /**
     * the time in seconds since the last frame.
     */
    deltaTime: number;
}
/**
 * Block that triggers on scene tick (before each render).
 */
export declare class FlowGraphSceneTickEventBlock extends FlowGraphEventBlock {
    /**
     * the time in seconds since the scene started.
     */
    readonly timeSinceStart: FlowGraphDataConnection<number>;
    /**
     * the time in seconds since the last frame.
     */
    readonly deltaTime: FlowGraphDataConnection<number>;
    /**
     * Output: the opaque reference identifying this event source.
     * All instances of this block share the same reference, so comparing the `event` output of two
     * of them for equality succeeds. The reference format is owned by the host environment.
     */
    readonly eventRef: FlowGraphDataConnection<string>;
    readonly type: FlowGraphEventType;
    constructor();
    _updateOutputs(context: FlowGraphContext): void;
    /**
     * @internal
     */
    _preparePendingTasks(_context: FlowGraphContext): void;
    /**
     * @internal
     */
    _executeEvent(context: FlowGraphContext, payload: IFlowGraphOnTickEventPayload): boolean;
    /**
     * @internal
     */
    _cancelPendingTasks(_context: FlowGraphContext): void;
    /**
     * @returns class name of the block.
     */
    getClassName(): string;
}
/**
 * Register side effects for flowGraphSceneTickEventBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterFlowGraphSceneTickEventBlock(): void;
