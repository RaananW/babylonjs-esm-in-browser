// Do not edit.
import { ShaderStore } from "../Engines/shaderStore.js";
import "./ShadersInclude/fogFragmentDeclaration.js";
import "./ShadersInclude/fogFragment.js";
import "./ShadersInclude/imageProcessingCompatibility.js";
const name = "spritesPixelShader";
const shader = `uniform bool alphaTest;
#define CUSTOM_FRAGMENT_DEFINITIONS
void main(void) {
vec4 color=texture2D(diffuseSampler,vUV);
gl_FragColor=color;
#define CUSTOM_FRAGMENT_MAIN_END
}`;
// Sideeffect
ShaderStore.ShadersStore[name] = shader;
/** @internal */
export const spritesPixelShader = { name, shader };
//# sourceMappingURL=sprites.fragment.js.map