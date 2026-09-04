import { type FBXDocument } from "../types/fbxTypes.js";
/**
 * Parse a binary FBX file into an FBXDocument.
 * Supports FBX versions 7.0–7.7 (v7.5+ uses 64-bit node headers).
 */
export declare function parseBinaryFBX(buffer: ArrayBuffer): FBXDocument;
