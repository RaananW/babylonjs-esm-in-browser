// Do not edit.
import { ShaderStore } from "../Engines/shaderStore.js";
import "./ShadersInclude/packingFunctions.js";
const name = "standardPixelShader";
const shader = `uniform sampler2D textureSampler;
#if defined(PASS_POST_PROCESS)
void main(void)
#if defined(DOWN_SAMPLE_X4)
uniform vec2 dsOffsets[16];
#if defined(BRIGHT_PASS)
uniform vec2 dsOffsets[4];
#if defined(TEXTURE_ADDER)
uniform sampler2D otherSampler;
#if defined(VLS)
#define PI 3.1415926535897932384626433832795
uniform mat4 shadowViewProjection;
#if defined(VLSMERGE)
uniform sampler2D originalSampler;
#if defined(LUMINANCE)
uniform vec2 lumOffsets[4];
float GreyValue=dot(color.rgb,weight);
#ifdef BRIGHTNESS
float GreyValue=max(color.r,max(color.g,color.b));
#ifdef HSL_COMPONENT
float GreyValue=0.5*(max(color.r,max(color.g,color.b))+min(color.r,min(color.g,color.b)));
#ifdef MAGNITUDE
float GreyValue=length(color.rgb);
maximum=max(maximum,GreyValue);
#if defined(LUMINANCE_DOWN_SAMPLE)
uniform vec2 dsOffsets[9];
#include<packingFunctions>
#endif
void main()
gl_FragColor=pack(average);
gl_FragColor=vec4(average,average,0.0,1.0);
}
#if defined(HDR)
uniform sampler2D textureAdderSampler;
vec4 adjustedColor=color/averageLuminance;
gl_FragColor=color;
#if defined(LENS_FLARE)
#define GHOSTS 3
uniform sampler2D lensColorSampler;
#if defined(LENS_FLARE_COMPOSE)
uniform sampler2D otherSampler;
#if defined(DEPTH_OF_FIELD)
uniform sampler2D otherSampler;
#if defined(MOTION_BLUR)
uniform mat4 inverseViewProjection;
`;
// Sideeffect
ShaderStore.ShadersStore[name] = shader;
/** @internal */
export const standardPixelShader = { name, shader };
//# sourceMappingURL=standard.fragment.js.map