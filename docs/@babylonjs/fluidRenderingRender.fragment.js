// Do not edit.
import { ShaderStore } from "../Engines/shaderStore.js";
const name = "fluidRenderingRenderPixelShader";
const shader = `#define IOR 1.333
#define ETA 1.0/IOR
#define F0 0.02
uniform sampler2D textureSampler;
uniform sampler2D diffuseSampler;
uniform vec3 diffuseColor;
#ifdef FLUIDRENDERING_FIXED_THICKNESS
uniform float thickness;
uniform float minimumThickness;
#ifdef FLUIDRENDERING_ENVIRONMENT
uniform samplerCube reflectionSampler;
#if defined(FLUIDRENDERING_DEBUG) && defined(FLUIDRENDERING_DEBUG_TEXTURE)
uniform sampler2D debugSampler;
uniform mat4 viewMatrix;
vec4 color=texture2D(debugSampler,texCoord);
glFragColor=vec4(color.rgb/vec3(2.0),1.);
glFragColor=vec4(color.rgb,1.);
return;
vec2 depthVel=texture2D(depthSampler,texCoord).rg;
float thickness=texture2D(thicknessSampler,texCoord).x;
float bgDepth=texture2D(bgDepthSampler,texCoord).x;
vec3 backColor=texture2D(textureSampler,texCoord).rgb;
if (depth>=cameraFar || depth<=0. || thickness<=minimumThickness) {
if (depth>=cameraFar || depth<=0. || bgDepth<=depthNonLinear) {
glFragColor=vec4(backColor,1.);
if(isnan(normal.x) || isnan(normal.y) || isnan(normal.z) || isinf(normal.x) || isinf(normal.y) || isinf(normal.z)) {
#if defined(FLUIDRENDERING_DEBUG) && defined(FLUIDRENDERING_DEBUG_SHOWNORMAL)
glFragColor=vec4(normal*0.5+0.5,1.0);
vec3 rayDir=normalize(viewPos); 
vec3 diffuseColor=texture2D(diffuseSampler,texCoord).rgb;
vec3 lightDir=normalize(vec3(viewMatrix*vec4(-dirLight,0.)));
float diffuse =max(0.0,dot(lightDir,normal))*1.0;
vec3 refractionDir=refract(rayDir,normal,ETA);
vec3 reflectionDir=reflect(rayDir,normal);
vec3 finalColor=refractionColor+specular;
#ifdef FLUIDRENDERING_VELOCITY
float velocity=depthVel.g;
glFragColor=vec4(finalColor,1.);
// Sideeffect
ShaderStore.ShadersStore[name] = shader;
/** @internal */
export const fluidRenderingRenderPixelShader = { name, shader };
//# sourceMappingURL=fluidRenderingRender.fragment.js.map