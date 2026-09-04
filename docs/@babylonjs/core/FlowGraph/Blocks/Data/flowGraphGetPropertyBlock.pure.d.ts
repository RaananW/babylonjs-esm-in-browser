/** This file must only contain pure code and pure imports */
import { type AssetType, type FlowGraphAssetType } from "../../flowGraphAssetsContext.js";
import { type IFlowGraphBlockConfiguration } from "../../flowGraphBlock.js";
import { type FlowGraphContext } from "../../flowGraphContext.js";
import { type FlowGraphDataConnection } from "../../flowGraphDataConnection.pure.js";
import { FlowGraphCachedOperationBlock } from "./flowGraphCachedOperationBlock.js";
/**
 * Configuration for the FlowGraphGetPropertyBlock.
 */
export interface IFlowGraphGetPropertyBlockConfiguration<O extends FlowGraphAssetType> extends IFlowGraphBlockConfiguration {
    /**
     * The name of the property that will be set
     */
    propertyName?: string;
    /**
     * The target asset from which the property will be retrieved
     */
    object?: AssetType<O>;
    /**
     * If true, the block will reset the output to the default value when the target asset is undefined.
     */
    resetToDefaultWhenUndefined?: boolean;
}
/**
 * This block will deliver a property of an asset, based on the property name and an input asset.
 * The property name can include dots ("."), which will be interpreted as a path to the property.
 *
 * For example, with an input of a mesh asset, the property name "position.x" will deliver the x component of the position of the mesh.
 *
 * Note that it is recommended to input the object on which you are working on (i.e. a material) rather than providing a mesh as object and then getting the material from it.
 */
export declare class FlowGraphGetPropertyBlock<P extends any, O extends FlowGraphAssetType> extends FlowGraphCachedOperationBlock<P> {
    /**
     * the configuration of the block
     */
    config: IFlowGraphGetPropertyBlockConfiguration<O>;
    /**
     * Input connection: The asset from which the property will be retrieved
     */
    readonly object: FlowGraphDataConnection<AssetType<O>>;
    /**
     * Input connection: The name of the property that will be set
     */
    readonly propertyName: FlowGraphDataConnection<string>;
    /**
     * Input connection: A function that can be used to get the value of the property.
     * This will be used if defined, instead of the default get function.
     */
    readonly customGetFunction: FlowGraphDataConnection<(target: AssetType<O>, propertyName: string, context: FlowGraphContext) => P | undefined>;
    /**
     * Constructs a new FlowGraphGetPropertyBlock.
     * @param config - the configuration of the block
     */
    constructor(
    /**
     * the configuration of the block
     */
    config: IFlowGraphGetPropertyBlockConfiguration<O>);
    /**
     * Retrieves the property value from the target object.
     * @param context - the flow graph context
     * @returns the property value, or undefined if the target or property name is not set
     */
    _doOperation(context: FlowGraphContext): P | undefined;
    private _getPropertyValue;
    /**
     * Returns the class name of this block.
     * @returns the class name
     */
    getClassName(): string;
}
/**
 * Register side effects for flowGraphGetPropertyBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterFlowGraphGetPropertyBlock(): void;
