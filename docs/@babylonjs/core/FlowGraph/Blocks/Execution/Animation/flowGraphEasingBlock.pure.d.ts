/** This file must only contain pure code and pure imports */
import { type EasingFunction } from "../../../../Animations/easing.js";
import { type IFlowGraphBlockConfiguration, FlowGraphBlock } from "../../../flowGraphBlock.js";
import { type FlowGraphContext } from "../../../flowGraphContext.js";
import { type FlowGraphDataConnection } from "../../../flowGraphDataConnection.pure.js";
/**
 * The type of the easing function.
 */
export declare enum EasingFunctionType {
    CircleEase = 0,
    BackEase = 1,
    BounceEase = 2,
    CubicEase = 3,
    ElasticEase = 4,
    ExponentialEase = 5,
    PowerEase = 6,
    QuadraticEase = 7,
    QuarticEase = 8,
    QuinticEase = 9,
    SineEase = 10,
    BezierCurveEase = 11
}
/**
 * An easing block that generates an easingFunction object based on the data provided.
 */
export declare class FlowGraphEasingBlock extends FlowGraphBlock {
    /**
     * the configuration of the block
     */
    config?: IFlowGraphBlockConfiguration | undefined;
    /**
     * Input connection: The type of the easing function.
     */
    readonly type: FlowGraphDataConnection<EasingFunctionType>;
    /**
     * Input connection: The mode of the easing function.
     * EasingFunction.EASINGMODE_EASEIN, EasingFunction.EASINGMODE_EASEOUT, EasingFunction.EASINGMODE_EASEINOUT
     */
    readonly mode: FlowGraphDataConnection<number>;
    /**
     * Input connection:parameters for easing. for example control points for BezierCurveEase.
     */
    readonly parameters: FlowGraphDataConnection<number[]>;
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
 * Register side effects for flowGraphEasingBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterFlowGraphEasingBlock(): void;
