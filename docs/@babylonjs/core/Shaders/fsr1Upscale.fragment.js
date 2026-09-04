// Do not edit.
import { ShaderStore } from "../Engines/shaderStore.js";
import { ffxFunctions } from "./ShadersInclude/ffxFunctions.js";
const name = "fsr1UpscalePixelShader";
const shader = `#include<ffxFunctions>
uniform sampler2D textureSampler;varying vec2 vUV;uniform vec4 con0;uniform vec4 con1;uniform vec4 con2;uniform vec4 con3;vec4 FsrEasuRF(vec2 p) {ivec2 texSize=textureSize(textureSampler,0);ivec2 mx=texSize-ivec2(1);ivec2 base=ivec2(floor(p*vec2(texSize)-0.5));return vec4(
texelFetch(textureSampler,clamp(base+ivec2(0,1),ivec2(0),mx),0).r,
texelFetch(textureSampler,clamp(base+ivec2(1,1),ivec2(0),mx),0).r,
texelFetch(textureSampler,clamp(base+ivec2(1,0),ivec2(0),mx),0).r,
texelFetch(textureSampler,clamp(base+ivec2(0,0),ivec2(0),mx),0).r);}
vec4 FsrEasuGF(vec2 p) {ivec2 texSize=textureSize(textureSampler,0);ivec2 mx=texSize-ivec2(1);ivec2 base=ivec2(floor(p*vec2(texSize)-0.5));return vec4(
texelFetch(textureSampler,clamp(base+ivec2(0,1),ivec2(0),mx),0).g,
texelFetch(textureSampler,clamp(base+ivec2(1,1),ivec2(0),mx),0).g,
texelFetch(textureSampler,clamp(base+ivec2(1,0),ivec2(0),mx),0).g,
texelFetch(textureSampler,clamp(base+ivec2(0,0),ivec2(0),mx),0).g);}
vec4 FsrEasuBF(vec2 p) {ivec2 texSize=textureSize(textureSampler,0);ivec2 mx=texSize-ivec2(1);ivec2 base=ivec2(floor(p*vec2(texSize)-0.5));return vec4(
texelFetch(textureSampler,clamp(base+ivec2(0,1),ivec2(0),mx),0).b,
texelFetch(textureSampler,clamp(base+ivec2(1,1),ivec2(0),mx),0).b,
texelFetch(textureSampler,clamp(base+ivec2(1,0),ivec2(0),mx),0).b,
texelFetch(textureSampler,clamp(base+ivec2(0,0),ivec2(0),mx),0).b);}
void FsrEasuTapF(
inout vec3 aC,
inout float aW,
vec2 off,
vec2 dir,
vec2 len,
float lob,
float clp,
vec3 c 
) {vec2 v;v.x=(off.x*( dir.x))+(off.y*dir.y);v.y=(off.x*(-dir.y))+(off.y*dir.x);v*=len;float d2=v.x*v.x+v.y*v.y;d2=min(d2,clp);float wB=2.0/5.0*d2+-1.0;float wA=lob*d2+-1.0;wB*=wB;wA*=wA;wB=25.0/16.0*wB+-(25.0/16.0-1.0);float w=wB*wA;aC+=c*w;aW+=w;}
void FsrEasuSetF(
inout vec2 dir,
inout float len,
vec2 pp,
bool biS,bool biT,bool biU,bool biV,
float lA,float lB,float lC,float lD,float lE
) {float w=0.0;if (biS) {w=(1.0-pp.x)*(1.0-pp.y);}
if (biT) {w=pp.x*(1.0-pp.y);}
if (biU) {w=(1.0-pp.x)*pp.y;}
if (biV) {w=pp.x*pp.y;}
float dc=lD-lC;float cb=lC-lB;float lenX=max(abs(dc),abs(cb));lenX=APrxLoRcpF1(lenX);float dirX=lD-lB;dir.x+=dirX*w;lenX=clamp(abs(dirX)*lenX,0.0,1.0);lenX*=lenX;len+=lenX*w;float ec=lE-lC;float ca=lC-lA;float lenY=max(abs(ec),abs(ca));lenY=APrxLoRcpF1(lenY);float dirY=lE-lA;dir.y+=dirY*w;lenY=clamp(abs(dirY)*lenY,0.0,1.0);lenY*=lenY;len+=lenY*w;}
vec3 FsrEasuF(
ivec2 ip,
vec4 con0,
vec4 con1,
vec4 con2,
vec4 con3
) {vec2 pp=vec2(ip)*con0.xy+con0.zw;vec2 fp=floor(pp);pp-=fp;vec2 p0=fp*con1.xy+con1.zw;vec2 p1=p0+con2.xy;vec2 p2=p0+con2.zw;vec2 p3=p0+con3.xy;vec4 bczzR=FsrEasuRF(p0);vec4 bczzG=FsrEasuGF(p0);vec4 bczzB=FsrEasuBF(p0);vec4 ijfeR=FsrEasuRF(p1);vec4 ijfeG=FsrEasuGF(p1);vec4 ijfeB=FsrEasuBF(p1);vec4 klhgR=FsrEasuRF(p2);vec4 klhgG=FsrEasuGF(p2);vec4 klhgB=FsrEasuBF(p2);vec4 zzonR=FsrEasuRF(p3);vec4 zzonG=FsrEasuGF(p3);vec4 zzonB=FsrEasuBF(p3);vec4 bczzL=bczzB*vec4(0.5)+(bczzR*vec4(0.5)+bczzG);vec4 ijfeL=ijfeB*vec4(0.5)+(ijfeR*vec4(0.5)+ijfeG);vec4 klhgL=klhgB*vec4(0.5)+(klhgR*vec4(0.5)+klhgG);vec4 zzonL=zzonB*vec4(0.5)+(zzonR*vec4(0.5)+zzonG);float bL=bczzL.x;float cL=bczzL.y;float iL=ijfeL.x;float jL=ijfeL.y;float fL=ijfeL.z;float eL=ijfeL.w;float kL=klhgL.x;float lL=klhgL.y;float hL=klhgL.z;float gL=klhgL.w;float oL=zzonL.z;float nL=zzonL.w;vec2 dir=vec2(0.0);float len=0.0;FsrEasuSetF(dir,len,pp,true, false,false,false,bL,eL,fL,gL,jL);FsrEasuSetF(dir,len,pp,false,true, false,false,cL,fL,gL,hL,kL);FsrEasuSetF(dir,len,pp,false,false,true, false,fL,iL,jL,kL,nL);FsrEasuSetF(dir,len,pp,false,false,false,true, gL,jL,kL,lL,oL);vec2 dir2=dir*dir;float dirR=dir2.x+dir2.y;bool zro=dirR<(1.0/32768.0);dirR=APrxLoRsqF1(dirR);dirR=zro ? 1.0 : dirR;dir.x=zro ? 1.0 : dir.x;dir*=vec2(dirR);len=len*0.5;len*=len;float stretch=(dir.x*dir.x+dir.y*dir.y)*APrxLoRcpF1(max(abs(dir.x),abs(dir.y)));vec2 len2=vec2(1.0+(stretch-1.0)*len,1.0+-0.5*len);float lob=0.5+((1.0/4.0-0.04)-0.5)*len;float clp=APrxLoRcpF1(lob);vec3 min4=min(AMin3F3(vec3(ijfeR.z,ijfeG.z,ijfeB.z),vec3(klhgR.w,klhgG.w,klhgB.w),vec3(ijfeR.y,ijfeG.y,ijfeB.y)),
vec3(klhgR.x,klhgG.x,klhgB.x));vec3 max4=max(AMax3F3(vec3(ijfeR.z,ijfeG.z,ijfeB.z),vec3(klhgR.w,klhgG.w,klhgB.w),vec3(ijfeR.y,ijfeG.y,ijfeB.y)),
vec3(klhgR.x,klhgG.x,klhgB.x));vec3 aC=vec3(0.0);float aW=0.0;FsrEasuTapF(aC,aW,vec2( 0.0,-1.0)-pp,dir,len2,lob,clp,vec3(bczzR.x,bczzG.x,bczzB.x)); 
FsrEasuTapF(aC,aW,vec2( 1.0,-1.0)-pp,dir,len2,lob,clp,vec3(bczzR.y,bczzG.y,bczzB.y)); 
FsrEasuTapF(aC,aW,vec2(-1.0, 1.0)-pp,dir,len2,lob,clp,vec3(ijfeR.x,ijfeG.x,ijfeB.x)); 
FsrEasuTapF(aC,aW,vec2( 0.0, 1.0)-pp,dir,len2,lob,clp,vec3(ijfeR.y,ijfeG.y,ijfeB.y)); 
FsrEasuTapF(aC,aW,vec2( 0.0, 0.0)-pp,dir,len2,lob,clp,vec3(ijfeR.z,ijfeG.z,ijfeB.z)); 
FsrEasuTapF(aC,aW,vec2(-1.0, 0.0)-pp,dir,len2,lob,clp,vec3(ijfeR.w,ijfeG.w,ijfeB.w)); 
FsrEasuTapF(aC,aW,vec2( 1.0, 1.0)-pp,dir,len2,lob,clp,vec3(klhgR.x,klhgG.x,klhgB.x)); 
FsrEasuTapF(aC,aW,vec2( 2.0, 1.0)-pp,dir,len2,lob,clp,vec3(klhgR.y,klhgG.y,klhgB.y)); 
FsrEasuTapF(aC,aW,vec2( 2.0, 0.0)-pp,dir,len2,lob,clp,vec3(klhgR.z,klhgG.z,klhgB.z)); 
FsrEasuTapF(aC,aW,vec2( 1.0, 0.0)-pp,dir,len2,lob,clp,vec3(klhgR.w,klhgG.w,klhgB.w)); 
FsrEasuTapF(aC,aW,vec2( 1.0, 2.0)-pp,dir,len2,lob,clp,vec3(zzonR.z,zzonG.z,zzonB.z)); 
FsrEasuTapF(aC,aW,vec2( 0.0, 2.0)-pp,dir,len2,lob,clp,vec3(zzonR.w,zzonG.w,zzonB.w)); 
return min(max4,max(min4,aC*vec3(1.0/aW)));}
void main() {ivec2 ip=ivec2(gl_FragCoord.xy);vec3 pix=FsrEasuF(ip,con0,con1,con2,con3);gl_FragColor=vec4(pix,1.0);}
`;
// Sideeffect
if (!ShaderStore.ShadersStore[name]) {
    ShaderStore.ShadersStore[name] = shader;
}
const includes = [ffxFunctions];
for (const inc of includes) {
    if (!ShaderStore.IncludesShadersStore[inc.name]) {
        ShaderStore.IncludesShadersStore[inc.name] = inc.shader;
    }
}
/** @internal */
export const fsr1UpscalePixelShader = { name, shader };
//# sourceMappingURL=fsr1Upscale.fragment.js.map