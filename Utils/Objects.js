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
    },
    elToObj: (el) => {
        const obj = {};
        for (const attr of el.attributes) {
            obj[attr.name] = attr.value;
        }
        if(el.children && el.children.length > 0) {
            obj.children = Array.from(el.children).map(child => Objects.elToObj(child));
        }
        return obj;
    }
}
export default Objects;