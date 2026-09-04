import { __classPrivateFieldGet, __classPrivateFieldSet, __esDecorate, __runInitializers } from "../tslib.es6.js";
import { serialize, expandToProperty, serializeAsTexture } from "../Misc/decorators.js";
import { Vector4 } from "../Maths/math.vector.pure.js";
import { EngineStore } from "../Engines/engineStore.js";
import { SerializationHelper } from "../Misc/decorators.serialization.js";
/**
 * This class is used to animate meshes using a baked vertex animation texture
 * @see https://doc.babylonjs.com/features/featuresDeepDive/animation/baked_texture_animations
 * @since 5.0
 */
let BakedVertexAnimationManager = (() => {
    var _a, _BakedVertexAnimationManager_texture_accessor_storage, _BakedVertexAnimationManager_isEnabled_accessor_storage;
    let _texture_decorators;
    let _texture_initializers = [];
    let _texture_extraInitializers = [];
    let _isEnabled_decorators;
    let _isEnabled_initializers = [];
    let _isEnabled_extraInitializers = [];
    let _animationParameters_decorators;
    let _animationParameters_initializers = [];
    let _animationParameters_extraInitializers = [];
    let _time_decorators;
    let _time_initializers = [];
    let _time_extraInitializers = [];
    return _a = class BakedVertexAnimationManager {
            /**
             * The vertex animation texture
             */
            get texture() { return __classPrivateFieldGet(this, _BakedVertexAnimationManager_texture_accessor_storage, "f"); }
            set texture(value) { __classPrivateFieldSet(this, _BakedVertexAnimationManager_texture_accessor_storage, value, "f"); }
            /**
             * Enable or disable the vertex animation manager
             */
            get isEnabled() { return __classPrivateFieldGet(this, _BakedVertexAnimationManager_isEnabled_accessor_storage, "f"); }
            set isEnabled(value) { __classPrivateFieldSet(this, _BakedVertexAnimationManager_isEnabled_accessor_storage, value, "f"); }
            /**
             * Creates a new BakedVertexAnimationManager
             * @param scene defines the current scene
             */
            constructor(scene) {
                this._texture = null;
                _BakedVertexAnimationManager_texture_accessor_storage.set(this, __runInitializers(this, _texture_initializers, void 0));
                this._isEnabled = (__runInitializers(this, _texture_extraInitializers), true);
                _BakedVertexAnimationManager_isEnabled_accessor_storage.set(this, __runInitializers(this, _isEnabled_initializers, true));
                /**
                 * The animation parameters for the mesh. See setAnimationParameters()
                 */
                this.animationParameters = (__runInitializers(this, _isEnabled_extraInitializers), __runInitializers(this, _animationParameters_initializers, void 0));
                /**
                 * The time counter, to pick the correct animation frame.
                 */
                this.time = (__runInitializers(this, _animationParameters_extraInitializers), __runInitializers(this, _time_initializers, 0));
                __runInitializers(this, _time_extraInitializers);
                scene = scene || EngineStore.LastCreatedScene;
                if (!scene) {
                    return;
                }
                this._scene = scene;
                this.animationParameters = new Vector4(0, 0, 0, 30);
            }
            /** @internal */
            _markSubMeshesAsAttributesDirty() {
                for (const mesh of this._scene.meshes) {
                    if (mesh.bakedVertexAnimationManager === this) {
                        mesh._markSubMeshesAsAttributesDirty();
                    }
                }
            }
            /**
             * Binds to the effect.
             * @param effect The effect to bind to.
             * @param useInstances True when it's an instance.
             */
            bind(effect, useInstances = false) {
                if (!this._texture || !this._isEnabled) {
                    return;
                }
                const size = this._texture.getSize();
                effect.setFloat2("bakedVertexAnimationTextureSizeInverted", 1.0 / size.width, 1.0 / size.height);
                effect.setFloat("bakedVertexAnimationTime", this.time);
                if (!useInstances) {
                    effect.setVector4("bakedVertexAnimationSettings", this.animationParameters);
                }
                effect.setTexture("bakedVertexAnimationTexture", this._texture);
            }
            /**
             * Clone the current manager
             * @returns a new BakedVertexAnimationManager
             */
            clone() {
                const copy = new _a(this._scene);
                this.copyTo(copy);
                return copy;
            }
            /**
             * Sets animation parameters.
             * @param startFrame The first frame of the animation.
             * @param endFrame The last frame of the animation.
             * @param offset The offset when starting the animation.
             * @param speedFramesPerSecond The frame rate.
             */
            setAnimationParameters(startFrame, endFrame, offset = 0, speedFramesPerSecond = 30) {
                this.animationParameters = new Vector4(startFrame, endFrame, offset, speedFramesPerSecond);
            }
            /**
             * Disposes the resources of the manager.
             * @param forceDisposeTextures - Forces the disposal of all textures.
             */
            dispose(forceDisposeTextures) {
                if (forceDisposeTextures) {
                    this._texture?.dispose();
                }
            }
            /**
             * Get the current class name useful for serialization or dynamic coding.
             * @returns "BakedVertexAnimationManager"
             */
            getClassName() {
                return "BakedVertexAnimationManager";
            }
            /**
             * Makes a duplicate of the current instance into another one.
             * @param vatMap define the instance where to copy the info
             */
            copyTo(vatMap) {
                SerializationHelper.Clone(() => vatMap, this);
            }
            /**
             * Serializes this vertex animation instance
             * @returns - An object with the serialized instance.
             */
            serialize() {
                return SerializationHelper.Serialize(this);
            }
            /**
             * Parses a vertex animation setting from a serialized object.
             * @param source - Serialized object.
             * @param scene Defines the scene we are parsing for
             * @param rootUrl Defines the rootUrl to load from
             */
            parse(source, scene, rootUrl) {
                SerializationHelper.Parse(() => this, source, scene, rootUrl);
            }
        },
        _BakedVertexAnimationManager_texture_accessor_storage = new WeakMap(),
        _BakedVertexAnimationManager_isEnabled_accessor_storage = new WeakMap(),
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _texture_decorators = [serializeAsTexture(), expandToProperty("_markSubMeshesAsAttributesDirty")];
            _isEnabled_decorators = [serialize(), expandToProperty("_markSubMeshesAsAttributesDirty")];
            _animationParameters_decorators = [serialize()];
            _time_decorators = [serialize()];
            __esDecorate(_a, null, _texture_decorators, { kind: "accessor", name: "texture", static: false, private: false, access: { has: obj => "texture" in obj, get: obj => obj.texture, set: (obj, value) => { obj.texture = value; } }, metadata: _metadata }, _texture_initializers, _texture_extraInitializers);
            __esDecorate(_a, null, _isEnabled_decorators, { kind: "accessor", name: "isEnabled", static: false, private: false, access: { has: obj => "isEnabled" in obj, get: obj => obj.isEnabled, set: (obj, value) => { obj.isEnabled = value; } }, metadata: _metadata }, _isEnabled_initializers, _isEnabled_extraInitializers);
            __esDecorate(null, null, _animationParameters_decorators, { kind: "field", name: "animationParameters", static: false, private: false, access: { has: obj => "animationParameters" in obj, get: obj => obj.animationParameters, set: (obj, value) => { obj.animationParameters = value; } }, metadata: _metadata }, _animationParameters_initializers, _animationParameters_extraInitializers);
            __esDecorate(null, null, _time_decorators, { kind: "field", name: "time", static: false, private: false, access: { has: obj => "time" in obj, get: obj => obj.time, set: (obj, value) => { obj.time = value; } }, metadata: _metadata }, _time_initializers, _time_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
export { BakedVertexAnimationManager };
//# sourceMappingURL=bakedVertexAnimationManager.js.map