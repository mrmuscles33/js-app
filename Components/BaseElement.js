export class BaseElement extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.constructor.attrs.forEach((attr) => {
            Object.defineProperty(this.constructor.prototype, attr, {
                get() {
                    return this.getAttribute(attr);
                },
                set(newValue) {
                    this.setAttribute(attr, newValue);
                },
            });
        });
    }
    static get observedAttributes() {
        return this.attrs;
    }
    connectedCallback() {
        this.update();
    }
    attributeChangedCallback(name, oldValue, newValue) {
        this.update();
    }
    update() {
        this.shadowRoot.innerHTML = this.style()
            ? `<style>${this.style()}</style>${this.template()}`
            : this.template();
    }
    style() {
        return null;
    }
}