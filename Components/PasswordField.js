import Icon from "./Icon.js";
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
		this.right = Icon.get({
			value: this.show == "true" ? "visibility_off" : "visibility",
			action: "true",
			slot: "right"
		}, ["font-3"]);
		this.ignoreChange = false;

		super.render();

		let icon = this.querySelector("amr-icon[slot='right']");
		if (icon) {
			icon.onClick = () => this.onClick();
		}
	}
	onClick() {
		this.show = this.show == "true" ? "false" : "true";
		setTimeout(() => {
			let icon = this.querySelector("amr-icon[slot='right']");
			icon.focus();
		}, 100);
	}
	static style() { return "";}
}
