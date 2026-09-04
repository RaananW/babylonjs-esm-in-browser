/**
 * Mixin to add UV defines to your material defines
 * @internal
 */
export function EnvironmentLightingDefinesMixin(base) {
    return class extends base {
        constructor() {
            super(...arguments);
            this.REFLECTION = false;
            this.REFLECTIONMAP_3D = false;
            this.REFLECTIONMAP_SPHERICAL = false;
            this.REFLECTIONMAP_PLANAR = false;
            this.REFLECTIONMAP_CUBIC = false;
            this.USE_LOCAL_REFLECTIONMAP_CUBIC = false;
            this.REFLECTIONMAP_PROJECTION = false;
            this.REFLECTIONMAP_SKYBOX = false;
            this.REFLECTIONMAP_EXPLICIT = false;
            this.REFLECTIONMAP_EQUIRECTANGULAR = false;
            this.REFLECTIONMAP_EQUIRECTANGULAR_FIXED = false;
            this.REFLECTIONMAP_MIRROREDEQUIRECTANGULAR_FIXED = false;
            this.INVERTCUBICMAP = false;
            this.USESPHERICALFROMREFLECTIONMAP = false;
            this.USEIRRADIANCEMAP = false;
            this.USE_IRRADIANCE_DOMINANT_DIRECTION = false;
            this.USESPHERICALINVERTEX = false;
            this.REFLECTIONMAP_OPPOSITEZ = false;
            this.LODINREFLECTIONALPHA = false;
            this.GAMMAREFLECTION = false;
            this.RGBDREFLECTION = false;
        }
    };
}
//# sourceMappingURL=environmentLighting.defines.js.map