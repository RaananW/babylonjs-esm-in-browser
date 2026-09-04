/* eslint-disable @typescript-eslint/naming-convention */
import { Matrix, Quaternion, Vector2 } from "@babylonjs/core/Maths/math.vector.pure.js";
import { Constants } from "@babylonjs/core/Engines/constants.js";
import { Color4 } from "@babylonjs/core/Maths/math.color.pure.js";
import { SpotLight } from "@babylonjs/core/Lights/spotLight.pure.js";
import { FlowGraphInteger } from "@babylonjs/core/FlowGraph/CustomTypes/flowGraphInteger.pure.js";
import { GLTFPathToObjectConverter } from "./gltfPathToObjectConverter.js";
/**
 * Builds an accessor for an array `length` pointer (e.g. `/nodes.length`, `/meshes/{}/primitives.length`).
 *
 * The KHR object model types these `length` values as `int`, so the accessor reports the count as a
 * {@link FlowGraphInteger} (type {@link FlowGraphTypes.Integer}). Keeping the representation an integer
 * at the source lets integer-typed consumers such as `FlowGraphIntToFloat` accept the precise
 * `RichTypeFlowGraphInteger` instead of a widened `RichTypeAny`.
 * @param getLength returns the raw count for the addressed array; may be `undefined` when the array is not addressable
 * @param getTarget returns the Babylon object(s) backing the array
 * @returns an object accessor whose value is the count as a {@link FlowGraphInteger}
 */
