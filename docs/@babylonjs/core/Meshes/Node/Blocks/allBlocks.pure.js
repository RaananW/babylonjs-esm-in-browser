// Instances blocks
import { RegisterInstantiateBlock } from "./Instances/instantiateBlock.pure.js";
import { RegisterInstantiateLinearBlock } from "./Instances/instantiateLinearBlock.pure.js";
import { RegisterInstantiateOnFacesBlock } from "./Instances/instantiateOnFacesBlock.pure.js";
import { RegisterInstantiateOnVerticesBlock } from "./Instances/instantiateOnVerticesBlock.pure.js";
import { RegisterInstantiateOnVolumeBlock } from "./Instances/instantiateOnVolumeBlock.pure.js";
import { RegisterInstantiateRadialBlock } from "./Instances/instantiateRadialBlock.pure.js";
// Matrices blocks
import { RegisterAlignBlock } from "./Matrices/alignBlock.pure.js";
import { RegisterRotationXBlock } from "./Matrices/rotationXBlock.pure.js";
import { RegisterRotationYBlock } from "./Matrices/rotationYBlock.pure.js";
import { RegisterRotationZBlock } from "./Matrices/rotationZBlock.pure.js";
import { RegisterScalingBlock } from "./Matrices/scalingBlock.pure.js";
import { RegisterTranslationBlock } from "./Matrices/translationBlock.pure.js";
// Set blocks
import { RegisterAggregatorBlock } from "./Set/aggregatorBlock.pure.js";
import { RegisterLatticeBlock } from "./Set/latticeBlock.pure.js";
import { RegisterSetColorsBlock } from "./Set/setColorsBlock.pure.js";
import { RegisterSetMaterialIDBlock } from "./Set/setMaterialIDBlock.pure.js";
import { RegisterSetNormalsBlock } from "./Set/setNormalsBlock.pure.js";
import { RegisterSetPositionsBlock } from "./Set/setPositionsBlock.pure.js";
import { RegisterSetTangentsBlock } from "./Set/setTangentsBlock.pure.js";
import { RegisterSetUVsBlock } from "./Set/setUVsBlock.pure.js";
// Sources blocks
import { RegisterBoxBlock } from "./Sources/boxBlock.pure.js";
import { RegisterCapsuleBlock } from "./Sources/capsuleBlock.pure.js";
import { RegisterCylinderBlock } from "./Sources/cylinderBlock.pure.js";
import { RegisterDiscBlock } from "./Sources/discBlock.pure.js";
import { RegisterGridBlock } from "./Sources/gridBlock.pure.js";
import { RegisterIcoSphereBlock } from "./Sources/icoSphereBlock.pure.js";
import { RegisterMeshBlock } from "./Sources/meshBlock.pure.js";
import { RegisterNullBlock } from "./Sources/nullBlock.pure.js";
import { RegisterPlaneBlock } from "./Sources/planeBlock.pure.js";
import { RegisterPointListBlock } from "./Sources/pointListBlock.pure.js";
import { RegisterSphereBlock } from "./Sources/sphereBlock.pure.js";
import { RegisterTorusBlock } from "./Sources/torusBlock.pure.js";
// Teleport blocks
import { RegisterMeshesNodeBlocksTeleportTeleportInBlock } from "./Teleport/teleportInBlock.pure.js";
import { RegisterMeshesNodeBlocksTeleportTeleportOutBlock } from "./Teleport/teleportOutBlock.pure.js";
// Textures blocks
import { RegisterGeometryTextureBlock } from "./Textures/geometryTextureBlock.pure.js";
import { RegisterGeometryTextureFetchBlock } from "./Textures/geometryTextureFetchBlock.pure.js";
// Root-level blocks
import { RegisterBooleanGeometryBlock } from "./booleanGeometryBlock.pure.js";
import { RegisterBoundingBlock } from "./boundingBlock.pure.js";
import { RegisterCleanGeometryBlock } from "./cleanGeometryBlock.pure.js";
import { RegisterComputeNormalsBlock } from "./computeNormalsBlock.pure.js";
import { RegisterConditionBlock } from "./conditionBlock.pure.js";
import { RegisterMeshesNodeBlocksDebugBlock } from "./debugBlock.pure.js";
import { RegisterGeometryArcTan2Block } from "./geometryArcTan2Block.pure.js";
import { RegisterGeometryClampBlock } from "./geometryClampBlock.pure.js";
import { RegisterGeometryCollectionBlock } from "./geometryCollectionBlock.pure.js";
import { RegisterGeometryCrossBlock } from "./geometryCrossBlock.pure.js";
import { RegisterGeometryCurveBlock } from "./geometryCurveBlock.pure.js";
import { RegisterGeometryDesaturateBlock } from "./geometryDesaturateBlock.pure.js";
import { RegisterGeometryDistanceBlock } from "./geometryDistanceBlock.pure.js";
import { RegisterGeometryDotBlock } from "./geometryDotBlock.pure.js";
import { RegisterGeometryEaseBlock } from "./geometryEaseBlock.pure.js";
import { RegisterGeometryElbowBlock } from "./geometryElbowBlock.pure.js";
import { RegisterGeometryInfoBlock } from "./geometryInfoBlock.pure.js";
import { RegisterGeometryInputBlock } from "./geometryInputBlock.pure.js";
import { RegisterGeometryInterceptorBlock } from "./geometryInterceptorBlock.pure.js";
import { RegisterGeometryLengthBlock } from "./geometryLengthBlock.pure.js";
import { RegisterGeometryLerpBlock } from "./geometryLerpBlock.pure.js";
import { RegisterGeometryModBlock } from "./geometryModBlock.pure.js";
import { RegisterGeometryNLerpBlock } from "./geometryNLerpBlock.pure.js";
import { RegisterGeometryOptimizeBlock } from "./geometryOptimizeBlock.pure.js";
import { RegisterGeometryOutputBlock } from "./geometryOutputBlock.pure.js";
import { RegisterGeometryPosterizeBlock } from "./geometryPosterizeBlock.pure.js";
import { RegisterGeometryPowBlock } from "./geometryPowBlock.pure.js";
import { RegisterGeometryReplaceColorBlock } from "./geometryReplaceColorBlock.pure.js";
import { RegisterGeometryRotate2dBlock } from "./geometryRotate2dBlock.pure.js";
import { RegisterGeometrySmoothStepBlock } from "./geometrySmoothStepBlock.pure.js";
import { RegisterGeometryStepBlock } from "./geometryStepBlock.pure.js";
import { RegisterGeometryTransformBlock } from "./geometryTransformBlock.pure.js";
import { RegisterGeometryTrigonometryBlock } from "./geometryTrigonometryBlock.pure.js";
import { RegisterIntFloatConverterBlock } from "./intFloatConverterBlock.pure.js";
import { RegisterMapRangeBlock } from "./mapRangeBlock.pure.js";
import { RegisterMappingBlock } from "./mappingBlock.pure.js";
import { RegisterMathBlock } from "./mathBlock.pure.js";
import { RegisterMatrixComposeBlock } from "./matrixComposeBlock.pure.js";
import { RegisterMergeGeometryBlock } from "./mergeGeometryBlock.pure.js";
import { RegisterNoiseBlock } from "./noiseBlock.pure.js";
import { RegisterNormalizeVectorBlock } from "./normalizeVectorBlock.pure.js";
import { RegisterRandomBlock } from "./randomBlock.pure.js";
import { RegisterSubdivideBlock } from "./subdivideBlock.pure.js";
import { RegisterVectorConverterBlock } from "./vectorConverterBlock.pure.js";
/**
 * Registers all instance-related node geometry blocks for deserialization.
 */
