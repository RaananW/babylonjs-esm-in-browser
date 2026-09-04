/** This file must only contain pure code and pure imports */
import { Vector2, Vector3, Vector4, Matrix, Quaternion } from "../Maths/math.vector.pure.js";
import { Color3, Color4 } from "../Maths/math.color.pure.js";
import { FlowGraphInteger } from "./CustomTypes/flowGraphInteger.pure.js";

import { FlowGraphMatrix2D, FlowGraphMatrix3D } from "./CustomTypes/flowGraphMatrix.js";
/**
 * The types supported by the flow graph.
 */
export var FlowGraphTypes;
(function (FlowGraphTypes) {
    FlowGraphTypes["Any"] = "any";
    FlowGraphTypes["String"] = "string";
    FlowGraphTypes["Number"] = "number";
    FlowGraphTypes["Boolean"] = "boolean";
    FlowGraphTypes["Object"] = "object";
    FlowGraphTypes["Integer"] = "FlowGraphInteger";
    FlowGraphTypes["Vector2"] = "Vector2";
    FlowGraphTypes["Vector3"] = "Vector3";
    FlowGraphTypes["Vector4"] = "Vector4";
    FlowGraphTypes["Quaternion"] = "Quaternion";
    FlowGraphTypes["Matrix"] = "Matrix";
    FlowGraphTypes["Matrix2D"] = "Matrix2D";
    FlowGraphTypes["Matrix3D"] = "Matrix3D";
    FlowGraphTypes["Color3"] = "Color3";
    FlowGraphTypes["Color4"] = "Color4";
})(FlowGraphTypes || (FlowGraphTypes = {}));
/**
 * A rich type represents extra information about a type,
 * such as its name and a default value constructor.
 */
