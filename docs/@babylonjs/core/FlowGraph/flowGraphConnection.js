import { RandomGUID } from "../Misc/guid.js";
/**
 * The type of a connection point - input or output.
 */
export var FlowGraphConnectionType;
(function (FlowGraphConnectionType) {
    FlowGraphConnectionType[FlowGraphConnectionType["Input"] = 0] = "Input";
    FlowGraphConnectionType[FlowGraphConnectionType["Output"] = 1] = "Output";
})(FlowGraphConnectionType || (FlowGraphConnectionType = {}));
/**
 * The base connection class.
 */
export class FlowGraphConnection {
    constructor(name, _connectionType, 
    /* @internal */ _ownerBlock) {
        this._ownerBlock = _ownerBlock;
        /** @internal */
        this._connectedPoint = [];
        /**
         * A uniquely identifying string for the connection.
         */
        this.uniqueId = RandomGUID();
        /**
         * Used for parsing connections.
         * @internal
         */
        // disable warning as this is used for parsing
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        this.connectedPointIds = [];
        this.name = name;
        this._connectionType = _connectionType;
    }
    /**
     * The type of the connection
     */
    get connectionType() {
        return this._connectionType;
    }
    /**
     * @internal
     * Override this to indicate if a point can connect to more than one point.
     */
    _isSingularConnection() {
        return true;
    }
    /**
     * Returns if a point is connected to any other point.
     * @returns boolean indicating if the point is connected.
     */
    isConnected() {
        return this._connectedPoint.length > 0;
    }
    /**
     * Connects two connections together.
     * @param point the connection to connect to.
     */
    connectTo(point) {
        if (this._connectionType === point._connectionType) {
            throw new Error(`Cannot connect two points of type ${this.connectionType}`);
        }
        if ((this._isSingularConnection() && this._connectedPoint.length > 0) || (point._isSingularConnection() && point._connectedPoint.length > 0)) {
            throw new Error("Max number of connections for point reached");
        }
        this._connectedPoint.push(point);
        point._connectedPoint.push(this);
    }
    /**
     * Disconnects two connections.
     * @param point the connection to disconnect from.
     * @param removeFromLocal if true, the connection will be removed from the local connection list.
     */
    disconnectFrom(point, removeFromLocal = true) {
        const indexLocal = this._connectedPoint.indexOf(point);
        const indexConnected = point._connectedPoint.indexOf(this);
        if (indexLocal === -1 || indexConnected === -1) {
            return;
        }
        if (removeFromLocal) {
            this._connectedPoint.splice(indexLocal, 1);
        }
        point._connectedPoint.splice(indexConnected, 1);
    }
    /**
     * Disconnects all connected points.
     */
    disconnectFromAll() {
        for (const point of this._connectedPoint) {
            this.disconnectFrom(point, false);
        }
        this._connectedPoint.length = 0;
    }
    dispose() {
        for (const point of this._connectedPoint) {
            this.disconnectFrom(point);
        }
    }
    /**
     * Saves the connection to a JSON object.
     * @param serializationObject the object to serialize to.
     */
    serialize(serializationObject = {}) {
        serializationObject.uniqueId = this.uniqueId;
        serializationObject.name = this.name;
        serializationObject._connectionType = this._connectionType;
        serializationObject.connectedPointIds = [];
        serializationObject.className = this.getClassName();
        for (const point of this._connectedPoint) {
            serializationObject.connectedPointIds.push(point.uniqueId);
        }
    }
    /**
     * @returns class name of the connection.
     */
    getClassName() {
        return "FGConnection";
    }
    /**
     * Deserialize from a object into this
     * @param serializationObject the object to deserialize from.
     */
    deserialize(serializationObject) {
        this.uniqueId = serializationObject.uniqueId;
        this.name = serializationObject.name;
        this._connectionType = serializationObject._connectionType;
        this.connectedPointIds = serializationObject.connectedPointIds;
    }
}
//# sourceMappingURL=flowGraphConnection.js.map