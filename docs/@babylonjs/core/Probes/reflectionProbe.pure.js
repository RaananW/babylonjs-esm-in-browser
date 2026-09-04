/** This file must only contain pure code and pure imports */
import { __esDecorate, __runInitializers } from "../tslib.es6.js";
import { serializeAsMeshReference, serializeAsVector3 } from "../Misc/decorators.js";
import { SerializationHelper } from "../Misc/decorators.serialization.js";
import { RenderTargetTexture } from "../Materials/Textures/renderTargetTexture.pure.js";
import { Matrix, Vector3 } from "../Maths/math.vector.pure.js";
import { Scene } from "../scene.pure.js";

/**
 * Class used to generate realtime reflection / refraction cube textures
 * @see https://doc.babylonjs.com/features/featuresDeepDive/environment/reflectionProbes
 */
let ReflectionProbe = (() => {
    var _a;
    let __attachedMesh_decorators;
    let __attachedMesh_initializers = [];
    let __attachedMesh_extraInitializers = [];
    let _position_decorators;
    let _position_initializers = [];
    let _position_extraInitializers = [];
    return _a = class ReflectionProbe {
            /**
             * Creates a new reflection probe
             * @param name defines the name of the probe
             * @param size defines the texture resolution (for each face)
             * @param scene defines the hosting scene
             * @param generateMipMaps defines if mip maps should be generated automatically (true by default)
             * @param useFloat defines if HDR data (float data) should be used to store colors (false by default)
             * @param linearSpace defines if the probe should be generated in linear space or not (false by default)
             */
            constructor(
            /** defines the name of the probe */
            name, size, scene, generateMipMaps = true, useFloat = false, linearSpace = false) {
                this.name = name;
                this._viewMatrix = Matrix.Identity();
                this._target = Vector3.Zero();
                this._add = Vector3.Zero();
                this._attachedMesh = __runInitializers(this, __attachedMesh_initializers, void 0);
                this._invertYAxis = (__runInitializers(this, __attachedMesh_extraInitializers), false);
                /** Gets or sets probe position (center of the cube map) */
                this.position = __runInitializers(this, _position_initializers, Vector3.Zero());
                /**
                 * Gets or sets an object used to store user defined information for the reflection probe.
                 */
                this.metadata = (__runInitializers(this, _position_extraInitializers), null);
                /** @internal */
                this._parentContainer = null;
                this._scene = scene;
                // Create the scene field if not exist.
                if (!this._scene.reflectionProbes) {
                    this._scene.reflectionProbes = [];
                }
                this._scene.reflectionProbes.push(this);
                if (scene.getEngine().supportsUniformBuffers) {
                    this._sceneUBOs = [];
                    for (let i = 0; i < 6; ++i) {
                        this._sceneUBOs.push(scene.createSceneUniformBuffer(`Scene for Reflection Probe (name "${name}") face #${i}`, { forceMono: true }));
                    }
                }
                let textureType = 0;
                if (useFloat) {
                    const caps = this._scene.getEngine().getCaps();
                    if (caps.textureHalfFloatRender) {
                        textureType = 2;
                    }
                    else if (caps.textureFloatRender) {
                        textureType = 1;
                    }
                }
                this._renderTargetTexture = new RenderTargetTexture(name, size, scene, generateMipMaps, true, textureType, true);
                this._renderTargetTexture.gammaSpace = !linearSpace;
                this._renderTargetTexture.invertZ = scene.useRightHandedSystem;
                const useReverseDepthBuffer = scene.getEngine().useReverseDepthBuffer;
                this._renderTargetTexture.onBeforeRenderObservable.add((faceIndex) => {
                    if (this._sceneUBOs) {
                        scene.setSceneUniformBuffer(this._sceneUBOs[faceIndex]);
                        scene.getSceneUniformBuffer().unbindEffect();
                    }
                    switch (faceIndex) {
                        case 0:
                            this._add.copyFromFloats(1, 0, 0);
                            break;
                        case 1:
                            this._add.copyFromFloats(-1, 0, 0);
                            break;
                        case 2:
                            this._add.copyFromFloats(0, this._invertYAxis ? 1 : -1, 0);
                            break;
                        case 3:
                            this._add.copyFromFloats(0, this._invertYAxis ? -1 : 1, 0);
                            break;
                        case 4:
                            this._add.copyFromFloats(0, 0, scene.useRightHandedSystem ? -1 : 1);
                            break;
                        case 5:
                            this._add.copyFromFloats(0, 0, scene.useRightHandedSystem ? 1 : -1);
                            break;
                    }
                    if (this._attachedMesh) {
                        this.position.copyFrom(this._attachedMesh.getAbsolutePosition());
                    }
                    this.position.addToRef(this._add, this._target);
                    const lookAtFunction = scene.useRightHandedSystem ? Matrix.LookAtRHToRef : Matrix.LookAtLHToRef;
                    const perspectiveFunction = scene.useRightHandedSystem ? Matrix.PerspectiveFovRH : Matrix.PerspectiveFovLH;
                    lookAtFunction(this.position, this._target, Vector3.Up(), this._viewMatrix);
                    if (scene.activeCamera) {
                        this._projectionMatrix = perspectiveFunction(Math.PI / 2, 1, useReverseDepthBuffer ? scene.activeCamera.maxZ : scene.activeCamera.minZ, useReverseDepthBuffer ? scene.activeCamera.minZ : scene.activeCamera.maxZ, this._scene.getEngine().isNDCHalfZRange);
                        scene.setTransformMatrix(this._viewMatrix, this._projectionMatrix);
                        if (scene.activeCamera.isRigCamera && !this._renderTargetTexture.activeCamera) {
                            this._renderTargetTexture.activeCamera = scene.activeCamera.rigParent || null;
                        }
                    }
                    if (this._sceneUBOs) {
                        scene.finalizeSceneUbo();
                    }
                    scene._forcedViewPosition = this.position;
                });
                let currentApplyByPostProcess;
                this._renderTargetTexture.onBeforeBindObservable.add(() => {
                    const engine = scene.getEngine();
                    this._currentSceneUBO = scene.getSceneUniformBuffer();
                    if (engine._enableGPUDebugMarkers) {
                        engine._debugPushGroup?.(`reflection probe generation for ${name}`);
                    }
                    currentApplyByPostProcess = this._scene.imageProcessingConfiguration.applyByPostProcess;
                    if (linearSpace) {
                        scene.imageProcessingConfiguration.applyByPostProcess = true;
                    }
                });
                this._renderTargetTexture.onAfterUnbindObservable.add(() => {
                    const engine = scene.getEngine();
                    scene.imageProcessingConfiguration.applyByPostProcess = currentApplyByPostProcess;
                    scene._forcedViewPosition = null;
                    if (this._sceneUBOs) {
                        scene.setSceneUniformBuffer(this._currentSceneUBO);
                    }
                    scene.updateTransformMatrix(true);
                    if (engine._enableGPUDebugMarkers) {
                        engine._debugPopGroup?.();
                    }
                });
            }
            /** Gets or sets the number of samples to use for multi-sampling (0 by default). Required WebGL2 */
            get samples() {
                return this._renderTargetTexture.samples;
            }
            set samples(value) {
                this._renderTargetTexture.samples = value;
            }
            /** Gets or sets the refresh rate to use (on every frame by default) */
            get refreshRate() {
                return this._renderTargetTexture.refreshRate;
            }
            set refreshRate(value) {
                this._renderTargetTexture.refreshRate = value;
            }
            /**
             * Gets the hosting scene
             * @returns a Scene
             */
            getScene() {
                return this._scene;
            }
            /** Gets the internal CubeTexture used to render to */
            get cubeTexture() {
                return this._renderTargetTexture;
            }
            /** Gets or sets the list of meshes to render */
            get renderList() {
                return this._renderTargetTexture.renderList;
            }
            set renderList(value) {
                this._renderTargetTexture.renderList = value;
            }
            /**
             * Attach the probe to a specific mesh (Rendering will be done from attached mesh's position)
             * @param mesh defines the mesh to attach to
             */
            attachToMesh(mesh) {
                this._attachedMesh = mesh;
            }
            /**
             * Specifies whether or not the stencil and depth buffer are cleared between two rendering groups
             * @param renderingGroupId The rendering group id corresponding to its index
             * @param autoClearDepthStencil Automatically clears depth and stencil between groups if true.
             */
            setRenderingAutoClearDepthStencil(renderingGroupId, autoClearDepthStencil) {
                this._renderTargetTexture.setRenderingAutoClearDepthStencil(renderingGroupId, autoClearDepthStencil);
            }
            /**
             * Clean all associated resources
             */
            dispose() {
                const index = this._scene.reflectionProbes.indexOf(this);
                if (index !== -1) {
                    // Remove from the scene if found
                    this._scene.reflectionProbes.splice(index, 1);
                }
                if (this._parentContainer) {
                    const index = this._parentContainer.reflectionProbes.indexOf(this);
                    if (index > -1) {
                        this._parentContainer.reflectionProbes.splice(index, 1);
                    }
                    this._parentContainer = null;
                }
                if (this._renderTargetTexture) {
                    this._renderTargetTexture.dispose();
                    this._renderTargetTexture = null;
                }
                if (this._sceneUBOs) {
                    for (const ubo of this._sceneUBOs) {
                        ubo.dispose();
                    }
                    this._sceneUBOs = [];
                }
            }
            /**
             * Converts the reflection probe information to a readable string for debug purpose.
             * @param fullDetails Supports for multiple levels of logging within scene loading
             * @returns the human readable reflection probe info
             */
            toString(fullDetails) {
                let ret = "Name: " + this.name;
                if (fullDetails) {
                    ret += ", position: " + this.position.toString();
                    if (this._attachedMesh) {
                        ret += ", attached mesh: " + this._attachedMesh.name;
                    }
                }
                return ret;
            }
            /**
             * Get the class name of the refection probe.
             * @returns "ReflectionProbe"
             */
            getClassName() {
                return "ReflectionProbe";
            }
            /**
             * Serialize the reflection probe to a JSON representation we can easily use in the respective Parse function.
             * @returns The JSON representation of the texture
             */
            serialize() {
                const serializationObject = SerializationHelper.Serialize(this, this._renderTargetTexture.serialize());
                serializationObject.isReflectionProbe = true;
                serializationObject.metadata = this.metadata;
                return serializationObject;
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __attachedMesh_decorators = [serializeAsMeshReference()];
            _position_decorators = [serializeAsVector3()];
            __esDecorate(null, null, __attachedMesh_decorators, { kind: "field", name: "_attachedMesh", static: false, private: false, access: { has: obj => "_attachedMesh" in obj, get: obj => obj._attachedMesh, set: (obj, value) => { obj._attachedMesh = value; } }, metadata: _metadata }, __attachedMesh_initializers, __attachedMesh_extraInitializers);
            __esDecorate(null, null, _position_decorators, { kind: "field", name: "position", static: false, private: false, access: { has: obj => "position" in obj, get: obj => obj.position, set: (obj, value) => { obj.position = value; } }, metadata: _metadata }, _position_initializers, _position_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
export { ReflectionProbe };
let _Registered = false;
/**
 * Parse the JSON representation of a reflection probe in order to recreate the reflection probe in the given scene.
 * @param parsedReflectionProbe Define the JSON representation of the reflection probe
 * @param scene Define the scene the parsed reflection probe should be instantiated in
 * @param rootUrl Define the root url of the parsing sequence in the case of relative dependencies
 * @returns The parsed reflection probe if successful
 */
export function ReflectionProbeParse(parsedReflectionProbe, scene, rootUrl) {
    let reflectionProbe = null;
    if (scene.reflectionProbes) {
        for (let index = 0; index < scene.reflectionProbes.length; index++) {
            const rp = scene.reflectionProbes[index];
            if (rp.name === parsedReflectionProbe.name) {
                reflectionProbe = rp;
                break;
            }
        }
    }
    reflectionProbe = SerializationHelper.Parse(() => reflectionProbe || new ReflectionProbe(parsedReflectionProbe.name, parsedReflectionProbe.renderTargetSize, scene, parsedReflectionProbe._generateMipMaps), parsedReflectionProbe, scene, rootUrl);
    reflectionProbe.cubeTexture._waitingRenderList = parsedReflectionProbe.renderList;
    if (parsedReflectionProbe._attachedMesh) {
        reflectionProbe.attachToMesh(scene.getMeshById(parsedReflectionProbe._attachedMesh));
    }
    if (parsedReflectionProbe.metadata) {
        reflectionProbe.metadata = parsedReflectionProbe.metadata;
    }
    return reflectionProbe;
}
/**
 * Register side effects for reflectionProbe.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterReflectionProbe() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    ReflectionProbe.Parse = ReflectionProbeParse;
    Scene.prototype.removeReflectionProbe = function (toRemove) {
        if (!this.reflectionProbes) {
            return -1;
        }
        const index = this.reflectionProbes.indexOf(toRemove);
        if (index !== -1) {
            this.reflectionProbes.splice(index, 1);
        }
        return index;
    };
    Scene.prototype.addReflectionProbe = function (newReflectionProbe) {
        if (!this.reflectionProbes) {
            this.reflectionProbes = [];
        }
        this.reflectionProbes.push(newReflectionProbe);
    };
}
//# sourceMappingURL=reflectionProbe.pure.js.map