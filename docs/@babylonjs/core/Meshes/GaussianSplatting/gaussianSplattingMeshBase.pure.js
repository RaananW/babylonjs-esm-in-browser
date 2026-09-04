/** This file must only contain pure code and pure imports */
import { SubMesh } from "../subMesh.pure.js";
import { Mesh } from "../mesh.pure.js";
import { VertexData } from "../mesh.vertexData.js";
import { Matrix, TmpVectors, Vector2, Vector3 } from "../../Maths/math.vector.pure.js";
import { Logger } from "../../Misc/logger.js";
import { Observable } from "../../Misc/observable.js";
import { GaussianSplattingMaterial } from "../../Materials/GaussianSplatting/gaussianSplattingMaterial.pure.js";
import { RawTexture } from "../../Materials/Textures/rawTexture.js";
import { MultiRenderTarget } from "../../Materials/Textures/multiRenderTarget.pure.js";
import { Color4 } from "../../Maths/math.color.pure.js";

import { FromHalfFloat, ToHalfFloat } from "../../Misc/textureTools.js";
import { Scalar } from "../../Maths/math.scalar.js";
import { runCoroutineSync, runCoroutineAsync, createYieldingScheduler } from "../../Misc/coroutine.js";
import { EngineStore } from "../../Engines/engineStore.js";
import { ImportMeshAsync } from "../../Loading/sceneLoader.js";
import { GaussianSplattingSortWorker, GaussianSplattingSortWorkerCommand } from "./gaussianSplattingSortWorker.js";
const IsNative = typeof _native !== "undefined";
const Native = IsNative ? _native : null;
// @internal
const UnpackUnorm = (value, bits) => {
    const t = (1 << bits) - 1;
    return (value & t) / t;
};
// @internal
const Unpack111011 = (value, result) => {
    result.x = UnpackUnorm(value >>> 21, 11);
    result.y = UnpackUnorm(value >>> 11, 10);
    result.z = UnpackUnorm(value, 11);
};
// @internal
const Unpack8888 = (value, result) => {
    result[0] = UnpackUnorm(value >>> 24, 8) * 255;
    result[1] = UnpackUnorm(value >>> 16, 8) * 255;
    result[2] = UnpackUnorm(value >>> 8, 8) * 255;
    result[3] = UnpackUnorm(value, 8) * 255;
};
// @internal
// unpack quaternion with 2,10,10,10 format (largest element, 3x10bit element)
const UnpackRot = (value, result) => {
    const norm = 1.0 / (Math.sqrt(2) * 0.5);
    const a = (UnpackUnorm(value >>> 20, 10) - 0.5) * norm;
    const b = (UnpackUnorm(value >>> 10, 10) - 0.5) * norm;
    const c = (UnpackUnorm(value, 10) - 0.5) * norm;
    const m = Math.sqrt(1.0 - (a * a + b * b + c * c));
    switch (value >>> 30) {
        case 0:
            result.set(m, a, b, c);
            break;
        case 1:
            result.set(a, m, b, c);
            break;
        case 2:
            result.set(a, b, m, c);
            break;
        case 3:
            result.set(a, b, c, m);
            break;
    }
};
/**
 * Representation of the types
 */
var PLYType;
(function (PLYType) {
    PLYType[PLYType["FLOAT"] = 0] = "FLOAT";
    PLYType[PLYType["INT"] = 1] = "INT";
    PLYType[PLYType["UINT"] = 2] = "UINT";
    PLYType[PLYType["DOUBLE"] = 3] = "DOUBLE";
    PLYType[PLYType["UCHAR"] = 4] = "UCHAR";
    PLYType[PLYType["USHORT"] = 5] = "USHORT";
    PLYType[PLYType["UNDEFINED"] = 6] = "UNDEFINED";
})(PLYType || (PLYType = {}));
/**
 * Usage types of the PLY values
 */
var PLYValue;
(function (PLYValue) {
    PLYValue[PLYValue["MIN_X"] = 0] = "MIN_X";
    PLYValue[PLYValue["MIN_Y"] = 1] = "MIN_Y";
    PLYValue[PLYValue["MIN_Z"] = 2] = "MIN_Z";
    PLYValue[PLYValue["MAX_X"] = 3] = "MAX_X";
    PLYValue[PLYValue["MAX_Y"] = 4] = "MAX_Y";
    PLYValue[PLYValue["MAX_Z"] = 5] = "MAX_Z";
    PLYValue[PLYValue["MIN_SCALE_X"] = 6] = "MIN_SCALE_X";
    PLYValue[PLYValue["MIN_SCALE_Y"] = 7] = "MIN_SCALE_Y";
    PLYValue[PLYValue["MIN_SCALE_Z"] = 8] = "MIN_SCALE_Z";
    PLYValue[PLYValue["MAX_SCALE_X"] = 9] = "MAX_SCALE_X";
    PLYValue[PLYValue["MAX_SCALE_Y"] = 10] = "MAX_SCALE_Y";
    PLYValue[PLYValue["MAX_SCALE_Z"] = 11] = "MAX_SCALE_Z";
    PLYValue[PLYValue["PACKED_POSITION"] = 12] = "PACKED_POSITION";
    PLYValue[PLYValue["PACKED_ROTATION"] = 13] = "PACKED_ROTATION";
    PLYValue[PLYValue["PACKED_SCALE"] = 14] = "PACKED_SCALE";
    PLYValue[PLYValue["PACKED_COLOR"] = 15] = "PACKED_COLOR";
    PLYValue[PLYValue["X"] = 16] = "X";
    PLYValue[PLYValue["Y"] = 17] = "Y";
    PLYValue[PLYValue["Z"] = 18] = "Z";
    PLYValue[PLYValue["SCALE_0"] = 19] = "SCALE_0";
    PLYValue[PLYValue["SCALE_1"] = 20] = "SCALE_1";
    PLYValue[PLYValue["SCALE_2"] = 21] = "SCALE_2";
    PLYValue[PLYValue["DIFFUSE_RED"] = 22] = "DIFFUSE_RED";
    PLYValue[PLYValue["DIFFUSE_GREEN"] = 23] = "DIFFUSE_GREEN";
    PLYValue[PLYValue["DIFFUSE_BLUE"] = 24] = "DIFFUSE_BLUE";
    PLYValue[PLYValue["OPACITY"] = 25] = "OPACITY";
    PLYValue[PLYValue["F_DC_0"] = 26] = "F_DC_0";
    PLYValue[PLYValue["F_DC_1"] = 27] = "F_DC_1";
    PLYValue[PLYValue["F_DC_2"] = 28] = "F_DC_2";
    PLYValue[PLYValue["F_DC_3"] = 29] = "F_DC_3";
    PLYValue[PLYValue["ROT_0"] = 30] = "ROT_0";
    PLYValue[PLYValue["ROT_1"] = 31] = "ROT_1";
    PLYValue[PLYValue["ROT_2"] = 32] = "ROT_2";
    PLYValue[PLYValue["ROT_3"] = 33] = "ROT_3";
    PLYValue[PLYValue["MIN_COLOR_R"] = 34] = "MIN_COLOR_R";
    PLYValue[PLYValue["MIN_COLOR_G"] = 35] = "MIN_COLOR_G";
    PLYValue[PLYValue["MIN_COLOR_B"] = 36] = "MIN_COLOR_B";
    PLYValue[PLYValue["MAX_COLOR_R"] = 37] = "MAX_COLOR_R";
    PLYValue[PLYValue["MAX_COLOR_G"] = 38] = "MAX_COLOR_G";
    PLYValue[PLYValue["MAX_COLOR_B"] = 39] = "MAX_COLOR_B";
    PLYValue[PLYValue["SH_0"] = 40] = "SH_0";
    PLYValue[PLYValue["SH_1"] = 41] = "SH_1";
    PLYValue[PLYValue["SH_2"] = 42] = "SH_2";
    PLYValue[PLYValue["SH_3"] = 43] = "SH_3";
    PLYValue[PLYValue["SH_4"] = 44] = "SH_4";
    PLYValue[PLYValue["SH_5"] = 45] = "SH_5";
    PLYValue[PLYValue["SH_6"] = 46] = "SH_6";
    PLYValue[PLYValue["SH_7"] = 47] = "SH_7";
    PLYValue[PLYValue["SH_8"] = 48] = "SH_8";
    PLYValue[PLYValue["SH_9"] = 49] = "SH_9";
    PLYValue[PLYValue["SH_10"] = 50] = "SH_10";
    PLYValue[PLYValue["SH_11"] = 51] = "SH_11";
    PLYValue[PLYValue["SH_12"] = 52] = "SH_12";
    PLYValue[PLYValue["SH_13"] = 53] = "SH_13";
    PLYValue[PLYValue["SH_14"] = 54] = "SH_14";
    PLYValue[PLYValue["SH_15"] = 55] = "SH_15";
    PLYValue[PLYValue["SH_16"] = 56] = "SH_16";
    PLYValue[PLYValue["SH_17"] = 57] = "SH_17";
    PLYValue[PLYValue["SH_18"] = 58] = "SH_18";
    PLYValue[PLYValue["SH_19"] = 59] = "SH_19";
    PLYValue[PLYValue["SH_20"] = 60] = "SH_20";
    PLYValue[PLYValue["SH_21"] = 61] = "SH_21";
    PLYValue[PLYValue["SH_22"] = 62] = "SH_22";
    PLYValue[PLYValue["SH_23"] = 63] = "SH_23";
    PLYValue[PLYValue["SH_24"] = 64] = "SH_24";
    PLYValue[PLYValue["SH_25"] = 65] = "SH_25";
    PLYValue[PLYValue["SH_26"] = 66] = "SH_26";
    PLYValue[PLYValue["SH_27"] = 67] = "SH_27";
    PLYValue[PLYValue["SH_28"] = 68] = "SH_28";
    PLYValue[PLYValue["SH_29"] = 69] = "SH_29";
    PLYValue[PLYValue["SH_30"] = 70] = "SH_30";
    PLYValue[PLYValue["SH_31"] = 71] = "SH_31";
    PLYValue[PLYValue["SH_32"] = 72] = "SH_32";
    PLYValue[PLYValue["SH_33"] = 73] = "SH_33";
    PLYValue[PLYValue["SH_34"] = 74] = "SH_34";
    PLYValue[PLYValue["SH_35"] = 75] = "SH_35";
    PLYValue[PLYValue["SH_36"] = 76] = "SH_36";
    PLYValue[PLYValue["SH_37"] = 77] = "SH_37";
    PLYValue[PLYValue["SH_38"] = 78] = "SH_38";
    PLYValue[PLYValue["SH_39"] = 79] = "SH_39";
    PLYValue[PLYValue["SH_40"] = 80] = "SH_40";
    PLYValue[PLYValue["SH_41"] = 81] = "SH_41";
    PLYValue[PLYValue["SH_42"] = 82] = "SH_42";
    PLYValue[PLYValue["SH_43"] = 83] = "SH_43";
    PLYValue[PLYValue["SH_44"] = 84] = "SH_44";
    PLYValue[PLYValue["SH_45"] = 85] = "SH_45";
    PLYValue[PLYValue["SH_46"] = 86] = "SH_46";
    PLYValue[PLYValue["SH_47"] = 87] = "SH_47";
    PLYValue[PLYValue["SH_48"] = 88] = "SH_48";
    PLYValue[PLYValue["SH_49"] = 89] = "SH_49";
    PLYValue[PLYValue["SH_50"] = 90] = "SH_50";
    PLYValue[PLYValue["SH_51"] = 91] = "SH_51";
    PLYValue[PLYValue["SH_52"] = 92] = "SH_52";
    PLYValue[PLYValue["SH_53"] = 93] = "SH_53";
    PLYValue[PLYValue["SH_54"] = 94] = "SH_54";
    PLYValue[PLYValue["SH_55"] = 95] = "SH_55";
    PLYValue[PLYValue["SH_56"] = 96] = "SH_56";
    PLYValue[PLYValue["SH_57"] = 97] = "SH_57";
    PLYValue[PLYValue["SH_58"] = 98] = "SH_58";
    PLYValue[PLYValue["SH_59"] = 99] = "SH_59";
    PLYValue[PLYValue["SH_60"] = 100] = "SH_60";
    PLYValue[PLYValue["SH_61"] = 101] = "SH_61";
    PLYValue[PLYValue["SH_62"] = 102] = "SH_62";
    PLYValue[PLYValue["SH_63"] = 103] = "SH_63";
    PLYValue[PLYValue["SH_64"] = 104] = "SH_64";
    PLYValue[PLYValue["SH_65"] = 105] = "SH_65";
    PLYValue[PLYValue["SH_66"] = 106] = "SH_66";
    PLYValue[PLYValue["SH_67"] = 107] = "SH_67";
    PLYValue[PLYValue["SH_68"] = 108] = "SH_68";
    PLYValue[PLYValue["SH_69"] = 109] = "SH_69";
    PLYValue[PLYValue["SH_70"] = 110] = "SH_70";
    PLYValue[PLYValue["SH_71"] = 111] = "SH_71";
    PLYValue[PLYValue["UNDEFINED"] = 112] = "UNDEFINED";
})(PLYValue || (PLYValue = {}));
function _AcquireGsInterFrameYield(engine) {
    // Browser-only optimization: wraps the global requestAnimationFrame, which
    // doesn't exist on Babylon Native. Skip it there so the engine uses its
    // default frame scheduling.
    if (IsNative) {
        return;
    }
    const existing = engine.customAnimationFrameRequester;
    if (existing?._gsInterFrameYield) {
        existing._refCount++;
        return;
    }
    if (existing) {
        // Slot is owned by another requester. Don't interfere.
        return;
    }
    let _timeoutId = 0;
    let _innerRafId = 0;
    const wrapper = {
        _gsInterFrameYield: true,
        _refCount: 1,
        requestAnimationFrame: (callback) => {
            // Insert a setTimeout(0) to yield to the regular task queue (worker
            // postMessage results, input events) before scheduling the next animation
            // frame. Without this, a continuous rAF loop at high refresh rates leaves
            // almost no time for regular tasks, starving worker messages for hundreds of ms.
            _timeoutId = setTimeout(() => {
                _innerRafId = requestAnimationFrame(callback);
            }, 0);
            return _timeoutId;
        },
        cancelAnimationFrame: (_id) => {
            clearTimeout(_timeoutId);
            if (_innerRafId > 0) {
                cancelAnimationFrame(_innerRafId);
            }
            _timeoutId = 0;
            _innerRafId = 0;
        },
    };
    engine.customAnimationFrameRequester = wrapper;
}
// Counterpart to _AcquireGsInterFrameYield. Call once per mesh on dispose.
function _ReleaseGsInterFrameYield(engine) {
    const existing = engine.customAnimationFrameRequester;
    if (!existing?._gsInterFrameYield) {
        return;
    }
    existing._refCount--;
    if (existing._refCount === 0) {
        engine.customAnimationFrameRequester = null;
    }
}
/**
 * Base class for Gaussian Splatting meshes. Contains all single-cloud rendering logic.
 * @internal Use GaussianSplattingMesh instead; this class is an internal implementation detail.
 */
