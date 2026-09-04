// Do not edit.
import { ShaderStore } from "../Engines/shaderStore.js";
import { clipPlaneFragmentDeclarationWGSL } from "./ShadersInclude/clipPlaneFragmentDeclaration.js";
import { logDepthDeclarationWGSL } from "./ShadersInclude/logDepthDeclaration.js";
import { fogFragmentDeclarationWGSL } from "./ShadersInclude/fogFragmentDeclaration.js";
import { packingFunctionsWGSL } from "./ShadersInclude/packingFunctions.js";
import { logDepthFragmentWGSL } from "./ShadersInclude/logDepthFragment.js";
import { fogFragmentWGSL } from "./ShadersInclude/fogFragment.js";
import { gaussianSplattingFragmentDeclarationWGSL } from "./ShadersInclude/gaussianSplattingFragmentDeclaration.js";
import { clipPlaneFragmentWGSL } from "./ShadersInclude/clipPlaneFragment.js";
const name = "gaussianSplattingPixelShader";
const shader = `#include<clipPlaneFragmentDeclaration>
#include<logDepthDeclaration>
#include<fogFragmentDeclaration>
#ifdef GPUPICKER_PACK_DEPTH
#include<packingFunctions>
#endif
varying vColor: vec4f;varying vPosition: vec2f;
#define CUSTOM_FRAGMENT_DEFINITIONS
#include<gaussianSplattingFragmentDeclaration>
@fragment
fn main(input: FragmentInputs)->FragmentOutputs {
#define CUSTOM_FRAGMENT_MAIN_BEGIN
#include<clipPlaneFragment>
var finalColor: vec4f=gaussianColor(input.vColor,input.vPosition);
#define CUSTOM_FRAGMENT_BEFORE_FRAGCOLOR
#ifdef GPUPICKER_DEPTH
fragmentOutputs.fragData0=finalColor;
#ifdef GPUPICKER_PACK_DEPTH
fragmentOutputs.fragData1=pack(fragmentInputs.position.z);
#else
fragmentOutputs.fragData1=vec4f(fragmentInputs.position.z,0.0,0.0,1.0);
#endif
#else
fragmentOutputs.color=finalColor;
#endif
#define CUSTOM_FRAGMENT_MAIN_END
}
`;
// Sideeffect
if (!ShaderStore.ShadersStoreWGSL[name]) {
    ShaderStore.ShadersStoreWGSL[name] = shader;
}
const includes = [clipPlaneFragmentDeclarationWGSL, logDepthDeclarationWGSL, fogFragmentDeclarationWGSL, packingFunctionsWGSL, logDepthFragmentWGSL, fogFragmentWGSL, gaussianSplattingFragmentDeclarationWGSL, clipPlaneFragmentWGSL];
for (const inc of includes) {
    if (!ShaderStore.IncludesShadersStoreWGSL[inc.name]) {
        ShaderStore.IncludesShadersStoreWGSL[inc.name] = inc.shader;
    }
}
/** @internal */
export const gaussianSplattingPixelShaderWGSL = { name, shader };
//# sourceMappingURL=gaussianSplatting.fragment.js.map