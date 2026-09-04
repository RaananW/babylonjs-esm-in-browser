/** This file must only contain pure code and pure imports */
import { type AssetType, type FlowGraphAssetType } from "../../flowGraphAssetsContext.js";
import { type IFlowGraphBlockConfiguration, FlowGraphBlock } from "../../flowGraphBlock.js";
import { type FlowGraphContext } from "../../flowGraphContext.js";
import { type FlowGraphDataConnection } from "../../flowGraphDataConnection.pure.js";
import { type Nullable } from "../../../types.js";
import { FlowGraphInteger } from "../../CustomTypes/flowGraphInteger.pure.js";
import { type FlowGraphNumber } from "../../utils.js";
/**
 * Configuration for the get asset block.
 */
export interface IFlowGraphGetAssetBlockConfiguration<T> extends IFlowGraphBlockConfiguration {
    /**
     * The type of the asset that will be retrieved.
     */
    type: T;
    /**
     * The index of the asset in the corresponding array in the assets context.
     * If not provided you can still change it using the input connection.
     */
    index?: number | FlowGraphInteger;
    /**
     * If set to true, instead of the index in the array it will search for the unique id of the asset.
     * The value of index will be used as the unique id.
     */
    useIndexAsUniqueId?: boolean;
}
/**
 * A block that will deliver an asset as an output, based on its type and place in the assets index.
 *
 * The assets are loaded from the assetsContext defined in the context running this block. The assetsContext is a class extending AbstractClass,
 * meaning it can be a Scene, an AssetsContainers, and any other class that extends AbstractClass.
 */
export declare class FlowGraphGetAssetBlock<T extends FlowGraphAssetType> extends FlowGraphBlock {
    /**
     * the configuration of the block
     */
    config: IFlowGraphGetAssetBlockConfiguration<T>;
    /**
     * Output connection: The value of the property.
     */
    readonly value: FlowGraphDataConnection<Nullable<AssetType<T>>>;
    /**
     * Input connection: The type of the asset.
     */
    readonly type: FlowGraphDataConnection<T>;
    /**
     * Input connection: The index of the asset in the corresponding array in the assets context.
     */
    readonly index: FlowGraphDataConnection<FlowGraphNumber>;
    constructor(
    /**
     * the configuration of the block
     */
    config: IFlowGraphGetAssetBlockConfiguration<T>);
    _updateOutputs(context: FlowGraphContext): void;
    /**
     * Gets the class name of this block
     * @returns the class name
     */
    getClassName(): string;
}
/**
 * Register side effects for flowGraphGetAssetBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterFlowGraphGetAssetBlock(): void;
