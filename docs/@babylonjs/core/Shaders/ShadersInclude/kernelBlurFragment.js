// Do not edit.
import { ShaderStore } from "../../Engines/shaderStore.js";
const name = "kernelBlurFragment";
const shader = `#ifdef DOF
factor=sampleCoC(sampleCoord{X}); 
computedWeight=KERNEL_WEIGHT{X};
#ifdef PACKEDFLOAT
blend+=unpack(texture2D(textureSampler,sampleCoord{X}))*computedWeight;
blend+=texture2D(textureSampler,sampleCoord{X})*computedWeight;
`;
// Sideeffect
ShaderStore.IncludesShadersStore[name] = shader;
/** @internal */
export const kernelBlurFragment = { name, shader };
//# sourceMappingURL=kernelBlurFragment.js.map