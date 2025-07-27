import TextField from "./TextField.js";

export default class EmailField extends TextField {
	static attrs = [...TextField.attrs];
	static selector = "amr-email";
	connectedCallback() {
		this.pattern = this.pattern || "^[a-zA-Z0-9_\\.\\-]+@[a-zA-Z0-9_\\.\\-]+\\.[a-zA-Z]{2,4}$";
		this.format = this.format || "exemple@domaine.com";
		super.connectedCallback();
	}
	static style() { return "";}
}
