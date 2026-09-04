import { type SSAO2RenderingPipelineParse } from "./ssao2RenderingPipeline.pure.js";
type SSAO2RenderingPipelineParseType = typeof SSAO2RenderingPipelineParse;
declare module "./ssao2RenderingPipeline.pure.js" {
    namespace SSAO2RenderingPipeline {
        let Parse: SSAO2RenderingPipelineParseType;
    }
}
export {};
