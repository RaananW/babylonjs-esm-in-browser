// Do not edit.
import { ShaderStore } from "../../Engines/shaderStore.js";
const name = "samplerVertexImplementation";
const shader = `#if defined(_DEFINENAME_) && _DEFINENAME_DIRECTUV==0
if (v_INFONAME_==0.)
else if (v_INFONAME_==1.)
#ifdef UV3
else if (v_INFONAME_==2.)
#ifdef UV4
else if (v_INFONAME_==3.)
#ifdef UV5
else if (v_INFONAME_==4.)
#ifdef UV6
else if (v_INFONAME_==5.)
#endif
`;
// Sideeffect
ShaderStore.IncludesShadersStore[name] = shader;
/** @internal */
export const samplerVertexImplementation = { name, shader };
//# sourceMappingURL=samplerVertexImplementation.js.map