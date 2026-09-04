/** This file must only contain pure code and pure imports */
import { type Nullable } from "../types.js";
import { Color3 } from "../Maths/math.color.pure.js";
import { type Node } from "../node.js";
import { type SubMesh } from "../Meshes/subMesh.pure.js";
import { Mesh } from "../Meshes/mesh.pure.js";
import { InstancedMesh } from "../Meshes/instancedMesh.pure.js";
import { Material } from "../Materials/material.pure.js";
import { type Effect } from "../Materials/effect.pure.js";
import { type MeshCreationOptions } from "./mesh.pure.js";
import { ShaderLanguage } from "../Materials/shaderLanguage.js";
import { type Scene } from "../scene.pure.js";
/**
 * Line mesh
 * @see https://doc.babylonjs.com/features/featuresDeepDive/mesh/creation/param
 */
export declare class LinesMesh extends Mesh {
    /**
     * If vertex color should be applied to the mesh
     */
    readonly useVertexColor?: boolean | undefined;
    /**
     * If vertex alpha should be applied to the mesh
     */
    readonly useVertexAlpha?: boolean | undefined;
    /**
     * Force all the LineMeshes to compile their default color material to glsl even on WebGPU engines.
     * False by default. This is mostly meant for backward compatibility.
     */
    static ForceGLSL: boolean;
    /**
     * Color of the line (Default: White)
     */
    color: Color3;
    /**
     * Alpha of the line (Default: 1)
     */
    alpha: number;
    /**
     * The intersection Threshold is the margin applied when intersection a segment of the LinesMesh with a Ray.
     * This margin is expressed in world space coordinates, so its value may vary.
     * Default value is 0.1
     */
    intersectionThreshold: number;
    private _isShaderMaterial;
    private _color4;
    /** Shader language used by the material */
    protected _shaderLanguage: ShaderLanguage;
    private _ownsMaterial;
    /**
     * Creates a new LinesMesh
     * @param name defines the name
     * @param scene defines the hosting scene
     * @param parent defines the parent mesh if any
     * @param source defines the optional source LinesMesh used to clone data from
     * @param doNotCloneChildren When cloning, skip cloning child meshes of source, default False.
     * When false, achieved by calling a clone(), also passing False.
     * This will make creation of children, recursive.
     * @param useVertexColor defines if this LinesMesh supports vertex color
     * @param useVertexAlpha defines if this LinesMesh supports vertex alpha
     * @param material material to use to draw the line. If not provided, will create a new one
     */
    constructor(name: string, scene?: Nullable<Scene>, parent?: Nullable<Node>, source?: Nullable<LinesMesh>, doNotCloneChildren?: boolean, 
    /**
     * If vertex color should be applied to the mesh
     */
    useVertexColor?: boolean | undefined, 
    /**
     * If vertex alpha should be applied to the mesh
     */
    useVertexAlpha?: boolean | undefined, material?: Material);
    /**
     * @returns the string "LineMesh"
     */
    getClassName(): string;
    /**
     * @internal
     */
    get material(): Nullable<Material>;
    /**
     * @internal
     */
    set material(value: Nullable<Material>);
    private _setInternalMaterial;
    /**
     * @internal
     */
    get checkCollisions(): boolean;
    set checkCollisions(value: boolean);
    /**
     * @internal
     */
    _bind(_subMesh: SubMesh, colorEffect: Effect): Mesh;
    /**
     * @internal
     */
    _draw(subMesh: SubMesh, fillMode: number, instancesCount?: number): Mesh;
    /**
     * Disposes of the line mesh (this disposes of the automatically created material if not instructed otherwise).
     * @param doNotRecurse If children should be disposed
     * @param disposeMaterialAndTextures This parameter is used to force disposing the material in case it is not the default one
     * @param doNotDisposeMaterial If the material should not be disposed (default: false, meaning the material might be disposed)
     */
    dispose(doNotRecurse?: boolean, disposeMaterialAndTextures?: boolean, doNotDisposeMaterial?: boolean): void;
    /**
     * Returns a new LineMesh object cloned from the current one.
     * @param name defines the cloned mesh name
     * @param newParent defines the new mesh parent
     * @param doNotCloneChildren if set to true, none of the mesh children are cloned (false by default)
     * @returns the new mesh
     */
    clone(name: string, newParent?: Nullable<Node> | MeshCreationOptions, doNotCloneChildren?: boolean): LinesMesh;
    /**
     * Creates a new InstancedLinesMesh object from the mesh model.
     * @see https://doc.babylonjs.com/features/featuresDeepDive/mesh/copies/instances
     * @param name defines the name of the new instance
     * @returns a new InstancedLinesMesh
     */
    createInstance(name: string): InstancedLinesMesh;
    /**
     * Serializes this ground mesh
     * @param serializationObject object to write serialization to
     */
    serialize(serializationObject: any): void;
    /**
     * Parses a serialized ground mesh
     * @param parsedMesh the serialized mesh
     * @param scene the scene to create the ground mesh in
     * @returns the created ground mesh
     */
    static Parse(parsedMesh: any, scene: Scene): LinesMesh;
}
/**
 * Creates an instance based on a source LinesMesh
 */
export declare class InstancedLinesMesh extends InstancedMesh {
    /**
     * The intersection Threshold is the margin applied when intersection a segment of the LinesMesh with a Ray.
     * This margin is expressed in world space coordinates, so its value may vary.
     * Initialized with the intersectionThreshold value of the source LinesMesh
     */
    intersectionThreshold: number;
    constructor(name: string, source: LinesMesh);
    /**
     * @returns the string "InstancedLinesMesh".
     */
    getClassName(): string;
}
/**
 * Register side effects for linesMesh.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterLinesMesh(): void;
