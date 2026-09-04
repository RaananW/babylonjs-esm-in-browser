import { GetDirectStoreFromMetadata } from "./decorators.functions.js";
function generateSerializableMember(type, sourceName) {
    return (_value, context) => {
        if (!context.metadata) {
            return;
        }
        const propertyKey = String(context.name);
        const store = GetDirectStoreFromMetadata(context.metadata);
        if (!store[propertyKey]) {
            store[propertyKey] = { type: type, sourceName: sourceName };
        }
    };
}
function generateExpandMember(setCallback, targetKey = null) {
    return (_value, context) => {
        const key = targetKey || "_" + String(context.name);
        return {
            init(value) {
                if (value !== undefined || !(key in this)) {
                    this[key] = value;
                }
                return value;
            },
            get() {
                return this[key];
            },
            set(value) {
                // does this object (i.e. vector3) has an equals function? use it!
                // Note - not using "with epsilon" here, it is expected te behave like the internal cache does.
                if (typeof this[key]?.equals === "function") {
                    if (this[key].equals(value)) {
                        return;
                    }
                }
                if (this[key] === value) {
                    return;
                }
                this[key] = value;
                this[setCallback]();
            },
        };
    };
}
export function expandToProperty(callback, targetKey = null) {
    return generateExpandMember(callback, targetKey);
}
export function serialize(sourceName) {
    return generateSerializableMember(0 /* SerializedFieldType.VALUE */, sourceName);
}
export function serializeAsTexture(sourceName) {
    return generateSerializableMember(1 /* SerializedFieldType.TEXTURE */, sourceName);
}
export function serializeAsColor3(sourceName) {
    return generateSerializableMember(2 /* SerializedFieldType.COLOR3 */, sourceName);
}
export function serializeAsFresnelParameters(sourceName) {
    return generateSerializableMember(3 /* SerializedFieldType.FRESNEL_PARAMETERS */, sourceName);
}
export function serializeAsVector2(sourceName) {
    return generateSerializableMember(4 /* SerializedFieldType.VECTOR2 */, sourceName);
}
export function serializeAsVector3(sourceName) {
    return generateSerializableMember(5 /* SerializedFieldType.VECTOR3 */, sourceName);
}
export function serializeAsMeshReference(sourceName) {
    return generateSerializableMember(6 /* SerializedFieldType.MESH */, sourceName);
}
export function serializeAsColorCurves(sourceName) {
    return generateSerializableMember(7 /* SerializedFieldType.COLOR_CURVES */, sourceName);
}
export function serializeAsColor4(sourceName) {
    return generateSerializableMember(8 /* SerializedFieldType.COLOR4 */, sourceName);
}
export function serializeAsImageProcessingConfiguration(sourceName) {
    return generateSerializableMember(9 /* SerializedFieldType.IMAGE_PROCESSING */, sourceName);
}
export function serializeAsQuaternion(sourceName) {
    return generateSerializableMember(10 /* SerializedFieldType.QUATERNION */, sourceName);
}
export function serializeAsMatrix(sourceName) {
    return generateSerializableMember(12 /* SerializedFieldType.MATRIX */, sourceName);
}
export function serializeAsVector4(sourceName) {
    return generateSerializableMember(13 /* SerializedFieldType.VECTOR4 */, sourceName);
}
/**
 * Decorator used to define property that can be serialized as reference to a camera
 * @param sourceName defines the name of the property to decorate
 * @returns Property Decorator
 */
export function serializeAsCameraReference(sourceName) {
    return generateSerializableMember(11 /* SerializedFieldType.CAMERA */, sourceName);
}
/**
 * Shared implementation for the {@link nativeOverride} decorator and its `.filter` variant.
 * Both flavors install a wrapper that, on first invocation, resolves the function to use once:
 * either the original JS function or (when running in a Babylon Native context) a native-aware
 * function produced by `resolveNative`. The resolved function then replaces the wrapper on the
 * target so subsequent calls skip this setup entirely.
 * @param originalMethod - The decorated JS method.
 * @param context - The TC39 method decorator context.
 * @param resolveNative - Builds the function to use when a native override is present, given the
 * native function and the original JS function.
 * @returns The wrapper function that replaces the decorated method.
 */
function ApplyNativeOverride(originalMethod, context, resolveNative) {
    const propertyKey = String(context.name);
    let resolvedFunc = null;
    const wrapper = function (...params) {
        if (resolvedFunc === null) {
            // Default to the original JS function.
            resolvedFunc = originalMethod;
            // Check if we are executing in a Babylon Native context and if so, check for a function override.
            if (typeof _native !== "undefined" && _native[propertyKey]) {
                resolvedFunc = resolveNative(_native[propertyKey], originalMethod);
            }
            const target = (this && (context.static ? this : Object.getPrototypeOf(this)));
            if (target?.[propertyKey] === wrapper) {
                target[propertyKey] = resolvedFunc;
            }
        }
        return resolvedFunc.apply(this, params);
    };
    return wrapper;
}
/**
 * Decorator used to redirect a function to a native implementation if available.
 * @internal
 */
export function nativeOverride(originalMethod, context) {
    // When a native override exists, use it directly.
    return ApplyNativeOverride(originalMethod, context, (nativeFunc) => nativeFunc);
}
/**
 * Decorator factory that applies the nativeOverride decorator, but determines whether to redirect to the native implementation based on a filter function that evaluates the function arguments.
 * @param predicate
 * @example @nativeOverride.filter((arg1: string) => arg1.length > 20)
 *          public someMethod(arg1: string, arg2: number): string {
 * @internal
 */
nativeOverride.filter = function (predicate) {
    return (originalMethod, context) => {
        // When a native override exists, evaluate the predicate on each call to choose between the native and JS function.
        return ApplyNativeOverride(originalMethod, context, (nativeFunc, jsFunc) => {
            return function (...args) {
                if (predicate(...args)) {
                    // The native function is invoked without a `this` binding, matching the original behavior.
                    return nativeFunc(...args);
                }
                return jsFunc.apply(this, args);
            };
        });
    };
};
/**
 * Adds accessors for a material property.
 * Applied to an auto-accessor field. Reads/writes from a private backing field named by sourceKey (default: "_" + property name).
 * The backing field is expected to have a `.value` property.
 * @param setCallback - The name of the callback function to call when the property is set.
 * @param sourceKey - The name of the private field that stores the value (defaults to "_" + accessor name).
 * @returns An accessor decorator.
 */
export function addAccessorsForMaterialProperty(setCallback, sourceKey = null) {
    return (_value, context) => {
        const key = sourceKey || "_" + String(context.name);
        return {
            get() {
                return this[key]?.value;
            },
            set(value) {
                // does this object (i.e. vector3) has an equals function? use it!
                // Note - not using "with epsilon" here, it is expected te behave like the internal cache does.
                if (typeof this[key]?.value?.equals === "function") {
                    if (this[key].value.equals(value)) {
                        return;
                    }
                }
                if (this[key].value === value) {
                    return;
                }
                this[key].value = value;
                this[setCallback]();
            },
        };
    };
}
//# sourceMappingURL=decorators.js.map