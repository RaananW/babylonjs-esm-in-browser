// Do not edit.
import { ShaderStore } from "../../Engines/shaderStore.js";
const name = "oitFragment";
const shader = `#ifdef ORDER_INDEPENDENT_TRANSPARENCY
float fragDepth=gl_FragCoord.z; 
uint halfFloat=packHalf2x16(vec2(fragDepth));
ivec2 fragCoord=ivec2(gl_FragCoord.xy);
float furthestDepth=-lastDepth.x;
float nearestDepth=-lastDepth.x;
float alphaMultiplier=1.0-lastFrontColor.a;
if (fragDepth>nearestDepth || fragDepth<furthestDepth) {
if (fragDepth<nearestDepth || fragDepth>furthestDepth) {
return;
if (fragDepth<nearestDepth && fragDepth>furthestDepth) {
if (fragDepth>nearestDepth && fragDepth<furthestDepth) {
depth.rg=vec2(-fragDepth,fragDepth);
`;
// Sideeffect
ShaderStore.IncludesShadersStore[name] = shader;
/** @internal */
export const oitFragment = { name, shader };
//# sourceMappingURL=oitFragment.js.map