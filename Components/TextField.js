import BaseElement from "./BaseElement.js";
import Events from "../Utils/Events.js";

export default class TextField extends BaseElement {
	static attrs = [
		...BaseElement.attrs,
		"value",
		"disabled",
		"width",
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
		this.width = this.width || 290;
		this.iconleft = this.iconleft || "";
		this.iconright = this.iconright || "";
		this.label = this.label || "";
		this.errormessage = this.errormessage || "";
		this.pattern = this.pattern || "";
		this.required = this.required || "false";
		this.readonly = this.readonly || "false";
		this.type = this.type || "text";
		this.cls = this.cls || "";
		this.styles = this.styles || "";
		this.format = this.format || "";
		this.filled = this.filled || "true";
		this.flex = this.flex || "false";
		this.maxlength = this.maxlength || 128;
		this.id = this.id || `text-field-${TextField.counter++}`;
		super.connectedCallback();
	}
	render() {
		// Dynamics variables
		let me = this;
		me.inputWidth = me.width - (me.iconleft != "" ? 40 : 12) - (me.iconright != "" ? 32 : 0) - 12;
		me.haserror = me.errormessage ? "true" : "false";

		// The update methods breaks listeners and bindings
		super.render();
		me.div = me.shadowRoot.querySelector("div");
		me.input = me.shadowRoot.querySelector("input");
		me.icon = me.shadowRoot.querySelector("span.textfield-icon-right");

		// Listeners
		if (!this.disabled || this.disabled == "false") {
			// div
			me.div.addEventListener("click", (event) => {
				// Focus input when cliking on global div
				if (me.readonly === "false") {
					me.input.focus();
				}
				event.stopPropagation();
			});
			me.div.addEventListener("keypress", (event) => {
				// Do nothing and disable event
				return;
			});
			// icon
			if (me.icon) {
				me.icon.addEventListener("click", (event) => {
					me.fireHandler("click", event);
					event.stopPropagation();
				});
				me.icon.addEventListener("keydown", (event) => {
					// On Enter trigger click
					if (Events.isEnter(event)) {
						me.fireHandler("click", event);
						Events.dispatch(me, "click", event, me.getDetail());
					}
					event.stopPropagation();
				});
			}
			// input
			["change", "input", "focus", "focusout", "blur", "keydown", "keyup"].forEach((evt) => {
				me.input.addEventListener(evt, (event) => {
					me.twoWayBinding(event.target);
					me.fireHandler(evt, event);
				});
			});

			// Dispatch event to real component
			if (me.icon) {
				me.dispatch(me.icon, "click");
			}
			me.dispatch(me.input, "change");
			me.dispatch(me.input, "input");
			me.dispatch(me.input, "focus");
			me.dispatch(me.input, "blur");
			me.dispatch(me.input, "keydown");
			me.dispatch(me.input, "keyup");
		}
	}
	twoWayBinding(elt) {
		// Disable update method
		this.ignoreChange = true;
		this.value = elt.value;
		this.ignoreChange = false;
	}
	onChange(event) {
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
		return [
			`<div class="textfield-main ${this.cls}`,
			`	${this.iconleft ? "textfield-icon-left" : ""}`,
			`	${this.iconright ? "textfield-icon-right" : ""}`,
			`	${this.disabled === "true" ? "disable" : ""}`,
			`	${this.filled === "true" ? "filled" : ""}`,
			`	${this.flex === "true" ? "flex" : ""}`,
			`	${this.label ? "labelled" : ""}`,
			`	${this.haserror === "true" ? "textfield-error" : ""}">`,
			`	<input id="${this.id}" ${this.name ? "name='" + this.name + "'" : ""}`,
			`		type="${this.type || "text"}"`,
			`		maxlength=${this.maxlength || 128}`,
			`		placeholder="."`,
			`		tabindex=${this.readonly === "true" || this.disabled === "true" ? "-1" : "0"}`,
			`		value="${this.value || ""}"`,
			`		${this.disabled === "true" ? "disabled" : ""}`,
			`		${this.readonly === "true" ? "readonly" : ""}`,
			`		${this.required === "true" ? "required" : ""}`,
			`		${this.pattern ? "pattern='" + this.pattern + "'" : ""}`,
			`		${this.cls ? "class='" + this.cls + "'" : ""}`,
			`	/>`,
			`	${this.label ? "<label>" + this.label + "</label>" : ""}`,
			`	${this.iconleft ? "<span class='textfield-icon textfield-icon-left material-icons-round'>" + this.iconleft + "</span>" : ""}`,
			`	${
				this.iconright
					? "<span class='textfield-icon textfield-icon-right material-icons-round' role='button' tabindex='0'>" +
					  this.iconright +
					  "</span>"
					: ""
			}`,
			`	${this.haserror === "true" ? "<span class='textfield-error-msg'>" + this.errormessage + "</span>" : ""}`,
			`</div>`,
		];
	}
	style() {
		return [
			...super.style(),
			`.textfield-main {`,
			`	--width: ${this.width}px;`,
			`	--width-input: calc(100% - ${this.iconleft != "" ? 40 : 12}px - ${this.iconright != "" ? 32 : 0}px - 12px);`,
			`	vertical-align: top;`,
			`	background-color: transparent;`,
			`	display: inline-block;`,
			`	height: 36px;`,
			`	width: var(--width);`,
			`	border-radius: 8px;`,
			`	position: relative;`,
			`	border: 1px solid var(--color);`,
			`	box-sizing: border-box;`,
			`	cursor: text;`,
			`	margin: 0 5px 5px 0;`,
			`}`,
			`.textfield-main.flex {`,
			`	flex-grow: 1;`,
			`	width: auto;`,
			`}`,
			`.textfield-main.labelled {`,
			`	height: 48px;`,
			`}`,
			`.textfield-main.filled {`,
			`	background-color: var(--color-backgroud);`,
			`	border-radius: 8px 8px 0 0;`,
			`	border: none;`,
			`	border-bottom: 1px solid var(--color);`,
			`}`,
			`.textfield-main.filled:hover {`,
			`	background-color: var(--color-backgroud-hover);`,
			`}`,
			`.textfield-main:not(.filled):hover {`,
			`	border-width: 2px;`,
			`}`,
			`.textfield-main.filled:focus-within {`,
			`	border-bottom: 2px solid var(--color-focus);`,
			`}`,
			`.textfield-main:not(.filled):focus-within {`,
			`	border: 2px solid var(--color-focus);`,
			`}`,
			`.textfield-main.textfield-error.filled,`,
			`.textfield-main.textfield-error:not(.filled) {`,
			`	border-color: var(--color-error);`,
			`	margin-bottom: 22px;`,
			`}`,
			`.textfield-main.disable {`,
			`	opacity: 0.5;`,
			`	cursor: not-allowed;`,
			`}`,
			`.textfield-main input {`,
			`	position: absolute;`,
			`	top: 50%;`,
			`	transform: translateY(-50%);`,
			`	left: 12px;`,
			`	width: var(--width-input);`,
			`	height: 20px;`,
			`	font-size: 16px;`,
			`	padding: 0;`,
			`	margin: 0;`,
			`	box-sizing: border-box;`,
			`	border: none;`,
			`	outline: none;`,
			`	background: none;`,
			`	-moz-appearance: textfield;`,
			`	appearance: textfield;`,
			`}`,
			`.textfield-main.labelled input {`,
			`	top: 22px;`,
			`	transform: translateY(0%);`,
			`}`,
			`.textfield-main input::-webkit-outer-spin-button,`,
			`.textfield-main input::-webkit-inner-spin-button {`,
			`	-webkit-appearance: none;`,
			`}`,
			`.textfield-main input::placeholder {`,
			`	opacity: 0;`,
			`}`,
			`.textfield-main input:read-only{`,
			`	pointer-events: none;`,
			`}`,
			`.textfield-main.disable input {`,
			`	pointer-events: none;`,
			`}`,
			`.textfield-main label {`,
			`	position: absolute;`,
			`	top: 50%;`,
			`	left: 12px;`,
			`	transform: translateY(-50%);`,
			`	font-size: 16px;`,
			`	line-height: 20px;`,
			`	color: var(--color);`,
			`	transition: .2s ease-out;`,
			`	pointer-events: none;`,
			`	user-select: none;`,
			`}`,
			`.textfield-main input:required ~ label::after {`,
			`	content: " *";`,
			`	color: var(--color-error)`,
			`}`,
			`.textfield-main:focus-within label {`,
			`	color: var(--color-focus);`,
			`	top: 2px;`,
			`	transform: translateY(0%);`,
			`	font-weight: 500;`,
			`	font-size: 12px;`,
			`}`,
			`.textfield-main.textfield-error label {`,
			`	color: var(--color-error);`,
			`}`,
			`.textfield-main.textfield-icon-left input,`,
			`.textfield-main.textfield-icon-left label {`,
			`	left: 40px;`,
			`}`,
			`.textfield-main input:not(:placeholder-shown) ~ label {`,
			`	top: 2px;`,
			`	transform: translateY(0%);`,
			`	font-size: 12px; `,
			`	font-weight: 500;`,
			`}`,
			`.textfield-main .textfield-icon {`,
			`	position: absolute;`,
			`	top: 50%;`,
			`	font-size: 21px;`,
			`	transform: translateY(-50%);`,
			`	text-decoration: none;`,
			`	user-select: none;`,
			`	color: var(--color);`,
			`}`,
			`.textfield-main:focus-within .textfield-icon {`,
			`	color: var(--color-focus);`,
			`}`,
			`.textfield-main.textfield-error .textfield-icon {`,
			`	color: var(--color-error);`,
			`}`,
			`.textfield-main .textfield-icon .material-icons-round {`,
			`	font-size: 21px;`,
			`}`,
			`.textfield-main .textfield-main.labelled .textfield-icon {`,
			`	font-size: 24px;`,
			`}`,
			`.textfield-main .textfield-icon.textfield-icon-left {`,
			`	left: 12px;`,
			`}`,
			`.textfield-main .textfield-icon.textfield-icon-right {`,
			`cursor: pointer;`,
			`	right: 12px;`,
			`}`,
			`.textfield-main .textfield-error-msg {`,
			`	position: absolute;`,
			`	top: 100%;`,
			`	transform: translateY(5px);`,
			`	font-size: 12px;`,
			`	color: var(--color-error);`,
			`}`,
			this.styles || "",
		];
	}
}
