import { Matrix } from "@babylonjs/core/Maths/math.vector.js";
export type FBXVector3 = [number, number, number];
export interface FBXTransformComponents {
    translation: FBXVector3;
    rotation: FBXVector3;
    scale: FBXVector3;
    preRotation: FBXVector3;
    postRotation: FBXVector3;
    rotationPivot: FBXVector3;
    scalingPivot: FBXVector3;
    rotationOffset: FBXVector3;
    scalingOffset: FBXVector3;
    rotationOrder: number;
    inheritType?: number;
}
export declare function eulerToMatrixXYZ(rx: number, ry: number, rz: number): Matrix;
export declare function eulerToMatrix(rx: number, ry: number, rz: number, order: number): Matrix;
export declare function computeFBXGeometricMatrix(translation: FBXVector3, rotation: FBXVector3, scale: FBXVector3): Matrix;
export declare function computeFBXGeometricDeltaMatrix(rotation: FBXVector3, scale: FBXVector3): Matrix;
export declare function computeFBXGeometricNormalMatrix(rotation: FBXVector3, scale: FBXVector3): Matrix;
export declare function computeFBXLocalMatrix(components: FBXTransformComponents): Matrix;
