/** This file must only contain pure code and pure imports */
import { type AbstractMesh } from "../../../Meshes/abstractMesh.pure.js";
import { FlowGraphEventBlock } from "../../flowGraphEventBlock.js";
import { type PointerInfo } from "../../../Events/pointerEvents.js";
import { type FlowGraphContext } from "../../flowGraphContext.js";
import { type IFlowGraphBlockConfiguration } from "../../flowGraphBlock.js";
import { type FlowGraphDataConnection } from "../../flowGraphDataConnection.pure.js";
import { type Vector3 } from "../../../Maths/math.vector.pure.js";
import { FlowGraphEventType } from "../../flowGraphEventType.js";
import { type Nullable } from "../../../types.js";
/**
 * Configuration for the pointer move event block.
 */
export interface IFlowGraphPointerMoveEventBlockConfiguration extends IFlowGraphBlockConfiguration {
    /**
     * Should this block stop propagation of the event to other listeners.
     */
    stopPropagation?: boolean;
    /**
     * Optional mesh to filter events to. If set, the block only fires when the pointer
     * is moving over this mesh or a descendant of it. If not set, fires on any pointer move.
     */
    targetMesh?: AbstractMesh;
}
/**
 * A pointer move event block.
 * This block fires when the pointer moves.
 * Optionally filters to a specific mesh via the `targetMesh` input.
 */
export declare class FlowGraphPointerMoveEventBlock extends FlowGraphEventBlock {
    /**
     * Optional input connection: restrict firing to when the pointer is over this mesh (and its descendants).
     * Leave disconnected to fire on any pointer move.
     */
    readonly targetMesh: FlowGraphDataConnection<AbstractMesh>;
    /**
     * Output connection: The id of the pointer that triggered the event.
     */
    readonly pointerId: FlowGraphDataConnection<number>;
    /**
     * Output connection: The mesh currently under the pointer (if any).
     */
    readonly meshUnderPointer: FlowGraphDataConnection<Nullable<AbstractMesh>>;
    /**
     * Output connection: The world-space point under the pointer (if any).
     */
    readonly pickedPoint: FlowGraphDataConnection<Nullable<Vector3>>;
    /** @internal */
    readonly type: FlowGraphEventType;
    /**
     * Creates a new FlowGraphPointerMoveEventBlock.
     * @param config optional configuration
     */
    constructor(config?: IFlowGraphPointerMoveEventBlockConfiguration);
    /** @internal */
    _executeEvent(context: FlowGraphContext, pointerInfo: PointerInfo): boolean;
    /** @internal */
    _preparePendingTasks(_context: FlowGraphContext): void;
    /** @internal */
    _cancelPendingTasks(_context: FlowGraphContext): void;
    /**
     * @returns the class name of the block.
     */
    getClassName(): string;
}
/**
 * Register side effects for flowGraphPointerMoveEventBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterFlowGraphPointerMoveEventBlock(): void;
