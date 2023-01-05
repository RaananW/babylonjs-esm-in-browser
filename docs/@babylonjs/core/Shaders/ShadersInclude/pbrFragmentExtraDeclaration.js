// Do not edit.
import { ShaderStore } from "../../Engines/shaderStore.js";
import "./mainUVVaryingDeclaration.js";
const name = "pbrFragmentExtraDeclaration";
const shader = `varying vec3 vPositionW;
varying vec4 vClipSpacePosition;
#include<mainUVVaryingDeclaration>[1..7]
#ifdef NORMAL
varying vec3 vNormalW;
varying vec3 vEnvironmentIrradiance;
#endif
#if defined(VERTEXCOLOR) || defined(INSTANCESCOLOR) && defined(INSTANCES)
varying vec4 vColor;
`;
// Sideeffect
ShaderStore.IncludesShadersStore[name] = shader;
/** @internal */
export const pbrFragmentExtraDeclaration = { name, shader };
//# sourceMappingURL=pbrFragmentExtraDeclaration.js.map