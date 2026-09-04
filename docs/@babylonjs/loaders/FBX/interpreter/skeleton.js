/* eslint-disable @typescript-eslint/naming-convention, jsdoc/require-param, jsdoc/require-returns */
import { findChildByName, getPropertyValue, cleanFBXName } from "../types/fbxTypes.js";
import { getChildren } from "./connections.js";
const MAX_BONE_INFLUENCES = 8;
/**
 * Extract all skin deformers from the FBX scene.
 * Returns skin data including bone hierarchy and vertex weights.
 */
export function extractSkins(objectMap) {
    const skins = [];
    for (const [id, node] of Array.from(objectMap.objects)) {
        if (node.name === "Deformer" && getPropertyValue(node, 2) === "Skin") {
            const skin = extractSkin(id, node, objectMap);
            if (skin) {
                skins.push(skin);
            }
        }
    }
    return skins;
}
function extractSkin(skinId, _skinNode, objectMap) {
    // Find the geometry this skin is attached to
    // Skin is a child of the geometry in FBX connection graph
    const skinParent = objectMap.parentOf.get(skinId);
    if (!skinParent) {
        return null;
    }
    const geometryId = skinParent.id;
    const geometryNode = objectMap.objects.get(geometryId);
    if (!geometryNode || geometryNode.name !== "Geometry") {
        return null;
    }
    const modelParent = objectMap.parentOf.get(geometryId);
    const modelParentNode = modelParent ? objectMap.objects.get(modelParent.id) : undefined;
    const meshModelId = modelParentNode?.name === "Model" ? modelParent.id : undefined;
    // Find all clusters (children of this skin)
    const clusterEntries = getChildren(objectMap, skinId, "Deformer");
    if (clusterEntries.length === 0) {
        return null;
    }
    // For each cluster, find the connected bone Model
    // Connection graph: BoneModel → Cluster (bone is child of cluster)
    const boneModelMap = new Map();
    for (const { id: clusterId, node: clusterNode } of clusterEntries) {
        const subType = getPropertyValue(clusterNode, 2);
        if (subType !== "Cluster") {
            continue;
        }
        // The bone Model is a child of the Cluster
        const boneChildren = getChildren(objectMap, clusterId, "Model");
        if (boneChildren.length > 0) {
            boneModelMap.set(boneChildren[0].id, { clusterId, clusterNode });
        }
    }
    // Build bone hierarchy from Model parent-child relationships. Include
    // skeleton-like ancestors even when they are not weighted clusters; some
    // rigs (for example 3ds Max Biped) animate a non-cluster root above the
    // clustered bones.
    const bindPoseMatrices = extractBindPoseMatrices(geometryId, objectMap);
    const skinDiagnostics = [];
    const bones = buildBoneHierarchy(boneModelMap, bindPoseMatrices, objectMap, skinDiagnostics);
    if (bones.length === 0) {
        return null;
    }
    // Extract per-vertex weights from clusters
    const { boneIndices, boneWeights } = extractVertexWeights(bones, boneModelMap, objectMap);
    return {
        id: skinId,
        geometryId,
        meshBindPoseMatrix: meshModelId !== undefined ? (bindPoseMatrices.get(meshModelId) ?? null) : null,
        bones,
        boneIndices,
        boneWeights,
        diagnostics: skinDiagnostics,
    };
}
/**
 * Build a flat ordered bone list with parent indices from the FBX Model hierarchy.
 */
