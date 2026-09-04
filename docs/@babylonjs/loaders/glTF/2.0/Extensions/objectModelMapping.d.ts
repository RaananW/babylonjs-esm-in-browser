import { type TransformNode } from "@babylonjs/core/Meshes/transformNode.js";
import { type IAnimation, type ICamera, type IGLTF, type IKHRLightsPunctual_Light, type IEXTLightsArea_Light, type IMaterial, type IMesh, type IMeshPrimitive, type INode, type IScene, type ISkin } from "../glTFLoaderInterfaces.js";
import { type Vector3, Matrix, Quaternion, Vector2 } from "@babylonjs/core/Maths/math.vector.pure.js";
import { type Color3, Color4 } from "@babylonjs/core/Maths/math.color.pure.js";
import { type PBRMaterial } from "@babylonjs/core/Materials/PBR/pbrMaterial.js";
import { type Light } from "@babylonjs/core/Lights/light.js";
import { type Nullable } from "@babylonjs/core/types.js";
import { type IEXTLightsImageBased_LightImageBased } from "babylonjs-gltf2interface";
import { type BaseTexture } from "@babylonjs/core/Materials/Textures/baseTexture.js";
import { type IInterpolationPropertyInfo, type IObjectAccessor } from "@babylonjs/core/FlowGraph/typeDefinitions.js";
import { FlowGraphInteger } from "@babylonjs/core/FlowGraph/CustomTypes/flowGraphInteger.pure.js";
import { GLTFPathToObjectConverter } from "./gltfPathToObjectConverter.js";
import { type AnimationGroup } from "@babylonjs/core/Animations/animationGroup.js";
import { type Mesh } from "@babylonjs/core/Meshes/mesh.js";
/**
 * Top-level shape of the glTF Object Model accessor tree. Each property
 * describes a navigable section of the JSON-Pointer namespace (e.g. `/nodes`,
 * `/materials`, `/scenes`) that KHR_interactivity, KHR_animation_pointer and
 * other extensions consume via {@link GetMappingForKey}.
 */
export interface IGLTFObjectModelTree {
    /** Read-only accessor for the active scene index (`/scene`). */
    scene: {
        __target__: boolean;
    } & IObjectAccessor<number | undefined, any, number>;
    /** Accessor tree for `/cameras`. */
    cameras: IGLTFObjectModelTreeCamerasObject;
    /** Accessor tree for `/nodes`. */
    nodes: IGLTFObjectModelTreeNodesObject;
    /** Accessor tree for `/materials`. */
    materials: IGLTFObjectModelTreeMaterialsObject;
    /** Accessor tree for `/extensions` (root-level glTF extensions). */
    extensions: IGLTFObjectModelTreeExtensionsObject;
    /** Accessor tree for `/animations`. */
    animations: {
        length: IObjectAccessor<IAnimation[], AnimationGroup[], FlowGraphInteger>;
        __array__: {};
    };
    /** Accessor tree for `/meshes`. */
    meshes: IGLTFObjectModelTreeMeshesObject;
    /** Accessor tree for `/scenes`. */
    scenes: IGLTFObjectModelTreeScenesObject;
    /** Accessor tree for `/skins`. */
    skins: IGLTFObjectModelTreeSkinsObject;
}
/**
 * Accessor tree describing the `/nodes` section of the glTF Object Model.
 * Exposes per-node TRS, ref-typed parent/children/camera/mesh/skin links,
 * morph-target weights and node-extension properties.
 */
export interface IGLTFObjectModelTreeNodesObject<GLTFTargetType = INode, BabylonTargetType = TransformNode> {
    /** Number of nodes in the array. */
    length: IObjectAccessor<GLTFTargetType[], BabylonTargetType[], FlowGraphInteger>;
    __array__: {
        __target__: boolean;
        translation: IObjectAccessor<GLTFTargetType, BabylonTargetType, Vector3>;
        rotation: IObjectAccessor<GLTFTargetType, BabylonTargetType, Quaternion>;
        scale: IObjectAccessor<GLTFTargetType, BabylonTargetType, Vector3>;
        matrix: IObjectAccessor<GLTFTargetType, BabylonTargetType, Matrix>;
        globalMatrix: IObjectAccessor<GLTFTargetType, BabylonTargetType, Matrix>;
        camera: IObjectAccessor<GLTFTargetType, any, string | undefined>;
        mesh: IObjectAccessor<GLTFTargetType, any, string | undefined>;
        skin: IObjectAccessor<GLTFTargetType, any, string | undefined>;
        parent: IObjectAccessor<GLTFTargetType, any, string | undefined>;
        children: {
            length: IObjectAccessor<number[], any, FlowGraphInteger>;
            __array__: {
                __target__: boolean;
            } & IObjectAccessor<any, any, string>;
        };
        weights: {
            /** When true, the path converter skips objectTree traversal for this property, keeping the parent target. */
            __passThroughTarget__?: boolean;
            length: IObjectAccessor<GLTFTargetType, BabylonTargetType, FlowGraphInteger>;
            __array__: {
                __target__: boolean;
            } & IObjectAccessor<GLTFTargetType, any, number>;
        } & IObjectAccessor<GLTFTargetType, BabylonTargetType, number[]>;
        extensions: {
            EXT_lights_ies?: {
                multiplier: IObjectAccessor<INode, Light, number>;
                color: IObjectAccessor<INode, Light, Color3>;
            };
            KHR_node_visibility?: {
                visible: IObjectAccessor<INode, Mesh, boolean>;
            };
        };
    };
}
/**
 * Accessor tree describing the `/cameras` section of the glTF Object Model.
 * Exposes orthographic and perspective camera properties.
 */
