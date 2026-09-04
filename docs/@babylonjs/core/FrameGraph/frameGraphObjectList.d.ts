import { type Nullable, type AbstractMesh, type IParticleSystem } from "../index.js";
/**
 * Structure used by the frame graph to reference objects.
 */
export declare class FrameGraphObjectList {
    /**
     * The meshes in the object list.
     */
    meshes: Nullable<AbstractMesh[]>;
    /**
     * The particle systems in the object list.
     */
    particleSystems: Nullable<IParticleSystem[]>;
}
