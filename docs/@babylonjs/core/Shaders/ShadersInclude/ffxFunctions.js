// Do not edit.
import { ShaderStore } from "../../Engines/shaderStore.js";
const name = "ffxFunctions";
const shader = `float AMax3F1(float x,float y,float z) {return max(x,max(y,z));}
vec3 AMax3F3(vec3 x,vec3 y,vec3 z) {return max(x,max(y,z));}
float AMin3F1(float x,float y,float z) {return min(x,min(y,z));}
vec3 AMin3F3(vec3 x,vec3 y,vec3 z) {return min(x,min(y,z));}
float APrxLoRcpF1(float a) {return uintBitsToFloat(0x7ef07ebbu-floatBitsToUint(a));}
float APrxMedRcpF1(float a) {float b=uintBitsToFloat(0x7ef19fffu-floatBitsToUint(a));return b*(-b*a+2.0);}
float APrxLoRsqF1(float a) {return uintBitsToFloat(0x5f347d74u-(floatBitsToUint(a)>>1u));}
`;
// Sideeffect
if (!ShaderStore.IncludesShadersStore[name]) {
    ShaderStore.IncludesShadersStore[name] = shader;
}
/** @internal */
export const ffxFunctions = { name, shader };
//# sourceMappingURL=ffxFunctions.js.map