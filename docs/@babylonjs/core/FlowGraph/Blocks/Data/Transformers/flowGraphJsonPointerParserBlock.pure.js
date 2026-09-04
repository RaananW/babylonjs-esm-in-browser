/** This file must only contain pure code and pure imports */
import { FlowGraphPathConverterComponent } from "../../../flowGraphPathConverterComponent.js";
import { RichTypeAny } from "../../../flowGraphRichTypes.pure.js";
import { Vector3, Vector4 } from "../../../../Maths/math.vector.pure.js";
import { Color3, Color4 } from "../../../../Maths/math.color.pure.js";
import { FlowGraphCachedOperationBlock } from "../flowGraphCachedOperationBlock.js";
import { RegisterClass } from "../../../../Misc/typeStore.js";
/**
 * This block will take a JSON pointer and parse it to get the value from the JSON object.
 * The output is an object and a property name.
 * Optionally, the block can also output the value of the property. This is configurable.
 */
export class FlowGraphJsonPointerParserBlock extends FlowGraphCachedOperationBlock {
    constructor(
    /**
     * the configuration of the block
     */
    config) {
        super(RichTypeAny, config);
        this.config = config;
        this.object = this.registerDataOutput("object", RichTypeAny);
        this.propertyName = this.registerDataOutput("propertyName", RichTypeAny);
        this.setterFunction = this.registerDataOutput("setFunction", RichTypeAny, this._setPropertyValue.bind(this));
        this.getterFunction = this.registerDataOutput("getFunction", RichTypeAny, this._getPropertyValue.bind(this));
        this.generateAnimationsFunction = this.registerDataOutput("generateAnimationsFunction", RichTypeAny, this._getInterpolationAnimationPropertyInfo.bind(this));
        this.templateComponent = new FlowGraphPathConverterComponent(config.jsonPointer, this);
    }
    _doOperation(context) {
        const accessorContainer = this.templateComponent.getAccessor(this.config.pathConverter, context);
        // Pass the context as the accessor payload so context-aware object-model accessors, such as
        // one validating a delay handle against the runtime active-delay set, can resolve.
        const value = accessorContainer.info.get(accessorContainer.object, undefined, context);
        const object = accessorContainer.info.getTarget?.(accessorContainer.object);
        const propertyName = accessorContainer.info.getPropertyName?.[0](accessorContainer.object);
        if (!object) {
            throw new Error("Object is undefined");
        }
        else {
            this.object.setValue(object, context);
            if (propertyName) {
                this.propertyName.setValue(propertyName, context);
            }
        }
        return value;
    }
    _setPropertyValue(_target, _propertyName, value, context) {
        const accessorContainer = this.templateComponent.getAccessor(this.config.pathConverter, context);
        const type = accessorContainer.info.type;
        if (type.startsWith("Color")) {
            value = ToColor(value, type);
        }
        // Unwrap FlowGraphInteger to plain number for numeric setters
        if (typeof value?.value === "number" && value?.getClassName?.() === "FlowGraphInteger") {
            value = value.value;
        }
        accessorContainer.info.set?.(value, accessorContainer.object);
    }
    _getPropertyValue(_target, _propertyName, context) {
        const accessorContainer = this.templateComponent.getAccessor(this.config.pathConverter, context);
        const type = accessorContainer.info.type;
        // Pass the context as the accessor payload (see _doOperation) so context-aware accessors
        // can resolve.
        const value = accessorContainer.info.get(accessorContainer.object, undefined, context);
        if (type.startsWith("Color")) {
            return FromColor(value);
        }
        return value;
    }
    _getInterpolationAnimationPropertyInfo(_target, _propertyName, context) {
        const accessorContainer = this.templateComponent.getAccessor(this.config.pathConverter, context);
        return (keys, fps, animationType, easingFunction) => {
            const animations = [];
            // make sure keys are of the right type (in case of float3 color/vector)
            const type = accessorContainer.info.type;
            if (type.startsWith("Color")) {
                keys = keys.map((key) => {
                    return {
                        frame: key.frame,
                        value: ToColor(key.value, type),
                    };
                });
            }
            accessorContainer.info.interpolation?.forEach((info, index) => {
                const name = accessorContainer.info.getPropertyName?.[index](accessorContainer.object) || "Animation-interpolation-" + index;
                // generate the keys based on interpolation info
                let newKeys = keys;
                if (animationType !== info.type) {
                    // convert the keys to the right type
                    newKeys = keys.map((key) => {
                        return {
                            frame: key.frame,
                            value: info.getValue(undefined, key.value.asArray ? key.value.asArray() : [key.value], 0, 1),
                        };
                    });
                }
                const animationData = info.buildAnimations(accessorContainer.object, name, 60, newKeys);
                for (const animation of animationData) {
                    if (easingFunction) {
                        animation.babylonAnimation.setEasingFunction(easingFunction);
                    }
                    animations.push(animation.babylonAnimation);
                }
            });
            return animations;
        };
    }
    /**
     * Gets the class name of this block
     * @returns the class name
     */
    getClassName() {
        return "FlowGraphJsonPointerParserBlock" /* FlowGraphBlockNames.JsonPointerParser */;
    }
}
function ToColor(value, expectedValue) {
    if (value.getClassName().startsWith("Color")) {
        return value;
    }
    if (expectedValue === "Color3") {
        return new Color3(value.x, value.y, value.z);
    }
    else if (expectedValue === "Color4") {
        return new Color4(value.x, value.y, value.z, value.w);
    }
    return value;
}
function FromColor(value) {
    if (value instanceof Color3) {
        return new Vector3(value.r, value.g, value.b);
    }
    else if (value instanceof Color4) {
        return new Vector4(value.r, value.g, value.b, value.a);
    }
    throw new Error("Invalid color type");
}
let _Registered = false;
/**
 * Register side effects for flowGraphJsonPointerParserBlock.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterFlowGraphJsonPointerParserBlock() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    RegisterClass("FlowGraphJsonPointerParserBlock" /* FlowGraphBlockNames.JsonPointerParser */, FlowGraphJsonPointerParserBlock);
}
//# sourceMappingURL=flowGraphJsonPointerParserBlock.pure.js.map