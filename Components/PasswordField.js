import TextField from "./TextField.js";

export default class PasswordField extends TextField {
	static attrs = [...TextField.attrs, "show"];
	static counter = 1;
	connectedCallback() {
		this.id = this.id || `password-field-${PasswordField.counter++}`;
		this.show = this.show || "false";
		super.connectedCallback();
	}
	update() {
		// Dynamics variables
		this.ignoreChange = true;
		this.type = this.show == "true" ? "text" : "password";
		this.iconright = this.show == "true" ? "visibility_off" : "visibility";
		this.ignoreChange = false;

		super.update();
	}
	onClick(event) {
		this.show = this.show == "true" ? "false" : "true";
	}
}
