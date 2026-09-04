// Do not edit.
import { ShaderStore } from "../Engines/shaderStore.js";
import { ffxFunctionsWGSL } from "./ShadersInclude/ffxFunctions.js";
const name = "fsr1SharpenPixelShader";
const shader = `#include<ffxFunctions>
#define FSR_RCAS_LIMIT (0.25-(1.0/16.0))
var textureSampler: texture_2d<f32>;uniform con: vec4f;fn FsrRcasLoadF(p: vec2i)->vec4f {return textureLoad(textureSampler,clamp(p,vec2i(0),vec2i(textureDimensions(textureSampler,0))-vec2i(1)),0);}
fn FsrRcasF(
pixR: ptr<function,f32>,
pixG: ptr<function,f32>,
pixB: ptr<function,f32>,
ip: vec2u,
con: vec4f 
) {let sp=vec2i(ip);let b=FsrRcasLoadF(sp+vec2i( 0,-1)).rgb;let d=FsrRcasLoadF(sp+vec2i(-1,0)).rgb;let e=FsrRcasLoadF(sp).rgb;let f=FsrRcasLoadF(sp+vec2i( 1,0)).rgb;let h=FsrRcasLoadF(sp+vec2i( 0,1)).rgb;let bR=b.r;let bG=b.g;let bB=b.b;let dR=d.r;let dG=d.g;let dB=d.b;let eR=e.r;let eG=e.g;let eB=e.b;let fR=f.r;let fG=f.g;let fB=f.b;let hR=h.r;let hG=h.g;let hB=h.b;let bL=bB*f32(0.5)+(bR*f32(0.5)+bG);let dL=dB*f32(0.5)+(dR*f32(0.5)+dG);let eL=eB*f32(0.5)+(eR*f32(0.5)+eG);let fL=fB*f32(0.5)+(fR*f32(0.5)+fG);let hL=hB*f32(0.5)+(hR*f32(0.5)+hG);var nz=f32(0.25)*bL+f32(0.25)*dL+f32(0.25)*fL+f32(0.25)*hL-eL;nz=saturate(abs(nz)*APrxMedRcpF1(AMax3F1(AMax3F1(bL,dL,eL),fL,hL)-AMin3F1(AMin3F1(bL,dL,eL),fL,hL)));nz=f32(-0.5)*nz+f32(1.0);let mn4R=min(AMin3F1(bR,dR,fR),hR);let mn4G=min(AMin3F1(bG,dG,fG),hG);let mn4B=min(AMin3F1(bB,dB,fB),hB);let mx4R=max(AMax3F1(bR,dR,fR),hR);let mx4G=max(AMax3F1(bG,dG,fG),hG);let mx4B=max(AMax3F1(bB,dB,fB),hB);let peakC=vec2f(1.0,-1.0*4.0);let hitMinR=min(mn4R,eR)*(1.0/(f32(4.0)*mx4R));let hitMinG=min(mn4G,eG)*(1.0/(f32(4.0)*mx4G));let hitMinB=min(mn4B,eB)*(1.0/(f32(4.0)*mx4B));let hitMaxR=(peakC.x-max(mx4R,eR))*(1.0/(f32(4.0)*mn4R+peakC.y));let hitMaxG=(peakC.x-max(mx4G,eG))*(1.0/(f32(4.0)*mn4G+peakC.y));let hitMaxB=(peakC.x-max(mx4B,eB))*(1.0/(f32(4.0)*mn4B+peakC.y));let lobeR=max(-hitMinR,hitMaxR);let lobeG=max(-hitMinG,hitMaxG);let lobeB=max(-hitMinB,hitMaxB);var lobe=max(f32(-FSR_RCAS_LIMIT),min(AMax3F1(lobeR,lobeG,lobeB),f32(0.0)))*con.x;
#ifdef FSR_RCAS_DENOISE
lobe*=nz;
#endif
let rcpL=APrxMedRcpF1(f32(4.0)*lobe+f32(1.0));*pixR=(lobe*bR+lobe*dR+lobe*hR+lobe*fR+eR)*rcpL;*pixG=(lobe*bG+lobe*dG+lobe*hG+lobe*fG+eG)*rcpL;*pixB=(lobe*bB+lobe*dB+lobe*hB+lobe*fB+eB)*rcpL;return;}
@fragment
fn main(input: FragmentInputs)->FragmentOutputs {var pixR: f32;var pixG: f32;var pixB: f32;let ip=vec2u(fragmentInputs.position.xy);FsrRcasF(&pixR,&pixG,&pixB,ip,uniforms.con);fragmentOutputs.color=vec4f(pixR,pixG,pixB,1);}
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
export const fsr1SharpenPixelShaderWGSL = { name, shader };
//# sourceMappingURL=fsr1Sharpen.fragment.js.map