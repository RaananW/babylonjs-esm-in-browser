/**
 * Defines the kind of contextual sources for node particles
 */
export declare enum NodeParticleContextualSources {
    /** None */
    None = 0,
    /** Position */
    Position = 1,
    /** Direction */
    Direction = 2,
    /** Age */
    Age = 3,
    /** Lifetime */
    Lifetime = 4,
    /** Color */
    Color = 5,
    /** ScaledDirection */
    ScaledDirection = 6,
    /** Scale */
    Scale = 7,
    /** AgeGradient */
    AgeGradient = 8,
    /** Angle */
    Angle = 9,
    /** SpriteCellIndex */
    SpriteCellIndex = 16,
    /** SpriteCellStart */
    SpriteCellStart = 17,
    /** SpriteCellEnd */
    SpriteCellEnd = 18,
    /** Initial Color */
    InitialColor = 19,
    /** Color Dead*/
    ColorDead = 20,
    /** Initial Direction */
    InitialDirection = 21,
    /** Color Step */
    ColorStep = 22,
    /** Scaled Color Step */
    ScaledColorStep = 23,
    /** Local Position Updated */
    LocalPositionUpdated = 24,
    /** Size */
    Size = 25,
    /** Direction Scale */
    DirectionScale = 32
}
