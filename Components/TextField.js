import BaseElement from "./BaseElement.js";
import Events from "../Utils/Events.js";

export default class TextField extends BaseElement {
	static attrs = [
		...BaseElement.attrs,
		"value",
		"disabled",
		"iconleft",
		"iconright",
		"label",
		"errormessage",
		"pattern",
		"required",
		"readonly",
		"type",
		"format",
		"filled",
		"flex",
		"maxlength",
	];
	static counter = 1;
	connectedCallback() {
		this.value = this.value || "";
		this.disabled = this.disabled || "false";
		this.label = this.label || "";
		this.errormessage = this.errormessage || "";
		this.pattern = this.pattern || "";
		this.required = this.required || "false";
		this.readonly = this.readonly || "false";
		this.type = this.type || "text";
		this.format = this.format || "";
		this.filled = this.filled || "true";
		this.maxlength = this.maxlength || 128;
		this.key = this.key || `amr-text-${TextField.counter++}`;
		this.left = Array.from(this.childNodes).find(
			(node) => node.nodeType === Node.ELEMENT_NODE && node.getAttribute("slot") == "left"
		);
		this.right = Array.from(this.childNodes).find(
			(node) => node.nodeType === Node.ELEMENT_NODE && node.getAttribute("slot") == "right"
		);
		super.connectedCallback();
	}
	render() {
		// Dynamics variables
		let me = this;

		// The update methods breaks listeners and bindings
		super.render();
		let div = me.querySelector("div");
		let input = me.querySelector("input");

		// Listeners
		if (!this.disabled || this.disabled == "false") {
			// div
			div.addEventListener("click", (event) => {
				// Focus input when cliking on global div
				if (me.readonly === "false") {
					input.focus();
				}
				event.stopPropagation();
			});
			div.addEventListener("keypress", (event) => {
				// Do nothing and disable event
				return;
			});
			// input
			["change", "input", "focus", "focusout", "blur", "keydown", "keyup"].forEach((evt) => {
				input.addEventListener(evt, (event) => {
					me.twoWayBinding(event.target);
					me.fireHandler(evt, event);
				});
			});
		}
	}
	twoWayBinding(elt) {
		// Disable update method
		this.ignoreChange = true;
		this.value = elt.value;
		this.ignoreChange = false;
	}
	onChange() {
		let me = this;
		if (me.disabled === "true") return;
		me.errormessage = me.required === "true" && !me.value ? `La donnée ${me.label} est obligatoire` : "";
		if (me.pattern && !me.errormessage) {
			if (!me.value || me.value.match(me.pattern)) {
				me.errormessage = "";
			} else if (me.format) {
				me.errormessage = `La donnée ${me.label} doit être au format ${me.format}`;
			} else {
				me.errormessage = `Erreur dans le format de la donnée ${me.label}`;
			}
		}
		if (!me.errormessage && me.value.length > me.maxlength) {
			me.errormessage = `La donnée ${me.label} ne doit pas dépasser ${me.maxlength} caractères`;
		}
	}
	template() {
		return `
			<div class="textfield-main flex-row v-align-items-center px-1 gap-x-1
				${this.cls}
				${this.filled === "true" ? "filled" : ""}"
			>
				${this.left ? this.left.outerHTML : ""}
				<span class="flex-col flex-1 v-align-item-end">
					${this.label ? `<label for="${this.key}">${this.label}</label>` : ""}
					<input id="${this.key}" ${this.name ? "name='" + this.name + "'" : ""}
						type="${this.type || "text"}"
						maxlength=${this.maxlength || 128}
						placeholder="."
						tabindex=${this.readonly === "true" || this.disabled === "true" ? "-1" : "0"}
						value="${this.value || ""}"
						${this.disabled === "true" ? "disabled" : ""}
						${this.readonly === "true" ? "readonly" : ""}
						${this.required === "true" ? "required" : ""}
						${this.pattern ? "pattern='" + this.pattern + "'" : ""}
						class="flex-1 ${this.cls}"
					/>
				</span>
				${this.right ? this.right.outerHTML : ""}
				${this.errormessage ? `<span class='error'>${this.errormessage}</span>` : ""}
			</div>
		`;
	}
	static style() {
		return `
			.textfield-main {
				background-color: transparent;
				height: 36px;
				width: 100%;
				border-radius: 8px;
				position: relative;
				border: 1px solid var(--secondary-shade5);
				box-sizing: border-box;
				cursor: text;
			}
			.textfield-main:has(label) {
				height: 48px;
			}
			.textfield-main.filled {
				background-color: var(--secondary-shade2);
				border-radius: 8px 8px 0 0;
				border: none;
				border-bottom: 1px solid var(--secondary-shade5);
			}
			.textfield-main.filled:hover {
				background-color: var(--secondary-shade3);
			}
			.textfield-main:not(.filled):hover {
				border-width: 2px;
			}
			.textfield-main.filled:focus-within {
				border-bottom: 2px solid var(--primary-shade0);
			}
			.textfield-main:not(.filled):focus-within {
				border: 2px solid var(--primary-shade0);
			}
			.textfield-main.filled:has(span.error),
			.textfield-main:not(.filled):has(span.error) {
				border-color: var(--status-error);
			}
			.textfield-main:has(span > input:disabled) {
				opacity: 0.5;
				cursor: not-allowed;
			}
			.textfield-main > span > input {
				font-size: 16px;
				box-sizing: border-box;
				border: none;
				outline: none;
				background: none;
				-moz-appearance: textfield;
				appearance: textfield;
				color: var(--dark-shade2);
				margin-bottom: 5px;
			}
			.textfield-main > span > input::-webkit-outer-spin-button,
			.textfield-main > span > input::-webkit-inner-spin-button {
				-webkit-appearance: none;
			}
			.textfield-main > span > input::placeholder {
				opacity: 0;
			}
			.textfield-main > span > input:read-only{
				pointer-events: none;
			}
			.textfield-main.disable > span > input {
				pointer-events: none;
			}
			.textfield-main > span > label {
				position: absolute;
				top: 50%;
				transform: translateY(-50%);
				font-size: 16px;
				color: var(--dark-shade0);
				transition: .2s ease-out;
				pointer-events: none;
				user-select: none;
			}
			.textfield-main:has(span > input:required) > span > label::after {
				content: "*";
				margin-left: 5px;
				color: var(--status-error)
			}
			.textfield-main:focus-within > span > label {
				color: var(--primary-shade0);
			}
			.textfield-main:focus-within > span > label,
			.textfield-main:has(span > input:not(:placeholder-shown)) > span >  label {
				top: 5px;
				transform: translateY(0);
				font-size: 12px; 
				font-weight: 500;
			}
			.textfield-main:has(span.error) *,
			.textfield-main:has(span.error) > span > label {
				color: var(--status-error);
			}
			.textfield-main:has(span.error) input {
				color: var(--dark-shade2);
			}
			.textfield-main .error {
				position: absolute;
				width: 100%;
				top: 100%;
				left: 0;
				transform: translateY(5px);
				font-size: 12px;
			}
		`;
	}
}
