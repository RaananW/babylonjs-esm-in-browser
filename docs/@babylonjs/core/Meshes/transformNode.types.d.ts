import { type TransformNodeParse } from "./transformNode.pure.js";
type TransformNodeParseType = typeof TransformNodeParse;
declare module "./transformNode.pure.js" {
    namespace TransformNode {
        let Parse: TransformNodeParseType;
    }
}
export {};
