import BaseElement from "./BaseElement.js";

export default class Switch extends BaseElement {
	static attrs = [...BaseElement.attrs, "disabled", "checked"];
	static selector = "amr-switch";
	connectedCallback() {
		this.disabled = this.disabled || "false";
		this.checked = this.checked || "false";
		super.connectedCallback();
	}
	render() {
		// Dynamics variables
		let me = this;

		// The update methods breaks listeners and bindings
		super.render();

		// Listeners
		// input
		let input = me.querySelector("input");
		if(me.disabled == "false") {
			input.addEventListener("change", (event) => {
				me.twoWayBinding(event.target);
				me.fireHandler("change", event);
			});
		}
	}
	twoWayBinding(elt) {
		let me = this;
		me.ignoreChange = true;
		me.checked = elt.checked;
		me.ignoreChange = false;
		// Wait for animation to finish
		setTimeout(() => {
			me.render();
		}, 300);
	}
	template() {
		return `
			<div role="switch" class="switch-main">
				<input type="checkbox" id="${this.key}"
					class="absolute t-0 l-0 w-0 h-0 p-0 m-0"
					${this.checked == "true" ? "checked" : ""} 
					${this.name ? "name='" + this.name + "'" : ""} 
					${this.value ? "value='" + this.value + "'" : ""} 
					${this.disabled == "true" ? "disabled" : ""} 
				/>
				<label for="${this.key}" class="switch-background round-10 h-5 w-8">
					<div class="switch-button round-10 ratio-1"></div>
				</label>
			</div>
		`;
	}
	static style() {
		return `
			.switch-main {
                user-select: none;
			}
			.switch-main:has(input:disabled) {
				opacity: .5;
			}
			.switch-main > input {
				opacity: 0;
			}
			.switch-main > label.switch-background {
				background-color: var(--secondary-shade3);
				position: relative;
				display: block;
				cursor: pointer;
				transition: background-color .3s;
			}
			.switch-main > label.switch-background:after {
				content: " ";
				border-radius: 50px;
				border: 2px solid transparent;
				width: calc(100% + 4px);
				height: calc(100% + 4px);
				display: block;
				position: absolute;
				top: 50%;
				left: 50%;
				transform: translate(-50%, -50%);
			}
			.switch-main.disable > label.switch-background {
				cursor: not-allowed;
			}
			.switch-main:hover > label.switch-background,
			.switch-main > input:focus-visible + .switch-background {
				background-color: var(--secondary-shade5);
			}
			.switch-main > input:focus-visible + label.switch-background:after {
				border-color: var(--secondary-shade5);
			}
			.switch-main > input:checked:focus-visible + label.switch-background:after {
				border-color: var(--primary-shade0);
			}
			.switch-main > label > .switch-button {
				position: absolute;
				height: calc(100% - 6px);
				top: 3px;
				left: 3px;
				border-radius: 50px;
				background-color: var(--secondary-shade1);
				cursor: pointer;
				transition: left .3s, transform .3s;
			}
			.switch-main.disable > label > .switch-button {
				cursor: not-allowed;
			}
			.switch-main > input:checked + .switch-background {
				background-color: var(--primary-shade3);
			}
			.switch-main > input:checked:focus-visible + .switch-background,
			.switch-main:hover > input:checked + .switch-background {
				background-color: var(--primary-shade0);
			}
			.switch-main > input:checked + .switch-background .switch-button {
				left: calc(100% - 3px);
				transform: translate(-100%, 0%);
			}
		`;
	}
}
