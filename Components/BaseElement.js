export class BaseElement extends HTMLElement {
	constructor() {
		super();
		this.rendered = false;
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
		if (this.rendered) this.update();
	}
	update() {
		this.shadowRoot.innerHTML = this.style() ? `<style>${this.style()}</style>${this.template()}` : this.template();
		this.rendered = true;
	}
	style() {
		return `
            @import url('../public/themes/light.css');
            @import url('../public/google_icons.css');
        `;
	}
	template() {
		return null;
	}
	getDetail() {
		let detail = {};
		for (let attr of this.constructor.attrs) {
			detail[attr] = this[attr];
		}
		return detail;
	}
	dispatch(elt, eventName) {
		elt.addEventListener(eventName, (event) => {
			let customEvt = new CustomEvent(eventName, {
				...event,
				detail: this.getDetail(),
			});
			this.dispatchEvent(customEvt);
		});
	}
}
