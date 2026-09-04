export {};
declare module "../../glTFFileLoader.js" {
    interface GLTFLoaderExtensionOptions {
        /**
         * Defines options for the MSFT_lod extension.
         */
        ["MSFT_lod"]: Partial<{
            /**
             * Maximum number of LODs to load, starting from the lowest LOD.
             */
            maxLODsToLoad: number;
        }>;
    }
}
