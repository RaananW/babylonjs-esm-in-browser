import { PassPostProcess } from "../../PostProcesses/passPostProcess.pure.js";
import { AnaglyphPostProcess } from "../../PostProcesses/anaglyphPostProcess.pure.js";
/**
 * @internal
 */
export function _SetStereoscopicAnaglyphRigMode(camera) {
    camera._rigCameras[0]._rigPostProcess = new PassPostProcess(camera.name + "_passthru", 1.0, camera._rigCameras[0]);
    camera._rigCameras[1]._rigPostProcess = new AnaglyphPostProcess(camera.name + "_anaglyph", 1.0, camera._rigCameras);
}
//# sourceMappingURL=stereoscopicAnaglyphRigMode.js.map