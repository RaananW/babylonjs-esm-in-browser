import { FlowGraphBlock } from "../../flowGraphBlock.js";
import { RichTypeBoolean } from "../../flowGraphRichTypes.pure.js";
const CacheName = "cachedOperationValue";
const CacheExecIdName = "cachedExecutionId";
/**
 * A block that will cache the result of an operation and deliver it as an output.
 */
export class FlowGraphCachedOperationBlock extends FlowGraphBlock {
    constructor(outputRichType, config) {
        super(config);
        this._outputRichType = outputRichType;
        this.value = this.registerDataOutput("value", outputRichType);
        this.isValid = this.registerDataOutput("isValid", RichTypeBoolean);
    }
    /**
     * The value delivered on the `value` output when the operation cannot produce a result.
     *
     * Defaults to the output type's default value. Override this when a block defines a different
     * value for that case, for example a polymorphic block whose output type is only known from its
     * inputs. Implementations must return a fresh value rather than a shared instance, because
     * consumers may mutate the value they receive.
     * @param _context the graph context
     * @returns the value to deliver alongside `isValid = false`
     */
    _getInvalidOutputValue(_context) {
        const defaultValue = this._outputRichType.defaultValue;
        // The rich type defaults for object types (vectors, matrices, ...) are shared instances, so
        // hand out a copy to keep a consumer from mutating the default for every other block.
        const clone = defaultValue?.clone;
        return typeof clone === "function" ? clone.call(defaultValue) : defaultValue;
    }
    _updateOutputs(context) {
        const cachedExecutionId = context._getExecutionVariable(this, CacheExecIdName, -1);
        const cachedValue = context._getExecutionVariable(this, CacheName, null);
        if (cachedValue !== undefined && cachedValue !== null && cachedExecutionId === context.executionId) {
            this.isValid.setValue(true, context);
            this.value.setValue(cachedValue, context);
        }
        else {
            try {
                const calculatedValue = this._doOperation(context);
                if (calculatedValue === undefined || calculatedValue === null) {
                    this._setInvalid(context);
                    return;
                }
                context._setExecutionVariable(this, CacheName, calculatedValue);
                context._setExecutionVariable(this, CacheExecIdName, context.executionId);
                this.value.setValue(calculatedValue, context);
                this.isValid.setValue(true, context);
            }
            catch (e) {
                this._setInvalid(context);
            }
        }
    }
    /**
     * Reports the operation as invalid. `value` is still assigned, so it never reports a stale
     * result from an earlier execution nor an undefined value on the first one.
     * @param context the graph context
     */
    _setInvalid(context) {
        this.isValid.setValue(false, context);
        this.value.setValue(this._getInvalidOutputValue(context), context);
    }
}
//# sourceMappingURL=flowGraphCachedOperationBlock.js.map