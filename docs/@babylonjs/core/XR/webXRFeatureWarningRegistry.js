let _FeaturesWithSpecificDisableWarning;
/**
 * Records that a feature used the warning-emitting intentional-disable path.
 * @param feature the feature that reported its intentional disable
 * @internal
 */
export function _MarkWebXRFeatureWithSpecificDisableWarning(feature) {
    (_FeaturesWithSpecificDisableWarning ?? (_FeaturesWithSpecificDisableWarning = new WeakSet())).add(feature);
}
/**
 * Clears and returns whether a feature used the warning-emitting intentional-disable path.
 * @param feature the feature to query
 * @returns whether the feature reported its intentional disable since the previous query
 * @internal
 */
export function _ConsumeWebXRFeatureSpecificDisableWarning(feature) {
    return _FeaturesWithSpecificDisableWarning?.delete(feature) ?? false;
}
//# sourceMappingURL=webXRFeatureWarningRegistry.js.map