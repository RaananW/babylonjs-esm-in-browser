import { __classPrivateFieldGet, __classPrivateFieldSet, __esDecorate, __runInitializers } from "../tslib.es6.js";
import { serialize, serializeAsColor3, expandToProperty } from "../Misc/decorators.js";
import { Vector3 } from "../Maths/math.vector.pure.js";
import { Color3, TmpColors } from "../Maths/math.color.pure.js";
import { Node } from "../node.js";
import { UniformBuffer } from "../Materials/uniformBuffer.js";
import { GetClass } from "../Misc/typeStore.js";
import { LightConstants } from "./lightConstants.js";
import { SerializationHelper } from "../Misc/decorators.serialization.js";
/**
 * Base class of all the lights in Babylon. It groups all the generic information about lights.
 * Lights are used, as you would expect, to affect how meshes are seen, in terms of both illumination and colour.
 * All meshes allow light to pass through them unless shadow generation is activated. The default number of lights allowed is four but this can be increased.
 */
let Light = (() => {
    var _a, _Light_renderPriority_accessor_storage;
    let _classSuper = Node;
    let _instanceExtraInitializers = [];
    let _diffuse_decorators;
    let _diffuse_initializers = [];
    let _diffuse_extraInitializers = [];
    let _specular_decorators;
    let _specular_initializers = [];
    let _specular_extraInitializers = [];
    let _falloffType_decorators;
    let _falloffType_initializers = [];
    let _falloffType_extraInitializers = [];
    let _intensity_decorators;
    let _intensity_initializers = [];
    let _intensity_extraInitializers = [];
    let _get_range_decorators;
    let _get_intensityMode_decorators;
    let _get_radius_decorators;
    let __renderPriority_decorators;
    let __renderPriority_initializers = [];
    let __renderPriority_extraInitializers = [];
    let _renderPriority_decorators;
    let _renderPriority_initializers = [];
    let _renderPriority_extraInitializers = [];
    let __shadowEnabled_decorators;
    let __shadowEnabled_initializers = [];
    let __shadowEnabled_extraInitializers = [];
    let __excludeWithLayerMask_decorators;
    let __excludeWithLayerMask_initializers = [];
    let __excludeWithLayerMask_extraInitializers = [];
    let __includeOnlyWithLayerMask_decorators;
    let __includeOnlyWithLayerMask_initializers = [];
    let __includeOnlyWithLayerMask_extraInitializers = [];
    let __lightmapMode_decorators;
    let __lightmapMode_initializers = [];
    let __lightmapMode_extraInitializers = [];
    return _a = class Light extends _classSuper {
            /**
             * Defines how far from the source the light is impacting in scene units.
             * Note: Unused in PBR material as the distance light falloff is defined following the inverse squared falloff.
             */
            get range() {
                return this._range;
            }
            /**
             * Defines how far from the source the light is impacting in scene units.
             * Note: Unused in PBR material as the distance light falloff is defined following the inverse squared falloff.
             */
            set range(value) {
                this._range = value;
                this._inverseSquaredRange = 1.0 / (this.range * this.range);
            }
            /**
             * Gets the photometric scale used to interpret the intensity.
             * This is only relevant with PBR Materials where the light intensity can be defined in a physical way.
             */
            get intensityMode() {
                return this._intensityMode;
            }
            /**
             * Sets the photometric scale used to interpret the intensity.
             * This is only relevant with PBR Materials where the light intensity can be defined in a physical way.
             */
            set intensityMode(value) {
                this._intensityMode = value;
                this._computePhotometricScale();
            }
            /**
             * Gets the light radius used by PBR Materials to simulate soft area lights.
             */
            get radius() {
                return this._radius;
            }
            /**
             * sets the light radius used by PBR Materials to simulate soft area lights.
             */
            set radius(value) {
                this._radius = value;
                this._computePhotometricScale();
            }
            /**
             * Defines the rendering priority of the lights. It can help in case of fallback or number of lights
             * exceeding the number allowed of the materials.
             */
            get renderPriority() { return __classPrivateFieldGet(this, _Light_renderPriority_accessor_storage, "f"); }
            set renderPriority(value) { __classPrivateFieldSet(this, _Light_renderPriority_accessor_storage, value, "f"); }
            /**
             * Gets whether or not the shadows are enabled for this light. This can help turning off/on shadow without detaching
             * the current shadow generator.
             */
            get shadowEnabled() {
                return this._shadowEnabled;
            }
            /**
             * Sets whether or not the shadows are enabled for this light. This can help turning off/on shadow without detaching
             * the current shadow generator.
             */
            set shadowEnabled(value) {
                if (this._shadowEnabled === value) {
                    return;
                }
                this._shadowEnabled = value;
                this._markMeshesAsLightDirty();
            }
            /**
             * Gets the only meshes impacted by this light.
             */
            get includedOnlyMeshes() {
                return this._includedOnlyMeshes;
            }
            /**
             * Sets the only meshes impacted by this light.
             */
            set includedOnlyMeshes(value) {
                this._includedOnlyMeshes = value;
                this._hookArrayForIncludedOnly(value);
            }
            /**
             * Gets the meshes not impacted by this light.
             */
            get excludedMeshes() {
                return this._excludedMeshes;
            }
            /**
             * Sets the meshes not impacted by this light.
             */
            set excludedMeshes(value) {
                this._excludedMeshes = value;
                this._hookArrayForExcluded(value);
            }
            /**
             * Gets the layer id use to find what meshes are not impacted by the light.
             * Inactive if 0
             */
            get excludeWithLayerMask() {
                return this._excludeWithLayerMask;
            }
            /**
             * Sets the layer id use to find what meshes are not impacted by the light.
             * Inactive if 0
             */
            set excludeWithLayerMask(value) {
                this._excludeWithLayerMask = value;
                this._resyncMeshes();
            }
            /**
             * Gets the layer id use to find what meshes are impacted by the light.
             * Inactive if 0
             */
            get includeOnlyWithLayerMask() {
                return this._includeOnlyWithLayerMask;
            }
            /**
             * Sets the layer id use to find what meshes are impacted by the light.
             * Inactive if 0
             */
            set includeOnlyWithLayerMask(value) {
                this._includeOnlyWithLayerMask = value;
                this._resyncMeshes();
            }
            /**
             * Gets the lightmap mode of this light (should be one of the constants defined by Light.LIGHTMAP_x)
             */
            get lightmapMode() {
                return this._lightmapMode;
            }
            /**
             * Sets the lightmap mode of this light (should be one of the constants defined by Light.LIGHTMAP_x)
             */
            set lightmapMode(value) {
                if (this._lightmapMode === value) {
                    return;
                }
                this._lightmapMode = value;
                this._markMeshesAsLightDirty();
            }
            /**
             * Returns the view matrix.
             * @param _faceIndex The index of the face for which we want to extract the view matrix. Only used for point light types.
             * @returns The view matrix. Can be null, if a view matrix cannot be defined for the type of light considered (as for a hemispherical light, for example).
             */
            getViewMatrix(_faceIndex) {
                return null;
            }
            /**
             * Returns the projection matrix.
             * Note that viewMatrix and renderList are optional and are only used by lights that calculate the projection matrix from a list of meshes (e.g. directional lights with automatic extents calculation).
             * @param _viewMatrix The view transform matrix of the light (optional).
             * @param _renderList The list of meshes to take into account when calculating the projection matrix (optional).
             * @returns The projection matrix. Can be null, if a projection matrix cannot be defined for the type of light considered (as for a hemispherical light, for example).
             */
            getProjectionMatrix(_viewMatrix, _renderList) {
                return null;
            }
            /**
             * Creates a Light object in the scene.
             * Documentation : https://doc.babylonjs.com/features/featuresDeepDive/lights/lights_introduction
             * @param name The friendly name of the light
             * @param scene The scene the light belongs too
             * @param dontAddToScene True to not add the light to the scene
             */
            constructor(name, scene, dontAddToScene) {
                super(name, scene, false);
                /**
                 * Diffuse gives the basic color to an object.
                 */
                this.diffuse = (__runInitializers(this, _instanceExtraInitializers), __runInitializers(this, _diffuse_initializers, new Color3(1.0, 1.0, 1.0)));
                /**
                 * Specular produces a highlight color on an object.
                 * Note: This is not affecting PBR materials.
                 */
                this.specular = (__runInitializers(this, _diffuse_extraInitializers), __runInitializers(this, _specular_initializers, new Color3(1.0, 1.0, 1.0)));
                /**
                 * Defines the falloff type for this light. This lets overriding how punctual light are
                 * falling off base on range or angle.
                 * This can be set to any values in Light.FALLOFF_x.
                 *
                 * Note: This is only useful for PBR Materials at the moment. This could be extended if required to
                 * other types of materials.
                 */
                this.falloffType = (__runInitializers(this, _specular_extraInitializers), __runInitializers(this, _falloffType_initializers, _a.FALLOFF_DEFAULT));
                /**
                 * Strength of the light.
                 * Note: By default it is define in the framework own unit.
                 * Note: In PBR materials the intensityMode can be use to chose what unit the intensity is defined in.
                 */
                this.intensity = (__runInitializers(this, _falloffType_extraInitializers), __runInitializers(this, _intensity_initializers, 1.0));
                this._range = (__runInitializers(this, _intensity_extraInitializers), Number.MAX_VALUE);
                /** @internal */
                this._inverseSquaredRange = 0;
                /**
                 * Cached photometric scale default to 1.0 as the automatic intensity mode defaults to 1.0 for every type
                 * of light.
                 */
                this._photometricScale = 1.0;
                this._intensityMode = _a.INTENSITYMODE_AUTOMATIC;
                this._radius = 0.00001;
                this._renderPriority = __runInitializers(this, __renderPriority_initializers, void 0);
                _Light_renderPriority_accessor_storage.set(this, (__runInitializers(this, __renderPriority_extraInitializers), __runInitializers(this, _renderPriority_initializers, 0)));
                this._shadowEnabled = (__runInitializers(this, _renderPriority_extraInitializers), __runInitializers(this, __shadowEnabled_initializers, true));
                this._includedOnlyMeshes = __runInitializers(this, __shadowEnabled_extraInitializers);
                this._excludeWithLayerMask = __runInitializers(this, __excludeWithLayerMask_initializers, 0);
                this._includeOnlyWithLayerMask = (__runInitializers(this, __excludeWithLayerMask_extraInitializers), __runInitializers(this, __includeOnlyWithLayerMask_initializers, 0));
                this._lightmapMode = (__runInitializers(this, __includeOnlyWithLayerMask_extraInitializers), __runInitializers(this, __lightmapMode_initializers, 0));
                /**
                 * Shadow generators associated to the light.
                 * @internal Internal use only.
                 */
                this._shadowGenerators = (__runInitializers(this, __lightmapMode_extraInitializers), null);
                /**
                 * @internal Internal use only.
                 */
                this._excludedMeshesIds = new Array();
                /**
                 * @internal Internal use only.
                 */
                this._includedOnlyMeshesIds = new Array();
                /**
                 * Used internally by ClusteredLight to sort lights
                 * @internal
                 */
                this._currentViewDepth = 0;
                /**
                 * Used internally by ClusteredLightContainer to keep child lights out of mesh light source lists.
                 * @internal
                 */
                this._clusteredContainer = null;
                /** @internal */
                this._isLight = true;
                if (!dontAddToScene) {
                    this.getScene().addLight(this);
                }
                this._uniformBuffer = new UniformBuffer(this.getScene().getEngine(), undefined, undefined, name);
                this._buildUniformLayout();
                this.includedOnlyMeshes = [];
                this.excludedMeshes = [];
                if (!dontAddToScene) {
                    this._resyncMeshes();
                }
            }
            /**
             * Sets the passed Effect "effect" with the Light textures.
             * @param effect The effect to update
             * @param lightIndex The index of the light in the effect to update
             * @returns The light
             */
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            transferTexturesToEffect(effect, lightIndex) {
                // Do nothing by default.
                return this;
            }
            /**
             * Binds the lights information from the scene to the effect for the given mesh.
             * @param lightIndex Light index
             * @param scene The scene where the light belongs to
             * @param effect The effect we are binding the data to
             * @param useSpecular Defines if specular is supported
             * @param receiveShadows Defines if the effect (mesh) we bind the light for receives shadows
             */
            _bindLight(lightIndex, scene, effect, useSpecular, receiveShadows = true) {
                const iAsString = lightIndex.toString();
                let needUpdate = false;
                this._uniformBuffer.bindToEffect(effect, "Light" + iAsString);
                if (this._renderId !== scene.getRenderId() || this._lastUseSpecular !== useSpecular || !this._uniformBuffer.useUbo) {
                    this._renderId = scene.getRenderId();
                    this._lastUseSpecular = useSpecular;
                    const scaledIntensity = this.getScaledIntensity();
                    this.transferToEffect(effect, iAsString);
                    this.diffuse.scaleToRef(scaledIntensity, TmpColors.Color3[0]);
                    this._uniformBuffer.updateColor4("vLightDiffuse", TmpColors.Color3[0], this.range, iAsString);
                    if (useSpecular) {
                        this.specular.scaleToRef(scaledIntensity, TmpColors.Color3[1]);
                        this._uniformBuffer.updateColor4("vLightSpecular", TmpColors.Color3[1], this.radius, iAsString);
                    }
                    needUpdate = true;
                }
                // Textures might still need to be rebound.
                this.transferTexturesToEffect(effect, iAsString);
                // Shadows
                if (scene.shadowsEnabled && this.shadowEnabled && receiveShadows) {
                    const shadowGenerator = this.getShadowGenerator(scene.activeCamera) ?? this.getShadowGenerator();
                    if (shadowGenerator) {
                        shadowGenerator.bindShadowLight(iAsString, effect);
                        needUpdate = true;
                    }
                }
                if (needUpdate) {
                    this._uniformBuffer.update();
                }
                else {
                    this._uniformBuffer.bindUniformBuffer();
                }
            }
            /**
             * Returns the string "Light".
             * @returns the class name
             */
            getClassName() {
                return "Light";
            }
            /**
             * Converts the light information to a readable string for debug purpose.
             * @param fullDetails Supports for multiple levels of logging within scene loading
             * @returns the human readable light info
             */
            toString(fullDetails) {
                let ret = "Name: " + this.name;
                ret += ", type: " + ["Point", "Directional", "Spot", "Hemispheric", "Clustered"][this.getTypeID()];
                if (this.animations) {
                    for (let i = 0; i < this.animations.length; i++) {
                        ret += ", animation[0]: " + this.animations[i].toString(fullDetails);
                    }
                }
                return ret;
            }
            /** @internal */
            _syncParentEnabledState() {
                super._syncParentEnabledState();
                if (!this.isDisposed()) {
                    this._resyncMeshes();
                }
            }
            /**
             * Set the enabled state of this node.
             * @param value - the new enabled state
             */
            setEnabled(value) {
                super.setEnabled(value);
                this._resyncMeshes();
            }
            /**
             * Returns the Light associated shadow generator if any.
             * @param camera Camera for which the shadow generator should be retrieved (default: null). If null, retrieves the default shadow generator
             * @returns the associated shadow generator.
             */
            getShadowGenerator(camera = null) {
                if (this._shadowGenerators === null) {
                    return null;
                }
                return this._shadowGenerators.get(camera) ?? null;
            }
            /**
             * Returns all the shadow generators associated to this light
             * @returns
             */
            getShadowGenerators() {
                return this._shadowGenerators;
            }
            /**
             * Returns a Vector3, the absolute light position in the World.
             * @returns the world space position of the light
             */
            getAbsolutePosition() {
                return Vector3.Zero();
            }
            /**
             * Specifies if the light will affect the passed mesh.
             * @param mesh The mesh to test against the light
             * @returns true the mesh is affected otherwise, false.
             */
            canAffectMesh(mesh) {
                if (!mesh) {
                    return true;
                }
                if (this.includedOnlyMeshes && this.includedOnlyMeshes.length > 0 && this.includedOnlyMeshes.indexOf(mesh) === -1) {
                    return false;
                }
                if (this.excludedMeshes && this.excludedMeshes.length > 0 && this.excludedMeshes.indexOf(mesh) !== -1) {
                    return false;
                }
                if (this.includeOnlyWithLayerMask !== 0 && (this.includeOnlyWithLayerMask & mesh.layerMask) === 0) {
                    return false;
                }
                if (this.excludeWithLayerMask !== 0 && this.excludeWithLayerMask & mesh.layerMask) {
                    return false;
                }
                return true;
            }
            /**
             * Releases resources associated with this node.
             * @param doNotRecurse Set to true to not recurse into each children (recurse into each children by default)
             * @param disposeMaterialAndTextures Set to true to also dispose referenced materials and textures (false by default)
             */
            dispose(doNotRecurse, disposeMaterialAndTextures = false) {
                if (this._shadowGenerators) {
                    const iterator = this._shadowGenerators.values();
                    for (let key = iterator.next(); key.done !== true; key = iterator.next()) {
                        const shadowGenerator = key.value;
                        shadowGenerator.dispose();
                    }
                    this._shadowGenerators = null;
                }
                // Animations
                this.getScene().stopAnimation(this);
                if (this._parentContainer) {
                    const index = this._parentContainer.lights.indexOf(this);
                    if (index > -1) {
                        this._parentContainer.lights.splice(index, 1);
                    }
                    this._parentContainer = null;
                }
                // Remove from meshes
                for (const mesh of this.getScene().meshes) {
                    mesh._removeLightSource(this, true);
                }
                this._uniformBuffer.dispose();
                // Remove from scene
                this.getScene().removeLight(this);
                super.dispose(doNotRecurse, disposeMaterialAndTextures);
            }
            /**
             * Returns the light type ID (integer).
             * @returns The light Type id as a constant defines in Light.LIGHTTYPEID_x
             */
            // eslint-disable-next-line @typescript-eslint/naming-convention
            getTypeID() {
                return 0;
            }
            /**
             * Returns the intensity scaled by the Photometric Scale according to the light type and intensity mode.
             * @returns the scaled intensity in intensity mode unit
             */
            getScaledIntensity() {
                return this._photometricScale * this.intensity;
            }
            /**
             * Returns a new Light object, named "name", from the current one.
             * @param name The name of the cloned light
             * @param newParent The parent of this light, if it has one
             * @returns the new created light
             */
            clone(name, newParent = null) {
                const constructor = _a.GetConstructorFromName(this.getTypeID(), name, this.getScene());
                if (!constructor) {
                    return null;
                }
                const clonedLight = SerializationHelper.Clone(constructor, this);
                if (name) {
                    clonedLight.name = name;
                }
                if (newParent) {
                    clonedLight.parent = newParent;
                }
                clonedLight.setEnabled(this.isEnabled());
                this.onClonedObservable.notifyObservers(clonedLight);
                return clonedLight;
            }
            /**
             * Serializes the current light into a Serialization object.
             * @returns the serialized object.
             */
            serialize() {
                const serializationObject = SerializationHelper.Serialize(this);
                serializationObject.uniqueId = this.uniqueId;
                // Type
                serializationObject.type = this.getTypeID();
                // Parent
                if (this.parent) {
                    this.parent._serializeAsParent(serializationObject);
                }
                // Inclusion / exclusions
                if (this.excludedMeshes.length > 0) {
                    serializationObject.excludedMeshesIds = [];
                    for (const mesh of this.excludedMeshes) {
                        serializationObject.excludedMeshesIds.push(mesh.id);
                    }
                }
                if (this.includedOnlyMeshes.length > 0) {
                    serializationObject.includedOnlyMeshesIds = [];
                    for (const mesh of this.includedOnlyMeshes) {
                        serializationObject.includedOnlyMeshesIds.push(mesh.id);
                    }
                }
                // Animations
                SerializationHelper.AppendSerializedAnimations(this, serializationObject);
                serializationObject.ranges = this.serializeAnimationRanges();
                serializationObject.isEnabled = this.isEnabled();
                return serializationObject;
            }
            /**
             * Creates a new typed light from the passed type (integer) : point light = 0, directional light = 1, spot light = 2, hemispheric light = 3.
             * This new light is named "name" and added to the passed scene.
             * @param type Type according to the types available in Light.LIGHTTYPEID_x
             * @param name The friendly name of the light
             * @param scene The scene the new light will belong to
             * @returns the constructor function
             */
            static GetConstructorFromName(type, name, scene) {
                const constructorFunc = Node.Construct("Light_Type_" + type, name, scene);
                if (constructorFunc) {
                    return constructorFunc;
                }
                // Default to no light for none present once.
                return null;
            }
            /**
             * Parses the passed "parsedLight" and returns a new instanced Light from this parsing.
             * @param parsedLight The JSON representation of the light
             * @param scene The scene to create the parsed light in
             * @param rootUrl The root url to use to load assets referenced by the light (e.g. textures)
             * @returns the created light after parsing
             */
            static Parse(parsedLight, scene, rootUrl = "") {
                const constructor = _a.GetConstructorFromName(parsedLight.type, parsedLight.name, scene);
                if (!constructor) {
                    return null;
                }
                const light = SerializationHelper.Parse(constructor, parsedLight, scene, rootUrl);
                // Inclusion / exclusions
                if (parsedLight.excludedMeshesIds) {
                    light._excludedMeshesIds = parsedLight.excludedMeshesIds;
                }
                if (parsedLight.includedOnlyMeshesIds) {
                    light._includedOnlyMeshesIds = parsedLight.includedOnlyMeshesIds;
                }
                // Parent
                if (parsedLight.parentId !== undefined) {
                    light._waitingParentId = parsedLight.parentId;
                }
                if (parsedLight.parentInstanceIndex !== undefined) {
                    light._waitingParentInstanceIndex = parsedLight.parentInstanceIndex;
                }
                // Falloff
                if (parsedLight.falloffType !== undefined) {
                    light.falloffType = parsedLight.falloffType;
                }
                // Lightmaps
                if (parsedLight.lightmapMode !== undefined) {
                    light.lightmapMode = parsedLight.lightmapMode;
                }
                // Animations
                if (parsedLight.animations) {
                    for (let animationIndex = 0; animationIndex < parsedLight.animations.length; animationIndex++) {
                        const parsedAnimation = parsedLight.animations[animationIndex];
                        const internalClass = GetClass("BABYLON.Animation");
                        if (internalClass) {
                            light.animations.push(internalClass.Parse(parsedAnimation));
                        }
                    }
                    Node.ParseAnimationRanges(light, parsedLight, scene);
                }
                if (parsedLight.autoAnimate) {
                    scene.beginAnimation(light, parsedLight.autoAnimateFrom, parsedLight.autoAnimateTo, parsedLight.autoAnimateLoop, parsedLight.autoAnimateSpeed || 1.0);
                }
                // Check if isEnabled is defined to be back compatible with prior serialized versions.
                if (parsedLight.isEnabled !== undefined) {
                    light.setEnabled(parsedLight.isEnabled);
                }
                light._onParsed(parsedLight, scene, rootUrl);
                return light;
            }
            /**
             * Called after the light has been fully parsed and all base properties have been set.
             * Override in subclasses to handle custom serialized data.
             * @param _parsedLight The JSON representation of the light
             * @param _scene The scene the light belongs to
             * @param _rootUrl The root url to use to load assets referenced by the light (e.g. textures)
             */
            _onParsed(_parsedLight, _scene, _rootUrl = "") {
                // Override in subclasses
            }
            _hookArrayForExcluded(array) {
                const oldPush = array.push;
                array.push = (...items) => {
                    const result = oldPush.apply(array, items);
                    if (this._clusteredContainer) {
                        return result;
                    }
                    for (const item of items) {
                        item._resyncLightSource(this);
                    }
                    return result;
                };
                const oldSplice = array.splice;
                array.splice = (index, deleteCount) => {
                    const deleted = oldSplice.call(array, index, deleteCount ?? array.length);
                    if (this._clusteredContainer) {
                        return deleted;
                    }
                    for (const item of deleted) {
                        item._resyncLightSource(this);
                    }
                    return deleted;
                };
                // Re-sync every mesh rather than just the ones in the new array: a mesh removed from the
                // exclusion list would otherwise stay unlit. Mirrors _hookArrayForIncludedOnly.
                this._resyncMeshes();
            }
            _hookArrayForIncludedOnly(array) {
                const oldPush = array.push;
                array.push = (...items) => {
                    const result = oldPush.apply(array, items);
                    this._resyncMeshes();
                    return result;
                };
                const oldSplice = array.splice;
                array.splice = (index, deleteCount) => {
                    const deleted = oldSplice.call(array, index, deleteCount ?? array.length);
                    this._resyncMeshes();
                    return deleted;
                };
                this._resyncMeshes();
            }
            _resyncMeshes() {
                if (this._clusteredContainer) {
                    return;
                }
                for (const mesh of this.getScene().meshes) {
                    mesh._resyncLightSource(this);
                }
            }
            /**
             * Forces the meshes to update their light related information in their rendering used effects
             * @internal Internal Use Only
             */
            _markMeshesAsLightDirty() {
                for (const mesh of this.getScene().meshes) {
                    if (mesh.lightSources.indexOf(this) !== -1) {
                        mesh._markSubMeshesAsLightDirty();
                    }
                }
            }
            /**
             * Recomputes the cached photometric scale if needed.
             */
            _computePhotometricScale() {
                this._photometricScale = this._getPhotometricScale();
                this.getScene().resetCachedMaterial();
            }
            /**
             * @returns the Photometric Scale according to the light type and intensity mode.
             */
            _getPhotometricScale() {
                let photometricScale = 0.0;
                const lightTypeID = this.getTypeID();
                //get photometric mode
                let photometricMode = this.intensityMode;
                if (photometricMode === _a.INTENSITYMODE_AUTOMATIC) {
                    if (lightTypeID === _a.LIGHTTYPEID_DIRECTIONALLIGHT) {
                        photometricMode = _a.INTENSITYMODE_ILLUMINANCE;
                    }
                    else {
                        photometricMode = _a.INTENSITYMODE_LUMINOUSINTENSITY;
                    }
                }
                //compute photometric scale
                switch (lightTypeID) {
                    case _a.LIGHTTYPEID_POINTLIGHT:
                    case _a.LIGHTTYPEID_SPOTLIGHT:
                        switch (photometricMode) {
                            case _a.INTENSITYMODE_LUMINOUSPOWER:
                                photometricScale = 1.0 / (4.0 * Math.PI);
                                break;
                            case _a.INTENSITYMODE_LUMINOUSINTENSITY:
                                photometricScale = 1.0;
                                break;
                            case _a.INTENSITYMODE_LUMINANCE:
                                photometricScale = this.radius * this.radius;
                                break;
                        }
                        break;
                    case _a.LIGHTTYPEID_DIRECTIONALLIGHT:
                        switch (photometricMode) {
                            case _a.INTENSITYMODE_ILLUMINANCE:
                                photometricScale = 1.0;
                                break;
                            case _a.INTENSITYMODE_LUMINANCE: {
                                // When radius (and therefore solid angle) is non-zero a directional lights brightness can be specified via central (peak) luminance.
                                // For a directional light the 'radius' defines the angular radius (in radians) rather than world-space radius (e.g. in metres).
                                let apexAngleRadians = this.radius;
                                // Impose a minimum light angular size to avoid the light becoming an infinitely small angular light source (i.e. a dirac delta function).
                                apexAngleRadians = Math.max(apexAngleRadians, 0.001);
                                const solidAngle = 2.0 * Math.PI * (1.0 - Math.cos(apexAngleRadians));
                                photometricScale = solidAngle;
                                break;
                            }
                        }
                        break;
                    case _a.LIGHTTYPEID_HEMISPHERICLIGHT:
                        // No fall off in hemispheric light.
                        photometricScale = 1.0;
                        break;
                    case _a.LIGHTTYPEID_RECT_AREALIGHT:
                        // Area lights interpret their intensity directly; no additional photometric scaling is applied.
                        photometricScale = 1.0;
                        break;
                }
                return photometricScale;
            }
            /**
             * Reorder the light in the scene according to their defined priority.
             * @internal Internal Use Only
             */
            _reorderLightsInScene() {
                const scene = this.getScene();
                if (this._renderPriority != 0) {
                    scene.requireLightSorting = true;
                }
                this.getScene().sortLightsByPriority();
            }
            /**
             * Returns true when all texture resources used by this light are ready (e.g. projection textures).
             * Override in subclasses that use texture resources.
             * @returns true if all light textures are ready
             */
            areLightTexturesReady() {
                return true;
            }
            /**
             * @internal
             */
            _isReady() {
                return true;
            }
        },
        _Light_renderPriority_accessor_storage = new WeakMap(),
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _diffuse_decorators = [serializeAsColor3()];
            _specular_decorators = [serializeAsColor3()];
            _falloffType_decorators = [serialize()];
            _intensity_decorators = [serialize()];
            _get_range_decorators = [serialize()];
            _get_intensityMode_decorators = [serialize()];
            _get_radius_decorators = [serialize()];
            __renderPriority_decorators = [serialize()];
            _renderPriority_decorators = [expandToProperty("_reorderLightsInScene")];
            __shadowEnabled_decorators = [serialize("shadowEnabled")];
            __excludeWithLayerMask_decorators = [serialize("excludeWithLayerMask")];
            __includeOnlyWithLayerMask_decorators = [serialize("includeOnlyWithLayerMask")];
            __lightmapMode_decorators = [serialize("lightmapMode")];
            __esDecorate(_a, null, _get_range_decorators, { kind: "getter", name: "range", static: false, private: false, access: { has: obj => "range" in obj, get: obj => obj.range }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _get_intensityMode_decorators, { kind: "getter", name: "intensityMode", static: false, private: false, access: { has: obj => "intensityMode" in obj, get: obj => obj.intensityMode }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _get_radius_decorators, { kind: "getter", name: "radius", static: false, private: false, access: { has: obj => "radius" in obj, get: obj => obj.radius }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _renderPriority_decorators, { kind: "accessor", name: "renderPriority", static: false, private: false, access: { has: obj => "renderPriority" in obj, get: obj => obj.renderPriority, set: (obj, value) => { obj.renderPriority = value; } }, metadata: _metadata }, _renderPriority_initializers, _renderPriority_extraInitializers);
            __esDecorate(null, null, _diffuse_decorators, { kind: "field", name: "diffuse", static: false, private: false, access: { has: obj => "diffuse" in obj, get: obj => obj.diffuse, set: (obj, value) => { obj.diffuse = value; } }, metadata: _metadata }, _diffuse_initializers, _diffuse_extraInitializers);
            __esDecorate(null, null, _specular_decorators, { kind: "field", name: "specular", static: false, private: false, access: { has: obj => "specular" in obj, get: obj => obj.specular, set: (obj, value) => { obj.specular = value; } }, metadata: _metadata }, _specular_initializers, _specular_extraInitializers);
            __esDecorate(null, null, _falloffType_decorators, { kind: "field", name: "falloffType", static: false, private: false, access: { has: obj => "falloffType" in obj, get: obj => obj.falloffType, set: (obj, value) => { obj.falloffType = value; } }, metadata: _metadata }, _falloffType_initializers, _falloffType_extraInitializers);
            __esDecorate(null, null, _intensity_decorators, { kind: "field", name: "intensity", static: false, private: false, access: { has: obj => "intensity" in obj, get: obj => obj.intensity, set: (obj, value) => { obj.intensity = value; } }, metadata: _metadata }, _intensity_initializers, _intensity_extraInitializers);
            __esDecorate(null, null, __renderPriority_decorators, { kind: "field", name: "_renderPriority", static: false, private: false, access: { has: obj => "_renderPriority" in obj, get: obj => obj._renderPriority, set: (obj, value) => { obj._renderPriority = value; } }, metadata: _metadata }, __renderPriority_initializers, __renderPriority_extraInitializers);
            __esDecorate(null, null, __shadowEnabled_decorators, { kind: "field", name: "_shadowEnabled", static: false, private: false, access: { has: obj => "_shadowEnabled" in obj, get: obj => obj._shadowEnabled, set: (obj, value) => { obj._shadowEnabled = value; } }, metadata: _metadata }, __shadowEnabled_initializers, __shadowEnabled_extraInitializers);
            __esDecorate(null, null, __excludeWithLayerMask_decorators, { kind: "field", name: "_excludeWithLayerMask", static: false, private: false, access: { has: obj => "_excludeWithLayerMask" in obj, get: obj => obj._excludeWithLayerMask, set: (obj, value) => { obj._excludeWithLayerMask = value; } }, metadata: _metadata }, __excludeWithLayerMask_initializers, __excludeWithLayerMask_extraInitializers);
            __esDecorate(null, null, __includeOnlyWithLayerMask_decorators, { kind: "field", name: "_includeOnlyWithLayerMask", static: false, private: false, access: { has: obj => "_includeOnlyWithLayerMask" in obj, get: obj => obj._includeOnlyWithLayerMask, set: (obj, value) => { obj._includeOnlyWithLayerMask = value; } }, metadata: _metadata }, __includeOnlyWithLayerMask_initializers, __includeOnlyWithLayerMask_extraInitializers);
            __esDecorate(null, null, __lightmapMode_decorators, { kind: "field", name: "_lightmapMode", static: false, private: false, access: { has: obj => "_lightmapMode" in obj, get: obj => obj._lightmapMode, set: (obj, value) => { obj._lightmapMode = value; } }, metadata: _metadata }, __lightmapMode_initializers, __lightmapMode_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        /**
         * Falloff Default: light is falling off following the material specification:
         * standard material is using standard falloff whereas pbr material can request special falloff per materials.
         */
        _a.FALLOFF_DEFAULT = LightConstants.FALLOFF_DEFAULT,
        /**
         * Falloff Physical: light is falling off following the inverse squared distance law.
         */
        _a.FALLOFF_PHYSICAL = LightConstants.FALLOFF_PHYSICAL,
        /**
         * Falloff gltf: light is falling off as described in the gltf moving to PBR document
         * to enhance interoperability with other engines.
         */
        _a.FALLOFF_GLTF = LightConstants.FALLOFF_GLTF,
        /**
         * Falloff Standard: light is falling off like in the standard material
         * to enhance interoperability with other materials.
         */
        _a.FALLOFF_STANDARD = LightConstants.FALLOFF_STANDARD,
        //lightmapMode Consts
        /**
         * If every light affecting the material is in this lightmapMode,
         * material.lightmapTexture adds or multiplies
         * (depends on material.useLightmapAsShadowmap)
         * after every other light calculations.
         */
        _a.LIGHTMAP_DEFAULT = LightConstants.LIGHTMAP_DEFAULT,
        /**
         * material.lightmapTexture as only diffuse lighting from this light
         * adds only specular lighting from this light
         * adds dynamic shadows
         */
        _a.LIGHTMAP_SPECULAR = LightConstants.LIGHTMAP_SPECULAR,
        /**
         * material.lightmapTexture as only lighting
         * no light calculation from this light
         * only adds dynamic shadows from this light
         */
        _a.LIGHTMAP_SHADOWSONLY = LightConstants.LIGHTMAP_SHADOWSONLY,
        // Intensity Mode Consts
        /**
         * Each light type uses the default quantity according to its type:
         *      point/spot lights use luminous intensity
         *      directional lights use illuminance
         */
        _a.INTENSITYMODE_AUTOMATIC = LightConstants.INTENSITYMODE_AUTOMATIC,
        /**
         * lumen (lm)
         */
        _a.INTENSITYMODE_LUMINOUSPOWER = LightConstants.INTENSITYMODE_LUMINOUSPOWER,
        /**
         * candela (lm/sr)
         */
        _a.INTENSITYMODE_LUMINOUSINTENSITY = LightConstants.INTENSITYMODE_LUMINOUSINTENSITY,
        /**
         * lux (lm/m^2)
         */
        _a.INTENSITYMODE_ILLUMINANCE = LightConstants.INTENSITYMODE_ILLUMINANCE,
        /**
         * nit (cd/m^2)
         */
        _a.INTENSITYMODE_LUMINANCE = LightConstants.INTENSITYMODE_LUMINANCE,
        // Light types ids const.
        /**
         * Light type const id of the point light.
         */
        _a.LIGHTTYPEID_POINTLIGHT = LightConstants.LIGHTTYPEID_POINTLIGHT,
        /**
         * Light type const id of the directional light.
         */
        _a.LIGHTTYPEID_DIRECTIONALLIGHT = LightConstants.LIGHTTYPEID_DIRECTIONALLIGHT,
        /**
         * Light type const id of the spot light.
         */
        _a.LIGHTTYPEID_SPOTLIGHT = LightConstants.LIGHTTYPEID_SPOTLIGHT,
        /**
         * Light type const id of the hemispheric light.
         */
        _a.LIGHTTYPEID_HEMISPHERICLIGHT = LightConstants.LIGHTTYPEID_HEMISPHERICLIGHT,
        /**
         * Light type const id of the area light.
         */
        _a.LIGHTTYPEID_RECT_AREALIGHT = LightConstants.LIGHTTYPEID_RECT_AREALIGHT,
        _a;
})();
export { Light };
//# sourceMappingURL=light.js.map