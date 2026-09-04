/**
 * Creates the local position data for the particle
 * @param particle The particle to update
 */
export function _CreateLocalPositionData(particle) {
    if (!particle._properties.localPosition) {
        particle._properties.localPosition = particle.position.clone();
    }
    else {
        particle._properties.localPosition.copyFrom(particle.position);
    }
}
//# sourceMappingURL=emitters.functions.js.map