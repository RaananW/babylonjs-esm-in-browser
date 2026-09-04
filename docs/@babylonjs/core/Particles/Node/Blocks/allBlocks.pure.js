// Conditions blocks
import { RegisterParticleConditionBlock } from "./Conditions/particleConditionBlock.pure.js";
// Emitters blocks
import { RegisterBoxShapeBlock } from "./Emitters/boxShapeBlock.pure.js";
import { RegisterConeShapeBlock } from "./Emitters/coneShapeBlock.pure.js";
import { RegisterCreateParticleBlock } from "./Emitters/createParticleBlock.pure.js";
import { RegisterCustomShapeBlock } from "./Emitters/customShapeBlock.pure.js";
import { RegisterCylinderShapeBlock } from "./Emitters/cylinderShapeBlock.pure.js";
import { RegisterMeshShapeBlock } from "./Emitters/meshShapeBlock.pure.js";
import { RegisterPointShapeBlock } from "./Emitters/pointShapeBlock.pure.js";
import { RegisterSetupSpriteSheetBlock } from "./Emitters/setupSpriteSheetBlock.pure.js";
import { RegisterSphereShapeBlock } from "./Emitters/sphereShapeBlock.pure.js";
// Teleport blocks
import { RegisterParticleTeleportInBlock } from "./Teleport/particleTeleportInBlock.pure.js";
import { RegisterParticleTeleportOutBlock } from "./Teleport/particleTeleportOutBlock.pure.js";
// Triggers blocks
import { RegisterParticleTriggerBlock } from "./Triggers/particleTriggerBlock.pure.js";
// Update blocks
import { RegisterAlignAngleBlock } from "./Update/alignAngleBlock.pure.js";
import { RegisterBasicColorUpdateBlock } from "./Update/basicColorUpdateBlock.pure.js";
import { RegisterBasicPositionUpdateBlock } from "./Update/basicPositionUpdateBlock.pure.js";
import { RegisterBasicSpriteUpdateBlock } from "./Update/basicSpriteUpdateBlock.pure.js";
import { RegisterUpdateAgeBlock } from "./Update/updateAgeBlock.pure.js";
import { RegisterUpdateAngleBlock } from "./Update/updateAngleBlock.pure.js";
import { RegisterUpdateAttractorBlock } from "./Update/updateAttractorBlock.pure.js";
import { RegisterUpdateColorBlock } from "./Update/updateColorBlock.pure.js";
import { RegisterUpdateDirectionBlock } from "./Update/updateDirectionBlock.pure.js";
import { RegisterUpdateFlowMapBlock } from "./Update/updateFlowMapBlock.pure.js";
import { RegisterUpdateNoiseBlock } from "./Update/updateNoiseBlock.pure.js";
import { RegisterUpdatePositionBlock } from "./Update/updatePositionBlock.pure.js";
import { RegisterUpdateScaleBlock } from "./Update/updateScaleBlock.pure.js";
import { RegisterUpdateSizeBlock } from "./Update/updateSizeBlock.pure.js";
import { RegisterUpdateSpriteCellIndexBlock } from "./Update/updateSpriteCellIndexBlock.pure.js";
// Root-level blocks
import { RegisterParticleClampBlock } from "./particleClampBlock.pure.js";
import { RegisterParticleConverterBlock } from "./particleConverterBlock.pure.js";
import { RegisterParticleDebugBlock } from "./particleDebugBlock.pure.js";
import { RegisterParticleElbowBlock } from "./particleElbowBlock.pure.js";
import { RegisterParticleFloatToIntBlock } from "./particleFloatToIntBlock.pure.js";
import { RegisterParticleGradientBlock } from "./particleGradientBlock.pure.js";
import { RegisterParticleGradientValueBlock } from "./particleGradientValueBlock.pure.js";
import { RegisterParticleInputBlock } from "./particleInputBlock.pure.js";
import { RegisterParticleLerpBlock } from "./particleLerpBlock.pure.js";
import { RegisterParticleLocalVariableBlock } from "./particleLocalVariableBlock.pure.js";
import { RegisterParticleMathBlock } from "./particleMathBlock.pure.js";
import { RegisterParticleNLerpBlock } from "./particleNLerpBlock.pure.js";
import { RegisterParticleNumberMathBlock } from "./particleNumberMathBlock.pure.js";
import { RegisterParticleRandomBlock } from "./particleRandomBlock.pure.js";
import { RegisterParticleSmoothStepBlock } from "./particleSmoothStepBlock.pure.js";
import { RegisterParticleSourceTextureBlock } from "./particleSourceTextureBlock.pure.js";
import { RegisterParticleStepBlock } from "./particleStepBlock.pure.js";
import { RegisterParticleTrigonometryBlock } from "./particleTrigonometryBlock.pure.js";
import { RegisterParticleVectorLengthBlock } from "./particleVectorLengthBlock.pure.js";
import { RegisterParticleVectorMathBlock } from "./particleVectorMathBlock.pure.js";
import { RegisterSystemBlock } from "./systemBlock.pure.js";
/**
 * Registers all condition node particle blocks for deserialization.
 */
