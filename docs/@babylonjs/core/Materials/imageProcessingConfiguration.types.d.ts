import { type ImageProcessingConfigurationParse } from "./imageProcessingConfiguration.pure.js";
type ImageProcessingConfigurationParseType = typeof ImageProcessingConfigurationParse;
declare module "./imageProcessingConfiguration.pure.js" {
    namespace ImageProcessingConfiguration {
        let Parse: ImageProcessingConfigurationParseType;
    }
}
export {};
