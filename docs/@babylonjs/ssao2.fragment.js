// Do not edit.
import { ShaderStore } from "../Engines/shaderStore.js";
const name = "ssao2PixelShader";
const shader = `precision highp float;
uniform sampler2D randomSampler;
#ifdef BILATERAL_BLUR
uniform sampler2D depthSampler;
float compareDepth=abs(texture2D(depthSampler,vUV).r);
vec2 direction=vec2(1.0,0.0);
vec2 direction=vec2(0.0,1.0);
vec2 samplePos=vUV+sampleOffset;
vec4 color;
vec2 direction=vec2(1.0,0.0);
vec2 direction=vec2(0.0,1.0);
gl_FragColor.rgb=vec3(color.r);
}
`;
// Sideeffect
ShaderStore.ShadersStore[name] = shader;
/** @internal */
export const ssao2PixelShader = { name, shader };
//# sourceMappingURL=ssao2.fragment.js.map