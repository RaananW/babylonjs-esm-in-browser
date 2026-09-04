/** This file must only contain pure code and pure imports */
import { CreateRibbon } from "./Builders/ribbonBuilder.pure.js";
import { CreateDisc } from "./Builders/discBuilder.pure.js";
import { CreateBox } from "./Builders/boxBuilder.pure.js";
import { CreateTiledBox } from "./Builders/tiledBoxBuilder.pure.js";
import { CreateSphere } from "./Builders/sphereBuilder.pure.js";
import { CreateCylinder } from "./Builders/cylinderBuilder.pure.js";
import { CreateTorus } from "./Builders/torusBuilder.pure.js";
import { CreateTorusKnot } from "./Builders/torusKnotBuilder.pure.js";
import { CreateDashedLines, CreateLineSystem, CreateLines } from "./Builders/linesBuilder.pure.js";
import { CreatePolygon, ExtrudePolygon } from "./Builders/polygonBuilder.pure.js";
import { ExtrudeShape, ExtrudeShapeCustom } from "./Builders/shapeBuilder.pure.js";
import { CreateLathe } from "./Builders/latheBuilder.pure.js";
import { CreatePlane } from "./Builders/planeBuilder.pure.js";
import { CreateTiledPlane } from "./Builders/tiledPlaneBuilder.pure.js";
import { CreateGround, CreateGroundFromHeightMap, CreateTiledGround } from "./Builders/groundBuilder.pure.js";
import { CreateTube } from "./Builders/tubeBuilder.pure.js";
import { CreatePolyhedron } from "./Builders/polyhedronBuilder.pure.js";
import { CreateIcoSphere } from "./Builders/icoSphereBuilder.pure.js";
import { CreateDecal } from "./Builders/decalBuilder.pure.js";
import { CreateCapsule } from "./Builders/capsuleBuilder.pure.js";
import { CreateGeodesic } from "./Builders/geodesicBuilder.js";
import { CreateGoldberg } from "./Builders/goldbergBuilder.js";
import { CreateText } from "./Builders/textBuilder.js";
/**
 * Class containing static functions to help procedurally build meshes
 */
export declare const MeshBuilder: {
    CreateBox: typeof CreateBox;
    CreateTiledBox: typeof CreateTiledBox;
    CreateSphere: typeof CreateSphere;
    CreateDisc: typeof CreateDisc;
    CreateIcoSphere: typeof CreateIcoSphere;
    CreateRibbon: typeof CreateRibbon;
    CreateCylinder: typeof CreateCylinder;
    CreateTorus: typeof CreateTorus;
    CreateTorusKnot: typeof CreateTorusKnot;
    CreateLineSystem: typeof CreateLineSystem;
    CreateLines: typeof CreateLines;
    CreateDashedLines: typeof CreateDashedLines;
    ExtrudeShape: typeof ExtrudeShape;
    ExtrudeShapeCustom: typeof ExtrudeShapeCustom;
    CreateLathe: typeof CreateLathe;
    CreateTiledPlane: typeof CreateTiledPlane;
    CreatePlane: typeof CreatePlane;
    CreateGround: typeof CreateGround;
    CreateTiledGround: typeof CreateTiledGround;
    CreateGroundFromHeightMap: typeof CreateGroundFromHeightMap;
    CreatePolygon: typeof CreatePolygon;
    ExtrudePolygon: typeof ExtrudePolygon;
    CreateTube: typeof CreateTube;
    CreatePolyhedron: typeof CreatePolyhedron;
    CreateGeodesic: typeof CreateGeodesic;
    CreateGoldberg: typeof CreateGoldberg;
    CreateDecal: typeof CreateDecal;
    CreateCapsule: typeof CreateCapsule;
    CreateText: typeof CreateText;
};
