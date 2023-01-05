/* eslint-disable @typescript-eslint/naming-convention */
import { Animation } from "@babylonjs/core/Animations/animation.js";
import { AnimationPropertyInfo, nodeAnimationData } from "../glTFLoaderAnimation.js";
import { Color3 } from "@babylonjs/core/Maths/math.color.js";
function getColor3(_target, source, offset, scale) {
    return Color3.FromArray(source, offset).scale(scale);
}
function getAlpha(_target, source, offset, scale) {
    return source[offset + 3] * scale;
}
function getFloat(_target, source, offset, scale) {
    return source[offset] * scale;
}
function getMinusFloat(_target, source, offset, scale) {
    return -source[offset] * scale;
}
function getNextFloat(_target, source, offset, scale) {
    return source[offset + 1] * scale;
}
function getFloatBy2(_target, source, offset, scale) {
    return source[offset] * scale * 2;
}
function getTextureTransformTree(textureName) {
    return {
        scale: [
            new MaterialAnimationPropertyInfo(Animation.ANIMATIONTYPE_FLOAT, `${textureName}.uScale`, getFloat, () => 2),
            new MaterialAnimationPropertyInfo(Animation.ANIMATIONTYPE_FLOAT, `${textureName}.vScale`, getNextFloat, () => 2),
        ],
        offset: [
            new MaterialAnimationPropertyInfo(Animation.ANIMATIONTYPE_FLOAT, `${textureName}.uOffset`, getFloat, () => 2),
            new MaterialAnimationPropertyInfo(Animation.ANIMATIONTYPE_FLOAT, `${textureName}.vOffset`, getNextFloat, () => 2),
        ],
        rotation: [new MaterialAnimationPropertyInfo(Animation.ANIMATIONTYPE_FLOAT, `${textureName}.wAng`, getMinusFloat, () => 1)],
    };
}
class CameraAnimationPropertyInfo extends AnimationPropertyInfo {
    /** @internal */
    buildAnimations(target, name, fps, keys, callback) {
        callback(target._babylonCamera, this._buildAnimation(name, fps, keys));
    }
}
class MaterialAnimationPropertyInfo extends AnimationPropertyInfo {
    /** @internal */
    buildAnimations(target, name, fps, keys, callback) {
        for (const fillMode in target._data) {
            callback(target._data[fillMode].babylonMaterial, this._buildAnimation(name, fps, keys));
        }
    }
}
class LightAnimationPropertyInfo extends AnimationPropertyInfo {
    /** @internal */
    buildAnimations(target, name, fps, keys, callback) {
        callback(target._babylonLight, this._buildAnimation(name, fps, keys));
    }
}
const nodesTree = {
    __array__: {
        __target__: true,
        ...nodeAnimationData,
    },
};
const camerasTree = {
    __array__: {
        __target__: true,
        orthographic: {
            xmag: [
                new CameraAnimationPropertyInfo(Animation.ANIMATIONTYPE_FLOAT, "orthoLeft", getMinusFloat, () => 1),
                new CameraAnimationPropertyInfo(Animation.ANIMATIONTYPE_FLOAT, "orthoRight", getNextFloat, () => 1),
            ],
            ymag: [
                new CameraAnimationPropertyInfo(Animation.ANIMATIONTYPE_FLOAT, "orthoBottom", getMinusFloat, () => 1),
                new CameraAnimationPropertyInfo(Animation.ANIMATIONTYPE_FLOAT, "orthoTop", getNextFloat, () => 1),
            ],
            zfar: [new CameraAnimationPropertyInfo(Animation.ANIMATIONTYPE_FLOAT, "maxZ", getFloat, () => 1)],
            znear: [new CameraAnimationPropertyInfo(Animation.ANIMATIONTYPE_FLOAT, "minZ", getFloat, () => 1)],
        },
        perspective: {
            yfov: [new CameraAnimationPropertyInfo(Animation.ANIMATIONTYPE_FLOAT, "fov", getFloat, () => 1)],
            zfar: [new CameraAnimationPropertyInfo(Animation.ANIMATIONTYPE_FLOAT, "maxZ", getFloat, () => 1)],
            znear: [new CameraAnimationPropertyInfo(Animation.ANIMATIONTYPE_FLOAT, "minZ", getFloat, () => 1)],
        },
    },
};
const materialsTree = {
    __array__: {
        __target__: true,
        pbrMetallicRoughness: {
            baseColorFactor: [
                new MaterialAnimationPropertyInfo(Animation.ANIMATIONTYPE_COLOR3, "albedoColor", getColor3, () => 4),
                new MaterialAnimationPropertyInfo(Animation.ANIMATIONTYPE_FLOAT, "alpha", getAlpha, () => 4),
            ],
            metallicFactor: [new MaterialAnimationPropertyInfo(Animation.ANIMATIONTYPE_FLOAT, "metallic", getFloat, () => 1)],
            roughnessFactor: [new MaterialAnimationPropertyInfo(Animation.ANIMATIONTYPE_FLOAT, "roughness", getFloat, () => 1)],
            baseColorTexture: {
                extensions: {
                    KHR_texture_transform: getTextureTransformTree("albedoTexture"),
                },
            },
        },
        emissiveFactor: [new MaterialAnimationPropertyInfo(Animation.ANIMATIONTYPE_COLOR3, "emissiveColor", getColor3, () => 3)],
        normalTexture: {
            scale: [new MaterialAnimationPropertyInfo(Animation.ANIMATIONTYPE_FLOAT, "bumpTexture.level", getFloat, () => 1)],
        },
        occlusionTexture: {
            strength: [new MaterialAnimationPropertyInfo(Animation.ANIMATIONTYPE_FLOAT, "ambientTextureStrength", getFloat, () => 1)],
            extensions: {
                KHR_texture_transform: getTextureTransformTree("ambientTexture"),
            },
        },
        emissiveTexture: {
            extensions: {
                KHR_texture_transform: getTextureTransformTree("emissiveTexture"),
            },
        },
        extensions: {
            KHR_materials_ior: {
                ior: [new MaterialAnimationPropertyInfo(Animation.ANIMATIONTYPE_FLOAT, "indexOfRefraction", getFloat, () => 1)],
            },
            KHR_materials_clearcoat: {
                clearcoatFactor: [new MaterialAnimationPropertyInfo(Animation.ANIMATIONTYPE_FLOAT, "clearCoat.intensity", getFloat, () => 1)],
                clearcoatRoughnessFactor: [new MaterialAnimationPropertyInfo(Animation.ANIMATIONTYPE_FLOAT, "clearCoat.roughness", getFloat, () => 1)],
            },
            KHR_materials_sheen: {
                sheenColorFactor: [new MaterialAnimationPropertyInfo(Animation.ANIMATIONTYPE_COLOR3, "sheen.color", getColor3, () => 3)],
                sheenRoughnessFactor: [new MaterialAnimationPropertyInfo(Animation.ANIMATIONTYPE_FLOAT, "sheen.roughness", getFloat, () => 1)],
            },
            KHR_materials_specular: {
                specularFactor: [new MaterialAnimationPropertyInfo(Animation.ANIMATIONTYPE_FLOAT, "metallicF0Factor", getFloat, () => 1)],
                specularColorFactor: [new MaterialAnimationPropertyInfo(Animation.ANIMATIONTYPE_COLOR3, "metallicReflectanceColor", getColor3, () => 3)],
            },
            KHR_materials_emissive_strength: {
                emissiveStrength: [new MaterialAnimationPropertyInfo(Animation.ANIMATIONTYPE_FLOAT, "emissiveIntensity", getFloat, () => 1)],
            },
            KHR_materials_transmission: {
                transmissionFactor: [new MaterialAnimationPropertyInfo(Animation.ANIMATIONTYPE_FLOAT, "subSurface.refractionIntensity", getFloat, () => 1)],
            },
            KHR_materials_volume: {
                attenuationColor: [new MaterialAnimationPropertyInfo(Animation.ANIMATIONTYPE_COLOR3, "subSurface.tintColor", getColor3, () => 3)],
                attenuationDistance: [new MaterialAnimationPropertyInfo(Animation.ANIMATIONTYPE_FLOAT, "subSurface.tintColorAtDistance", getFloat, () => 1)],
                thicknessFactor: [new MaterialAnimationPropertyInfo(Animation.ANIMATIONTYPE_FLOAT, "subSurface.maximumThickness", getFloat, () => 1)],
            },
            KHR_materials_iridescence: {
                iridescenceFactor: [new MaterialAnimationPropertyInfo(Animation.ANIMATIONTYPE_FLOAT, "iridescence.intensity", getFloat, () => 1)],
                iridescenceIor: [new MaterialAnimationPropertyInfo(Animation.ANIMATIONTYPE_FLOAT, "iridescence.indexOfRefraction", getFloat, () => 1)],
                iridescenceThicknessMinimum: [new MaterialAnimationPropertyInfo(Animation.ANIMATIONTYPE_FLOAT, "iridescence.minimumThickness", getFloat, () => 1)],
                iridescenceThicknessMaximum: [new MaterialAnimationPropertyInfo(Animation.ANIMATIONTYPE_FLOAT, "iridescence.maximumThickness", getFloat, () => 1)],
            },
        },
    },
};
const extensionsTree = {
    KHR_lights_punctual: {
        lights: {
            __array__: {
                __target__: true,
                color: [new LightAnimationPropertyInfo(Animation.ANIMATIONTYPE_COLOR3, "diffuse", getColor3, () => 3)],
                intensity: [new LightAnimationPropertyInfo(Animation.ANIMATIONTYPE_FLOAT, "intensity", getFloat, () => 1)],
                range: [new LightAnimationPropertyInfo(Animation.ANIMATIONTYPE_FLOAT, "range", getFloat, () => 1)],
                spot: {
                    innerConeAngle: [new LightAnimationPropertyInfo(Animation.ANIMATIONTYPE_FLOAT, "innerAngle", getFloatBy2, () => 1)],
                    outerConeAngle: [new LightAnimationPropertyInfo(Animation.ANIMATIONTYPE_FLOAT, "angle", getFloatBy2, () => 1)],
                },
            },
        },
    },
};
/** @internal */
export const animationPointerTree = {
    nodes: nodesTree,
    materials: materialsTree,
    cameras: camerasTree,
    extensions: extensionsTree,
};
//# sourceMappingURL=KHR_animation_pointer.data.js.map