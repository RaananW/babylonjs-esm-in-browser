type UVDefinesMixinConstructor<T = {}> = new (...args: any[]) => T;
/**
 * Mixin to add UV defines to your material defines
 * @internal
 */
export declare function UVDefinesMixin<Tbase extends UVDefinesMixinConstructor>(base: Tbase): {
    new (...args: any[]): {
        MAINUV1: boolean;
        MAINUV2: boolean;
        MAINUV3: boolean;
        MAINUV4: boolean;
        MAINUV5: boolean;
        MAINUV6: boolean;
        UV1: boolean;
        UV2: boolean;
        UV3: boolean;
        UV4: boolean;
        UV5: boolean;
        UV6: boolean;
    };
} & Tbase;
export {};
