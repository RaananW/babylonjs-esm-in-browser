/** @internal */
// eslint-disable-next-line @typescript-eslint/naming-convention
const RegisteredTypes = {};
/**
 * @internal
 */
export function RegisterClass(className, type) {
    RegisteredTypes[className] = type;
}
/**
 * @internal
 */
export function GetClass(fqdn) {
    return RegisteredTypes[fqdn];
}
/**
 * @internal
 */
export function GetClassName(obj) {
    for (const key in RegisteredTypes) {
        if (obj instanceof RegisteredTypes[key] && !key.includes("Abstract")) {
            return key;
        }
    }
    return "Unknown";
}
//# sourceMappingURL=typeStore.js.map