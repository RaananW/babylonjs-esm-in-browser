import { type Nullable } from "../types.js";
import { type IblCdfGenerator } from "./iblCdfGenerator.js";
declare module "../scene.pure.js" {
    interface Scene {
        /** @internal (Backing field) */
        _iblCdfGenerator: Nullable<IblCdfGenerator>;
        /**
         * Gets or Sets the current CDF generator associated to the scene.
         * The CDF (cumulative distribution function) generator creates CDF maps
         * for a given IBL texture that can then be used for more efficient
         * importance sampling.
         */
        iblCdfGenerator: Nullable<IblCdfGenerator>;
        /**
         * Enables a IblCdfGenerator and associates it with the scene.
         * @returns the IblCdfGenerator
         */
        enableIblCdfGenerator(): Nullable<IblCdfGenerator>;
        /**
         * Disables the GeometryBufferRender associated with the scene
         */
        disableIblCdfGenerator(): void;
    }
}
