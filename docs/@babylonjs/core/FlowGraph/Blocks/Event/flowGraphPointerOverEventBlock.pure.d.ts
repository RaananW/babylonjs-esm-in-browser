/** This file must only contain pure code and pure imports */
import { type FlowGraphContext } from "../../flowGraphContext.js";
import { FlowGraphEventBlock } from "../../flowGraphEventBlock.js";
import { FlowGraphEventType } from "../../flowGraphEventType.js";
import { FlowGraphBlockNames } from "../flowGraphBlockNames.js";
import { type AbstractMesh } from "../../../Meshes/abstractMesh.pure.js";
import { type FlowGraphDataConnection } from "../../flowGraphDataConnection.pure.js";
import { type IFlowGraphBlockConfiguration } from "../../flowGraphBlock.js";
/**
 * Configuration for the pointer over event block.
 */
export interface IFlowGraphPointerOverEventBlockConfiguration extends IFlowGraphBlockConfiguration {
    /**
     * Should this mesh block propagation of the event.
     */
    stopPropagation?: boolean;
    /**
     * The mesh to listen to. Can also be set by the asset input.
     */
    targetMesh?: AbstractMesh;
}
/**
 * Payload for the pointer over event.
 */
export interface IFlowGraphPointerOverEventPayload {
    /**
     * The pointer id.
     */
    pointerId: number;
    /**
     * The mesh that was picked.
     */
    mesh: AbstractMesh;
    /**
     * If populated, the hover event moved from this mesh to the `mesh` variable
     */
    out?: AbstractMesh;
}
/**
 * A pointer over event block.
 * This block can be used as an entry pointer to when a pointer is over a specific target mesh.
 */
export declare class FlowGraphPointerOverEventBlock extends FlowGraphEventBlock {
    /**
     * Output connection: The pointer id.
     */
    readonly pointerId: FlowGraphDataConnection<number>;
    /**
     * Input connection: The mesh to listen to.
     */
    readonly targetMesh: FlowGraphDataConnection<AbstractMesh>;
    /**
     * Output connection: The mesh that is under the pointer.
     */
    readonly meshUnderPointer: FlowGraphDataConnection<AbstractMesh>;
    readonly type: FlowGraphEventType;
    constructor(config?: IFlowGraphPointerOverEventBlockConfiguration);
    _executeEvent(context: FlowGraphContext, payload: IFlowGraphPointerOverEventPayload): boolean;
    _preparePendingTasks(_context: FlowGraphContext): void;
    _cancelPendingTasks(_context: FlowGraphContext): void;
    getClassName(): FlowGraphBlockNames;
}
/**
 * Register side effects for flowGraphPointerOverEventBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterFlowGraphPointerOverEventBlock(): void;
