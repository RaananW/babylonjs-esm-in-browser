/**
 * Mixin to add UV defines to your material defines
 * @internal
 */
export function UVDefinesMixin(base) {
    return class extends base {
        constructor() {
            super(...arguments);
            this.MAINUV1 = false;
            this.MAINUV2 = false;
            this.MAINUV3 = false;
            this.MAINUV4 = false;
            this.MAINUV5 = false;
            this.MAINUV6 = false;
            this.UV1 = false;
            this.UV2 = false;
            this.UV3 = false;
            this.UV4 = false;
            this.UV5 = false;
            this.UV6 = false;
        }
    };
}
//# sourceMappingURL=uv.defines.js.map