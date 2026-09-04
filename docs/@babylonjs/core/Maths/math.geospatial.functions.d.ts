import { type DeepImmutable } from "../types.js";
import { type IEllipsoidLike, type ILatLonAltLike, type ILatLonLike } from "./math.geospatial.js";
import { type IVector3Like } from "./math.like.js";
/**
 * The WGS84 reference ellipsoid used for Earth-related geospatial functions.
 * Derived from the semi-major axis (meters) and the inverse flattening.
 */
export declare const Wgs84Ellipsoid: DeepImmutable<IEllipsoidLike>;
/**
 * Converts the latitude and longitude specified in degrees to an {@link ILatLonLike} in radians.
 * @param lat - The latitude in degrees
 * @param lon - The longitude in degrees
 * @param result - The resulting {@link ILatLonLike} in radians
 * @returns The resulting {@link ILatLonLike} in radians
 */
export declare function LatLonFromDegreesToRef<T extends ILatLonLike>(lat: number, lon: number, result: T): T;
/**
 * Computes the normal (up direction) in ECEF (Earth-Centered, Earth-Fixed) coordinates from the specified latitude and longitude in radians.
 * For the calculation, latitude is clamped to -PI/2 to PI/2.
 * @param latLon - The latitude and longitude in radians
 * @param result - The resulting normal
 * @returns The resulting normal
 */
export declare function LatLonToNormalToRef<T extends IVector3Like>(latLon: DeepImmutable<ILatLonLike>, result: T): T;
/**
 * Converts latitude, longitude, and altitude to an ECEF (Earth-Centered, Earth-Fixed) position using the specified ellipsoid.
 * For the calculation, latitude is clamped to -PI/2 to PI/2.
 * @param latLonAlt - The latitude and longitude in radians, and the altitude relative to the reference ellipsoid's surface.
 * @param ellipsoid - Parameters for a reference ellipsoid (e.g., the {@link Wgs84Ellipsoid}).
 * @param result - The resulting ECEF position
 * @returns The resulting ECEF position
 */
export declare function EcefFromLatLonAltToRef<T extends IVector3Like>(latLonAlt: DeepImmutable<ILatLonAltLike>, ellipsoid: DeepImmutable<Pick<IEllipsoidLike, "semiMajorAxis" | "firstEccentricitySquared">>, result: T): T;
