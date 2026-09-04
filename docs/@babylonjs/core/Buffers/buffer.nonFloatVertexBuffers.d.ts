import { type Nullable } from "../types.js";
import { type Effect } from "../Materials/effect.js";
import { VertexBuffer } from "../Meshes/buffer.js";
/**
 * Checks whether some vertex buffers that should be of type float are of a different type (int, byte...).
 * If so, trigger a shader recompilation to give the shader processor the opportunity to update the code accordingly.
 * @param vertexBuffers List of vertex buffers to check
 * @param effect The effect (shaders) that should be recompiled if needed
 */
export declare function checkNonFloatVertexBuffers(vertexBuffers: {
    [key: string]: Nullable<VertexBuffer>;
}, effect: Effect): void;
