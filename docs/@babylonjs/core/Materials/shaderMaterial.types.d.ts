import { type ShaderMaterialCreateFromSnippetAsync, type ShaderMaterialParse, type ShaderMaterialParseFromFileAsync, type ShaderMaterialParseFromSnippetAsync } from "./shaderMaterial.pure.js";
type ShaderMaterialCreateFromSnippetAsyncType = typeof ShaderMaterialCreateFromSnippetAsync;
type ShaderMaterialParseType = typeof ShaderMaterialParse;
type ShaderMaterialParseFromFileAsyncType = typeof ShaderMaterialParseFromFileAsync;
type ShaderMaterialParseFromSnippetAsyncType = typeof ShaderMaterialParseFromSnippetAsync;
declare module "./shaderMaterial.pure.js" {
    namespace ShaderMaterial {
        let Parse: ShaderMaterialParseType;
        let ParseFromFileAsync: ShaderMaterialParseFromFileAsyncType;
        let ParseFromSnippetAsync: ShaderMaterialParseFromSnippetAsyncType;
        let CreateFromSnippetAsync: ShaderMaterialCreateFromSnippetAsyncType;
    }
}
export {};
