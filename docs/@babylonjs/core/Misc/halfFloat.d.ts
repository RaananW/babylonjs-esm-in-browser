/**
 * The largest finite magnitude representable by a 16-bit half-float (binary16): 65504.
 * Use this to clamp values into the half-float range before conversion instead of hardcoding the literal.
 */
export declare const MaxHalfFloat = 65504;
/**
 * Converts a 32-bit float to its 16-bit half-float bit pattern.
 * @param value the float to convert
 * @returns the half-float bit pattern, in the range 0..65535
 */
export declare function ToHalfFloat(value: number): number;
/**
 * Converts a 16-bit half-float bit pattern back to a 32-bit float.
 * @param value the half-float bit pattern, in the range 0..65535
 * @returns the decoded float
 */
export declare function FromHalfFloat(value: number): number;
