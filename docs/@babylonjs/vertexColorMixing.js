// Do not edit.
import { ShaderStore } from "../../Engines/shaderStore.js";
const name = "vertexColorMixing";
const shader = `#if defined(VERTEXCOLOR) || defined(INSTANCESCOLOR) && defined(INSTANCES)
vColor=vec4(1.0);
#ifdef VERTEXALPHA
vColor*=color;
vColor.rgb*=color.rgb;
#endif
#ifdef INSTANCESCOLOR
vColor*=instanceColor;
#endif
`;
// Sideeffect
ShaderStore.IncludesShadersStore[name] = shader;
/** @internal */
export const vertexColorMixing = { name, shader };
//# sourceMappingURL=vertexColorMixing.js.map