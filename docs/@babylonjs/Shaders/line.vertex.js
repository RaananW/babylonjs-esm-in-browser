// Do not edit.
import { ShaderStore } from "../Engines/shaderStore.js";
import "./ShadersInclude/instancesDeclaration.js";
import "./ShadersInclude/clipPlaneVertexDeclaration.js";
import "./ShadersInclude/instancesVertex.js";
import "./ShadersInclude/clipPlaneVertex.js";
const name = "lineVertexShader";
const shader = `#include<instancesDeclaration>
#include<clipPlaneVertexDeclaration>
attribute vec3 position;
void main(void) {
#include<instancesVertex>
mat4 worldViewProjection=viewProjection*finalWorld;
vec4 worldPos=finalWorld*vec4(position,1.0);
#endif
#define CUSTOM_VERTEX_MAIN_END
}`;
// Sideeffect
ShaderStore.ShadersStore[name] = shader;
/** @internal */
export const lineVertexShader = { name, shader };
//# sourceMappingURL=line.vertex.js.map