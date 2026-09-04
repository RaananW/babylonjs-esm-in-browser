import { type Scene } from "@babylonjs/core/scene.js";
import { type IParsedSplat } from "./splatDefs.js";
import { type GaussianSplattingDownloadManager, type DownloadGroupId } from "./gaussianSplattingDownloadManager.js";
/**
 * Definition of a SOG data file
 */
export interface SOGDataFile {
    /**
     * index 0 is number of splats index 1 is number of components per splat (3 for vec3, 4 for vec4, etc.)
     */
    shape: number[];
    /**
     * type of components
     */
    dtype: string;
    /**
     * min range of data
     */
    mins?: number | number[];
    /**
     * max range of data
     */
    maxs?: number | number[];
    /**
     * palette for indexed data (quantized)
     */
    codebook?: number[];
    /**
     * type of encoding
     */
    encoding?: string;
    /**
     * number of bits for quantization (if any)
     */
    quantization?: number;
    /**
     * webp file names
     */
    files: string[];
    /**
     * SH band count (if applicable)
     */
    bands?: number;
}
/**
 * Definition of the root SOG data file
 */
export interface SOGRootData {
    /**
     * version of the SOG format
     */
    version?: number;
    /**
     * mean positions of the splats
     */
    means: SOGDataFile;
    /**
     * scales of the splats
     */
    scales: SOGDataFile;
    /**
     * quaternions of the splats
     */
    quats: SOGDataFile;
    /**
     * SH0 coefficients of the splats (base color)
     */
    sh0: SOGDataFile;
    /**
     *  Optional higher order SH coefficients of the splats (lighting information)
     */
    shN?: SOGDataFile;
    /**
     * number of splats (optional, can be inferred from means.shape[0])
     */
    count?: number;
}
/**
 * Parse SOG data from either a SOGRootData object (with webp files loaded from rootUrl) or from a Map of filenames to Uint8Array file data (including meta.json)
 * @param dataOrFiles Either the SOGRootData or a Map of filenames to Uint8Array file data (including meta.json)
 * @param rootUrl Base URL to load webp files from (if dataOrFiles is SOGRootData)
 * @param scene The Babylon.js scene
 * @returns Parsed data
 */
export declare function ParseSogMeta(dataOrFiles: SOGRootData | Map<string, Uint8Array>, rootUrl: string, scene: Scene): Promise<IParsedSplat>;
/**
 * Parse SOG data and produce a set of GPU textures + dequantization parameters.
 * The shader will sample these raw RGBA8 textures and reconstruct positions/scales/rotations/colors/SH on the GPU.
 * @param dataOrFiles Either the SOGRootData or a Map of filenames to Uint8Array file data (including meta.json)
 * @param rootUrl Base URL to load webp files from (if dataOrFiles is SOGRootData)
 * @param scene The Babylon.js scene
 * @param computeCpuPositions When true (default), means_l/means_u are read back on the CPU and `pack.positions`
 *   is decoded for the sort worker / bounding box. Pass false when the caller will instead read the decoded
 *   centers back from the GPU work buffer — then every attribute (including means) uses the fast direct
 *   ImageBitmap upload (no `getImageData` readback) and `pack.positions` is left empty.
 * @param downloadManager Optional download manager that throttles and retries the per-file image downloads
 *   (used by the LOD streamer). When omitted, files are fetched directly. Only applies when loading from a URL.
 * @param downloadGroupId Optional group tag passed to the download manager so this file's image downloads can
 *   be cancelled together if the streamer no longer needs them.
 * @returns Parsed splat info with `sogTextures` populated.
 */
export declare function ParseSogMetaAsTextures(dataOrFiles: SOGRootData | Map<string, Uint8Array>, rootUrl: string, scene: Scene, computeCpuPositions?: boolean, downloadManager?: GaussianSplattingDownloadManager, downloadGroupId?: DownloadGroupId): Promise<IParsedSplat>;
