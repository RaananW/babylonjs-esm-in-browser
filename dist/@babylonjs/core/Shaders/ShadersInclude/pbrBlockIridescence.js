// Do not edit.
import { ShaderStore } from "../../Engines/shaderStore.js";
const name = "pbrBlockIridescence";
const shader = `struct iridescenceOutParams
#define pbr_inline
#define inline
void iridescenceBlock(
in vec2 iridescenceMapData,
#ifdef IRIDESCENCE_THICKNESS_TEXTURE
in vec2 iridescenceThicknessMapData,
#ifdef CLEARCOAT
in float NdotVUnclamped,
in vec2 clearCoatMapData,
#endif
out iridescenceOutParams outParams
iridescenceIntensity*=iridescenceMapData.x;
iridescenceThicknessWeight=iridescenceMapData.g;
#endif
#if defined(IRIDESCENCE_THICKNESS_TEXTURE)
iridescenceThicknessWeight=iridescenceThicknessMapData.g;
float iridescenceThickness=mix(iridescenceThicknessMin,iridescenceThicknessMax,iridescenceThicknessWeight);
float clearCoatIntensity=vClearCoatParams.x;
clearCoatIntensity*=clearCoatMapData.x;
topIor=mix(1.0,vClearCoatRefractionParams.w-1.,clearCoatIntensity);
vec3 iridescenceFresnel=evalIridescence(topIor,iridescenceIOR,viewAngle,iridescenceThickness,specularEnvironmentR0);
`;
// Sideeffect
ShaderStore.IncludesShadersStore[name] = shader;
/** @internal */
export const pbrBlockIridescence = { name, shader };
//# sourceMappingURL=pbrBlockIridescence.js.map