function buildBoneHierarchy(boneModelMap, bindPoseMatrices, objectMap, skinDiagnostics) {
    const bones = [];
    const visited = new Set();
    const skeletonModelIds = collectSkeletonModelIds(boneModelMap, objectMap);
    const parentByModelId = buildSkeletonParentMap(skeletonModelIds, objectMap);
    const childrenByModelId = buildSkeletonChildrenMap(skeletonModelIds, parentByModelId);
    const rootBoneIds = Array.from(skeletonModelIds).filter((modelId) => !parentByModelId.has(modelId));
    // BFS to build ordered list
    const queue = rootBoneIds.map((id) => ({
        modelId: id,
        parentIndex: -1,
    }));
    while (queue.length > 0) {
        const { modelId, parentIndex } = queue.shift();
        if (visited.has(modelId)) {
            continue;
        }
        visited.add(modelId);
        const modelNode = objectMap.objects.get(modelId);
        if (!modelNode) {
            continue;
        }
        const boneIndex = bones.length;
        const clusterInfo = boneModelMap.get(modelId);
        const transform = extractBoneTransform(modelNode);
        const { bindPoseMatrix, transformLinkMatrix, transformAssociateModelMatrix, clusterMode } = clusterInfo
            ? extractClusterMatrices(clusterInfo.clusterNode)
            : { bindPoseMatrix: null, transformLinkMatrix: null, transformAssociateModelMatrix: null, clusterMode: "Unknown" };
        const diagnostics = createBoneDiagnostics(modelId, cleanFBXName(getPropertyValue(modelNode, 1) ?? `Bone${boneIndex}`), clusterInfo !== undefined, clusterMode, bindPoseMatrix, transformLinkMatrix, transformAssociateModelMatrix, bindPoseMatrices.get(modelId) ?? null);
        skinDiagnostics.push(...diagnostics);
        bones.push({
            modelId,
            name: cleanFBXName(getPropertyValue(modelNode, 1) ?? `Bone${boneIndex}`),
            index: boneIndex,
            parentIndex,
            isCluster: clusterInfo !== undefined,
            translation: transform.translation,
            rotation: transform.rotation,
            preRotation: transform.preRotation,
            postRotation: transform.postRotation,
            rotationPivot: transform.rotationPivot,
            scalingPivot: transform.scalingPivot,
            rotationOffset: transform.rotationOffset,
            scalingOffset: transform.scalingOffset,
            scale: transform.scale,
            rotationOrder: transform.rotationOrder,
            inheritType: transform.inheritType,
            clusterMode,
            bindPoseMatrix,
            transformLinkMatrix,
            transformAssociateModelMatrix,
            modelBindPoseMatrix: bindPoseMatrices.get(modelId) ?? null,
            diagnostics,
        });
        for (const childId of childrenByModelId.get(modelId) ?? []) {
            if (!visited.has(childId)) {
                queue.push({ modelId: childId, parentIndex: boneIndex });
            }
        }
    }
    return bones;
}
function extractBindPoseMatrices(geometryId, objectMap) {
    const modelParent = objectMap.parentOf.get(geometryId);
    const modelParentNode = modelParent ? objectMap.objects.get(modelParent.id) : undefined;
    const modelId = modelParentNode?.name === "Model" ? modelParent.id : undefined;
    if (modelId === undefined) {
        return new Map();
    }
    for (const [, poseNode] of Array.from(objectMap.objects)) {
        if (poseNode.name !== "Pose" || getPropertyValue(poseNode, 2) !== "BindPose") {
            continue;
        }
        const matrices = new Map();
        for (const poseChild of poseNode.children) {
            if (poseChild.name !== "PoseNode") {
                continue;
            }
            const nodeChild = findChildByName(poseChild, "Node");
            const matrixChild = findChildByName(poseChild, "Matrix");
            const nodeId = nodeChild?.properties[0]?.value;
            const matrixValue = matrixChild?.properties[0]?.value;
            if (typeof nodeId !== "number") {
                continue;
            }
            const matrix = toFloat64Array(matrixValue);
            if (matrix?.length === 16) {
                matrices.set(nodeId, matrix);
            }
        }
        if (matrices.has(modelId)) {
            return matrices;
        }
    }
    return new Map();
}
function buildSkeletonChildrenMap(skeletonModelIds, parentByModelId) {
    const childrenByModelId = new Map();
    for (const modelId of Array.from(skeletonModelIds)) {
        const parentId = parentByModelId.get(modelId);
        if (parentId === undefined) {
            continue;
        }
        if (!childrenByModelId.has(parentId)) {
            childrenByModelId.set(parentId, []);
        }
        childrenByModelId.get(parentId).push(modelId);
    }
    return childrenByModelId;
}
function collectSkeletonModelIds(boneModelMap, objectMap) {
    const skeletonModelIds = new Set(Array.from(boneModelMap.keys()));
    for (const modelId of Array.from(boneModelMap.keys())) {
        let parentId = findModelParentId(modelId, objectMap);
        while (parentId !== undefined) {
            const parentNode = objectMap.objects.get(parentId);
            if (!parentNode || parentNode.name !== "Model") {
                break;
            }
            skeletonModelIds.add(parentId);
            parentId = findModelParentId(parentId, objectMap);
        }
    }
    return skeletonModelIds;
}
function buildSkeletonParentMap(skeletonModelIds, objectMap) {
    const parentByModelId = new Map();
    for (const modelId of Array.from(skeletonModelIds)) {
        let parentId = findModelParentId(modelId, objectMap);
        while (parentId !== undefined) {
            if (skeletonModelIds.has(parentId)) {
                parentByModelId.set(modelId, parentId);
                break;
            }
            parentId = findModelParentId(parentId, objectMap);
        }
    }
    return parentByModelId;
}
function findModelParentId(modelId, objectMap) {
    const parentConnection = objectMap.connections.find((conn) => conn.type === "OO" && conn.childId === modelId && objectMap.objects.get(conn.parentId)?.name === "Model");
    return parentConnection?.parentId;
}
export function isSkeletonModel(modelNode) {
    const subType = getPropertyValue(modelNode, 2);
    return subType === "Root" || subType === "LimbNode";
}
export function extractBoneTransform(modelNode) {
    const translation = [0, 0, 0];
    const rotation = [0, 0, 0];
    const preRotation = [0, 0, 0];
    const postRotation = [0, 0, 0];
    const rotationPivot = [0, 0, 0];
    const scalingPivot = [0, 0, 0];
    const rotationOffset = [0, 0, 0];
    const scalingOffset = [0, 0, 0];
    const scale = [1, 1, 1];
    let rotationOrder = 0;
    let inheritType = 1;
    const props70 = findChildByName(modelNode, "Properties70");
    if (!props70) {
        return { translation, rotation, preRotation, postRotation, rotationPivot, scalingPivot, rotationOffset, scalingOffset, scale, rotationOrder, inheritType };
    }
    for (const p of props70.children) {
        if (p.name !== "P") {
            continue;
        }
        const propName = getPropertyValue(p, 0);
        if (!propName) {
            continue;
        }
        switch (propName) {
            case "Lcl Translation":
                translation[0] = toNumber(p.properties[4]?.value) ?? 0;
                translation[1] = toNumber(p.properties[5]?.value) ?? 0;
                translation[2] = toNumber(p.properties[6]?.value) ?? 0;
                break;
            case "Lcl Rotation":
                rotation[0] = toNumber(p.properties[4]?.value) ?? 0;
                rotation[1] = toNumber(p.properties[5]?.value) ?? 0;
                rotation[2] = toNumber(p.properties[6]?.value) ?? 0;
                break;
            case "PreRotation":
                preRotation[0] = toNumber(p.properties[4]?.value) ?? 0;
                preRotation[1] = toNumber(p.properties[5]?.value) ?? 0;
                preRotation[2] = toNumber(p.properties[6]?.value) ?? 0;
                break;
            case "PostRotation":
                postRotation[0] = toNumber(p.properties[4]?.value) ?? 0;
                postRotation[1] = toNumber(p.properties[5]?.value) ?? 0;
                postRotation[2] = toNumber(p.properties[6]?.value) ?? 0;
                break;
            case "RotationPivot":
                rotationPivot[0] = toNumber(p.properties[4]?.value) ?? 0;
                rotationPivot[1] = toNumber(p.properties[5]?.value) ?? 0;
                rotationPivot[2] = toNumber(p.properties[6]?.value) ?? 0;
                break;
            case "ScalingPivot":
                scalingPivot[0] = toNumber(p.properties[4]?.value) ?? 0;
                scalingPivot[1] = toNumber(p.properties[5]?.value) ?? 0;
                scalingPivot[2] = toNumber(p.properties[6]?.value) ?? 0;
                break;
            case "RotationOffset":
                rotationOffset[0] = toNumber(p.properties[4]?.value) ?? 0;
                rotationOffset[1] = toNumber(p.properties[5]?.value) ?? 0;
                rotationOffset[2] = toNumber(p.properties[6]?.value) ?? 0;
                break;
            case "ScalingOffset":
                scalingOffset[0] = toNumber(p.properties[4]?.value) ?? 0;
                scalingOffset[1] = toNumber(p.properties[5]?.value) ?? 0;
                scalingOffset[2] = toNumber(p.properties[6]?.value) ?? 0;
                break;
            case "Lcl Scaling":
                scale[0] = toNumber(p.properties[4]?.value) ?? 1;
                scale[1] = toNumber(p.properties[5]?.value) ?? 1;
                scale[2] = toNumber(p.properties[6]?.value) ?? 1;
                break;
            case "RotationOrder":
                rotationOrder = toNumber(p.properties[4]?.value) ?? 0;
                break;
            case "InheritType":
                inheritType = toNumber(p.properties[4]?.value) ?? 1;
                break;
        }
    }
    return { translation, rotation, preRotation, postRotation, rotationPivot, scalingPivot, rotationOffset, scalingOffset, scale, rotationOrder, inheritType };
}
function extractClusterMatrices(clusterNode) {
    let bindPoseMatrix = null;
    let transformLinkMatrix = null;
    let transformAssociateModelMatrix = null;
    let clusterMode = "Normalize";
    const transformNode = findChildByName(clusterNode, "Transform");
    if (transformNode && transformNode.properties[0]) {
        const val = transformNode.properties[0].value;
        if (val instanceof Float64Array && val.length === 16) {
            bindPoseMatrix = val;
        }
        else if (val instanceof Float32Array && val.length === 16) {
            bindPoseMatrix = new Float64Array(val);
        }
    }
    const transformLinkNode = findChildByName(clusterNode, "TransformLink");
    if (transformLinkNode && transformLinkNode.properties[0]) {
        const val = transformLinkNode.properties[0].value;
        if (val instanceof Float64Array && val.length === 16) {
            transformLinkMatrix = val;
        }
        else if (val instanceof Float32Array && val.length === 16) {
            transformLinkMatrix = new Float64Array(val);
        }
    }
    const transformAssociateModelNode = findChildByName(clusterNode, "TransformAssociateModel");
    if (transformAssociateModelNode && transformAssociateModelNode.properties[0]) {
        const val = transformAssociateModelNode.properties[0].value;
        if (val instanceof Float64Array && val.length === 16) {
            transformAssociateModelMatrix = val;
        }
        else if (val instanceof Float32Array && val.length === 16) {
            transformAssociateModelMatrix = new Float64Array(val);
        }
    }
    const modeNode = findChildByName(clusterNode, "Mode");
    const mode = modeNode ? getPropertyValue(modeNode, 0) : undefined;
    if (mode === "Normalize" || mode === "Additive" || mode === "TotalOne") {
        clusterMode = mode;
    }
    else if (mode) {
        clusterMode = "Unknown";
    }
    return { bindPoseMatrix, transformLinkMatrix, transformAssociateModelMatrix, clusterMode };
}
function createBoneDiagnostics(modelId, boneName, isCluster, clusterMode, bindPoseMatrix, transformLinkMatrix, transformAssociateModelMatrix, modelBindPoseMatrix) {
    if (!isCluster) {
        return [];
    }
    const diagnostics = [];
    if (clusterMode === "Additive" || clusterMode === "TotalOne") {
        diagnostics.push({
            type: "cluster-mode-runtime-unsupported",
            message: `Cluster mode '${clusterMode}' is preserved but not applied by Babylon linear blend skinning.`,
            boneModelId: modelId,
            boneName,
            clusterMode,
        });
    }
    if (!bindPoseMatrix) {
        diagnostics.push({
            type: "missing-cluster-transform",
            message: "Cluster is missing Transform matrix; falling back to rest/bind-pose data.",
            boneModelId: modelId,
            boneName,
            clusterMode,
        });
    }
    if (!transformLinkMatrix) {
        diagnostics.push({
            type: "missing-cluster-transform-link",
            message: "Cluster is missing TransformLink matrix; falling back to model bind pose or rest transform.",
            boneModelId: modelId,
            boneName,
            clusterMode,
        });
    }
    if (!modelBindPoseMatrix) {
        diagnostics.push({
            type: "missing-bind-pose-matrix",
            message: "No BindPose matrix was found for this bone model.",
            boneModelId: modelId,
            boneName,
            clusterMode,
        });
    }
    if (transformAssociateModelMatrix) {
        diagnostics.push({
            type: "associate-model-present",
            message: "TransformAssociateModel is preserved for future associate-model skinning semantics.",
            boneModelId: modelId,
            boneName,
            clusterMode,
        });
    }
    return diagnostics;
}
/**
 * Extract per-vertex bone indices and weights from cluster data.
 * Returns arrays indexed by control point index.
 */
