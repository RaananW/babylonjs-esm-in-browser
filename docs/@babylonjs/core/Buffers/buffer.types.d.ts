import { type VertexBufferDeduceStride, type VertexBufferForEach, type VertexBufferGetDataType, type VertexBufferGetFloatData, type VertexBufferGetTypeByteLength } from "./buffer.pure.js";
type VertexBufferDeduceStrideType = typeof VertexBufferDeduceStride;
type VertexBufferForEachType = typeof VertexBufferForEach;
type VertexBufferGetDataTypeType = typeof VertexBufferGetDataType;
type VertexBufferGetFloatDataType = typeof VertexBufferGetFloatData;
type VertexBufferGetTypeByteLengthType = typeof VertexBufferGetTypeByteLength;
declare module "./buffer.pure.js" {
    namespace VertexBuffer {
        let DeduceStride: VertexBufferDeduceStrideType;
        let ForEach: VertexBufferForEachType;
        let GetDataType: VertexBufferGetDataTypeType;
        let GetFloatData: VertexBufferGetFloatDataType;
        let GetTypeByteLength: VertexBufferGetTypeByteLengthType;
    }
}
export {};
