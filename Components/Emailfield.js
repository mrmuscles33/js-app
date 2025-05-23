import TextField from "./TextField.js";

export default class EmailField extends TextField {
	static attrs = [...TextField.attrs];
	static selector = "amr-email";
	connectedCallback() {
		this.pattern = this.pattern || "^[a-zA-Z0-9_\\.\\-]+@[a-zA-Z0-9_\\.\\-]+\\.[a-zA-Z]{2,4}$";
		this.format = this.format || "exemple@domaine.com";
		this.maxlength = this.maxlength || 128;
		this.iconleft = this.iconleft || "alternate_email";
		super.connectedCallback();
	}
	static style() { return "";}
}
