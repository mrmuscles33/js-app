import BaseElement from "./BaseElement.js";
import Events from "../Utils/Events.js";

export default class ButtonCustom extends BaseElement {
	static attrs = [...BaseElement.attrs, "text", "icon", "primary", "bordered", "disabled", "flex"];
	static counter = 1;
	connectedCallback() {
		this.text = this.text || "";
		this.icon = this.icon || "";
		this.primary = this.primary || "false";
		this.bordered = this.bordered || "true";
		this.disabled = this.disabled || "false";
		this.flex = this.flex || "false";
		this.key = this.key || `button-${ButtonCustom.counter++}`;
		super.connectedCallback();
	}
	render() {
		// Dynamics variables
		let me = this;

		// The update methods breaks listeners and bindings
		super.render();

		if (me.disabled == "false") {
			let button = me.querySelector(".btn-main");
			button.addEventListener("keyup", (event) => {
				if (Events.isEnter(event) || Events.isSpace(event)) {
					me.fireHandler("click", event);
				}
			});
			button.addEventListener("click", (event) => me.fireHandler("click", event));
		}
	}
	template() {
		return `
			<span id="${this.key}" class="btn-main ${this.cls} 
			    ${this.icon ? "btn-with-icon" : ""} 
			    ${this.primary == "true" ? "primary" : ""} 
			    ${this.bordered == "true" ? "border" : ""} 
			    ${this.disabled == "true" ? "disabled" : ""} 
			    ${this.flex == "true" ? "flex" : ""}" 
			    role="button" 
			    tabindex=${this.disabled == "true" ? "-1" : "0"}
			>
				${this.icon && this.icon != "" ? `<span class="btn-icon material-icons-round" role="presentation">${this.icon}</span>` : ""}
				<span class="btn-text">${this.text}</span>
			</span>
		`;
	}
	static style() {
		return `
			.btn-main {
			    padding: 0 16px;
			    margin: 0 5px 5px 0;
			    height: 36px;
			    color: var(--color-font);
			    border: 1px solid transparent;
			    border-radius: 5px;
			    display: inline-block;
			    line-height: 32px;
			    cursor: pointer;
			    font-weight: 500;
			    user-select: none;
			    text-decoration: none;
			    outline: none;
			    white-space: nowrap;
			    overflow: hidden;
			    text-overflow: ellipsis;
			}
			.btn-main.disabled {
				cursor: not-allowed;
				opacity: .5;
			}
			.btn-main.primary {
				background-color: var(--color-primary);
			}
			.btn-main.border {
				border-color: var(--color-primary);
			}
			.btn-main:hover,
			.btn-main:focus-visible {
				background-color: var(--color-hover);
			}
			.btn-main.primary:hover,
			.btn-main.primary:focus-visible {
				border-color: var(--color-hover);
			}
			.btn-main.flex {
				width: 100%;
				text-align: center;
				box-sizing: border-box;
			}
			.btn-main:has(.btn-text:empty).btn-with-icon {
				padding: 0 12px;
			}
			.btn-main:has(.btn-text:not(:empty)).btn-with-icon {
				padding: 0 16px 0 12px;
			}
			.btn-icon {
				font-size: inherit;
				vertical-align: middle;
				margin: 0;
				padding: 0;
			}
			.btn-text {
				letter-spacing: .7px;
				margin: 0;
				padding: 0;
				vertical-align: middle;
			}
		`;
	}
}
