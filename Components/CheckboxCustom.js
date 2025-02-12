import BaseElement from "./BaseElement.js";

export default class CheckboxCustom extends BaseElement {
	static attrs = [...BaseElement.attrs, "label", "checked", "value", "disabled"];
	static counter = 1;
	connectedCallback() {
		this.label = this.label || "";
		this.checked = this.checked || "false";
		this.value = this.value || "";
		this.disabled = this.disabled || "false";
		this.id = this.id || `checkbox-${CheckboxCustom.counter++}`;
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
		if(me.disabled == "false") {
			me.input.addEventListener("change", (event) => {
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
			<input type="checkbox" 
				id="${this.id}" 
				${this.checked == "true" ? "checked" : ""} 
				${this.name ? "name='" + this.name + "'" : ""} 
				${this.value ? "value='" + this.value + "'" : ""} 
				${this.disabled == "true" ? "disabled" : ""}
			/>
			<label 
				class="checkbox-main ${this.cls || ""}"
				for="${this.id}"
			>
				<span class="material-icons-round" role="presentation">${this.checked == "true" ? "check_box" : "check_box_outline_blank"}</span>
				<span>${this.label}</span>
			</label>
		`;
	}
	style() {
		return `
			${super.style()}
			input {
			    opacity: 0;
			    width: 0px;
			    height: 0px;
			    padding: 0px;
			    margin: 0px;
			    position: absolute;
			}
			.checkbox-main {
				margin:         10px 5px 10px 0;
				padding:        0;
				cursor:         pointer;
				user-select:    none;
				display:        inline-flex;
				vertical-align: middle;
				white-space:    nowrap;
				color:          var(--color-font);
			}
			input:disabled + .checkbox-main {
				cursor: not-allowed;
				opacity: .5;
			}
			.checkbox-main span {
				vertical-align: middle;
			}
			.checkbox-main .material-icons-round {
				color: var(--color-primary);
				margin-right: 5px;
			}
			input:checked + .checkbox-main .material-icons-round {
				color: var(--color-checked);
			}
			input:focus-visible + .checkbox-main .material-icons-round,
			.checkbox-main:hover .material-icons-round {
				color: var(--color-hover);
			}
			input:checked:focus-visible + .checkbox-main .material-icons-round,
			input:checked + .checkbox-main:hover .material-icons-round {
				color: var(--color-checked-hover);
			}
			input:checked:focus-visible + .checkbox-main .material-icons-round {
				box-shadow: inset 0px 0px 0 1px var(--color-checked-hover), 0px 0px 0px 1px var(--color-checked-hover);
				padding-right: 1px;
				border-radius: 3px;
			}
			input:focus-visible + .checkbox-main .material-icons-round {
				box-shadow: inset 0px 0px 0 1px var(--color-hover), 0px 0px 0px 1px var(--color-hover);
				padding-right: 1px;
				border-radius: 3px;
			}
			${this.styles || ""}
		`;
	}
}
