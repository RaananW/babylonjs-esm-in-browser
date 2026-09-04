import { type Nullable } from "../types.js";
/**
 * TC39 decorator context types that serialization decorators can be applied to.
 * Serialization decorators can be applied to fields, getters, setters, and auto-accessors.
 * `metadata` can be undefined at runtime when `Symbol.metadata` is not available (e.g. tree-shaken
 * usage on a runtime that lacks native support and never triggered the polyfill); in that case the
 * serialization metadata is simply not recorded.
 */
type SerializableContext = {
    name: string | symbol;
    metadata: DecoratorMetadataObject | undefined;
};
export declare function expandToProperty(callback: string, targetKey?: Nullable<string>): <This, V>(_value: ClassAccessorDecoratorTarget<This, V>, context: ClassAccessorDecoratorContext<This, V>) => ClassAccessorDecoratorResult<This, V>;
export declare function serialize(sourceName?: string): (_value: unknown, context: SerializableContext) => void;
export declare function serializeAsTexture(sourceName?: string): (_value: unknown, context: SerializableContext) => void;
export declare function serializeAsColor3(sourceName?: string): (_value: unknown, context: SerializableContext) => void;
export declare function serializeAsFresnelParameters(sourceName?: string): (_value: unknown, context: SerializableContext) => void;
export declare function serializeAsVector2(sourceName?: string): (_value: unknown, context: SerializableContext) => void;
export declare function serializeAsVector3(sourceName?: string): (_value: unknown, context: SerializableContext) => void;
export declare function serializeAsMeshReference(sourceName?: string): (_value: unknown, context: SerializableContext) => void;
export declare function serializeAsColorCurves(sourceName?: string): (_value: unknown, context: SerializableContext) => void;
export declare function serializeAsColor4(sourceName?: string): (_value: unknown, context: SerializableContext) => void;
export declare function serializeAsImageProcessingConfiguration(sourceName?: string): (_value: unknown, context: SerializableContext) => void;
export declare function serializeAsQuaternion(sourceName?: string): (_value: unknown, context: SerializableContext) => void;
export declare function serializeAsMatrix(sourceName?: string): (_value: unknown, context: SerializableContext) => void;
export declare function serializeAsVector4(sourceName?: string): (_value: unknown, context: SerializableContext) => void;
/**
 * Decorator used to define property that can be serialized as reference to a camera
 * @param sourceName defines the name of the property to decorate
 * @returns Property Decorator
 */
export declare function serializeAsCameraReference(sourceName?: string): (_value: unknown, context: SerializableContext) => void;
/**
 * Decorator used to redirect a function to a native implementation if available.
 * @internal
 */
export declare function nativeOverride<This, Args extends any[], Return>(originalMethod: (this: This, ...args: Args) => Return, context: ClassMethodDecoratorContext<This, (this: This, ...args: Args) => Return>): (this: This, ...args: Args) => Return;
export declare namespace nativeOverride {
    var filter: <T extends (...params: any) => boolean>(predicate: T) => <This, Args extends any[], Return>(originalMethod: (this: This, ...args: Args) => Return, context: ClassMethodDecoratorContext<This, (this: This, ...args: Args) => Return>) => ((this: This, ...args: Args) => Return);
}
/**
 * Adds accessors for a material property.
 * Applied to an auto-accessor field. Reads/writes from a private backing field named by sourceKey (default: "_" + property name).
 * The backing field is expected to have a `.value` property.
 * @param setCallback - The name of the callback function to call when the property is set.
 * @param sourceKey - The name of the private field that stores the value (defaults to "_" + accessor name).
 * @returns An accessor decorator.
 */
export declare function addAccessorsForMaterialProperty(setCallback: string, sourceKey?: Nullable<string>): <This, V>(_value: ClassAccessorDecoratorTarget<This, V>, context: ClassAccessorDecoratorContext<This, V>) => ClassAccessorDecoratorResult<This, V>;
export {};
