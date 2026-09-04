type PrepassDefinesMixinConstructor<T = {}> = new (...args: any[]) => T;
/**
 * Mixin to add prepass defines to your material defines
 * @internal
 */
export declare function PrepassDefinesMixin<Tbase extends PrepassDefinesMixinConstructor>(base: Tbase): {
    new (...args: any[]): {
        PREPASS: boolean;
        PREPASS_COLOR: boolean;
        PREPASS_COLOR_INDEX: number;
        PREPASS_IRRADIANCE_LEGACY: boolean;
        PREPASS_IRRADIANCE_LEGACY_INDEX: number;
        PREPASS_IRRADIANCE: boolean;
        PREPASS_IRRADIANCE_INDEX: number;
        PREPASS_ALBEDO: boolean;
        PREPASS_ALBEDO_INDEX: number;
        PREPASS_ALBEDO_SQRT: boolean;
        PREPASS_ALBEDO_SQRT_INDEX: number;
        PREPASS_DEPTH: boolean;
        PREPASS_DEPTH_INDEX: number;
        PREPASS_SCREENSPACE_DEPTH: boolean;
        PREPASS_SCREENSPACE_DEPTH_INDEX: number;
        PREPASS_NORMALIZED_VIEW_DEPTH: boolean;
        PREPASS_NORMALIZED_VIEW_DEPTH_INDEX: number;
        PREPASS_NORMAL: boolean;
        PREPASS_NORMAL_INDEX: number;
        PREPASS_NORMAL_WORLDSPACE: boolean;
        PREPASS_WORLD_NORMAL: boolean;
        PREPASS_WORLD_NORMAL_INDEX: number;
        PREPASS_POSITION: boolean;
        PREPASS_POSITION_INDEX: number;
        PREPASS_LOCAL_POSITION: boolean;
        PREPASS_LOCAL_POSITION_INDEX: number;
        PREPASS_VELOCITY: boolean;
        PREPASS_VELOCITY_INDEX: number;
        PREPASS_VELOCITY_LINEAR: boolean;
        PREPASS_VELOCITY_LINEAR_INDEX: number;
        PREPASS_REFLECTIVITY: boolean;
        PREPASS_REFLECTIVITY_INDEX: number;
        SCENE_MRT_COUNT: number;
    };
} & Tbase;
export {};
