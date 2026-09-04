import { MetadataSymbol } from "../Misc/decorators.functions.js";
/**
 * Enum defining the type of properties that can be edited in the property pages in the node editor
 */
export var PropertyTypeForEdition;
(function (PropertyTypeForEdition) {
    /** property is a boolean */
    PropertyTypeForEdition[PropertyTypeForEdition["Boolean"] = 0] = "Boolean";
    /** property is a float */
    PropertyTypeForEdition[PropertyTypeForEdition["Float"] = 1] = "Float";
    /** property is a int */
    PropertyTypeForEdition[PropertyTypeForEdition["Int"] = 2] = "Int";
    /** property is a Vector2 */
    PropertyTypeForEdition[PropertyTypeForEdition["Vector2"] = 3] = "Vector2";
    /** property is a Vector3 */
    PropertyTypeForEdition[PropertyTypeForEdition["Vector3"] = 4] = "Vector3";
    /** property is a list of values */
    PropertyTypeForEdition[PropertyTypeForEdition["List"] = 5] = "List";
    /** property is a Color3 */
    PropertyTypeForEdition[PropertyTypeForEdition["Color3"] = 6] = "Color3";
    /** property is a Color4 */
    PropertyTypeForEdition[PropertyTypeForEdition["Color4"] = 7] = "Color4";
    /** property (int) should be edited as a combo box with a list of sampling modes */
    PropertyTypeForEdition[PropertyTypeForEdition["SamplingMode"] = 8] = "SamplingMode";
    /** property (int) should be edited as a combo box with a list of texture formats */
    PropertyTypeForEdition[PropertyTypeForEdition["TextureFormat"] = 9] = "TextureFormat";
    /** property (int) should be edited as a combo box with a list of texture types */
    PropertyTypeForEdition[PropertyTypeForEdition["TextureType"] = 10] = "TextureType";
    /** property is a string */
    PropertyTypeForEdition[PropertyTypeForEdition["String"] = 11] = "String";
    /** property is a matrix */
    PropertyTypeForEdition[PropertyTypeForEdition["Matrix"] = 12] = "Matrix";
    /** property is a viewport */
    PropertyTypeForEdition[PropertyTypeForEdition["Viewport"] = 13] = "Viewport";
})(PropertyTypeForEdition || (PropertyTypeForEdition = {}));
/**
 * Decorator that flags a property in a node block as being editable
 * @param displayName the display name of the property
 * @param propertyType the type of the property
 * @param groupName the group name of the property
 * @param options the options of the property
 * @returns the decorator
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export function editableInPropertyPage(displayName, propertyType = 0 /* PropertyTypeForEdition.Boolean */, groupName = "PROPERTIES", options) {
    return (_value, context) => {
        const meta = context.metadata;
        if (!meta) {
            // `context.metadata` is `void 0` when `Symbol.metadata` was not installed before this class
            // was evaluated. Importing `MetadataSymbol` from decorators.functions runs the polyfill at
            // module load (before this class body), so this should never happen; referencing it here also
            // keeps that module-load polyfill anchored against bundler tree-shaking.
            throw new Error(`editableInPropertyPage: decorator metadata is unavailable; the Symbol.metadata (${String(MetadataSymbol)}) polyfill must run before decorated classes are evaluated.`);
        }
        let propStore;
        if (Object.prototype.hasOwnProperty.call(meta, __bjsPropStoreKey)) {
            propStore = meta[__bjsPropStoreKey];
        }
        else {
            propStore = [];
            meta[__bjsPropStoreKey] = propStore;
        }
        propStore.push({
            propertyName: String(context.name),
            displayName: displayName,
            type: propertyType,
            groupName: groupName,
            options: options ?? {},
            className: "",
        });
    };
}
// eslint-disable-next-line @typescript-eslint/naming-convention
const __bjsPropStoreKey = "__bjs_prop_store__";
/**
 * Gets the editable properties for a given target using TC39 decorator metadata.
 * Walks the metadata prototype chain to include properties from parent classes.
 * @param target - the target object (instance or constructor)
 * @returns array of property descriptions
 */
export function GetEditableProperties(target) {
    const ctor = typeof target === "function" ? target : target?.constructor;
    const metadata = ctor?.[MetadataSymbol];
    if (!metadata) {
        return [];
    }
    const result = [];
    let currentMeta = metadata;
    while (currentMeta) {
        if (Object.prototype.hasOwnProperty.call(currentMeta, __bjsPropStoreKey)) {
            const store = currentMeta[__bjsPropStoreKey];
            result.push(...store);
        }
        currentMeta = Object.getPrototypeOf(currentMeta);
    }
    return result;
}
//# sourceMappingURL=nodeDecorator.js.map