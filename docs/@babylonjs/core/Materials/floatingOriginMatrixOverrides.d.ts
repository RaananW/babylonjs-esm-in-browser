import { Matrix, Vector3 } from "../Maths/math.vector.pure.js";
import { type IMatrixLike, type IVector3Like } from "../Maths/math.like.js";
import { type Scene } from "../scene.js";
import { type DeepImmutable } from "../types.js";
import { type Plane } from "../Maths/math.plane.js";
/**
 * When rendering, each scene will reset this to ensure the correct floating origin offset is when overriding the below functions
 */
export declare const FloatingOriginCurrentScene: {
    getScene: () => Scene | undefined;
    eyeAtCamera: boolean;
};
export declare function OffsetViewToRef(offset: IVector3Like, view: DeepImmutable<IMatrixLike>, ref: Matrix): DeepImmutable<IMatrixLike>;
export declare function OffsetClipPlaneToRef(offset: Vector3, plane: Plane, ref: Plane): Plane;
export declare function GetOffsetTransformMatrices(offset: IVector3Like, viewMatrices: Array<Matrix>, projectionMatrices: Array<Matrix>, length: number, resultArray: Float32Array): Float32Array;
export declare function GetFullOffsetViewProjectionToRef(offset: IVector3Like, viewMatrix: DeepImmutable<IMatrixLike>, projectionMatrix: DeepImmutable<IMatrixLike>, ref: IMatrixLike): DeepImmutable<IMatrixLike>;
export declare function ResetMatrixFunctions(): void;
export declare function OverrideMatrixFunctions(): void;
