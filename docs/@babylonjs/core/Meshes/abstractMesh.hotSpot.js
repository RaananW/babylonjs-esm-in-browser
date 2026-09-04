import { Vector3, TmpVectors, Matrix } from "../Maths/math.vector.pure.js";
import { VertexBuffer } from "../Buffers/buffer.pure.js";

import { EnumerateFloatValues } from "../Buffers/bufferUtils.js";
/**
 * Create a HotSpotQuery from a picking info
 * @remarks If there is no pickedMesh or the pickedMesh has no indices, the faceId is used as the base index
 * @param pickingInfo picking info to use
 * @returns the created HotSpotQuery
 */
export function CreateHotSpotQueryForPickingInfo(pickingInfo) {
    const indices = pickingInfo.pickedMesh?.getIndices();
    const base = pickingInfo.faceId * 3;
    return {
        pointIndex: indices ? [indices[base], indices[base + 1], indices[base + 2]] : [base, base + 1, base + 2],
        barycentric: [pickingInfo.bu, pickingInfo.bv, 1 - pickingInfo.bu - pickingInfo.bv],
    };
}
function GetVertexElementData(mesh, index, kind) {
    const vertexBuffer = mesh.getVertexBuffer(kind);
    if (!vertexBuffer) {
        return null;
    }
    const bufferData = vertexBuffer.getData();
    if (!bufferData) {
        return null;
    }
    // EnumerateFloatValues synchronously calls the callback, hence the non-null assertion.
    let values;
    EnumerateFloatValues(bufferData, vertexBuffer.byteStride * index, vertexBuffer.byteStride, vertexBuffer.getSize(), vertexBuffer.type, 1, // Request only a single element.
    vertexBuffer.normalized, (v) => (values = v));
    return values;
}
/**
 * Return a transformed local position from a mesh and vertex index
 * @param mesh mesh used to get vertex array from
 * @param index vertex index
 * @param res resulting local position
 * @returns false if it was not possible to compute the position for that vertex
 */
export function GetTransformedPosition(mesh, index, res) {
    const positions = GetVertexElementData(mesh, index, VertexBuffer.PositionKind);
    if (!positions) {
        return false;
    }
    if (positions.some((value) => isNaN(value ?? Number.NaN))) {
        return false;
    }
    if (mesh.morphTargetManager) {
        const base = index * 3;
        for (let i = 0; i < positions.length; i++) {
            let value = positions[i];
            for (let targetCount = 0; targetCount < mesh.morphTargetManager.numTargets; targetCount++) {
                const target = mesh.morphTargetManager.getTarget(targetCount);
                const influence = target.influence;
                if (influence !== 0) {
                    const targetData = target.getPositions();
                    if (targetData) {
                        value += (targetData[base + i] - positions[i]) * influence;
                    }
                }
            }
            positions[i] = value;
        }
    }
    res.fromArray(positions);
    if (mesh.skeleton) {
        const matricesIndicesData = GetVertexElementData(mesh, index, VertexBuffer.MatricesIndicesKind);
        const matricesWeightsData = GetVertexElementData(mesh, index, VertexBuffer.MatricesWeightsKind);
        if (matricesIndicesData && matricesWeightsData) {
            const needExtras = mesh.numBoneInfluencers > 4;
            const matricesIndicesExtraData = needExtras ? GetVertexElementData(mesh, index, VertexBuffer.MatricesIndicesExtraKind) : null;
            const matricesWeightsExtraData = needExtras ? GetVertexElementData(mesh, index, VertexBuffer.MatricesWeightsExtraKind) : null;
            const skeletonMatrices = mesh.skeleton.getTransformMatrices(mesh);
            const finalMatrix = TmpVectors.Matrix[0];
            const tempMatrix = TmpVectors.Matrix[1];
            finalMatrix.reset();
            for (let i = 0; i < matricesWeightsData.length; i++) {
                const weight = matricesWeightsData[i];
                if (weight > 0) {
                    Matrix.FromFloat32ArrayToRefScaled(skeletonMatrices, Math.floor(matricesIndicesData[i] * 16), weight, tempMatrix);
                    finalMatrix.addToSelf(tempMatrix);
                }
            }
            if (matricesIndicesExtraData && matricesWeightsExtraData) {
                for (let i = 0; i < matricesWeightsExtraData.length; i++) {
                    const weight = matricesWeightsExtraData[i];
                    if (weight > 0) {
                        Matrix.FromFloat32ArrayToRefScaled(skeletonMatrices, Math.floor(matricesIndicesExtraData[i] * 16), weight, tempMatrix);
                        finalMatrix.addToSelf(tempMatrix);
                    }
                }
            }
            Vector3.TransformCoordinatesFromFloatsToRef(positions[0], positions[1], positions[2], finalMatrix, res);
        }
    }
    return true;
}
/**
 * Compute a world space hotspot position
 * TmpVectors.Vector3[0..4] are modified by this function. Do not use them as result output.
 * @param mesh mesh used to get hotspot from
 * @param hotSpotQuery point indices and barycentric
 * @param resPosition output world position
 * @param resNormal optional output world normal
 * @returns false if it was not possible to compute the hotspot position
 */
export function GetHotSpotToRef(mesh, hotSpotQuery, resPosition, resNormal) {
    resPosition.set(0, 0, 0);
    for (let i = 0; i < 3; i++) {
        const index = hotSpotQuery.pointIndex[i];
        if (!GetTransformedPosition(mesh, index, TmpVectors.Vector3[i])) {
            return false;
        }
        TmpVectors.Vector3[i].scaleAndAddToRef(hotSpotQuery.barycentric[i], resPosition);
    }
    // Convert the result to world space
    Vector3.TransformCoordinatesToRef(resPosition, mesh.getWorldMatrix(), resPosition);
    // compute normal in world space
    if (resNormal) {
        const pointA = TmpVectors.Vector3[0];
        const pointB = TmpVectors.Vector3[1];
        const pointC = TmpVectors.Vector3[2];
        const segmentA = TmpVectors.Vector3[3];
        const segmentB = TmpVectors.Vector3[4];
        segmentA.copyFrom(pointB);
        segmentA.subtractInPlace(pointA);
        segmentB.copyFrom(pointC);
        segmentB.subtractInPlace(pointA);
        segmentA.normalize();
        segmentB.normalize();
        Vector3.CrossToRef(segmentA, segmentB, resNormal);
        // flip normal when face culling is changed
        const flipNormal = mesh.material &&
            mesh.material.sideOrientation ===
                (mesh.getScene().useRightHandedSystem ? 0 : 1);
        if (flipNormal) {
            resNormal.scaleInPlace(-1);
        }
        // Convert the result to world space
        Vector3.TransformNormalToRef(resNormal, mesh.getWorldMatrix(), resNormal);
        resNormal.normalize();
    }
    return true;
}
//# sourceMappingURL=abstractMesh.hotSpot.js.map