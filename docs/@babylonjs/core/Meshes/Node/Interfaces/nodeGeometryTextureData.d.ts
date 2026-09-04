import { type Nullable } from "../../../types.js";
/**
 * Interface used to define texture data
 */
export interface INodeGeometryTextureData {
    /** @internal */
    data: Nullable<Float32Array>;
    /** @internal */
    width: number;
    /** @internal */
    height: number;
}
