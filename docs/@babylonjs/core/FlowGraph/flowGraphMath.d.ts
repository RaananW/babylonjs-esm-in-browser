import { type IQuaternionLike } from "../Maths/math.like.js";
import { Quaternion, Vector2, Vector3 } from "../Maths/math.vector.pure.js";
import { type DeepImmutable } from "../types.js";
/**
 * Returns the angle in radians between two quaternions
 * @param q1 defines the first quaternion
 * @param q2 defines the second quaternion
 * @returns the angle in radians between the two quaternions
 */
export declare function GetAngleBetweenQuaternions(q1: DeepImmutable<IQuaternionLike>, q2: DeepImmutable<IQuaternionLike>): number;
/**
 * Creates a quaternion from two direction vectors
 * @param a defines the first direction vector
 * @param b defines the second direction vector
 * @returns the target quaternion
 */
export declare function GetQuaternionFromDirections<T extends Vector3>(a: DeepImmutable<T>, b: DeepImmutable<T>): Quaternion;
/**
 * Creates a quaternion from two direction vectors
 * @param a defines the first direction vector
 * @param b defines the second direction vector
 * @param result defines the target quaternion
 * @returns the target quaternion
 */
export declare function GetQuaternionFromDirectionsToRef<T extends Vector3, ResultT extends Quaternion>(a: DeepImmutable<T>, b: DeepImmutable<T>, result: ResultT): ResultT;
/**
 * Spherical linear interpolation between two 2D vectors.
 * NaN and infinity values are propagated through the arithmetic.
 * @param a the first vector
 * @param b the second vector
 * @param c the (unclamped) interpolation coefficient
 * @returns the interpolated 2D vector
 */
export declare function GetVector2Slerp(a: DeepImmutable<Vector2>, b: DeepImmutable<Vector2>, c: number): Vector2;
/**
 * Spherical linear interpolation between two 3D vectors.
 * NaN and infinity values are propagated through the arithmetic.
 * @param a the first vector
 * @param b the second vector
 * @param c the (unclamped) interpolation coefficient
 * @returns the interpolated 3D vector
 */
export declare function GetVector3Slerp(a: DeepImmutable<Vector3>, b: DeepImmutable<Vector3>, c: number): Vector3;
/**
 * Creates a quaternion from the specified up and forward directions, as defined by the
 * up/forward quaternion operation. Both inputs are assumed to be unit length.
 * @param up the up direction
 * @param forward the forward direction
 * @returns the rotation quaternion
 */
export declare function GetQuaternionFromUpForward(up: DeepImmutable<Vector3>, forward: DeepImmutable<Vector3>): Quaternion;
/**
 * The rotation orders accepted by the Euler-angle quaternion operation
 * (and {@link GetQuaternionFromEulerAngles}). The default order is `yxz`.
 */
export declare const QuaternionEulerAngleOrders: readonly ["xyz", "xzy", "yxz", "yzx", "zxy", "zyx"];
/**
 * Builds a rotation quaternion from three Tait–Bryan intrinsic Euler angles applied in the
 * specified order.
 *
 * Babylon only exposes the `yxz` order natively (via `Quaternion.RotationYawPitchRoll`), so the
 * result is composed from the individual per-axis rotations to support every order. For an
 * intrinsic order `o1o2o3` the result is the Hamilton product `q(o1) * q(o2) * q(o3)`, where each
 * `q(axis)` is a rotation about that axis; this matches the corresponding reference intrinsic
 * Tait–Bryan rotation matrices. NaN and infinite angle inputs propagate into the result.
 * @param order the rotation order, one of {@link QuaternionEulerAngleOrders}; any other value uses the default `yxz`
 * @param x rotation around the X axis, in radians
 * @param y rotation around the Y axis, in radians
 * @param z rotation around the Z axis, in radians
 * @returns the composed rotation quaternion
 */
export declare function GetQuaternionFromEulerAngles(order: string, x: number, y: number, z: number): Quaternion;
