type EnvironmentLightingDefinesMixinConstructor<T = {}> = new (...args: any[]) => T;
/**
 * Mixin to add UV defines to your material defines
 * @internal
 */
export declare function EnvironmentLightingDefinesMixin<Tbase extends EnvironmentLightingDefinesMixinConstructor>(base: Tbase): {
    new (...args: any[]): {
        REFLECTION: boolean;
        REFLECTIONMAP_3D: boolean;
        REFLECTIONMAP_SPHERICAL: boolean;
        REFLECTIONMAP_PLANAR: boolean;
        REFLECTIONMAP_CUBIC: boolean;
        USE_LOCAL_REFLECTIONMAP_CUBIC: boolean;
        REFLECTIONMAP_PROJECTION: boolean;
        REFLECTIONMAP_SKYBOX: boolean;
        REFLECTIONMAP_EXPLICIT: boolean;
        REFLECTIONMAP_EQUIRECTANGULAR: boolean;
        REFLECTIONMAP_EQUIRECTANGULAR_FIXED: boolean;
        REFLECTIONMAP_MIRROREDEQUIRECTANGULAR_FIXED: boolean;
        INVERTCUBICMAP: boolean;
        USESPHERICALFROMREFLECTIONMAP: boolean;
        USEIRRADIANCEMAP: boolean;
        USE_IRRADIANCE_DOMINANT_DIRECTION: boolean;
        USESPHERICALINVERTEX: boolean;
        REFLECTIONMAP_OPPOSITEZ: boolean;
        LODINREFLECTIONALPHA: boolean;
        GAMMAREFLECTION: boolean;
        RGBDREFLECTION: boolean;
    };
} & Tbase;
export {};
