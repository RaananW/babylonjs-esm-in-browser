export {};
declare module "../../glTFFileLoader.js" {
    type MaterialVariantsController = {
        /**
         * The list of available variant names for this asset.
         */
        readonly variants: readonly string[];
        /**
         * Gets or sets the selected variant.
         */
        selectedVariant: string;
    };
    interface GLTFLoaderExtensionOptions {
        /**
         * Defines options for the KHR_materials_variants extension.
         */
        ["KHR_materials_variants"]: Partial<{
            /**
             * Specifies the name of the variant that should be selected by default.
             */
            defaultVariant: string;
            /**
             * Defines a callback that will be called if material variants are loaded.
             * @experimental
             */
            onLoaded: (controller: MaterialVariantsController) => void;
        }>;
    }
}
