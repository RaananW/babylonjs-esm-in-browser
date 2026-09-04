// Layers blocks
import { RegisterGlowLayerBlock } from "./Layers/glowLayerBlock.pure.js";
import { RegisterHighlightLayerBlock } from "./Layers/highlightLayerBlock.pure.js";
import { RegisterSelectionOutlineLayerBlock } from "./Layers/selectionOutlineLayerBlock.pure.js";
// PostProcesses blocks
import { RegisterAnaglyphPostProcessBlock } from "./PostProcesses/anaglyphPostProcessBlock.pure.js";
import { RegisterBlackAndWhitePostProcessBlock } from "./PostProcesses/blackAndWhitePostProcessBlock.pure.js";
import { RegisterBloomPostProcessBlock } from "./PostProcesses/bloomPostProcessBlock.pure.js";
import { RegisterBlurPostProcessBlock } from "./PostProcesses/blurPostProcessBlock.pure.js";
import { RegisterChromaticAberrationPostProcessBlock } from "./PostProcesses/chromaticAberrationPostProcessBlock.pure.js";
import { RegisterCircleOfConfusionPostProcessBlock } from "./PostProcesses/circleOfConfusionPostProcessBlock.pure.js";
import { RegisterColorCorrectionPostProcessBlock } from "./PostProcesses/colorCorrectionPostProcessBlock.pure.js";
import { RegisterConvolutionPostProcessBlock } from "./PostProcesses/convolutionPostProcessBlock.pure.js";
import { RegisterDepthOfFieldPostProcessBlock } from "./PostProcesses/depthOfFieldPostProcessBlock.pure.js";
import { RegisterExtractHighlightsPostProcessBlock } from "./PostProcesses/extractHighlightsPostProcessBlock.pure.js";
import { RegisterFilterPostProcessBlock } from "./PostProcesses/filterPostProcessBlock.pure.js";
import { RegisterFxaaPostProcessBlock } from "./PostProcesses/fxaaPostProcessBlock.pure.js";
import { RegisterGrainPostProcessBlock } from "./PostProcesses/grainPostProcessBlock.pure.js";
import { RegisterImageProcessingPostProcessBlock } from "./PostProcesses/imageProcessingPostProcessBlock.pure.js";
import { RegisterMotionBlurPostProcessBlock } from "./PostProcesses/motionBlurPostProcessBlock.pure.js";
import { RegisterPassPostProcessBlock } from "./PostProcesses/passPostProcessBlock.pure.js";
import { RegisterScreenSpaceCurvaturePostProcessBlock } from "./PostProcesses/screenSpaceCurvaturePostProcessBlock.pure.js";
import { RegisterSharpenPostProcessBlock } from "./PostProcesses/sharpenPostProcessBlock.pure.js";
import { RegisterSsao2PostProcessBlock } from "./PostProcesses/ssao2PostProcessBlock.pure.js";
import { RegisterSsrPostProcessBlock } from "./PostProcesses/ssrPostProcessBlock.pure.js";
import { RegisterTaaPostProcessBlock } from "./PostProcesses/taaPostProcessBlock.pure.js";
import { RegisterTonemapPostProcessBlock } from "./PostProcesses/tonemapPostProcessBlock.pure.js";
import { RegisterVolumetricLightingBlock } from "./PostProcesses/volumetricLightingBlock.pure.js";
// Rendering blocks
import { RegisterCsmShadowGeneratorBlock } from "./Rendering/csmShadowGeneratorBlock.pure.js";
import { RegisterGeometryRendererBlock } from "./Rendering/geometryRendererBlock.pure.js";
import { RegisterObjectRendererBlock } from "./Rendering/objectRendererBlock.pure.js";
import { RegisterShadowGeneratorBlock } from "./Rendering/shadowGeneratorBlock.pure.js";
import { RegisterUtilityLayerRendererBlock } from "./Rendering/utilityLayerRendererBlock.pure.js";
// Teleport blocks
import { RegisterFrameGraphNodeBlocksTeleportTeleportInBlock } from "./Teleport/teleportInBlock.pure.js";
import { RegisterFrameGraphNodeBlocksTeleportTeleportOutBlock } from "./Teleport/teleportOutBlock.pure.js";
// Textures blocks
import { RegisterClearBlock } from "./Textures/clearBlock.pure.js";
import { RegisterCopyTextureBlock } from "./Textures/copyTextureBlock.pure.js";
import { RegisterGenerateMipmapsBlock } from "./Textures/generateMipmapsBlock.pure.js";
// Root-level blocks
import { RegisterComputeShaderBlock } from "./computeShaderBlock.pure.js";
import { RegisterCullObjectsBlock } from "./cullObjectsBlock.pure.js";
import { RegisterFrameGraphNodeBlocksElbowBlock } from "./elbowBlock.pure.js";
import { RegisterExecuteBlock } from "./executeBlock.pure.js";
import { RegisterFrameGraphNodeBlocksInputBlock } from "./inputBlock.pure.js";
import { RegisterLightingVolumeBlock } from "./lightingVolumeBlock.pure.js";
import { RegisterOutputBlock } from "./outputBlock.pure.js";
import { RegisterResourceContainerBlock } from "./resourceContainerBlock.pure.js";
/**
 * Registers all layer node render graph blocks for deserialization.
 */
