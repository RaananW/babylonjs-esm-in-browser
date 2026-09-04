import { type FresnelParametersParse } from "./fresnelParameters.pure.js";
type FresnelParametersParseType = typeof FresnelParametersParse;
declare module "./fresnelParameters.pure.js" {
    namespace FresnelParameters {
        let Parse: FresnelParametersParseType;
    }
}
export {};
