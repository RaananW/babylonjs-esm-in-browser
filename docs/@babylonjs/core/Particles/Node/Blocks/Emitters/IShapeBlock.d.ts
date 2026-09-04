import { type NodeParticleConnectionPoint } from "../../nodeParticleBlockConnectionPoint.js";
/**
 * Interface for shape blocks in the particle system.
 */
export interface IShapeBlock {
    /**
     * Gets the particle component
     */
    particle: NodeParticleConnectionPoint;
    /**
     * Gets the output component
     */
    output: NodeParticleConnectionPoint;
}
