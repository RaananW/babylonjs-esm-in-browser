/* eslint-disable @typescript-eslint/naming-convention */
import { Quaternion } from "@babylonjs/core/Maths/math.vector.js";
/**
 * Root of the JSON-Pointer namespace under which Babylon-scene objects are
 * addressed by KHR_interactivity refs that did not originate from the source
 * glTF asset (e.g. refs emitted by engine-specific event blocks).
 *
 * Trailing `/` is intentional: it lets path-prefix dispatchers like
 * {@link CompositePathToObjectConverter} match cleanly.
 */
export const BABYLON_SCENE_OBJECT_MODEL_PREFIX = "/extensions/BABYLON_scene_objects/";
/**
 * Resolves JSON Pointer paths in the `/extensions/BABYLON_scene_objects/...`
 * namespace to Babylon scene objects.
 *
 * The path layout is `/{root}/{collection}/{uniqueId}/{property}` where
 * `{root}` is the literal `extensions/BABYLON_scene_objects` prefix and
 * `{uniqueId}` is the Babylon `uniqueId` (stable per session) of the target
 * instance. For example:
 *
 * - `/extensions/BABYLON_scene_objects/transformNodes/42/translation`
 * - `/extensions/BABYLON_scene_objects/meshes/17/visible`
 *
 * Composite path dispatchers (see {@link CompositePathToObjectConverter})
 * route paths starting with the prefix here; everything else continues to be
 * resolved by the standard glTF converter.
 */
export class BabylonScenePathToObjectConverter {
    constructor(_scene, _tree) {
        this._scene = _scene;
        this._tree = _tree;
    }
    /**
     * @param path the full JSON Pointer (must start with the Babylon prefix)
     * @returns an object-info container holding the resolved instance and accessor
     */
    convert(path) {
        if (!path.startsWith(BABYLON_SCENE_OBJECT_MODEL_PREFIX)) {
            throw new Error(`BabylonScenePathToObjectConverter: path "${path}" does not start with the expected prefix "${BABYLON_SCENE_OBJECT_MODEL_PREFIX}".`);
        }
        // Strip the namespace prefix and split. Ignore trailing empty segments
        // so refs of the form "/extensions/BABYLON_scene_objects/transformNodes/42/" parse cleanly.
        const tail = path.slice(BABYLON_SCENE_OBJECT_MODEL_PREFIX.length);
        const parts = tail.split("/").filter((p) => p.length > 0);
        if (parts.length === 0) {
            throw new Error(`BabylonScenePathToObjectConverter: path "${path}" is missing a collection name.`);
        }
        const collectionName = parts[0];
        const collection = this._tree[collectionName];
        if (!collection) {
            throw new Error(`BabylonScenePathToObjectConverter: unknown collection "${collectionName}" in path "${path}".`);
        }
        // Handle `<collection>.length` (no instance lookup).
        if (parts.length === 2 && parts[1] === "length") {
            const arr = this._getCollectionArray(collectionName);
            return { object: arr, info: collection.length };
        }
        if (parts.length < 2) {
            throw new Error(`BabylonScenePathToObjectConverter: path "${path}" is missing an instance id.`);
        }
        // parseInt would accept "12abc" as 12; require an all-digits id so a malformed path fails
        // loudly instead of binding to the wrong instance.
        if (!/^\d+$/.test(parts[1])) {
            throw new Error(`BabylonScenePathToObjectConverter: invalid uniqueId "${parts[1]}" in path "${path}".`);
        }
        const uniqueId = parseInt(parts[1], 10);
        if (!Number.isFinite(uniqueId) || uniqueId < 0) {
            throw new Error(`BabylonScenePathToObjectConverter: invalid uniqueId "${parts[1]}" in path "${path}".`);
        }
        const instance = this._lookupInstanceByUniqueId(collectionName, uniqueId);
        if (!instance) {
            throw new Error(`BabylonScenePathToObjectConverter: no ${collectionName} instance found with uniqueId ${uniqueId} (path "${path}").`);
        }
        // No property after the id → the ref itself is just a handle to the instance.
        // The accessor's `get` and `getTarget` both return the instance.
        if (parts.length === 2) {
            return {
                object: instance,
                info: this._buildIdentityAccessor(instance),
            };
        }
        // Walk the leaf descriptors for the requested property path. We keep this
        // very simple right now: only one segment after the id is supported, which
        // covers every property the initial leaves expose. Nested paths can be
        // added later by extending the walker.
        if (parts.length > 3) {
            throw new Error(`BabylonScenePathToObjectConverter: nested property paths are not yet supported (path "${path}").`);
        }
        const propertyName = parts[2];
        const leaf = collection.__array__[propertyName];
        if (!leaf || typeof leaf === "boolean") {
            throw new Error(`BabylonScenePathToObjectConverter: property "${propertyName}" is not registered on ${collectionName} (path "${path}").`);
        }
        return {
            object: instance,
            info: leaf,
        };
    }
    _getCollectionArray(collectionName) {
        switch (collectionName) {
            case "transformNodes":
                return this._scene.transformNodes;
            case "meshes":
                return this._scene.meshes;
            case "materials":
                return this._scene.materials;
            default:
                return [];
        }
    }
    _lookupInstanceByUniqueId(collectionName, uniqueId) {
        switch (collectionName) {
            case "transformNodes": {
                const direct = this._scene.transformNodes.find((n) => n.uniqueId === uniqueId);
                if (direct) {
                    return direct;
                }
                // Meshes are also transform nodes; allow the same path to resolve them.
                return this._scene.meshes.find((m) => m.uniqueId === uniqueId);
            }
            case "meshes":
                return this._scene.meshes.find((m) => m.uniqueId === uniqueId);
            case "materials":
                return this._scene.materials.find((m) => m.uniqueId === uniqueId);
            default:
                return undefined;
        }
    }
    _buildIdentityAccessor(instance) {
        return {
            type: "object",
            get: () => instance,
            getTarget: () => instance,
            isReadOnly: true,
        };
    }
}
/**
 * Builds the default Babylon-scene object-model tree.
 *
 * We deliberately start with a minimal set of properties: the goal of this
 * tree is to prove the seam (refs in the BABYLON namespace resolving through
 * the same `FlowGraphJsonPointerParserBlock` that the glTF refs use) without
 * committing to a complete property surface in this PR. Add new leaves here
 * as concrete event-source operations need them.
 * @returns a fresh Babylon-scene object-model tree with the default property surface.
 */
