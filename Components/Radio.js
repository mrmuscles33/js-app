import BaseElement from "./BaseElement.js";
import Html from "../Utils/Html.js";
import Events from "../Utils/Events.js";

export default class Radio extends BaseElement {
	static attrs = [...BaseElement.attrs, "label", "checked", "value", "disabled"];
	static counter = 1;
	connectedCallback() {
		this.label = this.label || "";
		this.checked = this.checked || "false";
		this.value = this.value || "";
		this.disabled = this.disabled || "false";
		this.key = this.key || `radio-${Radio.counter++}`;
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
				me.checked = event.target.checked;
				me.onChange(event);
			});
			input.addEventListener("keydown", (event) => {
				// Change radio using arrow keys
				if (Events.isArrow(event)) {
					// Uncheck current radio
					me.checked = "false";

					// Find all radios not disabled
					let radios = Html.search(`amr-radio[name=${me.name}][disabled=false]`);
					let index = radios.findIndex((radio) => radio.key == me.key);
					if (Events.isArrowUp(event) || Events.isArrowLeft(event)) {
						// Previous radio
						index = index == 0 ? radios.length - 1 : index - 1;
					} else {
						// Next radio
						index = index == radios.length - 1 ? 0 : index + 1;
					}
					// Check new radio
					radios[index].checked = "true";
					// Focus new radio
					setTimeout(() => {
						radios[index].focus();
					}, 50);
				}
			});

			// label
			let spanLabel = me.querySelector("label");
			spanLabel.addEventListener("click", (event) => {
				input.focus();
			});
		}
	}
	onChange() {
		let me = this;
		// Find all others radios and uncheck them
		let radios = Html.search(`amr-radio[name=${this.name}]`);
		radios.forEach((radio) => {
			if (radio.key != me.key) {
				radio.checked = "false";
			}
		});
	}
	template() {
		return `
			<span class="radio-main ${this.cls || ""}" >
				<input type="radio" 
					id="${this.key}" 
					${this.checked == "true" ? "checked" : ""} 
					${this.name ? "name='" + this.name + "'" : ""} 
					${this.value ? "value='" + this.value + "'" : ""} 
					${this.disabled == "true" ? "disabled" : ""}
					tabindex=${this.checked == "true" ? "0" : "-1"}
				>
				<label for=${this.key}>
					<span class="material-icons-round" role="presentation">
						${this.checked == "true" ? "radio_button_checked" : "radio_button_unchecked"}
					</span>
					<span>${this.label}</span>
				</label>
			</span>
		`;
	}
	static style() {
		return `
			.radio-main {
				vertical-align: middle;
			}
			.radio-main > input {
			    opacity: 0;
			    width: 0px;
			    height: 0px;
			    padding: 0px;
			    margin: 0px;
			    position: absolute;
			}
			.radio-main > label {
				margin:         10px 5px 10px 0;
				padding:        0;
				cursor:         pointer;
				user-select:    none;
				display:        inline-flex;
				vertical-align: middle;
				white-space:    nowrap;
				color:          var(--dark-shade0);
			}
			.radio-main > input:disabled + label {
				cursor: not-allowed;
				opacity: .5;
			}
			.radio-main > label > span {
				vertical-align: middle;
			}
			.radio-main > label > span.material-icons-round {
				color: var(--primary-shade3);
				margin-right: 5px;
				position: relative;
				font-size: 24px;
			}
			.radio-main > label > span.material-icons-round:after {
				content: " ";
				border-radius: 50%;
				border: 2px solid transparent;
				width: 24px;
				height: 24px;
				display: block;
				position: absolute;
				top: 50%;
				left: 50%;
				transform: translate(-50%, -50%);
			}
			.radio-main > input:checked + label > span.material-icons-round {
				color: var(--primary-shade3);
			}
			.radio-main > input:focus-visible + label > span.material-icons-round,
			.radio-main > label:hover > span.material-icons-round {
				color: var(--primary-shade0);
			}
			.radio-main > input:checked:focus-visible + label > span.material-icons-round,
			.radio-main > input:checked + label:hover > span.material-icons-round {
				color: var(--primary-shade0);
			}
			.radio-main > input:checked:focus-visible + label > span.material-icons-round:after {
				border-color: var(--primary-shade0);
			}
			.radio-main > input:focus-visible + label > span.material-icons-round:after {
				border-color: var(--primary-shade0);
			}
		`;
	}
}
