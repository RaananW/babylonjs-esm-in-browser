import { IsNavigatorAvailable } from "../Misc/domManagement.js";
/**
 * Whether the current platform is macOS / iOS.
 * Used by keyboard blocks to resolve the platform-appropriate
 * "command or control" modifier (Cmd on Mac, Ctrl elsewhere).
 * @internal
 */
export const _IsMacPlatform = IsNavigatorAvailable() && /(Mac|iPhone|iPod|iPad)/i.test(navigator.platform);
/**
 * @internal
 * Returns if mesh1 is a descendant of mesh2
 * @param mesh1
 * @param mesh2
 * @returns
 */
export function _IsDescendantOf(mesh1, mesh2) {
    return !!(mesh1.parent && (mesh1.parent === mesh2 || _IsDescendantOf(mesh1.parent, mesh2)));
}
/**
 * @internal
 */
export function _GetClassNameOf(v) {
    if (v.getClassName) {
        return v.getClassName();
    }
    return;
}
/**
 * @internal
 * Check if two classname are the same and are vector or quaternion classes.
 * @param className the first class name
 * @param className2 the second class name
 * @returns whether the two class names are the same and are vector or quaternion classes.
 */
export function _AreSameVectorOrQuaternionClass(className, className2) {
    return (className === className2 &&
        (className === "Vector2" /* FlowGraphTypes.Vector2 */ || className === "Vector3" /* FlowGraphTypes.Vector3 */ || className === "Vector4" /* FlowGraphTypes.Vector4 */ || className === "Quaternion" /* FlowGraphTypes.Quaternion */));
}
/**
 * @internal
 * Check if two classname are the same and are matrix classes.
 * @param className the first class name
 * @param className2 the second class name
 * @returns whether the two class names are the same and are matrix classes.
 */
export function _AreSameMatrixClass(className, className2) {
    return className === className2 && (className === "Matrix" /* FlowGraphTypes.Matrix */ || className === "Matrix2D" /* FlowGraphTypes.Matrix2D */ || className === "Matrix3D" /* FlowGraphTypes.Matrix3D */);
}
/**
 * @internal
 * Check if two classname are the same and are integer classes.
 * @param className the first class name
 * @param className2 the second class name
 * @returns whether the two class names are the same and are integer classes.
 */
export function _AreSameIntegerClass(className, className2) {
    return className === "FlowGraphInteger" && className2 === "FlowGraphInteger";
}
/**
 * Check if an object has a numeric value.
 * @param a the object to check if it is a number.
 * @param validIfNaN whether to consider NaN as a valid number.
 * @returns whether a is a FlowGraphNumber (Integer or number).
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export function isNumeric(a, validIfNaN) {
    const isNumeric = typeof a === "number" || typeof a?.value === "number";
    if (isNumeric && !validIfNaN) {
        return !isNaN(getNumericValue(a));
    }
    return isNumeric;
}
/**
 * Get the numeric value of a FlowGraphNumber.
 * @param a the object to get the numeric value from.
 * @returns the numeric value.
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export function getNumericValue(a) {
    return typeof a === "number" ? a : a.value;
}
//# sourceMappingURL=utils.js.map