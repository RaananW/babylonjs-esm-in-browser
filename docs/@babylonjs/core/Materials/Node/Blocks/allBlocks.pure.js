// Vertex blocks
import { RegisterVertexOutputBlock } from "./Vertex/vertexOutputBlock.pure.js";
import { RegisterBonesBlock } from "./Vertex/bonesBlock.pure.js";
import { RegisterInstancesBlock } from "./Vertex/instancesBlock.pure.js";
import { RegisterMorphTargetsBlock } from "./Vertex/morphTargetsBlock.pure.js";
import { RegisterLightInformationBlock } from "./Vertex/lightInformationBlock.pure.js";
// Fragment blocks
import { RegisterFragmentOutputBlock } from "./Fragment/fragmentOutputBlock.pure.js";
import { RegisterSmartFilterFragmentOutputBlock } from "./Fragment/smartFilterFragmentOutputBlock.pure.js";
import { RegisterImageProcessingBlock } from "./Fragment/imageProcessingBlock.pure.js";
import { RegisterPerturbNormalBlock } from "./Fragment/perturbNormalBlock.pure.js";
import { RegisterDiscardBlock } from "./Fragment/discardBlock.pure.js";
import { RegisterFrontFacingBlock } from "./Fragment/frontFacingBlock.pure.js";
import { RegisterDerivativeBlock } from "./Fragment/derivativeBlock.pure.js";
import { RegisterFragCoordBlock } from "./Fragment/fragCoordBlock.pure.js";
import { RegisterScreenSizeBlock } from "./Fragment/screenSizeBlock.pure.js";
import { RegisterScreenSpaceBlock } from "./Fragment/screenSpaceBlock.pure.js";
import { RegisterTwirlBlock } from "./Fragment/twirlBlock.pure.js";
import { RegisterTBNBlock } from "./Fragment/TBNBlock.pure.js";
import { RegisterHeightToNormalBlock } from "./Fragment/heightToNormalBlock.pure.js";
import { RegisterFragDepthBlock } from "./Fragment/fragDepthBlock.pure.js";
import { RegisterShadowMapBlock } from "./Fragment/shadowMapBlock.pure.js";
import { RegisterPrePassOutputBlock } from "./Fragment/prePassOutputBlock.pure.js";
import { RegisterAmbientOcclusionBlock } from "./Fragment/ambientOcclusionBlock.pure.js";
// Dual blocks
import { RegisterFogBlock } from "./Dual/fogBlock.pure.js";
import { RegisterLightBlock } from "./Dual/lightBlock.pure.js";
import { RegisterTextureBlock } from "./Dual/textureBlock.pure.js";
import { RegisterReflectionTextureBaseBlock } from "./Dual/reflectionTextureBaseBlock.pure.js";
import { RegisterReflectionTextureBlock } from "./Dual/reflectionTextureBlock.pure.js";
import { RegisterCurrentScreenBlock } from "./Dual/currentScreenBlock.pure.js";
import { RegisterSceneDepthBlock } from "./Dual/sceneDepthBlock.pure.js";
import { RegisterImageSourceBlock } from "./Dual/imageSourceBlock.pure.js";
import { RegisterDepthSourceBlock } from "./Dual/depthSourceBlock.pure.js";
import { RegisterClipPlanesBlock } from "./Dual/clipPlanesBlock.pure.js";
import { RegisterSmartFilterTextureBlock } from "./Dual/smartFilterTextureBlock.pure.js";
// Input blocks
import { RegisterMaterialsNodeBlocksInputInputBlock } from "./Input/inputBlock.pure.js";
import { RegisterPrePassTextureBlock } from "./Input/prePassTextureBlock.pure.js";
// Teleport blocks
import { RegisterMaterialsNodeBlocksTeleportTeleportInBlock } from "./Teleport/teleportInBlock.pure.js";
import { RegisterMaterialsNodeBlocksTeleportTeleportOutBlock } from "./Teleport/teleportOutBlock.pure.js";
// PBR blocks
import { RegisterPbrMetallicRoughnessBlock } from "./PBR/pbrMetallicRoughnessBlock.pure.js";
import { RegisterSheenBlock } from "./PBR/sheenBlock.pure.js";
import { RegisterAnisotropyBlock } from "./PBR/anisotropyBlock.pure.js";
import { RegisterReflectionBlock } from "./PBR/reflectionBlock.pure.js";
import { RegisterClearCoatBlock } from "./PBR/clearCoatBlock.pure.js";
import { RegisterRefractionBlock } from "./PBR/refractionBlock.pure.js";
import { RegisterSubSurfaceBlock } from "./PBR/subSurfaceBlock.pure.js";
import { RegisterIridescenceBlock } from "./PBR/iridescenceBlock.pure.js";
// Particle blocks
import { RegisterParticleTextureBlock } from "./Particle/particleTextureBlock.pure.js";
import { RegisterParticleRampGradientBlock } from "./Particle/particleRampGradientBlock.pure.js";
import { RegisterParticleBlendMultiplyBlock } from "./Particle/particleBlendMultiplyBlock.pure.js";
// Gaussian Splatting blocks
import { RegisterGaussianSplattingBlock } from "./GaussianSplatting/gaussianSplattingBlock.pure.js";
import { RegisterSplatReaderBlock } from "./GaussianSplatting/splatReaderBlock.pure.js";
import { RegisterGaussianBlock } from "./GaussianSplatting/gaussianBlock.pure.js";
// Root-level blocks
import { RegisterMultiplyBlock } from "./multiplyBlock.pure.js";
import { RegisterAddBlock } from "./addBlock.pure.js";
import { RegisterScaleBlock } from "./scaleBlock.pure.js";
import { RegisterClampBlock } from "./clampBlock.pure.js";
import { RegisterCrossBlock } from "./crossBlock.pure.js";
import { RegisterCustomBlock } from "./customBlock.pure.js";
import { RegisterDotBlock } from "./dotBlock.pure.js";
import { RegisterTransformBlock } from "./transformBlock.pure.js";
import { RegisterRemapBlock } from "./remapBlock.pure.js";
import { RegisterNormalizeBlock } from "./normalizeBlock.pure.js";
import { RegisterTrigonometryBlock } from "./trigonometryBlock.pure.js";
import { RegisterColorMergerBlock } from "./colorMergerBlock.pure.js";
import { RegisterVectorMergerBlock } from "./vectorMergerBlock.pure.js";
import { RegisterColorSplitterBlock } from "./colorSplitterBlock.pure.js";
import { RegisterVectorSplitterBlock } from "./vectorSplitterBlock.pure.js";
import { RegisterLerpBlock } from "./lerpBlock.pure.js";
import { RegisterDivideBlock } from "./divideBlock.pure.js";
import { RegisterSubtractBlock } from "./subtractBlock.pure.js";
import { RegisterStepBlock } from "./stepBlock.pure.js";
import { RegisterOneMinusBlock } from "./oneMinusBlock.pure.js";
import { RegisterViewDirectionBlock } from "./viewDirectionBlock.pure.js";
import { RegisterFresnelBlock } from "./fresnelBlock.pure.js";
import { RegisterMaxBlock } from "./maxBlock.pure.js";
import { RegisterMinBlock } from "./minBlock.pure.js";
import { RegisterDistanceBlock } from "./distanceBlock.pure.js";
import { RegisterLengthBlock } from "./lengthBlock.pure.js";
import { RegisterNegateBlock } from "./negateBlock.pure.js";
import { RegisterPowBlock } from "./powBlock.pure.js";
import { RegisterRandomNumberBlock } from "./randomNumberBlock.pure.js";
import { RegisterArcTan2Block } from "./arcTan2Block.pure.js";
import { RegisterSmoothStepBlock } from "./smoothStepBlock.pure.js";
import { RegisterReciprocalBlock } from "./reciprocalBlock.pure.js";
import { RegisterReplaceColorBlock } from "./replaceColorBlock.pure.js";
import { RegisterPosterizeBlock } from "./posterizeBlock.pure.js";
import { RegisterWaveBlock } from "./waveBlock.pure.js";
import { RegisterGradientBlock } from "./gradientBlock.pure.js";
import { RegisterNLerpBlock } from "./nLerpBlock.pure.js";
import { RegisterWorleyNoise3DBlock } from "./worleyNoise3DBlock.pure.js";
import { RegisterSimplexPerlin3DBlock } from "./simplexPerlin3DBlock.pure.js";
import { RegisterNormalBlendBlock } from "./normalBlendBlock.pure.js";
import { RegisterRotate2dBlock } from "./rotate2dBlock.pure.js";
import { RegisterReflectBlock } from "./reflectBlock.pure.js";
import { RegisterRefractBlock } from "./refractBlock.pure.js";
import { RegisterDesaturateBlock } from "./desaturateBlock.pure.js";
import { RegisterModBlock } from "./modBlock.pure.js";
import { RegisterMatrixBuilderBlock } from "./matrixBuilderBlock.pure.js";
import { RegisterConditionalBlock } from "./conditionalBlock.pure.js";
import { RegisterCloudBlock } from "./cloudBlock.pure.js";
import { RegisterVoronoiNoiseBlock } from "./voronoiNoiseBlock.pure.js";
import { RegisterMaterialsNodeBlocksElbowBlock } from "./elbowBlock.pure.js";
import { RegisterTriPlanarBlock } from "./triPlanarBlock.pure.js";
import { RegisterBiPlanarBlock } from "./biPlanarBlock.pure.js";
import { RegisterMatrixDeterminantBlock } from "./matrixDeterminantBlock.pure.js";
import { RegisterMatrixTransposeBlock } from "./matrixTransposeBlock.pure.js";
import { RegisterMeshAttributeExistsBlock } from "./meshAttributeExistsBlock.pure.js";
import { RegisterCurveBlock } from "./curveBlock.pure.js";
import { RegisterColorConverterBlock } from "./colorConverterBlock.pure.js";
import { RegisterLoopBlock } from "./loopBlock.pure.js";
import { RegisterStorageReadBlock } from "./storageReadBlock.pure.js";
import { RegisterStorageWriteBlock } from "./storageWriteBlock.pure.js";
import { RegisterMatrixSplitterBlock } from "./matrixSplitterBlock.pure.js";
import { RegisterMaterialsNodeBlocksDebugBlock } from "./debugBlock.pure.js";
import { RegisterPannerBlock } from "./pannerBlock.pure.js";
/**
 * Registers all vertex shader node material blocks for deserialization.
 * Call this if you only need vertex blocks to be deserializable.
 */
