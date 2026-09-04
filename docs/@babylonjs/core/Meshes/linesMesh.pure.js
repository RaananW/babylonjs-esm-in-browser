/** This file must only contain pure code and pure imports */
var _a, _b;
import { Color3, Color4 } from "../Maths/math.color.pure.js";
import { VertexBuffer } from "../Buffers/buffer.pure.js";
import { Mesh } from "../Meshes/mesh.pure.js";
import { InstancedMesh } from "../Meshes/instancedMesh.pure.js";
import { Material } from "../Materials/material.pure.js";
import { ShaderMaterial } from "../Materials/shaderMaterial.pure.js";
/**
 * Line mesh
 * @see https://doc.babylonjs.com/features/featuresDeepDive/mesh/creation/param
 */
export class LinesMesh extends Mesh {
    _isShaderMaterial(shader) {
        if (!shader) {
            return false;
        }
        return shader.getClassName() === "ShaderMaterial";
    }
    /**
     * Creates a new LinesMesh
     * @param name defines the name
     * @param scene defines the hosting scene
     * @param parent defines the parent mesh if any
     * @param source defines the optional source LinesMesh used to clone data from
     * @param doNotCloneChildren When cloning, skip cloning child meshes of source, default False.
     * When false, achieved by calling a clone(), also passing False.
     * This will make creation of children, recursive.
     * @param useVertexColor defines if this LinesMesh supports vertex color
     * @param useVertexAlpha defines if this LinesMesh supports vertex alpha
     * @param material material to use to draw the line. If not provided, will create a new one
     */
    constructor(name, scene = null, parent = null, source = null, doNotCloneChildren, 
    /**
     * If vertex color should be applied to the mesh
     */
    useVertexColor, 
    /**
     * If vertex alpha should be applied to the mesh
     */
    useVertexAlpha, material) {
        super(name, scene, parent, source, doNotCloneChildren);
        this.useVertexColor = useVertexColor;
        this.useVertexAlpha = useVertexAlpha;
        /**
         * Color of the line (Default: White)
         */
        this.color = new Color3(1, 1, 1);
        /**
         * Alpha of the line (Default: 1)
         */
        this.alpha = 1;
        /** Shader language used by the material */
        this._shaderLanguage = 0 /* ShaderLanguage.GLSL */;
        this._ownsMaterial = false;
        if (source) {
            this.color = source.color.clone();
            this.alpha = source.alpha;
            this.useVertexColor = source.useVertexColor;
            this.useVertexAlpha = source.useVertexAlpha;
        }
        this.intersectionThreshold = 0.1;
        const defines = [];
        const options = {
            attributes: [VertexBuffer.PositionKind],
            uniforms: ["world", "viewProjection"],
            needAlphaBlending: true,
            defines: defines,
            useClipPlane: null,
            shaderLanguage: 0 /* ShaderLanguage.GLSL */,
        };
        if (!this.useVertexAlpha) {
            options.needAlphaBlending = false;
        }
        else {
            options.defines.push("#define VERTEXALPHA");
        }
        if (!this.useVertexColor) {
            options.uniforms.push("color");
            this._color4 = new Color4();
        }
        else {
            options.defines.push("#define VERTEXCOLOR");
            options.attributes.push(VertexBuffer.ColorKind);
        }
        if (material) {
            this.material = material;
        }
        else {
            const engine = this.getScene().getEngine();
            if (engine.isWebGPU && !LinesMesh.ForceGLSL) {
                this._shaderLanguage = 1 /* ShaderLanguage.WGSL */;
            }
            options.shaderLanguage = this._shaderLanguage;
            options.extraInitializationsAsync = async () => {
                if (this._shaderLanguage === 1 /* ShaderLanguage.WGSL */) {
                    await Promise.all([import("../ShadersWGSL/color.vertex.js"), import("../ShadersWGSL/color.fragment.js")]);
                }
                else {
                    await Promise.all([import("../Shaders/color.vertex.js"), import("../Shaders/color.fragment.js")]);
                }
            };
            const material = new ShaderMaterial("colorShader", this.getScene(), "color", options, false);
            material.doNotSerialize = true;
            this._ownsMaterial = true;
            this._setInternalMaterial(material);
        }
    }
    /**
     * @returns the string "LineMesh"
     */
    getClassName() {
        return "LinesMesh";
    }
    /**
     * @internal
     */
    get material() {
        return this._internalAbstractMeshDataInfo._material;
    }
    /**
     * @internal
     */
    set material(value) {
        const currentMaterial = this.material;
        if (currentMaterial === value) {
            return;
        }
        const shouldDispose = currentMaterial && this._ownsMaterial;
        this._ownsMaterial = false;
        this._setInternalMaterial(value);
        if (shouldDispose) {
            currentMaterial?.dispose();
        }
    }
    _setInternalMaterial(material) {
        this._setMaterial(material);
        if (this.material) {
            this.material.fillMode = Material.LineListDrawMode;
            this.material.disableLighting = true;
        }
    }
    /**
     * @internal
     */
    get checkCollisions() {
        return false;
    }
    set checkCollisions(value) {
        // Just ignore it
    }
    /**
     * @internal
     */
    _bind(_subMesh, colorEffect) {
        if (!this._geometry) {
            return this;
        }
        // VBOs
        const indexToBind = this.isUnIndexed ? null : this._geometry.getIndexBuffer();
        if (!this._userInstancedBuffersStorage || this.hasThinInstances) {
            this._geometry._bind(colorEffect, indexToBind);
        }
        else {
            this._geometry._bind(colorEffect, indexToBind, this._userInstancedBuffersStorage.vertexBuffers, this._userInstancedBuffersStorage.vertexArrayObjects);
        }
        // Color
        if (!this.useVertexColor && this._isShaderMaterial(this.material)) {
            const { r, g, b } = this.color;
            this._color4.set(r, g, b, this.alpha);
            this.material.setColor4("color", this._color4);
        }
        return this;
    }
    /**
     * @internal
     */
    _draw(subMesh, fillMode, instancesCount) {
        if (!this._geometry || !this._geometry.getVertexBuffers() || (!this._unIndexed && !this._geometry.getIndexBuffer())) {
            return this;
        }
        const engine = this.getScene().getEngine();
        // Draw order
        if (this._unIndexed) {
            engine.drawArraysType(Material.LineListDrawMode, subMesh.verticesStart, subMesh.verticesCount, instancesCount);
        }
        else {
            engine.drawElementsType(Material.LineListDrawMode, subMesh.indexStart, subMesh.indexCount, instancesCount);
        }
        return this;
    }
    /**
     * Disposes of the line mesh (this disposes of the automatically created material if not instructed otherwise).
     * @param doNotRecurse If children should be disposed
     * @param disposeMaterialAndTextures This parameter is used to force disposing the material in case it is not the default one
     * @param doNotDisposeMaterial If the material should not be disposed (default: false, meaning the material might be disposed)
     */
    dispose(doNotRecurse, disposeMaterialAndTextures = false, doNotDisposeMaterial) {
        if (!doNotDisposeMaterial) {
            if (this._ownsMaterial) {
                this.material?.dispose(false, false, true);
            }
            else if (disposeMaterialAndTextures) {
                this.material?.dispose(false, false, true);
            }
        }
        super.dispose(doNotRecurse);
    }
    /**
     * Returns a new LineMesh object cloned from the current one.
     * @param name defines the cloned mesh name
     * @param newParent defines the new mesh parent
     * @param doNotCloneChildren if set to true, none of the mesh children are cloned (false by default)
     * @returns the new mesh
     */
    clone(name, newParent = null, doNotCloneChildren) {
        if (newParent && newParent._addToSceneRootNodes === undefined) {
            const createOptions = newParent;
            createOptions.source = this;
            return new LinesMesh(name, this.getScene(), createOptions.parent, createOptions.source, createOptions.doNotCloneChildren);
        }
        return new LinesMesh(name, this.getScene(), newParent, this, doNotCloneChildren);
    }
    /**
     * Creates a new InstancedLinesMesh object from the mesh model.
     * @see https://doc.babylonjs.com/features/featuresDeepDive/mesh/copies/instances
     * @param name defines the name of the new instance
     * @returns a new InstancedLinesMesh
     */
    createInstance(name) {
        const instance = new InstancedLinesMesh(name, this);
        if (this.instancedBuffers) {
            instance.instancedBuffers = {};
            for (const key in this.instancedBuffers) {
                instance.instancedBuffers[key] = this.instancedBuffers[key];
            }
        }
        return instance;
    }
    /**
     * Serializes this ground mesh
     * @param serializationObject object to write serialization to
     */
    serialize(serializationObject) {
        super.serialize(serializationObject);
        serializationObject.color = this.color.asArray();
        serializationObject.alpha = this.alpha;
    }
    /**
     * Parses a serialized ground mesh
     * @param parsedMesh the serialized mesh
     * @param scene the scene to create the ground mesh in
     * @returns the created ground mesh
     */
    static Parse(parsedMesh, scene) {
        const result = new LinesMesh(parsedMesh.name, scene);
        result.color = Color3.FromArray(parsedMesh.color);
        result.alpha = parsedMesh.alpha;
        return result;
    }
}
/**
 * Force all the LineMeshes to compile their default color material to glsl even on WebGPU engines.
 * False by default. This is mostly meant for backward compatibility.
 */
