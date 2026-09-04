import { type FBXDocument, type FBXNode, type FBXPropertyValue } from "../types/fbxTypes.js";
export interface FBXTemplateProperty {
    name: string;
    propertyType: string;
    label: string;
    flags: string;
    values: FBXPropertyValue[];
}
export interface FBXPropertyTemplate {
    objectType: string;
    templateName: string;
    properties: Map<string, FBXTemplateProperty>;
}
export type FBXPropertyTemplateMap = Map<string, Map<string, FBXPropertyTemplate>>;
export declare function extractPropertyTemplates(doc: FBXDocument): FBXPropertyTemplateMap;
export declare function getPropertyTemplate(templates: FBXPropertyTemplateMap, objectType: string, templateName?: string): FBXPropertyTemplate | undefined;
export declare function getTemplatePropertyValue<T extends FBXPropertyValue>(template: FBXPropertyTemplate | undefined, propertyName: string, valueIndex?: number): T | undefined;
export declare function resolvePropertyValue<T extends FBXPropertyValue>(node: FBXNode, template: FBXPropertyTemplate | undefined, propertyName: string, valueIndex?: number): T | undefined;
export declare function resolveNumberProperty(node: FBXNode, template: FBXPropertyTemplate | undefined, propertyName: string, fallback: number): number;
export declare function resolveVector2Property(node: FBXNode, template: FBXPropertyTemplate | undefined, propertyName: string, fallback: [number, number]): [number, number];
export declare function resolveVector3Property(node: FBXNode, template: FBXPropertyTemplate | undefined, propertyName: string, fallback: [number, number, number]): [number, number, number];
export declare function resolvePropertyValues(node: FBXNode, template: FBXPropertyTemplate | undefined, propertyName: string): FBXPropertyValue[] | undefined;
