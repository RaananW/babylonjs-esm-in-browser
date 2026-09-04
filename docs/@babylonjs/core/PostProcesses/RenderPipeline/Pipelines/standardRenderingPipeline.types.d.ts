import { type StandardRenderingPipelineParse } from "./standardRenderingPipeline.pure.js";
type StandardRenderingPipelineParseType = typeof StandardRenderingPipelineParse;
declare module "./standardRenderingPipeline.pure.js" {
    namespace StandardRenderingPipeline {
        let Parse: StandardRenderingPipelineParseType;
    }
}
export {};
