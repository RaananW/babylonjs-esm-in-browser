// Do not edit.
import { ShaderStore } from "../Engines/shaderStore.js";
import "./ShadersInclude/helperFunctions.js";
const name = "copyTextureToTexturePixelShader";
const shader = `uniform float conversion;
void main(void) 
gl_FragDepth=color.r;
if (conversion==1.) {
}
// Sideeffect
ShaderStore.ShadersStore[name] = shader;
/** @internal */
export const copyTextureToTexturePixelShader = { name, shader };
//# sourceMappingURL=copyTextureToTexture.fragment.js.map