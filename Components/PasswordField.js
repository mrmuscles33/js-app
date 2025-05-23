import TextField from "./TextField.js";

export default class PasswordField extends TextField {
	static attrs = [...TextField.attrs, "show"];
	static selector = "amr-password";
	connectedCallback() {
		this.show = this.show || "false";
		super.connectedCallback();
	}
	render() {
		// Dynamics variables
		this.ignoreChange = true;
		this.type = this.show == "true" ? "text" : "password";
		this.iconright = this.show == "true" ? "visibility_off" : "visibility";
		this.ignoreChange = false;

		super.render();
	}
	onClick(event) {
		this.show = this.show == "true" ? "false" : "true";
	}
	static style() { return "";}
}
