import { CastingResult } from "./castingResult.js";
/**
 * Class representing a contact point produced in a shape cast
 */
export class ShapeCastResult extends CastingResult {
    constructor() {
        super(...arguments);
        this._hitFraction = 0;
    }
    /**
     * Gets the hit fraction along the casting ray
     */
    get hitFraction() {
        return this._hitFraction;
    }
    /**
     * Sets the hit fraction along the casting ray
     * @param fraction
     */
    setHitFraction(fraction) {
        this._hitFraction = fraction;
    }
    /**
     * Resets all the values to default
     */
    reset() {
        super.reset();
        this._hitFraction = 0;
    }
}
//# sourceMappingURL=shapeCastResult.js.map