export default class Directive {
    constructor(attributeName) {
        this.attributeName = attributeName;
        // this.initObserver();
    }

    initObserver() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                const target = mutation.target;
                const oldValue = mutation.oldValue;
                const newValue = target.getAttribute(this.attributeName);

                if (target.hasAttribute(this.attributeName)) {
                    if(oldValue !== newValue) {
                        this.onAttributeChanged(target, oldValue, newValue);
                    } else {
                        this.onAttributeAdded(target, newValue);
                    }
                } else {
                    this.onAttributeRemoved(target);
                }

                mutation.removedNodes.forEach((node) => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        node.querySelectorAll(`[${this.attributeName}]`).forEach(this.onAttributeRemoved)
                        if(node.hasAttribute(this.attributeName)) this.onAttributeRemoved(node);
                    }
                });
            });
        });

        observer.observe(document.body, {
            attributes: true,
            attributeOldValue: true,
            attributeFilter: [this.attributeName],
            subtree: true,
            childList: true
        });
        this.observer = observer;

        document.querySelectorAll(`[${this.attributeName}]`).forEach((element) => {
            const value = element.getAttribute(this.attributeName);
            this.onAttributeAdded(element, value);
        });
    }
    onAttributeAdded(element, newValue) {
        console.warn(`Attribute "${this.attributeName}" added with value "${newValue}" to`, element);
    }
    onAttributeRemoved(element) {
        console.warn(`Attribute "${this.attributeName}" removed from`, element);
    }
    onAttributeChanged(element, oldValue, newValue) {
        console.warn(`Attribute "${this.attributeName}" changed from "${oldValue}" to "${newValue}" on`, element);
    }
    disconnect() {
        this.observer.disconnect();
    }
}