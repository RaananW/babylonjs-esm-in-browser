import { type Nullable } from "../../types.js";
import { type ParticleSystem } from "../particleSystem.js";
import { NodeParticleSystemSet } from "./nodeParticleSystemSet.js";
/**
 * Converts a ParticleSystem to a NodeParticleSystemSet.
 * @param name The name of the node particle system set.
 * @param particleSystemsList The particle systems to convert.
 * @returns The converted node particle system set or null if conversion failed.
 */
export declare function ConvertToNodeParticleSystemSetAsync(name: string, particleSystemsList: ParticleSystem[]): Promise<Nullable<NodeParticleSystemSet>>;
