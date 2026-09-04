/** This file must only contain pure code and pure imports */
import { FlowGraphExecutionBlock } from "../../../flowGraphExecutionBlock.js";
import { RichTypeFlowGraphInteger } from "../../../flowGraphRichTypes.pure.js";
import { FlowGraphInteger } from "../../../CustomTypes/flowGraphInteger.pure.js";
import { RegisterClass } from "../../../../Misc/typeStore.js";
/**
 * A block that has an input flow and routes it to any potential output flows, randomly or sequentially
 */
export class FlowGraphMultiGateBlock extends FlowGraphExecutionBlock {
    constructor(
    /**
     * the configuration of the block
     */
    config) {
        super(config);
        this.config = config;
        /**
         * Output connections: The output signals.
         */
        this.outputSignals = [];
        this.reset = this._registerSignalInput("reset");
        this.lastIndex = this.registerDataOutput("lastIndex", RichTypeFlowGraphInteger, new FlowGraphInteger(-1));
        this.setNumberOfOutputSignals(config?.outputSignalCount);
    }
    _getNextIndex(indexesUsed) {
        // find the next index available from the indexes used array
        // if all outputs were used, reset the indexes used array if we are in a loop multi gate
        if (!indexesUsed.includes(false)) {
            if (this.config.isLoop) {
                indexesUsed.fill(false);
            }
        }
        if (!this.config.isRandom) {
            return indexesUsed.indexOf(false);
        }
        else {
            const unusedIndexes = indexesUsed.map((used, index) => (used ? -1 : index)).filter((index) => index !== -1);
            return unusedIndexes.length ? unusedIndexes[Math.floor(Math.random() * unusedIndexes.length)] : -1;
        }
    }
    /**
     * Sets the block's output signals. Would usually be passed from the constructor but can be changed afterwards.
     * @param numberOutputSignals the number of output flows
     */
    setNumberOfOutputSignals(numberOutputSignals = 1) {
        // check the size of the outFlow Array, see if it is not larger than needed
        while (this.outputSignals.length > numberOutputSignals) {
            const flow = this.outputSignals.pop();
            if (flow) {
                flow.disconnectFromAll();
                this._unregisterSignalOutput(flow.name);
            }
        }
        while (this.outputSignals.length < numberOutputSignals) {
            this.outputSignals.push(this._registerSignalOutput(`out_${this.outputSignals.length}`));
        }
    }
    _execute(context, callingSignal) {
        // set the state(s) of the block
        if (!context._hasExecutionVariable(this, "indexesUsed")) {
            context._setExecutionVariable(this, "indexesUsed", this.outputSignals.map(() => false));
        }
        if (callingSignal === this.reset) {
            context._deleteExecutionVariable(this, "indexesUsed");
            this.lastIndex.setValue(new FlowGraphInteger(-1), context);
            return;
        }
        const indexesUsed = context._getExecutionVariable(this, "indexesUsed", []);
        const nextIndex = this._getNextIndex(indexesUsed);
        if (nextIndex > -1) {
            this.lastIndex.setValue(new FlowGraphInteger(nextIndex), context);
            indexesUsed[nextIndex] = true;
            context._setExecutionVariable(this, "indexesUsed", indexesUsed);
            this.outputSignals[nextIndex]._activateSignal(context);
        }
    }
    /**
     * @returns class name of the block.
     */
    getClassName() {
        return "FlowGraphMultiGateBlock" /* FlowGraphBlockNames.MultiGate */;
    }
    /**
     * Serializes the block.
     * @param serializationObject the object to serialize to.
     */
    serialize(serializationObject) {
        super.serialize(serializationObject);
        serializationObject.config.outputSignalCount = this.config.outputSignalCount;
        serializationObject.config.isRandom = this.config.isRandom;
        serializationObject.config.loop = this.config.isLoop;
        serializationObject.config.startIndex = this.config.startIndex;
    }
}
let _Registered = false;
/**
 * Register side effects for flowGraphMultiGateBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterFlowGraphMultiGateBlock() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    RegisterClass("FlowGraphMultiGateBlock" /* FlowGraphBlockNames.MultiGate */, FlowGraphMultiGateBlock);
}
//# sourceMappingURL=flowGraphMultiGateBlock.pure.js.map