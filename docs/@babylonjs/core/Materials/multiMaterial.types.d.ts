import { type MultiMaterialParseMultiMaterial } from "./multiMaterial.pure.js";
type MultiMaterialParseMultiMaterialType = typeof MultiMaterialParseMultiMaterial;
declare module "./multiMaterial.pure.js" {
    namespace MultiMaterial {
        let ParseMultiMaterial: MultiMaterialParseMultiMaterialType;
    }
}
export {};
