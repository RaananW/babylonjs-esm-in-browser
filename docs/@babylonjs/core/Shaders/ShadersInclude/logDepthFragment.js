// Do not edit.
import { ShaderStore } from "../../Engines/shaderStore.js";
const name = "logDepthFragment";
const shader = `#ifdef LOGARITHMICDEPTH
gl_FragDepthEXT=log2(vFragmentDepth)*logarithmicDepthConstant*0.5;
#endif
`;
// Sideeffect
if (!ShaderStore.IncludesShadersStore[name]) {
    ShaderStore.IncludesShadersStore[name] = shader;
}
/** @internal */
export const logDepthFragment = { name, shader };
//# sourceMappingURL=logDepthFragment.js.map