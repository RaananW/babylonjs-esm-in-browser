/**
 * Expected simplification settings.
 * Quality should be between 0 and 1 (1 being 100%, 0 being 0%)
 * @see https://doc.babylonjs.com/features/featuresDeepDive/mesh/simplifyingMeshes
 */
export interface ISimplificationSettings {
    /**
     * Gets or sets the expected quality
     */
    quality: number;
    /**
     * Gets or sets the distance when this optimized version should be used
     */
    distance: number;
    /**
     * Gets an already optimized mesh
     */
    optimizeMesh?: boolean | undefined;
}
/**
 * Class used to specify simplification options
 * @see https://doc.babylonjs.com/features/featuresDeepDive/mesh/simplifyingMeshes
 */
export declare class SimplificationSettings implements ISimplificationSettings {
    /** expected quality */
    quality: number;
    /** distance when this optimized version should be used */
    distance: number;
    /** already optimized mesh  */
    optimizeMesh?: boolean | undefined;
    /**
     * Creates a SimplificationSettings
     * @param quality expected quality
     * @param distance distance when this optimized version should be used
     * @param optimizeMesh already optimized mesh
     */
    constructor(
    /** expected quality */
    quality: number, 
    /** distance when this optimized version should be used */
    distance: number, 
    /** already optimized mesh  */
    optimizeMesh?: boolean | undefined);
}
/**
 * The implemented types of simplification
 * At the moment only Quadratic Error Decimation is implemented
 * @see https://doc.babylonjs.com/features/featuresDeepDive/mesh/simplifyingMeshes
 */
export declare enum SimplificationType {
    /** Quadratic error decimation */
    QUADRATIC = 0
}
