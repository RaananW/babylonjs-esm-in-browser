import { CastingResult } from "./castingResult.js";
/**
 * Class representing a contact point produced in a shape cast
 */
export declare class ShapeCastResult extends CastingResult {
    private _hitFraction;
    /**
     * Gets the hit fraction along the casting ray
     */
    get hitFraction(): number;
    /**
     * Sets the hit fraction along the casting ray
     * @param fraction
     */
    setHitFraction(fraction: number): void;
    /**
     * Resets all the values to default
     */
    reset(): void;
}