export function RegisterNodeMaterialVertexBlocks() {
    RegisterVertexOutputBlock();
    RegisterBonesBlock();
    RegisterInstancesBlock();
    RegisterMorphTargetsBlock();
    RegisterLightInformationBlock();
}
/**
 * Registers all fragment shader node material blocks for deserialization.
 * Call this if you only need fragment blocks to be deserializable.
 */
export function RegisterNodeMaterialFragmentBlocks() {
    RegisterFragmentOutputBlock();
    RegisterSmartFilterFragmentOutputBlock();
    RegisterImageProcessingBlock();
    RegisterPerturbNormalBlock();
    RegisterDiscardBlock();
    RegisterFrontFacingBlock();
    RegisterDerivativeBlock();
    RegisterFragCoordBlock();
    RegisterScreenSizeBlock();
    RegisterScreenSpaceBlock();
    RegisterTwirlBlock();
    RegisterTBNBlock();
    RegisterHeightToNormalBlock();
    RegisterFragDepthBlock();
    RegisterShadowMapBlock();
    RegisterPrePassOutputBlock();
    RegisterAmbientOcclusionBlock();
}
/**
 * Registers all dual (vertex + fragment) node material blocks for deserialization.
 * Call this if you only need dual blocks to be deserializable.
 */
export function RegisterNodeMaterialDualBlocks() {
    RegisterFogBlock();
    RegisterLightBlock();
    RegisterTextureBlock();
    RegisterReflectionTextureBaseBlock();
    RegisterReflectionTextureBlock();
    RegisterCurrentScreenBlock();
    RegisterSceneDepthBlock();
    RegisterImageSourceBlock();
    RegisterDepthSourceBlock();
    RegisterClipPlanesBlock();
    RegisterSmartFilterTextureBlock();
}
/**
 * Registers all input node material blocks for deserialization.
 * Call this if you only need input blocks to be deserializable.
 */
