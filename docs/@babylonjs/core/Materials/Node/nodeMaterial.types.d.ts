import { type NodeMaterialBlockIsTextureBlock, type NodeMaterialCreateDefault, type NodeMaterialParse, type NodeMaterialParseFromFileAsync, type NodeMaterialParseFromSnippetAsync } from "./nodeMaterial.pure.js";
type NodeMaterialBlockIsTextureBlockType = typeof NodeMaterialBlockIsTextureBlock;
type NodeMaterialCreateDefaultType = typeof NodeMaterialCreateDefault;
type NodeMaterialParseType = typeof NodeMaterialParse;
type NodeMaterialParseFromFileAsyncType = typeof NodeMaterialParseFromFileAsync;
type NodeMaterialParseFromSnippetAsyncType = typeof NodeMaterialParseFromSnippetAsync;
declare module "./nodeMaterial.pure.js" {
    namespace NodeMaterial {
        let _BlockIsTextureBlock: NodeMaterialBlockIsTextureBlockType;
        let Parse: NodeMaterialParseType;
        let ParseFromFileAsync: NodeMaterialParseFromFileAsyncType;
        let ParseFromSnippetAsync: NodeMaterialParseFromSnippetAsyncType;
        let CreateDefault: NodeMaterialCreateDefaultType;
    }
}
export {};