export function CreateDefaultBabylonSceneObjectModelTree() {
    return {
        transformNodes: {
            length: {
                type: "number",
                get: (arr) => arr.length,
                getTarget: (arr) => arr,
            },
            __array__: {
                __target__: true,
                name: {
                    type: "string",
                    get: (n) => n.name,
                    set: (v, n) => {
                        n.name = v;
                    },
                    getTarget: (n) => n,
                },
                translation: {
                    type: "Vector3",
                    get: (n) => n.position,
                    set: (v, n) => n.position.copyFrom(v),
                    getTarget: (n) => n,
                },
                rotation: {
                    type: "Quaternion",
                    get: (n) => n.rotationQuaternion ?? Quaternion.RotationYawPitchRoll(n.rotation.y, n.rotation.x, n.rotation.z),
                    set: (v, n) => {
                        if (!n.rotationQuaternion) {
                            n.rotationQuaternion = v.clone();
                        }
                        else {
                            n.rotationQuaternion.copyFrom(v);
                        }
                    },
                    getTarget: (n) => n,
                },
                scale: {
                    type: "Vector3",
                    get: (n) => n.scaling,
                    set: (v, n) => n.scaling.copyFrom(v),
                    getTarget: (n) => n,
                },
                matrix: {
                    type: "Matrix",
                    get: (n) => n.computeWorldMatrix(false),
                    getTarget: (n) => n,
                    isReadOnly: true,
                },
                globalMatrix: {
                    type: "Matrix",
                    get: (n) => n.computeWorldMatrix(true),
                    getTarget: (n) => n,
                    isReadOnly: true,
                },
            },
        },
        meshes: {
            length: {
                type: "number",
                get: (arr) => arr.length,
                getTarget: (arr) => arr,
            },
            __array__: {
                __target__: true,
                name: {
                    type: "string",
                    get: (m) => m.name,
                    set: (v, m) => {
                        m.name = v;
                    },
                    getTarget: (m) => m,
                },
                visible: {
                    type: "boolean",
                    get: (m) => m.isVisible,
                    set: (v, m) => {
                        m.isVisible = v;
                    },
                    getTarget: (m) => m,
                },
            },
        },
        materials: {
            length: {
                type: "number",
                get: (arr) => arr.length,
                getTarget: (arr) => arr,
            },
            __array__: {
                __target__: true,
                name: {
                    type: "string",
                    get: (m) => m.name,
                    set: (v, m) => {
                        m.name = v;
                    },
                    getTarget: (m) => m,
                },
            },
        },
    };
}
//# sourceMappingURL=babylonScenePathToObjectConverter.js.map