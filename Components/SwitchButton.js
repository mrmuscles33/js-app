import BaseElement from "./BaseElement.js";

export default class SwitchButton extends BaseElement {
	static attrs = [...BaseElement.attrs, "disabled", "checked"];
	static counter = 1;
	connectedCallback() {
		this.disabled = this.disabled || "false";
		this.checked = this.checked || "false";
		this.key = this.key || `switch-button-${SwitchButton.counter++}`;
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
			<div class="switch-main" ${this.disable == "true" ? "disable" : ""}>
				<input type="checkbox" id="${this.key}"
				${this.checked == "true" ? "checked" : ""} 
				${this.name ? "name='" + this.name + "'" : ""} 
				${this.value ? "value='" + this.value + "'" : ""} 
				${this.disabled == "true" ? "disabled" : ""} />
				<label for=${this.key} class="switch-background">
					<div class="switch-button"></div>
				</label>
			</div
		`;
	}
	static style() {
		return `
			.switch-main {
                display: inline-block;
                user-select: none;
			}
			.switch-main.disable {
				opacity: .5;
			}
			.switch-main > input {
				opacity: 0;
				width: 0px;
				height: 0px;
				padding: 0px;
				margin: 0px;
			}
			.switch-main > label.switch-background {
				width: 50px;
				height: 30px;
				border-radius: 50px;
				background-color: var(--color-primary);
				position: relative;
				display: inline-block;
				cursor: pointer;
				transition: background-color .3s;
			}
			.switch-main > label.switch-background:after {
				content: " ";
				border-radius: 50px;
				border: 2px solid transparent;
				width: 54px;
				height: 34px;
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
				background-color: var(--color-hover);
			}
			.switch-main > input:focus-visible + label.switch-background:after {
				border-color: var(--color-hover);
			}
			.switch-main > input:checked:focus-visible + label.switch-background:after {
				border-color: var(--color-checked-hover);
			}
			.switch-main > label > .switch-button {
				position: absolute;
				width: 24px;
				height: 24px;
				top: 3px;
				left: 3px;
				border-radius: 50px;
				background-color: var(--color-button);
				cursor: pointer;
				transition: left .3s;
			}
			.switch-main.disable > label > .switch-button {
				cursor: not-allowed;
			}
			.switch-main > input:checked + .switch-background {
				background-color: var(--color-checked);
			}
			.switch-main > input:checked:focus-visible + .switch-background,
			.switch-main:hover > input:checked + .switch-background {
				background-color: var(--color-checked-hover);
			}
			.switch-main > input:checked + .switch-background .switch-button {
				left: 23px; 
			}
		`;
	}
}
