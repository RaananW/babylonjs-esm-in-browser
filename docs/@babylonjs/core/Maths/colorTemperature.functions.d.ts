import { Vector3 } from "./math.vector.pure.js";
/**
 * The minimum correlated color temperature, in Kelvin, representable by {@link TemperatureTintToXyz} (there is no
 * upper bound: increasingly high temperatures approach mired 0, already within the tabulated range).
 */
export declare const MinTemperatureKelvin: number;
/**
 * The maximum magnitude of the tint offset accepted by {@link TemperatureTintToXyz}, in either direction.
 */
export declare const MaxTintMagnitude = 150;
/**
 * Converts a correlated color temperature and tint offset into the CIE XYZ (Y = 1) coordinates of the
 * corresponding illuminant white point, using a tabulated approximation of the Planckian locus in CIE 1960 UCS
 * (u, v) space.
 * @param temperatureKelvin The correlated color temperature of the illuminant, in Kelvin
 * @param tint An offset perpendicular to the Planckian locus (the green/magenta axis), in the range
 * [-{@link MaxTintMagnitude}, {@link MaxTintMagnitude}]
 * @returns The CIE XYZ (Y = 1) coordinates of the illuminant white point
 */
export declare function TemperatureTintToXyz(temperatureKelvin: number, tint: number): Vector3;
/**
 * Computes the linear RGB (sRGB / Rec.709 primaries) color-correction matrix that white-balances the given
 * illuminant, by chromatically adapting its white point (see {@link TemperatureTintToXyz}) to the working
 * color space's reference white using the Bradford transform.
 * @param temperatureKelvin The correlated color temperature of the illuminant to neutralize, in Kelvin
 * @param tint An offset perpendicular to the Planckian locus (the green/magenta axis), in the range [-150, 150]
 * @returns A column-major 3x3 matrix (9 values), ready to be bound as a `mat3` shader uniform
 */
export declare function GetWhiteBalanceMatrix(temperatureKelvin: number, tint: number): Float32Array | Array<number>;
