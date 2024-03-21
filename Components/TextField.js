import { BaseElement } from "./BaseElement.js";

export class TextField extends BaseElement {
	static attrs = [
		"value",
		"disabled",
		"width",
		"iconLeft",
		"iconRight",
		"label",
		"errormessage",
		"pattern",
		"required",
		"readonly",
		"type",
		"cls",
		"styles",
		"format",
		"filled",
		"flex",
		"maxlength",
	];
	connectedCallback() {
		this.filled = this.filled || true;
		this.width = this.width || 290;
		this.iconLeft = this.iconLeft || "";
		this.iconRight = this.iconRight || "";
		this.label = this.label || "";
		this.errormessage = this.errormessage || "";
		this.pattern = this.pattern || "";
		this.required = this.required || false;
		this.readonly = this.readonly || false;
		this.type = this.type || "text";
		this.cls = this.cls || "";
		this.styles = this.styles || "";
		this.format = this.format || "";
		this.maxlength = this.maxlength || 128;
		this.inputWidth = this.inputWidth || this.width;
		this.haserror = this.haserror || false;
		super.connectedCallback();
	}
	update() {
		// Variables dynamiques
		this.inputWidth = this.width - (this.iconLeft != "" ? 40 : 12) - (this.iconRight != "" ? 32 : 0) - 12;
		this.haserror = this.errormessage ? "true" : "false";

		// L'update modifie le innerHTML de l'élément shadowRoot qui casse les listeners et les bindings
		super.update();

		let input = this.shadowRoot.querySelector("input");

		// Two way binding
		input.addEventListener("change", (event) => {
			this.value = event.target.value;
		});

		// Listeners
		this.dispatch(input, "change");
	}
	template() {
		return `
        <div class="textfield-main ${this.cls} 
                ${this.iconLeft ? "textfield-icon-left" : ""} 
                ${this.iconRight ? "textfield-icon-right" : ""} 
                ${this.disabled === "true" ? "disable" : ""} 
                ${this.filled === "true" ? "filled" : ""} 
                ${this.flex === "true" ? "flex" : ""} 
                ${this.label ? "labelled" : ""} 
                ${this.haserror === "true" ? "textfield-error" : ""}
             ${this.styles ? `"style = ${this.styles}` : ""}">
            <input type="${this.type || "text"}"
                ${this.value ? `value="${this.value}"` : ""}
                ${this.disabled === "true" ? `disabled="true"` : ""}
                ${this.readonly === "true" ? `readonly="true"` : ""}
                ${this.required === "true" ? `required="true"` : ""}
                maxlength="${this.maxlength || 128}"
                ${this.pattern ? `pattern="${this.pattern}"` : ""}
                ${this.cls ? `class="${this.cls}"` : ""}
                ${this.styles ? `style="${this.styles}"` : ""}
            />
            ${this.label ? `<label>${this.label}</label>` : ""}
            ${this.iconLeft ? `<span class="textfield-icon textfield-icon-left material-icons-round">${this.iconLeft}</span>` : ""}
            ${this.iconRight ? `<span class="textfield-icon textfield-icon-right material-icons-round">${this.iconRight}</span>` : ""}
            ${this.haserror === "true" ? `<span class="textfield-error-msg">${this.errormessage}</span>` : ""}
        </div>`;
	}
	style() {
		return (
			super.style() +
			`
                .textfield-main {
                        --width: ${this.width}px; 
                        --width-input: calc(100% - ${this.iconLeft != "" ? 40 : 12}px - ${this.iconRight != "" ? 32 : 0}px - 12px);
                        vertical-align: top;
                        background-color: transparent;
                        display: inline-block;
                        height: 36px;
                        width: var(--width);
                        border-radius: 8px;
                        position: relative;
                        border: 1px solid var(--color);
                        box-sizing: border-box;
                        cursor: text;
                        margin: 0 5px 5px 0;
                }
                .textfield-main.flex {
                flex-grow: 1;
                        width: auto;
                }
                .textfield-main.labelled {
                        height: 48px;
                }
                .textfield-main.filled {
                        background-color: var(--color-backgroud);
                        border-radius: 8px 8px 0 0;
                        border: none;
                        border-bottom: 1px solid var(--color);
                }
                .textfield-main.filled:hover {
                        background-color: var(--color-backgroud-hover);
                }
                .textfield-main:not(.filled):hover {
                        border-width: 2px;
                }
                .textfield-main.filled:focus-within {
                        border-bottom: 2px solid var(--color-focus);
                }
                .textfield-main:not(.filled):focus-within {
                        border: 2px solid var(--color-focus);
                }
                .textfield-main.textfield-error.filled,
                .textfield-main.textfield-error:not(.filled) {
                        border-color: var(--color-error);
                        margin-bottom: 22px;
                }
                .textfield-main.disable {
                        opacity: 0.5;
                        cursor: not-allowed;
                }
                .textfield-main input {
                        position: absolute;
                        top: 50%;
                        transform: translateY(-50%);
                        left: 12px;
                        width: var(--width-input);
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
                }
                .textfield-main.labelled input {
                        top: 22px;
                        transform: translateY(0%);
                }
                .textfield-main input::-webkit-outer-spin-button,
                .textfield-main input::-webkit-inner-spin-button {
                        -webkit-appearance: none;
                }
                .textfield-main input::placeholder {
                        opacity: 0;
                }
                .textfield-main input:read-only{
                        pointer-events: none;
                }
                .textfield-main.disable input {
                        pointer-events: none;
                }
                .textfield-main label {
                        position: absolute;
                        top: 50%;
                        left: 12px;
                        transform: translateY(-50%);
                        font-size: 16px;
                        line-height: 20px;
                        color: var(--color);
                        transition: .2s ease-out;
                        pointer-events: none;
                        user-select: none;
                }
                .textfield-main input:required ~ label::after {
                        content: " *";
                        color: var(--color-error)
                }
                .textfield-main:focus-within label {
                        color: var(--color-focus);
                        top: 2px;
                        transform: translateY(0%);
                        font-weight: 500;
                        font-size: 12px;
                }
                .textfield-main.textfield-error label {
                        color: var(--color-error);
                }
                .textfield-main .textfield-icon-left input,
                .textfield-main .textfield-icon-left label {
                        left: 40px;
                }
                .textfield-main input:not(:placeholder-shown) ~ label {
                        top: 2px;
                        transform: translateY(0%);
                        font-size: 12px; 
                        font-weight: 500;
                }
                .textfield-main .textfield-icon {
                        position: absolute;
                        top: 50%;
                        font-size: 21px;
                        transform: translateY(-50%);
                        text-decoration: none;
                        user-select: none;
                        color: var(--color);
                }
                .textfield-main:focus-within .textfield-icon {
                        color: var(--color-focus);
                }
                .textfield-main.textfield-error .textfield-icon {
                        color: var(--color-error);
                }
                .textfield-main .textfield-icon .material-icons-round {
                        font-size: 21px;
                }
                .textfield-main .textfield-main.labelled .textfield-icon {
                        font-size: 24px;
                }
                .textfield-main .textfield-icon.textfield-icon-left {
                        left: 12px;
                }
                .textfield-main .textfield-icon.textfield-icon-right {
                cursor: pointer;
                        right: 12px;
                }
                .textfield-main .textfield-error-msg {
                        position: absolute;
                        top: 100%;
                        transform: translateY(5px);
                        font-size: 12px;
                        color: var(--color-error);
                }
        `
		);
	}
}
