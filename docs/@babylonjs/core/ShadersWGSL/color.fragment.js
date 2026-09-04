// Do not edit.
import { ShaderStore } from "../Engines/shaderStore.js";
import { clipPlaneFragmentDeclarationWGSL } from "./ShadersInclude/clipPlaneFragmentDeclaration.js";
import { fogFragmentDeclarationWGSL } from "./ShadersInclude/fogFragmentDeclaration.js";
import { clipPlaneFragmentWGSL } from "./ShadersInclude/clipPlaneFragment.js";
import { fogFragmentWGSL } from "./ShadersInclude/fogFragment.js";
const name = "colorPixelShader";
const shader = `#if defined(VERTEXCOLOR) || defined(INSTANCESCOLOR) && defined(INSTANCES)
#define VERTEXCOLOR
varying vColor: vec4f;
#else
uniform color: vec4f;
#endif
#include<clipPlaneFragmentDeclaration>
#include<fogFragmentDeclaration>
#define CUSTOM_FRAGMENT_DEFINITIONS
@fragment
fn main(input: FragmentInputs)->FragmentOutputs {
#define CUSTOM_FRAGMENT_MAIN_BEGIN
#include<clipPlaneFragment>
#if defined(VERTEXCOLOR) || defined(INSTANCESCOLOR) && defined(INSTANCES)
fragmentOutputs.color=input.vColor;
#else
fragmentOutputs.color=uniforms.color;
#endif
#include<fogFragment>(color,fragmentOutputs.color)
#define CUSTOM_FRAGMENT_MAIN_END
}`;
// Sideeffect
if (!ShaderStore.ShadersStoreWGSL[name]) {
    ShaderStore.ShadersStoreWGSL[name] = shader;
}
const includes = [clipPlaneFragmentDeclarationWGSL, fogFragmentDeclarationWGSL, clipPlaneFragmentWGSL, fogFragmentWGSL];
for (const inc of includes) {
    if (!ShaderStore.IncludesShadersStoreWGSL[inc.name]) {
        ShaderStore.IncludesShadersStoreWGSL[inc.name] = inc.shader;
    }
}
/** @internal */
export const colorPixelShaderWGSL = { name, shader };
//# sourceMappingURL=color.fragment.js.map