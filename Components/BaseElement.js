import Events from "../Utils/Events.js";
import Html from "../Utils/Html.js";

export default class BaseElement extends HTMLElement {
	static attrs = ["key", "name", "cls", "extrastyle", "parent"];
	static idCounter = 1;
	constructor() {
		super();
		this.ignoreChange = true;
		this.skipFocus = false;
		this.parent = this.parent || '';
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
		this.key = this.key || `element-${BaseElement.idCounter++}`;
		this.name = this.name || "";
		this.cls = this.cls || "";
		this.extrastyle = this.extrastyle || "";
		this.render();
	}
	attributeChangedCallback(name, oldValue, newValue) {
		if (!this.ignoreChange) this.render();
	}
	render() {
		let me = this;

		// Remove extra space in html and css
		let tpl = Html.clean`${me.template()}`;
		let style = Html.clean`${me.extrastyle}`;
		let activeId = document.activeElement.id;
		if(this.parent && me.parentElement != document.querySelector(this.parent)) {
			document.querySelector(this.parent).appendChild(me.parentElement.removeChild(me));
		}
		Html.render(me, (style ? `<style>[key=${this.key}]{${style}}</style>` : "") + tpl);

		// Keep focus on current element when after rendering
		if (activeId == me.key && !me.skipFocus) {
			setTimeout(() => {
				me.focus();
			}, 50);
		}
		me.ignoreChange = false;
	}
	focus() {
		// Focus on the element with the id
		document.getElementById(this.key).focus();
	}
	static style() {
		return `
			@import url('../public/themes/light.css');
			@import url('../public/google_icons.css');
		`;
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
		if (this[handler] && typeof this[handler] == "function") {
			this[handler](event);
		}
	}
}
