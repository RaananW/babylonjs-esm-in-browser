import { type TAARenderingPipelineParse } from "./taaRenderingPipeline.pure.js";
type TAARenderingPipelineParseType = typeof TAARenderingPipelineParse;
declare module "./taaRenderingPipeline.pure.js" {
    namespace TAARenderingPipeline {
        let Parse: TAARenderingPipelineParseType;
    }
}
export {};
