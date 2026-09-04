import { type ColorGradingTextureParse } from "./colorGradingTexture.pure.js";
type ColorGradingTextureParseType = typeof ColorGradingTextureParse;
declare module "./colorGradingTexture.pure.js" {
    namespace ColorGradingTexture {
        let Parse: ColorGradingTextureParseType;
    }
}
export {};
