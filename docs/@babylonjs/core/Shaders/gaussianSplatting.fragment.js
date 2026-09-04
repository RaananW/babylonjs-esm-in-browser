// Do not edit.
import { ShaderStore } from "../Engines/shaderStore.js";
import { clipPlaneFragmentDeclaration } from "./ShadersInclude/clipPlaneFragmentDeclaration.js";
import { logDepthDeclaration } from "./ShadersInclude/logDepthDeclaration.js";
import { fogFragmentDeclaration } from "./ShadersInclude/fogFragmentDeclaration.js";
import { packingFunctions } from "./ShadersInclude/packingFunctions.js";
import { logDepthFragment } from "./ShadersInclude/logDepthFragment.js";
import { fogFragment } from "./ShadersInclude/fogFragment.js";
import { gaussianSplattingFragmentDeclaration } from "./ShadersInclude/gaussianSplattingFragmentDeclaration.js";
import { clipPlaneFragment } from "./ShadersInclude/clipPlaneFragment.js";
const name = "gaussianSplattingPixelShader";
const shader = `#include<clipPlaneFragmentDeclaration>
#include<logDepthDeclaration>
#include<fogFragmentDeclaration>
#ifdef GPUPICKER_DEPTH
layout(location=0) out highp vec4 glFragData[2];
#endif
#ifdef GPUPICKER_PACK_DEPTH
#include<packingFunctions>
#endif
varying vec4 vColor;varying vec2 vPosition;
#define CUSTOM_FRAGMENT_DEFINITIONS
#include<gaussianSplattingFragmentDeclaration>
void main () {
#define CUSTOM_FRAGMENT_MAIN_BEGIN
#include<clipPlaneFragment>
vec4 finalColor=gaussianColor(vColor);
#define CUSTOM_FRAGMENT_BEFORE_FRAGCOLOR
#ifdef GPUPICKER_DEPTH
glFragData[0]=finalColor;
#ifdef GPUPICKER_PACK_DEPTH
glFragData[1]=pack(gl_FragCoord.z);
#else
glFragData[1]=vec4(gl_FragCoord.z,0.0,0.0,1.0);
#endif
#else
gl_FragColor=finalColor;
#endif
#define CUSTOM_FRAGMENT_MAIN_END
}
`;
// Sideeffect
if (!ShaderStore.ShadersStore[name]) {
    ShaderStore.ShadersStore[name] = shader;
}
const includes = [clipPlaneFragmentDeclaration, logDepthDeclaration, fogFragmentDeclaration, packingFunctions, logDepthFragment, fogFragment, gaussianSplattingFragmentDeclaration, clipPlaneFragment];
for (const inc of includes) {
    if (!ShaderStore.IncludesShadersStore[inc.name]) {
        ShaderStore.IncludesShadersStore[inc.name] = inc.shader;
    }
}
/** @internal */
export const gaussianSplattingPixelShader = { name, shader };
//# sourceMappingURL=gaussianSplatting.fragment.js.map