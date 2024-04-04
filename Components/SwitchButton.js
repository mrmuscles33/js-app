import BaseElement from "./BaseElement.js";
import Events from "../Utils/Events.js";

export default class SwitchButton extends BaseElement {
	static attrs = [...BaseElement.attrs, "disabled", "checked"];
	static counter = 1;
	connectedCallback() {
		this.disabled = this.disabled || "false";
		this.checked = this.checked || "false";
		this.id = this.id || `switch-button-${SwitchButton.counter++}`;
		super.connectedCallback();
	}
	render() {
		// Dynamics variables
		let me = this;

		// The update methods breaks listeners and bindings
		super.render();

		// Listeners
		// input
		me.input = me.shadowRoot.querySelector("input");
		me.input.addEventListener("change", (event) => {
			me.twoWayBinding(event.target);
		});

		// Dispatch event to real component
		if(!this.disabled || this.disabled == "false") {
			me.dispatch(me.input, "change");
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
		return [
			`<div class="switch-main" ${this.disable == "true" ? "disable" : ""}>`,
			`	<input type="checkbox" id="${this.id}"`,
			`	${this.checked == "true" ? "checked" : ""} `,
			`	${this.name ? "name='" + this.name + "'" : ""} `,
			`	${this.value ? "value='" + this.value + "'" : ""} `,
			`	${this.disabled == "true" ? "disabled" : ""} />`,
			`	<label for=${this.id} class="switch-background">`,
			`		<div class="switch-button"></div>`,
			`	</label>`,
			`</div>`
		];
	}
	style() {
		return [
			...super.style(),
			`.switch-main {`,
            `    display: inline-block;`,
            `    user-select: none;`,
			`}`,
			`.switch-main.disable {`,
			`	opacity: .5;`,
			`}`,
			`input {`,
			`	opacity: 0;`,
			`	width: 0px;`,
			`	height: 0px;`,
			`	padding: 0px;`,
			`	margin: 0px;`,
			`}`,
			`.switch-background {`,
			`	width: 50px;`,
			`	height: 30px;`,
			`	border-radius: 50px;`,
			`	background-color: var(--color-primary);`,
			`	position: relative;`,
			`	display: inline-block;`,
			`	cursor: pointer;`,
			`	transition: background-color .3s;`,
			`}`,
			`.disable .switch-background {`,
			`	cursor: not-allowed;`,
			`}`,
			`input:focus ~ .switch-background,`,
			`.switch-main:hover .switch-background {`,
			`	background-color: var(--color-hover);`,
			`}`,
			`.switch-button {`,
			`	position: absolute;`,
			`	width: 24px;`,
			`	height: 24px;`,
			`	top: 3px;`,
			`	left: 3px;`,
			`	border-radius: 50px;`,
			`	background-color: var(--color-button);`,
			`	cursor: pointer;`,
			`	transition: left .3s;`,
			`}`,
			`.disable .switch-button {`,
			`	cursor: not-allowed;`,
			`}`,
			`input:checked ~ .switch-background {`,
			`	background-color: var(--color-checked);`,
			`}`,
			`input:checked:focus ~ .switch-background,`,
			`.switch-main:hover input:checked ~ .switch-background {`,
			`	background-color: var(--color-checked-hover);`,
			`}`,
			`input:checked ~ .switch-background .switch-button {`,
			`	left: 23px; `,
			`}`,
			this.styles || ""
		];
	}
}
