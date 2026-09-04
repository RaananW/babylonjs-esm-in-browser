import { type ColorCurvesBind, type ColorCurvesParse } from "./colorCurves.pure.js";
type ColorCurvesBindType = typeof ColorCurvesBind;
type ColorCurvesParseType = typeof ColorCurvesParse;
declare module "./colorCurves.pure.js" {
    namespace ColorCurves {
        let Bind: ColorCurvesBindType;
        let Parse: ColorCurvesParseType;
    }
}
export {};
