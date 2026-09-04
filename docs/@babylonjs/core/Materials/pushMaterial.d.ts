import { type Nullable } from "../types.js";
import { type Scene } from "../scene.js";
import { Matrix } from "../Maths/math.vector.pure.js";
import { type AbstractMesh } from "../Meshes/abstractMesh.js";
import { type Mesh } from "../Meshes/mesh.js";
import { Material } from "../Materials/material.js";
import { type Effect } from "../Materials/effect.js";
import { type SubMesh } from "../Meshes/subMesh.js";
/**
 * Base class of materials working in push mode in babylon JS
 * @internal
 */
export declare class PushMaterial extends Material {
    protected _activeEffect?: Effect;
    protected _normalMatrix: Matrix;
    constructor(name: string, scene?: Scene, storeEffectOnSubMeshes?: boolean, forceGLSL?: boolean);
    getEffect(): Effect;
    isReady(mesh?: AbstractMesh, useInstances?: boolean): boolean;
    protected _isReadyForSubMesh(subMesh: SubMesh): boolean;
    /**
     * Binds the given world matrix to the active effect
     *
     * @param world the matrix to bind
     */
    bindOnlyWorldMatrix(world: Matrix): void;
    /**
     * Binds the given normal matrix to the active effect
     *
     * @param normalMatrix the matrix to bind
     */
    bindOnlyNormalMatrix(normalMatrix: Matrix): void;
    bind(world: Matrix, mesh?: Mesh): void;
    protected _afterBind(mesh?: AbstractMesh, effect?: Nullable<Effect>, subMesh?: SubMesh): void;
    protected _mustRebind(scene: Scene, effect: Effect, subMesh: SubMesh, visibility?: number): boolean;
    /**
     * Disposes the push material resources.
     * @param forceDisposeEffect defines whether to dispose the effect
     * @param forceDisposeTextures defines whether to dispose the textures
     * @param notBoundToMesh defines whether the material is not bound to a mesh
     */
    dispose(forceDisposeEffect?: boolean, forceDisposeTextures?: boolean, notBoundToMesh?: boolean): void;
}
