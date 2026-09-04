/** This file must only contain pure code and pure imports */
import { type AbstractMesh } from "../../../Meshes/abstractMesh.pure.js";
import { FlowGraphEventBlock } from "../../flowGraphEventBlock.js";
import { type PointerInfo, PointerEventTypes } from "../../../Events/pointerEvents.js";
import { type FlowGraphContext } from "../../flowGraphContext.js";
import { type IFlowGraphBlockConfiguration } from "../../flowGraphBlock.js";
import { type FlowGraphDataConnection } from "../../flowGraphDataConnection.pure.js";
import { type Vector3 } from "../../../Maths/math.vector.pure.js";
import { FlowGraphEventType } from "../../flowGraphEventType.js";
/**
 * Configuration for the mesh pick event block.
 */
export interface IFlowGraphMeshPickEventBlockConfiguration extends IFlowGraphBlockConfiguration {
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
 * A block that activates when a mesh is picked.
 */
export declare class FlowGraphMeshPickEventBlock extends FlowGraphEventBlock {
    /**
     * the configuration of the block
     */
    config?: IFlowGraphMeshPickEventBlockConfiguration | undefined;
    /**
     * Input connection: The mesh to listen to.
     */
    readonly asset: FlowGraphDataConnection<AbstractMesh>;
    /**
     * Output connection: The picked point.
     */
    readonly pickedPoint: FlowGraphDataConnection<Vector3>;
    /**
     * Output connection: The picked origin.
     */
    readonly pickOrigin: FlowGraphDataConnection<Vector3>;
    /**
     * Output connection: The pointer id.
     */
    readonly pointerId: FlowGraphDataConnection<number>;
    /**
     * Output connection: The picked mesh. Possibly NOT the same as the asset (could be a descendant).
     */
    readonly pickedMesh: FlowGraphDataConnection<AbstractMesh>;
    /**
     * Input connection: The type of the pointer event.
     */
    readonly pointerType: FlowGraphDataConnection<PointerEventTypes>;
    /**
     * the type of the event this block reacts to
     */
    readonly type: FlowGraphEventType;
    constructor(
    /**
     * the configuration of the block
     */
    config?: IFlowGraphMeshPickEventBlockConfiguration | undefined);
    _getReferencedMesh(context: FlowGraphContext): AbstractMesh;
    _executeEvent(context: FlowGraphContext, pickedInfo: PointerInfo): boolean;
    /**
     * @internal
     */
    _preparePendingTasks(_context: FlowGraphContext): void;
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
 * Register side effects for flowGraphMeshPickEventBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterFlowGraphMeshPickEventBlock(): void;
