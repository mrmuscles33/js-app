import BaseElement from "./BaseElement.js";

export default class RadioCustom extends BaseElement {
	static attrs = [...BaseElement.attrs, "label", "checked", "value", "disabled"];
	static counter = 1;
	connectedCallback() {
		this.label = this.label || "";
		this.checked = this.checked || "false";
		this.value = this.value || "";
		this.disabled = this.disabled || "false";
		this.id = this.id || `radio-${RadioCustom.counter++}`;
		super.connectedCallback();
	}
	update() {
		// Dynamics variables
		let me = this;

		// The update methods breaks listeners and bindings
		super.update();

		// Listeners
		// input
		me.input = me.shadowRoot.querySelector("input");
		me.input.addEventListener("change", (event) => {
			me.twoWayBinding(event.target);
			me.fireHandler("change", event);
		});

		// Dispatch event to real component
		if(!this.disabled || this.disabled == "false") {
			me.dispatch(me.input, "change");
		}
	}
	twoWayBinding(elt) {
		this.checked = elt.checked;
	}
	onChange(event) {
		alert('toto');
	}
	template() {
		return [
			`<input type="radio" `,
			`	id="${this.id}" `,
			`	${this.checked == "true" ? "checked" : ""} `,
			`	${this.name ? "name='" + this.name + "'" : ""} `,
			`	${this.value ? "value='" + this.value + "'" : ""} `,
			`	${this.disabled == "true" ? "disabled" : ""}`,
			`>`,
			`<label `,
			`	class="radio-main"`,
			`	for=${this.id}`,
			`>`,
			`	<span class="material-icons-round" role="presentation">${this.checked == "true" ? "radio_button_checked" : "radio_button_unchecked"}</span>`,
			`	<span>${this.label}</span>`,
			`</label>`
		];
	}
	style() {
		return [
			...super.style(),
			`input {`,
            `    opacity: 0;`,
            `    width: 0px;`,
            `    height: 0px;`,
            `    padding: 0px;`,
            `    margin: 0px;`,
            `    position: absolute;`,
			`}`,
			`.radio-main {`,
			`	margin:         10px 5px 10px 0;`,
			`	padding:        0;`,
			`	cursor:         pointer;`,
			`	user-select:    none;`,
			`	display:        inline-flex;`,
			`	vertical-align: middle;`,
			`	white-space:    nowrap;`,
			`	color:          var(--color-font);`,
			`}`,
			`input:disabled + .radio-main {`,
			`	cursor: not-allowed;`,
			`	opacity: .5;`,
			`}`,
			`.radio-main span {`,
			`	vertical-align: middle;`,
			`}`,
			`.radio-main .material-icons-round {`,
			`	color: var(--color-primary);`,
			`	margin-right: 5px;`,
			`}`,
			`input:checked + .radio-main .material-icons-round {`,
			`	color: var(--color-checked);`,
			`}`,
			`input:focus + .radio-main .material-icons-round,`,
			`.radio-main:hover .material-icons-round {`,
			`	color: var(--color-hover);`,
			`}`,
			`input:checked:focus + .radio-main .material-icons-round,`,
			`input:checked + .radio-main:hover .material-icons-round {`,
			`	color: var(--color-checked-hover);`,
			`}`,
			`input:checked:focus + .radio-main .material-icons-round {`,
			`	box-shadow: inset 0px 0px 0 1px var(--color-checked-hover), 0px 0px 0px 1px var(--color-checked-hover);`,
			`	padding-right: 1px;`,
			`	border-radius: 50px;`,
			`}`,
			`input:focus + .radio-main .material-icons-round {`,
			`	box-shadow: inset 0px 0px 0 1px var(--color-hover), 0px 0px 0px 1px var(--color-hover);`,
			`	padding-right: 1px;`,
			`	border-radius: 50px;`,
			`}`,
			this.styles || "",
		];
	}
}
