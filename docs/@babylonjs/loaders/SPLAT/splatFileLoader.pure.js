/* eslint-disable @typescript-eslint/promise-function-async*/
/* eslint-disable @typescript-eslint/naming-convention */
import { RegisterSceneLoaderPlugin, } from "@babylonjs/core/Loading/sceneLoader.js";
import { SPLATFileLoaderMetadata } from "./splatFileLoader.metadata.js";
import { GaussianSplattingMesh } from "@babylonjs/core/Meshes/GaussianSplatting/gaussianSplattingMesh.pure.js";
import { GaussianSplattingStream } from "./gaussianSplattingStream.js";
import { AssetContainer } from "@babylonjs/core/assetContainer.js";
import { Mesh } from "@babylonjs/core/Meshes/mesh.pure.js";
import { Logger } from "@babylonjs/core/Misc/logger.js";
import { Vector3 } from "@babylonjs/core/Maths/math.vector.pure.js";
import { PointsCloudSystem } from "@babylonjs/core/Particles/pointsCloudSystem.js";
import { Color4 } from "@babylonjs/core/Maths/math.color.pure.js";
import { VertexData } from "@babylonjs/core/Meshes/mesh.vertexData.js";
import { ConvertSpzToSplatAsync, GetSpzModule, ParseSpz } from "./spz.js";
import { ParseSogMeta, ParseSogMetaAsTextures } from "./sog.pure.js";
import { Tools } from "@babylonjs/core/Misc/tools.pure.js";
/**
 * @experimental
 * SPLAT file type loader.
 * This is a babylon scene loader plugin.
 */
