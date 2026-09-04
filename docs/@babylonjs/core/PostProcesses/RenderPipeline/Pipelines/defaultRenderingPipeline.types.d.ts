import { type DefaultRenderingPipelineParse } from "./defaultRenderingPipeline.pure.js";
type DefaultRenderingPipelineParseType = typeof DefaultRenderingPipelineParse;
declare module "./defaultRenderingPipeline.pure.js" {
    namespace DefaultRenderingPipeline {
        let Parse: DefaultRenderingPipelineParseType;
    }
}
export {};
