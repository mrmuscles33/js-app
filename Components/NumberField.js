import { TextField } from "./TextField.js";

export class NumberField extends TextField {
	static attrs = TextField.attrs;
	attrs = [...TextField.attrs, "decimal", "integer", "min", "max"];
	connectedCallback() {
		super.connectedCallback();
		this.type = "number";
	}
}
