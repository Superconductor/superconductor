/**
 * Adds event listening/sending capabilities to an object, with events localized to this
 * Superconductor instance.
 */
Superconductor.prototype.makeEvented = function(obj) {
    var eventListeners = this.eventListeners = (this.eventListeners || {});
    var sc = this;

    obj.addEventListener = function(event, listener) {
        eventListeners[event] = eventListeners[event] || [];
        eventListeners[event].push(listener)
        // FIXME: Return a unique ID we can later use to remove the listener
        return -1;
    };

    obj.sendEvent = function(event, args) {
        if(!eventListeners[event]) {
            return;
        }

        for(listenerIdx in eventListeners[event]) {
            (eventListeners[event][listenerIdx]).apply(sc, args);
        }
    }
}