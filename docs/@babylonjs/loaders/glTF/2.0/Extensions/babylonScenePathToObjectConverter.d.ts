import { type Scene } from "@babylonjs/core/scene.js";
import { type TransformNode } from "@babylonjs/core/Meshes/transformNode.js";
import { type AbstractMesh } from "@babylonjs/core/Meshes/abstractMesh.js";
import { type Material } from "@babylonjs/core/Materials/material.js";
import { type Vector3, Quaternion, type Matrix } from "@babylonjs/core/Maths/math.vector.js";
import { type IObjectAccessor } from "@babylonjs/core/FlowGraph/typeDefinitions.js";
import { type IObjectInfo, type IPathToObjectConverter } from "@babylonjs/core/ObjectModel/objectModelInterfaces.js";
/**
 * Root of the JSON-Pointer namespace under which Babylon-scene objects are
 * addressed by KHR_interactivity refs that did not originate from the source
 * glTF asset (e.g. refs emitted by engine-specific event blocks).
 *
 * Trailing `/` is intentional: it lets path-prefix dispatchers like
 * {@link CompositePathToObjectConverter} match cleanly.
 */
export declare const BABYLON_SCENE_OBJECT_MODEL_PREFIX = "/extensions/BABYLON_scene_objects/";
/**
 * Shape of the Babylon-scene object model tree consumed by
 * {@link BabylonScenePathToObjectConverter}. Mirrors `IGLTFObjectModelTree`
 * but is rooted at scene-asset arrays (`transformNodes`, `meshes`, …) and
 * keyed by Babylon `uniqueId`. Initially we only expose the property leaves
 * needed to validate the seam end-to-end; future leaves can be added without
 * any path-converter changes.
 */
export interface IBabylonSceneObjectModelTree {
    /**
     *
     */
    transformNodes: IBabylonObjectCollection<TransformNode>;
    /**
     *
     */
    meshes: IBabylonObjectCollection<AbstractMesh>;
    /**
     *
     */
    materials: IBabylonObjectCollection<Material>;
}
/**
 * Generic per-collection node in the tree. `length` exposes a `.length`
 * accessor (mirroring glTF). `__array__` is the per-instance leaf hit when a
 * uniqueId index appears in the path.
 */
export interface IBabylonObjectCollection<TBabylon> {
    /**
     *
     */
    length: IObjectAccessor<TBabylon[], TBabylon[], number>;
    /**
     *
     */
    __array__: IBabylonObjectLeaves<TBabylon>;
}
/** Per-instance accessors. Add new properties here as they are needed. */
export interface IBabylonObjectLeaves<TBabylon> {
    /** Marks this position as a `getTarget` boundary so the resolver can hand back the instance itself. */
    __target__?: boolean;
    /**
     *
     */
    name?: IObjectAccessor<TBabylon, TBabylon, string>;
    /**
     *
     */
    translation?: IObjectAccessor<TBabylon, TBabylon, Vector3>;
    /**
     *
     */
    rotation?: IObjectAccessor<TBabylon, TBabylon, Quaternion>;
    /**
     *
     */
    scale?: IObjectAccessor<TBabylon, TBabylon, Vector3>;
    /**
     *
     */
    matrix?: IObjectAccessor<TBabylon, TBabylon, Matrix>;
    /**
     *
     */
    globalMatrix?: IObjectAccessor<TBabylon, TBabylon, Matrix>;
    /**
     *
     */
    visible?: IObjectAccessor<TBabylon, TBabylon, boolean>;
}
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
export declare class BabylonScenePathToObjectConverter implements IPathToObjectConverter<IObjectAccessor> {
    private _scene;
    private _tree;
    constructor(_scene: Scene, _tree: IBabylonSceneObjectModelTree);
    /**
     * @param path the full JSON Pointer (must start with the Babylon prefix)
     * @returns an object-info container holding the resolved instance and accessor
     */
    convert(path: string): IObjectInfo<IObjectAccessor>;
    private _getCollectionArray;
    private _lookupInstanceByUniqueId;
    private _buildIdentityAccessor;
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
export declare function CreateDefaultBabylonSceneObjectModelTree(): IBabylonSceneObjectModelTree;
