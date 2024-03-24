const Objects = {
    equals: (objectA, objectB, whiteListAttrs = [], blackListAttrs = []) => {
        const keysA = Object.keys(objectA).filter(prop => !blackListAttrs.includes(prop) && (whiteListAttrs.length == 0 || whiteListAttrs.includes(prop)));
        const keysB = Object.keys(objectB).filter(prop => !blackListAttrs.includes(prop) && (whiteListAttrs.length == 0 || whiteListAttrs.includes(prop)));
        if (keysA.length != keysB.length) return false;
        for (const key of keysA) {
            if (objectA[key] != objectB[key]) return false;
        }
        return true;
    },
    undenifed: (obj) => {
        return obj == undefined;
    },
    null: (obj) => {
        return obj == null;
    },
    defined: (obj) => {
        return !Objects.undenifed(obj) && !Objects.null(obj);
    },
    clone: (obj) => {
        return JSON.parse(JSON.stringify(obj));
    },
    merge: (obj1, obj2) => {
        return { ...obj1, ...obj2 };
    }
}
export default Objects;