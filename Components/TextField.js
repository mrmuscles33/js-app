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
		"size"
	];
	static counter = 1;
	connectedCallback() {
		this.value = this.value || "";
		this.disabled = this.disabled || "false";
		this.iconleft = this.iconleft || "";
		this.iconright = this.iconright || "";
		this.label = this.label || "";
		this.errormessage = this.errormessage || "";
		this.pattern = this.pattern || "";
		this.required = this.required || "false";
		this.readonly = this.readonly || "false";
		this.type = this.type || "text";
		this.format = this.format || "";
		this.filled = this.filled || "true";
		this.flex = this.flex || "false";
		this.maxlength = this.maxlength || 128;
		this.key = this.key || `amr-text-${TextField.counter++}`;
		this.size = this.size || "medium";
		super.connectedCallback();
	}
	render() {
		// Dynamics variables
		let me = this;

		// The update methods breaks listeners and bindings
		super.render();
		let div = me.querySelector("div");
		let input = me.querySelector("input");
		let icon = me.querySelector("amr-icon.right");

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
			// icon
			if (icon) {
				icon.onClick = (event) => {
					me.fireHandler("click", event);
					event.stopPropagation();
				};
				icon.onKeydown = (event) => {
					// On Enter trigger click
					if (Events.isEnter(event) || Events.isSpace(event)) {
						me.fireHandler("click", event);
					}
					event.stopPropagation();
				};
			}
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
			<div class="textfield-main ${this.size} ${this.cls}
				${this.filled === "true" ? "filled" : ""}
				${this.flex === "true" ? "flex" : ""}"
			>
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
					${this.cls ? "class='" + this.cls + "'" : ""}
				/>
				${this.label ? `<label for="${this.key}">${this.label}</label>` : ""}
				${this.iconleft ? `<amr-icon class="left" value="${this.iconleft}"></amr-icon>` : ""}
				${this.iconright ? `<amr-icon class="right" action="true" value="${this.iconright}"></amr-icon>` : ""}
				${this.errormessage ? `<span class='error'>${this.errormessage}</span>` : ""}
			</div>
		`;
	}
	static style() {
		return `
			.textfield-main {
				vertical-align: middle;
				background-color: transparent;
				display: inline-block;
				height: 36px;
				width: 300px;
				border-radius: 8px;
				position: relative;
				border: 1px solid var(--secondary-shade5);
				box-sizing: border-box;
				cursor: text;
				margin: 0 5px 5px 0;
				padding: 6px 12px;
			}
			.textfield-main.small {
				width: 150px;
			}
			.textfield-main.medium {
				width: 300px;
			}
			.textfield-main.large {
				width: 450px;
			}
			.textfield-main:has(> amr-icon.left) {
				padding-left: 40px;
			}
			.textfield-main:has(> amr-icon.right) {
				padding-right: 40px;
			}
			.textfield-main.flex {
				flex-grow: 1;
				width: auto;
			}
			.textfield-main:has(label) {
				height: 48px;
				padding-top: 20px;
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
				margin-bottom: 22px;
				transform: translateY(9px);
			}
			.textfield-main:has(input:disabled) {
				opacity: 0.5;
				cursor: not-allowed;
			}
			.textfield-main > input {
				width: 100%;
				height: 20px;
				font-size: 16px;
				padding: 0;
				margin: 0;
				box-sizing: border-box;
				border: none;
				outline: none;
				background: none;
				-moz-appearance: textfield;
				appearance: textfield;
				color: var(--dark-shade2);
			}
			.textfield-main:has(label) > input {
				top: 22px;
				transform: translateY(0%);
			}
			.textfield-main > input::-webkit-outer-spin-button,
			.textfield-main > input::-webkit-inner-spin-button {
				-webkit-appearance: none;
			}
			.textfield-main > input::placeholder {
				opacity: 0;
			}
			.textfield-main > input:read-only{
				pointer-events: none;
			}
			.textfield-main.disable > input {
				pointer-events: none;
			}
			.textfield-main > label {
				position: absolute;
				top: 50%;
				left: 12px;
				transform: translateY(-50%);
				font-size: 16px;
				line-height: 20px;
				color: var(--dark-shade0);
				transition: .2s ease-out;
				pointer-events: none;
				user-select: none;
			}
			.textfield-main > input:required ~ label::after {
				content: " *";
				color: var(--status-error)
			}
			.textfield-main:focus-within > label {
				color: var(--primary-shade0);
				top: 2px;
				transform: translateY(0%);
				font-weight: 500;
				font-size: 12px;
			}
			.textfield-main:has(span.error) > label {
				color: var(--status-error);
			}
			.textfield-main:has(amr-icon.left) > input,
			.textfield-main:has(amr-icon.left) > label {
				left: 40px;
			}
			.textfield-main input:not(:placeholder-shown) ~ label {
				top: 2px;
				transform: translateY(0%);
				font-size: 12px; 
				font-weight: 500;
			}
			.textfield-main > amr-icon {
				position: absolute;
				top: 50%;
				font-size: 21px;
				transform: translateY(-50%);
				text-decoration: none;
				user-select: none;
				color: var(--dark-shade0);
			}
			.textfield-main:focus-within > amr-icon {
				color: var(--primary-shade0);
			}
			.textfield-main:has(span.error) > amr-icon {
				color: var(--status-error);
			}
			.textfield-main > amr-icon {
				font-size: 21px;
			}
			.textfield-main > amr-icon.left {
				left: 12px;
			}
			.textfield-main > amr-icon.right {
			cursor: pointer;
				right: 12px;
			}
			.textfield-main .error {
				position: absolute;
				width: 100%;
				top: 100%;
				left: 0;
				transform: translateY(5px);
				font-size: 12px;
				color: var(--status-error);
			}
		`;
	}
}
