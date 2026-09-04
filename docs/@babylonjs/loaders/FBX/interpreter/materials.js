/* eslint-disable @typescript-eslint/naming-convention, jsdoc/require-param, jsdoc/require-returns */
import { findChildByName, getPropertyValue, cleanFBXName } from "../types/fbxTypes.js";
import { getChildren } from "./connections.js";
import { getPropertyTemplate, resolvePropertyValue, resolvePropertyValues } from "./propertyTemplates.js";
/**
 * Extract material data from an FBX Material node.
 */
export function extractMaterial(materialNode, materialId, objectMap, templates) {
    const name = cleanFBXName(getPropertyValue(materialNode, 1) ?? "Material");
    const template = getMaterialTemplate(materialNode, templates);
    // Determine Lambert vs Phong from ShadingModel property
    const shadingModel = findChildByName(materialNode, "ShadingModel");
    const shadingType = shadingModel
        ? (getPropertyValue(shadingModel, 0) ?? "Lambert")
        : (resolvePropertyValue(materialNode, template, "ShadingModel") ?? "Lambert");
    const type = shadingType.toLowerCase() === "phong" ? "Phong" : "Lambert";
    // Extract properties from Properties70
    const properties = extractMaterialProperties(materialNode, template);
    // Find connected textures
    const textureTemplate = templates ? (getPropertyTemplate(templates, "Texture", "FbxFileTexture") ?? getPropertyTemplate(templates, "Texture")) : undefined;
    const textures = extractTextures(materialId, objectMap, textureTemplate);
    return { id: materialId, name, type, properties, textures };
}
function extractMaterialProperties(materialNode, template) {
    const props = {};
    props.diffuseColor = getColorProperty(materialNode, template, "DiffuseColor") ?? getColorProperty(materialNode, template, "Diffuse");
    props.diffuseFactor = getNumberProperty(materialNode, template, "DiffuseFactor");
    props.ambientColor = getColorProperty(materialNode, template, "AmbientColor") ?? getColorProperty(materialNode, template, "Ambient");
    props.ambientFactor = getNumberProperty(materialNode, template, "AmbientFactor");
    props.specularColor = getColorProperty(materialNode, template, "SpecularColor") ?? getColorProperty(materialNode, template, "Specular");
    props.specularFactor = getNumberProperty(materialNode, template, "SpecularFactor");
    props.shininess = getNumberProperty(materialNode, template, "Shininess") ?? getNumberProperty(materialNode, template, "ShininessExponent");
    props.emissiveColor = getColorProperty(materialNode, template, "EmissiveColor") ?? getColorProperty(materialNode, template, "Emissive");
    props.emissiveFactor = getNumberProperty(materialNode, template, "EmissiveFactor");
    props.opacity = getNumberProperty(materialNode, template, "Opacity");
    props.transparencyFactor = getNumberProperty(materialNode, template, "TransparencyFactor");
    return props;
}
function extractTextures(materialId, objectMap, template) {
    const textures = [];
    const textureChildren = getChildren(objectMap, materialId, "Texture");
    for (const { id, node, propertyName } of textureChildren) {
        const fileNameNode = findChildByName(node, "FileName");
        const relFileNameNode = findChildByName(node, "RelativeFilename");
        const fileName = fileNameNode ? (getPropertyValue(fileNameNode, 0) ?? "") : "";
        const relativeFileName = relFileNameNode ? (getPropertyValue(relFileNameNode, 0) ?? "") : "";
        // Extract UV transform properties
        let uvTranslation;
        let uvScaling;
        const uvRotation = getNumberProperty(node, template, "UVRotation") ?? getNumberProperty(node, template, "Rotation");
        let uvSetName;
        uvTranslation = getTextureVector2(node, template, "UVTranslation") ?? getTextureVector2(node, template, "Translation");
        uvScaling = getTextureVector2(node, template, "UVScaling") ?? getTextureVector2(node, template, "Scaling");
        const uvSet = resolvePropertyValue(node, template, "UVSet");
        if (uvSet && uvSet.length > 0) {
            uvSetName = uvSet;
        }
        uvTranslation ?? (uvTranslation = getNumberPairChild(node, "ModelUVTranslation"));
        uvScaling ?? (uvScaling = getNumberPairChild(node, "ModelUVScaling"));
        // Check for embedded texture data in connected Video node
        let embeddedData = null;
        const videoChildren = getChildren(objectMap, id, "Video");
        for (const { node: videoNode } of videoChildren) {
            const contentNode = findChildByName(videoNode, "Content");
            if (contentNode && contentNode.properties.length > 0) {
                const content = contentNode.properties[0].value;
                if (content instanceof Uint8Array && content.length > 0) {
                    embeddedData = content;
                }
                else if (content instanceof ArrayBuffer && content.byteLength > 0) {
                    embeddedData = new Uint8Array(content);
                }
            }
        }
        textures.push({
            propertyName: propertyName ?? "DiffuseColor",
            fileName,
            relativeFileName,
            id,
            embeddedData,
            uvTranslation,
            uvScaling,
            uvRotation,
            uvSetName,
        });
    }
    return textures;
}
// ── Helpers ────────────────────────────────────────────────────────────────────
function getMaterialTemplate(materialNode, templates) {
    if (!templates) {
        return undefined;
    }
    const shadingModel = findChildByName(materialNode, "ShadingModel");
    const shadingType = shadingModel ? getPropertyValue(shadingModel, 0) : undefined;
    if (shadingType?.toLowerCase() === "phong") {
        return getPropertyTemplate(templates, "Material", "FbxSurfacePhong") ?? getPropertyTemplate(templates, "Material");
    }
    if (shadingType?.toLowerCase() === "lambert") {
        return getPropertyTemplate(templates, "Material", "FbxSurfaceLambert") ?? getPropertyTemplate(templates, "Material");
    }
    return getPropertyTemplate(templates, "Material");
}
function getColorProperty(node, template, propertyName) {
    const values = resolvePropertyValues(node, template, propertyName);
    if (!values || values.length < 3) {
        return undefined;
    }
    const r = toNumber(values[0]);
    const g = toNumber(values[1]);
    const b = toNumber(values[2]);
    if (r === undefined || g === undefined || b === undefined) {
        return undefined;
    }
    return [r, g, b];
}
function getNumberProperty(node, template, propertyName) {
    return toNumber(resolvePropertyValue(node, template, propertyName));
}
function getTextureVector2(node, template, propertyName) {
    const values = resolvePropertyValues(node, template, propertyName);
    if (!values) {
        return undefined;
    }
    const u = toNumber(values[0]);
    const v = toNumber(values[1]);
    return u !== undefined && v !== undefined ? [u, v] : undefined;
}
function toNumber(value) {
    if (typeof value === "number") {
        return value;
    }
    return undefined;
}
function getNumberPairChild(node, childName) {
    const child = findChildByName(node, childName);
    if (!child) {
        return undefined;
    }
    const u = toNumber(child.properties[0]?.value);
    const v = toNumber(child.properties[1]?.value);
    return u !== undefined && v !== undefined ? [u, v] : undefined;
}
//# sourceMappingURL=materials.js.map