export interface IGLTFObjectModelTreeCamerasObject {
    /** Number of cameras in the array. */
    length: IObjectAccessor<ICamera[], any, FlowGraphInteger>;
    __array__: {
        __target__: boolean;
        orthographic: {
            xmag: IObjectAccessor<ICamera, ICamera, Vector2>;
            ymag: IObjectAccessor<ICamera, ICamera, Vector2>;
            zfar: IObjectAccessor<ICamera, ICamera, number>;
            znear: IObjectAccessor<ICamera, ICamera, number>;
        };
        perspective: {
            yfov: IObjectAccessor<ICamera, ICamera, number>;
            zfar: IObjectAccessor<ICamera, ICamera, number>;
            znear: IObjectAccessor<ICamera, ICamera, number>;
            aspectRatio: IObjectAccessor<ICamera, ICamera, Nullable<number>>;
        };
    };
}
/**
 * Accessor tree describing the `/materials` section of the glTF Object Model.
 * Covers core PBR properties as well as the family of KHR_materials_* extensions.
 */
export interface IGLTFObjectModelTreeMaterialsObject {
    /** Number of materials in the array. */
    length: IObjectAccessor<IMaterial[], PBRMaterial[], FlowGraphInteger>;
    __array__: {
        __target__: boolean;
        doubleSided: IObjectAccessor<IMaterial, PBRMaterial, boolean>;
        alphaCutoff: IObjectAccessor<IMaterial, PBRMaterial, number>;
        pbrMetallicRoughness: {
            baseColorFactor: IObjectAccessor<IMaterial, PBRMaterial, Color4>;
            metallicFactor: IObjectAccessor<IMaterial, PBRMaterial, Nullable<number>>;
            roughnessFactor: IObjectAccessor<IMaterial, PBRMaterial, Nullable<number>>;
            baseColorTexture: {
                extensions: {
                    KHR_texture_transform: ITextureDefinition;
                };
            };
            metallicRoughnessTexture: {
                extensions: {
                    KHR_texture_transform: ITextureDefinition;
                };
            };
        };
        emissiveFactor: IObjectAccessor<IMaterial, PBRMaterial, Color3>;
        normalTexture: {
            scale: IObjectAccessor<IMaterial, PBRMaterial, number>;
            extensions: {
                KHR_texture_transform: ITextureDefinition;
            };
        };
        occlusionTexture: {
            strength: IObjectAccessor<IMaterial, PBRMaterial, number>;
            extensions: {
                KHR_texture_transform: ITextureDefinition;
            };
        };
        emissiveTexture: {
            extensions: {
                KHR_texture_transform: ITextureDefinition;
            };
        };
        extensions: {
            KHR_materials_anisotropy: {
                anisotropyStrength: IObjectAccessor<IMaterial, PBRMaterial, number>;
                anisotropyRotation: IObjectAccessor<IMaterial, PBRMaterial, number>;
                anisotropyTexture: {
                    extensions: {
                        KHR_texture_transform: ITextureDefinition;
                    };
                };
            };
            KHR_materials_clearcoat: {
                clearcoatFactor: IObjectAccessor<IMaterial, PBRMaterial, number>;
                clearcoatRoughnessFactor: IObjectAccessor<IMaterial, PBRMaterial, number>;
                clearcoatTexture: {
                    extensions: {
                        KHR_texture_transform: ITextureDefinition;
                    };
                };
                clearcoatNormalTexture: {
                    scale: IObjectAccessor<IMaterial, PBRMaterial, number>;
                    extensions: {
                        KHR_texture_transform: ITextureDefinition;
                    };
                };
                clearcoatRoughnessTexture: {
                    extensions: {
                        KHR_texture_transform: ITextureDefinition;
                    };
                };
            };
            KHR_materials_dispersion: {
                dispersion: IObjectAccessor<IMaterial, PBRMaterial, number>;
            };
            KHR_materials_emissive_strength: {
                emissiveStrength: IObjectAccessor<IMaterial, PBRMaterial, number>;
            };
            KHR_materials_ior: {
                ior: IObjectAccessor<IMaterial, PBRMaterial, number>;
            };
            KHR_materials_iridescence: {
                iridescenceFactor: IObjectAccessor<IMaterial, PBRMaterial, number>;
                iridescenceIor: IObjectAccessor<IMaterial, PBRMaterial, number>;
                iridescenceThicknessMinimum: IObjectAccessor<IMaterial, PBRMaterial, number>;
                iridescenceThicknessMaximum: IObjectAccessor<IMaterial, PBRMaterial, number>;
                iridescenceTexture: {
                    extensions: {
                        KHR_texture_transform: ITextureDefinition;
                    };
                };
                iridescenceThicknessTexture: {
                    extensions: {
                        KHR_texture_transform: ITextureDefinition;
                    };
                };
            };
            KHR_materials_sheen: {
                sheenColorFactor: IObjectAccessor<IMaterial, PBRMaterial, Color3>;
                sheenRoughnessFactor: IObjectAccessor<IMaterial, PBRMaterial, number>;
                sheenColorTexture: {
                    extensions: {
                        KHR_texture_transform: ITextureDefinition;
                    };
                };
                sheenRoughnessTexture: {
                    extensions: {
                        KHR_texture_transform: ITextureDefinition;
                    };
                };
            };
            KHR_materials_specular: {
                specularFactor: IObjectAccessor<IMaterial, PBRMaterial, number>;
                specularColorFactor: IObjectAccessor<IMaterial, PBRMaterial, Color3>;
                specularTexture: {
                    extensions: {
                        KHR_texture_transform: ITextureDefinition;
                    };
                };
                specularColorTexture: {
                    extensions: {
                        KHR_texture_transform: ITextureDefinition;
                    };
                };
            };
            KHR_materials_transmission: {
                transmissionFactor: IObjectAccessor<IMaterial, PBRMaterial, number>;
                transmissionTexture: {
                    extensions: {
                        KHR_texture_transform: ITextureDefinition;
                    };
                };
            };
            KHR_materials_diffuse_transmission: {
                diffuseTransmissionFactor: IObjectAccessor<IMaterial, PBRMaterial, number>;
                diffuseTransmissionTexture: {
                    extensions: {
                        KHR_texture_transform: ITextureDefinition;
                    };
                };
                diffuseTransmissionColorFactor: IObjectAccessor<IMaterial, PBRMaterial, Nullable<Color3>>;
                diffuseTransmissionColorTexture: {
                    extensions: {
                        KHR_texture_transform: ITextureDefinition;
                    };
                };
            };
            KHR_materials_volume: {
                thicknessFactor: IObjectAccessor<IMaterial, PBRMaterial, number>;
                attenuationColor: IObjectAccessor<IMaterial, PBRMaterial, Color3>;
                attenuationDistance: IObjectAccessor<IMaterial, PBRMaterial, number>;
                thicknessTexture: {
                    extensions: {
                        KHR_texture_transform: ITextureDefinition;
                    };
                };
            };
        };
    };
}
interface ITextureDefinition {
    offset: IObjectAccessor<IMaterial, PBRMaterial, Vector2>;
    rotation: IObjectAccessor<IMaterial, PBRMaterial, number>;
    scale: IObjectAccessor<IMaterial, PBRMaterial, Vector2>;
}
/**
 * Accessor tree describing the `/meshes` section of the glTF Object Model.
 * Exposes per-mesh primitives (and their material refs) and the mesh-level
 * morph-target weights array.
 */