function _CreateLengthAccessor(getLength, getTarget) {
    return {
        type: "FlowGraphInteger" /* FlowGraphTypes.Integer */,
        get: (target) => {
            const length = getLength(target);
            return length === undefined ? undefined : FlowGraphInteger.FromValue(length);
        },
        getTarget,
        getPropertyName: [() => "length"],
    };
}
const nodesTree = {
    length: _CreateLengthAccessor((nodes) => nodes.length, (nodes) => nodes.map((node) => node._babylonTransformNode)),
    __array__: {
        __target__: true,
        translation: {
            type: "Vector3",
            get: (node) => node._babylonTransformNode?.position,
            set: (value, node) => node._babylonTransformNode?.position.copyFrom(value),
            getTarget: (node) => node._babylonTransformNode,
            getPropertyName: [() => "position"],
        },
        rotation: {
            type: "Quaternion",
            get: (node) => node._babylonTransformNode?.rotationQuaternion,
            set: (value, node) => node._babylonTransformNode?.rotationQuaternion?.copyFrom(value),
            getTarget: (node) => node._babylonTransformNode,
            getPropertyName: [() => "rotationQuaternion"],
        },
        scale: {
            type: "Vector3",
            get: (node) => node._babylonTransformNode?.scaling,
            set: (value, node) => node._babylonTransformNode?.scaling.copyFrom(value),
            getTarget: (node) => node._babylonTransformNode,
            getPropertyName: [() => "scaling"],
        },
        weights: {
            // Skip glTF objectTree traversal — weights may be undefined on the glTF node
            // but accessible via the Babylon MorphTargetManager on the INode's meshes
            __passThroughTarget__: true,
            length: _CreateLengthAccessor((node) => {
                const found = _findNodeMorphTargets(node);
                return found ? found.mtm.numTargets : node?.mesh !== undefined ? 0 : undefined;
            }, (node) => node?._babylonTransformNode),
            __array__: {
                __target__: true,
                type: "number",
                get: (node, index) => {
                    const found = _findNodeMorphTargets(node);
                    if (found && index !== undefined && index >= 0 && index < found.mtm.numTargets) {
                        return _roundFloat32Artifact(found.mtm.getTarget(index).influence);
                    }
                    return undefined;
                },
                set: (value, node, index) => {
                    const numValue = typeof value === "number" ? value : typeof value?.value === "number" ? value.value : value;
                    const found = _findNodeMorphTargets(node);
                    if (!found || index === undefined || index < 0 || index >= found.mtm.numTargets) {
                        return;
                    }
                    // Fan out to every mesh that shares this morph target manager so
                    // multi-primitive meshes stay in sync.
                    for (const mesh of found.meshes) {
                        const target = mesh.morphTargetManager?.getTarget(index);
                        if (target) {
                            target.influence = numValue;
                        }
                    }
                },
                getTarget: (node, index) => {
                    const found = _findNodeMorphTargets(node);
                    if (found && index !== undefined && index >= 0 && index < found.mtm.numTargets) {
                        return found.mtm.getTarget(index);
                    }
                    return node?._babylonTransformNode;
                },
                getPropertyName: [() => "influence"],
            },
            type: "number[]",
            get: (node) => {
                const found = _findNodeMorphTargets(node);
                if (!found) {
                    return [];
                }
                const weights = [];
                for (let i = 0; i < found.mtm.numTargets; i++) {
                    weights.push(_roundFloat32Artifact(found.mtm.getTarget(i).influence));
                }
                return weights;
            },
            getTarget: (node) => node?._babylonTransformNode,
            getPropertyName: [() => "influence"],
        },
        // readonly!
        matrix: {
            type: "Matrix",
            get: (node) => Matrix.Compose(node._babylonTransformNode?.scaling, node._babylonTransformNode?.rotationQuaternion, node._babylonTransformNode?.position),
            getTarget: (node) => node._babylonTransformNode,
            isReadOnly: true,
        },
        globalMatrix: {
            type: "Matrix",
            get: (node) => {
                const matrix = Matrix.Identity();
                // RHS/LHS support
                let rootNode = node.parent;
                while (rootNode && rootNode.parent) {
                    rootNode = rootNode.parent;
                }
                const forceUpdate = node._babylonTransformNode?.position._isDirty || node._babylonTransformNode?.rotationQuaternion?._isDirty || node._babylonTransformNode?.scaling._isDirty;
                if (rootNode) {
                    // take the parent root node's world matrix, invert it, and multiply it with the current node's world matrix
                    // This will provide the global matrix, ignoring the RHS->LHS conversion
                    const rootMatrix = rootNode._babylonTransformNode?.computeWorldMatrix(true).invert();
                    if (rootMatrix) {
                        node._babylonTransformNode?.computeWorldMatrix(forceUpdate)?.multiplyToRef(rootMatrix, matrix);
                    }
                }
                else if (node._babylonTransformNode) {
                    matrix.copyFrom(node._babylonTransformNode.computeWorldMatrix(forceUpdate));
                }
                return matrix;
            },
            getTarget: (node) => node._babylonTransformNode,
            isReadOnly: true,
        },
        camera: {
            type: "string",
            // Per KHR_interactivity Object Model: read-only ref pointing to the
            // attached camera, encoded as a JSON Pointer string. Empty string
            // when no camera is attached (the spec's null-ref convention).
            get: (node) => (node.camera !== undefined ? `/cameras/${node.camera}` : ""),
            getTarget: (node) => node,
            isReadOnly: true,
        },
        mesh: {
            type: "string",
            get: (node) => (node.mesh !== undefined ? `/meshes/${node.mesh}` : ""),
            getTarget: (node) => node,
            isReadOnly: true,
        },
        skin: {
            type: "string",
            get: (node) => (node.skin !== undefined ? `/skins/${node.skin}` : ""),
            getTarget: (node) => node,
            isReadOnly: true,
        },
        parent: {
            type: "string",
            get: (node) => (node.parent && node.parent.index !== undefined ? `/nodes/${node.parent.index}` : ""),
            getTarget: (node) => node,
            isReadOnly: true,
        },
        children: {
            length: _CreateLengthAccessor((children) => children?.length ?? 0, (children) => children ?? []),
            __array__: {
                __target__: true,
                type: "string",
                // The wrapping converter passes the indexed child value (an
                // INode index); convert it to a JSON Pointer ref string.
                get: (childIndex) => (typeof childIndex === "number" ? `/nodes/${childIndex}` : ""),
                getTarget: () => ({ __nodeIndex: true }),
                isReadOnly: true,
            },
        },
        extensions: {
            EXT_lights_ies: {
                multiplier: {
                    type: "number",
                    get: (node) => {
                        return node._babylonTransformNode?.getChildren((child) => child instanceof SpotLight, true)[0]?.intensity;
                    },
                    getTarget: (node) => node._babylonTransformNode?.getChildren((child) => child instanceof SpotLight, true)[0],
                    set: (value, node) => {
                        if (node._babylonTransformNode) {
                            const light = node._babylonTransformNode.getChildren((child) => child instanceof SpotLight, true)[0];
                            if (light) {
                                light.intensity = value;
                            }
                        }
                    },
                },
                color: {
                    type: "Color3",
                    get: (node) => {
                        return node._babylonTransformNode?.getChildren((child) => child instanceof SpotLight, true)[0]?.diffuse;
                    },
                    getTarget: (node) => node._babylonTransformNode?.getChildren((child) => child instanceof SpotLight, true)[0],
                    set: (value, node) => {
                        if (node._babylonTransformNode) {
                            const light = node._babylonTransformNode.getChildren((child) => child instanceof SpotLight, true)[0];
                            if (light) {
                                light.diffuse = value;
                            }
                        }
                    },
                },
            },
            KHR_node_visibility: {
                visible: {
                    type: "boolean",
                    get: (node) => {
                        return node._primitiveBabylonMeshes ? node._primitiveBabylonMeshes[0].isVisible : false;
                    },
                    getTarget: () => undefined, // TODO: what should this return?
                    set: (value, node) => {
                        if (node._primitiveBabylonMeshes) {
                            node._primitiveBabylonMeshes.forEach((mesh) => (mesh.isVisible = value));
                        }
                    },
                },
            },
        },
    },
};
const animationsTree = {
    length: _CreateLengthAccessor((animations) => animations.length, (animations) => animations.map((animation) => animation._babylonAnimationGroup)),
    __array__: {
        // Indexed access to the animation, surfaced as a JSON Pointer ref string so blocks like
        // ``animation/start`` can consume it directly. Uses the animation's own ``index`` property
        // (populated by the loader's ArrayItem.Assign step) so the ref is resolved without needing
        // a separate index payload from the path converter.
        __target__: true,
        type: "string",
        get: (animation) => (animation && typeof animation.index === "number" ? `/animations/${animation.index}` : ""),
        getTarget: (animation) => animation._babylonAnimationGroup,
        isReadOnly: true,
    },
};
const meshesTree = {
    length: _CreateLengthAccessor((meshes) => meshes.length, (meshes) => meshes.map((mesh) => mesh.primitives[0]._instanceData?.babylonSourceMesh)),
    __array__: {
        __target__: true,
        primitives: {
            length: _CreateLengthAccessor((primitives) => primitives?.length ?? 0, (primitives) => primitives ?? []),
            __array__: {
                __target__: true,
                material: {
                    type: "string",
                    // Read-only ref to the assigned material, JSON Pointer encoded.
                    get: (primitive) => (primitive.material !== undefined ? `/materials/${primitive.material}` : ""),
                    getTarget: (primitive) => primitive,
                    isReadOnly: true,
                },
            },
        },
        weights: {
            length: _CreateLengthAccessor((weights) => weights?.length ?? 0, (weights) => weights ?? []),
            __array__: {
                __target__: true,
                type: "number",
                get: (weightValue) => weightValue,
                getTarget: () => ({ __weightValue: true }),
                isReadOnly: true,
            },
        },
    },
};
const camerasTree = {
    length: _CreateLengthAccessor((cameras) => cameras.length, (cameras) => cameras.map((camera) => camera._babylonCamera)),
    __array__: {
        __target__: true,
        orthographic: {
            xmag: {
                componentsCount: 2,
                type: "Vector2",
                get: (camera) => new Vector2(camera._babylonCamera?.orthoLeft ?? 0, camera._babylonCamera?.orthoRight ?? 0),
                set: (value, camera) => {
                    if (camera._babylonCamera) {
                        camera._babylonCamera.orthoLeft = value.x;
                        camera._babylonCamera.orthoRight = value.y;
                    }
                },
                getTarget: (camera) => camera,
                getPropertyName: [() => "orthoLeft", () => "orthoRight"],
            },
            ymag: {
                componentsCount: 2,
                type: "Vector2",
                get: (camera) => new Vector2(camera._babylonCamera?.orthoBottom ?? 0, camera._babylonCamera?.orthoTop ?? 0),
                set: (value, camera) => {
                    if (camera._babylonCamera) {
                        camera._babylonCamera.orthoBottom = value.x;
                        camera._babylonCamera.orthoTop = value.y;
                    }
                },
                getTarget: (camera) => camera,
                getPropertyName: [() => "orthoBottom", () => "orthoTop"],
            },
            zfar: {
                type: "number",
                get: (camera) => camera._babylonCamera?.maxZ,
                set: (value, camera) => {
                    if (camera._babylonCamera) {
                        camera._babylonCamera.maxZ = value;
                    }
                },
                getTarget: (camera) => camera,
                getPropertyName: [() => "maxZ"],
            },
            znear: {
                type: "number",
                get: (camera) => camera._babylonCamera?.minZ,
                set: (value, camera) => {
                    if (camera._babylonCamera) {
                        camera._babylonCamera.minZ = value;
                    }
                },
                getTarget: (camera) => camera,
                getPropertyName: [() => "minZ"],
            },
        },
        perspective: {
            aspectRatio: {
                type: "number",
                get: (camera) => camera._babylonCamera?.getEngine().getAspectRatio(camera._babylonCamera),
                getTarget: (camera) => camera,
                getPropertyName: [() => "aspectRatio"],
                isReadOnly: true, // might not be the case for glTF?
            },
            yfov: {
                type: "number",
                get: (camera) => camera._babylonCamera?.fov,
                set: (value, camera) => {
                    if (camera._babylonCamera) {
                        camera._babylonCamera.fov = value;
                    }
                },
                getTarget: (camera) => camera,
                getPropertyName: [() => "fov"],
            },
            zfar: {
                type: "number",
                get: (camera) => camera._babylonCamera?.maxZ,
                set: (value, camera) => {
                    if (camera._babylonCamera) {
                        camera._babylonCamera.maxZ = value;
                    }
                },
                getTarget: (camera) => camera,
                getPropertyName: [() => "maxZ"],
            },
            znear: {
                type: "number",
                get: (camera) => camera._babylonCamera?.minZ,
                set: (value, camera) => {
                    if (camera._babylonCamera) {
                        camera._babylonCamera.minZ = value;
                    }
                },
                getTarget: (camera) => camera,
                getPropertyName: [() => "minZ"],
            },
        },
    },
};
const materialsTree = {
    length: _CreateLengthAccessor((materials) => materials.length, (materials) => materials.map((material) => material._data?.[Constants.MATERIAL_TriangleFillMode]?.babylonMaterial)),
    __array__: {
        __target__: true,
        doubleSided: {
            type: "boolean",
            get: (material, index, payload) => !GetMaterial(material, index, payload)?.backFaceCulling,
            set: (value, material, index, payload) => {
                const mat = GetMaterial(material, index, payload);
                if (mat) {
                    mat.backFaceCulling = !value;
                }
            },
            getTarget: (material, index, payload) => GetMaterial(material, index, payload),
            getPropertyName: [() => "backFaceCulling"],
        },
        alphaCutoff: {
            type: "number",
            get: (material, index, payload) => GetMaterial(material, index, payload)?.alphaCutOff,
            set: (value, material, index, payload) => {
                const mat = GetMaterial(material, index, payload);
                if (mat) {
                    mat.alphaCutOff = value;
                }
            },
            getTarget: (material, index, payload) => GetMaterial(material, index, payload),
            getPropertyName: [() => "alphaCutOff"],
        },
        emissiveFactor: {
            type: "Color3",
            get: (material, index, payload) => GetMaterial(material, index, payload).emissiveColor,
            set: (value, material, index, payload) => GetMaterial(material, index, payload).emissiveColor.copyFrom(value),
            getTarget: (material, index, payload) => GetMaterial(material, index, payload),
            getPropertyName: [() => "emissiveColor"],
        },
        emissiveTexture: {
            extensions: {
                KHR_texture_transform: GenerateTextureMap("emissiveTexture"),
            },
        },
        normalTexture: {
            scale: {
                type: "number",
                get: (material, index, payload) => GetTexture(material, payload, "bumpTexture")?.level,
                set: (value, material, index, payload) => {
                    const texture = GetTexture(material, payload, "bumpTexture");
                    if (texture) {
                        texture.level = value;
                    }
                },
                getTarget: (material, index, payload) => GetMaterial(material, index, payload),
                getPropertyName: [() => "level"],
            },
            extensions: {
                KHR_texture_transform: GenerateTextureMap("bumpTexture"),
            },
        },
        occlusionTexture: {
            strength: {
                type: "number",
                get: (material, index, payload) => GetMaterial(material, index, payload).ambientTextureStrength,
                set: (value, material, index, payload) => {
                    const mat = GetMaterial(material, index, payload);
                    if (mat) {
                        mat.ambientTextureStrength = value;
                    }
                },
                getTarget: (material, index, payload) => GetMaterial(material, index, payload),
                getPropertyName: [() => "ambientTextureStrength"],
            },
            extensions: {
                KHR_texture_transform: GenerateTextureMap("ambientTexture"),
            },
        },
        pbrMetallicRoughness: {
            baseColorFactor: {
                type: "Color4",
                get: (material, index, payload) => {
                    const mat = GetMaterial(material, index, payload);
                    return Color4.FromColor3(mat.albedoColor, mat.alpha);
                },
                set: (value, material, index, payload) => {
                    const mat = GetMaterial(material, index, payload);
                    mat.albedoColor.set(value.r, value.g, value.b);
                    mat.alpha = value.a;
                },
                getTarget: (material, index, payload) => GetMaterial(material, index, payload),
                // This is correct on the animation level, but incorrect as a single property of a type Color4
                getPropertyName: [() => "albedoColor", () => "alpha"],
            },
            baseColorTexture: {
                extensions: {
                    KHR_texture_transform: GenerateTextureMap("albedoTexture"),
                },
            },
            metallicFactor: {
                type: "number",
                get: (material, index, payload) => GetMaterial(material, index, payload).metallic,
                set: (value, material, index, payload) => {
                    const mat = GetMaterial(material, index, payload);
                    if (mat) {
                        mat.metallic = value;
                    }
                },
                getTarget: (material, index, payload) => GetMaterial(material, index, payload),
                getPropertyName: [() => "metallic"],
            },
            roughnessFactor: {
                type: "number",
                get: (material, index, payload) => GetMaterial(material, index, payload).roughness,
                set: (value, material, index, payload) => {
                    const mat = GetMaterial(material, index, payload);
                    if (mat) {
                        mat.roughness = value;
                    }
                },
                getTarget: (material, index, payload) => GetMaterial(material, index, payload),
                getPropertyName: [() => "roughness"],
            },
            metallicRoughnessTexture: {
                extensions: {
                    KHR_texture_transform: GenerateTextureMap("metallicTexture"),
                },
            },
        },
        extensions: {
            KHR_materials_anisotropy: {
                anisotropyStrength: {
                    type: "number",
                    get: (material, index, payload) => GetMaterial(material, index, payload)?.anisotropy?.intensity,
                    set: (value, material, index, payload) => {
                        const mat = GetMaterial(material, index, payload);
                        if (mat) {
                            mat.anisotropy.intensity = value;
                        }
                    },
                    getTarget: (material, index, payload) => GetMaterial(material, index, payload),
                    getPropertyName: [() => "anisotropy.intensity"],
                },
                anisotropyRotation: {
                    type: "number",
                    get: (material, index, payload) => GetMaterial(material, index, payload)?.anisotropy?.angle,
                    set: (value, material, index, payload) => {
                        const mat = GetMaterial(material, index, payload);
                        if (mat) {
                            mat.anisotropy.angle = value;
                        }
                    },
                    getTarget: (material, index, payload) => GetMaterial(material, index, payload),
                    getPropertyName: [() => "anisotropy.angle"],
                },
                anisotropyTexture: {
                    extensions: {
                        KHR_texture_transform: GenerateTextureMap("anisotropy", "texture"),
                    },
                },
            },
            KHR_materials_clearcoat: {
                clearcoatFactor: {
                    type: "number",
                    get: (material, index, payload) => GetMaterial(material, index, payload).clearCoat.intensity,
                    set: (value, material, index, payload) => {
                        GetMaterial(material, index, payload).clearCoat.intensity = value;
                    },
                    getTarget: (material, index, payload) => GetMaterial(material, index, payload),
                    getPropertyName: [() => "clearCoat.intensity"],
                },
                clearcoatRoughnessFactor: {
                    type: "number",
                    get: (material, index, payload) => GetMaterial(material, index, payload).clearCoat.roughness,
                    set: (value, material, index, payload) => {
                        GetMaterial(material, index, payload).clearCoat.roughness = value;
                    },
                    getTarget: (material, index, payload) => GetMaterial(material, index, payload),
                    getPropertyName: [() => "clearCoat.roughness"],
                },
                clearcoatTexture: {
                    extensions: {
                        KHR_texture_transform: GenerateTextureMap("clearCoat", "texture"),
                    },
                },
                clearcoatNormalTexture: {
                    scale: {
                        type: "number",
                        get: (material, index, payload) => GetMaterial(material, index, payload).clearCoat.bumpTexture?.level,
                        getTarget: GetMaterial,
                        set: (value, material, index, payload) => (GetMaterial(material, index, payload).clearCoat.bumpTexture.level = value),
                    },
                    extensions: {
                        KHR_texture_transform: GenerateTextureMap("clearCoat", "bumpTexture"),
                    },
                },
                clearcoatRoughnessTexture: {
                    extensions: {
                        KHR_texture_transform: GenerateTextureMap("clearCoat", "textureRoughness"),
                    },
                },
            },
            KHR_materials_dispersion: {
                dispersion: {
                    type: "number",
                    get: (material, index, payload) => GetMaterial(material, index, payload).subSurface.dispersion,
                    getTarget: GetMaterial,
                    set: (value, material, index, payload) => (GetMaterial(material, index, payload).subSurface.dispersion = value),
                },
            },
            KHR_materials_emissive_strength: {
                emissiveStrength: {
                    type: "number",
                    get: (material, index, payload) => GetMaterial(material, index, payload).emissiveIntensity,
                    getTarget: GetMaterial,
                    set: (value, material, index, payload) => (GetMaterial(material, index, payload).emissiveIntensity = value),
                },
            },
            KHR_materials_ior: {
                ior: {
                    type: "number",
                    get: (material, index, payload) => GetMaterial(material, index, payload).indexOfRefraction,
                    getTarget: GetMaterial,
                    set: (value, material, index, payload) => (GetMaterial(material, index, payload).indexOfRefraction = value),
                },
            },
            KHR_materials_iridescence: {
                iridescenceFactor: {
                    type: "number",
                    get: (material, index, payload) => GetMaterial(material, index, payload).iridescence.intensity,
                    getTarget: GetMaterial,
                    set: (value, material, index, payload) => (GetMaterial(material, index, payload).iridescence.intensity = value),
                },
                iridescenceIor: {
                    type: "number",
                    get: (material, index, payload) => GetMaterial(material, index, payload).iridescence.indexOfRefraction,
                    getTarget: GetMaterial,
                    set: (value, material, index, payload) => (GetMaterial(material, index, payload).iridescence.indexOfRefraction = value),
                },
                iridescenceTexture: {
                    extensions: {
                        KHR_texture_transform: GenerateTextureMap("iridescence", "texture"),
                    },
                },
                iridescenceThicknessMaximum: {
                    type: "number",
                    get: (material, index, payload) => GetMaterial(material, index, payload).iridescence.maximumThickness,
                    getTarget: GetMaterial,
                    set: (value, material, index, payload) => (GetMaterial(material, index, payload).iridescence.maximumThickness = value),
                },
                iridescenceThicknessMinimum: {
                    type: "number",
                    get: (material, index, payload) => GetMaterial(material, index, payload).iridescence.minimumThickness,
                    getTarget: GetMaterial,
                    set: (value, material, index, payload) => (GetMaterial(material, index, payload).iridescence.minimumThickness = value),
                },
                iridescenceThicknessTexture: {
                    extensions: {
                        KHR_texture_transform: GenerateTextureMap("iridescence", "thicknessTexture"),
                    },
                },
            },
            KHR_materials_sheen: {
                sheenColorFactor: {
                    type: "Color3",
                    get: (material, index, payload) => GetMaterial(material, index, payload).sheen.color,
                    getTarget: GetMaterial,
                    set: (value, material, index, payload) => GetMaterial(material, index, payload).sheen.color.copyFrom(value),
                },
                sheenColorTexture: {
                    extensions: {
                        KHR_texture_transform: GenerateTextureMap("sheen", "texture"),
                    },
                },
                sheenRoughnessFactor: {
                    type: "number",
                    get: (material, index, payload) => GetMaterial(material, index, payload).sheen.intensity,
                    getTarget: GetMaterial,
                    set: (value, material, index, payload) => (GetMaterial(material, index, payload).sheen.intensity = value),
                },
                sheenRoughnessTexture: {
                    extensions: {
                        KHR_texture_transform: GenerateTextureMap("sheen", "textureRoughness"),
                    },
                },
            },
            KHR_materials_specular: {
                specularFactor: {
                    type: "number",
                    get: (material, index, payload) => GetMaterial(material, index, payload).metallicF0Factor,
                    getTarget: GetMaterial,
                    set: (value, material, index, payload) => (GetMaterial(material, index, payload).metallicF0Factor = value),
                    getPropertyName: [() => "metallicF0Factor"],
                },
                specularColorFactor: {
                    type: "Color3",
                    get: (material, index, payload) => GetMaterial(material, index, payload).metallicReflectanceColor,
                    getTarget: GetMaterial,
                    set: (value, material, index, payload) => GetMaterial(material, index, payload).metallicReflectanceColor.copyFrom(value),
                    getPropertyName: [() => "metallicReflectanceColor"],
                },
                specularTexture: {
                    extensions: {
                        KHR_texture_transform: GenerateTextureMap("metallicReflectanceTexture"),
                    },
                },
                specularColorTexture: {
                    extensions: {
                        KHR_texture_transform: GenerateTextureMap("reflectanceTexture"),
                    },
                },
            },
            KHR_materials_transmission: {
                transmissionFactor: {
                    type: "number",
                    get: (material, index, payload) => GetMaterial(material, index, payload).subSurface.refractionIntensity,
                    getTarget: GetMaterial,
                    set: (value, material, index, payload) => (GetMaterial(material, index, payload).subSurface.refractionIntensity = value),
                    getPropertyName: [() => "subSurface.refractionIntensity"],
                },
                transmissionTexture: {
                    extensions: {
                        KHR_texture_transform: GenerateTextureMap("subSurface", "refractionIntensityTexture", {
                            extensionKey: "KHR_materials_transmission",
                            texturePath: ["transmissionTexture"],
                        }),
                    },
                },
            },
            KHR_materials_diffuse_transmission: {
                diffuseTransmissionFactor: {
                    type: "number",
                    get: (material, index, payload) => GetMaterial(material, index, payload).subSurface.translucencyIntensity,
                    getTarget: GetMaterial,
                    set: (value, material, index, payload) => (GetMaterial(material, index, payload).subSurface.translucencyIntensity = value),
                },
                diffuseTransmissionTexture: {
                    extensions: {
                        KHR_texture_transform: GenerateTextureMap("subSurface", "translucencyIntensityTexture", {
                            extensionKey: "KHR_materials_diffuse_transmission",
                            texturePath: ["diffuseTransmissionTexture"],
                        }),
                    },
                },
                diffuseTransmissionColorFactor: {
                    type: "Color3",
                    get: (material, index, payload) => GetMaterial(material, index, payload).subSurface.translucencyColor,
                    getTarget: GetMaterial,
                    set: (value, material, index, payload) => value && GetMaterial(material, index, payload).subSurface.translucencyColor?.copyFrom(value),
                },
                diffuseTransmissionColorTexture: {
                    extensions: {
                        KHR_texture_transform: GenerateTextureMap("subSurface", "translucencyColorTexture", {
                            extensionKey: "KHR_materials_diffuse_transmission",
                            texturePath: ["diffuseTransmissionColorTexture"],
                        }),
                    },
                },
            },
            KHR_materials_volume: {
                attenuationColor: {
                    type: "Color3",
                    get: (material, index, payload) => GetMaterial(material, index, payload).subSurface.tintColor,
                    getTarget: GetMaterial,
                    set: (value, material, index, payload) => GetMaterial(material, index, payload).subSurface.tintColor.copyFrom(value),
                },
                attenuationDistance: {
                    type: "number",
                    get: (material, index, payload) => GetMaterial(material, index, payload).subSurface.tintColorAtDistance,
                    getTarget: GetMaterial,
                    set: (value, material, index, payload) => (GetMaterial(material, index, payload).subSurface.tintColorAtDistance = value),
                },
                thicknessFactor: {
                    type: "number",
                    get: (material, index, payload) => GetMaterial(material, index, payload).subSurface.maximumThickness,
                    getTarget: GetMaterial,
                    set: (value, material, index, payload) => (GetMaterial(material, index, payload).subSurface.maximumThickness = value),
                },
                thicknessTexture: {
                    extensions: {
                        KHR_texture_transform: GenerateTextureMap("subSurface", "thicknessTexture", { extensionKey: "KHR_materials_volume", texturePath: ["thicknessTexture"] }),
                    },
                },
            },
        },
    },
};
const extensionsTree = {
    KHR_lights_punctual: {
        lights: {
            length: _CreateLengthAccessor((lights) => lights.length, (lights) => lights.map((light) => light._babylonLight)),
            __array__: {
                __target__: true,
                color: {
                    type: "Color3",
                    get: (light) => light._babylonLight?.diffuse,
                    set: (value, light) => light._babylonLight?.diffuse.copyFrom(value),
                    getTarget: (light) => light._babylonLight,
                    getPropertyName: [(_light) => "diffuse"],
                },
                intensity: {
                    type: "number",
                    get: (light) => light._babylonLight?.intensity,
                    set: (value, light) => (light._babylonLight ? (light._babylonLight.intensity = value) : undefined),
                    getTarget: (light) => light._babylonLight,
                    getPropertyName: [(_light) => "intensity"],
                },
                range: {
                    type: "number",
                    get: (light) => light._babylonLight?.range,
                    set: (value, light) => (light._babylonLight ? (light._babylonLight.range = value) : undefined),
                    getTarget: (light) => light._babylonLight,
                    getPropertyName: [(_light) => "range"],
                },
                spot: {
                    innerConeAngle: {
                        type: "number",
                        get: (light) => light._babylonLight?.innerAngle,
                        set: (value, light) => (light._babylonLight ? (light._babylonLight.innerAngle = value) : undefined),
                        getTarget: (light) => light._babylonLight,
                        getPropertyName: [(_light) => "innerConeAngle"],
                    },
                    outerConeAngle: {
                        type: "number",
                        get: (light) => light._babylonLight?.angle,
                        set: (value, light) => (light._babylonLight ? (light._babylonLight.angle = value) : undefined),
                        getTarget: (light) => light._babylonLight,
                        getPropertyName: [(_light) => "outerConeAngle"],
                    },
                },
            },
        },
    },
    EXT_lights_area: {
        lights: {
            length: _CreateLengthAccessor((lights) => lights.length, (lights) => lights.map((light) => light._babylonLight)),
            __array__: {
                __target__: true,
                color: {
                    type: "Color3",
                    get: (light) => light._babylonLight?.diffuse,
                    set: (value, light) => light._babylonLight?.diffuse.copyFrom(value),
                    getTarget: (light) => light._babylonLight,
                    getPropertyName: [(_light) => "diffuse"],
                },
                intensity: {
                    type: "number",
                    get: (light) => light._babylonLight?.intensity,
                    set: (value, light) => (light._babylonLight ? (light._babylonLight.intensity = value) : undefined),
                    getTarget: (light) => light._babylonLight,
                    getPropertyName: [(_light) => "intensity"],
                },
                size: {
                    type: "number",
                    get: (light) => light._babylonLight?.height,
                    set: (value, light) => (light._babylonLight ? (light._babylonLight.height = value) : undefined),
                    getTarget: (light) => light._babylonLight,
                    getPropertyName: [(_light) => "size"],
                },
                rect: {
                    aspect: {
                        type: "number",
                        get: (light) => light._babylonLight?.width / light._babylonLight?.height,
                        set: (value, light) => light._babylonLight ? (light._babylonLight.width = value * light._babylonLight.height) : undefined,
                        getTarget: (light) => light._babylonLight,
                        getPropertyName: [(_light) => "aspect"],
                    },
                },
            },
        },
    },
    EXT_lights_ies: {
        lights: {
            length: _CreateLengthAccessor((lights) => lights.length, (lights) => lights.map((light) => light._babylonLight)),
        },
    },
    EXT_lights_image_based: {
        lights: {
            length: _CreateLengthAccessor((lights) => lights.length, (lights) => lights.map((light) => light._babylonTexture)),
            __array__: {
                __target__: true,
                intensity: {
                    type: "number",
                    get: (light) => light._babylonTexture?.level,
                    set: (value, light) => {
                        if (light._babylonTexture) {
                            light._babylonTexture.level = value;
                        }
                    },
                    getTarget: (light) => light._babylonTexture,
                },
                rotation: {
                    type: "Quaternion",
                    get: (light) => light._babylonTexture && Quaternion.FromRotationMatrix(light._babylonTexture?.getReflectionTextureMatrix()),
                    set: (value, light) => {
                        if (!light._babylonTexture) {
                            return;
                        }
                        // Invert the rotation so that positive rotation is counter-clockwise.
                        if (!light._babylonTexture.getScene()?.useRightHandedSystem) {
                            value = Quaternion.Inverse(value);
                        }
                        Matrix.FromQuaternionToRef(value, light._babylonTexture.getReflectionTextureMatrix());
                    },
                    getTarget: (light) => light._babylonTexture,
                },
            },
        },
    },
};
function GetTexture(material, payload, textureType, textureInObject) {
    const babylonMaterial = GetMaterial(material, payload);
    return textureInObject ? babylonMaterial[textureType][textureInObject] : babylonMaterial[textureType];
}
function GetMaterial(material, _index, payload) {
    return material._data?.[payload?.fillMode ?? Constants.MATERIAL_TriangleFillMode]?.babylonMaterial;
}
function _getNodeMorphTargetManager(node) {
    const tn = node?._babylonTransformNode;
    if (!tn) {
        return undefined;
    }
    // Single primitive: transform node IS the mesh with morphTargetManager
    if (tn.morphTargetManager) {
        return tn.morphTargetManager;
    }
    // Multiple primitives: check each primitive mesh and its source
    const primMeshes = node._primitiveBabylonMeshes;
    if (primMeshes) {
        for (const mesh of primMeshes) {
            if (mesh?.morphTargetManager) {
                return mesh.morphTargetManager;
            }
            // Check source mesh for instanced meshes
            if (mesh?.sourceMesh?.morphTargetManager) {
                return mesh.sourceMesh.morphTargetManager;
            }
        }
    }
    return undefined;
}
/**
 * KHR_interactivity test assets routinely use a glTF hierarchy where the
 * **parent** node has no `mesh` but a descendant does. The Khronos morph-weight
 * tests query `/nodes/<parent>/weights/*` and expect the result to come from
 * the morph targets of the first descendant mesh. To support this we walk the
 * Babylon-side scene graph below the queried INode looking for a Mesh that has
 * a morphTargetManager.
 *
 * For multi-primitive meshes (one INode → several Babylon meshes parented to a
 * wrapper TransformNode) we also collect the sibling primitives so a `set`
 * touches every mesh that shares the manager.
 * @param node the glTF node to start the lookup from
 * @returns the active morph target manager and every Babylon mesh that shares
 * it, or `undefined` when no morph target manager is reachable from the node.
 */