export function RegisterNodeGeometryInstancesBlocks() {
    RegisterInstantiateBlock();
    RegisterInstantiateLinearBlock();
    RegisterInstantiateOnFacesBlock();
    RegisterInstantiateOnVerticesBlock();
    RegisterInstantiateOnVolumeBlock();
    RegisterInstantiateRadialBlock();
}
/**
 * Registers all matrix-related node geometry blocks for deserialization.
 */
export function RegisterNodeGeometryMatricesBlocks() {
    RegisterAlignBlock();
    RegisterRotationXBlock();
    RegisterRotationYBlock();
    RegisterRotationZBlock();
    RegisterScalingBlock();
    RegisterTranslationBlock();
}
/**
 * Registers all set/modify node geometry blocks for deserialization.
 */
export function RegisterNodeGeometrySetBlocks() {
    RegisterAggregatorBlock();
    RegisterLatticeBlock();
    RegisterSetColorsBlock();
    RegisterSetMaterialIDBlock();
    RegisterSetNormalsBlock();
    RegisterSetPositionsBlock();
    RegisterSetTangentsBlock();
    RegisterSetUVsBlock();
}
/**
 * Registers all source/primitive node geometry blocks for deserialization.
 */
export function RegisterNodeGeometrySourcesBlocks() {
    RegisterBoxBlock();
    RegisterCapsuleBlock();
    RegisterCylinderBlock();
    RegisterDiscBlock();
    RegisterGridBlock();
    RegisterIcoSphereBlock();
    RegisterMeshBlock();
    RegisterNullBlock();
    RegisterPlaneBlock();
    RegisterPointListBlock();
    RegisterSphereBlock();
    RegisterTorusBlock();
}
/**
 * Registers all teleport node geometry blocks for deserialization.
 */
