/** This file must only contain pure code and pure imports */
/** @internal */
export type OcclusionQuery = WebGLQuery | number;
/** @internal */
export declare class _OcclusionDataStorage {
    /** @internal */
    occlusionInternalRetryCounter: number;
    /** @internal */
    isOcclusionQueryInProgress: boolean;
    /** @internal */
    isOccluded: boolean;
    /** @internal */
    occlusionRetryCount: number;
    /** @internal */
    occlusionType: number;
    /** @internal */
    occlusionQueryAlgorithmType: number;
    /** @internal */
    forceRenderingWhenOccluded: boolean;
    /** @internal */
    occlusionForRenderPassId: number;
}
/**
 * Register side effects for abstractEngineQuery.
 * Safe to call multiple times; only the first call has an effect.
 */
export declare function RegisterAbstractEngineQuery(): void;