function _findNodeMorphTargets(node) {
    const tn = node?._babylonTransformNode;
    if (!tn) {
        return undefined;
    }
    // Direct: this node's own mesh has a morph target manager.
    const directMtm = _getNodeMorphTargetManager(node);
    if (directMtm && node._primitiveBabylonMeshes && node._primitiveBabylonMeshes.length > 0) {
        return { mtm: directMtm, meshes: node._primitiveBabylonMeshes };
    }
    // Fallback: search descendants in the Babylon scene graph for the first
    // mesh that has a morph target manager, then collect every sibling mesh
    // that shares it (covers the multi-primitive case).
    const descendants = tn.getDescendants(false);
    for (const desc of descendants) {
        const candidate = desc;
        const mtm = candidate.morphTargetManager ?? candidate.sourceMesh?.morphTargetManager;
        if (!mtm) {
            continue;
        }
        const meshes = [];
        const parent = candidate.parent;
        if (parent) {
            for (const sib of parent.getChildMeshes(true)) {
                const sibMtm = sib.morphTargetManager ?? sib.sourceMesh?.morphTargetManager;
                if (sibMtm === mtm) {
                    meshes.push(sib);
                }
            }
        }
        if (meshes.length === 0) {
            meshes.push(candidate);
        }
        return { mtm, meshes };
    }
    return undefined;
}
/**
 * Collapse float32-precision artifacts back to the closest "clean" double.
 *
 * glTF stores numbers as JSON, but tools usually serialize float32 morph weights
 * with their full double-precision text — `0.1` becomes `0.10000000149011612`.
 * KHR_interactivity tests then compare the read-back weight via strict `math/eq`
 * against literals like `0.1`, which fails because the two doubles aren't bitwise
 * equal. Rounding the value to 7 significant figures (the precision of a float32)
 * recovers the original "clean" double for any value that survived a float32
 * round-trip while leaving genuinely high-precision doubles essentially intact.
 * @param v the value to round
 * @returns the rounded value, or the input unchanged if it is not finite
 */