export function RegisterNodeGeometryTeleportBlocks() {
    RegisterMeshesNodeBlocksTeleportTeleportInBlock();
    RegisterMeshesNodeBlocksTeleportTeleportOutBlock();
}
/**
 * Registers all texture node geometry blocks for deserialization.
 */
export function RegisterNodeGeometryTexturesBlocks() {
    RegisterGeometryTextureBlock();
    RegisterGeometryTextureFetchBlock();
}
/**
 * Registers all root-level (math/utility/geometry) node geometry blocks for deserialization.
 */
export function RegisterNodeGeometryMathBlocks() {
    RegisterBooleanGeometryBlock();
    RegisterBoundingBlock();
    RegisterCleanGeometryBlock();
    RegisterComputeNormalsBlock();
    RegisterConditionBlock();
    RegisterMeshesNodeBlocksDebugBlock();
    RegisterGeometryArcTan2Block();
    RegisterGeometryClampBlock();
    RegisterGeometryCollectionBlock();
    RegisterGeometryCrossBlock();
    RegisterGeometryCurveBlock();
    RegisterGeometryDesaturateBlock();
    RegisterGeometryDistanceBlock();
    RegisterGeometryDotBlock();
    RegisterGeometryEaseBlock();
    RegisterGeometryElbowBlock();
    RegisterGeometryInfoBlock();
    RegisterGeometryInputBlock();
    RegisterGeometryInterceptorBlock();
    RegisterGeometryLengthBlock();
    RegisterGeometryLerpBlock();
    RegisterGeometryModBlock();
    RegisterGeometryNLerpBlock();
    RegisterGeometryOptimizeBlock();
    RegisterGeometryOutputBlock();
    RegisterGeometryPosterizeBlock();
    RegisterGeometryPowBlock();
    RegisterGeometryReplaceColorBlock();
    RegisterGeometryRotate2dBlock();
    RegisterGeometrySmoothStepBlock();
    RegisterGeometryStepBlock();
    RegisterGeometryTransformBlock();
    RegisterGeometryTrigonometryBlock();
    RegisterIntFloatConverterBlock();
    RegisterMapRangeBlock();
    RegisterMappingBlock();
    RegisterMathBlock();
    RegisterMatrixComposeBlock();
    RegisterMergeGeometryBlock();
    RegisterNoiseBlock();
    RegisterNormalizeVectorBlock();
    RegisterRandomBlock();
    RegisterSubdivideBlock();
    RegisterVectorConverterBlock();
}
let _Registered = false;
/**
 * Registers all node geometry blocks for deserialization.
 * Call this function when you need to deserialize node geometry from JSON/snippets.
 *
 * This is the tree-shakeable replacement for:
 * ```ts
 * import "@babylonjs/core/Meshes/Node/Blocks/index.js";
 * ```
 */
export function RegisterAllNodeGeometryBlocks() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    RegisterNodeGeometryInstancesBlocks();
    RegisterNodeGeometryMatricesBlocks();
    RegisterNodeGeometrySetBlocks();
    RegisterNodeGeometrySourcesBlocks();
    RegisterNodeGeometryTeleportBlocks();
    RegisterNodeGeometryTexturesBlocks();
    RegisterNodeGeometryMathBlocks();
}
//# sourceMappingURL=allBlocks.pure.js.map