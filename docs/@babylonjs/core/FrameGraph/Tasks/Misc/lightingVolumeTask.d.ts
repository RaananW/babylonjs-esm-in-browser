import { type FrameGraph, type FrameGraphObjectList, type FrameGraphShadowGeneratorTask } from "../../../index.js";
import { LightingVolume } from "../../../Lights/lightingVolume.pure.js";
import { FrameGraphTask } from "../../frameGraphTask.js";
/**
 * Task used to create a lighting volume from a directional light's shadow generator.
 */
export declare class FrameGraphLightingVolumeTask extends FrameGraphTask {
    /**
     * The shadow generator used to create the lighting volume.
     */
    shadowGenerator: FrameGraphShadowGeneratorTask;
    /**
     * The output object list containing the lighting volume mesh.
     * You can get the mesh by doing  outputMeshLightingVolume.meshes[0]
     */
    readonly outputMeshLightingVolume: FrameGraphObjectList;
    /**
     * The lighting volume created by this task.
     */
    readonly lightingVolume: LightingVolume;
    get name(): string;
    set name(name: string);
    /**
     * Creates a new FrameGraphLightingVolumeTask.
     * @param name Name of the task.
     * @param frameGraph The frame graph instance.
     */
    constructor(name: string, frameGraph: FrameGraph);
    isReady(): boolean;
    getClassName(): string;
    record(): void;
    dispose(): void;
}