export interface IGLTFObjectModelTreeMeshesObject {
    /** Number of meshes in the array. */
    length: IObjectAccessor<IMesh[], (Mesh | undefined)[], FlowGraphInteger>;
    __array__: {
        __target__: boolean;
        primitives: {
            length: IObjectAccessor<IMeshPrimitive[], any, FlowGraphInteger>;
            __array__: {
                __target__: boolean;
                material: IObjectAccessor<any, any, string | undefined>;
            };
        };
        weights: {
            length: IObjectAccessor<number[], any, FlowGraphInteger>;
            __array__: {
                __target__: boolean;
            } & IObjectAccessor<any, any, number>;
        };
    };
}
/**
 * Accessor tree describing the `/scenes` section of the glTF Object Model.
 * Per-scene root-node refs are exposed under `nodes/{i}`.
 */
export interface IGLTFObjectModelTreeScenesObject {
    /** Number of scenes in the array. */
    length: IObjectAccessor<IScene[], any, FlowGraphInteger>;
    __array__: {
        __target__: boolean;
        nodes: {
            length: IObjectAccessor<number[], any, FlowGraphInteger>;
            __array__: {
                __target__: boolean;
            } & IObjectAccessor<any, any, string>;
        };
    };
}
/**
 * Accessor tree describing the `/skins` section of the glTF Object Model.
 * Joint and skeleton properties are exposed as JSON-Pointer refs.
 */
