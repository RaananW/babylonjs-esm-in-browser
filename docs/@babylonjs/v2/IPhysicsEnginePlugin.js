/** @internal */
export var ConstraintAxisLimitMode;
(function (ConstraintAxisLimitMode) {
    ConstraintAxisLimitMode[ConstraintAxisLimitMode["FREE"] = 0] = "FREE";
    ConstraintAxisLimitMode[ConstraintAxisLimitMode["LIMITED"] = 1] = "LIMITED";
    ConstraintAxisLimitMode[ConstraintAxisLimitMode["LOCKED"] = 2] = "LOCKED";
    ConstraintAxisLimitMode[ConstraintAxisLimitMode["NONE"] = 3] = "NONE";
})(ConstraintAxisLimitMode || (ConstraintAxisLimitMode = {}));
/** @internal */
export var ConstraintAxis;
(function (ConstraintAxis) {
    ConstraintAxis[ConstraintAxis["LINEAR_X"] = 0] = "LINEAR_X";
    ConstraintAxis[ConstraintAxis["LINEAR_Y"] = 1] = "LINEAR_Y";
    ConstraintAxis[ConstraintAxis["LINEAR_Z"] = 2] = "LINEAR_Z";
    ConstraintAxis[ConstraintAxis["ANGULAR_X"] = 3] = "ANGULAR_X";
    ConstraintAxis[ConstraintAxis["ANGULAR_Y"] = 4] = "ANGULAR_Y";
    ConstraintAxis[ConstraintAxis["ANGULAR_Z"] = 5] = "ANGULAR_Z";
    ConstraintAxis[ConstraintAxis["LINEAR_DISTANCE"] = 6] = "LINEAR_DISTANCE";
})(ConstraintAxis || (ConstraintAxis = {}));
/** @internal */
export var ConstraintType;
(function (ConstraintType) {
    ConstraintType[ConstraintType["BALL_AND_SOCKET"] = 0] = "BALL_AND_SOCKET";
    ConstraintType[ConstraintType["DISTANCE"] = 1] = "DISTANCE";
    ConstraintType[ConstraintType["HINGE"] = 2] = "HINGE";
    ConstraintType[ConstraintType["SLIDER"] = 3] = "SLIDER";
    ConstraintType[ConstraintType["LOCK"] = 4] = "LOCK";
})(ConstraintType || (ConstraintType = {}));
/** @internal */
export var ShapeType;
(function (ShapeType) {
    ShapeType[ShapeType["SPHERE"] = 0] = "SPHERE";
    ShapeType[ShapeType["CAPSULE"] = 1] = "CAPSULE";
    ShapeType[ShapeType["CYLINDER"] = 2] = "CYLINDER";
    ShapeType[ShapeType["BOX"] = 3] = "BOX";
    ShapeType[ShapeType["CONVEX_HULL"] = 4] = "CONVEX_HULL";
    ShapeType[ShapeType["CONTAINER"] = 5] = "CONTAINER";
    ShapeType[ShapeType["MESH"] = 6] = "MESH";
    ShapeType[ShapeType["HEIGHTFIELD"] = 7] = "HEIGHTFIELD";
})(ShapeType || (ShapeType = {}));
/** @internal */
export var ConstraintMotorType;
(function (ConstraintMotorType) {
    ConstraintMotorType[ConstraintMotorType["NONE"] = 0] = "NONE";
    ConstraintMotorType[ConstraintMotorType["VELOCITY"] = 1] = "VELOCITY";
    ConstraintMotorType[ConstraintMotorType["POSITION"] = 2] = "POSITION";
})(ConstraintMotorType || (ConstraintMotorType = {}));
//# sourceMappingURL=IPhysicsEnginePlugin.js.map