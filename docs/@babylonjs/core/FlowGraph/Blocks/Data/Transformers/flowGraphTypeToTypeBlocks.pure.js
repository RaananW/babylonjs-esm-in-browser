/** This file must only contain pure code and pure imports */
import { FlowGraphUnaryOperationBlock } from "../flowGraphUnaryOperationBlock.js";
import { RichTypeBoolean, RichTypeFlowGraphInteger, RichTypeNumber } from "../../../flowGraphRichTypes.pure.js";
import { FlowGraphInteger } from "../../../CustomTypes/flowGraphInteger.pure.js";
import { RegisterClass } from "../../../../Misc/typeStore.js";
/**
 * A block that converts a boolean to a float.
 */
export class FlowGraphBooleanToFloat extends FlowGraphUnaryOperationBlock {
    constructor(config) {
        super(RichTypeBoolean, RichTypeNumber, (a) => +a, "FlowGraphBooleanToFloat" /* FlowGraphBlockNames.BooleanToFloat */, config);
    }
}
/**
 * A block that converts a boolean to an integer
 */
export class FlowGraphBooleanToInt extends FlowGraphUnaryOperationBlock {
    constructor(config) {
        super(RichTypeBoolean, RichTypeFlowGraphInteger, (a) => FlowGraphInteger.FromValue(+a), "FlowGraphBooleanToInt" /* FlowGraphBlockNames.BooleanToInt */, config);
    }
}
/**
 * A block that converts a float to a boolean.
 */
export class FlowGraphFloatToBoolean extends FlowGraphUnaryOperationBlock {
    constructor(config) {
        super(RichTypeNumber, RichTypeBoolean, (a) => !!a, "FlowGraphFloatToBoolean" /* FlowGraphBlockNames.FloatToBoolean */, config);
    }
}
/**
 * A block that converts an integer to a boolean.
 */
export class FlowGraphIntToBoolean extends FlowGraphUnaryOperationBlock {
    constructor(config) {
        super(RichTypeFlowGraphInteger, RichTypeBoolean, (a) => !!a.value, "FlowGraphIntToBoolean" /* FlowGraphBlockNames.IntToBoolean */, config);
    }
}
/**
 * A block that converts an integer to a float.
 */
export class FlowGraphIntToFloat extends FlowGraphUnaryOperationBlock {
    constructor(config) {
        super(RichTypeFlowGraphInteger, RichTypeNumber, (a) => a.value, "FlowGraphIntToFloat" /* FlowGraphBlockNames.IntToFloat */, config);
    }
}
/**
 * A block that converts a float to an integer.
 */
export class FlowGraphFloatToInt extends FlowGraphUnaryOperationBlock {
    constructor(config) {
        super(RichTypeNumber, RichTypeFlowGraphInteger, (a) => {
            const roundingMode = config?.roundingMode;
            switch (roundingMode) {
                case "floor":
                    return FlowGraphInteger.FromValue(Math.floor(a));
                case "ceil":
                    return FlowGraphInteger.FromValue(Math.ceil(a));
                case "round":
                    return FlowGraphInteger.FromValue(Math.round(a));
                default:
                    return FlowGraphInteger.FromValue(a);
            }
        }, "FlowGraphFloatToInt" /* FlowGraphBlockNames.FloatToInt */, config);
    }
}
let _Registered = false;
/**
 * Register side effects for flowGraphTypeToTypeBlocks.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterFlowGraphTypeToTypeBlocks() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    RegisterClass("FlowGraphBooleanToFloat" /* FlowGraphBlockNames.BooleanToFloat */, FlowGraphBooleanToFloat);
    RegisterClass("FlowGraphBooleanToInt" /* FlowGraphBlockNames.BooleanToInt */, FlowGraphBooleanToInt);
    RegisterClass("FlowGraphFloatToBoolean" /* FlowGraphBlockNames.FloatToBoolean */, FlowGraphFloatToBoolean);
    RegisterClass("FlowGraphIntToBoolean" /* FlowGraphBlockNames.IntToBoolean */, FlowGraphIntToBoolean);
    RegisterClass("FlowGraphIntToFloat" /* FlowGraphBlockNames.IntToFloat */, FlowGraphIntToFloat);
    RegisterClass("FlowGraphFloatToInt" /* FlowGraphBlockNames.FloatToInt */, FlowGraphFloatToInt);
}
//# sourceMappingURL=flowGraphTypeToTypeBlocks.pure.js.map