export function RegisterNodeMaterialInputBlocks() {
    RegisterMaterialsNodeBlocksInputInputBlock();
    RegisterPrePassTextureBlock();
}
/**
 * Registers all teleport node material blocks for deserialization.
 * Call this if you only need teleport blocks to be deserializable.
 */
export function RegisterNodeMaterialTeleportBlocks() {
    RegisterMaterialsNodeBlocksTeleportTeleportInBlock();
    RegisterMaterialsNodeBlocksTeleportTeleportOutBlock();
}
/**
 * Registers all PBR node material blocks for deserialization.
 * Call this if you only need PBR blocks to be deserializable.
 */
export function RegisterNodeMaterialPBRBlocks() {
    RegisterPbrMetallicRoughnessBlock();
    RegisterSheenBlock();
    RegisterAnisotropyBlock();
    RegisterReflectionBlock();
    RegisterClearCoatBlock();
    RegisterRefractionBlock();
    RegisterSubSurfaceBlock();
    RegisterIridescenceBlock();
}
/**
 * Registers all particle node material blocks for deserialization.
 * Call this if you only need particle blocks to be deserializable.
 */
export function RegisterNodeMaterialParticleBlocks() {
    RegisterParticleTextureBlock();
    RegisterParticleRampGradientBlock();
    RegisterParticleBlendMultiplyBlock();
}
/**
 * Registers all Gaussian splatting node material blocks for deserialization.
 * Call this if you only need Gaussian splatting blocks to be deserializable.
 */
