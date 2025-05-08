import Html from "../Utils/Html.js";

export default class BaseElement extends HTMLElement {
	static attrs = ["key", "name", "cls", "extrastyle", "parent"];
	static idCounter = 1;
	static selector = "amr-element";
	constructor() {
		super();
		this.ignoreChange = true;
		this.skipFocus = false;
		this.constructor.attrs.forEach((attr) => {
			if (!Object.getOwnPropertyDescriptor(this.constructor.prototype, attr)) {
				Object.defineProperty(this.constructor.prototype, attr, {
					get() { return this.getAttribute(attr) },
					set(newValue) { this.setAttribute(attr, newValue) }
				});
			}
		});
	}
	static get observedAttributes() {
		return this.attrs;
	}
	connectedCallback() {
		this.parent = this.parent || '';
		this.key = `${this.constructor.selector}-${this.constructor.idCounter++}`;
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
		return '';
	}
	fireHandler(eventName, event) {
		let handler = "on" + eventName.charAt(0).toUpperCase() + eventName.substring(1);
		if (this[handler] && typeof this[handler] == "function") {
			this[handler](event);
		}
	}
	static get(attrs = {}, cls = [], tagName = this.selector) {
        let element = document.createElement(tagName);
        Object.entries(attrs).forEach(([attr, value]) => {
            element.setAttribute(attr, value);
        });
        element.classList.add(...cls);
        return element;
    }
}
