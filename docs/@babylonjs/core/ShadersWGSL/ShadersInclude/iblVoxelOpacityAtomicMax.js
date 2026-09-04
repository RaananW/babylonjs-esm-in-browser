// Do not edit.
import { ShaderStore } from "../../Engines/shaderStore.js";
const name = "iblVoxelOpacityAtomicMax";
const shader = `fn voxelOpacityAtomicMax(vidx: u32,value: u32) {let wordIdx: u32=vidx>>2u;let shift: u32=(vidx & 3u)*8u;let mask: u32=0xFFu<<shift;let shifted: u32=(value & 0xFFu)<<shift;loop {let oldWord: u32=atomicLoad(&voxelOpacityBuffer[wordIdx]);if (value<=((oldWord>>shift) & 0xFFu)) {break;}
let newWord: u32=(oldWord & ~mask) | shifted;if (atomicCompareExchangeWeak(&voxelOpacityBuffer[wordIdx],oldWord,newWord).exchanged) {break;}}}
`;
// Sideeffect
if (!ShaderStore.IncludesShadersStoreWGSL[name]) {
    ShaderStore.IncludesShadersStoreWGSL[name] = shader;
}
/** @internal */
export const iblVoxelOpacityAtomicMaxWGSL = { name, shader };
//# sourceMappingURL=iblVoxelOpacityAtomicMax.js.map