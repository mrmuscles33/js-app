import TextField from "./TextField.js";

export default class Emailfield extends TextField {
	static attrs = [...TextField.attrs];
	static counter = 1;
	connectedCallback() {
		this.id = this.id || `email-field-${Emailfield.counter++}`;
		this.pattern = this.pattern || "^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$";
		this.format = this.format || "exemple@domaine.com";
		this.maxlength = this.maxlength || 128;
		this.iconleft = this.iconleft || "alternate_email";
		super.connectedCallback();
	}
}
