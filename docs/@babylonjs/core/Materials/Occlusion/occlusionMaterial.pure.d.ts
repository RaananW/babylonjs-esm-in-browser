/** This file must only contain pure code and pure imports */
import { type Scene } from "../../scene.pure.js";
import { ShaderMaterial } from "../shaderMaterial.pure.js";
/**
 * A material to use for fast depth-only rendering.
 * @since 5.0.0
 */
export declare class OcclusionMaterial extends ShaderMaterial {
    constructor(name: string, scene: Scene);
}
