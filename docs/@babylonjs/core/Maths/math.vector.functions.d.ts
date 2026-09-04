import { type DeepImmutable } from "../types.js";
import { type IVector2Like, type IVector3Like, type IVector4Like } from "./math.like.js";
/**
 * Creates a string representation of the IVector2Like
 * @param vector defines the IVector2Like to stringify
 * @param decimalCount defines the number of decimals to use
 * @returns a string with the IVector2Like coordinates.
 */
export declare function Vector2ToFixed(vector: DeepImmutable<IVector2Like>, decimalCount: number): string;
/**
 * Computes the dot product of two IVector3Like objects.
 * @param a defines the first vector
 * @param b defines the second vector
 * @returns the dot product
 */
export declare function Vector3Dot(a: DeepImmutable<IVector3Like>, b: DeepImmutable<IVector3Like>): number;
/**
 * Computes the squared length of the IVector3Like
 * @param vector the vector to measure
 * @returns the squared length of the vector
 */
export declare function Vector3LengthSquared(vector: DeepImmutable<IVector3Like>): number;
/**
 * Computes the length of the IVector3Like
 * @param vector the vector to measure
 * @returns the length of the vector
 */
export declare function Vector3Length(vector: DeepImmutable<IVector3Like>): number;
/**
 * Computes the squared distance between the IVector3Like objects
 * @param a defines the first vector
 * @param b defines the second vector
 * @returns the squared distance
 */
export declare function Vector3DistanceSquared(a: DeepImmutable<IVector3Like>, b: DeepImmutable<IVector3Like>): number;
/**
 * Computes the distance between the IVector3Like objects
 * @param a defines the first vector
 * @param b defines the second vector
 * @returns the distance
 */
export declare function Vector3Distance(a: DeepImmutable<IVector3Like>, b: DeepImmutable<IVector3Like>): number;
/**
 * Sets the given floats into the result.
 * @param x defines the x coordinate
 * @param y defines the y coordinate
 * @param z defines the z coordinate
 * @param result defines the result vector
 * @returns the result vector
 */
export declare function Vector3FromFloatsToRef<T extends IVector3Like>(x: number, y: number, z: number, result: T): T;
/**
 * Stores the scaled values of a vector into the result.
 * @param a defines the source vector
 * @param scale defines the scale factor
 * @param result defines the result vector
 * @returns the scaled vector
 */
export declare function Vector3ScaleToRef<T extends IVector3Like>(a: DeepImmutable<IVector3Like>, scale: number, result: T): T;
/**
 * Scales the current vector values in place by a factor.
 * @param vector defines the vector to scale
 * @param scale defines the scale factor
 * @returns the scaled vector
 */
export declare function Vector3ScaleInPlace<T extends IVector3Like>(vector: T, scale: number): T;
export declare function Vector3SubtractToRef<T extends IVector3Like>(a: DeepImmutable<IVector3Like>, b: DeepImmutable<IVector3Like>, result: T): T;
export declare function Vector3CopyToRef<T extends IVector3Like>(source: DeepImmutable<IVector3Like>, result: T): T;
export declare function Vector3LerpToRef<T extends IVector3Like>(start: DeepImmutable<IVector3Like>, end: DeepImmutable<IVector3Like>, amount: number, result: T): T;
export declare function Vector3NormalizeToRef<T extends IVector3Like>(vector: DeepImmutable<IVector3Like>, result: T): T;
/**
 * Computes the signed distance between the specified point and plane.
 * @param origin defines a point on the plane
 * @param normal defines the plane normal (assumes normalized)
 * @param point defines the point to compute the signed distance to
 * @returns the signed distance
 */
export declare function Vector3SignedDistanceToPlaneFromPositionAndNormal(origin: DeepImmutable<IVector3Like>, normal: DeepImmutable<IVector3Like>, point: DeepImmutable<IVector3Like>): number;
/**
 * Creates a string representation of the IVector3Like
 * @param vector defines the IVector3Like to stringify
 * @param decimalCount defines the number of decimals to use
 * @returns a string with the IVector3Like coordinates.
 */
export declare function Vector3ToFixed(vector: DeepImmutable<IVector3Like>, decimalCount: number): string;
/**
 * Computes the dot product of two IVector4Like objects
 * @param a defines the first vector
 * @param b defines the second vector
 * @returns the dot product
 */
export declare function Vector4Dot(a: DeepImmutable<IVector4Like>, b: DeepImmutable<IVector4Like>): number;
/**
 * Creates a string representation of the IVector4Like
 * @param vector defines the IVector4Like to stringify
 * @param decimalCount defines the number of decimals to use
 * @returns a string with the IVector4Like coordinates.
 */
export declare function Vector4ToFixed(vector: DeepImmutable<IVector4Like>, decimalCount: number): string;
