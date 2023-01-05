// Do not edit.
import { ShaderStore } from "../../Engines/shaderStore.js";
const name = "morphTargetsVertex";
const shader = `#ifdef MORPHTARGETS
#ifdef MORPHTARGETS_TEXTURE 
vertexID=f32(gl_VertexID)*uniforms.morphTargetTextureInfo.x;
normalUpdated=normalUpdated+(readVector3FromRawSampler({X},vertexID) -normal)*uniforms.morphTargetInfluences[{X}];
#ifdef MORPHTARGETS_UV
uvUpdated=uvUpdated+(readVector3FromRawSampler({X},vertexID).xy-uv)*uniforms.morphTargetInfluences[{X}];
#ifdef MORPHTARGETS_TANGENT
tangentUpdated.xyz=tangentUpdated.xyz+(readVector3FromRawSampler({X},vertexID) -tangent.xyz)*uniforms.morphTargetInfluences[{X}];
#else
positionUpdated=positionUpdated+(position{X}-position)*uniforms.morphTargetInfluences[{X}];
normalUpdated+=(normal{X}-normal)*uniforms.morphTargetInfluences[{X}];
#ifdef MORPHTARGETS_TANGENT
tangentUpdated.xyz=tangentUpdated.xyz+(tangent{X}-tangent.xyz)*uniforms.morphTargetInfluences[{X}];
#ifdef MORPHTARGETS_UV
uvUpdated=uvUpdated+(uv_{X}-uv)*uniforms.morphTargetInfluences[{X}];
#endif
#endif
`;
// Sideeffect
ShaderStore.IncludesShadersStoreWGSL[name] = shader;
/** @internal */
export const morphTargetsVertex = { name, shader };
//# sourceMappingURL=morphTargetsVertex.js.map