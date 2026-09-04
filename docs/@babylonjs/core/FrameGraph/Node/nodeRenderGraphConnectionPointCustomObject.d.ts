import { type NodeRenderGraphConnectionPointDirection, type NodeRenderGraphBlock, type Nullable } from "../../index.js";
import { NodeRenderGraphConnectionPoint } from "./nodeRenderGraphBlockConnectionPoint.js";
import { NodeRenderGraphConnectionPointCompatibilityStates } from "./Types/nodeRenderGraphTypes.js";
/**
 * Defines a connection point to be used for points with a custom object type
 */
export declare class NodeRenderGraphConnectionPointCustomObject<T extends NodeRenderGraphBlock> extends NodeRenderGraphConnectionPoint {
    _blockType: new (...args: any[]) => T;
    private _blockName;
    /**
     * Creates a new connection point
     * @param name defines the connection point name
     * @param ownerBlock defines the block hosting this connection point
     * @param direction defines the direction of the connection point
     * @param _blockType
     * @param _blockName
     */
    constructor(name: string, ownerBlock: NodeRenderGraphBlock, direction: NodeRenderGraphConnectionPointDirection, _blockType: new (...args: any[]) => T, _blockName: string);
    checkCompatibilityState(connectionPoint: NodeRenderGraphConnectionPoint): NodeRenderGraphConnectionPointCompatibilityStates;
    createCustomInputBlock(): Nullable<[NodeRenderGraphBlock, string]>;
}