LinesMesh.ForceGLSL = false;
/**
 * Creates an instance based on a source LinesMesh
 */
export class InstancedLinesMesh extends InstancedMesh {
    constructor(name, source) {
        super(name, source);
        this.intersectionThreshold = source.intersectionThreshold;
    }
    /**
     * @returns the string "InstancedLinesMesh".
     */
    getClassName() {
        return "InstancedLinesMesh";
    }
}
let _Registered = false;
/**
 * Register side effects for linesMesh.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterLinesMesh() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    Mesh._LinesMeshParser = (parsedMesh, scene) => {
        return LinesMesh.Parse(parsedMesh, scene);
    };
}
// #region GENERATED_SIDE_EFFECT_STUBS — do not edit, regenerate with `npm run generate:side-effect-stubs`
import { _MissingSideEffect } from "../Misc/devTools.js";
(_a = LinesMesh.prototype).enableEdgesRendering ?? (_a.enableEdgesRendering = _MissingSideEffect("LinesMesh", "enableEdgesRendering"));
(_b = InstancedLinesMesh.prototype).enableEdgesRendering ?? (_b.enableEdgesRendering = _MissingSideEffect("InstancedLinesMesh", "enableEdgesRendering"));
// #endregion GENERATED_SIDE_EFFECT_STUBS
//# sourceMappingURL=linesMesh.pure.js.map