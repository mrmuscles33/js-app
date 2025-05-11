import BaseElement from "./BaseElement.js";
import Events from "../Utils/Events.js";

export default class Button extends BaseElement {
	static attrs = [...BaseElement.attrs, "text", "icon", "primary", "bordered", "disabled", "flex"];
	static selector = "amr-button";
	connectedCallback() {
		this.text = this.text || "";
		this.icon = this.icon || "";
		this.primary = this.primary || "false";
		this.bordered = this.bordered || "true";
		this.disabled = this.disabled || "false";
		this.left = Array.from(this.childNodes).find(node => node.nodeType === Node.ELEMENT_NODE && node.getAttribute("slot") == "left");
		this.right = Array.from(this.childNodes).find(node => node.nodeType === Node.ELEMENT_NODE && node.getAttribute("slot") == "right");
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
			<span id="${this.key}" 
				class="btn-main w-100 h-5 relative round-1 font-2 font-weight-500 px-1 gap-x-1 h-align-center v-align-items-center 
				${this.cls} 
			    ${this.primary == "true" ? "primary" : ""} 
			    ${this.bordered == "true" ? "border" : ""} 
			    ${this.disabled == "true" ? "disabled" : ""} 
			    role="button" 
			    tabindex=${this.disabled == "true" ? "-1" : "0"}
			>
				${this.left ? `<span class="absolute l-1">${this.left.outerHTML}</span>` : ""}
				${this.icon == "" ? "" : `<amr-icon class="font-3" value="${this.icon}"></amr-icon>`}
				${this.text == "" ? "" : `<span class="btn-label">${this.text}</span>`}
				${this.right ? `<span class="absolute r-1">${this.right.outerHTML}</span>` : ""}
			</span>
		`;
	}
	static style() {
		return `
			.btn-main {
			    color: var(--primary-shade3);
				background-color: transparent;
			    border: 1px solid transparent;
			    cursor: pointer;
			    user-select: none;
			    outline: none;
			    white-space: nowrap;
			}
			.btn-main:after {
				content: " ";
				display: block;
				position: absolute;
				top: 50%;
				left: 50%;
				width: calc(100% + 6px);
				height: calc(100% + 6px);
				border-radius: calc(0.5rem + 3px);
				border: 2px solid transparent;
				transform: translate(-50%, -50%);
			}
			.btn-main:not(.disabled):hover,
			.btn-main:focus-visible {
				background-color: var(--secondary-shade2);
			}
			.btn-main:focus-visible:after {
				border-color: var(--primary-shade0);
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
		`;
	}
}
