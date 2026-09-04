import { Tools } from "../../Misc/tools.pure.js";
/**
 * Loads LTC texture data from Babylon.js CDN.
 * @returns Promise with data for LTC1 and LTC2 textures for area lights.
 */
export async function DecodeLTCTextureDataAsync() {
    const ltc1 = new Uint16Array(64 * 64 * 4);
    const ltc2 = new Uint16Array(64 * 64 * 4);
    const file = await Tools.LoadFileAsync(Tools.GetAssetUrl("https://assets.babylonjs.com/core/areaLights/areaLightsLTC.bin"));
    const ltcEncoded = new Uint16Array(file);
    const pixelCount = ltcEncoded.length / 8;
    for (let pixelIndex = 0; pixelIndex < pixelCount; pixelIndex++) {
        ltc1[pixelIndex * 4] = ltcEncoded[pixelIndex * 8];
        ltc1[pixelIndex * 4 + 1] = ltcEncoded[pixelIndex * 8 + 1];
        ltc1[pixelIndex * 4 + 2] = ltcEncoded[pixelIndex * 8 + 2];
        ltc1[pixelIndex * 4 + 3] = ltcEncoded[pixelIndex * 8 + 3];
        ltc2[pixelIndex * 4] = ltcEncoded[pixelIndex * 8 + 4];
        ltc2[pixelIndex * 4 + 1] = ltcEncoded[pixelIndex * 8 + 5];
        ltc2[pixelIndex * 4 + 2] = ltcEncoded[pixelIndex * 8 + 6];
        ltc2[pixelIndex * 4 + 3] = ltcEncoded[pixelIndex * 8 + 7];
    }
    return [ltc1, ltc2];
}
//# sourceMappingURL=ltcTextureTool.js.map