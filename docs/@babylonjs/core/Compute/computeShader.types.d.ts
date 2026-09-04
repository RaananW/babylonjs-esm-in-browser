import { type ComputeShaderParse } from "./computeShader.pure.js";
type ComputeShaderParseType = typeof ComputeShaderParse;
declare module "./computeShader.pure.js" {
    namespace ComputeShader {
        let Parse: ComputeShaderParseType;
    }
}
export {};
