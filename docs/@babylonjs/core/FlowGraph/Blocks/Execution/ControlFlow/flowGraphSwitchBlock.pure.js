/** This file must only contain pure code and pure imports */
import { FlowGraphExecutionBlock } from "../../../flowGraphExecutionBlock.js";
import { RichTypeAny } from "../../../flowGraphRichTypes.pure.js";
import { getNumericValue, isNumeric } from "../../../utils.js";
import { RegisterClass } from "../../../../Misc/typeStore.js";
/**
 * A block that executes a branch based on a selection.
 */
export class FlowGraphSwitchBlock extends FlowGraphExecutionBlock {
    constructor(
    /**
     * the configuration of the block
     */
    config) {
        super(config);
        this.config = config;
        /**
         * The default case to execute if no other case is found.
         */
        this.default = this._registerSignalOutput("default");
        this._caseToOutputFlow = new Map();
        this.case = this.registerDataInput("case", RichTypeAny);
        // iterate the set not using for of
        const array = this.config.cases || [];
        for (const caseValue of array) {
            this._caseToOutputFlow.set(caseValue, this._registerSignalOutput(`out_${caseValue}`));
        }
    }
    _execute(context, _callingSignal) {
        const selectionValue = this.case.getValue(context);
        let outputFlow;
        if (isNumeric(selectionValue)) {
            outputFlow = this._getOutputFlowForCase(getNumericValue(selectionValue));
        }
        else {
            outputFlow = this._getOutputFlowForCase(selectionValue);
        }
        if (outputFlow) {
            outputFlow._activateSignal(context);
        }
        else {
            this.default._activateSignal(context);
        }
    }
    /**
     * Adds a new case to the switch block.
     * @param newCase the new case to add.
     */
    addCase(newCase) {
        if (this.config.cases.includes(newCase)) {
            return;
        }
        this.config.cases.push(newCase);
        this._caseToOutputFlow.set(newCase, this._registerSignalOutput(`out_${newCase}`));
    }
    /**
     * Removes a case from the switch block.
     * @param caseToRemove the case to remove.
     */
    removeCase(caseToRemove) {
        if (!this.config.cases.includes(caseToRemove)) {
            return;
        }
        const index = this.config.cases.indexOf(caseToRemove);
        this.config.cases.splice(index, 1);
        this._caseToOutputFlow.delete(caseToRemove);
    }
    /**
     * @internal
     */
    _getOutputFlowForCase(caseValue) {
        return this._caseToOutputFlow.get(caseValue);
    }
    /**
     * @returns class name of the block.
     */
    getClassName() {
        return "FlowGraphSwitchBlock" /* FlowGraphBlockNames.Switch */;
    }
    /**
     * Serialize the block to a JSON representation.
     * @param serializationObject the object to serialize to.
     */
    serialize(serializationObject) {
        super.serialize(serializationObject);
        serializationObject.cases = this.config.cases;
    }
}
let _Registered = false;
/**
 * Register side effects for flowGraphSwitchBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterFlowGraphSwitchBlock() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    RegisterClass("FlowGraphSwitchBlock" /* FlowGraphBlockNames.Switch */, FlowGraphSwitchBlock);
}
//# sourceMappingURL=flowGraphSwitchBlock.pure.js.map