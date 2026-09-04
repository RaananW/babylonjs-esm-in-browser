import { type Nullable } from "../types.js";
/**
 * @internal
 */
export declare class IntersectionInfo {
    bu: Nullable<number>;
    bv: Nullable<number>;
    distance: number;
    faceId: number;
    subMeshId: number;
    _internalSubMeshId: number;
    constructor(bu: Nullable<number>, bv: Nullable<number>, distance: number);
}
