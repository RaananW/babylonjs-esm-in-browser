/** @internal */
export function _ConnectBefore(newOne, activeOne) {
    newOne.previousItem = activeOne.previousItem;
    newOne.nextItem = activeOne;
    if (activeOne.previousItem) {
        activeOne.previousItem.nextItem = newOne;
    }
    activeOne.previousItem = newOne;
}
/** @internal */
export function _ConnectAfter(newOne, activeOne) {
    newOne.previousItem = activeOne;
    newOne.nextItem = activeOne.nextItem;
    if (activeOne.nextItem) {
        activeOne.nextItem.previousItem = newOne;
    }
    activeOne.nextItem = newOne;
}
/** @internal */
export function _ConnectAtTheEnd(newOne, root) {
    let activeOne = root;
    while (activeOne.nextItem) {
        activeOne = activeOne.nextItem;
    }
    newOne.previousItem = activeOne;
    newOne.nextItem = activeOne.nextItem;
    activeOne.nextItem = newOne;
}
/** @internal */
export function _RemoveFromQueue(item) {
    if (item.previousItem) {
        item.previousItem.nextItem = item.nextItem;
    }
    if (item.nextItem) {
        item.nextItem.previousItem = item.previousItem;
    }
}
//# sourceMappingURL=executionQueue.js.map