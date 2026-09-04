/** This file must only contain pure code and pure imports */
import { GetFlowGraphAssetWithType } from "../../flowGraphAssetsContext.js";
import { FlowGraphBlock } from "../../flowGraphBlock.js";
import { RichTypeAny } from "../../flowGraphRichTypes.pure.js";
import { FlowGraphInteger } from "../../CustomTypes/flowGraphInteger.pure.js";
import { getNumericValue } from "../../utils.js";
import { RegisterClass } from "../../../Misc/typeStore.js";
/**
 * A block that will deliver an asset as an output, based on its type and place in the assets index.
 *
 * The assets are loaded from the assetsContext defined in the context running this block. The assetsContext is a class extending AbstractClass,
 * meaning it can be a Scene, an AssetsContainers, and any other class that extends AbstractClass.
 */
export class FlowGraphGetAssetBlock extends FlowGraphBlock {
    constructor(
    /**
     * the configuration of the block
     */
    config) {
        super(config);
        this.config = config;
        this.type = this.registerDataInput("type", RichTypeAny, config.type);
        this.value = this.registerDataOutput("value", RichTypeAny);
        this.index = this.registerDataInput("index", RichTypeAny, new FlowGraphInteger(getNumericValue(config.index ?? -1)));
    }
    _updateOutputs(context) {
        const type = this.type.getValue(context);
        const index = this.index.getValue(context);
        // get the asset from the context
        const asset = GetFlowGraphAssetWithType(context.assetsContext, type, getNumericValue(index), this.config.useIndexAsUniqueId);
        this.value.setValue(asset, context);
    }
    /**
     * Gets the class name of this block
     * @returns the class name
     */
    getClassName() {
        return "FlowGraphGetAssetBlock" /* FlowGraphBlockNames.GetAsset */;
    }
}
let _Registered = false;
/**
 * Register side effects for flowGraphGetAssetBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterFlowGraphGetAssetBlock() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    RegisterClass("FlowGraphGetAssetBlock" /* FlowGraphBlockNames.GetAsset */, FlowGraphGetAssetBlock);
}
//# sourceMappingURL=flowGraphGetAssetBlock.pure.js.map