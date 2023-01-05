// Do not edit.
import { ShaderStore } from "../Engines/shaderStore.js";
const name = "ssaoPixelShader";
const shader = `uniform sampler2D textureSampler;
uniform sampler2D randomSampler;
`;
// Sideeffect
ShaderStore.ShadersStore[name] = shader;
/** @internal */
export const ssaoPixelShader = { name, shader };
//# sourceMappingURL=ssao.fragment.js.map