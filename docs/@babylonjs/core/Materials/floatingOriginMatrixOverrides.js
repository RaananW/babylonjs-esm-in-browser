import { Effect } from "../Materials/effect.js";
import { Matrix, Vector3 } from "../Maths/math.vector.pure.js";
import { InvertMatrixToRef, MultiplyMatricesToRef } from "../Maths/ThinMaths/thinMath.matrix.functions.js";
import { UniformBuffer } from "./uniformBuffer.js";
const TempFinalMat = new Matrix();
const TempMat1 = new Matrix();
const TempMat2 = new Matrix();
/**
 * When rendering, each scene will reset this to ensure the correct floating origin offset is when overriding the below functions
 */
export const FloatingOriginCurrentScene = {
    getScene: () => undefined,
    eyeAtCamera: true, // When true, we can assume viewMatrix translation is at origin. Otherwise, we must do full offset calculations
};
function OffsetWorldToRef(offset, world, ref) {
    const refArray = ref.asArray();
    const worldArray = world.asArray();
    for (let i = 0; i < 16; i++) {
        refArray[i] = worldArray[i];
    }
    refArray[12] -= offset.x;
    refArray[13] -= offset.y;
    refArray[14] -= offset.z;
    ref.markAsUpdated();
    return ref;
}
function GetFullOffsetView(offset, viewMatrix, ref) {
    InvertMatrixToRef(viewMatrix, TempMat1); // TempMat1 = light world matrix (inverse of view)
    OffsetWorldToRef(offset, TempMat1, TempMat2); // TempMat2 = offset light world matrix
    InvertMatrixToRef(TempMat2, ref); // TempMat1 = offset view matrix
    return ref;
}
export function OffsetViewToRef(offset, view, ref) {
    // When eye is not at camera, we cannot assume the translation of view matrix is at origin, so we perform full offset calculation
    if (!FloatingOriginCurrentScene.eyeAtCamera) {
        return GetFullOffsetView(offset, view, ref);
    }
    const refArray = ref.asArray();
    const viewArray = view.asArray();
    for (let i = 0; i < 16; i++) {
        refArray[i] = viewArray[i];
    }
    refArray[12] = 0;
    refArray[13] = 0;
    refArray[14] = 0;
    ref.markAsUpdated();
    return ref;
}
function OffsetViewProjectionToRef(offset, view, projection, ref) {
    MultiplyMatricesToRef(OffsetViewToRef(offset, view, ref), projection, ref);
    return ref;
}
export function OffsetClipPlaneToRef(offset, plane, ref) {
    // Original clipplane is using equation normal.dot(p) + d = 0
    // Assume we have p' = p - offset, that means normal.dot(p') + d' = 0
    // So to get the offset plane,
    // normal.dot(p' + offset) + d = 0
    // normal.dot(p') + normal.dot(offset) + d = 0
    // -d' + normal.dot(offset) + d = 0
    // d' = d + normal.dot(offset)
    ref.normal.copyFrom(plane.normal);
    ref.d = plane.d + Vector3.Dot(plane.normal, offset);
    return ref;
}
export function GetOffsetTransformMatrices(offset, viewMatrices, projectionMatrices, length, resultArray) {
    for (let cascadeIndex = 0; cascadeIndex < length; ++cascadeIndex) {
        GetFullOffsetViewProjectionToRef(offset, viewMatrices[cascadeIndex], projectionMatrices[cascadeIndex], TempMat1);
        TempMat1.copyToArray(resultArray, cascadeIndex * 16);
    }
    return resultArray;
}
function OffsetWorldViewToRef(offset, worldView, view, ref) {
    // ( world * view ) * inverse ( view ) = world
    InvertMatrixToRef(view, TempMat1); // TempMat1 = inverseView
    MultiplyMatricesToRef(worldView, TempMat1, TempMat2); // TempMat2 = world, TempMat1 can be reused
    // ( offsetWorld * offsetView ) = offsetWorldView
    OffsetWorldToRef(offset, TempMat2, TempMat1); // TempMat1 = offsetWorld
    OffsetViewToRef(offset, view, TempMat2); // TempMat2 = offsetView
    MultiplyMatricesToRef(TempMat1, TempMat2, ref);
    return ref;
}
export function GetFullOffsetViewProjectionToRef(offset, viewMatrix, projectionMatrix, ref) {
    GetFullOffsetView(offset, viewMatrix, TempMat2);
    MultiplyMatricesToRef(TempMat2, projectionMatrix, ref);
    return ref;
}
function OffsetWorldViewProjectionToRef(offset, worldViewProjection, viewProjection, view, projection, ref) {
    // ( world * view * projection ) * inverse(projection) * inverse(view) = world
    // ( world * view * projection ) * inverse (view * projection) = world
    InvertMatrixToRef(viewProjection, TempMat1); // TempMat1 = inverse (view * projection)
    MultiplyMatricesToRef(worldViewProjection, TempMat1, TempMat2); // TempMat2 = world, TempMat1 can be reused
    // ( offsetWorld * offsetViewProjection)  = offsetWorldViewProjection
    OffsetWorldToRef(offset, TempMat2, TempMat1); // TempMat1 = offsetWorld
    OffsetViewProjectionToRef(offset, view, projection, TempMat2); // TempMat2 = offsetViewProjection
    MultiplyMatricesToRef(TempMat1, TempMat2, ref);
    return ref;
}
function GetOffsetMatrix(uniformName, mat) {
    const scene = FloatingOriginCurrentScene.getScene();
    // Early out for scenes that don't have floatingOriginMode enabled
    // Effect.setMatrix will call pipelineContext.setMatrix. In WebGPU, this will in turn call ubo.updateMatrix. To avoid double offset, early out if mat is TempFinalMat
    if (!scene || TempFinalMat === mat) {
        return mat;
    }
    TempFinalMat.updateFlag = mat.updateFlag;
    const offset = scene.floatingOriginOffset;
    switch (uniformName) {
        case "world":
            return OffsetWorldToRef(offset, mat, TempFinalMat);
        case "view":
            return OffsetViewToRef(offset, mat, TempFinalMat);
        case "worldView":
            return OffsetWorldViewToRef(offset, mat, scene.getViewMatrix(), TempFinalMat);
        case "viewProjection":
            return OffsetViewProjectionToRef(offset, scene.getViewMatrix(), scene.getProjectionMatrix(), TempFinalMat);
        case "worldViewProjection":
            return OffsetWorldViewProjectionToRef(offset, mat, scene.getTransformMatrix(), scene.getViewMatrix(), scene.getProjectionMatrix(), TempFinalMat);
        default:
            // Node material blocks uniforms are formatted u_BlockName, with trailing numbers if there are multiple blocks of the same name
            // Check u_ first so that we can early out for non-node material uniforms
            if (uniformName.startsWith("u_")) {
                const lowercaseUniformName = uniformName.toLowerCase();
                if (lowercaseUniformName.startsWith("u_worldviewprojection")) {
                    return OffsetWorldViewProjectionToRef(offset, mat, scene.getTransformMatrix(), scene.getViewMatrix(), scene.getProjectionMatrix(), TempFinalMat);
                }
                if (lowercaseUniformName.startsWith("u_viewprojection")) {
                    return OffsetViewProjectionToRef(offset, scene.getViewMatrix(), scene.getProjectionMatrix(), TempFinalMat);
                }
                if (lowercaseUniformName.startsWith("u_worldview")) {
                    return OffsetWorldViewToRef(offset, mat, scene.getViewMatrix(), TempFinalMat);
                }
                if (lowercaseUniformName.startsWith("u_world")) {
                    return OffsetWorldToRef(offset, mat, TempFinalMat);
                }
                if (lowercaseUniformName.startsWith("u_view")) {
                    return OffsetViewToRef(offset, mat, TempFinalMat);
                }
            }
            return mat;
    }
}
// ---- Overriding the prototypes of effect and uniformBuffer's setMatrix functions ----
const UniformBufferInternal = UniformBuffer;
const EffectInternal = Effect;
const OriginalUpdateMatrixForUniform = UniformBufferInternal.prototype._updateMatrixForUniform;
const OriginalSetMatrix = Effect.prototype.setMatrix;
export function ResetMatrixFunctions() {
    Effect.prototype.setMatrix = OriginalSetMatrix;
    EffectInternal._setMatrixOverride = undefined;
    UniformBufferInternal.prototype._updateMatrixForUniform = OriginalUpdateMatrixForUniform;
    UniformBufferInternal.prototype._updateMatrixForUniformOverride = undefined;
}
export function OverrideMatrixFunctions() {
    EffectInternal.prototype._setMatrixOverride = OriginalSetMatrix;
    EffectInternal.prototype.setMatrix = function (uniformName, matrix) {
        this._setMatrixOverride(uniformName, GetOffsetMatrix(uniformName, matrix));
        return this;
    };
    UniformBufferInternal.prototype._updateMatrixForUniformOverride = OriginalUpdateMatrixForUniform;
    UniformBufferInternal.prototype._updateMatrixForUniform = function (uniformName, matrix) {
        this._updateMatrixForUniformOverride(uniformName, GetOffsetMatrix(uniformName, matrix));
    };
}
//# sourceMappingURL=floatingOriginMatrixOverrides.js.map