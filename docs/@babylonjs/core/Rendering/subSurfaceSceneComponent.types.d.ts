import { type Nullable } from "../types.js";
import { type SubSurfaceConfiguration } from "./subSurfaceConfiguration.js";
declare module "../scene.pure.js" {
    interface Scene {
        /** @internal (Backing field) */
        _subSurfaceConfiguration: Nullable<SubSurfaceConfiguration>;
        /**
         * Gets or Sets the current prepass renderer associated to the scene.
         */
        subSurfaceConfiguration: Nullable<SubSurfaceConfiguration>;
        /**
         * Enables the subsurface effect for prepass
         * @returns the SubSurfaceConfiguration
         */
        enableSubSurfaceForPrePass(): Nullable<SubSurfaceConfiguration>;
        /**
         * Disables the subsurface effect for prepass
         */
        disableSubSurfaceForPrePass(): void;
    }
}