function _roundFloat32Artifact(v) {
    if (!Number.isFinite(v)) {
        return v;
    }
    return parseFloat(v.toPrecision(7));
}
/**
 * Read the KHR_texture_transform object stored in the source glTF JSON for a
 * texture-info that lives under one of the material's extensions, creating
 * empty parent objects on demand so callers can write through it. Returns
 * `undefined` when the input shape is incompatible.
 * @param material the source IMaterial owning the extension
 * @param gltfPath the path describing where the texture-info lives
 * @param createMissing when true, create missing parent objects so writes succeed
 * @returns the glTF-side KHR_texture_transform object, or undefined
 */
function _gltfTextureTransform(material, gltfPath, createMissing) {
    if (!material) {
        return undefined;
    }
    let extensions = material.extensions;
    if (!extensions) {
        if (!createMissing) {
            return undefined;
        }
        extensions = {};
        material.extensions = extensions;
    }
    let cursor = extensions[gltfPath.extensionKey];
    if (!cursor) {
        if (!createMissing) {
            return undefined;
        }
        cursor = {};
        extensions[gltfPath.extensionKey] = cursor;
    }
    for (const key of gltfPath.texturePath) {
        let next = cursor[key];
        if (!next) {
            if (!createMissing) {
                return undefined;
            }
            next = {};
            cursor[key] = next;
        }
        cursor = next;
    }
    if (!cursor.extensions) {
        if (!createMissing) {
            return undefined;
        }
        cursor.extensions = {};
    }
    let xform = cursor.extensions.KHR_texture_transform;
    if (!xform) {
        if (!createMissing) {
            return undefined;
        }
        xform = {};
        cursor.extensions.KHR_texture_transform = xform;
    }
    return xform;
}
function GenerateTextureMap(textureType, textureInObject, gltfPath) {
    return {
        offset: {
            componentsCount: 2,
            // assuming two independent values for u and v, and NOT a Vector2
            type: "Vector2",
            get: (material, _index, payload) => {
                const texture = GetTexture(material, payload, textureType, textureInObject);
                if (texture) {
                    return new Vector2(texture.uOffset, texture.vOffset);
                }
                if (gltfPath) {
                    const xform = _gltfTextureTransform(material, gltfPath, false);
                    const o = xform?.offset;
                    return new Vector2(o?.[0] ?? 0, o?.[1] ?? 0);
                }
                return new Vector2(0, 0);
            },
            getTarget: GetMaterial,
            set: (value, material, _index, payload) => {
                const texture = GetTexture(material, payload, textureType, textureInObject);
                if (texture) {
                    texture.uOffset = value.x;
                    texture.vOffset = value.y;
                }
                if (gltfPath) {
                    const xform = _gltfTextureTransform(material, gltfPath, true);
                    if (xform) {
                        xform.offset = [value.x, value.y];
                    }
                }
            },
            getPropertyName: [
                () => `${textureType}${textureInObject ? "." + textureInObject : ""}.uOffset`,
                () => `${textureType}${textureInObject ? "." + textureInObject : ""}.vOffset`,
            ],
        },
        rotation: {
            type: "number",
            get: (material, _index, payload) => {
                const texture = GetTexture(material, payload, textureType, textureInObject);
                if (texture) {
                    return texture.wAng;
                }
                if (gltfPath) {
                    const xform = _gltfTextureTransform(material, gltfPath, false);
                    return xform?.rotation ?? 0;
                }
                return 0;
            },
            getTarget: GetMaterial,
            set: (value, material, _index, payload) => {
                const texture = GetTexture(material, payload, textureType, textureInObject);
                if (texture) {
                    texture.wAng = value;
                }
                if (gltfPath) {
                    const xform = _gltfTextureTransform(material, gltfPath, true);
                    if (xform) {
                        xform.rotation = value;
                    }
                }
            },
            getPropertyName: [() => `${textureType}${textureInObject ? "." + textureInObject : ""}.wAng`],
        },
        scale: {
            componentsCount: 2,
            type: "Vector2",
            get: (material, _index, payload) => {
                const texture = GetTexture(material, payload, textureType, textureInObject);
                if (texture) {
                    return new Vector2(texture.uScale, texture.vScale);
                }
                if (gltfPath) {
                    const xform = _gltfTextureTransform(material, gltfPath, false);
                    const s = xform?.scale;
                    return new Vector2(s?.[0] ?? 1, s?.[1] ?? 1);
                }
                return new Vector2(1, 1);
            },
            getTarget: GetMaterial,
            set: (value, material, index, payload) => {
                const texture = GetTexture(material, payload, textureType, textureInObject);
                if (texture) {
                    texture.uScale = value.x;
                    texture.vScale = value.y;
                }
                if (gltfPath) {
                    const xform = _gltfTextureTransform(material, gltfPath, true);
                    if (xform) {
                        xform.scale = [value.x, value.y];
                    }
                }
            },
            getPropertyName: [
                () => `${textureType}${textureInObject ? "." + textureInObject : ""}.uScale`,
                () => `${textureType}${textureInObject ? "." + textureInObject : ""}.vScale`,
            ],
        },
    };
}
const scenesTree = {
    length: _CreateLengthAccessor((scenes) => scenes.length, (scenes) => scenes),
    __array__: {
        __target__: true,
        nodes: {
            length: _CreateLengthAccessor((nodes) => nodes?.length ?? 0, (nodes) => nodes ?? []),
            __array__: {
                __target__: true,
                type: "string",
                // Indexed scene root: the underlying value is the INode index;
                // KHR_interactivity expects a ref-typed JSON Pointer string.
                get: (nodeIndex) => (typeof nodeIndex === "number" ? `/nodes/${nodeIndex}` : ""),
                getTarget: () => ({ __nodeIndex: true }),
                isReadOnly: true,
            },
        },
    },
};
const skinsTree = {
    length: _CreateLengthAccessor((skins) => skins.length, (skins) => skins.map((skin) => skin._data?.babylonSkeleton)),
    __array__: {
        __target__: true,
        joints: {
            length: _CreateLengthAccessor((joints) => joints?.length ?? 0, (joints) => joints ?? []),
            __array__: {
                __target__: true,
                type: "string",
                // Indexed skin joint: returns a ref to the joint node.
                get: (jointIndex) => (typeof jointIndex === "number" ? `/nodes/${jointIndex}` : ""),
                getTarget: () => ({ __nodeIndex: true }),
                isReadOnly: true,
            },
        },
        skeleton: {
            type: "string",
            // Skin's skeleton root: returns a ref to the root node, or empty
            // (null ref) when no skeleton root is declared.
            get: (skin) => {
                const skeleton = skin.skeleton;
                return typeof skeleton === "number" ? `/nodes/${skeleton}` : "";
            },
            getTarget: (skin) => skin,
            isReadOnly: true,
        },
    },
};
const objectModelMapping = {
    scene: {
        __target__: true,
        type: "number",
        get: (sceneIndex) => sceneIndex ?? 0,
        getTarget: () => ({ __gltfRoot: true }),
        isReadOnly: true,
        getPropertyName: [() => "scene"],
    },
    cameras: camerasTree,
    nodes: nodesTree,
    materials: materialsTree,
    extensions: extensionsTree,
    animations: animationsTree,
    meshes: meshesTree,
    scenes: scenesTree,
    skins: skinsTree,
};
/**
 * get a path-to-object converter for the given glTF tree
 * @param gltf the glTF tree to use
 * @returns a path-to-object converter for the given glTF tree
 */
