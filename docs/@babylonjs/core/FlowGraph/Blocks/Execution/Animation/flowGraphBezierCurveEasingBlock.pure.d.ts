/** This file must only contain pure code and pure imports */
import { type EasingFunction } from "../../../../Animations/easing.js";
import { type IFlowGraphBlockConfiguration, FlowGraphBlock } from "../../../flowGraphBlock.js";
import { type FlowGraphContext } from "../../../flowGraphContext.js";
import { type FlowGraphDataConnection } from "../../../flowGraphDataConnection.pure.js";
import { type Vector2 } from "../../../../Maths/math.vector.pure.js";
/**
 * An easing block that generates a cubic Bézier easing function based on the data provided.
 *
 * Follows CSS cubic-bezier semantics: for input progress `t`, solve the curve parameter where X
 * equals `t`, then use the corresponding Y coordinate as the eased output progress.
 */
export declare class FlowGraphBezierCurveEasingBlock extends FlowGraphBlock {
    /**
     * the configuration of the block
     */
    config?: IFlowGraphBlockConfiguration | undefined;
    /**
     * Input connection: The mode of the easing function.
     * EasingFunction.EASINGMODE_EASEIN, EasingFunction.EASINGMODE_EASEOUT, EasingFunction.EASINGMODE_EASEINOUT
     */
    readonly mode: FlowGraphDataConnection<number>;
    /**
     * Input connection: Control point 1 for bezier curve.
     */
    readonly controlPoint1: FlowGraphDataConnection<Vector2>;
    /**
     * Input connection: Control point 2 for bezier curve.
     */
    readonly controlPoint2: FlowGraphDataConnection<Vector2>;
    /**
     * Output connection: The easing function object.
     */
    readonly easingFunction: FlowGraphDataConnection<EasingFunction>;
    /**
     * Internal cache of reusable easing functions.
     * key is type-mode-properties
     */
    private _easingFunctions;
    constructor(
    /**
     * the configuration of the block
     */
    config?: IFlowGraphBlockConfiguration | undefined);
    _updateOutputs(context: FlowGraphContext): void;
    getClassName(): string;
}
/**
 * Register side effects for flowGraphBezierCurveEasingBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterFlowGraphBezierCurveEasingBlock(): void;
