
/**
 * Checks if a given format is a depth texture format
 * @param format Format to check
 * @returns True if the format is a depth texture format
 */
export function IsDepthTexture(format) {
    return (format === 13 ||
        format === 14 ||
        format === 15 ||
        format === 16 ||
        format === 17 ||
        format === 18 ||
        format === 19);
}
/**
 * Gets the type of a depth texture for a given format
 * @param format Format of the texture
 * @returns The type of the depth texture
 */
export function GetTypeForDepthTexture(format) {
    switch (format) {
        case 13:
        case 17:
        case 18:
        case 14:
        case 16:
            return 1;
        case 15:
            return 5;
        case 19:
            return 0;
    }
    return 0;
}
/**
 * Checks if a given format has a stencil aspect
 * @param format Format to check
 * @returns True if the format has a stencil aspect
 */
export function HasStencilAspect(format) {
    return (format === 13 ||
        format === 17 ||
        format === 18 ||
        format === 19);
}
//# sourceMappingURL=textureHelper.functions.js.map