export function RegisterNodeParticleConditionsBlocks() {
    RegisterParticleConditionBlock();
}
/**
 * Registers all emitter node particle blocks for deserialization.
 */
export function RegisterNodeParticleEmittersBlocks() {
    RegisterBoxShapeBlock();
    RegisterConeShapeBlock();
    RegisterCreateParticleBlock();
    RegisterCustomShapeBlock();
    RegisterCylinderShapeBlock();
    RegisterMeshShapeBlock();
    RegisterPointShapeBlock();
    RegisterSetupSpriteSheetBlock();
    RegisterSphereShapeBlock();
}
/**
 * Registers all teleport node particle blocks for deserialization.
 */
export function RegisterNodeParticleTeleportBlocks() {
    RegisterParticleTeleportInBlock();
    RegisterParticleTeleportOutBlock();
}
/**
 * Registers all trigger node particle blocks for deserialization.
 */
export function RegisterNodeParticleTriggersBlocks() {
    RegisterParticleTriggerBlock();
}
/**
 * Registers all update node particle blocks for deserialization.
 */
export function RegisterNodeParticleUpdateBlocks() {
    RegisterAlignAngleBlock();
    RegisterBasicColorUpdateBlock();
    RegisterBasicPositionUpdateBlock();
    RegisterBasicSpriteUpdateBlock();
    RegisterUpdateAgeBlock();
    RegisterUpdateAngleBlock();
    RegisterUpdateAttractorBlock();
    RegisterUpdateColorBlock();
    RegisterUpdateDirectionBlock();
    RegisterUpdateFlowMapBlock();
    RegisterUpdateNoiseBlock();
    RegisterUpdatePositionBlock();
    RegisterUpdateScaleBlock();
    RegisterUpdateSizeBlock();
    RegisterUpdateSpriteCellIndexBlock();
}
/**
 * Registers all root-level (math/utility) node particle blocks for deserialization.
 */
export function RegisterNodeParticleMathBlocks() {
    RegisterParticleClampBlock();
    RegisterParticleConverterBlock();
    RegisterParticleDebugBlock();
    RegisterParticleElbowBlock();
    RegisterParticleFloatToIntBlock();
    RegisterParticleGradientBlock();
    RegisterParticleGradientValueBlock();
    RegisterParticleInputBlock();
    RegisterParticleLerpBlock();
    RegisterParticleLocalVariableBlock();
    RegisterParticleMathBlock();
    RegisterParticleNLerpBlock();
    RegisterParticleNumberMathBlock();
    RegisterParticleRandomBlock();
    RegisterParticleSmoothStepBlock();
    RegisterParticleSourceTextureBlock();
    RegisterParticleStepBlock();
    RegisterParticleTrigonometryBlock();
    RegisterParticleVectorLengthBlock();
    RegisterParticleVectorMathBlock();
    RegisterSystemBlock();
}
let _Registered = false;
/**
 * Registers all node particle blocks for deserialization.
 * Call this function when you need to deserialize node particle systems from JSON/snippets.
 *
 * This is the tree-shakeable replacement for:
 * ```ts
 * import "@babylonjs/core/Particles/Node/Blocks/index.js";
 * ```
 */
export function RegisterAllNodeParticleBlocks() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    RegisterNodeParticleConditionsBlocks();
    RegisterNodeParticleEmittersBlocks();
    RegisterNodeParticleTeleportBlocks();
    RegisterNodeParticleTriggersBlocks();
    RegisterNodeParticleUpdateBlocks();
    RegisterNodeParticleMathBlocks();
}
//# sourceMappingURL=allBlocks.pure.js.map