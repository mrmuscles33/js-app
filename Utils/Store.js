const Store = {
    _data: new Map(),
    _observers: new Map(),
    set(id, data) {
        Store._data.set(id, data);
        Store.notify(id);
    },
    get(id) {
        return Store._data.get(id);
    },
    subscribe(id, callback) {
        if (!Store._observers.has(id)) {
            Store._observers.set(id, []);
        }
        Store._observers.get(id).push(callback);
        return () => Store.unsubscribe(id, callback);
    },
    unsubscribe(id, callback) {
        if (Store._observers.has(id)) {
            const observers = Store._observers.get(id);
            const index = observers.indexOf(callback);
            if (index !== -1) {
                observers.splice(index, 1);
                if (observers.length === 0) {
                    Store._observers.delete(id);
                }
                
                return true;
            }
        }
        return false;
    },
    notify(id) {
        if (Store._observers.has(id)) {
            Store._observers.get(id).forEach(callback => callback(Store.get(id)));
        }
    }
};
export default Store;