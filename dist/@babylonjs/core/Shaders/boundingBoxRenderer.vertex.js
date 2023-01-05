// Do not edit.
import { ShaderStore } from "../Engines/shaderStore.js";
import "./ShadersInclude/boundingBoxRendererVertexDeclaration.js";
import "./ShadersInclude/boundingBoxRendererUboDeclaration.js";
const name = "boundingBoxRendererVertexShader";
const shader = `attribute vec3 position;
#define CUSTOM_VERTEX_DEFINITIONS
void main(void) {
vec4 worldPos=world*vec4(position,1.0);
if (gl_ViewID_OVR==0u) {
gl_Position=viewProjection*worldPos;
#define CUSTOM_VERTEX_MAIN_END
}
// Sideeffect
ShaderStore.ShadersStore[name] = shader;
/** @internal */
export const boundingBoxRendererVertexShader = { name, shader };
//# sourceMappingURL=boundingBoxRenderer.vertex.js.map