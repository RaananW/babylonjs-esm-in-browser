import { type Scene } from "../../../../scene.js";
import { type Vector3 } from "../../../../Maths/math.vector.js";
import { type SystemBlock } from "../systemBlock.js";
import { type ParticleSystem } from "../../../particleSystem.js";
/**
 * @internal
 * Tools for managing particle triggers and sub-emitter systems.
 */
export declare function _TriggerSubEmitter(template: SystemBlock, scene: Scene, location: Vector3): ParticleSystem;
