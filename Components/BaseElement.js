import Events from "../Utils/Events.js";

export default class BaseElement extends HTMLElement {
	static attrs = ["id", "name", "cls", "styles"];
	static idCounter = 1;
	constructor() {
		super();
		this.cls = this.cls || "";
		this.ignoreChange = true;
		this.attachShadow({ mode: "open" });
		this.constructor.attrs.forEach((attr) => {
			if (!Object.getOwnPropertyDescriptor(this.constructor.prototype, attr)) {
				Object.defineProperty(this.constructor.prototype, attr, {
					get() {
						return this.getAttribute(attr);
					},
					set(newValue) {
						this.setAttribute(attr, newValue);
					},
				});
			}
		});
	}
	static get observedAttributes() {
		return this.attrs;
	}
	connectedCallback() {
		this.id = this.id || `base-element-${BaseElement.idCounter++}`;
		this.name = this.name || "";
		this.update();
	}
	attributeChangedCallback(name, oldValue, newValue) {
		if (!this.ignoreChange) this.update();
	}
	update() {
		let me = this;

		// Remove extra space in html and css
		let tpl = me
			.template()
			.map((l) => l.trim())
			.filter((l) => l != "")
			.join(" ");
		let style = me
			.style()
			.map((l) => l.trim())
			.filter((l) => l != "")
			.join(" ");
		let activeId = document.activeElement.id;
		me.shadowRoot.innerHTML = (style ? `<style>${style}</style>` : "") + tpl;

		// Keep focus on current element when after rendering
		if (activeId == me.id) {
			setTimeout(() => {
				me.shadowRoot.getElementById(me.id).focus();
			}, 50);
		}
		me.ignoreChange = false;
	}
	style() {
		return [`@import url('../public/themes/light.css');`, `@import url('../public/google_icons.css');`];
	}
	template() {
		return [];
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
			if (event.target == elt && event.type == eventName) {
				Events.dispatch(this, eventName, event, this.getDetail());
			}
		});
	}
	fireHandler(eventName, event) {
		let handler = "on" + eventName.charAt(0).toUpperCase() + eventName.substring(1);
		if (this[handler]) {
			this[handler](event);
		}
	}
}
