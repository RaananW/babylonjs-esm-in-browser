const floatNCache = [
    "Int2",
    "Int",
    "Int3",
    "Int4",
    "Vector2",
    "Vector3",
    "Vector4",
    "Float2",
    "Float",
    "Float3",
    "Float4",
    "Quaternion",
    "Color3",
    "Color4",
    "DirectColor4",
];
/** @internal */
export class WebGLPipelineContext {
    constructor() {
        this._valueCache = {};
        this.vertexCompilationError = null;
        this.fragmentCompilationError = null;
        this.programLinkError = null;
        this.programValidationError = null;
        const args = [];
        const prepareArray = function () {
            args.length = 0;
            Array.prototype.push.apply(args, arguments);
            args[0] = this._uniforms[args[0]];
        };
        const proxyFunction = (functionName) => {
            const cacheFunction = floatNCache.includes(functionName.substring(3)) && "FloatN";
            if (cacheFunction) {
                const cacheFunc = this[`_cache${cacheFunction}`];
                return function () {
                    const func = this.engine[functionName];
                    prepareArray.apply(this, arguments);
                    if (cacheFunc.apply(this, arguments)) {
                        if (!func.apply(this.engine, args)) {
                            this._valueCache[arguments[0]] = null;
                        }
                    }
                };
            }
            else {
                return function () {
                    const func = this.engine[functionName];
                    prepareArray.apply(this, arguments);
                    if (arguments[1] !== undefined) {
                        this._valueCache[arguments[0]] = null;
                        func.apply(this.engine, args);
                    }
                };
            }
        };
        ["Int?", "IntArray?", "Array?", "Float?", "Matrices", "Matrix3x3", "Matrix2x2"].forEach((functionName) => {
            const name = `set${functionName}`;
            if (this[name]) {
                return;
            }
            if (name.endsWith("?")) {
                ["", 2, 3, 4].forEach((n) => {
                    this[(name.slice(0, -1) + n)] = this[(name.slice(0, -1) + n)] || proxyFunction(name.slice(0, -1) + n).bind(this);
                });
            }
            else {
                this[name] = this[name] || proxyFunction(name).bind(this);
            }
        });
    }
    get isAsync() {
        return this.isParallelCompiled;
    }
    get isReady() {
        if (this.program) {
            if (this.isParallelCompiled) {
                return this.engine._isRenderingStateCompiled(this);
            }
            return true;
        }
        return false;
    }
    _handlesSpectorRebuildCallback(onCompiled) {
        if (onCompiled && this.program) {
            onCompiled(this.program);
        }
    }
    _fillEffectInformation(effect, uniformBuffersNames, uniformsNames, uniforms, samplerList, samplers, attributesNames, attributes) {
        const engine = this.engine;
        if (engine.supportsUniformBuffers) {
            for (const name in uniformBuffersNames) {
                effect.bindUniformBlock(name, uniformBuffersNames[name]);
            }
        }
        const effectAvailableUniforms = this.engine.getUniforms(this, uniformsNames);
        effectAvailableUniforms.forEach((uniform, index) => {
            uniforms[uniformsNames[index]] = uniform;
        });
        this._uniforms = uniforms;
        let index;
        for (index = 0; index < samplerList.length; index++) {
            const sampler = effect.getUniform(samplerList[index]);
            if (sampler == null) {
                samplerList.splice(index, 1);
                index--;
            }
        }
        samplerList.forEach((name, index) => {
            samplers[name] = index;
        });
        for (const attr of engine.getAttributes(this, attributesNames)) {
            attributes.push(attr);
        }
    }
    /**
     * Release all associated resources.
     **/
    dispose() {
        this._uniforms = {};
    }
    /**
     * @internal
     */
    _cacheMatrix(uniformName, matrix) {
        const cache = this._valueCache[uniformName];
        const flag = matrix.updateFlag;
        if (cache !== undefined && cache === flag) {
            return false;
        }
        this._valueCache[uniformName] = flag;
        return true;
    }
    /**
     * @internal
     */
    _cacheFloatN(_uniformName, _x, _y, _z, _w) {
        /**
         * arguments will be used to abstract the cache function.
         * arguments[0] is the uniform name. the rest are numbers.
         */
        let cache = this._valueCache[arguments[0]];
        if (!cache || cache.length !== arguments.length - 1) {
            cache = Array.prototype.slice.call(arguments, 1);
            this._valueCache[arguments[0]] = cache;
            return true;
        }
        let changed = false;
        for (let i = 0; i < cache.length; ++i) {
            if (cache[i] !== arguments[i + 1]) {
                cache[i] = arguments[i + 1];
                changed = true;
            }
        }
        return changed;
    }
    /**
     * @internal
     */
    _cacheFloat2(uniformName, x, y) {
        return this._cacheFloatN(uniformName, x, y);
    }
    /**
     * @internal
     */
    _cacheFloat3(uniformName, x, y, z) {
        return this._cacheFloatN(uniformName, x, y, z);
    }
    /**
     * @internal
     */
    _cacheFloat4(uniformName, x, y, z, w) {
        return this._cacheFloatN(uniformName, x, y, z, w);
    }
    /**
     * Sets matrix on a uniform variable.
     * @param uniformName Name of the variable.
     * @param matrix matrix to be set.
     */
    setMatrix(uniformName, matrix) {
        if (this._cacheMatrix(uniformName, matrix)) {
            if (!this.engine.setMatrices(this._uniforms[uniformName], matrix.toArray())) {
                this._valueCache[uniformName] = null;
            }
        }
    }
    /**
     * Sets a Vector2 on a uniform variable.
     * @param uniformName Name of the variable.
     * @param vector2 vector2 to be set.
     */
    setVector2(uniformName, vector2) {
        this.setFloat2(uniformName, vector2.x, vector2.y);
    }
    /**
     * Sets a Vector3 on a uniform variable.
     * @param uniformName Name of the variable.
     * @param vector3 Value to be set.
     */
    setVector3(uniformName, vector3) {
        this.setFloat3(uniformName, vector3.x, vector3.y, vector3.z);
    }
    /**
     * Sets a Vector4 on a uniform variable.
     * @param uniformName Name of the variable.
     * @param vector4 Value to be set.
     */
    setVector4(uniformName, vector4) {
        this.setFloat4(uniformName, vector4.x, vector4.y, vector4.z, vector4.w);
    }
    /**
     * Sets a Quaternion on a uniform variable.
     * @param uniformName Name of the variable.
     * @param quaternion Value to be set.
     */
    setQuaternion(uniformName, quaternion) {
        this.setFloat4(uniformName, quaternion.x, quaternion.y, quaternion.z, quaternion.w);
    }
    /**
     * Sets a Color3 on a uniform variable.
     * @param uniformName Name of the variable.
     * @param color3 Value to be set.
     */
    setColor3(uniformName, color3) {
        this.setFloat3(uniformName, color3.r, color3.g, color3.b);
    }
    /**
     * Sets a Color4 on a uniform variable.
     * @param uniformName Name of the variable.
     * @param color3 Value to be set.
     * @param alpha Alpha value to be set.
     */
    setColor4(uniformName, color3, alpha) {
        this.setFloat4(uniformName, color3.r, color3.g, color3.b, alpha);
    }
    /**
     * Sets a Color4 on a uniform variable
     * @param uniformName defines the name of the variable
     * @param color4 defines the value to be set
     */
    setDirectColor4(uniformName, color4) {
        this.setFloat4(uniformName, color4.r, color4.g, color4.b, color4.a);
    }
    _getVertexShaderCode() {
        return this.vertexShader ? this.engine._getShaderSource(this.vertexShader) : null;
    }
    _getFragmentShaderCode() {
        return this.fragmentShader ? this.engine._getShaderSource(this.fragmentShader) : null;
    }
}
//# sourceMappingURL=webGLPipelineContext.js.map