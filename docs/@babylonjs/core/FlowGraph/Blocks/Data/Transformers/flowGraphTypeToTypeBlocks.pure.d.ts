/** This file must only contain pure code and pure imports */
import { type IFlowGraphBlockConfiguration } from "../../../flowGraphBlock.js";
import { FlowGraphUnaryOperationBlock } from "../flowGraphUnaryOperationBlock.js";
import { FlowGraphInteger } from "../../../CustomTypes/flowGraphInteger.pure.js";
/**
 * A block that converts a boolean to a float.
 */
export declare class FlowGraphBooleanToFloat extends FlowGraphUnaryOperationBlock<boolean, number> {
    constructor(config?: IFlowGraphBlockConfiguration);
}
/**
 * A block that converts a boolean to an integer
 */
export declare class FlowGraphBooleanToInt extends FlowGraphUnaryOperationBlock<boolean, FlowGraphInteger> {
    constructor(config?: IFlowGraphBlockConfiguration);
}
/**
 * A block that converts a float to a boolean.
 */
export declare class FlowGraphFloatToBoolean extends FlowGraphUnaryOperationBlock<number, boolean> {
    constructor(config?: IFlowGraphBlockConfiguration);
}
/**
 * A block that converts an integer to a boolean.
 */
export declare class FlowGraphIntToBoolean extends FlowGraphUnaryOperationBlock<FlowGraphInteger, boolean> {
    constructor(config?: IFlowGraphBlockConfiguration);
}
/**
 * A block that converts an integer to a float.
 */
export declare class FlowGraphIntToFloat extends FlowGraphUnaryOperationBlock<FlowGraphInteger, number> {
    constructor(config?: IFlowGraphBlockConfiguration);
}
/**
 * Configuration for the float to int block.
 */
export interface IFlowGraphFloatToIntConfiguration extends IFlowGraphBlockConfiguration {
    /**
     * The rounding mode to use.
     * if not defined, it will use the FlowGraphInteger default rounding ( a | 0 )
     */
    roundingMode?: "floor" | "ceil" | "round";
}
/**
 * A block that converts a float to an integer.
 */
export declare class FlowGraphFloatToInt extends FlowGraphUnaryOperationBlock<number, FlowGraphInteger> {
    constructor(config?: IFlowGraphFloatToIntConfiguration);
}
/**
 * Register side effects for flowGraphTypeToTypeBlocks.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterFlowGraphTypeToTypeBlocks(): void;
