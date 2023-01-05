import { ShapeType } from "./IPhysicsEnginePlugin.js";
/**
 *
 */
/** @internal */
export class PhysicsShape {
    /**
     *
     * @param type
     * @param options
     * @param scene
     * @returns
     */
    constructor(type, options = {}, scene) {
        /** @internal */
        this._pluginData = undefined;
        this._type = type;
        if (!scene) {
            return;
        }
        const physicsEngine = scene.getPhysicsEngine();
        if (!physicsEngine) {
            throw new Error("No Physics Engine available.");
        }
        if (physicsEngine.getPluginVersion() != 2) {
            throw new Error("Plugin version is incorrect. Expected version 2.");
        }
        const physicsPlugin = physicsEngine.getPhysicsPlugin();
        if (!physicsPlugin) {
            throw new Error("No Physics Plugin available.");
        }
        this._physicsPlugin = physicsPlugin;
        this._physicsPlugin.initShape(this, type, options);
    }
    /**
     *
     */
    get type() {
        return this._type;
    }
    /**
     *
     * @param layer
     */
    setFilterLayer(layer) {
        this._physicsPlugin.setFilterLayer(this, layer);
    }
    /**
     *
     * @returns
     */
    getFilterLayer() {
        return this._physicsPlugin.getFilterLayer(this);
    }
    /**
     *
     * @param materialId
     */
    setMaterial(material) {
        this._physicsPlugin.setMaterial(this, material);
    }
    /**
     *
     * @returns
     */
    getMaterial() {
        return this._physicsPlugin.getMaterial(this);
    }
    /**
     *
     * @param density
     */
    setDensity(density) {
        this._physicsPlugin.setDensity(this, density);
    }
    /**
     *
     */
    getDensity() {
        return this._physicsPlugin.getDensity(this);
    }
    /**
     *
     * @param newChild
     * @param childTransform
     */
    addChild(newChild, childTransform) {
        this._physicsPlugin.addChild(this, newChild, childTransform);
    }
    /**
     *
     * @param childIndex
     */
    removeChild(childIndex) {
        this._physicsPlugin.removeChild(this, childIndex);
    }
    /**
     *
     * @returns
     */
    getNumChildren() {
        return this._physicsPlugin.getNumChildren(this);
    }
    /**
     *
     */
    getBoundingBox() {
        return this._physicsPlugin.getBoundingBox(this);
    }
    /**
     *
     */
    dispose() {
        this._physicsPlugin.disposeShape(this);
    }
}
/**
 *
 */
/** @internal */
export class PhysicsShapeSphere extends PhysicsShape {
    /** @internal */
    /**
     *
     * @param center
     * @param radius
     * @param scene
     */
    constructor(center, radius, scene) {
        super(ShapeType.SPHERE, { center: center, radius: radius }, scene);
    }
}
/***
 *
 */
/** @internal */
export class PhysicsShapeCapsule extends PhysicsShape {
    /** @internal */
    /**
     *
     * @param pointA
     * @param pointB
     * @param radius
     * @param scene
     */
    constructor(pointA, pointB, radius, scene) {
        super(ShapeType.CAPSULE, { pointA: pointA, pointB: pointB, radius: radius }, scene);
    }
}
/**
 *
 */
/** @internal */
export class PhysicsShapeCylinder extends PhysicsShape {
    /** @internal */
    /**
     *
     * @param pointA
     * @param pointB
     * @param radius
     * @param scene
     */
    constructor(pointA, pointB, radius, scene) {
        super(ShapeType.CYLINDER, { pointA: pointA, pointB: pointB, radius: radius }, scene);
    }
}
/**
 *
 */
/** @internal */
export class PhysicsShapeShapeBox extends PhysicsShape {
    /** @internal */
    /**
     *
     * @param center
     * @param rotation
     * @param extents
     * @param scene
     */
    constructor(center, rotation, extents, scene) {
        super(ShapeType.BOX, { center: center, rotation: rotation, extents: extents }, scene);
    }
}
/**
 *
 */
/** @internal */
export class PhysicsShapeShapeConvexHull extends PhysicsShape {
    /** @internal */
    /**
     *
     * @param mesh
     * @param scene
     */
    constructor(mesh, scene) {
        super(ShapeType.CONVEX_HULL, { mesh: mesh }, scene);
    }
}
/**
 *
 */
/** @internal */
export class PhysicsShapeShapeMesh extends PhysicsShape {
    /** @internal */
    /**
     *
     * @param mesh
     * @param scene
     */
    constructor(mesh, scene) {
        super(ShapeType.MESH, { mesh: mesh }, scene);
    }
}
/**
 *
 */
/** @internal */
export class PhysicsShapeShapeContainer extends PhysicsShape {
    /** @internal */
    /**
     *
     * @param mesh
     * @param scene
     */
    constructor(mesh, scene) {
        super(ShapeType.CONTAINER, {}, scene);
    }
}
//# sourceMappingURL=physicsShape.js.map