// Do not edit.
import { ShaderStore } from "../Engines/shaderStore.js";
import { ffxFunctionsWGSL } from "./ShadersInclude/ffxFunctions.js";
const name = "fsr1UpscalePixelShader";
const shader = `#include<ffxFunctions>
var textureSampler: texture_2d<f32>;var textureSamplerSampler: sampler;uniform con0: vec4f;uniform con1: vec4f;uniform con2: vec4f;uniform con3: vec4f;fn FsrEasuRF(p: vec2f)->vec4f {return textureGather(0,textureSampler,textureSamplerSampler,p);}
fn FsrEasuGF(p: vec2f)->vec4f {return textureGather(1,textureSampler,textureSamplerSampler,p);}
fn FsrEasuBF(p: vec2f)->vec4f {return textureGather(2,textureSampler,textureSamplerSampler,p);}
fn FsrEasuTapF(
aC: ptr<function,vec3f>,
aW: ptr<function,f32>,
off: vec2f,
dir: vec2f,
len: vec2f,
lob: f32,
clp: f32,
c: vec3f 
) { 
var v: vec2f;v.x=(off.x*( dir.x))+(off.y*dir.y);v.y=(off.x*(-dir.y))+(off.y*dir.x);v*=len;var d2=v.x*v.x+v.y*v.y;d2=min(d2,clp);var wB=f32(2.0/5.0)*d2+f32(-1.0);var wA=lob*d2+(-1.0);wB*=wB;wA*=wA;wB=f32(25.0/16.0)*wB+f32(-(25.0/16.0-1.0));let w=wB*wA;*aC+=c*w;*aW+=w;}
fn FsrEasuSetF(
dir: ptr<function,vec2f>,
len: ptr<function,f32>,
pp: vec2f,
biS: bool,biT: bool,biU: bool,biV: bool,
lA: f32,lB: f32,lC: f32,lD: f32,lE: f32
) {var w=f32(0.0);if biS {w=(f32(1.0)-pp.x)*(f32(1.0)-pp.y);}
if biT {w= pp.x *(f32(1.0)-pp.y);}
if biU {w=(f32(1.0)-pp.x)* pp.y ;}
if biV {w= pp.x* pp.y ;}
let dc=lD-lC;let cb=lC-lB;var lenX=max(abs(dc),abs(cb));lenX=APrxLoRcpF1(lenX);let dirX=lD-lB;dir.x+=dirX*w;lenX=saturate(abs(dirX)*lenX);lenX*=lenX;*len+=lenX*w;let ec=lE-lC;let ca=lC-lA;var lenY=max(abs(ec),abs(ca));lenY=APrxLoRcpF1(lenY);let dirY=lE-lA;dir.y+=dirY*w;lenY=saturate(abs(dirY)*lenY);lenY*=lenY;*len+=lenY*w;}
fn FsrEasuF(
pix: ptr<function,vec3f>,
ip: vec2u,
con0: vec4f,
con1: vec4f,
con2: vec4f,
con3: vec4f
) {var pp=vec2f(ip)*con0.xy+con0.zw;let fp=floor(pp);pp-=fp;let p0=fp*con1.xy+con1.zw;let p1=p0+con2.xy;let p2=p0+con2.zw;let p3=p0+con3.xy;let bczzR=FsrEasuRF(p0);let bczzG=FsrEasuGF(p0);let bczzB=FsrEasuBF(p0);let ijfeR=FsrEasuRF(p1);let ijfeG=FsrEasuGF(p1);let ijfeB=FsrEasuBF(p1);let klhgR=FsrEasuRF(p2);let klhgG=FsrEasuGF(p2);let klhgB=FsrEasuBF(p2);let zzonR=FsrEasuRF(p3);let zzonG=FsrEasuGF(p3);let zzonB=FsrEasuBF(p3);let bczzL=bczzB*vec4f(0.5)+(bczzR*vec4f(0.5)+bczzG);let ijfeL=ijfeB*vec4f(0.5)+(ijfeR*vec4f(0.5)+ijfeG);let klhgL=klhgB*vec4f(0.5)+(klhgR*vec4f(0.5)+klhgG);let zzonL=zzonB*vec4f(0.5)+(zzonR*vec4f(0.5)+zzonG);let bL=bczzL.x;let cL=bczzL.y;let iL=ijfeL.x;let jL=ijfeL.y;let fL=ijfeL.z;let eL=ijfeL.w;let kL=klhgL.x;let lL=klhgL.y;let hL=klhgL.z;let gL=klhgL.w;let oL=zzonL.z;let nL=zzonL.w;var dir=vec2f(0.0);var len=f32(0.0);FsrEasuSetF(&dir,&len,pp,true,false,false,false,bL,eL,fL,gL,jL);FsrEasuSetF(&dir,&len,pp,false,true ,false,false,cL,fL,gL,hL,kL);FsrEasuSetF(&dir,&len,pp,false,false,true ,false,fL,iL,jL,kL,nL);FsrEasuSetF(&dir,&len,pp,false,false,false,true ,gL,jL,kL,lL,oL);let dir2=dir*dir;var dirR=dir2.x+dir2.y;var zro=dirR<f32(1.0/32768.0);dirR=APrxLoRsqF1(dirR);dirR=select(dirR,f32(1.0),zro);dir.x=select(dir.x,f32(1.0),zro);dir*=vec2f(dirR);len=len*f32(0.5);len*=len;let stretch=(dir.x*dir.x+dir.y*dir.y)*APrxLoRcpF1(max(abs(dir.x),abs(dir.y)));let len2=vec2f(f32(1.0)+(stretch-f32(1.0))*len,f32(1.0)+f32(-0.5)*len);let lob=f32(0.5)+f32((1.0/4.0-0.04)-0.5)*len;let clp=APrxLoRcpF1(lob);let min4=min(AMin3F3(vec3f(ijfeR.z,ijfeG.z,ijfeB.z),vec3f(klhgR.w,klhgG.w,klhgB.w),vec3f(ijfeR.y,ijfeG.y,ijfeB.y)),
vec3f(klhgR.x,klhgG.x,klhgB.x));let max4=max(AMax3F3(vec3f(ijfeR.z,ijfeG.z,ijfeB.z),vec3f(klhgR.w,klhgG.w,klhgB.w),vec3f(ijfeR.y,ijfeG.y,ijfeB.y)),
vec3f(klhgR.x,klhgG.x,klhgB.x));var aC=vec3f(0.0);var aW=f32(0.0);FsrEasuTapF(&aC,&aW,vec2f( 0.0,-1.0)-pp,dir,len2,lob,clp,vec3f(bczzR.x,bczzG.x,bczzB.x)); 
FsrEasuTapF(&aC,&aW,vec2f( 1.0,-1.0)-pp,dir,len2,lob,clp,vec3f(bczzR.y,bczzG.y,bczzB.y)); 
FsrEasuTapF(&aC,&aW,vec2f(-1.0,1.0)-pp,dir,len2,lob,clp,vec3f(ijfeR.x,ijfeG.x,ijfeB.x)); 
FsrEasuTapF(&aC,&aW,vec2f( 0.0,1.0)-pp,dir,len2,lob,clp,vec3f(ijfeR.y,ijfeG.y,ijfeB.y)); 
FsrEasuTapF(&aC,&aW,vec2f( 0.0,0.0)-pp,dir,len2,lob,clp,vec3f(ijfeR.z,ijfeG.z,ijfeB.z)); 
FsrEasuTapF(&aC,&aW,vec2f(-1.0,0.0)-pp,dir,len2,lob,clp,vec3f(ijfeR.w,ijfeG.w,ijfeB.w)); 
FsrEasuTapF(&aC,&aW,vec2f( 1.0,1.0)-pp,dir,len2,lob,clp,vec3f(klhgR.x,klhgG.x,klhgB.x)); 
FsrEasuTapF(&aC,&aW,vec2f( 2.0,1.0)-pp,dir,len2,lob,clp,vec3f(klhgR.y,klhgG.y,klhgB.y)); 
FsrEasuTapF(&aC,&aW,vec2f( 2.0,0.0)-pp,dir,len2,lob,clp,vec3f(klhgR.z,klhgG.z,klhgB.z)); 
FsrEasuTapF(&aC,&aW,vec2f( 1.0,0.0)-pp,dir,len2,lob,clp,vec3f(klhgR.w,klhgG.w,klhgB.w)); 
FsrEasuTapF(&aC,&aW,vec2f( 1.0,2.0)-pp,dir,len2,lob,clp,vec3f(zzonR.z,zzonG.z,zzonB.z)); 
FsrEasuTapF(&aC,&aW,vec2f( 0.0,2.0)-pp,dir,len2,lob,clp,vec3f(zzonR.w,zzonG.w,zzonB.w)); 
*pix=min(max4,max(min4,aC*vec3f(1.0/aW)));}
@fragment
fn main(input: FragmentInputs)->FragmentOutputs {var pix: vec3f;let ip=vec2u(fragmentInputs.position.xy);FsrEasuF(&pix,ip,uniforms.con0,uniforms.con1,uniforms.con2,uniforms.con3);fragmentOutputs.color=vec4f(pix,1);}
`;
// Sideeffect
if (!ShaderStore.ShadersStoreWGSL[name]) {
    ShaderStore.ShadersStoreWGSL[name] = shader;
}
const includes = [ffxFunctionsWGSL];
for (const inc of includes) {
    if (!ShaderStore.IncludesShadersStoreWGSL[inc.name]) {
        ShaderStore.IncludesShadersStoreWGSL[inc.name] = inc.shader;
    }
}
/** @internal */
export const fsr1UpscalePixelShaderWGSL = { name, shader };
//# sourceMappingURL=fsr1Upscale.fragment.js.map