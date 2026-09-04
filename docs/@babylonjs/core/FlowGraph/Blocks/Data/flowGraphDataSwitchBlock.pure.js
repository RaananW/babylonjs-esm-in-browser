/** This file must only contain pure code and pure imports */
import { FlowGraphBlock } from "../../flowGraphBlock.js";
import { RichTypeAny } from "../../flowGraphRichTypes.pure.js";
import { getNumericValue, isNumeric } from "../../utils.js";
import { RegisterClass } from "../../../Misc/typeStore.js";
/**
 * This block conditionally outputs one of its inputs, based on a condition and a list of cases.
 *
 * This of it as a passive (data) version of the switch statement in programming languages.
 */
export class FlowGraphDataSwitchBlock extends FlowGraphBlock {
    constructor(
    /**
     * the configuration of the block
     */
    config) {
        super(config);
        this.config = config;
        this._inputCases = new Map();
        this.case = this.registerDataInput("case", RichTypeAny, NaN);
        this.default = this.registerDataInput("default", RichTypeAny);
        this.value = this.registerDataOutput("value", RichTypeAny);
        // iterate the set not using for of
        const array = this.config.cases || [];
        for (let caseValue of array) {
            // if treat as integers, make sure not to set it again if it exists
            caseValue = getNumericValue(caseValue);
            if (this.config.treatCasesAsIntegers) {
                caseValue = caseValue | 0;
                if (this._inputCases.has(caseValue)) {
                    return;
                }
            }
            this._inputCases.set(caseValue, this.registerDataInput(`in_${caseValue}`, RichTypeAny));
        }
    }
    _updateOutputs(context) {
        const selectionValue = this.case.getValue(context);
        let outputValue;
        if (isNumeric(selectionValue)) {
            outputValue = this._getOutputValueForCase(getNumericValue(selectionValue), context);
        }
        if (!outputValue) {
            outputValue = this.default.getValue(context);
        }
        this.value.setValue(outputValue, context);
    }
    _getOutputValueForCase(caseValue, context) {
        return this._inputCases.get(caseValue)?.getValue(context);
    }
    getClassName() {
        return "FlowGraphDataSwitchBlock" /* FlowGraphBlockNames.DataSwitch */;
    }
}
let _Registered = false;
/**
 * Register side effects for flowGraphDataSwitchBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterFlowGraphDataSwitchBlock() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    RegisterClass("FlowGraphDataSwitchBlock" /* FlowGraphBlockNames.DataSwitch */, FlowGraphDataSwitchBlock);
}
//# sourceMappingURL=flowGraphDataSwitchBlock.pure.js.map