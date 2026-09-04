/**
 * Class used to specify simplification options
 * @see https://doc.babylonjs.com/features/featuresDeepDive/mesh/simplifyingMeshes
 */
export class SimplificationSettings {
    /**
     * Creates a SimplificationSettings
     * @param quality expected quality
     * @param distance distance when this optimized version should be used
     * @param optimizeMesh already optimized mesh
     */
    constructor(
    /** expected quality */
    quality, 
    /** distance when this optimized version should be used */
    distance, 
    /** already optimized mesh  */
    optimizeMesh) {
        this.quality = quality;
        this.distance = distance;
        this.optimizeMesh = optimizeMesh;
    }
}
/**
 * The implemented types of simplification
 * At the moment only Quadratic Error Decimation is implemented
 * @see https://doc.babylonjs.com/features/featuresDeepDive/mesh/simplifyingMeshes
 */
export var SimplificationType;
(function (SimplificationType) {
    /** Quadratic error decimation */
    SimplificationType[SimplificationType["QUADRATIC"] = 0] = "QUADRATIC";
})(SimplificationType || (SimplificationType = {}));
//# sourceMappingURL=meshSimplification.common.js.map