export class GaussianSplattingMeshBase extends Mesh {
    /**
     * Returns a byte-accurate view for retained splat data, preserving any non-zero byte offset.
     * @param data The retained splat source bytes.
     * @returns A Uint8Array covering the exact source byte range.
     * @internal
     */
    static _GetSplatDataBytes(data) {
        return ArrayBuffer.isView(data) ? new Uint8Array(data.buffer, data.byteOffset, data.byteLength) : new Uint8Array(data);
    }
    /**
     * Returns a Float32 reinterpretation for retained splat data, copying only when alignment requires it.
     * @param data The retained splat source bytes.
     * @returns A Float32Array over the exact source byte range.
     * @internal
     */
    static _GetSplatDataFloats(data) {
        const bytes = GaussianSplattingMeshBase._GetSplatDataBytes(data);
        const floatSize = Float32Array.BYTES_PER_ELEMENT;
        if (bytes.byteLength % floatSize !== 0) {
            throw new Error(`Gaussian splat data byte length (${bytes.byteLength}) is not divisible by ${floatSize} and cannot be reinterpreted as Float32 data.`);
        }
        if (bytes.byteOffset % floatSize !== 0) {
            const copy = new Uint8Array(bytes.byteLength);
            copy.set(bytes);
            return new Float32Array(copy.buffer, 0, bytes.byteLength / floatSize);
        }
        return new Float32Array(bytes.buffer, bytes.byteOffset, bytes.byteLength / floatSize);
    }
    static _BuildSplatRangeData(ranges, vertexCount) {
        if (ranges === null) {
            return { ranges: null, count: vertexCount, key: "" };
        }
        const rangePairs = [];
        let totalCount = 0;
        let key = "";
        for (const range of ranges) {
            const start = Math.max(0, Math.floor(range.offset));
            const count = Math.max(0, Math.floor(range.count));
            const end = Math.min(vertexCount, start + count);
            const rangeCount = Math.max(0, end - start);
            if (rangeCount === 0) {
                continue;
            }
            rangePairs.push(start, rangeCount);
            totalCount += rangeCount;
            key += `${start}:${rangeCount};`;
        }
        return { ranges: new Uint32Array(rangePairs), count: totalCount, key };
    }
    /**
     * If true, disables depth sorting of the splats (default: false)
     */
    get disableDepthSort() {
        return this._disableDepthSort;
    }
    set disableDepthSort(value) {
        if (!this._disableDepthSort && value) {
            this._worker?.terminate();
            this._worker = null;
            this._disableDepthSort = true;
        }
        else if (this._disableDepthSort && !value) {
            this._disableDepthSort = false;
            this._sortIsDirty = true;
            this._instantiateWorker();
        }
    }
    /**
     * View direction factor used to compute the SH view direction in the shader.
     * @deprecated Not used anymore for SH rendering
     */
    get viewDirectionFactor() {
        return Vector3.OneReadOnly;
    }
    /**
     * SH degree. 0 = no sh (default). 1 = 3 parameters. 2 = 8 parameters. 3 = 15 parameters.
     * Value is clamped between 0 and the maximum degree available from loaded data.
     */
    get shDegree() {
        return this._shDegree;
    }
    set shDegree(value) {
        const maxDegree = this._maxShDegree;
        const clamped = Math.max(0, Math.min(Math.round(value), maxDegree));
        if (this._shDegree === clamped) {
            return;
        }
        this._shDegree = clamped;
        this.material?.resetDrawCache();
    }
    /**
     * Maximum SH degree available from the loaded data.
     */
    get maxShDegree() {
        return this._maxShDegree;
    }
    /**
     * Number of splats in the mesh
     */
    get splatCount() {
        return this._splatIndex?.length;
    }
    /**
     * Number of source splats currently selected for rendering.
     * When no range filter is active, this is the mesh's full source splat count.
     */
    get renderedSplatCount() {
        return this._activeSplatRanges ? this._activeSplatRenderCount : this._vertexCount;
    }
    /**
     * Restricts rendering to the provided source splat ranges.
     * Passing `null` clears the range filter and renders the full source splat set.
     * @param ranges contiguous source ranges to render, or null to render all splats
     */
    setSplatIndexRanges(ranges) {
        this._setSplatIndexRanges(ranges);
    }
    _setSplatIndexRanges(ranges) {
        const rangeData = GaussianSplattingMeshBase._BuildSplatRangeData(ranges, this._vertexCount);
        const isSameRangeSet = this._activeSplatRanges === null ? rangeData.ranges === null : rangeData.ranges !== null && this._activeSplatRangeKey === rangeData.key;
        if (isSameRangeSet) {
            return;
        }
        this._activeSplatRanges = rangeData.ranges;
        this._activeSplatRangeKey = rangeData.key;
        this._activeSplatRenderCount = rangeData.count;
        this._activeRangeVersion++;
        this._postIntervalsToWorker();
        if (this._worker) {
            // Defer swapping the rendered index buffer until the worker returns a depth sort computed for
            // this exact range set (see the worker `onmessage` handler). Until then we keep rendering the
            // previous fully-sorted state, so a range/LOD change never shows an unsorted flash nor a stale
            // index buffer (rendering indices that belong to a different active set, which caused the
            // disappear/reappear flicker). Only the worker's depth buffer is resized here so the next sort
            // produces the right number of entries.
            this._ensureDepthMixSize(Math.max((this._activeSplatRenderCount + 15) & ~0xf, 16));
            this._sortIsDirty = true;
            this._postToWorker(true);
        }
        else {
            // Synchronous sort paths (disabled depth sort / Native): swap the index buffer immediately.
            this._updateSplatIndexBuffer(this._vertexCount);
            this._postToWorker(true);
        }
    }
    /**
     * Whether the depth sort is settled: a sort computed for the current active ranges and camera has been
     * applied to the rendered index buffer, and no further sort is pending or in flight. For a static camera
     * and a fixed active set this becomes true once the final sort completes. Used by streaming subclasses to
     * detect when rendering is fully up to date (e.g. for deterministic screenshots) and by IBL shadows to
     * avoid voxelizing against an index buffer the worker has not finished (re)building yet.
     * @internal
     */
    get _isDepthSortSettled() {
        return this._readyToDisplay && !this._sortIsDirty && this._canPostToWorker;
    }
    // (Re)allocates the worker depth buffer to the given padded size. A fresh array is allocated when the
    // size differs or the current buffer is detached (in-flight in the worker), so a queued sort can be
    // re-posted with a correctly-sized buffer without disturbing the in-flight one.
    _ensureDepthMixSize(paddedCount) {
        if (IsNative) {
            return;
        }
        if (!this._depthMix || this._depthMix.length !== paddedCount || this._depthMix.buffer.byteLength === 0) {
            this._depthMix = new BigInt64Array(paddedCount);
        }
    }
    /**
     * Sends the active source-splat intervals to the sort worker. When no range filter is active,
     * a single interval covering all source splats is sent so the worker never assumes the full set.
     */
    _postIntervalsToWorker() {
        if (!this._worker) {
            return;
        }
        const intervals = this._activeSplatRanges ? new Uint32Array(this._activeSplatRanges) : new Uint32Array([0, this._vertexCount]);
        this._worker.postMessage({ command: GaussianSplattingSortWorkerCommand.INTERVALS, intervals }, [intervals.buffer]);
    }
    /**
     * Initializes this mesh to render from an externally-provided, GPU-decoded work buffer, bypassing the
     * CPU `updateData` path. The four textures must hold the standard decoded GS layout addressed by linear
     * splat index over a square texture: centers (x,y,z,1), covariance A (Sigma00,01,02,11) and B
     * (Sigma12,22,*,*) as full covariance (so `center.w` is 1), and RGBA color. `splatPositions` are the
     * stride-4 CPU centers consumed by the depth-sort worker.
     * @param centers centers texture
     * @param covariancesA covariance A texture
     * @param covariancesB covariance B texture
     * @param colors color texture
     * @param splatPositions stride-4 CPU centers for depth sorting (length vertexCount*4)
     * @param vertexCount number of splats addressable in the work buffer
     * @param shTextures optional baked higher-order SH textures (packed-u32) produced by the work buffer's SH decode.
     *   When provided, the draw path lights the decoded splats with view-dependent SH (the non-SOG `shTexture0..N`
     *   path). `shDegree` sets both the max and active SH degree.
     * @param shDegree SH degree of the baked SH textures (0 = none). Ignored when `shTextures` is empty/omitted.
     * @param rotationTextures optional decoded rotation/scale textures ([rotA, rotB, rotScale]) produced by the work
     *   buffer's rotation decode. When provided, they drive the voxel-IBL rotation/scale samplers so the streamed
     *   splats participate in voxel-based IBL shadowing.
     */
    _setExternalWorkBuffer(centers, covariancesA, covariancesB, colors, splatPositions, vertexCount, shTextures, shDegree = 0, rotationTextures) {
        this._covariancesATexture = covariancesA;
        this._covariancesBTexture = covariancesB;
        this._centersTexture = centers;
        this._colorsTexture = colors;
        this._splatPositions = splatPositions;
        this._vertexCount = vertexCount;
        if (shTextures && shTextures.length) {
            this._shTextures = shTextures;
            this._maxShDegree = shDegree;
            this._shDegree = shDegree;
        }
        // Point the voxel-IBL rotation/scale samplers at the work buffer's decoded rotation textures ([rotA, rotB,
        // rotScale]) so a standalone stream can cast/receive voxel-IBL shadows.
        if (rotationTextures && rotationTextures.length >= 3) {
            this._rotationsATexture = rotationTextures[0];
            this._rotationsBTexture = rotationTextures[1];
            this._rotationScaleTexture = rotationTextures[2];
            this._needsRotationScaleTextures = true;
        }
        this._activeSplatRanges = null;
        this._activeSplatRangeKey = "";
        this._activeSplatRenderCount = 0;
        this._readyToDisplay = false;
        // Sizes _splatIndex/_depthMix, starts the sort worker, and posts positions + intervals.
        this._instantiateWorker();
        // updateData (bypassed here) normally enables the mesh; do it explicitly for the work-buffer path.
        this.setEnabled(true);
    }
    /**
     * returns the splats data array buffer that contains in order : postions (3 floats), size (3 floats), color (4 bytes), orientation quaternion (4 bytes)
     * Only available if the mesh was created with keepInRam: true
     */
    get splatsData() {
        return this._keepInRam ? this._splatsData : null;
    }
    /**
     * returns the SH data arrays
     * Only available if the mesh was created with keepInRam: true
     */
    get shData() {
        return this._keepInRam ? this._shData : null;
    }
    /**
     * Returns the min/max size range of splats in this mesh, where size is pow(|det(Σ)|, 1/6)
     * of the 3D covariance matrix — equivalent to the geometric mean of the principal radii.
     * Computed automatically during updateData(). Returns null before any data has been loaded.
     */
    get splatSizeRange() {
        if (!isFinite(this._splatSizeMin) || !isFinite(this._splatSizeMax)) {
            return null;
        }
        return { min: this._splatSizeMin, max: this._splatSizeMax };
    }
    /**
     * Gets the covariancesA texture
     */
    get covariancesATexture() {
        return this._covariancesATexture;
    }
    /**
     * Gets the covariancesB texture
     */
    get covariancesBTexture() {
        return this._covariancesBTexture;
    }
    /**
     * Gets the centers texture
     */
    get centersTexture() {
        return this._centersTexture;
    }
    /**
     * Gets the colors texture
     */
    get colorsTexture() {
        return this._colorsTexture;
    }
    /**
     * Gets the rotation matrix A texture (rotation elements m[0],m[1],m[2],m[4])
     */
    get rotationsATexture() {
        return this._rotationsATexture;
    }
    /**
     * Gets the rotation matrix B texture (rotation elements m[5],m[6],m[8],m[9])
     */
    get rotationsBTexture() {
        return this._rotationsBTexture;
    }
    /**
     * Gets the rotation scale texture (rotation element m[10] followed by scale diagonal sx,sy,sz)
     */
    get rotationScaleTexture() {
        return this._rotationScaleTexture;
    }
    /**
     * Enables or disables generation of rotation and scale matrix textures, required for voxel-based IBL shadows.
     */
    get needsRotationScaleTextures() {
        return this._needsRotationScaleTextures;
    }
    set needsRotationScaleTextures(value) {
        if (this._needsRotationScaleTextures === value) {
            return;
        }
        this._needsRotationScaleTextures = value;
        if (value && this._covariancesATexture) {
            if (this._splatsData) {
                this.updateData(this._splatsData, this._shData ?? undefined, { flipY: false }, undefined, this._shDegree);
            }
            else {
                Logger.Error("GaussianSplattingMeshBase: needsRotationScaleTextures was enabled after the mesh was already loaded, but the splat data is not kept in RAM. " +
                    "The rotation and scale matrix textures cannot be initialized. Please reload the mesh data via updateData() or construct with keepInRam=true.");
            }
        }
    }
    /**
     * Gets the SH textures
     */
    get shTextures() {
        return this._shTextures;
    }
    /**
     * True when this mesh holds raw SOG webp textures (dequantized in-shader) rather than the
     * pre-decoded covariance/center/color textures produced by the standard splat loader.
     */
    get useSog() {
        return this._useSog;
    }
    /**
     * SOG dequantization parameters paired with the raw textures.
     * Set by the splat loader when `useSogTextures: true`. Null otherwise.
     */
    get sogParams() {
        return this._sogParams;
    }
    /**
     * Install a set of raw SOG webp textures and bind the mesh to the in-shader dequantization path.
     * @param pack SOG texture pack produced by ParseSogMetaAsTextures.
     * @internal
     */
    setSogTextureData(pack) {
        this._useSog = true;
        this._sogParams?.codebookTexture?.dispose();
        this._sogParams = pack;
        this._vertexCount = pack.splatCount;
        this._shDegree = pack.shDegree ?? 0;
        this._maxShDegree = this._shDegree;
        // Stride-4 (xyz + 1) — required by the depth-sort worker and the centers texture path.
        this._splatPositions = pack.positions;
        // Reuse existing texture slots for SOG textures (the shader, under USE_SOG, samples them as RGBA8).
        this._covariancesATexture?.dispose();
        this._covariancesBTexture?.dispose();
        this._centersTexture?.dispose();
        this._colorsTexture?.dispose();
        this._rotationsATexture?.dispose();
        if (this._shTextures) {
            for (const t of this._shTextures) {
                t.dispose();
            }
        }
        this._centersTexture = pack.meansTextureL;
        this._covariancesATexture = pack.meansTextureU;
        this._covariancesBTexture = pack.scalesTexture;
        this._rotationsATexture = pack.quatsTexture;
        this._colorsTexture = pack.sh0Texture;
        const shTextures = [];
        if (pack.shCentroidsTexture) {
            shTextures.push(pack.shCentroidsTexture);
        }
        if (pack.shLabelsTexture) {
            shTextures.push(pack.shLabelsTexture);
        }
        this._shTextures = shTextures.length ? shTextures : null;
        // Force pipeline rebuild so the USE_SOG define and extra samplers are picked up.
        this._material?.resetDrawCache();
        const size = pack.meansTextureL.getSize();
        this._textureSize.x = size.width;
        this._textureSize.y = size.height;
        this._updateSplatIndexBuffer(this._vertexCount);
        this._instantiateWorker();
        // Compute bounds from the CPU-decoded positions (stride-4) so the mesh is not frustum-culled.
        const positions = pack.positions;
        const minimum = new Vector3(Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY);
        const maximum = new Vector3(Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY);
        for (let i = 0; i < this._vertexCount; i++) {
            const x = positions[i * 4 + 0];
            const y = positions[i * 4 + 1];
            const z = positions[i * 4 + 2];
            if (x < minimum.x) {
                minimum.x = x;
            }
            if (y < minimum.y) {
                minimum.y = y;
            }
            if (z < minimum.z) {
                minimum.z = z;
            }
            if (x > maximum.x) {
                maximum.x = x;
            }
            if (y > maximum.y) {
                maximum.y = y;
            }
            if (z > maximum.z) {
                maximum.z = z;
            }
        }
        this.getBoundingInfo().reConstruct(minimum, maximum, this.getWorldMatrix());
        this.setEnabled(true);
        this._sortIsDirty = true;
    }
    /**
     * Gets the kernel size
     * Documentation and mathematical explanations here:
     * https://github.com/graphdeco-inria/gaussian-splatting/issues/294#issuecomment-1772688093
     * https://github.com/autonomousvision/mip-splatting/issues/18#issuecomment-1929388931
     */
    get kernelSize() {
        return this._material instanceof GaussianSplattingMaterial ? this._material.kernelSize : 0;
    }
    /**
     * Get the compensation state
     */
    get compensation() {
        return this._material instanceof GaussianSplattingMaterial ? this._material.compensation : false;
    }
    /**
     * Minimum projected splat size, in pixels, below which a splat is discarded (0 = disabled).
     * Applied in real time; no rebuild required.
     */
    get minPixelSize() {
        return this._material instanceof GaussianSplattingMaterial ? this._material.minPixelSize : 0;
    }
    set minPixelSize(value) {
        if (this._material instanceof GaussianSplattingMaterial) {
            this._material.minPixelSize = Math.max(0, value);
        }
    }
    /**
     * set rendering material
     */
    set material(value) {
        this._material = value;
        this._material.backFaceCulling = false;
        this._material.cullBackFaces = false;
        value.resetDrawCache();
    }
    /**
     * get rendering material
     */
    get material() {
        return this._material;
    }
    static _MakeSplatGeometryForMesh(mesh) {
        const vertexData = new VertexData();
        const originPositions = [-2, -2, 0, 2, -2, 0, 2, 2, 0, -2, 2, 0];
        const originIndices = [0, 1, 2, 0, 2, 3];
        const positions = [];
        const indices = [];
        for (let i = 0; i < GaussianSplattingMeshBase._BatchSize; i++) {
            for (let j = 0; j < 12; j++) {
                if (j == 2 || j == 5 || j == 8 || j == 11) {
                    positions.push(i); // local splat index
                }
                else {
                    positions.push(originPositions[j]);
                }
            }
            indices.push(originIndices.map((v) => v + i * 4));
        }
        vertexData.positions = positions;
        vertexData.indices = indices.flat();
        vertexData.applyToMesh(mesh);
    }
    /**
     * Creates a new gaussian splatting mesh
     * @param name defines the name of the mesh
     * @param url defines the url to load from (optional)
     * @param scene defines the hosting scene (optional)
     * @param keepInRam keep datas in ram for editing purpose
     */
    constructor(name, url = null, scene = null, keepInRam = false) {
        super(name, scene);
        /**
         * Safe-orbit camera limits parsed from the source file's metadata, or `null` when the file
         * carries none. The loader also auto-applies these to an active ArcRotateCamera at load time
         * (unless `disableAutoCameraLimits` is set); this field exposes the raw values so they can be
         * applied or tracked regardless of the active camera type. See {@link ISafeOrbitCameraLimits}.
         */
        this.safeOrbitCameraLimits = null;
        /** @internal */
        this._vertexCount = 0;
        this._worker = null;
        this._modelViewProjectionMatrix = Matrix.Identity();
        this._canPostToWorker = true;
        this._readyToDisplay = false;
        this._sortRequestId = 0;
        // Incremented on every active-range change. A worker sort result is only applied when it was computed
        // for the current range version (and size), so a sort for stale ranges is never rendered.
        this._activeRangeVersion = 0;
        this._hasRenderedOnce = false;
        this._covariancesATexture = null;
        this._covariancesBTexture = null;
        this._centersTexture = null;
        this._colorsTexture = null;
        // When a streaming part is reserved, the four core data textures (centers, covA, covB, colors) are backed
        // by this MRT's attachments instead of standalone RawTextures, so a streaming engine can GPU-decode into
        // the reserved region while static parts still CPU-upload into it. Null in the normal
        // (non-streaming) path, which keeps using RawTextures unchanged.
        this._mrtAtlas = null;
        this._useMrtAtlas = false;
        // Higher-order SH atlas. When a streaming part needs baked SH, `_shTextures` become the single
        // attachments of these render-targetable integer MRTs (one per packed-u32 SH texture) so the streaming engine
        // GPU-decodes SH into the reserved region while static SH parts still CPU-upload into them. Null in the normal
        // path (SH stays plain RawTextures). One MRT per attachment keeps within WebGPU's per-sample byte budget.
        this._shMrtAtlas = null;
        this._useShMrtAtlas = false;
        this._shMrtAtlasTextureCount = 0;
        this._rotationsATexture = null;
        this._rotationsBTexture = null;
        this._rotationScaleTexture = null;
        // Rotation/scale atlas. When a streaming part needs voxel-IBL rotation/scale, the three rotation
        // textures become the attachments of this render-targetable half-float MRT so the streaming engine GPU-decodes
        // rotation/scale into the reserved region while static parts still CPU-upload into it. Null in the normal path
        // (rotation stays plain RawTextures created per-splat by `_makeSplat`).
        this._rotMrtAtlas = null;
        this._useRotMrtAtlas = false;
        this._rotationDataA = null;
        this._rotationDataB = null;
        this._rotationScaleData = null;
        this._needsRotationScaleTextures = false;
        this._splatPositions = null;
        this._splatIndex = null;
        this._shTextures = null;
        /** @internal */
        this._splatsData = null;
        /** @internal */
        this._shData = null;
        this._textureSize = new Vector2(0, 0);
        this._keepInRam = false;
        this._alwaysRetainSplatsData = false;
        this._flipY = false;
        this._delayedTextureUpdate = null;
        this._useRGBACovariants = false;
        this._useSog = false;
        this._sogParams = null;
        this._material = null;
        this._tmpCovariances = [0, 0, 0, 0, 0, 0];
        this._splatSizeMin = Infinity;
        this._splatSizeMax = -Infinity;
        this._sortIsDirty = false;
        this._activeSplatRanges = null;
        this._activeSplatRangeKey = "";
        this._activeSplatRenderCount = 0;
        // Cached bounding box for incremental addPart updates (O(1) vs O(N) scan of positions)
        this._cachedBoundingMin = null;
        this._cachedBoundingMax = null;
        /** @internal */
        this._shDegree = 0;
        this._maxShDegree = 0;
        this._cameraViewInfos = new Map();
        /** Fired after parts are added or the mesh is rebuilt following a removal. Payload is the new part count. */
        this.onPartCountChangedObservable = new Observable();
        /** Fired after part-removal validation passes but before the mesh is rebuilt.
         *  Payload is the original (pre-removal) part index. */
        this.onPartRemovedObservable = new Observable();
        /**
         * Fired just before an existing MRT-backed atlas is recreated to grow it (e.g. adding a part while a streaming
         * part exists). Payload is the OLD atlas. Streaming parts subscribe to back up their GPU-only region before it
         * is disposed. Only fires when growing an existing MRT atlas (not on first creation).
         * @internal
         */
        this._onBeforeAtlasRebuildObservable = new Observable();
        /**
         * Fired after the new (grown) MRT-backed atlas has been created and its CPU data uploaded. Payload is the NEW
         * atlas. Streaming parts subscribe to rebind to it and restore their backed-up region.
         * @internal
         */
        this._onAfterAtlasRebuildObservable = new Observable();
        /**
         * Cosine value of the angle threshold to update view dependent splat sorting. Default is 0.0001.
         */
        this.viewUpdateThreshold = GaussianSplattingMeshBase._DefaultViewUpdateThreshold;
        this._disableDepthSort = false;
        this._loadingPromise = null;
        this._updateTextureFromData = (texture, data, width, lineStart, lineCount) => {
            const engine = this._getTextureDataUpdateEngine();
            engine.updateTextureData(texture.getInternalTexture(), data, 0, lineStart, width, lineCount, 0, 0, false);
        };
        this._updateTextureFromDataRect = (texture, data, xOffset, yOffset, width, height) => {
            const engine = this._getTextureDataUpdateEngine();
            engine.updateTextureData(texture.getInternalTexture(), data, xOffset, yOffset, width, height, 0, 0, false);
        };
        this.subMeshes = [];
        new SubMesh(0, 0, 4 * GaussianSplattingMeshBase._BatchSize, 0, 6 * GaussianSplattingMeshBase._BatchSize, this);
        this.setEnabled(false);
        // webGL2 and webGPU support for RG texture with float16 is fine. not webGL1
        this._useRGBACovariants = !this.getEngine().isWebGPU && this.getEngine().version === 1.0;
        _AcquireGsInterFrameYield(this.getEngine());
        this._keepInRam = keepInRam;
        if (url) {
            this._loadingPromise = this.loadFileAsync(url);
        }
        const gaussianSplattingMaterial = new GaussianSplattingMaterial(this.name + "_material", this._scene);
        // Cast is safe: GaussianSplattingMeshBase is @internal; all concrete instances are GaussianSplattingMesh.
        gaussianSplattingMaterial.setSourceMesh(this);
        gaussianSplattingMaterial.doNotSerialize = true;
        this._material = gaussianSplattingMaterial;
        // delete meshes created for cameras on camera removal
        this._scene.onCameraRemovedObservable.add((camera) => {
            const cameraId = camera.uniqueId;
            // delete mesh for this camera
            const cameraViewInfos = this._cameraViewInfos.get(cameraId);
            if (cameraViewInfos) {
                // If the cached shadow-caster geometry came from the mesh we're disposing, drop it
                // so isReady()/render() re-cache it from a surviving camera (see isReady()).
                // Must run before dispose(), which nulls the inner mesh's geometry.
                if (this._geometry === cameraViewInfos.mesh.geometry) {
                    this._geometry = null;
                }
                cameraViewInfos.mesh.dispose();
                this._cameraViewInfos.delete(cameraId);
            }
        });
    }
    /**
     * Get the loading promise when loading the mesh from a URL in the constructor
     * @returns constructor loading promise or null if no URL was provided
     */
    getLoadingPromise() {
        return this._loadingPromise;
    }
    /**
     * Returns the class name
     * @returns "GaussianSplattingMeshBase"
     */
    getClassName() {
        return "GaussianSplattingMeshBase";
    }
    /**
     * Returns the total number of vertices (splats) within the mesh
     * @returns the total number of vertices
     */
    getTotalVertices() {
        return this._vertexCount;
    }
    /**
     * Is this node ready to be used/rendered
     * @param completeCheck defines if a complete check (including materials and lights) has to be done (false by default)
     * @returns true when ready
     */
    isReady(completeCheck = false) {
        if (!super.isReady(completeCheck, true)) {
            return false;
        }
        if (!this._readyToDisplay) {
            // mesh is ready when worker has done at least 1 sorting
            this._postToWorker(true);
            return false;
        }
        // Before the first successful render, require an applied index buffer. A pending refresh can
        // use the latest completed buffer, otherwise a transform changed every frame would starve the
        // first render. Once rendered, the render loop continuously re-sorts as the camera/world changes.
        if (!this._hasRenderedOnce && !this._disableDepthSort) {
            const cameras = this._scene.activeCameras?.length ? this._scene.activeCameras : [this._scene.activeCamera];
            const canRenderWithPendingRefresh = this._scene._isInRenderingMeshEvaluation() && cameras.filter((camera) => camera !== null).length === 1;
            const worldMatrix = this.computeWorldMatrix(true);
            let sortBufferMissing = false;
            let sortRefreshPending = false;
            let worldMatrixDirty = false;
            for (const camera of cameras) {
                if (!camera) {
                    continue;
                }
                const cameraViewInfo = this._cameraViewInfos.get(camera.uniqueId);
                if (!cameraViewInfo || !cameraViewInfo.splatIndexBufferSet || cameraViewInfo.sortAppliedId === 0) {
                    sortBufferMissing = true;
                    continue;
                }
                if (cameraViewInfo.sortAppliedId !== cameraViewInfo.sortRequestId) {
                    sortRefreshPending = true;
                    continue;
                }
                // If world matrix drifted (user applied transforms after load), request an updated sort.
                // Camera drift is intentionally excluded here: checking camera movement would cause isReady()
                // to return false indefinitely while the camera is moving. The render loop handles camera
                // re-sorting continuously via _postToWorker() in render().
                if (this._isSortStateDirty(cameraViewInfo, worldMatrix, camera, true)) {
                    worldMatrixDirty = true;
                }
            }
            if (sortBufferMissing || sortRefreshPending || worldMatrixDirty) {
                // Try to post any pending sort so subsequent polling iterations make progress.
                this._postToWorker(true);
                // A single-camera scene may use its latest completed sort while a transform refresh is
                // pending, which prevents continuously changing transforms from starving the first render.
                // Multi-camera scenes must wait because each viewport needs its own refreshed ordering.
                if (sortBufferMissing || !canRenderWithPendingRefresh) {
                    return false;
                }
            }
        }
        // Attach the splat geometry to the GS top mesh so that the shadow generator (which renders
        // shadow casters via the top mesh's subMeshes, NOT through this mesh's render() override)
        // has valid geometry on the very first shadow pass. Without this, the first shadow render
        // happens before render() is called and the GS produces no shadow caster output.
        if (!this._geometry && this._cameraViewInfos.size) {
            this._geometry = this._cameraViewInfos.values().next().value.mesh.geometry;
        }
        // If the material declares a shadow depth wrapper, make sure its effect is compiled for
        // each subMesh against the scene's shadow generators. Otherwise the first shadow pass
        // would be skipped (ShadowGenerator.isReady would return false) and we'd miss the shadow
        // on a renderCount=1 capture.
        // The shadow generator's depth wrapper is standalone (it wraps a ShaderMaterial), so its
        // isReadyForSubMesh path stamps an effect on subMesh._drawWrappers[engine.currentRenderPassId].
        // If we leave currentRenderPassId set to the main pass while doing this, we'd overwrite the
        // GS material's defines on the main draw wrapper, causing the GS material to recreate its
        // defines on the next call and lose any plugin-driven define state (e.g. defines toggled
        // by a MaterialPluginBase.isReadyForSubMesh override). Temporarily switch to each shadow
        // generator's render pass id while preparing it (matches the pattern used in Mesh.isReady).
        if (this.material && this.material.shadowDepthWrapper) {
            const engine = this._scene.getEngine();
            const previousRenderPassId = engine.currentRenderPassId;
            try {
                for (const light of this._scene.lights) {
                    const shadowGenerator = light.getShadowGenerator();
                    if (!shadowGenerator) {
                        continue;
                    }
                    const shadowMap = shadowGenerator.getShadowMap();
                    const renderPassIds = shadowMap?.renderPassIds;
                    if (!renderPassIds || renderPassIds.length === 0) {
                        continue;
                    }
                    for (let p = 0; p < renderPassIds.length; ++p) {
                        engine.currentRenderPassId = renderPassIds[p];
                        for (const subMesh of this.subMeshes) {
                            if (!shadowGenerator.isReady(subMesh, true, false)) {
                                return false;
                            }
                        }
                    }
                }
            }
            finally {
                engine.currentRenderPassId = previousRenderPassId;
            }
        }
        return true;
    }
    _getCameraDirection(camera) {
        const cameraViewMatrix = camera.getViewMatrix();
        const cameraProjectionMatrix = camera.getProjectionMatrix();
        const cameraViewProjectionMatrix = TmpVectors.Matrix[0];
        cameraViewMatrix.multiplyToRef(cameraProjectionMatrix, cameraViewProjectionMatrix);
        const modelMatrix = this.computeWorldMatrix(true);
        const modelViewMatrix = TmpVectors.Matrix[1];
        modelMatrix.multiplyToRef(cameraViewMatrix, modelViewMatrix);
        modelMatrix.multiplyToRef(cameraViewProjectionMatrix, this._modelViewProjectionMatrix);
        // return vector used to compute distance to camera
        const localDirection = TmpVectors.Vector3[1];
        localDirection.set(modelViewMatrix.m[2], modelViewMatrix.m[6], modelViewMatrix.m[10]);
        localDirection.normalize();
        return localDirection;
    }
    _isSortStateDirty(cameraViewInfo, worldMatrix, camera, worldMatrixOnly = false) {
        const world = worldMatrix.m;
        const previousWorld = cameraViewInfo.sortWorldMatrix.m;
        for (let i = 0; i < previousWorld.length; i++) {
            if (!Scalar.WithinEpsilon(previousWorld[i], world[i], this.viewUpdateThreshold)) {
                return true;
            }
        }
        if (worldMatrixOnly) {
            return false;
        }
        const cameraViewMatrix = camera.getViewMatrix();
        if (!Scalar.WithinEpsilon(cameraViewInfo.sortCameraForward.x, cameraViewMatrix.m[2], this.viewUpdateThreshold) ||
            !Scalar.WithinEpsilon(cameraViewInfo.sortCameraForward.y, cameraViewMatrix.m[6], this.viewUpdateThreshold) ||
            !Scalar.WithinEpsilon(cameraViewInfo.sortCameraForward.z, cameraViewMatrix.m[10], this.viewUpdateThreshold)) {
            return true;
        }
        const cameraPosition = camera.globalPosition;
        return (!Scalar.WithinEpsilon(cameraViewInfo.sortCameraPosition.x, cameraPosition.x, this.viewUpdateThreshold) ||
            !Scalar.WithinEpsilon(cameraViewInfo.sortCameraPosition.y, cameraPosition.y, this.viewUpdateThreshold) ||
            !Scalar.WithinEpsilon(cameraViewInfo.sortCameraPosition.z, cameraPosition.z, this.viewUpdateThreshold));
    }
    /** @internal */
    _postToWorker(forced = false) {
        const scene = this._scene;
        const frameId = scene.getFrameId();
        // force update or at least frame update for camera is outdated
        let outdated = false;
        this._cameraViewInfos.forEach((cameraViewInfos) => {
            if (cameraViewInfos.frameIdLastUpdate !== frameId) {
                outdated = true;
            }
        });
        // array of cameras used for rendering
        const cameras = this._scene.activeCameras?.length ? this._scene.activeCameras : [this._scene.activeCamera];
        // list view infos for active cameras
        const activeViewInfos = [];
        cameras.forEach((camera) => {
            if (!camera) {
                return;
            }
            const cameraId = camera.uniqueId;
            const cameraViewInfos = this._cameraViewInfos.get(cameraId);
            if (cameraViewInfos) {
                activeViewInfos.push(cameraViewInfos);
            }
            else {
                // mesh doesn't exist yet for this camera
                const cameraMesh = new Mesh(this.name + "_cameraMesh_" + cameraId, this._scene);
                cameraMesh.doNotSerialize = true;
                // not visible with inspector or the scene graph
                cameraMesh.reservedDataStore = { hidden: true };
                cameraMesh.setEnabled(false);
                cameraMesh.material = this.material;
                if (cameraMesh.material && cameraMesh.material instanceof GaussianSplattingMaterial) {
                    const gsMaterial = cameraMesh.material;
                    // GaussianSplattingMaterial source mesh may not have been set yet.
                    // This happens for cloned resources from asset containers for instance,
                    // where material is cloned before mesh.
                    if (!gsMaterial.getSourceMesh()) {
                        // Cast is safe: see constructor comment above.
                        gsMaterial.setSourceMesh(this);
                    }
                }
                GaussianSplattingMeshBase._MakeSplatGeometryForMesh(cameraMesh);
                const newViewInfos = {
                    camera: camera,
                    cameraDirection: new Vector3(0, 0, 0),
                    sortWorldMatrix: Matrix.Identity(),
                    sortCameraForward: new Vector3(0, 0, 0),
                    sortCameraPosition: new Vector3(0, 0, 0),
                    sortRequestId: 0,
                    sortAppliedId: 0,
                    mesh: cameraMesh,
                    frameIdLastUpdate: frameId,
                    splatIndexBufferSet: false,
                };
                activeViewInfos.push(newViewInfos);
                this._cameraViewInfos.set(cameraId, newViewInfos);
            }
        });
        // Sort view infos: cameras without a completed initial sort come first so they don't get starved
        // by a `forced` re-sort of an already-initialized camera (which would consume `_canPostToWorker`).
        // A camera can already have the shared index buffer bound when another camera's first sort resizes it,
        // so splatIndexBufferSet alone does not mean this camera has received its own sorted result.
        // Among initialized cameras, the least recently updated comes first.
        activeViewInfos.sort((a, b) => {
            if ((a.sortAppliedId === 0) !== (b.sortAppliedId === 0)) {
                return a.sortAppliedId === 0 ? -1 : 1;
            }
            if (a.splatIndexBufferSet !== b.splatIndexBufferSet) {
                return a.splatIndexBufferSet ? 1 : -1;
            }
            return a.frameIdLastUpdate - b.frameIdLastUpdate;
        });
        // The native sort writes into _splatPositions/_splatIndex: both must be allocated (they still are
        // null before any splat data has been committed) or the native binding throws on the conversion.
        const hasNativeSort = !!Native?.sortSplats && !!this._splatPositions && !!this._splatIndex;
        // When depth sort is disabled, no sort function must run: fall through to the no-sort path below.
        const hasSortFunction = !this._disableDepthSort && (this._worker || hasNativeSort);
        if ((forced || outdated) && hasSortFunction && (this._scene.activeCameras?.length || this._scene.activeCamera) && this._canPostToWorker) {
            const worldMatrix = this.computeWorldMatrix(true);
            // view infos sorted by least recent updated frame id
            activeViewInfos.forEach((cameraViewInfos) => {
                const camera = cameraViewInfos.camera;
                const cameraDirection = this._getCameraDirection(camera);
                if ((forced || this._isSortStateDirty(cameraViewInfos, worldMatrix, camera)) && this._canPostToWorker) {
                    const cameraViewMatrix = camera.getViewMatrix();
                    cameraViewInfos.cameraDirection.copyFrom(cameraDirection);
                    cameraViewInfos.sortWorldMatrix.copyFrom(worldMatrix);
                    cameraViewInfos.sortCameraForward.set(cameraViewMatrix.m[2], cameraViewMatrix.m[6], cameraViewMatrix.m[10]);
                    cameraViewInfos.sortCameraPosition.copyFrom(camera.globalPosition);
                    cameraViewInfos.sortRequestId = ++this._sortRequestId;
                    cameraViewInfos.frameIdLastUpdate = frameId;
                    this._canPostToWorker = false;
                    if (this._worker) {
                        this._worker.postMessage({
                            command: GaussianSplattingSortWorkerCommand.SORT,
                            worldMatrix: worldMatrix.m,
                            cameraForward: [cameraViewMatrix.m[2], cameraViewMatrix.m[6], cameraViewMatrix.m[10]],
                            cameraPosition: [camera.globalPosition.x, camera.globalPosition.y, camera.globalPosition.z],
                            depthMix: this._depthMix,
                            cameraId: camera.uniqueId,
                            sortRequestId: cameraViewInfos.sortRequestId,
                            rangeVersion: this._activeRangeVersion,
                            useCountingSort: GaussianSplattingMeshBase.UseCountingSort,
                            rightHanded: this._scene.useRightHandedSystem,
                            logSortPerformance: GaussianSplattingMeshBase.LogSortPerformance,
                        }, [this._depthMix.buffer]);
                    }
                    else if (Native?.sortSplats) {
                        if (this._activeSplatRanges) {
                            // Native sort can't filter ranges: fall back to the (already range-filtered) identity index buffer.
                            this._updateSplatIndexBuffer(this._vertexCount);
                        }
                        else {
                            Native.sortSplats(this._modelViewProjectionMatrix, this._splatPositions, this._splatIndex, this._scene.useRightHandedSystem);
                        }
                        if (cameraViewInfos.splatIndexBufferSet) {
                            cameraViewInfos.mesh.thinInstanceBufferUpdated("splatIndex");
                        }
                        else {
                            cameraViewInfos.mesh.thinInstanceSetBuffer("splatIndex", this._splatIndex, 16, false);
                            cameraViewInfos.splatIndexBufferSet = true;
                        }
                        cameraViewInfos.sortAppliedId = cameraViewInfos.sortRequestId;
                        this._canPostToWorker = true;
                        this._readyToDisplay = true;
                    }
                }
            });
        }
        else if (this._disableDepthSort) {
            if (this._splatIndex) {
                activeViewInfos.forEach((cameraViewInfos) => {
                    if (!cameraViewInfos.splatIndexBufferSet) {
                        cameraViewInfos.mesh.thinInstanceSetBuffer("splatIndex", this._splatIndex, 16, false);
                        cameraViewInfos.splatIndexBufferSet = true;
                    }
                });
                this._readyToDisplay = true;
            }
            this._canPostToWorker = true;
        }
    }
    /**
     * Triggers the draw call for the mesh. Usually, you don't need to call this method by your own because the mesh rendering is handled by the scene rendering manager
     * @param subMesh defines the subMesh to render
     * @param enableAlphaMode defines if alpha mode can be changed
     * @param effectiveMeshReplacement defines an optional mesh used to provide info for the rendering
     * @returns the current mesh
     */
    render(subMesh, enableAlphaMode, effectiveMeshReplacement) {
        this._postToWorker();
        // geometry used for shadows, bind the first found in the camera view infos
        if (!this._geometry && this._cameraViewInfos.size) {
            this._geometry = this._cameraViewInfos.values().next().value.mesh.geometry;
        }
        const cameraId = this._scene.activeCamera.uniqueId;
        const cameraViewInfos = this._cameraViewInfos.get(cameraId);
        if (!cameraViewInfos || !cameraViewInfos.splatIndexBufferSet) {
            return this;
        }
        if (this.onBeforeRenderObservable) {
            this.onBeforeRenderObservable.notifyObservers(this);
        }
        const mesh = cameraViewInfos.mesh;
        mesh.getWorldMatrix().copyFrom(this.getWorldMatrix());
        // Propagate render pass material overrides (e.g., GPU picking) to the inner camera mesh.
        // When this mesh is rendered into a RenderTargetTexture with a material override (via setMaterialForRendering),
        // the override is set on this proxy mesh but needs to be applied to the actual camera mesh that does the rendering.
        const engine = this._scene.getEngine();
        const renderPassId = engine.currentRenderPassId;
        const renderPassMaterial = this.getMaterialForRenderPass(renderPassId);
        if (renderPassMaterial) {
            mesh.setMaterialForRenderPass(renderPassId, renderPassMaterial);
        }
        const ret = mesh.render(subMesh, enableAlphaMode, effectiveMeshReplacement);
        this._hasRenderedOnce = true;
        // Clean up the temporary override to avoid affecting other render passes
        if (renderPassMaterial) {
            mesh.setMaterialForRenderPass(renderPassId, undefined);
        }
        if (this.onAfterRenderObservable) {
            this.onAfterRenderObservable.notifyObservers(this);
        }
        return ret;
    }
    static _TypeNameToEnum(name) {
        switch (name) {
            case "float":
                return 0 /* PLYType.FLOAT */;
            case "int":
                return 1 /* PLYType.INT */;
            case "uint":
                return 2 /* PLYType.UINT */;
            case "double":
                return 3 /* PLYType.DOUBLE */;
            case "uchar":
                return 4 /* PLYType.UCHAR */;
            case "ushort":
            case "uint16":
                return 5 /* PLYType.USHORT */;
        }
        return 6 /* PLYType.UNDEFINED */;
    }
    static _ValueNameToEnum(name) {
        switch (name) {
            case "min_x":
                return 0 /* PLYValue.MIN_X */;
            case "min_y":
                return 1 /* PLYValue.MIN_Y */;
            case "min_z":
                return 2 /* PLYValue.MIN_Z */;
            case "max_x":
                return 3 /* PLYValue.MAX_X */;
            case "max_y":
                return 4 /* PLYValue.MAX_Y */;
            case "max_z":
                return 5 /* PLYValue.MAX_Z */;
            case "min_scale_x":
                return 6 /* PLYValue.MIN_SCALE_X */;
            case "min_scale_y":
                return 7 /* PLYValue.MIN_SCALE_Y */;
            case "min_scale_z":
                return 8 /* PLYValue.MIN_SCALE_Z */;
            case "max_scale_x":
                return 9 /* PLYValue.MAX_SCALE_X */;
            case "max_scale_y":
                return 10 /* PLYValue.MAX_SCALE_Y */;
            case "max_scale_z":
                return 11 /* PLYValue.MAX_SCALE_Z */;
            case "packed_position":
                return 12 /* PLYValue.PACKED_POSITION */;
            case "packed_rotation":
                return 13 /* PLYValue.PACKED_ROTATION */;
            case "packed_scale":
                return 14 /* PLYValue.PACKED_SCALE */;
            case "packed_color":
                return 15 /* PLYValue.PACKED_COLOR */;
            case "x":
                return 16 /* PLYValue.X */;
            case "y":
                return 17 /* PLYValue.Y */;
            case "z":
                return 18 /* PLYValue.Z */;
            case "scale_0":
                return 19 /* PLYValue.SCALE_0 */;
            case "scale_1":
                return 20 /* PLYValue.SCALE_1 */;
            case "scale_2":
                return 21 /* PLYValue.SCALE_2 */;
            case "diffuse_red":
            case "red":
                return 22 /* PLYValue.DIFFUSE_RED */;
            case "diffuse_green":
            case "green":
                return 23 /* PLYValue.DIFFUSE_GREEN */;
            case "diffuse_blue":
            case "blue":
                return 24 /* PLYValue.DIFFUSE_BLUE */;
            case "f_dc_0":
                return 26 /* PLYValue.F_DC_0 */;
            case "f_dc_1":
                return 27 /* PLYValue.F_DC_1 */;
            case "f_dc_2":
                return 28 /* PLYValue.F_DC_2 */;
            case "f_dc_3":
                return 29 /* PLYValue.F_DC_3 */;
            case "opacity":
                return 25 /* PLYValue.OPACITY */;
            case "rot_0":
                return 30 /* PLYValue.ROT_0 */;
            case "rot_1":
                return 31 /* PLYValue.ROT_1 */;
            case "rot_2":
                return 32 /* PLYValue.ROT_2 */;
            case "rot_3":
                return 33 /* PLYValue.ROT_3 */;
            case "min_r":
                return 34 /* PLYValue.MIN_COLOR_R */;
            case "min_g":
                return 35 /* PLYValue.MIN_COLOR_G */;
            case "min_b":
                return 36 /* PLYValue.MIN_COLOR_B */;
            case "max_r":
                return 37 /* PLYValue.MAX_COLOR_R */;
            case "max_g":
                return 38 /* PLYValue.MAX_COLOR_G */;
            case "max_b":
                return 39 /* PLYValue.MAX_COLOR_B */;
            case "f_rest_0":
                return 40 /* PLYValue.SH_0 */;
            case "f_rest_1":
                return 41 /* PLYValue.SH_1 */;
            case "f_rest_2":
                return 42 /* PLYValue.SH_2 */;
            case "f_rest_3":
                return 43 /* PLYValue.SH_3 */;
            case "f_rest_4":
                return 44 /* PLYValue.SH_4 */;
            case "f_rest_5":
                return 45 /* PLYValue.SH_5 */;
            case "f_rest_6":
                return 46 /* PLYValue.SH_6 */;
            case "f_rest_7":
                return 47 /* PLYValue.SH_7 */;
            case "f_rest_8":
                return 48 /* PLYValue.SH_8 */;
            case "f_rest_9":
                return 49 /* PLYValue.SH_9 */;
            case "f_rest_10":
                return 50 /* PLYValue.SH_10 */;
            case "f_rest_11":
                return 51 /* PLYValue.SH_11 */;
            case "f_rest_12":
                return 52 /* PLYValue.SH_12 */;
            case "f_rest_13":
                return 53 /* PLYValue.SH_13 */;
            case "f_rest_14":
                return 54 /* PLYValue.SH_14 */;
            case "f_rest_15":
                return 55 /* PLYValue.SH_15 */;
            case "f_rest_16":
                return 56 /* PLYValue.SH_16 */;
            case "f_rest_17":
                return 57 /* PLYValue.SH_17 */;
            case "f_rest_18":
                return 58 /* PLYValue.SH_18 */;
            case "f_rest_19":
                return 59 /* PLYValue.SH_19 */;
            case "f_rest_20":
                return 60 /* PLYValue.SH_20 */;
            case "f_rest_21":
                return 61 /* PLYValue.SH_21 */;
            case "f_rest_22":
                return 62 /* PLYValue.SH_22 */;
            case "f_rest_23":
                return 63 /* PLYValue.SH_23 */;
            case "f_rest_24":
                return 64 /* PLYValue.SH_24 */;
            case "f_rest_25":
                return 65 /* PLYValue.SH_25 */;
            case "f_rest_26":
                return 66 /* PLYValue.SH_26 */;
            case "f_rest_27":
                return 67 /* PLYValue.SH_27 */;
            case "f_rest_28":
                return 68 /* PLYValue.SH_28 */;
            case "f_rest_29":
                return 69 /* PLYValue.SH_29 */;
            case "f_rest_30":
                return 70 /* PLYValue.SH_30 */;
            case "f_rest_31":
                return 71 /* PLYValue.SH_31 */;
            case "f_rest_32":
                return 72 /* PLYValue.SH_32 */;
            case "f_rest_33":
                return 73 /* PLYValue.SH_33 */;
            case "f_rest_34":
                return 74 /* PLYValue.SH_34 */;
            case "f_rest_35":
                return 75 /* PLYValue.SH_35 */;
            case "f_rest_36":
                return 76 /* PLYValue.SH_36 */;
            case "f_rest_37":
                return 77 /* PLYValue.SH_37 */;
            case "f_rest_38":
                return 78 /* PLYValue.SH_38 */;
            case "f_rest_39":
                return 79 /* PLYValue.SH_39 */;
            case "f_rest_40":
                return 80 /* PLYValue.SH_40 */;
            case "f_rest_41":
                return 81 /* PLYValue.SH_41 */;
            case "f_rest_42":
                return 82 /* PLYValue.SH_42 */;
            case "f_rest_43":
                return 83 /* PLYValue.SH_43 */;
            case "f_rest_44":
                return 84 /* PLYValue.SH_44 */;
            case "f_rest_45":
                return 85 /* PLYValue.SH_45 */;
            case "f_rest_46":
                return 86 /* PLYValue.SH_46 */;
            case "f_rest_47":
                return 87 /* PLYValue.SH_47 */;
            case "f_rest_48":
                return 88 /* PLYValue.SH_48 */;
            case "f_rest_49":
                return 89 /* PLYValue.SH_49 */;
            case "f_rest_50":
                return 90 /* PLYValue.SH_50 */;
            case "f_rest_51":
                return 91 /* PLYValue.SH_51 */;
            case "f_rest_52":
                return 92 /* PLYValue.SH_52 */;
            case "f_rest_53":
                return 93 /* PLYValue.SH_53 */;
            case "f_rest_54":
                return 94 /* PLYValue.SH_54 */;
            case "f_rest_55":
                return 95 /* PLYValue.SH_55 */;
            case "f_rest_56":
                return 96 /* PLYValue.SH_56 */;
            case "f_rest_57":
                return 97 /* PLYValue.SH_57 */;
            case "f_rest_58":
                return 98 /* PLYValue.SH_58 */;
            case "f_rest_59":
                return 99 /* PLYValue.SH_59 */;
            case "f_rest_60":
                return 100 /* PLYValue.SH_60 */;
            case "f_rest_61":
                return 101 /* PLYValue.SH_61 */;
            case "f_rest_62":
                return 102 /* PLYValue.SH_62 */;
            case "f_rest_63":
                return 103 /* PLYValue.SH_63 */;
            case "f_rest_64":
                return 104 /* PLYValue.SH_64 */;
            case "f_rest_65":
                return 105 /* PLYValue.SH_65 */;
            case "f_rest_66":
                return 106 /* PLYValue.SH_66 */;
            case "f_rest_67":
                return 107 /* PLYValue.SH_67 */;
            case "f_rest_68":
                return 108 /* PLYValue.SH_68 */;
            case "f_rest_69":
                return 109 /* PLYValue.SH_69 */;
            case "f_rest_70":
                return 110 /* PLYValue.SH_70 */;
            case "f_rest_71":
                return 111 /* PLYValue.SH_71 */;
        }
        return 112 /* PLYValue.UNDEFINED */;
    }
    /**
     * Parse a PLY file header and returns metas infos on splats and chunks
     * @param data the loaded buffer
     * @returns a PLYHeader
     */
    static ParseHeader(data) {
        const ubuf = new Uint8Array(data);
        const header = new TextDecoder().decode(ubuf.slice(0, 1024 * 10));
        const headerEnd = "end_header\n";
        const headerEndIndex = header.indexOf(headerEnd);
        if (headerEndIndex < 0 || !header) {
            // standard splat
            return null;
        }
        const vertexCount = parseInt(/element vertex (\d+)\n/.exec(header)[1]);
        const chunkElement = /element chunk (\d+)\n/.exec(header);
        let chunkCount = 0;
        if (chunkElement) {
            chunkCount = parseInt(chunkElement[1]);
        }
        let rowVertexOffset = 0;
        let rowChunkOffset = 0;
        const offsets = {
            double: 8,
            int: 4,
            uint: 4,
            float: 4,
            short: 2,
            ushort: 2,
            uint16: 2,
            uchar: 1,
            list: 0,
        };
        let ElementMode;
        (function (ElementMode) {
            ElementMode[ElementMode["Vertex"] = 0] = "Vertex";
            ElementMode[ElementMode["Chunk"] = 1] = "Chunk";
            ElementMode[ElementMode["SH"] = 2] = "SH";
            ElementMode[ElementMode["Unused"] = 3] = "Unused";
        })(ElementMode || (ElementMode = {}));
        let chunkMode = 1 /* ElementMode.Chunk */;
        const vertexProperties = [];
        const chunkProperties = [];
        const filtered = header.slice(0, headerEndIndex).split("\n");
        let shDegree = 0;
        for (const prop of filtered) {
            if (prop.startsWith("property ")) {
                const [, typeName, name] = prop.split(" ");
                const value = GaussianSplattingMeshBase._ValueNameToEnum(name);
                if (value != 112 /* PLYValue.UNDEFINED */) {
                    // SH degree 1,2,3 or 4 for 9, 24, 45 or 72 values
                    if (value >= 111 /* PLYValue.SH_71 */) {
                        shDegree = 4;
                    }
                    else if (value >= 84 /* PLYValue.SH_44 */) {
                        shDegree = Math.max(shDegree, 3);
                    }
                    else if (value >= 63 /* PLYValue.SH_23 */) {
                        shDegree = Math.max(shDegree, 2);
                    }
                    else if (value >= 48 /* PLYValue.SH_8 */) {
                        shDegree = Math.max(shDegree, 1);
                    }
                }
                const type = GaussianSplattingMeshBase._TypeNameToEnum(typeName);
                if (chunkMode == 1 /* ElementMode.Chunk */) {
                    chunkProperties.push({ value, type, offset: rowChunkOffset });
                    rowChunkOffset += offsets[typeName];
                }
                else if (chunkMode == 0 /* ElementMode.Vertex */) {
                    vertexProperties.push({ value, type, offset: rowVertexOffset });
                    rowVertexOffset += offsets[typeName];
                }
                else if (chunkMode == 2 /* ElementMode.SH */) {
                    // SH doesn't count for vertex row size but its properties are used to retrieve SH
                    vertexProperties.push({ value, type, offset: rowVertexOffset });
                }
                if (!offsets[typeName]) {
                    Logger.Warn(`Unsupported property type: ${typeName}.`);
                }
            }
            else if (prop.startsWith("element ")) {
                const [, type] = prop.split(" ");
                if (type == "chunk") {
                    chunkMode = 1 /* ElementMode.Chunk */;
                }
                else if (type == "vertex") {
                    chunkMode = 0 /* ElementMode.Vertex */;
                }
                else if (type == "sh") {
                    chunkMode = 2 /* ElementMode.SH */;
                }
                else {
                    chunkMode = 3 /* ElementMode.Unused */;
                }
            }
        }
        const dataView = new DataView(data, headerEndIndex + headerEnd.length);
        const buffer = new ArrayBuffer(GaussianSplattingMeshBase._RowOutputLength * vertexCount);
        let shBuffer = null;
        let shCoefficientCount = 0;
        if (shDegree) {
            const shVectorCount = (shDegree + 1) * (shDegree + 1) - 1;
            shCoefficientCount = shVectorCount * 3;
            shBuffer = new ArrayBuffer(shCoefficientCount * vertexCount);
        }
        return {
            vertexCount: vertexCount,
            chunkCount: chunkCount,
            rowVertexLength: rowVertexOffset,
            rowChunkLength: rowChunkOffset,
            vertexProperties: vertexProperties,
            chunkProperties: chunkProperties,
            dataView: dataView,
            buffer: buffer,
            shDegree: shDegree,
            shCoefficientCount: shCoefficientCount,
            shBuffer: shBuffer,
        };
    }
    static _GetCompressedChunks(header, offset) {
        if (!header.chunkCount) {
            return null;
        }
        const dataView = header.dataView;
        const compressedChunks = new Array(header.chunkCount);
        for (let i = 0; i < header.chunkCount; i++) {
            const currentChunk = {
                min: new Vector3(),
                max: new Vector3(),
                minScale: new Vector3(),
                maxScale: new Vector3(),
                minColor: new Vector3(0, 0, 0),
                maxColor: new Vector3(1, 1, 1),
            };
            compressedChunks[i] = currentChunk;
            for (let propertyIndex = 0; propertyIndex < header.chunkProperties.length; propertyIndex++) {
                const property = header.chunkProperties[propertyIndex];
                let value;
                switch (property.type) {
                    case 0 /* PLYType.FLOAT */:
                        value = dataView.getFloat32(property.offset + offset.value, true);
                        break;
                    default:
                        continue;
                }
                switch (property.value) {
                    case 0 /* PLYValue.MIN_X */:
                        currentChunk.min.x = value;
                        break;
                    case 1 /* PLYValue.MIN_Y */:
                        currentChunk.min.y = value;
                        break;
                    case 2 /* PLYValue.MIN_Z */:
                        currentChunk.min.z = value;
                        break;
                    case 3 /* PLYValue.MAX_X */:
                        currentChunk.max.x = value;
                        break;
                    case 4 /* PLYValue.MAX_Y */:
                        currentChunk.max.y = value;
                        break;
                    case 5 /* PLYValue.MAX_Z */:
                        currentChunk.max.z = value;
                        break;
                    case 6 /* PLYValue.MIN_SCALE_X */:
                        currentChunk.minScale.x = value;
                        break;
                    case 7 /* PLYValue.MIN_SCALE_Y */:
                        currentChunk.minScale.y = value;
                        break;
                    case 8 /* PLYValue.MIN_SCALE_Z */:
                        currentChunk.minScale.z = value;
                        break;
                    case 9 /* PLYValue.MAX_SCALE_X */:
                        currentChunk.maxScale.x = value;
                        break;
                    case 10 /* PLYValue.MAX_SCALE_Y */:
                        currentChunk.maxScale.y = value;
                        break;
                    case 11 /* PLYValue.MAX_SCALE_Z */:
                        currentChunk.maxScale.z = value;
                        break;
                    case 34 /* PLYValue.MIN_COLOR_R */:
                        currentChunk.minColor.x = value;
                        break;
                    case 35 /* PLYValue.MIN_COLOR_G */:
                        currentChunk.minColor.y = value;
                        break;
                    case 36 /* PLYValue.MIN_COLOR_B */:
                        currentChunk.minColor.z = value;
                        break;
                    case 37 /* PLYValue.MAX_COLOR_R */:
                        currentChunk.maxColor.x = value;
                        break;
                    case 38 /* PLYValue.MAX_COLOR_G */:
                        currentChunk.maxColor.y = value;
                        break;
                    case 39 /* PLYValue.MAX_COLOR_B */:
                        currentChunk.maxColor.z = value;
                        break;
                }
            }
            offset.value += header.rowChunkLength;
        }
        return compressedChunks;
    }
    static _GetSplat(header, index, compressedChunks, offset) {
        const q = TmpVectors.Quaternion[0];
        const temp3 = TmpVectors.Vector3[0];
        const rowOutputLength = GaussianSplattingMeshBase._RowOutputLength;
        const buffer = header.buffer;
        const dataView = header.dataView;
        const position = new Float32Array(buffer, index * rowOutputLength, 3);
        const scale = new Float32Array(buffer, index * rowOutputLength + 12, 3);
        const rgba = new Uint8ClampedArray(buffer, index * rowOutputLength + 24, 4);
        const rot = new Uint8ClampedArray(buffer, index * rowOutputLength + 28, 4);
        let sh = null;
        if (header.shBuffer) {
            sh = new Uint8ClampedArray(header.shBuffer, index * header.shCoefficientCount, header.shCoefficientCount);
        }
        const chunkIndex = index >> 8;
        let r0 = 255;
        let r1 = 0;
        let r2 = 0;
        let r3 = 0;
        const plySH = [];
        for (let propertyIndex = 0; propertyIndex < header.vertexProperties.length; propertyIndex++) {
            const property = header.vertexProperties[propertyIndex];
            let value;
            switch (property.type) {
                case 0 /* PLYType.FLOAT */:
                    value = dataView.getFloat32(offset.value + property.offset, true);
                    break;
                case 1 /* PLYType.INT */:
                    value = dataView.getInt32(offset.value + property.offset, true);
                    break;
                case 2 /* PLYType.UINT */:
                    value = dataView.getUint32(offset.value + property.offset, true);
                    break;
                case 3 /* PLYType.DOUBLE */:
                    value = dataView.getFloat64(offset.value + property.offset, true);
                    break;
                case 4 /* PLYType.UCHAR */:
                    value = dataView.getUint8(offset.value + property.offset);
                    break;
                case 5 /* PLYType.USHORT */:
                    value = FromHalfFloat(dataView.getUint16(offset.value + property.offset, true));
                    break;
                default:
                    continue;
            }
            switch (property.value) {
                case 12 /* PLYValue.PACKED_POSITION */:
                    {
                        const compressedChunk = compressedChunks[chunkIndex];
                        Unpack111011(value, temp3);
                        position[0] = Scalar.Lerp(compressedChunk.min.x, compressedChunk.max.x, temp3.x);
                        position[1] = Scalar.Lerp(compressedChunk.min.y, compressedChunk.max.y, temp3.y);
                        position[2] = Scalar.Lerp(compressedChunk.min.z, compressedChunk.max.z, temp3.z);
                    }
                    break;
                case 13 /* PLYValue.PACKED_ROTATION */:
                    {
                        UnpackRot(value, q);
                        r0 = q.x;
                        r1 = q.y;
                        r2 = q.z;
                        r3 = q.w;
                    }
                    break;
                case 14 /* PLYValue.PACKED_SCALE */:
                    {
                        const compressedChunk = compressedChunks[chunkIndex];
                        Unpack111011(value, temp3);
                        scale[0] = Math.exp(Scalar.Lerp(compressedChunk.minScale.x, compressedChunk.maxScale.x, temp3.x));
                        scale[1] = Math.exp(Scalar.Lerp(compressedChunk.minScale.y, compressedChunk.maxScale.y, temp3.y));
                        scale[2] = Math.exp(Scalar.Lerp(compressedChunk.minScale.z, compressedChunk.maxScale.z, temp3.z));
                    }
                    break;
                case 15 /* PLYValue.PACKED_COLOR */:
                    {
                        const compressedChunk = compressedChunks[chunkIndex];
                        Unpack8888(value, rgba);
                        rgba[0] = Scalar.Lerp(compressedChunk.minColor.x, compressedChunk.maxColor.x, rgba[0] / 255) * 255;
                        rgba[1] = Scalar.Lerp(compressedChunk.minColor.y, compressedChunk.maxColor.y, rgba[1] / 255) * 255;
                        rgba[2] = Scalar.Lerp(compressedChunk.minColor.z, compressedChunk.maxColor.z, rgba[2] / 255) * 255;
                    }
                    break;
                case 16 /* PLYValue.X */:
                    position[0] = value;
                    break;
                case 17 /* PLYValue.Y */:
                    position[1] = value;
                    break;
                case 18 /* PLYValue.Z */:
                    position[2] = value;
                    break;
                case 19 /* PLYValue.SCALE_0 */:
                    scale[0] = Math.exp(value);
                    break;
                case 20 /* PLYValue.SCALE_1 */:
                    scale[1] = Math.exp(value);
                    break;
                case 21 /* PLYValue.SCALE_2 */:
                    scale[2] = Math.exp(value);
                    break;
                case 22 /* PLYValue.DIFFUSE_RED */:
                    rgba[0] = value;
                    break;
                case 23 /* PLYValue.DIFFUSE_GREEN */:
                    rgba[1] = value;
                    break;
                case 24 /* PLYValue.DIFFUSE_BLUE */:
                    rgba[2] = value;
                    break;
                case 26 /* PLYValue.F_DC_0 */:
                    rgba[0] = (0.5 + GaussianSplattingMeshBase._SH_C0 * value) * 255;
                    break;
                case 27 /* PLYValue.F_DC_1 */:
                    rgba[1] = (0.5 + GaussianSplattingMeshBase._SH_C0 * value) * 255;
                    break;
                case 28 /* PLYValue.F_DC_2 */:
                    rgba[2] = (0.5 + GaussianSplattingMeshBase._SH_C0 * value) * 255;
                    break;
                case 29 /* PLYValue.F_DC_3 */:
                    rgba[3] = (0.5 + GaussianSplattingMeshBase._SH_C0 * value) * 255;
                    break;
                case 25 /* PLYValue.OPACITY */:
                    rgba[3] = (1 / (1 + Math.exp(-value))) * 255;
                    break;
                case 30 /* PLYValue.ROT_0 */:
                    r0 = value;
                    break;
                case 31 /* PLYValue.ROT_1 */:
                    r1 = value;
                    break;
                case 32 /* PLYValue.ROT_2 */:
                    r2 = value;
                    break;
                case 33 /* PLYValue.ROT_3 */:
                    r3 = value;
                    break;
            }
            if (sh && property.value >= 40 /* PLYValue.SH_0 */ && property.value <= 111 /* PLYValue.SH_71 */) {
                const shIndex = property.value - 40 /* PLYValue.SH_0 */;
                if (property.type == 4 /* PLYType.UCHAR */ && header.chunkCount) {
                    // compressed ply. dataView points to beginning of vertex
                    // could be improved with a direct copy instead of a per SH index computation + copy
                    const compressedValue = dataView.getUint8(header.rowChunkLength * header.chunkCount + header.vertexCount * header.rowVertexLength + index * header.shCoefficientCount + shIndex);
                    // compressed .ply SH import : https://github.com/playcanvas/engine/blob/fda3f0368b45d7381f0b5a1722bd2056128eaebe/src/scene/gsplat/gsplat-compressed-data.js#L88C81-L88C98
                    plySH[shIndex] = (compressedValue * (8 / 255) - 4) * 127.5 + 127.5;
                }
                else {
                    const clampedValue = Scalar.Clamp(value * 127.5 + 127.5, 0, 255);
                    plySH[shIndex] = clampedValue;
                }
            }
        }
        if (sh) {
            const shDim = header.shDegree == 1 ? 3 : header.shDegree == 2 ? 8 : header.shDegree == 3 ? 15 : 24;
            for (let j = 0; j < shDim; j++) {
                sh[j * 3 + 0] = plySH[j];
                sh[j * 3 + 1] = plySH[j + shDim];
                sh[j * 3 + 2] = plySH[j + shDim * 2];
            }
        }
        q.set(r1, r2, r3, r0);
        q.normalize();
        rot[0] = q.w * 127.5 + 127.5;
        rot[1] = q.x * 127.5 + 127.5;
        rot[2] = q.y * 127.5 + 127.5;
        rot[3] = q.z * 127.5 + 127.5;
        offset.value += header.rowVertexLength;
    }
    /**
     * Converts a .ply data with SH coefficients splat
     * if data array buffer is not ply, returns the original buffer
     * @param data the .ply data to load
     * @param useCoroutine use coroutine and yield
     * @returns the loaded splat buffer and optional array of sh coefficients
     */
    static *ConvertPLYWithSHToSplat(data, useCoroutine = false) {
        const header = GaussianSplattingMeshBase.ParseHeader(data);
        if (!header) {
            return { buffer: data };
        }
        const offset = { value: 0 };
        const compressedChunks = GaussianSplattingMeshBase._GetCompressedChunks(header, offset);
        for (let i = 0; i < header.vertexCount; i++) {
            GaussianSplattingMeshBase._GetSplat(header, i, compressedChunks, offset);
            if (i % GaussianSplattingMeshBase._PlyConversionBatchSize === 0 && useCoroutine) {
                yield;
            }
        }
        let sh = null;
        // make SH texture buffers
        if (header.shDegree && header.shBuffer) {
            const textureCount = Math.ceil(header.shCoefficientCount / 16); // 4 components can be stored per texture, 4 sh per component
            let shIndexRead = 0;
            const ubuf = new Uint8Array(header.shBuffer);
            // sh is an array of uint8array that will be used to create sh textures
            sh = [];
            const splatCount = header.vertexCount;
            const engine = EngineStore.LastCreatedEngine;
            if (engine) {
                const width = engine.getCaps().maxTextureSize;
                const height = Math.ceil(splatCount / width);
                // create array for the number of textures needed.
                sh = AllocateShBuffers(textureCount, height * width * 4 * 4);
                for (let i = 0; i < splatCount; i++) {
                    for (let shIndexWrite = 0; shIndexWrite < header.shCoefficientCount; shIndexWrite++) {
                        const shValue = ubuf[shIndexRead++];
                        const textureIndex = Math.floor(shIndexWrite / 16);
                        const shArray = sh[textureIndex];
                        const byteIndexInTexture = shIndexWrite % 16; // [0..15]
                        const offsetPerSplat = i * 16; // 16 sh values per texture per splat.
                        shArray[byteIndexInTexture + offsetPerSplat] = shValue;
                    }
                }
            }
        }
        return { buffer: header.buffer, sh: sh, shDegree: header.shDegree };
    }
    /**
     * Converts a .ply data array buffer to splat
     * if data array buffer is not ply, returns the original buffer
     * @param data the .ply data to load
     * @param useCoroutine use coroutine and yield
     * @returns the loaded splat buffer without SH coefficient, whether ply contains or not SH.
     */
    static *ConvertPLYToSplat(data, useCoroutine = false) {
        const header = GaussianSplattingMeshBase.ParseHeader(data);
        if (!header) {
            return data;
        }
        const offset = { value: 0 };
        const compressedChunks = GaussianSplattingMeshBase._GetCompressedChunks(header, offset);
        for (let i = 0; i < header.vertexCount; i++) {
            GaussianSplattingMeshBase._GetSplat(header, i, compressedChunks, offset);
            if (i % GaussianSplattingMeshBase._PlyConversionBatchSize === 0 && useCoroutine) {
                yield;
            }
        }
        return header.buffer;
    }
    /**
     * Converts a .ply data array buffer to splat
     * if data array buffer is not ply, returns the original buffer
     * @param data the .ply data to load
     * @returns the loaded splat buffer
     */
    static async ConvertPLYToSplatAsync(data) {
        return await runCoroutineAsync(GaussianSplattingMeshBase.ConvertPLYToSplat(data, true), createYieldingScheduler());
    }
    /**
     * Converts a .ply with SH data array buffer to splat
     * if data array buffer is not ply, returns the original buffer
     * @param data the .ply data to load
     * @returns the loaded splat buffer with SH
     */
    static async ConvertPLYWithSHToSplatAsync(data) {
        return await runCoroutineAsync(GaussianSplattingMeshBase.ConvertPLYWithSHToSplat(data, true), createYieldingScheduler());
    }
    /**
     * Loads a .splat Gaussian Splatting array buffer asynchronously
     * @param data arraybuffer containing splat file
     * @returns a promise that resolves when the operation is complete
     */
    async loadDataAsync(data) {
        return await this.updateDataAsync(data);
    }
    /**
     * Loads a Gaussian or Splatting file asynchronously
     * @param url path to the splat file to load
     * @param scene optional scene it belongs to
     * @returns a promise that resolves when the operation is complete
     * @deprecated Please use SceneLoader.ImportMeshAsync instead
     */
    async loadFileAsync(url, scene) {
        await ImportMeshAsync(url, (scene || EngineStore.LastCreatedScene), { pluginOptions: { splat: { gaussianSplattingMesh: this } } });
    }
    /**
     * Releases resources associated with this mesh.
     * @param doNotRecurse Set to true to not recurse into each children (recurse into each children by default)
     */
    dispose(doNotRecurse) {
        if (this._mrtAtlas) {
            // The four data textures are attachments of this MRT — dispose the MRT, not each attachment.
            this._mrtAtlas.dispose();
            this._mrtAtlas = null;
            this._covariancesATexture = this._covariancesBTexture = this._centersTexture = this._colorsTexture = null;
        }
        else {
            this._covariancesATexture?.dispose();
            this._covariancesBTexture?.dispose();
            this._centersTexture?.dispose();
            this._colorsTexture?.dispose();
        }
        if (this._shMrtAtlas) {
            // SH attachments belong to these MRTs — dispose the MRTs, not each attachment (which is _shTextures[k]
            // for k < _shMrtAtlas.length).
            for (const mrt of this._shMrtAtlas) {
                mrt.dispose();
            }
            // Defence in depth: free any _shTextures entries beyond the MRT-backed set (not MRT-owned, so the loop
            // above misses them). The reuse guard keeps the atlas sized correctly, so this is normally a no-op.
            if (this._shTextures) {
                for (let k = this._shMrtAtlas.length; k < this._shTextures.length; k++) {
                    this._shTextures[k].dispose();
                }
            }
            this._shMrtAtlas = null;
        }
        else if (this._shTextures) {
            for (const shTexture of this._shTextures) {
                shTexture.dispose();
            }
        }
        this._shTextures = null;
        if (this._rotMrtAtlas) {
            // The three rotation textures are attachments of this MRT — dispose the MRT, not each attachment.
            this._rotMrtAtlas.dispose();
            this._rotMrtAtlas = null;
        }
        else {
            this._rotationsATexture?.dispose();
            this._rotationsBTexture?.dispose();
            this._rotationScaleTexture?.dispose();
        }
        this._sogParams?.codebookTexture?.dispose();
        this._rotationsATexture = null;
        this._rotationsBTexture = null;
        this._rotationScaleTexture = null;
        this._rotationDataA = null;
        this._rotationDataB = null;
        this._rotationScaleData = null;
        this._covariancesATexture = null;
        this._covariancesBTexture = null;
        this._centersTexture = null;
        this._colorsTexture = null;
        this._shTextures = null;
        this._cachedBoundingMin = null;
        this._cachedBoundingMax = null;
        // Note: _splatsData and _shData are intentionally kept alive after dispose.
        // They can still be used as runtime source buffers by a compound mesh that retained
        // this mesh's data before disposal.
        _ReleaseGsInterFrameYield(this.getEngine());
        this._worker?.terminate();
        this._worker = null;
        this.onPartCountChangedObservable.clear();
        this.onPartRemovedObservable.clear();
        // delete meshes created for each camera
        this._cameraViewInfos.forEach((cameraViewInfo) => {
            cameraViewInfo.mesh.dispose();
        });
        super.dispose(doNotRecurse, true);
    }
    _copyTextures(source) {
        this._covariancesATexture = source.covariancesATexture?.clone();
        this._covariancesBTexture = source.covariancesBTexture?.clone();
        this._centersTexture = source.centersTexture?.clone();
        this._colorsTexture = source.colorsTexture?.clone();
        if (source._shTextures) {
            this._shTextures = [];
            for (const shTexture of source._shTextures) {
                this._shTextures?.push(shTexture.clone());
            }
        }
        if (source._rotationsATexture) {
            this._rotationsATexture = source._rotationsATexture.clone();
            this._rotationsBTexture = source._rotationsBTexture?.clone();
            this._rotationScaleTexture = source._rotationScaleTexture?.clone();
        }
    }
    /**
     * Returns a new Mesh object generated from the current mesh properties.
     * @param name is a string, the name given to the new mesh
     * @returns a new Gaussian Splatting Mesh
     */
    clone(name = "") {
        const newGS = new GaussianSplattingMeshBase(name, undefined, this.getScene());
        newGS._copySource(this);
        newGS.makeGeometryUnique();
        newGS._vertexCount = this._vertexCount;
        newGS._copyTextures(this);
        newGS._modelViewProjectionMatrix = Matrix.Identity();
        newGS._splatPositions = this._splatPositions;
        newGS._readyToDisplay = false;
        newGS._hasRenderedOnce = false;
        newGS._disableDepthSort = this._disableDepthSort;
        newGS._instantiateWorker();
        const binfo = this.getBoundingInfo();
        newGS.getBoundingInfo().reConstruct(binfo.minimum, binfo.maximum, this.getWorldMatrix());
        newGS.forcedInstanceCount = this.forcedInstanceCount;
        newGS.setEnabled(true);
        return newGS;
    }
    _makeEmptySplat(index, covA, covB, colorArray) {
        const covBSItemSize = this._useRGBACovariants ? 4 : 2;
        this._splatPositions[4 * index + 0] = 0;
        this._splatPositions[4 * index + 1] = 0;
        this._splatPositions[4 * index + 2] = 0;
        covA[index * 4 + 0] = ToHalfFloat(0);
        covA[index * 4 + 1] = ToHalfFloat(0);
        covA[index * 4 + 2] = ToHalfFloat(0);
        covA[index * 4 + 3] = ToHalfFloat(0);
        covB[index * covBSItemSize + 0] = ToHalfFloat(0);
        covB[index * covBSItemSize + 1] = ToHalfFloat(0);
        colorArray[index * 4 + 3] = 0;
    }
    /**
     * Processes a single splat from the source buffer (at srcIndex) and writes the result into
     * the destination texture arrays at dstIndex. This decoupling allows addPart to feed multiple
     * independent source buffers into a single set of destination arrays without merging them first.
     * @param dstIndex - destination splat index (into _splatPositions, covA, covB, colorArray)
     * @param fBuffer - float32 view of the source .splat buffer
     * @param uBuffer - uint8 view of the source .splat buffer
     * @param covA - destination covariancesA array
     * @param covB - destination covariancesB array
     * @param colorArray - destination color array
     * @param minimum - accumulated bounding minimum (updated in-place)
     * @param maximum - accumulated bounding maximum (updated in-place)
     * @param flipY - whether to negate the Y position
     * @param srcIndex - source splat index (defaults to dstIndex when omitted)
     * @param dstArrayIndex - index into the covA/covB/colorArray transients (defaults to dstIndex). Lets a streaming
     * write pass count-sized transients indexed from 0 while dstIndex still addresses the atlas-sized _splatPositions.
     */
    _makeSplat(dstIndex, fBuffer, uBuffer, covA, covB, colorArray, minimum, maximum, flipY, srcIndex = dstIndex, dstArrayIndex = dstIndex) {
        const matrixRotation = TmpVectors.Matrix[0];
        const matrixScale = TmpVectors.Matrix[1];
        const quaternion = TmpVectors.Quaternion[0];
        const covBSItemSize = this._useRGBACovariants ? 4 : 2;
        const x = fBuffer[8 * srcIndex + 0];
        const y = fBuffer[8 * srcIndex + 1] * (flipY ? -1 : 1);
        const z = fBuffer[8 * srcIndex + 2];
        this._splatPositions[4 * dstIndex + 0] = x;
        this._splatPositions[4 * dstIndex + 1] = y;
        this._splatPositions[4 * dstIndex + 2] = z;
        minimum.minimizeInPlaceFromFloats(x, y, z);
        maximum.maximizeInPlaceFromFloats(x, y, z);
        quaternion.set((uBuffer[32 * srcIndex + 28 + 1] - 127.5) / 127.5, (uBuffer[32 * srcIndex + 28 + 2] - 127.5) / 127.5, (uBuffer[32 * srcIndex + 28 + 3] - 127.5) / 127.5, -(uBuffer[32 * srcIndex + 28 + 0] - 127.5) / 127.5);
        quaternion.normalize();
        quaternion.toRotationMatrix(matrixRotation);
        Matrix.ScalingToRef(fBuffer[8 * srcIndex + 3 + 0] * 2, fBuffer[8 * srcIndex + 3 + 1] * 2, fBuffer[8 * srcIndex + 3 + 2] * 2, matrixScale);
        if (this._needsRotationScaleTextures) {
            // Sized to the atlas (_splatPositions), not covA: these persistent arrays are indexed by the global
            // dstIndex, so a count-sized covA transient must not shrink them.
            const rotLength = this._splatPositions.length;
            if (!this._rotationDataA || this._rotationDataA.length < rotLength) {
                this._rotationDataA = new Uint16Array(rotLength);
                this._rotationDataB = new Uint16Array(rotLength);
                this._rotationScaleData = new Uint16Array(rotLength);
            }
            const rotDataA = this._rotationDataA;
            const rotDataB = this._rotationDataB;
            const rotScaleData = this._rotationScaleData;
            const rm = matrixRotation.m;
            const sm = matrixScale.m;
            rotDataA[dstIndex * 4 + 0] = ToHalfFloat(rm[0]);
            rotDataA[dstIndex * 4 + 1] = ToHalfFloat(rm[1]);
            rotDataA[dstIndex * 4 + 2] = ToHalfFloat(rm[2]);
            rotDataA[dstIndex * 4 + 3] = ToHalfFloat(rm[4]);
            rotDataB[dstIndex * 4 + 0] = ToHalfFloat(rm[5]);
            rotDataB[dstIndex * 4 + 1] = ToHalfFloat(rm[6]);
            rotDataB[dstIndex * 4 + 2] = ToHalfFloat(rm[8]);
            rotDataB[dstIndex * 4 + 3] = ToHalfFloat(rm[9]);
            rotScaleData[dstIndex * 4 + 0] = ToHalfFloat(rm[10]);
            rotScaleData[dstIndex * 4 + 1] = ToHalfFloat(sm[0]);
            rotScaleData[dstIndex * 4 + 2] = ToHalfFloat(sm[5]);
            rotScaleData[dstIndex * 4 + 3] = ToHalfFloat(sm[10]);
        }
        const m = matrixRotation.multiplyToRef(matrixScale, TmpVectors.Matrix[0]).m;
        const covariances = this._tmpCovariances;
        covariances[0] = m[0] * m[0] + m[1] * m[1] + m[2] * m[2];
        covariances[1] = m[0] * m[4] + m[1] * m[5] + m[2] * m[6];
        covariances[2] = m[0] * m[8] + m[1] * m[9] + m[2] * m[10];
        covariances[3] = m[4] * m[4] + m[5] * m[5] + m[6] * m[6];
        covariances[4] = m[4] * m[8] + m[5] * m[9] + m[6] * m[10];
        covariances[5] = m[8] * m[8] + m[9] * m[9] + m[10] * m[10];
        // normalize covA, covB
        let factor = -10000;
        for (let covIndex = 0; covIndex < 6; covIndex++) {
            factor = Math.max(factor, Math.abs(covariances[covIndex]));
        }
        this._splatPositions[4 * dstIndex + 3] = factor;
        const transform = factor;
        covA[dstArrayIndex * 4 + 0] = ToHalfFloat(covariances[0] / transform);
        covA[dstArrayIndex * 4 + 1] = ToHalfFloat(covariances[1] / transform);
        covA[dstArrayIndex * 4 + 2] = ToHalfFloat(covariances[2] / transform);
        covA[dstArrayIndex * 4 + 3] = ToHalfFloat(covariances[3] / transform);
        covB[dstArrayIndex * covBSItemSize + 0] = ToHalfFloat(covariances[4] / transform);
        covB[dstArrayIndex * covBSItemSize + 1] = ToHalfFloat(covariances[5] / transform);
        const c0 = covariances[0];
        const c1 = covariances[1];
        const c2 = covariances[2];
        const c3 = covariances[3];
        const c4 = covariances[4];
        const c5 = covariances[5];
        const det3d = c0 * (c3 * c5 - c4 * c4) - c1 * (c1 * c5 - c4 * c2) + c2 * (c1 * c4 - c3 * c2);
        const splatSize = Math.pow(Math.abs(det3d), 1.0 / 6.0);
        if (splatSize < this._splatSizeMin) {
            this._splatSizeMin = splatSize;
        }
        if (splatSize > this._splatSizeMax) {
            this._splatSizeMax = splatSize;
        }
        // colors
        colorArray[dstArrayIndex * 4 + 0] = uBuffer[32 * srcIndex + 24 + 0];
        colorArray[dstArrayIndex * 4 + 1] = uBuffer[32 * srcIndex + 24 + 1];
        colorArray[dstArrayIndex * 4 + 2] = uBuffer[32 * srcIndex + 24 + 2];
        colorArray[dstArrayIndex * 4 + 3] = uBuffer[32 * srcIndex + 24 + 3];
    }
    _onUpdateTextures(_textureSize) { }
    /**
     * Called when part index data is received during a data load. Override to store and manage
     * part index state (e.g. allocating the padded Uint8Array).
     * No-op in the base class.
     * @param _partIndices - the raw part indices passed in by the caller
     * @param _textureLength - the padded texture length (width × height) to allocate into
     */
    _onIndexDataReceived(_partIndices, _textureLength) { }
    /**
     * Called at the start of an incremental texture update, before any splats are processed.
     * Override to perform incremental-specific setup, such as ensuring the part-index GPU texture
     * exists before the sub-texture upload begins.
     * No-op in the base class.
     * @param _textureSize - current texture dimensions
     */
    _onIncrementalUpdateStart(_textureSize) { }
    /**
     * Whether this mesh is in compound mode (has at least one part added via addPart).
     * Returns `false` in the base class; overridden to return `true` in the compound subclass.
     * Consumed by the material and depth renderer to toggle compound-specific shader paths.
     * @internal
     */
    get isCompound() {
        return false;
    }
    _setDelayedTextureUpdate(covA, covB, colorArray, sh) {
        this._delayedTextureUpdate = { covA, covB, colors: colorArray, centers: this._splatPositions, sh };
    }
    /**
     * Creates (or recreates) the MRT-backed data atlas at the given size and points the four core data
     * textures at its attachments. The attachments use the same decoded GS layout as {@link GaussianSplattingWorkBuffer}
     * — [centers F32, covA HALF_FLOAT, covB HALF_FLOAT, colors U8], all RGBA — so a streaming engine can render
     * (decode/relayout) directly into the same textures the GS material samples, while static parts CPU-upload
     * into them via {@link _updateSubTextures}. Covariance B is RGBA here (its extra channels unused), so the
     * atlas forces {@link _useRGBACovariants}.
     * @param textureSize atlas dimensions (width, height)
     */
    _createMrtAtlas(textureSize) {
        // covB carries only Sigma12/Sigma22 but MRT attachments are RGBA, so switch to the RGBA covariant layout.
        this._useRGBACovariants = true;
        const engine = this.getEngine();
        // No real GPU (NullEngine): skip MRT allocation. The reservation's part/index/range logic still runs;
        // texture population requires a real (WebGL2/WebGPU) backend.
        const updateEngine = this._getTextureDataUpdateEngine();
        if (!updateEngine._gl && !updateEngine.isWebGPU) {
            return;
        }
        const covType = engine.getCaps().textureHalfFloatRender ? 2 : 1;
        const mrt = new MultiRenderTarget(this.name + "_gsAtlas", { width: textureSize.x, height: textureSize.y }, 4, this._scene, {
            types: [1, covType, covType, 0],
            formats: [5, 5, 5, 5],
            samplingModes: [
                1,
                1,
                1,
                1,
            ],
            generateDepthBuffer: false,
            generateDepthTexture: false,
            generateMipMaps: false,
        }, [this.name + "_gsCenters", this.name + "_gsCovA", this.name + "_gsCovB", this.name + "_gsColors"]);
        mrt.clearColor = new Color4(0, 0, 0, 0);
        mrt.renderList = [];
        // Suppress clearing so a streaming engine's decode passes ACCUMULATE into the atlas (each decode writes
        // only its region and must not wipe static parts or previously-decoded splats). All texels are defined by
        // the initial full CPU sub-upload below (the reserved region's arrays are zero => invisible padding).
        mrt.onClearObservable.add(() => { });
        // Render once so the attachment textures are really allocated on the GPU before the CPU sub-uploads
        // below (on WebGPU, writeTexture requires the destination texture to already exist).
        mrt.render();
        this._mrtAtlas = mrt;
        this._centersTexture = mrt.textures[0];
        this._covariancesATexture = mrt.textures[1];
        this._covariancesBTexture = mrt.textures[2];
        this._colorsTexture = mrt.textures[3];
    }
    /**
     * Creates the shared higher-order SH atlas: `_shMrtAtlasTextureCount` single-attachment integer render targets
     * (RGBA_INTEGER / UNSIGNED_INTEGER, packed-u32), sized to the whole atlas, so a streaming engine can GPU-decode
     * baked SH into the reserved region and static SH parts CPU-upload into the same attachments. `_shTextures` (the
     * draw path's `shTexture0..N` samplers) are the attachments. One MRT per attachment keeps within WebGPU's
     * per-sample color-attachment byte budget. No-op without a real GPU backend (mirrors {@link _createMrtAtlas}).
     * @param textureSize atlas dimensions (width, height)
     */
    _createShMrtAtlas(textureSize) {
        const updateEngine = this._getTextureDataUpdateEngine();
        if (!updateEngine._gl && !updateEngine.isWebGPU) {
            return;
        }
        const count = this._shMrtAtlasTextureCount;
        if (count <= 0) {
            return;
        }
        const mrts = [];
        const shTextures = [];
        for (let k = 0; k < count; k++) {
            const name = `${this.name}_gsShAtlas${k}`;
            const mrt = new MultiRenderTarget(name, { width: textureSize.x, height: textureSize.y }, 1, this._scene, {
                types: [7],
                formats: [11],
                samplingModes: [1],
                generateDepthBuffer: false,
                generateDepthTexture: false,
                generateMipMaps: false,
            }, [name]);
            mrt.clearColor = new Color4(0, 0, 0, 0);
            mrt.renderList = [];
            // Accumulate: each SH decode writes only its region; the rest stays whatever was there (neutral for a
            // fresh atlas — 128 == 0 lighting is guaranteed by decoding every splat's region, incl. no-SH files).
            mrt.onClearObservable.add(() => { });
            const attachment = mrt.textures[0];
            attachment.wrapU = 0;
            attachment.wrapV = 0;
            // Allocate on the GPU before any CPU sub-upload (WebGPU writeTexture needs the resource to exist).
            mrt.render();
            mrts.push(mrt);
            shTextures.push(attachment);
        }
        this._shMrtAtlas = mrts;
        this._shTextures = shTextures;
    }
    /**
     * Creates the shared rotation/scale atlas: one 3-attachment half-float render target ([rotA, rotB, rotScale])
     * sized to the whole atlas, so a streaming engine can GPU-decode rotation/scale into the reserved region and
     * static parts CPU-upload into the same attachments. `_rotationsATexture`/`_rotationsBTexture`/
     * `_rotationScaleTexture` (the voxel-IBL samplers) become the three attachments. No-op without a real GPU
     * backend (mirrors {@link _createMrtAtlas}).
     * @param textureSize atlas dimensions (width, height)
     */
    _createRotMrtAtlas(textureSize) {
        const updateEngine = this._getTextureDataUpdateEngine();
        if (!updateEngine._gl && !updateEngine.isWebGPU) {
            return;
        }
        const rotType = this.getEngine().getCaps().textureHalfFloatRender ? 2 : 1;
        const name = this.name + "_gsRotAtlas";
        const mrt = new MultiRenderTarget(name, { width: textureSize.x, height: textureSize.y }, 3, this._scene, {
            types: [rotType, rotType, rotType],
            formats: [5, 5, 5],
            samplingModes: [1, 1, 1],
            generateDepthBuffer: false,
            generateDepthTexture: false,
            generateMipMaps: false,
        }, [name + "A", name + "B", name + "Scale"]);
        mrt.clearColor = new Color4(0, 0, 0, 0);
        mrt.renderList = [];
        // Accumulate: each rotation decode writes only its region; the rest stays whatever was there.
        mrt.onClearObservable.add(() => { });
        for (const attachment of mrt.textures) {
            attachment.wrapU = 0;
            attachment.wrapV = 0;
        }
        // Allocate on the GPU before any CPU sub-upload (WebGPU writeTexture needs the resource to exist).
        mrt.render();
        this._rotMrtAtlas = mrt;
        this._rotationsATexture = mrt.textures[0];
        this._rotationsBTexture = mrt.textures[1];
        this._rotationScaleTexture = mrt.textures[2];
    }
    // NB: partIndices is assumed to be padded to a round texture size
    _updateTextures(covA, covB, colorArray, sh) {
        const textureSize = this._getTextureSize(this._vertexCount);
        // Update the textures
        const createTextureFromData = (data, width, height, format) => {
            return new RawTexture(data, width, height, format, this._scene, false, false, 2, 1);
        };
        const createTextureFromDataU8 = (data, width, height, format) => {
            return new RawTexture(data, width, height, format, this._scene, false, false, 2, 0);
        };
        const createEmptyTextureU32 = (width, height, format) => {
            return new RawTexture(null, width, height, format, this._scene, false, false, 1, 7);
        };
        const createTextureFromDataF16 = (data, width, height, format) => {
            return new RawTexture(data, width, height, format, this._scene, false, false, 2, 2);
        };
        const firstTime = this._covariancesATexture === null;
        const textureSizeChanged = this._textureSize.y != textureSize.y;
        // The render-backed SH atlas must have one attachment per SH texture the material samples, i.e. sized to the
        // compound's MERGED SH degree (`sh` spans static + streaming), not just the streaming parts' requested count —
        // otherwise a lower-degree stream mixed with a higher-degree static part (or a later higher-degree stream)
        // leaves the atlas undersized. `sh` is always present when a streaming SH part is live (its degree makes it so).
        if (this._useShMrtAtlas && sh) {
            this._shMrtAtlasTextureCount = sh.length;
        }
        // First streaming-part reservation must convert the existing RawTexture atlas to the MRT-backed atlas,
        // which requires the full (re)build branch even when the texture height is unchanged. Same for the SH atlas:
        // a streaming SH part must convert the SH textures to render-targetable integer MRTs (and recreate them when
        // the required attachment count changes).
        const needsMrtConversion = (this._useMrtAtlas && !this._mrtAtlas) ||
            (this._useShMrtAtlas && (!this._shMrtAtlas || this._shMrtAtlas.length !== this._shMrtAtlasTextureCount)) ||
            (this._useRotMrtAtlas && !this._rotMrtAtlas);
        if (!firstTime && !textureSizeChanged && !needsMrtConversion) {
            this._setDelayedTextureUpdate(covA, covB, colorArray, sh);
            const positions = Float32Array.from(this._splatPositions);
            const vertexCount = this._vertexCount;
            if (this._worker) {
                this._worker.postMessage({ command: GaussianSplattingSortWorkerCommand.POSITIONS, positions, vertexCount }, [positions.buffer]);
                // Re-sync the active interval set in case the source splat count changed.
                this._postIntervalsToWorker();
            }
            // Handle SH textures in update path - create if they don't exist. Skip when the SH atlas is
            // render-backed (_useShMrtAtlas): those targets are created/managed by _createShMrtAtlas, not here.
            if (sh && !this._shTextures && !this._useShMrtAtlas) {
                this._shTextures = [];
                for (let textureIndex = 0; textureIndex < sh.length; textureIndex++) {
                    const shTexture = createEmptyTextureU32(textureSize.x, textureSize.y, 11);
                    shTexture.wrapU = 0;
                    shTexture.wrapV = 0;
                    this._shTextures.push(shTexture);
                    this._updateShTextureData(shTexture, sh[textureIndex], textureSize.x, 0, textureSize.y);
                }
            }
            if (this._needsRotationScaleTextures && this._rotationDataA) {
                if (this._rotationsATexture) {
                    this._updateTextureFromData(this._rotationsATexture, this._rotationDataA, textureSize.x, 0, textureSize.y);
                    this._updateTextureFromData(this._rotationsBTexture, this._rotationDataB, textureSize.x, 0, textureSize.y);
                    this._updateTextureFromData(this._rotationScaleTexture, this._rotationScaleData, textureSize.x, 0, textureSize.y);
                }
                else {
                    // Rotation textures not yet created (needsRotationScaleTextures was enabled after initial load).
                    this._rotationsATexture = createTextureFromDataF16(this._rotationDataA, textureSize.x, textureSize.y, 5);
                    this._rotationsBTexture = createTextureFromDataF16(this._rotationDataB, textureSize.x, textureSize.y, 5);
                    this._rotationScaleTexture = createTextureFromDataF16(this._rotationScaleData, textureSize.x, textureSize.y, 5);
                    this._rotationsATexture.wrapU = 0;
                    this._rotationsATexture.wrapV = 0;
                    this._rotationsBTexture.wrapU = 0;
                    this._rotationsBTexture.wrapV = 0;
                    this._rotationScaleTexture.wrapU = 0;
                    this._rotationScaleTexture.wrapV = 0;
                }
            }
            this._onUpdateTextures(textureSize);
            this._postToWorker(true);
        }
        else {
            // Full rebuild: the texture size changed (or this is a size-changing reload), so the existing
            // GPU textures cannot be reused. Dispose them before recreating to avoid leaking the old ones.
            // Growing an EXISTING MRT atlas: let streaming parts back up their GPU-only region from the old atlas
            // before it is disposed (they restore it into the new atlas via _onAfterAtlasRebuildObservable).
            const growingMrtAtlas = this._useMrtAtlas && !!this._mrtAtlas;
            if (growingMrtAtlas) {
                this._onBeforeAtlasRebuildObservable.notifyObservers(this._mrtAtlas);
            }
            if (this._mrtAtlas) {
                // The four data textures are attachments of this MRT — dispose the MRT, not each attachment.
                this._mrtAtlas.dispose();
                this._mrtAtlas = null;
                this._covariancesATexture = this._covariancesBTexture = this._centersTexture = this._colorsTexture = null;
            }
            else {
                this._covariancesATexture?.dispose();
                this._covariancesBTexture?.dispose();
                this._centersTexture?.dispose();
                this._colorsTexture?.dispose();
            }
            // Dispose+null the rotation/scale textures before the MRT-branch _updateSubTextures below: that helper
            // also writes the rotation textures, so leaving them at the old (smaller) height would upload the taller
            // region out of bounds. Nulling them makes it skip rotation; the block further down recreates them.
            if (this._rotMrtAtlas) {
                // The three rotation textures are attachments of this MRT — dispose the MRT, not each attachment.
                this._rotMrtAtlas.dispose();
                this._rotMrtAtlas = null;
                this._rotationsATexture = null;
                this._rotationsBTexture = null;
                this._rotationScaleTexture = null;
            }
            else if (this._rotationsATexture) {
                this._rotationsATexture.dispose();
                this._rotationsBTexture?.dispose();
                this._rotationScaleTexture?.dispose();
                this._rotationsATexture = null;
                this._rotationsBTexture = null;
                this._rotationScaleTexture = null;
            }
            if (this._shTextures) {
                // SH attachments belong to _shMrtAtlas MRTs (dispose the MRT, not each attachment) when render-backed.
                if (this._shMrtAtlas) {
                    for (const mrt of this._shMrtAtlas) {
                        mrt.dispose();
                    }
                    // Defence in depth: free any _shTextures entries beyond the MRT-backed set (see dispose()).
                    for (let k = this._shMrtAtlas.length; k < this._shTextures.length; k++) {
                        this._shTextures[k].dispose();
                    }
                    this._shMrtAtlas = null;
                }
                else {
                    for (const shTexture of this._shTextures) {
                        shTexture.dispose();
                    }
                }
                this._shTextures = null;
            }
            this._textureSize = textureSize;
            if (this._useMrtAtlas) {
                // Back the four data textures with a render-targetable MRT so a streaming engine can decode
                // into the reserved region; static splats are CPU-uploaded into the same attachments below.
                this._createMrtAtlas(textureSize);
                // Same for the higher-order SH atlas (integer render targets), when a streaming part needs baked SH.
                if (this._useShMrtAtlas) {
                    this._createShMrtAtlas(textureSize);
                }
                // Same for the rotation/scale atlas (half-float), created before the _updateSubTextures below so
                // static parts' CPU rotation data lands in the shared attachments (streamed rows are decoded after).
                if (this._useRotMrtAtlas) {
                    this._createRotMrtAtlas(textureSize);
                }
                if (this._mrtAtlas) {
                    this._updateSubTextures(this._splatPositions, covA, covB, colorArray, 0, textureSize.y);
                    // Render-backed SH: CPU-upload the static parts' SH into the shared SH atlas HERE — before the
                    // streaming restore below — so a streamed region's restored SH wins over the bulk (neutral) fill,
                    // exactly like the core atlas's _updateSubTextures-then-restore ordering. (`sh` covers the whole
                    // atlas; streamed rows are neutral in it and get overwritten by the restore.)
                    if (this._useShMrtAtlas && sh) {
                        const shTex = this._shTextures;
                        if (shTex) {
                            for (let textureIndex = 0; textureIndex < sh.length && textureIndex < shTex.length; textureIndex++) {
                                this._updateShTextureData(shTex[textureIndex], sh[textureIndex], textureSize.x, 0, textureSize.y);
                            }
                        }
                    }
                    // New atlas is populated (streamed regions currently zeroed); let streaming parts rebind and
                    // restore their backed-up region into it, overwriting those zeros with the preserved data.
                    if (growingMrtAtlas) {
                        this._onAfterAtlasRebuildObservable.notifyObservers(this._mrtAtlas);
                    }
                }
            }
            else {
                this._covariancesATexture = createTextureFromDataF16(covA, textureSize.x, textureSize.y, 5);
                this._covariancesBTexture = createTextureFromDataF16(covB, textureSize.x, textureSize.y, this._useRGBACovariants ? 5 : 7);
                this._centersTexture = createTextureFromData(this._splatPositions, textureSize.x, textureSize.y, 5);
                this._colorsTexture = createTextureFromDataU8(colorArray, textureSize.x, textureSize.y, 5);
            }
            // Render-backed SH (_useShMrtAtlas) was already CPU-uploaded above (before the streaming restore); only
            // the plain RawTexture SH path is handled here.
            if (sh && !this._useShMrtAtlas) {
                {
                    this._shTextures = [];
                    for (let textureIndex = 0; textureIndex < sh.length; textureIndex++) {
                        const shTexture = createEmptyTextureU32(textureSize.x, textureSize.y, 11);
                        shTexture.wrapU = 0;
                        shTexture.wrapV = 0;
                        this._shTextures.push(shTexture);
                    }
                    for (let textureIndex = 0; textureIndex < sh.length; textureIndex++) {
                        this._updateShTextureData(this._shTextures[textureIndex], sh[textureIndex], textureSize.x, 0, textureSize.y);
                    }
                }
            }
            // Render-backed rotation (_useRotMrtAtlas) was already created + CPU-uploaded above (via _updateSubTextures,
            // before the streaming restore); only the plain RawTexture rotation path is handled here.
            if (this._needsRotationScaleTextures && !this._useRotMrtAtlas) {
                const rotDataA = this._rotationDataA ?? new Uint16Array(covA.length);
                const rotDataB = this._rotationDataB ?? new Uint16Array(covA.length);
                const rotScaleData = this._rotationScaleData ?? new Uint16Array(covA.length);
                // Already disposed+nulled in the rebuild's disposal block above; just (re)create at the new size.
                this._rotationsATexture = createTextureFromDataF16(rotDataA, textureSize.x, textureSize.y, 5);
                this._rotationsBTexture = createTextureFromDataF16(rotDataB, textureSize.x, textureSize.y, 5);
                this._rotationScaleTexture = createTextureFromDataF16(rotScaleData, textureSize.x, textureSize.y, 5);
                this._rotationsATexture.wrapU = 0;
                this._rotationsATexture.wrapV = 0;
                this._rotationsBTexture.wrapU = 0;
                this._rotationsBTexture.wrapV = 0;
                this._rotationScaleTexture.wrapU = 0;
                this._rotationScaleTexture.wrapV = 0;
            }
            this._onUpdateTextures(textureSize);
            if (firstTime) {
                this._instantiateWorker();
            }
            else {
                if (this._worker) {
                    const positions = Float32Array.from(this._splatPositions);
                    const vertexCount = this._vertexCount;
                    this._worker.postMessage({ command: GaussianSplattingSortWorkerCommand.POSITIONS, positions, vertexCount }, [positions.buffer]);
                    // Re-sync the active interval set in case the source splat count changed.
                    this._postIntervalsToWorker();
                }
                this._postToWorker(true);
            }
        }
    }
    /**
     * Checks whether the GPU textures can be incrementally updated for a new addPart operation,
     * avoiding a full texture re-upload for existing splats.
     * Requires that the GPU textures already exist and the texture height won't change.
     * @param previousVertexCount - The number of splats previously committed to GPU
     * @param vertexCount - The new total number of splats
     * @param requiredShTextureCount - SH texture count this update requires (the merged `sh.length`), 0 when no SH
     * @returns true when only the new splat region needs to be uploaded
     */
    _canReuseCachedData(previousVertexCount, vertexCount, requiredShTextureCount = 0) {
        if (previousVertexCount <= 0 || previousVertexCount > vertexCount) {
            return false;
        }
        if (this._splatPositions === null || this._cachedBoundingMin === null || this._cachedBoundingMax === null) {
            return false;
        }
        if (this._covariancesATexture === null) {
            return false;
        }
        // Switching to (or resizing) a render-backed atlas requires a full rebuild so the affected textures are
        // recreated as MRT attachments — the incremental sub-upload path cannot convert them. These must mirror the
        // `needsMrtConversion` checks in _updateTextures: if they disagree, an incremental data prep (which fills only
        // the new splats) would be paired with a full-rebuild upload (which uploads the whole array), zeroing the
        // existing parts. Covers the first streaming reservation, a later part that introduces/grows SH, and rotation.
        if (this._useMrtAtlas && !this._mrtAtlas) {
            return false;
        }
        // Compare against the count this update requires, not `_shMrtAtlasTextureCount` — that field is refreshed
        // only in _updateTextures (skipped on the incremental path), so a higher-degree addPart would pass the guard
        // on a stale count and never grow the SH atlas.
        if (this._useShMrtAtlas && (!this._shMrtAtlas || this._shMrtAtlas.length !== requiredShTextureCount)) {
            return false;
        }
        if (this._useRotMrtAtlas && !this._rotMrtAtlas) {
            return false;
        }
        // Can only do an incremental GPU update if texture height doesn't need to grow
        const newTextureSize = this._getTextureSize(vertexCount);
        return newTextureSize.y === this._textureSize.y;
    }
    /**
     * Posts updated positions to the sort worker and marks the sort as dirty.
     * Called after processing new splats so the worker can re-sort with the complete position set.
     * Subclasses (e.g. compound) may override to additionally post part-index data.
     */
    _notifyWorkerNewData() {
        if (this._worker) {
            const positions = Float32Array.from(this._splatPositions);
            const vertexCount = this._vertexCount;
            this._worker.postMessage({ command: GaussianSplattingSortWorkerCommand.POSITIONS, positions, vertexCount }, [positions.buffer]);
            // The source splat count may have changed (e.g. addPart): re-sync the worker's active
            // interval set so it covers the current splats instead of a stale (smaller) range.
            this._postIntervalsToWorker();
        }
        this._sortIsDirty = true;
    }
    /**
     * Patches only a contiguous range of source-splat centers in the sort worker, instead of re-copying and
     * transferring the entire position buffer (which is hundreds of MB for large streamed datasets and caused
     * a multi-frame freeze on every LOD decode). The worker must already hold a full-size position buffer (from
     * the initial {@link GaussianSplattingSortWorkerCommand.POSITIONS} message at worker creation). Marks the
     * sort dirty so the new splats are sorted in; the caller is responsible for any interval/range refresh.
     * @param splatOffset first splat index of the updated range
     * @param splatCount number of splats in the updated range
     */
    _postWorkerPositionsRange(splatOffset, splatCount) {
        if (!this._worker || !this._splatPositions || splatCount <= 0) {
            return;
        }
        const floatOffset = splatOffset * 4;
        // Copy just the changed region (stride 4) so the main thread keeps its own _splatPositions intact.
        const data = this._splatPositions.slice(floatOffset, floatOffset + splatCount * 4);
        this._worker.postMessage({ command: GaussianSplattingSortWorkerCommand.POSITIONS_UPDATE, offset: floatOffset, data }, [data.buffer]);
        this._sortIsDirty = true;
    }
    /**
     * Decodes raw `.splat` bytes (32 bytes/splat) into a contiguous sub-range of the already-allocated atlas,
     * uploading only the affected texels (never touching neighboring parts' texels) and patching just that
     * range of positions in the sort worker. Used to populate a region reserved by
     * {@link GaussianSplattingMesh.reserveStreamingPart} — the CPU path a streaming engine uses when GPU
     * decode/readback is unavailable, and the seam that verifies reservation + interleaving before the
     * streaming engine exists.
     *
     * The atlas textures and `_splatPositions` must already be sized to cover `[globalOffset, globalOffset+count)`
     * (guaranteed after `reserveStreamingPart`). Bounds of the written centers are accumulated into `min`/`max`
     * when provided (so the caller can grow the owning part's bounding info).
     * @param globalOffset first atlas splat index to write
     * @param count number of splats to write
     * @param splatsData raw `.splat` bytes for `count` splats (stride 32)
     * @param min optional running min accumulator for the written centers
     * @param max optional running max accumulator for the written centers
     */
    _writeStreamingSplats(globalOffset, count, splatsData, min, max) {
        if (!this._splatPositions) {
            return;
        }
        // Validate the range against the atlas and the input length (independent of GPU state): an out-of-range
        // offset/count would write over another part's texels or allocate a huge transient (the CPU arrays are
        // atlas-indexed up to `end`); a short input would read past its end.
        const capacity = this._splatPositions.length / 4;
        const uBuffer = GaussianSplattingMeshBase._GetSplatDataBytes(splatsData);
        if (!Number.isInteger(globalOffset) || !Number.isInteger(count) || globalOffset < 0 || count < 0 || globalOffset + count > capacity) {
            throw new Error(`_writeStreamingSplats: range [${globalOffset}, ${globalOffset + count}) is outside the atlas bounds [0, ${capacity})`);
        }
        if (uBuffer.length < count * 32) {
            throw new Error(`_writeStreamingSplats: splatsData has ${uBuffer.length} bytes, need ${count * 32} for ${count} splats (stride 32)`);
        }
        if (count === 0 || !this._covariancesATexture) {
            return;
        }
        const textureSize = this._getTextureSize(this._vertexCount);
        const width = textureSize.x;
        const covBSItemSize = this._useRGBACovariants ? 4 : 2;
        const end = globalOffset + count;
        const fBuffer = GaussianSplattingMeshBase._GetSplatDataFloats(splatsData);
        // Transients are sized to `count`, not `end` (globalOffset + count): sizing by atlas position would allocate
        // tens of MB for a small write near a large atlas's tail. dstIndex still addresses the atlas _splatPositions.
        const covA = new Uint16Array(count * 4);
        const covB = new Uint16Array(count * covBSItemSize);
        const colorArray = new Uint8Array(count * 4);
        const localMin = min ?? new Vector3(Number.MAX_VALUE, Number.MAX_VALUE, Number.MAX_VALUE);
        const localMax = max ?? new Vector3(-Number.MAX_VALUE, -Number.MAX_VALUE, -Number.MAX_VALUE);
        for (let i = 0; i < count; i++) {
            this._makeSplat(globalOffset + i, fBuffer, uBuffer, covA, covB, colorArray, localMin, localMax, this._flipY, i, i);
        }
        // Retain the written bytes so future full rebuilds / picking see the region's real data.
        if (this._splatsData) {
            const dst = new Uint8Array(GaussianSplattingMeshBase._GetSplatDataBytes(this._splatsData).buffer);
            dst.set(uBuffer.subarray(0, count * 32), globalOffset * 32);
        }
        // Upload only the written texels, one contiguous per-row run at a time (rectangular sub-uploads never
        // clobber texels outside [globalOffset, end), so neighboring parts on a shared boundary row are safe).
        const positions = this._splatPositions;
        let gi = globalOffset;
        while (gi < end) {
            const row = Math.floor(gi / width);
            const runEnd = Math.min(end, (row + 1) * width);
            const col = gi - row * width;
            const runLen = runEnd - gi;
            // covA/covB/colorArray are count-sized (0-based), so rebase by globalOffset; positions stays global.
            const li = gi - globalOffset;
            this._updateTextureFromDataRect(this._covariancesATexture, new Uint16Array(covA.buffer, li * 4 * 2, runLen * 4), col, row, runLen, 1);
            this._updateTextureFromDataRect(this._covariancesBTexture, new Uint16Array(covB.buffer, li * covBSItemSize * 2, runLen * covBSItemSize), col, row, runLen, 1);
            this._updateTextureFromDataRect(this._centersTexture, new Float32Array(positions.buffer, gi * 4 * 4, runLen * 4), col, row, runLen, 1);
            this._updateTextureFromDataRect(this._colorsTexture, new Uint8Array(colorArray.buffer, li * 4, runLen * 4), col, row, runLen, 1);
            gi = runEnd;
        }
        this._postWorkerPositionsRange(globalOffset, count);
    }
    *_updateData(data, isAsync, sh, partIndices, { flipY = false, previousVertexCount = 0 } = {}, shDegree) {
        if (!this._covariancesATexture) {
            this._readyToDisplay = false;
        }
        this._flipY = flipY;
        const uBuffer = new Uint8Array(data);
        const fBuffer = new Float32Array(uBuffer.buffer);
        // Optionally store the raw splat buffer as an ArrayBuffer. This is the source reference
        // used by _addPartsInternal when a full texture rebuild is needed. Use uBuffer.buffer as
        // the canonical backing store — it is always a tightly packed ArrayBuffer containing
        // exactly the bytes we processed, avoiding issues with ArrayBufferView.byteOffset.
        if (this._keepInRam || this._alwaysRetainSplatsData) {
            this._splatsData = uBuffer.buffer;
            this._shData = sh ? sh.map((arr) => new Uint8Array(arr)) : null;
        }
        else {
            this._splatsData = null;
            this._shData = null;
        }
        const vertexCount = uBuffer.length / GaussianSplattingMeshBase._RowOutputLength;
        if (vertexCount != this._vertexCount) {
            // The source set changed: drop any active range filter so the buffers resize to the full
            // set. Callers (e.g. streaming LOD) re-apply their ranges after the data is committed.
            this._activeSplatRanges = null;
            this._activeSplatRangeKey = "";
            this._activeSplatRenderCount = 0;
            this._updateSplatIndexBuffer(vertexCount);
        }
        this._vertexCount = vertexCount;
        this._maxShDegree = sh ? (shDegree ?? 0) : 0;
        this._shDegree = this._maxShDegree;
        const textureSize = this._getTextureSize(vertexCount);
        const textureLength = textureSize.x * textureSize.y;
        const lineCountUpdate = GaussianSplattingMeshBase.ProgressiveUpdateAmount ?? textureSize.y;
        // Delegate part index storage to subclasses (e.g. GaussianSplattingMesh compound mode).
        if (partIndices) {
            this._onIndexDataReceived(partIndices, textureLength);
        }
        const minimum = new Vector3(Number.MAX_VALUE, Number.MAX_VALUE, Number.MAX_VALUE);
        const maximum = new Vector3(-Number.MAX_VALUE, -Number.MAX_VALUE, -Number.MAX_VALUE);
        const covBSItemSize = this._useRGBACovariants ? 4 : 2;
        const covA = new Uint16Array(textureLength * 4);
        const covB = new Uint16Array(covBSItemSize * textureLength);
        const colorArray = new Uint8Array(textureLength * 4);
        // Incremental path: only upload the rows that contain new splats, leaving the already-committed
        // GPU region untouched. Falls through to the full-rebuild path when textures don't exist yet
        // or the texture height needs to grow.
        const incremental = this._canReuseCachedData(previousVertexCount, vertexCount, sh?.length ?? 0);
        if (!incremental) {
            this._splatSizeMin = Infinity;
            this._splatSizeMax = -Infinity;
        }
        // The first texture line/texel that must be (re-)processed and uploaded.
        // For a full rebuild this is 0. For an incremental update it is the row boundary just before
        // previousVertexCount so that any partial old row is re-processed as a complete row.
        const firstNewLine = incremental ? Math.floor(previousVertexCount / textureSize.x) : 0;
        const firstNewTexel = firstNewLine * textureSize.x;
        // Preserve old positions before replacing the array (incremental only)
        const oldPositions = this._splatPositions;
        this._splatPositions = new Float32Array(4 * textureLength);
        if (incremental) {
            this._splatPositions.set(oldPositions.subarray(0, previousVertexCount * 4));
            minimum.copyFrom(this._cachedBoundingMin);
            maximum.copyFrom(this._cachedBoundingMax);
            // Let subclasses handle any incremental-specific setup (e.g. ensuring part-index textures)
            this._onIncrementalUpdateStart(textureSize);
        }
        if (GaussianSplattingMeshBase.ProgressiveUpdateAmount) {
            // Full rebuild: create GPU textures upfront with empty data; the loop fills them in batches via _updateSubTextures
            if (!incremental) {
                this._updateTextures(covA, covB, colorArray, sh);
            }
            this.setEnabled(true);
            const partCount = Math.ceil(textureSize.y / lineCountUpdate);
            for (let partIndex = 0; partIndex < partCount; partIndex++) {
                const updateLine = partIndex * lineCountUpdate;
                const batchEndLine = Math.min(updateLine + lineCountUpdate, textureSize.y);
                // Skip batches that lie entirely within the already-committed GPU region
                if (batchEndLine <= firstNewLine) {
                    continue;
                }
                // Clip upload start to firstNewLine to avoid overwriting committed data with zeros
                const uploadStartLine = Math.max(updateLine, firstNewLine);
                const uploadStartTexel = uploadStartLine * textureSize.x;
                const batchEndTexel = batchEndLine * textureSize.x;
                for (let splatIdx = uploadStartTexel; splatIdx < batchEndTexel; splatIdx++) {
                    if (splatIdx < vertexCount) {
                        this._makeSplat(splatIdx, fBuffer, uBuffer, covA, covB, colorArray, minimum, maximum, flipY);
                    }
                    else {
                        this._makeEmptySplat(splatIdx, covA, covB, colorArray);
                    }
                }
                this._updateSubTextures(this._splatPositions, covA, covB, colorArray, uploadStartLine, batchEndLine - uploadStartLine, sh);
                this.getBoundingInfo().reConstruct(minimum, maximum, this.getWorldMatrix());
                if (isAsync) {
                    yield;
                }
            }
            this._notifyWorkerNewData();
        }
        else {
            // Process splats from firstNewTexel: re-processes the partial old row (incremental) or processes everything from 0 (full rebuild)
            for (let i = firstNewTexel; i < vertexCount; i++) {
                this._makeSplat(i, fBuffer, uBuffer, covA, covB, colorArray, minimum, maximum, flipY);
                if (isAsync && i % GaussianSplattingMeshBase._SplatBatchSize === 0) {
                    yield;
                }
            }
            // Incremental pads the full texture; full rebuild pads only to the next 16-splat boundary
            const paddedEnd = incremental ? textureLength : (vertexCount + 15) & ~0xf;
            for (let i = vertexCount; i < paddedEnd; i++) {
                this._makeEmptySplat(i, covA, covB, colorArray);
            }
            if (incremental) {
                // Partial upload: only rows from firstNewLine onwards; existing rows stay on GPU
                this._updateSubTextures(this._splatPositions, covA, covB, colorArray, firstNewLine, textureSize.y - firstNewLine, sh);
                this.getBoundingInfo().reConstruct(minimum, maximum, this.getWorldMatrix());
                this.setEnabled(true);
                this._notifyWorkerNewData();
            }
            else {
                // Full upload: create or replace all GPU textures
                this._updateTextures(covA, covB, colorArray, sh);
                this.getBoundingInfo().reConstruct(minimum, maximum, this.getWorldMatrix());
                this.setEnabled(true);
                this._sortIsDirty = true;
            }
        }
        // Cache bounding box for the next incremental addPart call
        this._cachedBoundingMin = minimum.clone();
        this._cachedBoundingMax = maximum.clone();
        this._postToWorker(true);
    }
    /**
     * Update asynchronously the buffer
     * @param data array buffer containing center, color, orientation and scale of splats
     * @param sh optional array of uint8 array for SH data
     * @param partIndices optional array of uint8 for rig node indices
     * @param shDegree optional SH degree of the data
     * @returns a promise
     */
    async updateDataAsync(data, sh, partIndices, shDegree) {
        return await runCoroutineAsync(this._updateData(data, true, sh, partIndices, undefined, shDegree), createYieldingScheduler());
    }
    /**
     * @experimental
     * Update data from GS (position, orientation, color, scaling)
     * @param data array that contain all the datas
     * @param sh optional array of uint8 array for SH data
     * @param options optional informations on how to treat data (needs to be 3rd for backward compatibility)
     * @param partIndices optional array of uint8 for rig node indices
     * @param shDegree optional SH degree of the data
     */
    updateData(data, sh, options = { flipY: true }, partIndices, shDegree) {
        runCoroutineSync(this._updateData(data, false, sh, partIndices, options, shDegree));
    }
    /**
     * Refreshes the bounding info, taking into account all the thin instances defined
     * @returns the current Gaussian Splatting
     */
    refreshBoundingInfo() {
        this.thinInstanceRefreshBoundingInfo(false);
        return this;
    }
    // in case size is different
    _updateSplatIndexBuffer(vertexCount) {
        const renderedSplatCount = this._activeSplatRanges ? this._activeSplatRenderCount : vertexCount;
        const paddedVertexCount = Math.max((renderedSplatCount + 15) & ~0xf, 16);
        const previousIndex = this._splatIndex;
        if (!previousIndex || paddedVertexCount !== previousIndex.length) {
            this._splatIndex = new Float32Array(paddedVertexCount);
            // update meshes for knowns cameras
            this._cameraViewInfos.forEach((cameraViewInfos) => {
                cameraViewInfos.mesh.thinInstanceSetBuffer("splatIndex", this._splatIndex, 16, false);
            });
        }
        const splatIndex = this._splatIndex;
        // Populate the buffer with the current active source indices (identity when unfiltered) so every
        // rendered slot points at a valid splat. This is the synchronous (no async sort worker) path; the
        // worker path instead defers the index-buffer swap until a matching sort lands (see _onWorkerCreated).
        if (this._activeSplatRanges) {
            let index = 0;
            for (let rangeIndex = 0; rangeIndex < this._activeSplatRanges.length; rangeIndex += 2) {
                const start = this._activeSplatRanges[rangeIndex];
                const count = this._activeSplatRanges[rangeIndex + 1];
                for (let sourceIndex = start; sourceIndex < start + count; sourceIndex++) {
                    splatIndex[index++] = sourceIndex;
                }
            }
            // Pad with `vertexCount` itself, not 0: splat 0 is real data, not a reserved empty slot, and
            // range filtering can leave it fully visible — see gaussianSplattingSortWorker.ts.
            for (; index < paddedVertexCount; index++) {
                splatIndex[index] = vertexCount;
            }
        }
        else {
            for (let i = 0; i < paddedVertexCount; i++) {
                splatIndex[i] = i;
            }
        }
        // Update depthMix
        if ((!this._depthMix || paddedVertexCount !== this._depthMix.length) && !IsNative) {
            this._depthMix = new BigInt64Array(paddedVertexCount);
        }
        this.forcedInstanceCount = Math.max(paddedVertexCount >> 4, 1);
    }
    _getTextureDataUpdateEngine() {
        return this.getEngine();
    }
    _updateShTextureData(texture, shData, textureWidth, lineStart, lineCount) {
        const engine = this._getTextureDataUpdateEngine();
        // NativeEngine/NullEngine, updateTextureData unsupported
        if (!engine._gl && !engine.isWebGPU) {
            const internalTexture = texture.getInternalTexture();
            const expectedByteLength = textureWidth * internalTexture.height * 16;
            let uploadData;
            if (shData.byteLength === expectedByteLength && shData.byteOffset % Uint32Array.BYTES_PER_ELEMENT === 0) {
                uploadData = new Uint32Array(shData.buffer, shData.byteOffset, shData.byteLength / Uint32Array.BYTES_PER_ELEMENT);
            }
            else {
                const padded = new Uint8Array(expectedByteLength);
                padded.set(shData.subarray(0, Math.min(shData.byteLength, expectedByteLength)));
                uploadData = new Uint32Array(padded.buffer);
            }
            engine.updateRawTexture(internalTexture, uploadData, internalTexture.format, internalTexture.invertY, null, internalTexture.type, internalTexture._useSRGBBuffer);
            return;
        }
        const bytesPerTexel = 16;
        const componentsPerTexel = 4;
        const startTexel = lineStart * textureWidth;
        const availableTexelCount = Math.floor(shData.byteLength / bytesPerTexel);
        if (startTexel >= availableTexelCount) {
            return;
        }
        let texelCount = Math.min(lineCount * textureWidth, availableTexelCount - startTexel);
        if (texelCount <= 0) {
            return;
        }
        const createView = (byteOffset, viewTexelCount) => {
            return new Uint32Array(shData.buffer, shData.byteOffset + byteOffset, viewTexelCount * componentsPerTexel);
        };
        const fullRowCount = Math.floor(texelCount / textureWidth);
        if (fullRowCount > 0) {
            const fullRowTexelCount = fullRowCount * textureWidth;
            this._updateTextureFromData(texture, createView(startTexel * bytesPerTexel, fullRowTexelCount), textureWidth, lineStart, fullRowCount);
            texelCount -= fullRowTexelCount;
        }
        if (texelCount > 0) {
            const partialRowOffset = (startTexel + fullRowCount * textureWidth) * bytesPerTexel;
            this._updateTextureFromDataRect(texture, createView(partialRowOffset, texelCount), 0, lineStart + fullRowCount, texelCount, 1);
        }
    }
    _updateSubTextures(centers, covA, covB, colors, lineStart, lineCount, sh) {
        const textureSize = this._getTextureSize(this._vertexCount);
        const covBSItemSize = this._useRGBACovariants ? 4 : 2;
        const texelStart = lineStart * textureSize.x;
        const texelCount = lineCount * textureSize.x;
        const covAView = new Uint16Array(covA.buffer, texelStart * 4 * Uint16Array.BYTES_PER_ELEMENT, texelCount * 4);
        const covBView = new Uint16Array(covB.buffer, texelStart * covBSItemSize * Uint16Array.BYTES_PER_ELEMENT, texelCount * covBSItemSize);
        const colorsView = new Uint8Array(colors.buffer, texelStart * 4, texelCount * 4);
        const centersView = new Float32Array(centers.buffer, texelStart * 4 * Float32Array.BYTES_PER_ELEMENT, texelCount * 4);
        this._updateTextureFromData(this._covariancesATexture, covAView, textureSize.x, lineStart, lineCount);
        this._updateTextureFromData(this._covariancesBTexture, covBView, textureSize.x, lineStart, lineCount);
        this._updateTextureFromData(this._centersTexture, centersView, textureSize.x, lineStart, lineCount);
        this._updateTextureFromData(this._colorsTexture, colorsView, textureSize.x, lineStart, lineCount);
        if (this._rotationsATexture && this._rotationDataA) {
            const rotAView = new Uint16Array(this._rotationDataA.buffer, texelStart * 4 * Uint16Array.BYTES_PER_ELEMENT, texelCount * 4);
            const rotBView = new Uint16Array(this._rotationDataB.buffer, texelStart * 4 * Uint16Array.BYTES_PER_ELEMENT, texelCount * 4);
            const rotScaleView = new Uint16Array(this._rotationScaleData.buffer, texelStart * 4 * Uint16Array.BYTES_PER_ELEMENT, texelCount * 4);
            this._updateTextureFromData(this._rotationsATexture, rotAView, textureSize.x, lineStart, lineCount);
            this._updateTextureFromData(this._rotationsBTexture, rotBView, textureSize.x, lineStart, lineCount);
            this._updateTextureFromData(this._rotationScaleTexture, rotScaleView, textureSize.x, lineStart, lineCount);
        }
        if (sh) {
            for (let i = 0; i < sh.length; i++) {
                this._updateShTextureData(this._shTextures[i], sh[i], textureSize.x, lineStart, lineCount);
            }
        }
    }
    _instantiateWorker() {
        if (!this._vertexCount) {
            return;
        }
        // The identity index buffer must exist even when no sort worker is needed: every render path
        // (including the Native one) reads it, and a null buffer breaks the Native bindings.
        this._updateSplatIndexBuffer(this._vertexCount);
        if (this._disableDepthSort) {
            return;
        }
        // no worker in native
        if (IsNative) {
            return;
        }
        // Start the worker thread
        this._worker?.terminate();
        // Reset the posting gate so the new worker can immediately receive sort requests.
        // If the previous worker was terminated mid-sort it would never have set _canPostToWorker
        // back to true, leaving the sort permanently frozen on the new worker.
        this._canPostToWorker = true;
        this._worker = new Worker(URL.createObjectURL(new Blob(["(", GaussianSplattingSortWorker.toString(), ")(self)"], {
            type: "application/javascript",
        })));
        const positions = Float32Array.from(this._splatPositions);
        const vertexCount = this._vertexCount;
        this._worker.postMessage({ command: GaussianSplattingSortWorkerCommand.POSITIONS, positions, vertexCount }, [positions.buffer]);
        // The main thread owns the active interval set: send it explicitly (covering all indices when
        // no LOD filter is active) rather than letting the worker assume the full source set.
        this._postIntervalsToWorker();
        this._onWorkerCreated(this._worker);
        this._worker.onerror = () => {
            // If the worker throws an unhandled error, unlock the posting gate so the next frame can retry the sort.
            this._canPostToWorker = true;
        };
        this._worker.onmessage = (e) => {
            // Size the result against the active (rendered) splat count, which may be a subset of the
            // full source set when an interval/LOD filter is active.
            const renderedPadded = Math.max((this.renderedSplatCount + 15) & ~0xf, 16);
            // Discard the result and trigger a fresh sort if it no longer matches the current active set:
            // either the active count changed since it was posted, or it was computed for a stale range
            // version (the active ranges changed while it was in flight). Applying it would render indices
            // that belong to a different active set.
            if (e.data.depthMix.length != renderedPadded || e.data.rangeVersion !== this._activeRangeVersion) {
                // Only re-enable posting and trigger a re-sort if the buffer is available.
                // If byteLength === 0 the buffer is already in-flight for a newer sort;
                // that sort's onmessage will handle things when it returns.
                if (this._depthMix.buffer.byteLength > 0) {
                    this._canPostToWorker = true;
                    this._postToWorker(true);
                    this._sortIsDirty = false;
                }
                return;
            }
            this._depthMix = e.data.depthMix;
            const cameraId = e.data.cameraId;
            const sortRequestId = e.data.sortRequestId;
            // The index buffer swap is deferred to here so the previous fully-sorted state stays on screen
            // until this matching sort lands. Resize it now (the active count may have grown/shrunk since the
            // last applied sort) and rebind it for every known camera.
            if (!this._splatIndex || this._splatIndex.length !== renderedPadded) {
                this._splatIndex = new Float32Array(renderedPadded);
                this._cameraViewInfos.forEach((info) => {
                    info.mesh.thinInstanceSetBuffer("splatIndex", this._splatIndex, 16, false);
                    info.splatIndexBufferSet = true;
                });
            }
            const indexMix = new Uint32Array(e.data.depthMix.buffer);
            if (this._splatIndex) {
                for (let j = 0; j < renderedPadded; j++) {
                    this._splatIndex[j] = indexMix[2 * j];
                }
            }
            this.forcedInstanceCount = Math.max(renderedPadded >> 4, 1);
            if (this._delayedTextureUpdate) {
                const vertexCountPadded = (this._vertexCount + 15) & ~0xf;
                const textureSize = this._getTextureSize(vertexCountPadded);
                this._updateSubTextures(this._delayedTextureUpdate.centers, this._delayedTextureUpdate.covA, this._delayedTextureUpdate.covB, this._delayedTextureUpdate.colors, 0, textureSize.y, this._delayedTextureUpdate.sh);
                this._delayedTextureUpdate = null;
            }
            // get mesh for camera and update its instance buffer
            const cameraViewInfos = this._cameraViewInfos.get(cameraId);
            if (cameraViewInfos) {
                if (cameraViewInfos.splatIndexBufferSet) {
                    cameraViewInfos.mesh.thinInstanceBufferUpdated("splatIndex");
                }
                else {
                    cameraViewInfos.mesh.thinInstanceSetBuffer("splatIndex", this._splatIndex, 16, false);
                    cameraViewInfos.splatIndexBufferSet = true;
                }
                cameraViewInfos.sortAppliedId = sortRequestId;
            }
            this._canPostToWorker = true;
            this._readyToDisplay = true;
            // sort is dirty when GS is visible for progressive update with a this message arriving but positions were partially filled
            // another update needs to be kicked. The kick can't happen just when the position buffer is ready because _canPostToWorker might be false.
            if (this._sortIsDirty) {
                this._postToWorker(true);
                this._sortIsDirty = false;
            }
        };
    }
    _getTextureSize(length) {
        const engine = this._scene.getEngine();
        const width = engine.getCaps().maxTextureSize;
        let height = 1;
        if (engine.version === 1 && !engine.isWebGPU) {
            while (width * height < length) {
                height *= 2;
            }
            // See the WebGL2/WebGPU branch below for why this guarantees an extra row when `length`
            // exactly fills every row. A power-of-2 height has to double to add any slack at all.
            // Usually this is a no-op since it is rare that the asset exactly contains a power-of-2
            // number of splats.
            if (length > 0 && width * height === length) {
                height *= 2;
            }
        }
        else {
            height = Math.ceil(length / width);
            // When `length` exactly fills every row, force one extra (fully zeroed) row so the atlas
            // always has at least one genuinely-empty splat slot past the real data, at index `length`.
            // The sort worker (gaussianSplattingSortWorker.ts) relies on that slot always existing to
            // safely pad the 16-aligned draw order — without it, the only "spare" index would be the
            // last real splat, which range-filtering (setSplatIndexRanges/opacity/size culling) can
            // leave fully visible and opaque, reproducing the same "stuck in front" bug on that splat.
            if (length > 0 && height * width === length) {
                height += 1;
            }
        }
        if (height > width) {
            Logger.Error("GaussianSplatting texture size: (" + width + ", " + height + "), maxTextureSize: " + width);
            height = width;
        }
        return new Vector2(width, height);
    }
    /**
     * Called after the sort worker has been created and the initial positions message has been sent.
     * Override in subclasses to post any additional setup messages the worker needs (e.g. group
     * indices, per-part matrices, etc.).
     * @param _worker the newly created worker
     */
    _onWorkerCreated(_worker) { }
    /**
     * Called by the material to bind any extra shader uniforms that are specific to this mesh type.
     * The base implementation is a no-op; override in subclasses to bind additional data.
     * @param _effect the shader effect that is being bound
     * @internal
     */
    bindExtraEffectUniforms(_effect) { }
    /**
     * Processes all splats from a source GaussianSplattingMesh directly into the destination
     * texture arrays starting at dstOffset. This is the core of the texture-direct compound API:
     * no merged CPU buffer is ever created; each source mesh is written straight into its region.
     *
     * @param source - The source mesh whose splats are appended
     * @param dstOffset - The destination splat index at which writing starts
     * @param covA - Destination covA array (full texture size)
     * @param covB - Destination covB array (full texture size)
     * @param colorArray - Destination color array (full texture size)
     * @param sh - Destination SH arrays (full texture size), or undefined
     * @param minimum - Accumulated bounding min (updated in-place)
     * @param maximum - Accumulated bounding max (updated in-place)
     * @internal Use GaussianSplattingMesh.addPart instead
     */
    _appendSourceToArrays(source, dstOffset, covA, covB, colorArray, sh, minimum, maximum) {
        const srcCount = source._vertexCount;
        const bytesPerTexel = 16;
        const srcRaw = source._splatsData;
        if (!srcRaw || srcCount === 0) {
            return;
        }
        const uBuffer = GaussianSplattingMeshBase._GetSplatDataBytes(srcRaw);
        const fBuffer = GaussianSplattingMeshBase._GetSplatDataFloats(srcRaw);
        for (let i = 0; i < srcCount; i++) {
            this._makeSplat(dstOffset + i, fBuffer, uBuffer, covA, covB, colorArray, minimum, maximum, false, i);
        }
        // Copy SH data if both source and destination have it
        if (sh && source._shData) {
            for (let texIdx = 0; texIdx < sh.length; texIdx++) {
                if (texIdx < source._shData.length) {
                    sh[texIdx].set(source._shData[texIdx].subarray(0, srcCount * bytesPerTexel), dstOffset * bytesPerTexel);
                }
            }
        }
    }
    /**
     * Modifies the splats according to the passed transformation matrix.
     * @param transform defines the transform matrix to use
     * @returns the current mesh
     */
    bakeTransformIntoVertices(transform) {
        const arrayBuffer = this.splatsData;
        if (!arrayBuffer) {
            Logger.Error("Cannot bake transform into vertices if splatsData is not kept in RAM");
            return this;
        }
        // Check for uniform scaling
        const m = transform.m;
        const scaleX = Math.sqrt(m[0] * m[0] + m[1] * m[1] + m[2] * m[2]);
        const scaleY = Math.sqrt(m[4] * m[4] + m[5] * m[5] + m[6] * m[6]);
        const scaleZ = Math.sqrt(m[8] * m[8] + m[9] * m[9] + m[10] * m[10]);
        const epsilon = 0.001;
        if (Math.abs(scaleX - scaleY) > epsilon || Math.abs(scaleX - scaleZ) > epsilon) {
            Logger.Error("Gaussian Splatting bakeTransformIntoVertices does not support non-uniform scaling");
            return this;
        }
        const uBuffer = new Uint8Array(arrayBuffer);
        const fBuffer = new Float32Array(arrayBuffer);
        const temp = TmpVectors.Vector3[0];
        let index;
        const quaternion = TmpVectors.Quaternion[0];
        const transformedQuaternion = TmpVectors.Quaternion[1];
        transform.decompose(temp, transformedQuaternion, temp);
        for (index = 0; index < this._vertexCount; index++) {
            const floatIndex = index * 8; // 8 floats per splat (center.x, center.y, center.z, scale.x, scale.y, scale.z, ...)
            Vector3.TransformCoordinatesFromFloatsToRef(fBuffer[floatIndex], fBuffer[floatIndex + 1], fBuffer[floatIndex + 2], transform, temp);
            fBuffer[floatIndex] = temp.x;
            fBuffer[floatIndex + 1] = temp.y;
            fBuffer[floatIndex + 2] = temp.z;
            // Apply uniform scaling to splat scales
            fBuffer[floatIndex + 3] *= scaleX;
            fBuffer[floatIndex + 4] *= scaleX;
            fBuffer[floatIndex + 5] *= scaleX;
            // Unpack quaternion from uint8array (matching _GetSplat packing convention)
            quaternion.set((uBuffer[32 * index + 28 + 1] - 127.5) / 127.5, (uBuffer[32 * index + 28 + 2] - 127.5) / 127.5, (uBuffer[32 * index + 28 + 3] - 127.5) / 127.5, (uBuffer[32 * index + 28 + 0] - 127.5) / 127.5);
            quaternion.normalize();
            // If there is a negative scaling, we need to flip the quaternion to keep the correct handedness
            if (this.scaling.x < 0) {
                quaternion.x = -quaternion.x;
                quaternion.w = -quaternion.w;
            }
            if (this.scaling.y < 0) {
                quaternion.y = -quaternion.y;
                quaternion.w = -quaternion.w;
            }
            if (this.scaling.z < 0) {
                quaternion.z = -quaternion.z;
                quaternion.w = -quaternion.w;
            }
            // Transform the quaternion
            transformedQuaternion.multiplyToRef(quaternion, quaternion);
            quaternion.normalize();
            // Pack quaternion back to uint8array (matching _GetSplat packing convention)
            uBuffer[32 * index + 28 + 0] = Math.round(quaternion.w * 127.5 + 127.5);
            uBuffer[32 * index + 28 + 1] = Math.round(quaternion.x * 127.5 + 127.5);
            uBuffer[32 * index + 28 + 2] = Math.round(quaternion.y * 127.5 + 127.5);
            uBuffer[32 * index + 28 + 3] = Math.round(quaternion.z * 127.5 + 127.5);
        }
        this.updateData(arrayBuffer, this.shData ?? undefined, { flipY: false });
        return this;
    }
}
/**
 * When true (default), the depth-sort worker uses the fast O(n) counting (radix) sort. Set to false to
 * fall back to the legacy comparison sort (useful for A/B comparison or as a safety fallback). The change
 * takes effect on the next sort.
 */
