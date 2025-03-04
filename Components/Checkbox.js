import BaseElement from "./BaseElement.js";

export default class Checkbox extends BaseElement {
	static attrs = [...BaseElement.attrs, "label", "checked", "value", "disabled"];
	static counter = 1;
	constructor() {
		super();
		this.key = this.key || `checkbox-${Checkbox.counter++}`;
	}
	connectedCallback() {
		this.label = this.label || "";
		this.checked = this.checked || "false";
		this.value = this.value || "";
		this.disabled = this.disabled || "false";
		super.connectedCallback();
	}
	render() {
		// Dynamics variables
		let me = this;

		// The update methods breaks listeners and bindings
		super.render();

		// Listeners
		// input
		if(me.disabled == "false") {
			me.querySelector("input").addEventListener("change", (event) => {
				me.twoWayBinding(event.target);
				me.fireHandler("change", event);
			});
		}
	}
	twoWayBinding(elt) {
		this.checked = elt.checked;
	}
	template() {
		return `
			<span class="checkbox-main ${this.cls || ""}" >
				<input type="checkbox" 
					id="${this.key}" 
					${this.checked == "true" ? "checked" : ""} 
					${this.name == "" ? "" :  "name='" + this.name + "'"} 
					${this.value == "" ? "" : "value='" + this.value + "'"} 
					${this.disabled == "true" ? "disabled" : ""}
				/>
				<label for="${this.key}" >
					<span class="material-icons-round" role="presentation">${this.checked == "true" ? "check_box" : "check_box_outline_blank"}</span>
					<span>${this.label}</span>
				</label>
			</span>
		`;
	}
	static style() {
		return `
			.checkbox-main > input {
			    opacity: 0;
			    width: 0px;
			    height: 0px;
			    padding: 0px;
			    margin: 0px;
			    position: absolute;
			}
			.checkbox-main > label {
				margin:         10px 5px 10px 0;
				padding:        0;
				cursor:         pointer;
				user-select:    none;
				display:        inline-flex;
				vertical-align: middle;
				white-space:    nowrap;
				color:          var(--color-font);
			}
			.checkbox-main > input:disabled + label {
				cursor: not-allowed;
				opacity: .5;
			}
			.checkbox-main > label > span {
				vertical-align: middle;
			}
			.checkbox-main > label > span.material-icons-round {
				color: var(--color-primary);
				margin-right: 5px;
				position: relative;
				font-size: 24px;
			}
			.checkbox-main > label > span.material-icons-round:after {
				content: " ";
				border-radius: 3px;
				border: 2px solid transparent;
				width: 22px;
				height: 22px;
				display: block;
				position: absolute;
				top: 50%;
				left: 50%;
				transform: translate(-50%, -50%);
			}
			.checkbox-main > input:checked + label > span.material-icons-round {
				color: var(--color-checked);
			}
			.checkbox-main > input:focus-visible + label > span.material-icons-round,
			.checkbox-main > label:hover > span.material-icons-round {
				color: var(--color-hover);
			}
			.checkbox-main > input:checked:focus-visible + label > span.material-icons-round,
			.checkbox-main > input:checked + label:hover > span.material-icons-round {
				color: var(--color-checked-hover);
			}
			.checkbox-main > input:checked:focus-visible + label > span.material-icons-round:after {
				border-color: var(--color-checked-hover);
			}
			.checkbox-main input:focus-visible + label > span.material-icons-round:after {
				border-color: var(--color-hover);
			}
		`;
	}
}
