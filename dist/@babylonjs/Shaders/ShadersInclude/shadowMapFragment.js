// Do not edit.
import { ShaderStore } from "../../Engines/shaderStore.js";
const name = "shadowMapFragment";
const shader = `float depthSM=vDepthMetricSM;
#if SM_USEDISTANCE==1
depthSM=(length(vPositionWSM-lightDataSM)+depthValuesSM.x)/depthValuesSM.y+biasAndScaleSM.x;
#ifdef USE_REVERSE_DEPTHBUFFER
depthSM=(-zSM+depthValuesSM.x)/depthValuesSM.y+biasAndScaleSM.x;
depthSM=(zSM+depthValuesSM.x)/depthValuesSM.y+biasAndScaleSM.x;
#endif
#ifdef USE_REVERSE_DEPTHBUFFER
gl_FragDepth=clamp(1.0-depthSM,0.0,1.0);
gl_FragDepth=clamp(depthSM,0.0,1.0); 
#elif SM_USEDISTANCE==1
depthSM=(length(vPositionWSM-lightDataSM)+depthValuesSM.x)/depthValuesSM.y+biasAndScaleSM.x;
#if SM_ESM==1
depthSM=clamp(exp(-min(87.,biasAndScaleSM.z*depthSM)),0.,1.);
#if SM_FLOAT==1
gl_FragColor=vec4(depthSM,1.0,1.0,1.0);
gl_FragColor=pack(depthSM);
return;`;
// Sideeffect
ShaderStore.IncludesShadersStore[name] = shader;
/** @internal */
export const shadowMapFragment = { name, shader };
//# sourceMappingURL=shadowMapFragment.js.map