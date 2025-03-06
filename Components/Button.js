import BaseElement from "./BaseElement.js";
import Events from "../Utils/Events.js";

export default class Button extends BaseElement {
	static attrs = [...BaseElement.attrs, "text", "icon", "primary", "bordered", "disabled", "flex"];
	static counter = 1;
	connectedCallback() {
		this.text = this.text || "";
		this.icon = this.icon || "";
		this.primary = this.primary || "false";
		this.bordered = this.bordered || "true";
		this.disabled = this.disabled || "false";
		this.flex = this.flex || "false";
		this.key = this.key || `button-${Button.counter++}`;
		super.connectedCallback();
	}
	render() {
		// Dynamics variables
		let me = this;

		// The update methods breaks listeners and bindings
		super.render();

		if (me.disabled == "false") {
			let button = me.querySelector(".btn-main");
			button.addEventListener("keydown", (event) => {
				if (Events.isEnter(event) || Events.isSpace(event)) {
					me.fireHandler("click", event);
					event.preventDefault();
					event.stopPropagation();
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
			    padding: 0 12px;
			    margin: 0 5px 5px 0;
			    height: 36px;
			    color: var(--primary-shade3);
				background-color: transparent;
			    border: 1px solid transparent;
			    border-radius: 5px;
			    display: inline-block;
			    line-height: 32px;
			    cursor: pointer;
			    font-weight: 500;
			    user-select: none;
			    outline: none;
			    white-space: nowrap;
				font-size: 14px;
			}
			.btn-main:not(.disabled):hover,
			.btn-main:focus-visible {
				background-color: var(--secondary-shade2);
			}
			.btn-main.disabled {
				cursor: not-allowed;
				opacity: .5;
			}
			.btn-main:not(.primary).border {
				border-color: var(--secondary-shade3);
			}
			.btn-main.primary {
				background-color: var(--primary-shade3);
				color: var(--light-shade0);
			}
			.btn-main.primary:hover,
			.btn-main.primary:focus-visible {
				background-color: var(--primary-shade0);
			}
			.btn-main.flex {
				width: 100%;
				text-align: center;
				box-sizing: border-box;
			}
			.btn-main:has(> .btn-text:empty) > .btn-with-icon {
				padding: 0 12px;
			}
			.btn-main:has(> .btn-text:not(:empty)) > .btn-with-icon {
				padding: 0 16px 0 12px;
			}
			.btn-main > .btn-icon {
				font-size: inherit;
				vertical-align: middle;
				margin: 0;
				padding: 0;
				color: var(--primary-shade3);
			}
			.btn-main.primary > .btn-icon {
				color: var(--light-shade0);
			}
			.btn-main > .btn-text {
				letter-spacing: .7px;
				margin: 0;
				padding: 0;
				vertical-align: middle;
			}
		`;
	}
}
