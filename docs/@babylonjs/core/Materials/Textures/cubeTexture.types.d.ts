import { type CubeTextureCreateFromImages, type CubeTextureCreateFromPrefilteredData, type CubeTextureParse } from "./cubeTexture.pure.js";
type CubeTextureCreateFromImagesType = typeof CubeTextureCreateFromImages;
type CubeTextureCreateFromPrefilteredDataType = typeof CubeTextureCreateFromPrefilteredData;
type CubeTextureParseType = typeof CubeTextureParse;
declare module "./cubeTexture.pure.js" {
    namespace CubeTexture {
        let CreateFromImages: CubeTextureCreateFromImagesType;
        let CreateFromPrefilteredData: CubeTextureCreateFromPrefilteredDataType;
        let Parse: CubeTextureParseType;
    }
}
export {};
