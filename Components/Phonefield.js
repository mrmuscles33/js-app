import TextField from "./TextField.js";

export default class PhoneField extends TextField {
	static attrs = [...TextField.attrs];
	connectedCallback() {
		this.pattern = this.pattern || "^\\+?(\\d[\\d\\-\\. ]+)?(\\([\\d\\-\\. ]+\\))?\\d[\\d\\-\\. ]+\\d$";
		this.format = this.format || "01.23.45.67.89";
		this.maxlength = this.maxlength || 20
		this.iconleft = this.iconleft || "call";
		super.connectedCallback();
	}
}