function extractVertexWeights(bones, boneModelMap, objectMap) {
    // We need to find the max vertex index to size our arrays
    let maxVertexIndex = 0;
    // First pass: find max vertex index
    for (const bone of bones) {
        const clusterInfo = boneModelMap.get(bone.modelId);
        if (!clusterInfo) {
            continue;
        }
        const indexesNode = findChildByName(clusterInfo.clusterNode, "Indexes");
        if (!indexesNode) {
            continue;
        }
        const indexes = toInt32Array(indexesNode.properties[0]?.value);
        if (!indexes) {
            continue;
        }
        for (let i = 0; i < indexes.length; i++) {
            if (indexes[i] > maxVertexIndex) {
                maxVertexIndex = indexes[i];
            }
        }
    }
    // Initialize arrays
    const vertexCount = maxVertexIndex + 1;
    const boneIndices = new Array(vertexCount);
    const boneWeights = new Array(vertexCount);
    for (let i = 0; i < vertexCount; i++) {
        boneIndices[i] = [];
        boneWeights[i] = [];
    }
    // Second pass: collect influences
    for (const bone of bones) {
        const clusterInfo = boneModelMap.get(bone.modelId);
        if (!clusterInfo) {
            continue;
        }
        const indexesNode = findChildByName(clusterInfo.clusterNode, "Indexes");
        const weightsNode = findChildByName(clusterInfo.clusterNode, "Weights");
        if (!indexesNode || !weightsNode) {
            continue;
        }
        const indexes = toInt32Array(indexesNode.properties[0]?.value);
        const weights = toFloat64Array(weightsNode.properties[0]?.value);
        if (!indexes || !weights) {
            continue;
        }
        for (let i = 0; i < indexes.length; i++) {
            const vertIdx = indexes[i];
            boneIndices[vertIdx].push(bone.index);
            boneWeights[vertIdx].push(weights[i]);
        }
    }
    // Sort by weight descending and cap to Babylon's primary + extra influence buffers.
    for (let i = 0; i < vertexCount; i++) {
        if (boneIndices[i].length === 0) {
            continue;
        }
        const pairs = boneIndices[i].map((bi, idx) => ({
            index: bi,
            weight: boneWeights[i][idx],
        }));
        pairs.sort((a, b) => b.weight - a.weight);
        const cappedPairs = pairs.slice(0, MAX_BONE_INFLUENCES);
        boneIndices[i] = cappedPairs.map((p) => p.index);
        boneWeights[i] = cappedPairs.map((p) => p.weight);
    }
    // Normalize weights to sum to 1.0
    for (let i = 0; i < vertexCount; i++) {
        const sum = boneWeights[i].reduce((a, b) => a + b, 0);
        if (sum > 0) {
            for (let j = 0; j < boneWeights[i].length; j++) {
                boneWeights[i][j] /= sum;
            }
        }
    }
    return { boneIndices, boneWeights };
}
// ── Utilities ──────────────────────────────────────────────────────────────────
function toNumber(value) {
    if (typeof value === "number") {
        return value;
    }
    return undefined;
}
function toInt32Array(value) {
    if (value instanceof Int32Array) {
        return value;
    }
    if (value instanceof Float64Array) {
        const result = new Int32Array(value.length);
        for (let i = 0; i < value.length; i++) {
            result[i] = Math.round(value[i]);
        }
        return result;
    }
    return null;
}
function toFloat64Array(value) {
    if (value instanceof Float64Array) {
        return value;
    }
    if (value instanceof Float32Array) {
        return new Float64Array(value);
    }
    return null;
}
//# sourceMappingURL=skeleton.js.map