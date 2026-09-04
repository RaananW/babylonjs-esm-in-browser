/* eslint-disable @typescript-eslint/naming-convention, jsdoc/require-param, jsdoc/require-returns */
import { findChildByName, findDocumentNode, getPropertyValue } from "../types/fbxTypes.js";
export function extractPropertyTemplates(doc) {
    const templates = new Map();
    const definitions = findDocumentNode(doc, "Definitions");
    if (!definitions) {
        return templates;
    }
    for (const objectTypeNode of definitions.children) {
        if (objectTypeNode.name !== "ObjectType") {
            continue;
        }
        const objectType = getPropertyValue(objectTypeNode, 0);
        if (!objectType) {
            continue;
        }
        for (const templateNode of objectTypeNode.children) {
            if (templateNode.name !== "PropertyTemplate") {
                continue;
            }
            const templateName = getPropertyValue(templateNode, 0);
            if (!templateName) {
                continue;
            }
            const template = extractPropertyTemplate(objectType, templateName, templateNode);
            let templatesByName = templates.get(objectType);
            if (!templatesByName) {
                templatesByName = new Map();
                templates.set(objectType, templatesByName);
            }
            templatesByName.set(templateName, template);
        }
    }
    return templates;
}
export function getPropertyTemplate(templates, objectType, templateName) {
    const templatesByName = templates.get(objectType);
    if (!templatesByName) {
        return undefined;
    }
    if (templateName) {
        return templatesByName.get(templateName);
    }
    return templatesByName.values().next().value;
}
export function getTemplatePropertyValue(template, propertyName, valueIndex = 0) {
    return template?.properties.get(propertyName)?.values[valueIndex];
}
export function resolvePropertyValue(node, template, propertyName, valueIndex = 0) {
    return resolvePropertyValues(node, template, propertyName)?.[valueIndex];
}
export function resolveNumberProperty(node, template, propertyName, fallback) {
    return toNumber(resolvePropertyValue(node, template, propertyName)) ?? fallback;
}
export function resolveVector2Property(node, template, propertyName, fallback) {
    const values = resolvePropertyValues(node, template, propertyName);
    if (!values) {
        return fallback;
    }
    const x = toNumber(values[0]);
    const y = toNumber(values[1]);
    return x !== undefined && y !== undefined ? [x, y] : fallback;
}
export function resolveVector3Property(node, template, propertyName, fallback) {
    const values = resolvePropertyValues(node, template, propertyName);
    if (!values) {
        return fallback;
    }
    const x = toNumber(values[0]);
    const y = toNumber(values[1]);
    const z = toNumber(values[2]);
    return x !== undefined && y !== undefined && z !== undefined ? [x, y, z] : fallback;
}
export function resolvePropertyValues(node, template, propertyName) {
    return findLocalPropertyValues(node, propertyName) ?? template?.properties.get(propertyName)?.values;
}
function toNumber(value) {
    if (typeof value === "number") {
        return value;
    }
    return undefined;
}
function extractPropertyTemplate(objectType, templateName, templateNode) {
    const properties = new Map();
    const properties70 = findChildByName(templateNode, "Properties70");
    for (const propertyNode of properties70?.children ?? []) {
        if (propertyNode.name !== "P") {
            continue;
        }
        const property = extractPropertyNode(propertyNode);
        if (property) {
            properties.set(property.name, property);
        }
    }
    return { objectType, templateName, properties };
}
function findLocalPropertyValues(node, propertyName) {
    const propertyContainers = [findChildByName(node, "Properties70"), findChildByName(node, "Properties60")].filter((child) => child !== undefined);
    for (const container of propertyContainers) {
        for (const propertyNode of container.children) {
            if (propertyNode.name !== "P" && propertyNode.name !== "Property") {
                continue;
            }
            if (getPropertyValue(propertyNode, 0) !== propertyName) {
                continue;
            }
            return propertyNode.properties.slice(propertyNode.name === "Property" ? 3 : 4).map((property) => property.value);
        }
    }
    return undefined;
}
function extractPropertyNode(node) {
    const name = getPropertyValue(node, 0);
    if (!name) {
        return null;
    }
    return {
        name,
        propertyType: getPropertyValue(node, 1) ?? "",
        label: getPropertyValue(node, 2) ?? "",
        flags: getPropertyValue(node, 3) ?? "",
        values: node.properties.slice(4).map((property) => property.value),
    };
}
//# sourceMappingURL=propertyTemplates.js.map