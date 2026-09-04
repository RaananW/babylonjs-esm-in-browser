/** This file must only contain pure code and pure imports */
import { FlowGraphExecutionBlockWithOutSignal } from "../../../flowGraphExecutionBlockWithOutSignal.js";
import { RichTypeFlowGraphInteger } from "../../../flowGraphRichTypes.pure.js";
import { FlowGraphInteger } from "../../../CustomTypes/flowGraphInteger.pure.js";
import { RegisterClass } from "../../../../Misc/typeStore.js";
/**
 * A block that waits for all input flows to be activated before activating its output flow.
 */
export class FlowGraphWaitAllBlock extends FlowGraphExecutionBlockWithOutSignal {
    constructor(
    /**
     * the configuration of the block
     */
    config) {
        super(config);
        this.config = config;
        /**
         * An array of input signals
         */
        this.inFlows = [];
        this._cachedActivationState = [];
        this.reset = this._registerSignalInput("reset");
        this.completed = this._registerSignalOutput("completed");
        this.remainingInputs = this.registerDataOutput("remainingInputs", RichTypeFlowGraphInteger, new FlowGraphInteger(this.config.inputSignalCount || 0));
        // The first inFlow is the default input signal all execution blocks have
        for (let i = 0; i < this.config.inputSignalCount; i++) {
            this.inFlows.push(this._registerSignalInput(`in_${i}`));
        }
        // no need for in
        this._unregisterSignalInput("in");
    }
    _getCurrentActivationState(context) {
        const activationState = this._cachedActivationState;
        activationState.length = 0;
        if (!context._hasExecutionVariable(this, "activationState")) {
            for (let i = 0; i < this.config.inputSignalCount; i++) {
                activationState.push(false);
            }
        }
        else {
            const contextActivationState = context._getExecutionVariable(this, "activationState", []);
            for (let i = 0; i < contextActivationState.length; i++) {
                activationState.push(contextActivationState[i]);
            }
        }
        return activationState;
    }
    _execute(context, callingSignal) {
        const activationState = this._getCurrentActivationState(context);
        if (callingSignal === this.reset) {
            for (let i = 0; i < this.config.inputSignalCount; i++) {
                activationState[i] = false;
            }
        }
        else {
            const index = this.inFlows.indexOf(callingSignal);
            if (index >= 0) {
                activationState[index] = true;
            }
        }
        this.remainingInputs.setValue(new FlowGraphInteger(activationState.filter((v) => !v).length), context);
        context._setExecutionVariable(this, "activationState", activationState.slice());
        if (!activationState.includes(false)) {
            this.completed._activateSignal(context);
            for (let i = 0; i < this.config.inputSignalCount; i++) {
                activationState[i] = false;
            }
        }
        else {
            callingSignal !== this.reset && this.out._activateSignal(context);
        }
    }
    /**
     * @returns class name of the block.
     */
    getClassName() {
        return "FlowGraphWaitAllBlock" /* FlowGraphBlockNames.WaitAll */;
    }
    /**
     * Serializes this block into a object
     * @param serializationObject the object to serialize to
     */
    serialize(serializationObject) {
        super.serialize(serializationObject);
        serializationObject.config.inputFlows = this.config.inputSignalCount;
    }
}
let _Registered = false;
/**
 * Register side effects for flowGraphWaitAllBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterFlowGraphWaitAllBlock() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    RegisterClass("FlowGraphWaitAllBlock" /* FlowGraphBlockNames.WaitAll */, FlowGraphWaitAllBlock);
}
//# sourceMappingURL=flowGraphWaitAllBlock.pure.js.map