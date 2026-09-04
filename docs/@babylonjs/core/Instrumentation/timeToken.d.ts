import { type Nullable } from "../types.js";
/**
 * @internal
 **/
export declare class _TimeToken {
    _startTimeQuery: Nullable<WebGLQuery>;
    _endTimeQuery: Nullable<WebGLQuery>;
    _timeElapsedQuery: Nullable<WebGLQuery>;
    _timeElapsedQueryEnded: boolean;
}
