/** This file must only contain pure code and pure imports */
/* eslint-disable @typescript-eslint/naming-convention */
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
export const MeshBuilder = {
    CreateBox,
    CreateTiledBox,
    CreateSphere,
    CreateDisc,
    CreateIcoSphere,
    CreateRibbon,
    CreateCylinder,
    CreateTorus,
    CreateTorusKnot,
    CreateLineSystem,
    CreateLines,
    CreateDashedLines,
    ExtrudeShape,
    ExtrudeShapeCustom,
    CreateLathe,
    CreateTiledPlane,
    CreatePlane,
    CreateGround,
    CreateTiledGround,
    CreateGroundFromHeightMap,
    CreatePolygon,
    ExtrudePolygon,
    CreateTube,
    CreatePolyhedron,
    CreateGeodesic,
    CreateGoldberg,
    CreateDecal,
    CreateCapsule,
    CreateText,
};
//# sourceMappingURL=meshBuilder.pure.js.map