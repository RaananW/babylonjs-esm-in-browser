import { type InternalDeviceSourceManager } from "./internalDeviceSourceManager.pure.js";
declare module "../Engines/abstractEngine.pure.js" {
    interface AbstractEngine {
        /** @internal */
        _deviceSourceManager?: InternalDeviceSourceManager;
    }
}
