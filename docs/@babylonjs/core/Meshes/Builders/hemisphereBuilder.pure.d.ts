/** This file must only contain pure code and pure imports */
import { Mesh } from "../mesh.pure.js";
import { type Scene } from "../../scene.pure.js";
/**
 * Creates a hemisphere mesh
 * @param name defines the name of the mesh
 * @param options defines the options used to create the mesh
 * @param scene defines the hosting scene
 * @returns the hemisphere mesh
 */
export declare function CreateHemisphere(name: string, options?: {
    segments?: number;
    diameter?: number;
    sideOrientation?: number;
}, scene?: Scene): Mesh;
/**
 * Class containing static functions to help procedurally build meshes
 * @deprecated use the function directly from the module
 */
export declare const HemisphereBuilder: {
    CreateHemisphere: typeof CreateHemisphere;
};
/**
 * Register side effects for hemisphereBuilder.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterHemisphereBuilder(): void;
