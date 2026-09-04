import { type InternalTexture } from "../../Materials/Textures/internalTexture.js";
import { type Nullable } from "../../types.js";
declare module "../../Engines/abstractEngine.pure.js" {
    interface AbstractEngine {
        /** @internal */
        _readTexturePixels(texture: InternalTexture, width: number, height: number, faceIndex?: number, level?: number, buffer?: Nullable<ArrayBufferView>, flushRenderer?: boolean, noDataConversion?: boolean, x?: number, y?: number): Promise<ArrayBufferView>;
        /** @internal */
        _readTexturePixelsSync(texture: InternalTexture, width: number, height: number, faceIndex?: number, level?: number, buffer?: Nullable<ArrayBufferView>, flushRenderer?: boolean, noDataConversion?: boolean, x?: number, y?: number): ArrayBufferView;
    }
}
