/** This file must only contain pure code and pure imports */
import { CubeMapToSphericalPolynomialTools } from "../../Misc/HighDynamicRange/cubemapToSphericalPolynomial.js";
import { BaseTexture } from "./baseTexture.pure.js";
let _Registered = false;
/**
 * Register side effects for baseTexturePolynomial.
 * Safe to call multiple times; only the first call has an effect.
 */
export function RegisterBaseTexturePolynomial() {
    if (_Registered) {
        return;
    }
    _Registered = true;
    BaseTexture.prototype._sphericalPolynomialTargetSize = 0;
    BaseTexture.prototype.forceSphericalPolynomialsRecompute = function () {
        if (this._texture) {
            this._texture._sphericalPolynomial = null;
            this._texture._sphericalPolynomialPromise = null;
            this._texture._sphericalPolynomialComputed = false;
        }
    };
    Object.defineProperty(BaseTexture.prototype, "sphericalPolynomial", {
        get: function () {
            if (this._texture) {
                if (this._texture._sphericalPolynomial || this._texture._sphericalPolynomialComputed) {
                    return this._texture._sphericalPolynomial;
                }
                if (this._texture.isReady) {
                    if (!this._texture._sphericalPolynomialPromise) {
                        this._texture._sphericalPolynomialPromise = CubeMapToSphericalPolynomialTools.ConvertCubeMapTextureToSphericalPolynomial(this);
                        if (this._texture._sphericalPolynomialPromise === null) {
                            this._texture._sphericalPolynomialComputed = true;
                        }
                        else {
                            // eslint-disable-next-line @typescript-eslint/no-floating-promises, github/no-then
                            this._texture._sphericalPolynomialPromise.then((sphericalPolynomial) => {
                                this._texture._sphericalPolynomial = sphericalPolynomial;
                                this._texture._sphericalPolynomialComputed = true;
                            });
                        }
                    }
                    return null;
                }
            }
            return null;
        },
        set: function (value) {
            if (this._texture) {
                this._texture._sphericalPolynomial = value;
            }
        },
        enumerable: true,
        configurable: true,
    });
}
//# sourceMappingURL=baseTexture.polynomial.pure.js.map