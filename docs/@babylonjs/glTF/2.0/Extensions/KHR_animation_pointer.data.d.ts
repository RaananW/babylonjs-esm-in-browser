import { Animation } from "@babylonjs/core/Animations/animation.js";
import type { ICamera, IKHRLightsPunctual_Light, IMaterial } from "../glTFLoaderInterfaces";
import type { IAnimatable } from "@babylonjs/core/Animations/animatable.interface.js";
import { AnimationPropertyInfo } from "../glTFLoaderAnimation";
declare class CameraAnimationPropertyInfo extends AnimationPropertyInfo {
    /** @internal */
    buildAnimations(target: ICamera, name: string, fps: number, keys: any[], callback: (babylonAnimatable: IAnimatable, babylonAnimation: Animation) => void): void;
}
declare class MaterialAnimationPropertyInfo extends AnimationPropertyInfo {
    /** @internal */
    buildAnimations(target: IMaterial, name: string, fps: number, keys: any[], callback: (babylonAnimatable: IAnimatable, babylonAnimation: Animation) => void): void;
}
declare class LightAnimationPropertyInfo extends AnimationPropertyInfo {
    /** @internal */
    buildAnimations(target: IKHRLightsPunctual_Light, name: string, fps: number, keys: any[], callback: (babylonAnimatable: IAnimatable, babylonAnimation: Animation) => void): void;
}
/** @internal */
export declare const animationPointerTree: {
    nodes: {
        __array__: {
            translation: import("../glTFLoaderAnimation").TransformNodeAnimationPropertyInfo[];
            rotation: import("../glTFLoaderAnimation").TransformNodeAnimationPropertyInfo[];
            scale: import("../glTFLoaderAnimation").TransformNodeAnimationPropertyInfo[];
            weights: import("../glTFLoaderAnimation").WeightAnimationPropertyInfo[];
            __target__: boolean;
        };
    };
    materials: {
        __array__: {
            __target__: boolean;
            pbrMetallicRoughness: {
                baseColorFactor: MaterialAnimationPropertyInfo[];
                metallicFactor: MaterialAnimationPropertyInfo[];
                roughnessFactor: MaterialAnimationPropertyInfo[];
                baseColorTexture: {
                    extensions: {
                        KHR_texture_transform: {
                            scale: MaterialAnimationPropertyInfo[];
                            offset: MaterialAnimationPropertyInfo[];
                            rotation: MaterialAnimationPropertyInfo[];
                        };
                    };
                };
            };
            emissiveFactor: MaterialAnimationPropertyInfo[];
            normalTexture: {
                scale: MaterialAnimationPropertyInfo[];
            };
            occlusionTexture: {
                strength: MaterialAnimationPropertyInfo[];
                extensions: {
                    KHR_texture_transform: {
                        scale: MaterialAnimationPropertyInfo[];
                        offset: MaterialAnimationPropertyInfo[];
                        rotation: MaterialAnimationPropertyInfo[];
                    };
                };
            };
            emissiveTexture: {
                extensions: {
                    KHR_texture_transform: {
                        scale: MaterialAnimationPropertyInfo[];
                        offset: MaterialAnimationPropertyInfo[];
                        rotation: MaterialAnimationPropertyInfo[];
                    };
                };
            };
            extensions: {
                KHR_materials_ior: {
                    ior: MaterialAnimationPropertyInfo[];
                };
                KHR_materials_clearcoat: {
                    clearcoatFactor: MaterialAnimationPropertyInfo[];
                    clearcoatRoughnessFactor: MaterialAnimationPropertyInfo[];
                };
                KHR_materials_sheen: {
                    sheenColorFactor: MaterialAnimationPropertyInfo[];
                    sheenRoughnessFactor: MaterialAnimationPropertyInfo[];
                };
                KHR_materials_specular: {
                    specularFactor: MaterialAnimationPropertyInfo[];
                    specularColorFactor: MaterialAnimationPropertyInfo[];
                };
                KHR_materials_emissive_strength: {
                    emissiveStrength: MaterialAnimationPropertyInfo[];
                };
                KHR_materials_transmission: {
                    transmissionFactor: MaterialAnimationPropertyInfo[];
                };
                KHR_materials_volume: {
                    attenuationColor: MaterialAnimationPropertyInfo[];
                    attenuationDistance: MaterialAnimationPropertyInfo[];
                    thicknessFactor: MaterialAnimationPropertyInfo[];
                };
                KHR_materials_iridescence: {
                    iridescenceFactor: MaterialAnimationPropertyInfo[];
                    iridescenceIor: MaterialAnimationPropertyInfo[];
                    iridescenceThicknessMinimum: MaterialAnimationPropertyInfo[];
                    iridescenceThicknessMaximum: MaterialAnimationPropertyInfo[];
                };
            };
        };
    };
    cameras: {
        __array__: {
            __target__: boolean;
            orthographic: {
                xmag: CameraAnimationPropertyInfo[];
                ymag: CameraAnimationPropertyInfo[];
                zfar: CameraAnimationPropertyInfo[];
                znear: CameraAnimationPropertyInfo[];
            };
            perspective: {
                yfov: CameraAnimationPropertyInfo[];
                zfar: CameraAnimationPropertyInfo[];
                znear: CameraAnimationPropertyInfo[];
            };
        };
    };
    extensions: {
        KHR_lights_punctual: {
            lights: {
                __array__: {
                    __target__: boolean;
                    color: LightAnimationPropertyInfo[];
                    intensity: LightAnimationPropertyInfo[];
                    range: LightAnimationPropertyInfo[];
                    spot: {
                        innerConeAngle: LightAnimationPropertyInfo[];
                        outerConeAngle: LightAnimationPropertyInfo[];
                    };
                };
            };
        };
    };
};
export {};