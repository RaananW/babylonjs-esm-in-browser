// Do not edit.
import { ShaderStore } from "../Engines/shaderStore.js";
const name = "motionBlurPixelShader";
const shader = `varying vec2 vUV;
uniform sampler2D velocitySampler;
uniform sampler2D depthSampler;
#define CUSTOM_FRAGMENT_DEFINITIONS
void main(void)
#ifdef OBJECT_BASED
vec2 texelSize=1.0/screenSize;
vec2 texelSize=1.0/screenSize;
#else
gl_FragColor=texture2D(textureSampler,vUV);
}
// Sideeffect
ShaderStore.ShadersStore[name] = shader;
/** @internal */
export const motionBlurPixelShader = { name, shader };
//# sourceMappingURL=motionBlur.fragment.js.map