export class RichType {
    constructor(
    /**
     * The name given to the type.
     */
    typeName, 
    /**
     * The default value of the type.
     */
    defaultValue, 
    /**
     * [-1] The ANIMATIONTYPE of the type, if available
     */
    animationType = -1) {
        this.typeName = typeName;
        this.defaultValue = defaultValue;
        this.animationType = animationType;
    }
    /**
     * Serializes this rich type into a serialization object.
     * @param serializationObject the object to serialize to
     */
    serialize(serializationObject) {
        serializationObject.typeName = this.typeName;
        serializationObject.defaultValue = this.defaultValue;
    }
}
export const RichTypeAny = new RichType("any" /* FlowGraphTypes.Any */, undefined);
export const RichTypeString = new RichType("string" /* FlowGraphTypes.String */, "");
export const RichTypeNumber = new RichType("number" /* FlowGraphTypes.Number */, 0, 0);
export const RichTypeBoolean = new RichType("boolean" /* FlowGraphTypes.Boolean */, false);
export const RichTypeVector2 = new RichType("Vector2" /* FlowGraphTypes.Vector2 */, Vector2.Zero(), 5);
export const RichTypeVector3 = new RichType("Vector3" /* FlowGraphTypes.Vector3 */, Vector3.Zero(), 1);
export const RichTypeVector4 = new RichType("Vector4" /* FlowGraphTypes.Vector4 */, Vector4.Zero());
export const RichTypeMatrix = new RichType("Matrix" /* FlowGraphTypes.Matrix */, Matrix.Identity(), 3);
export const RichTypeMatrix2D = new RichType("Matrix2D" /* FlowGraphTypes.Matrix2D */, new FlowGraphMatrix2D());
export const RichTypeMatrix3D = new RichType("Matrix3D" /* FlowGraphTypes.Matrix3D */, new FlowGraphMatrix3D());
export const RichTypeColor3 = new RichType("Color3" /* FlowGraphTypes.Color3 */, Color3.Black(), 4);
export const RichTypeColor4 = new RichType("Color4" /* FlowGraphTypes.Color4 */, new Color4(0, 0, 0, 0), 7);
export const RichTypeQuaternion = new RichType("Quaternion" /* FlowGraphTypes.Quaternion */, Quaternion.Identity(), 2);
export const RichTypeFlowGraphInteger = new RichType("FlowGraphInteger" /* FlowGraphTypes.Integer */, new FlowGraphInteger(0), 0);
/**
 * Given a value, try to deduce its rich type.
 * @param value the value to deduce the rich type from
 * @returns the value's rich type, or RichTypeAny if the type could not be deduced.
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export function getRichTypeFromValue(value) {
    const anyValue = value;
    switch (typeof value) {
        case "string" /* FlowGraphTypes.String */:
            return RichTypeString;
        case "number" /* FlowGraphTypes.Number */:
            return RichTypeNumber;
        case "boolean" /* FlowGraphTypes.Boolean */:
            return RichTypeBoolean;
        case "object" /* FlowGraphTypes.Object */:
            if (anyValue.getClassName) {
                switch (anyValue.getClassName()) {
                    case "Vector2" /* FlowGraphTypes.Vector2 */:
                        return RichTypeVector2;
                    case "Vector3" /* FlowGraphTypes.Vector3 */:
                        return RichTypeVector3;
                    case "Vector4" /* FlowGraphTypes.Vector4 */:
                        return RichTypeVector4;
                    case "Matrix" /* FlowGraphTypes.Matrix */:
                        return RichTypeMatrix;
                    case "Color3" /* FlowGraphTypes.Color3 */:
                        return RichTypeColor3;
                    case "Color4" /* FlowGraphTypes.Color4 */:
                        return RichTypeColor4;
                    case "Quaternion" /* FlowGraphTypes.Quaternion */:
                        return RichTypeQuaternion;
                    case "FlowGraphInteger" /* FlowGraphTypes.Integer */:
                        return RichTypeFlowGraphInteger;
                    case "Matrix2D" /* FlowGraphTypes.Matrix2D */:
                        return RichTypeMatrix2D;
                    case "Matrix3D" /* FlowGraphTypes.Matrix3D */:
                        return RichTypeMatrix3D;
                }
            }
            return RichTypeAny;
        default:
            return RichTypeAny;
    }
}
/**
 * Given a flow graph type, return the rich type that corresponds to it.
 * @param flowGraphType the flow graph type
 * @returns the rich type that corresponds to the flow graph type
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export function getRichTypeByFlowGraphType(flowGraphType) {
    switch (flowGraphType) {
        case "string" /* FlowGraphTypes.String */:
            return RichTypeString;
        case "number" /* FlowGraphTypes.Number */:
            return RichTypeNumber;
        case "boolean" /* FlowGraphTypes.Boolean */:
            return RichTypeBoolean;
        case "Vector2" /* FlowGraphTypes.Vector2 */:
            return RichTypeVector2;
        case "Vector3" /* FlowGraphTypes.Vector3 */:
            return RichTypeVector3;
        case "Vector4" /* FlowGraphTypes.Vector4 */:
            return RichTypeVector4;
        case "Matrix" /* FlowGraphTypes.Matrix */:
            return RichTypeMatrix;
        case "Color3" /* FlowGraphTypes.Color3 */:
            return RichTypeColor3;
        case "Color4" /* FlowGraphTypes.Color4 */:
            return RichTypeColor4;
        case "Quaternion" /* FlowGraphTypes.Quaternion */:
            return RichTypeQuaternion;
        case "FlowGraphInteger" /* FlowGraphTypes.Integer */:
            return RichTypeFlowGraphInteger;
        case "Matrix2D" /* FlowGraphTypes.Matrix2D */:
            return RichTypeMatrix2D;
        case "Matrix3D" /* FlowGraphTypes.Matrix3D */:
            return RichTypeMatrix3D;
        default:
            return RichTypeAny;
    }
}
/**
 * get the animation type for a given flow graph type
 * @param flowGraphType the flow graph type
 * @returns the animation type for this flow graph type
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export function getAnimationTypeByFlowGraphType(flowGraphType) {
    switch (flowGraphType) {
        case "number" /* FlowGraphTypes.Number */:
            return 0;
        case "Vector2" /* FlowGraphTypes.Vector2 */:
            return 5;
        case "Vector3" /* FlowGraphTypes.Vector3 */:
            return 1;
        case "Matrix" /* FlowGraphTypes.Matrix */:
            return 3;
        case "Color3" /* FlowGraphTypes.Color3 */:
            return 4;
        case "Color4" /* FlowGraphTypes.Color4 */:
            return 7;
        case "Quaternion" /* FlowGraphTypes.Quaternion */:
            return 2;
        default:
            return 0;
    }
}
/**
 * Given an animation type, return the rich type that corresponds to it.
 * @param animationType the animation type
 * @returns the rich type that corresponds to the animation type
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export function getRichTypeByAnimationType(animationType) {
    switch (animationType) {
        case 0:
            return RichTypeNumber;
        case 5:
            return RichTypeVector2;
        case 1:
            return RichTypeVector3;
        case 3:
            return RichTypeMatrix;
        case 4:
            return RichTypeColor3;
        case 7:
            return RichTypeColor4;
        case 2:
            return RichTypeQuaternion;
        default:
            return RichTypeAny;
    }
}
let _Registered = false;
/**
 * Register side effects for flowGraphRichTypes.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterFlowGraphRichTypes() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    RichTypeQuaternion.typeTransformer = (value) => {
        if (value.getClassName) {
            if (value.getClassName() === "Vector4" /* FlowGraphTypes.Vector4 */) {
                return Quaternion.FromArray(value.asArray());
            }
            else if (value.getClassName() === "Vector3" /* FlowGraphTypes.Vector3 */) {
                return Quaternion.FromEulerVector(value);
            }
            else if (value.getClassName() === "Matrix" /* FlowGraphTypes.Matrix */) {
                return Quaternion.FromRotationMatrix(value);
            }
        }
        return value;
    };
}
//# sourceMappingURL=flowGraphRichTypes.pure.js.map