export function GetPathToObjectConverter(gltf) {
    return new GLTFPathToObjectConverter(gltf, objectModelMapping);
}
/**
 * This function will return the object accessor for the given key in the object model
 * If the key is not found, it will return undefined
 * @param key the key to get the mapping for, for example /materials/\{\}/emissiveFactor
 * @returns an object accessor for the given key, or undefined if the key is not found
 */
export function GetMappingForKey(key) {
    // replace every `{}` in key with __array__ to match the object model
    const keyParts = key.split("/").map((part) => part.replace(/{}/g, "__array__"));
    let current = objectModelMapping;
    for (const part of keyParts) {
        // make sure part is not empty
        if (!part) {
            continue;
        }
        current = current[part];
    }
    // validate that current is an object accessor
    if (current && current.type && current.get) {
        return current;
    }
    return undefined;
}
/**
 * Set interpolation for a specific key in the object model
 * @param key the key to set, for example /materials/\{\}/emissiveFactor
 * @param interpolation the interpolation elements array
 */
export function SetInterpolationForKey(key, interpolation) {
    // replace every `{}` in key with __array__ to match the object model
    const keyParts = key.split("/").map((part) => part.replace(/{}/g, "__array__"));
    let current = objectModelMapping;
    for (const part of keyParts) {
        // make sure part is not empty
        if (!part) {
            continue;
        }
        current = current[part];
    }
    // validate that the current object is an object accessor
    if (current && current.type && current.get) {
        current.interpolation = interpolation;
    }
}
/**
 * This will ad a new object accessor in the object model at the given key.
 * Note that this will NOT change the typescript types. To do that you will need to change the interface itself (extending it in the module that uses it)
 * @param key the key to add the object accessor at. For example /cameras/\{\}/perspective/aspectRatio
 * @param accessor the object accessor to add
 */
export function AddObjectAccessorToKey(key, accessor) {
    // replace every `{}` in key with __array__ to match the object model
    const keyParts = key.split("/").map((part) => part.replace(/{}/g, "__array__"));
    let current = objectModelMapping;
    for (const part of keyParts) {
        // make sure part is not empty
        if (!part) {
            continue;
        }
        if (!current[part]) {
            if (part === "?") {
                current.__ignoreObjectTree__ = true;
                continue;
            }
            current[part] = {};
            // if the part is __array__ then add the __target__ property
            if (part === "__array__") {
                current[part].__target__ = true;
            }
        }
        current = current[part];
    }
    Object.assign(current, accessor);
}
//# sourceMappingURL=objectModelMapping.js.map