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
 * Configuration for the pointer up event block.
 */
export interface IFlowGraphPointerUpEventBlockConfiguration extends IFlowGraphBlockConfiguration {
    /**
     * Should this block stop propagation of the event to other listeners.
     */
    stopPropagation?: boolean;
    /**
     * Optional mesh to filter events to. If set, the block only fires when the pointer
     * is released over this mesh or a descendant of it. If not set, fires on any pointer up.
     */
    targetMesh?: AbstractMesh;
}
/**
 * A pointer up event block.
 * This block fires when a pointer is released (mouse button up / touch end).
 * Optionally filters to a specific mesh via the `targetMesh` input.
 */
export declare class FlowGraphPointerUpEventBlock extends FlowGraphEventBlock {
    /**
     * Optional input connection: restrict firing to this mesh (and its descendants).
     * Leave disconnected to fire on any pointer up.
     */
    readonly targetMesh: FlowGraphDataConnection<AbstractMesh>;
    /**
     * Output connection: The id of the pointer that triggered the event.
     */
    readonly pointerId: FlowGraphDataConnection<number>;
    /**
     * Output connection: The mesh that was picked (if any).
     */
    readonly pickedMesh: FlowGraphDataConnection<Nullable<AbstractMesh>>;
    /**
     * Output connection: The world-space point that was picked (if any).
     */
    readonly pickedPoint: FlowGraphDataConnection<Nullable<Vector3>>;
    /** @internal */
    readonly type: FlowGraphEventType;
    /**
     * Creates a new FlowGraphPointerUpEventBlock.
     * @param config optional configuration
     */
    constructor(config?: IFlowGraphPointerUpEventBlockConfiguration);
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
 * Register side effects for flowGraphPointerUpEventBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterFlowGraphPointerUpEventBlock(): void;
