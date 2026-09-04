/** This file must only contain pure code and pure imports */
import { type Nullable } from "../../types.js";
import { type Scene } from "../../scene.pure.js";
import { GaussianSplattingMesh } from "./gaussianSplattingMesh.pure.js";
import { type GaussianSplattingPartProxyMesh } from "./gaussianSplattingPartProxyMesh.pure.js";
/**
 * Class used to compose multiple Gaussian Splatting meshes into a single draw call,
 * with per-part world-matrix and visibility control via addPart/addParts/removePart.
 *
 * This is the recommended class for multi-part Gaussian Splatting use cases.
 *
 * Next major version: the compound mesh API (addPart/addParts/removePart) will
 * move exclusively to this class and will be removed from GaussianSplattingMesh.
 */
export declare class GaussianSplattingCompoundMesh extends GaussianSplattingMesh {
    /**
     * Creates a new GaussianSplattingCompoundMesh
     * @param name the name of the mesh
     * @param url optional URL to load a Gaussian Splatting file from
     * @param scene the hosting scene
     * @param keepInRam whether to keep the raw splat data in RAM after uploading to GPU
     * @param needsRotationScaleTextures generate rotation and scale matrix textures required for voxel-based IBL shadows
     */
    constructor(name: string, url?: Nullable<string>, scene?: Nullable<Scene>, keepInRam?: boolean, needsRotationScaleTextures?: boolean);
    /**
     * Add another mesh to this compound mesh as a new part.
     * The source mesh's splat data is read directly and copied into the compound's retained source buffers.
     * @param other - The other mesh to add. Must be fully loaded before calling this method.
     * @param disposeOther - Whether to dispose the other mesh after adding it.
     * @returns a placeholder mesh that can be used to manipulate the part transform
     */
    addPart(other: GaussianSplattingMesh, disposeOther?: boolean): GaussianSplattingPartProxyMesh;
    /**
     * Add multiple meshes to this compound mesh as new parts in a single operation.
     * Splat data is written into texture arrays while the compound refreshes its retained merged source buffers.
     * @param others - The meshes to add. Each must be fully loaded and must not be a compound.
     * @param disposeOthers - Whether to dispose the other meshes after adding them.
     * @returns an array of placeholder meshes that can be used to manipulate the part transforms
     */
    addParts(others: GaussianSplattingMesh[], disposeOthers?: boolean): GaussianSplattingPartProxyMesh[];
    /**
     * Remove a part from this compound mesh.
     * The remaining parts are rebuilt directly from the compound mesh's retained source buffers.
     * @param index - The index of the part to remove
     */
    removePart(index: number): void;
    /**
     * Serialize current GaussianSplattingMesh
     * @param serializationObject defines the object which will receive the serialization data
     * @param encoding the encoding of binary data, defaults to base64 for json serialize,
     * kept for future internal use like cloning where base64 encoding wastes cycles and memory
     * @returns the serialized object
     */
    serialize(serializationObject?: any, encoding?: string): any;
    /**
     * Parses a serialized GaussianSplattingCompoundMesh
     * @param parsedMesh the serialized mesh
     * @param scene the scene to create the GaussianSplattingCompoundMesh in
     * @returns the created GaussianSplattingCompoundMesh
     */
    static Parse(parsedMesh: any, scene: Scene): GaussianSplattingCompoundMesh;
}
/**
 * Register side effects for gaussianSplattingCompoundMesh.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterGaussianSplattingCompoundMesh(): void;
