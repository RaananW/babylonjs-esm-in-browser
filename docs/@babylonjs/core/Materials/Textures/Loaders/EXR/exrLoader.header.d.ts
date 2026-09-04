import { type DataCursor } from "./exrLoader.core.js";
import { type IEXRHeader } from "./exrLoader.interfaces.js";
/**
 * Gets the EXR header
 * @param dataView defines the data view to read from
 * @param offset defines the offset to start reading from
 * @returns the header
 */
export declare function GetExrHeader(dataView: DataView, offset: DataCursor): IEXRHeader;
