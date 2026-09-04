// Do not edit.
import { ShaderStore } from "../Engines/shaderStore.js";
import { boundingBoxRendererFragmentDeclaration } from "./ShadersInclude/boundingBoxRendererFragmentDeclaration.js";
import { boundingBoxRendererUboDeclaration } from "./ShadersInclude/boundingBoxRendererUboDeclaration.js";
const name = "boundingBoxRendererPixelShader";
const shader = `#include<__decl__boundingBoxRendererFragment>
#define CUSTOM_FRAGMENT_DEFINITIONS
void main(void) {
#define CUSTOM_FRAGMENT_MAIN_BEGIN
gl_FragColor=color;
#define CUSTOM_FRAGMENT_MAIN_END
}`;
// Sideeffect
if (!ShaderStore.ShadersStore[name]) {
    ShaderStore.ShadersStore[name] = shader;
}
const includes = [boundingBoxRendererFragmentDeclaration, boundingBoxRendererUboDeclaration];
for (const inc of includes) {
    if (!ShaderStore.IncludesShadersStore[inc.name]) {
        ShaderStore.IncludesShadersStore[inc.name] = inc.shader;
    }
}
/** @internal */
export const boundingBoxRendererPixelShader = { name, shader };
//# sourceMappingURL=boundingBoxRenderer.fragment.js.map