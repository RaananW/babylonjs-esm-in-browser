import { type IWebXRFeature } from "./webXRFeaturesManager.js";
/**
 * Records that a feature used the warning-emitting intentional-disable path.
 * @param feature the feature that reported its intentional disable
 * @internal
 */
export declare function _MarkWebXRFeatureWithSpecificDisableWarning(feature: IWebXRFeature): void;
/**
 * Clears and returns whether a feature used the warning-emitting intentional-disable path.
 * @param feature the feature to query
 * @returns whether the feature reported its intentional disable since the previous query
 * @internal
 */
export declare function _ConsumeWebXRFeatureSpecificDisableWarning(feature: IWebXRFeature): boolean;
