import type { TransformNode } from "../../Meshes/transformNode";
import type { BoundingBox } from "../../Culling/boundingBox";
import { ShapeType } from "./IPhysicsEnginePlugin";
import type { PhysicsShapeParameters } from "./IPhysicsEnginePlugin";
import type { PhysicsMaterial } from "./physicsMaterial";
import type { Vector3 } from "../../Maths/math.vector";
import type { Quaternion } from "../../Maths/math.vector";
import type { AbstractMesh } from "../../Meshes/abstractMesh";
import type { Scene } from "../../scene";
/**
 *
 */
/** @internal */
export declare class PhysicsShape {
    /** @internal */
    _pluginData: any;
    private _physicsPlugin;
    private _type;
    /**
     *
     * @param type
     * @param options
     * @param scene
     * @returns
     */
    constructor(type: number, options: PhysicsShapeParameters | undefined, scene: Scene);
    /**
     *
     */
    get type(): ShapeType;
    /**
     *
     * @param layer
     */
    setFilterLayer(layer: number): void;
    /**
     *
     * @returns
     */
    getFilterLayer(): number;
    /**
     *
     * @param materialId
     */
    setMaterial(material: PhysicsMaterial): void;
    /**
     *
     * @returns
     */
    getMaterial(): PhysicsMaterial | undefined;
    /**
     *
     * @param density
     */
    setDensity(density: number): void;
    /**
     *
     */
    getDensity(): number;
    /**
     *
     * @param newChild
     * @param childTransform
     */
    addChild(newChild: PhysicsShape, childTransform: TransformNode): void;
    /**
     *
     * @param childIndex
     */
    removeChild(childIndex: number): void;
    /**
     *
     * @returns
     */
    getNumChildren(): number;
    /**
     *
     */
    getBoundingBox(): BoundingBox;
    /**
     *
     */
    dispose(): void;
}
/**
 *
 */
/** @internal */
export declare class PhysicsShapeSphere extends PhysicsShape {
    /** @internal */
    /**
     *
     * @param center
     * @param radius
     * @param scene
     */
    constructor(center: Vector3, radius: number, scene: Scene);
}
/***
 *
 */
/** @internal */
export declare class PhysicsShapeCapsule extends PhysicsShape {
    /** @internal */
    /**
     *
     * @param pointA
     * @param pointB
     * @param radius
     * @param scene
     */
    constructor(pointA: Vector3, pointB: Vector3, radius: number, scene: Scene);
}
/**
 *
 */
/** @internal */
export declare class PhysicsShapeCylinder extends PhysicsShape {
    /** @internal */
    /**
     *
     * @param pointA
     * @param pointB
     * @param radius
     * @param scene
     */
    constructor(pointA: Vector3, pointB: Vector3, radius: number, scene: Scene);
}
/**
 *
 */
/** @internal */
export declare class PhysicsShapeShapeBox extends PhysicsShape {
    /** @internal */
    /**
     *
     * @param center
     * @param rotation
     * @param extents
     * @param scene
     */
    constructor(center: Vector3, rotation: Quaternion, extents: Vector3, scene: Scene);
}
/**
 *
 */
/** @internal */
export declare class PhysicsShapeShapeConvexHull extends PhysicsShape {
    /** @internal */
    /**
     *
     * @param mesh
     * @param scene
     */
    constructor(mesh: AbstractMesh, scene: Scene);
}
/**
 *
 */
/** @internal */
export declare class PhysicsShapeShapeMesh extends PhysicsShape {
    /** @internal */
    /**
     *
     * @param mesh
     * @param scene
     */
    constructor(mesh: AbstractMesh, scene: Scene);
}
/**
 *
 */
/** @internal */
export declare class PhysicsShapeShapeContainer extends PhysicsShape {
    /** @internal */
    /**
     *
     * @param mesh
     * @param scene
     */
    constructor(mesh: AbstractMesh, scene: Scene);
}
