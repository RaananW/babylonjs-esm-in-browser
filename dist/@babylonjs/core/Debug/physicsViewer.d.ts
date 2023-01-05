import type { Nullable } from "../types";
import type { Scene } from "../scene";
import type { AbstractMesh } from "../Meshes/abstractMesh";
import { Mesh } from "../Meshes/mesh";
import type { IPhysicsEnginePlugin as IPhysicsEnginePluginV1 } from "../Physics/v1/IPhysicsEnginePlugin";
import type { IPhysicsEnginePluginV2 } from "../Physics/v2/IPhysicsEnginePlugin";
import { PhysicsImpostor } from "../Physics/v1/physicsImpostor";
import type { PhysicsBody } from "../Physics/v2/physicsBody";
/**
 * Used to show the physics impostor around the specific mesh
 */
export declare class PhysicsViewer {
    /** @internal */
    protected _impostors: Array<Nullable<PhysicsImpostor>>;
    /** @internal */
    protected _meshes: Array<Nullable<AbstractMesh>>;
    /** @internal */
    protected _bodies: Array<Nullable<PhysicsBody>>;
    /** @internal */
    protected _bodyMeshes: Array<Nullable<AbstractMesh>>;
    /** @internal */
    protected _scene: Nullable<Scene>;
    /** @internal */
    protected _numMeshes: number;
    /** @internal */
    protected _numBodies: number;
    /** @internal */
    protected _physicsEnginePlugin: IPhysicsEnginePluginV1 | IPhysicsEnginePluginV2 | null;
    private _renderFunction;
    private _utilityLayer;
    private _debugBoxMesh;
    private _debugSphereMesh;
    private _debugCapsuleMesh;
    private _debugCylinderMesh;
    private _debugMaterial;
    private _debugMeshMeshes;
    /**
     * Creates a new PhysicsViewer
     * @param scene defines the hosting scene
     */
    constructor(scene?: Scene);
    /** @internal */
    protected _updateDebugMeshes(): void;
    /**
     * Renders a specified physic impostor
     * @param impostor defines the impostor to render
     * @param targetMesh defines the mesh represented by the impostor
     * @returns the new debug mesh used to render the impostor
     */
    showImpostor(impostor: PhysicsImpostor, targetMesh?: Mesh): Nullable<AbstractMesh>;
    /**
     *
     */
    showBody(body: PhysicsBody): Nullable<AbstractMesh>;
    /**
     * Hides a specified physic impostor
     * @param impostor defines the impostor to hide
     */
    hideImpostor(impostor: Nullable<PhysicsImpostor>): void;
    private _getDebugMaterial;
    private _getDebugBoxMesh;
    private _getDebugSphereMesh;
    private _getDebugCapsuleMesh;
    private _getDebugCylinderMesh;
    private _getDebugMeshMesh;
    private _getDebugMesh;
    private _getDebugBodyMesh;
    /** Releases all resources */
    dispose(): void;
}