export function RegisterNodeMaterialGaussianSplattingBlocks() {
    RegisterGaussianSplattingBlock();
    RegisterSplatReaderBlock();
    RegisterGaussianBlock();
}
/**
 * Registers all root-level (math/utility) node material blocks for deserialization.
 * Call this if you only need math and utility blocks to be deserializable.
 */
export function RegisterNodeMaterialMathBlocks() {
    RegisterMultiplyBlock();
    RegisterAddBlock();
    RegisterScaleBlock();
    RegisterClampBlock();
    RegisterCrossBlock();
    RegisterCustomBlock();
    RegisterDotBlock();
    RegisterTransformBlock();
    RegisterRemapBlock();
    RegisterNormalizeBlock();
    RegisterTrigonometryBlock();
    RegisterColorMergerBlock();
    RegisterVectorMergerBlock();
    RegisterColorSplitterBlock();
    RegisterVectorSplitterBlock();
    RegisterLerpBlock();
    RegisterDivideBlock();
    RegisterSubtractBlock();
    RegisterStepBlock();
    RegisterOneMinusBlock();
    RegisterViewDirectionBlock();
    RegisterFresnelBlock();
    RegisterMaxBlock();
    RegisterMinBlock();
    RegisterDistanceBlock();
    RegisterLengthBlock();
    RegisterNegateBlock();
    RegisterPowBlock();
    RegisterRandomNumberBlock();
    RegisterArcTan2Block();
    RegisterSmoothStepBlock();
    RegisterReciprocalBlock();
    RegisterReplaceColorBlock();
    RegisterPosterizeBlock();
    RegisterWaveBlock();
    RegisterGradientBlock();
    RegisterNLerpBlock();
    RegisterWorleyNoise3DBlock();
    RegisterSimplexPerlin3DBlock();
    RegisterNormalBlendBlock();
    RegisterRotate2dBlock();
    RegisterReflectBlock();
    RegisterRefractBlock();
    RegisterDesaturateBlock();
    RegisterModBlock();
    RegisterMatrixBuilderBlock();
    RegisterConditionalBlock();
    RegisterCloudBlock();
    RegisterVoronoiNoiseBlock();
    RegisterMaterialsNodeBlocksElbowBlock();
    RegisterTriPlanarBlock();
    RegisterBiPlanarBlock();
    RegisterMatrixDeterminantBlock();
    RegisterMatrixTransposeBlock();
    RegisterMeshAttributeExistsBlock();
    RegisterCurveBlock();
    RegisterColorConverterBlock();
    RegisterLoopBlock();
    RegisterStorageReadBlock();
    RegisterStorageWriteBlock();
    RegisterMatrixSplitterBlock();
    RegisterMaterialsNodeBlocksDebugBlock();
    RegisterPannerBlock();
}
let _Registered = false;
/**
 * Registers all node material blocks for deserialization.
 * Call this function when you need to deserialize node materials from JSON/snippets
 * and cannot know at build time which blocks will be used.
 *
 * This is the tree-shakeable replacement for:
 * ```ts
 * import "@babylonjs/core/Materials/Node/Blocks/index.js";
 * ```
 *
 * For granular control, use per-category functions instead:
 * - {@link RegisterNodeMaterialVertexBlocks}
 * - {@link RegisterNodeMaterialFragmentBlocks}
 * - {@link RegisterNodeMaterialDualBlocks}
 * - {@link RegisterNodeMaterialInputBlocks}
 * - {@link RegisterNodeMaterialTeleportBlocks}
 * - {@link RegisterNodeMaterialPBRBlocks}
 * - {@link RegisterNodeMaterialParticleBlocks}
 * - {@link RegisterNodeMaterialGaussianSplattingBlocks}
 * - {@link RegisterNodeMaterialMathBlocks}
 */
export function RegisterAllNodeMaterialBlocks() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    RegisterNodeMaterialVertexBlocks();
    RegisterNodeMaterialFragmentBlocks();
    RegisterNodeMaterialDualBlocks();
    RegisterNodeMaterialInputBlocks();
    RegisterNodeMaterialTeleportBlocks();
    RegisterNodeMaterialPBRBlocks();
    RegisterNodeMaterialParticleBlocks();
    RegisterNodeMaterialGaussianSplattingBlocks();
    RegisterNodeMaterialMathBlocks();
}
//# sourceMappingURL=allBlocks.pure.js.map