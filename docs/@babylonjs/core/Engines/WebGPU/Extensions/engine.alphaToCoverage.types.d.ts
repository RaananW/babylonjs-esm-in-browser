declare module "../../thinWebGPUEngine.js" {
    /** Adds alpha-to-coverage support to ThinWebGPUEngine. */
    interface ThinWebGPUEngine {
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
    }
}
export {};
