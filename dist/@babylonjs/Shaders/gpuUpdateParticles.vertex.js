// Do not edit.
import { ShaderStore } from "../Engines/shaderStore.js";
const name = "gpuUpdateParticlesVertexShader";
const shader = `#version 300 es
#define PI 3.14159
uniform float currentCount;
uniform mat4 emitterWM;
uniform vec2 lifeTime;
uniform vec4 color1;
uniform vec3 gravity;
uniform vec3 direction1;
#ifdef POINTEMITTER
uniform vec3 direction1;
#ifdef HEMISPHERICEMITTER
uniform float radius;
#ifdef SPHEREEMITTER
uniform float radius;
uniform vec3 direction1;
uniform float directionRandomizer;
#endif
#ifdef CYLINDEREMITTER
uniform float radius;
uniform vec3 direction1;
uniform float directionRandomizer;
#endif
#ifdef CONEEMITTER
uniform vec2 radius;
in vec3 position;
in vec3 initialPosition;
in float age;
in vec4 color;
in vec3 direction;
in vec3 initialDirection;
#ifdef ANGULARSPEEDGRADIENTS
in float angle;
in vec2 angle;
#ifdef ANIMATESHEET
in float cellIndex;
in float cellStartOffset;
#endif
#ifdef NOISE
in vec3 noiseCoordinates1;
out vec3 outPosition;
out vec3 outInitialPosition;
out float outAge;
out vec4 outColor;
out vec3 outDirection;
out vec3 outInitialDirection;
#ifdef ANGULARSPEEDGRADIENTS
out float outAngle;
out vec2 outAngle;
#ifdef ANIMATESHEET
out float outCellIndex;
out float outCellStartOffset;
#endif
#ifdef NOISE
out vec3 outNoiseCoordinates1;
#ifdef SIZEGRADIENTS
uniform sampler2D sizeGradientSampler;
#ifdef ANGULARSPEEDGRADIENTS
uniform sampler2D angularSpeedGradientSampler;
#ifdef VELOCITYGRADIENTS
uniform sampler2D velocityGradientSampler;
#ifdef LIMITVELOCITYGRADIENTS
uniform sampler2D limitVelocityGradientSampler;
#ifdef DRAGGRADIENTS
uniform sampler2D dragGradientSampler;
#ifdef NOISE
uniform vec3 noiseStrength;
#ifdef ANIMATESHEET
uniform vec4 cellInfos;
vec3 getRandomVec3(float offset) {
outSize.x=texture(sizeGradientSampler,vec2(0,0)).r;
outSize.x=sizeRange.x+(sizeRange.y-sizeRange.x)*randoms.g;
outSize.y=scaleRange.x+(scaleRange.y-scaleRange.x)*randoms.b;
outColor=color1+(color2-color1)*randoms.b;
#ifndef ANGULARSPEEDGRADIENTS 
outAngle.y=angleRange.x+(angleRange.y-angleRange.x)*randoms.a;
outAngle=angleRange.z+(angleRange.w-angleRange.z)*randoms.r;
#ifdef POINTEMITTER
vec3 randoms2=getRandomVec3(seed.y);
vec3 randoms2=getRandomVec3(seed.y);
vec3 randoms2=getRandomVec3(seed.y);
vec3 randoms2=getRandomVec3(seed.y);
newDirection=normalize(direction1+(direction2-direction1)*randoms3);
newDirection=normalize(newPosition+directionRandomizer*randoms3);
#elif defined(CYLINDEREMITTER)
vec3 randoms2=getRandomVec3(seed.y);
newDirection=direction1+(direction2-direction1)*randoms3;
angle=angle+((randoms3.x-0.5)*PI)*directionRandomizer;
#elif defined(CONEEMITTER)
vec3 randoms2=getRandomVec3(seed.y);
float h=0.0001;
float h=randoms2.y*height.y;
float lRadius=radius.x-radius.x*randoms2.z*radius.y;
newPosition=initialPosition;
newPosition=vec3(0.,0.,0.);
float power=emitPower.x+(emitPower.y-emitPower.x)*randoms.a;
outPosition=newPosition;
outPosition=(emitterWM*vec4(newPosition,1.)).xyz;
#ifdef CUSTOMEMITTER
outDirection=direction;
outInitialDirection=direction;
#else
#ifdef LOCAL
vec3 initial=newDirection;
vec3 initial=(emitterWM*vec4(newDirection,0.)).xyz;
outDirection=initial*power;
outInitialDirection=initial;
#endif
#ifdef ANIMATESHEET 
outCellIndex=cellInfos.x;
outCellStartOffset=randoms.a*outLife;
#endif
#ifdef NOISE
outNoiseCoordinates1=noiseCoordinates1;
} else {
directionScale*=texture(velocityGradientSampler,vec2(ageGradient,0)).r;
#ifdef DRAGGRADIENTS
directionScale*=1.0-texture(dragGradientSampler,vec2(ageGradient,0)).r;
#if defined(CUSTOMEMITTER)
outPosition=position+(direction-position)*ageGradient; 
outPosition=position+direction*directionScale;
outLife=life;
outColor=color;
#ifdef SIZEGRADIENTS
outSize.x=texture(sizeGradientSampler,vec2(ageGradient,0)).r;
outSize=size;
#ifndef BILLBOARD 
outInitialDirection=initialDirection;
#ifdef CUSTOMEMITTER
outDirection=direction;
vec3 updatedDirection=direction+gravity*timeDelta;
float limitVelocity=texture(limitVelocityGradientSampler,vec2(ageGradient,0)).r;
outDirection=updatedDirection;
float fetchedR=texture(noiseSampler,vec2(noiseCoordinates1.x,noiseCoordinates1.y)*vec2(0.5)+vec2(0.5)).r;
#endif 
#ifdef ANGULARSPEEDGRADIENTS
float angularSpeed=texture(angularSpeedGradientSampler,vec2(ageGradient,0)).r;
outAngle=vec2(angle.x+angle.y*timeDelta,angle.y);
#ifdef ANIMATESHEET 
float offsetAge=outAge;
outCellStartOffset=cellStartOffset;
float cellStartOffset=0.;
float ratio=0.;
}
// Sideeffect
ShaderStore.ShadersStore[name] = shader;
/** @internal */
export const gpuUpdateParticlesVertexShader = { name, shader };
//# sourceMappingURL=gpuUpdateParticles.vertex.js.map