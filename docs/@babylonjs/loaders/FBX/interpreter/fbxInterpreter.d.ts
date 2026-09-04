import { type FBXDocument } from "../types/fbxTypes.js";
import { type FBXGeometryData } from "./geometry.js";
import { type FBXMaterialData } from "./materials.js";
import { type FBXSkinData } from "./skeleton.js";
import { type FBXRigData } from "./rig.js";
import { type FBXAnimationStackData } from "./animation.js";
import { type FBXBlendShapeData } from "./blendShapes.js";
import { type FBXSceneDiagnostic } from "./sceneDiagnostics.js";
/** Represents a model (transform node) in the FBX scene */
export interface FBXModelData {
    id: number;
    name: string;
    subType: string;
    /** Geometry attached to this model (if it's a Mesh type) */
    geometry?: FBXGeometryData;
    /** Materials assigned to this model */
    materials: FBXMaterialData[];
    /** Child models */
    children: FBXModelData[];
    /** Transform properties */
    translation: [number, number, number];
    rotation: [number, number, number];
    scale: [number, number, number];
    /** PreRotation (applied before Lcl Rotation, in degrees) */
    preRotation: [number, number, number];
    /** PostRotation (applied after Lcl Rotation, inverted, in degrees) */
    postRotation: [number, number, number];
    /** RotationPivot — point around which rotation occurs */
    rotationPivot: [number, number, number];
    /** ScalingPivot — point around which scaling occurs */
    scalingPivot: [number, number, number];
    /** RotationOffset — translation after rotation pivot */
    rotationOffset: [number, number, number];
    /** ScalingOffset — translation after scaling pivot */
    scalingOffset: [number, number, number];
    /** Geometric transforms — applied to geometry only, do not affect children */
    geometricTranslation: [number, number, number];
    geometricRotation: [number, number, number];
    geometricScaling: [number, number, number];
    /** Rotation order: 0=XYZ, 1=XZY, 2=YZX, 3=YXZ, 4=ZXY, 5=ZYX */
    rotationOrder: number;
    /** FBX transform inheritance mode. 0=RrSs, 1=RSrs, 2=Rrs */
    inheritType: number;
    /** Whether backface culling is disabled ("CullingOff") */
    cullingOff: boolean;
    /** User-defined custom properties from Properties70 */
    customProperties?: Record<string, string | number | boolean>;
    /** Recoverable model import diagnostics */
    diagnostics: string[];
}
/** Camera data extracted from FBX */
export interface FBXCameraData {
    /** Model ID this camera is attached to */
    modelId: number;
    /** Camera name */
    name: string;
    /** Field of view in degrees */
    fieldOfView: number;
    /** Near clip plane */
    nearPlane: number;
    /** Far clip plane */
    farPlane: number;
    /** Aspect ratio (width/height), 0 = use viewport */
    aspectRatio: number;
    /** Projection type */
    projectionType: "perspective" | "orthographic";
    /** Focal length in millimeters when present */
    focalLength?: number;
    /** Filmback width in inches when present */
    filmWidth?: number;
    /** Filmback height in inches when present */
    filmHeight?: number;
    /** Orthographic zoom/height when present */
    orthoZoom?: number;
    /** Camera roll in degrees when present */
    roll?: number;
    /** Known unsupported or unrecognized camera properties */
    unknownProperties: string[];
    /** Recoverable camera import diagnostics */
    diagnostics: string[];
}
/** Light data extracted from FBX */
export interface FBXLightData {
    /** Model ID this light is attached to */
    modelId: number;
    /** Light name */
    name: string;
    /** Light type: 0=Point, 1=Directional, 2=Spot */
    lightType: number;
    /** Color [r,g,b] 0-1 */
    color: [number, number, number];
    /** Intensity multiplier */
    intensity: number;
    /** Cone angle in degrees (for spot lights) */
    coneAngle: number;
    /** Decay type: 0=None, 1=Linear, 2=Quadratic */
    decayType: number;
    /** Inner cone angle in degrees for spot lights */
    innerAngle?: number;
    /** Outer cone angle in degrees for spot lights */
    outerAngle?: number;
    /** Distance at which FBX attenuation starts; preserved as metadata */
    decayStart?: number;
    /** Whether FBX near attenuation is enabled */
    enableNearAttenuation?: boolean;
    /** Whether FBX far attenuation is enabled */
    enableFarAttenuation?: boolean;
    /** Whether the source light requested shadow casting */
    castShadows?: boolean;
    /** Known unsupported or unrecognized light properties */
    unknownProperties: string[];
    /** Recoverable light import diagnostics */
    diagnostics: string[];
}
/** Result of interpreting an FBX document */
export interface FBXSceneData {
    /** All root-level models */
    rootModels: FBXModelData[];
    /** All geometries in the scene */
    geometries: FBXGeometryData[];
    /** All materials in the scene */
    materials: FBXMaterialData[];
    /** Skin deformers (skeletons + vertex weights) */
    skins: FBXSkinData[];
    /** Resolved deformation rigs shared by one or more skins */
    rigs: FBXRigData[];
    /** Blend shape deformers (morph targets) */
    blendShapes: FBXBlendShapeData[];
    /** Animation stacks (clips) */
    animations: FBXAnimationStackData[];
    /** Cameras */
    cameras: FBXCameraData[];
    /** Lights */
    lights: FBXLightData[];
    /** Scene-level unsupported feature diagnostics */
    diagnostics: FBXSceneDiagnostic[];
    /** Global settings */
    upAxis: number;
    upAxisSign: number;
    frontAxis: number;
    frontAxisSign: number;
    coordAxis: number;
    coordAxisSign: number;
    unitScaleFactor: number;
}
/**
 * Interpret a parsed FBX document into scene data.
 */
export declare function interpretFBX(doc: FBXDocument): FBXSceneData;