export function RegisterNodeRenderGraphLayersBlocks() {
    RegisterGlowLayerBlock();
    RegisterHighlightLayerBlock();
    RegisterSelectionOutlineLayerBlock();
}
/**
 * Registers all post-process node render graph blocks for deserialization.
 */
export function RegisterNodeRenderGraphPostProcessesBlocks() {
    RegisterAnaglyphPostProcessBlock();
    RegisterBlackAndWhitePostProcessBlock();
    RegisterBloomPostProcessBlock();
    RegisterBlurPostProcessBlock();
    RegisterChromaticAberrationPostProcessBlock();
    RegisterCircleOfConfusionPostProcessBlock();
    RegisterColorCorrectionPostProcessBlock();
    RegisterConvolutionPostProcessBlock();
    RegisterDepthOfFieldPostProcessBlock();
    RegisterExtractHighlightsPostProcessBlock();
    RegisterFilterPostProcessBlock();
    RegisterFxaaPostProcessBlock();
    RegisterGrainPostProcessBlock();
    RegisterImageProcessingPostProcessBlock();
    RegisterMotionBlurPostProcessBlock();
    RegisterPassPostProcessBlock();
    RegisterScreenSpaceCurvaturePostProcessBlock();
    RegisterSharpenPostProcessBlock();
    RegisterSsao2PostProcessBlock();
    RegisterSsrPostProcessBlock();
    RegisterTaaPostProcessBlock();
    RegisterTonemapPostProcessBlock();
    RegisterVolumetricLightingBlock();
}
/**
 * Registers all rendering node render graph blocks for deserialization.
 */
export function RegisterNodeRenderGraphRenderingBlocks() {
    RegisterCsmShadowGeneratorBlock();
    RegisterGeometryRendererBlock();
    RegisterObjectRendererBlock();
    RegisterShadowGeneratorBlock();
    RegisterUtilityLayerRendererBlock();
}
/**
 * Registers all teleport node render graph blocks for deserialization.
 */
export function RegisterNodeRenderGraphTeleportBlocks() {
    RegisterFrameGraphNodeBlocksTeleportTeleportInBlock();
    RegisterFrameGraphNodeBlocksTeleportTeleportOutBlock();
}
/**
 * Registers all texture node render graph blocks for deserialization.
 */
export function RegisterNodeRenderGraphTexturesBlocks() {
    RegisterClearBlock();
    RegisterCopyTextureBlock();
    RegisterGenerateMipmapsBlock();
}
/**
 * Registers all core (root-level) node render graph blocks for deserialization.
 */
export function RegisterNodeRenderGraphCoreBlocks() {
    RegisterComputeShaderBlock();
    RegisterCullObjectsBlock();
    RegisterFrameGraphNodeBlocksElbowBlock();
    RegisterExecuteBlock();
    RegisterFrameGraphNodeBlocksInputBlock();
    RegisterLightingVolumeBlock();
    RegisterOutputBlock();
    RegisterResourceContainerBlock();
}
let _Registered = false;
/**
 * Registers all node render graph blocks for deserialization.
 * Call this function when you need to deserialize node render graphs from JSON/snippets.
 *
 * This is the tree-shakeable replacement for:
 * ```ts
 * import "@babylonjs/core/FrameGraph/Node/Blocks/index.js";
 * ```
 */
export function RegisterAllNodeRenderGraphBlocks() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    RegisterNodeRenderGraphLayersBlocks();
    RegisterNodeRenderGraphPostProcessesBlocks();
    RegisterNodeRenderGraphRenderingBlocks();
    RegisterNodeRenderGraphTeleportBlocks();
    RegisterNodeRenderGraphTexturesBlocks();
    RegisterNodeRenderGraphCoreBlocks();
}
//# sourceMappingURL=allBlocks.pure.js.map