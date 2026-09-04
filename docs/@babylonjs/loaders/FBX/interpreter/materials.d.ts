import { type FBXNode } from "../types/fbxTypes.js";
import { type FBXObjectMap } from "./connections.js";
import { type FBXPropertyTemplateMap } from "./propertyTemplates.js";
/** Parsed material data */
export interface FBXMaterialData {
    id: number;
    name: string;
    type: "Lambert" | "Phong";
    properties: FBXMaterialProperties;
    textures: FBXTextureRef[];
}
export interface FBXMaterialProperties {
    diffuseColor?: [number, number, number];
    diffuseFactor?: number;
    ambientColor?: [number, number, number];
    ambientFactor?: number;
    specularColor?: [number, number, number];
    specularFactor?: number;
    shininess?: number;
    emissiveColor?: [number, number, number];
    emissiveFactor?: number;
    opacity?: number;
    transparencyFactor?: number;
}
export interface FBXTextureRef {
    /** Which material property this texture is connected to */
    propertyName: string;
    /** Absolute file path from the FBX */
    fileName: string;
    /** Relative file path from the FBX */
    relativeFileName: string;
    /** Texture node ID */
    id: number;
    /** Embedded texture data (from Video node Content), if available */
    embeddedData: Uint8Array | null;
    /** UV translation [u, v] */
    uvTranslation?: [number, number];
    /** UV scaling [u, v] */
    uvScaling?: [number, number];
    /** UV rotation in degrees */
    uvRotation?: number;
    /** Which UV set index this texture uses */
    uvSetIndex?: number;
    /** Which named UV set this texture uses */
    uvSetName?: string;
}
/**
 * Extract material data from an FBX Material node.
 */
export declare function extractMaterial(materialNode: FBXNode, materialId: number, objectMap: FBXObjectMap, templates?: FBXPropertyTemplateMap): FBXMaterialData;
