import TextField from "./TextField.js";

export default class NumberField extends TextField {
	static attrs = [...TextField.attrs, "decimal", "integer", "min", "max"];
	static counter = 1;
	connectedCallback() {
		this.id = this.id || `number-field-${NumberField.counter++}`;
		this.type = "number";
		this.integer = this.integer || "9";
		this.decimal = this.decimal || "2";
		this.min = this.min || "";
		this.max = this.max || "";
		super.connectedCallback();
	}
	render() {
		// Dynamics variables
		this.ignoreChange = true;
		this.pattern =
			this.decimal > 0
				? "^" + (!this.min == "" || this.min < 0 ? "(-?)" : "") + "[0-9]{1," + this.integer + "}((\\.|,)[0-9]{1," + this.decimal + "})?$"
				: "^(-?)[0-9]{1," + this.integer + "}$";
		this.format =
			(this.min & (this.min < 0) ? "-" : "") +
			"".padStart(this.integer, "X") +
			(this.decimal > 0 ? ".".padEnd(parseInt(this.decimal) + 1, "x") : "");
		this.maxlength = ((this.min != null) & (this.min < 0) ? 1 : 0) + this.integer + (this.decimal > 0 ? 1 : 0) + this.decimal;
		this.ignoreChange = false;

		super.render();
	}
	onChange(evt) {
		super.onChange(evt);
		if (!this.errormessage && this.value) {
			if (
				this.min &&
				this.max &&
				(parseFloat(this.value.replace(",", ".")) < parseFloat(this.min.replace(",", ".")) ||
					parseFloat(this.value.replace(",", ".")) > parseFloat(this.max.replace(",", ".")))
			) {
				this.errormessage = `La donnée ${this.label} doit etre comprise entre ${this.min} et ${this.max}`;
			} else if (this.min && parseFloat(this.value.replace(",", ".")) < parseFloat(this.min.replace(",", "."))) {
				this.errormessage = `La donnée ${this.label} doit etre supérieure à ${this.min}`;
			} else if (this.max && parseFloat(value.replace(",", ".")) > parseFloat(this.max.replace(",", "."))) {
				this.errormessage = `La donnée ${this.label} doit etre inférieure à ${this.max}`;
			}
		}
	}
}
