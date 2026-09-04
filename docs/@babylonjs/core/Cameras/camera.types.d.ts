import { type CameraParse } from "./camera.pure.js";
type CameraParseType = typeof CameraParse;
declare module "./camera.pure.js" {
    namespace Camera {
        let Parse: CameraParseType;
    }
}
export {};
