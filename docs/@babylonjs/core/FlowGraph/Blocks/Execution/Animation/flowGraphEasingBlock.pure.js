/** This file must only contain pure code and pure imports */
import { BackEase, BezierCurveEase, BounceEase, CircleEase, CubicEase, ElasticEase, ExponentialEase } from "../../../../Animations/easing.js";
import { FlowGraphBlock } from "../../../flowGraphBlock.js";
import { RichTypeAny, RichTypeNumber } from "../../../flowGraphRichTypes.pure.js";
import { RegisterClass } from "../../../../Misc/typeStore.js";
/**
 * The type of the easing function.
 */
export var EasingFunctionType;
(function (EasingFunctionType) {
    EasingFunctionType[EasingFunctionType["CircleEase"] = 0] = "CircleEase";
    EasingFunctionType[EasingFunctionType["BackEase"] = 1] = "BackEase";
    EasingFunctionType[EasingFunctionType["BounceEase"] = 2] = "BounceEase";
    EasingFunctionType[EasingFunctionType["CubicEase"] = 3] = "CubicEase";
    EasingFunctionType[EasingFunctionType["ElasticEase"] = 4] = "ElasticEase";
    EasingFunctionType[EasingFunctionType["ExponentialEase"] = 5] = "ExponentialEase";
    EasingFunctionType[EasingFunctionType["PowerEase"] = 6] = "PowerEase";
    EasingFunctionType[EasingFunctionType["QuadraticEase"] = 7] = "QuadraticEase";
    EasingFunctionType[EasingFunctionType["QuarticEase"] = 8] = "QuarticEase";
    EasingFunctionType[EasingFunctionType["QuinticEase"] = 9] = "QuinticEase";
    EasingFunctionType[EasingFunctionType["SineEase"] = 10] = "SineEase";
    EasingFunctionType[EasingFunctionType["BezierCurveEase"] = 11] = "BezierCurveEase";
})(EasingFunctionType || (EasingFunctionType = {}));
/**
 * @internal
 * Creates an easing function object based on the type and parameters provided.
 * This is not tree-shaking friendly, so if you need cubic bezier, use the dedicated bezier block.
 * @param type The type of the easing function.
 * @param controlPoint1 The first control point for the bezier curve.
 * @param controlPoint2 The second control point for the bezier curve.
 * @returns The easing function object.
 */
function CreateEasingFunction(type, ...parameters) {
    switch (type) {
        case 11 /* EasingFunctionType.BezierCurveEase */:
            return new BezierCurveEase(...parameters);
        case 0 /* EasingFunctionType.CircleEase */:
            return new CircleEase();
        case 1 /* EasingFunctionType.BackEase */:
            return new BackEase(...parameters);
        case 2 /* EasingFunctionType.BounceEase */:
            return new BounceEase(...parameters);
        case 3 /* EasingFunctionType.CubicEase */:
            return new CubicEase();
        case 4 /* EasingFunctionType.ElasticEase */:
            return new ElasticEase(...parameters);
        case 5 /* EasingFunctionType.ExponentialEase */:
            return new ExponentialEase(...parameters);
        default:
            throw new Error("Easing type not yet implemented");
    }
}
/**
 * An easing block that generates an easingFunction object based on the data provided.
 */
export class FlowGraphEasingBlock extends FlowGraphBlock {
    constructor(
    /**
     * the configuration of the block
     */
    config) {
        super(config);
        this.config = config;
        /**
         * Internal cache of reusable easing functions.
         * key is type-mode-properties
         */
        this._easingFunctions = {};
        this.type = this.registerDataInput("type", RichTypeAny, 11);
        this.mode = this.registerDataInput("mode", RichTypeNumber, 0);
        this.parameters = this.registerDataInput("parameters", RichTypeAny, [1, 0, 0, 1]);
        this.easingFunction = this.registerDataOutput("easingFunction", RichTypeAny);
    }
    _updateOutputs(context) {
        const type = this.type.getValue(context);
        const mode = this.mode.getValue(context);
        const parameters = this.parameters.getValue(context);
        if (type === undefined || mode === undefined) {
            return;
        }
        const key = `${type}-${mode}-${parameters.join("-")}`;
        if (!this._easingFunctions[key]) {
            const easing = CreateEasingFunction(type, ...parameters);
            easing.setEasingMode(mode);
            this._easingFunctions[key] = easing;
        }
        this.easingFunction.setValue(this._easingFunctions[key], context);
    }
    getClassName() {
        return "FlowGraphEasingBlock" /* FlowGraphBlockNames.Easing */;
    }
}
let _Registered = false;
/**
 * Register side effects for flowGraphEasingBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterFlowGraphEasingBlock() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    RegisterClass("FlowGraphEasingBlock" /* FlowGraphBlockNames.Easing */, FlowGraphEasingBlock);
}
//# sourceMappingURL=flowGraphEasingBlock.pure.js.map