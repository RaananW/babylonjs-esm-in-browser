import { type IFlowGraphBlockConfiguration, FlowGraphBlock } from "../../flowGraphBlock.js";
import { type FlowGraphContext } from "../../flowGraphContext.js";
import { type FlowGraphDataConnection } from "../../flowGraphDataConnection.js";
import { type RichType } from "../../flowGraphRichTypes.pure.js";
/**
 * A block that will cache the result of an operation and deliver it as an output.
 */
export declare abstract class FlowGraphCachedOperationBlock<OutputT> extends FlowGraphBlock {
    /**
     * The output of the operation
     */
    readonly value: FlowGraphDataConnection<OutputT>;
    /**
     * Output connection: Whether the value is valid.
     */
    readonly isValid: FlowGraphDataConnection<boolean>;
    private readonly _outputRichType;
    constructor(outputRichType: RichType<OutputT>, config?: IFlowGraphBlockConfiguration);
    /**
     * @internal
     * Operation to realize
     * @param context the graph context
     */
    abstract _doOperation(context: FlowGraphContext): OutputT | undefined;
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
    protected _getInvalidOutputValue(_context: FlowGraphContext): OutputT;
    _updateOutputs(context: FlowGraphContext): void;
    /**
     * Reports the operation as invalid. `value` is still assigned, so it never reports a stale
     * result from an earlier execution nor an undefined value on the first one.
     * @param context the graph context
     */
    private _setInvalid;
}
