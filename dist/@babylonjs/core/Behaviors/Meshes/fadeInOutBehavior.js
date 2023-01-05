/**
 * A behavior that when attached to a mesh will allow the mesh to fade in and out
 */
export class FadeInOutBehavior {
    /**
     * Instantiates the FadeInOutBehavior
     */
    constructor() {
        /**
         * Time in milliseconds to delay before fading in (Default: 0)
         */
        this.delay = 0;
        /**
         * Time in milliseconds for the mesh to fade in (Default: 300)
         */
        this.fadeInTime = 300;
        this._millisecondsPerFrame = 1000 / 60;
        this._hovered = false;
        this._hoverValue = 0;
        this._ownerNode = null;
        this._update = () => {
            if (this._ownerNode) {
                this._hoverValue += this._hovered ? this._millisecondsPerFrame : -this._millisecondsPerFrame;
                this._setAllVisibility(this._ownerNode, (this._hoverValue - this.delay) / this.fadeInTime);
                if (this._ownerNode.visibility > 1) {
                    this._setAllVisibility(this._ownerNode, 1);
                    this._hoverValue = this.fadeInTime + this.delay;
                    return;
                }
                else if (this._ownerNode.visibility < 0) {
                    this._setAllVisibility(this._ownerNode, 0);
                    if (this._hoverValue < 0) {
                        this._hoverValue = 0;
                        return;
                    }
                }
                setTimeout(this._update, this._millisecondsPerFrame);
            }
        };
    }
    /**
     *  The name of the behavior
     */
    get name() {
        return "FadeInOut";
    }
    /**
     *  Initializes the behavior
     */
    init() { }
    /**
     * Attaches the fade behavior on the passed in mesh
     * @param ownerNode The mesh that will be faded in/out once attached
     */
    attach(ownerNode) {
        this._ownerNode = ownerNode;
        this._setAllVisibility(this._ownerNode, 0);
    }
    /**
     *  Detaches the behavior from the mesh
     */
    detach() {
        this._ownerNode = null;
    }
    /**
     * Triggers the mesh to begin fading in or out
     * @param value if the object should fade in or out (true to fade in)
     */
    fadeIn(value) {
        this._hovered = value;
        this._update();
    }
    _setAllVisibility(mesh, value) {
        mesh.visibility = value;
        mesh.getChildMeshes().forEach((c) => {
            this._setAllVisibility(c, value);
        });
    }
}
//# sourceMappingURL=fadeInOutBehavior.js.map