export class SPLATFileLoader {
    /**
     * Creates loader for gaussian splatting files
     * @param loadingOptions options for loading and parsing splat and PLY files.
     */
    constructor(loadingOptions = {}) {
        /**
         * Defines the name of the plugin.
         */
        this.name = SPLATFileLoaderMetadata.name;
        this._assetContainer = null;
        /**
         * Defines the extensions the splat loader is able to load.
         * force data to come in as an ArrayBuffer
         */
        this.extensions = SPLATFileLoaderMetadata.extensions;
        this._loadingOptions = { ...SPLATFileLoader._DefaultLoadingOptions, ...loadingOptions };
    }
    /** @internal */
    createPlugin(options) {
        return new SPLATFileLoader(options[SPLATFileLoaderMetadata.name]);
    }
    /**
     * Imports  from the loaded gaussian splatting data and adds them to the scene
     * @param meshesNames a string or array of strings of the mesh names that should be loaded from the file
     * @param scene the scene the meshes should be added to
     * @param data the gaussian splatting data to load
     * @param rootUrl root url to load from
     * @param _onProgress callback called while file is loading
     * @param _fileName Defines the name of the file to load
     * @returns a promise containing the loaded meshes, particles, skeletons and animations
     */
    async importMeshAsync(meshesNames, scene, data, rootUrl, _onProgress, _fileName) {
        const lodStream = this._tryCreateLODStream(scene, data, rootUrl);
        if (lodStream) {
            return {
                meshes: [lodStream],
                particleSystems: [],
                skeletons: [],
                animationGroups: [],
                transformNodes: [],
                geometries: [],
                lights: [],
                spriteManagers: [],
            };
        }
        // eslint-disable-next-line github/no-then
        return await this._parseAsync(meshesNames, scene, data, rootUrl).then((meshes) => {
            return {
                meshes: meshes,
                particleSystems: [],
                skeletons: [],
                animationGroups: [],
                transformNodes: [],
                geometries: [],
                lights: [],
                spriteManagers: [],
            };
        });
    }
    /**
     * Detects a PlayCanvas-style `lod-meta.json` payload and, if found, creates a streaming mesh for it.
     * @param scene hosting scene
     * @param data loaded file data
     * @param rootUrl root url the metadata's relative paths resolve against
     * @returns the streaming mesh, or null when the data is not SOG LOD metadata
     */
    _tryCreateLODStream(scene, data, rootUrl) {
        if (typeof data !== "string") {
            return null;
        }
        let parsed;
        try {
            parsed = JSON.parse(data);
        }
        catch {
            return null;
        }
        if (!GaussianSplattingStream.IsLODMetadata(parsed)) {
            return null;
        }
        const previousBlockEntityCollection = scene._blockEntityCollection;
        scene._blockEntityCollection = !!this._assetContainer;
        try {
            const stream = new GaussianSplattingStream("GaussianSplattingStream", parsed, rootUrl, scene, {
                deflateURL: this._loadingOptions.deflateURL,
                fflate: this._loadingOptions.fflate,
            });
            stream._parentContainer = this._assetContainer;
            return stream;
        }
        finally {
            scene._blockEntityCollection = previousBlockEntityCollection;
        }
    }
    static _BuildPointCloud(pointcloud, data) {
        if (!data.byteLength) {
            return false;
        }
        const uBuffer = new Uint8Array(data);
        const fBuffer = new Float32Array(data);
        // parsed array contains room for position(3floats), normal(3floats), color (4b), quantized quaternion (4b)
        const rowLength = 3 * 4 + 3 * 4 + 4 + 4;
        const vertexCount = uBuffer.length / rowLength;
        const pointcloudfunc = function (particle, i) {
            const x = fBuffer[8 * i + 0];
            const y = fBuffer[8 * i + 1];
            const z = fBuffer[8 * i + 2];
            particle.position = new Vector3(x, y, z);
            const r = uBuffer[rowLength * i + 24 + 0] / 255;
            const g = uBuffer[rowLength * i + 24 + 1] / 255;
            const b = uBuffer[rowLength * i + 24 + 2] / 255;
            particle.color = new Color4(r, g, b, 1);
        };
        pointcloud.addPoints(vertexCount, pointcloudfunc);
        return true;
    }
    static _BuildMesh(scene, parsedPLY) {
        const mesh = new Mesh("PLYMesh", scene);
        const uBuffer = new Uint8Array(parsedPLY.data);
        const fBuffer = new Float32Array(parsedPLY.data);
        const rowLength = 3 * 4 + 3 * 4 + 4 + 4;
        const vertexCount = uBuffer.length / rowLength;
        const positions = [];
        const vertexData = new VertexData();
        for (let i = 0; i < vertexCount; i++) {
            const x = fBuffer[8 * i + 0];
            const y = fBuffer[8 * i + 1];
            const z = fBuffer[8 * i + 2];
            positions.push(x, y, z);
        }
        if (parsedPLY.hasVertexColors) {
            const colors = new Float32Array(vertexCount * 4);
            for (let i = 0; i < vertexCount; i++) {
                const r = uBuffer[rowLength * i + 24 + 0] / 255;
                const g = uBuffer[rowLength * i + 24 + 1] / 255;
                const b = uBuffer[rowLength * i + 24 + 2] / 255;
                colors[i * 4 + 0] = r;
                colors[i * 4 + 1] = g;
                colors[i * 4 + 2] = b;
                colors[i * 4 + 3] = 1;
            }
            vertexData.colors = colors;
        }
        vertexData.positions = positions;
        vertexData.indices = parsedPLY.faces;
        vertexData.applyToMesh(mesh);
        return mesh;
    }
    // eslint-disable-next-line @typescript-eslint/promise-function-async, no-restricted-syntax, @typescript-eslint/naming-convention
    async _unzipWithFFlateAsync(data) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        let fflate = this._loadingOptions.fflate;
        // ensure fflate is loaded
        if (!fflate) {
            if (typeof window.fflate === "undefined") {
                await Tools.LoadScriptAsync(this._loadingOptions.deflateURL ?? "https://unpkg.com/fflate/umd/index.js");
            }
            fflate = window.fflate;
        }
        const { unzipSync } = fflate;
        const unzipped = unzipSync(data); // { [filename: string]: Uint8Array }
        const files = new Map();
        for (const [name, content] of Object.entries(unzipped)) {
            files.set(name, content);
        }
        return files;
    }
    // eslint-disable-next-line @typescript-eslint/promise-function-async, no-restricted-syntax
    _parseAsync(meshesNames, scene, data, rootUrl) {
        const babylonMeshesArray = []; //The mesh for babylon
        const makeGSFromParsedSOG = (parsedSOG) => {
            scene._blockEntityCollection = !!this._assetContainer;
            const gaussianSplatting = this._loadingOptions.gaussianSplattingMesh ??
                new GaussianSplattingMesh("GaussianSplatting", null, scene, this._loadingOptions.keepInRam, this._loadingOptions.needsRotationScaleTextures);
            gaussianSplatting._parentContainer = this._assetContainer;
            babylonMeshesArray.push(gaussianSplatting);
            if (parsedSOG.sogTextures) {
                gaussianSplatting.setSogTextureData(parsedSOG.sogTextures);
            }
            else {
                gaussianSplatting.updateData(parsedSOG.data, parsedSOG.sh, { flipY: false }, undefined, parsedSOG.shDegree);
            }
            gaussianSplatting.scaling.y *= -1;
            gaussianSplatting.computeWorldMatrix(true);
            // Expose any parsed safe-orbit limits (SOG does not auto-apply them to the camera).
            gaussianSplatting.safeOrbitCameraLimits = SPLATFileLoader._ExtractSafeOrbitLimits(parsedSOG);
            scene._blockEntityCollection = false;
        };
        const engine = scene.getEngine();
        let useSogTextures = this._loadingOptions.useSogTextures;
        if (useSogTextures && !engine.isWebGPU && engine.version < 2) {
            Logger.Warn("SPLATFileLoader: useSogTextures requires WebGL2 or WebGPU. Falling back to CPU path.");
            useSogTextures = false;
        }
        const sogParser = useSogTextures ? ParseSogMetaAsTextures : ParseSogMeta;
        // check if data is json string
        if (typeof data === "string") {
            const dataSOG = JSON.parse(data);
            if (dataSOG && dataSOG.means && dataSOG.scales && dataSOG.quats && dataSOG.sh0) {
                return new Promise((resolve, reject) => {
                    sogParser(dataSOG, rootUrl, scene)
                        // eslint-disable-next-line @typescript-eslint/no-floating-promises, github/no-then
                        .then((parsedSOG) => {
                        makeGSFromParsedSOG(parsedSOG);
                        resolve(babylonMeshesArray);
                    })
                        // eslint-disable-next-line github/no-then
                        .catch((e) => {
                        reject(new Error("Failed to parse SOG data.", { cause: e }));
                    });
                });
            }
        }
        const u8 = data instanceof ArrayBuffer ? new Uint8Array(data) : data;
        // ZIP signature check for SOG
        if (u8[0] === 0x50 && u8[1] === 0x4b) {
            return new Promise((resolve, reject) => {
                // eslint-disable-next-line @typescript-eslint/no-floating-promises, github/no-then
                this._unzipWithFFlateAsync(u8).then((files) => {
                    sogParser(files, rootUrl, scene)
                        // eslint-disable-next-line @typescript-eslint/no-floating-promises, github/no-then
                        .then((parsedSOG) => {
                        makeGSFromParsedSOG(parsedSOG);
                        resolve(babylonMeshesArray);
                    }) // eslint-disable-next-line github/no-then
                        .catch((e) => {
                        reject(new Error("Failed to parse SOG zip data.", { cause: e }));
                    });
                });
            });
        }
        const handlePLY = (resolve) => {
            // eslint-disable-next-line @typescript-eslint/no-floating-promises, github/no-then
            SPLATFileLoader._ConvertPLYToSplat(data).then(async (parsedPLY) => {
                scene._blockEntityCollection = !!this._assetContainer;
                switch (parsedPLY.mode) {
                    case 0 /* Mode.Splat */:
                        {
                            const gaussianSplatting = this._loadingOptions.gaussianSplattingMesh ??
                                new GaussianSplattingMesh("GaussianSplatting", null, scene, this._loadingOptions.keepInRam, this._loadingOptions.needsRotationScaleTextures);
                            gaussianSplatting._parentContainer = this._assetContainer;
                            babylonMeshesArray.push(gaussianSplatting);
                            gaussianSplatting.updateData(parsedPLY.data, parsedPLY.sh, { flipY: false }, undefined, parsedPLY.shDegree);
                            gaussianSplatting.scaling.y *= -1.0;
                            if (parsedPLY.chirality === "RightHanded") {
                                gaussianSplatting.scaling.y *= -1.0;
                            }
                            switch (parsedPLY.upAxis) {
                                case "X":
                                    gaussianSplatting.rotation = new Vector3(0, 0, Math.PI / 2);
                                    break;
                                case "Y":
                                    gaussianSplatting.rotation = new Vector3(0, 0, Math.PI);
                                    break;
                                case "Z":
                                    gaussianSplatting.rotation = new Vector3(-Math.PI / 2, Math.PI, 0);
                                    break;
                            }
                            gaussianSplatting.computeWorldMatrix(true);
                            gaussianSplatting.safeOrbitCameraLimits = SPLATFileLoader._ExtractSafeOrbitLimits(parsedPLY);
                        }
                        break;
                    case 1 /* Mode.PointCloud */:
                        {
                            const pointcloud = new PointsCloudSystem("PointCloud", 1, scene);
                            if (SPLATFileLoader._BuildPointCloud(pointcloud, parsedPLY.data)) {
                                // eslint-disable-next-line github/no-then
                                await pointcloud.buildMeshAsync().then((mesh) => {
                                    babylonMeshesArray.push(mesh);
                                });
                            }
                            else {
                                pointcloud.dispose();
                            }
                        }
                        break;
                    case 2 /* Mode.Mesh */:
                        {
                            if (parsedPLY.faces) {
                                babylonMeshesArray.push(SPLATFileLoader._BuildMesh(scene, parsedPLY));
                            }
                            else {
                                throw new Error("PLY mesh doesn't contain face informations.");
                            }
                        }
                        break;
                    default:
                        throw new Error("Unsupported Splat mode");
                }
                scene._blockEntityCollection = false;
                this.applyAutoCameraLimits(SPLATFileLoader._ExtractSafeOrbitLimits(parsedPLY), scene);
                resolve(babylonMeshesArray);
            });
        };
        // Check for gzip (before SPZ V4) and NGSP (SPZ V4+) magic bytes to detect SPZ format
        const isGZipped = u8[0] === 0x1f && u8[1] === 0x8b;
        const isNGSP = u8[0] === 0x4e && u8[1] === 0x47 && u8[2] === 0x53 && u8[3] === 0x50;
        if (!isGZipped && !isNGSP) {
            return new Promise((resolve) => {
                handlePLY(resolve);
            });
        }
        const applyParsedSPZ = (parsedSPZ, resolve) => {
            scene._blockEntityCollection = !!this._assetContainer;
            const gaussianSplatting = this._loadingOptions.gaussianSplattingMesh ??
                new GaussianSplattingMesh("GaussianSplatting", null, scene, this._loadingOptions.keepInRam, this._loadingOptions.needsRotationScaleTextures);
            if (parsedSPZ.trainedWithAntialiasing) {
                const gsMaterial = gaussianSplatting.material;
                gsMaterial.kernelSize = 0.1;
                gsMaterial.compensation = true;
            }
            gaussianSplatting._parentContainer = this._assetContainer;
            babylonMeshesArray.push(gaussianSplatting);
            gaussianSplatting.updateData(parsedSPZ.data, parsedSPZ.sh, { flipY: false }, undefined, parsedSPZ.shDegree);
            if (!this._loadingOptions.flipY) {
                gaussianSplatting.scaling.y *= -1.0;
                gaussianSplatting.computeWorldMatrix(true);
            }
            scene._blockEntityCollection = false;
            const safeOrbitLimits = SPLATFileLoader._ExtractSafeOrbitLimits(parsedSPZ);
            gaussianSplatting.safeOrbitCameraLimits = safeOrbitLimits;
            this.applyAutoCameraLimits(safeOrbitLimits, scene);
            resolve(babylonMeshesArray);
        };
        if (this._loadingOptions.spzLibraryUrl) {
            // WASM path: load spz module from URL, pass raw gzip data directly
            // eslint-disable-next-line github/no-then
            return GetSpzModule(this._loadingOptions.spzLibraryUrl).then((spz) => {
                const cloud = spz.loadSpzFromBuffer(new Uint8Array(data), { to: spz.CoordinateSystem.RUB });
                // eslint-disable-next-line github/no-then
                return ConvertSpzToSplatAsync(cloud, scene).then((parsedSPZ) => {
                    return new Promise((resolve) => {
                        applyParsedSPZ(parsedSPZ, resolve);
                    });
                });
            });
        }
        // NGSP (SPZ V4+) requires WASM — the native fallback only handles legacy gzip formats
        if (isNGSP) {
            return Promise.reject(new Error("SPZ V4+ files (NGSP format) are not supported by the native fallback loader. " +
                "Please provide a valid 'spzLibraryUrl' in the loading options to use the WASM-based SPZ library, " +
                "or ensure WebAssembly is available in your environment."));
        }
        // Manual path: decompress gzip, then parse with the built-in SPZ parser
        const readableStream = new ReadableStream({
            start(controller) {
                controller.enqueue(new Uint8Array(data));
                controller.close();
            },
        });
        const decompressionStream = new DecompressionStream("gzip");
        const decompressedStream = readableStream.pipeThrough(decompressionStream);
        return new Promise((resolve) => {
            new Response(decompressedStream)
                .arrayBuffer()
                // eslint-disable-next-line github/no-then
                .then((buffer) => {
                // eslint-disable-next-line @typescript-eslint/no-floating-promises, github/no-then
                ParseSpz(buffer, scene, this._loadingOptions).then((parsedSPZ) => {
                    applyParsedSPZ(parsedSPZ, resolve);
                });
            })
                // eslint-disable-next-line github/no-then
                .catch(() => {
                handlePLY(resolve);
            });
        });
    }
    /**
     * Extracts the safe-orbit camera limits from parsed splat metadata, or null when the file
     * carries none. Exposed on the loaded mesh (GaussianSplattingMeshBase.safeOrbitCameraLimits)
     * so consumers can apply/track them regardless of the active camera type.
     * @param meta parsed splat meta data
     * @returns the parsed safe-orbit limits, or null
     */
    static _ExtractSafeOrbitLimits(meta) {
        if (meta.safeOrbitCameraRadiusMin === undefined && meta.safeOrbitCameraElevationMinMax === undefined) {
            return null;
        }
        return {
            radiusMin: meta.safeOrbitCameraRadiusMin,
            elevationMinMax: meta.safeOrbitCameraElevationMinMax,
        };
    }
    /**
     * Applies safe-orbit camera limits parsed from the file metadata to the scene's active
     * ArcRotateCamera. No-op when no limits are present, `disableAutoCameraLimits` is set, or the
     * active camera is not an ArcRotateCamera — in which case consumers can still read the limits
     * from the loaded mesh's `safeOrbitCameraLimits` and apply them themselves.
     * @param limits parsed safe-orbit limits (see _ExtractSafeOrbitLimits)
     * @param scene
     */
    applyAutoCameraLimits(limits, scene) {
        if (this._loadingOptions.disableAutoCameraLimits || !limits) {
            return;
        }
        if (scene.activeCamera?.getClassName() === "ArcRotateCamera") {
            const arcCam = scene.activeCamera;
            if (limits.elevationMinMax) {
                arcCam.lowerBetaLimit = Math.PI * 0.5 - limits.elevationMinMax[1];
                arcCam.upperBetaLimit = Math.PI * 0.5 - limits.elevationMinMax[0];
            }
            if (limits.radiusMin) {
                arcCam.lowerRadiusLimit = limits.radiusMin;
            }
        }
    }
    /**
     * Load into an asset container.
     * @param scene The scene to load into
     * @param data The data to import
     * @param rootUrl The root url for scene and resources
     * @returns The loaded asset container
     */
    // eslint-disable-next-line no-restricted-syntax
    loadAssetContainerAsync(scene, data, rootUrl) {
        const container = new AssetContainer(scene);
        this._assetContainer = container;
        return (this.importMeshAsync(null, scene, data, rootUrl)
            // eslint-disable-next-line github/no-then
            .then((result) => {
            for (const mesh of result.meshes) {
                container.meshes.push(mesh);
            }
            // mesh material will be null before 1st rendered frame.
            this._assetContainer = null;
            return container;
        })
            // eslint-disable-next-line github/no-then
            .catch((ex) => {
            this._assetContainer = null;
            throw ex;
        }));
    }
    /**
     * Imports all objects from the loaded OBJ data and adds them to the scene
     * @param scene the scene the objects should be added to
     * @param data the OBJ data to load
     * @param rootUrl root url to load from
     * @returns a promise which completes when objects have been loaded to the scene
     */
    // eslint-disable-next-line @typescript-eslint/promise-function-async, no-restricted-syntax
    loadAsync(scene, data, rootUrl) {
        //Get the 3D model
        // eslint-disable-next-line github/no-then
        return this.importMeshAsync(null, scene, data, rootUrl).then(() => {
            // return void
        });
    }
    /**
     * Code from https://github.com/dylanebert/gsplat.js/blob/main/src/loaders/PLYLoader.ts Under MIT license
     * Converts a .ply data array buffer to splat
     * if data array buffer is not ply, returns the original buffer
     * @param data the .ply data to load
     * @returns the loaded splat buffer
     */
    static _ConvertPLYToSplat(data) {
        const ubuf = new Uint8Array(data);
        const header = new TextDecoder().decode(ubuf.slice(0, 1024 * 10));
        const headerEnd = "end_header\n";
        const headerEndIndex = header.indexOf(headerEnd);
        if (headerEndIndex < 0 || !header) {
            // standard splat
            return new Promise((resolve) => {
                resolve({ mode: 0 /* Mode.Splat */, data: data, rawSplat: true });
            });
        }
        const vertexCount = parseInt(/element vertex (\d+)\n/.exec(header)[1]);
        const faceElement = /element face (\d+)\n/.exec(header);
        let faceCount = 0;
        if (faceElement) {
            faceCount = parseInt(faceElement[1]);
        }
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
        const ElementMode = {
            Vertex: 0,
            Chunk: 1,
            SH: 2,
            Float_Tuple: 3,
            Float: 4,
            Uchar: 5,
        };
        let chunkMode = ElementMode.Chunk;
        const vertexProperties = [];
        const chunkProperties = [];
        const filtered = header.slice(0, headerEndIndex).split("\n");
        const metaData = {};
        for (const prop of filtered) {
            if (prop.startsWith("property ")) {
                const [, type, name] = prop.split(" ");
                if (chunkMode == ElementMode.Chunk) {
                    chunkProperties.push({ name, type, offset: rowChunkOffset });
                    rowChunkOffset += offsets[type];
                }
                else if (chunkMode == ElementMode.Vertex) {
                    vertexProperties.push({ name, type, offset: rowVertexOffset });
                    rowVertexOffset += offsets[type];
                }
                else if (chunkMode == ElementMode.SH) {
                    vertexProperties.push({ name, type, offset: rowVertexOffset });
                }
                else if (chunkMode == ElementMode.Float_Tuple) {
                    const view = new DataView(data, rowChunkOffset, offsets.float * 2);
                    metaData.safeOrbitCameraElevationMinMax = [view.getFloat32(0, true), view.getFloat32(4, true)];
                }
                else if (chunkMode == ElementMode.Float) {
                    const view = new DataView(data, rowChunkOffset, offsets.float);
                    metaData.safeOrbitCameraRadiusMin = view.getFloat32(0, true);
                }
                else if (chunkMode == ElementMode.Uchar) {
                    const view = new DataView(data, rowChunkOffset, offsets.uchar);
                    if (name == "up_axis") {
                        metaData.upAxis = view.getUint8(0) == 0 ? "X" : view.getUint8(0) == 1 ? "Y" : "Z";
                    }
                    else if (name == "chirality") {
                        metaData.chirality = view.getUint8(0) == 0 ? "LeftHanded" : "RightHanded";
                    }
                }
                if (!offsets[type]) {
                    Logger.Warn(`Unsupported property type: ${type}.`);
                }
            }
            else if (prop.startsWith("element ")) {
                const [, type] = prop.split(" ");
                if (type == "chunk") {
                    chunkMode = ElementMode.Chunk;
                }
                else if (type == "vertex") {
                    chunkMode = ElementMode.Vertex;
                }
                else if (type == "sh") {
                    chunkMode = ElementMode.SH;
                }
                else if (type == "safe_orbit_camera_elevation_min_max_radians") {
                    chunkMode = ElementMode.Float_Tuple;
                }
                else if (type == "safe_orbit_camera_radius_min") {
                    chunkMode = ElementMode.Float;
                }
                else if (type == "up_axis" || type == "chirality") {
                    chunkMode = ElementMode.Uchar;
                }
            }
        }
        const rowVertexLength = rowVertexOffset;
        const rowChunkLength = rowChunkOffset;
        // eslint-disable-next-line github/no-then
        return GaussianSplattingMesh.ConvertPLYWithSHToSplatAsync(data).then(async (splatsData) => {
            const dataView = new DataView(data, headerEndIndex + headerEnd.length);
            let offset = rowChunkLength * chunkCount + rowVertexLength * vertexCount;
            // faces
            const faces = [];
            if (faceCount) {
                for (let i = 0; i < faceCount; i++) {
                    const faceVertexCount = dataView.getUint8(offset);
                    if (faceVertexCount != 3) {
                        continue; // only support triangles
                    }
                    offset += 1;
                    for (let j = 0; j < faceVertexCount; j++) {
                        const vertexIndex = dataView.getUint32(offset + (2 - j) * 4, true); // change face winding
                        faces.push(vertexIndex);
                    }
                    offset += 12;
                }
            }
            // early exit for chunked/quantized ply
            if (chunkCount) {
                return await new Promise((resolve) => {
                    resolve({
                        mode: 0 /* Mode.Splat */,
                        data: splatsData.buffer,
                        sh: splatsData.sh,
                        shDegree: splatsData.shDegree,
                        faces: faces,
                        hasVertexColors: false,
                        compressed: true,
                        rawSplat: false,
                    });
                });
            }
            // count available properties. if all necessary are present then it's a splat. Otherwise, it's a point cloud
            // if faces are found, then it's a standard mesh
            let propertyCount = 0;
            let propertyColorCount = 0;
            const splatProperties = ["x", "y", "z", "scale_0", "scale_1", "scale_2", "opacity", "rot_0", "rot_1", "rot_2", "rot_3"];
            const splatColorProperties = ["red", "green", "blue", "f_dc_0", "f_dc_1", "f_dc_2"];
            for (let propertyIndex = 0; propertyIndex < vertexProperties.length; propertyIndex++) {
                const property = vertexProperties[propertyIndex];
                if (splatProperties.includes(property.name)) {
                    propertyCount++;
                }
                if (splatColorProperties.includes(property.name)) {
                    propertyColorCount++;
                }
            }
            const hasMandatoryProperties = propertyCount == splatProperties.length && propertyColorCount >= 3;
            const currentMode = faceCount ? 2 /* Mode.Mesh */ : hasMandatoryProperties ? 0 /* Mode.Splat */ : 1 /* Mode.PointCloud */;
            // parsed ready ready to be used as a splat
            return await new Promise((resolve) => {
                resolve({
                    ...metaData,
                    mode: currentMode,
                    data: splatsData.buffer,
                    sh: splatsData.sh,
                    shDegree: splatsData.shDegree,
                    faces: faces,
                    hasVertexColors: !!propertyColorCount,
                    compressed: false,
                    rawSplat: false,
                });
            });
        });
    }
}
SPLATFileLoader._DefaultLoadingOptions = {
    keepInRam: false,
    flipY: false,
    needsRotationScaleTextures: false,
    spzLibraryUrl: typeof WebAssembly === "object" ? "https://unpkg.com/@adobe/spz@0.2.2/dist/spz.js" : undefined,
};
// Add this loader into the register plugin
let _Registered = false;
/**
 * Registers the SPLATFileLoader scene loader plugin.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterSPLATFileLoader() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    RegisterSceneLoaderPlugin(new SPLATFileLoader());
}
//# sourceMappingURL=splatFileLoader.pure.js.map