import { __esDecorate, __runInitializers } from "../../tslib.es6.js";
import { serialize } from "../../Misc/decorators.js";
import { ParticleSystemSet } from "../particleSystemSet.js";
import { SystemBlock } from "./Blocks/systemBlock.pure.js";
import { NodeParticleBuildState } from "./nodeParticleBuildState.js";
import { SerializationHelper } from "../../Misc/decorators.serialization.js";
import { Observable } from "../../Misc/observable.js";
import { GetClass } from "../../Misc/typeStore.js";
import { WebRequest } from "../../Misc/webRequest.js";

import { Tools } from "../../Misc/tools.pure.js";
import { AbstractEngine } from "../../Engines/abstractEngine.js";
import { ParticleInputBlock } from "./Blocks/particleInputBlock.pure.js";
import { ParticleTextureSourceBlock } from "./Blocks/particleSourceTextureBlock.pure.js";
import { NodeParticleContextualSources } from "./Enums/nodeParticleContextualSources.js";
import { UpdatePositionBlock } from "./Blocks/Update/updatePositionBlock.pure.js";
import { ParticleMathBlock, ParticleMathBlockOperations } from "./Blocks/particleMathBlock.pure.js";
import { BoxShapeBlock } from "./Blocks/Emitters/boxShapeBlock.pure.js";
import { CreateParticleBlock } from "./Blocks/Emitters/createParticleBlock.pure.js";
/**
 * Defines a set of particle systems defined as a node graph.
 * NPE: #K6F1ZB#1
 * PG: #ZT509U#1
 */
