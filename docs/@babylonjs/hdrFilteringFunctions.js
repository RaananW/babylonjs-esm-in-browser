// Do not edit.
import { ShaderStore } from "../../Engines/shaderStore.js";
const name = "hdrFilteringFunctions";
const shader = `#ifdef NUM_SAMPLES
#if NUM_SAMPLES>0
#if defined(WEBGL2) || defined(WEBGPU) || defined(NATIVE)
float radicalInverse_VdC(uint bits) 
float vanDerCorpus(int n,int base)
float log4(float x) {
vec3 irradiance(samplerCube inputTexture,vec3 inputN,vec2 filteringInfo)
for(uint i=0u; i<NUM_SAMPLES; ++i)
for(int i=0; i<NUM_SAMPLES; ++i)
{
c=toLinearSpace(c);
result+=c;
vec3 radiance(float alphaG,samplerCube inputTexture,vec3 inputN,vec2 filteringInfo)
c=toLinearSpace(c);
return c;
for(uint i=0u; i<NUM_SAMPLES; ++i)
for(int i=0; i<NUM_SAMPLES; ++i)
{
c=toLinearSpace(c);
result+=c*NoL;
#endif
`;
// Sideeffect
ShaderStore.IncludesShadersStore[name] = shader;
/** @internal */
export const hdrFilteringFunctions = { name, shader };
//# sourceMappingURL=hdrFilteringFunctions.js.map