import { type int } from "../../types.js";
declare module "../thinEngine.pure.js" {
    /** Adds alpha-to-coverage support to ThinEngine. */
    interface ThinEngine {
        /**
         * Gets a boolean indicating if alpha-to-coverage is enabled.
         * @returns true if alpha-to-coverage is enabled
         */
        getAlphaToCoverage(): boolean;
        /**
         * Enable or disable alpha-to-coverage.
         * @param enable defines the state to set
         */
        setAlphaToCoverage(enable: boolean): void;
        /**
         * Gets the number of samples used by the current render target.
         * @returns the current sample count, or 1 when multisampling is disabled
         */
        readonly currentSampleCount: int;
    }
}
