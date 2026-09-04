import { Logger } from "../Misc/logger.js";
export var FlowGraphAction;
(function (FlowGraphAction) {
    FlowGraphAction["ExecuteBlock"] = "ExecuteBlock";
    FlowGraphAction["ExecuteEvent"] = "ExecuteEvent";
    FlowGraphAction["TriggerConnection"] = "TriggerConnection";
    FlowGraphAction["ContextVariableSet"] = "ContextVariableSet";
    FlowGraphAction["GlobalVariableSet"] = "GlobalVariableSet";
    FlowGraphAction["GlobalVariableDelete"] = "GlobalVariableDelete";
    FlowGraphAction["GlobalVariableGet"] = "GlobalVariableGet";
    FlowGraphAction["AddConnection"] = "AddConnection";
    FlowGraphAction["GetConnectionValue"] = "GetConnectionValue";
    FlowGraphAction["SetConnectionValue"] = "SetConnectionValue";
    FlowGraphAction["ActivateSignal"] = "ActivateSignal";
    FlowGraphAction["ContextVariableGet"] = "ContextVariableGet";
})(FlowGraphAction || (FlowGraphAction = {}));
/**
 * This class will be responsible of logging the flow graph activity.
 * Note that using this class might reduce performance, as it will log every action, according to the configuration.
 * It attaches to a flow graph and uses meta-programming to replace the methods of the flow graph to add logging abilities.
 */
export class FlowGraphLogger {
    constructor() {
        /**
         * Whether to log to the console.
         */
        this.logToConsole = false;
        /**
         * The log cache of the flow graph.
         * Each item is a logged item, in order of execution.
         */
        this.log = [];
    }
    addLogItem(item) {
        if (!item.time) {
            item.time = Date.now();
        }
        this.log.push(item);
        if (this.logToConsole) {
            const value = item.payload?.value;
            if (typeof value === "object" && value.getClassName) {
                Logger.Log(`[FGLog] ${item.className}:${item.uniqueId.split("-")[0]} ${item.action} - ${JSON.stringify(value.getClassName())}: ${value.toString()}`);
            }
            else {
                Logger.Log(`[FGLog] ${item.className}:${item.uniqueId.split("-")[0]} ${item.action} - ${JSON.stringify(item.payload)}`);
            }
        }
    }
    getItemsOfType(action) {
        return this.log.filter((i) => i.action === action);
    }
}
//# sourceMappingURL=flowGraphLogger.js.map