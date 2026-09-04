import { Clamp } from "./math.scalar.functions.js";
import { Vector3FromFloatsToRef } from "./math.vector.functions.js";
const HalfPi = Math.PI / 2;
const DegreesToRadians = Math.PI / 180;
const EllipsoidFromSemiMajorAxisAndInverseFlattening = (semiMajorAxis, inverseFlattening) => {
    const flattening = 1 / inverseFlattening;
    const semiMinorAxis = semiMajorAxis * (1 - flattening);
    const firstEccentricitySquared = 2 * flattening - flattening * flattening;
    const secondEccentricitySquared = firstEccentricitySquared / (1 - firstEccentricitySquared);
    return { semiMajorAxis, semiMinorAxis, flattening, firstEccentricitySquared, secondEccentricitySquared };
};
/**
 * The WGS84 reference ellipsoid used for Earth-related geospatial functions.
 * Derived from the semi-major axis (meters) and the inverse flattening.
 */
export const Wgs84Ellipsoid = Object.freeze(EllipsoidFromSemiMajorAxisAndInverseFlattening(6378137.0, 298.257223563));
/**
 * Converts the latitude and longitude specified in degrees to an {@link ILatLonLike} in radians.
 * @param lat - The latitude in degrees
 * @param lon - The longitude in degrees
 * @param result - The resulting {@link ILatLonLike} in radians
 * @returns The resulting {@link ILatLonLike} in radians
 */
export function LatLonFromDegreesToRef(lat, lon, result) {
    result.lat = lat * DegreesToRadians;
    result.lon = lon * DegreesToRadians;
    return result;
}
/**
 * Computes the normal (up direction) in ECEF (Earth-Centered, Earth-Fixed) coordinates from the specified latitude and longitude in radians.
 * For the calculation, latitude is clamped to -PI/2 to PI/2.
 * @param latLon - The latitude and longitude in radians
 * @param result - The resulting normal
 * @returns The resulting normal
 */
export function LatLonToNormalToRef(latLon, result) {
    const lat = Clamp(latLon.lat, -HalfPi, HalfPi);
    const cosLat = Math.cos(lat);
    return Vector3FromFloatsToRef(cosLat * Math.cos(latLon.lon), cosLat * Math.sin(latLon.lon), Math.sin(lat), result);
}
/**
 * Converts latitude, longitude, and altitude to an ECEF (Earth-Centered, Earth-Fixed) position using the specified ellipsoid.
 * For the calculation, latitude is clamped to -PI/2 to PI/2.
 * @param latLonAlt - The latitude and longitude in radians, and the altitude relative to the reference ellipsoid's surface.
 * @param ellipsoid - Parameters for a reference ellipsoid (e.g., the {@link Wgs84Ellipsoid}).
 * @param result - The resulting ECEF position
 * @returns The resulting ECEF position
 */
export function EcefFromLatLonAltToRef(latLonAlt, ellipsoid, result) {
    const lat = Clamp(latLonAlt.lat, -HalfPi, HalfPi);
    const { lon, alt } = latLonAlt;
    const { semiMajorAxis, firstEccentricitySquared } = ellipsoid;
    const sinLat = Math.sin(lat);
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const N = semiMajorAxis / Math.sqrt(1 - firstEccentricitySquared * sinLat * sinLat);
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const NPlusAltTimesCosLat = (N + alt) * Math.cos(lat);
    return Vector3FromFloatsToRef(NPlusAltTimesCosLat * Math.cos(lon), NPlusAltTimesCosLat * Math.sin(lon), (N * (1 - firstEccentricitySquared) + alt) * sinLat, result);
}
//# sourceMappingURL=math.geospatial.functions.js.map