GaussianSplattingMeshBase.UseCountingSort = true;
/**
 * When true, the depth-sort worker logs each sort's duration (ms) and active splat count to the console.
 * Off by default; intended for performance investigation only.
 */
GaussianSplattingMeshBase.LogSortPerformance = false;
GaussianSplattingMeshBase._RowOutputLength = 3 * 4 + 3 * 4 + 4 + 4; // Vector3 position, Vector3 scale, 1 u8 quaternion, 1 color with alpha
GaussianSplattingMeshBase._SH_C0 = 0.28209479177387814;
// batch size between 2 yield calls. This value is a tradeoff between updates overhead and framerate hiccups
// This step is faster the PLY conversion. So batch size can be bigger
GaussianSplattingMeshBase._SplatBatchSize = 327680;
// batch size between 2 yield calls during the PLY to splat conversion.
GaussianSplattingMeshBase._PlyConversionBatchSize = 32768;
GaussianSplattingMeshBase._BatchSize = 16; // 16 splats per instance
GaussianSplattingMeshBase._DefaultViewUpdateThreshold = 1e-4;
/**
 * Set the number of batch (a batch is 16384 splats) after which a display update is performed
 * A value of 0 (default) means display update will not happens before splat is ready.
 */
GaussianSplattingMeshBase.ProgressiveUpdateAmount = 0;
/**
 * Allocates SH texture buffers pre-filled with 128 (the neutral encoding of ~0.0 in the
 * shader's decompose() function). Padding bytes beyond the actual coefficients in the last
 * texture are read as higher-order SH bands when the mesh is added to a compound with a
 * higher degree; zero would decode to -1.0 instead, producing wrong colors.
 * @param textureCount number of SH textures to allocate
 * @param bytesEach byte size of each texture buffer
 * @returns array of initialized Uint8Array buffers
 */
export function AllocateShBuffers(textureCount, bytesEach) {
    const result = [];
    for (let i = 0; i < textureCount; i++) {
        const arr = new Uint8Array(bytesEach);
        arr.fill(128);
        result.push(arr);
    }
    return result;
}
//# sourceMappingURL=gaussianSplattingMeshBase.pure.js.map