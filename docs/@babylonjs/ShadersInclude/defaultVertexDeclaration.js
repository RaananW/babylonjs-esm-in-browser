// Do not edit.
import { ShaderStore } from "../../Engines/shaderStore.js";
const name = "defaultVertexDeclaration";
const shader = `uniform mat4 viewProjection;
uniform mat4 diffuseMatrix;
#ifdef AMBIENT
uniform mat4 ambientMatrix;
#ifdef OPACITY
uniform mat4 opacityMatrix;
#ifdef EMISSIVE
uniform vec2 vEmissiveInfos;
#ifdef LIGHTMAP
uniform vec2 vLightmapInfos;
#if defined(SPECULAR) && defined(SPECULARTERM)
uniform vec2 vSpecularInfos;
#ifdef BUMP
uniform vec3 vBumpInfos;
#ifdef REFLECTION
uniform mat4 reflectionMatrix;
#ifdef POINTSIZE
uniform float pointSize;
#ifdef DETAIL
uniform vec4 vDetailInfos;
#define ADDITIONAL_VERTEX_DECLARATION
`;
// Sideeffect
ShaderStore.IncludesShadersStore[name] = shader;
/** @internal */
export const defaultVertexDeclaration = { name, shader };
//# sourceMappingURL=defaultVertexDeclaration.js.map