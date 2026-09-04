/** This file must only contain pure code and pure imports */
import { type FlowGraphContext } from "../../flowGraphContext.js";
import { FlowGraphEventBlock } from "../../flowGraphEventBlock.js";
import { FlowGraphEventType } from "../../flowGraphEventType.js";
import { FlowGraphBlockNames } from "../flowGraphBlockNames.js";
import { type AbstractMesh } from "../../../Meshes/abstractMesh.pure.js";
import { type FlowGraphDataConnection } from "../../flowGraphDataConnection.pure.js";
import { type IFlowGraphBlockConfiguration } from "../../flowGraphBlock.js";
/**
 * Configuration for the pointer out event block.
 */
export interface IFlowGraphPointerOutEventBlockConfiguration extends IFlowGraphBlockConfiguration {
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
 * Payload for the pointer out event.
 */
export interface IFlowGraphPointerOutEventPayload {
    /**
     * The pointer id.
     */
    pointerId: number;
    /**
     * The mesh that was picked.
     */
    mesh: AbstractMesh;
    /**
     * If populated, the hover event moved to this mesh from the `mesh` variable
     */
    over?: AbstractMesh;
}
/**
 * A pointe out event block.
 * This block can be used as an entry pointer to when a pointer is out of a specific target mesh.
 */
export declare class FlowGraphPointerOutEventBlock extends FlowGraphEventBlock {
    /**
     * Output connection: The pointer id.
     */
    readonly pointerId: FlowGraphDataConnection<number>;
    /**
     * Input connection: The mesh to listen to.
     */
    readonly targetMesh: FlowGraphDataConnection<AbstractMesh>;
    /**
     * Output connection: The mesh that the pointer is out of.
     */
    readonly meshOutOfPointer: FlowGraphDataConnection<AbstractMesh>;
    readonly type: FlowGraphEventType;
    constructor(config?: IFlowGraphPointerOutEventBlockConfiguration);
    _executeEvent(context: FlowGraphContext, payload: IFlowGraphPointerOutEventPayload): boolean;
    _preparePendingTasks(_context: FlowGraphContext): void;
    _cancelPendingTasks(_context: FlowGraphContext): void;
    getClassName(): FlowGraphBlockNames;
}
/**
 * Register side effects for flowGraphPointerOutEventBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterFlowGraphPointerOutEventBlock(): void;