export interface IGLTFObjectModelTreeSkinsObject {
    /** Number of skins in the array. */
    length: IObjectAccessor<ISkin[], any, FlowGraphInteger>;
    __array__: {
        __target__: boolean;
        joints: {
            length: IObjectAccessor<number[], any, FlowGraphInteger>;
            __array__: {
                __target__: boolean;
            } & IObjectAccessor<any, any, string>;
        };
        skeleton: IObjectAccessor<ISkin, any, string | undefined>;
    };
}
/**
 * Accessor tree describing root-level glTF extensions exposed through the
 * Object Model. Currently covers the punctual / area / IES / image-based
 * light extension families.
 */
export interface IGLTFObjectModelTreeExtensionsObject {
    /** Accessor tree for `/extensions/KHR_lights_punctual`. */
    KHR_lights_punctual: {
        lights: {
            length: IObjectAccessor<IKHRLightsPunctual_Light[], Light[], FlowGraphInteger>;
            __array__: {
                __target__: boolean;
                color: IObjectAccessor<IKHRLightsPunctual_Light, Light, Color3>;
                intensity: IObjectAccessor<IKHRLightsPunctual_Light, Light, number>;
                range: IObjectAccessor<IKHRLightsPunctual_Light, Light, number>;
                spot: {
                    innerConeAngle: IObjectAccessor<IKHRLightsPunctual_Light, Light, number>;
                    outerConeAngle: IObjectAccessor<IKHRLightsPunctual_Light, Light, number>;
                };
            };
        };
    };
    /** Accessor tree for `/extensions/EXT_lights_area`. */
    EXT_lights_area: {
        lights: {
            length: IObjectAccessor<IEXTLightsArea_Light[], Light[], FlowGraphInteger>;
            __array__: {
                __target__: boolean;
                color: IObjectAccessor<IEXTLightsArea_Light, Light, Color3>;
                intensity: IObjectAccessor<IEXTLightsArea_Light, Light, number>;
                size: IObjectAccessor<IEXTLightsArea_Light, Light, number>;
                rect: {
                    aspect: IObjectAccessor<IEXTLightsArea_Light, Light, number>;
                };
            };
        };
    };
    /** Accessor tree for `/extensions/EXT_lights_ies`. */
    EXT_lights_ies: {
        lights: {
            length: IObjectAccessor<IKHRLightsPunctual_Light[], Light[], FlowGraphInteger>;
        };
    };
    /** Accessor tree for `/extensions/EXT_lights_image_based`. */
    EXT_lights_image_based: {
        lights: {
            __array__: {
                __target__: boolean;
                intensity: IObjectAccessor<IEXTLightsImageBased_LightImageBased, BaseTexture, number>;
                rotation: IObjectAccessor<IEXTLightsImageBased_LightImageBased, BaseTexture, Quaternion>;
            };
            length: IObjectAccessor<IEXTLightsImageBased_LightImageBased[], BaseTexture[], FlowGraphInteger>;
        };
    };
}
/**
 * get a path-to-object converter for the given glTF tree
 * @param gltf the glTF tree to use
 * @returns a path-to-object converter for the given glTF tree
 */
export declare function GetPathToObjectConverter(gltf: IGLTF): GLTFPathToObjectConverter<unknown, unknown, unknown>;
/**
 * This function will return the object accessor for the given key in the object model
 * If the key is not found, it will return undefined
 * @param key the key to get the mapping for, for example /materials/\{\}/emissiveFactor
 * @returns an object accessor for the given key, or undefined if the key is not found
 */
export declare function GetMappingForKey(key: string): IObjectAccessor | undefined;
/**
 * Set interpolation for a specific key in the object model
 * @param key the key to set, for example /materials/\{\}/emissiveFactor
 * @param interpolation the interpolation elements array
 */
export declare function SetInterpolationForKey(key: string, interpolation?: IInterpolationPropertyInfo[]): void;
/**
 * This will ad a new object accessor in the object model at the given key.
 * Note that this will NOT change the typescript types. To do that you will need to change the interface itself (extending it in the module that uses it)
 * @param key the key to add the object accessor at. For example /cameras/\{\}/perspective/aspectRatio
 * @param accessor the object accessor to add
 */
export declare function AddObjectAccessorToKey<GLTFTargetType = any, BabylonTargetType = any, BabylonValueType = any>(key: string, accessor: IObjectAccessor<GLTFTargetType, BabylonTargetType, BabylonValueType>): void;
export {};