let NodeParticleSystemSet = (() => {
    var _a;
    let _name_decorators;
    let _name_initializers = [];
    let _name_extraInitializers = [];
    let _comment_decorators;
    let _comment_initializers = [];
    let _comment_extraInitializers = [];
    return _a = class NodeParticleSystemSet {
            /**
             * Gets the system blocks
             */
            get systemBlocks() {
                return this._systemBlocks;
            }
            /**
             * Gets the list of input blocks attached to this material
             * @returns an array of InputBlocks
             */
            get inputBlocks() {
                const blocks = [];
                for (const block of this.attachedBlocks) {
                    if (block.isInput) {
                        blocks.push(block);
                    }
                }
                return blocks;
            }
            /**
             * Get a block by its name
             * @param name defines the name of the block to retrieve
             * @returns the required block or null if not found
             */
            getBlockByName(name) {
                let result = null;
                for (const block of this.attachedBlocks) {
                    if (block.name === name) {
                        if (!result) {
                            result = block;
                        }
                        else {
                            Tools.Warn("More than one block was found with the name `" + name + "`");
                            return result;
                        }
                    }
                }
                return result;
            }
            /**
             * Get a block using a predicate
             * @param predicate defines the predicate used to find the good candidate
             * @returns the required block or null if not found
             */
            getBlockByPredicate(predicate) {
                for (const block of this.attachedBlocks) {
                    if (predicate(block)) {
                        return block;
                    }
                }
                return null;
            }
            /**
             * Get an input block using a predicate
             * @param predicate defines the predicate used to find the good candidate
             * @returns the required input block or null if not found
             */
            getInputBlockByPredicate(predicate) {
                for (const block of this.attachedBlocks) {
                    if (block.isInput && predicate(block)) {
                        return block;
                    }
                }
                return null;
            }
            /**
             * Creates a new set
             * @param name defines the name of the set
             */
            constructor(name) {
                this._systemBlocks = [];
                this._buildId = 0;
                /**
                 * Gets an array of blocks that needs to be serialized even if they are not yet connected
                 */
                this.attachedBlocks = [];
                /**
                 * Gets or sets data used by visual editor
                 * @see https://npe.babylonjs.com
                 */
                this.editorData = null;
                /**
                 * Observable raised when the particle set is built
                 */
                this.onBuildObservable = new Observable();
                /**
                 * The name of the set
                 */
                this.name = __runInitializers(this, _name_initializers, void 0);
                /**
                 * A free comment about the set
                 */
                this.comment = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _comment_initializers, void 0));
                this.BJSNODEPARTICLEEDITOR = (__runInitializers(this, _comment_extraInitializers), this._getGlobalNodeParticleEditor());
                this.name = name;
            }
            /**
             * Gets the current class name of the node particle set e.g. "NodeParticleSystemSet"
             * @returns the class name
             */
            getClassName() {
                return "NodeParticleSystemSet";
            }
            _initializeBlock(node, autoConfigure = true) {
                if (this.attachedBlocks.indexOf(node) === -1) {
                    this.attachedBlocks.push(node);
                }
                for (const input of node.inputs) {
                    const connectedPoint = input.connectedPoint;
                    if (connectedPoint) {
                        const block = connectedPoint.ownerBlock;
                        if (block !== node) {
                            this._initializeBlock(block, autoConfigure);
                        }
                    }
                }
            }
            /** Get the editor from bundle or global
             * @returns the global NPE
             */
            _getGlobalNodeParticleEditor() {
                // UMD global name detection from bundle metadata.
                // Note: rollup-built UMD bundles do not expose the editor class
                // directly on the namespace - it lives on `.default.NodeParticleEditor` -
                // so we unwrap that case before falling back to the BABYLON global.
                if (typeof NODEPARTICLEEDITOR !== "undefined") {
                    if (NODEPARTICLEEDITOR.NodeParticleEditor) {
                        return NODEPARTICLEEDITOR;
                    }
                    if (NODEPARTICLEEDITOR.default?.NodeParticleEditor) {
                        return NODEPARTICLEEDITOR.default;
                    }
                }
                // In case of module let's check the global emitted from the editor entry point.
                if (typeof BABYLON !== "undefined" && typeof BABYLON.NodeParticleEditor !== "undefined") {
                    return BABYLON;
                }
                return undefined;
            }
            /** Creates the node editor window.
             * @param additionalConfig Define the configuration of the editor
             */
            _createNodeParticleEditor(additionalConfig) {
                const nodeEditorConfig = {
                    nodeParticleSet: this,
                    ...additionalConfig,
                };
                this.BJSNODEPARTICLEEDITOR.NodeParticleEditor.Show(nodeEditorConfig);
            }
            /**
             * Launch the node particle editor
             * @param config Define the configuration of the editor
             * @returns a promise fulfilled when the node editor is visible
             */
            async editAsync(config) {
                return await new Promise((resolve) => {
                    this.BJSNODEPARTICLEEDITOR = this.BJSNODEPARTICLEEDITOR || this._getGlobalNodeParticleEditor();
                    if (typeof this.BJSNODEPARTICLEEDITOR == "undefined") {
                        const editorUrl = config && config.editorURL ? config.editorURL : _a.EditorURL;
                        // Load editor and add it to the DOM
                        Tools.LoadBabylonScript(editorUrl, () => {
                            this.BJSNODEPARTICLEEDITOR = this.BJSNODEPARTICLEEDITOR || this._getGlobalNodeParticleEditor();
                            this._createNodeParticleEditor(config?.nodeEditorConfig);
                            resolve();
                        });
                    }
                    else {
                        // Otherwise creates the editor
                        this._createNodeParticleEditor(config?.nodeEditorConfig);
                        resolve();
                    }
                });
            }
            /**
             * Builds the particle system set from the defined blocks.
             * @param scene defines the hosting scene
             * @param verbose defines whether to log detailed information during the build process (false by default)
             * @returns a promise that resolves to the built particle system set
             */
            async buildAsync(scene, verbose = false) {
                const output = new ParticleSystemSet();
                // Initialize all blocks
                for (const block of this._systemBlocks) {
                    this._initializeBlock(block);
                }
                // Build the blocks
                const buildPromises = new Array();
                for (const block of this.systemBlocks) {
                    const state = new NodeParticleBuildState();
                    state.buildId = this._buildId++;
                    state.scene = scene;
                    state.verbose = verbose;
                    const system = block.createSystem(state);
                    system._source = this;
                    system._blockReference = block._internalId;
                    // Errors
                    state.emitErrors();
                    buildPromises.push(state.waitForBuildPromisesAsync());
                    output.systems.push(system);
                }
                await Promise.all(buildPromises);
                this.onBuildObservable.notifyObservers(this);
                return output;
            }
            /**
             * Clear the current node particle set
             */
            clear() {
                this.attachedBlocks.length = 0;
                this._systemBlocks.length = 0;
            }
            /**
             * Clear the current set and restore it to a default state
             */
            setToDefault() {
                this.clear();
                this.editorData = null;
                // Main system
                const system = new SystemBlock("Particle system");
                // Update position
                const updatePositionBlock = new UpdatePositionBlock("Update position");
                updatePositionBlock.output.connectTo(system.particle);
                // Contextual inputs
                const positionBlock = new ParticleInputBlock("Position");
                positionBlock.contextualValue = NodeParticleContextualSources.Position;
                const directionBlock = new ParticleInputBlock("Scaled direction");
                directionBlock.contextualValue = NodeParticleContextualSources.ScaledDirection;
                // Add
                const addBlock = new ParticleMathBlock("Add");
                addBlock.operation = ParticleMathBlockOperations.Add;
                positionBlock.output.connectTo(addBlock.left);
                directionBlock.output.connectTo(addBlock.right);
                addBlock.output.connectTo(updatePositionBlock.position);
                // Create particle
                const createParticleBlock = new CreateParticleBlock("Create particle");
                // Shape
                const emitterShape = new BoxShapeBlock("Box shape");
                createParticleBlock.particle.connectTo(emitterShape.particle);
                emitterShape.output.connectTo(updatePositionBlock.particle);
                // Texture
                const textureBlock = new ParticleTextureSourceBlock("Texture");
                textureBlock.textureOutput.connectTo(system.texture);
                textureBlock.url = Tools.GetAssetUrl("https://assets.babylonjs.com/core/textures/flare.png");
                this._systemBlocks.push(system);
            }
            /**
             * Remove a block from the current system set
             * @param block defines the block to remove
             */
            removeBlock(block) {
                const attachedBlockIndex = this.attachedBlocks.indexOf(block);
                if (attachedBlockIndex > -1) {
                    this.attachedBlocks.splice(attachedBlockIndex, 1);
                }
                if (block.isSystem) {
                    const index = this._systemBlocks.indexOf(block);
                    if (index > -1) {
                        this._systemBlocks.splice(index, 1);
                    }
                }
            }
            /**
             * Clear the current graph and load a new one from a serialization object
             * @param source defines the JSON representation of the particle set
             * @param merge defines whether or not the source must be merged or replace the current content
             */
            parseSerializedObject(source, merge = false) {
                if (!merge) {
                    this.clear();
                }
                const map = {};
                // Create blocks
                for (const parsedBlock of source.blocks) {
                    const blockType = GetClass(parsedBlock.customType);
                    if (blockType) {
                        const block = new blockType();
                        block._deserialize(parsedBlock);
                        map[parsedBlock.id] = block;
                        this.attachedBlocks.push(block);
                        if (block.isSystem) {
                            this._systemBlocks.push(block);
                        }
                    }
                }
                // Reconnect teleportation
                for (const block of this.attachedBlocks) {
                    if (block.isTeleportOut) {
                        const teleportOut = block;
                        const id = teleportOut._tempEntryPointUniqueId;
                        if (id) {
                            const source = map[id];
                            if (source) {
                                source.attachToEndpoint(teleportOut);
                            }
                        }
                    }
                }
                // Connections - Starts with input blocks only (except if in "merge" mode where we scan all blocks)
                for (let blockIndex = 0; blockIndex < source.blocks.length; blockIndex++) {
                    const parsedBlock = source.blocks[blockIndex];
                    const block = map[parsedBlock.id];
                    if (!block) {
                        continue;
                    }
                    if (block.inputs.length && parsedBlock.inputs.some((i) => i.targetConnectionName) && !merge) {
                        continue;
                    }
                    this._restoreConnections(block, source, map);
                }
                // UI related info
                if (source.locations || (source.editorData && source.editorData.locations)) {
                    const locations = source.locations || source.editorData.locations;
                    for (const location of locations) {
                        if (map[location.blockId]) {
                            location.blockId = map[location.blockId].uniqueId;
                        }
                    }
                    if (merge && this.editorData && this.editorData.locations) {
                        locations.concat(this.editorData.locations);
                    }
                    if (source.locations) {
                        this.editorData = {
                            locations: locations,
                        };
                    }
                    else {
                        this.editorData = source.editorData;
                        this.editorData.locations = locations;
                    }
                    const blockMap = {};
                    for (const key in map) {
                        blockMap[key] = map[key].uniqueId;
                    }
                    this.editorData.map = blockMap;
                }
                this.comment = source.comment;
            }
            _restoreConnections(block, source, map) {
                for (const outputPoint of block.outputs) {
                    for (const candidate of source.blocks) {
                        const target = map[candidate.id];
                        if (!target) {
                            continue;
                        }
                        for (const input of candidate.inputs) {
                            if (map[input.targetBlockId] === block && input.targetConnectionName === outputPoint.name) {
                                const inputPoint = target.getInputByName(input.inputName);
                                if (!inputPoint || inputPoint.isConnected) {
                                    continue;
                                }
                                outputPoint.connectTo(inputPoint, true);
                                this._restoreConnections(target, source, map);
                                continue;
                            }
                        }
                    }
                }
            }
            /**
             * Serializes this node particle set in a JSON representation
             * @param selectedBlocks defines the list of blocks to save (if null the whole node particle set will be saved)
             * @returns the serialized particle system set object
             */
            serialize(selectedBlocks) {
                const serializationObject = selectedBlocks ? {} : SerializationHelper.Serialize(this);
                serializationObject.editorData = JSON.parse(JSON.stringify(this.editorData)); // Copy
                let blocks = [];
                if (selectedBlocks) {
                    blocks = selectedBlocks;
                }
                else {
                    serializationObject.customType = "BABYLON.NodeParticleSystemSet";
                }
                // Blocks
                serializationObject.blocks = [];
                for (const block of blocks) {
                    serializationObject.blocks.push(block.serialize());
                }
                if (!selectedBlocks) {
                    for (const block of this.attachedBlocks) {
                        if (blocks.indexOf(block) !== -1) {
                            continue;
                        }
                        serializationObject.blocks.push(block.serialize());
                    }
                }
                return serializationObject;
            }
            /**
             * Makes a duplicate of the current particle system set.
             * @param name defines the name to use for the new particle system set
             * @returns the cloned particle system set
             */
            clone(name) {
                const serializationObject = this.serialize();
                const clone = SerializationHelper.Clone(() => new _a(name), this);
                clone.name = name;
                clone.snippetId = this.snippetId;
                clone.parseSerializedObject(serializationObject);
                clone._buildId = this._buildId;
                return clone;
            }
            /**
             * Disposes the resources
             */
            dispose() {
                for (const block of this.attachedBlocks) {
                    block.dispose();
                }
                this.attachedBlocks.length = 0;
                this.onBuildObservable.clear();
            }
            /**
             * Creates a new node particle set set to default basic configuration
             * @param name defines the name of the particle set
             * @returns a new NodeParticleSystemSet
             */
            static CreateDefault(name) {
                const nodeParticleSet = new _a(name);
                nodeParticleSet.setToDefault();
                return nodeParticleSet;
            }
            /**
             * Creates a node particle set from parsed data
             * @param source defines the JSON representation of the particle set
             * @returns a new node particle set
             */
            static Parse(source) {
                const nodeParticleSet = SerializationHelper.Parse(() => new _a(source.name), source, null);
                nodeParticleSet.parseSerializedObject(source);
                return nodeParticleSet;
            }
            /**
             * Creates a node particle set from a snippet saved in a remote file
             * @param name defines the name of the node particle set to create
             * @param url defines the url to load from
             * @param nodeParticleSet defines a node particle set to update (instead of creating a new one)
             * @returns a promise that will resolve to the new node particle set
             */
            // eslint-disable-next-line @typescript-eslint/promise-function-async, no-restricted-syntax
            static ParseFromFileAsync(name, url, nodeParticleSet) {
                return new Promise((resolve, reject) => {
                    const request = new WebRequest();
                    request.addEventListener("readystatechange", () => {
                        if (request.readyState == 4) {
                            if (request.status == 200) {
                                const serializationObject = JSON.parse(request.responseText);
                                if (!nodeParticleSet) {
                                    nodeParticleSet = SerializationHelper.Parse(() => new _a(name), serializationObject, null);
                                }
                                nodeParticleSet.parseSerializedObject(serializationObject);
                                resolve(nodeParticleSet);
                            }
                            else {
                                // eslint-disable-next-line @typescript-eslint/prefer-promise-reject-errors
                                reject("Unable to load the node particle system set");
                            }
                        }
                    });
                    request.open("GET", url);
                    request.send();
                });
            }
            /**
             * Creates a node particle set from a snippet saved by the node particle editor
             * @param snippetId defines the snippet to load
             * @param nodeParticleSet defines a node particle set to update (instead of creating a new one)
             * @returns a promise that will resolve to the new node particle set
             */
            // eslint-disable-next-line @typescript-eslint/promise-function-async, no-restricted-syntax
            static ParseFromSnippetAsync(snippetId, nodeParticleSet) {
                if (snippetId === "_BLANK") {
                    return Promise.resolve(_a.CreateDefault("blank"));
                }
                return new Promise((resolve, reject) => {
                    const request = new WebRequest();
                    request.addEventListener("readystatechange", () => {
                        if (request.readyState == 4) {
                            if (request.status == 200) {
                                const snippet = JSON.parse(JSON.parse(request.responseText).jsonPayload);
                                const serializationObject = JSON.parse(snippet.nodeParticle);
                                if (!nodeParticleSet) {
                                    nodeParticleSet = SerializationHelper.Parse(() => new _a(snippetId), serializationObject, null);
                                }
                                nodeParticleSet.parseSerializedObject(serializationObject);
                                nodeParticleSet.snippetId = snippetId;
                                try {
                                    resolve(nodeParticleSet);
                                }
                                catch (err) {
                                    // eslint-disable-next-line @typescript-eslint/prefer-promise-reject-errors
                                    reject(err);
                                }
                            }
                            else {
                                // eslint-disable-next-line @typescript-eslint/prefer-promise-reject-errors
                                reject("Unable to load the snippet " + snippetId);
                            }
                        }
                    });
                    request.open("GET", this.SnippetUrl + "/" + snippetId.replace(/#/g, "/"));
                    request.send();
                });
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _name_decorators = [serialize()];
            _comment_decorators = [serialize("comment")];
            __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: obj => "name" in obj, get: obj => obj.name, set: (obj, value) => { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
            __esDecorate(null, null, _comment_decorators, { kind: "field", name: "comment", static: false, private: false, access: { has: obj => "comment" in obj, get: obj => obj.comment, set: (obj, value) => { obj.comment = value; } }, metadata: _metadata }, _comment_initializers, _comment_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        /** Define the Url to load node editor script */
        _a.EditorURL = `${Tools._DefaultCdnUrl}/v${AbstractEngine.Version}/nodeParticleEditor/babylon.nodeParticleEditor.js`,
        /** Define the Url to load snippets */
        _a.SnippetUrl = `https://snippet.babylonjs.com`,
        _a;
})();
export { NodeParticleSystemSet };
//# sourceMappingURL=nodeParticleSystemSet.js.map